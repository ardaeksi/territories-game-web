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
