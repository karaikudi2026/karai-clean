export const motion = {
  duration: {
    instant: 120,
    fast: 220,
    normal: 360,
    slow: 520,
    cinematic: 720,
  },
  easing: {
    standard: [0.4, 0, 0.2, 1] as const,
    decelerate: [0, 0, 0.2, 1] as const,
    accelerate: [0.4, 0, 1, 1] as const,
    emphasize: [0.2, 0.8, 0.2, 1] as const,
  },
  stagger: {
    fast: 50,
    normal: 80,
    slow: 120,
  },
} as const;
