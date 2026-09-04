"use client";

import { useEffect } from "react";
import { motion, useSpring } from "framer-motion";

export function ProjectShowcaseCursor({
  visible,
  active,
  label = "View project",
}: {
  visible: boolean;
  active: boolean;
  label?: string;
}) {
  const springX = useSpring(0, { stiffness: 280, damping: 30, mass: 0.4 });
  const springY = useSpring(0, { stiffness: 280, damping: 30, mass: 0.4 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      springX.set(e.clientX);
      springY.set(e.clientY);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [springX, springY]);

  if (!visible) return null;

  return (
    <motion.div
      aria-hidden="true"
      style={{
        x: springX,
        y: springY,
        translateX: "-50%",
        translateY: "-50%",
      }}
      className="pointer-events-none fixed left-0 top-0 z-[120] hidden md:block"
    >
      <div
        className={`flex items-center justify-center rounded-full bg-black text-white transition-[width,height] duration-200 ${
          active ? "h-14 w-14" : "h-2 w-2"
        }`}
      >
        {active && (
          <span className="px-1.5 text-center text-[0.5rem] uppercase leading-tight tracking-[0.12em]">
            {label}
          </span>
        )}
      </div>
    </motion.div>
  );
}
