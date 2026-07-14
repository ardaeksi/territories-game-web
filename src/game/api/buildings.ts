import { apiClient } from "../../api/client";
import type { Building, BuildingBlueprint, BuildingType } from "../types/domain";

export async function fetchBlueprints(): Promise<BuildingBlueprint[]> {
  const response = await apiClient.get<BuildingBlueprint[]>("/api/game/buildings/blueprints");
  return response.data;
}

export async function fetchBuildingsForTerritory(territoryId: number): Promise<Building[]> {
  const response = await apiClient.get<Building[]>(`/api/game/territories/${territoryId}/buildings`);
  return response.data;
}

export async function fetchAllBuildings(): Promise<Building[]> {
  const response = await apiClient.get<Building[]>("/api/game/buildings");
  return response.data;
}

export async function constructBuilding(territoryId: number, playerId: number, type: BuildingType): Promise<Building> {
  const response = await apiClient.post<Building>(`/api/game/territories/${territoryId}/buildings`, {
    playerId,
    type,
  });
  return response.data;
}
