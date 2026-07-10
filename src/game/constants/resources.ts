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
