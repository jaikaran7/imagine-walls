"use client";

import { useEffect } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";

const LENS = 92;
const ZOOM = 2;

export type MagnifierTarget = {
  src: string;
  left: number;
  top: number;
  width: number;
  height: number;
};

export function ProjectMagnifierCursor({
  visible,
  target,
  label = "View",
}: {
  visible: boolean;
  target: MagnifierTarget | null;
  label?: string;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 340, damping: 32, mass: 0.3 });
  const springY = useSpring(y, { stiffness: 340, damping: 32, mass: 0.3 });
  const springScale = useSpring(0, { stiffness: 360, damping: 28 });

  const bgPosX = useMotionValue(0);
  const bgPosY = useMotionValue(0);
  const springBgX = useSpring(bgPosX, { stiffness: 340, damping: 32, mass: 0.3 });
  const springBgY = useSpring(bgPosY, { stiffness: 340, damping: 32, mass: 0.3 });
  const backgroundPosition = useMotionTemplate`${springBgX}px ${springBgY}px`;

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      if (!target) return;
      const relX = e.clientX - target.left;
      const relY = e.clientY - target.top;
      bgPosX.set(-(relX * ZOOM - LENS / 2));
      bgPosY.set(-(relY * ZOOM - LENS / 2));
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [target, x, y, bgPosX, bgPosY]);

  useEffect(() => {
    springScale.set(visible && target ? 1 : 0);
  }, [visible, target, springScale]);

  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-[200] hidden md:block"
      style={{
        x: springX,
        y: springY,
        translateX: "-50%",
        translateY: "-50%",
        scale: springScale,
      }}
      aria-hidden="true"
    >
      <div
        className="relative overflow-hidden rounded-full border border-ink/80 shadow-[0_10px_30px_rgba(0,0,0,0.35)] ring-1 ring-white/30"
        style={{ width: LENS, height: LENS }}
      >
        {target && (
          <motion.div
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${target.src})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: `${target.width * ZOOM}px ${target.height * ZOOM}px`,
              backgroundPosition,
            }}
          />
        )}
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-white/25 to-black/20">
          <span className="font-display text-[0.72rem] tracking-[0.1em] text-ink drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)]">
            {label}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

