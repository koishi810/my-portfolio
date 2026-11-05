import { useLayoutEffect, useRef } from "react";

// Reuse Home's image-dependent sticky stops and heading-edge clipping, scoped
// to the full directory so its category index and empty category stay usable.
export default function useWorksScroll() {
  const resultsRef = useRef(null);
  useLayoutEffect(() => {
    const results = resultsRef.current;
    if (!results) return;
    const items = [...results.querySelectorAll('.directory-project')];
    const entries = items.map(item => ({
      item,
      image: item.querySelector('.directory-project-image'),
      step: item.closest('.directory-work-step'),
      title: item.closest('.directory-category').querySelector('.directory-results-title'),
      clipPath: null,
      appliedClipPath: null,
    }));
    const titles = [...new Set(entries.map(entry => entry.title))];
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    let active = true;
    let sourceLink = null;
    let departure = null;
    let pendingReturn = null;
    let returnFrame = 0;
    const update = () => {
      frame = 0;
      if (!active) return;
      // A modal's stable scrollbar gutter can temporarily change CSS vw sizes.
      // Keep the background stage heights while it is locked; their observers
      // remeasure the normal layout after close or a viewport change.
      if (document.querySelector('.project-image-dialog[open]')) return;
      const stacked = window.innerWidth <= 1180;
      const height = window.innerHeight;
      // Keep size reads, layout writes, geometry reads and clip writes in
      // separate phases instead of flushing layout once per card.
      const sizes = entries.map(entry => {
        const { image } = entry;
        const imageBottom = image.offsetTop + image.offsetHeight;
        const stickyTop = Math.min(Math.max(height - imageBottom - (stacked ? 48 : 56), stacked ? 120 : 260), stacked ? height - 120 : 380);
        return { entry, stickyTop: `${stickyTop}px`, minHeight: stacked ? `${imageBottom + Math.max(height * .82, 620)}px` : '' };
      });
      sizes.forEach(({ entry: { item, step }, stickyTop, minHeight }) => {
        if (item.style.getPropertyValue('--work-sticky-top') !== stickyTop) item.style.setProperty('--work-sticky-top', stickyTop);
        if (step.style.getPropertyValue('--work-step-min-height') !== minHeight) {
          if (minHeight) step.style.setProperty('--work-step-min-height', minHeight);
          else step.style.removeProperty('--work-step-min-height');
        }
      });
      const cutoffs = new Map(titles.map(title => [title, title.getBoundingClientRect().bottom + 18]));
      const clips = entries.map(({ item, title }) => {
        const bounds = item.getBoundingClientRect();
        const cutoff = cutoffs.get(title);
        const clip = Math.max(0, Math.min(bounds.height, cutoff - bounds.top));
        return (reduced.matches || height <= 500) ? '' : `inset(${clip}px 0 0 0)`;
      });
      entries.forEach((entry, index) => {
        const clipPath = clips[index];
        // Compare the saved CSSOM form too: keyboard/history reveal can clear
        // the inline clip between otherwise identical scroll measurements.
        if (entry.clipPath === clipPath && entry.item.style.clipPath === entry.appliedClipPath) return;
        if (entry.item.style.clipPath !== clipPath) entry.item.style.clipPath = clipPath;
        entry.clipPath = clipPath;
        entry.appliedClipPath = entry.item.style.clipPath;
      });
    };
    const schedule = () => { if (active && !frame) frame = requestAnimationFrame(update); };
    const readableTop = (target) => {
      const item = target.closest('.directory-project');
      const title = item.closest('.directory-category').querySelector('.directory-results-title');
      // Use the heading's sticky destination, not its pre-scroll position.
      // Reverse Tab can otherwise scroll the heading back over the target.
      const titleStyle = window.getComputedStyle(title);
      const headingEdge = titleStyle.position === 'sticky' ? parseFloat(titleStyle.top) + title.offsetHeight + 18 : 0;
      return Math.max(window.innerWidth <= 700 ? 112 : 92, headingEdge);
    };
    const revealTarget = (target) => {
      const item = target.closest('.directory-project');
      // A card held above its heading cannot be exposed by another scrollBy.
      // Release that one card, then reveal its link below the heading and fade.
      item.classList.add('works-keyboard-reading');
      item.style.clipPath = '';
      const fullY = readableTop(target);
      const bounds = target.getBoundingClientRect();
      if (bounds.top < fullY || bounds.bottom > window.innerHeight) window.scrollBy({ top: bounds.top - fullY - 12, behavior: 'instant' });
      else window.scrollTo({ top: window.scrollY, left: window.scrollX, behavior: 'instant' });
      schedule();
    };
    const reveal = (event) => {
      const target = event.target;
      if (target.closest('.directory-project') && target.matches('a,button,[tabindex]') && target.matches(':focus-visible')) revealTarget(target);
    };
    const release = (event) => {
      const item = event.target.closest('.directory-project');
      if (item && !item.contains(event.relatedTarget)) { item.classList.remove('works-keyboard-reading'); schedule(); }
    };
    const cancelReturn = () => {
      cancelAnimationFrame(returnFrame); returnFrame = 0;
      departure = null; pendingReturn = null;
    };
    const clearReturn = () => { sourceLink = null; cancelReturn(); };
    const recordDeparture = (event) => {
      clearReturn();
      const link = event.target.closest?.('a.directory-project-image[href]');
      if (!link || !results.contains(link) || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      if (link.hasAttribute('download') || (link.target && link.target.toLowerCase() !== '_self')) return;
      const url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin || !url.pathname.startsWith(`${import.meta.env.BASE_URL}works/`)) return;
      sourceLink = link;
      departure = { link, width: window.innerWidth, height: window.innerHeight };
    };
    const leave = (event) => {
      cancelReturn();
      const link = sourceLink;
      if (!event.persisted || !link || document.activeElement !== link || !results.contains(link)) { clearReturn(); return; }
      const bounds = link.getBoundingClientRect();
      if (bounds.bottom <= readableTop(link) || bounds.top >= window.innerHeight) { clearReturn(); return; }
      // Native Forward can leave this same focused entry without another click.
      // Re-arm only from a readable departure, never an intentionally hidden link.
      departure = { link, width: window.innerWidth, height: window.innerHeight };
    };
    const restore = (event) => {
      const previous = departure;
      cancelReturn();
      if (!event.persisted || !previous) return;
      pendingReturn = previous;
      let count = 0, stable = 0, geometry = '';
      const check = () => {
        returnFrame = 0;
        if (!active || pendingReturn !== previous || document.activeElement !== previous.link || !results.contains(previous.link)) { cancelReturn(); return; }
        const bounds = previous.link.getBoundingClientRect();
        const next = [window.innerWidth, window.innerHeight, document.documentElement.scrollHeight, window.scrollY, bounds.top, bounds.bottom].join(',');
        stable = next === geometry ? stable + 1 : 0;
        geometry = next;
        // BFCache pageshow can still expose the old viewport. Let resize and
        // the existing sticky geometry settle before this one consumed attempt.
        if (++count < 8 && (count < 4 || stable < 2)) { returnFrame = requestAnimationFrame(check); return; }
        pendingReturn = null;
        if (stable < 2 || (window.innerWidth === previous.width && window.innerHeight === previous.height)) return;
        if (bounds.bottom <= readableTop(previous.link) || bounds.top >= window.innerHeight) revealTarget(previous.link);
      };
      returnFrame = requestAnimationFrame(check);
    };
    const checkFocus = () => {
      const link = sourceLink;
      if (link && document.activeElement !== link) clearReturn();
    };
    const inputEvents = ['wheel', 'touchstart', 'pointerdown', 'keydown'];
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    reduced.addEventListener('change', schedule);
    results.addEventListener('focusin', reveal);
    results.addEventListener('focusout', release);
    window.addEventListener('click', recordDeparture);
    window.addEventListener('pagehide', leave);
    window.addEventListener('pageshow', restore);
    window.addEventListener('hashchange', clearReturn);
    document.addEventListener('focusin', checkFocus);
    document.addEventListener('focusout', checkFocus);
    inputEvents.forEach(type => window.addEventListener(type, cancelReturn, { capture: true, passive: true }));
    const observer = new ResizeObserver(schedule);
    items.forEach(item => observer.observe(item));
    // Closing also needs a measurement when only viewport height changed and
    // overlay scrollbars leave card border-box sizes unchanged.
    const scrollLockObserver = new MutationObserver(schedule);
    scrollLockObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['style'] });
    document.fonts.ready.then(schedule);
    return () => {
      active = false; cancelAnimationFrame(frame); observer.disconnect();
      scrollLockObserver.disconnect();
      clearReturn();
      window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule);
      reduced.removeEventListener('change', schedule);
      results.removeEventListener('focusin', reveal); results.removeEventListener('focusout', release);
      window.removeEventListener('click', recordDeparture);
      window.removeEventListener('pagehide', leave); window.removeEventListener('pageshow', restore);
      window.removeEventListener('hashchange', clearReturn);
      document.removeEventListener('focusin', checkFocus); document.removeEventListener('focusout', checkFocus);
      inputEvents.forEach(type => window.removeEventListener(type, cancelReturn, true));
      items.forEach(item => { item.style.clipPath = ''; item.style.removeProperty('--work-sticky-top'); item.classList.remove('works-keyboard-reading'); item.closest('.directory-work-step').style.removeProperty('--work-step-min-height'); });
    };
  }, []);
  return resultsRef;
}
