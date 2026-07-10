import { apiClient } from "./client";
import type { ServiceMember } from "../types/domain";

export async function fetchServiceMembers(): Promise<ServiceMember[]> {
  const response = await apiClient.get<ServiceMember[]>("/api/service-members");
  return response.data;
}

export async function fetchServiceMembersByUnit(unitId: number): Promise<ServiceMember[]> {
  const response = await apiClient.get<ServiceMember[]>("/api/service-members", {
    params: { unitId },
  });
  return response.data;
}
