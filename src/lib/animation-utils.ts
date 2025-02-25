"use client"

import type { Transition } from "framer-motion"

export interface AnimationConfig {
  initial: Record<string, any>
  animate: Record<string, any>
  exit: Record<string, any>
  transition: Transition
}

export const pulseAnimation = {
  scale: [1, 1.02, 1],
  transition: {
    duration: 2,
    repeat: Number.POSITIVE_INFINITY,
    ease: "easeInOut",
  },
}

export const glowAnimation = (color: string) => ({
  boxShadow: [`0 0 10px ${color}33`, `0 0 20px ${color}66`, `0 0 10px ${color}33`],
  transition: {
    duration: 2,
    repeat: Number.POSITIVE_INFINITY,
    ease: "easeInOut",
  },
})

export const floatAnimation = {
  y: [0, -10, 0],
  transition: {
    duration: 3,
    repeat: Number.POSITIVE_INFINITY,
    ease: "easeInOut",
  },
}

