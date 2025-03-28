"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Fingerprint, Activity, Radio, Map, Terminal } from "lucide-react";

export default function ImmersionPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [decryptedText, setDecryptedText] = useState("");
  const [authStage, setAuthStage] = useState(0);
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const targetText =
    "INTERCEPTED MESSAGE: Operation status confirmed. Assets in position. Awaiting further instructions.";

  // useEffect(() => {
  //   const handleMouseMove = (e: MouseEvent) => {
  //     setMousePosition({ x: e.clientX, y: e.clientY });
  //   };
  //   window.addEventListener("mousemove", handleMouseMove);
  //   return () => window.removeEventListener("mousemove", handleMouseMove);
  // }, []);

  useEffect(() => {
    let currentIndex = 0;
    const scrambleInterval = setInterval(() => {
      if (currentIndex <= targetText.length) {
        setDecryptedText(targetText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(scrambleInterval);
      }
    }, 50);

    return () => clearInterval(scrambleInterval);
  }, []);

  useEffect(() => {
    const stages = [
      "Initiating biometric scan...",
      "Verifying credentials...",
      "Checking security clearance...",
      "Validating access level...",
      "Authorization complete.",
    ];

    let currentStage = 0;
    const stageInterval = setInterval(() => {
      if (currentStage < stages.length) {
        setAuthStage(currentStage);
        currentStage++;
      } else {
        clearInterval(stageInterval);
      }
    }, 1500);

    return () => clearInterval(stageInterval);
  }, []);

  useEffect(() => {
    // const lines = [
    //   "> Establishing secure connection...",
    //   "> Encryption protocols active",
    //   "> Terminal access granted",
    //   "> System ready",
    // ];
    const lines = [
      "Booting up the system...",
      "█ Initializing kernel ████...",
      "SYSTEM CHECK: [OK]",
      "Loading security protocols...",
      "Initiating biometric scan...",
      "███ ERROR ███ Retrying...",
      "Verifying credentials...",
      "Credentials corrupted. Restoring backup...",
      "Reattempting authentication...",
      "Checking security clearance...",
      "██ WARNING ██ Unusual activity detected.",
      "█████ SYSTEM OVERRIDE █████",
      "Validating access level...",
      "███ CRITICAL FAILURE ███ Connection lost...",
      "Re-establishing secure channel...",
      "███████ Decrypting signal ███████",
      "Authorization complete.",
      "█ ACCESS GRANTED █ Welcome, Agent.",
    ];

    let currentLine = 0;
    const lineInterval = setInterval(() => {
      if (currentLine < lines.length) {
        setTerminalLines((prev) => [...prev, lines[currentLine]!]);
        currentLine++;
      } else {
        clearInterval(lineInterval);
      }
    }, 1000);

    return () => clearInterval(lineInterval);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Abstract Background Pattern */}
      <motion.div
        className="fixed inset-0 opacity-30"
        style={
          {
            background:
              "radial-gradient(circle at var(--x) var(--y), rgba(var(--primary), 0.15) 0%, transparent 60%)",
            "--x": mousePosition.x + "px",
            "--y": mousePosition.y + "px",
          } as never
        }
      />

      {/* Enhanced Floating Particles */}
      <ParticleField />

      <div className="container relative z-10 mx-auto space-y-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8 text-center"
        >
          <h1 className="mb-4 text-4xl font-bold tracking-tight">
            Secure Terminal
          </h1>
          <p className="text-lg text-muted-foreground">System Status: Active</p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Enhanced Authorization Animation */}
          <Card className="relative overflow-hidden p-6">
            <div className="mb-4 flex items-center gap-2">
              <Fingerprint className="h-5 w-5" />
              <h3 className="text-xl font-semibold">Identity Verification</h3>
            </div>
            <div className="flex flex-col items-center justify-center py-8">
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                }}
                className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-primary"
              >
                <Fingerprint className="h-8 w-8" />
              </motion.div>
              <div className="mt-4 w-full max-w-xs">
                <Progress value={(authStage + 1) * 20} className="mb-2" />
                <AnimatePresence mode="wait">
                  <motion.div
                    key={authStage}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="text-center"
                  >
                    <Badge variant="outline" className="bg-primary/10">
                      {
                        [
                          "INITIATING SCAN",
                          "VERIFYING",
                          "CHECKING CLEARANCE",
                          "VALIDATING ACCESS",
                          "ACCESS GRANTED",
                        ][authStage]
                      }
                    </Badge>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </Card>

          {/* Enhanced Abstract Pattern */}
          <Card className="relative overflow-hidden p-6">
            <div className="mb-4 flex items-center gap-2">
              <Activity className="h-5 w-5" />
              <h3 className="text-xl font-semibold">System Monitor</h3>
            </div>
            <div className="flex items-center justify-center py-8">
              <motion.div
                animate={{
                  rotate: 360,
                }}
                transition={{
                  duration: 20,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
                className="relative h-32 w-32"
              >
                {Array.from({ length: 12 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute inset-0"
                    animate={{
                      rotate: [0, 360],
                      scale: [1, 1.1, 1],
                      opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                      duration: 10,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: i * 0.5,
                      ease: "linear",
                    }}
                    style={{
                      border: "2px solid",
                      borderColor: "currentColor transparent",
                      borderRadius: "50%",
                      transform: `rotate(${i * 30}deg) scale(${1 - i * 0.05})`,
                    }}
                  />
                ))}
              </motion.div>
            </div>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Secure Terminal */}
          <Card className="relative overflow-hidden p-6">
            <div className="mb-4 flex items-center gap-2">
              <Terminal className="h-5 w-5" />
              <h3 className="text-xl font-semibold">Secure Terminal</h3>
            </div>
            <div className="h-fit overflow-hidden rounded-md bg-black/10 p-4 font-mono text-sm">
              <AnimatePresence>
                {terminalLines.map((line, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.2 }}
                  >
                    {line}
                  </motion.div>
                ))}
              </AnimatePresence>
              <motion.span
                animate={{ opacity: [0, 1] }}
                transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY }}
              >
                _
              </motion.span>
            </div>
          </Card>

          {/* Asset Tracker */}
          <Card className="relative overflow-hidden p-6">
            <div className="mb-4 flex items-center gap-2">
              <Map className="h-5 w-5" />
              <h3 className="text-xl font-semibold">Asset Tracker</h3>
            </div>
            <div className="relative h-[200px]">
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  className="h-48 w-48 rounded-full border border-primary/20"
                  animate={{
                    rotate: 360,
                  }}
                  transition={{
                    duration: 30,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                >
                  {Array.from({ length: 4 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute h-2 w-2 rounded-full bg-primary"
                      animate={{
                        scale: [1, 1.5, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        delay: i * 0.5,
                      }}
                      style={{
                        top: `${50 + Math.sin((i * Math.PI) / 2) * 45}%`,
                        left: `${50 + Math.cos((i * Math.PI) / 2) * 45}%`,
                      }}
                    />
                  ))}
                </motion.div>
              </div>
            </div>
          </Card>
        </div>

        {/* Signal Monitor */}
        <Card className="relative overflow-hidden p-6">
          <div className="mb-4 flex items-center gap-2">
            <Radio className="h-5 w-5" />
            <h3 className="text-xl font-semibold">Signal Monitor</h3>
          </div>
          <div className="flex h-24 items-center">
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                className="mx-0.5 w-1 bg-primary"
                animate={{
                  height: [10, Math.random() * 60 + 20, 10],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: i * 0.1,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function ParticleField() {
  return (
    <div className="pointer-events-none fixed inset-0">
      {Array.from({ length: 40 }).map((_, i) => (
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
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: Math.random() * 30 + 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
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
