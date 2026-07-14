import { useEffect, useMemo, useRef, useState } from "react";
import Globe, { type GlobeMethods } from "react-globe.gl";
import * as THREE from "three";
import { feature } from "topojson-client";
import type { GeometryCollection, Topology } from "topojson-specification";
import type { Feature, Geometry } from "geojson";
import type { Building, Territory } from "../types/domain";
import { RESOURCE_LABELS, RESOURCE_ORDER } from "../constants/resources";
import { animateBuildingObject, createBuildingObject } from "../three/buildingModels";

interface TerritoryGlobeProps {
  territories: Territory[];
  buildings: Building[];
  playerId: number;
  onClaimTerritory: (territoryId: number) => void;
  onSelectOwnTerritory: (territoryId: number) => void;
  onSelectMineBuilding: (buildingId: number) => void;
}

interface BuildingMarker {
  building: Building;
  lat: number;
  lng: number;
}

/** Small fixed-radius ring offset so co-located buildings on one territory don't overlap. */
const MARKER_JITTER_DEGREES = 0.55;

function jitteredPosition(centroidLat: number, centroidLng: number, index: number, total: number) {
  if (total <= 1) return { lat: centroidLat, lng: centroidLng };
  const angle = (index / total) * Math.PI * 2;
  return {
    lat: centroidLat + Math.sin(angle) * MARKER_JITTER_DEGREES,
    lng: centroidLng + Math.cos(angle) * MARKER_JITTER_DEGREES,
  };
}

const OCEAN_COLOR = 0x0c2f4f;
const UNCLAIMED_COLOR = "#e8edf2";
const ATMOSPHERE_COLOR = "#4fd1c5";

const globeMaterial = new THREE.MeshPhongMaterial({
  color: OCEAN_COLOR,
  shininess: 18,
});

// Mirrors the fallback id logic in scripts/generate-territories.mjs for territories with no ISO id.
function countryIdFor(id: string | number | undefined, name: string | undefined): string {
  if (id !== undefined && id !== null) {
    return String(id);
  }
  return "name-" + (name ?? "unknown").toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

export function TerritoryGlobe({
  territories,
  buildings,
  playerId,
  onClaimTerritory,
  onSelectOwnTerritory,
  onSelectMineBuilding,
}: TerritoryGlobeProps) {
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const [countryFeatures, setCountryFeatures] = useState<Feature<Geometry>[]>([]);
  const animatedObjects = useRef(new Map<number, { object: THREE.Object3D; type: Building["type"] }>());

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

  const buildingMarkers = useMemo<BuildingMarker[]>(() => {
    const territoryById = new Map<number, Territory>();
    territories.forEach((territory) => territoryById.set(territory.id, territory));

    const byTerritory = new Map<number, Building[]>();
    buildings.forEach((building) => {
      const list = byTerritory.get(building.territoryId) ?? [];
      list.push(building);
      byTerritory.set(building.territoryId, list);
    });

    const markers: BuildingMarker[] = [];
    byTerritory.forEach((buildingsOnTerritory, territoryId) => {
      const territory = territoryById.get(territoryId);
      if (!territory) return;
      buildingsOnTerritory.forEach((building, index) => {
        const { lat, lng } = jitteredPosition(
          territory.centroidLat,
          territory.centroidLng,
          index,
          buildingsOnTerritory.length
        );
        markers.push({ building, lat, lng });
      });
    });
    return markers;
  }, [territories, buildings]);

  // react-globe.gl keeps re-rendering the shared scene anyway, so mutating meshes here is enough.
  useEffect(() => {
    let frameId: number;
    const start = performance.now();
    const tick = () => {
      const elapsedSeconds = (performance.now() - start) / 1000;
      animatedObjects.current.forEach(({ object, type }) => {
        animateBuildingObject(type, object, elapsedSeconds);
      });
      frameId = requestAnimationFrame(tick);
    };
    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, []);

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
        if (!territory) return;
        if (territory.ownerId === playerId) {
          onSelectOwnTerritory(territory.id);
        } else if (territory.ownerId === null) {
          onClaimTerritory(territory.id);
        }
        // Owned by another player: no action - their info is already visible on hover.
      }}
      objectsData={buildingMarkers}
      objectLat={(d) => (d as BuildingMarker).lat}
      objectLng={(d) => (d as BuildingMarker).lng}
      objectAltitude={0.015}
      objectLabel={(d) => (d as BuildingMarker).building.type.replace(/_/g, " ")}
      objectThreeObject={(d) => {
        const marker = d as BuildingMarker;
        const object = createBuildingObject(marker.building.type);
        animatedObjects.current.set(marker.building.id, { object, type: marker.building.type });
        return object;
      }}
      onObjectClick={(d) => {
        const marker = d as BuildingMarker;
        if (marker.building.type === "MINE") {
          onSelectMineBuilding(marker.building.id);
        }
      }}
    />
  );
}
