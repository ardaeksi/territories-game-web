import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { TerritoryGlobe } from "../game/components/TerritoryGlobe";
import { ResourceHud } from "../game/components/ResourceHud";
import { BuildingShopPanel } from "../game/components/BuildingShopPanel";
import { MiningPanel } from "../game/components/MiningPanel";
import { fetchTerritories, claimTerritory } from "../game/api/territories";
import { fetchResources } from "../game/api/resources";
import { fetchAllBuildings } from "../game/api/buildings";
import { getStoredPlayer } from "../game/playerSession";
import type { Building, ResourceStockpile, Territory } from "../game/types/domain";

const TERRITORY_POLL_INTERVAL_MS = 4000;

export function GameCommandCenter() {
  const navigate = useNavigate();
  const player = getStoredPlayer();
  const [territories, setTerritories] = useState<Territory[]>([]);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [stockpile, setStockpile] = useState<ResourceStockpile | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [selectedTerritoryId, setSelectedTerritoryId] = useState<number | null>(null);
  const [activeMiningBuildingId, setActiveMiningBuildingId] = useState<number | null>(null);

  const loadTerritories = useCallback(async () => {
    try {
      const data = await fetchTerritories();
      setTerritories(data);
    } catch {
      setStatusMessage("Could not reach the game server.");
    }
  }, []);

  const loadResources = useCallback(async () => {
    if (!player) return;
    try {
      const data = await fetchResources(player.id);
      setStockpile(data);
    } catch {
      // Territory poll's error banner already covers "server unreachable".
    }
  }, [player]);

  const loadBuildings = useCallback(async () => {
    try {
      const data = await fetchAllBuildings();
      setBuildings(data);
    } catch {
      // Territory poll's error banner already covers "server unreachable".
    }
  }, []);

  useEffect(() => {
    if (!player) {
      navigate("/");
      return;
    }
    loadTerritories();
    loadResources();
    loadBuildings();
    // Resources/buildings only change via this player's own actions, so only territories poll.
    const territoryInterval = window.setInterval(loadTerritories, TERRITORY_POLL_INTERVAL_MS);
    return () => window.clearInterval(territoryInterval);
  }, [player, navigate, loadTerritories, loadResources, loadBuildings]);

  if (!player) {
    return null;
  }

  const handleClaimTerritory = async (territoryId: number) => {
    try {
      await claimTerritory(territoryId, player.id);
      setStatusMessage(null);
      await Promise.all([loadTerritories(), loadResources()]);
    } catch {
      setStatusMessage("Can't claim that territory - it may already be owned, or isn't adjacent to land you control.");
    }
  };

  const ownedCount = territories.filter((t) => t.ownerId === player.id).length;
  const unclaimedCount = territories.filter((t) => t.ownerId === null).length;
  const selectedTerritory = territories.find((t) => t.id === selectedTerritoryId) ?? null;
  const activeMiningBuilding = buildings.find((b) => b.id === activeMiningBuildingId) ?? null;

  return (
    <div className="game-center">
      <header className="game-header">
        <h1>Territories</h1>
        <p>
          Playing as <strong style={{ color: player.colorHex }}>{player.displayName}</strong> &middot; {ownedCount}{" "}
          territories owned &middot; {unclaimedCount} unclaimed
        </p>
      </header>

      {statusMessage && <div className="status-banner">{statusMessage}</div>}

      <div className="game-body">
        <TerritoryGlobe
          territories={territories}
          buildings={buildings}
          playerId={player.id}
          onClaimTerritory={handleClaimTerritory}
          onSelectOwnTerritory={setSelectedTerritoryId}
          onSelectMineBuilding={setActiveMiningBuildingId}
        />
        <ResourceHud stockpile={stockpile} />

        <AnimatePresence mode="wait">
          {activeMiningBuilding ? (
            <MiningPanel
              key="mining"
              buildingId={activeMiningBuilding.id}
              territoryName={activeMiningBuilding.territoryName}
              playerId={player.id}
              onClose={() => setActiveMiningBuildingId(null)}
              onCollected={loadResources}
            />
          ) : (
            selectedTerritory && (
              <BuildingShopPanel
                key="shop"
                territory={selectedTerritory}
                playerId={player.id}
                onClose={() => setSelectedTerritoryId(null)}
                onBuildingConstructed={() => {
                  loadResources();
                  loadBuildings();
                }}
                onOperateBuilding={(building) => {
                  setActiveMiningBuildingId(building.id);
                  setSelectedTerritoryId(null);
                }}
              />
            )
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
