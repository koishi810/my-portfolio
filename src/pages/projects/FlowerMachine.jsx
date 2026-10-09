import { useEffect, useRef } from "react";
import PortfolioChrome from "../../components/PortfolioChrome.jsx";
import { mix, useScrollProgress, useStageMetrics, useWidthScale } from "../../hooks/useScrollProgress.js";
import "../../styles/flower-machine-project.css";

const DESIGN_WIDTH = 1440;
const DESIGN_HEIGHT = 905;
const DETAIL_WIDTH = 2785;
const EXHIBITION_WIDTH = 1322;
const READING_WIDTH = 1322;
const READING_HEIGHT = 2691;
const INTRO_LEFT = 2344.59;
const INTRO_WIDTH = 357;
const META_LEFT = 1896;
const EXHIBITION_LEFT = DETAIL_WIDTH;
const HORIZONTAL_END = 0.82;
const ASSET_BASE = "/assets/projects/flower-machine";
const FLOWER_VIDEO_ID = "FgfBgGANDt0";

const metadata = [
  ["制作形式", "グループ課題制作"],
  ["制作時期", "2年　後期"],
  ["制作期間", "2ヶ月"],
  ["使用ツール", "Processing /\nNode.js / MediaPipe"],
  ["担当範囲", "実装 / 撮影 / 発表資料制作"],
  ["制作補助", "Claude Code"],
];

const feelings = [
  { label: "喜び", files: ["feeling-05.png", "feeling-10.png", "feeling-12.png", "feeling-17.png"], className: "flower-feeling-joy" },
  { label: "高揚", files: ["feeling-34.png", "feeling-36.png"], className: "flower-feeling-high" },
  { label: "悲しみ", files: ["feeling-23.png", "feeling-29.png"], className: "flower-feeling-sad" },
  { label: "驚き", files: ["feeling-42.png", "feeling-45.png"], className: "flower-feeling-surprise" },
  { label: "怒り", files: ["feeling-47.png", "feeling-50.png"], className: "flower-feeling-angry" },
  { label: "嫌悪", files: ["feeling-53.png", "feeling-60.png"], className: "flower-feeling-disgust" },
  { label: "怖れ", files: ["feeling-62.png", "feeling-65.png"], className: "flower-feeling-fear" },
  { label: "無表情", files: ["feeling-75.png", "feeling-78.png"], className: "flower-feeling-neutral" },
];

function usePointerParallax(ref) {
  useEffect(() => {
    let frameId = null;
    const current = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };

    const updateTarget = (event) => {
      const halfWidth = window.innerWidth / 2 || 1;
      const halfHeight = window.innerHeight / 2 || 1;
      target.x = ((event.clientX - halfWidth) / halfWidth) * 5;
      target.y = ((event.clientY - halfHeight) / halfHeight) * 2;
    };

    const resetTarget = () => {
      target.x = 0;
      target.y = 0;
    };

    const tick = () => {
      current.x = mix(current.x, target.x, 0.07);
      current.y = mix(current.y, target.y, 0.07);

      if (ref.current) {
        ref.current.style.setProperty("--flower-bg-x", `${current.x}px`);
        ref.current.style.setProperty("--flower-bg-y", `${current.y}px`);
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

function FlowerChrome() {
  return (
    <PortfolioChrome
      ariaLabel="Flower Machine page navigation"
      classNames={{
        header: "flower-chrome",
        navigation: "flower-nav",
        version: "flower-version",
        versionBox: "flower-version-box",
      }}
    />
  );
}

function FlowerBackground({ backgroundRef }) {
  return (
    <div className="flower-fixed-background" ref={backgroundRef} aria-hidden="true">
      <div className="flower-blue-background" />
      <div className="flower-mask flower-mask-exclusion" />
      <div className="flower-mask flower-mask-light" />
    </div>
  );
}

function FlowerFrameBackdrop({ className = "" }) {
  return (
    <div className={`flower-frame-backdrop ${className}`} aria-hidden="true">
      <div className="flower-frame-blue" />
      <div className="flower-frame-mask flower-frame-mask-exclusion" />
      <div className="flower-frame-mask flower-frame-mask-light" />
    </div>
  );
}

function LogoVisual({ className = "" }) {
  return (
    <div className={`flower-logo-visual ${className}`}>
      <img alt="" src={`${ASSET_BASE}/logo.png`} />
    </div>
  );
}

function FlowerVideo({ className = "" }) {
  return (
    <iframe
      allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
      className={`flower-video ${className}`}
      loading="lazy"
      referrerPolicy="strict-origin-when-cross-origin"
      src={`https://www.youtube.com/embed/${FLOWER_VIDEO_ID}?rel=0&modestbranding=1&playsinline=1`}
      title="Flower Machine video"
    />
  );
}

function FlowerMetadata() {
  return (
    <dl className="flower-metadata">
      {metadata.map(([label, value]) => (
        <div className="flower-metadata-row" key={label}>
          <dt>{label}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  );
}

function FlowerIntroText() {
  return (
    <div className="flower-project-intro flower-difference">
      <p>本作品は、カメラで取得した表情の変化をもとに、花のかたちや天気の状態を生成するインタラクティブ作品です。</p>
      <p>笑顔、驚き、怒り、悲しみなどの感情を読み取り、その状態に応じて花びらの種類、数、開き方、動きが変化します。</p>
      <p>さらに天気記号と音声を重ねることで、感情がひとつの小さな風景として立ち上がるように制作しました。</p>
    </div>
  );
}

function FlowerFirstSection() {
  const sectionRef = useRef(null);
  const { scale, viewportHeight, viewportWidth } = useStageMetrics(DESIGN_WIDTH, DESIGN_HEIGHT);
  const progress = useScrollProgress(sectionRef, { easing: 0.09, smooth: true, viewportHeight });

  const safeScale = Math.max(scale, 0.0001);
  const exhibitionViewportWidth = EXHIBITION_WIDTH * scale;
  const exhibitionViewportLeft = Math.max((viewportWidth - exhibitionViewportWidth) / 2, 0);
  const trackDesignWidth = DETAIL_WIDTH + EXHIBITION_WIDTH + exhibitionViewportLeft / safeScale;
  const trackWidth = trackDesignWidth * scale;
  const maxTranslate = Math.max(trackWidth - viewportWidth, 0);
  const translateX = -maxTranslate * Math.min(progress / HORIZONTAL_END, 1);
  const scrollHeight = viewportHeight + maxTranslate * 1.34 + viewportHeight * 0.45;

  return (
    <section className="flower-horizontal-section" ref={sectionRef} style={{ height: `${scrollHeight}px` }}>
      <div className="flower-sticky-stage">
        <div
          className="flower-design-shell"
          style={{
            height: `${DESIGN_HEIGHT * scale}px`,
            transform: `translate3d(${translateX}px, 0, 0)`,
            width: `${trackWidth}px`,
          }}
        >
          <div
            className="flower-design-stage"
            style={{
              transform: `scale(${scale})`,
              width: `${trackDesignWidth}px`,
            }}
          >
            <div className="flower-detail-frame">
              <FlowerFrameBackdrop />
            </div>
            <div className="flower-hero-blue-panel" />
            <LogoVisual className="flower-hero-logo" />

            <div className="flower-main-copy flower-difference">
              <p className="flower-date">2025.09~2025.11</p>
              <h1>きもち de フラワーマシン</h1>
              <p className="flower-type">Interactive Installation / Visual System</p>
            </div>

            <FlowerMetadata />
            <FlowerIntroText />

            <div className="flower-horizontal-exhibition-frame">
              <FlowerFrameBackdrop />
              <div className="flower-horizontal-exhibition-copy flower-difference">
                <h2>展示風景</h2>
                <p>映像は、出演者本人の同意を得たうえで掲載しています。</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FlowerFeelingCluster() {
  return (
    <div className="flower-feeling-cluster" aria-label="Generated flower examples">
      {feelings.map((group) => (
        <figure className={`flower-feeling-group ${group.className}`} key={group.label}>
          <div className="flower-feeling-images">
            {group.files.map((file, index) => (
              <img alt="" key={file} src={`${ASSET_BASE}/${file}`} style={{ "--flower-rotate": `${index % 2 ? 8 : -6}deg` }} />
            ))}
          </div>
          <figcaption>{group.label}</figcaption>
        </figure>
      ))}
    </div>
  );
}

function FlowerWeatherCluster() {
  return (
    <div className="flower-weather-cluster" aria-label="Weather symbol examples">
      <img className="flower-weather-sun" alt="" src={`${ASSET_BASE}/weather-sun.gif`} />
      <img className="flower-weather-rain" alt="" src={`${ASSET_BASE}/weather-rain.gif`} />
      <img className="flower-weather-cloud" alt="" src={`${ASSET_BASE}/weather-cloud.gif`} />
      <img className="flower-weather-thunder" alt="" src={`${ASSET_BASE}/weather-thunder.gif`} />
    </div>
  );
}

function FlowerReadingSection() {
  const readingScale = useWidthScale(READING_WIDTH);

  return (
    <section className="flower-reading-section" aria-label="Flower Machine process">
      <div
        className="flower-reading-frame-shell"
        style={{
          height: `${READING_HEIGHT * readingScale}px`,
          width: `${READING_WIDTH * readingScale}px`,
        }}
      >
        <div
          className="flower-reading-frame"
          style={{
            transform: `scale(${readingScale})`,
          }}
        >
          <FlowerFrameBackdrop />
          <div className="flower-reading-logo-band" aria-label="Exhibition video">
            <FlowerVideo />
          </div>
          <div className="flower-reading-black-panel" aria-hidden="true" />

          <article className="flower-reading-copy flower-reading-copy-rules flower-difference">
            <h2>花の生成ルール</h2>
            <p>表情認識によって得られた感情スコアを、花びらの種類、配置、開き方、動きに変換した。</p>
            <p>花は一瞬の表情だけで決まるのではなく、成長中に蓄積された感情の履歴をもとに構成される。</p>
            <p>中心から放射状に花びらを配置し、ノイズによって角度や位置を少しずつずらすことで、規則的でありながら手描きのような揺らぎを持つ花を生成した。</p>
          </article>
          <FlowerFeelingCluster />

          <article className="flower-reading-copy flower-reading-copy-weather flower-difference">
            <h2>感情を天気のかたちに置き換える</h2>
            <p>表情から読み取った感情を、花の変化だけで完結させず、太陽、雨、雲などの天気記号として画面に重ねた。</p>
            <p>喜びは明るい太陽、悲しみは雨、曖昧な状態は雲として表れ、感情の変化がひとつの小さな空模様のように切り替わる。</p>
          </article>
          <FlowerWeatherCluster />
        </div>
      </div>
    </section>
  );
}

export default function FlowerMachine() {
  const backgroundRef = useRef(null);
  usePointerParallax(backgroundRef);

  return (
    <main className="flower-project-page">
      <FlowerBackground backgroundRef={backgroundRef} />
      <FlowerChrome />
      <FlowerFirstSection />
      <FlowerReadingSection />
    </main>
  );
}
