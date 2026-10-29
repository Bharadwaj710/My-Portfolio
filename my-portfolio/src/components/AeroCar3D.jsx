import React, { useRef, useMemo, useEffect, useState, Component, useCallback } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import AeroCar from "./AeroCar";

/**
 * CONFIG OBJECT - ALL TUNABLE SIMULATION AND VISUAL PARAMETERS
 * Tweak these numbers to adjust layout, physics, particle density, aesthetics, and timing.
 */
// eslint-disable-next-line react-refresh/only-export-components
export const CONFIG = {
  // --- Layout & Camera Framing ---
  carWidthFraction: 0.54, // Fraction of visual box width occupied by the car (50-55%)
  carCenterU: 0.53, // Normalized horizontal center of car (slightly right of center)
  maskFadeLeft: 0.20, // 20% left edge CSS mask-image fade
  maskFadeRight: 0.10, // 10% right edge CSS mask-image fade

  // --- Simulation Grid & Field Dimensions ---
  gridWidth: 256, // Grid resolution width for offscreen mask & flow maps
  wakeLength: 56, // Number of grid cells downstream over which wake decays
  wakeBlurRadius: 4, // Kernel radius for vertical wake box-blur widening
  deflectRadius: 18, // Surface deflection radius in grid cells (Gaussian decay)
  nearBodySpeedup: 0.22, // Velocity multiplier boost along body surface
  wakeSlowdown: 0.46, // Velocity reduction factor inside the wake zone
  turbulence: 0.35, // Vertical turbulence intensity in the wake
  pushRadius: 3.2, // Minimum distance in grid cells to repel particles from surface
  bypassStrength: 0.75, // Upward/downward flow splitting strength at the nose

  // --- Airspeed & Scale-Model Physics ---
  refSpeed: 280, // Reference airspeed (km/h) for base velocity normalization
  baseSpeedMean: 260, // Baseline airspeed center (km/h)
  speedSineAmp1: 55, // Primary airspeed sine wave amplitude (km/h)
  speedSinePeriod1: 16.0, // Primary airspeed sine period (seconds)
  speedSineAmp2: 6, // Secondary airspeed sine wave amplitude (km/h)
  speedSinePeriod2: 3.7, // Secondary airspeed sine period (seconds)
  dragCoeff: 0.0067, // Illustrative drag coefficient (F_drag = dragCoeff * v^2 N)
  downforceCoeff: 0.0454, // Illustrative downforce coefficient (F_down = downforceCoeff * v^2 N)
  smoothingTau: 0.16, // Exponential easing time constant for readouts (seconds)

  // --- Flow Particles & Advection ---
  baseParticleCount: 160, // Nominal particle count at 1440px wide viewport
  minParticleCount: 80, // Floor particle count when adaptive quality throttles
  trailLength: 14, // Number of points in each particle's fading trail ring buffer
  stepSize: 1.15, // Maximum step length per frame in CSS pixels
  yBandSpawnRatio: 0.60, // Fraction of particles spawned within car vertical band (60%)
  yBandMargin: 0.08, // Padding fraction above/below car bounding box for spawning
  minParticleAge: 120, // Minimum particle lifetime in frames
  maxParticleAge: 230, // Maximum particle lifetime in frames

  // --- Direction Arrows ---
  arrowCount: 24, // Number of drifting directional arrow markers (reduced to 24)
  arrowMinLength: 10, // Arrow shaft length (px) at lower local velocities
  arrowMaxLength: 18, // Arrow shaft length (px) at higher local velocities
  arrowHeadSize: 3.5, // Arrow chevron head barb length (px)
  arrowAlpha: 0.45, // Peak opacity for directional arrows

  // --- Speed-to-Color HSL Palette (Muted, Non-Neon) ---
  hueWake: 18, // Warm red/orange hue for wake slowdown
  hueFreeStream: 172, // Dim teal hue for free stream
  hueAccelerated: 84, // Yellow-green hue for near-body accelerated flow
  baseAlpha: 0.25, // Base trail opacity far from body
  bodyAlphaBoost: 0.35, // Additional opacity near body surface (up to 0.60)

  // --- Sensor Pins & Pipeline Fractions ---
  pinAFrac: { x: 0.06, y: 0.88 }, // Front wing: (x0 + 0.06w, y1 - 0.12h)
  pinBFrac: { x: 0.50, y: 0.82 }, // Floor center: (x0 + 0.50w, y1 - 0.18h)
  pinCFrac: { x: 0.90, y: 0.12 }, // Rear wing top: (x0 + 0.90w, y0 + 0.12h)
  cycleDuration: 6.0, // 6.0s full pipeline stage cycle

  // --- Debug Mode ---
  debug: false, // Set true to render mask outline, normals, and wake field for verification
};

/**
 * Error boundary fallback to 2D SVG AeroCar
 */
class ModelErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.warn("AeroCar3D simulation failed, falling back to SVG:", error);
    if (this.props.onError) this.props.onError();
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

/**
 * Bilinear sampling of a 2D scalar field on a W x H grid with normalized (u, v)
 */
function sampleField(u, v, field, W, H) {
  const gx = Math.max(0, Math.min(W - 1, u * (W - 1)));
  const gy = Math.max(0, Math.min(H - 1, v * (H - 1)));
  const x0 = Math.floor(gx);
  const x1 = Math.min(W - 1, x0 + 1);
  const y0 = Math.floor(gy);
  const y1 = Math.min(H - 1, y0 + 1);
  const fx = gx - x0;
  const fy = gy - y0;

  const v00 = field[y0 * W + x0];
  const v10 = field[y0 * W + x1];
  const v01 = field[y1 * W + x0];
  const v11 = field[y1 * W + x1];

  return (
    (1 - fx) * (1 - fy) * v00 +
    fx * (1 - fy) * v10 +
    (1 - fx) * fy * v01 +
    fx * fy * v11
  );
}

/**
 * Nearest-neighbor sampling of binary mask (1 = solid, 0 = empty)
 */
function sampleMask(u, v, mask, W, H) {
  if (u < 0 || u > 1 || v < 0 || v > 1) return 0;
  const x = Math.max(0, Math.min(W - 1, Math.round(u * (W - 1))));
  const y = Math.max(0, Math.min(H - 1, Math.round(v * (H - 1))));
  return mask[y * W + x] === 1 ? 1 : 0;
}

/**
 * Task 1 & 2: Static Wireframe 3D Car Model + Offscreen Silhouette Mask Extraction
 */
function StaticWireframeCar({ onMaskReady, onError }) {
  const { scene: gltfScene } = useGLTF("/models/f1.glb");
  const { gl, camera, scene, size } = useThree();
  const maskComputedRef = useRef(false);
  const lastAspectRef = useRef(0);

  // Prepare model geometry, edges, and materials once
  const { modelGroup, cleanup, modelWidth, lineSegmentsList } = useMemo(() => {
    const cloned = gltfScene.clone(true);

    // 1. Center cloned model at its local origin first
    const rawBox = new THREE.Box3().setFromObject(cloned);
    const rawCenter = new THREE.Vector3();
    rawBox.getCenter(rawCenter);
    cloned.position.set(-rawCenter.x, -rawCenter.y, -rawCenter.z);

    // 2. Put in group with pure side-profile rotation: nose on left (-X), rear on right (+X)
    const group = new THREE.Group();
    group.rotation.set(0, -Math.PI / 2, 0);
    group.add(cloned);
    group.position.set(0, 0, 0);
    group.updateMatrixWorld(true);

    // 3. Measure bounding box in group/camera space
    const worldBox = new THREE.Box3().setFromObject(group);
    const worldSize = new THREE.Vector3();
    worldBox.getSize(worldSize);

    // Solid near-black occluder material with polygonOffset
    const occluderMat = new THREE.MeshBasicMaterial({
      color: 0x08080a,
      polygonOffset: true,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1,
      depthTest: true,
      depthWrite: true,
    });

    // White edge-lines at 0.6 opacity
    const lineMat = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.6,
      depthTest: true,
      depthWrite: false,
    });

    const lines = [];
    const edgeGeoms = [];

    cloned.traverse((child) => {
      if (child.isMesh && child.geometry) {
        const edges = new THREE.EdgesGeometry(child.geometry, 25);
        edgeGeoms.push(edges);
        const lineSegs = new THREE.LineSegments(edges, lineMat);
        child.material = occluderMat;
        child.add(lineSegs);
        lines.push(lineSegs);
      }
    });

    return {
      modelGroup: group,
      modelWidth: worldSize.x || 100,
      lineSegmentsList: lines,
      cleanup: () => {
        edgeGeoms.forEach((g) => g.dispose());
        occluderMat.dispose();
        lineMat.dispose();
      },
    };
  }, [gltfScene]);

  useEffect(() => () => cleanup(), [cleanup]);

  // Configure orthographic camera framing: car spans 50-55% of box width, slightly right of center
  const updateCamera = useCallback(() => {
    if (!size.width || !size.height) return;
    const aspect = size.width / size.height;

    // Frustum width calculated so car occupies CONFIG.carWidthFraction of the box
    const frustumWidth = modelWidth / CONFIG.carWidthFraction;
    const frustumHeight = frustumWidth / aspect;

    // Horizontal placement: car centered at CONFIG.carCenterU (slightly right of center)
    camera.left = -frustumWidth * CONFIG.carCenterU;
    camera.right = frustumWidth * (1 - CONFIG.carCenterU);
    camera.top = frustumHeight / 2;
    camera.bottom = -frustumHeight / 2;
    camera.near = 0.1;
    camera.far = 1000;
    camera.position.set(0, 0, 100);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  }, [camera, size.width, size.height, modelWidth]);

  // Compute silhouette mask and flow-field maps
  const generateFlowMaps = useCallback(() => {
    if (!size.width || !size.height) return;
    const aspect = size.width / size.height;
    updateCamera();

    const W = CONFIG.gridWidth;
    const H = Math.max(32, Math.round(W / aspect));

    let renderTarget;
    let whiteMat;
    try {
      renderTarget = new THREE.WebGLRenderTarget(W, H, {
        minFilter: THREE.NearestFilter,
        magFilter: THREE.NearestFilter,
        format: THREE.RGBAFormat,
        type: THREE.UnsignedByteType,
      });

      whiteMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

      // Temporarily switch all meshes to solid white material
      const originalMaterials = new Map();
      modelGroup.traverse((child) => {
        if (child.isMesh) {
          originalMaterials.set(child, child.material);
          child.material = whiteMat;
        }
      });

      // Temporarily hide wireframe edge lines
      lineSegmentsList.forEach((line) => {
        line.visible = false;
      });

      const oldClearColor = new THREE.Color();
      const oldClearAlpha = gl.getClearAlpha();
      gl.getClearColor(oldClearColor);

      gl.setClearColor(0x000000, 1);
      gl.setRenderTarget(renderTarget);
      gl.clear(true, true, true);
      gl.render(scene, camera);

      const pixels = new Uint8Array(W * H * 4);
      gl.readRenderTargetPixels(renderTarget, 0, 0, W, H, pixels);
      gl.setRenderTarget(null);

      // Restore normal rendering state
      originalMaterials.forEach((mat, mesh) => {
        mesh.material = mat;
      });
      gl.setClearColor(oldClearColor, oldClearAlpha);
      lineSegmentsList.forEach((line) => {
        line.visible = true;
      });

      // Extract binary solid/empty grid (flip Y from WebGL bottom-left to Canvas top-left)
      const mask = new Uint8Array(W * H);
      let minX = W,
        maxX = 0,
        minY = H,
        maxY = 0;
      let solidCount = 0;

      for (let y = 0; y < H; y++) {
        const webglY = H - 1 - y;
        for (let x = 0; x < W; x++) {
          const pIdx = (webglY * W + x) * 4;
          const isSolid = pixels[pIdx] > 100 ? 1 : 0;
          mask[y * W + x] = isSolid;
          if (isSolid) {
            solidCount++;
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          }
        }
      }

      if (solidCount < 10) {
        throw new Error("Silhouette render produced insufficient solid cells");
      }

      // Compute Chamfer Distance Transform d (two-pass)
      const dist = new Float32Array(W * H);
      const INF = 1e6;
      for (let i = 0; i < W * H; i++) {
        dist[i] = mask[i] === 1 ? 0 : INF;
      }

      const SQRT2 = 1.41421356;
      // Pass 1: Forward (top-to-bottom, left-to-right)
      for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
          const idx = y * W + x;
          let d = dist[idx];
          if (x > 0) d = Math.min(d, dist[idx - 1] + 1);
          if (y > 0) {
            d = Math.min(d, dist[idx - W] + 1);
            if (x > 0) d = Math.min(d, dist[idx - W - 1] + SQRT2);
            if (x < W - 1) d = Math.min(d, dist[idx - W + 1] + SQRT2);
          }
          dist[idx] = d;
        }
      }
      // Pass 2: Backward (bottom-to-top, right-to-left)
      for (let y = H - 1; y >= 0; y--) {
        for (let x = W - 1; x >= 0; x--) {
          const idx = y * W + x;
          let d = dist[idx];
          if (x < W - 1) d = Math.min(d, dist[idx + 1] + 1);
          if (y < H - 1) {
            d = Math.min(d, dist[idx + W] + 1);
            if (x < W - 1) d = Math.min(d, dist[idx + W + 1] + SQRT2);
            if (x > 0) d = Math.min(d, dist[idx + W - 1] + SQRT2);
          }
          dist[idx] = d;
        }
      }

      // Outward unit normal (nx, ny) = normalized gradient of d, lightly smoothed
      const rawNx = new Float32Array(W * H);
      const rawNy = new Float32Array(W * H);
      for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
          const idx = y * W + x;
          const xLeft = x > 0 ? dist[idx - 1] : dist[idx];
          const xRight = x < W - 1 ? dist[idx + 1] : dist[idx];
          const yTop = y > 0 ? dist[idx - W] : dist[idx];
          const yBottom = y < H - 1 ? dist[idx + W] : dist[idx];
          rawNx[idx] = (xRight - xLeft) * 0.5;
          rawNy[idx] = (yBottom - yTop) * 0.5;
        }
      }

      const normX = new Float32Array(W * H);
      const normY = new Float32Array(W * H);
      for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
          let sx = 0,
            sy = 0,
            count = 0;
          for (let dy = -1; dy <= 1; dy++) {
            const nyIdx = y + dy;
            if (nyIdx < 0 || nyIdx >= H) continue;
            for (let dx = -1; dx <= 1; dx++) {
              const nxIdx = x + dx;
              if (nxIdx < 0 || nxIdx >= W) continue;
              const sIdx = nyIdx * W + nxIdx;
              sx += rawNx[sIdx];
              sy += rawNy[sIdx];
              count++;
            }
          }
          sx /= count;
          sy /= count;
          const len = Math.hypot(sx, sy);
          const idx = y * W + x;
          if (len > 1e-4) {
            normX[idx] = sx / len;
            normY[idx] = sy / len;
          } else {
            normX[idx] = 0;
            normY[idx] = 0;
          }
        }
      }

      // Compute wake map: left-to-right downstream raycast decay + 4-cell vertical box blur
      const rawWake = new Float32Array(W * H);
      for (let y = 0; y < H; y++) {
        let seenSolid = false;
        let distanceSinceSolid = 999999;
        for (let x = 0; x < W; x++) {
          const idx = y * W + x;
          if (mask[idx] === 1) {
            seenSolid = true;
            distanceSinceSolid = 0;
            rawWake[idx] = 0;
          } else if (seenSolid) {
            distanceSinceSolid += 1;
            rawWake[idx] = Math.max(0, 1 - distanceSinceSolid / CONFIG.wakeLength);
          } else {
            rawWake[idx] = 0;
          }
        }
      }

      const wakeMap = new Float32Array(W * H);
      const blurR = CONFIG.wakeBlurRadius;
      for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
          let sum = 0,
            count = 0;
          for (let dy = -blurR; dy <= blurR; dy++) {
            const ny = y + dy;
            if (ny >= 0 && ny < H) {
              sum += rawWake[ny * W + x];
              count++;
            }
          }
          wakeMap[y * W + x] = sum / count;
        }
      }

      // Solid bounding box in normalized [0, 1] coordinates
      const bbox = {
        xMin: minX,
        xMax: maxX,
        yMin: minY,
        yMax: maxY,
        uMin: minX / W,
        uMax: maxX / W,
        vMin: minY / H,
        vMax: maxY / H,
      };

      onMaskReady({
        mask,
        dist,
        normX,
        normY,
        wakeMap,
        bbox,
        W,
        H,
        aspect,
      });

      // Render 3D visible wireframe car to canvas
      gl.render(scene, camera);
    } catch (err) {
      if (onError) onError(err);
    } finally {
      if (whiteMat) whiteMat.dispose();
      if (renderTarget) renderTarget.dispose();
    }
  }, [
    size.width,
    size.height,
    updateCamera,
    modelGroup,
    gl,
    camera,
    scene,
    lineSegmentsList,
    onMaskReady,
    onError,
  ]);

  // Compute on mount and debounced resize
  useFrame(() => {
    if (!size.width || !size.height) return;
    const aspect = size.width / size.height;
    if (!maskComputedRef.current || Math.abs(aspect - lastAspectRef.current) > 0.015) {
      maskComputedRef.current = true;
      lastAspectRef.current = aspect;
      generateFlowMaps();
    }
  });

  return <primitive object={modelGroup} />;
}

/**
 * Main Exported AeroCar3D Component
 */
export default function AeroCar3D() {
  const containerRef = useRef(null);
  const flowCanvasRef = useRef(null);

  // Pipeline DOM text refs (updated at ~10 fps via refs, NOT React state)
  const teleValRef = useRef(null);
  const modelValRef = useRef(null);
  const predValRef = useRef(null);
  const pinCLabelRef = useRef(null);

  // Pipeline stage active indicators & pulse rings
  const stageTeleRef = useRef(null);
  const stageFeatRef = useRef(null);
  const stageModelRef = useRef(null);
  const stagePredRef = useRef(null);
  const travelingDotRef = useRef(null);
  const teleActiveDotRef = useRef(null);

  const ringARef = useRef(null);
  const ringBRef = useRef(null);
  const ringCRef = useRef(null);

  const [hasError, setHasError] = useState(false);
  const [inView, setInView] = useState(true);
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);
  const [pinsData, setPinsData] = useState(null);

  // Holds precomputed maps from Task 2
  const mapsRef = useRef(null);

  // Performance & adaptive quality state
  const frameTimesRef = useRef([]);
  const throttledRef = useRef(false);
  const activeParticleCountRef = useRef(CONFIG.baseParticleCount);

  // IntersectionObserver to pause rendering when hero is off-screen
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      { threshold: 0.05 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // prefers-reduced-motion check
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setShouldReduceMotion(mql.matches);
    const handler = (e) => setShouldReduceMotion(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  // Receive computed flow maps from StaticWireframeCar & calculate sensor pin anchors
  const handleMaskReady = useCallback((maps) => {
    mapsRef.current = maps;

    if (flowCanvasRef.current) {
      const rect = flowCanvasRef.current.getBoundingClientRect();
      const W = rect.width;
      const H = rect.height;

      const x0 = maps.bbox.uMin * W;
      const x1 = maps.bbox.uMax * W;
      const y0 = maps.bbox.vMin * H;
      const y1 = maps.bbox.vMax * H;
      const w = x1 - x0;
      const h = y1 - y0;

      // Pin coordinates from Task 3
      const pinA = { x: x0 + CONFIG.pinAFrac.x * w, y: y1 - (1 - CONFIG.pinAFrac.y) * h };
      const pinB = { x: x0 + CONFIG.pinBFrac.x * w, y: y1 - (1 - CONFIG.pinBFrac.y) * h };
      const pinC = { x: x0 + CONFIG.pinCFrac.x * w, y: y0 + CONFIG.pinCFrac.y * h };

      setPinsData({ pinA, pinB, pinC });
    }
  }, []);

  const handleError = useCallback((err) => {
    console.warn("Aero flow model error:", err);
    setHasError(true);
  }, []);

  // Tasks 2, 3, 4, 6: Flow simulation, particles, arrows, and rAF animation loop
  useEffect(() => {
    if (hasError || !flowCanvasRef.current) return;
    const canvas = flowCanvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId = null;
    let isDocumentVisible = !document.hidden;

    const onVisibilityChange = () => {
      isDocumentVisible = !document.hidden;
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    // Resize canvas with DPR capped at 1.5
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = Math.round(rect.width * dpr);
      const h = Math.round(rect.height * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      return { cssWidth: rect.width, cssHeight: rect.height, dpr };
    };

    let { cssWidth, cssHeight, dpr } = resizeCanvas();

    // Scale particle count with width (~160 at nominal width)
    const targetCount = Math.round(
      CONFIG.baseParticleCount * Math.min(1.4, Math.max(0.7, cssWidth / 680))
    );
    activeParticleCountRef.current = throttledRef.current
      ? Math.max(CONFIG.minParticleCount, Math.round(targetCount * 0.6))
      : targetCount;

    // Initialize Flow Particle Pool
    const MAX_P = 300;
    const particles = [];
    const createParticle = (spawnUniform = false, initialProgress = 0) => {
      const maps = mapsRef.current;
      let v;
      // 60% within car's vertical band, 40% uniform (Task 2)
      if (!spawnUniform && maps && Math.random() < CONFIG.yBandSpawnRatio) {
        const vBand = maps.bbox.vMax - maps.bbox.vMin;
        v = maps.bbox.vMin - CONFIG.yBandMargin + Math.random() * (vBand + 2 * CONFIG.yBandMargin);
      } else {
        v = Math.random();
      }
      const u = initialProgress > 0 ? initialProgress : Math.random() * 0.02;
      const maxAge = Math.round(
        CONFIG.minParticleAge + Math.random() * (CONFIG.maxParticleAge - CONFIG.minParticleAge)
      );

      // Pre-allocate trail ring buffer of 14 points
      const trail = new Float32Array(CONFIG.trailLength * 2);
      for (let i = 0; i < CONFIG.trailLength; i++) {
        trail[i * 2] = u;
        trail[i * 2 + 1] = v;
      }

      return {
        u,
        v,
        age: initialProgress > 0 ? Math.floor(Math.random() * maxAge) : 0,
        maxAge,
        trail,
        head: 0,
        speedRatio: 1.0,
        weight: 0,
      };
    };

    // Pre-populate particles spread across width initially
    for (let i = 0; i < MAX_P; i++) {
      particles.push(createParticle(Math.random() < 0.4, Math.random() * 0.98));
    }

    // Initialize Direction Arrows (~24 arrow markers, Task 2)
    const arrows = [];
    const createArrow = (initialU = null) => {
      const maps = mapsRef.current;
      let u, v;
      if (maps) {
        u =
          initialU !== null
            ? initialU
            : maps.bbox.uMin - 0.12 + Math.random() * (maps.bbox.uMax - maps.bbox.uMin + 0.28);
        const vSpan = maps.bbox.vMax - maps.bbox.vMin;
        v = maps.bbox.vMin - 0.15 + Math.random() * (vSpan + 0.30);
      } else {
        u = initialU !== null ? initialU : Math.random();
        v = Math.random();
      }
      return {
        u,
        v,
        age: 0,
        maxAge: Math.round(90 + Math.random() * 110),
        vx: 1,
        vy: 0,
        speed: 1,
      };
    };

    for (let i = 0; i < CONFIG.arrowCount; i++) {
      arrows.push(createArrow(Math.random() * 0.95));
    }

    // Velocity field evaluation at (u, v, t) with stagnation fix & flow splitting
    const evaluateVelocity = (u, v, t, U) => {
      const maps = mapsRef.current;
      if (!maps) return { vx: U, vy: 0, s: 1, w: 0, d: 99, nx: 0, ny: 0 };

      const d = sampleField(u, v, maps.dist, maps.W, maps.H);
      const nx = sampleField(u, v, maps.normX, maps.W, maps.H);
      const ny = sampleField(u, v, maps.normY, maps.W, maps.H);
      const wake = sampleField(u, v, maps.wakeMap, maps.W, maps.H);

      // Deflection weight w = exp(-(d / deflectRadius)^2)
      const w = Math.exp(-Math.pow(d / CONFIG.deflectRadius, 2));

      // Subtract normal component so air slides along surface: vel = base - (base . n) * n * w
      const baseDotN = U * nx;
      let vx = U - baseDotN * nx * w;
      let vy = -baseDotN * ny * w;

      // Leading-edge stagnation fix: split incoming flow cleanly above and below nose
      const vSplit = maps.bbox.vMin + (maps.bbox.vMax - maps.bbox.vMin) * 0.58;
      if (u < maps.bbox.uMin + 0.14 && nx < -0.1) {
        const splitDir = v < vSplit ? -1 : 1;
        const bypass = Math.abs(nx) * w * U * CONFIG.bypassStrength;
        vy += splitDir * bypass;
        vx = Math.max(vx, U * 0.45); // ensure air never stagnates or stalls at nose
      }

      // Near-body speedup along roof, engine cover, floor
      const speedup = 1 + CONFIG.nearBodySpeedup * w;
      vx *= speedup;
      vy *= speedup;

      // Wake slowdown
      vx *= 1 - CONFIG.wakeSlowdown * wake;

      // Cheap sum of sines turbulence in the wake (no noise library)
      const noise =
        Math.sin(18 * u + 4 * t) +
        0.5 * Math.sin(37 * v - 6 * t) +
        0.35 * Math.sin(23 * (u + v) + 8 * t);
      vy += CONFIG.turbulence * wake * noise * U;

      const speed = Math.hypot(vx, vy);
      const s = speed / (U || 1);

      return { vx, vy, s, w, d, nx, ny };
    };

    // State variables for physics & readout smoothing
    let simTime = 0;
    let lastTimestamp = performance.now();
    let lastDomUpdate = 0;
    let dispSpeed = 285;
    let dispDrag = 544;
    let dispDownforce = 3688;
    let lastCycleIdx = -1;
    let currentInferenceMs = 12;

    // Simulation single-step function
    const simulateStep = (dt) => {
      simTime += dt;

      // Cycle timing in [0, 6.0] seconds
      const tCycle = simTime % CONFIG.cycleDuration;
      const cycleIdx = Math.floor(simTime / CONFIG.cycleDuration);
      if (cycleIdx !== lastCycleIdx) {
        lastCycleIdx = cycleIdx;
        // Jitter inference time (11 to 14 ms, updated once per cycle)
        currentInferenceMs = 11 + Math.floor(Math.random() * 4);
      }

      // Task 5 Airspeed formula: v(t) = 260 + 55*sin(2*pi*t/16) + 6*sin(2*pi*t/3.7)
      const airspeed =
        CONFIG.baseSpeedMean +
        CONFIG.speedSineAmp1 * Math.sin((2 * Math.PI * simTime) / CONFIG.speedSinePeriod1) +
        CONFIG.speedSineAmp2 * Math.sin((2 * Math.PI * simTime) / CONFIG.speedSinePeriod2);

      const U = airspeed / CONFIG.refSpeed;

      // Target drag & downforce
      const targetDrag = CONFIG.dragCoeff * Math.pow(airspeed, 2);
      const targetDownforce = CONFIG.downforceCoeff * Math.pow(airspeed, 2);

      // In prediction phase (3.8 to 5.0 s), ease displayed values to targets
      const alphaE = 1 - Math.exp(-dt / CONFIG.smoothingTau);
      dispSpeed += (airspeed - dispSpeed) * alphaE;
      dispDrag += (targetDrag - dispDrag) * alphaE;
      dispDownforce += (targetDownforce - dispDownforce) * alphaE;

      // Update DOM readouts & Pipeline Strip through refs at ~10 fps
      const now = performance.now();
      if (now - lastDomUpdate >= 95) {
        lastDomUpdate = now;

        // Pipeline stage activity
        // 0.0-2.2s: telemetry | 2.2-3.0s: features | 3.0-3.8s: model | 3.8-5.0s: prediction | 5.0-6.0s: idle
        const isTele = tCycle >= 0.0 && tCycle < 2.2;
        const isFeat = tCycle >= 2.2 && tCycle < 3.0;
        const isModel = tCycle >= 3.0 && tCycle < 3.8;
        const isPred = tCycle >= 3.8 && tCycle < 5.0;

        if (stageTeleRef.current) stageTeleRef.current.style.opacity = isTele ? "0.95" : "0.45";
        if (stageFeatRef.current) stageFeatRef.current.style.opacity = isFeat ? "0.95" : "0.45";
        if (stageModelRef.current) stageModelRef.current.style.opacity = isModel ? "0.95" : "0.45";
        if (stagePredRef.current) stagePredRef.current.style.opacity = isPred ? "0.95" : "0.45";

        if (teleActiveDotRef.current) {
          teleActiveDotRef.current.style.opacity = isTele ? "1" : "0";
        }

        // Traveling dot along connector line
        if (travelingDotRef.current) {
          if (isFeat) {
            const p = (tCycle - 2.2) / 0.8;
            travelingDotRef.current.style.left = `${18 + p * 28}%`;
            travelingDotRef.current.style.opacity = "0.9";
          } else if (isModel) {
            const p = (tCycle - 3.0) / 0.8;
            travelingDotRef.current.style.left = `${46 + p * 26}%`;
            travelingDotRef.current.style.opacity = "0.9";
          } else if (isPred) {
            travelingDotRef.current.style.left = "74%";
            travelingDotRef.current.style.opacity = "0.9";
          } else {
            travelingDotRef.current.style.opacity = "0";
          }
        }

        // Readout text rows
        if (teleValRef.current) teleValRef.current.textContent = `v ${Math.round(dispSpeed)} km/h`;
        if (modelValRef.current) modelValRef.current.textContent = `inference ${currentInferenceMs} ms`;
        if (predValRef.current) {
          predValRef.current.textContent = `drag ${Math.round(dispDrag)} N · downforce ${Math.round(dispDownforce).toLocaleString()} N`;
        }

        // Sensor Pin C drifting confidence text
        if (pinCLabelRef.current) {
          const conf = (0.915 + 0.025 * Math.sin(simTime * 0.38)).toFixed(2);
          pinCLabelRef.current.textContent = `wake probe · conf ${conf}`;
        }

        // Task 3: Expanding pulse rings for Pins A, B, C
        if (ringARef.current) {
          if (tCycle >= 0.0 && tCycle < 0.7) {
            const prog = tCycle / 0.7;
            ringARef.current.setAttribute("r", (3 + 11 * prog).toFixed(1));
            ringARef.current.setAttribute("opacity", (0.5 * (1 - prog)).toFixed(2));
          } else {
            ringARef.current.setAttribute("opacity", "0");
          }
        }
        if (ringBRef.current) {
          if (tCycle >= 0.8 && tCycle < 1.5) {
            const prog = (tCycle - 0.8) / 0.7;
            ringBRef.current.setAttribute("r", (3 + 11 * prog).toFixed(1));
            ringBRef.current.setAttribute("opacity", (0.5 * (1 - prog)).toFixed(2));
          } else {
            ringBRef.current.setAttribute("opacity", "0");
          }
        }
        if (ringCRef.current) {
          if (tCycle >= 1.6 && tCycle < 2.3) {
            const prog = (tCycle - 1.6) / 0.7;
            ringCRef.current.setAttribute("r", (3 + 11 * prog).toFixed(1));
            ringCRef.current.setAttribute("opacity", (0.5 * (1 - prog)).toFixed(2));
          } else {
            ringCRef.current.setAttribute("opacity", "0");
          }
        }
      }

      // Advect Flow Particles (NEVER kill merely for coming near body, Task 2)
      const maps = mapsRef.current;
      const activePCount = activeParticleCountRef.current;
      for (let i = 0; i < activePCount; i++) {
        const p = particles[i];
        p.age++;

        const flow = evaluateVelocity(p.u, p.v, simTime, U);
        p.speedRatio = flow.s;
        p.weight = flow.w;

        // Step advection (at most ~1 CSS px per step)
        const stepX = flow.vx * CONFIG.stepSize;
        const stepY = flow.vy * CONFIG.stepSize;

        p.u += stepX / cssWidth;
        p.v += stepY / cssHeight;

        // Push outward along normal if close to body (Task 2)
        if (flow.d < CONFIG.pushRadius) {
          const pushDist = (CONFIG.pushRadius - flow.d) * 0.75;
          if (flow.nx < -0.1 && maps && p.u < maps.bbox.uMin + 0.05) {
            // Divert vertically at the nose
            const vSplit = maps.bbox.vMin + (maps.bbox.vMax - maps.bbox.vMin) * 0.58;
            p.v += ((p.v < vSplit ? -1 : 1) * pushDist * 1.2) / cssHeight;
          } else {
            p.u += (flow.nx * pushDist) / cssWidth;
            p.v += (flow.ny * pushDist) / cssHeight;
          }
        }

        // Store into trail ring buffer
        p.head = (p.head + 1) % CONFIG.trailLength;
        p.trail[p.head * 2] = p.u;
        p.trail[p.head * 2 + 1] = p.v;

        // Task 2: Respawn ONLY on solid cell entry, leaving box, or age (never near-solid)
        const isSolid = maps ? sampleMask(p.u, p.v, maps.mask, maps.W, maps.H) : 0;
        if (
          isSolid === 1 ||
          p.u > 1.02 ||
          p.u < -0.02 ||
          p.v > 1.02 ||
          p.v < -0.02 ||
          p.age >= p.maxAge
        ) {
          const respawned = createParticle(Math.random() < 0.4);
          p.u = respawned.u;
          p.v = respawned.v;
          p.age = 0;
          p.maxAge = respawned.maxAge;
          p.head = 0;
          for (let k = 0; k < CONFIG.trailLength; k++) {
            p.trail[k * 2] = p.u;
            p.trail[k * 2 + 1] = p.v;
          }
        }
      }

      // Advect Direction Arrows (~24 arrow markers)
      for (let i = 0; i < arrows.length; i++) {
        const a = arrows[i];
        a.age++;

        const flow = evaluateVelocity(a.u, a.v, simTime, U);
        a.vx = flow.vx;
        a.vy = flow.vy;
        a.speed = flow.s;

        a.u += (flow.vx * CONFIG.stepSize * 0.9) / cssWidth;
        a.v += (flow.vy * CONFIG.stepSize * 0.9) / cssHeight;

        if (flow.d < CONFIG.pushRadius) {
          a.u += (flow.nx * 0.8) / cssWidth;
          a.v += (flow.ny * 0.8) / cssHeight;
        }

        const isSolid = maps ? sampleMask(a.u, a.v, maps.mask, maps.W, maps.H) : 0;
        if (isSolid === 1 || a.u > 1.02 || a.u < -0.02 || a.v > 1.02 || a.v < -0.02 || a.age >= a.maxAge) {
          const fresh = createArrow(Math.random() * 0.15);
          a.u = fresh.u;
          a.v = fresh.v;
          a.age = 0;
          a.maxAge = fresh.maxAge;
        }
      }
    };

    // Render frame to Canvas 2D
    const renderFrame = () => {
      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, cssWidth, cssHeight);

      // Task 2: Debug overlay when CONFIG.debug is true
      if (CONFIG.debug && mapsRef.current) {
        const maps = mapsRef.current;
        // Draw wake map as subtle purple wash
        ctx.fillStyle = "rgba(168, 85, 247, 0.15)";
        for (let gy = 0; gy < maps.H; gy += 4) {
          for (let gx = 0; gx < maps.W; gx += 4) {
            const wVal = maps.wakeMap[gy * maps.W + gx];
            if (wVal > 0.05) {
              ctx.fillRect((gx / maps.W) * cssWidth, (gy / maps.H) * cssHeight, 4, 4);
            }
          }
        }
        // Draw mask boundary outline in lime green
        ctx.strokeStyle = "rgba(74, 222, 128, 0.8)";
        ctx.lineWidth = 1;
        for (let gy = 1; gy < maps.H - 1; gy += 2) {
          for (let gx = 1; gx < maps.W - 1; gx += 2) {
            if (maps.mask[gy * maps.W + gx] === 1 && maps.dist[gy * maps.W + gx] <= 1) {
              ctx.strokeRect((gx / maps.W) * cssWidth, (gy / maps.H) * cssHeight, 1.5, 1.5);
            }
          }
        }
      }

      // Task 2: Draw Particles with Trail Ring Buffer
      // globalCompositeOperation "lighter" for soft muted glow
      ctx.globalCompositeOperation = "lighter";

      const activePCount = activeParticleCountRef.current;
      for (let i = 0; i < activePCount; i++) {
        const p = particles[i];

        // Color mapping by speed ratio (Task 2):
        // wake = warm red/orange (18), near-body accelerated = yellow-green (84), free stream = dim teal (172)
        let hue;
        if (p.speedRatio < 0.95) {
          const t = Math.max(0, (p.speedRatio - 0.45) / 0.50);
          hue = Math.round(CONFIG.hueWake + t * (CONFIG.hueFreeStream - CONFIG.hueWake));
        } else if (p.speedRatio > 1.05) {
          const t = Math.min(1, (p.speedRatio - 1.05) / 0.28);
          hue = Math.round(CONFIG.hueFreeStream - t * (CONFIG.hueFreeStream - CONFIG.hueAccelerated));
        } else {
          hue = CONFIG.hueFreeStream;
        }

        const alphaPeak = CONFIG.baseAlpha + CONFIG.bodyAlphaBoost * p.weight;

        // Draw trail segments fading from tail alpha to head alpha
        for (let j = 0; j < CONFIG.trailLength - 1; j++) {
          const idxA = (p.head - (CONFIG.trailLength - 1 - j) + CONFIG.trailLength * 2) % CONFIG.trailLength;
          const idxB = (idxA + 1) % CONFIG.trailLength;

          const uA = p.trail[idxA * 2];
          const vA = p.trail[idxA * 2 + 1];
          const uB = p.trail[idxB * 2];
          const vB = p.trail[idxB * 2 + 1];

          // Skip if wrapping respawn
          if (Math.abs(uB - uA) > 0.15 || Math.abs(vB - vA) > 0.15) continue;

          const segAlpha = alphaPeak * ((j + 1) / CONFIG.trailLength);

          ctx.strokeStyle = `hsla(${hue}, 80%, 58%, ${segAlpha.toFixed(3)})`;
          ctx.lineWidth = 1.25;
          ctx.beginPath();
          ctx.moveTo(uA * cssWidth, vA * cssHeight);
          ctx.lineTo(uB * cssWidth, vB * cssHeight);
          ctx.stroke();
        }
      }

      // Task 2: Draw Direction Arrows (~24 small arrow particles)
      ctx.globalCompositeOperation = "source-over";
      for (let i = 0; i < arrows.length; i++) {
        const a = arrows[i];
        const lifeRatio = a.age / a.maxAge;
        const fade = Math.sin(lifeRatio * Math.PI);
        const alpha = CONFIG.arrowAlpha * fade;
        if (alpha <= 0.02) continue;

        const px = a.u * cssWidth;
        const py = a.v * cssHeight;

        const sNorm = Math.max(0, Math.min(1, (a.speed - 0.5) / 0.8));
        const len = CONFIG.arrowMinLength + sNorm * (CONFIG.arrowMaxLength - CONFIG.arrowMinLength);

        const angle = Math.atan2(a.vy * cssHeight, a.vx * cssWidth);
        const cosA = Math.cos(angle);
        const sinA = Math.sin(angle);

        const tailX = px - len * cosA;
        const tailY = py - len * sinA;

        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha.toFixed(3)})`;
        ctx.lineWidth = 1.0;

        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(px, py);
        ctx.stroke();

        // Chevron head
        const barb = CONFIG.arrowHeadSize;
        const barbAngle1 = angle + (150 * Math.PI) / 180;
        const barbAngle2 = angle - (150 * Math.PI) / 180;

        ctx.beginPath();
        ctx.moveTo(px + barb * Math.cos(barbAngle1), py + barb * Math.sin(barbAngle1));
        ctx.lineTo(px, py);
        ctx.lineTo(px + barb * Math.cos(barbAngle2), py + barb * Math.sin(barbAngle2));
        ctx.stroke();
      }

      ctx.restore();
    };

    // Reduced Motion Mode: Pre-simulate 200 steps, draw ONE static frame, show prediction active, no loop
    if (shouldReduceMotion) {
      if (stageTeleRef.current) stageTeleRef.current.style.opacity = "0.45";
      if (stageFeatRef.current) stageFeatRef.current.style.opacity = "0.45";
      if (stageModelRef.current) stageModelRef.current.style.opacity = "0.45";
      if (stagePredRef.current) stagePredRef.current.style.opacity = "0.95";
      if (teleValRef.current) teleValRef.current.textContent = "v 285 km/h";
      if (modelValRef.current) modelValRef.current.textContent = "inference 12 ms";
      if (predValRef.current) predValRef.current.textContent = "drag 544 N · downforce 3,688 N";
      if (pinCLabelRef.current) pinCLabelRef.current.textContent = "wake probe · conf 0.91";

      for (let s = 0; s < 200; s++) {
        simulateStep(0.016);
      }
      renderFrame();
      return () => {
        document.removeEventListener("visibilitychange", onVisibilityChange);
      };
    }

    // Main rAF Animation Loop
    const loop = (timestamp) => {
      animId = requestAnimationFrame(loop);

      if (!inView || !isDocumentVisible) {
        lastTimestamp = timestamp;
        return;
      }

      const frameStart = performance.now();
      const dt = Math.min((timestamp - lastTimestamp) / 1000, 0.05) || 0.016;
      lastTimestamp = timestamp;

      // Dynamically handle canvas dimensions
      const dims = resizeCanvas();
      cssWidth = dims.cssWidth;
      cssHeight = dims.cssHeight;
      dpr = dims.dpr;

      simulateStep(dt);
      renderFrame();

      // Adaptive Quality Monitor (exceeds 24ms over 60 frames -> throttle particles)
      const frameDuration = performance.now() - frameStart;
      frameTimesRef.current.push(frameDuration);
      if (frameTimesRef.current.length > 60) {
        frameTimesRef.current.shift();
        if (!throttledRef.current) {
          const avg = frameTimesRef.current.reduce((a, b) => a + b, 0) / 60;
          if (avg > 24) {
            throttledRef.current = true;
            activeParticleCountRef.current = Math.max(
              CONFIG.minParticleCount,
              Math.round(activeParticleCountRef.current * 0.6)
            );
          }
        }
      }
    };

    animId = requestAnimationFrame(loop);

    return () => {
      if (animId) cancelAnimationFrame(animId);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [inView, shouldReduceMotion, hasError]);

  if (hasError) {
    return <AeroCar className="w-full h-full" />;
  }

  return (
    <ModelErrorBoundary fallback={<AeroCar />} onError={() => setHasError(true)}>
      <div
        ref={containerRef}
        aria-hidden="true"
        className="pointer-events-none select-none relative w-full flex flex-col items-start overflow-visible"
      >
        {/* Visually hidden accessibility description */}
        <span className="sr-only">
          Simulated demo: sensor data from a Formula 1 car flows through a model that predicts drag and downforce.
        </span>

        {/* Task 5: Updated Tag text */}
        <div className="w-full flex justify-start mb-1 pl-1">
          <span className="text-[10px] font-mono tracking-wider text-zinc-400 uppercase select-none opacity-80 whitespace-nowrap">
            SIMULATED DEMO · sensor data in -&gt; predictions out
          </span>
        </div>

        {/* Visual Box Container: Holds Canvases and Sensor Pins */}
        <div className="relative w-full h-[210px] md:h-[225px] lg:h-[240px]">
          {/* Task 1: Canvases Wrapper with CSS mask-image (20% left fade, 10% right fade) */}
          <div
            className="relative w-full h-full overflow-hidden"
            style={{
              maskImage: `linear-gradient(to right, transparent 0%, black ${CONFIG.maskFadeLeft * 100}%, black ${(1 - CONFIG.maskFadeRight) * 100}%, transparent 100%)`,
              WebkitMaskImage: `linear-gradient(to right, transparent 0%, black ${CONFIG.maskFadeLeft * 100}%, black ${(1 - CONFIG.maskFadeRight) * 100}%, transparent 100%)`,
            }}
          >
            {/* 2D Flow Canvas (behind) */}
            <canvas
              ref={flowCanvasRef}
              className="absolute inset-0 w-full h-full pointer-events-none"
            />

            {/* 3D Wireframe Car Canvas (front) */}
            <Canvas
              orthographic
              dpr={[1, 1.5]}
              gl={{ alpha: true, antialias: true }}
              camera={{ position: [0, 0, 100], zoom: 1 }}
              frameloop="demand"
              style={{ background: "transparent", pointerEvents: "none" }}
              className="relative z-10 w-full h-full pointer-events-none"
            >
              <StaticWireframeCar onMaskReady={handleMaskReady} onError={handleError} />
            </Canvas>
          </div>

          {/* Task 3: Sensor Pins Overlay (OUTSIDE masked wrapper so they never fade) */}
          {pinsData && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-20 overflow-visible">
              {/* Pin A: Front Wing */}
              <circle cx={pinsData.pinA.x} cy={pinsData.pinA.y} r="1.5" fill="#ffffff" />
              <circle
                ref={ringARef}
                cx={pinsData.pinA.x}
                cy={pinsData.pinA.y}
                r="3"
                stroke="#ffffff"
                strokeWidth="1"
                fill="none"
                opacity="0"
              />
              <line
                x1={pinsData.pinA.x}
                y1={pinsData.pinA.y}
                x2={pinsData.pinA.x}
                y2={pinsData.pinA.y + 10}
                stroke="rgba(255, 255, 255, 0.45)"
                strokeWidth="1"
              />
              <text
                x={pinsData.pinA.x}
                y={pinsData.pinA.y + 21}
                textAnchor="middle"
                className="fill-zinc-400 font-mono text-[9px] tracking-wider select-none opacity-80"
              >
                pressure tap
              </text>

              {/* Pin B: Floor Center */}
              <circle cx={pinsData.pinB.x} cy={pinsData.pinB.y} r="1.5" fill="#ffffff" />
              <circle
                ref={ringBRef}
                cx={pinsData.pinB.x}
                cy={pinsData.pinB.y}
                r="3"
                stroke="#ffffff"
                strokeWidth="1"
                fill="none"
                opacity="0"
              />
              <line
                x1={pinsData.pinB.x}
                y1={pinsData.pinB.y}
                x2={pinsData.pinB.x}
                y2={pinsData.pinB.y + 10}
                stroke="rgba(255, 255, 255, 0.45)"
                strokeWidth="1"
              />
              <text
                x={pinsData.pinB.x}
                y={pinsData.pinB.y + 21}
                textAnchor="middle"
                className="fill-zinc-400 font-mono text-[9px] tracking-wider select-none opacity-80"
              >
                floor probe
              </text>

              {/* Pin C: Rear Wing Top */}
              <circle cx={pinsData.pinC.x} cy={pinsData.pinC.y} r="1.5" fill="#ffffff" />
              <circle
                ref={ringCRef}
                cx={pinsData.pinC.x}
                cy={pinsData.pinC.y}
                r="3"
                stroke="#ffffff"
                strokeWidth="1"
                fill="none"
                opacity="0"
              />
              <line
                x1={pinsData.pinC.x}
                y1={pinsData.pinC.y}
                x2={pinsData.pinC.x}
                y2={pinsData.pinC.y - 10}
                stroke="rgba(255, 255, 255, 0.45)"
                strokeWidth="1"
              />
              <text
                x={pinsData.pinC.x - 4}
                y={pinsData.pinC.y - 14}
                textAnchor="end"
                className="fill-zinc-400 font-mono text-[9px] tracking-wider select-none opacity-80"
              >
                <tspan ref={pinCLabelRef}>wake probe · conf 0.91</tspan>
              </text>
            </svg>
          )}
        </div>

        {/* Task 4: Pipeline Strip (spans visual box width, stops at container right edge via CSS variable) */}
        <div
          className="w-full mt-3 flex flex-col select-none"
          style={{ paddingRight: "var(--bleed-right, 0px)" }}
        >
          {/* Row 1: Pipeline Stage Strip */}
          <div className="relative w-full flex items-center justify-between text-xs font-mono py-1">
            {/* SVG Connecting Track Line across stages with Chevrons */}
            <div className="absolute inset-0 flex items-center pointer-events-none">
              <div className="w-full h-[1px] bg-white/20 relative">
                {/* Small Traveling Dot */}
                <div
                  ref={travelingDotRef}
                  className="absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white transition-opacity duration-150"
                  style={{ left: "18%", opacity: 0 }}
                />
              </div>
            </div>

            {/* Stage 1: telemetry */}
            <div
              ref={stageTeleRef}
              className="relative z-10 flex items-center gap-1.5 bg-black px-1.5 transition-opacity duration-200"
              style={{ opacity: 0.95 }}
            >
              <span
                ref={teleActiveDotRef}
                className="w-1.5 h-1.5 rounded-full bg-white transition-opacity duration-200"
                style={{ opacity: 1 }}
              />
              <span className="text-zinc-200">telemetry</span>
              <span className="text-zinc-500 text-[10px]">&gt;</span>
            </div>

            {/* Stage 2: features */}
            <div
              ref={stageFeatRef}
              className="relative z-10 flex items-center gap-1 bg-black px-1.5 transition-opacity duration-200"
              style={{ opacity: 0.45 }}
            >
              <span className="text-zinc-300">features</span>
              <span className="text-zinc-500 text-[10px]">&gt;</span>
            </div>

            {/* Stage 3: model */}
            <div
              ref={stageModelRef}
              className="relative z-10 flex items-center gap-1 bg-black px-1.5 transition-opacity duration-200"
              style={{ opacity: 0.45 }}
            >
              <span className="text-zinc-300">model</span>
              <span className="text-zinc-500 text-[10px]">&gt;</span>
            </div>

            {/* Stage 4: prediction */}
            <div
              ref={stagePredRef}
              className="relative z-10 flex items-center gap-1 bg-black px-1.5 transition-opacity duration-200"
              style={{ opacity: 0.45 }}
            >
              <span className="text-zinc-200">prediction</span>
            </div>
          </div>

          {/* Row 2: Telemetry Readouts directly under stages (Hides below lg per Ground Rule 6) */}
          <div className="hidden lg:flex w-full items-center justify-between font-mono text-[11px] text-zinc-400 tabular-nums pt-1 select-none">
            <span ref={teleValRef} className="w-[110px] text-left whitespace-nowrap">
              v 294 km/h
            </span>
            <span className="w-[70px] text-center" />
            <span ref={modelValRef} className="w-[120px] text-center whitespace-nowrap">
              inference 12 ms
            </span>
            <span ref={predValRef} className="w-[210px] text-right whitespace-nowrap">
              drag 580 N · downforce 3,930 N
            </span>
          </div>
        </div>
      </div>
    </ModelErrorBoundary>
  );
}

// Preload GLB asset
useGLTF.preload("/models/f1.glb");
