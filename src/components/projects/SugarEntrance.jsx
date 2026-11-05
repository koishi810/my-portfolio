import { useLayoutEffect, useRef } from "react";
import FullscreenImage from "./FullscreenImage.jsx";
import { sugarProject, sugarHero } from "../../data/sugarN.js";

// A short two-panel entrance follows KOKO's scroll-to-horizontal-to-reading order.
// It has no perpetual animation loop or separate text/visual scroll clocks.
export default function SugarEntrance() {
  const sceneRef = useRef(null);
  const trackRef = useRef(null);
  const refreshRef = useRef(() => {});
  useLayoutEffect(() => {
    const scene = sceneRef.current;
    const track = trackRef.current;
    let frame = 0;
    const naturalFlow = window.matchMedia("(max-width: 700px), (max-height: 300px)");
    let viewportHeight = window.innerHeight;
    let lastWidth = window.innerWidth;
    const update = () => {
      frame = 0;
      if (naturalFlow.matches) { track.style.transform = "none"; return; }
      const box = scene.getBoundingClientRect();
      const width = scene.clientWidth;
      const progress = Math.max(0, Math.min(1, -box.top / Math.max(scene.offsetHeight - viewportHeight, 1)));
      track.style.transform = `translate3d(${-width * Math.min(progress / 0.8, 1)}px, 0, 0)`;
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const measure = () => {
      // Ignore only small address-bar changes on actual touch devices. Desktop
      // narrow-window resize and substantial height changes must reflow the scene.
      const touchViewport = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
      const widthChanged = Math.abs(window.innerWidth - lastWidth) > 2;
      const substantialHeightChange = Math.abs(window.innerHeight - viewportHeight) > viewportHeight * 0.25;
      if (!touchViewport || window.innerWidth > 700 || widthChanged || substantialHeightChange) viewportHeight = window.innerHeight;
      lastWidth = window.innerWidth;
      scene.style.setProperty("--sugar-entrance-height", `${viewportHeight}px`);
      scene.style.height = naturalFlow.matches ? "auto" : `${viewportHeight + scene.clientWidth * 1.25}px`;
      scene.toggleAttribute("data-fullscreen-scroll-scene", !naturalFlow.matches);
      scene.dataset.fullscreenViewportHeight = viewportHeight;
      update();
    };
    refreshRef.current = update;
    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", measure);
      refreshRef.current = () => {};
    };
  }, []);

  const reveal = (event, secondPanel) => {
    if ((event.type !== "keydown" && !event.currentTarget.matches(":focus-visible")) || event.relatedTarget?.closest(".project-image-dialog")) return;
    const scene = sceneRef.current;
    if (window.matchMedia("(max-width: 700px), (max-height: 300px)").matches) return;
    const stage = scene.querySelector(".sugar-entrance-stage");
    stage.scrollLeft = 0;
    const box = scene.getBoundingClientRect();
    const height = Number(scene.dataset.fullscreenViewportHeight) || window.innerHeight;
    window.scrollTo({ left: window.scrollX, top: scrollY + box.top + (secondPanel ? 0.8 * (scene.offsetHeight - height) : 0), behavior: "instant" });
    refreshRef.current();
  };
  const firstPage = { src: sugarProject.image, alt: sugarProject.imageLabel, width: 1536, height: 1024 };
  return <section className="sugar-entrance" ref={sceneRef} data-fullscreen-scroll-scene>
    <div className="sugar-entrance-stage">
      <div className="sugar-entrance-track" ref={trackRef}>
        <div className="sugar-entrance-panel sugar-entrance-hero" data-fullscreen-scene-progress="0">
          <figure className="sugar-cover sugar-entrance-cover">
            <FullscreenImage {...sugarHero} loading="eager" fetchPriority="high" decoding="async" onFocus={event => reveal(event, false)} onKeyboardReveal={event => reveal(event, false)} />
          </figure>
          <div className="sugar-heading">
            <p className="sugar-date">{sugarProject.date}</p>
            <h1 id="sugar-title">{sugarProject.title}</h1>
            <p className="sugar-type">{sugarProject.type}</p>
          </div>
        </div>
        <div className="sugar-entrance-panel sugar-entrance-pdf" data-fullscreen-scene-progress="0.8">
          <figure className="sugar-photograph">
            <FullscreenImage src={firstPage.src} alt={firstPage.alt} width={firstPage.width} height={firstPage.height} loading="eager" decoding="async" onFocus={event => reveal(event, true)} onKeyboardReveal={event => reveal(event, true)} />
          </figure>
        </div>
      </div>
    </div>
  </section>;
}
