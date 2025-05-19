"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Activity, Radio } from "lucide-react";
import { NavMenu } from "@/components/nav-menu";
import { Card } from "@/components/ui/card";
import MorphingShapes from "./animations/MorphingShapes";

export function Header() {
  return (
    <motion.header
      className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
    >
      <div className="container flex flex-col items-center justify-between gap-y-12 px-2 py-8 md:flex-row md:gap-y-0">
        {/* Logo and Link */}
        <Link
          href="/spy"
          className="mx-auto my-5 flex flex-row items-center px-4 md:flex-row md:gap-4"
        >
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            <MorphingShapes />
          </motion.div>
          <div className="whitespace-nowrap text-center text-lg font-semibold md:text-left">
            Secret-Squirrel-Society-Simulator
          </div>
        </Link>{" "}
        {/* Signal Monitor */}
        <Card className="relative mx-auto flex w-fit p-5">
          <div className="mb-4 mr-5 flex items-center gap-2">
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
      </div>
      {/* System Active + NavMenu */}
      <div className="flex flex-col items-center gap-4 p-5 md:ml-12 md:flex-row">
        <motion.div
          className="hidden items-center gap-2 whitespace-nowrap text-sm text-muted-foreground sm:flex"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        >
          <Activity className="h-4 w-4" />
          System Active
        </motion.div>

        <NavMenu />
      </div>
    </motion.header>
  );
}
