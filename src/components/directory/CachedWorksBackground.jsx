import { useEffect, useRef } from "react";

const SOURCE = "/assets/test/about-scroll/bg.png";
const MAX_PIXELS = 8 * 1024 * 1024;

// Cache only this static decorative photo. Artwork, text and the existing
// parent pointer transform remain normal DOM layers.
export default function CachedWorksBackground() {
  const imageRef = useRef(null);
  const canvasRef = useRef(null);
  useEffect(() => {
    const image = imageRef.current, canvas = canvasRef.current;
    if (!image || !canvas || !window.Worker || !window.OffscreenCanvas) return;
    let active = true, decoded = false, lost = false, busy = false;
    let frame = 0, resizeTimer = 0, jobTimer = 0, serial = 0, decodeEpoch = 0, pending = null, signature = "";
    let resolutionQuery, worker, renderer;
    const fallback = () => { canvas.removeAttribute("data-ready"); image.style.visibility = ""; };
    const release = () => {
      fallback(); signature = "";
      canvas.width = 0; canvas.height = 0;
      try { renderer?.transferFromImageBitmap(null); } catch { /* original image remains visible */ }
    };
    const dimensions = () => {
      const box = image.getBoundingClientRect(), dpr = window.devicePixelRatio || 1;
      return { cssWidth: box.width, cssHeight: box.height, dpr,
        width: Math.ceil(box.width * dpr), height: Math.ceil(box.height * dpr),
        key: `${box.width}|${box.height}|${dpr}|${image.currentSrc}` };
    };
    const schedule = () => { if (active && !frame) frame = window.requestAnimationFrame(paint); };
    const paint = () => {
      frame = 0;
      if (!active || lost || busy || !decoded || !image.naturalWidth || !worker) return;
      const size = dimensions();
      if (size.key === signature && canvas.width === size.width && canvas.height === size.height) { canvas.dataset.ready = "true"; image.style.visibility = "hidden"; return; }
      fallback();
      if (!size.width || !size.height || size.width * size.height > MAX_PIXELS || size.width > 8192 || size.height > 8192) { release(); return; }
      busy = true;
      const id = ++serial;
      pending = { id, ...size };
      try {
        jobTimer = window.setTimeout(() => { if (pending?.id === id) workerFailed(); }, 8000);
        worker.postMessage({ id, source: image.currentSrc, ...size });
      } catch {
        window.clearTimeout(jobTimer); busy = false; pending = null; release();
      }
    };
    const received = ({ data }) => {
      if (!active) { data.bitmap?.close(); return; }
      const job = pending;
      if (!job || data.id !== job.id) { data.bitmap?.close(); return; }
      window.clearTimeout(jobTimer); busy = false; pending = null;
      if (!decoded || data.id !== serial || lost) {
        data.bitmap?.close(); if (decoded && !lost) schedule(); return;
      }
      if (job.key !== dimensions().key) { data.bitmap?.close(); schedule(); return; }
      if (data.failed || !data.bitmap) { release(); return; }
      let committed = false;
      try {
        const context = renderer || (renderer = canvas.getContext("bitmaprenderer"));
        if (!context || !context.transferFromImageBitmap || context.isContextLost?.()) return;
        canvas.width = job.width; canvas.height = job.height;
        context.transferFromImageBitmap(data.bitmap);
        if (lost || context.isContextLost?.()) return;
        signature = job.key;
        canvas.dataset.ready = "true"; image.style.visibility = "hidden";
        committed = true;
      } catch {
        fallback();
      } finally { data.bitmap.close(); if (!committed) release(); }
    };
    const workerFailed = () => { if (!active) return; window.clearTimeout(jobTimer); busy = false; pending = null; release(); worker?.terminate(); worker = null; };
    const startWorker = () => {
      try { worker = new Worker(new URL("./worksBackground.worker.js", import.meta.url), { type: "module" }); }
      catch { worker = null; return; }
      const instance = worker;
      instance.onmessage = received;
      const instanceFailed = () => { if (worker === instance) workerFailed(); };
      instance.onerror = instanceFailed; instance.onmessageerror = instanceFailed;
    };
    const pageHidden = () => {
      ++serial; busy = false; pending = null;
      worker?.terminate(); worker = null;
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0; window.clearTimeout(resizeTimer); window.clearTimeout(jobTimer);
      release();
    };
    const scheduleResize = () => { fallback(); window.clearTimeout(resizeTimer); resizeTimer = window.setTimeout(schedule, 120); };
    const loaded = async () => {
      const epoch = ++decodeEpoch;
      decoded = false; signature = ""; fallback();
      try { if (image.decode) await image.decode(); } catch { if (active && epoch === decodeEpoch) release(); return; }
      if (!active || epoch !== decodeEpoch || !image.naturalWidth) return;
      decoded = true; schedule();
    };
    const failed = () => { decoded = false; ++serial; ++decodeEpoch; release(); };
    const watchResolution = () => {
      resolutionQuery?.removeEventListener("change", resolutionChanged);
      resolutionQuery = window.matchMedia(`(resolution: ${window.devicePixelRatio || 1}dppx)`);
      resolutionQuery.addEventListener("change", resolutionChanged);
    };
    const resolutionChanged = () => { watchResolution(); scheduleResize(); };
    const restored = () => { if (!worker) startWorker(); signature = ""; schedule(); };
    const contextRestored = () => { lost = false; restored(); };
    const contextLost = () => {
      lost = true; signature = ""; fallback();
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0; window.clearTimeout(resizeTimer);
    };
    startWorker();
    const observer = new ResizeObserver(scheduleResize);
    observer.observe(image);
    image.addEventListener("load", loaded); image.addEventListener("error", failed);
    canvas.addEventListener("contextlost", contextLost); canvas.addEventListener("contextrestored", contextRestored);
    window.addEventListener("resize", scheduleResize); window.addEventListener("pageshow", restored); window.addEventListener("pagehide", pageHidden);
    watchResolution(); if (image.complete && image.naturalWidth) loaded();
    return () => {
      active = false; ++serial; ++decodeEpoch;
      if (frame) window.cancelAnimationFrame(frame);
      window.clearTimeout(resizeTimer); window.clearTimeout(jobTimer); observer.disconnect(); worker?.terminate(); worker = null;
      resolutionQuery?.removeEventListener("change", resolutionChanged);
      image.removeEventListener("load", loaded); image.removeEventListener("error", failed);
      canvas.removeEventListener("contextlost", contextLost); canvas.removeEventListener("contextrestored", contextRestored);
      window.removeEventListener("resize", scheduleResize); window.removeEventListener("pageshow", restored); window.removeEventListener("pagehide", pageHidden);
      release();
    };
  }, []);
  return <>
    <img ref={imageRef} alt="" src={SOURCE} />
    <canvas ref={canvasRef} className="directory-background-cache" aria-hidden="true" />
  </>;
}
