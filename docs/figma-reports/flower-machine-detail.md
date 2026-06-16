# Flower Machine Detail Import

## Source
- Figma file: `nXqj46MP1HFN9UU3alWTGK`
- Nodes:
  - `322:8` / 花 机器 详细作品页
  - `324:380` / 花 机器 中间页
  - `328:417` / 花 机器 下拉页

## Web Mapping
- Route: `/works/flower-machine`
- Component: `src/pages/projects/FlowerMachine.jsx`
- Styles: `src/styles/flower-machine-project.css`
- Assets: `public/assets/projects/flower-machine/`

## Structure
- First section follows the KOKO project pattern:
  - fixed global chrome
  - fixed blue background with exclusion and light mask layers
  - sticky horizontal stage
  - title block, hero logo, metadata, project intro
- Middle section maps `324:380`:
  - centered exhibition note
- Reading section maps `328:417`:
  - blue logo band
  - flower generation rule block
  - weather symbol block

## Notes
- Figma temporary image URLs were downloaded into local project assets.
- Tailwind-style Figma output was translated into regular React and CSS to match the current codebase.
- The implementation keeps the KOKO interaction model but does not reuse KOKO-specific assets or text.
