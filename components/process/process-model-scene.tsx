"use client";

import { useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Grid } from "@react-three/drei";
import * as THREE from "three";
import type { ModelState } from "@/lib/data/process";
import type { ProcessThemeColors } from "@/components/process/use-process-theme";

const W = 6;
const D = 4.2;
const WALL_H = 2.4;
const THIN = 0.06;

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function CameraRig({ state }: { state: ModelState }) {
  useFrame(({ camera }) => {
    const iso = state.isometricProgress;
    const persp = state.perspectiveProgress;

    const planPos = new THREE.Vector3(0, 11, 0.01);
    const isoPos = new THREE.Vector3(7.5, 7.5, 7.5);
    const finalPos = new THREE.Vector3(5.2, 4.2, 6.4);

    let pos = planPos.clone();
    if (iso < 1) {
      pos.lerp(isoPos, iso);
    } else {
      pos.copy(isoPos).lerp(finalPos, persp);
    }

    camera.position.copy(pos);
    camera.lookAt(0, lerp(0, 1.1, Math.max(iso, persp * 0.5)), 0);
    camera.updateProjectionMatrix();
  });

  return null;
}

function FloorGrid({ state, theme }: { state: ModelState; theme: ProcessThemeColors }) {
  const opacity = state.gridOpacity;
  const color = theme.isDark ? "#f5f4f0" : "#0c0c0b";

  return (
    <Grid
      args={[W + 2, D + 2]}
      position={[0, -0.001, 0]}
      cellSize={0.4}
      cellThickness={0.35}
      cellColor={color}
      sectionSize={1.2}
      sectionThickness={0.6}
      sectionColor={color}
      fadeDistance={18}
      fadeStrength={1}
      infiniteGrid={false}
      material-opacity={opacity}
      material-transparent
    />
  );
}

function BoundaryOutline({ state, theme }: { state: ModelState; theme: ProcessThemeColors }) {
  const opacity = state.boundaryOpacity;
  if (opacity <= 0) return null;

  const color = theme.isDark ? "#f5f4f0" : "#0c0c0b";
  const hw = W / 2;
  const hd = D / 2;
  const y = 0.01;

  const points = useMemo(
    () =>
      new Float32Array([
        -hw, y, -hd, hw, y, -hd, hw, y, hd, -hw, y, hd, -hw, y, -hd,
      ]),
    [hw, hd, y]
  );

  return (
    <line>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[points, 3]} count={5} itemSize={3} />
      </bufferGeometry>
      <lineBasicMaterial color={color} transparent opacity={opacity * 0.85} linewidth={1} />
    </line>
  );
}

function ConceptPoint({ state, theme }: { state: ModelState; theme: ProcessThemeColors }) {
  const opacity = state.conceptPointOpacity;
  if (opacity <= 0) return null;

  const color = theme.isDark ? "#f5f4f0" : "#0c0c0b";
  return (
    <mesh position={[0, 0.02, 0]}>
      <sphereGeometry args={[0.06, 16, 16]} />
      <meshBasicMaterial color={color} transparent opacity={opacity} />
    </mesh>
  );
}

function ZoneLines({ state, theme }: { state: ModelState; theme: ProcessThemeColors }) {
  const opacity = state.zonesOpacity * (1 - state.isometricProgress * 0.6);
  if (opacity <= 0.02) return null;

  const color = theme.isDark ? "#9a9790" : "#5c5a54";
  const hw = W / 2;
  const hd = D / 2;

  return (
    <group>
      <mesh position={[0, 0.005, 0.25]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[W - 0.08, 0.02]} />
        <meshBasicMaterial color={color} transparent opacity={opacity * 0.5} />
      </mesh>
      <mesh position={[0.02, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.02, D - 0.08]} />
        <meshBasicMaterial color={color} transparent opacity={opacity * 0.5} />
      </mesh>
      {/* circulation hint */}
      <mesh position={[-hw + 0.6, 0.005, -hd + 0.5]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.0, 0.7]} />
        <meshBasicMaterial color={color} transparent opacity={opacity * 0.25} wireframe />
      </mesh>
    </group>
  );
}

function Wall({
  position,
  size,
  state,
  theme,
  materialized = false,
}: {
  position: [number, number, number];
  size: [number, number, number];
  state: ModelState;
  theme: ProcessThemeColors;
  materialized?: boolean;
}) {
  const rise = state.wallProgress;
  const height = lerp(THIN, size[1], rise);
  const y = height / 2;

  const baseColor = theme.isDark ? "#d4d0c8" : "#2a2926";
  const matColor = theme.isDark ? "#c8c4bc" : "#3d3b36";

  const color = materialized
    ? new THREE.Color().lerpColors(new THREE.Color(baseColor), new THREE.Color(matColor), state.materialProgress)
    : baseColor;

  const opacity = lerp(0.35, 0.92, rise);

  return (
    <mesh position={[position[0], y, position[2]]} castShadow receiveShadow>
      <boxGeometry args={[size[0], height, size[2]]} />
      <meshStandardMaterial
        color={color}
        transparent
        opacity={opacity}
        roughness={lerp(0.95, materialized ? 0.75 : 0.9, state.materialProgress)}
        metalness={0.02}
      />
    </mesh>
  );
}

function Walls({ state, theme }: { state: ModelState; theme: ProcessThemeColors }) {
  const hw = W / 2;
  const hd = D / 2;
  const t = 0.08;

  return (
    <group>
      <Wall position={[0, 0, -hd]} size={[W, WALL_H, t]} state={state} theme={theme} materialized />
      <Wall position={[0, 0, hd]} size={[W, WALL_H, t]} state={state} theme={theme} materialized />
      <Wall position={[-hw, 0, 0]} size={[t, WALL_H, D]} state={state} theme={theme} materialized />
      <Wall position={[hw, 0, 0]} size={[t, WALL_H, D]} state={state} theme={theme} materialized />
      <Wall position={[0, 0, 0.25]} size={[W - 0.2, WALL_H * 0.85, t]} state={state} theme={theme} materialized />
      <Wall position={[0.02, 0, 0]} size={[t, D - 0.4, WALL_H * 0.7]} state={state} theme={theme} materialized />
    </group>
  );
}

function FurniturePiece({
  position,
  size,
  state,
  theme,
  outlineOnly = false,
  wood = false,
  fabric = false,
  stone = false,
}: {
  position: [number, number, number];
  size: [number, number, number];
  state: ModelState;
  theme: ProcessThemeColors;
  outlineOnly?: boolean;
  wood?: boolean;
  fabric?: boolean;
  stone?: boolean;
}) {
  const layout = state.layoutProgress;
  const extrude = state.wallProgress;
  const mat = state.materialProgress;

  const show = outlineOnly ? layout : layout * 0.4 + extrude * 0.6;
  if (show <= 0.01) return null;

  const fullH = size[1];
  const height = outlineOnly ? lerp(0.02, fullH * 0.15, layout) : lerp(0.02, fullH, extrude);

  let color = theme.isDark ? "#8a8680" : "#6b6760";
  if (wood && mat > 0) color = "#7c6a52";
  if (fabric && mat > 0) color = "#6b6560";
  if (stone && mat > 0) color = "#a8a29e";
  if (!wood && !fabric && !stone && mat > 0) color = theme.isDark ? "#9a9590" : "#5a5752";

  const opacity = outlineOnly ? lerp(0.25, 0.55, layout) * (1 - extrude * 0.8) : lerp(0.5, 0.95, show);

  return (
    <mesh position={[position[0], height / 2, position[2]]} castShadow receiveShadow>
      <boxGeometry args={[size[0], height, size[2]]} />
      <meshStandardMaterial
        color={color}
        transparent
        opacity={opacity}
        roughness={stone ? lerp(0.6, 0.35, mat) : lerp(0.85, 0.65, mat)}
        metalness={stone ? 0.05 : 0.01}
        wireframe={outlineOnly && extrude < 0.15}
      />
    </mesh>
  );
}

function Furniture({ state, theme }: { state: ModelState; theme: ProcessThemeColors }) {
  return (
    <group>
      <FurniturePiece position={[-1.5, 0, -0.7]} size={[1.8, 0.42, 0.75]} state={state} theme={theme} outlineOnly fabric />
      <FurniturePiece position={[-1.5, 0, -0.7]} size={[1.8, 0.42, 0.75]} state={state} theme={theme} fabric />
      <FurniturePiece position={[-1.5, 0, -0.05]} size={[0.55, 0.32, 0.55]} state={state} theme={theme} outlineOnly wood />
      <FurniturePiece position={[-1.5, 0, -0.05]} size={[0.55, 0.32, 0.55]} state={state} theme={theme} wood />
      <FurniturePiece position={[1.4, 0, -0.9]} size={[1.1, 0.38, 0.75]} state={state} theme={theme} outlineOnly wood />
      <FurniturePiece position={[1.4, 0, -0.9]} size={[1.1, 0.38, 0.75]} state={state} theme={theme} wood />
      <FurniturePiece position={[1.75, 0, 1.15]} size={[1.0, 0.92, 0.55]} state={state} theme={theme} outlineOnly wood />
      <FurniturePiece position={[1.75, 0, 1.15]} size={[1.0, 0.92, 0.55]} state={state} theme={theme} wood stone />
      <FurniturePiece position={[-1.85, 0, 1.45]} size={[1.5, 0.35, 2.0]} state={state} theme={theme} outlineOnly />
      <FurniturePiece position={[-1.85, 0, 1.45]} size={[1.5, 0.35, 2.0]} state={state} theme={theme} fabric />
      <FurniturePiece position={[-2.45, 0, 1.5]} size={[0.45, 2.0, 1.8]} state={state} theme={theme} outlineOnly wood />
      <FurniturePiece position={[-2.45, 0, 1.5]} size={[0.45, 2.0, 1.8]} state={state} theme={theme} wood />
    </group>
  );
}

function FloorSlab({ state, theme }: { state: ModelState; theme: ProcessThemeColors }) {
  const progress = Math.max(state.floorPlanProgress, state.wallProgress * 0.3);
  if (progress <= 0) return null;

  const wood = state.materialProgress;
  const base = theme.isDark ? "#1a1917" : "#efeee9";
  const woodColor = theme.isDark ? "#5c4f3f" : "#8b7355";
  const color = new THREE.Color(base).lerp(new THREE.Color(woodColor), wood * 0.65);

  return (
    <mesh position={[0, -0.015, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[W - 0.06, D - 0.06]} />
      <meshStandardMaterial
        color={color}
        transparent
        opacity={lerp(0.15, 0.95, progress)}
        roughness={lerp(0.95, 0.7, wood)}
        metalness={0.02}
      />
    </mesh>
  );
}

function Ceiling({ state, theme }: { state: ModelState; theme: ProcessThemeColors }) {
  const exec = state.executionProgress;
  if (exec <= 0) return null;

  const color = theme.isDark ? "#141412" : "#f0efec";
  return (
    <mesh position={[0, WALL_H - 0.04, 0]}>
      <boxGeometry args={[W - 0.12, 0.06, D - 0.12]} />
      <meshStandardMaterial color={color} transparent opacity={lerp(0, 0.92, exec)} roughness={0.9} />
    </mesh>
  );
}

function LightingFixtures({ state, theme }: { state: ModelState; theme: ProcessThemeColors }) {
  const light = state.lightingProgress;
  if (light <= 0) return null;

  const positions: [number, number, number][] = [
    [-1.5, WALL_H - 0.15, -0.5],
    [1.4, WALL_H - 0.15, -0.5],
    [1.75, WALL_H - 0.15, 1.2],
    [-1.8, WALL_H - 0.15, 1.4],
  ];

  return (
    <group>
      {positions.map((pos, i) => (
        <mesh key={i} position={pos}>
          <boxGeometry args={[0.35, 0.04, 0.35]} />
          <meshStandardMaterial
            color={theme.isDark ? "#f5f4f0" : "#e8e4dc"}
            emissive={theme.isDark ? "#f5f4f0" : "#d8d4cc"}
            emissiveIntensity={lerp(0, 0.8, light)}
            transparent
            opacity={lerp(0, 0.95, light)}
          />
        </mesh>
      ))}
    </group>
  );
}

function ExecutionDetails({ state, theme }: { state: ModelState; theme: ProcessThemeColors }) {
  const exec = state.executionProgress;
  if (exec <= 0) return null;

  const color = theme.isDark ? "#8a8580" : "#4a4844";

  return (
    <group>
      {/* baseboards */}
      <mesh position={[0, 0.06, -D / 2 + 0.06]}>
        <boxGeometry args={[W - 0.2, 0.08, 0.04]} />
        <meshStandardMaterial color={color} transparent opacity={lerp(0, 0.7, exec)} roughness={0.8} />
      </mesh>
      {/* joinery panel */}
      <mesh position={[-2.85, 1.0, 0]}>
        <boxGeometry args={[0.04, 1.6, 2.4]} />
        <meshStandardMaterial color={color} transparent opacity={lerp(0, 0.55, exec)} roughness={0.75} />
      </mesh>
    </group>
  );
}

function SceneContent({ state, theme }: { state: ModelState; theme: ProcessThemeColors }) {
  const ambient = lerp(0.25, 0.45, state.lightingProgress);
  const dir = lerp(0.15, 0.85, state.lightingProgress);

  return (
    <>
      <color attach="background" args={[theme.paper]} />
      <CameraRig state={state} />
      <ambientLight intensity={ambient} />
      <directionalLight
        position={[4, 8, 5]}
        intensity={dir}
        castShadow
        shadow-mapSize={[512, 512]}
        shadow-camera-far={30}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
      />
      <pointLight position={[-2, 3, -1]} intensity={lerp(0, 0.35, state.lightingProgress)} color="#f5f4f0" />
      <pointLight position={[2, 3, 1.5]} intensity={lerp(0, 0.25, state.lightingProgress)} color="#f0ece4" />

      <FloorGrid state={state} theme={theme} />
      <BoundaryOutline state={state} theme={theme} />
      <ConceptPoint state={state} theme={theme} />
      <ZoneLines state={state} theme={theme} />
      <FloorSlab state={state} theme={theme} />
      <Walls state={state} theme={theme} />
      <Furniture state={state} theme={theme} />
      <Ceiling state={state} theme={theme} />
      <ExecutionDetails state={state} theme={theme} />
      <LightingFixtures state={state} theme={theme} />

      <ContactShadows
        position={[0, -0.01, 0]}
        opacity={lerp(0, 0.35, state.wallProgress)}
        scale={12}
        blur={2.2}
        far={8}
        color="#000000"
      />
    </>
  );
}

export function ProcessModelScene({ state, theme }: { state: ModelState; theme: ProcessThemeColors }) {
  return (
    <Canvas
      shadows
      dpr={[1, 1.5]}
      camera={{ position: [0, 11, 0.01], fov: 42, near: 0.1, far: 100 }}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      style={{ background: theme.paper }}
    >
      <SceneContent state={state} theme={theme} />
    </Canvas>
  );
}
