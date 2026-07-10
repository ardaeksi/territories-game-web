import { READINESS_COLORS, READINESS_LABELS, READINESS_ORDER } from "../../constants/readiness";
import type { ReadinessStatus, ServiceMember } from "../../types/domain";

interface ReadinessSummaryProps {
  members: ServiceMember[];
}

export function ReadinessSummary({ members }: ReadinessSummaryProps) {
  const counts = members.reduce<Partial<Record<ReadinessStatus, number>>>((acc, member) => {
    acc[member.readinessStatus] = (acc[member.readinessStatus] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="readiness-summary">
      <h2>Readiness Summary</h2>
      <div className="readiness-tiles">
        {READINESS_ORDER.map((status) => (
          <div key={status} className="readiness-tile" style={{ borderColor: READINESS_COLORS[status] }}>
            <span className="readiness-tile-count" style={{ color: READINESS_COLORS[status] }}>
              {counts[status] ?? 0}
            </span>
            <span className="readiness-tile-label">{READINESS_LABELS[status]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
