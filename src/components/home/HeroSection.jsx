import ScrollImageSequence from "../motion/ScrollImageSequence.jsx";
import DesignStage from "./DesignStage.jsx";

export default function HeroSection({ sectionRef, progress, height }) {
  return (
    <section className="portfolio-hero-section portfolio-scroll-section" id="top" ref={sectionRef} style={{ height }}>
      <div className="portfolio-sticky-stage">
        <DesignStage>
          <div className="portfolio-hero-visual" data-progress={progress.toFixed(3)}>
            <ScrollImageSequence
              basePath="/assets/sequences/yezi"
              className="portfolio-hero-sequence"
              extension="png"
              filenamePattern="{index:0000}"
              frameCount={48}
              logicalHeight={943.323}
              logicalWidth={1677.019}
              progress={progress}
            />
          </div>
          <div className="portfolio-hero-copy">
            <p className="portfolio-hero-field">Information Expression / Visual Design / UIUX</p>
            <h1 className="portfolio-hero-title">LU YUFAN</h1>
            <p className="portfolio-hero-note">
              perception / information / visual expression
              <br />
              musashino art university
              <br />
              science of design
            </p>
          </div>
        </DesignStage>
      </div>
    </section>
  );
}
