// One-shot raster work; no scroll listener or animation loop runs here.
let sourceURL = "", sourceBlob;
self.onmessage = async ({ data }) => {
  const { id, source: imageURL, width, height, cssWidth, cssHeight, dpr } = data;
  let bitmap, input, output, result;
  try {
    if (sourceURL !== imageURL || !sourceBlob) {
      const response = await fetch(imageURL);
      if (!response.ok) throw new Error("Background unavailable");
      sourceBlob = await response.blob(); sourceURL = imageURL;
    }
    bitmap = await createImageBitmap(sourceBlob);
    input = new OffscreenCanvas(width, height);
    output = new OffscreenCanvas(width, height);
    const source = input.getContext("2d");
    const target = output.getContext("2d");
    if (!source || !target || !("filter" in target)) throw new Error("Canvas filter unavailable");
    const scale = Math.max(cssWidth / bitmap.width, cssHeight / bitmap.height);
    const sw = cssWidth / scale, sh = cssHeight / scale;
    source.drawImage(bitmap, (bitmap.width - sw) / 2, (bitmap.height - sh) / 2,
      sw, sh, 0, 0, width, height);
    target.filter = `grayscale(1) invert(1) brightness(1.10) contrast(.82) blur(${18 * dpr}px)`;
    if (target.filter === "none") throw new Error("Canvas filter rejected");
    target.drawImage(input, 0, 0);
    if (target.isContextLost?.() || source.isContextLost?.()) throw new Error("Canvas context lost");
    result = output.transferToImageBitmap();
    self.postMessage({ id, bitmap: result }, [result]);
    result = null;
  } catch {
    sourceBlob = null; sourceURL = "";
    self.postMessage({ id, failed: true });
  } finally {
    bitmap?.close(); result?.close();
    if (input) { input.width = 0; input.height = 0; }
    if (output) { output.width = 0; output.height = 0; }
  }
};
