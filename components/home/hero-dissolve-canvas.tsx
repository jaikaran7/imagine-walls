"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const VERTEX = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FRAGMENT = `
  uniform float uProgress;
  uniform vec2 uResolution;
  uniform vec3 uColor;
  uniform float uSpread;
  varying vec2 vUv;

  float Hash(vec2 p) {
    vec3 p2 = vec3(p.xy, 1.0);
    return fract(sin(dot(p2, vec3(37.1, 61.7, 12.4))) * 3758.5453123);
  }

  float noise(in vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f *= f * (3.0 - 2.0 * f);
    return mix(
      mix(Hash(i + vec2(0.0, 0.0)), Hash(i + vec2(1.0, 0.0)), f.x),
      mix(Hash(i + vec2(0.0, 1.0)), Hash(i + vec2(1.0, 1.0)), f.x),
      f.y
    );
  }

  float fbm(vec2 p) {
    float v = 0.0;
    v += noise(p * 1.0) * 0.5;
    v += noise(p * 2.0) * 0.25;
    v += noise(p * 4.0) * 0.125;
    return v;
  }

  void main() {
    vec2 uv = vUv;
    float aspect = uResolution.x / uResolution.y;
    vec2 centeredUv = (uv - 0.5) * vec2(aspect, 1.0);

    float dissolveEdge = uv.y - uProgress * 1.2;
    float noiseValue = fbm(centeredUv * 15.0);
    float d = dissolveEdge + noiseValue * uSpread;

    float pixelSize = 1.0 / uResolution.y;
    float alpha = 1.0 - smoothstep(-pixelSize, pixelSize, d);

    gl_FragColor = vec4(uColor, alpha);
  }
`;

function parseCssColor(raw: string): THREE.Vector3 {
  const el = document.createElement("canvas");
  el.width = el.height = 1;
  const ctx = el.getContext("2d", { willReadFrequently: true });
  if (!ctx) return new THREE.Vector3(0.97, 0.96, 0.95);
  ctx.fillStyle = "#000";
  ctx.fillStyle = raw;
  ctx.fillRect(0, 0, 1, 1);
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
  return new THREE.Vector3((r ?? 247) / 255, (g ?? 246) / 255, (b ?? 243) / 255);
}

type HeroDissolveCanvasProps = {
  /** Tall scroll section — drives scrub progress */
  sectionRef: React.RefObject<HTMLElement | null>;
  className?: string;
  onProgress?: (progress: number) => void;
};

export function HeroDissolveCanvas({
  sectionRef,
  className,
  onProgress,
}: HeroDissolveCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const onProgressRef = useRef(onProgress);
  onProgressRef.current = onProgress;

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;

    // Size to sticky viewport host, not the tall section
    const host = canvas.parentElement ?? section;

    const color = parseCssColor(
      getComputedStyle(document.documentElement).getPropertyValue("--paper").trim() ||
        "#f7f6f3",
    );

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: false,
    });
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const material = new THREE.ShaderMaterial({
      vertexShader: VERTEX,
      fragmentShader: FRAGMENT,
      uniforms: {
        uProgress: { value: 0 },
        uResolution: {
          value: new THREE.Vector2(host.clientWidth, host.clientHeight),
        },
        uColor: { value: color },
        uSpread: { value: 0.5 },
      },
      transparent: true,
    });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);

    const resize = () => {
      const w = host.clientWidth;
      const h = host.clientHeight;
      renderer.setSize(w, h, false);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      material.uniforms.uResolution.value.set(w, h);
    };
    resize();

    let raf = 0;
    let progress = 0;
    const tick = () => {
      material.uniforms.uProgress.value = progress;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const st = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        progress = Math.min(self.progress * 1.15, 1.1);
        onProgressRef.current?.(progress);
      },
    });

    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(raf);
      st.kill();
      window.removeEventListener("resize", resize);
      material.dispose();
      mesh.geometry.dispose();
      renderer.dispose();
    };
  }, [sectionRef]);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
