import { basename, join, resolve } from "node:path";
import { getPkgJsonInfo, outDir, root, type ModuleFormat } from "./utils";
import {
  build,
  type BuildContext,
  type InlineConfig,
  type ResolvedConfig,
  type RolldownChunk,
  type TsdownBundle,
} from "tsdown";
import Vue from "unplugin-vue/rolldown";
import { FormatEnum } from "./plugin";
import { exists, move, remove } from "fs-extra";
import { writeFile, mkdir, copyFile } from "node:fs/promises";
import { browserslistToTargets, transform } from "lightningcss";
import { glob } from "tinyglobby";
import { compileAsync } from "sass-embedded";

const pkgPath = resolve(root, "packages/vue-component-kit");

const entry = resolve(root, pkgPath, "index.ts");

const pkgJsonFilePath = resolve(pkgPath, "package.json");

const { name = "", browserslist = [] } = getPkgJsonInfo(pkgJsonFilePath);

if (!name) {
  throw new Error(`${pkgJsonFilePath} missing property name`);
}

// output dir dist/vue-component-kit
const out = resolve(outDir, name);

function makeOutDirPath(dir: string) {
  return resolve(out, dir);
}

const esOutDir = makeOutDirPath("es");

const cjsOutDir = makeOutDirPath("lib");

const themeDir = resolve(out, "theme");

const tsconfig = resolve(import.meta.dirname, "..", "tsconfig.web.json");

// clean dist and move base style before build
async function cleanDistAndMoveBaseStyle() {
  //clean
  if (!exists(out)) {
    await mkdir(out, { recursive: true });
  }

  if (await exists(esOutDir)) {
    await remove(esOutDir);
  }

  if (await exists(cjsOutDir)) {
    await remove(cjsOutDir);
  }

  if (!(await exists(themeDir))) {
    await mkdir(themeDir, { recursive: true });
  }

  // transform and compress base style to theme dir
  const scssFiles = await glob("**/*.scss", {
    cwd: resolve(root, "packages", "components", "base", "style"),
    absolute: true,
    onlyFiles: true,
  });

  if (scssFiles.length === 0) return;

  // compress css
  async function compress(filename: string, css: string) {
    const result = transform({
      filename,
      code: Buffer.from(css),
      minify: true,
      sourceMap: false,
      targets: browserslistToTargets(browserslist),
    });
    return result.code;
  }

  for (const scssFile of scssFiles) {
    const baseName = basename(scssFile, ".scss");

    if (baseName !== "index") continue;

    const cssResult = await compileAsync(scssFile);
    const compressed = await compress(baseName, cssResult.css);

    const outputName = `${baseName}.css`;

    const outputPath = join(resolve(out, "theme"), outputName);
    await writeFile(outputPath, compressed);
  }
}

// extract css after build
async function moveAndDeleteCssBuildDone(
  bundle: BuildContext & {
    chunks: RolldownChunk[];
  },
) {
  const format = bundle.options.format;

  if (format === FormatEnum.ES) {
    const cssFiles = await glob("**/*.css", {
      cwd: esOutDir,
      absolute: true,
      onlyFiles: true,
    });

    if (cssFiles.length === 0) return;

    const prefix = "vck";

    cssFiles.forEach(async (file) => {
      const name = file.split("/").pop();

      const names = name?.split(".");
      const moduleName = names?.shift();
      const ext = names?.pop();

      const outName = `${[prefix, moduleName].join("-")}.${ext}`;

      await move(file, resolve(themeDir, outName), { overwrite: true });
    });
  } else if (format === FormatEnum.CJS) {
    const cssFiles = await glob("**/*.css", {
      cwd: cjsOutDir,
      absolute: true,
      onlyFiles: true,
    });

    if (cssFiles.length === 0) return;

    const outName = "style.css";

    await remove(resolve(cjsOutDir, outName));
  }
}

const args = process.argv.slice(2);

const isWatch = args.includes("--watch");

const baseOptions: InlineConfig = {
  clean: false,
  watch: isWatch,
  entry,
  platform: "neutral",
  plugins: [Vue({ isProduction: true })],
  minify: true,
  unbundle: true,
  deps: {
    neverBundle: ["@vueuse/core"],
  },
  outputOptions(outputOptions, format) {
    if (format === FormatEnum.CJS) {
      outputOptions.exports = "named";
    }

    return outputOptions;
  },
  hooks: {
    "build:prepare": async (bundle) => {
      if (bundle.options.format === FormatEnum.ES) {
        await cleanDistAndMoveBaseStyle();
      }
    },
    "build:done": async (bundle) => {
      await moveAndDeleteCssBuildDone(bundle);
      await copyFile(pkgJsonFilePath, join(out, "package.json"));

      const readmeFilePath = resolve(pkgPath, "README.md");
      await copyFile(readmeFilePath, join(out, "README.md"));
    },
  },
};

const baseCssConfig = {
  minify: true,
  lightningcss: {
    targets: browserslistToTargets(browserslist),
  },
};

export const formatConfig: Partial<Record<ModuleFormat, Partial<ResolvedConfig>>> = {
  [FormatEnum.ESM]: {
    outDir: esOutDir,
    dts: {
      vue: true,
      tsconfig,
    },
    css: {
      splitting: true,
      ...baseCssConfig,
    },
  },
  [FormatEnum.CJS]: {
    outDir: cjsOutDir,
    dts: false,
    css: {
      splitting: false,
      ...baseCssConfig,
    },
  },
};

async function buildBundler(): Promise<TsdownBundle[]> {
  const bundle = await build({
    ...baseOptions,
    format: formatConfig,
  });

  return bundle;
}

buildBundler();
