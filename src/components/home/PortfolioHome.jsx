import { useEffect, useRef, useState } from "react";
import { useScrollProgress, useStageMetrics } from "../../hooks/useScrollProgress.js";
import useHomeNavigationFade from "../../hooks/useHomeNavigationFade.js";
import AboutSection from "./AboutSection.jsx";
import ContactSection from "./ContactSection.jsx";
import { HomeBackground, HomeMask } from "./HomeBackdrop.jsx";
import HomeChrome from "./HomeChrome.jsx";
import HeroSection from "./HeroSection.jsx";
import WorksSection from "./WorksSection.jsx";

const DESIGN_WIDTH = 1440;
const DESIGN_HEIGHT = 905;
const HERO_LENGTH = 1402;
const ABOUT_LENGTH = 1404;
const HERO_SCROLL_MULTIPLIER = 4;
const ABOUT_SCROLL_MULTIPLIER = 4;

function useHomePhase(aboutRef, worksRef, contactRef, viewportHeight) {
  const [phase, setPhase] = useState("hero");

  useEffect(() => {
    let frameId = null;
    const finalTitle = worksRef.current?.querySelector(".portfolio-all-works h2");
    const finalAction = worksRef.current?.querySelector(".portfolio-all-works .portfolio-more-button");

    const updatePhase = () => {
      const threshold = viewportHeight * 0.55;
      const contactTop = contactRef.current?.getBoundingClientRect().top ?? Infinity;
      const worksTop = worksRef.current?.getBoundingClientRect().top ?? Infinity;
      const aboutTop = aboutRef.current?.getBoundingClientRect().top ?? Infinity;

      // The final title and MORE label must reach the existing transparent
      // navigation band before the Works backdrop begins fading out.
      const clearY = window.innerWidth <= 700 ? 72 : 64;
      const titleBottom = finalTitle?.getBoundingClientRect().bottom ?? contactTop;
      const actionBounds = finalAction?.getBoundingClientRect();
      const actionCenter = actionBounds ? (actionBounds.top + actionBounds.bottom) / 2 : contactTop;
      const worksTextCleared = titleBottom <= clearY && actionCenter <= clearY;

      if (contactTop <= threshold && worksTextCleared) {
        setPhase("contact");
      } else if (worksTop <= threshold) {
        setPhase("works");
      } else if (aboutTop <= threshold) {
        setPhase("about");
      } else {
        setPhase("hero");
      }

      frameId = window.requestAnimationFrame(updatePhase);
    };

    frameId = window.requestAnimationFrame(updatePhase);

    return () => {
      if (frameId !== null) window.cancelAnimationFrame(frameId);
    };
  }, [aboutRef, contactRef, viewportHeight, worksRef]);

  return phase;
}

export default function PortfolioHome() {
  const pageRef = useHomeNavigationFade();
  const heroRef = useRef(null);
  const aboutRef = useRef(null);
  const worksRef = useRef(null);
  const contactRef = useRef(null);
  const { scale, viewportHeight } = useStageMetrics(DESIGN_WIDTH, DESIGN_HEIGHT);
  const phase = useHomePhase(aboutRef, worksRef, contactRef, viewportHeight);
  const heroProgress = useScrollProgress(heroRef, { easing: 0.1, smooth: true, viewportHeight });
  const aboutProgress = useScrollProgress(aboutRef, { easing: 0.1, smooth: true, viewportHeight, preserveOnResize: true });
  const heroHeight = viewportHeight + (HERO_LENGTH - DESIGN_HEIGHT) * scale * HERO_SCROLL_MULTIPLIER;
  const aboutHeight =
    viewportHeight + DESIGN_HEIGHT * scale * 2 + (ABOUT_LENGTH - DESIGN_HEIGHT) * scale * ABOUT_SCROLL_MULTIPLIER;

  return (
    <main className={`portfolio-home portfolio-phase-${phase}`} ref={pageRef} style={{ "--stable-vh": `${viewportHeight}px` }}>
      <HomeBackground />
      <HomeMask phase={phase} />
      <HomeChrome />
      <HeroSection height={`${heroHeight}px`} progress={heroProgress} sectionRef={heroRef} />
      <AboutSection height={`${aboutHeight}px`} progress={aboutProgress} sectionRef={aboutRef} />
      <WorksSection sectionRef={worksRef} viewportHeight={viewportHeight} />
      <ContactSection sectionRef={contactRef} />
    </main>
  );
}
