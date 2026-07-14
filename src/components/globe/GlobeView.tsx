import { useEffect, useMemo, useRef, useState } from "react";
import Globe, { type GlobeMethods } from "react-globe.gl";
import * as THREE from "three";
import { feature } from "topojson-client";
import type { GeometryCollection, Topology } from "topojson-specification";
import type { Feature, Geometry } from "geojson";
import type { ServiceMember, Unit } from "../../types/domain";

interface CampPoint {
  unit: Unit;
  memberCount: number;
  readyCount: number;
}

export interface TransferArc {
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
}

interface GlobeViewProps {
  units: Unit[];
  members: ServiceMember[];
  activeTransfer: TransferArc | null;
  onSelectUnit: (unitId: number) => void;
}

const OCEAN_COLOR = 0x0c2f4f;
const LAND_COLOR = "#e8edf2";
const ATMOSPHERE_COLOR = "#4fd1c5";
const ARC_COLOR = "#f5a623";

const globeMaterial = new THREE.MeshPhongMaterial({
  color: OCEAN_COLOR,
  shininess: 18,
});

function createCampMarker(point: CampPoint, onSelectUnit: (unitId: number) => void): HTMLElement {
  // react-globe.gl owns this root element's transform (CSS3DObject) - ours has to live on an inner wrapper.
  const anchor = document.createElement("div");
  anchor.className = "camp-marker-anchor";

  const inner = document.createElement("div");
  inner.className = "camp-marker";
  inner.innerHTML = `
    <svg width="24" height="24" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" fill="rgba(245,166,35,0.18)" />
      <path d="M12 4 L20 18 H4 Z" fill="${ARC_COLOR}" stroke="#3a2205" stroke-width="1" />
      <rect x="11" y="1" width="2" height="4" fill="#3a2205" />
    </svg>
    <span class="camp-marker-label">${point.unit.name}</span>
    <span class="camp-marker-sub">${point.readyCount}/${point.memberCount} ready</span>
  `;
  inner.addEventListener("click", (event) => {
    event.stopPropagation();
    onSelectUnit(point.unit.id);
  });

  anchor.appendChild(inner);
  return anchor;
}

export function GlobeView({ units, members, activeTransfer, onSelectUnit }: GlobeViewProps) {
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const [landFeatures, setLandFeatures] = useState<Feature<Geometry>[]>([]);

  useEffect(() => {
    fetch("/land-110m.json")
      .then((res) => res.json())
      .then((topology: Topology) => {
        const geometry = topology.objects.land as GeometryCollection;
        const geo = feature(topology, geometry);
        setLandFeatures(geo.features);
      });
  }, []);

  useEffect(() => {
    globeRef.current?.pointOfView({ lat: 25, lng: -20, altitude: 2.2 }, 0);
  }, []);

  const campPoints: CampPoint[] = useMemo(
    () =>
      units.map((unit) => {
        const unitMembers = members.filter((member) => member.unitId === unit.id);
        return {
          unit,
          memberCount: unitMembers.length,
          readyCount: unitMembers.filter((member) => member.readinessStatus === "READY").length,
        };
      }),
    [units, members]
  );

  const arcs = useMemo(() => (activeTransfer ? [activeTransfer] : []), [activeTransfer]);

  return (
    <Globe
      ref={globeRef}
      globeMaterial={globeMaterial}
      backgroundImageUrl="/night-sky.png"
      showAtmosphere
      atmosphereColor={ATMOSPHERE_COLOR}
      atmosphereAltitude={0.22}
      showGraticules
      polygonsData={landFeatures}
      polygonCapColor={() => LAND_COLOR}
      polygonSideColor={() => "rgba(200, 210, 220, 0.15)"}
      polygonStrokeColor={() => "#aeb9c4"}
      polygonAltitude={0.006}
      htmlElementsData={campPoints}
      htmlLat={(d) => (d as CampPoint).unit.latitude}
      htmlLng={(d) => (d as CampPoint).unit.longitude}
      htmlElement={(d) => createCampMarker(d as CampPoint, onSelectUnit)}
      arcsData={arcs}
      arcStartLat={(d) => (d as TransferArc).startLat}
      arcStartLng={(d) => (d as TransferArc).startLng}
      arcEndLat={(d) => (d as TransferArc).endLat}
      arcEndLng={(d) => (d as TransferArc).endLng}
      arcColor={() => [ARC_COLOR, ARC_COLOR]}
      arcDashLength={0.4}
      arcDashGap={0.2}
      arcDashAnimateTime={1800}
      arcStroke={0.6}
      arcAltitude={0.3}
    />
  );
}
