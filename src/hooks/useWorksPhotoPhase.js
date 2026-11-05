import { useLayoutEffect } from "react";

export default function useWorksPhotoPhase(pageRef, enabled) {
  useLayoutEffect(() => {
    const page = pageRef.current;
    const section = enabled && page?.querySelector("#category-photography");
    const illustration = enabled && page?.querySelector("#category-illustration");
    if (!section) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      if (document.querySelector(".project-image-dialog[open]")) return;
      const bounds = section.getBoundingClientRect();
      const end = illustration?.getBoundingClientRect().bottom ?? bounds.bottom;
      const height = window.innerHeight;
      page.classList.toggle("directory-photo-phase", bounds.top <= height * .65 && end > height * .35);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const observer = new ResizeObserver(schedule);
    observer.observe(section);
    if (illustration) observer.observe(illustration);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    document.addEventListener("portfolio-dialog-change", schedule);
    update();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      document.removeEventListener("portfolio-dialog-change", schedule);
      page.classList.remove("directory-photo-phase");
    };
  }, [enabled, pageRef]);
}
