"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { Shield, Activity } from "lucide-react";
import { GlitchText } from "@/components/effects/glitch-text";

export function Header() {
  const [seed] = useState(Math.random() * 1000);

  return (
    <motion.header
      className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
    >
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link href="/spy" className="flex items-center gap-2">
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            <Shield className="h-5 w-5" />
          </motion.div>
          <GlitchText
            text="Secret Politics"
            className="text-xl font-bold"
            seed={seed}
          />
        </Link>

        <div className="flex items-center gap-4">
          <motion.div
            className="flex items-center gap-2 text-sm text-muted-foreground"
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          >
            <Activity className="h-4 w-4" />
            <GlitchText text="System Active" seed={seed + 1} />
          </motion.div>

          <Link href="/spy/customize">
            <Button variant="outline" size="sm">
              <GlitchText text="Customize" seed={seed + 2} />
            </Button>
          </Link>
          <ModeToggle />
        </div>
      </div>
    </motion.header>
  );
}
