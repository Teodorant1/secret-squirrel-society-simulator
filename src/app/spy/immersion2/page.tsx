"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Satellite, Brain, Radio, Users, Target, Shield, Activity, Network } from "lucide-react"

export default function Immersion2Page() {
  const [satelliteData, setSatelliteData] = useState<number[]>([])
  const [neuralActivity, setNeuralActivity] = useState<number[]>([])
  const [commsSignal, setCommsSignal] = useState<number[]>([])

  useEffect(() => {
    // Generate random data for animations
    const interval = setInterval(() => {
      setSatelliteData(Array.from({ length: 10 }, () => Math.random() * 100))
      setNeuralActivity(Array.from({ length: 8 }, () => Math.random() * 100))
      setCommsSignal(Array.from({ length: 12 }, () => Math.random() * 100))
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Dynamic Background Pattern */}
      <div className="fixed inset-0 pointer-events-none">
        <DynamicBackground />
      </div>

      <div className="container mx-auto py-12 relative z-10 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold tracking-tight mb-4">Advanced Monitoring Systems</h1>
          <p className="text-lg text-muted-foreground">Real-time surveillance and analysis</p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Satellite Tracking */}
          <Card className="p-6 relative overflow-hidden">
            <div className="flex items-center gap-2 mb-6">
              <Satellite className="h-5 w-5" />
              <h3 className="text-xl font-semibold">Satellite Network</h3>
            </div>
            <div className="relative h-[200px]">
              <motion.div
                className="absolute inset-0"
                animate={{
                  background: [
                    "radial-gradient(circle at 30% 30%, rgba(var(--primary), 0.1) 0%, transparent 50%)",
                    "radial-gradient(circle at 70% 70%, rgba(var(--primary), 0.1) 0%, transparent 50%)",
                  ],
                }}
                transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
              />
              {satelliteData.map((value, index) => (
                <motion.div
                  key={index}
                  className="absolute w-1 h-1 bg-primary rounded-full"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.3, 1, 0.3],
                  }}
                  transition={{
                    duration: Math.random() * 2 + 1,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: index * 0.2,
                  }}
                  style={{
                    left: `${(index / satelliteData.length) * 100}%`,
                    top: `${value}%`,
                  }}
                />
              ))}
            </div>
          </Card>

          {/* Neural Network Analysis */}
          <Card className="p-6 relative overflow-hidden">
            <div className="flex items-center gap-2 mb-6">
              <Brain className="h-5 w-5" />
              <h3 className="text-xl font-semibold">Neural Analysis</h3>
            </div>
            <div className="space-y-4">
              {neuralActivity.map((value, index) => (
                <motion.div
                  key={index}
                  className="relative h-1 bg-muted rounded-full overflow-hidden"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <motion.div
                    className="absolute inset-y-0 left-0 bg-primary"
                    animate={{
                      width: [`${value}%`, `${Math.random() * 100}%`],
                    }}
                    transition={{
                      duration: Math.random() * 2 + 1,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "reverse",
                    }}
                  />
                </motion.div>
              ))}
            </div>
          </Card>
        </div>

        {/* Secure Communications */}
        <Card className="p-6 relative overflow-hidden">
          <div className="flex items-center gap-2 mb-6">
            <Radio className="h-5 w-5" />
            <h3 className="text-xl font-semibold">Secure Communications</h3>
          </div>
          <div className="h-32 flex items-center justify-center gap-1">
            {commsSignal.map((value, index) => (
              <motion.div
                key={index}
                className="w-1 bg-primary rounded-full"
                animate={{
                  height: [4, value, 4],
                }}
                transition={{
                  duration: Math.random() * 2 + 1,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                  delay: index * 0.1,
                }}
              />
            ))}
          </div>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Personnel Database */}
          <Card className="p-6 relative overflow-hidden">
            <div className="flex items-center gap-2 mb-6">
              <Users className="h-5 w-5" />
              <h3 className="text-xl font-semibold">Personnel Database</h3>
            </div>
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-4 p-3 rounded-lg bg-muted/50"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <motion.div
                    className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center"
                    animate={{
                      scale: [1, 1.1, 1],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: Math.random() * 2 + 1,
                      repeat: Number.POSITIVE_INFINITY,
                    }}
                  >
                    <Shield className="h-4 w-4" />
                  </motion.div>
                  <div className="flex-1">
                    <div className="h-2 w-24 bg-primary/20 rounded-full" />
                  </div>
                  <Badge variant="outline">{["Active", "Standby", "Training", "Deployed"][index]}</Badge>
                </motion.div>
              ))}
            </div>
          </Card>

          {/* Mission Status */}
          <Card className="p-6 relative overflow-hidden">
            <div className="flex items-center gap-2 mb-6">
              <Target className="h-5 w-5" />
              <h3 className="text-xl font-semibold">Mission Status</h3>
            </div>
            <div className="space-y-6">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4" />
                      <span className="text-sm">Operation {String.fromCharCode(65 + index)}</span>
                    </div>
                    <Badge variant="outline">{["In Progress", "Planning", "Complete"][index]}</Badge>
                  </div>
                  <Progress value={Math.random() * 100}>
                    <motion.div
                      className="h-full bg-primary"
                      animate={{
                        opacity: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: Math.random() * 2 + 1,
                        repeat: Number.POSITIVE_INFINITY,
                      }}
                    />
                  </Progress>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Network Analysis */}
        <Card className="p-6 relative overflow-hidden">
          <div className="flex items-center gap-2 mb-6">
            <Network className="h-5 w-5" />
            <h3 className="text-xl font-semibold">Network Analysis</h3>
          </div>
          <div className="relative h-[200px]">
            <NetworkGraph />
          </div>
        </Card>
      </div>
    </div>
  )
}

function DynamicBackground() {
  return (
    <>
      {Array.from({ length: 50 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-0.5 h-0.5 bg-primary/10 rounded-full"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            scale: Math.random() * 0.5 + 0.5,
          }}
          animate={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            scale: [1, Math.random() * 1.5 + 0.5, 1],
          }}
          transition={{
            duration: Math.random() * 20 + 10,
            repeat: Number.POSITIVE_INFINITY,
            scale: {
              duration: Math.random() * 2 + 1,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            },
          }}
        />
      ))}
    </>
  )
}

function NetworkGraph() {
  const nodes = Array.from({ length: 8 }, (_, i) => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
  }))

  return (
    <>
      {/* Connection Lines */}
      {nodes.map((node, i) =>
        nodes.slice(i + 1).map((target, j) => (
          <motion.div
            key={`${i}-${j}`}
            className="absolute left-0 top-0 w-full h-0.5 bg-primary/10 origin-left"
            style={{
              left: `${node.x}%`,
              top: `${node.y}%`,
              width: `${Math.hypot(target.x - node.x, target.y - node.y)}%`,
              transform: `rotate(${Math.atan2(target.y - node.y, target.x - node.x)}rad)`,
            }}
            animate={{
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: Math.random() * 2 + 1,
              repeat: Number.POSITIVE_INFINITY,
            }}
          />
        )),
      )}

      {/* Nodes */}
      {nodes.map((node, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-primary rounded-full"
          style={{
            left: `${node.x}%`,
            top: `${node.y}%`,
            transform: "translate(-50%, -50%)",
          }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 1, 0.3],
          }}
          transition={{
            duration: Math.random() * 2 + 1,
            repeat: Number.POSITIVE_INFINITY,
            delay: i * 0.2,
          }}
        />
      ))}
    </>
  )
}

