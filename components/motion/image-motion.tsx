"use client";

import { motion, type MotionProps } from "framer-motion";
import type { ReactNode } from "react";
import { easeEditorial, duration } from "@/lib/motion";
import { useReducedMotion } from "./use-reduced-motion";

type MotionVariant = "clipUp" | "clipLeft" | "scale" | "maskWipe" | "none";

const variants = {
  clipUp: {
    hidden: { clipPath: "inset(100% 0 0 0)" },
    visible: { clipPath: "inset(0% 0 0 0)" },
  },
  clipLeft: {
    hidden: { clipPath: "inset(0 100% 0 0)" },
    visible: { clipPath: "inset(0 0% 0 0)" },
  },
  scale: {
    hidden: { scale: 1.1 },
    visible: { scale: 1 },
  },
  maskWipe: {
    hidden: { clipPath: "inset(0 100% 0 0)" },
    visible: { clipPath: "inset(0 0% 0 0)" },
  },
  none: {
    hidden: {},
    visible: {},
  },
} as const;

export function ImageMotion({
  children,
  variant = "clipUp",
  delay = 0,
  className,
  durationMs = duration.image,
  once = true,
  ...props
}: {
  children: ReactNode;
  variant?: MotionVariant;
  delay?: number;
  className?: string;
  durationMs?: number;
  once?: boolean;
} & Omit<MotionProps, "children">) {
  const reduced = useReducedMotion();

  if (reduced || variant === "none") {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "0px 0px -5% 0px", amount: 0.05 }}
      variants={variants[variant]}
      transition={{ duration: durationMs, delay, ease: easeEditorial }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}
