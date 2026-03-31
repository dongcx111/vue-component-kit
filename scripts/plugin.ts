import type {
  EmittedAsset,
  NormalizedOutputOptions,
  OutputAsset,
  OutputBundle,
  Plugin,
  PluginContext,
} from "rolldown";
import { move } from "fs-extra";
import { resolve } from "node:path";

const prefix = "vck";

export enum FormatEnum {
  ESM = "esm",
  ES = "es",
  CJS = "cjs",
}

export interface CssExtractOptions {
  prefix?: string;
}

const defaultOptions: CssExtractOptions = {
  prefix: "vck",
};

export function CssExtract(options: CssExtractOptions = defaultOptions): Plugin {
  function emitCss(
    this: PluginContext,
    outputOptions: NormalizedOutputOptions,
    bundle: OutputBundle,
  ) {
    const format = outputOptions.format;
    Object.entries(bundle).filter(([id, b]) => {
      const outputAsset = b as OutputAsset;
      if (/\.css$/.test(id)) {
        if (format === FormatEnum.ES) {
          // console.log(outputAsset)

          const name = id.split("/").pop();

          const names = name?.split(".");
          const originalName = names?.shift();
          const ext = names?.pop();

          const outName = `${[prefix, originalName].join("-")}.${ext}`;

          outputAsset.fileName = `theme/${outName}`;
        } else if (format == FormatEnum.CJS) {
          outputAsset.fileName = `index.css`;
        }

        const emittedAsset: EmittedAsset = {
          fileName: outputAsset.fileName,
          type: "asset",
          source: outputAsset.source,
        };

        // console.log(emittedAsset)
        this.emitFile(emittedAsset);
      }
    });
  }

  function extractCss(outputOptions: NormalizedOutputOptions, bundle: OutputBundle) {
    const format = outputOptions.format;
    Object.entries(bundle).filter(async ([id, b]) => {
      const outputAsset = b as OutputAsset;
      if (/\.css$/.test(id)) {
        if (format === FormatEnum.ES) {
          // console.log(outputAsset)

          const name = id.split("/").pop();

          const names = name?.split(".");
          const originalName = names?.shift();
          const ext = names?.pop();

          const outName = `${[prefix, originalName].join("-")}.${ext}`;

          const fileName = `theme/${outName}`;

          await move(
            resolve(outputOptions?.dir || "", outputAsset.fileName),
            resolve(outputOptions?.dir || "", "theme", fileName),
            { overwrite: true },
          );
        }
      }
    });
  }

  return {
    name: "rolldown-plugin-extract-css",

    writeBundle(outputOptions: NormalizedOutputOptions, bundle: OutputBundle) {
      emitCss.call(this, outputOptions, bundle);
      extractCss(outputOptions, bundle);
    },
  };
}
