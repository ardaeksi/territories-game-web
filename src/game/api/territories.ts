import { apiClient } from "../../api/client";
import type { Territory } from "../types/domain";

export async function fetchTerritories(): Promise<Territory[]> {
  const response = await apiClient.get<Territory[]>("/api/game/territories");
  return response.data;
}

export async function claimTerritory(territoryId: number, playerId: number): Promise<Territory> {
  const response = await apiClient.post<Territory>(`/api/game/territories/${territoryId}/claim`, { playerId });
  return response.data;
}
