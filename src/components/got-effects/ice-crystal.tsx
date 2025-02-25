"use client"

import { motion } from "framer-motion"

interface IceCrystalProps {
  x: number
  y: number
  size?: number
}

export function IceCrystal({ x, y, size = 20 }: IceCrystalProps) {
  return (
    <motion.div
      className="absolute"
      style={{ left: x, top: y }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 1, 0],
        scale: [0.8, 1.2, 0.8],
        rotate: [0, 45, 0],
      }}
      transition={{
        duration: 3,
        ease: "easeInOut",
        repeat: Number.POSITIVE_INFINITY,
      }}
    >
      <svg width={size} height={size} viewBox="0 0 100 100" className="text-blue-200/30">
        <path d="M50 0 L100 50 L50 100 L0 50 Z" fill="currentColor" />
      </svg>
    </motion.div>
  )
}

