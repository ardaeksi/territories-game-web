import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TerritoryGlobe } from "../game/components/TerritoryGlobe";
import { ResourceHud } from "../game/components/ResourceHud";
import { fetchTerritories, claimTerritory } from "../game/api/territories";
import { fetchResources } from "../game/api/resources";
import { getStoredPlayer } from "../game/playerSession";
import type { ResourceStockpile, Territory } from "../game/types/domain";

const TERRITORY_POLL_INTERVAL_MS = 4000;
const RESOURCE_POLL_INTERVAL_MS = 2000;

export function GameCommandCenter() {
  const navigate = useNavigate();
  const player = getStoredPlayer();
  const [territories, setTerritories] = useState<Territory[]>([]);
  const [stockpile, setStockpile] = useState<ResourceStockpile | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

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
      // Resource polling failures aren't worth interrupting the player with a banner -
      // the next tick will retry, and the territory poll's error banner already covers
      // "server unreachable" for this same root cause.
    }
  }, [player]);

  useEffect(() => {
    if (!player) {
      navigate("/");
      return;
    }
    loadTerritories();
    loadResources();
    const territoryInterval = window.setInterval(loadTerritories, TERRITORY_POLL_INTERVAL_MS);
    const resourceInterval = window.setInterval(loadResources, RESOURCE_POLL_INTERVAL_MS);
    return () => {
      window.clearInterval(territoryInterval);
      window.clearInterval(resourceInterval);
    };
  }, [player, navigate, loadTerritories, loadResources]);

  if (!player) {
    return null;
  }

  const handleClaimTerritory = async (territoryId: number) => {
    try {
      await claimTerritory(territoryId, player.id);
      setStatusMessage(null);
      await loadTerritories();
    } catch {
      setStatusMessage("Can't claim that territory - it may already be owned, or isn't adjacent to land you control.");
    }
  };

  const ownedCount = territories.filter((t) => t.ownerId === player.id).length;
  const unclaimedCount = territories.filter((t) => t.ownerId === null).length;

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
        <TerritoryGlobe territories={territories} onClaimTerritory={handleClaimTerritory} />
        <ResourceHud stockpile={stockpile} />
      </div>
    </div>
  );
}
