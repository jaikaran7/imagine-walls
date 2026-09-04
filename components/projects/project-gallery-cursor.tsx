"use client";

import { useEffect } from "react";
import { motion, useSpring } from "framer-motion";

export function ProjectGalleryCursor({
  visible,
  label = "View",
}: {
  visible: boolean;
  label?: string;
}) {
  const springX = useSpring(0, { stiffness: 280, damping: 28, mass: 0.4 });
  const springY = useSpring(0, { stiffness: 280, damping: 28, mass: 0.4 });
  const springScale = useSpring(0, { stiffness: 320, damping: 26 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      springX.set(e.clientX);
      springY.set(e.clientY);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [springX, springY]);

  useEffect(() => {
    springScale.set(visible ? 1 : 0);
  }, [visible, springScale]);

  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-[200] hidden md:block"
      style={{ x: springX, y: springY, translateX: "-50%", translateY: "-50%", scale: springScale }}
      aria-hidden="true"
    >
      <div className="flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full border border-ink bg-paper/90 backdrop-blur-sm lg:h-20 lg:w-20">
        <span className="text-[0.625rem] uppercase tracking-[0.14em] text-ink">{label}</span>
      </div>
    </motion.div>
  );
}
