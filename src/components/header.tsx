"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { ThemeSelector } from "@/components/theme-selector"
import { Shield, Activity } from "lucide-react"

export function Header() {
  return (
    <motion.header
      className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
    >
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/spy" className="flex items-center gap-2">
          <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
            <Shield className="h-5 w-5" />
          </motion.div>
          <motion.span
            className="text-xl font-bold"
            animate={{
              textShadow: [
                "0 0 0px rgba(var(--primary), 0)",
                "0 0 10px rgba(var(--primary), 0.2)",
                "0 0 0px rgba(var(--primary), 0)",
              ],
            }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          >
            Secret Politics
          </motion.span>
        </Link>

        <div className="flex items-center gap-4">
          <motion.div
            className="text-sm text-muted-foreground flex items-center gap-2"
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          >
            <Activity className="h-4 w-4" />
            System Active
          </motion.div>

          <Link href="/spy/customize">
            <Button variant="outline" size="sm">
              Customize
            </Button>
          </Link>
          <ThemeSelector />
          <ModeToggle />
        </div>
      </div>
    </motion.header>
  )
}

