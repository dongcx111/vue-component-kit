import { run } from "./utils";
import { resolve } from "node:path";
import { getPkgJsonInfo } from "./utils";
import { existsSync } from "node:fs";

async function collectCommand(): Promise<string[]> {
  try {
    const pkgPath = resolve(import.meta.dirname, "..", "package.json");

    const { scripts = {} } = getPkgJsonInfo(pkgPath);

    const commands = Object.entries(scripts)
      .filter(([key, _]) => {
        const [command, pkgName] = key.split(":");
        return command === "build" && pkgName;
      })
      .map(([_, value]) => {
        return value as string;
      });
    return commands;
  } catch (error) {
    throw new Error(`[collectCommand] ${error}`);
  }
}

function createTask(command: string): Promise<void> {
  return run(command);
}

function createTasks(commands: string[]): Promise<void>[] | null {
  if (commands.length) {
    return commands.map((command) => {
      return createTask(command);
    });
  }

  return null;
}

async function build(tasks: Promise<void>[]): Promise<void[]> {
  return await Promise.all(tasks);
}

async function exec() {
  const commands = await collectCommand();

  const tasks = createTasks(commands);

  if (tasks == null) return;

  const start = performance.now();

  await build(tasks);

  const count = performance.now() - start;

  console.log(`✔ Build complete in total ${Math.floor(count)}ms`);
}

exec();
