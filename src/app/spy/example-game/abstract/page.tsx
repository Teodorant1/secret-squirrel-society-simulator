"use client";

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
  Cpu,
} from "lucide-react";

import { GlitchText } from "@/components/effects/glitch-text";
import { TerminalText } from "@/components/effects/terminal-text";

export default function AbstractExampleGame() {
  const [activeTab, setActiveTab] = useState("overview");
  const [dataStream, setDataStream] = useState<string[]>([]);

  // Replaced mouse position with a general dynamic effect
  const [particleData, setParticleData] = useState<{ x: number; y: number }[]>(
    [],
  );

  useEffect(() => {
    // Generate random data stream in the background
    const interval = setInterval(() => {
      const newData = generateRandomHex(16);
      setDataStream((prev) => [...prev.slice(-20), newData]);
    }, 500);

    // Random particle generation to simulate movement effects
    const particleInterval = setInterval(() => {
      setParticleData((prevData) => {
        return [
          ...prevData,
          { x: Math.random() * 100, y: Math.random() * 100 }, // Random positions for particles
        ];
      });
    }, 200);

    return () => {
      clearInterval(interval);
      clearInterval(particleInterval);
    };
  }, []);

  // Generate random hex string
  const generateRandomHex = (length: number) => {
    return Array.from({ length }, () =>
      Math.floor(Math.random() * 16).toString(16),
    ).join("");
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* CRT Scanlines Effect */}

      {/* Abstract Background Pattern */}
      <motion.div
        className="fixed inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(circle at var(--x) var(--y), rgba(0, 162, 255, 0.15) 0%, transparent 60%)",
        }}
      />

      {/* Digital noise background */}
      <div className="fixed inset-0 opacity-5">
        <svg className="h-full w-full">
          <filter id="abstractNoise">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.65"
              numOctaves="3"
              stitchTiles="stitch"
            />
            <feColorMatrix
              type="matrix"
              values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 0.5 0"
            />
          </filter>
          <rect width="100%" height="100%" filter="url(#abstractNoise)" />
        </svg>
      </div>

      {/* Floating Particles */}
      <ParticleField particleData={particleData} />

      {/* Data stream visualization */}
      <div className="pointer-events-none fixed bottom-1/4 right-4 top-1/4 w-16 overflow-hidden font-mono text-xs text-blue-400/60">
        {dataStream.map((data, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            className="whitespace-nowrap"
          >
            {data}
          </motion.div>
        ))}
      </div>

      <div className="container relative z-10 mx-auto py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-16 text-center"
        >
          <GlitchText
            text="EXAMPLE_GAME//"
            as="h1"
            className="mb-4 font-mono text-4xl font-bold tracking-tight sm:text-6xl"
            glitchFactor={1.5}
          />
          <TerminalText
            text="A demonstration of game mechanics and player interactions in a secure environment."
            className="mx-auto max-w-2xl text-lg text-blue-300/80"
            typingSpeed={20}
          />
        </motion.div>

        <Tabs
          defaultValue="overview"
          className="space-y-8"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="mx-auto grid w-full grid-cols-3 border border-blue-500/30 bg-black/50 lg:w-[400px]">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-blue-900/30"
            >
              OVERVIEW//
            </TabsTrigger>
            <TabsTrigger
              value="mechanics"
              className="data-[state=active]:bg-blue-900/30"
            >
              MECHANICS//
            </TabsTrigger>
            <TabsTrigger
              value="roles"
              className="data-[state=active]:bg-blue-900/30"
            >
              ROLES//
            </TabsTrigger>
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
                    <GameCard key={card.title} {...card} />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="mechanics" className="space-y-8">
                <div className="grid gap-6 md:grid-cols-2">
                  {MECHANIC_CARDS.map((card, index) => (
                    <GameCard key={card.title} {...card} />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="roles" className="space-y-8">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {ROLE_CARDS.map((card, index) => (
                    <GameCard key={card.title} {...card} />
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
            className="group relative overflow-hidden bg-blue-600 text-primary-foreground hover:bg-blue-700"
          >
            <span className="relative z-10 flex items-center gap-2 font-mono">
              <Cpu className="h-4 w-4" />
              INITIALIZE_SEQUENCE//
            </span>
            <motion.div
              className="absolute inset-0 bg-blue-400/20"
              animate={{
                y: ["100%", "-100%"],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
            />
          </Button>
        </motion.div>
      </div>
    </div>
  );
}

const ParticleField = ({
  particleData,
}: {
  particleData: { x: number; y: number }[];
}) => {
  return (
    <div className="pointer-events-none fixed inset-0">
      {particleData.map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-1 w-1 rounded-full bg-blue-500/20"
          initial={{
            x: Math.random() * 100,
            y: Math.random() * 100,
          }}
          animate={{
            x: Math.random() * 100,
            y: Math.random() * 100,
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
};

const OVERVIEW_CARDS = [
  {
    title: "PLAYER_DYNAMICS",
    description:
      "Navigate complex social interactions and hidden loyalties in a game of trust and deception.",
    icon: Users,
  },
  {
    title: "POWER_STRUCTURE",
    description:
      "Experience the shifting balance of power as players take on different roles and responsibilities.",
    icon: Crown,
  },
  {
    title: "POLICY_TRACK",
    description:
      "Monitor the progression of enacted policies and their impact on the game state.",
    icon: Scroll,
  },
];

const MECHANIC_CARDS = [
  {
    title: "SECURE_VOTING",
    description:
      "Cast your votes in complete secrecy, influencing the direction of the game without revealing your intentions.",
    icon: Lock,
  },
  {
    title: "INFORMATION_NETWORK",
    description:
      "Gather intelligence through various game mechanics and share or withhold it strategically.",
    icon: Network,
  },
  {
    title: "STRATEGIC_ACTIONS",
    description:
      "Execute powerful actions that can dramatically alter the course of the game.",
    icon: Target,
  },
];

const ROLE_CARDS = [
  {
    title: "HIDDEN_ROLES",
    description:
      "Each player is assigned a secret role that determines their objectives and allegiances.",
    icon: Eye,
  },
  {
    title: "SPECIAL_POWERS",
    description:
      "Unlock unique abilities and powers as the game progresses, adding layers of strategy.",
    icon: Shield,
  },
  {
    title: "DYNAMIC_ALLIANCES",
    description:
      "Form and break alliances as you work towards your secret objectives.",
    icon: Cpu,
  },
];

const GameCard = ({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description: string;
  icon: React.ElementType;
}) => {
  return (
    <Card className="border border-blue-500/30 p-4 hover:border-blue-500/50">
      <div className="flex items-center gap-4">
        <Icon className="h-6 w-6 text-blue-500" />
        <h3 className="font-mono text-xl">{title}</h3>
      </div>
      <p className="mt-2 text-sm text-blue-400">{description}</p>
    </Card>
  );
};
