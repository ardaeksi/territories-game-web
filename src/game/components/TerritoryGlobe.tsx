import { useEffect, useMemo, useRef, useState } from "react";
import Globe, { type GlobeMethods } from "react-globe.gl";
import * as THREE from "three";
import { feature } from "topojson-client";
import type { GeometryCollection, Topology } from "topojson-specification";
import type { Feature, Geometry } from "geojson";
import type { Territory } from "../types/domain";
import { RESOURCE_LABELS, RESOURCE_ORDER } from "../constants/resources";

interface TerritoryGlobeProps {
  territories: Territory[];
  onClaimTerritory: (territoryId: number) => void;
}

const OCEAN_COLOR = 0x0c2f4f;
const UNCLAIMED_COLOR = "#e8edf2";
const ATMOSPHERE_COLOR = "#4fd1c5";

const globeMaterial = new THREE.MeshPhongMaterial({
  color: OCEAN_COLOR,
  shininess: 18,
});

// Mirrors the fallback id logic in scripts/generate-territories.mjs: a handful of
// disputed/unrecognized territories (Kosovo, Somaliland, N. Cyprus) have no ISO
// numeric id in this topology, so both sides derive the same slug fallback to stay
// in sync on what "countryId" means for those entries.
function countryIdFor(id: string | number | undefined, name: string | undefined): string {
  if (id !== undefined && id !== null) {
    return String(id);
  }
  return "name-" + (name ?? "unknown").toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

export function TerritoryGlobe({ territories, onClaimTerritory }: TerritoryGlobeProps) {
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const [countryFeatures, setCountryFeatures] = useState<Feature<Geometry>[]>([]);

  useEffect(() => {
    fetch("/countries-110m.json")
      .then((res) => res.json())
      .then((topology: Topology) => {
        const geometry = topology.objects.countries as GeometryCollection;
        const geo = feature(topology, geometry);
        setCountryFeatures(geo.features);
      });
  }, []);

  useEffect(() => {
    globeRef.current?.pointOfView({ lat: 25, lng: -20, altitude: 2.2 }, 0);
  }, []);

  const territoryByCountryId = useMemo(() => {
    const map = new Map<string, Territory>();
    territories.forEach((territory) => map.set(territory.countryId, territory));
    return map;
  }, [territories]);

  const territoryFor = (polygon: object) => {
    const f = polygon as Feature<Geometry>;
    return territoryByCountryId.get(countryIdFor(f.id, (f.properties as { name?: string } | null)?.name));
  };

  return (
    <Globe
      ref={globeRef}
      globeMaterial={globeMaterial}
      backgroundImageUrl="/night-sky.png"
      showAtmosphere
      atmosphereColor={ATMOSPHERE_COLOR}
      atmosphereAltitude={0.22}
      showGraticules
      polygonsData={countryFeatures}
      polygonCapColor={(polygon) => territoryFor(polygon)?.ownerColorHex ?? UNCLAIMED_COLOR}
      polygonSideColor={() => "rgba(200, 210, 220, 0.15)"}
      polygonStrokeColor={() => "#aeb9c4"}
      polygonAltitude={0.006}
      polygonsTransitionDuration={600}
      polygonLabel={(polygon) => {
        const territory = territoryFor(polygon);
        if (!territory) return "";
        const resourceLines = RESOURCE_ORDER.map(
          (type) => `<span class="territory-tooltip-resource">${RESOURCE_LABELS[type]}: ${territory.resources[type] ?? 0}</span>`
        ).join("");
        return `<div class="territory-tooltip">
          <strong>${territory.countryName}</strong><br/>
          ${territory.ownerDisplayName ? `Owned by ${territory.ownerDisplayName}` : "Unclaimed"}
          <div class="territory-tooltip-resources">${resourceLines}</div>
        </div>`;
      }}
      onPolygonClick={(polygon) => {
        const territory = territoryFor(polygon);
        if (territory) {
          onClaimTerritory(territory.id);
        }
      }}
    />
  );
}
