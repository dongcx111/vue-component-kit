import { makeInstaller } from "@vue-component-kit/shared";
import component from "./component";

export * from "@vue-component-kit/components";

const installer = makeInstaller(component);

export default installer;
