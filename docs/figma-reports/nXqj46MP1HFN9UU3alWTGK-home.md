# Figma Import Spec

## Source
- File: LUYUFAN Portfolio / 作品集设计
- Page node: `172:3` / `01_首页`
- Hero: `249:431`, length reference `251:537`
- About: `259:691`, animation references `259:737`, `259:783`, `259:829`, `259:875`
- Works: `267:922`
- Contact: `274:1763`

## Design Structure
- Continuous home page, not separate static screens.
- Shared visual system: fixed background, fixed overlay/mask, fixed global chrome, scroll sections above it.
- Opening layer sits over the page and transitions into the hero state.
- Hero and About use sticky 1440 x 905 design stages with scroll progress.
- Works uses a long section with a fixed title, three project rows, hoverable visual blocks, and an ALL WORKS entry.
- Contact removes the overlay/mask and keeps the background visible.

## Assets
- Background: `/assets/test/about-scroll/bg.png`
- Hero image sequence: `/assets/sequences/yezi/0001.png` through `/0048.png`
- About image sequence: `/assets/sequences/shitou/0001.png` through `/0048.png`
- Works assets:
  - `/assets/home/koko-logo.png`
  - `/assets/home/flower-machine.png`
  - `/assets/home/arctic-lab.png`
  - `/assets/home/hero-leaf.png`

## Prototype Mapping
- Intro: CSS opacity and transform transition, 1.5 seconds.
- Hero: sticky section, canvas frame progress from section scroll progress.
- About: sticky section, subject entry, then 48-frame sequence, small title, character reveal, MORE fade-in.
- Works: mask phase switches to exclusion/light overlay; rows scroll normally.
- Contact: mask phase switches off.
- Background has subtle pointer-follow parallax.

## Web Mapping
- `src/pages/Home.jsx`
- `src/components/home/PortfolioHome.jsx`
- `src/hooks/useScrollProgress.js`
- `src/styles/portfolio-home.css`
- `src/App.jsx`

## Verification
- Run `npm run build`.
- Run or reuse `npm run dev`, then check `/`.
- Existing test pages remain available.
