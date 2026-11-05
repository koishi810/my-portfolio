import SiteAnchor from "../SiteAnchor.jsx";
import CachedWorksBackground from "./CachedWorksBackground.jsx";
import PortfolioChrome from "../PortfolioChrome.jsx";
import useDirectoryFade from "../../hooks/useDirectoryFade.js";
import usePointerParallax from "../../hooks/usePointerParallax.js";
import useWorksPhotoPhase from "../../hooks/useWorksPhotoPhase.js";
import { HomeBackground, HomeMask } from "../home/HomeBackdrop.jsx";
import "../../styles/portfolio-home.css";
import "../../styles/directory.css";

const navigationItems = [
  { href: "/#top", label: "TOP" },
  { href: "/works", label: "WORKS" },
  { href: "/about", label: "ABOUT ME" },
  { href: "#directory-contact", label: "CONTACT" },
];

export default function DirectoryLayout({ children, variant, title }) {
  const backgroundRef = usePointerParallax();
  const pageRef = useDirectoryFade();
  useWorksPhotoPhase(pageRef, variant === "works");

  return (
    <main className={`directory-page directory-page-${variant}`} ref={pageRef}>
      <div className="directory-background" ref={backgroundRef} aria-hidden="true">
        {variant === "works" ? <CachedWorksBackground /> : <img alt="" src="/assets/directory/about-background.png" />}
      </div>
      {variant === "works" ? <div className="directory-mask directory-mask-inversion" aria-hidden="true" /> : null}
      <div className="directory-mask" aria-hidden="true" />
      {variant === "works" ? <div className="directory-photo-home-background" aria-hidden="true">
        <HomeBackground />
        <HomeMask phase="hero" />
      </div> : null}
      <PortfolioChrome
        ariaLabel={`${title} navigation`}
        classNames={{
          header: "directory-chrome",
          navigation: "directory-nav",
          version: "directory-version",
          versionBox: "directory-version-box",
        }}
        navigationItems={navigationItems}
      />
      {children}
      <footer className="directory-contact" id="directory-contact">
        <h2>Contact</h2>
        <SiteAnchor href="mailto:koishi810@gmail.com">koishi810@gmail.com</SiteAnchor>
        <SiteAnchor className="directory-return" href="/#top">TOP ↑</SiteAnchor>
        <small>© 2026 LUYUFAN</small>
      </footer>
    </main>
  );
}
