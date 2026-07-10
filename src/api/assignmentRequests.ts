import { apiClient } from "./client";
import type { AssignmentRequest } from "../types/domain";

export async function fetchAssignmentRequests(status?: string): Promise<AssignmentRequest[]> {
  const response = await apiClient.get<AssignmentRequest[]>("/api/assignment-requests", {
    params: status ? { status } : undefined,
  });
  return response.data;
}

export async function approveAssignmentRequest(id: number, notes?: string): Promise<AssignmentRequest> {
  const response = await apiClient.post<AssignmentRequest>(`/api/assignment-requests/${id}/approve`, {
    notes,
  });
  return response.data;
}

export async function denyAssignmentRequest(id: number, notes?: string): Promise<AssignmentRequest> {
  const response = await apiClient.post<AssignmentRequest>(`/api/assignment-requests/${id}/deny`, {
    notes,
  });
  return response.data;
}
