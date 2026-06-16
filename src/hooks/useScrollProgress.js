import { useEffect, useState } from "react";

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

export function useScrollProgress(sectionRef, { smooth = false, easing = 0.12, viewportHeight } = {}) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frameId = null;
    let currentProgress = 0;
    let targetProgress = 0;

    const updateProgress = () => {
      const section = sectionRef.current;

      if (section) {
        const rect = section.getBoundingClientRect();
        const stableViewportHeight = viewportHeight ?? window.innerHeight;
        const scrollable = Math.max(rect.height - stableViewportHeight, 1);
        targetProgress = clamp(-rect.top / scrollable, 0, 1);
      }

      currentProgress = smooth
        ? lerp(currentProgress, targetProgress, easing)
        : targetProgress;

      if (Math.abs(targetProgress - currentProgress) < 0.0005) {
        currentProgress = targetProgress;
      }

      setProgress(currentProgress);
      frameId = window.requestAnimationFrame(updateProgress);
    };

    frameId = window.requestAnimationFrame(updateProgress);

    return () => {
      if (frameId !== null) window.cancelAnimationFrame(frameId);
    };
  }, [easing, sectionRef, smooth, viewportHeight]);

  return progress;
}

export function progressBetween(progress, start, end) {
  return clamp((progress - start) / (end - start), 0, 1);
}

export function mix(from, to, amount) {
  return from + (to - from) * amount;
}
