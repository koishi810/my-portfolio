import FullscreenImage from "../projects/FullscreenImage.jsx";
import { illustrations } from "../../data/illustrations.js";

export function revealKeyboardImage(event) {
  const bounds = event.currentTarget.getBoundingClientRect();
  const heading = event.currentTarget.closest(".directory-category").querySelector(".directory-results-title");
  const style = window.getComputedStyle(heading);
  const headingEdge = style.position === "sticky" ? parseFloat(style.top) + heading.offsetHeight + 18 + (window.innerWidth <= 700 ? 40 : 28) : 0;
  const safeTop = Math.max(headingEdge, Math.min(window.innerHeight / 3, window.innerWidth <= 700 ? 124 : 104));
  window.scrollBy({ top: bounds.top - safeTop, behavior: "instant" });
}

export default function IllustrationGallery() {
  return (
    <div className="directory-illustration-gallery">
      {illustrations.map((item) => (
        <figure className="directory-illustration-item" key={item.id}>
          <FullscreenImage
            className="directory-illustration-image"
            src={item.src} alt={item.alt} width={item.width} height={item.height}
            loading="lazy" decoding="async" onKeyboardReveal={revealKeyboardImage}
          />
          {item.notes.length ? <figcaption>{item.notes.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</figcaption> : null}
        </figure>
      ))}
    </div>
  );
}
