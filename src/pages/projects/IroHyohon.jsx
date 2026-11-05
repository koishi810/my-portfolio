import SiteAnchor from "../../components/SiteAnchor.jsx";
import PortfolioChrome from "../../components/PortfolioChrome.jsx";
import FullscreenImage from "../../components/projects/FullscreenImage.jsx";
import useMatryoshkaNavigationFade from "../../hooks/useMatryoshkaNavigationFade.js";
import { iroHyohonProject as project, iroHyohonCover, iroHyohonStudies, iroHyohonDisplay, iroHyohonProcess } from "../../data/iroHyohon.js";
import "../../styles/matryoshka-project.css";
import "../../styles/iro-hyohon-project.css";

function Photograph({ item, priority = false }) {
  return <figure className="matryoshka-photograph">
    <FullscreenImage src={item.src} alt={item.alt} width={item.width} height={item.height} loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : "auto"} decoding="async" />
  </figure>;
}

export default function IroHyohon() {
  const pageRef = useMatryoshkaNavigationFade();
  return <main className="matryoshka-project-page iro-hyohon-page" ref={pageRef}>
    <div className="matryoshka-fixed-background" aria-hidden="true" />
    <PortfolioChrome ariaLabel="遊具の色標本 page navigation" classNames={{ header: "matryoshka-chrome", navigation: "matryoshka-nav", version: "matryoshka-version", versionBox: "matryoshka-version-box" }} />
    <section className="matryoshka-hero" aria-labelledby="iro-hyohon-title">
      <div className="matryoshka-heading"><h1 id="iro-hyohon-title">{project.title}</h1><p className="matryoshka-type">{project.type}</p></div>
      <div className="matryoshka-cover"><Photograph item={iroHyohonCover} priority /></div>
    </section>
    <section className="matryoshka-information" aria-label="作品情報">
      <dl className="matryoshka-metadata">
        <div className="matryoshka-metadata-row"><dt>課題</dt><dd>色標本</dd></div>
        <div className="matryoshka-metadata-row"><dt>展示</dt><dd>学内の芸術祭にて展示</dd></div>
      </dl>
      <div className="matryoshka-intro"><p>{project.description}</p></div>
    </section>
    <section className="matryoshka-gallery" aria-label="採集した素材と再現した標本">
      {iroHyohonStudies.map(group => <section className="iro-hyohon-study" key={group.id} aria-labelledby={`iro-${group.id}`}>
        <div className="matryoshka-heading"><h2 id={`iro-${group.id}`}>{group.title}</h2></div>
        <div className="matryoshka-gallery-group matryoshka-gallery-group-pair iro-hyohon-comparison">
          {group.images.map((item, index) => <div key={item.src} className={index > 1 ? "iro-hyohon-detail" : ""}>
            <p className="iro-hyohon-image-label">{index === 0 ? "採集した素材" : index === 1 ? "再現した標本" : "ディテール"}</p>
            <Photograph item={item} />
          </div>)}
        </div>
      </section>)}
      <section className="iro-hyohon-study" aria-labelledby="iro-process">
        <div className="matryoshka-heading"><h2 id="iro-process">制作過程</h2></div>
        <div className="matryoshka-intro iro-hyohon-process-copy"><p>{iroHyohonProcess.description}</p></div>
        <div className="matryoshka-gallery-group iro-hyohon-process-grid">{iroHyohonProcess.images.map(item => <Photograph key={item.src} item={item} />)}</div>
      </section>
      <section className="iro-hyohon-study" aria-labelledby="iro-display">
        <div className="matryoshka-heading"><h2 id="iro-display">展示</h2></div>
        <div className="matryoshka-gallery-group matryoshka-gallery-group-pair">{iroHyohonDisplay.map(item => <Photograph key={item.src} item={item} />)}</div>
      </section>
    </section>
    <SiteAnchor className="matryoshka-back-link" href="/works#category-other">ALL WORKS ↗</SiteAnchor>
  </main>;
}
