import { useCallback, useRef, useState } from "react";
import ProjectImageDialog from "./ProjectImageDialog.jsx";
import "../../styles/project-image-fullscreen.css";

export default function FullscreenImage({ alt, className = "", imageLabel, onBlur, onClick, onKeyDown, onKeyboardReveal, onPointerCancel, onPointerDown, ...imageProps }) {
  const imageRef = useRef(null);
  const pointerActivationRef = useRef(false);
  const [expanded, setExpanded] = useState(false);
  const label = imageLabel || alt || "作品画像";
  const setPointerFocus = useCallback((pointerInitiated) => {
    pointerActivationRef.current = pointerInitiated;
    if (pointerInitiated) imageRef.current?.setAttribute("data-pointer-focus", "true");
    else imageRef.current?.removeAttribute("data-pointer-focus");
  }, []);
  const close = useCallback((pointerInitiated = false) => {
    // Set this before unmounting: dialog.close() can restore focus itself.
    setPointerFocus(pointerInitiated);
    setExpanded(false);
  }, [setPointerFocus]);
  const open = (pointerInitiated) => {
    setPointerFocus(pointerInitiated);
    imageRef.current?.focus({ preventScroll: true });
    setExpanded(true);
  };

  return (
    <>
      <img
        {...imageProps}
        alt={alt}
        className={`${className}${className ? " " : ""}project-image-trigger`}
        ref={imageRef}
        role="button"
        tabIndex={0}
        aria-haspopup="dialog"
        aria-label={`${label}を全画面で表示`}
        onPointerDown={(event) => {
          onPointerDown?.(event);
          if (!event.defaultPrevented) setPointerFocus(true);
        }}
        onPointerCancel={(event) => {
          setPointerFocus(false);
          onPointerCancel?.(event);
        }}
        onBlur={(event) => {
          setPointerFocus(false);
          onBlur?.(event);
        }}
        onClick={(event) => {
          onClick?.(event);
          if (!event.defaultPrevented) open(event.detail > 0 || pointerActivationRef.current);
        }}
        onKeyDown={(event) => {
          // Keyboard use takes over immediately, including Tab/Shift+Tab.
          setPointerFocus(false);
          onKeyDown?.(event);
          if (!event.defaultPrevented && (event.key === "Enter" || event.key === " ")) {
            event.preventDefault();
            // Zoom or scrolling can leave keyboard focus on an off-screen image
            // without a new focus event. Reveal only when it is activated again.
            const bounds = event.currentTarget.getBoundingClientRect();
            const clearTop = Math.min(window.innerHeight / 3, window.innerWidth <= 700 ? 112 : 104);
            const visibleWidth = Math.max(0, Math.min(bounds.right, window.innerWidth) - Math.max(bounds.left, 0));
            const visibleHeight = Math.max(0, Math.min(bounds.bottom, window.innerHeight) - Math.max(bounds.top, clearTop));
            if (visibleWidth === 0 || visibleHeight === 0) {
              onKeyboardReveal?.(event);
            }
            open(false);
          }
        }}
      />
      {expanded ? (
        <ProjectImageDialog
          alt={alt || label}
          label={label}
          onClose={close}
          src={imageRef.current?.currentSrc || imageProps.src}
          trigger={imageRef.current}
        />
      ) : null}
    </>
  );
}
