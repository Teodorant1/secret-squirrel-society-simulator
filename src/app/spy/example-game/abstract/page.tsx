"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  Crown,
  Scroll,
  Shield,
  Eye,
  Network,
  Target,
  Lock,
} from "lucide-react";

export default function AbstractExampleGame() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeTab, setActiveTab] = useState("overview");

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

      <div className="container relative z-10 mx-auto py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-16 text-center"
        >
          <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-6xl">
            Example Game
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            A demonstration of game mechanics and player interactions in a
            secure environment.
          </p>
        </motion.div>

        <Tabs
          defaultValue="overview"
          className="space-y-8"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="mx-auto grid w-full grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="mechanics">Mechanics</TabsTrigger>
            <TabsTrigger value="roles">Roles</TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <TabsContent value="overview" className="space-y-8">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {OVERVIEW_CARDS.map((card, index) => (
                    <GameCard key={card.title} {...card} index={index} />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="mechanics" className="space-y-8">
                <div className="grid gap-6 md:grid-cols-2">
                  {MECHANIC_CARDS.map((card, index) => (
                    <GameCard key={card.title} {...card} index={index} />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="roles" className="space-y-8">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {ROLE_CARDS.map((card, index) => (
                    <GameCard key={card.title} {...card} index={index} />
                  ))}
                </div>
              </TabsContent>
            </motion.div>
          </AnimatePresence>
        </Tabs>

        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Button
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Start Game
          </Button>
        </motion.div>
      </div>
    </div>
  );
}

interface GameCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  index: number;
}

function GameCard({ title, description, icon: Icon, index }: GameCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      className="group"
    >
      <Card className="relative overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100"
          initial={false}
          animate={{
            backgroundPosition: ["100% 0%", "0% 0%"],
          }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
        <div className="relative p-6">
          <div className="flex items-start gap-4">
            <div className="shrink-0">
              <Icon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="mb-2 font-semibold">{title}</h3>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

function ParticleField() {
  return (
    <div className="pointer-events-none fixed inset-0">
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-1 w-1 rounded-full bg-primary/20"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          animate={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          transition={{
            duration: Math.random() * 20 + 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}

const OVERVIEW_CARDS = [
  {
    title: "Player Dynamics",
    description:
      "Navigate complex social interactions and hidden loyalties in a game of trust and deception.",
    icon: Users,
  },
  {
    title: "Power Structure",
    description:
      "Experience the shifting balance of power as players take on different roles and responsibilities.",
    icon: Crown,
  },
  {
    title: "Policy Track",
    description:
      "Monitor the progression of enacted policies and their impact on the game state.",
    icon: Scroll,
  },
];

const MECHANIC_CARDS = [
  {
    title: "Secure Voting",
    description:
      "Cast your votes in complete secrecy, influencing the direction of the game without revealing your intentions.",
    icon: Lock,
  },
  {
    title: "Information Network",
    description:
      "Gather intelligence through various game mechanics and share or withhold it strategically.",
    icon: Network,
  },
  {
    title: "Strategic Actions",
    description:
      "Execute powerful actions that can dramatically alter the course of the game.",
    icon: Target,
  },
];

const ROLE_CARDS = [
  {
    title: "Hidden Roles",
    description:
      "Each player is assigned a secret role that determines their objectives and allegiances.",
    icon: Eye,
  },
  {
    title: "Special Powers",
    description:
      "Unlock unique abilities and powers as the game progresses, adding layers of strategy.",
    icon: Shield,
  },
  {
    title: "Dynamic Alliances",
    description:
      "Form and break alliances as you work towards your secret objectives.",
    icon: Users,
  },
];
