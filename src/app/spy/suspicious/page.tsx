"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle, Binary, Fingerprint, Scan, Wand2, Zap, Radar } from "lucide-react"

export default function SuspiciousPage() {
  const [quantumState, setQuantumState] = useState<number[]>([])
  const [anomalyLevel, setAnomalyLevel] = useState(0)
  const [countdown, setCountdown] = useState(300)
  const [dnaSequence, setDnaSequence] = useState("")
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    // Generate quantum fluctuations
    const interval = setInterval(() => {
      setQuantumState(Array.from({ length: 32 }, () => Math.random()))
      setAnomalyLevel(Math.random() * 100)
      setDnaSequence(generateMysteriousSequence())
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    // Countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 300))
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    // Reality distortion effect
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let frame = 0
    const particles: Array<{ x: number; y: number; vx: number; vy: number }> = []

    const animate = () => {
      frame++
      if (!ctx || !canvas) return

      ctx.fillStyle = "rgba(0, 0, 0, 0.1)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Update and draw particles
      particles.forEach((particle, i) => {
        particle.x += particle.vx
        particle.y += particle.vy

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1

        const alpha = Math.sin(frame * 0.01 + i) * 0.5 + 0.5
        ctx.fillStyle = `rgba(var(--primary), ${alpha})`
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, 1, 0, Math.PI * 2)
        ctx.fill()
      })

      requestAnimationFrame(animate)
    }

    // Initialize particles
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
      })
    }

    animate()
  }, [])

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Reality Distortion Background */}
      <canvas ref={canvasRef} className="fixed inset-0 w-full h-full opacity-30" width={1920} height={1080} />

      <div className="container mx-auto py-12 relative z-10 space-y-6">
        {/* Mysterious Header */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center space-y-4">
          <motion.h1
            className="text-4xl font-bold tracking-tight"
            animate={{
              textShadow: [
                "0 0 0px rgba(var(--primary), 0)",
                "0 0 10px rgba(var(--primary), 0.5)",
                "0 0 0px rgba(var(--primary), 0)",
              ],
            }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          >
            [CLASSIFIED OBSERVATION UNIT]
          </motion.h1>
          <div className="flex items-center justify-center gap-2">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            >
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </motion.div>
            <p className="text-lg text-muted-foreground">Anomaly Detection Active</p>
          </div>
        </motion.div>

        {/* Quantum Encryption Visualizer */}
        <Card className="p-6 relative overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Binary className="h-5 w-5" />
              <h3 className="text-xl font-semibold">Quantum State Observer</h3>
            </div>
            <Badge variant="outline" className="bg-primary/5">
              Coherence: {Math.round(Math.random() * 100)}%
            </Badge>
          </div>
          <div className="grid grid-cols-8 gap-1 h-32">
            {quantumState.map((value, i) => (
              <motion.div
                key={i}
                className="bg-primary/20 rounded-sm"
                animate={{
                  height: `${value * 100}%`,
                  opacity: [0.3, 0.7, 0.3],
                }}
                transition={{
                  duration: Math.random() * 2 + 1,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "mirror",
                }}
              />
            ))}
          </div>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          {/* DNA Sequence Analyzer */}
          <Card className="p-6 relative overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Scan className="h-5 w-5" />
                <h3 className="text-xl font-semibold">Pattern Analysis</h3>
              </div>
            </div>
            <div className="font-mono text-sm overflow-hidden relative h-[200px]">
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                animate={{
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                {dnaSequence.split("").map((char, i) => (
                  <motion.span
                    key={i}
                    className="inline-block"
                    animate={{
                      opacity: [0.3, 1, 0.3],
                      color: ["rgba(var(--primary), 0.5)", "rgba(var(--primary), 1)", "rgba(var(--primary), 0.5)"],
                    }}
                    transition={{
                      duration: Math.random() * 2 + 1,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: i * 0.1,
                    }}
                  >
                    {char}
                  </motion.span>
                ))}
              </motion.div>
            </div>
          </Card>

          {/* Reality Distortion Monitor */}
          <Card className="p-6 relative overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Wand2 className="h-5 w-5" />
                <h3 className="text-xl font-semibold">Reality Coherence</h3>
              </div>
            </div>
            <div className="relative h-[200px]">
              <RealityDistortionField />
            </div>
          </Card>
        </div>

        {/* Anomaly Detection System */}
        <Card className="p-6 relative overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              <h3 className="text-xl font-semibold">Anomaly Detection</h3>
            </div>
            <motion.div
              animate={{
                opacity: [0.5, 1, 0.5],
              }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
            >
              <Badge variant="outline" className={anomalyLevel > 75 ? "bg-destructive/10" : ""}>
                Level {Math.round(anomalyLevel)}
              </Badge>
            </motion.div>
          </div>
          <div className="space-y-4">
            <Progress value={anomalyLevel}>
              <motion.div
                className="h-full bg-primary"
                animate={{
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              />
            </Progress>
            <div className="grid grid-cols-3 gap-2">
              {Array.from({ length: 9 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="aspect-square rounded bg-primary/10 relative overflow-hidden"
                  animate={{
                    opacity: [0.3, 0.7, 0.3],
                  }}
                  transition={{
                    duration: Math.random() * 2 + 1,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: i * 0.2,
                  }}
                >
                  <motion.div
                    className="absolute inset-0 bg-primary/5"
                    animate={{
                      scale: [1, 1.5, 1],
                      rotate: [0, 180, 0],
                    }}
                    transition={{
                      duration: Math.random() * 4 + 2,
                      repeat: Number.POSITIVE_INFINITY,
                    }}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </Card>

        {/* Shadow Proximity Detector */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="p-6 relative overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Radar className="h-5 w-5" />
                <h3 className="text-xl font-semibold">Shadow Detection</h3>
              </div>
            </div>
            <div className="relative h-[200px]">
              <ShadowDetector />
            </div>
          </Card>

          {/* Mysterious Countdown */}
          <Card className="p-6 relative overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Fingerprint className="h-5 w-5" />
                <h3 className="text-xl font-semibold">Protocol Timer</h3>
              </div>
            </div>
            <div className="flex items-center justify-center h-[200px]">
              <motion.div
                className="text-6xl font-mono"
                animate={{
                  opacity: [0.5, 1, 0.5],
                  textShadow: [
                    "0 0 20px rgba(var(--primary), 0.3)",
                    "0 0 40px rgba(var(--primary), 0.6)",
                    "0 0 20px rgba(var(--primary), 0.3)",
                  ],
                }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                {formatTime(countdown)}
              </motion.div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

function RealityDistortionField() {
  return (
    <div className="absolute inset-0">
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-full h-full border border-primary/20 rounded-full"
          style={{
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
          }}
          animate={{
            scale: [0, 1],
            opacity: [1, 0],
            rotate: [0, 360],
          }}
          transition={{
            duration: 4,
            repeat: Number.POSITIVE_INFINITY,
            delay: i * 0.2,
            ease: "linear",
          }}
        />
      ))}
    </div>
  )
}

function ShadowDetector() {
  return (
    <div className="absolute inset-0">
      <motion.div
        className="absolute w-full h-full"
        animate={{
          background: [
            "radial-gradient(circle at 30% 30%, rgba(var(--primary), 0.1) 0%, transparent 60%)",
            "radial-gradient(circle at 70% 70%, rgba(var(--primary), 0.1) 0%, transparent 60%)",
          ],
        }}
        transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
      />
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-primary/50 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            opacity: [0.2, 1, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: Math.random() * 2 + 2,
            repeat: Number.POSITIVE_INFINITY,
            delay: i * 0.5,
          }}
        />
      ))}
    </div>
  )
}

function generateMysteriousSequence() {
  const characters = "ACGT[]{}<>?!@#$%^&*"
  return Array.from({ length: 32 }, () => characters[Math.floor(Math.random() * characters.length)]).join("")
}

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
}

