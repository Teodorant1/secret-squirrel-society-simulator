"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ThemeSelector } from "@/components/theme-selector"
import { Crown, Scroll, Users } from "lucide-react"

export default function GamePage() {
  const [gamePhase, setGamePhase] = useState<"lobby" | "playing" | "ended">("lobby")

  return (
    <div className="container max-w-5xl py-8">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <Users className="h-6 w-6" />
            <div>
              <h3 className="font-semibold">Players</h3>
              <p className="text-sm text-muted-foreground">5/10 Connected</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <Crown className="h-6 w-6" />
            <div>
              <h3 className="font-semibold">Current President</h3>
              <p className="text-sm text-muted-foreground">Waiting...</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <Scroll className="h-6 w-6" />
            <div>
              <h3 className="font-semibold">Policies Enacted</h3>
              <p className="text-sm text-muted-foreground">0/6 Required</p>
            </div>
          </div>
        </Card>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 grid gap-8">
        {gamePhase === "lobby" && (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Game Lobby</h2>
            <Button size="lg" onClick={() => setGamePhase("playing")}>
              Start Game
            </Button>
          </div>
        )}

        {gamePhase === "playing" && (
          <div className="grid gap-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Card key={i} className="p-4 text-center">
                  <div className="font-semibold">Player {i + 1}</div>
                  <div className="text-sm text-muted-foreground">Not voted</div>
                </Card>
              ))}
            </div>
            <div className="flex justify-center gap-4">
              <Button variant="destructive">Vote No</Button>
              <Button variant="default">Vote Yes</Button>
            </div>
          </div>
        )}
      </motion.div>
      <ThemeSelector />
    </div>
  )
}

