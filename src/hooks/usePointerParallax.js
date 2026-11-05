import { useEffect, useRef } from "react";

// Used by the directory pages only; existing home/detail motion stays untouched.
export default function usePointerParallax() {
  const elementRef = useRef(null);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce), (pointer: coarse)");
    let frameId = null;
    const current = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };

    const tick = () => {
      current.x += (target.x - current.x) * 0.08;
      current.y += (target.y - current.y) * 0.08;
      elementRef.current?.style.setProperty("--directory-bg-x", `${current.x}px`);
      elementRef.current?.style.setProperty("--directory-bg-y", `${current.y}px`);
      if (Math.abs(target.x - current.x) + Math.abs(target.y - current.y) > 0.01) {
        frameId = window.requestAnimationFrame(tick);
      } else {
        frameId = null;
      }
    };
    const schedule = () => {
      if (frameId === null) frameId = window.requestAnimationFrame(tick);
    };
    const move = (event) => {
      if (media.matches) return;
      target.x = (event.clientX / window.innerWidth - 0.5) * 12;
      target.y = (event.clientY / window.innerHeight - 0.5) * 7;
      schedule();
    };
    const reset = () => {
      target.x = 0;
      target.y = 0;
      schedule();
    };

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerleave", reset);
    window.addEventListener("blur", reset);
    media.addEventListener("change", reset);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerleave", reset);
      window.removeEventListener("blur", reset);
      media.removeEventListener("change", reset);
      if (frameId !== null) window.cancelAnimationFrame(frameId);
    };
  }, []);

  return elementRef;
}
