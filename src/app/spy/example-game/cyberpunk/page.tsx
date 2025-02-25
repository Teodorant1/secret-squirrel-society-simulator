"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Terminal, Cpu, Network, Shield, Wifi } from "lucide-react"

export default function CyberpunkExampleGame() {
  const [matrixChars] = useState(() => generateMatrixChars())
  const [glitchText, setGlitchText] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitchText((prev) => !prev)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-black text-[#00ff9f] relative overflow-hidden">
      {/* Digital Rain Effect */}
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        {matrixChars.map((col, i) => (
          <div
            key={i}
            className="absolute top-0 text-xs whitespace-pre font-mono"
            style={{ left: `${(i / matrixChars.length) * 100}%` }}
          >
            <motion.div
              initial={{ y: -1000 }}
              animate={{ y: 1000 }}
              transition={{
                duration: 20,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
            >
              {col}
            </motion.div>
          </div>
        ))}
      </div>

      <div className="container mx-auto py-12 relative z-10">
        <motion.h1
          className="text-6xl font-bold text-center mb-12 font-mono relative"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.span
            animate={{
              x: glitchText ? [-2, 2, 0] : 0,
              color: glitchText ? ["#00ff9f", "#ff00ff", "#00ff9f"] : "#00ff9f",
            }}
            transition={{ duration: 0.2 }}
          >
            NEURAL.NETWORK//
          </motion.span>
          <motion.div
            className="absolute inset-0"
            animate={{
              opacity: glitchText ? [0, 1, 0] : 0,
              x: glitchText ? [10, -10, 0] : 0,
            }}
            transition={{ duration: 0.2 }}
            style={{ color: "#ff00ff" }}
          >
            NEURAL.NETWORK//
          </motion.div>
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {CYBERPUNK_CARDS.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ scale: 1.05, z: 20 }}
            >
              <Card className="p-6 bg-black border-[#00ff9f]/30 relative group overflow-hidden">
                {/* Cyber Grid Background */}
                <div className="absolute inset-0 opacity-10">
                  <svg className="w-full h-full">
                    <pattern id="cyber-grid" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" />
                    </pattern>
                    <rect width="100%" height="100%" fill="url(#cyber-grid)" />
                  </svg>
                </div>

                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-[#00ff9f]/10 to-transparent"
                  animate={{
                    opacity: [0.5, 0.8, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                />

                <div className="relative z-10">
                  <card.icon className="w-8 h-8 mb-4" />
                  <h3 className="text-xl font-bold mb-2 font-mono">{card.title}</h3>
                  <p className="text-[#00ff9f]/80 font-mono text-sm">{card.description}</p>
                </div>

                {/* Scanning Line Effect */}
                <motion.div
                  className="absolute inset-0 w-full h-1 bg-[#00ff9f]/30"
                  animate={{
                    top: ["0%", "100%", "0%"],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                />
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <Button variant="outline" size="lg" className="border-[#00ff9f] text-[#00ff9f] hover:bg-[#00ff9f]/10">
            INITIALIZE_SEQUENCE//
          </Button>
        </motion.div>
      </div>
    </div>
  )
}

const CYBERPUNK_CARDS = [
  {
    title: "NEURAL.HACK//",
    description: "Infiltrate the neural networks of your opponents. Track their digital footprints.",
    icon: Terminal,
  },
  {
    title: "QUANTUM.DECRYPT//",
    description: "Break through encrypted barriers. Access classified information streams.",
    icon: Shield,
  },
  {
    title: "NET.RUNNER//",
    description: "Navigate the digital underground. Exploit system vulnerabilities.",
    icon: Network,
  },
  {
    title: "CORE.ACCESS//",
    description: "Gain root access to the mainframe. Manipulate the system from within.",
    icon: Cpu,
  },
  {
    title: "GHOST.PROTOCOL//",
    description: "Become invisible in the network. Leave no trace of your presence.",
    icon: Wifi,
  },
]

function generateMatrixChars() {
  const chars = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン"
  const columns = Math.floor(window.innerWidth / 20)
  return Array.from({ length: columns }, () =>
    Array.from({ length: 50 }, () => chars[Math.floor(Math.random() * chars.length)]).join("\n"),
  )
}

