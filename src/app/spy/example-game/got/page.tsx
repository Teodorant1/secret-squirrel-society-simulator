"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Crown, Sword, Shield, Scroll, Skull } from "lucide-react"

export default function GameOfThronesExample() {
  const [particles, setParticles] = useState<Array<{ id: number; type: "ember" | "snow"; x: number; y: number }>>([])
  const [hoveredHouse, setHoveredHouse] = useState<string | null>(null)

  // Generate particles
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles((prev) => {
        const newParticle = {
          id: Date.now(),
          type: Math.random() > 0.5 ? "ember" : "snow",
          x: Math.random() * window.innerWidth,
          y: -20,
        }
        return [...prev.slice(-50), newParticle]
      })
    }, 200)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-[#1a0f0f] text-[#d4af37] relative overflow-hidden">
      {/* Atmospheric Background */}
      <div
        className="fixed inset-0 bg-[url('/texture.png')] opacity-20"
        style={{
          backgroundSize: "200px",
          backgroundRepeat: "repeat",
        }}
      />

      {/* Particle Effects */}
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className={`absolute w-1 h-1 rounded-full ${particle.type === "ember" ? "bg-orange-500" : "bg-white"}`}
            initial={{ x: particle.x, y: -20, opacity: 1 }}
            animate={{
              y: window.innerHeight + 20,
              x: particle.x + (Math.random() - 0.5) * 200,
              opacity: 0,
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: particle.type === "ember" ? 3 : 8,
              ease: "linear",
            }}
          />
        ))}
      </AnimatePresence>

      <div className="container mx-auto py-12 relative z-10">
        {/* Title with Fire Effect */}
        <motion.div
          className="text-center mb-16 relative"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-6xl font-medieval tracking-wider mb-4">Game of Shadows</h1>
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-orange-500/0 to-orange-500/20"
            animate={{
              opacity: [0.3, 0.7, 0.3],
              scale: [1, 1.02, 1],
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
        </motion.div>

        {/* House Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {HOUSES.map((house, index) => (
            <motion.div
              key={house.name}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 }}
              onHoverStart={() => setHoveredHouse(house.name)}
              onHoverEnd={() => setHoveredHouse(null)}
            >
              <Card className="p-6 bg-[#2a1f1f] border-[#d4af37]/30 relative group overflow-hidden">
                {/* House Sigil Background */}
                <motion.div
                  className="absolute inset-0 opacity-10"
                  animate={{
                    backgroundPosition: ["0% 0%", "100% 100%"],
                    opacity: hoveredHouse === house.name ? 0.2 : 0.1,
                  }}
                  transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
                  style={{
                    backgroundImage: `url(${house.sigilPattern})`,
                    backgroundSize: "100px",
                  }}
                />

                {/* Burning Edge Effect */}
                <AnimatePresence>
                  {hoveredHouse === house.name && (
                    <motion.div
                      className="absolute inset-0"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-transparent" />
                      <div className="absolute inset-0 bg-gradient-to-b from-orange-500/20 to-transparent" />
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="relative z-10">
                  <house.icon className="w-8 h-8 mb-4" />
                  <h3 className="text-xl font-medieval mb-2">{house.name}</h3>
                  <p className="text-[#d4af37]/80 font-medieval text-sm">{house.description}</p>

                  {/* Secret Message */}
                  <motion.div
                    className="mt-4 text-xs text-[#d4af37]/60 font-medieval"
                    animate={{
                      opacity: hoveredHouse === house.name ? 1 : 0,
                    }}
                  >
                    {house.secretMessage}
                  </motion.div>
                </div>

                {/* Interactive Decorative Elements */}
                <motion.div
                  className="absolute top-0 right-0 w-16 h-16"
                  animate={{
                    rotate: hoveredHouse === house.name ? 90 : 0,
                  }}
                >
                  <svg viewBox="0 0 100 100" className="w-full h-full text-[#d4af37]/20">
                    <path d="M0,50 A50,50 0 1,1 100,50 L50,50 Z" fill="currentColor" />
                  </svg>
                </motion.div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <Button
            variant="outline"
            size="lg"
            className="border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37]/10 font-medieval"
          >
            Take the Black
          </Button>
        </motion.div>

        {/* Conspiracy Web */}
        <div className="fixed inset-0 pointer-events-none">
          <svg className="w-full h-full">
            <motion.path
              d="M0,0 L100,100"
              stroke="#d4af37"
              strokeWidth="0.5"
              strokeDasharray="5,5"
              animate={{
                opacity: [0.1, 0.3, 0.1],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
              }}
            />
          </svg>
        </div>
      </div>
    </div>
  )
}

const HOUSES = [
  {
    name: "House of Whispers",
    description: "Masters of secrets and shadows, they know what others wish hidden.",
    icon: Crown,
    sigilPattern: "/whispers-pattern.svg",
    secretMessage: "The walls have ears, and the birds carry secrets.",
  },
  {
    name: "House of Blades",
    description: "When words fail, their steel speaks volumes.",
    icon: Sword,
    sigilPattern: "/blades-pattern.svg",
    secretMessage: "Every shadow conceals a blade, every smile masks intent.",
  },
  {
    name: "House of Shields",
    description: "They guard not just lives, but the very fabric of power.",
    icon: Shield,
    sigilPattern: "/shields-pattern.svg",
    secretMessage: "Trust is our currency, loyalty our strength.",
  },
  {
    name: "House of Scripts",
    description: "Knowledge is their weapon, truth their armor.",
    icon: Scroll,
    sigilPattern: "/scripts-pattern.svg",
    secretMessage: "In ancient tomes lie modern truths.",
  },
  {
    name: "House of Bones",
    description: "They remember what others wish forgotten.",
    icon: Skull,
    sigilPattern: "/bones-pattern.svg",
    secretMessage: "The past never dies, it merely slumbers.",
  },
]

// Add custom medieval font
const style = document.createElement("style")
style.textContent = `
  @font-face {
    font-family: 'Medieval';
    src: url('/medieval-font.woff2') format('woff2');
  }
  .font-medieval {
    font-family: 'Medieval', serif;
  }
`
document.head.appendChild(style)

