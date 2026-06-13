import { useEffect, useRef, useState } from "react";
import ScrollImageSequence from "./ScrollImageSequence.jsx";

const DESIGN_WIDTH = 1440;
const DESIGN_HEIGHT = 905;
const MAIN_LENGTH = 1402;
const ABOUT_LENGTH = 1404;
const MAIN_SCROLL = MAIN_LENGTH - DESIGN_HEIGHT;
const ABOUT_SCROLL = ABOUT_LENGTH - DESIGN_HEIGHT;
const MAIN_ANIMATION_SCROLL = MAIN_SCROLL * 4;
const ABOUT_ANIMATION_SCROLL = ABOUT_SCROLL * 4;
const ABOUT_ENTRY_SCROLL = DESIGN_HEIGHT * 2;
const ABOUT_ENTRY_START = MAIN_ANIMATION_SCROLL;
const ABOUT_ENTRY_END = ABOUT_ENTRY_START + ABOUT_ENTRY_SCROLL;
const TOTAL_SCROLL = MAIN_ANIMATION_SCROLL + ABOUT_ENTRY_SCROLL + ABOUT_ANIMATION_SCROLL;

const smallTitle = ["私", "に", "つ", "い", "て"];
const rightColumn = ["言", "葉", "に", "な", "る", "前", "の", "も", "の", "を"];
const leftColumn = ["か", "た", "ち", "に", "す", "る"];

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function progressBetween(progress, start, end) {
  return clamp((progress - start) / (end - start), 0, 1);
}

function lerp(from, to, amount) {
  return from + (to - from) * amount;
}

function useStageScale() {
  const [metrics, setMetrics] = useState({
    scale: 1,
    viewportHeight: DESIGN_HEIGHT,
  });

  useEffect(() => {
    const updateScale = () => {
      setMetrics({
        scale: Math.min(window.innerWidth / DESIGN_WIDTH, window.innerHeight / DESIGN_HEIGHT),
        viewportHeight: window.innerHeight,
      });
    };

    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  return metrics;
}

function useSectionProgress(sectionRef) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frameId = null;
    let currentProgress = 0;
    let targetProgress = 0;

    const updateProgress = () => {
      const section = sectionRef.current;

      if (section) {
        const rect = section.getBoundingClientRect();
        const scrollable = Math.max(rect.height - window.innerHeight, 1);
        targetProgress = clamp(-rect.top / scrollable, 0, 1);
      }

      currentProgress = lerp(currentProgress, targetProgress, 0.12);
      if (Math.abs(targetProgress - currentProgress) < 0.0005) {
        currentProgress = targetProgress;
      }

      setProgress(currentProgress);
      frameId = window.requestAnimationFrame(updateProgress);
    };

    frameId = window.requestAnimationFrame(updateProgress);
    return () => {
      if (frameId !== null) window.cancelAnimationFrame(frameId);
    };
  }, [sectionRef]);

  return progress;
}

function SharedBackground() {
  const backgroundRef = useRef(null);

  useEffect(() => {
    let frameId = null;
    const current = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };

    const updateTarget = (event) => {
      const halfWidth = window.innerWidth / 2 || 1;
      const halfHeight = window.innerHeight / 2 || 1;
      target.x = clamp((event.clientX - halfWidth) / halfWidth, -1, 1) * 12;
      target.y = clamp((event.clientY - halfHeight) / halfHeight, -1, 1) * 7;
    };

    const resetTarget = () => {
      target.x = 0;
      target.y = 0;
    };

    const tick = () => {
      current.x = lerp(current.x, target.x, 0.18);
      current.y = lerp(current.y, target.y, 0.18);

      if (backgroundRef.current) {
        backgroundRef.current.style.transform = `translate3d(${current.x}px, ${current.y}px, 0)`;
        backgroundRef.current.dataset.offsetX = current.x.toFixed(2);
        backgroundRef.current.dataset.offsetY = current.y.toFixed(2);
      }

      frameId = window.requestAnimationFrame(tick);
    };

    document.addEventListener("mousemove", updateTarget);
    document.addEventListener("pointermove", updateTarget);
    document.addEventListener("mouseleave", resetTarget);
    window.addEventListener("blur", resetTarget);
    frameId = window.requestAnimationFrame(tick);

    return () => {
      document.removeEventListener("mousemove", updateTarget);
      document.removeEventListener("pointermove", updateTarget);
      document.removeEventListener("mouseleave", resetTarget);
      window.removeEventListener("blur", resetTarget);
      if (frameId !== null) window.cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <div
      className="home-flow-background"
      aria-hidden="true"
      data-offset-x="0.00"
      data-offset-y="0.00"
      ref={backgroundRef}
    >
      <img alt="" src="/assets/test/about-scroll/bg.png" />
    </div>
  );
}

function SharedMask({ aboutProgress }) {
  const aboutPresence = progressBetween(aboutProgress, 0, 0.35);
  const opacity = lerp(0.6, 0.7, aboutPresence);
  const blur = lerp(7.5, 15, aboutPresence);

  return (
    <div
      className="home-flow-mask"
      aria-hidden="true"
      style={{
        backdropFilter: `blur(${blur}px)`,
        background: `rgba(0, 0, 0, ${opacity})`,
      }}
    />
  );
}

function SharedChrome() {
  return (
    <div className="home-flow-chrome">
      <p className="home-flow-version">Portfolio ver0.1</p>
      <div className="home-flow-version-box">
        <span>2026.06.09 更新しました　2026.06.09 更新しました　</span>
      </div>
      <nav className="home-flow-nav" aria-label="Test navigation">
        <span>TOP</span>
        <span>WORK</span>
        <span>ABOUT ME</span>
      </nav>
    </div>
  );
}

function MainVisualScene({ progress }) {
  return (
    <div className="home-flow-main-scene">
      <ScrollImageSequence
        basePath="/assets/sequences/yezi"
        className="home-flow-main-sequence"
        extension="png"
        filenamePattern="{index:0000}"
        frameCount={48}
        logicalHeight={1257.759}
        logicalWidth={2236.016}
        progress={progress}
      />
      <h1>LU YUFAN</h1>
      <p className="home-flow-side-title">PORTFOLIO</p>
      <p className="home-flow-discipline">Information Expression / Visual Design / UI/UX</p>
      <div className="home-flow-profile-copy">
        <p>漢字の書き方が陸昱帆、日本語での読み方がリク イクハンです</p>
        <p>言葉だけでは捉えきれない感覚を、デザインとしてまとまることに関心があります</p>
        <p>
          情報表現、ビジュアルデザイン、UI/UXを横断しながら、人の想像や行動が入り込める余白をつくり、まだ固定されていない可能性の表現を探し続けています
        </p>
      </div>
    </div>
  );
}

function VerticalColumn({ chars, className, revealProgress, startIndex }) {
  const totalChars = rightColumn.length + leftColumn.length;

  return (
    <div className={className}>
      {chars.map((char, index) => {
        const charProgress = clamp(revealProgress * totalChars - (startIndex + index), 0, 1);

        return (
          <span
            className="home-flow-about-char"
            key={`${char}-${index}`}
            style={{
              opacity: charProgress,
              transform: `translateY(${(1 - charProgress) * 8}px)`,
            }}
          >
            {char}
          </span>
        );
      })}
    </div>
  );
}

function AboutScene({ aboutProgress }) {
  const entryProgress = progressBetween(aboutProgress, 0, 0.25);
  const titleProgress = progressBetween(aboutProgress, 0.25, 0.45);
  const textProgress = progressBetween(aboutProgress, 0.45, 0.75);
  const moreProgress = progressBetween(aboutProgress, 0.75, 0.9);
  const subjectTop = lerp(611.6108, 136.262, entryProgress);

  return (
    <div
      className="home-flow-about-scene"
      data-about-progress={aboutProgress.toFixed(3)}
      data-subject-y={subjectTop.toFixed(3)}
    >
      <div
        className="home-flow-about-subject"
        style={{
          top: `${subjectTop}px`,
        }}
      >
        <ScrollImageSequence
          basePath="/assets/sequences/shitou"
          className="home-flow-about-sequence"
          extension="png"
          filenamePattern="{index:0000}"
          frameCount={48}
          logicalHeight={509.273}
          logicalWidth={905.375}
          progress={progressBetween(aboutProgress, 0.25, 1)}
        />
        <div
          className="home-flow-about-small-title"
          style={{
            opacity: titleProgress,
            transform: `translateY(${(1 - titleProgress) * 8}px)`,
          }}
        >
          {smallTitle.map((char) => (
            <span key={char}>{char}</span>
          ))}
        </div>
        <VerticalColumn
          chars={rightColumn}
          className="home-flow-about-column home-flow-about-column-right"
          revealProgress={textProgress}
          startIndex={0}
        />
        <VerticalColumn
          chars={leftColumn}
          className="home-flow-about-column home-flow-about-column-left"
          revealProgress={textProgress}
          startIndex={rightColumn.length}
        />
        <a
          className="home-flow-more-button"
          href="/about"
          style={{
            opacity: moreProgress,
            pointerEvents: moreProgress > 0 ? "auto" : "none",
            transform: `translateY(${(1 - moreProgress) * 8}px)`,
          }}
        >
          MORE
        </a>
      </div>
    </div>
  );
}

export default function HomeFlowStage() {
  const sectionRef = useRef(null);
  const { scale, viewportHeight } = useStageScale();
  const progress = useSectionProgress(sectionRef);
  const scrollDesign = progress * TOTAL_SCROLL;
  const mainProgress = progressBetween(scrollDesign, 0, MAIN_ANIMATION_SCROLL);
  const aboutProgress = progressBetween(
    scrollDesign,
    ABOUT_ENTRY_END,
    ABOUT_ENTRY_END + ABOUT_ANIMATION_SCROLL,
  );
  const trackY = -lerp(
    0,
    DESIGN_HEIGHT,
    progressBetween(scrollDesign, ABOUT_ENTRY_START, ABOUT_ENTRY_END),
  );
  const sectionHeight = viewportHeight + TOTAL_SCROLL * scale;

  return (
    <section
      className="home-flow-scroll-section"
      ref={sectionRef}
      style={{
        height: `${sectionHeight}px`,
      }}
    >
      <div className="home-flow-sticky-stage">
        <div
          className="home-flow-stage-shell"
          style={{
            height: `${DESIGN_HEIGHT * scale}px`,
            width: `${DESIGN_WIDTH * scale}px`,
          }}
        >
          <div
            className="home-flow-design-stage"
            data-progress={progress.toFixed(3)}
            data-scroll-design={scrollDesign.toFixed(3)}
            style={{
              transform: `scale(${scale})`,
            }}
          >
            <SharedBackground />
            <SharedMask aboutProgress={aboutProgress} />
            <div
              className="home-flow-content-track"
              style={{
                transform: `translateY(${trackY}px)`,
              }}
            >
              <MainVisualScene progress={mainProgress} />
              <AboutScene aboutProgress={aboutProgress} />
            </div>
            <SharedChrome />
          </div>
        </div>
      </div>
    </section>
  );
}
