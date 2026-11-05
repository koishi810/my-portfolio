import SiteAnchor from "../../components/SiteAnchor.jsx";
import { useRef } from "react";
import PortfolioChrome from "../../components/PortfolioChrome.jsx";
import FullscreenImage from "../../components/projects/FullscreenImage.jsx";
import useArcticNavigationFade from "../../hooks/useArcticNavigationFade.js";
import { useScrollProgress, useStageMetrics } from "../../hooks/useScrollProgress.js";
import { arcticLabAlbum, arcticLabBackground, arcticLabImages, arcticLabLeaveAlbum, arcticLabMaterials, arcticLabMetadata, arcticLabProject, arcticLabTarot } from "../../data/arcticLab.js";
import "../../styles/arctic-lab-project.css";

const DESIGN_WIDTH = 1440;
const DESIGN_HEIGHT = 905;
const SERIES_INFO_LEFT = 1896;
const SERIES_INFO_RIGHT = 2344.59 + 357;
const HORIZONTAL_MOVE_END = 0.82;

function ArcticChrome() {
  return (
    <PortfolioChrome
      ariaLabel="ARCTIC LAB page navigation"
      classNames={{
        header: "arctic-chrome",
        navigation: "arctic-nav",
        version: "arctic-version",
        versionBox: "arctic-version-box",
      }}
    />
  );
}

function revealKeyboardAlbumImage(event) {
  const image = event.currentTarget;
  if ((event.type !== "keydown" && !image.matches(":focus-visible")) || event.relatedTarget?.closest(".project-image-dialog")) return;
  const bounds = image.getBoundingClientRect();
  const clearTop = Math.min(window.innerHeight / 3, window.innerWidth <= 700 ? 112 : 104);
  const availableHeight = window.innerHeight - clearTop;
  const top = window.scrollY + bounds.top - clearTop - Math.max((availableHeight - bounds.height) / 2, 0);
  // These images are in the vertical reading section. Do not move any inner
  // horizontal stage, or recenter pointer/dialog-return focus.
  window.scrollTo({ left: window.scrollX, top, behavior: "instant" });
}

function ArcticImage({ item, className = "", style, priority = false }) {
  return (
    <figure
      className={`arctic-image ${className}${item.src ? "" : " arctic-image-pending"}`}
      style={{ "--arctic-image-ratio": `${item.width} / ${item.height}`, ...style }}
    >
      <div className="arctic-image-surface">
        {item.src ? (
          <FullscreenImage
            onFocus={revealKeyboardAlbumImage} onKeyboardReveal={revealKeyboardAlbumImage}
            alt={item.alt}
            decoding="async"
            fetchPriority={priority ? "high" : "auto"}
            height={item.height}
            loading={priority ? "eager" : "lazy"}
            src={item.src}
            width={item.width}
          />
        ) : (
          <div className="arctic-placeholder">
            <span className="arctic-placeholder-index">{item.label}</span>
            <p>画像準備中</p>
          </div>
        )}
      </div>
      {item.caption ? <figcaption>{item.caption}</figcaption> : null}
    </figure>
  );
}

export default function ArcticLab() {
  const pageRef = useArcticNavigationFade();
  const sectionRef = useRef(null);
  const { scale, viewportHeight, viewportWidth } = useStageMetrics(DESIGN_WIDTH, DESIGN_HEIGHT);
  const progress = useScrollProgress(sectionRef, { easing: 0.09, smooth: true, viewportHeight });
  const safeScale = Math.max(scale, 0.0001);
  // clientWidth includes the hidden scrollbar gutter while a dialog is open.
  // Use the painted layout width so opening it cannot grow the scroll scene.
  const contentWidth = typeof document === "undefined" ? viewportWidth : document.documentElement.getBoundingClientRect().width;
  const imageRatio = arcticLabImages[0].width / arcticLabImages[0].height;
  const imageViewportWidth = Math.min(viewportWidth * 0.86, viewportHeight * 0.8 * imageRatio);
  const seriesInfoViewportWidth = (SERIES_INFO_RIGHT - SERIES_INFO_LEFT) * scale;
  const seriesInfoViewportLeft = Math.max((contentWidth - seriesInfoViewportWidth) / 2, 0);
  const seriesTrackDesignWidth = SERIES_INFO_RIGHT + seriesInfoViewportLeft / safeScale;
  const transitionDesignWidth = contentWidth / safeScale;
  const transitionDesignHeight = viewportHeight / safeScale;
  const trackDesignWidth = seriesTrackDesignWidth + transitionDesignWidth;
  const trackWidth = trackDesignWidth * scale;
  const maxTranslate = Math.max(trackWidth - contentWidth, 0);
  const translateX = -maxTranslate * Math.min(progress / HORIZONTAL_MOVE_END, 1);
  const scrollHeight = viewportHeight + (maxTranslate + 924 * scale) * 1.34 + viewportHeight * 0.45;

  return (
    <main className="arctic-project-page" ref={pageRef}>
      <div className="arctic-fixed-background" aria-hidden="true">
        <img alt="" src={arcticLabBackground} />
      </div>
      <ArcticChrome />

      <section
        className="arctic-horizontal-section"
        ref={sectionRef}
        style={{ "--arctic-scroll-height": `${scrollHeight}px` }}
      >
        <div className="arctic-sticky-stage">
          <div
            className="arctic-design-shell"
            style={{
              "--arctic-stage-height": `${DESIGN_HEIGHT * scale}px`,
              "--arctic-translate-x": `${translateX}px`,
              "--arctic-track-width": `${trackWidth}px`,
            }}
          >
            <div
              className="arctic-design-stage"
              style={{ "--arctic-stage-scale": scale, "--arctic-design-width": `${trackDesignWidth}px` }}
            >
              <div className="arctic-main-visual" aria-hidden="true">
                <img className="arctic-hero-art" alt="" src={arcticLabBackground} />
                <img className="arctic-hero-logo" alt="" src={arcticLabProject.image} />
              </div>

              <div className="arctic-main-copy">
                <p className="arctic-date">{arcticLabProject.date}</p>
                <h1>
                  <span>{arcticLabProject.title}</span>
                  {arcticLabProject.subtitle ? <span>{arcticLabProject.subtitle}</span> : null}
                </h1>
                <p className="arctic-type">{arcticLabProject.type}</p>
              </div>

              <dl className="arctic-metadata">
                {arcticLabMetadata.map(([label, value]) => (
                  <div className="arctic-metadata-row" key={label}>
                    <dt>{label}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>

              <div className="arctic-project-intro">
                {arcticLabProject.description.split("\n\n").map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>

              <div
                className="arctic-horizontal-transition"
                aria-label="Arctic Lab ロゴ"
                style={{
                  "--arctic-transition-left": `${seriesTrackDesignWidth}px`,
                  "--arctic-transition-top": `${(DESIGN_HEIGHT - transitionDesignHeight) / 2}px`,
                  "--arctic-transition-width": `${transitionDesignWidth}px`,
                  "--arctic-transition-height": `${transitionDesignHeight}px`,
                }}
              >
                <div className="arctic-logo-study">
                  <h2>Logo</h2>
                  <div className="arctic-logo-variants">
                    {[["wordmark", "ロゴタイプ"], ["symbol", "シンボルマーク"], ["combination", "組み合わせ"]].map(([kind, label]) => <figure key={kind}>
                      <FullscreenImage src={`/assets/projects/arctic-lab/logo-${kind}.png`} alt={`Arctic Lab：${label}`} width="2048" height="2048" loading="lazy" decoding="async" />
                      <figcaption>{label}</figcaption>
                    </figure>)}
                  </div>
                  <div className="arctic-logo-concept">
                    <p>「Arctic」から連想する、生命や感情を感じさせない無機質なイメージを、void（虚無）に重ねました。北極圏の「圏」を円として捉え、voidと組み合わせることで、星の死を想起させるブラックホールへと発想を広げています。さらに、頭文字の「A」と北極のイメージから氷山の形を導きました。この二つのモチーフをもとに、「Lab」の前衛的で実験的な印象をロゴに表現しています。</p>
                    <div className="arctic-logo-references" aria-label="発想の参考イメージ">
                      <FullscreenImage src="/assets/projects/arctic-lab/concept-black-hole.webp" alt="ブラックホールの参考イメージ" loading="lazy" decoding="async" />
                      <FullscreenImage src="/assets/projects/arctic-lab/concept-iceberg.jpg" alt="氷山の参考イメージ" width="640" height="960" loading="lazy" decoding="async" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        className="arctic-reading-section"
        aria-label="アルバムアートワーク"
        style={{ "--arctic-reading-width": `${imageViewportWidth}px` }}
      >
        <div className="arctic-image-list">
          <div className="arctic-album-intro">
            <h2 id="arctic-leave-album-title">{arcticLabLeaveAlbum.title}</h2>
            {arcticLabLeaveAlbum.paragraphs.length ? (
              arcticLabLeaveAlbum.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)
            ) : (
              <div className="arctic-album-copy-space" aria-hidden="true" />
            )}
          </div>
          {arcticLabLeaveAlbum.images.map((item, index) => <ArcticImage item={item} key={item.id} priority={index === 0} />)}
          <div className="arctic-album-intro">
            <h2 id="arctic-album-title">{arcticLabAlbum.title}</h2>
            {arcticLabAlbum.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
          {arcticLabImages.map((item, index) => <ArcticImage item={item} key={item.id} priority={index === 0} />)}
          <div className="arctic-album-intro">
            <h2 id="arctic-photograph-title">{arcticLabAlbum.photographTitle}</h2>
          </div>
          <div className="arctic-image-pair" role="group" aria-labelledby="arctic-photograph-title">
            {arcticLabAlbum.photographs.map((item) => <ArcticImage item={item} key={item.id} />)}
          </div>
          <div className="arctic-album-intro">
            <h2 id="arctic-materials-title">{arcticLabMaterials.title}</h2>
            <p>{arcticLabMaterials.description}</p>
          </div>
          <div className="arctic-tarot-grid" role="group" aria-labelledby="arctic-materials-title">
            {arcticLabTarot.map((item) => <ArcticImage item={item} key={item.id} />)}
          </div>
          <div className="arctic-album-intro">
            <h2 id="arctic-tarot-photograph-title">実物イメージ</h2>
          </div>
          <div className="arctic-image-pair" role="group" aria-labelledby="arctic-tarot-photograph-title">
            {arcticLabMaterials.photographs.map((item) => <ArcticImage item={item} key={item.id} />)}
          </div>
        </div>
        <SiteAnchor className="arctic-back-link" href="/works">ALL WORKS ↗</SiteAnchor>
      </section>
    </main>
  );
}
