// Keep native navigation and anchor scrolling while supporting subpath hosting.
export function siteHref(href) {
  if (typeof href !== "string" || !href.startsWith("/") || href.startsWith("//")) return href;
  return `${import.meta.env.BASE_URL}${href.slice(1)}`;
}

export default function SiteAnchor({ href, ...props }) {
  return <a {...props} href={siteHref(href)} />;
}
