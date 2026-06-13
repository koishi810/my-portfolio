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
  const currentFrameRef = useRef(0);
  const rafRef = useRef(null);
  const drawRef = useRef(() => {});
  const progressRef = useRef(progress);

  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  useEffect(() => {
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

    const drawCurrentFrame = () => {
      const canvasRect = canvas.getBoundingClientRect();
      const drawWidth = logicalWidth ?? canvasRect.width;
      const drawHeight = logicalHeight ?? canvasRect.height;
      const image = imagesRef.current[currentFrameRef.current];
      drawCover(context, image, drawWidth, drawHeight);
    };

    drawRef.current = drawCurrentFrame;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const drawWidth = logicalWidth ?? rect.width;
      const drawHeight = logicalHeight ?? rect.height;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.max(1, Math.round(drawWidth * dpr));
      canvas.height = Math.max(1, Math.round(drawHeight * dpr));
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawCurrentFrame();
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
      canvas.dataset.frameIndex = String(frameIndex + 1);
      canvas.dataset.progress = sequenceProgress.toFixed(3);
      drawCurrentFrame();
    };

    const loop = () => {
      updateFrame();
      rafRef.current = window.requestAnimationFrame(loop);
    };

    resizeCanvas();
    rafRef.current = window.requestAnimationFrame(loop);
    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (rafRef.current !== null) window.cancelAnimationFrame(rafRef.current);
    };
  }, [frameCount, logicalHeight, logicalWidth, scrollSectionSelector]);

  return <canvas aria-hidden="true" className={className} ref={canvasRef} />;
}
