import type { ProcessStep } from "@/lib/types";

export interface ProcessStepDetail extends ProcessStep {
  verb: string;
}

export const processSteps: ProcessStepDetail[] = [
  {
    number: "01",
    title: "Consultation",
    verb: "Idea",
    description: "Understanding your vision, style, needs & budget.",
  },
  {
    number: "02",
    title: "Site Visit & Measure",
    verb: "Measure",
    description: "On-site measurement and space analysis.",
  },
  {
    number: "03",
    title: "Concept & Layout",
    verb: "Plan",
    description: "Developing the planning and design direction.",
  },
  {
    number: "04",
    title: "3D Development",
    verb: "Volume",
    description: "Realistic 3D visualisation of the proposed space.",
  },
  {
    number: "05",
    title: "Material Selection",
    verb: "Materialise",
    description: "Curated materials, finishes and hardware.",
  },
  {
    number: "06",
    title: "Approval",
    verb: "Approve",
    description: "Final review and approval before execution.",
  },
  {
    number: "07",
    title: "Execution",
    verb: "Execute",
    description: "Skilled execution with attention to quality and craftsmanship.",
  },
  {
    number: "08",
    title: "Quality Check",
    verb: "Refine",
    description: "Detailed quality inspection.",
  },
  {
    number: "09",
    title: "Handover",
    verb: "Hand over",
    description: "Final handover of the completed space.",
  },
];

/** Map document scroll progress [0,1] to a continuous step value [0,8]. */
export function scrollToStepValue(progress: number): number {
  const t = Math.min(Math.max(progress, 0), 1);
  const anchors = [
    { t: 0, v: 0 },
    { t: 0.1, v: 1 },
    { t: 0.22, v: 2 },
    { t: 0.34, v: 3 },
    { t: 0.5, v: 4 },
    { t: 0.6, v: 5 },
    { t: 0.72, v: 6 },
    { t: 0.84, v: 7 },
    { t: 0.94, v: 8 },
    { t: 1, v: 8 },
  ];

  for (let i = 0; i < anchors.length - 1; i++) {
    const a = anchors[i];
    const b = anchors[i + 1];
    if (t >= a.t && t <= b.t) {
      const local = (t - a.t) / (b.t - a.t);
      return a.v + local * (b.v - a.v);
    }
  }
  return 8;
}

/** Inverse: map step value [0,8] to scroll progress [0,1] for click navigation. */
export function stepValueToScrollProgress(stepValue: number): number {
  const v = Math.min(Math.max(stepValue, 0), 8);
  const anchors = [
    { t: 0, v: 0 },
    { t: 0.1, v: 1 },
    { t: 0.22, v: 2 },
    { t: 0.34, v: 3 },
    { t: 0.5, v: 4 },
    { t: 0.6, v: 5 },
    { t: 0.72, v: 6 },
    { t: 0.84, v: 7 },
    { t: 0.94, v: 8 },
    { t: 1, v: 8 },
  ];

  for (let i = 0; i < anchors.length - 1; i++) {
    const a = anchors[i];
    const b = anchors[i + 1];
    if (v >= a.v && v <= b.v) {
      const local = b.v === a.v ? 0 : (v - a.v) / (b.v - a.v);
      return a.t + local * (b.t - a.t);
    }
  }
  return 1;
}

export function stepValueToIndex(value: number, count: number): number {
  return Math.min(Math.max(Math.round(value), 0), count - 1);
}

/** Clamp helper for layer opacities. */
export function layerOpacity(stepValue: number, start: number, end: number): number {
  if (stepValue <= start) return 0;
  if (stepValue >= end) return 1;
  return (stepValue - start) / (end - start);
}

/** Rises across [inStart, inEnd], holds, then falls across [outStart, outEnd]. */
export function layerPulse(stepValue: number, inStart: number, inEnd: number, outStart: number, outEnd: number): number {
  return layerOpacity(stepValue, inStart, inEnd) * (1 - layerOpacity(stepValue, outStart, outEnd));
}

export interface ModelState {
  floorPlanProgress: number;
  measurementProgress: number;
  layoutProgress: number;
  wallProgress: number;
  furnitureProgress: number;
  materialProgress: number;
  approvalProgress: number;
  executionProgress: number;
  qualityProgress: number;
  lightingProgress: number;
  completionProgress: number;
  isometricProgress: number;
  perspectiveProgress: number;
  gridOpacity: number;
  boundaryOpacity: number;
  conceptPointOpacity: number;
  dimensionsOpacity: number;
  zonesOpacity: number;
  approvalOpacity: number;
  qualityOpacity: number;
}

export function modelStateFromStep(stepValue: number): ModelState {
  return {
    floorPlanProgress: layerOpacity(stepValue, 0, 0.5),
    measurementProgress: layerOpacity(stepValue, 0.8, 1.8),
    layoutProgress: layerOpacity(stepValue, 1.8, 2.8),
    wallProgress: layerOpacity(stepValue, 2.8, 4.2),
    furnitureProgress: layerOpacity(stepValue, 2.0, 3.5),
    materialProgress: layerOpacity(stepValue, 4.0, 5.5),
    approvalProgress: layerOpacity(stepValue, 5.2, 6.0),
    executionProgress: layerOpacity(stepValue, 6.0, 7.2),
    qualityProgress: layerOpacity(stepValue, 7.0, 8.0),
    lightingProgress: layerOpacity(stepValue, 6.5, 7.8),
    completionProgress: layerOpacity(stepValue, 7.5, 8.0),
    isometricProgress: layerOpacity(stepValue, 2.8, 4.2),
    perspectiveProgress: layerOpacity(stepValue, 4.2, 8.0),
    gridOpacity: 0.12 + layerOpacity(stepValue, 0, 1) * 0.08,
    boundaryOpacity: layerOpacity(stepValue, 0.2, 0.8),
    conceptPointOpacity: layerPulse(stepValue, 0, 0.3, 0.85, 1.15),
    dimensionsOpacity: layerOpacity(stepValue, 0.8, 1.8),
    zonesOpacity: layerOpacity(stepValue, 1.9, 2.8),
    approvalOpacity: layerPulse(stepValue, 5.5, 6.2, 6.8, 7.2),
    qualityOpacity: layerPulse(stepValue, 7.2, 7.8, 8.2, 8.5),
  };
}
