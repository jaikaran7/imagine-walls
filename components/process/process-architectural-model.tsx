"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import { modelStateFromStep } from "@/lib/data/process";
import { ProcessModelAnnotations } from "@/components/process/process-model-annotations";
import { ProcessModelStatic } from "@/components/process/process-model-static";
import { useProcessTheme } from "@/components/process/use-process-theme";
import { useReducedMotion } from "@/components/motion/use-reduced-motion";

const ProcessModelScene = dynamic(
  () => import("@/components/process/process-model-scene").then((m) => m.ProcessModelScene),
  { ssr: false, loading: () => <ModelPlaceholder /> }
);

function ModelPlaceholder() {
  return <div className="absolute inset-0 animate-pulse bg-surface/40" aria-hidden="true" />;
}

export function ProcessArchitecturalModel({
  stepValue,
  className,
}: {
  stepValue: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const theme = useProcessTheme();
  const state = useMemo(() => modelStateFromStep(stepValue), [stepValue]);

  if (reduced) {
    return <ProcessModelStatic stepValue={stepValue} className={className} />;
  }

  return (
    <div
      className={`relative aspect-[4/3] w-full max-w-[48rem] overflow-hidden ${className ?? ""}`}
      aria-label="Evolving architectural interior model"
    >
      <div className="absolute inset-0">
        <ProcessModelScene state={state} theme={theme} />
      </div>
      <ProcessModelAnnotations state={state} stepValue={stepValue} />
    </div>
  );
}
