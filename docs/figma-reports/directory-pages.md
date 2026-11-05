# Works / About implementation

## Source and scope

Figma file `nXqj46MP1HFN9UU3alWTGK`: Works `278:1830`; About `352:8`. Both high-fidelity contexts and screenshots were read. Static asset source nodes: Works background `278:1831`, KOKO `278:1837`, Flower Machine `278:1859`, ARCTIC LAB `278:1869`, About background `352:64`.

Existing homepage, project detail files, prototype pages and their CSS are unchanged. The only existing shared behavior change is an optional navigation configuration in PortfolioChrome; default links remain identical. Works/About routes now use their own immersive layout. No framework or dependency upgrades.

## Assets

- Works background exactly matches existing `public/assets/test/about-scroll/bg.png`.
- ARCTIC LAB exactly matches existing `public/assets/home/arctic-lab.png`.
- About background, KOKO SVG and Flower Machine visual are exact locally saved Figma assets in `public/assets/directory/`.
- KOKO source SVG retains its root dimensions (237 x 291); the image scales proportionally within the 804:497 frame.

## Content and interaction

Works preserves all five Figma category labels and uses a section for each. KOKO is under UI/UX, ARCTIC LAB under グラフィック, and Flower Machine under インタラクション, based on the existing project type fields. その他 and 写真・記録 retain explicit empty states; no projects were invented. Every category index link targets its section. ARCTIC LAB has no existing detail route and remains a non-link figure.

About replaces Figma dummy copy with the existing YeziScrollStage introduction only. No qualifications, job history, dates, skills or other personal facts were invented. Further biography requires confirmed content.

Both pages blend white text against the actual fixed photographic backdrop using difference mode. Transparent section containers do not create intermediate stacking contexts. Works uses the two Figma blur/mask layers (white exclusion followed by gray), and project images remain outside text blending. About copy flows within its intro so longer real copy cannot overlap the footer. Both pages provide real navigation, contact and a home return link. Styles are directory-prefixed and desktop/mobile responsive. New pointer parallax respects reduced-motion and coarse pointers, and schedules frames only while moving.

## Validation

Baseline commit: fd5177c4c1badca12f1eff5ee84f4f36eb4320e1 (pushed before development). Available project check: npm run build. No lint, typecheck or unit test command is defined. Browser checks cover 1440 x 905 and 390 x 844, direct refresh, new page navigation, home MORE links, both detail links, Back/Forward, repeated navigation, category/contact anchors, image loading and horizontal overflow. Existing page screenshots and scroll state are compared against the baseline outside the animated header.
