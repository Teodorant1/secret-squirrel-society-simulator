"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
// import { CRTScanlines } from "@/components/effects/crt-scanlines";
import { GlitchText } from "@/components/effects/glitch-text";
import { TerminalText } from "@/components/effects/terminal-text";
import ParticleCanvas from "@/components/animations/ParticleCanvas";
import Secure_terminal from "@/components/effects/secure-terminal";
import { Shield, Cpu, Network, Lock } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function HomePage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden text-center md:w-[100vh] md:min-w-full">
      <Card className="relative mt-3 overflow-hidden border-opacity-20 bg-opacity-20 p-3 outline-blue-600 backdrop-blur-sm">
        <div className="relative h-[300px]">
          <ParticleCanvas />
        </div>
      </Card>
      {/* CRT Scanlines Effect */}
      {/* <CRTScanlines /> */}
      {/* Digital noise background */}
      <div className="absolute inset-0 opacity-10">
        <svg className="h-full w-full">
          <filter id="noise">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="2.65"
              numOctaves="3"
              stitchTiles="stitch"
            />
            <feColorMatrix
              type="matrix"
              values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 0.5 0"
            />
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>
      </div>
      {/* Grid lines */}
      {/* <div
        className="absolute left-0 top-0 h-full w-full opacity-10"
        style={{
          backgroundImage:
            "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      /> */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 mx-auto max-w-3xl px-4"
      >
        <motion.div
          className="mb-6 text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <GlitchText
            text="Secret-Squirrel-Society-S
            imulator//"
            as="h1"
            glitchFactor={1.5}
            className="font-mono"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-8"
        >
          <TerminalText
            text="A game of deception, strategy, and political intrigue. Choose your theme and dive into a world of hidden agendas and shifting alliances."
            className="mx-auto max-w-2xl text-lg text-blue-300"
            typingSpeed={30}
            startDelay={800}
          />
        </motion.div>

        <motion.div
          className="flex flex-col justify-center gap-4 sm:flex-row"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Link href="/spy/game">
            <Button
              size="lg"
              className="group relative min-w-[200px] overflow-hidden bg-blue-600 hover:bg-blue-700"
            >
              <span className="relative z-10 flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span>PLAY_NOW//</span>
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
          </Link>
          {/* <Link href="/spy/customize">
            <Button
              size="lg"
              variant="outline"
              className="group min-w-[200px] border-blue-500 text-blue-400 hover:bg-blue-950/30"
            >
              <span className="flex items-center gap-2">
                <Cpu className="h-4 w-4" />
                <span>CUSTOMIZE//</span>
              </span>
            </Button>
          </Link> */}
        </motion.div>

        {/* Cyberpunk decorative elements */}
        <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full border border-blue-500/30">
          <motion.div
            className="absolute inset-0 rounded-full border border-blue-400/20"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
          />
        </div>

        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full border border-blue-500/30">
          <motion.div
            className="absolute inset-0 rounded-full border border-blue-400/20"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              delay: 1,
            }}
          />
        </div>

        {/* Status indicators */}
        <motion.div
          className="relative flex items-center gap-3 font-mono text-xs text-blue-400/80"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
        >
          <div className="flex items-center gap-1">
            <Network className="h-3 w-3" />
            <span>NETWORK_ACTIVE</span>
          </div>
          <div className="flex items-center gap-1">
            <Lock className="h-3 w-3" />
            <span>SECURE_CONNECTION</span>
          </div>
        </motion.div>
      </motion.div>
      <div className="flex flex-col md:flex-row">
        <Secure_terminal />
      </div>
    </div>
  );
}
