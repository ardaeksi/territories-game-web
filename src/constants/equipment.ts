import type { EquipmentStatus, EquipmentType } from "../types/domain";

export const EQUIPMENT_TYPE_LABELS: Record<EquipmentType, string> = {
  GUN: "Guns",
  TANK: "Tanks",
  CAR: "Military Cars",
  CIVILIAN_CAR: "Civilian Cars",
  TRUCK: "Trucks",
  HELICOPTER: "Helicopters",
};

export const EQUIPMENT_TYPE_ABBR: Record<EquipmentType, string> = {
  GUN: "GN",
  TANK: "TK",
  CAR: "CR",
  CIVILIAN_CAR: "CC",
  TRUCK: "TR",
  HELICOPTER: "HC",
};

export const EQUIPMENT_TYPE_COLORS: Record<EquipmentType, string> = {
  GUN: "#c0392b",
  TANK: "#6e7f39",
  CAR: "#7f8c8d",
  CIVILIAN_CAR: "#5d8aa8",
  TRUCK: "#a9762f",
  HELICOPTER: "#4fd1c5",
};

export const EQUIPMENT_STATUS_LABELS: Record<EquipmentStatus, string> = {
  OPERATIONAL: "Operational",
  MAINTENANCE: "Maintenance",
  OUT_OF_SERVICE: "Out of Service",
};

export const EQUIPMENT_STATUS_COLORS: Record<EquipmentStatus, string> = {
  OPERATIONAL: "#2ecc71",
  MAINTENANCE: "#f1c40f",
  OUT_OF_SERVICE: "#e74c3c",
};
