import { useEffect, useRef } from "react";

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function formatFrameName(pattern, index) {
  const plainIndex = String(index);
  return pattern
    .replace("{index:0000}", String(index).padStart(4, "0"))
    .replace("{index:000}", String(index).padStart(3, "0"))
    .replace("{index}", plainIndex);
}

function drawCover(context, image, width, height) {
  if (!image || !image.complete || !image.naturalWidth || !image.naturalHeight) return;

  const imageRatio = image.naturalWidth / image.naturalHeight;
  const canvasRatio = width / height;
  let drawWidth = width;
  let drawHeight = height;
  let drawX = 0;
  let drawY = 0;

  if (imageRatio > canvasRatio) {
    drawHeight = height;
    drawWidth = height * imageRatio;
    drawX = (width - drawWidth) / 2;
  } else {
    drawWidth = width;
    drawHeight = width / imageRatio;
    drawY = (height - drawHeight) / 2;
  }

  context.clearRect(0, 0, width, height);
  context.drawImage(image, drawX, drawY, drawWidth, drawHeight);
}

export default function ScrollImageSequence({
  basePath,
  frameCount,
  extension,
  filenamePattern,
  className = "",
  logicalHeight,
  logicalWidth,
  progress,
  scrollSectionSelector = ".yezi-scroll-section",
}) {
  const canvasRef = useRef(null);
  const imagesRef = useRef([]);
  const lastDrawableImageRef = useRef(null);
  const lastPaintRef = useRef(null);
  const currentFrameRef = useRef(0);
  const rafRef = useRef(null);
  const drawRef = useRef(() => {});
  const progressRef = useRef(progress);

  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  useEffect(() => {
    // A new sequence must never inherit a frame from the previous dataset.
    lastDrawableImageRef.current = null;
    lastPaintRef.current = null;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (context) {
      context.save();
      context.setTransform(1, 0, 0, 1, 0, 0);
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.restore();
    }

    const images = Array.from({ length: frameCount }, (_, frameIndex) => {
      const image = new Image();
      const src = `${basePath}/${formatFrameName(filenamePattern, frameIndex + 1)}.${extension}`;
      image.src = src;
      image.onload = () => {
        if (frameIndex === currentFrameRef.current || frameIndex === 0) {
          drawRef.current();
        }
      };
      image.onerror = () => {
        console.warn(`Failed to load image sequence frame: ${src}`);
      };
      return image;
    });

    imagesRef.current = images;
    currentFrameRef.current = 0;
    drawRef.current();

    return () => {
      images.forEach((image) => {
        image.onload = null;
        image.onerror = null;
      });
    };
  }, [basePath, extension, filenamePattern, frameCount]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const context = canvas.getContext("2d");
    const section = typeof progressRef.current === "number" ? null : canvas.closest(scrollSectionSelector);
    if (!context || (!section && typeof progressRef.current !== "number")) return undefined;
    canvas.dataset.frameIndex = "1";
    canvas.dataset.progress = "0.000";
    let renderedFrameLabel = "1";
    let renderedProgressLabel = "0.000";
    let canvasDpr = null;

    const drawCurrentFrame = () => {
      const image = imagesRef.current[currentFrameRef.current];
      if (image?.complete && image.naturalWidth && image.naturalHeight) {
        lastDrawableImageRef.current = image;
      }
      const drawable = lastDrawableImageRef.current;
      if (!drawable) return;

      // The home sequences use fixed design dimensions. Avoid a layout read
      // there, and repaint only when the pixels or their drawing size change.
      const canvasRect = logicalWidth == null || logicalHeight == null
        ? canvas.getBoundingClientRect()
        : null;
      const drawWidth = logicalWidth ?? canvasRect.width;
      const drawHeight = logicalHeight ?? canvasRect.height;
      const lastPaint = lastPaintRef.current;
      if (lastPaint?.image === drawable && lastPaint.width === drawWidth && lastPaint.height === drawHeight) return;
      // Resizing clears the canvas; redraw the last valid frame if this one failed.
      drawCover(context, drawable, drawWidth, drawHeight);
      lastPaintRef.current = { image: drawable, width: drawWidth, height: drawHeight };
    };

    drawRef.current = drawCurrentFrame;

    const resizeCanvas = () => {
      const rect = logicalWidth == null || logicalHeight == null
        ? canvas.getBoundingClientRect()
        : null;
      const drawWidth = logicalWidth ?? rect.width;
      const drawHeight = logicalHeight ?? rect.height;
      const dpr = window.devicePixelRatio || 1;
      const pixelWidth = Math.max(1, Math.round(drawWidth * dpr));
      const pixelHeight = Math.max(1, Math.round(drawHeight * dpr));
      if (canvas.width !== pixelWidth || canvas.height !== pixelHeight || canvasDpr !== dpr) {
        canvas.width = pixelWidth;
        canvas.height = pixelHeight;
        context.setTransform(dpr, 0, 0, dpr, 0, 0);
        canvasDpr = dpr;
        lastPaintRef.current = null;
      }
      drawCurrentFrame();
    };

    const restoreContext = () => {
      // A restored 2D context has lost both its pixels and drawing state.
      // Re-establish the existing DPR transform even when the frame is unchanged.
      canvasDpr = null;
      lastPaintRef.current = null;
      resizeCanvas();
    };

    const updateFrame = () => {
      let sequenceProgress = progressRef.current;

      if (typeof sequenceProgress !== "number") {
        const rect = section.getBoundingClientRect();
        const scrollable = Math.max(rect.height - window.innerHeight, 1);
        const scrolled = -rect.top;
        sequenceProgress =
          scrollable - scrolled <= 2 ? 1 : clamp(scrolled / scrollable, 0, 1);
      }

      sequenceProgress = clamp(sequenceProgress, 0, 1);
      const frameIndex = Math.floor(sequenceProgress * (frameCount - 1));
      currentFrameRef.current = frameIndex;
      const frameLabel = String(frameIndex + 1);
      const progressLabel = sequenceProgress.toFixed(3);
      if (frameLabel !== renderedFrameLabel) {
        canvas.dataset.frameIndex = frameLabel;
        renderedFrameLabel = frameLabel;
      }
      if (progressLabel !== renderedProgressLabel) {
        canvas.dataset.progress = progressLabel;
        renderedProgressLabel = progressLabel;
      }
      drawCurrentFrame();
    };

    const loop = () => {
      updateFrame();
      rafRef.current = window.requestAnimationFrame(loop);
    };

    resizeCanvas();
    rafRef.current = window.requestAnimationFrame(loop);
    window.addEventListener("resize", resizeCanvas);
    canvas.addEventListener("contextrestored", restoreContext);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      canvas.removeEventListener("contextrestored", restoreContext);
      if (rafRef.current !== null) window.cancelAnimationFrame(rafRef.current);
    };
  }, [frameCount, logicalHeight, logicalWidth, scrollSectionSelector]);

  return <canvas aria-hidden="true" className={className} ref={canvasRef} />;
}
