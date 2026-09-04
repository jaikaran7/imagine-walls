"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { easeEditorial } from "@/lib/motion";
import { useReducedMotion } from "@/components/motion/use-reduced-motion";

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const reduced = useReducedMotion();

  if (reduced) return <>{children}</>;

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35, ease: easeEditorial }}
    >
      {children}
    </motion.div>
  );
}
