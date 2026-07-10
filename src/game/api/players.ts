import { apiClient } from "../../api/client";
import type { Player } from "../types/domain";

export async function createPlayer(displayName: string): Promise<Player> {
  const response = await apiClient.post<Player>("/api/game/players", { displayName });
  return response.data;
}
