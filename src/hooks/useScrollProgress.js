import { useEffect, useRef, useState } from "react";

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function lerp(from, to, amount) {
  return from + (to - from) * amount;
}

function isMobileViewport() {
  return window.matchMedia("(max-width: 700px), (pointer: coarse)").matches;
}

export function useStageMetrics(designWidth = 1440, designHeight = 905) {
  const [metrics, setMetrics] = useState({
    scale: 1,
    viewportHeight: designHeight,
    viewportWidth: designWidth,
  });

  useEffect(() => {
    let lockedMobileHeight = window.innerHeight;
    let previousWidth = window.innerWidth;

    const updateMetrics = () => {
      const nextWidth = window.innerWidth;
      const nextHeight = window.innerHeight;
      const shouldLockHeight = isMobileViewport();
      const widthChanged = Math.abs(nextWidth - previousWidth) > 2;

      if (!shouldLockHeight || widthChanged) {
        lockedMobileHeight = nextHeight;
      }

      previousWidth = nextWidth;
      const viewportHeight = shouldLockHeight ? lockedMobileHeight : nextHeight;

      setMetrics({
        scale: Math.min(nextWidth / designWidth, viewportHeight / designHeight),
        viewportHeight,
        viewportWidth: nextWidth,
      });
    };

    updateMetrics();
    window.addEventListener("resize", updateMetrics);
    return () => window.removeEventListener("resize", updateMetrics);
  }, [designHeight, designWidth]);

  return metrics;
}

export function useWidthScale(designWidth = 1440, maxScale = 1) {
  const [scale, setScale] = useState(maxScale);

  useEffect(() => {
    const updateScale = () => {
      setScale(Math.min(window.innerWidth / designWidth, maxScale));
    };

    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, [designWidth, maxScale]);

  return scale;
}

export function useScrollProgress(sectionRef, { smooth = false, easing = 0.12, viewportHeight, preserveOnResize = false, snapRef } = {}) {
  const [progress, setProgress] = useState(0);
  const previous = useRef({ value: 0, sectionRef, section: sectionRef.current, smooth, easing, viewportHeight, preserveOnResize });

  useEffect(() => {
    let frameId = null;
    // Only the opted-in About scene continues its current animation on resize.
    // Other scenes and non-resize effect restarts retain the original reset.
    const last = previous.current;
    const resizingSameScene = preserveOnResize && last.preserveOnResize === preserveOnResize &&
      last.sectionRef === sectionRef && last.section === sectionRef.current && last.smooth === smooth && last.easing === easing && last.viewportHeight !== viewportHeight;
    let currentProgress = resizingSameScene ? last.value : 0;
    previous.current = { value: currentProgress, sectionRef, section: sectionRef.current, smooth, easing, viewportHeight, preserveOnResize };
    let targetProgress = 0;

    const readTargetProgress = () => {
      const section = sectionRef.current;

      if (section) {
        const rect = section.getBoundingClientRect();
        const stableViewportHeight = viewportHeight ?? window.innerHeight;
        const scrollable = Math.max(rect.height - stableViewportHeight, 1);
        targetProgress = clamp(-rect.top / scrollable, 0, 1);
      }

      return targetProgress;
    };

    // Opt-in keyboard scene navigation can synchronize the animation with a
    // deliberate instant document scroll without changing normal wheel easing.
    const snapToScroll = () => {
      currentProgress = readTargetProgress();
      previous.current.value = currentProgress;
      setProgress(currentProgress);
    };
    if (snapRef) snapRef.current = snapToScroll;

    const updateProgress = () => {
      readTargetProgress();
      currentProgress = smooth
        ? lerp(currentProgress, targetProgress, easing)
        : targetProgress;

      if (Math.abs(targetProgress - currentProgress) < 0.0005) {
        currentProgress = targetProgress;
      }

      previous.current.value = currentProgress;
      setProgress(currentProgress);
      frameId = window.requestAnimationFrame(updateProgress);
    };

    frameId = window.requestAnimationFrame(updateProgress);

    return () => {
      if (frameId !== null) window.cancelAnimationFrame(frameId);
      if (snapRef?.current === snapToScroll) snapRef.current = null;
    };
  }, [easing, preserveOnResize, sectionRef, smooth, viewportHeight, snapRef]);

  return progress;
}

export function progressBetween(progress, start, end) {
  return clamp((progress - start) / (end - start), 0, 1);
}

export function mix(from, to, amount) {
  return from + (to - from) * amount;
}

// Only pointer backgrounds use this terminal tolerance. Scroll progress keeps
// the original mix above. Avoid a near-zero floating-point tail of idle frames.
export function mixPointerPosition(from, to, amount) {
  const next = mix(from, to, amount);
  return Math.abs(to - next) < 0.0001 ? to : next;
}
