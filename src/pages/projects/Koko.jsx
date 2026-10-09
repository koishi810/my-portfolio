import { useEffect, useRef } from "react";
import PortfolioChrome from "../../components/PortfolioChrome.jsx";
import { mix, useScrollProgress, useStageMetrics } from "../../hooks/useScrollProgress.js";
import "../../styles/koko-project.css";

const DESIGN_WIDTH = 1440;
const DESIGN_HEIGHT = 905;
const PROJECT_INTRO_LEFT = 2339.66;
const PROJECT_INTRO_WIDTH = 357;
const CONTENT_GAP = 107;
const HORIZONTAL_IMAGE_LEFT = PROJECT_INTRO_LEFT + PROJECT_INTRO_WIDTH + CONTENT_GAP;
const HORIZONTAL_MOVE_END = 0.82;
const KOKO_IMAGE = "/assets/home/koko-background.png";
const IMAGE_START_PAGE = 2;
const IMAGE_END_PAGE = 14;
const PAGE_ASPECT_WIDTH = 2400;
const PAGE_ASPECT_HEIGHT = 1695;
const TEXT_GROUP_WIDTH_FOR_SCROLL = 924;
const coverPage = {
  number: 1,
  src: "/assets/projects/koko/pages/page-001.png",
};

const metadata = [
  ["制作形式", "グループ課題制作"],
  ["制作時期", "2年　後期"],
  ["制作期間", "2ヶ月"],
  ["使用ツール", "Figma\nIllustrator / Photoshop\nHTML / CSS / JS\nMapLibre GL / Supabase"],
  ["", ""],
  ["AI補助", "Codex"],
];

const imagePages = Array.from({ length: IMAGE_END_PAGE - IMAGE_START_PAGE + 1 }, (_, index) => {
  const pageNumber = IMAGE_START_PAGE + index;

  return {
    id: `koko-image-page-${pageNumber}`,
    number: pageNumber,
    src: `/assets/projects/koko/pages/page-${String(pageNumber).padStart(3, "0")}.png`,
  };
});

function usePointerParallax(ref) {
  useEffect(() => {
    let frameId = null;
    const current = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };

    const updateTarget = (event) => {
      const halfWidth = window.innerWidth / 2 || 1;
      const halfHeight = window.innerHeight / 2 || 1;
      target.x = ((event.clientX - halfWidth) / halfWidth) * 7;
      target.y = ((event.clientY - halfHeight) / halfHeight) * 3;
    };

    const resetTarget = () => {
      target.x = 0;
      target.y = 0;
    };

    const tick = () => {
      current.x = mix(current.x, target.x, 0.075);
      current.y = mix(current.y, target.y, 0.075);

      if (ref.current) {
        ref.current.style.setProperty("--koko-bg-x", `${current.x}px`);
        ref.current.style.setProperty("--koko-bg-y", `${current.y}px`);
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
  }, [ref]);
}

function KokoChrome() {
  return (
    <PortfolioChrome
      ariaLabel="KOKO page navigation"
      classNames={{
        header: "koko-chrome",
        navigation: "koko-nav",
        version: "koko-version",
        versionBox: "koko-version-box",
      }}
    />
  );
}

function KokoImageCrop({ className = "" }) {
  return (
    <div className={`koko-image-crop ${className}`}>
      <img alt="" src={KOKO_IMAGE} />
    </div>
  );
}

function KokoMetadata() {
  return (
    <dl className="koko-metadata">
      {metadata.map(([label, value], index) => (
        <div className="koko-metadata-row" key={`${label}-${index}`}>
          <dt>{label}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  );
}

function KokoImageReadingSection() {
  return (
    <section className="koko-image-reading-section" aria-label="KOKO UI portfolio pages">
      <div className="koko-image-page-list">
        {imagePages.map((page, index) => (
          <article className="koko-work-page-frame koko-image-page" key={page.id}>
            <img
              alt={`KOKO UI page ${page.number}`}
              decoding="async"
              fetchPriority={index < 2 ? "high" : "auto"}
              loading={index < 2 ? "eager" : "lazy"}
              src={page.src}
            />
          </article>
        ))}
      </div>
    </section>
  );
}

export default function Koko() {
  const sectionRef = useRef(null);
  const backgroundRef = useRef(null);
  const { scale, viewportHeight, viewportWidth } = useStageMetrics(DESIGN_WIDTH, DESIGN_HEIGHT);
  const progress = useScrollProgress(sectionRef, { easing: 0.09, smooth: true, viewportHeight });

  usePointerParallax(backgroundRef);

  const safeScale = Math.max(scale, 0.0001);
  const pageFrameViewportWidth = Math.min(viewportWidth, viewportHeight * (PAGE_ASPECT_WIDTH / PAGE_ASPECT_HEIGHT));
  const pageFrameViewportHeight = pageFrameViewportWidth * (PAGE_ASPECT_HEIGHT / PAGE_ASPECT_WIDTH);
  const pageFrameDesignWidth = pageFrameViewportWidth / safeScale;
  const pageFrameDesignHeight = pageFrameViewportHeight / safeScale;
  const pageFrameTop = (DESIGN_HEIGHT - pageFrameDesignHeight) / 2;
  const pageFrameBottom = pageFrameTop + pageFrameDesignHeight;
  const infoBottom = Math.max(DESIGN_HEIGHT - pageFrameBottom + 74, 48);
  const pageFrameViewportLeft = Math.max((viewportWidth - pageFrameViewportWidth) / 2, 0);
  const pageFrameDesignLeft = HORIZONTAL_IMAGE_LEFT;
  const trackDesignWidth = pageFrameDesignLeft + pageFrameDesignWidth + pageFrameViewportLeft / safeScale;
  const trackWidth = trackDesignWidth * scale;
  const maxTranslate = Math.max(trackWidth - viewportWidth, 0);
  const moveProgress = Math.min(progress / HORIZONTAL_MOVE_END, 1);
  const translateX = -maxTranslate * moveProgress;
  const scrollDistance = maxTranslate + TEXT_GROUP_WIDTH_FOR_SCROLL * scale;
  const scrollHeight = viewportHeight + scrollDistance * 1.34 + viewportHeight * 0.45;

  return (
    <main className="koko-project-page">
      <div className="koko-fixed-background" ref={backgroundRef} aria-hidden="true">
        <KokoImageCrop />
        <div className="koko-mask koko-mask-exclusion" />
        <div className="koko-mask koko-mask-light" />
      </div>
      <KokoChrome />

      <section className="koko-horizontal-section" ref={sectionRef} style={{ height: `${scrollHeight}px` }}>
        <div className="koko-sticky-stage">
          <div
            className="koko-design-shell"
            style={{
              height: `${DESIGN_HEIGHT * scale}px`,
              transform: `translate3d(${translateX}px, 0, 0)`,
              width: `${trackWidth}px`,
            }}
          >
            <div
              className="koko-design-stage"
              style={{
                "--koko-info-bottom": `${infoBottom}px`,
                "--koko-page-left": `${pageFrameDesignLeft}px`,
                transform: `scale(${scale})`,
                width: `${trackDesignWidth}px`,
              }}
            >
              <div className="koko-main-visual">
                <KokoImageCrop />
              </div>

              <div className="koko-main-copy koko-difference">
                <p className="koko-date">2026.5</p>
                <h1>
                  <span>KOKO</span>
                  <span>身体感覚を記録する地図</span>
                </h1>
                <p className="koko-type">UI/UX / Interaction Prototype</p>
              </div>

              <div className="koko-project-intro koko-difference">
                <p>
                  KOKOは、日常の場所を感覚のテクスチャーとして記録するモバイル地図プロトタイプです。
                </p>
                <p>
                  ユーザーはその場で10秒間長押しし、音・移動状態・時間帯・感覚語を記録します。記録はピンではなく、地図表面に沈着する点と線として現れます。
                </p>
              </div>

              <KokoMetadata />

              <div
                className="koko-work-page-frame koko-horizontal-image-page"
                style={{
                  height: `${pageFrameDesignHeight}px`,
                  left: `${pageFrameDesignLeft}px`,
                  top: `${pageFrameTop}px`,
                  width: `${pageFrameDesignWidth}px`,
                }}
              >
                <img alt={`KOKO UI page ${coverPage.number}`} src={coverPage.src} />
              </div>
            </div>
          </div>
        </div>
      </section>
      <KokoImageReadingSection />
    </main>
  );
}
