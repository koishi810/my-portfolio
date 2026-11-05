import FullscreenImage from "../projects/FullscreenImage.jsx";
import { revealKeyboardImage } from "./IllustrationGallery.jsx";
import { smallWorks } from "../../data/smallWorks.js";

export default function SmallWorksGallery() {
  if (!smallWorks.length) return null;
  return <div className="directory-illustration-gallery directory-small-works-gallery">
    {smallWorks.map(item => <figure className={`directory-illustration-item${item.treatment ? ` directory-small-work-${item.treatment}` : ""}`} key={item.id}>
      <FullscreenImage className="directory-illustration-image" src={item.src} alt={item.alt}
        width={item.width} height={item.height} loading="lazy" decoding="async"
        onKeyboardReveal={revealKeyboardImage} />
      {item.title || item.type || item.thought ? <figcaption>
        {item.title ? <h3>{item.title}</h3> : null}
        {item.type ? <p>{item.type}</p> : null}
        {item.thought ? <p>{item.thought}</p> : null}
      </figcaption> : null}
    </figure>)}
  </div>;
}
