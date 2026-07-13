import { RESOURCE_COLORS, RESOURCE_LABELS, RESOURCE_ORDER } from "../constants/resources";
import type { ResourceStockpile } from "../types/domain";

interface ResourceHudProps {
  stockpile: ResourceStockpile | null;
}

export function ResourceHud({ stockpile }: ResourceHudProps) {
  return (
    <div className="resource-hud">
      {RESOURCE_ORDER.map((type) => (
        <div key={type} className="resource-hud-tile" style={{ borderColor: RESOURCE_COLORS[type] }}>
          <span className="resource-hud-count" style={{ color: RESOURCE_COLORS[type] }}>
            {Math.floor(stockpile?.amounts[type] ?? 0).toLocaleString()}
          </span>
          <span className="resource-hud-label">{RESOURCE_LABELS[type]}</span>
        </div>
      ))}
    </div>
  );
}
