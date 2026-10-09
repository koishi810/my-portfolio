import { useEffect, useRef, useState } from "react";
import ScrollImageSequence from "../motion/ScrollImageSequence.jsx";

const DESIGN_WIDTH = 1440;
const DESIGN_HEIGHT = 905;

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
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const updateScale = () => {
      setScale(Math.min(window.innerWidth / DESIGN_WIDTH, window.innerHeight / DESIGN_HEIGHT));
    };

    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  return scale;
}

function useSectionProgress(sectionRef) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frameId = null;

    const updateProgress = () => {
      const section = sectionRef.current;
      if (section) {
        const rect = section.getBoundingClientRect();
        const scrollable = Math.max(rect.height - window.innerHeight, 1);
        setProgress(clamp(-rect.top / scrollable, 0, 1));
      }

      frameId = window.requestAnimationFrame(updateProgress);
    };

    frameId = window.requestAnimationFrame(updateProgress);

    return () => {
      if (frameId !== null) window.cancelAnimationFrame(frameId);
    };
  }, [sectionRef]);

  return progress;
}

function BackgroundLayer() {
  return (
    <div className="about-test-background-layer" aria-hidden="true">
      <img alt="" src="/assets/test/about-scroll/bg.png" />
    </div>
  );
}

function MaskLayer() {
  return <div className="about-test-mask-layer" aria-hidden="true" />;
}

function GlobalChromeLayer() {
  return (
    <div className="about-test-global-chrome">
      <p className="about-test-version">Portfolio ver0.1</p>
      <div className="about-test-version-box">
        <span>2026.06.09 更新しました　2026.06.09 更新しました　</span>
      </div>
      <nav className="about-test-nav" aria-label="Test navigation">
        <span>TOP</span>
        <span>WORK</span>
        <span>ABOUT ME</span>
      </nav>
    </div>
  );
}

function SequenceLayer({ progress }) {
  const sequenceProgress = progressBetween(progress, 0.25, 1);

  return (
    <ScrollImageSequence
      aria-hidden="true"
      basePath="/assets/sequences/shitou"
      className="about-test-sequence-layer"
      extension="png"
      filenamePattern="{index:0000}"
      frameCount={48}
      logicalHeight={509.273}
      logicalWidth={905.375}
      progress={sequenceProgress}
    />
  );
}

function VerticalColumn({ chars, className, startIndex, revealProgress }) {
  const totalChars = rightColumn.length + leftColumn.length;

  return (
    <div className={className}>
      {chars.map((char, index) => {
        const charProgress = clamp(revealProgress * totalChars - (startIndex + index), 0, 1);

        return (
          <span
            className="about-test-main-char"
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

function TextLayer({ progress }) {
  const titleProgress = progressBetween(progress, 0.25, 0.45);
  const textProgress = progressBetween(progress, 0.45, 0.75);

  return (
    <div className="about-test-text-layer">
      <div
        className="about-test-small-title"
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
        className="about-test-main-column about-test-main-column-right"
        revealProgress={textProgress}
        startIndex={0}
      />
      <VerticalColumn
        chars={leftColumn}
        className="about-test-main-column about-test-main-column-left"
        revealProgress={textProgress}
        startIndex={rightColumn.length}
      />
    </div>
  );
}

function InteractionLayer({ progress }) {
  const moreProgress = progressBetween(progress, 0.75, 0.9);

  return (
    <a
      className="about-test-more-button"
      href="/about"
      style={{
        opacity: moreProgress,
        pointerEvents: progress >= 0.75 ? "auto" : "none",
        transform: `translateY(${(1 - moreProgress) * 8}px)`,
      }}
    >
      <span>MORE</span>
    </a>
  );
}

export default function AboutScrollStage() {
  const sectionRef = useRef(null);
  const scale = useStageScale();
  const progress = useSectionProgress(sectionRef);
  const entryProgress = progressBetween(progress, 0, 0.25);
  const subjectTop = lerp(611.6108, 136.262, entryProgress);

  return (
    <section className="about-test-scroll-section" ref={sectionRef}>
      <div className="about-test-sticky-stage">
        <div
          className="about-test-design-stage-shell"
          style={{
            height: `${DESIGN_HEIGHT * scale}px`,
            width: `${DESIGN_WIDTH * scale}px`,
          }}
        >
          <div
            className="about-test-design-stage"
            data-progress={progress.toFixed(3)}
            data-subject-y={subjectTop.toFixed(3)}
            style={{
              transform: `scale(${scale})`,
            }}
          >
            <BackgroundLayer />
            <MaskLayer />
            <GlobalChromeLayer />
            <div
              className="about-test-subject"
              style={{
                top: `${subjectTop}px`,
              }}
            >
              <SequenceLayer progress={progress} />
              <TextLayer progress={progress} />
              <InteractionLayer progress={progress} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
