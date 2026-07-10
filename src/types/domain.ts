export type Branch = "ARMY" | "NAVY" | "AIR_FORCE" | "MARINES" | "SPACE_FORCE" | "COAST_GUARD";

export type Rank = "PRIVATE" | "CORPORAL" | "SERGEANT" | "LIEUTENANT" | "CAPTAIN" | "MAJOR" | "COLONEL";

export type ReadinessStatus = "READY" | "LIMITED" | "NOT_READY" | "ON_LEAVE" | "DEPLOYED";

export type RequestStatus = "PENDING" | "APPROVED" | "DENIED" | "COMPLETED";

export type EquipmentType = "GUN" | "TANK" | "CAR" | "CIVILIAN_CAR" | "TRUCK" | "HELICOPTER";

export type EquipmentStatus = "OPERATIONAL" | "MAINTENANCE" | "OUT_OF_SERVICE";

export interface Unit {
  id: number;
  name: string;
  branch: Branch;
  location: string;
  latitude: number;
  longitude: number;
}

export interface ServiceMember {
  id: number;
  serviceNumber: string;
  firstName: string;
  lastName: string;
  rank: Rank;
  readinessStatus: ReadinessStatus;
  unitId: number | null;
  unitName: string | null;
}

export interface Equipment {
  id: number;
  name: string;
  type: EquipmentType;
  quantity: number;
  status: EquipmentStatus;
  unitId: number | null;
  unitName: string | null;
}

export interface AssignmentRequest {
  id: number;
  serviceMemberId: number;
  serviceMemberName: string;
  fromUnitId: number | null;
  fromUnitName: string | null;
  toUnitId: number;
  toUnitName: string;
  requestedRole: string;
  requestedBy: string;
  status: RequestStatus;
  requestDate: string;
  decisionDate: string | null;
  decisionNotes: string | null;
}
