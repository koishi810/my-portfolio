import { useEffect, useRef, useState } from "react";
import ProjectImageDialog from "./ProjectImageDialog.jsx";

// Recorded from the author's implementation; no live canvas runs in the page.
export default function SugarLogoClip({ index, onKeyboardReveal }) {
  const videoRef = useRef(null);
  const triggerRef = useRef(null);
  const syncRef = useRef(() => {});
  const manualPauseRef = useRef(false);
  const expandedRef = useRef(false);
  const completedRef = useRef(false);
  const mediaFailedRef = useRef(false);
  const pendingReturnTimeRef = useRef(null);
  const [mediaFailed, setMediaFailed] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [paused, setPaused] = useState(true);
  const [openingTime, setOpeningTime] = useState(0);
  const [openingPlaying, setOpeningPlaying] = useState(false);
  const src = `/assets/projects/sugar-n/logo-${index}.mp4`;
  useEffect(() => {
    const video = videoRef.current;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    let loaded = false;
    const sync = () => {
      if (mediaFailedRef.current || !visible || document.hidden || reduced.matches || manualPauseRef.current || completedRef.current || expandedRef.current || document.querySelector(".project-image-dialog[open]")) video.pause();
      else video.play().catch(() => {});
    };
    syncRef.current = sync;
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting && entry.intersectionRatio >= 0.15;
      if (entry.isIntersecting && !loaded) {
        loaded = true;
        if (!video.getAttribute("src")) video.src = src;
      }
      sync();
    }, { threshold: [0, 0.15] });
    observer.observe(video);
    document.addEventListener("visibilitychange", sync);
    document.addEventListener("portfolio-dialog-change", sync);
    reduced.addEventListener("change", sync);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
      document.removeEventListener("portfolio-dialog-change", sync);
      reduced.removeEventListener("change", sync);
      video.pause();
      syncRef.current = () => {};
    };
  }, [src]);
  const toggle = () => {
    const video = videoRef.current;
    if (video.paused) {
      if (completedRef.current || video.ended) {
        pendingReturnTimeRef.current = video.readyState ? null : 0;
        video.currentTime = 0;
      }
      completedRef.current = false;
      setCompleted(false);
      manualPauseRef.current = false;
      video.play().catch(() => {});
    }
    else { manualPauseRef.current = true; video.pause(); }
  };
  const retry = () => {
    triggerRef.current?.focus({ preventScroll: true });
    const video = videoRef.current;
    setMediaFailed(false);
    mediaFailedRef.current = false;
    completedRef.current = false;
    setCompleted(false);
    manualPauseRef.current = false;
    video.load();
    video.play().catch(() => {});
  };
  const close = (pointerInitiated) => {
    if (pointerInitiated) triggerRef.current?.setAttribute("data-pointer-focus", "true");
    else triggerRef.current?.removeAttribute("data-pointer-focus");
    expandedRef.current = false;
    setExpanded(false);
    syncRef.current();
  };
  return <figure className="sugar-logo-clip" data-completed={completed || undefined}>
    <button className="sugar-logo-open" ref={triggerRef} type="button" aria-haspopup="dialog"
      aria-label={`Sugarⁿ 可変ロゴ ${Number(index)}を全画面で表示`}
      onFocus={onKeyboardReveal}
      onPointerDown={() => triggerRef.current?.setAttribute("data-pointer-focus", "true")}
      onPointerCancel={() => triggerRef.current?.removeAttribute("data-pointer-focus")}
      onKeyDown={(event) => {
        triggerRef.current?.removeAttribute("data-pointer-focus");
        if (event.key === "Enter" || event.key === " ") onKeyboardReveal?.(event);
      }}
      onBlur={() => triggerRef.current?.removeAttribute("data-pointer-focus")}
      onClick={() => {
        setOpeningTime(videoRef.current.currentTime);
        setOpeningPlaying(!videoRef.current.paused);
        expandedRef.current = true;
        videoRef.current.pause();
        setExpanded(true);
      }}>
      <video ref={videoRef} width="720" height="720" muted playsInline preload="none"
        poster={`/assets/projects/sugar-n/logo-${index}-poster.jpg`} aria-hidden="true"
        onLoadedMetadata={() => {
          if (pendingReturnTimeRef.current !== null) {
            videoRef.current.currentTime = Math.min(pendingReturnTimeRef.current, videoRef.current.duration);
            pendingReturnTimeRef.current = null;
          }
        }}
        onError={() => { mediaFailedRef.current = true; setMediaFailed(true); setPaused(true); }}
        onPlay={() => setPaused(false)} onPause={() => setPaused(true)}
        onEnded={() => { completedRef.current = true; setCompleted(true); setPaused(true); }} />
    </button>
    {!mediaFailed && <button className="sugar-logo-toggle" type="button" aria-label={`可変ロゴ ${Number(index)}を${completed ? "もう一度再生" : paused ? "再生" : "一時停止"}`}
      onFocus={onKeyboardReveal}
      onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") onKeyboardReveal?.(event); }}
      onClick={toggle}><span aria-hidden="true">{completed ? "↻" : paused ? "▶" : "Ⅱ"}</span></button>}
    {mediaFailed && <div className="project-media-error" role="status"><p>動画を読み込めませんでした。</p><button type="button" onClick={retry}>再試行</button></div>}
    {expanded && <ProjectImageDialog mediaType="video" src={src} trigger={triggerRef.current}
      poster={`/assets/projects/sugar-n/logo-${index}-poster.jpg`}
      alt={`Sugarⁿ 可変ロゴの変化 ${Number(index)}`} label={`Sugarⁿ 可変ロゴ ${Number(index)}`}
      initialTime={openingTime} initialEnded={completed} autoPlay={openingPlaying && !window.matchMedia("(prefers-reduced-motion: reduce)").matches}
      onPlaybackIntent={playing => { manualPauseRef.current = !playing; }}
      onPlaybackPosition={({ time, ended }) => {
        const video = videoRef.current;
        completedRef.current = ended;
        setCompleted(ended);
        if (video.readyState === 0) {
          // A keyboard user can open the modal before the card has loaded.
          // Load only this explicitly viewed clip, then reveal its returned frame.
          pendingReturnTimeRef.current = time;
          video.preload = "auto";
          if (!video.getAttribute("src")) video.src = src;
          video.load();
        } else {
          video.currentTime = time;
        }
      }}
      onClose={close} />}
  </figure>;
}
