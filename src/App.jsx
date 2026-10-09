import { Route, Routes, useLocation } from "react-router-dom";
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
import YeziScrollTest from "./pages/tests/YeziScrollTest.jsx";
import AboutScrollTest from "./pages/tests/AboutScrollTest.jsx";
import HomeFlowTest from "./pages/tests/HomeFlowTest.jsx";

const routes = [
  { path: "/", element: <Home />, layout: "immersive" },
  { path: "/works", element: <Works />, layout: "default" },
  { path: "/about", element: <About />, layout: "default" },
  { path: "/works/koko", element: <Koko />, layout: "immersive" },
  { path: "/works/flower-machine", element: <FlowerMachine />, layout: "immersive" },
  { path: "/works/world-skin", element: <WorldSkin />, layout: "default" },
  { path: "/works/sn", element: <Sn />, layout: "default" },
  { path: "/works/emotion-bloom", element: <EmotionBloom />, layout: "default" },
  { path: "/test/yezi-scroll", element: <YeziScrollTest />, layout: "prototype" },
  { path: "/test/about-scroll", element: <AboutScrollTest />, layout: "prototype" },
  { path: "/test/home-flow", element: <HomeFlowTest />, layout: "prototype" },
];

export default function App() {
  const location = useLocation();
  const activeRoute = routes.find((route) => route.path === location.pathname);
  const showDefaultLayout = !activeRoute || activeRoute.layout === "default";

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
