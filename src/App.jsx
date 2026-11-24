import { useEffect } from "react";
import { matchRoutes, Route, Routes, useLocation } from "react-router-dom";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import Works from "./pages/Works.jsx";
import About from "./pages/About.jsx";
import WorldSkin from "./pages/projects/WorldSkin.jsx";
import Sn from "./pages/projects/Sn.jsx";
import EmotionBloom from "./pages/projects/EmotionBloom.jsx";
import Koko from "./pages/projects/Koko.jsx";
import FlowerMachine from "./pages/projects/FlowerMachine.jsx";
import ArcticLab from "./pages/projects/ArcticLab.jsx";
import Matryoshka from "./pages/projects/Matryoshka.jsx";
import IroHyohon from "./pages/projects/IroHyohon.jsx";
import YeziScrollTest from "./pages/tests/YeziScrollTest.jsx";
import AboutScrollTest from "./pages/tests/AboutScrollTest.jsx";
import HomeFlowTest from "./pages/tests/HomeFlowTest.jsx";
import useBackdropTextInk from "./hooks/useBackdropTextInk.js";

// Only text trapped inside the legacy image/sticky stages needs a separate
// paint layer. About, Matryoshka, chrome and other working blend layers stay native.
const backdropTextScopes = {
  "/": {
    root: ".portfolio-home",
    selectors: ".portfolio-hero-field, .portfolio-work-text > p, .portfolio-work-text > h3, .portfolio-hero-title, .portfolio-hero-note, .portfolio-about-small-title, .portfolio-about-char, .portfolio-about-more, .portfolio-works-title, .portfolio-all-works h2, .portfolio-all-works .portfolio-more-button",
  },
  "/works": {
    root: ".directory-page-works",
    selectors: ".directory-project-copy > p, .directory-project-copy > h3",
  },
  "/works/koko": {
    root: ".koko-project-page",
    selectors: ".koko-main-copy > p, .koko-main-copy > h1, .koko-metadata dt, .koko-metadata dd, .koko-project-intro > p",
  },
  "/works/arctic-lab": {
    root: ".arctic-project-page",
    selectors: ".arctic-main-copy > p, .arctic-main-copy > h1, .arctic-metadata dt, .arctic-metadata dd, .arctic-project-intro > p, .arctic-album-intro h2, .arctic-album-intro p, .arctic-back-link",
  },
};

const routes = [
  { path: "/", element: <Home />, layout: "immersive" },
  { path: "/works", element: <Works />, layout: "immersive" },
  { path: "/about", element: <About />, layout: "immersive" },
  { path: "/works/koko", element: <Koko />, layout: "immersive" },
  { path: "/works/flower-machine", element: <FlowerMachine />, layout: "immersive" },
  { path: "/works/arctic-lab", element: <ArcticLab />, layout: "immersive" },
  { path: "/works/matryoshka", element: <Matryoshka />, layout: "immersive" },
  { path: "/works/iro-hyohon", element: <IroHyohon />, layout: "immersive" },
  { path: "/works/world-skin", element: <WorldSkin />, layout: "default" },
  { path: "/works/sn", element: <Sn />, layout: "immersive" },
  { path: "/works/emotion-bloom", element: <EmotionBloom />, layout: "default" },
  { path: "/test/yezi-scroll", element: <YeziScrollTest />, layout: "prototype" },
  { path: "/test/about-scroll", element: <AboutScrollTest />, layout: "prototype" },
  { path: "/test/home-flow", element: <HomeFlowTest />, layout: "prototype" },
];

export default function App() {
  const location = useLocation();
  const activeRoute = matchRoutes(routes, location)?.at(-1)?.route;
  const showDefaultLayout = !activeRoute || activeRoute.layout === "default";
  const textScope = backdropTextScopes[activeRoute?.path];
  useBackdropTextInk(textScope?.root, textScope?.selectors);

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;

    // Initial anchors arrive before React mounts their targets. Let responsive
    // stage measurements commit, then align the target below the fixed chrome.
    // Path-only updates preserve native same-page scrolling and its timing.
    let frameId = window.requestAnimationFrame(() => {
      frameId = window.requestAnimationFrame(() => {
        if (window.location.hash !== hash) return;
        let targetId;
        try {
          targetId = decodeURIComponent(hash.slice(1));
        } catch {
          return;
        }
        document.getElementById(targetId)?.scrollIntoView({
          behavior: "instant",
          block: "start",
        });
      });
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [location.pathname]);

  return (
    <div className="app-shell">
      {showDefaultLayout ? <Header /> : null}
      <Routes>
        {routes.map((route) => (
          <Route element={route.element} key={route.path} path={route.path} />
        ))}
      </Routes>
      {showDefaultLayout ? <Footer /> : null}
    </div>
  );
}
