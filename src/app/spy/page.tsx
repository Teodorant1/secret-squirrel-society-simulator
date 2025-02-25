"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";

export default function HomePage() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-3xl px-4"
      >
        <motion.h1
          className="mb-6 text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Secret Politics
        </motion.h1>
        <motion.p
          className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          A game of deception, strategy, and political intrigue. Choose your
          theme and dive into a world of hidden agendas and shifting alliances.
        </motion.p>
        <motion.div
          className="flex flex-col justify-center gap-4 sm:flex-row"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Link href="/spy/game">
            <Button size="lg" className="min-w-[200px]">
              Play Now
            </Button>
          </Link>
          <Link href="/spy/customize">
            <Button size="lg" variant="outline" className="min-w-[200px]">
              Customize Game
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
