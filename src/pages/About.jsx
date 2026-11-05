import DirectoryLayout from "../components/directory/DirectoryLayout.jsx";
import { profile } from "../data/profile.js";

import { softwareGroups } from "../data/software.js";
import SoftwareLevel from "../components/directory/SoftwareLevel.jsx";

export default function About() {
  return (
    <DirectoryLayout title="About Me" variant="about">
      <section className="directory-intro directory-about-intro" aria-labelledby="about-title">
        <h1 className="directory-title" id="about-title">About Me</h1>
        {profile.slogan ? (
          <p className="directory-about-slogan">
            {profile.slogan.split("、").map((part, index, parts) => (
              <span key={`${index}-${part}`}>{part}{index < parts.length - 1 ? "、" : ""}</span>
            ))}
          </p>
        ) : null}
      </section>
      <section className="directory-about-profile" aria-label="プロフィール">
        <div className="directory-about-identity">
          <figure className="directory-about-portrait">
            <img
              alt="LUYUFANの写真"
              src="/assets/directory/about-portrait.png"
              width="1192"
              height="1016"
              decoding="async"
            />
          </figure>
          <h2 className="directory-about-name" aria-label={profile.name}>
            {profile.nameLines.map(({ name, reading }) => (
              <span className="directory-about-name-line" key={name} aria-hidden="true">
                <span className="directory-about-name-reading">{reading}</span>
                <span>{name}</span>
              </span>
            ))}
          </h2>
        </div>
        {profile.history.length > 0 ? (
          <section className="directory-about-history" aria-labelledby="about-history-title">
            <h2 id="about-history-title">略歴</h2>
            {profile.history.map((entry) => <p key={entry.id}>{entry.text}</p>)}
          </section>
        ) : null}
        <section className="directory-about-copy" aria-labelledby="about-interests-title">
          <h2 id="about-interests-title">関心のあるデザイン</h2>
          {profile.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </section>
        <section className="directory-about-software" aria-label="使用ソフトとAI補助">
          <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: "absolute" }}>
            <defs><filter id="software-brush-monochrome" colorInterpolationFilters="sRGB">
              <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  .2522 .8483 .0856 0 -.1861" />
            </filter></defs>
          </svg>
          {softwareGroups.map(group => <div className="directory-software-group" key={group.title}>
            <h2>{group.title}</h2>
            <ul>{group.items.map(({ id, icon, name, level, monochromeBrush, extension = "svg" }) => <li key={id}>
              <span className={`directory-software-icon${monochromeBrush ? " directory-software-icon-brush" : ""}`} aria-hidden="true">{icon ? <img src={`/assets/software/${icon}.${extension}`} width="28" height="28" alt="" loading="lazy" decoding="async" /> : null}</span>
              <span className="directory-software-detail"><span>{name}</span><SoftwareLevel name={name} level={level} /></span>
            </li>)}</ul>
          </div>)}
        </section>
      </section>
    </DirectoryLayout>
  );
}
