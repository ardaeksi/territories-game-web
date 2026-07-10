import { apiClient } from "./client";
import type { Equipment } from "../types/domain";

export async function fetchEquipment(): Promise<Equipment[]> {
  const response = await apiClient.get<Equipment[]>("/api/equipment");
  return response.data;
}
