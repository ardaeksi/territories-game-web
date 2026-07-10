import { apiClient } from "./client";
import type { Unit } from "../types/domain";

export async function fetchUnits(): Promise<Unit[]> {
  const response = await apiClient.get<Unit[]>("/api/units");
  return response.data;
}
