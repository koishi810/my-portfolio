import { useLayoutEffect, useRef } from "react";

// Match the established navigation band without masking a blend-layer ancestor.
const fadeTargets = [
  ".sugar-heading > *",
  ".sugar-cover",
  ".sugar-photograph",
  ".sugar-section-title",
  ".sugar-metadata dt",
  ".sugar-metadata dd",
  ".sugar-intro > p",
  ".sugar-note",
  ".sugar-logo-clip",
  ".sugar-back-link",
].join(",");

export default function useSugarNavigationFade() {
  const pageRef = useRef(null);

  useLayoutEffect(() => {
    const page = pageRef.current;
    if (!page) return;
    const layers = [...page.querySelectorAll(fadeTargets)];
    let frame = 0;
    let active = true;

    const update = () => {
      frame = 0;
      const mobile = window.matchMedia("(max-width: 700px)").matches;
      const clearY = mobile ? 72 : 64;
      const fullY = mobile ? 112 : 92;
      const bounds = layers.map((layer) => layer.getBoundingClientRect());
      layers.forEach((layer, index) => {
        layer.style.setProperty("--sugar-fade-clear", `${clearY - bounds[index].top}px`);
        layer.style.setProperty("--sugar-fade-full", `${fullY - bounds[index].top}px`);
        layer.classList.add("sugar-navigation-fade-layer");
      });
    };
    const schedule = () => {
      if (active && !frame) frame = window.requestAnimationFrame(update);
    };
    const revealFocus = (event) => {
      const target = event.target;
      if (!target.matches("a, button, [tabindex]") || !target.matches(":focus-visible")) return;
      if (target.closest(".sugar-chrome")) return;
      const fullY = window.matchMedia("(max-width: 700px)").matches ? 112 : 92;
      const bounds = target.getBoundingClientRect();
      if (bounds.top < fullY) window.scrollBy({ top: bounds.top - fullY - 12, behavior: "instant" });
      schedule();
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    page.addEventListener("focusin", revealFocus);
    const observer = new ResizeObserver(schedule);
    layers.forEach((layer) => observer.observe(layer));
    observer.observe(page);
    document.fonts.ready.then(schedule);
    return () => {
      active = false;
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      page.removeEventListener("focusin", revealFocus);
      observer.disconnect();
    };
  }, []);

  return pageRef;
}
