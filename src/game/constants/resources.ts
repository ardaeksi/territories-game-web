import type { ResourceType } from "../types/domain";

export const RESOURCE_LABELS: Record<ResourceType, string> = {
  WOOD: "Wood",
  STONE: "Stone",
  METAL: "Metal",
  GUNPOWDER: "Gunpowder",
  OIL: "Oil",
  FOOD: "Food",
};

export const RESOURCE_ORDER: ResourceType[] = ["WOOD", "STONE", "METAL", "GUNPOWDER", "OIL", "FOOD"];

export const RESOURCE_COLORS: Record<ResourceType, string> = {
  WOOD: "#c8935a",
  STONE: "#9aa5b1",
  METAL: "#d8dee5",
  GUNPOWDER: "#e07a5f",
  OIL: "#4fd1c5",
  FOOD: "#7cb342",
};
