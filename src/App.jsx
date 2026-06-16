import { Route, Routes } from "react-router-dom";
import { useLocation } from "react-router-dom";
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

export default function App() {
  const location = useLocation();
  const isTestRoute = location.pathname.startsWith("/test/");
  const isFullBleedHome = location.pathname === "/";
  const isImmersiveProject = location.pathname === "/works/koko" || location.pathname === "/works/flower-machine";

  return (
    <div className="app-shell">
      {isTestRoute || isFullBleedHome || isImmersiveProject ? null : <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/works" element={<Works />} />
        <Route path="/about" element={<About />} />
        <Route path="/works/koko" element={<Koko />} />
        <Route path="/works/flower-machine" element={<FlowerMachine />} />
        <Route path="/works/world-skin" element={<WorldSkin />} />
        <Route path="/works/sn" element={<Sn />} />
        <Route path="/works/emotion-bloom" element={<EmotionBloom />} />
        <Route path="/test/yezi-scroll" element={<YeziScrollTest />} />
        <Route path="/test/about-scroll" element={<AboutScrollTest />} />
        <Route path="/test/home-flow" element={<HomeFlowTest />} />
      </Routes>
      {isTestRoute || isFullBleedHome || isImmersiveProject ? null : <Footer />}
    </div>
  );
}
