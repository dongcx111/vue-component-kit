import { withInstall } from "@vue-component-kit/shared";
import Timeline from "./timeline.vue";
import type { SFCWithInstall } from "@vue-component-kit/shared";

export const VckTimeline: SFCWithInstall<typeof Timeline> = withInstall(Timeline);

export default VckTimeline;

export * from "./type";
