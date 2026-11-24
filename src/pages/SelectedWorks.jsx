import SiteAnchor from "../components/SiteAnchor.jsx";
import FullscreenImage from "../components/projects/FullscreenImage.jsx";
import { portfolioSheets } from "../data/portfolioSheets.js";
import "../styles/selected-works.css";

export default function SelectedWorks() {
  return <div className="selected-page folio-document">
    <header className="selected-header"><SiteAnchor href="/">LU YUFAN ／ 陸 昱帆</SiteAnchor><nav aria-label="作品集ナビゲーション"><a href="#arctic-lab">ARCTICLAB</a><a href="#koko">KOKO</a><a href="#flower-machine">花のマシン</a><SiteAnchor href="/works">すべての作品</SiteAnchor><button type="button" onClick={() => window.print()}>印刷 / PDF保存</button><a href={`${import.meta.env.BASE_URL}assets/LUYUFAN-portfolio.pdf`} download>PDFをダウンロード ↓</a></nav></header>
    <main>{portfolioSheets.map((sheet,index)=><article className={`folio-sheet ${sheet.kind||""} ${sheet.section.includes("ARCTICLAB")?"folio-arctic":sheet.section.includes("KOKO")?"folio-koko":sheet.section.includes("FLOWER")?"folio-flower":""}`} id={sheet.id} key={index}>
      <div className="folio-topline"><span>{sheet.section}</span><span>LU YUFAN ／ PORTFOLIO</span></div>
      <div className="folio-heading"><h1>{sheet.title}</h1>{sheet.subtitle?<p className="folio-subtitle">{sheet.subtitle}</p>:null}</div>
      <p className="folio-copy">{sheet.text}</p>
      {sheet.contents?<nav className="folio-contents"><a href="#arctic-lab"><b>01 ARCTICLAB</b><span>アルバム・ロゴ・紙面 ／ 03–10</span></a><a href="#koko"><b>02 KOKO</b><span>UI/UX・制作資料 ／ 11–19</span></a><a href="#flower-machine"><b>03 きもち de フラワーマシン</b><span>仕組み・生成・展示 ／ 20–27</span></a><p>OTHER WORKS ／ Sugarⁿ・遊具の色標本　28–29<br/>CONTACT　30</p></nav>:null}
      {sheet.flow?<ol className="folio-flow">{sheet.flow.map(step=><li key={step}>{step}</li>)}</ol>:null}
      {sheet.images?<div className={`folio-images count-${sheet.images.length}`}>{sheet.images.map(image=><figure key={image.src}><FullscreenImage src={image.src} alt={image.alt} loading="eager" decoding="async"/><figcaption>{image.alt}</figcaption></figure>)}</div>:null}
      {sheet.contact?<div className="folio-contact"><a href="mailto:koishi810@gmail.com">koishi810@gmail.com</a><a href="https://koishi810.github.io/my-portfolio/selected/">koishi810.github.io/my-portfolio/selected/</a><SiteAnchor href="/works">すべての作品 →</SiteAnchor><SiteAnchor href="/about">プロフィール →</SiteAnchor></div>:null}
      <div className="folio-bottom"><div>{sheet.note?<p>{sheet.note}</p>:null}{sheet.video?<a href={sheet.video} target="_blank" rel="noopener noreferrer">展示映像を見る ↗</a>:null}{sheet.href?<SiteAnchor href={sheet.href}>元の作品詳細・全資料を見る ↗</SiteAnchor>:null}</div><span>{String(index+1).padStart(2,"0")} / {portfolioSheets.length}</span></div>
    </article>)}</main>
  </div>;
}
