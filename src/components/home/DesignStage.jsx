import { useStageMetrics } from "../../hooks/useScrollProgress.js";

const DESIGN_WIDTH = 1440;
const DESIGN_HEIGHT = 905;

export default function DesignStage({ children }) {
  const { scale } = useStageMetrics(DESIGN_WIDTH, DESIGN_HEIGHT);

  return (
    <div
      className="portfolio-design-shell"
      style={{
        height: `${DESIGN_HEIGHT * scale}px`,
        width: `${DESIGN_WIDTH * scale}px`,
      }}
    >
      <div
        className="portfolio-design-stage"
        style={{
          transform: `scale(${scale})`,
        }}
      >
        {children}
      </div>
    </div>
  );
}
