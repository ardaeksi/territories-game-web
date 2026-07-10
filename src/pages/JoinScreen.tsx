import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPlayer } from "../game/api/players";
import { storePlayer } from "../game/playerSession";

export function JoinScreen() {
  const [displayName, setDisplayName] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!displayName.trim()) return;

    setIsJoining(true);
    setErrorMessage(null);
    try {
      const player = await createPlayer(displayName.trim());
      storePlayer(player);
      navigate("/game");
    } catch {
      setErrorMessage(
        "Could not reach the game server. Make sure the backend is running and its self-signed certificate has been accepted in this browser."
      );
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="join-screen">
      <form className="join-card" onSubmit={handleSubmit}>
        <h1>Territories</h1>
        <p>Claim adjacent land, gather resources, build your force.</p>
        <input
          type="text"
          placeholder="Your name"
          value={displayName}
          onChange={(event) => setDisplayName(event.target.value)}
          autoFocus
        />
        {errorMessage && <p className="join-error">{errorMessage}</p>}
        <button type="submit" disabled={isJoining || !displayName.trim()}>
          {isJoining ? "Joining..." : "Join Game"}
        </button>
      </form>
    </div>
  );
}
