"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Crown, Skull, Shield, Flag, User2, Palette, Heart, Rocket } from "lucide-react"

const THEMES = [
  {
    id: "custom",
    name: "Custom Theme",
    icon: Palette,
    className: "border-primary",
    styles: {
      "--theme-primary": "hsl(222.2 47.4% 11.2%)",
      "--theme-background": "hsl(0 0% 100%)",
    },
  },
  {
    id: "got",
    name: "Game of Thrones",
    icon: Crown,
    className: "text-[#C41E3A] dark:hover:text-[#C41E3A]",
    styles: {
      "--theme-primary": "#C41E3A",
      "--theme-background": "#1D1D1D",
    },
  },
  {
    id: "bond",
    name: "James Bond",
    icon: Shield,
    className: "text-black dark:hover:text-white",
    styles: {
      "--theme-primary": "#000000",
      "--theme-background": "#FFFFFF",
    },
  },
  {
    id: "wendigoon",
    name: "Wendigoon",
    icon: Skull,
    className: "text-[#800000] dark:hover:text-[#800000]",
    styles: {
      "--theme-primary": "#800000",
      "--theme-background": "#2A0F0F",
    },
  },
  {
    id: "vucic",
    name: "Alexander Vucic",
    icon: Flag,
    className: "text-[#0C4076] dark:hover:text-[#0C4076]",
    styles: {
      "--theme-primary": "#0C4076",
      "--theme-background": "#FFFFFF",
    },
  },
  {
    id: "trump",
    name: "Trump & Vance",
    icon: User2,
    className: "text-[#B22234] dark:hover:text-[#B22234]",
    styles: {
      "--theme-primary": "#B22234",
      "--theme-background": "#FFFFFF",
    },
  },
  {
    id: "dei",
    name: "Social Justice",
    icon: Heart,
    className: "text-[#FF69B4] dark:hover:text-[#FF69B4]",
    styles: {
      "--theme-primary": "#FF69B4",
      "--theme-background": "#FFFFFF",
    },
  },
  {
    id: "eve",
    name: "EVE Online",
    icon: Rocket,
    className: "text-[#00FFFF] dark:hover:text-[#00FFFF]",
    styles: {
      "--theme-primary": "#00FFFF",
      "--theme-background": "#000B1E",
    },
  },
]

export function ThemeSelector() {
  const [activeTheme, setActiveTheme] = useState("custom")
  const [isOpen, setIsOpen] = useState(false)

  const applyTheme = useCallback((themeId: string) => {
    const theme = THEMES.find((t) => t.id === themeId)
    if (theme) {
      setActiveTheme(themeId)
      Object.entries(theme.styles).forEach(([property, value]) => {
        document.documentElement.style.setProperty(property, value)
      })
    }
  }, [])

  useEffect(() => {
    // Apply default theme on mount
    applyTheme("custom")
  }, [applyTheme])

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="w-9 px-0">
          <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
            <Palette className="h-4 w-4" />
          </motion.div>
        </Button>
      </DropdownMenuTrigger>
      <AnimatePresence>
        {isOpen && (
          <DropdownMenuContent asChild forceMount>
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              transition={{ type: "spring", duration: 0.3 }}
            >
              {THEMES.map((theme) => (
                <DropdownMenuItem key={theme.id} onClick={() => applyTheme(theme.id)}>
                  <motion.div
                    className="flex items-center gap-2 w-full"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <theme.icon className="h-4 w-4" />
                    <span>{theme.name}</span>
                  </motion.div>
                </DropdownMenuItem>
              ))}
            </motion.div>
          </DropdownMenuContent>
        )}
      </AnimatePresence>
    </DropdownMenu>
  )
}

