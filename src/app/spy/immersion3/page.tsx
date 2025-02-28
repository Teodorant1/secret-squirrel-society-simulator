"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Eye,
  AlertTriangle,
  Brain,
  Lock,
  FileWarning,
  Radio,
  Network,
} from "lucide-react";

export default function Immersion3Page() {
  const [surveillanceData, setSurveillanceData] = useState<number[]>([]);
  const [threatLevel, setThreatLevel] = useState(Math.random() * 100);
  const [psychData, setPsychData] = useState<number[]>([]);
  const [detectionRisk, setDetectionRisk] = useState(Math.random() * 100);

  useEffect(() => {
    const interval = setInterval(() => {
      setSurveillanceData(
        Array.from({ length: 12 }, () => Math.random() * 100),
      );
      setThreatLevel(Math.random() * 100);
      setPsychData(Array.from({ length: 6 }, () => Math.random() * 100));
      setDetectionRisk(Math.random() * 100);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Ominous Background Pattern */}
      <motion.div
        className="fixed inset-0 opacity-30"
        animate={{
          background: [
            "radial-gradient(circle at 30% 30%, rgba(var(--primary), 0.1) 0%, transparent 60%)",
            "radial-gradient(circle at 70% 70%, rgba(var(--primary), 0.1) 0%, transparent 60%)",
          ],
        }}
        transition={{
          duration: 10,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
      />

      {/* Enhanced Particle Field */}
      <OminousParticleField />

      <div className="container relative z-10 mx-auto space-y-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1 className="mb-4 text-4xl font-bold tracking-tight">
            Deep Surveillance Systems
          </h1>
          <div className="flex items-center justify-center gap-2">
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              className="h-2 w-2 rounded-full bg-primary"
            />
            <p className="text-lg text-muted-foreground">Active Monitoring</p>
          </div>
        </motion.div>

        {/* Threat Assessment Matrix */}
        <Card className="relative overflow-hidden p-6">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              <h3 className="text-xl font-semibold">
                Threat Assessment Matrix
              </h3>
            </div>
            <motion.div
              animate={{
                opacity: [0.5, 1, 0.5],
                scale: [1, 1.05, 1],
              }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            >
              <Badge variant="outline" className="bg-primary/5">
                Threat Level: {Math.floor(threatLevel)}%
              </Badge>
            </motion.div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {Array.from({ length: 9 }).map((_, i) => (
              <motion.div
                key={i}
                className="relative aspect-square overflow-hidden rounded-lg bg-muted/50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.1 }}
              >
                <motion.div
                  className="absolute inset-0 bg-primary/10"
                  animate={{
                    opacity: [0.1, 0.3, 0.1],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: Math.random() * 2 + 2,
                    repeat: Number.POSITIVE_INFINITY,
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    className="h-1 w-1 rounded-full bg-primary"
                    animate={{
                      scale: [1, 2, 1],
                      opacity: [0.3, 1, 0.3],
                    }}
                    transition={{
                      duration: Math.random() * 2 + 1,
                      repeat: Number.POSITIVE_INFINITY,
                    }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Psychological Profile Analyzer */}
          <Card className="relative overflow-hidden p-6">
            <div className="mb-6 flex items-center gap-2">
              <Brain className="h-5 w-5" />
              <h3 className="text-xl font-semibold">Psychological Analysis</h3>
            </div>
            <div className="space-y-4">
              {psychData.map((value, index) => (
                <motion.div
                  key={index}
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Pattern {index + 1}
                    </span>
                    <span>{Math.floor(value)}%</span>
                  </div>
                  <div className="h-1 overflow-hidden rounded-full bg-muted">
                    <motion.div
                      className="h-full bg-primary"
                      animate={{
                        width: [`${value}%`, `${Math.random() * 100}%`],
                      }}
                      transition={{
                        duration: Math.random() * 2 + 2,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "reverse",
                      }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>

          {/* Infiltration Progress */}
          <Card className="relative overflow-hidden p-6">
            <div className="mb-6 flex items-center gap-2">
              <Lock className="h-5 w-5" />
              <h3 className="text-xl font-semibold">System Infiltration</h3>
            </div>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <Badge variant="outline">Detection Risk</Badge>
                <motion.span
                  className="text-sm"
                  animate={{
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                >
                  {Math.floor(detectionRisk)}%
                </motion.span>
              </div>
              <Progress value={detectionRisk}>
                <motion.div
                  className="h-full bg-primary"
                  animate={{
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                />
              </Progress>
              <div className="grid grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="flex items-center justify-between rounded-lg bg-muted/50 p-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.2 }}
                  >
                    <FileWarning className="h-4 w-4" />
                    <motion.div
                      animate={{
                        opacity: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: Math.random() * 2 + 1,
                        repeat: Number.POSITIVE_INFINITY,
                      }}
                      className="h-1 w-1 rounded-full bg-primary"
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Surveillance Grid */}
        <Card className="relative overflow-hidden p-6">
          <div className="mb-6 flex items-center gap-2">
            <Eye className="h-5 w-5" />
            <h3 className="text-xl font-semibold">Surveillance Grid</h3>
          </div>
          <div className="relative grid grid-cols-4 gap-4">
            {surveillanceData.map((value, index) => (
              <motion.div
                key={index}
                className="relative aspect-square overflow-hidden rounded-lg bg-muted/50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <motion.div
                  className="absolute inset-0"
                  animate={{
                    background: [
                      "radial-gradient(circle at 30% 30%, rgba(var(--primary), 0.1) 0%, transparent 70%)",
                      "radial-gradient(circle at 70% 70%, rgba(var(--primary), 0.1) 0%, transparent 70%)",
                    ],
                  }}
                  transition={{
                    duration: Math.random() * 4 + 2,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                  }}
                />
                <motion.div
                  className="absolute inset-0 border border-primary/20"
                  animate={{
                    opacity: [0.2, 0.5, 0.2],
                  }}
                  transition={{
                    duration: Math.random() * 2 + 1,
                    repeat: Number.POSITIVE_INFINITY,
                  }}
                />
                <motion.div
                  className="absolute right-2 top-2 h-1 w-1 rounded-full bg-primary"
                  animate={{
                    opacity: [0.3, 1, 0.3],
                    scale: [1, 1.5, 1],
                  }}
                  transition={{
                    duration: Math.random() * 2 + 1,
                    repeat: Number.POSITIVE_INFINITY,
                  }}
                />
              </motion.div>
            ))}
          </div>
        </Card>

        {/* Network Intrusion Monitor */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="relative overflow-hidden p-6">
            <div className="mb-6 flex items-center gap-2">
              <Network className="h-5 w-5" />
              <h3 className="text-xl font-semibold">Network Intrusion</h3>
            </div>
            <div className="relative h-[200px]">
              <NetworkNodes />
            </div>
          </Card>

          {/* Signal Interference */}
          <Card className="relative overflow-hidden p-6">
            <div className="mb-6 flex items-center gap-2">
              <Radio className="h-5 w-5" />
              <h3 className="text-xl font-semibold">Signal Interference</h3>
            </div>
            <div className="flex h-[200px] items-center justify-center">
              <SignalWaves />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function OminousParticleField() {
  return (
    <div className="pointer-events-none fixed inset-0">
      {Array.from({ length: 50 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-0.5 w-0.5 rounded-full bg-primary/10"
          initial={{
            x: Math.random(),
            y: Math.random(),
            scale: Math.random() * 0.5 + 0.5,
          }}
          animate={{
            x: Math.random(),
            y: Math.random(),
            scale: [1, Math.random() * 2 + 1, 1],
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
    </div>
  );
}

function NetworkNodes() {
  const nodes = Array.from({ length: 6 }, (_, i) => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
  }));

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
          className="absolute h-2 w-2 rounded-full bg-primary"
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
  );
}

function SignalWaves() {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="w-1 rounded-full bg-primary"
          animate={{
            height: [10, Math.random() * 80 + 20, 10],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: Math.random() * 2 + 1,
            repeat: Number.POSITIVE_INFINITY,
            delay: i * 0.1,
          }}
        />
      ))}
    </div>
  );
}
