import { motion } from "framer-motion";
import { BRANCH_COLORS, BRANCH_LABELS, READINESS_COLORS, READINESS_LABELS, READINESS_ORDER } from "../../constants/readiness";
import { EQUIPMENT_STATUS_COLORS, EQUIPMENT_STATUS_LABELS, EQUIPMENT_TYPE_ABBR, EQUIPMENT_TYPE_COLORS, EQUIPMENT_TYPE_LABELS } from "../../constants/equipment";
import { initials, titleCase } from "../../utils/format";
import type { Equipment, ReadinessStatus, ServiceMember, Unit } from "../../types/domain";

interface BaseDetailPanelProps {
  unit: Unit;
  members: ServiceMember[];
  equipment: Equipment[];
  onClose: () => void;
}

export function BaseDetailPanel({ unit, members, equipment, onClose }: BaseDetailPanelProps) {
  const counts = members.reduce<Partial<Record<ReadinessStatus, number>>>((acc, member) => {
    acc[member.readinessStatus] = (acc[member.readinessStatus] ?? 0) + 1;
    return acc;
  }, {});

  const branchColor = BRANCH_COLORS[unit.branch];

  return (
    <motion.div
      key={unit.id}
      className="base-panel"
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 24 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
    >
      <div className="base-panel-banner" style={{ background: `linear-gradient(135deg, ${branchColor}, #0c2f4f)` }}>
        <span className="base-panel-branch-badge" style={{ background: branchColor }}>
          {BRANCH_LABELS[unit.branch].charAt(0)}
        </span>
        <div>
          <h2>{unit.name}</h2>
          <p>
            {BRANCH_LABELS[unit.branch]} &middot; {unit.location}
          </p>
        </div>
        <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
          &times;
        </button>
      </div>

      <div className="base-panel-body">
        <div className="base-panel-stats">
          <div className="base-panel-stat">
            <span className="base-panel-stat-count">{members.length}</span>
            <span className="base-panel-stat-label">Total Assigned</span>
          </div>
          {READINESS_ORDER.map((status) => (
            <div key={status} className="base-panel-stat">
              <span className="base-panel-stat-count" style={{ color: READINESS_COLORS[status] }}>
                {counts[status] ?? 0}
              </span>
              <span className="base-panel-stat-label">{READINESS_LABELS[status]}</span>
            </div>
          ))}
        </div>

        <h3>Roster</h3>
        <div className="roster-list">
          {members.length === 0 && <p className="empty-state">No personnel assigned to this base.</p>}
          {members.map((member) => (
            <div key={member.id} className="roster-row">
              <span className="roster-avatar" style={{ background: READINESS_COLORS[member.readinessStatus] }}>
                {initials(member.firstName, member.lastName)}
              </span>
              <div className="roster-info">
                <span className="roster-name">
                  {titleCase(member.rank)} {member.firstName} {member.lastName}
                </span>
                <span className="roster-status">{READINESS_LABELS[member.readinessStatus]}</span>
              </div>
            </div>
          ))}
        </div>

        <h3>Equipment</h3>
        <div className="equipment-list">
          {equipment.length === 0 && <p className="empty-state">No equipment recorded for this base.</p>}
          {equipment.map((item) => (
            <div key={item.id} className="equipment-row">
              <span className="equipment-badge" style={{ background: EQUIPMENT_TYPE_COLORS[item.type] }}>
                {EQUIPMENT_TYPE_ABBR[item.type]}
              </span>
              <div className="equipment-info">
                <span className="equipment-name">{item.name}</span>
                <span className="equipment-type">{EQUIPMENT_TYPE_LABELS[item.type]}</span>
              </div>
              <div className="equipment-meta">
                <span className="equipment-qty">&times;{item.quantity}</span>
                <span
                  className="equipment-status-pill"
                  style={{ color: EQUIPMENT_STATUS_COLORS[item.status], borderColor: EQUIPMENT_STATUS_COLORS[item.status] }}
                >
                  {EQUIPMENT_STATUS_LABELS[item.status]}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
