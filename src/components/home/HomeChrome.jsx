import PortfolioChrome from "../PortfolioChrome.jsx";

export default function HomeChrome() {
  return (
    <PortfolioChrome
      ariaLabel="Portfolio home navigation"
      classNames={{
        header: "portfolio-global-chrome",
        navigation: "portfolio-home-nav",
        version: "portfolio-version",
        versionBox: "portfolio-version-box",
      }}
      homeAnchors
    />
  );
}
