"use client";

import { useMemo } from "react";
import { modelStateFromStep } from "@/lib/data/process";
import { ProcessModelAnnotations } from "@/components/process/process-model-annotations";
import { useProcessTheme } from "@/components/process/use-process-theme";

/** SVG-based fallback for reduced motion — same evolving spatial concept, no WebGL. */
export function ProcessModelStatic({ stepValue, className }: { stepValue: number; className?: string }) {
  const state = useMemo(() => modelStateFromStep(stepValue), [stepValue]);
  const theme = useProcessTheme();
  const stroke = theme.isDark ? "#f5f4f0" : "#0c0c0b";
  const muted = theme.isDark ? "#9a9790" : "#5c5a54";
  const fill = theme.isDark ? "#1a1917" : "#efeee9";

  const iso = state.isometricProgress;
  const wallH = state.wallProgress;

  return (
    <div
      className={`relative aspect-[4/3] w-full max-w-[48rem] overflow-hidden ${className ?? ""}`}
      style={{ background: theme.paper }}
      aria-label="Architectural interior model"
    >
      <svg viewBox="0 0 480 360" className="h-full w-full" preserveAspectRatio="xMidYMid meet">
        {/* Grid */}
        {state.gridOpacity > 0 && (
          <g opacity={state.gridOpacity}>
            {Array.from({ length: 13 }).map((_, i) => (
              <line key={`v${i}`} x1={i * 40} y1={0} x2={i * 40} y2={360} stroke={stroke} strokeWidth={0.35} opacity={0.15} />
            ))}
            {Array.from({ length: 10 }).map((_, i) => (
              <line key={`h${i}`} x1={0} y1={i * 40} x2={480} y2={i * 40} stroke={stroke} strokeWidth={0.35} opacity={0.15} />
            ))}
          </g>
        )}

        {/* Boundary */}
        <rect
          x={80}
          y={70}
          width={320}
          height={220}
          fill="none"
          stroke={stroke}
          strokeWidth={1}
          opacity={state.boundaryOpacity * 0.8}
        />

        {/* Concept point */}
        {state.conceptPointOpacity > 0 && (
          <circle cx={240} cy={180} r={4} fill={stroke} opacity={state.conceptPointOpacity} />
        )}

        {/* Zone dividers (plan) */}
        {state.zonesOpacity > 0 && iso < 0.5 && (
          <g opacity={state.zonesOpacity * 0.5}>
            <line x1={80} y1={200} x2={400} y2={200} stroke={muted} strokeWidth={0.75} strokeDasharray="4 4" />
            <line x1={240} y1={70} x2={240} y2={290} stroke={muted} strokeWidth={0.75} strokeDasharray="4 4" />
          </g>
        )}

        {/* Isometric projection group */}
        <g transform={`translate(240, ${180 + iso * 20})`}>
          <g transform={`scale(1, ${1 - iso * 0.15})`}>
            {/* Floor */}
            {(state.floorPlanProgress > 0 || wallH > 0) && (
              <polygon
                points="-120,40 120,40 160,10 -80,10"
                fill={fill}
                stroke={stroke}
                strokeWidth={0.75}
                opacity={0.3 + state.materialProgress * 0.4}
                transform={`skewY(${-iso * 12})`}
              />
            )}

            {/* Walls — rise with wallProgress */}
            {wallH > 0.05 && (
              <g opacity={0.35 + wallH * 0.55}>
                <line x1={-120} y1={40} x2={-120} y2={40 - wallH * 60} stroke={stroke} strokeWidth={1.2} />
                <line x1={120} y1={40} x2={120} y2={40 - wallH * 60} stroke={stroke} strokeWidth={1.2} />
                <line x1={-120} y1={40 - wallH * 60} x2={120} y2={40 - wallH * 60} stroke={stroke} strokeWidth={0.75} opacity={0.5} />
              </g>
            )}

            {/* Furniture outlines / volumes */}
            {state.layoutProgress > 0 && (
              <g opacity={0.4 + state.wallProgress * 0.4}>
                <rect x={-90} y={15} width={70} height={22} fill="none" stroke={muted} strokeWidth={0.75} />
                <rect x={20} y={15} width={55} height={22} fill="none" stroke={muted} strokeWidth={0.75} />
                <rect x={40} y={-15} width={50} height={18} fill="none" stroke={muted} strokeWidth={0.75} />
                <rect x={-95} y={-20} width={60} height={30} fill="none" stroke={muted} strokeWidth={0.75} />
              </g>
            )}

            {/* Material fill hints */}
            {state.materialProgress > 0.3 && (
              <g opacity={state.materialProgress * 0.35}>
                <rect x={-90} y={15} width={70} height={22} fill={theme.isDark ? "#6b6560" : "#8a8580"} />
                <rect x={40} y={-15} width={50} height={18} fill={theme.isDark ? "#7c6a52" : "#8b7355"} />
              </g>
            )}

            {/* Lighting */}
            {state.lightingProgress > 0 && (
              <g opacity={state.lightingProgress}>
                <circle cx={-55} cy={-wallH * 30} r={3} fill={stroke} opacity={0.6} />
                <circle cx={45} cy={-wallH * 30} r={3} fill={stroke} opacity={0.6} />
              </g>
            )}
          </g>
        </g>
      </svg>

      <ProcessModelAnnotations state={state} stepValue={stepValue} />
    </div>
  );
}
