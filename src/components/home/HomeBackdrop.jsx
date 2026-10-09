import { useEffect, useRef } from "react";
import { mix } from "../../hooks/useScrollProgress.js";

export function HomeBackground() {
  const backgroundRef = useRef(null);

  useEffect(() => {
    let frameId = null;
    const current = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };

    const updateTarget = (event) => {
      const halfWidth = window.innerWidth / 2 || 1;
      const halfHeight = window.innerHeight / 2 || 1;
      target.x = ((event.clientX - halfWidth) / halfWidth) * 6;
      target.y = ((event.clientY - halfHeight) / halfHeight) * 3.5;
    };

    const resetTarget = () => {
      target.x = 0;
      target.y = 0;
    };

    const tick = () => {
      current.x = mix(current.x, target.x, 0.08);
      current.y = mix(current.y, target.y, 0.08);

      if (backgroundRef.current) {
        backgroundRef.current.style.transform = `translate3d(${current.x}px, ${current.y}px, 0) scale(1.08)`;
      }

      frameId = window.requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", updateTarget);
    window.addEventListener("pointerleave", resetTarget);
    window.addEventListener("blur", resetTarget);
    frameId = window.requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", updateTarget);
      window.removeEventListener("pointerleave", resetTarget);
      window.removeEventListener("blur", resetTarget);
      if (frameId !== null) window.cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <div className="portfolio-global-background" aria-hidden="true" ref={backgroundRef}>
      <img alt="" src="/assets/test/about-scroll/bg.png" />
    </div>
  );
}

export function HomeMask({ phase }) {
  return (
    <div className={`portfolio-global-mask portfolio-global-mask-${phase}`} aria-hidden="true">
      <div className="portfolio-mask-dark" />
      <div className="portfolio-mask-exclusion" />
      <div className="portfolio-mask-light" />
    </div>
  );
}
