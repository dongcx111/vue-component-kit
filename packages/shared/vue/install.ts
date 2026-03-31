import type { App, Plugin } from "vue";
import type { SFCWithInstall } from "./types";

export function withInstall<T extends Record<string, any>>(component: T): SFCWithInstall<T> {
  (component as SFCWithInstall<T>).install = (app: App): void => {
    app.component(component.name, component as SFCWithInstall<T>);
  };
  return component as SFCWithInstall<T>;
}

export function makeInstaller(components: Plugin[]): Plugin {
  const install = (app: App): void => {
    components.forEach((component) => {
      app.use(component);
    });
  };

  return {
    install,
  };
}
