import SiteAnchor from "../../components/SiteAnchor.jsx";
import PortfolioChrome from "../../components/PortfolioChrome.jsx";
import FullscreenImage from "../../components/projects/FullscreenImage.jsx";
import SugarEntrance from "../../components/projects/SugarEntrance.jsx";
import SugarLogoClip from "../../components/projects/SugarLogoClip.jsx";
import useBackdropTextInk from "../../hooks/useBackdropTextInk.js";
import useSugarNavigationFade from "../../hooks/useSugarNavigationFade.js";
import { sugarProject, sugarIntro, sugarImages, sugarSections, sugarPackageImages, sugarPackageNote, sugarPosters, sugarThoughts } from "../../data/sugarN.js";
import "../../styles/sugar-project.css";

function revealKeyboardPage(event) {
  if ((event.type !== "keydown" && !event.currentTarget.matches(":focus-visible")) || event.relatedTarget?.closest(".project-image-dialog")) return;
  const clip = event.currentTarget.classList.contains("sugar-logo-toggle")
    ? event.currentTarget.closest(".sugar-logo-clip") : null;
  const bounds = (clip || event.currentTarget).getBoundingClientRect();
  const clearTop = Math.min(window.innerHeight / 3, window.innerWidth <= 700 ? 112 : 104);
  if (bounds.top < clearTop || bounds.bottom > window.innerHeight) {
    // A playback control needs its picture in view too. On a short screen,
    // retain the bottom control and as much of the picture as the viewport fits.
    const top = clip ? Math.min(clearTop + 12, window.innerHeight - bounds.height - 12) : clearTop + 12;
    window.scrollBy({ top: bounds.top - top, behavior: "instant" });
  }
}

function SugarImage({ item, cover = false }) {
  return <figure className={cover ? "sugar-cover" : "sugar-photograph"}>
    <FullscreenImage src={item.src} alt={item.alt} width={item.width} height={item.height}
      loading={cover ? "eager" : "lazy"} fetchPriority={cover ? "high" : "auto"} decoding="async"
      onFocus={revealKeyboardPage} onKeyboardReveal={revealKeyboardPage} />
  </figure>;
}

export default function Sn() {
  const pageRef = useSugarNavigationFade();
  useBackdropTextInk(pageRef, ".sugar-heading > *");
  return <main className="sugar-project-page" ref={pageRef}>
    <div className="sugar-fixed-background" aria-hidden="true" />
    <PortfolioChrome ariaLabel="Sugarⁿ page navigation" classNames={{ header: "sugar-chrome", navigation: "sugar-nav", version: "sugar-version", versionBox: "sugar-version-box" }} />
    <SugarEntrance />
    <section className="sugar-information" aria-label="作品情報">
      <dl className="sugar-metadata">
        <div className="sugar-metadata-row"><dt>テーマ</dt><dd>{sugarProject.subtitle}</dd></div>
        <div className="sugar-metadata-row"><dt>制作形態</dt><dd>グループ制作</dd></div>
        <div className="sugar-metadata-row"><dt>制作時期</dt><dd>{sugarProject.date}</dd></div>
        <div className="sugar-metadata-row"><dt>担当</dt><dd>コンセプト設計<br />モデリング<br />プロトタイプ制作<br />グラフィックデザイン</dd></div>
        <div className="sugar-metadata-row"><dt>使用ツール</dt><dd>Photoshop / Illustrator<br />Blender</dd></div>
        <div className="sugar-metadata-row"><dt>AI支援</dt><dd>ChatGPT / Gemini</dd></div>
      </dl>
      <div className="sugar-intro">{sugarIntro.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div>
    </section>
    <div className="sugar-gallery">
      <section className="sugar-gallery-section" aria-labelledby="sugar-logo-title">
        <h2 className="sugar-section-title" id="sugar-logo-title">Logo</h2>
        <p className="sugar-note">この可変ロゴはWebサイトとパッケージで使用し、パッケージごとに異なる図案を展開することを計画しています。</p>
        <p className="sugar-note"><SiteAnchor href="https://koishi810.github.io/sugarn-logo/logo_frame_variants/center_square/" target="_blank" rel="noopener noreferrer" style={{ color: "inherit" }}>可変ロゴのサイトを見る ↗</SiteAnchor></p>
        <SugarImage item={sugarImages.find(item => item.sourcePage === 3)} />
        <div className="sugar-logo-grid">{["01", "02", "03"].map(index => <SugarLogoClip index={index} key={index} onKeyboardReveal={revealKeyboardPage} />)}</div>
      </section>
      {sugarSections.map(section => <section className="sugar-gallery-section" key={section.id} aria-labelledby={`sugar-${section.id}-title`}>
        <h2 className="sugar-section-title" id={`sugar-${section.id}-title`}>{section.title}</h2>
        {sugarImages.filter(item => item.sourcePage >= section.first && item.sourcePage <= section.last).map(item => <SugarImage item={item} key={item.id} />)}
        {section.id === "application" && <div className="sugar-package-details">
          <p className="sugar-note">{sugarPackageNote}</p>
          <div className="sugar-gallery-group sugar-gallery-group-pair">
            {sugarPackageImages.map(item => <SugarImage item={item} key={item.id} />)}
          </div>
        </div>}
      </section>)}
      <section className="sugar-gallery-section" aria-labelledby="sugar-posters-title">
        <h2 className="sugar-section-title" id="sugar-posters-title">ポスター</h2>
        <div className="sugar-poster-grid">{sugarPosters.map(item => <SugarImage item={item} key={item.id} />)}</div>
      </section>
      <section className="sugar-gallery-section sugar-process-notes" aria-labelledby="sugar-process-title">
        <h2 className="sugar-section-title" id="sugar-process-title">制作イメージと思考</h2>
        <div className="sugar-process-copy">{sugarThoughts.map(paragraph => <p className="sugar-note" key={paragraph}>{paragraph}</p>)}</div>
        <div className="sugar-gallery-group sugar-gallery-group-pair">
          {sugarImages.filter(item => item.sourcePage === 12 || item.sourcePage === 13).map(item => <SugarImage item={{ ...item, alt: `${item.alt}（コンセプトイメージ）` }} key={item.id} />)}
        </div>
      </section>
    </div>
    <SiteAnchor className="sugar-back-link" href="/works#category-graphic">ALL WORKS ↗</SiteAnchor>
  </main>;
}
