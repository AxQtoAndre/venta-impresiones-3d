import * as THREE from 'three';
import { MaterialId } from '@/src/data/catalog';

export interface PolymerPreset {
  id: MaterialId;
  label: string;
  colorHex: number;
  accentHex: number;
  roughness: number;
  metalness: number;
  clearcoat: number;
  clearcoatRoughness: number;
}

export const POLYMER_PRESETS: Record<MaterialId, PolymerPreset> = {
  pla: {
    id: 'pla',
    label: 'PLA+ Matte',
    colorHex: 0x2c3545,
    accentHex: 0xf97316,
    roughness: 0.68,
    metalness: 0.06,
    clearcoat: 0.05,
    clearcoatRoughness: 0.6,
  },
  petg: {
    id: 'petg',
    label: 'PETG Cobalt',
    colorHex: 0x1d4ed8,
    accentHex: 0x38bdf8,
    roughness: 0.28,
    metalness: 0.05,
    clearcoat: 0.65,
    clearcoatRoughness: 0.18,
  },
  abs: {
    id: 'abs',
    label: 'ASA Orange',
    colorHex: 0xea580c,
    accentHex: 0xe2e8f0,
    roughness: 0.52,
    metalness: 0.08,
    clearcoat: 0.15,
    clearcoatRoughness: 0.4,
  },
  tpu: {
    id: 'tpu',
    label: 'TPU 95A',
    colorHex: 0x181c24,
    accentHex: 0xfb923c,
    roughness: 0.82,
    metalness: 0.02,
    clearcoat: 0.0,
    clearcoatRoughness: 0.8,
  },
};

/**
 * Generates an involute-approximated spur gear Shape with optional center bore.
 */
export function createGearShape(
  teeth: number,
  pitchRadius: number,
  toothDepth: number,
  boreRadius: number
): THREE.Shape {
  const shape = new THREE.Shape();
  const outerR = pitchRadius + toothDepth * 0.45;
  const rootR = pitchRadius - toothDepth * 0.55;
  const step = (Math.PI * 2) / teeth;

  for (let i = 0; i < teeth; i++) {
    const baseAngle = i * step;
    const a0 = baseAngle;
    const a1 = baseAngle + step * 0.16;
    const a2 = baseAngle + step * 0.28;
    const a3 = baseAngle + step * 0.48;
    const a4 = baseAngle + step * 0.60;
    const a5 = baseAngle + step * 0.78;

    const p0x = Math.cos(a0) * rootR;
    const p0y = Math.sin(a0) * rootR;
    if (i === 0) {
      shape.moveTo(p0x, p0y);
    } else {
      shape.lineTo(p0x, p0y);
    }
    shape.lineTo(Math.cos(a1) * rootR, Math.sin(a1) * rootR);
    shape.lineTo(Math.cos(a2) * outerR, Math.sin(a2) * outerR);
    shape.lineTo(Math.cos(a3) * outerR, Math.sin(a3) * outerR);
    shape.lineTo(Math.cos(a4) * rootR, Math.sin(a4) * rootR);
    shape.lineTo(Math.cos(a5) * rootR, Math.sin(a5) * rootR);
  }
  shape.closePath();

  if (boreRadius > 0.01) {
    const hole = new THREE.Path();
    hole.absarc(0, 0, boreRadius, 0, Math.PI * 2, true);
    shape.holes.push(hole);
  }

  return shape;
}

/**
 * Generates the outer ring housing with 4 mounting ears and a central circular cutout.
 */
function createRingHousingShape(outerRadius: number, innerRadius: number): THREE.Shape {
  const shape = new THREE.Shape();
  const segments = 64;

  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    // Add subtle 4-lobe mounting flange profile at 45°, 135°, 225°, 315°
    const lobe = Math.pow(Math.max(0, Math.cos(4 * angle - Math.PI)), 6) * 0.26;
    const r = outerRadius + lobe;
    const x = Math.cos(angle) * r;
    const y = Math.sin(angle) * r;
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  shape.closePath();

  const innerHole = new THREE.Path();
  innerHole.absarc(0, 0, innerRadius, 0, Math.PI * 2, true);
  shape.holes.push(innerHole);

  return shape;
}

/**
 * Creates a procedural PEI print-bed grid texture in SRGBColorSpace.
 */
export function createBuildPlateTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const size = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    // Matte dark PEI coating base
    ctx.fillStyle = '#0e1420';
    ctx.fillRect(0, 0, size, size);

    // Subtle speckled powder-coat texture
    for (let i = 0; i < 6500; i++) {
      const x = (Math.sin(i * 12.9898) * 43758.5453) % 1;
      const y = (Math.sin(i * 78.233) * 19341.123) % 1;
      const px = Math.abs(x) * size;
      const py = Math.abs(y) * size;
      ctx.fillStyle = i % 2 === 0 ? 'rgba(255,255,255,0.028)' : 'rgba(0,0,0,0.22)';
      ctx.fillRect(px, py, 2, 2);
    }

    // Fine 10mm grid lines
    const minorStep = size / 24;
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.14)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 24; i++) {
      const pos = i * minorStep;
      ctx.beginPath();
      ctx.moveTo(pos, 0);
      ctx.lineTo(pos, size);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, pos);
      ctx.lineTo(size, pos);
      ctx.stroke();
    }

    // Major 50mm grid lines
    const majorStep = size / 6;
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
    ctx.lineWidth = 1.8;
    for (let i = 0; i <= 6; i++) {
      const pos = i * majorStep;
      ctx.beginPath();
      ctx.moveTo(pos, 0);
      ctx.lineTo(pos, size);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, pos);
      ctx.lineTo(size, pos);
      ctx.stroke();
    }

    // Build plate perimeter frame & calibration crosshair
    ctx.strokeStyle = 'rgba(249, 115, 22, 0.65)';
    ctx.lineWidth = 4;
    ctx.strokeRect(18, 18, size - 36, size - 36);

    ctx.fillStyle = 'rgba(226, 232, 240, 0.55)';
    ctx.font = '600 22px monospace';
    ctx.fillText('PRINTFORGE PEI 300x300', 38, size - 38);
    ctx.fillText('Z0 CALIBRATED', size - 210, size - 38);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = Math.max(1, maxAnisotropy);
  texture.needsUpdate = true;
  return texture;
}

export interface PlanetaryAssemblyRig {
  root: THREE.Group;
  sunGear: THREE.Mesh;
  planetGears: THREE.Mesh[];
  planetGroup: THREE.Group;
  ringHousing: THREE.Mesh;
  carrierCap: THREE.Mesh;
  shaft: THREE.Mesh;
  fasteners: THREE.InstancedMesh;
  wireframeLines: THREE.LineSegments[];
  primaryPolymerMat: THREE.MeshPhysicalMaterial;
  accentPolymerMat: THREE.MeshPhysicalMaterial;
  steelMat: THREE.MeshStandardMaterial;
  brassMat: THREE.MeshStandardMaterial;
  buildPlateMat: THREE.MeshStandardMaterial;
  updateExplode: (explodeAmount: number) => void;
  setPolymer: (preset: PolymerPreset) => void;
  setWireframe: (enabled: boolean) => void;
  dispose: () => void;
}

export function buildPlanetaryAssembly(maxAnisotropy: number): PlanetaryAssemblyRig {
  const root = new THREE.Group();

  const disposables: { dispose: () => void }[] = [];
  const wireframeLines: THREE.LineSegments[] = [];

  const initialPreset = POLYMER_PRESETS.petg;

  const primaryPolymerMat = new THREE.MeshPhysicalMaterial({
    color: initialPreset.colorHex,
    roughness: initialPreset.roughness,
    metalness: initialPreset.metalness,
    clearcoat: initialPreset.clearcoat,
    clearcoatRoughness: initialPreset.clearcoatRoughness,
  });

  const accentPolymerMat = new THREE.MeshPhysicalMaterial({
    color: initialPreset.accentHex,
    roughness: 0.42,
    metalness: 0.08,
    clearcoat: 0.25,
    clearcoatRoughness: 0.3,
  });

  const steelMat = new THREE.MeshStandardMaterial({
    color: 0xcbd5e1,
    roughness: 0.22,
    metalness: 0.92,
  });

  const brassMat = new THREE.MeshStandardMaterial({
    color: 0xd97706,
    roughness: 0.28,
    metalness: 0.88,
  });

  const buildPlateTexture = createBuildPlateTexture(maxAnisotropy);
  const buildPlateMat = new THREE.MeshStandardMaterial({
    map: buildPlateTexture,
    roughness: 0.62,
    metalness: 0.28,
  });

  disposables.push(
    primaryPolymerMat,
    accentPolymerMat,
    steelMat,
    brassMat,
    buildPlateTexture,
    buildPlateMat
  );

  const wireMat = new THREE.LineBasicMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.55,
  });
  disposables.push(wireMat);

  const attachWireframe = (mesh: THREE.Mesh, threshold = 22) => {
    const edges = new THREE.EdgesGeometry(mesh.geometry, threshold);
    const lines = new THREE.LineSegments(edges, wireMat);
    lines.visible = false;
    mesh.add(lines);
    wireframeLines.push(lines);
    disposables.push(edges);
  };

  // 1. Calibrated PEI Build Plate Base (grounded at y = -0.06..0)
  const plateGeo = new THREE.BoxGeometry(4.4, 0.1, 4.4);
  const plateMesh = new THREE.Mesh(plateGeo, buildPlateMat);
  plateMesh.position.y = -0.05;
  plateMesh.receiveShadow = true;
  root.add(plateMesh);
  disposables.push(plateGeo);

  // 2. Base Mounting Flange / Ring Housing
  const ringShape = createRingHousingShape(1.52, 1.18);
  const ringGeo = new THREE.ExtrudeGeometry(ringShape, {
    depth: 0.42,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.03,
    bevelSegments: 2,
    curveSegments: 48,
  });
  ringGeo.rotateX(-Math.PI / 2);
  const ringHousing = new THREE.Mesh(ringGeo, primaryPolymerMat);
  ringHousing.position.y = 0.03;
  ringHousing.castShadow = true;
  ringHousing.receiveShadow = true;
  attachWireframe(ringHousing, 28);
  root.add(ringHousing);
  disposables.push(ringGeo);

  // 3. Central Sun Gear (12 teeth)
  const sunShape = createGearShape(12, 0.42, 0.14, 0.14);
  const sunGeo = new THREE.ExtrudeGeometry(sunShape, {
    depth: 0.36,
    bevelEnabled: true,
    bevelThickness: 0.02,
    bevelSize: 0.015,
    bevelSegments: 2,
  });
  sunGeo.rotateX(-Math.PI / 2);
  const sunGear = new THREE.Mesh(sunGeo, accentPolymerMat);
  sunGear.position.y = 0.05;
  sunGear.castShadow = true;
  sunGear.receiveShadow = true;
  attachWireframe(sunGear, 20);
  root.add(sunGear);
  disposables.push(sunGeo);

  // 4. Three Planetary Gears (10 teeth each, orbiting at radius = 0.80)
  const planetGroup = new THREE.Group();
  planetGroup.position.y = 0.05;
  root.add(planetGroup);

  const planetShape = createGearShape(10, 0.34, 0.135, 0.11);
  const planetGeo = new THREE.ExtrudeGeometry(planetShape, {
    depth: 0.34,
    bevelEnabled: true,
    bevelThickness: 0.02,
    bevelSize: 0.015,
    bevelSegments: 2,
  });
  planetGeo.rotateX(-Math.PI / 2);
  disposables.push(planetGeo);

  const pinGeo = new THREE.CylinderGeometry(0.105, 0.105, 0.46, 20);
  disposables.push(pinGeo);

  const planetGears: THREE.Mesh[] = [];
  const orbitRadius = 0.80;

  for (let i = 0; i < 3; i++) {
    const angle = (i * Math.PI * 2) / 3;
    const pMesh = new THREE.Mesh(planetGeo, primaryPolymerMat);
    pMesh.position.set(Math.cos(angle) * orbitRadius, 0, Math.sin(angle) * orbitRadius);
    // Offset tooth phase slightly so teeth mesh cleanly
    pMesh.rotation.y = angle + 0.18;
    pMesh.castShadow = true;
    pMesh.receiveShadow = true;
    attachWireframe(pMesh, 20);

    // Brass heat-set sleeve pin inside each planet gear
    const pinMesh = new THREE.Mesh(pinGeo, brassMat);
    pinMesh.position.y = 0.18;
    pinMesh.castShadow = true;
    pMesh.add(pinMesh);

    planetGroup.add(pMesh);
    planetGears.push(pMesh);
  }

  // 5. Machined Central Drive Shaft
  const shaftGeo = new THREE.CylinderGeometry(0.135, 0.135, 1.12, 28);
  const shaft = new THREE.Mesh(shaftGeo, steelMat);
  shaft.position.y = 0.56;
  shaft.castShadow = true;
  root.add(shaft);
  disposables.push(shaftGeo);

  // 6. Top Carrier Cap / Bearing Bridge (Lathe + Extrude profile)
  const capShape = new THREE.Shape();
  capShape.absarc(0, 0, 1.12, 0, Math.PI * 2, false);
  const capCenterHole = new THREE.Path();
  capCenterHole.absarc(0, 0, 0.22, 0, Math.PI * 2, true);
  capShape.holes.push(capCenterHole);

  for (let i = 0; i < 3; i++) {
    const a = (i * Math.PI * 2) / 3 + Math.PI / 3;
    const cutout = new THREE.Path();
    cutout.absarc(Math.cos(a) * 0.68, Math.sin(a) * 0.68, 0.22, 0, Math.PI * 2, true);
    capShape.holes.push(cutout);
  }

  const capGeo = new THREE.ExtrudeGeometry(capShape, {
    depth: 0.16,
    bevelEnabled: true,
    bevelThickness: 0.025,
    bevelSize: 0.025,
    bevelSegments: 2,
    curveSegments: 48,
  });
  capGeo.rotateX(-Math.PI / 2);
  const carrierCap = new THREE.Mesh(capGeo, primaryPolymerMat);
  carrierCap.position.y = 0.48;
  carrierCap.castShadow = true;
  carrierCap.receiveShadow = true;
  attachWireframe(carrierCap, 24);
  root.add(carrierCap);
  disposables.push(capGeo);

  // 7. Instanced M3 Stainless Socket-Head Bolts (8 fasteners total)
  const boltGeo = new THREE.CylinderGeometry(0.065, 0.065, 0.14, 12);
  const fasteners = new THREE.InstancedMesh(boltGeo, steelMat, 8);
  fasteners.castShadow = true;
  fasteners.frustumCulled = false;
  root.add(fasteners);
  disposables.push(boltGeo);

  const dummy = new THREE.Object3D();
  const updateFastenerPositions = (explode: number) => {
    // 4 outer housing flange bolts
    for (let i = 0; i < 4; i++) {
      const a = (i * Math.PI) / 2 + Math.PI / 4;
      dummy.position.set(
        Math.cos(a) * 1.56,
        0.52 + explode * 0.55,
        Math.sin(a) * 1.56
      );
      dummy.rotation.set(0, 0, 0);
      dummy.updateMatrix();
      fasteners.setMatrixAt(i, dummy.matrix);
    }
    // 4 inner bearing cap bolts
    for (let i = 0; i < 4; i++) {
      const a = (i * Math.PI) / 2;
      dummy.position.set(
        Math.cos(a) * 0.42,
        0.70 + explode * 1.38,
        Math.sin(a) * 0.42
      );
      dummy.rotation.set(0, 0, 0);
      dummy.updateMatrix();
      fasteners.setMatrixAt(4 + i, dummy.matrix);
    }
    fasteners.instanceMatrix.needsUpdate = true;
  };

  updateFastenerPositions(0);
  fasteners.computeBoundingSphere();

  const updateExplode = (explodeAmount: number) => {
    const e = THREE.MathUtils.clamp(explodeAmount, 0, 1);
    ringHousing.position.y = 0.03 + e * 0.05;
    sunGear.position.y = 0.05 + e * 0.35;
    planetGroup.position.y = 0.05 + e * 0.62;
    carrierCap.position.y = 0.48 + e * 1.05;
    shaft.position.y = 0.56 + e * 0.72;
    updateFastenerPositions(e);
  };

  const setPolymer = (preset: PolymerPreset) => {
    primaryPolymerMat.color.setHex(preset.colorHex);
    primaryPolymerMat.roughness = preset.roughness;
    primaryPolymerMat.metalness = preset.metalness;
    primaryPolymerMat.clearcoat = preset.clearcoat;
    primaryPolymerMat.clearcoatRoughness = preset.clearcoatRoughness;
    primaryPolymerMat.needsUpdate = true;

    accentPolymerMat.color.setHex(preset.accentHex);
    accentPolymerMat.needsUpdate = true;
  };

  const setWireframe = (enabled: boolean) => {
    wireframeLines.forEach((line) => {
      line.visible = enabled;
    });
  };

  const dispose = () => {
    disposables.forEach((item) => item.dispose());
  };

  return {
    root,
    sunGear,
    planetGears,
    planetGroup,
    ringHousing,
    carrierCap,
    shaft,
    fasteners,
    wireframeLines,
    primaryPolymerMat,
    accentPolymerMat,
    steelMat,
    brassMat,
    buildPlateMat,
    updateExplode,
    setPolymer,
    setWireframe,
    dispose,
  };
}
