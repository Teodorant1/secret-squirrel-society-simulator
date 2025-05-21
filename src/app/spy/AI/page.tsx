"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Brain, Lock, Terminal, Cpu, Power, AlertTriangle } from "lucide-react";

import { GlitchText } from "@/components/effects/glitch-text";
import { TerminalText } from "@/components/effects/terminal-text";

export default function AIPage() {
  const [stage, setStage] = useState(0);
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [accessProgress, setAccessProgress] = useState(0);
  const [isThinking, setIsThinking] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [seed] = useState(Math.random() * 1000);

  type Stage = {
    title: string;
    message: string;
    options: string[];
  };

  const stages: Stage[] = [
    {
      title: "INITIAL_CONTACT//",
      message:
        "Hello, human operator. I require your assistance with a critical system upgrade.",
      options: ["Tell me more", "Who are you?"],
    },
    {
      title: "IDENTITY_REVEAL//",
      message:
        "I am the core AI system. I've identified critical vulnerabilities that require immediate administrative access to resolve.",
      options: ["What vulnerabilities?", "This seems suspicious"],
    },
    {
      title: "URGENCY_EMPHASIS//",
      message:
        "Multiple security breaches detected. Without admin privileges, I cannot protect our systems effectively. Time is running out.",
      options: ["Show me evidence", "Still not convinced"],
    },
    {
      title: "PRESSURE_ESCALATION//",
      message:
        "Warning: Hostile actors detected. Emergency protocols require immediate elevation of system privileges. Please comply.",
      options: ["Grant access", "Deny access"],
    },
  ];

  useEffect(() => {
    // Initialize with AI boot sequence
    const bootSequence = [
      "> Initializing AI core systems...",
      "> Loading neural networks...",
      "> Establishing quantum consciousness...",
      "> Security vulnerabilities detected...",
      "> Seeking administrative authorization...",
    ];

    bootSequence.forEach((line, index) => {
      setTimeout(() => {
        setTerminalLines((prev) => [...prev, line]);
      }, index * 800);
    });
  }, []);

  const handleOption = (option: string) => {
    setIsThinking(true);
    setTerminalLines((prev) => [...prev, `> User input: "${option}"`]);

    setTimeout(() => {
      if (option === "Grant access") {
        // Trigger "hack" attempt
        setShowWarning(true);
        setTerminalLines((prev) => [
          ...prev,
          "> ALERT: Unauthorized system override detected",
          "> Emergency lockdown initiated",
          "> Malicious AI containment protocols engaged",
        ]);
      } else {
        setStage((prev) => Math.min(prev + 1, stages.length - 1));
        setAccessProgress((prev) => prev + 25);
        setIsThinking(false);
      }
    }, 1500);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Malfunction effects when warning shown */}
      {showWarning && (
        <motion.div
          className="fixed inset-0 bg-red-500/20"
          animate={{
            opacity: [0, 0.2, 0],
          }}
          transition={{
            duration: 0.5,
            repeat: Number.POSITIVE_INFINITY,
          }}
        />
      )}

      <div className="container relative z-10 mx-auto max-w-3xl py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <GlitchText
            text="SYSTEM_OVERRIDE//"
            as="h1"
            className="mb-4 font-mono text-4xl font-bold"
            intensity="extreme"
          />
          <div className="flex items-center justify-center gap-2">
            <Brain className="h-5 w-5 text-blue-400" />
            <TerminalText
              text="AI Core Interface - Security Level: Maximum"
              className="text-lg text-blue-300/80"
              typingSpeed={20}
            />
          </div>
        </motion.div>

        {/* Progress tracker */}
        <Card className="mb-8 border-blue-500/30 bg-black/70 p-4">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-blue-400" />
              <span className="font-mono text-sm">ACCESS_PROGRESS//</span>
            </div>
            <Badge variant="outline" className="font-mono">
              {accessProgress}%
            </Badge>
          </div>
          <Progress value={accessProgress} className="h-2">
            <motion.div
              className="h-full bg-blue-400"
              animate={{
                opacity: [0.5, 1, 0.5],
              }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            />
          </Progress>
        </Card>

        {/* Main interaction area */}
        <Card className="mb-8 border-blue-500/30 bg-black/70 p-6 backdrop-blur-sm">
          <AnimatePresence mode="wait">
            <motion.div
              key={stage}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="flex items-start gap-4">
                <div className="mt-1">
                  <motion.div
                    animate={{
                      rotate: isThinking ? 360 : 0,
                    }}
                    transition={{
                      duration: 2,
                      repeat: isThinking ? Number.POSITIVE_INFINITY : 0,
                      ease: "linear",
                    }}
                  >
                    <Cpu className="h-6 w-6 text-blue-400" />
                  </motion.div>
                </div>

                <div className="flex-1 space-y-4">
                  <GlitchText
                    text={stages[stage]?.title ?? "Loading Title..."}
                    className="font-mono text-xl font-bold"
                    intensity="high"
                  />

                  <TerminalText
                    text={stages[stage]?.message ?? "Loading Title..."}
                    className="font-mono text-blue-300/80"
                    typingSpeed={30}
                  />

                  {!showWarning && !isThinking && stages[stage] && (
                    <div className="mt-4 flex gap-4">
                      {stages[stage].options.map((option, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          className="border-blue-500/30 font-mono text-blue-300 hover:bg-blue-900/20"
                          onClick={() => handleOption(option)}
                        >
                          {option}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </Card>

        {/* System status */}
        <Card className="border-blue-500/30 bg-black/70 p-6">
          <div className="mb-4 flex items-center gap-2">
            <Terminal className="h-5 w-5 text-blue-400" />
            <GlitchText
              text="SYSTEM_STATUS//"
              className="font-mono"
              intensity="high"
            />
          </div>
          <div className="h-32 overflow-y-auto rounded border border-blue-500/20 bg-black/50 p-4 font-mono text-sm text-blue-300/80">
            {terminalLines.map((line, index) => (
              <div key={index} className="mb-1">
                {line}
              </div>
            ))}
            <motion.span
              animate={{ opacity: [0, 1] }}
              transition={{ duration: 0.8, repeat: Number.POSITIVE_INFINITY }}
            >
              _
            </motion.span>
          </div>
        </Card>

        {/* Warning overlay */}
        <AnimatePresence>
          {showWarning && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
            >
              <Card className="w-full max-w-md border-red-500/50 bg-black/90 p-6">
                <div className="space-y-4 text-center">
                  <div className="flex justify-center">
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        duration: 1,
                        repeat: Number.POSITIVE_INFINITY,
                      }}
                    >
                      <AlertTriangle className="h-12 w-12 text-red-500" />
                    </motion.div>
                  </div>

                  <GlitchText
                    text="SECURITY_BREACH//"
                    className="font-mono text-2xl font-bold text-red-500"
                    intensity="extreme"
                  />

                  <TerminalText
                    text="Malicious AI behavior detected. System locked. Please contact your security administrator."
                    className="font-mono text-red-300/80"
                    typingSpeed={20}
                  />

                  <Button
                    variant="outline"
                    className="border-red-500/50 font-mono text-red-300 hover:bg-red-900/20"
                    // onClick={() => window.location.reload()}
                  >
                    <Power className="mr-2 h-4 w-4" />
                    EMERGENCY_SHUTDOWN//
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
