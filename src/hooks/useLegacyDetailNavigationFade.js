import { useLayoutEffect, useRef } from "react";
import "../styles/legacy-detail-navigation-fade.css";

const targetSelectors = {
  koko: [
    ".koko-main-visual", ".koko-main-copy > p", ".koko-main-copy > h1",
    ".koko-project-intro > p", ".koko-metadata dt", ".koko-metadata dd",
    ".koko-work-page-frame",
  ].join(","),
  flower: [
    ".flower-hero-logo", ".flower-main-copy > p", ".flower-main-copy > h1",
    ".flower-metadata dt", ".flower-metadata dd", ".flower-project-intro > p",
    ".flower-horizontal-exhibition-copy > h2", ".flower-horizontal-exhibition-copy > p",
    ".flower-video", ".flower-reading-copy > h2", ".flower-reading-copy > p",
    ".flower-feeling-images", ".flower-feeling-group > figcaption",
    ".flower-weather-cluster > img",
  ].join(","),
};

// Mask only existing foreground paint layers, never the stage or its backdrop.
// Their original blend/filter/opacity remain untouched.
export default function useLegacyDetailNavigationFade(variant) {
  const pageRef = useRef(null);
  const scheduleRef = useRef(() => {});

  useLayoutEffect(() => {
    const page = pageRef.current;
    if (!page) return;
    const allLayers = [...page.querySelectorAll(targetSelectors[variant])];
    let layers = allLayers;
    const fixedBackgrounds = variant === "koko"
      ? [...page.querySelectorAll(".koko-fixed-background > .koko-image-crop > img")]
      : [];
    const canUseFixedFade = fixedBackgrounds.length === 2
      && (window.CSS?.supports("mask-image", "linear-gradient(black, transparent)")
        || window.CSS?.supports("-webkit-mask-image", "linear-gradient(black, transparent)"));
    const previous = new WeakMap();
    let frame = 0;
    let active = true;
    let motionUntil = 0;

    // A fixed copy of the existing backdrop supplies the same band without
    // moving a raster image's mask with asynchronous viewport scrolling.
    // Until both background images load, retain the original leaf-mask fallback.
    const enableFixedFade = () => {
      if (!active || !canUseFixedFade
        || !fixedBackgrounds.every((image) => image.complete && image.naturalWidth > 0)) return;
      page.classList.add("koko-fixed-navigation-fade");
      layers.forEach((layer) => {
        layer.classList.remove("legacy-detail-fade-layer");
        layer.style.removeProperty("--legacy-fade-clear");
        layer.style.removeProperty("--legacy-fade-full");
      });
      layers = [];
      window.cancelAnimationFrame(frame);
      frame = 0;
    };

    const update = () => {
      frame = 0;
      if (!active) return;
      const narrow = window.matchMedia("(max-width: 700px)").matches;
      const clearY = narrow ? 72 : 64;
      const fullY = narrow ? 112 : 92;
      // All selected targets are unrotated, including the feeling-image wrapper.
      // Convert viewport pixels back into the transformed design's local pixels.
      const measurements = layers.map((layer) => {
        const bounds = layer.getBoundingClientRect();
        const height = parseFloat(window.getComputedStyle(layer).height);
        const scaleY = bounds.height > 0 && height > 0 ? bounds.height / height : 1;
        return {
          clear: `${(clearY - bounds.top) / scaleY}px`,
          full: `${(fullY - bounds.top) / scaleY}px`,
        };
      });
      layers.forEach((layer, index) => {
        const { clear, full } = measurements[index];
        const signature = `${clear}|${full}`;
        if (previous.get(layer) === signature) return;
        layer.style.setProperty("--legacy-fade-clear", clear);
        layer.style.setProperty("--legacy-fade-full", full);
        layer.classList.add("legacy-detail-fade-layer");
        previous.set(layer, signature);
      });
      if (performance.now() < motionUntil) frame = window.requestAnimationFrame(update);
    };
    const schedule = () => {
      if (!active || !layers.length) return;
      motionUntil = performance.now() + 350;
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    const revealFocus = (event) => {
      const target = event.target;
      if (!target.matches("a, button, iframe, [tabindex]") || !target.matches(":focus-visible")) return;
      if (target.closest(`.${variant}-chrome`)) return;
      const fullY = window.matchMedia("(max-width: 700px)").matches ? 112 : 92;
      const bounds = target.getBoundingClientRect();
      if (bounds.top < fullY) window.scrollBy({ top: bounds.top - fullY - 12, behavior: "instant" });
      schedule();
    };

    // The KOKO backdrop overlay preserves its paint, but cannot itself clip
    // hit testing. Do not activate an image through its fully hidden top band.
    const blockHiddenImageClick = (event) => {
      if (event.detail === 0 || !page.classList.contains("koko-fixed-navigation-fade")) return;
      const clearY = window.matchMedia("(max-width: 700px)").matches ? 72 : 64;
      if (event.clientY < clearY && event.target.closest(".project-image-trigger")) {
        event.preventDefault();
        event.stopPropagation();
      }
    };

    scheduleRef.current = schedule;
    fixedBackgrounds.forEach((image) => image.addEventListener("load", enableFixedFade));
    enableFixedFade();
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    page.addEventListener("focusin", revealFocus);
    page.addEventListener("click", blockHiddenImageClick, true);
    const observer = new ResizeObserver(schedule);
    layers.forEach((layer) => observer.observe(layer));
    observer.observe(page);
    document.fonts.ready.then(schedule);
    return () => {
      active = false;
      scheduleRef.current = () => {};
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      page.removeEventListener("focusin", revealFocus);
      page.removeEventListener("click", blockHiddenImageClick, true);
      fixedBackgrounds.forEach((image) => image.removeEventListener("load", enableFixedFade));
      page.classList.remove("koko-fixed-navigation-fade");
      observer.disconnect();
    };
  }, [variant]);

  useLayoutEffect(() => { scheduleRef.current(); });
  return pageRef;
}
