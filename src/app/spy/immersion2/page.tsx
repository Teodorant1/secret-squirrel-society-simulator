"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Satellite,
  Brain,
  Radio,
  Users,
  Target,
  Shield,
  Activity,
  Network,
} from "lucide-react";

export default function Immersion2Page() {
  return (
    <div className="relative min-h-screen bg-background">
      {/* Dynamic Background Pattern */}
      <div className="pointer-events-none fixed inset-0">
        <DynamicBackground />
      </div>

      <div className="container relative z-10 mx-auto space-y-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8 text-center"
        >
          <h1 className="mb-4 text-4xl font-bold tracking-tight">
            Advanced Monitoring Systems
          </h1>
          <p className="text-lg text-muted-foreground">
            Real-time surveillance and analysis
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Satellite Tracking */}
          <Card className="relative overflow-hidden p-6">
            <div className="mb-6 flex items-center gap-2">
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
                transition={{
                  duration: 10,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                }}
              />
              <div className="absolute inset-0 flex flex-wrap items-center justify-around">
                {Array.from({ length: 10 }).map((_, index) => (
                  <motion.div
                    key={index}
                    className="absolute h-1 w-1 rounded-full bg-primary"
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
                      left: `${(index / 10) * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                  />
                ))}
              </div>
            </div>
          </Card>

          {/* Neural Network Analysis */}
          <Card className="relative overflow-hidden p-6">
            <div className="mb-6 flex items-center gap-2">
              <Brain className="h-5 w-5" />
              <h3 className="text-xl font-semibold">Neural Analysis</h3>
            </div>
            <div className="space-y-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <motion.div
                  key={index}
                  className="relative h-1 overflow-hidden rounded-full bg-muted"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <motion.div
                    className="absolute inset-y-0 left-0 bg-primary"
                    animate={{
                      width: [
                        `${Math.random() * 100}%`,
                        `${Math.random() * 100}%`,
                      ],
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
        <Card className="relative overflow-hidden p-6">
          <div className="mb-6 flex items-center gap-2">
            <Radio className="h-5 w-5" />
            <h3 className="text-xl font-semibold">Secure Communications</h3>
          </div>
          <div className="flex h-32 items-center justify-center gap-1">
            {Array.from({ length: 12 }).map((_, index) => (
              <motion.div
                key={index}
                className="w-1 rounded-full bg-primary"
                animate={{
                  height: [4, Math.random() * 100, 4],
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
          <Card className="relative overflow-hidden p-6">
            <div className="mb-6 flex items-center gap-2">
              <Users className="h-5 w-5" />
              <h3 className="text-xl font-semibold">Personnel Database</h3>
            </div>
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-4 rounded-lg bg-muted/50 p-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <motion.div
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20"
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
                    <div className="h-2 w-24 rounded-full bg-primary/20" />
                  </div>
                  <Badge variant="outline">
                    {["Active", "Standby", "Training", "Deployed"][index]}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </Card>

          {/* Mission Status */}
          <Card className="relative overflow-hidden p-6">
            <div className="mb-6 flex items-center gap-2">
              <Target className="h-5 w-5" />
              <h3 className="text-xl font-semibold">Mission Status</h3>
            </div>
            <div className="space-y-6">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4" />
                      <span className="text-sm">
                        Operation {String.fromCharCode(65 + index)}
                      </span>
                    </div>
                    <Badge variant="outline">
                      {["In Progress", "Planning", "Complete"][index]}
                    </Badge>
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
        <Card className="relative overflow-hidden p-6">
          <div className="mb-6 flex items-center gap-2">
            <Network className="h-5 w-5" />
            <h3 className="text-xl font-semibold">Network Analysis</h3>
          </div>
          <div className="relative h-[200px]">
            <NetworkGraph />
          </div>
        </Card>
      </div>
    </div>
  );
}

function DynamicBackground() {
  return (
    <>
      {Array.from({ length: 50 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-0.5 w-0.5 rounded-full bg-primary/10"
          initial={{
            x: Math.random() * 100 + "%",
            y: Math.random() * 100 + "%",
            scale: Math.random() * 0.5 + 0.5,
          }}
          animate={{
            x: `${Math.random() * 100}%`,
            y: `${Math.random() * 100}%`,
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
  );
}

function NetworkGraph() {
  const nodes = Array.from({ length: 8 }, (_, i) => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
  }));

  return (
    <>
      {/* Connection Lines */}
      {nodes.map((node, i) =>
        nodes.slice(i + 1).map((target, j) => (
          <motion.div
            key={`${i}-${j}`}
            className="absolute left-0 top-0 h-0.5 w-full origin-left bg-primary/10"
            style={{
              left: `${(node.x / 100) * 100}%`,
              top: `${(node.y / 100) * 100}%`,
              width: `${Math.abs(target.x - node.x)}%`,
              height: `${Math.abs(target.y - node.y)}%`,
              transformOrigin: `${node.x}% ${node.y}%`,
              transform: `rotate(${(Math.atan2(target.y - node.y, target.x - node.x) * 180) / Math.PI}deg)`,
            }}
          />
        )),
      )}
      {/* Nodes */}
      {nodes.map((node, i) => (
        <motion.div
          key={i}
          className="absolute h-2 w-2 rounded-full bg-primary"
          style={{
            left: `${(node.x / 100) * 100}%`,
            top: `${(node.y / 100) * 100}%`,
          }}
        />
      ))}
    </>
  );
}
