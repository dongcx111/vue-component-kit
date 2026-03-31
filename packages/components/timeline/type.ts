import type { MaybeComputedElementRef, MaybeElement } from "@vueuse/core";

export type IconColor =
  | "black"
  | "blue"
  | "green"
  | "orange"
  | "purple"
  | "red"
  | "turquoise"
  | "white";
export interface TimelineProps {
  /**
   * 时间，默认值为空字符串
   */
  time?: string;
  /**
   * 目录，默认值为空字符串
   */
  category?: string;
  /**
   * 标题，默认值为空字符串
   */
  title?: string;
  /**
   * 图片地址，默认值为空字符串
   */
  thumbnail?: string;
  /**
   * 描述，默认值为空字符串
   */
  description?: string;
  /**
   * 是否为最后一个时间线，默认值为 false
   */
  isLast?: boolean;
  /**
   * 中心图标颜色，默认值为 "blue"
   */
  color?: IconColor;
  /**
   * 视口元素，默认值为 document
   */
  root?: Document | MaybeComputedElementRef<MaybeElement>;
}

export interface TimelineEmits {}

export interface TimelineSlots {
  left(): any;
  center(): any;
  right(): any;
}
