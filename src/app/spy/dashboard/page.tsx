"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Globe2, Shield, Target, AlertTriangle, Clock, BarChart3, Network } from "lucide-react"

export default function DashboardPage() {
  const [operationStatus, setOperationStatus] = useState(78)
  const [activeAgents, setActiveAgents] = useState(42)
  const [threatLevel, setThreatLevel] = useState(65)
  const [resourceAllocation, setResourceAllocation] = useState<number[]>([65, 48, 72, 85])
  const [missionProgress, setMissionProgress] = useState<number[]>([])

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setOperationStatus((prev) => Math.min(100, Math.max(0, prev + (Math.random() - 0.5) * 5)))
      setActiveAgents((prev) => Math.floor(Math.max(30, Math.min(50, prev + (Math.random() - 0.5) * 3))))
      setThreatLevel((prev) => Math.min(100, Math.max(0, prev + (Math.random() - 0.5) * 8)))
      setResourceAllocation((prev) =>
        prev.map((value) => Math.min(100, Math.max(0, value + (Math.random() - 0.5) * 5))),
      )
      setMissionProgress(Array.from({ length: 5 }, () => Math.random() * 100))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Strategic Background Pattern */}
      <motion.div
        className="fixed inset-0 opacity-20"
        animate={{
          background: [
            "radial-gradient(circle at 20% 20%, rgba(var(--primary), 0.15) 0%, transparent 70%)",
            "radial-gradient(circle at 80% 80%, rgba(var(--primary), 0.15) 0%, transparent 70%)",
          ],
        }}
        transition={{ duration: 15, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
      />

      <div className="container mx-auto py-8 relative z-10 space-y-6">
        {/* Header Section */}
        <div className="flex flex-col items-center justify-center text-center mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">Strategic Command Center</h1>
            <div className="flex items-center justify-center gap-2">
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                className="w-2 h-2 rounded-full bg-primary"
              />
              <p className="text-lg text-muted-foreground">Global Operations Active</p>
            </div>
          </motion.div>
        </div>

        {/* Main Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Operation Status */}
          <Card className="p-6 relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                <h3 className="text-xl font-semibold">Operation Status</h3>
              </div>
              <motion.div
                animate={{
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                <Badge variant="outline">{Math.round(operationStatus)}% Optimal</Badge>
              </motion.div>
            </div>
            <Progress value={operationStatus} className="mb-4">
              <motion.div
                className="h-full bg-primary"
                animate={{
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              />
            </Progress>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Active Protocols</p>
                <p className="text-lg font-semibold">17/20</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Security Level</p>
                <p className="text-lg font-semibold">Alpha</p>
              </div>
            </div>
          </Card>

          {/* Global Deployment */}
          <Card className="p-6 relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Globe2 className="h-5 w-5" />
                <h3 className="text-xl font-semibold">Global Deployment</h3>
              </div>
              <Badge variant="outline">{activeAgents} Agents</Badge>
            </div>
            <div className="relative h-[150px]">
              <GlobalMap />
            </div>
          </Card>

          {/* Threat Assessment */}
          <Card className="p-6 relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                <h3 className="text-xl font-semibold">Threat Assessment</h3>
              </div>
              <motion.div
                animate={{
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                <Badge variant="outline" className={threatLevel > 75 ? "bg-destructive/10" : ""}>
                  Level {Math.round(threatLevel)}
                </Badge>
              </motion.div>
            </div>
            <div className="space-y-4">
              <ThreatMatrix />
            </div>
          </Card>
        </div>

        {/* Resource Allocation */}
        <Card className="p-6 relative overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              <h3 className="text-xl font-semibold">Resource Allocation</h3>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {resourceAllocation.map((value, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {["Intelligence", "Surveillance", "Operations", "Logistics"][index]}
                  </span>
                  <span>{Math.round(value)}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-primary"
                    animate={{
                      width: `${value}%`,
                      opacity: [0.7, 1, 0.7],
                    }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Mission Timeline */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="p-6 relative overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <h3 className="text-xl font-semibold">Mission Timeline</h3>
              </div>
            </div>
            <div className="space-y-4">
              {missionProgress.map((progress, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      <span className="text-sm">Operation {String.fromCharCode(65 + index)}</span>
                    </div>
                    <Badge variant="outline">{progress < 100 ? "In Progress" : "Complete"}</Badge>
                  </div>
                  <Progress value={progress}>
                    <motion.div
                      className="h-full bg-primary"
                      animate={{
                        opacity: [0.7, 1, 0.7],
                      }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                    />
                  </Progress>
                </div>
              ))}
            </div>
          </Card>

          {/* Intelligence Network */}
          <Card className="p-6 relative overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Network className="h-5 w-5" />
                <h3 className="text-xl font-semibold">Intelligence Network</h3>
              </div>
            </div>
            <div className="relative h-[300px]">
              <IntelligenceNetwork />
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

function GlobalMap() {
  return (
    <div className="absolute inset-0">
      {/* Simulated map points */}
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-primary rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 1, 0.3],
          }}
          transition={{
            duration: Math.random() * 2 + 2,
            repeat: Number.POSITIVE_INFINITY,
            delay: i * 0.2,
          }}
        />
      ))}
      {/* Connection lines */}
      <svg className="absolute inset-0 w-full h-full">
        <motion.path
          d="M0,50 Q50,0 100,50"
          stroke="currentColor"
          strokeWidth="0.5"
          fill="none"
          className="text-primary/20"
          animate={{
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
        />
      </svg>
    </div>
  )
}

function ThreatMatrix() {
  return (
    <div className="grid grid-cols-3 gap-2">
      {Array.from({ length: 9 }).map((_, i) => (
        <motion.div
          key={i}
          className="aspect-square rounded bg-muted/50 relative overflow-hidden"
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: Math.random() * 2 + 1,
            repeat: Number.POSITIVE_INFINITY,
            delay: i * 0.1,
          }}
        >
          <motion.div
            className="absolute inset-0 bg-primary/10"
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: Math.random() * 2 + 2,
              repeat: Number.POSITIVE_INFINITY,
            }}
          />
        </motion.div>
      ))}
    </div>
  )
}

function IntelligenceNetwork() {
  const nodes = Array.from({ length: 8 }, (_, i) => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
  }))

  return (
    <>
      {nodes.map((node, i) =>
        nodes.slice(i + 1).map((target, j) => (
          <motion.div
            key={`${i}-${j}`}
            className="absolute left-0 top-0 h-px bg-primary/20"
            style={{
              width: `${Math.hypot(target.x - node.x, target.y - node.y)}%`,
              left: `${node.x}%`,
              top: `${node.y}%`,
              transformOrigin: "left center",
              transform: `rotate(${Math.atan2(target.y - node.y, target.x - node.x)}rad)`,
            }}
            animate={{
              opacity: [0.1, 0.3, 0.1],
              height: ["1px", "2px", "1px"],
            }}
            transition={{
              duration: Math.random() * 2 + 2,
              repeat: Number.POSITIVE_INFINITY,
            }}
          />
        )),
      )}
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
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: Math.random() * 2 + 1,
            repeat: Number.POSITIVE_INFINITY,
          }}
        />
      ))}
    </>
  )
}

