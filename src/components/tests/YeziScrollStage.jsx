import ScrollImageSequence from "../motion/ScrollImageSequence.jsx";

const yeziSequence = {
  basePath: "/assets/sequences/yezi",
  frameCount: 48,
  extension: "png",
  filenamePattern: "{index:0000}",
};

export default function YeziScrollStage() {
  return (
    <section className="yezi-scroll-section">
      <div className="yezi-sticky-stage">
        <div className="yezi-figma-frame" aria-label="Yezi scroll test">
          <img
            alt=""
            className="yezi-background"
            src="/assets/test/yezi-scroll/figma-bg.png"
          />
          <div className="yezi-mask"></div>
          <div className="yezi-version-box">
            <span>2026.06.09 更新しました　2026.06.09 更新しました　</span>
          </div>
          <ScrollImageSequence
            {...yeziSequence}
            className="yezi-sequence-canvas"
          />

          <div className="yezi-text-content">
            <h1>LU YUFAN</h1>
            <p className="yezi-side-title">PORTFOLIO</p>
            <p className="yezi-discipline">Information Expression / Visual Design / UI/UX</p>
            <div className="yezi-profile-copy">
              <p>漢字の書き方が陸昱帆、日本語での読み方がリク イクハンです</p>
              <p>言葉だけでは捉えきれない感覚を、デザインとしてまとまることに関心があります</p>
              <p>
                情報表現、ビジュアルデザイン、UI/UXを横断しながら、人の想像や行動が入り込める余白をつくり、まだ固定されていない可能性の表現を探し続けています
              </p>
            </div>
          </div>

          <p className="yezi-version">Portfolio ver0.1</p>
          <nav className="yezi-nav" aria-label="Test navigation">
            <span>TOP</span>
            <span>WORK</span>
            <span>ABOUT ME</span>
          </nav>
        </div>
      </div>
    </section>
  );
}
