"use client";

import type { ModelState } from "@/lib/data/process";

export function ProcessModelAnnotations({ state, stepValue }: { state: ModelState; stepValue: number }) {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      {/* Stage 02 — measurement dimensions */}
      {state.dimensionsOpacity > 0.05 && (
        <div
          className="absolute left-[8%] top-[42%] font-mono text-[10px] uppercase tracking-widest text-ink-faint sm:text-xs"
          style={{ opacity: state.dimensionsOpacity * (1 - state.isometricProgress * 0.85) }}
        >
          <span className="block border-l border-t border-ink-faint/40 pl-2 pt-1">4200</span>
        </div>
      )}
      {state.dimensionsOpacity > 0.05 && (
        <div
          className="absolute right-[12%] top-[28%] font-mono text-[10px] uppercase tracking-widest text-ink-faint sm:text-xs"
          style={{ opacity: state.dimensionsOpacity * (1 - state.isometricProgress * 0.85) }}
        >
          <span className="block border-r border-t border-ink-faint/40 pr-2 pt-1 text-right">3200</span>
        </div>
      )}

      {/* Stage 03 — zone labels */}
      {state.zonesOpacity > 0.1 && state.isometricProgress < 0.5 && (
        <>
          <ZoneLabel opacity={state.zonesOpacity} className="left-[14%] top-[58%]" label="Living" />
          <ZoneLabel opacity={state.zonesOpacity} className="right-[16%] top-[58%]" label="Dining" />
          <ZoneLabel opacity={state.zonesOpacity} className="right-[14%] top-[22%]" label="Kitchen" />
          <ZoneLabel opacity={state.zonesOpacity} className="left-[14%] top-[22%]" label="Bedroom" />
          <ZoneLabel opacity={state.zonesOpacity * 0.6} className="left-[6%] top-[72%]" label="Circulation" />
        </>
      )}

      {/* Stage 05 — material labels */}
      {state.materialProgress > 0.2 && (
        <>
          <MaterialLabel opacity={state.materialProgress} className="left-[10%] bottom-[18%]" label="Wood" />
          <MaterialLabel opacity={state.materialProgress} className="right-[12%] bottom-[22%]" label="Stone" />
          <MaterialLabel opacity={state.materialProgress * 0.85} className="left-[28%] bottom-[30%]" label="Fabric" />
          <MaterialLabel opacity={state.materialProgress * 0.7} className="right-[28%] top-[20%]" label="Metal" />
        </>
      )}

      {/* Stage 06 — approval */}
      {state.approvalOpacity > 0.05 && (
        <div
          className="absolute right-[8%] top-[12%] border border-ink-faint/30 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.2em] text-ink-faint sm:text-[10px]"
          style={{ opacity: state.approvalOpacity }}
        >
          <span className="mr-2 inline-block text-ink-muted">✓</span>
          Design approved
        </div>
      )}

      {/* Stage 08 — quality inspection */}
      {state.qualityOpacity > 0.05 && (
        <>
          <QualityMarker opacity={state.qualityOpacity} className="left-[22%] top-[38%]" label="Align" />
          <QualityMarker opacity={state.qualityOpacity * 0.9} className="right-[24%] top-[48%]" label="Joinery" />
          <QualityMarker opacity={state.qualityOpacity * 0.85} className="left-[38%] bottom-[28%]" label="Lighting" />
        </>
      )}

      {/* Stage 09 — completion (no photo — model only) */}
      {state.completionProgress > 0.6 && stepValue >= 7.5 && (
        <div
          className="absolute bottom-[10%] left-1/2 -translate-x-1/2 font-mono text-[9px] uppercase tracking-[0.25em] text-ink-faint sm:text-[10px]"
          style={{ opacity: (state.completionProgress - 0.6) / 0.4 }}
        >
          Handover complete
        </div>
      )}
    </div>
  );
}

function ZoneLabel({ label, className, opacity }: { label: string; className: string; opacity: number }) {
  return (
    <span
      className={`absolute font-mono text-[9px] uppercase tracking-[0.18em] text-ink-faint sm:text-[10px] ${className}`}
      style={{ opacity: opacity * 0.75 }}
    >
      {label}
    </span>
  );
}

function MaterialLabel({ label, className, opacity }: { label: string; className: string; opacity: number }) {
  return (
    <span
      className={`absolute font-mono text-[8px] uppercase tracking-[0.22em] text-ink-faint sm:text-[9px] ${className}`}
      style={{ opacity: opacity * 0.55 }}
    >
      {label}
    </span>
  );
}

function QualityMarker({ label, className, opacity }: { label: string; className: string; opacity: number }) {
  return (
    <div className={`absolute ${className}`} style={{ opacity }}>
      <div className="h-px w-8 bg-ink-faint/50" />
      <span className="mt-1 block font-mono text-[8px] uppercase tracking-[0.2em] text-ink-faint">{label}</span>
    </div>
  );
}
