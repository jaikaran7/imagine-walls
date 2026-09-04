export const easeEditorial = [0.16, 1, 0.3, 1] as const;

export const duration = {
  fast: 0.2,
  ui: 0.28,
  reveal: 0.7,
  image: 1.1,
  cinematic: 1.4,
} as const;

export const imageMotionVariants = {
  clipUp: {
    hidden: { clipPath: "inset(100% 0 0 0)" },
    visible: { clipPath: "inset(0% 0 0 0)" },
  },
  clipLeft: {
    hidden: { clipPath: "inset(0 100% 0 0)" },
    visible: { clipPath: "inset(0 0% 0 0)" },
  },
  scale: {
    hidden: { scale: 1.1, opacity: 0.85 },
    visible: { scale: 1, opacity: 1 },
  },
  maskWipe: {
    hidden: { clipPath: "inset(0 100% 0 0)" },
    visible: { clipPath: "inset(0 0% 0 0)" },
  },
} as const;
