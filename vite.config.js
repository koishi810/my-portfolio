import { defineConfig } from "vite";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";

// Default builds retain root hosting. Only the Pages workflow supplies a base.
const base = process.env.PORTFOLIO_BASE || "/";

export default defineConfig({
  base,
  plugins: [{
    name: "portfolio-subpath-assets",
    enforce: "pre",
    transform(code, id) {
      if (base === "/" || !/\/src\/.*\.[jt]sx?$/.test(id)) return;
      // Vite rebases CSS URLs itself; data-driven JS image URLs need the same base.
      return code.replace(/(["'`])\/assets\//g, `$1${base}assets/`);
    },
    closeBundle() {
      if (base === "/") return;
      const html = readFileSync("dist/index.html", "utf8");
      const routes = [...readFileSync("src/App.jsx", "utf8").matchAll(/\{ path: "([^"#]+)"/g)];
      for (const [, route] of routes) {
        if (route === "/") continue;
        const directory = resolve("dist", route.slice(1));
        mkdirSync(directory, { recursive: true });
        writeFileSync(resolve(directory, "index.html"), html);
      }
      writeFileSync("dist/404.html", html);
      writeFileSync("dist/.nojekyll", "");
      writeFileSync("dist/deployment.json", JSON.stringify({ commit: process.env.GITHUB_SHA || "local", base }) + "\n");
    },
  }],
});
