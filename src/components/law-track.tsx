"use client"

import { motion } from "framer-motion"
import { Scale } from "lucide-react"
import { Skull } from "lucide-react"
import { GlitchText } from "@/components/ui/glitch-text"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

interface LawTrackProps {
  type: "liberal" | "fascist"
  current: number
  total: number
  powers: Array<{ threshold: number; description: string }>
  emergencyLevel: number
}

function LawTrack({ type, current, total, powers, emergencyLevel }: LawTrackProps) {
  const isLiberal = type === "liberal"
  const isNearVictory = current >= total - 1

  return (
    <Card className="p-4">
      <motion.div
        className="space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h3
          className="font-semibold flex items-center gap-2"
          animate={{
            color: isNearVictory
              ? isLiberal
                ? ["#3b82f6", "#60a5fa", "#3b82f6"]
                : ["#ef4444", "#f87171", "#ef4444"]
              : "currentColor",
          }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        >
          {isLiberal ? <Scale className="h-4 w-4 text-blue-500" /> : <Skull className="h-4 w-4 text-red-500" />}
          <GlitchText>{isLiberal ? "Liberal" : "Fascist"} Track</GlitchText>
        </motion.h3>

        <motion.div
          animate={{
            scale: isNearVictory ? [1, 1.02, 1] : 1,
          }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
        >
          <Progress
            value={(current / total) * 100}
            className={cn(isLiberal ? "bg-blue-200" : "bg-red-200", "transition-all duration-1000")}
          />
        </motion.div>

        <div className="space-y-2">
          {powers.map((power, index) => (
            <motion.div
              key={index}
              className={cn(
                "p-2 rounded-md",
                current >= power.threshold ? (isLiberal ? "bg-blue-500/10" : "bg-red-500/10") : "bg-muted",
              )}
              whileHover={{
                scale: 1.02,
                transition: { duration: 0.2 },
              }}
              whileTap={{
                scale: 0.98,
                transition: { duration: 0.1 },
              }}
              animate={
                current === power.threshold - 1 && emergencyLevel >= 1
                  ? {
                      x: [-2, 2, -2, 2, 0],
                      transition: {
                        duration: 0.5,
                        repeat: Number.POSITIVE_INFINITY,
                      },
                    }
                  : {}
              }
            >
              <motion.p
                className="text-sm"
                animate={
                  current >= power.threshold
                    ? {
                        textShadow: isLiberal ? "0 0 8px rgba(59, 130, 246, 0.5)" : "0 0 8px rgba(239, 68, 68, 0.5)",
                      }
                    : {}
                }
              >
                {power.threshold} Laws: {power.description}
              </motion.p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </Card>
  )
}

