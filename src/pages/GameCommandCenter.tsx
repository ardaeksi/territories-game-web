import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TerritoryGlobe } from "../game/components/TerritoryGlobe";
import { fetchTerritories, claimTerritory } from "../game/api/territories";
import { getStoredPlayer } from "../game/playerSession";
import type { Territory } from "../game/types/domain";

const POLL_INTERVAL_MS = 4000;

export function GameCommandCenter() {
  const navigate = useNavigate();
  const player = getStoredPlayer();
  const [territories, setTerritories] = useState<Territory[]>([]);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const loadTerritories = useCallback(async () => {
    try {
      const data = await fetchTerritories();
      setTerritories(data);
    } catch {
      setStatusMessage("Could not reach the game server.");
    }
  }, []);

  useEffect(() => {
    if (!player) {
      navigate("/");
      return;
    }
    loadTerritories();
    const interval = window.setInterval(loadTerritories, POLL_INTERVAL_MS);
    return () => window.clearInterval(interval);
  }, [player, navigate, loadTerritories]);

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
      </div>
    </div>
  );
}
