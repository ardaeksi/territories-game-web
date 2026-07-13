import type { BuildingType } from "../types/domain";

export const BUILDING_LABELS: Record<BuildingType, string> = {
  MINE: "Mine",
  OIL_RIG: "Oil Rig",
  GUNPOWDER_FACTORY: "Gunpowder Factory",
  BOAT_FACTORY: "Boat Factory",
  ARMY_CAMP: "Army Camp",
  ARMY_FACTORY: "Army Factory",
};

export const BUILDING_DESCRIPTIONS: Record<BuildingType, string> = {
  MINE: "Unlocks spending Metal",
  OIL_RIG: "Unlocks spending Oil",
  GUNPOWDER_FACTORY: "Unlocks spending Gunpowder",
  BOAT_FACTORY: "Unlocks crafting Ships (coming soon)",
  ARMY_CAMP: "Houses soldiers (coming soon)",
  ARMY_FACTORY: "Unlocks crafting Guns/Tanks (coming soon)",
};

export const BUILDING_ORDER: BuildingType[] = [
  "MINE",
  "OIL_RIG",
  "GUNPOWDER_FACTORY",
  "BOAT_FACTORY",
  "ARMY_CAMP",
  "ARMY_FACTORY",
];
