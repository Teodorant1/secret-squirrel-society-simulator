"use client";

import type React from "react";

import { Header } from "@/components/header";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { ParticleField } from "@/components/animations/particleField";

export default function SpyLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <AnimatePresence mode="wait">
        <motion.main
          key={pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="container mx-auto p-4"
        >
          <ParticleField />
          {children}
        </motion.main>
      </AnimatePresence>
    </div>
  );
}
