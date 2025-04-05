"use client";

// import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Activity } from "lucide-react";
// import { GlitchText } from "@/components/effects/glitch-text";
import { NavMenu } from "@/components/nav-menu";
import { Card } from "@/components/ui/card";
import { Radio } from "lucide-react";
import MorphingShapes from "./animations/MorphingShapes";
export function Header() {
  // const [seed] = useState(Math.random() * 1000);

  return (
    <motion.header
      className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
    >
      <div className="container mx-2 flex items-center justify-between px-4 py-3">
        {/* Signal Monitor */}
        <Card className="relative flex p-6">
          <div className="mb-4 flex items-center gap-2">
            <Radio className="h-5 w-5" />
            <h3 className="text-xl font-semibold">Signal Monitor</h3>
          </div>
          <div className="flex h-24 items-center">
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                className="mx-0.5 w-1 bg-primary"
                animate={{
                  height: [10, Math.random() * 60 + 20, 10],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: i * 0.1,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        </Card>
        <Link href="/spy" className="ml-12 flex w-fit items-center gap-2">
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            <MorphingShapes />
          </motion.div>
          {/* <GlitchText
            text="Secret-Squirrel-Society-Simulator"
            className="text-xl font-bold"
          /> */}
          <div>Secret-Squirrel-Society-Simulator</div>
        </Link>

        <div className="ml-12 flex flex-col items-center gap-4 md:flex-row">
          <motion.div
            className="hidden items-center gap-2 text-sm text-muted-foreground sm:flex"
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          >
            <Activity className="h-4 w-4" />
            {/* <GlitchText text="System Active" /> */}
            System Active
          </motion.div>

          <NavMenu />
        </div>
      </div>
    </motion.header>
  );
}
