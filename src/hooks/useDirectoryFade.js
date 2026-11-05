import { useLayoutEffect, useRef } from "react";

// Apply the viewport fade to each existing compositing layer, never an ancestor:
// a masked ancestor would isolate difference-blended text from the photograph.
const fadeTargets = [
  ".directory-title",
  ".directory-category-index",
  ".directory-results-title",
  ".directory-project-copy",
  ".directory-project-image",
  ".directory-illustration-image",
  ".directory-category-empty",
  ".directory-about-intro .directory-about-slogan",
  ".directory-about-portrait",
  ".directory-about-name",
  ".directory-about-history",
  ".directory-about-copy",
  ".directory-contact",
].join(",");

export default function useDirectoryFade() {
  const pageRef = useRef(null);

  useLayoutEffect(() => {
    const page = pageRef.current;
    if (!page) return;
    const layers = [...page.querySelectorAll(fadeTargets)];
    // Empty copy and the light gallery have no project wrapper to clip beneath
    // their category heading. Keep each foreground layer below the sticky title.
    const sectionHeadings = new Map(
      layers.filter(layer => page.classList.contains("directory-page-works") && layer.matches(".directory-category-empty, .directory-illustration-image"))
        .map(layer => [layer, layer.closest(".directory-category").querySelector(".directory-results-title")]),
    );
    let frame = 0;
    let active = true;

    const update = () => {
      frame = 0;
      const mobile = window.matchMedia("(max-width: 700px)").matches;
      const clearY = mobile ? 72 : 64;
      const fullY = mobile ? 112 : 92;
      // Read all layout before writing styles so scroll work stays one pass.
      const bounds = layers.map((layer) => layer.getBoundingClientRect());
      const headingEdges = new Map([...sectionHeadings].map(([layer, heading]) => [
        layer,
        heading && window.getComputedStyle(heading).position === "sticky"
          ? heading.getBoundingClientRect().bottom + 18 : 0,
      ]));
      layers.forEach((layer, index) => {
        const headingEdge = headingEdges.get(layer) || 0;
        const layerClearY = Math.max(clearY, headingEdge);
        const layerFullY = Math.max(fullY, headingEdge + fullY - clearY);
        layer.style.setProperty("--directory-fade-clear", `${layerClearY - bounds[index].top}px`);
        layer.style.setProperty("--directory-fade-full", `${layerFullY - bounds[index].top}px`);
        layer.classList.add("directory-fade-layer");
      });
    };
    const schedule = () => {
      if (active && !frame) frame = window.requestAnimationFrame(update);
    };
    // Keyboard navigation must reveal a masked target rather than focus it
    // invisibly behind the navigation. The browser handles normal focus first.
    const revealFocus = (event) => {
      // Pointer focus must not move a partially visible link before its click.
      if (!event.target.matches("a, button, [tabindex]") || !event.target.matches(":focus-visible")) return;
      // Works already placed this keyboard target below its sticky category
      // title. Do not replace that safe edge with the lower navigation-only one.
      if (page.classList.contains("directory-page-works") && event.target.closest(".directory-project.works-keyboard-reading")) {
        schedule();
        return;
      }
      const bounds = event.target.getBoundingClientRect();
      let fullY = window.matchMedia("(max-width: 700px)").matches ? 112 : 92;
      const galleryHeading = sectionHeadings.get(event.target);
      if (galleryHeading) {
        const style = window.getComputedStyle(galleryHeading);
        if (style.position === "sticky") fullY = Math.max(fullY, parseFloat(style.top) + galleryHeading.offsetHeight + 18 + (window.innerWidth <= 700 ? 40 : 28));
      }
      if (!event.target.closest(".directory-chrome")) {
        // Index links below a short viewport must finish their focus reveal
        // now; native smooth focus scrolling can otherwise override a rapid
        // following Enter's ordinary anchor navigation.
        const indexBelow = event.target.closest(".directory-category-index") && bounds.bottom > window.innerHeight;
        if (bounds.top < fullY || indexBelow) {
          window.scrollBy({ top: bounds.top - fullY - 12, behavior: "instant" });
        } else if (bounds.bottom <= window.innerHeight) {
          // A fast keyboard reversal can return to a still-visible target while
          // the previous focus scroll keeps running. Stop at the current position;
          // do not chase old focus on later scroll/wheel events.
          window.scrollTo({ top: window.scrollY, left: window.scrollX, behavior: "instant" });
        } else if (bounds.bottom - bounds.top > window.innerHeight - fullY - 12 && bounds.top < window.innerHeight) {
          // An oversized image cannot fit below the navigation. Reveal its top
          // at the same safe margin instead of letting the old scroll carry it away.
          window.scrollBy({ top: bounds.top - fullY - 12, behavior: "instant" });
        }
      }
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
