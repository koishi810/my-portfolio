import { portfolioUpdateNotice, portfolioVersionLabel } from "../data/siteMeta.js";

const defaultNavigationItems = [
  { href: "/#top", label: "TOP" },
  { href: "/works", label: "WORKS" },
  { href: "/about", label: "ABOUT ME" },
  { href: "/#contact", label: "CONTACT" },
];

export default function PortfolioChrome({
  ariaLabel,
  classNames,
  homeAnchors = false,
  navigationItems = defaultNavigationItems,
}) {
  return (
    <header className={classNames.header}>
      <a className={classNames.version} href={homeAnchors ? "#top" : "/#top"}>
        {portfolioVersionLabel}
      </a>
      <div className={classNames.versionBox} aria-hidden="true">
        <span>{portfolioUpdateNotice}</span>
      </div>
      <nav className={classNames.navigation} aria-label={ariaLabel}>
        {navigationItems.map((item) => (
          <a href={homeAnchors && item.href.startsWith("/#") ? item.href.slice(1) : item.href} key={item.href}>
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
