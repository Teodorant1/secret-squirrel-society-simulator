"use client"

import type React from "react"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface FireTextProps {
  children: React.ReactNode
  className?: string
}

export function FireText({ children, className }: FireTextProps) {
  return (
    <div className={cn("relative inline-block", className)}>
      <motion.div
        className="absolute inset-0 blur-sm"
        animate={{
          opacity: [0.5, 0.8, 0.5],
          filter: ["blur(4px) brightness(1.5)", "blur(8px) brightness(2)", "blur(4px) brightness(1.5)"],
        }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      >
        {children}
      </motion.div>
      <span className="relative z-10">{children}</span>
    </div>
  )
}

