"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Crown, Skull, User2, Shield, Flag } from "lucide-react"

const PRESETS = [
  {
    name: "Game of Thrones",
    icon: Crown,
    description: "Winter is coming...",
    primaryColor: "#C41E3A",
  },
  {
    name: "James Bond",
    icon: Shield,
    description: "Shaken, not stirred",
    primaryColor: "#000000",
  },
  {
    name: "Wendigoon",
    icon: Skull,
    description: "Down the rabbit hole",
    primaryColor: "#800000",
  },
  {
    name: "Alexander Vucic",
    icon: Flag,
    description: "Serbian politics",
    primaryColor: "#0C4076",
  },
  {
    name: "Trump & Vance",
    icon: User2,
    description: "Make games great again",
    primaryColor: "#B22234",
  },
]

export function ThemePresets() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Theme Presets</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {PRESETS.map((preset) => (
            <Button key={preset.name} variant="outline" className="h-auto flex-col gap-2 p-4">
              <preset.icon className="h-6 w-6" />
              <div className="text-sm font-semibold">{preset.name}</div>
              <div className="text-xs text-muted-foreground">{preset.description}</div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

