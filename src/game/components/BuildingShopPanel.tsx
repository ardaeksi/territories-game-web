import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { BUILDING_DESCRIPTIONS, BUILDING_LABELS, BUILDING_ORDER } from "../constants/buildings";
import { RESOURCE_COLORS, RESOURCE_LABELS } from "../constants/resources";
import { constructBuilding, fetchBlueprints, fetchBuildingsForTerritory } from "../api/buildings";
import type { Building, BuildingBlueprint, BuildingType, ResourceType, Territory } from "../types/domain";

interface BuildingShopPanelProps {
  territory: Territory;
  playerId: number;
  onClose: () => void;
  onBuildingConstructed: () => void;
}

export function BuildingShopPanel({ territory, playerId, onClose, onBuildingConstructed }: BuildingShopPanelProps) {
  const [blueprints, setBlueprints] = useState<BuildingBlueprint[]>([]);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [inProgress, setInProgress] = useState<BuildingType | null>(null);

  const load = useCallback(async () => {
    const [blueprintData, buildingData] = await Promise.all([
      fetchBlueprints(),
      fetchBuildingsForTerritory(territory.id),
    ]);
    setBlueprints(blueprintData);
    setBuildings(buildingData);
  }, [territory.id]);

  useEffect(() => {
    load();
  }, [load]);

  const builtTypes = new Set(buildings.map((b) => b.type));

  const handleBuild = async (type: BuildingType) => {
    setInProgress(type);
    setErrorMessage(null);
    try {
      await constructBuilding(territory.id, playerId, type);
      await load();
      onBuildingConstructed();
    } catch (err) {
      const message =
        axios.isAxiosError(err) && typeof err.response?.data?.message === "string"
          ? err.response.data.message
          : "Could not construct that building.";
      setErrorMessage(message);
    } finally {
      setInProgress(null);
    }
  };

  return (
    <motion.div
      key={territory.id}
      className="base-panel shop-panel"
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 24 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
    >
      <div className="base-panel-banner" style={{ background: `linear-gradient(135deg, ${territory.ownerColorHex ?? "#4b5320"}, #0c2f4f)` }}>
        <div>
          <h2>{territory.countryName}</h2>
          <p>Shop</p>
        </div>
        <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
          &times;
        </button>
      </div>

      <div className="base-panel-body">
        {errorMessage && <p className="shop-error">{errorMessage}</p>}

        <div className="shop-building-list">
          {BUILDING_ORDER.map((type) => {
            const blueprint = blueprints.find((bp) => bp.type === type);
            if (!blueprint) return null;
            const built = builtTypes.has(type);

            return (
              <div key={type} className={`shop-building-row${built ? " shop-building-built" : ""}`}>
                <div className="shop-building-info">
                  <span className="shop-building-name">{BUILDING_LABELS[type]}</span>
                  <span className="shop-building-description">{BUILDING_DESCRIPTIONS[type]}</span>
                  <div className="shop-building-cost">
                    {Object.entries(blueprint.cost).map(([resourceType, amount]) => (
                      <span key={resourceType} style={{ color: RESOURCE_COLORS[resourceType as ResourceType] }}>
                        {amount} {RESOURCE_LABELS[resourceType as ResourceType]}
                      </span>
                    ))}
                  </div>
                </div>
                <button
                  type="button"
                  className="shop-build-button"
                  disabled={built || inProgress === type}
                  onClick={() => handleBuild(type)}
                >
                  {built ? "Built" : inProgress === type ? "Building..." : "Build"}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
