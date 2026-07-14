import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import * as Tabs from "@radix-ui/react-tabs";
import * as ToggleGroup from "@radix-ui/react-toggle-group";
import * as Progress from "@radix-ui/react-progress";
import { RESOURCE_COLORS, RESOURCE_LABELS } from "../constants/resources";
import { collectMiningJob, fetchActiveJob, fetchPresets, startMiningJob } from "../api/mining";
import type { MiningJob, MiningPreset, ResourceType } from "../types/domain";
import { ResourceIcon } from "./icons/ResourceIcon";

interface MiningPanelProps {
  buildingId: number;
  territoryName: string;
  playerId: number;
  onClose: () => void;
  onCollected: () => void;
}

const MINEABLE_RESOURCES: ResourceType[] = ["STONE", "METAL"];

export function MiningPanel({ buildingId, territoryName, playerId, onClose, onCollected }: MiningPanelProps) {
  const [presets, setPresets] = useState<MiningPreset[]>([]);
  const [activeJob, setActiveJob] = useState<MiningJob | null>(null);
  const [selectedResource, setSelectedResource] = useState<ResourceType>("STONE");
  const [selectedPresetKey, setSelectedPresetKey] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  const load = useCallback(async () => {
    const [presetData, jobData] = await Promise.all([fetchPresets(), fetchActiveJob(buildingId)]);
    setPresets(presetData);
    setActiveJob(jobData);
    if (!selectedPresetKey && presetData.length > 0) {
      setSelectedPresetKey(presetData[0].key);
    }
    // Keyed only on buildingId so toggling a duration doesn't re-trigger this.
  }, [buildingId]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!activeJob) return;
    const interval = window.setInterval(() => setNow(Date.now()), 500);
    return () => window.clearInterval(interval);
  }, [activeJob]);

  const handleStart = async () => {
    if (!selectedPresetKey) return;
    setBusy(true);
    setErrorMessage(null);
    try {
      const job = await startMiningJob(buildingId, playerId, selectedResource, selectedPresetKey);
      setActiveJob(job);
      setNow(Date.now());
    } catch (err) {
      const message =
        axios.isAxiosError(err) && typeof err.response?.data?.message === "string"
          ? err.response.data.message
          : "Could not start that mining job.";
      setErrorMessage(message);
    } finally {
      setBusy(false);
    }
  };

  const handleCollect = async () => {
    setBusy(true);
    setErrorMessage(null);
    try {
      await collectMiningJob(buildingId, playerId);
      setActiveJob(null);
      onCollected();
    } catch (err) {
      const message =
        axios.isAxiosError(err) && typeof err.response?.data?.message === "string"
          ? err.response.data.message
          : "Could not collect that job yet.";
      setErrorMessage(message);
    } finally {
      setBusy(false);
    }
  };

  const elapsedMs = activeJob ? now - new Date(activeJob.startedAt).getTime() : 0;
  const totalMs = activeJob ? activeJob.durationSeconds * 1000 : 0;
  const progressPercent = activeJob ? Math.min(100, Math.max(0, (elapsedMs / totalMs) * 100)) : 0;
  const remainingSeconds = activeJob ? Math.max(0, Math.ceil((totalMs - elapsedMs) / 1000)) : 0;
  const isComplete = activeJob !== null && remainingSeconds <= 0;

  return (
    <motion.div
      key={buildingId}
      className="base-panel mining-panel"
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 24 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
    >
      <div className="base-panel-banner" style={{ background: "linear-gradient(135deg, #2b2118, #0c2f4f)" }}>
        <div>
          <h2>{territoryName}</h2>
          <p>Mine</p>
        </div>
        <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
          &times;
        </button>
      </div>

      <div className="base-panel-body">
        {errorMessage && <p className="shop-error">{errorMessage}</p>}

        {activeJob ? (
          <div className="mining-job-active">
            <p className="mining-job-status">
              Mining <ResourceIcon type={activeJob.resourceType} size={14} color={RESOURCE_COLORS[activeJob.resourceType]} />{" "}
              <strong style={{ color: RESOURCE_COLORS[activeJob.resourceType] }}>
                {activeJob.yieldAmount} {RESOURCE_LABELS[activeJob.resourceType]}
              </strong>
            </p>
            <Progress.Root className="mining-progress-root" value={progressPercent}>
              <Progress.Indicator
                className="mining-progress-indicator"
                style={{ transform: `translateX(-${100 - progressPercent}%)` }}
              />
            </Progress.Root>
            <p className="mining-job-countdown">
              {isComplete ? "Ready to collect" : `${remainingSeconds}s remaining`}
            </p>
            <button
              type="button"
              className="shop-build-button mining-collect-button"
              disabled={!isComplete || busy}
              onClick={handleCollect}
            >
              {busy ? "Collecting..." : "Collect"}
            </button>
          </div>
        ) : (
          <div className="mining-job-setup">
            <Tabs.Root value={selectedResource} onValueChange={(value) => setSelectedResource(value as ResourceType)}>
              <Tabs.List className="mining-tabs-list">
                {MINEABLE_RESOURCES.map((type) => (
                  <Tabs.Trigger key={type} value={type} className="mining-tab-trigger">
                    <ResourceIcon type={type} size={15} color={RESOURCE_COLORS[type]} />
                    {RESOURCE_LABELS[type]}
                  </Tabs.Trigger>
                ))}
              </Tabs.List>
            </Tabs.Root>

            <p className="mining-section-label">Duration</p>
            <ToggleGroup.Root
              type="single"
              className="mining-toggle-group"
              value={selectedPresetKey ?? undefined}
              onValueChange={(value) => value && setSelectedPresetKey(value)}
            >
              {presets.map((preset) => (
                <ToggleGroup.Item key={preset.key} value={preset.key} className="mining-toggle-item">
                  <span className="mining-toggle-label">{preset.label}</span>
                  <span className="mining-toggle-duration">{preset.durationSeconds}s</span>
                  <span className="mining-toggle-yield" style={{ color: RESOURCE_COLORS[selectedResource] }}>
                    +{preset.yieldByResource[selectedResource] ?? 0}
                  </span>
                </ToggleGroup.Item>
              ))}
            </ToggleGroup.Root>

            <button
              type="button"
              className="shop-build-button mining-start-button"
              disabled={busy || !selectedPresetKey}
              onClick={handleStart}
            >
              {busy ? "Starting..." : "Start Mining"}
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
