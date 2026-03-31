import { build } from "tsdown";
import type { InlineConfig, ResolvedConfig, TsdownBundle } from "tsdown";
import { resolve, join } from "node:path";
import { root, outDir, getPkgJsonInfo, type ModuleFormat } from "./utils";
import { copyFile } from "node:fs/promises";
import { FormatEnum } from "./plugin";

const pkgPath = resolve(root, "packages/shared");

const entry = resolve(root, pkgPath, "index.ts");

const pkgJsonFilePath = resolve(pkgPath, "package.json");

const pkgJsonInfo = getPkgJsonInfo(pkgJsonFilePath);

const pkgName = pkgJsonInfo ? pkgJsonInfo.name : "";

if (!pkgName) {
  throw new Error(`${pkgJsonFilePath} missing property name`);
}

const out = resolve(outDir, pkgName);

const baseOptions: InlineConfig = {
  entry: entry,
  minify: true,
  outDir: out,
  unbundle: true,
  platform: "neutral",
  hooks: {
    "build:done": async (bundle) => {
      if (bundle.options.format === FormatEnum.ES) {
        copyFile(pkgJsonFilePath, join(out, "package.json"));
        copyFile(resolve(pkgPath, "README.md"), join(out, "README.md"));
      }
    },
  },
};

export const formatConfig: Partial<Record<ModuleFormat, Partial<ResolvedConfig>>> = {
  esm: {
    dts: {
      compilerOptions: {
        isolatedDeclarations: true,
        declaration: true,
      },
    },
  },
  cjs: {
    dts: false,
  },
};

async function buildBundler(): Promise<TsdownBundle[]> {
  return await build({
    ...baseOptions,
    format: formatConfig,
  });
}

buildBundler();
