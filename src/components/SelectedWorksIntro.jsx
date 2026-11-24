import SiteAnchor from "./SiteAnchor.jsx";
import { selectedWorks } from "../data/selectedWorks.js";
import "../styles/selected-works.css";

export default function SelectedWorksIntro() {
  return <section className="selected-intro" aria-labelledby="selected-intro-title">
    <div className="selected-intro-top"><span>LU YUFAN ／ 陸 昱帆</span><SiteAnchor href="/selected">SELECTED WORKS ↗</SiteAnchor></div>
    <div className="selected-intro-heading"><h1 id="selected-intro-title">感覚を、色とかたちで<br />伝える。</h1><p>武蔵野美術大学 基礎デザイン学科<br />代表作3点と制作過程を、30ページにまとめました。</p></div>
    <div className="selected-intro-grid">{selectedWorks.map((work, index) => <SiteAnchor className="selected-intro-card" href={work.href} key={work.id}>
      <div className="selected-intro-image"><img src={work.images[0].src} alt={work.images[0].alt} width={work.images[0].width} height={work.images[0].height}  decoding="async" fetchPriority={index === 0 ? "high" : "auto"} /></div>
      <span className="selected-card-meta">0{index + 1} ／ {work.credit}</span><h2>{work.title}<span aria-hidden="true">↗</span></h2><p>{work.subtitle}</p>
    </SiteAnchor>)}</div>
    <div className="selected-intro-bottom"><SiteAnchor className="selected-action" href="/selected">30ページの作品集を読む <span aria-hidden="true">→</span></SiteAnchor><a href="#original-portfolio">従来のポートフォリオへ ↓</a></div>
  </section>;
}
