import PortfolioChrome from "../../components/PortfolioChrome.jsx";
import FullscreenImage from "../../components/projects/FullscreenImage.jsx";
import useMatryoshkaNavigationFade from "../../hooks/useMatryoshkaNavigationFade.js";
import { matryoshkaCover, matryoshkaMetadata, matryoshkaParagraphs, matryoshkaPhotoGroups, matryoshkaProject } from "../../data/matryoshka.js";
import "../../styles/matryoshka-project.css";

function revealKeyboardPhotograph(event) {
  const image = event.currentTarget;
  if ((event.type !== "keydown" && !image.matches(":focus-visible")) || event.relatedTarget?.closest(".project-image-dialog")) return;
  const bounds = image.getBoundingClientRect();
  const clearTop = Math.min(window.innerHeight / 3, window.innerWidth <= 700 ? 112 : 104);
  const availableHeight = window.innerHeight - clearTop;
  const top = window.scrollY + bounds.top - clearTop - Math.max((availableHeight - bounds.height) / 2, 0);
  // Resolve keyboard focus before an immediate Enter; pointer and dialog-return
  // focus retain their existing scroll position.
  window.scrollTo({ left: window.scrollX, top, behavior: "instant" });
}

export default function Matryoshka() {
  const pageRef = useMatryoshkaNavigationFade();

  return (
    <main className="matryoshka-project-page" ref={pageRef}>
      <div className="matryoshka-fixed-background" aria-hidden="true" />
      <PortfolioChrome
        ariaLabel="マッチ page navigation"
        classNames={{
          header: "matryoshka-chrome",
          navigation: "matryoshka-nav",
          version: "matryoshka-version",
          versionBox: "matryoshka-version-box",
        }}
      />
      <section className="matryoshka-hero" aria-labelledby="matryoshka-title">
        <div className="matryoshka-heading">
          <p className="matryoshka-date">{matryoshkaProject.date}</p>
          <h1 id="matryoshka-title">{matryoshkaProject.title}</h1>
          <p className="matryoshka-type">{matryoshkaProject.type}</p>
        </div>
        <figure className="matryoshka-cover">
          <FullscreenImage
            onFocus={revealKeyboardPhotograph} onKeyboardReveal={revealKeyboardPhotograph}
            alt={matryoshkaCover.alt}
            decoding="async"
            fetchPriority="high"
            height={matryoshkaCover.height}
            src={matryoshkaCover.src}
            width={matryoshkaCover.width}
          />
        </figure>
      </section>
      <section className="matryoshka-information" aria-label="作品情報">
        <dl className="matryoshka-metadata">
          {matryoshkaMetadata.map(([label, value]) => (
            <div className="matryoshka-metadata-row" key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
        {matryoshkaParagraphs.length ? (
          <div className="matryoshka-intro">
            {matryoshkaParagraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
        ) : null}
      </section>
      <section className="matryoshka-gallery" aria-label="マッチ 作品写真">
        {matryoshkaPhotoGroups.map((group) => (
          <div
            className={`matryoshka-gallery-group matryoshka-gallery-group-${group.layout}`}
            key={group.id}
            role="group"
            aria-label={group.label}
          >
            {group.images.map((item) => (
              <figure className="matryoshka-photograph" key={item.id}>
                <FullscreenImage
                  onFocus={revealKeyboardPhotograph} onKeyboardReveal={revealKeyboardPhotograph}
                  alt={item.alt}
                  decoding="async"
                  height={item.height}
                  loading="lazy"
                  src={item.src}
                  width={item.width}
                />
              </figure>
            ))}
          </div>
        ))}
      </section>
      <a className="matryoshka-back-link" href="/works#category-other">ALL WORKS ↗</a>
    </main>
  );
}
