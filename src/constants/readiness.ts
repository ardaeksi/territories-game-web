import type { Branch, ReadinessStatus } from "../types/domain";

export const READINESS_LABELS: Record<ReadinessStatus, string> = {
  READY: "Ready",
  LIMITED: "Limited",
  NOT_READY: "Not Ready",
  ON_LEAVE: "On Leave",
  DEPLOYED: "Deployed",
};

export const READINESS_COLORS: Record<ReadinessStatus, string> = {
  READY: "#2ecc71",
  LIMITED: "#f1c40f",
  NOT_READY: "#e74c3c",
  ON_LEAVE: "#95a5a6",
  DEPLOYED: "#3498db",
};

export const READINESS_ORDER: ReadinessStatus[] = ["READY", "LIMITED", "NOT_READY", "ON_LEAVE", "DEPLOYED"];

export const BRANCH_COLORS: Record<Branch, string> = {
  ARMY: "#4b5320",
  NAVY: "#1b3a5c",
  AIR_FORCE: "#5d8aa8",
  MARINES: "#8b0000",
  SPACE_FORCE: "#2c2e6b",
  COAST_GUARD: "#c8102e",
};

export const BRANCH_LABELS: Record<Branch, string> = {
  ARMY: "Army",
  NAVY: "Navy",
  AIR_FORCE: "Air Force",
  MARINES: "Marines",
  SPACE_FORCE: "Space Force",
  COAST_GUARD: "Coast Guard",
};
