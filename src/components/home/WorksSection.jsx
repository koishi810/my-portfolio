import SiteAnchor from "../SiteAnchor.jsx";
import { useEffect, useRef } from "react";
import { featuredProjects } from "../../data/projects.js";

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
      <SiteAnchor className="portfolio-work-image" href={work.href} aria-label={`${work.title} project`}>
        <img alt={work.imageLabel} src={work.image} />
      </SiteAnchor>
    </article>
  );
}

export default function WorksSection({ sectionRef, viewportHeight }) {
  const workItemRefs = useRef([]);

  useEffect(() => {
    let frameId = null;
    const title = sectionRef.current?.querySelector(".portfolio-works-title");
    const entries = workItemRefs.current.filter(Boolean).map((item) => ({
      item,
      image: item.querySelector(".portfolio-work-image"),
      step: item.closest(".portfolio-work-step"),
      clipPath: null,
      appliedClipPath: null,
    }));

    const updateClip = () => {
      const isStackedLayout = window.innerWidth <= 1180;
      // Read every image first; a sticky/min-height write must not force the
      // next card's size read to flush layout again.
      const sizes = entries.map((entry) => {
        if (!entry.image) return null;
        const imageBottom = entry.image.offsetTop + entry.image.offsetHeight;
        const bottomOffset = isStackedLayout ? 48 : 56;
        const minTop = isStackedLayout ? 120 : 260;
        const maxTop = isStackedLayout ? viewportHeight - 120 : 380;
        const stickyTop = Math.min(Math.max(viewportHeight - imageBottom - bottomOffset, minTop), maxTop);
        const pauseDistance = Math.max(viewportHeight * 0.82, 620);
        return { entry, stickyTop: `${stickyTop}px`, minHeight: isStackedLayout ? `${imageBottom + pauseDistance}px` : "" };
      });
      sizes.forEach((size) => {
        if (!size) return;
        const { entry: { item, step }, stickyTop, minHeight } = size;
        if (item.style.getPropertyValue("--work-sticky-top") !== stickyTop) {
          item.style.setProperty("--work-sticky-top", stickyTop);
        }
        if (step && step.style.getPropertyValue("--work-step-min-height") !== minHeight) {
          if (minHeight) step.style.setProperty("--work-step-min-height", minHeight);
          else step.style.removeProperty("--work-step-min-height");
        }
      });
      // Measure all updated geometry before writing any clipping styles.
      const titleRect = title?.getBoundingClientRect();
      const cutoff = titleRect ? titleRect.bottom + 18 : 0;
      const clips = entries.map(({ item }) => {
        const rect = item.getBoundingClientRect();
        const clipTop = Math.max(0, Math.min(rect.height, cutoff - rect.top));
        return clipTop > 0 ? `inset(${clipTop}px 0 0 0)` : "inset(0 0 0 0)";
      });
      entries.forEach((entry, index) => {
        const clipPath = clips[index];
        // CSSOM may normalize inset syntax. Remember its stored form, while
        // still honoring an external keyboard reveal that cleared the clip.
        if (entry.clipPath === clipPath && entry.item.style.clipPath === entry.appliedClipPath) return;
        if (entry.item.style.clipPath !== clipPath) entry.item.style.clipPath = clipPath;
        entry.clipPath = clipPath;
        entry.appliedClipPath = entry.item.style.clipPath;
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
          item.closest(".portfolio-work-step")?.style.removeProperty("--work-step-min-height");
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
            {featuredProjects.map((work, index) => (
              <div className="portfolio-work-step" key={work.slug}>
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
          <SiteAnchor className="portfolio-more-button" href="/works">
            MORE
          </SiteAnchor>
        </div>
      </div>
    </section>
  );
}
