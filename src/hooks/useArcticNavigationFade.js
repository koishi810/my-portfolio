import { useLayoutEffect, useRef } from "react";

// Match the existing home/directory navigation fade on ARCTIC foreground only.
// Preserve each current blend layer; never mask the scene, chrome or background.
const fadeTargets = [
  ".arctic-main-visual",
  ".arctic-main-copy p",
  ".arctic-main-copy h1",
  ".arctic-metadata dt",
  ".arctic-metadata dd",
  ".arctic-project-intro",
  ".arctic-album-intro h2",
  ".arctic-album-intro p",
  ".arctic-image",
  ".arctic-back-link",
].join(",");

export default function useArcticNavigationFade() {
  const pageRef = useRef(null);
  const scheduleRef = useRef(() => {});

  useLayoutEffect(() => {
    const page = pageRef.current;
    if (!page) return;
    const layers = [...page.querySelectorAll(fadeTargets)];
    const previous = new WeakMap();
    let frame = 0;
    let resizeFocusFrame = 0;
    let visibleFocusTarget = null;
    let settledWidth = window.innerWidth;
    let settledHeight = window.innerHeight;
    let active = true;
    let motionUntil = 0;

    const update = () => {
      frame = 0;
      if (!active) return;
      rememberVisibleFocus();
      const mobile = window.matchMedia("(max-width: 700px)").matches;
      const clearY = mobile ? 72 : 64;
      const fullY = mobile ? 112 : 92;
      // The desktop design stage is scaled. Convert viewport
      // distances back into each layer's CSS pixels; do not change stage transforms.
      const measurements = layers.map((layer) => {
        const bounds = layer.getBoundingClientRect();
        const layoutHeight = parseFloat(window.getComputedStyle(layer).height);
        const scaleY = bounds.height > 0 && layoutHeight > 0 ? bounds.height / layoutHeight : 1;
        return {
          clear: `${(clearY - bounds.top) / scaleY}px`,
          full: `${(fullY - bounds.top) / scaleY}px`,
        };
      });
      layers.forEach((layer, index) => {
        const { clear, full } = measurements[index];
        const signature = `${clear}|${full}`;
        if (previous.get(layer) === signature) return;
        layer.style.setProperty("--arctic-fade-clear", clear);
        layer.style.setProperty("--arctic-fade-full", full);
        layer.classList.add("arctic-navigation-fade-layer");
        previous.set(layer, signature);
      });
      // Follow the eased horizontal stage while it settles, then stop while idle.
      if (performance.now() < motionUntil) frame = window.requestAnimationFrame(update);
    };
    const schedule = () => {
      if (!active) return;
      motionUntil = performance.now() + 350;
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    const revealFocus = (event) => {
      const target = event.target;
      if (!target.matches("a, button, [tabindex]") || !target.matches(":focus-visible")) return;
      if (target.closest(".arctic-chrome")) return;
      const fullY = window.matchMedia("(max-width: 700px)").matches ? 112 : 92;
      const bounds = target.getBoundingClientRect();
      if (bounds.top < fullY) window.scrollBy({ top: bounds.top - fullY - 12, behavior: "instant" });
      schedule();
    };

    const keyboardFocus = () => {
      const target = document.activeElement;
      if (!target || !page.contains(target) || !target.matches("a, button, [tabindex]")) return null;
      return target.matches(":focus-visible") && !target.closest(".arctic-chrome") ? target : null;
    };
    const rememberVisibleFocus = () => {
      // Resize events already see the new layout. Keep the last settled viewport
      // snapshot so reflow/clamping cannot impersonate a user leaving the target.
      if (resizeFocusFrame || window.innerWidth !== settledWidth || window.innerHeight !== settledHeight) return;
      const target = keyboardFocus();
      const bounds = target?.getBoundingClientRect();
      const fullY = window.matchMedia("(max-width: 700px)").matches ? 112 : 92;
      visibleFocusTarget = bounds && bounds.height > 0 && bounds.width > 0
        && bounds.top >= fullY && bounds.bottom <= settledHeight ? target : null;
    };
    const handleScroll = () => {
      rememberVisibleFocus();
      schedule();
    };
    const handleFocusIn = (event) => {
      revealFocus(event);
      rememberVisibleFocus();
    };
    const cancelPendingRecovery = () => {
      // New input wins, including a gesture just before resize. A later stable
      // fade/scroll update can remember the focus again if it is still visible.
      visibleFocusTarget = null;
      schedule();
    };
    const handleResize = () => {
      schedule();
      window.cancelAnimationFrame(resizeFocusFrame);
      const target = visibleFocusTarget;
      // Let responsive measurements settle; this is a bounded check, not a loop.
      resizeFocusFrame = window.requestAnimationFrame(() => {
        resizeFocusFrame = window.requestAnimationFrame(() => {
          resizeFocusFrame = 0;
          if (!active) return;
          if (target && visibleFocusTarget === target && keyboardFocus() === target) {
            const bounds = target.getBoundingClientRect();
            const fullY = window.matchMedia("(max-width: 700px)").matches ? 112 : 92;
            const delta = bounds.top < fullY
              ? bounds.top - fullY - 12
              : bounds.bottom > window.innerHeight ? bounds.bottom - window.innerHeight + 12 : 0;
            if (bounds.height > 0 && bounds.width > 0 && delta) {
              window.scrollBy({ top: delta, behavior: "instant" });
              schedule();
            }
          }
          settledWidth = window.innerWidth;
          settledHeight = window.innerHeight;
          rememberVisibleFocus();
        });
      });
    };

    scheduleRef.current = schedule;
    update();
    rememberVisibleFocus();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);
    window.addEventListener("wheel", cancelPendingRecovery, { passive: true });
    window.addEventListener("touchmove", cancelPendingRecovery, { passive: true });
    window.addEventListener("pointerdown", cancelPendingRecovery, { passive: true });
    window.addEventListener("keydown", cancelPendingRecovery);
    page.addEventListener("focusin", handleFocusIn);
    const observer = new ResizeObserver(schedule);
    layers.forEach((layer) => observer.observe(layer));
    observer.observe(page);
    document.fonts.ready.then(schedule);
    return () => {
      active = false;
      scheduleRef.current = () => {};
      window.cancelAnimationFrame(frame);
      window.cancelAnimationFrame(resizeFocusFrame);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("wheel", cancelPendingRecovery);
      window.removeEventListener("touchmove", cancelPendingRecovery);
      window.removeEventListener("pointerdown", cancelPendingRecovery);
      window.removeEventListener("keydown", cancelPendingRecovery);
      page.removeEventListener("focusin", handleFocusIn);
      observer.disconnect();
    };
  }, []);

  // Re-evaluate after horizontal scroll-progress updates without changing
  // the stage timing, transform or scroll progression.
  useLayoutEffect(() => { scheduleRef.current(); });
  return pageRef;
}
