import { useEffect, useRef } from "react";
import { mixPointerPosition } from "../../hooks/useScrollProgress.js";

export function HomeBackground() {
  const backgroundRef = useRef(null);

  useEffect(() => {
    let frameId = null;
    const current = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };
    let paintedBackground = null;
    let requestedTransform = null;
    let appliedTransform = null;

    const updateTarget = (event) => {
      const halfWidth = window.innerWidth / 2 || 1;
      const halfHeight = window.innerHeight / 2 || 1;
      target.x = ((event.clientX - halfWidth) / halfWidth) * 6;
      target.y = ((event.clientY - halfHeight) / halfHeight) * 3.5;
      schedule();
    };

    const resetTarget = () => {
      target.x = 0;
      target.y = 0;
      schedule();
    };

    const tick = () => {
      frameId = null;
      const previousX = current.x;
      const previousY = current.y;
      current.x = mixPointerPosition(current.x, target.x, 0.08);
      current.y = mixPointerPosition(current.y, target.y, 0.08);

      const background = backgroundRef.current;
      if (background) {
        const transform = `translate3d(${current.x}px, ${current.y}px, 0) scale(1.08)`;
        // CSSOM can normalize transform syntax. Keep both forms so identical
        // positions do not cause writes, while changed/replaced nodes still sync.
        if (paintedBackground !== background || requestedTransform !== transform || background.style.transform !== appliedTransform) {
          if (background.style.transform !== transform) background.style.transform = transform;
          paintedBackground = background;
          requestedTransform = transform;
          appliedTransform = background.style.transform;
        }
      }

      // Keep the original easing until the subpixel terminal snap, then stop.
      // Keep checking while a ref has not mounted yet.
      if (!background || current.x !== previousX || current.y !== previousY) schedule();
    };
    const schedule = () => {
      if (frameId === null) frameId = window.requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", updateTarget);
    window.addEventListener("pointerleave", resetTarget);
    window.addEventListener("blur", resetTarget);
    schedule();

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
