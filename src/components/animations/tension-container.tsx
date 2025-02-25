"use client"

import type React from "react"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface TensionContainerProps {
  children: React.ReactNode
  className?: string
  urgent?: boolean
}

export function TensionContainer({ children, className, urgent = false }: TensionContainerProps) {
  return (
    <motion.div
      className={cn("relative overflow-hidden", urgent && "border-red-500/50", className)}
      whileHover={{
        scale: 1.02,
        transition: { duration: 0.2 },
      }}
      whileTap={{
        scale: 0.98,
        transition: { duration: 0.1 },
      }}
    >
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          background: urgent
            ? [
                "radial-gradient(circle at center, rgba(239, 68, 68, 0.1), transparent 70%)",
                "radial-gradient(circle at center, rgba(239, 68, 68, 0.2), transparent 70%)",
              ]
            : [
                "radial-gradient(circle at center, rgba(var(--primary), 0.1), transparent 70%)",
                "radial-gradient(circle at center, rgba(var(--primary), 0.2), transparent 70%)",
              ],
        }}
        transition={{
          duration: urgent ? 1 : 2,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
      />
      {children}
    </motion.div>
  )
}

