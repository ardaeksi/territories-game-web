import { AnimatePresence, motion } from "framer-motion";
import type { AssignmentRequest } from "../../types/domain";

interface PendingRequestsPanelProps {
  requests: AssignmentRequest[];
  onApprove: (request: AssignmentRequest) => void;
  onDeny: (request: AssignmentRequest) => void;
  busyRequestId: number | null;
}

export function PendingRequestsPanel({ requests, onApprove, onDeny, busyRequestId }: PendingRequestsPanelProps) {
  return (
    <div className="pending-requests">
      <h2>Pending Assignment Requests</h2>
      {requests.length === 0 && <p className="empty-state">No pending requests.</p>}
      <AnimatePresence>
        {requests.map((request) => (
          <motion.div
            key={request.id}
            className="request-card"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ duration: 0.25 }}
          >
            <p className="request-title">
              {request.serviceMemberName} &rarr; {request.toUnitName}
            </p>
            <p className="request-meta">
              {request.requestedRole} &middot; requested by {request.requestedBy}
            </p>
            <div className="request-actions">
              <button
                type="button"
                className="btn-approve"
                disabled={busyRequestId === request.id}
                onClick={() => onApprove(request)}
              >
                Approve
              </button>
              <button
                type="button"
                className="btn-deny"
                disabled={busyRequestId === request.id}
                onClick={() => onDeny(request)}
              >
                Deny
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
