import { apiClient } from "../../api/client";
import type { MiningJob, MiningPreset, ResourceType } from "../types/domain";

export async function fetchPresets(): Promise<MiningPreset[]> {
  const response = await apiClient.get<MiningPreset[]>("/api/game/mining/presets");
  return response.data;
}

export async function fetchActiveJob(buildingId: number): Promise<MiningJob | null> {
  const response = await apiClient.get<MiningJob>(`/api/game/buildings/${buildingId}/mining-job`, {
    validateStatus: (status) => status === 200 || status === 204,
  });
  return response.status === 204 ? null : response.data;
}

export async function startMiningJob(
  buildingId: number,
  playerId: number,
  resourceType: ResourceType,
  presetKey: string
): Promise<MiningJob> {
  const response = await apiClient.post<MiningJob>(`/api/game/buildings/${buildingId}/mining-job`, {
    playerId,
    resourceType,
    presetKey,
  });
  return response.data;
}

export async function collectMiningJob(buildingId: number, playerId: number): Promise<MiningJob> {
  const response = await apiClient.post<MiningJob>(`/api/game/buildings/${buildingId}/mining-job/collect`, {
    playerId,
  });
  return response.data;
}
