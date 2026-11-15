import { ChevronDown, ChevronUp, Grid3X3, Pause, Play, RotateCcw } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import heroLabImg from '@/src/assets/images/hero_printforge_lab_1794701462247.jpg';
import {
  buildPlanetaryAssembly,
  PlanetaryAssemblyRig,
  POLYMER_PRESETS,
} from '@/src/components/three/gearAssembly';
import { MaterialId } from '@/src/data/catalog';

const PRESET_LIST = [
  POLYMER_PRESETS.pla,
  POLYMER_PRESETS.petg,
  POLYMER_PRESETS.abs,
  POLYMER_PRESETS.tpu,
];

const DEFAULT_CAM_POS = new THREE.Vector3(3.1, 2.55, 3.35);
const DEFAULT_TARGET = new THREE.Vector3(0, 0.38, 0);

export default function Hero3DViewer() {
  const mountRef = useRef<HTMLDivElement | null>(null);

  const [polymer, setPolymer] = useState<MaterialId>('petg');
  const [explode, setExplode] = useState<number>(0);
  const [isSpinning, setIsSpinning] = useState<boolean>(true);
  const [wireframe, setWireframe] = useState<boolean>(false);
  const [dockOpen, setDockOpen] = useState<boolean>(true);
  const [webglUnavailable, setWebglUnavailable] = useState<boolean>(false);

  const rigRef = useRef<PlanetaryAssemblyRig | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  const targetExplodeRef = useRef<number>(0);
  const currentExplodeRef = useRef<number>(0);
  const isSpinningRef = useRef<boolean>(true);
  const resetAnimActiveRef = useRef<boolean>(false);
  const requestRenderRef = useRef<(() => void) | null>(null);

  // Sync React controls to Three.js scene refs without tearing down WebGL context
  useEffect(() => {
    targetExplodeRef.current = explode;
    requestRenderRef.current?.();
  }, [explode]);

  useEffect(() => {
    isSpinningRef.current = isSpinning;
    requestRenderRef.current?.();
  }, [isSpinning]);

  useEffect(() => {
    rigRef.current?.setPolymer(POLYMER_PRESETS[polymer]);
    requestRenderRef.current?.();
  }, [polymer]);

  useEffect(() => {
    rigRef.current?.setWireframe(wireframe);
    requestRenderRef.current?.();
  }, [wireframe]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Respect reduced motion preference on initial state
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      isSpinningRef.current = false;
      setIsSpinning(false);
    }

    // Software WebGL probe
    const isSoftwareGl = (() => {
      try {
        const probeCanvas = document.createElement('canvas');
        const gl = probeCanvas.getContext('webgl2') || probeCanvas.getContext('webgl');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return true;
      }
    })();

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        powerPreference: 'high-performance',
      });
    } catch {
      setWebglUnavailable(true);
      return;
    }

    const width = container.clientWidth || 640;
    const height = container.clientHeight || 460;

    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';

    container.appendChild(renderer.domElement);

    const handleContextLost = (e: Event) => {
      e.preventDefault();
      setWebglUnavailable(true);
    };
    const handleContextRestored = () => {
      setWebglUnavailable(false);
      requestRenderRef.current?.();
    };
    renderer.domElement.addEventListener('webglcontextlost', handleContextLost);
    renderer.domElement.addEventListener('webglcontextrestored', handleContextRestored);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0b1018);
    scene.fog = new THREE.FogExp2(0x0b1018, 0.055);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTarget = pmremGenerator.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envTarget.texture;
    pmremGenerator.dispose();

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 60);
    camera.position.copy(DEFAULT_CAM_POS);
    cameraRef.current = camera;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.copy(DEFAULT_TARGET);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.06;
    controls.enablePan = false;
    controls.minDistance = 2.4;
    controls.maxDistance = 7.5;
    controls.minPolarAngle = 0.25;
    controls.maxPolarAngle = Math.PI / 2 - 0.08;
    controls.update();
    controlsRef.current = controls;

    // 3-Point Warm/Cool Studio Rig
    const hemiLight = new THREE.HemisphereLight(0x93c5fd, 0x0f172a, 0.75);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff1e0, 2.2);
    keyLight.position.set(4.5, 6.5, 3.8);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 1;
    keyLight.shadow.camera.far = 18;
    keyLight.shadow.camera.left = -3.2;
    keyLight.shadow.camera.right = 3.2;
    keyLight.shadow.camera.top = 3.2;
    keyLight.shadow.camera.bottom = -3.2;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.35);
    rimLight.position.set(-4.0, 3.2, -3.5);
    scene.add(rimLight);

    const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
    const rig = buildPlanetaryAssembly(maxAnisotropy);
    scene.add(rig.root);
    rigRef.current = rig;

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    let frameId = 0;
    let disposed = false;
    let renderScheduled = false;
    let lastTime = performance.now();

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync ? gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0) : null;
      gl.flush();
      const poll = () => {
        if (disposed) return;
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (sync && state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    const scheduleFrame = () => {
      if (disposed || renderScheduled) return;
      renderScheduled = true;
      frameId = requestAnimationFrame(step);
    };

    const step = (now: number) => {
      renderScheduled = false;
      if (disposed) return;

      const delta = Math.min(0.05, Math.max(0.001, (now - lastTime) / 1000));
      lastTime = now;

      let needsAnotherFrame = false;

      // Smooth exponential damping for exploded view
      const explodeDiff = Math.abs(targetExplodeRef.current - currentExplodeRef.current);
      if (explodeDiff > 0.001) {
        currentExplodeRef.current = THREE.MathUtils.damp(
          currentExplodeRef.current,
          targetExplodeRef.current,
          8,
          delta
        );
        rig.updateExplode(currentExplodeRef.current);
        needsAnotherFrame = true;
      } else if (explodeDiff > 0) {
        currentExplodeRef.current = targetExplodeRef.current;
        rig.updateExplode(currentExplodeRef.current);
      }

      // Smooth camera reset interpolation
      if (resetAnimActiveRef.current) {
        camera.position.x = THREE.MathUtils.damp(camera.position.x, DEFAULT_CAM_POS.x, 7, delta);
        camera.position.y = THREE.MathUtils.damp(camera.position.y, DEFAULT_CAM_POS.y, 7, delta);
        camera.position.z = THREE.MathUtils.damp(camera.position.z, DEFAULT_CAM_POS.z, 7, delta);
        controls.target.x = THREE.MathUtils.damp(controls.target.x, DEFAULT_TARGET.x, 7, delta);
        controls.target.y = THREE.MathUtils.damp(controls.target.y, DEFAULT_TARGET.y, 7, delta);
        controls.target.z = THREE.MathUtils.damp(controls.target.z, DEFAULT_TARGET.z, 7, delta);

        if (camera.position.distanceTo(DEFAULT_CAM_POS) < 0.02) {
          camera.position.copy(DEFAULT_CAM_POS);
          controls.target.copy(DEFAULT_TARGET);
          resetAnimActiveRef.current = false;
        } else {
          needsAnotherFrame = true;
        }
      }

      // Planetary gear kinematics
      if (isSpinningRef.current) {
        const sunOmega = delta * 1.15;
        rig.sunGear.rotation.y += sunOmega;
        rig.shaft.rotation.y += sunOmega;
        rig.planetGroup.rotation.y += sunOmega * 0.28;
        rig.carrierCap.rotation.y += sunOmega * 0.28;
        for (const p of rig.planetGears) {
          p.rotation.y -= sunOmega * 0.92;
        }
        needsAnotherFrame = true;
      }

      const controlsUpdated = controls.update();
      if (controlsUpdated && !isSoftwareGl) {
        needsAnotherFrame = true;
      }

      renderer.render(scene, camera);

      if (needsAnotherFrame) {
        if (isSoftwareGl) {
          afterDraw(scheduleFrame);
        } else {
          scheduleFrame();
        }
      }
    };

    requestRenderRef.current = () => {
      lastTime = performance.now();
      scheduleFrame();
    };

    const onControlsStart = () => {
      resetAnimActiveRef.current = false;
    };
    const onControlsChange = () => {
      scheduleFrame();
    };
    controls.addEventListener('start', onControlsStart);
    controls.addEventListener('change', onControlsChange);

    // ResizeObserver for crisp responsive scaling
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: w, height: h } = entry.contentRect;
        if (w > 0 && h > 0) {
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h);
          scheduleFrame();
        }
      }
    });
    resizeObserver.observe(container);

    // Initial render
    scheduleFrame();

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      resizeObserver.disconnect();
      controls.removeEventListener('start', onControlsStart);
      controls.removeEventListener('change', onControlsChange);
      controls.dispose();
      renderer.domElement.removeEventListener('webglcontextlost', handleContextLost);
      renderer.domElement.removeEventListener('webglcontextrestored', handleContextRestored);
      rig.dispose();
      envTarget.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  const handleResetView = () => {
    resetAnimActiveRef.current = true;
    setExplode(0);
    setWireframe(false);
    requestRenderRef.current?.();
  };

  if (webglUnavailable) {
    return (
      <div className="relative h-full min-h-[380px] overflow-hidden rounded-xl border border-[#242E42] bg-[#111722]">
        <img
          src={heroLabImg}
          alt="CoreXY 3D printer fabricating a mechanical planetary gear assembly"
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#090D14]/85 via-transparent to-transparent"
        />
        <div className="absolute inset-x-0 bottom-0 p-5">
          <p className="text-xs font-medium text-[#CBD5E1]">
            Enclosed CoreXY Chamber · Planetary Gear Prototype
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full min-h-[420px] w-full overflow-hidden rounded-xl border border-[#242E42] bg-[#0B1018] lg:min-h-[480px]">
      {/* Isolated WebGL Canvas Mount */}
      <div
        ref={mountRef}
        aria-label="Interactive 3D planetary gearbox prototype viewer. Drag to rotate and scroll to zoom."
        className="h-full w-full cursor-grab active:cursor-grabbing"
      />

      {/* Top-Left Minimal Static Spec Label (No Pulsing Dots, No Backdrop Blur) */}
      <div className="pointer-events-none absolute top-3.5 left-3.5 rounded-lg border border-[#242E42] bg-[#090D14]/90 px-3 py-1.5">
        <p className="font-mono text-xs font-medium text-[#E2E8F0]">
          Planetary Gearbox · Drag to Orbit · Scroll to Zoom
        </p>
      </div>

      {/* Unified Collapsible Bottom Control Dock (Zero Center Occlusion) */}
      <div className="pointer-events-none absolute inset-x-3 bottom-3 flex flex-col items-center">
        <button
          type="button"
          onClick={() => setDockOpen((prev) => !prev)}
          aria-expanded={dockOpen}
          className="pointer-events-auto inline-flex min-h-[32px] items-center gap-1.5 rounded-t-lg border border-b-0 border-[#2C384E] bg-[#090D14]/95 px-3 py-1 text-xs font-medium text-[#CBD5E1] transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F97316]"
        >
          {dockOpen ? (
            <>
              <ChevronDown className="h-3.5 w-3.5 text-[#F97316]" />
              Hide 3D Controls
            </>
          ) : (
            <>
              <ChevronUp className="h-3.5 w-3.5 text-[#F97316]" />
              Inspect 3D Part
            </>
          )}
        </button>

        {dockOpen && (
          <div className="pointer-events-auto w-full rounded-xl border border-[#2C384E] bg-[#090D14]/95 px-3.5 py-2.5 shadow-lg">
            <div className="flex flex-wrap items-center justify-between gap-3">
              {/* Polymer Material Swatches */}
              <div className="flex items-center gap-1.5" role="group" aria-label="3D Polymer Finish">
                {PRESET_LIST.map((item) => {
                  const active = polymer === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setPolymer(item.id)}
                      className={`min-h-[34px] rounded-md border px-2.5 py-1 text-xs font-semibold whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F97316] ${
                        active
                          ? 'border-[#F97316] bg-[#F97316] text-[#090D14]'
                          : 'border-[#242E42] bg-[#111722] text-[#CBD5E1] hover:border-[#475878] hover:text-white'
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>

              {/* Explode Slider */}
              <div className="flex min-w-[140px] flex-1 items-center gap-2.5 sm:max-w-[190px]">
                <label
                  htmlFor="explode-assembly-range"
                  className="font-mono text-xs text-[#94A3B8] whitespace-nowrap"
                >
                  Explode
                </label>
                <input
                  id="explode-assembly-range"
                  type="range"
                  min={0}
                  max={1}
                  step={0.02}
                  value={explode}
                  onChange={(e) => setExplode(Number(e.target.value))}
                  className="h-1.5 w-full cursor-pointer appearance-none rounded bg-[#242E42] accent-[#F97316]"
                />
              </div>

              {/* Action Toggles */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsSpinning((prev) => !prev)}
                  aria-label={isSpinning ? 'Pause gear rotation' : 'Spin gears'}
                  title={isSpinning ? 'Pause gear rotation' : 'Spin gears'}
                  className={`inline-flex h-8.5 items-center gap-1 rounded-md border px-2.5 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F97316] ${
                    isSpinning
                      ? 'border-[#38BDF8]/60 bg-[#38BDF8]/15 text-[#38BDF8]'
                      : 'border-[#242E42] bg-[#111722] text-[#CBD5E1] hover:text-white'
                  }`}
                >
                  {isSpinning ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                  <span className="hidden sm:inline">{isSpinning ? 'Spinning' : 'Spin'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setWireframe((prev) => !prev)}
                  aria-label="Toggle CAD edge wireframe"
                  title="Toggle CAD edge wireframe"
                  className={`inline-flex h-8.5 items-center gap-1 rounded-md border px-2.5 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F97316] ${
                    wireframe
                      ? 'border-[#38BDF8]/60 bg-[#38BDF8]/15 text-[#38BDF8]'
                      : 'border-[#242E42] bg-[#111722] text-[#CBD5E1] hover:text-white'
                  }`}
                >
                  <Grid3X3 className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Mesh</span>
                </button>

                <button
                  type="button"
                  onClick={handleResetView}
                  aria-label="Reset 3D camera view"
                  title="Reset 3D camera view"
                  className="inline-flex h-8.5 w-8.5 items-center justify-center rounded-md border border-[#242E42] bg-[#111722] text-[#CBD5E1] transition-colors hover:border-[#475878] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F97316]"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
