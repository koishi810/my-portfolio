import { useLayoutEffect } from "react";
import "../styles/backdrop-text-ink.css";

const SOURCE_CLASS = "backdrop-text-ink-source";
const GRADIENT_ATTRIBUTE = "data-backdrop-text-gradient";
const MEDIA = "img, picture, video, audio, canvas, svg, iframe, object, embed, input, textarea, select";
const NAVIGATION_FADE = ".portfolio-home-fade-layer, .directory-fade-layer, .arctic-navigation-fade-layer, .legacy-detail-fade-layer, .sugar-navigation-fade-layer";
const TYPOGRAPHY = [
  "font-family", "font-size", "font-weight", "font-style", "font-stretch", "font-kerning",
  "font-feature-settings", "font-variation-settings", "font-optical-sizing", "font-variant",
  "font-variant-caps", "font-variant-ligatures", "font-synthesis", "text-wrap-mode", "text-wrap-style",
  "line-height", "letter-spacing", "word-spacing", "text-align", "text-align-last", "text-indent",
  "text-transform", "text-rendering", "text-orientation", "writing-mode", "direction",
  "white-space", "word-break", "overflow-wrap", "hyphens", "tab-size", "vertical-align",
  "text-decoration-line", "text-decoration-style", "text-decoration-thickness", "text-underline-offset",
  "-webkit-font-smoothing", "-webkit-text-stroke-width", "text-size-adjust", "-webkit-text-size-adjust",
];
const LAYOUT = [
  "display", "position", "top", "right", "bottom", "left", "width", "height", "min-width", "max-width",
  "min-height", "max-height", "box-sizing", "padding-top", "padding-right", "padding-bottom", "padding-left",
  "margin-top", "margin-right", "margin-bottom", "margin-left", "border-top-width", "border-right-width",
  "border-bottom-width", "border-left-width", "border-top-style", "border-right-style", "border-bottom-style",
  "border-left-style", "align-items", "align-content", "align-self", "justify-content", "justify-items",
  "justify-self", "flex-direction", "flex-wrap", "flex-grow", "flex-shrink", "flex-basis", "order",
  "gap", "row-gap", "column-gap", "grid-template-columns", "grid-template-rows", "grid-column", "grid-row",
  "transform", "transform-origin", "overflow-x", "overflow-y",
];

function localSize(element, style, axis) {
  const value = parseFloat(style[axis]);
  if (!Number.isFinite(value)) return axis === "width" ? element.offsetWidth : element.offsetHeight;
  if (style.boxSizing === "border-box") return value;
  const edges = axis === "width" ? ["Left", "Right"] : ["Top", "Bottom"];
  return value + edges.reduce((sum, edge) => sum + (parseFloat(style[`padding${edge}`]) || 0)
    + (parseFloat(style[`border${edge}Width`]) || 0), 0);
}

function axisAligned(transform) {
  if (transform === "none") return true;
  const matrix = new DOMMatrixReadOnly(transform);
  return Math.abs(matrix.b) < 0.00001 && Math.abs(matrix.c) < 0.00001
    && matrix.a > 0 && matrix.d > 0 && !matrix.m13 && !matrix.m23 && !matrix.m14 && !matrix.m24 && !matrix.m34;
}

function insetEdges(value, width, height) {
  if (value === "none") return [0, 0, 0, 0];
  const match = /^inset\(([^()]*)\)$/.exec(value);
  if (!match || match[1].includes("round")) return null;
  const tokens = match[1].trim().split(/\s+/);
  if (!tokens.length || tokens.length > 4 || tokens.some((part) => !/^-?(?:\d*\.)?\d+(?:px|%)?$/.test(part))) return null;
  const four = [tokens[0], tokens[1] ?? tokens[0], tokens[2] ?? tokens[0], tokens[3] ?? tokens[1] ?? tokens[0]];
  return four.map((part, index) => parseFloat(part) * (part.endsWith("%") ? (index % 2 ? width : height) / 100 : 1));
}

// Only text and its layout spans are copied. No accessible roles, links, IDs,
// media, source classes, event handlers or original background paint escape.
function copyTextTree(source, pairs, readStyle) {
  if (source.nodeType === Node.TEXT_NODE) return document.createTextNode(source.textContent);
  if (source.nodeType !== Node.ELEMENT_NODE || source.matches(MEDIA)) return null;
  const tag = source.tagName.toLowerCase();
  const clone = document.createElement(tag === "br" || tag === "wbr" ? tag : "span");
  const style = readStyle(source);
  [...TYPOGRAPHY, ...LAYOUT].forEach((property) => clone.style.setProperty(property, style.getPropertyValue(property)));
  Object.assign(clone.style, {
    color: style.color, webkitTextFillColor: style.color, webkitTextStrokeColor: style.color,
    textDecorationColor: style.color, borderColor: "transparent", background: "none", outline: "none",
    boxShadow: "none", textShadow: "none", filter: "none", mixBlendMode: "normal", maskImage: "none",
    webkitMaskImage: "none", clipPath: "none", animation: "none", transition: "none", pointerEvents: "none",
  });
  pairs.push({ source, clone });
  source.childNodes.forEach((child) => {
    const copy = copyTextTree(child, pairs, readStyle);
    if (copy) clone.append(copy);
  });
  return clone;
}

function selectedRects(element, selection) {
  if (!selection || selection.isCollapsed || !selection.rangeCount) return [];
  const result = [];
  for (let index = 0; index < selection.rangeCount; index += 1) {
    const range = selection.getRangeAt(index);
    if (!range.intersectsNode(element)) continue;
    const part = document.createRange();
    part.selectNodeContents(element);
    if (range.compareBoundaryPoints(Range.START_TO_START, part) > 0) part.setStart(range.startContainer, range.startOffset);
    if (range.compareBoundaryPoints(Range.END_TO_END, part) < 0) part.setEnd(range.endContainer, range.endOffset);
    if (part.collapsed) continue;
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      if (!part.intersectsNode(node)) continue;
      const text = document.createRange();
      text.selectNodeContents(node);
      if (part.compareBoundaryPoints(Range.START_TO_START, text) > 0) text.setStart(part.startContainer, part.startOffset);
      if (part.compareBoundaryPoints(Range.END_TO_END, text) < 0) text.setEnd(part.endContainer, part.endOffset);
      if (!text.collapsed) result.push(...text.getClientRects());
    }
  }
  return result;
}

function selectionCutout(rects, width, height) {
  if (!rects.length) return "none";
  const box = (left, top, right, bottom) => `M${left},${top}H${right}V${bottom}H${left}Z`;
  // Keep only individual selected text-node rectangles below; their line
  // fragments are disjoint, avoiding overlapping element-box cutout holes.
  return `path(evenodd, "${box(0, 0, width, height)} ${rects.map((rect) => box(rect.left, rect.top, rect.right, rect.bottom)).join(" ")}")`;
}

/**
 * Mirror only explicitly verified, trapped text paint at the document backdrop.
 * pageRoot may be an Element, ref or selector. textSelectors is a selector/string
 * array; overlapping selections are reduced to their outermost text-only root.
 * Navigation fading is applied exactly once in viewport space. The original DOM
 * keeps its masks, hit testing, native selection, focus and accessible semantics.
 */
export default function useBackdropTextInk(pageRoot, textSelectors, { navigationFade = true, zIndex = 21, preserveFilledControls = true } = {}) {
  const selectors = Array.isArray(textSelectors) ? textSelectors.join(",") : textSelectors;
  useLayoutEffect(() => {
    const page = typeof pageRoot === "string" ? document.querySelector(pageRoot) : pageRoot?.current ?? pageRoot;
    if (!page || !selectors || !CSS.supports("-webkit-text-fill-color", "transparent")
      || !CSS.supports("clip-path", 'path(evenodd, "M0,0H1V1H0Z")')) return undefined;
    const layer = document.createElement("div");
    layer.className = `backdrop-text-ink-layer${navigationFade ? " backdrop-text-ink-navigation-fade" : ""}`;
    layer.setAttribute("aria-hidden", "true");
    layer.setAttribute("inert", "");
    layer.style.zIndex = String(zIndex);
    document.body.append(layer);
    let active = true;
    let frame = 0;
    let motionUntil = 0;
    let rebuild = true;
    let entries = [];
    const visible = new Set();
    const signatures = new WeakMap();
    const signature = (element) => `${element.getAttribute("style")}|${element.getAttribute("class")}|${element.hidden}`;
    const warned = new Set();
    const observedSizes = new WeakMap();
    const warn = (reason) => {
      if (warned.has(reason)) return;
      warned.add(reason);
      console.warn(`[Backdrop text ink] Keeping original paint: ${reason}`);
    };
    const restore = (entry) => {
      if (!entry.hadClass) entry.source.classList.remove(SOURCE_CLASS);
      if (!entry.hadGradient) entry.source.removeAttribute(GRADIENT_ATTRIBUTE);
      signatures.set(entry.source, signature(entry.source));
    };
    const schedule = (duration = 450) => {
      if (!active) return;
      motionUntil = Math.max(motionUntil, performance.now() + (typeof duration === "number" ? duration : 450));
      if (!frame) frame = requestAnimationFrame(update);
    };
    const flush = () => {
      if (!active) return;
      // React commits and card clipping can write after this layer's RAF.
      // Mirror those completed DOM writes before the same frame is painted,
      // rather than leaving the previous clip/position until the next RAF.
      motionUntil = Math.max(motionUntil, performance.now() + 450);
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      update();
    };
    const attributes = new MutationObserver((records) => {
      let changed = false;
      records.forEach(({ target }) => {
        const next = signature(target);
        if (signatures.get(target) === next) return;
        signatures.set(target, next);
        changed = true;
      });
      if (changed) flush();
    });
    const intersection = new IntersectionObserver((records) => {
      records.forEach(({ target, isIntersecting }) => {
        if (isIntersecting) visible.add(target);
        else visible.delete(target);
      });
      schedule(0);
    }, { rootMargin: "120px" });
    const resize = new ResizeObserver((records) => {
      let changed = false;
      records.forEach(({ target, contentRect }) => {
        const size = `${contentRect.width}|${contentRect.height}`;
        if (observedSizes.has(target) && observedSizes.get(target) !== size) changed = true;
        observedSizes.set(target, size);
      });
      if (changed) { rebuild = true; schedule(); }
    });
    const content = new MutationObserver(() => { rebuild = true; schedule(); });

    function buildEntries(readStyle) {
      attributes.disconnect();
      intersection.disconnect();
      resize.disconnect();
      entries.forEach(restore);
      entries = [];
      visible.clear();
      layer.replaceChildren();
      const matches = [...page.querySelectorAll(selectors)];
      const roots = matches.filter((element) => !matches.some((other) => other !== element && other.contains(element)));
      const watched = new Set();
      roots.forEach((source) => {
        if (!source.textContent.trim() || source.matches(MEDIA) || source.querySelector(MEDIA)) return;
        const ancestors = [];
        for (let ancestor = source; ancestor && ancestor !== document.body; ancestor = ancestor.parentElement) {
          ancestors.push(ancestor);
          watched.add(ancestor);
        }
        const pairs = [];
        const clone = copyTextTree(source, pairs, readStyle);
        const clip = document.createElement("div");
        clip.className = "backdrop-text-ink-clip";
        const selection = document.createElement("div");
        selection.className = "backdrop-text-ink-selection";
        selection.append(clone);
        clip.append(selection);
        layer.append(clip);
        entries.push({ source, clone, pairs, clip, selection, ancestors, hadClass: source.classList.contains(SOURCE_CLASS), hadGradient: source.hasAttribute(GRADIENT_ATTRIBUTE) });
        visible.add(source);
        intersection.observe(source);
        resize.observe(source);
      });
      watched.forEach((element) => {
        signatures.set(element, signature(element));
        attributes.observe(element, { attributes: true, attributeFilter: ["style", "class", "hidden"] });
      });
      resize.observe(page);
      rebuild = false;
    }

    function update() {
      frame = 0;
      if (!active) return;
      const styles = new Map();
      const bounds = new Map();
      const readStyle = (element) => {
        if (!styles.has(element)) styles.set(element, getComputedStyle(element));
        return styles.get(element);
      };
      const readBounds = (element) => {
        if (!bounds.has(element)) bounds.set(element, element.getBoundingClientRect());
        return bounds.get(element);
      };
      if (rebuild) buildEntries(readStyle);
      const width = document.documentElement.clientWidth;
      const height = window.innerHeight;
      const selection = document.getSelection();
      // First read all geometry, then perform writes. Offscreen leaves do not
      // repeatedly read computed styles or layout while another scene moves.
      const measures = entries.map((entry) => {
        if (!visible.has(entry.source)) return { entry, hidden: true };
        const rect = readBounds(entry.source);
        const style = readStyle(entry.source);
        // The existing MORE control intentionally becomes dark text on a filled
        // circle. Keep that established control treatment on the native target.
        const filledControl = preserveFilledControls && entry.source.matches("a, button")
          && style.backgroundColor !== "transparent"
          && !/^rgba\([^)]*,\s*0(?:\.0+)?\s*\)$/.test(style.backgroundColor);
        if (filledControl) return { entry, nativeControl: true };
        const localWidth = localSize(entry.source, style, "width");
        const localHeight = localSize(entry.source, style, "height");
        if (!localWidth || !localHeight || !rect.width || !rect.height) return { entry, hidden: true };
        const scaleX = rect.width / localWidth;
        const scaleY = rect.height / localHeight;
        let top = 0, right = width, bottom = height, left = 0, opacity = 1;
        let unsupported = "";
        entry.ancestors.forEach((ancestor) => {
          const current = readStyle(ancestor);
          opacity *= parseFloat(current.opacity);
          if (current.display === "none" || current.visibility !== "visible") opacity = 0;
          if (!axisAligned(current.transform)) unsupported = "rotated or perspective text ancestor";
          const faded = navigationFade && ancestor.matches(NAVIGATION_FADE);
          const mask = current.maskImage || current.webkitMaskImage;
          if (mask && mask !== "none" && !faded) unsupported = "unrecognized text mask";
          const clipping = current.clipPath !== "none" && !faded;
          const overflowX = /hidden|clip|auto|scroll/.test(current.overflowX);
          const overflowY = /hidden|clip|auto|scroll/.test(current.overflowY);
          if (!clipping && !overflowX && !overflowY) return;
          const box = readBounds(ancestor);
          if (overflowX) { left = Math.max(left, box.left); right = Math.min(right, box.right); }
          if (overflowY) { top = Math.max(top, box.top); bottom = Math.min(bottom, box.bottom); }
          if (clipping) {
            const w = localSize(ancestor, current, "width");
            const h = localSize(ancestor, current, "height");
            const inset = insetEdges(current.clipPath, w, h);
            if (!inset) { unsupported = "non-rectangular text clip"; return; }
            const sx = box.width / (w || 1), sy = box.height / (h || 1);
            top = Math.max(top, box.top + inset[0] * sy);
            right = Math.min(right, box.right - inset[1] * sx);
            bottom = Math.min(bottom, box.bottom - inset[2] * sy);
            left = Math.max(left, box.left + inset[3] * sx);
          }
        });
        const paints = entry.pairs.map(({ source, clone }) => {
          const current = readStyle(source);
          return { clone, color: current.color, opacity: source === entry.source ? "1" : current.opacity,
            decoration: current.textDecorationLine, decorationStyle: current.textDecorationStyle,
            decorationThickness: current.textDecorationThickness, underlineOffset: current.textUnderlineOffset };
        });
        return { entry, rect, localWidth, localHeight, scaleX, scaleY, opacity, paints, unsupported,
          gradient: style.backgroundClip === "text" || style.webkitBackgroundClip === "text",
          clip: `inset(${Math.max(0, top)}px ${Math.max(0, width - right)}px ${Math.max(0, height - bottom)}px ${Math.max(0, left)}px)`,
          cutout: selectionCutout(selectedRects(entry.source, selection), width, height),
          hidden: rect.bottom < -120 || rect.top > height + 120 || rect.right < -120 || rect.left > width + 120 || right <= left || bottom <= top || !opacity };
      });
      measures.forEach((measurement) => {
        const { entry } = measurement;
        if (measurement.unsupported || measurement.nativeControl) {
          if (measurement.unsupported) warn(`${measurement.unsupported}: ${entry.source.className}`);
          restore(entry);
          entry.clip.style.visibility = "hidden";
          return;
        }
        entry.clip.style.visibility = measurement.hidden ? "hidden" : "visible";
        if (measurement.hidden) return;
        const { rect, localWidth, localHeight, scaleX, scaleY, opacity, paints, clip, cutout, gradient } = measurement;
        Object.assign(entry.clone.style, {
          position: "absolute", left: `${rect.left}px`, top: `${rect.top}px`, right: "auto", bottom: "auto",
          width: `${localWidth}px`, height: `${localHeight}px`, boxSizing: "border-box", margin: "0",
          minWidth: "0", maxWidth: "none", minHeight: "0", maxHeight: "none",
          transformOrigin: "0 0", transform: `scale(${scaleX}, ${scaleY})`,
        });
        paints.forEach(({ clone, color, opacity: alpha, decoration, decorationStyle, decorationThickness, underlineOffset }) => {
          clone.style.color = color;
          clone.style.webkitTextFillColor = color;
          clone.style.webkitTextStrokeColor = color;
          clone.style.textDecorationColor = color;
          clone.style.textDecorationLine = decoration;
          clone.style.textDecorationStyle = decorationStyle;
          clone.style.textDecorationThickness = decorationThickness;
          clone.style.textUnderlineOffset = underlineOffset;
          clone.style.opacity = alpha;
        });
        entry.clip.style.opacity = String(opacity);
        entry.clip.style.clipPath = clip;
        entry.selection.style.clipPath = cutout;
        if (gradient) entry.source.setAttribute(GRADIENT_ATTRIBUTE, "");
        entry.source.classList.add(SOURCE_CLASS);
        // Ignore our own paint-only class writes in the observer. Otherwise an
        // initial class addition would cause a redundant synchronous flush.
        signatures.set(entry.source, signature(entry.source));
      });
      if (performance.now() < motionUntil && !frame) frame = requestAnimationFrame(update);
    }

    const refresh = () => { rebuild = true; schedule(); };
    const selectionChanged = () => schedule(0);
    const transition = (event) => {
      if (entries.some(({ source }) => source === event.target || event.target.contains(source))) schedule(600);
    };
    const hover = (event) => {
      if (entries.some(({ source }) => source === event.target || source.contains(event.target))) schedule(300);
    };
    content.observe(page, { childList: true, characterData: true, subtree: true });
    window.addEventListener("scroll", schedule, { passive: true, capture: true });
    window.addEventListener("resize", refresh);
    window.visualViewport?.addEventListener("resize", refresh);
    document.addEventListener("selectionchange", selectionChanged);
    page.addEventListener("transitionrun", transition);
    page.addEventListener("transitionend", transition);
    page.addEventListener("pointerover", hover);
    page.addEventListener("pointerout", hover);
    page.addEventListener("focusin", schedule);
    page.addEventListener("focusout", schedule);
    const mediaQueries = [matchMedia("(prefers-reduced-motion: reduce)"), matchMedia("(forced-colors: active)")];
    mediaQueries.forEach((query) => query.addEventListener("change", refresh));
    document.fonts?.addEventListener("loadingdone", refresh);
    document.fonts?.ready.then(() => { if (active) refresh(); });
    update();
    schedule();
    return () => {
      active = false;
      cancelAnimationFrame(frame);
      attributes.disconnect(); intersection.disconnect(); resize.disconnect(); content.disconnect();
      window.removeEventListener("scroll", schedule, true);
      window.removeEventListener("resize", refresh);
      window.visualViewport?.removeEventListener("resize", refresh);
      document.removeEventListener("selectionchange", selectionChanged);
      page.removeEventListener("transitionrun", transition);
      page.removeEventListener("transitionend", transition);
      page.removeEventListener("pointerover", hover);
      page.removeEventListener("pointerout", hover);
      page.removeEventListener("focusin", schedule);
      page.removeEventListener("focusout", schedule);
      mediaQueries.forEach((query) => query.removeEventListener("change", refresh));
      document.fonts?.removeEventListener("loadingdone", refresh);
      entries.forEach(restore);
      layer.remove();
    };
  }, [pageRoot, selectors, navigationFade, zIndex, preserveFilledControls]);
}
