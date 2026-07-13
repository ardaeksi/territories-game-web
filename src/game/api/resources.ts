import { apiClient } from "../../api/client";
import type { ResourceStockpile } from "../types/domain";

export async function fetchResources(playerId: number): Promise<ResourceStockpile> {
  const response = await apiClient.get<ResourceStockpile>(`/api/game/players/${playerId}/resources`);
  return response.data;
}
