import { Component, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { BufferGeometry, Float32BufferAttribute, ExtrudeGeometry, MathUtils, Path, PMREMGenerator, Shape, Vector2, type Group, type Mesh, type MeshStandardMaterial } from "three";
import { SVGLoader } from "three/addons/loaders/SVGLoader.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import polygonClipping, { type MultiPolygon, type Polygon, type Ring as PolygonRing } from "polygon-clipping";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import officialMonogram from "../../brand/logo/monograma-cafe-marfim.svg?raw";

gsap.registerPlugin(useGSAP);

type RingInput = { progress: number; x: number; y: number; velocity: number; dragging: boolean; visible: boolean };

class RingBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

// A single swept shank makes the shoulders continuous with the flattened band.
function createShank() {
  const positions: number[] = [];
  const indices: number[] = [];
  const segments = 160;
  const profileSegments = 24;
  const rounded = (value: number) => Math.sign(value) * Math.abs(value) ** (2 / 3);
  for (let i = 0; i <= segments; i++) {
    const angle = i / segments * Math.PI * 2;
    const shoulder = Math.max(0, Math.sin(angle));
    const radius = 1.02 + 0.08 * shoulder ** 8;
    const thickness = 0.105 + 0.035 * shoulder ** 6;
    const width = 0.17 + 0.34 * shoulder ** 6;
    for (let j = 0; j <= profileSegments; j++) {
      const phase = j / profileSegments * Math.PI * 2;
      const r = radius + thickness * rounded(Math.cos(phase));
      positions.push(r * Math.cos(angle), r * Math.sin(angle), width * rounded(Math.sin(phase)));
      if (i < segments && j < profileSegments) {
        const a = i * (profileSegments + 1) + j;
        const b = a + profileSegments + 1;
        indices.push(a, b, a + 1, b, b + 1, a + 1);
      }
    }
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function createSignet() {
  const loader = new SVGLoader();
  const document = new DOMParser().parseFromString(officialMonogram, "image/svg+xml");
  const toPolygon = (shape: Shape): Polygon => [shape, ...shape.holes].map(path =>
    path.getPoints(24).map(p => [p.x, p.y] as [number, number]));
  // Honor the interlacing masks before union: overlapping holes cannot be triangulated safely.
  const contours = [...document.querySelectorAll("svg > g > path")].flatMap(node => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg"><path d="${node.getAttribute("d")}"/></svg>`;
    let polygons: MultiPolygon = loader.parse(svg).paths.flatMap(path => SVGLoader.createShapes(path).map(toPolygon));
    const maskId = node.getAttribute("mask")?.match(/#([^)]+)/)?.[1];
    if (maskId) {
      for (const cut of document.getElementById(maskId)?.querySelectorAll('path[fill="black"]') ?? []) {
        const mask = loader.parse(`<svg xmlns="http://www.w3.org/2000/svg"><path d="${cut.getAttribute("d")}"/></svg>`);
        const holes = mask.paths.flatMap(path => SVGLoader.createShapes(path).map(toPolygon));
        polygons = polygonClipping.difference(polygons, ...holes);
      }
    }
    return polygons;
  });
  const monogram = polygonClipping.union(contours);
  const toShape = (polygon: Polygon) => {
    const points = (ring: PolygonRing) => ring.map(([x, y]) => new Vector2((x - 296) * 0.0017, (256 - y) * 0.0017));
    const shape = new Shape(points(polygon[0]));
    shape.holes = polygon.slice(1).map(ring => new Path(points(ring)));
    return shape;
  };
  const letters = monogram.map(toShape);
  const oval = new Shape();
  oval.absellipse(296, 256, 0.8 / 0.0017, 0.67 / 0.0017, 0, Math.PI * 2, false, 0);
  // Through-cut contours end on a darker gold floor below the face, giving actual depth.
  const face = new ExtrudeGeometry(polygonClipping.difference([toPolygon(oval)], monogram).map(toShape), {
    depth: 0.07, bevelEnabled: true, bevelSegments: 3,
    steps: 1, bevelSize: 0.0018, bevelThickness: 0.012, curveSegments: 48,
  });
  const engraving = new ExtrudeGeometry(letters, {
    depth: 0.008, bevelEnabled: true, bevelSegments: 2,
    bevelSize: 0.002, bevelThickness: 0.002, curveSegments: 24,
  });
  const rimShape = new Shape();
  rimShape.absellipse(0, 0, 0.835, 0.705, 0, Math.PI * 2, false, 0);
  const rimHole = new Path();
  rimHole.absellipse(0, 0, 0.791, 0.661, 0, Math.PI * 2, true, 0);
  rimShape.holes.push(rimHole);
  const rim = new ExtrudeGeometry(rimShape, {
    depth: 0.067, bevelEnabled: true, bevelSize: 0.009, bevelThickness: 0.012, bevelSegments: 4, curveSegments: 64,
  });
  return { face, engraving, rim };
}

function WarmEnvironment() {
  const { gl, scene, invalidate } = useThree();
  useEffect(() => {
    const room = new RoomEnvironment();
    room.traverse(object => {
      const material = (object as Mesh).material as MeshStandardMaterial | undefined;
      if (material?.color) material.color.set("#fff1dd");
    });
    const generator = new PMREMGenerator(gl);
    const environment = generator.fromScene(room, 0.04);
    const previous = scene.environment;
    scene.environment = environment.texture;
    invalidate();
    return () => {
      scene.environment = previous;
      environment.dispose(); generator.dispose(); room.dispose();
    };
  }, [gl, scene, invalidate]);
  return null;
}

function Ring({ input }: { input: React.RefObject<RingInput> }) {
  const group = useRef<Group>(null);
  const { invalidate } = useThree();
  const shank = useMemo(createShank, []);
  const { face, engraving, rim } = useMemo(createSignet, []);
  useEffect(() => () => {
    shank.dispose(); face.dispose(); engraving.dispose(); rim.dispose();
  }, [shank, face, engraving, rim]);
  useEffect(() => {
    const update = () => { if (input.current.visible) invalidate(); };
    document.addEventListener("gd:ring-update", update);
    return () => document.removeEventListener("gd:ring-update", update);
  }, [invalidate, input]);
  useFrame((_, delta) => {
    if (!group.current || !input.current.visible) return;
    const target = input.current;
    const dt = Math.min(delta, 0.05);
    if (!target.dragging) {
      target.x += target.velocity * dt;
      target.velocity *= Math.exp(-5 * dt);
    }
    const rotationY = -0.55 + target.progress * Math.PI * 2 + target.x;
    const rotationX = 0.85 + target.y;
    group.current.rotation.y = MathUtils.damp(group.current.rotation.y, rotationY, 7, dt);
    group.current.rotation.x = MathUtils.damp(group.current.rotation.x, rotationX, 7, dt);
    if (Math.abs(group.current.rotation.y - rotationY) > 0.001 ||
        Math.abs(group.current.rotation.x - rotationX) > 0.001 || Math.abs(target.velocity) > 0.001) invalidate();
  });
  const gold = { color: "#C9A97A", metalness: 0.96, roughness: 0.28, envMapIntensity: 1.1 };
  return (
    <group ref={group} rotation={[0.85, -0.55, -0.14]} position={[0, -0.12, 0]}>
      <mesh geometry={shank}><meshStandardMaterial {...gold} /></mesh>
      <mesh position={[0, 1.12, 0]} scale={[1, 1, 0.84]}>
        <cylinderGeometry args={[0.8, 0.69, 0.22, 96]} />
        <meshStandardMaterial {...gold} />
      </mesh>
      <mesh geometry={face} position={[0, 1.23, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <meshStandardMaterial {...gold} />
      </mesh>
      <mesh geometry={rim} position={[0, 1.23, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <meshStandardMaterial {...gold} roughness={0.22} />
      </mesh>
      <mesh geometry={engraving} position={[0, 1.255, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#A58A63" metalness={0.85} roughness={0.43} envMapIntensity={0.8} />
      </mesh>
    </group>
  );
}

export default function SignetRing({
  available = false,
}: {
  available?: boolean;
}) {
  const root = useRef<HTMLDivElement>(null);
  const input = useRef<RingInput>({ progress: 0, x: 0, y: 0, velocity: 0, dragging: false, visible: false });
  // "pending" renders nothing, so the photo never flashes before the 3D ring;
  // the photo is only for browsers without WebGL or with reduced motion.
  const [mode, setMode] = useState<"pending" | "webgl" | "image">("pending");
  const [ready, setReady] = useState(false);
  useGSAP(
    () => {
      const preference = matchMedia("(prefers-reduced-motion: reduce)");
      let idle = 0;
      // Building the ring blocks the main thread for a moment, so it happens
      // right after the intro, while the hero is still, and is ready long
      // before the visitor scrolls down to it.
      const build = () => {
        const run = () => setMode("webgl");
        idle =
          typeof window.requestIdleCallback === "function"
            ? requestIdleCallback(run, { timeout: 1500 })
            : Number(setTimeout(run, 200));
      };
      const check = () => {
        let supported = false;
        if (!preference.matches) {
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("webgl2");
          supported = !!context;
          context?.getExtension("WEBGL_lose_context")?.loseContext();
        }
        if (!supported) setMode("image");
        else if (window.__gdIntroDone) build();
        else document.addEventListener("gd:intro-done", build, { once: true });
      };
      check();
      preference.addEventListener("change", check);
      const visibility = new IntersectionObserver((entries) => {
        input.current.visible = entries[0].isIntersecting;
        if (input.current.visible)
          document.dispatchEvent(new Event("gd:ring-update"));
      });
      if (root.current) visibility.observe(root.current);
      const onProgress = (event: Event) => {
        input.current.progress = (event as CustomEvent<number>).detail;
        document.dispatchEvent(new Event("gd:ring-update"));
      };
      document.addEventListener("gd:brand-progress", onProgress);
      return () => {
        preference.removeEventListener("change", check);
        document.removeEventListener("gd:intro-done", build);
        window.cancelIdleCallback?.(idle);
        clearTimeout(idle);
        visibility.disconnect();
        document.removeEventListener("gd:brand-progress", onProgress);
      };
    },
    { scope: root },
  );
  const fallback = (
    <div className={`ring-fallback ${available ? "" : "media-placeholder"}`}>
      {available && (
        <img
          src="/media/objetos/anel.webp"
          alt="Anel-sinete em ouro champagne com monograma GD"
          width="1200"
          height="1200"
        />
      )}
    </div>
  );
  return (
    <div
      ref={root}
      className="ring-interaction"
      role="img"
      aria-label="Anel-sinete em ouro champagne com monograma GD. Arraste para girar."
      onPointerDown={(event) => {
        input.current.dragging = true;
        input.current.velocity = 0;
        event.currentTarget.setPointerCapture(event.pointerId);
      }}
      onPointerUp={(event) => {
        input.current.dragging = false;
        if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
        document.dispatchEvent(new Event("gd:ring-update"));
      }}
      onPointerCancel={() => { input.current.dragging = false; input.current.velocity = 0; }}
      onPointerMove={(event) => {
        const bounds = event.currentTarget.getBoundingClientRect();
        if (input.current.dragging) {
          input.current.x += event.movementX * 0.012;
          input.current.velocity = MathUtils.clamp(event.movementX * 0.5, -5, 5);
        }
        input.current.y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 0.3;
        document.dispatchEvent(new Event("gd:ring-update"));
      }}
    >
      {mode === "pending" && available && (
        <noscript>
          <img
            className="ring-noscript"
            src="/media/objetos/anel.webp"
            alt="Anel-sinete em ouro champagne com monograma GD"
            width="1200"
            height="1200"
          />
        </noscript>
      )}
      {mode === "image" && fallback}
      {mode === "webgl" && (
        <RingBoundary fallback={fallback}>
          <Canvas
            className={ready ? "ring-canvas is-ready" : "ring-canvas"}
            frameloop="demand"
            // Measure the layout size, not the zoomed one: the brand section scales
            // the ring up to 6x, and resizing the drawing buffer on every step
            // clears the canvas and makes the ring blink.
            resize={{ offsetSize: true, scroll: false }}
            dpr={[1, 1.5]}
            camera={{ position: [0, 0, 5.8], fov: 38 }}
            gl={{ alpha: true, antialias: true }}
            onCreated={() => setReady(true)}
          >
            <ambientLight intensity={0.4} />
            <directionalLight
              position={[3, 5, 4]}
              color="#ffe8c4"
              intensity={1.5}
            />
            <directionalLight
              position={[-3, 0, 3]}
              color="#e7d3c7"
              intensity={0.65}
            />
            <WarmEnvironment />
            <Ring input={input} />
          </Canvas>
        </RingBoundary>
      )}
    </div>
  );
}
