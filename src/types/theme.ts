"use client"

import type { MotionValue } from "framer-motion"

export interface ThemeConfig {
  name: string
  primary: string
  background: string
  accent: string
  animation: {
    background: {
      animate: Record<string, string[] | MotionValue>
      transition: {
        duration: number
        repeat: number
        repeatType: "reverse" | "loop" | "mirror"
      }
    }
    text?: {
      animate: Record<string, string[]>
      transition: {
        duration: number
        repeat: number
      }
    }
  }
}

