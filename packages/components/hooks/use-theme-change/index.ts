import { useDark, useMouse, useToggle, type UseDarkReturn } from "@vueuse/core";
import { nextTick, shallowReadonly } from "vue";

const viewTransitionStyle = `   ::view-transition-old(root),
                                ::view-transition-new(root) {
                                        animation: none;
                                        mix-blend-mode: normal;
                                }
                                ::view-transition-old(root) {
                                        z-index: 1;
                                }
                                ::view-transition-new(root) {
                                        z-index: 2147483646;
                                }
                                .dark::view-transition-old(root) {
                                        z-index: 2147483646;
                                }
                                .dark::view-transition-new(root) {
                                        z-index: 1;
                                }
`;

export type AnimationType = "fade" | "slide";

export enum AnimationTypeEnum {
  FADE = "fade",
  SLIDE = "slide",
}

export interface UseThemeChangeOptions {
  /**
   * whether to enable animation
   *
   * @default 'true'
   */
  animation?: boolean;
  /**
   * animation type
   *
   * @default 'slide'
   */
  animationType?: AnimationType;
}

export type UseThemeChangeReturn = {
  isDark: Readonly<UseDarkReturn>;
  toggleDark: () => void;
};

export const useThemeChange = (options: UseThemeChangeOptions = {}): UseThemeChangeReturn => {
  const { animation = true, animationType = AnimationTypeEnum.SLIDE } = options;

  const { x: clientX, y: clientY } = useMouse({ touch: false, type: "client" });

  let stylesheet: HTMLStyleElement | null = null;

  const sheetId = "view-transition";

  const isDark = useDark({
    valueLight: "light",
    onChanged(dark, handler, mode) {
      if (!document.startViewTransition || !animation) {
        stylesheet = document.querySelector(`[data-id="${sheetId}"]`);
        if (stylesheet) {
          document.head.removeChild(stylesheet);
          stylesheet = null;
        }

        handler(mode);
        return;
      }

      if (!stylesheet && animation) {
        stylesheet = document.createElement("style");
        stylesheet.textContent = viewTransitionStyle;
        stylesheet.dataset.id = sheetId;
        document.head.appendChild(stylesheet);
      }

      const transition = document.startViewTransition(async () => {
        handler(mode);
        await nextTick();
      });

      if (animationType === AnimationTypeEnum.FADE) return;

      const radius = Math.hypot(
        Math.max(clientX.value, innerWidth - clientX.value),
        Math.max(clientY.value, innerHeight - clientY.value),
      );

      const ratioX = (100 * clientX.value) / innerWidth;
      const ratioY = (100 * clientY.value) / innerHeight;
      const referR = Math.hypot(innerWidth, innerHeight) / Math.SQRT2;
      const ratioR = (100 * radius) / referR;

      const clipPath = [
        `circle(0% at ${ratioX}% ${ratioY}%)`,
        `circle(${ratioR}% at ${ratioX}% ${ratioY}%)`,
      ];

      transition.ready.then(() => {
        document.documentElement.animate(
          {
            clipPath: mode === "dark" ? [...clipPath].reverse() : clipPath,
          },
          {
            duration: 500,
            easing: "ease-in",
            fill: "both",
            pseudoElement:
              mode === "dark" ? "::view-transition-old(root)" : "::view-transition-new(root)",
          },
        );
      });
    },
  });

  const toggleDark = useToggle(isDark);

  return {
    isDark: shallowReadonly(isDark),
    toggleDark,
  };
};
