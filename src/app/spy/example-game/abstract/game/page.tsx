"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Users, FileText, Eye, AlertTriangle, Shield } from "lucide-react";

export default function AbstractGameState() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
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

      {/* Floating Particles */}
      <ParticleField />

      <div className="container relative z-10 mx-auto space-y-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8 text-center"
        >
          <h1 className="mb-4 text-4xl font-bold tracking-tight">
            Operation Status
          </h1>
          <p className="text-lg text-muted-foreground">
            Monitoring active operations and intelligence gathering
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="grid gap-6 md:grid-cols-2"
        >
          <SurveillanceCard
            title="Active Operatives"
            data={PLAYERS}
            type="players"
          />
          <SurveillanceCard
            title="Intelligence Reports"
            data={INTEL_REPORTS}
            type="intel"
          />
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2">
          <ProgressCard
            title="Resistance Operations"
            progress={40}
            milestones={RESISTANCE_MILESTONES}
            icon={Shield}
            type="primary"
          />
          <ProgressCard
            title="Shadow Operations"
            progress={60}
            milestones={INFILTRATOR_MILESTONES}
            icon={AlertTriangle}
            type="destructive"
          />
        </div>

        <Card className="p-6">
          <h3 className="mb-6 flex items-center gap-2 text-xl font-semibold">
            <Eye className="h-5 w-5" />
            Classified Intelligence
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            {CLASSIFIED_INFO.map((info, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="group"
              >
                <Card className="relative overflow-hidden p-4">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100"
                    initial={false}
                    animate={{
                      backgroundPosition: ["100% 0%", "0% 0%"],
                    }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                  />
                  <div className="relative">
                    <h4 className="mb-2 font-semibold">{info.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {info.content}
                    </p>
                    <Badge variant="outline" className="mt-2">
                      {info.clearance}
                    </Badge>
                  </div>
                </Card>
              </motion.div>
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
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-0.5 w-0.5 rounded-full bg-primary/10"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            scale: Math.random() * 0.5 + 0.5,
          }}
          animate={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
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

function SurveillanceCard({
  title,
  data,
  type,
}: {
  title: string;
  data: { id: string; status: string; text: string }[];
  type: "players" | "intel";
}) {
  return (
    <Card className="p-6">
      <h3 className="mb-6 flex items-center gap-2 text-xl font-semibold">
        {type === "players" ? (
          <Users className="h-5 w-5" />
        ) : (
          <FileText className="h-5 w-5" />
        )}
        {title}
      </h3>
      <div className="space-y-2">
        {data.map((item, index) => (
          <motion.div
            key={index}
            whileHover={{
              scale: 1.01,
              transition: { duration: 0.2 },
            }}
            className="group"
          >
            <Card className="relative overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent"
                initial={{ x: "100%" }}
                whileHover={{ x: "0%" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
              <div className="relative p-4">
                {type === "players" ? (
                  <div className="flex items-center justify-between">
                    <span>Operative {item.id}</span>
                    <Badge
                      variant={
                        item.status === "COMPROMISED"
                          ? "destructive"
                          : "outline"
                      }
                    >
                      {item.status}
                    </Badge>
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    {item.text}
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </Card>
  );
}

function ProgressCard({
  title,
  progress,
  milestones,
  icon: Icon,
  type,
}: {
  title: string;
  progress: number;
  milestones: string[];
  icon: React.ElementType;
  type: "primary" | "destructive";
}) {
  return (
    <Card className="p-6">
      <h3 className="mb-6 flex items-center gap-2 text-xl font-semibold">
        <Icon className="h-5 w-5" />
        {title}
      </h3>
      <Progress value={progress} className="h-2">
        <motion.div
          className="h-full bg-primary"
          initial={{ width: 0 }}
          animate={{
            width: `${progress}%`,
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            width: { duration: 1, ease: "easeOut" },
            opacity: {
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            },
          }}
        />
      </Progress>
      <div className="mt-4 space-y-2">
        {milestones.map((milestone, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            className="group"
          >
            <Card
              className={`relative overflow-hidden p-4 ${index < progress / 25 ? "bg-primary/5" : ""}`}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100"
                initial={false}
                animate={{
                  backgroundPosition: ["100% 0%", "0% 0%"],
                }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              />
              <div className="relative">
                <p className="text-sm">{milestone}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </Card>
  );
}

const PLAYERS = [
  { id: "001", status: "ACTIVE", text: "Operative 001" },
  { id: "002", status: "COMPROMISED", text: "Operative 002" },
  { id: "003", status: "ACTIVE", text: "Operative 003" },
  { id: "004", status: "UNKNOWN", text: "Operative 004" },
  { id: "005", status: "ACTIVE", text: "Operative 005" },
];

const INTEL_REPORTS = [
  { id: "1", status: "NEW", text: "Suspicious activity detected in sector 7" },
  {
    id: "2",
    status: "URGENT",
    text: "Policy document intercepted: contents classified",
  },
  { id: "3", status: "PENDING", text: "Unauthorized access attempt detected" },
  {
    id: "4",
    status: "ALERT",
    text: "Surveillance confirms double agent presence",
  },
];

const RESISTANCE_MILESTONES = [
  "Intelligence Network Established",
  "Counter-surveillance Active",
  "Secure Communications Pending",
  "Operation Success Imminent",
];

const INFILTRATOR_MILESTONES = [
  "Phase 1: Infiltration Complete",
  "Phase 2: Assets Compromised",
  "Phase 3: Control Established",
  "Phase 4: Operation Takeover",
];

const CLASSIFIED_INFO = [
  {
    title: "Operation Details",
    content:
      "Multiple agents report evidence of deep cover operatives within command structure",
    clearance: "Level Alpha",
  },
  {
    title: "Asset Status",
    content: "Critical resources compromised. Containment protocols initiated.",
    clearance: "Level Beta",
  },
  {
    title: "Threat Assessment",
    content:
      "High probability of insider threat. Enhanced monitoring recommended.",
    clearance: "Level Gamma",
  },
  {
    title: "Contingency Plans",
    content: "Failsafe measures prepared. Awaiting authorization.",
    clearance: "Level Omega",
  },
];
