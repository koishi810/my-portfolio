import "../styles/intro.css";

export default function IntroOverlay({ onComplete }) {
  return (
    <div className="intro-overlay" onAnimationEnd={onComplete} role="presentation">
      <p className="intro-overlay-name">LUYUFAN</p>
      <p className="intro-overlay-title">SENSE 01</p>
    </div>
  );
}
