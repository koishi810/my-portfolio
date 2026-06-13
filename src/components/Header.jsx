import { Link } from "react-router-dom";
import "../styles/layout.css";

export default function Header() {
  return (
    <header className="site-header">
      <Link className="site-logo" to="/">
        LUYUFAN
      </Link>
      <nav className="site-nav" aria-label="Primary">
        <Link to="/works">Works</Link>
        <Link to="/about">About</Link>
      </nav>
    </header>
  );
}
