import { defineConfig } from "cz-git";
import { execSync } from "child_process";
import { globSync } from "tinyglobby";

const getPackages = (packagePath) =>
  globSync("*", { cwd: packagePath, onlyDirectories: true }).map((dir) => dir.replace(/\/$/, ""));

const scopes = [...getPackages("packages"), "docs", "play"];

const gitStatus = execSync("git status --porcelain || true").toString().trim().split("\n");

const scopeComplete = gitStatus
  .find((r) => ~r.indexOf("M  packages"))
  ?.replace(/\//g, "%%")
  ?.match(/packages%%((\w|-)*)/)?.[1];

const subjectComplete = gitStatus
  .find((r) => ~r.indexOf("M  packages/components"))
  ?.replace(/\//g, "%%")
  ?.match(/packages%%components%%((\w|-)*)/)?.[1];

export default defineConfig({
  extends: "@commitlint/config-conventional",
  rules: {
    /**
     * type[scope]: [function] description
     *      ^^^^^
     */
    "scope-enum": [2, "always", scopes],
    /**
     * type[scope]: [function] description
     *
     * ^^^^^^^^^^^^^^ empty line.
     * - Something here
     */
    "body-leading-blank": [1, "always"],
    /**
     * type[scope]: [function] description
     *
     * - something here
     *
     * ^^^^^^^^^^^^^^
     */
    "footer-leading-blank": [1, "always"],
    /**
     * type[scope]: [function] description [No more than 72 characters]
     *      ^^^^^
     */
    "header-max-length": [2, "always", 72],
    "scope-case": [2, "always", "lower-case"],
    "subject-case": [1, "never", ["sentence-case", "start-case", "pascal-case", "upper-case"]],
    "subject-empty": [2, "never"],
    "subject-full-stop": [2, "never", "."],
    "type-case": [2, "always", "lower-case"],
    "type-empty": [2, "never"],
    "type-enum": [
      2,
      "always",
      [
        "feat",
        "fix",
        "docs",
        "style",
        "refactor",
        "perf",
        "build",
        "test",
        "chore",
        "ci",
        "revert",
      ],
    ],
  },
  prompt: {
    alias: { fd: "docs: fix typos" },
    messages: {
      type: "Select the type of change that you're committing:",
      scope: "Denote the SCOPE of this change (optional):",
      customScope: "Denote the SCOPE of this change:",
      subject: "Write a SHORT, IMPERATIVE tense description of the change:\n",
      body: 'Provide a LONGER description of the change (optional). Use "|" to break new line:\n',
      breaking: 'List any BREAKING CHANGES (optional). Use "|" to break new line:\n',
      footerPrefixesSelect: "Select the ISSUES type of changeList by this change (optional):",
      customFooterPrefix: "Input ISSUES prefix:",
      footer: "List any ISSUES by this change. E.g.: #31, #34:\n",
      generatingByAI: "Generating your AI commit subject...",
      generatedSelectByAI: "Select suitable subject by AI generated:",
      confirmCommit: "Are you sure you want to proceed with the commit above?",
    },
    types: [
      { value: "feat", name: "feat:     ✨  A new feature", emoji: ":sparkles:" },
      { value: "fix", name: "fix:      🐛  A bug fix", emoji: ":bug:" },
      { value: "docs", name: "docs:     📝  Documentation only changes", emoji: ":memo:" },
      {
        value: "style",
        name: "style:    🎨  Changes that do not affect the meaning of the code",
        emoji: ":lipstick:",
      },
      {
        value: "refactor",
        name: "refactor: ♻️   A code change that neither fixes a bug nor adds a feature",
        emoji: ":recycle:",
      },
      {
        value: "perf",
        name: "perf:     ⚡️  A code change that improves performance",
        emoji: ":zap:",
      },
      {
        value: "test",
        name: "test:     ✅  Adding missing tests or correcting existing tests",
        emoji: ":white_check_mark:",
      },
      {
        value: "build",
        name: "build:    📦️   Changes that affect the build system or external dependencies",
        emoji: ":package:",
      },
      {
        value: "ci",
        name: "ci:       🤖  Changes to our CI configuration files and scripts",
        emoji: ":ferris_wheel:",
      },
      {
        value: "chore",
        name: "chore:    🏡  Other changes that don't modify src or test files",
        emoji: ":hammer:",
      },
      { value: "revert", name: "revert:   ⏪️  Reverts a previous commit", emoji: ":rewind:" },
    ],
    useEmoji: true,
    emojiAlign: "center",
    useAI: false,
    aiNumber: 1,
    themeColorCode: "",
    scopes: scopeComplete,
    allowCustomScopes: true,
    allowEmptyScopes: false,
    customScopesAlias: "__default__",
    emptyScopesAlias: "empty",
    upperCaseSubject: null,
    markBreakingChangeMode: true,
    allowBreakingChanges: ["feat", "fix"],
    breaklineNumber: 100,
    breaklineChar: "|",
    skipQuestions: [],
    issuePrefixes: [{ value: "closed", name: "closed:   ISSUES has been processed" }],
    customIssuePrefixAlign: "top",
    emptyIssuePrefixAlias: "skip",
    customIssuePrefixAlias: "custom",
    allowCustomIssuePrefix: false,
    allowEmptyIssuePrefix: false,
    confirmColorize: true,
    scopeOverrides: undefined,
    defaultBody: "",
    defaultIssues: "",
    defaultScope: scopeComplete,
    customScopesAlign: !scopeComplete ? "top" : "bottom",
    defaultSubject: subjectComplete && `[${subjectComplete}] `,
  },
});
