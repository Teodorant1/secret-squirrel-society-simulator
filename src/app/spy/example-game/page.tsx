"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Crown, Scroll, VoteIcon, ShieldAlert, Target, Eye, UserCheck, Fingerprint } from "lucide-react"

const THEMES = {
  cyberpunk: {
    name: "Cyberpunk",
    primary: "#00ff9f",
    background: "#000000",
    accent: "#ff00ff",
    animation: {
      background: {
        animate: {
          backgroundPosition: ["0% 0%", "100% 100%"],
        },
        transition: {
          duration: 20,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        },
      },
      text: {
        animate: {
          textShadow: ["0 0 7px #00ff9f", "0 0 10px #00ff9f", "0 0 21px #00ff9f", "0 0 42px #00ff9f"],
        },
        transition: {
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
        },
      },
    },
  },
  got: {
    name: "Game of Thrones",
    primary: "#C41E3A",
    background: "#1a1a1a",
    accent: "#FFD700",
    animation: {
      background: {
        animate: {
          background: [
            "radial-gradient(circle at top left, #C41E3A22, transparent)",
            "radial-gradient(circle at bottom right, #FFD70022, transparent)",
          ],
        },
        transition: {
          duration: 5,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        },
      },
    },
  },
  // Add other theme configurations...
} as const

type ThemeKey = keyof typeof THEMES

export default function ExampleGamePage() {
  const [activeTheme, setActiveTheme] = useState<ThemeKey>("cyberpunk")
  const theme = THEMES[activeTheme]

  return (
    <div className="min-h-screen py-8">
      <motion.div
        className="fixed inset-0 -z-10"
        animate={theme.animation.background.animate}
        transition={theme.animation.background.transition}
      />

      <div className="container mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <motion.h1
            className="text-4xl font-bold"
            animate={theme.animation.text}
            transition={theme.animation.text?.transition}
          >
            Example Game
          </motion.h1>
          <Select value={activeTheme} onValueChange={(value) => setActiveTheme(value as ThemeKey)}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select theme" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(THEMES).map(([key, theme]) => (
                <SelectItem key={key} value={key}>
                  {theme.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <GameStateCard icon={Users} title="Players" description="5/10 Connected" theme={theme} />
          <GameStateCard icon={Crown} title="Current President" description="Player 3" theme={theme} />
          <GameStateCard icon={Scroll} title="Policies Enacted" description="Liberal: 2 | Fascist: 3" theme={theme} />
        </div>

        <Tabs defaultValue="roles" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="roles">Roles & Powers</TabsTrigger>
            <TabsTrigger value="voting">Voting Process</TabsTrigger>
            <TabsTrigger value="investigation">Investigation</TabsTrigger>
          </TabsList>
          <TabsContent value="roles" className="space-y-4">
            <ExplanationCard
              title="Role Distribution"
              description="In a 10 player game, there are 6 Liberals, 3 Fascists, and 1 Secret Hitler. Only the Fascists know each other's identity, while Secret Hitler remains in the dark about their teammates."
              icon={Fingerprint}
              theme={theme}
            />
            <div className="grid md:grid-cols-2 gap-4">
              <PowerCard
                title="Presidential Powers"
                description="The President nominates a Chancellor and has the first choice in policy selection."
                icon={Crown}
                theme={theme}
              />
              <PowerCard
                title="Chancellor Powers"
                description="The Chancellor gets the final say in policy enactment from the policies passed by the President."
                icon={ShieldAlert}
                theme={theme}
              />
            </div>
          </TabsContent>
          <TabsContent value="voting" className="space-y-4">
            <ExplanationCard
              title="Election Process"
              description="Each round, players vote Ja! or Nein! on the proposed government. If the vote fails three times, chaos ensues and the top policy is automatically enacted."
              icon={VoteIcon}
              theme={theme}
            />
            <div className="grid md:grid-cols-2 gap-4">
              <PowerCard
                title="Voting Power"
                description="Every player's vote carries equal weight. A majority is needed to elect a government."
                icon={UserCheck}
                theme={theme}
              />
              <PowerCard
                title="Term Limits"
                description="Players cannot be elected Chancellor if they were part of the previous government."
                icon={Target}
                theme={theme}
              />
            </div>
          </TabsContent>
          <TabsContent value="investigation" className="space-y-4">
            <ExplanationCard
              title="Investigation Powers"
              description="As Fascist policies are enacted, Presidents gain powerful abilities like investigating player loyalties and executing suspects."
              icon={Eye}
              theme={theme}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

interface GameStateCardProps {
  icon: React.ElementType
  title: string
  description: string
  theme: (typeof THEMES)[keyof typeof THEMES]
}

function GameStateCard({ icon: Icon, title, description, theme }: GameStateCardProps) {
  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <Card className="p-6">
        <div className="flex items-center gap-4">
          <Icon className="h-6 w-6" style={{ color: theme.primary }} />
          <div>
            <h3 className="font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

interface ExplanationCardProps {
  title: string
  description: string
  icon: React.ElementType
  theme: (typeof THEMES)[keyof typeof THEMES]
}

function ExplanationCard({ title, description, icon: Icon, theme }: ExplanationCardProps) {
  return (
    <motion.div whileHover={{ scale: 1.01 }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="p-6">
        <div className="flex gap-4">
          <Icon className="h-6 w-6 shrink-0" style={{ color: theme.primary }} />
          <div>
            <h3 className="font-semibold mb-2">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

interface PowerCardProps {
  title: string
  description: string
  icon: React.ElementType
  theme: (typeof THEMES)[keyof typeof THEMES]
}

function PowerCard({ title, description, icon: Icon, theme }: PowerCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <Card className="p-6">
        <div className="flex gap-4">
          <Icon className="h-6 w-6 shrink-0" style={{ color: theme.primary }} />
          <div>
            <h3 className="font-semibold mb-2">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

