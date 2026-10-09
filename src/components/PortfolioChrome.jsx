const navigationItems = [
  { href: "/#top", label: "TOP" },
  { href: "/#works", label: "WORKS" },
  { href: "/#about", label: "ABOUT ME" },
  { href: "/#contact", label: "CONTACT" },
];

export default function PortfolioChrome({
  ariaLabel,
  classNames,
  homeAnchors = false,
}) {
  return (
    <header className={classNames.header}>
      <a className={classNames.version} href={homeAnchors ? "#top" : "/#top"}>
        Portfolio ver0.1
      </a>
      <div className={classNames.versionBox} aria-hidden="true">
        <span>2026.06.09 更新しました</span>
      </div>
      <nav className={classNames.navigation} aria-label={ariaLabel}>
        {navigationItems.map((item) => (
          <a href={homeAnchors ? item.href.slice(1) : item.href} key={item.href}>
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
