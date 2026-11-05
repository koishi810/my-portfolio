import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

let pendingScrollRestore = null;

function cancelPendingRestore() {
  pendingScrollRestore?.();
}

export default function ProjectImageDialog({ alt, label, onClose, src, poster, trigger, mediaType = "image", initialTime = 0, initialEnded = false, autoPlay = true, onPlaybackIntent, onPlaybackPosition }) {
  const dialogRef = useRef(null);
  const videoRef = useRef(null);
  const playbackIntentRef = useRef(autoPlay);
  const videoEndedRef = useRef(initialEnded);
  const videoPositionReadyRef = useRef(false);
  const pendingVideoTimeRef = useRef(initialTime);
  const [videoEnded, setVideoEnded] = useState(initialEnded);
  const [videoPaused, setVideoPaused] = useState(!autoPlay);
  const mediaFailedRef = useRef(false);
  const [mediaFailed, setMediaFailed] = useState(false);
  const [posterFailed, setPosterFailed] = useState(false);
  const [imageAttempt, setImageAttempt] = useState(0);
  const closeRef = useRef(null);
  const pointerInteractionRef = useRef(false);
  const backdropGestureRef = useRef(null);
  const close = (pointerInitiated) => {
    if (mediaType === "video" && videoRef.current) {
      onPlaybackPosition?.({
        time: videoPositionReadyRef.current ? videoRef.current.currentTime : pendingVideoTimeRef.current,
        ended: videoEndedRef.current,
      });
    }
    onClose(pointerInitiated);
  };
  const closeFromClick = (event) => {
    const pointerInitiated = event.detail > 0 || pointerInteractionRef.current;
    pointerInteractionRef.current = false;
    close(pointerInitiated);
  };
  const failMedia = () => {
    mediaFailedRef.current = true;
    const video = videoRef.current;
    if (video && videoPositionReadyRef.current) pendingVideoTimeRef.current = video.currentTime;
    if (dialogRef.current?.contains(document.activeElement) && document.activeElement?.classList.contains("sugar-logo-dialog-toggle")) {
      closeRef.current?.focus({ preventScroll: true });
    }
    setMediaFailed(true);
    setVideoPaused(true);
  };
  const retryMedia = () => {
    // Keep keyboard focus inside the dialog when its retry button disappears.
    closeRef.current?.focus({ preventScroll: true });
    mediaFailedRef.current = false;
    setMediaFailed(false);
    setPosterFailed(false);
    if (mediaType !== "video") {
      setImageAttempt((attempt) => attempt + 1);
      return;
    }
    const video = videoRef.current;
    videoPositionReadyRef.current = false;
    videoEndedRef.current = false;
    setVideoEnded(false);
    playbackIntentRef.current = true;
    onPlaybackIntent?.(true);
    video.load();
    if (!document.hidden && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) video.play().catch(() => {});
  };

  useEffect(() => {
    if (mediaType !== "video") return;
    const video = videoRef.current;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      if (mediaFailedRef.current || document.hidden || reduced.matches || videoEndedRef.current || !playbackIntentRef.current) video.pause();
      else video.play().catch(() => {});
    };
    document.addEventListener("visibilitychange", sync);
    reduced.addEventListener("change", sync);
    sync();
    return () => {
      document.removeEventListener("visibilitychange", sync);
      reduced.removeEventListener("change", sync);
      video.pause();
    };
  }, [mediaType]);

  useLayoutEffect(() => {
    cancelPendingRestore();
    const dialog = dialogRef.current;
    const root = document.documentElement;
    const scrollScene = trigger?.closest("[data-fullscreen-scroll-scene]");
    const sceneBounds = scrollScene?.getBoundingClientRect();
    const original = {
      overflow: root.style.overflow,
      scrollbarGutter: root.style.scrollbarGutter,
      overflowAnchor: root.style.overflowAnchor,
      left: window.scrollX,
      top: window.scrollY,
      width: window.innerWidth,
      height: window.innerHeight,
      sceneProgress: sceneBounds ? Math.min(1, Math.max(0, -sceneBounds.top / Math.max(sceneBounds.height - (Number(scrollScene.dataset.fullscreenViewportHeight) || window.innerHeight), 1))) : null,
    };
    const restoreScroll = () => {
      const viewportChanged = window.innerWidth !== original.width || window.innerHeight !== original.height;
      // A very short viewport can use ordinary flow when the dialog opens,
      // then regain a scroll-driven scene while the dialog is being resized.
      const currentScene = scrollScene || trigger?.closest("[data-fullscreen-scroll-scene]");
      const panelProgress = Number(trigger?.closest("[data-fullscreen-scene-progress]")?.dataset.fullscreenSceneProgress);
      const sceneProgress = original.sceneProgress ?? (Number.isFinite(panelProgress) ? panelProgress : null);
      if (viewportChanged && trigger?.isConnected && currentScene?.isConnected && currentScene.hasAttribute("data-fullscreen-scroll-scene") && sceneProgress !== null) {
        // The horizontal cover is positioned by vertical scene progress, not
        // by ancestor scrolling. Preserve that mapping across responsive reflow
        // without depending on transient bounds while the scene is easing.
        const scene = currentScene.getBoundingClientRect();
        const stageHeight = Number(currentScene.dataset.fullscreenViewportHeight) || window.innerHeight;
        const top = window.scrollY + scene.top + sceneProgress * Math.max(scene.height - stageHeight, 1);
        window.scrollTo({ left: original.left, top, behavior: "instant" });
        return;
      }
      window.scrollTo({ left: original.left, top: original.top, behavior: "instant" });
      if (!trigger?.isConnected || !viewportChanged) return;

      // After a viewport change the old pixel offset may point to a different
      // part of the page. Leave an already visible trigger alone; otherwise
      // reveal the image that was opened rather than restoring an empty focus.
      const bounds = trigger.getBoundingClientRect();
      const clearTop = Math.min(window.innerHeight / 3, window.innerWidth <= 700 ? 112 : 104);
      const visibleHeight = Math.min(bounds.bottom, window.innerHeight) - Math.max(bounds.top, clearTop);
      const visibleWidth = Math.min(bounds.right, window.innerWidth) - Math.max(bounds.left, 0);
      if (visibleHeight < Math.min(44, bounds.height) || visibleWidth < Math.min(44, bounds.width)) {
        // Scroll only the document. Hidden ancestors must keep scrollLeft=0.
        const top = window.scrollY + bounds.top + bounds.height / 2 - (window.innerHeight + clearTop) / 2;
        window.scrollTo({ left: original.left, top, behavior: "instant" });
      }
    };

    root.style.overflowAnchor = "none";
    root.style.scrollbarGutter = "stable";
    root.style.overflow = "hidden";
    dialog.showModal();
    document.dispatchEvent(new Event("portfolio-dialog-change"));
    closeRef.current?.focus({ preventScroll: true });

    return () => {
      if (dialog.open) dialog.close();
      document.dispatchEvent(new Event("portfolio-dialog-change"));
      root.style.overflow = original.overflow;
      root.style.scrollbarGutter = original.scrollbarGutter;
      if (trigger?.isConnected) trigger.focus({ preventScroll: true });
      restoreScroll();
      root.style.overflowAnchor = original.overflowAnchor;

      // Scroll-driven pages can reflow after their viewport is unlocked. Finish
      // one bounded restore after that reflow, unless fresh user input wins.
      const closedAt = performance.now();
      const inputEvents = ["wheel", "touchmove", "pointerdown", "keydown"];
      let frame = 0;
      const cancelRestore = () => {
        window.cancelAnimationFrame(frame);
        inputEvents.forEach((type) => window.removeEventListener(type, cancelOnInput, true));
        if (pendingScrollRestore === cancelRestore) pendingScrollRestore = null;
      };
      const cancelOnInput = (event) => {
        // The event that closed the dialog may still be propagating.
        if (event.timeStamp > closedAt) cancelRestore();
      };
      pendingScrollRestore = cancelRestore;
      inputEvents.forEach((type) => window.addEventListener(type, cancelOnInput, { capture: true, passive: true }));
      frame = window.requestAnimationFrame(() => {
        frame = window.requestAnimationFrame(() => {
          cancelRestore();
          if (trigger?.isConnected) restoreScroll();
        });
      });
    };
  }, [trigger]);

  return createPortal(
    <dialog
      className="project-image-dialog"
      ref={dialogRef}
      aria-label={`${label}の全画面${mediaType === "video" ? "映像" : "画像"}`}
      onPointerDownCapture={(event) => {
        pointerInteractionRef.current = true;
        backdropGestureRef.current = event.isPrimary && event.button === 0 && event.target === event.currentTarget
          ? { pointerId: event.pointerId, endedOnBackdrop: false } : null;
      }}
      onPointerUpCapture={(event) => {
        const gesture = backdropGestureRef.current;
        if (!gesture || gesture.pointerId !== event.pointerId) return;
        // Touch may keep its implicit capture target after moving away. Check
        // the physical release point as well as the normal event target.
        gesture.endedOnBackdrop = event.target === event.currentTarget
          && document.elementFromPoint(event.clientX, event.clientY) === event.currentTarget;
      }}
      onPointerCancelCapture={() => {
        pointerInteractionRef.current = false;
        backdropGestureRef.current = null;
      }}
      onTouchCancelCapture={() => {
        pointerInteractionRef.current = false;
        backdropGestureRef.current = null;
      }}
      onKeyDownCapture={() => {
        pointerInteractionRef.current = false;
        backdropGestureRef.current = null;
      }}
      onCancel={(event) => {
        event.preventDefault();
        close(false);
      }}
      onClick={(event) => {
        const backgroundClick = event.target === event.currentTarget
          && backdropGestureRef.current?.endedOnBackdrop;
        backdropGestureRef.current = null;
        if (backgroundClick) closeFromClick(event);
        // An image click must not label a later assistive click as pointer input.
        else pointerInteractionRef.current = false;
      }}
      onKeyDown={(event) => {
        if (event.key === "Tab") {
          event.preventDefault();
          const buttons = [...event.currentTarget.querySelectorAll("button")];
          const index = buttons.indexOf(document.activeElement);
          buttons[(index + (event.shiftKey ? -1 : 1) + buttons.length) % buttons.length]?.focus({ preventScroll: true });
        }
      }}
    >
      {mediaType === "video" ? <>
        <video ref={videoRef} className="project-image-dialog-image project-image-dialog-video" src={src} poster={poster} hidden={mediaFailed}
          aria-label={alt} autoPlay={autoPlay} muted playsInline preload="auto"
          onLoadedMetadata={() => {
            if (pendingVideoTimeRef.current > 0) videoRef.current.currentTime = pendingVideoTimeRef.current;
            videoPositionReadyRef.current = true;
          }}
          onError={failMedia}
          onPlay={() => setVideoPaused(false)} onPause={() => setVideoPaused(true)}
          onEnded={() => { videoEndedRef.current = true; setVideoEnded(true); setVideoPaused(true); playbackIntentRef.current = false; }} />
        {!mediaFailed && <button className="sugar-logo-dialog-toggle" type="button" aria-label={videoEnded ? "映像をもう一度再生" : videoPaused ? "映像を再生" : "映像を一時停止"}
          onClick={() => {
            const video = videoRef.current;
            const shouldPlay = video.paused;
            playbackIntentRef.current = shouldPlay;
            onPlaybackIntent?.(shouldPlay);
            if (shouldPlay) {
              if (videoEndedRef.current || video.ended) {
                pendingVideoTimeRef.current = 0;
                video.currentTime = 0;
              }
              videoEndedRef.current = false;
              setVideoEnded(false);
              video.play().catch(() => {});
            } else video.pause();
          }}>
          <span aria-hidden="true">{videoEnded ? "↻" : videoPaused ? "▶" : "Ⅱ"}</span>
        </button>}
      </> : <img key={imageAttempt} className="project-image-dialog-image" alt={alt} src={src} hidden={mediaFailed} onError={failMedia} />}
      {mediaFailed && <div className="project-image-dialog-failure" data-has-poster={mediaType === "video" && Boolean(poster) && !posterFailed}>
        {mediaType === "video" && poster && !posterFailed && <img className="project-image-dialog-image" src={poster} alt={alt} onError={() => setPosterFailed(true)} />}
        <div className="project-media-error project-media-error-dialog" role="status">
          <p>{mediaType === "video" ? "動画" : "画像"}を読み込めませんでした。</p>
          <button type="button" onClick={retryMedia}>再試行</button>
        </div>
      </div>}
      <button
        className="project-image-dialog-close"
        ref={closeRef}
        type="button"
        aria-label={`全画面${mediaType === "video" ? "映像" : "画像"}を閉じる`}
        onClick={closeFromClick}
      >
        ×
      </button>
    </dialog>,
    document.body,
  );
}
