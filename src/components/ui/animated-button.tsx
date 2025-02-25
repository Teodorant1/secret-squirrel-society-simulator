"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const themeAnimations = {
  got: {
    hover: {
      scale: 1.05,
      textShadow: "0 0 8px rgb(255,100,0)",
      boxShadow: "0 0 15px rgb(255,100,0)",
    },
    tap: { scale: 0.95 },
  },
  bond: {
    hover: {
      scale: 1.02,
      transition: { duration: 0.2 },
      boxShadow: "0 0 20px rgba(255,255,255,0.3)",
    },
    tap: { scale: 0.98 },
  },
  wendigoon: {
    hover: {
      scale: 1.05,
      rotate: [-1, 1],
      transition: {
        rotate: {
          repeat: Number.POSITIVE_INFINITY,
          duration: 0.2,
        },
      },
    },
    tap: { scale: 0.95 },
  },
  vucic: {
    hover: {
      scale: 1.1,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
    tap: { scale: 0.9 },
  },
  trump: {
    hover: {
      scale: 1.05,
      x: [0, -2, 2, -2, 0],
      transition: {
        x: {
          repeat: Number.POSITIVE_INFINITY,
          duration: 0.3,
        },
      },
    },
    tap: { scale: 0.95 },
  },
  dei: {
    hover: {
      scale: 1.05,
      rotate: [0, -1, 1, -1, 0],
      transition: {
        rotate: {
          repeat: Number.POSITIVE_INFINITY,
          duration: 0.5,
        },
      },
    },
    tap: { scale: 0.95 },
  },
  eve: {
    hover: {
      scale: 1.05,
      boxShadow: ["0 0 10px rgba(0,255,255,0.5)", "0 0 20px rgba(0,255,255,0.3)", "0 0 10px rgba(0,255,255,0.5)"],
      transition: {
        boxShadow: {
          repeat: Number.POSITIVE_INFINITY,
          duration: 1,
        },
      },
    },
    tap: { scale: 0.95 },
  },
}

export interface AnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  theme?: keyof typeof themeAnimations
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
}

const AnimatedButton = React.forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ className, theme = "default", variant, children, ...props }, ref) => {
    const animations = themeAnimations[theme as keyof typeof themeAnimations] || {
      hover: { scale: 1.02 },
      tap: { scale: 0.98 },
    }

    return (
      <motion.div whileHover={animations.hover} whileTap={animations.tap}>
        <Button ref={ref} variant={variant} className={cn("relative overflow-hidden", className)} {...props}>
          {children}
          <motion.div
            className="absolute inset-0 bg-white/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
          />
        </Button>
      </motion.div>
    )
  },
)
AnimatedButton.displayName = "AnimatedButton"

export { AnimatedButton }

