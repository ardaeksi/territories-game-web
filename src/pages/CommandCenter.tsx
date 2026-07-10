import { useCallback, useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { GlobeView, type TransferArc } from "../components/globe/GlobeView";
import { ReadinessSummary } from "../components/dashboard/ReadinessSummary";
import { PendingRequestsPanel } from "../components/dashboard/PendingRequestsPanel";
import { BaseDetailPanel } from "../components/dashboard/BaseDetailPanel";
import { fetchUnits } from "../api/units";
import { fetchServiceMembers } from "../api/serviceMembers";
import { fetchEquipment } from "../api/equipment";
import { approveAssignmentRequest, denyAssignmentRequest, fetchAssignmentRequests } from "../api/assignmentRequests";
import type { AssignmentRequest, Equipment, ServiceMember, Unit } from "../types/domain";

export function CommandCenter() {
  const [units, setUnits] = useState<Unit[]>([]);
  const [members, setMembers] = useState<ServiceMember[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [requests, setRequests] = useState<AssignmentRequest[]>([]);
  const [busyRequestId, setBusyRequestId] = useState<number | null>(null);
  const [activeTransfer, setActiveTransfer] = useState<TransferArc | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [selectedUnitId, setSelectedUnitId] = useState<number | null>(null);

  const loadData = useCallback(async () => {
    try {
      const [unitsData, membersData, equipmentData, requestsData] = await Promise.all([
        fetchUnits(),
        fetchServiceMembers(),
        fetchEquipment(),
        fetchAssignmentRequests("PENDING"),
      ]);
      setUnits(unitsData);
      setMembers(membersData);
      setEquipment(equipmentData);
      setRequests(requestsData);
      setStatusMessage(null);
    } catch {
      setStatusMessage(
        "Could not reach the API. If this is the first run, open " +
          `${import.meta.env.VITE_API_BASE_URL ?? "https://localhost:8443"}/api/units ` +
          "directly and accept the self-signed certificate warning, then reload this page."
      );
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleApprove = async (request: AssignmentRequest) => {
    const fromUnit = units.find((unit) => unit.id === request.fromUnitId);
    const toUnit = units.find((unit) => unit.id === request.toUnitId);

    setBusyRequestId(request.id);
    try {
      await approveAssignmentRequest(request.id);
      if (fromUnit && toUnit) {
        setActiveTransfer({
          startLat: fromUnit.latitude,
          startLng: fromUnit.longitude,
          endLat: toUnit.latitude,
          endLng: toUnit.longitude,
        });
        window.setTimeout(() => setActiveTransfer(null), 2000);
      }
      await loadData();
    } catch {
      setStatusMessage("Could not approve the request. It may have already been decided.");
    } finally {
      setBusyRequestId(null);
    }
  };

  const handleDeny = async (request: AssignmentRequest) => {
    setBusyRequestId(request.id);
    try {
      await denyAssignmentRequest(request.id);
      await loadData();
    } catch {
      setStatusMessage("Could not deny the request. It may have already been decided.");
    } finally {
      setBusyRequestId(null);
    }
  };

  const selectedUnit = units.find((unit) => unit.id === selectedUnitId) ?? null;

  return (
    <div className="command-center">
      <header className="command-header">
        <h1>Readiness Command</h1>
        <p>Personnel readiness &amp; assignment tracking</p>
      </header>

      {statusMessage && <div className="status-banner">{statusMessage}</div>}

      <div className="command-body">
        <div className="map-panel">
          <GlobeView
            units={units}
            members={members}
            activeTransfer={activeTransfer}
            onSelectUnit={setSelectedUnitId}
          />

          <AnimatePresence>
            {selectedUnit && (
              <BaseDetailPanel
                unit={selectedUnit}
                members={members.filter((member) => member.unitId === selectedUnit.id)}
                equipment={equipment.filter((item) => item.unitId === selectedUnit.id)}
                onClose={() => setSelectedUnitId(null)}
              />
            )}
          </AnimatePresence>
        </div>

        <aside className="dashboard-panel">
          <ReadinessSummary members={members} />
          <PendingRequestsPanel
            requests={requests}
            onApprove={handleApprove}
            onDeny={handleDeny}
            busyRequestId={busyRequestId}
          />
        </aside>
      </div>
    </div>
  );
}
