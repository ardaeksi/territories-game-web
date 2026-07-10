import type { Player } from "./types/domain";

const STORAGE_KEY = "readiness-game-player";

export function getStoredPlayer(): Player | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Player;
  } catch {
    return null;
  }
}

export function storePlayer(player: Player): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(player));
}

export function clearStoredPlayer(): void {
  localStorage.removeItem(STORAGE_KEY);
}
