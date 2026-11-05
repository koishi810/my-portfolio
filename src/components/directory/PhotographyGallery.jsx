import FullscreenImage from "../projects/FullscreenImage.jsx";
import { revealKeyboardImage } from "./IllustrationGallery.jsx";
import { photographs } from "../../data/photographs.js";

// A portrait interlocks with two landscapes; alternate the seams.
const groups = [
  ["roof-sky", "water-lines", "gull-hand"],
  ["vehicle-cables", "bicycle-leaves", "playground-rails"],
  ["snow-light", "building-corridor", "flowers-wheel"],
  ["lantern-signs", "pipe-joint", "slope-sign"],
  ["lamp-branches", "boat-water", "dogs-leaves"],
  ["figure-railing", "slide-buildings"],
];
const byId = new Map(photographs.map(item => [item.id, item]));

export default function PhotographyGallery() {
  return <div className="directory-photo-mosaic">
    {groups.map((ids, index) => <div key={ids[0]} className={`directory-photo-group ${ids.length === 2 ? "directory-photo-pair" : ""} ${index % 2 ? "directory-photo-reversed" : ""}`}>
      {ids.map(id => { const item = byId.get(id); return <figure key={id} className={`directory-photo-record directory-photo-${id}`}>
        <FullscreenImage src={item.src} alt={item.alt} width={item.width} height={item.height} loading="lazy" decoding="async" onKeyboardReveal={revealKeyboardImage} />
      </figure>; })}
    </div>)}
  </div>;
}
