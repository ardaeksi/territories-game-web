import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import type { BuildingType } from "../types/domain";

/** The one knob to turn if markers read too big/small once actually seen on screen. */
export const BUILDING_MARKER_SCALE = 3.4;

/** Target size (in pre-BUILDING_MARKER_SCALE units) any loaded model gets normalized to. */
const MODEL_TARGET_SIZE = 1.8;

function mineObject(): THREE.Object3D {
  const group = new THREE.Group();

  const rim = new THREE.Mesh(
    new THREE.TorusGeometry(1.05, 0.26, 8, 20),
    new THREE.MeshPhongMaterial({ color: 0x6b5335 })
  );
  rim.rotation.x = Math.PI / 2;
  rim.position.y = 0.05;
  group.add(rim);

  const pit = new THREE.Mesh(
    new THREE.CylinderGeometry(0.95, 0.45, 1.15, 16, 1, true),
    new THREE.MeshPhongMaterial({ color: 0x140f0c, side: THREE.DoubleSide })
  );
  pit.position.y = -0.5;
  group.add(pit);

  const floor = new THREE.Mesh(
    new THREE.CircleGeometry(0.45, 16),
    new THREE.MeshPhongMaterial({ color: 0x0c0908 })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -1.05;
  group.add(floor);

  const eyeGeometry = new THREE.SphereGeometry(0.09, 8, 8);
  const eyeMaterial = new THREE.MeshBasicMaterial({ color: 0x9fffef, transparent: true });
  const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
  leftEye.position.set(-0.18, -0.55, 0.18);
  const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
  rightEye.position.set(0.18, -0.55, 0.18);
  group.add(leftEye, rightEye);

  group.userData.eyes = [leftEye, rightEye];
  group.userData.eyeBaseY = -0.55;
  return group;
}

function oilRigObject(): THREE.Object3D {
  const group = new THREE.Group();

  const tower = new THREE.Mesh(
    new THREE.ConeGeometry(0.42, 1.5, 4, 1, true),
    new THREE.MeshPhongMaterial({ color: 0x4a4f57, side: THREE.DoubleSide })
  );
  tower.position.y = 0.75;
  group.add(tower);

  const beamPivot = new THREE.Group();
  beamPivot.position.set(0, 1.4, 0);
  const beam = new THREE.Mesh(
    new THREE.BoxGeometry(0.85, 0.1, 0.1),
    new THREE.MeshPhongMaterial({ color: 0x2f333a })
  );
  beam.position.x = 0.35;
  beamPivot.add(beam);
  group.add(beamPivot);

  group.userData.beamPivot = beamPivot;
  return group;
}

function gunpowderFactoryObject(): THREE.Object3D {
  const group = new THREE.Group();

  const body = new THREE.Mesh(
    new THREE.BoxGeometry(1.05, 0.85, 1.05),
    new THREE.MeshPhongMaterial({ color: 0x5a3d33 })
  );
  body.position.y = 0.42;
  group.add(body);

  const chimney = new THREE.Mesh(
    new THREE.CylinderGeometry(0.13, 0.15, 0.65, 10),
    new THREE.MeshPhongMaterial({ color: 0x3a2a22 })
  );
  chimney.position.set(0.32, 1.18, 0.32);
  group.add(chimney);

  const puff = new THREE.Mesh(
    new THREE.SphereGeometry(0.15, 8, 8),
    new THREE.MeshBasicMaterial({ color: 0xcfd6dd, transparent: true, opacity: 0.5 })
  );
  puff.position.set(0.32, 1.55, 0.32);
  group.add(puff);

  group.userData.puff = puff;
  group.userData.puffBaseY = 1.55;
  return group;
}

function boatFactoryObject(): THREE.Object3D {
  const group = new THREE.Group();

  const hull = new THREE.Mesh(
    new THREE.BoxGeometry(1.25, 0.32, 0.5),
    new THREE.MeshPhongMaterial({ color: 0x8a5a3a })
  );
  hull.position.y = 0.18;
  group.add(hull);

  const mast = new THREE.Mesh(
    new THREE.CylinderGeometry(0.03, 0.03, 0.95, 6),
    new THREE.MeshPhongMaterial({ color: 0x3a2a1a })
  );
  mast.position.set(0, 0.85, 0);
  group.add(mast);

  const sail = new THREE.Mesh(
    new THREE.PlaneGeometry(0.48, 0.55),
    new THREE.MeshPhongMaterial({ color: 0xe8edf2, side: THREE.DoubleSide })
  );
  sail.position.set(0.24, 0.95, 0);
  group.add(sail);

  return group;
}

function armyCampObject(): THREE.Object3D {
  const group = new THREE.Group();

  const tent = new THREE.Mesh(
    new THREE.ConeGeometry(0.65, 0.85, 4),
    new THREE.MeshPhongMaterial({ color: 0x4b5320 })
  );
  tent.rotation.y = Math.PI / 4;
  tent.position.y = 0.42;
  group.add(tent);

  const pole = new THREE.Mesh(
    new THREE.CylinderGeometry(0.02, 0.02, 0.55, 6),
    new THREE.MeshPhongMaterial({ color: 0x2a2a2a })
  );
  pole.position.set(0.45, 1.1, 0);
  group.add(pole);

  const flag = new THREE.Mesh(
    new THREE.PlaneGeometry(0.26, 0.17),
    new THREE.MeshPhongMaterial({ color: 0xc0392b, side: THREE.DoubleSide })
  );
  flag.position.set(0.6, 1.3, 0);
  group.add(flag);

  group.userData.flag = flag;
  return group;
}

function armyFactoryObject(): THREE.Object3D {
  const group = new THREE.Group();

  const body = new THREE.Mesh(
    new THREE.BoxGeometry(1.15, 0.95, 1.15),
    new THREE.MeshPhongMaterial({ color: 0x3d4550 })
  );
  body.position.y = 0.48;
  group.add(body);

  const gear = new THREE.Mesh(
    new THREE.TorusGeometry(0.24, 0.075, 6, 8),
    new THREE.MeshPhongMaterial({ color: 0xd8dee5 })
  );
  gear.position.set(0, 1.1, 0.59);
  group.add(gear);

  group.userData.gear = gear;
  return group;
}

const PROCEDURAL_FACTORIES: Record<BuildingType, () => THREE.Object3D> = {
  MINE: mineObject,
  OIL_RIG: oilRigObject,
  GUNPOWDER_FACTORY: gunpowderFactoryObject,
  BOAT_FACTORY: boatFactoryObject,
  ARMY_CAMP: armyCampObject,
  ARMY_FACTORY: armyFactoryObject,
};

// Drop a GLB at public/models/buildings/<type>.glb (e.g. "oil_rig.glb") and it's picked
// up automatically; types without a file keep using the procedural shape above.

const gltfLoader = new GLTFLoader();
const modelLoadPromises = new Map<BuildingType, Promise<THREE.Object3D | null>>();

function modelPath(type: BuildingType): string {
  return `/models/buildings/${type.toLowerCase()}.glb`;
}

/** Scales + recenters a loaded model to a consistent footprint, regardless of how it was authored/exported. */
function normalizeToFootprint(object: THREE.Object3D, targetSize: number): void {
  const box = new THREE.Box3().setFromObject(object);
  const size = new THREE.Vector3();
  box.getSize(size);
  const maxDimension = Math.max(size.x, size.y, size.z, 1e-6);
  const scale = targetSize / maxDimension;
  object.scale.setScalar(scale);

  const center = new THREE.Vector3();
  box.getCenter(center);
  object.position.set(-center.x * scale, -box.min.y * scale, -center.z * scale);
}

function loadModelTemplate(type: BuildingType): Promise<THREE.Object3D | null> {
  let promise = modelLoadPromises.get(type);
  if (!promise) {
    promise = gltfLoader
      .loadAsync(modelPath(type))
      .then((gltf) => {
        normalizeToFootprint(gltf.scene, MODEL_TARGET_SIZE);
        return gltf.scene;
      })
      .catch(() => null); // no file yet - keep the procedural fallback
    modelLoadPromises.set(type, promise);
  }
  return promise;
}

/** Looks for a node named "Eyes" so the Mine's idle-glow animation can target it directly. */
function findNodeCaseInsensitive(root: THREE.Object3D, name: string): THREE.Object3D | undefined {
  let found: THREE.Object3D | undefined;
  root.traverse((child) => {
    if (!found && child.name.toLowerCase() === name.toLowerCase()) {
      found = child;
    }
  });
  return found;
}

export function createBuildingObject(type: BuildingType): THREE.Object3D {
  const container = new THREE.Group();
  const fallback = PROCEDURAL_FACTORIES[type]();
  container.add(fallback);
  container.userData.fallback = fallback;
  container.userData.usingModel = false;

  loadModelTemplate(type).then((template) => {
    if (!template) return;
    container.remove(fallback);
    const instance = template.clone(true);
    container.add(instance);
    container.userData.usingModel = true;
    container.userData.modelInstance = instance;

    if (type === "MINE") {
      const eyes = findNodeCaseInsensitive(instance, "Eyes");
      if (eyes) {
        container.userData.modelEyes = eyes;
        container.userData.modelEyesBaseY = eyes.position.y;
      }
    }
  });

  container.scale.setScalar(BUILDING_MARKER_SCALE);
  return container;
}

function animateModelInstance(type: BuildingType, container: THREE.Object3D, elapsedSeconds: number): void {
  if (type === "MINE") {
    const eyes = container.userData.modelEyes as THREE.Object3D | undefined;
    const baseY = container.userData.modelEyesBaseY as number | undefined;
    if (eyes && baseY !== undefined) {
      eyes.position.y = baseY + Math.sin(elapsedSeconds * 1.6) * 0.03;
      const scalePulse = 1 + Math.sin(elapsedSeconds * 2.4) * 0.12;
      eyes.scale.setScalar(scalePulse);
      return;
    }
  }
  // No named node to target - fall back to a generic idle bob/rotation.
  const instance = container.userData.modelInstance as THREE.Object3D | undefined;
  if (instance) {
    instance.position.y = Math.sin(elapsedSeconds * 1.1) * 0.04;
    instance.rotation.y = elapsedSeconds * 0.25;
  }
}

function animateProceduralFallback(type: BuildingType, object: THREE.Object3D, elapsedSeconds: number): void {
  switch (type) {
    case "MINE": {
      const eyes = object.userData.eyes as THREE.Mesh[] | undefined;
      const baseY = (object.userData.eyeBaseY as number | undefined) ?? -0.55;
      if (eyes) {
        const bob = Math.sin(elapsedSeconds * 1.6) * 0.03;
        eyes.forEach((eye) => {
          eye.position.y = baseY + bob;
          const material = eye.material as THREE.MeshBasicMaterial;
          material.opacity = 0.55 + Math.sin(elapsedSeconds * 2.4) * 0.35;
        });
      }
      break;
    }
    case "OIL_RIG": {
      const beamPivot = object.userData.beamPivot as THREE.Object3D | undefined;
      if (beamPivot) {
        beamPivot.rotation.z = Math.sin(elapsedSeconds * 2) * 0.35;
      }
      break;
    }
    case "GUNPOWDER_FACTORY": {
      const puff = object.userData.puff as THREE.Mesh | undefined;
      const baseY = (object.userData.puffBaseY as number | undefined) ?? 1.55;
      if (puff) {
        const cycle = (elapsedSeconds * 0.5) % 1;
        puff.position.y = baseY + cycle * 0.4;
        const material = puff.material as THREE.MeshBasicMaterial;
        material.opacity = 0.5 * (1 - cycle);
        const scale = 1 + cycle * 0.6;
        puff.scale.setScalar(scale);
      }
      break;
    }
    case "BOAT_FACTORY": {
      object.position.y = Math.sin(elapsedSeconds * 1.5) * 0.06;
      break;
    }
    case "ARMY_CAMP": {
      const flag = object.userData.flag as THREE.Mesh | undefined;
      if (flag) {
        flag.rotation.y = Math.sin(elapsedSeconds * 4) * 0.5;
      }
      break;
    }
    case "ARMY_FACTORY": {
      const gear = object.userData.gear as THREE.Mesh | undefined;
      if (gear) {
        gear.rotation.z = elapsedSeconds * 1.2;
      }
      break;
    }
  }
}

/** Mutates a previously-created building object in place for the given elapsed time. */
export function animateBuildingObject(type: BuildingType, object: THREE.Object3D, elapsedSeconds: number): void {
  if (object.userData.usingModel) {
    animateModelInstance(type, object, elapsedSeconds);
    return;
  }
  const fallback = object.userData.fallback as THREE.Object3D | undefined;
  if (fallback) {
    animateProceduralFallback(type, fallback, elapsedSeconds);
  }
}
