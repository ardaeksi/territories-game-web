# territories-game-web

Frontend for a Risk-style territory conquest game. React 19, TypeScript, Vite, react-globe.gl.

Two routes:
- `/` and `/game` - the territory conquest game (join, claim adjacent territory on a 3D globe)
- `/sim` - the personnel readiness dashboard this project was forked out of

## Local setup

Requires the backend (`territories-game-api`) running first - see that repo's README for Postgres,
keystore, and self-signed cert setup.

```
npm install
npm run dev
```

Open `http://localhost:5173`.

## Local network (LAN) play

See `territories-game-api`'s README for the full LAN setup, including the firewall rules (added
and removed as a toggle, not left on permanently). Once those are in place, start this project with:

```
npm run dev:lan
```

instead of `npm run dev` - this binds Vite to all network interfaces so LAN peers can reach it,
rather than just `localhost`.
