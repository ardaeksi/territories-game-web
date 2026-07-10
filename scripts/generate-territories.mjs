// One-time generation script: derives claimable game territories (one per country)
// and their land-border adjacency graph from world-atlas + topojson-client, both
// already dependencies of this frontend project. Run manually with:
//   node scripts/generate-territories.mjs
// Output is committed directly into the backend's resources, since the Java backend
// has no equivalent topojson library and this data never needs to change at runtime.

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { feature, neighbors } from "topojson-client";
import { geoCentroid } from "d3-geo";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const topologyPath = path.join(__dirname, "..", "node_modules", "world-atlas", "countries-110m.json");
const outputPath = path.join(
  __dirname,
  "..",
  "..",
  "personnel-readiness-api",
  "src",
  "main",
  "resources",
  "game",
  "territories.json"
);

const topology = JSON.parse(readFileSync(topologyPath, "utf-8"));
const geometries = topology.objects.countries.geometries;
const featureCollection = feature(topology, topology.objects.countries);
const adjacencyIndices = neighbors(geometries);

// A handful of disputed/unrecognized territories (Kosovo, Somaliland, N. Cyprus) have no
// ISO numeric id in this dataset - geometry.id is undefined for all of them, which would
// otherwise collide on the literal string "undefined" as a shared countryId. Fall back to a
// slugified name for those so every territory still gets a stable, unique id.
function countryIdFor(geometry) {
  if (geometry.id !== undefined && geometry.id !== null) {
    return String(geometry.id);
  }
  return "name-" + (geometry.properties?.name ?? "unknown").toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

const countryIds = geometries.map(countryIdFor);

const territories = geometries.map((geometry, index) => {
  const [lng, lat] = geoCentroid(featureCollection.features[index]);
  return {
    countryId: countryIds[index],
    countryName: geometry.properties?.name ?? `Unknown-${geometry.id}`,
    centroidLat: lat,
    centroidLng: lng,
    neighborCountryIds: adjacencyIndices[index].map((neighborIndex) => countryIds[neighborIndex]),
  };
});

writeFileSync(outputPath, JSON.stringify(territories, null, 2));
console.log(`Wrote ${territories.length} territories to ${outputPath}`);
