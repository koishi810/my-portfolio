# Figma Import Spec

## Source
- File: LUYUFAN Portfolio / 作品集设计
- Node: `306:5399` / `KOKO 详细作品页`
- Target route: `/works/koko`

## Design Structure
- A single sticky viewport drives a horizontal project detail canvas.
- Base design size is `1440 x 905`.
- The visual system follows the homepage logic: fixed background, fixed mask layers, fixed top chrome, and a moving content stage.
- Background, mask, and top chrome are mounted at the page root so they remain visible through both the horizontal intro and vertical image reading section.
- Content stage starts with the KOKO hero and slides rightward through project metadata, project introduction, and future PDF content.

## Layout Notes
- Fixed background uses the existing KOKO asset at `/assets/home/koko-background.png`.
- The background has a subtle mouse-follow offset.
- Mask layers follow Figma intent:
  - white exclusion mask for background inversion
  - gray translucent blur layer above it
- Top chrome contains:
  - `Portfolio ver0.1`
  - `2026.06.09 更新しました`
  - `TOP / WORKS / ABOUT ME`
- KOKO title, body, and metadata text use the same treatment as homepage Works text: `#e6e6e6`, `mix-blend-mode: difference`, plus `filter: invert(1)` on the concrete text elements.
- Main copy matches the Figma text hierarchy:
  - date: `15px`
  - title: `32px`
  - type: `20px`
  - body and metadata values: `15px`

## PDF Mapping
- Source PDF: `/Users/koishi810/Downloads/KOKO_UI.pdf`

## Portfolio Page Image Mapping
- The PDF was rendered into 15 high-resolution PNG pages for stable web scrolling.
- Image assets originally rendered as `/assets/projects/koko/pages/page-001.png` through `/page-015.png`
- Horizontal endpoint image: `/page-001.png` cover.
- Vertical displayed image range: `/page-002.png` through `/page-014.png`.
- Removed from project assets: `page-015.png` self-introduction.
- Render size: `2400 x 1695`
- The horizontal section ends on the cover, `page-001.png`, aligned to the right side of the track.
- Horizontal movement finishes before the section ends, leaving a short scroll pause on the cover.
- After the pause, the vertical image reading flow starts at `page-002.png`, so the cover is kept but not duplicated.
- The horizontal endpoint page and vertical page list share the same `.koko-work-page-frame` sizing rule.
- Horizontal page width is calculated from `viewportWidth / stageScale`, so after stage scaling it visually matches `100vw`.
- Page frame sizing now uses contain logic: width is `min(100vw, 100svh * 2400 / 1695)`, so page bottoms remain visible on wide screens.
- Horizontal endpoint and vertical pages are centered while keeping the same contain sizing rule.
- The vertical reading section background is transparent, allowing the global KOKO background and mask to remain visible around centered page images.
- The generated PDF copies were removed from `public/` so the deployed site does not ship unused PDF files.

## Web Mapping
- Page: `src/pages/projects/Koko.jsx`
- Styles: `src/styles/koko-project.css`
- Route: `src/App.jsx`
- Home entry link: `src/components/home/PortfolioHome.jsx`

## Verification
- Run `npm run build`.
- Check `/works/koko`.
- Confirm vertical scroll moves the KOKO stage horizontally.
- Confirm the horizontal track stops briefly on `page-001.png` before vertical scrolling begins.
- Confirm the vertical reading section starts at `page-002.png`.
- Confirm the cover is visible once only.
- Confirm the page bottom is visible when the cover enters the horizontal endpoint.
- Confirm there is no large gap between horizontal and vertical sections.
- Confirm homepage and existing routes still load.
