import { useLayoutEffect, useRef } from "react";

// Match the directory's v3 navigation fade, without masking a whole scene.
// Keep each existing blend layer separate and leave the backdrop/scene logic alone.
const fadeTargets = [
  ".portfolio-hero-visual",
  ".portfolio-hero-field",
  ".portfolio-hero-title",
  ".portfolio-hero-note",
  ".portfolio-about-sequence",
  ".portfolio-about-small-title",
  ".portfolio-about-column",
  ".portfolio-about-more",
  ".portfolio-works-title",
  ".portfolio-work-date",
  ".portfolio-work-text h3",
  ".portfolio-work-type",
  ".portfolio-work-description",
  ".portfolio-work-image",
  ".portfolio-all-works h2",
  ".portfolio-all-works .portfolio-more-button",
  ".portfolio-contact-copy h2",
  ".portfolio-contact-copy a",
].join(",");

export default function useHomeNavigationFade() {
  const pageRef = useRef(null);
  const scheduleRef = useRef(() => {});

  useLayoutEffect(() => {
    const page = pageRef.current;
    if (!page) return;
    const layers = [...page.querySelectorAll(fadeTargets)];
    const previous = new WeakMap();
    let frame = 0;
    let active = true;
    let motionUntil = 0;

    const update = () => {
      frame = 0;
      if (!active) return;
      const mobile = window.matchMedia("(max-width: 700px)").matches;
      const clearY = mobile ? 72 : 64;
      const fullY = mobile ? 112 : 92;
      // The design stage (and mobile About shell) are scaled. Convert viewport
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
        layer.style.setProperty("--home-fade-clear", clear);
        layer.style.setProperty("--home-fade-full", full);
        layer.classList.add("portfolio-home-fade-layer");
        previous.set(layer, signature);
      });
      // Scroll progress is eased and About text has 250ms CSS transitions.
      // Follow their settling positions, then stop this loop while stationary.
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
      if (target.closest(".portfolio-global-chrome")) return;
      let fullY = window.matchMedia("(max-width: 700px)").matches ? 112 : 92;
      // Match the directory: a sticky card cannot be revealed by scrolling
      // alone. Release only the keyboard-focused card, then clear its heading.
      const item = target.closest(".portfolio-work-item");
      if (item) {
        item.classList.add("works-keyboard-reading");
        item.style.clipPath = "";
        const title = page.querySelector(".portfolio-works-title");
        const titleStyle = title && window.getComputedStyle(title);
        const headingEdge = titleStyle?.position === "sticky"
          ? parseFloat(titleStyle.top) + title.offsetHeight + 18 : 0;
        fullY = Math.max(fullY, headingEdge);
      }
      const bounds = target.getBoundingClientRect();
      if (bounds.top < fullY || (item && bounds.bottom > window.innerHeight)) {
        window.scrollBy({ top: bounds.top - fullY - 12, behavior: "instant" });
      } else if (item) {
        window.scrollTo({ top: window.scrollY, left: window.scrollX, behavior: "instant" });
      }
      schedule();
    };
    const releaseFocus = (event) => {
      const item = event.target.closest(".portfolio-work-item");
      if (item && !item.contains(event.relatedTarget)) {
        item.classList.remove("works-keyboard-reading");
        schedule();
      }
    };

    scheduleRef.current = schedule;
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    page.addEventListener("focusin", revealFocus);
    page.addEventListener("focusout", releaseFocus);
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
      page.removeEventListener("focusout", releaseFocus);
      page.querySelectorAll(".works-keyboard-reading").forEach((item) => item.classList.remove("works-keyboard-reading"));
      observer.disconnect();
    };
  }, []);

  // Re-evaluate after existing React animation progress/phase updates. This does
  // not alter the progress values, frame sequence, timing, or original clip paths.
  useLayoutEffect(() => { scheduleRef.current(); });
  return pageRef;
}
