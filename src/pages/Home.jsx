import SelectedWorksIntro from "../components/SelectedWorksIntro.jsx";
import PortfolioHome from "../components/home/PortfolioHome.jsx";
import "../styles/portfolio-home.css";

export default function Home() {
  return <><SelectedWorksIntro /><div id="original-portfolio"><PortfolioHome /></div></>;
}
