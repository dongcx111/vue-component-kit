<template>
  <article class="vck-timeline" ref="timelineRef">
    <!-- left-->
    <div class="vck-timeline__left">
      <slot name="left" v-if="slots.left"></slot>
      <transition name="slide-left-fade">
        <span v-if="time && isVisible" class="vck-timeline__left__time">{{ time }}</span>
      </transition>
    </div>
    <!-- center-->
    <div class="vck-timeline__center">
      <div class="vck-timeline__center__default">
        <slot name="center" v-if="slots.center"></slot>
        <span class="vck-timeline__center__default__icon" :style="{ borderColor: color }"><></span>
      </div>
      <span
        :class="['vck-timeline__center__line', { 'vck-timeline__center__is-last': isLast }]"
      ></span>
    </div>
    <!-- right-->
    <div class="vck-timeline__right">
      <slot name="right" v-if="slots.right"></slot>
      <div v-else>
        <div class="vck-timeline__right__information">
          <div
            v-if="category"
            class="vck-timeline__right__information__category"
            :style="{ backgroundColor: color }"
          >
            {{ category }}
          </div>
          <!-- <span v-if="time" class="vck-timeline__right__information__time">{{ time }}</span> -->
          <transition name="slide-right-fade">
            <h2 v-if="title && isVisible" class="vck-timeline__right__information__title">
              {{ title }}
            </h2>
          </transition>
        </div>
        <img
          v-if="thumbnail"
          class="vck-timeline__right__thumbnail"
          :data-src="thumbnail"
          alt=""
          ref="imgRef"
        />
        <transition name="slide-up-fade">
          <p
            v-if="description && isVisible"
            class="vck-timeline__right__description"
            v-html="description"
          ></p>
        </transition>
      </div>
    </div>
  </article>
</template>
<script lang="ts" setup>
import type { TimelineProps, TimelineEmits, TimelineSlots } from "./type";
import { useSlots, onMounted, useTemplateRef, shallowRef, Transition } from "vue";
import { useIntersectionObserver } from "@vueuse/core";
import { pkgExists } from "@vue-component-kit/shared";

const COMPONENT_NAME = "VckTimeline";
defineOptions({
  name: COMPONENT_NAME,
});

const {
  time = "",
  category = "",
  title = "",
  thumbnail = "",
  description = "",
  isLast = false,
  color = "blue",
  root = null,
} = defineProps<TimelineProps>();

defineSlots<TimelineSlots>();

const emit = defineEmits<TimelineEmits>();

const slots = useSlots();

const timelineRef = useTemplateRef<HTMLElement>("timelineRef");
const imgRef = useTemplateRef<HTMLImageElement>("imgRef");

const isVisible = shallowRef(false);

const loadThumbnail = () => {
  if (!imgRef || !imgRef.value) return;
  imgRef.value.src = imgRef.value.dataset.src || "";
  imgRef.value.onload = () => {
    imgRef.value?.classList.add("loaded");
  };
  imgRef.value.onerror = () => {
    console.warn(`[${COMPONENT_NAME}]: Image load failed: ${imgRef?.value?.src}`);
  };
};

onMounted(() => {
  if (description && !pkgExists("dompurify")) {
    console.warn(
      `[${COMPONENT_NAME}]: prop.description is bound using the v-html directive and you should use dompurify to sanitize it, run "npm install dompurify" to install it`,
    );
  }

  let stopObserver: (() => void) | undefined;

  const { stop } = useIntersectionObserver(
    timelineRef,
    ([entry]) => {
      isVisible.value = entry?.isIntersecting || false;
      if (isVisible.value) {
        if (thumbnail) {
          loadThumbnail();
        }
        stopObserver?.();
      }
    },
    {
      root,
    },
  );

  stopObserver = stop;
});
</script>

<style lang="scss" scoped>
@use "./style.scss";
</style>
