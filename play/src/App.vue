<script setup lang="ts">
import { AnimationTypeEnum, VckTimeline, useThemeChange } from "@vue-component-kit/components";
import { nextTick, useTemplateRef, watchEffect } from "vue";
// import { VckTimeline } from "../../dist/vue-component-kit";
import "../../dist/vue-component-kit/theme/vck-timeline.css";
import "../../dist/vue-component-kit/theme/index.css";
import thumbnail from "./assets/macross.jpg";
import { useDark, useMouse, useToggle } from "@vueuse/core";
import DOMPurify from "dompurify";

let description = `
<p class="gb-vue-timeline-update__description">Yesterday we just celebrated the 5th Vueniversary — today we are excited to announce the release of Vue 2.6 “Macross”!<br><br>In the past year, we spent a lot of time working on the new CLI and prototyping for 3.0. As a result, Vue core 2.x hasn’t received major updates in quite a while. It’s about time! This release combines a number of substantial improvements, internal changes and new features which are highlighted in this post. For full details, make sure to also check out the full release note on GitHub.<br><br>More about the release: <a href="https://github.com/vuejs/vue/releases/tag/v2.6.0" target="_blank">Macross</a>.</p>
`;
description = DOMPurify.sanitize(description);

const timelineRef = useTemplateRef<HTMLElement>("timelineRef");

const { isDark, toggleDark } = useThemeChange();
console.log(isDark.value);
</script>

<template>
  <button
    @click="toggleDark()"
    style="width: 100px; height: 50px; position: absolute; top: 0; right: 0"
  >
    切换主题
  </button>
  <div ref="timelineRef">
    <vck-timeline
      time="3 years ago"
      category="ANNOUNCEMENT"
      title="v2.6.0 - Macross"
      description="1213123"
      :thumbnail="thumbnail"
      color="red"
    ></vck-timeline>
    <vck-timeline
      time="3 years ago"
      category="ANNOUNCEMENT"
      title="v2.6.0 - Macross"
      :description="description"
      :thumbnail="thumbnail"
      color="red"
    ></vck-timeline>
    <vck-timeline
      time="3 years ago"
      category="ANNOUNCEMENT"
      title="v2.6.0 - Macross"
      :description="description"
      :thumbnail="thumbnail"
      color="red"
    ></vck-timeline>
    <vck-timeline
      time="3 years ago"
      category="ANNOUNCEMENT"
      title="v2.6.0 - Macross"
      :description="description"
      :thumbnail="thumbnail"
      color="red"
    ></vck-timeline>
    <vck-timeline
      time="3 years ago"
      category="ANNOUNCEMENT"
      title="v2.6.0 - Macross"
      :description="description"
      :thumbnail="thumbnail"
      color="red"
    ></vck-timeline>
    <vck-timeline
      time="3 years ago"
      category="ANNOUNCEMENT"
      title="v2.6.0 - Macross"
      :description="description"
      :thumbnail="thumbnail"
      color="red"
    ></vck-timeline>
    <vck-timeline
      time="3 years ago"
      category="ANNOUNCEMENT"
      title="v2.6.0 - Macross"
      :description="description"
      :thumbnail="thumbnail"
      is-last
    ></vck-timeline>
  </div>
</template>

<style lang="scss">
body {
  background-color: var(--color-background-tertiary);
  margin: auto;
  height: 100%;
}
</style>
