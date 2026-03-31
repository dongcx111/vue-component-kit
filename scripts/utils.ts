import { spawn } from "node:child_process";
import { resolve } from "node:path";
import type { PackageJsonWithPath } from "tsdown";
import { createRequire } from "node:module";

export const root = resolve(import.meta.dirname, "..");

export const outDir = resolve(import.meta.dirname, "..", "dist");

export const modules = ["esm", "cjs"] as const;
export type ModuleFormat = (typeof modules)[number];

export async function run(command: string): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const [cmd, ...args] = command.split(" ");
    const app = spawn(cmd, args, {
      cwd: root,
      stdio: "inherit",
      //   shell: process.platform === "win32",
    });

    const onProcessExit = () => app.kill("SIGHUP");

    app.on("close", (code) => {
      process.removeListener("exit", onProcessExit);

      if (code === 0) resolve();
      else reject(new Error(`Command failed. \n Command: ${command} \n Code: ${code}`));
    });
    process.on("exit", onProcessExit);
  });
}

export const getPkgJsonInfo = (pkgPath: string) => {
  const require = createRequire(import.meta.url);
  return require(pkgPath) as PackageJsonWithPath;
};
