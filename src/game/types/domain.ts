export type ResourceType = "WOOD" | "STONE" | "METAL" | "GUNPOWDER" | "OIL" | "FOOD";

export interface Player {
  id: number;
  displayName: string;
  colorHex: string;
}

export interface Territory {
  id: number;
  countryId: string;
  countryName: string;
  centroidLat: number;
  centroidLng: number;
  ownerId: number | null;
  ownerDisplayName: string | null;
  ownerColorHex: string | null;
  population: number;
  resources: Partial<Record<ResourceType, number>>;
}

export interface ResourceStockpile {
  playerId: number;
  amounts: Partial<Record<ResourceType, number>>;
}

export type BuildingType = "MINE" | "OIL_RIG" | "GUNPOWDER_FACTORY" | "BOAT_FACTORY" | "ARMY_CAMP" | "ARMY_FACTORY";

export interface Building {
  id: number;
  territoryId: number;
  territoryName: string;
  type: BuildingType;
  builtAt: string;
}

export interface BuildingBlueprint {
  type: BuildingType;
  cost: Partial<Record<ResourceType, number>>;
  unlocksSpendingOf: ResourceType | null;
}

export interface MiningPreset {
  key: string;
  label: string;
  durationSeconds: number;
  yieldByResource: Partial<Record<ResourceType, number>>;
}

export interface MiningJob {
  id: number;
  buildingId: number;
  resourceType: ResourceType;
  startedAt: string;
  durationSeconds: number;
  yieldAmount: number;
  collectedAt: string | null;
}
