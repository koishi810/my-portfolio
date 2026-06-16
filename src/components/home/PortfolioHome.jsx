import { useEffect, useRef, useState } from "react";
import ScrollImageSequence from "../tests/ScrollImageSequence.jsx";
import { mix, progressBetween, useScrollProgress, useStageMetrics } from "../../hooks/useScrollProgress.js";

const DESIGN_WIDTH = 1440;
const DESIGN_HEIGHT = 905;
const HERO_LENGTH = 1402;
const ABOUT_LENGTH = 1404;
const WORKS_LENGTH = 2835;
const HERO_SCROLL_MULTIPLIER = 4;
const ABOUT_SCROLL_MULTIPLIER = 4;

const aboutSmallTitle = ["私", "に", "つ", "い", "て"];
const aboutRightColumn = ["言", "葉", "に", "な", "る", "前", "の", "も", "の", "を", "、"];
const aboutLeftColumn = ["か", "た", "ち", "に", "す", "る", "た", "め", "に", "。"];

const works = [
  {
    date: "2026.5",
    title: "KOKO",
    subtitle: "身体感覚を記録する地図",
    type: "UI/UX / Interaction Prototype",
    description:
      "KOKOは、日常の場所を感覚のテクスチャーとして記録するモバイル地図プロトタイプです。\n\nユーザーはその場で10秒間長押しし、音・移動状態・時間帯・感覚語を記録します。記録はピンではなく、地図表面に沈着する点と線として現れます。",
    href: "/works/koko",
    image: "/assets/home/koko-logo.svg",
    imageLabel: "KOKO",
  },
  {
    date: "2025.09~2025.11",
    title: "きもち de フラワーマシン",
    type: "Interactive Installation / Visual System",
    description:
      "カメラで取得した表情の変化をもとに、花のかたちや天気の状態を生成するインタラクティブ作品です。\n\n笑顔、驚き、怒り、悲しみなどの感情を読み取り、その状態に応じて花びらの種類、数、開き方、動きが変化します。",
    image: "/assets/home/flower-machine.png",
    imageLabel: "きもち de フラワーマシン",
  },
  {
    date: "2023~",
    title: "ARCTIC LAB",
    type: "Logotype / Graphic design",
    description:
      "友人の音楽プロジェクトのために制作している、アルバムアートワークとロゴタイプのシリーズです。\n\n年に一枚ほどのペースで制作を続けています。",
    image: "/assets/home/arctic-lab.png",
    imageLabel: "ARCTIC LAB",
  },
];

function useHomePhase(aboutRef, worksRef, contactRef, viewportHeight) {
  const [phase, setPhase] = useState("hero");

  useEffect(() => {
    let frameId = null;

    const updatePhase = () => {
      const threshold = viewportHeight * 0.55;
      const contactTop = contactRef.current?.getBoundingClientRect().top ?? Infinity;
      const worksTop = worksRef.current?.getBoundingClientRect().top ?? Infinity;
      const aboutTop = aboutRef.current?.getBoundingClientRect().top ?? Infinity;

      if (contactTop <= threshold) {
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

function GlobalBackground() {
  const backgroundRef = useRef(null);

  useEffect(() => {
    let frameId = null;
    const current = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };

    const updateTarget = (event) => {
      const halfWidth = window.innerWidth / 2 || 1;
      const halfHeight = window.innerHeight / 2 || 1;
      target.x = ((event.clientX - halfWidth) / halfWidth) * 6;
      target.y = ((event.clientY - halfHeight) / halfHeight) * 3.5;
    };

    const resetTarget = () => {
      target.x = 0;
      target.y = 0;
    };

    const tick = () => {
      current.x = mix(current.x, target.x, 0.08);
      current.y = mix(current.y, target.y, 0.08);

      if (backgroundRef.current) {
        backgroundRef.current.style.transform = `translate3d(${current.x}px, ${current.y}px, 0) scale(1.08)`;
      }

      frameId = window.requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", updateTarget);
    window.addEventListener("pointerleave", resetTarget);
    window.addEventListener("blur", resetTarget);
    frameId = window.requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", updateTarget);
      window.removeEventListener("pointerleave", resetTarget);
      window.removeEventListener("blur", resetTarget);
      if (frameId !== null) window.cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <div className="portfolio-global-background" aria-hidden="true" ref={backgroundRef}>
      <img alt="" src="/assets/test/about-scroll/bg.png" />
    </div>
  );
}

function GlobalMask({ phase }) {
  return (
    <div className={`portfolio-global-mask portfolio-global-mask-${phase}`} aria-hidden="true">
      <div className="portfolio-mask-dark" />
      <div className="portfolio-mask-exclusion" />
      <div className="portfolio-mask-light" />
    </div>
  );
}

function GlobalChrome() {
  return (
    <header className="portfolio-global-chrome">
      <a className="portfolio-version" href="#top">
        Portfolio ver0.1
      </a>
      <div className="portfolio-version-box" aria-hidden="true">
        <span>2026.06.09 更新しました</span>
      </div>
      <nav className="portfolio-home-nav" aria-label="Portfolio home navigation">
        <a href="#top">TOP</a>
        <a href="#works">WORKS</a>
        <a href="#about">ABOUT ME</a>
        <a href="#contact">CONTACT</a>
      </nav>
    </header>
  );
}

function DesignStage({ children }) {
  const { scale } = useStageMetrics(DESIGN_WIDTH, DESIGN_HEIGHT);

  return (
    <div
      className="portfolio-design-shell"
      style={{
        height: `${DESIGN_HEIGHT * scale}px`,
        width: `${DESIGN_WIDTH * scale}px`,
      }}
    >
      <div
        className="portfolio-design-stage"
        style={{
          transform: `scale(${scale})`,
        }}
      >
        {children}
      </div>
    </div>
  );
}

function HeroSection({ sectionRef, progress, height }) {
  return (
    <section className="portfolio-hero-section portfolio-scroll-section" id="top" ref={sectionRef} style={{ height }}>
      <div className="portfolio-sticky-stage">
        <DesignStage>
          <div className="portfolio-hero-visual" data-progress={progress.toFixed(3)}>
            <ScrollImageSequence
              basePath="/assets/sequences/yezi"
              className="portfolio-hero-sequence"
              extension="png"
              filenamePattern="{index:0000}"
              frameCount={48}
              logicalHeight={943.323}
              logicalWidth={1677.019}
              progress={progress}
            />
          </div>
          <div className="portfolio-hero-copy">
            <p className="portfolio-hero-field">Information Expression / Visual Design / UIUX</p>
            <h1 className="portfolio-hero-title">LU YUFAN</h1>
            <p className="portfolio-hero-note">
              perception / information / visual expression
              <br />
              musashino art university
              <br />
              science of design
            </p>
          </div>
        </DesignStage>
      </div>
    </section>
  );
}

function VerticalChars({ chars, className, revealProgress, startIndex }) {
  const totalChars = aboutRightColumn.length + aboutLeftColumn.length;

  return (
    <div className={className}>
      {chars.map((char, index) => {
        const charProgress = Math.min(Math.max(revealProgress * totalChars - (startIndex + index), 0), 1);

        return (
          <span
            className="portfolio-about-char"
            key={`${char}-${index}`}
            style={{
              opacity: charProgress,
              transform: `translateY(${(1 - charProgress) * 8}px)`,
            }}
          >
            {char}
          </span>
        );
      })}
    </div>
  );
}

function AboutSection({ sectionRef, progress, height }) {
  const entryProgress = progressBetween(progress, 0, 0.25);
  const titleProgress = progressBetween(progress, 0.25, 0.45);
  const textProgress = progressBetween(progress, 0.45, 0.75);
  const moreProgress = progressBetween(progress, 0.75, 0.9);
  const subjectTop = mix(611.6108, 136.262, entryProgress);

  return (
    <section className="portfolio-about-section portfolio-scroll-section" id="about" ref={sectionRef} style={{ height }}>
      <div className="portfolio-sticky-stage">
        <DesignStage>
          <div className="portfolio-about-subject" style={{ top: `${subjectTop}px` }}>
            <ScrollImageSequence
              basePath="/assets/sequences/shitou"
              className="portfolio-about-sequence"
              extension="png"
              filenamePattern="{index:0000}"
              frameCount={48}
              logicalHeight={509.273}
              logicalWidth={905.375}
              progress={progressBetween(progress, 0.25, 1)}
            />
            <div
              className="portfolio-about-small-title"
              style={{
                opacity: titleProgress,
                transform: `translateY(${(1 - titleProgress) * 8}px)`,
              }}
            >
              {aboutSmallTitle.map((char) => (
                <span key={char}>{char}</span>
              ))}
            </div>
            <VerticalChars
              chars={aboutRightColumn}
              className="portfolio-about-column portfolio-about-column-right"
              revealProgress={textProgress}
              startIndex={0}
            />
            <VerticalChars
              chars={aboutLeftColumn}
              className="portfolio-about-column portfolio-about-column-left"
              revealProgress={textProgress}
              startIndex={aboutRightColumn.length}
            />
            <a
              className="portfolio-more-button portfolio-about-more"
              href="/about"
              style={{
                opacity: moreProgress,
                pointerEvents: moreProgress > 0 ? "auto" : "none",
                transform: `translateY(${(1 - moreProgress) * 8}px)`,
              }}
            >
              MORE
            </a>
          </div>
        </DesignStage>
      </div>
    </section>
  );
}

function WorkItem({ itemRef, work, index }) {
  return (
    <article className={`portfolio-work-item portfolio-work-item-${index + 1}`} ref={itemRef}>
      <div className="portfolio-work-text">
        <p className="portfolio-work-date">{work.date}</p>
        <h3>
          <span>{work.title}</span>
          {work.subtitle ? <span>{work.subtitle}</span> : null}
        </h3>
        <p className="portfolio-work-type">{work.type}</p>
        <p className="portfolio-work-description">{work.description}</p>
      </div>
      <a className="portfolio-work-image" href={work.href ?? "/works"} aria-label={`${work.title} project`}>
        <img alt={work.imageLabel} src={work.image} />
      </a>
    </article>
  );
}

function WorksSection({ sectionRef, viewportHeight }) {
  const workItemRefs = useRef([]);

  useEffect(() => {
    let frameId = null;

    const updateClip = () => {
      const title = sectionRef.current?.querySelector(".portfolio-works-title");
      const titleRect = title?.getBoundingClientRect();
      const cutoff = titleRect ? titleRect.bottom + 18 : 0;

      workItemRefs.current.forEach((item) => {
        if (!item) return;

        const image = item.querySelector(".portfolio-work-image");
        if (image) {
          const imageBottom = image.offsetTop + image.offsetHeight;
          const bottomOffset = window.innerWidth <= 1180 ? 48 : 56;
          const minTop = window.innerWidth <= 1180 ? 120 : 260;
          const maxTop = window.innerWidth <= 1180 ? viewportHeight - 120 : 380;
          const stickyTop = Math.min(Math.max(viewportHeight - imageBottom - bottomOffset, minTop), maxTop);
          item.style.setProperty("--work-sticky-top", `${stickyTop}px`);
        }

        const rect = item.getBoundingClientRect();
        const clipTop = Math.max(0, Math.min(rect.height, cutoff - rect.top));
        item.style.clipPath = clipTop > 0 ? `inset(${clipTop}px 0 0 0)` : "inset(0 0 0 0)";
      });

      frameId = window.requestAnimationFrame(updateClip);
    };

    frameId = window.requestAnimationFrame(updateClip);

    return () => {
      if (frameId !== null) window.cancelAnimationFrame(frameId);
      workItemRefs.current.forEach((item) => {
        if (item) {
          item.style.clipPath = "";
          item.style.removeProperty("--work-sticky-top");
        }
      });
    };
  }, [sectionRef, viewportHeight]);

  return (
    <section className="portfolio-works-section" id="works" ref={sectionRef}>
      <div className="portfolio-works-inner">
        <div className="portfolio-works-scroll-area">
          <h2 className="portfolio-works-title">Works</h2>
          <div className="portfolio-work-list">
            {works.map((work, index) => (
              <div className="portfolio-work-step" key={work.title}>
                <WorkItem
                  index={index}
                  itemRef={(node) => {
                    workItemRefs.current[index] = node;
                  }}
                  work={work}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="portfolio-all-works">
          <h2>ALL WORKS</h2>
          <a className="portfolio-more-button" href="/works">
            MORE
          </a>
        </div>
      </div>
    </section>
  );
}

function ContactSection({ sectionRef }) {
  return (
    <section className="portfolio-contact-section" id="contact" ref={sectionRef}>
      <div className="portfolio-contact-copy">
        <h2>Contact</h2>
        <a href="mailto:koishi810@gmail.com">koishi810@gmail.com</a>
      </div>
    </section>
  );
}

export default function PortfolioHome() {
  const heroRef = useRef(null);
  const aboutRef = useRef(null);
  const worksRef = useRef(null);
  const contactRef = useRef(null);
  const { scale, viewportHeight } = useStageMetrics(DESIGN_WIDTH, DESIGN_HEIGHT);
  const phase = useHomePhase(aboutRef, worksRef, contactRef, viewportHeight);
  const heroProgress = useScrollProgress(heroRef, { easing: 0.1, smooth: true, viewportHeight });
  const aboutProgress = useScrollProgress(aboutRef, { easing: 0.1, smooth: true, viewportHeight });
  const heroHeight = viewportHeight + (HERO_LENGTH - DESIGN_HEIGHT) * scale * HERO_SCROLL_MULTIPLIER;
  const aboutHeight =
    viewportHeight + DESIGN_HEIGHT * scale * 2 + (ABOUT_LENGTH - DESIGN_HEIGHT) * scale * ABOUT_SCROLL_MULTIPLIER;

  return (
    <main className={`portfolio-home portfolio-phase-${phase}`} style={{ "--stable-vh": `${viewportHeight}px` }}>
      <GlobalBackground />
      <GlobalMask phase={phase} />
      <GlobalChrome />
      <HeroSection height={`${heroHeight}px`} progress={heroProgress} sectionRef={heroRef} />
      <AboutSection height={`${aboutHeight}px`} progress={aboutProgress} sectionRef={aboutRef} />
      <WorksSection sectionRef={worksRef} viewportHeight={viewportHeight} />
      <ContactSection sectionRef={contactRef} />
    </main>
  );
}
