import SiteAnchor from "../SiteAnchor.jsx";
import { useLayoutEffect, useRef } from "react";
import ScrollImageSequence from "../motion/ScrollImageSequence.jsx";
import { mix, progressBetween } from "../../hooks/useScrollProgress.js";
import DesignStage from "./DesignStage.jsx";

const aboutSmallTitle = ["私", "に", "つ", "い", "て"];
const aboutRightColumn = ["言", "葉", "に", "な", "る", "前", "の", "も", "の", "を", "、"];
const aboutLeftColumn = ["か", "た", "ち", "に", "す", "る", "た", "め", "に", "。"];

function VerticalChars({ chars, className, revealProgress, startIndex }) {
  const totalChars = aboutRightColumn.length + aboutLeftColumn.length;

  return (
    <div className={className}>
      {chars.map((char, index) => {
        const charProgress = Math.min(Math.max(revealProgress * totalChars - (startIndex + index), 0), 1);

        return (
          <span
            className="portfolio-about-char"
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

export default function AboutSection({ sectionRef, progress, height }) {
  const entryProgress = progressBetween(progress, 0, 0.25);
  const titleProgress = progressBetween(progress, 0.25, 0.45);
  const textProgress = progressBetween(progress, 0.45, 0.75);
  const moreProgress = progressBetween(progress, 0.75, 0.9);
  const subjectTop = mix(611.6108, 136.262, entryProgress);
  const moreRef = useRef(null);
  const moreVisible = moreProgress > 0;

  useLayoutEffect(() => {
    // Changing tabIndex does not release focus already on the fading link.
    // Do not pull the reader back or move focus to a different control.
    if (!moreVisible && document.activeElement === moreRef.current) {
      moreRef.current?.blur();
    }
  }, [moreVisible]);

  return (
    <section className="portfolio-about-section portfolio-scroll-section" id="about" ref={sectionRef} style={{ height }}>
      <div className="portfolio-sticky-stage">
        <DesignStage>
          <div className="portfolio-about-subject" style={{ top: `${subjectTop}px` }}>
            <ScrollImageSequence
              basePath="/assets/sequences/shitou"
              className="portfolio-about-sequence"
              extension="png"
              filenamePattern="{index:0000}"
              frameCount={48}
              logicalHeight={509.273}
              logicalWidth={905.375}
              progress={progressBetween(progress, 0.25, 1)}
            />
            <div
              className="portfolio-about-small-title"
              style={{
                opacity: titleProgress,
                transform: `translateY(${(1 - titleProgress) * 8}px)`,
              }}
            >
              {aboutSmallTitle.map((char) => (
                <span key={char}>{char}</span>
              ))}
            </div>
            <VerticalChars
              chars={aboutRightColumn}
              className="portfolio-about-column portfolio-about-column-right"
              revealProgress={textProgress}
              startIndex={0}
            />
            <VerticalChars
              chars={aboutLeftColumn}
              className="portfolio-about-column portfolio-about-column-left"
              revealProgress={textProgress}
              startIndex={aboutRightColumn.length}
            />
            <SiteAnchor
              className="portfolio-more-button portfolio-about-more"
              href="/about"
              ref={moreRef}
              tabIndex={moreVisible ? 0 : -1}
              onClick={(event) => {
                if (!moreVisible) event.preventDefault();
              }}
              style={{
                opacity: moreProgress,
                pointerEvents: moreVisible ? "auto" : "none",
                transform: `translateY(${(1 - moreProgress) * 8}px)`,
              }}
            >
              MORE
            </SiteAnchor>
          </div>
        </DesignStage>
      </div>
    </section>
  );
}
