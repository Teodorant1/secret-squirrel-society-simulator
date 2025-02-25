"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, CheckCircle, Timer } from "lucide-react"

export default function TrainingPage() {
  const [gameState, setGameState] = useState<"intro" | "playing" | "success" | "failure">("intro")
  const [currentLevel, setCurrentLevel] = useState(1)
  const [timeLeft, setTimeLeft] = useState(60)
  const [code, setCode] = useState("")
  const [attempts, setAttempts] = useState(0)

  useEffect(() => {
    if (gameState === "playing") {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setGameState("failure")
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [gameState])

  const startGame = () => {
    setGameState("playing")
    setTimeLeft(60)
    setCode("")
    setAttempts(0)
  }

  const submitAttempt = () => {
    setAttempts((prev) => prev + 1)
    if (code === "1234") {
      // Simplified for example
      setGameState("success")
    } else if (attempts >= 2) {
      setGameState("failure")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-12 max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Cryptography Training</h1>
          <p className="text-lg text-muted-foreground">Test your code-breaking abilities</p>
        </motion.div>

        <Card className="p-8">
          <AnimatePresence mode="wait">
            {gameState === "intro" && (
              <motion.div
                key="intro"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center"
              >
                <h2 className="text-2xl font-semibold mb-4">Welcome, Agent</h2>
                <p className="text-muted-foreground mb-6">
                  Your mission is to decrypt the encoded messages before time runs out. You have 3 attempts per level.
                </p>
                <Button onClick={startGame} size="lg">
                  Begin Training
                </Button>
              </motion.div>
            )}

            {gameState === "playing" && (
              <motion.div
                key="playing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <Badge variant="outline">Level {currentLevel}</Badge>
                  <div className="flex items-center gap-2">
                    <Timer className="h-4 w-4" />
                    <span className="text-sm">{timeLeft}s</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Decrypt the Message</h3>
                  <div className="font-mono bg-muted p-4 rounded-lg text-center">
                    {/* Example encrypted message */}
                    NXPG WKLV PHVVDJH
                  </div>
                </div>

                <div className="space-y-2">
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full p-2 bg-background border rounded"
                    placeholder="Enter decrypted message..."
                  />
                  <div className="text-xs text-muted-foreground">Attempts remaining: {3 - attempts}</div>
                </div>

                <Button onClick={submitAttempt} className="w-full">
                  Submit
                </Button>

                <div className="pt-4">
                  <Progress value={(timeLeft / 60) * 100} />
                </div>
              </motion.div>
            )}

            {gameState === "success" && (
              <motion.div
                key="success"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center"
              >
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-semibold mb-4">Decryption Successful</h2>
                <p className="text-muted-foreground mb-6">Well done, agent. Ready for the next level?</p>
                <Button
                  onClick={() => {
                    setCurrentLevel((prev) => prev + 1)
                    startGame()
                  }}
                >
                  Continue
                </Button>
              </motion.div>
            )}

            {gameState === "failure" && (
              <motion.div
                key="failure"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center"
              >
                <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
                <h2 className="text-2xl font-semibold mb-4">Decryption Failed</h2>
                <p className="text-muted-foreground mb-6">The message was lost. Would you like to try again?</p>
                <Button onClick={startGame}>Retry</Button>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </div>
    </div>
  )
}

