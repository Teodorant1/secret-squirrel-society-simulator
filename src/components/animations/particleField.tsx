"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function ParticleField() {
  const [particles, setParticles] = useState<{ x: number; y: number }[]>([]);

  useEffect(() => {
    const w = window.innerWidth;
    const h = window.innerHeight;

    const newParticles = Array.from({ length: 50 }).map(() => ({
      x: Math.random() * w,
      y: Math.random() * h,
    }));

    setParticles(newParticles);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0">
      {particles.map((pos, i) => (
        <motion.div
          key={i}
          className="absolute h-1 w-1 rounded-full bg-blue-500/40"
          initial={{
            x: pos.x,
            y: pos.y,
          }}
          animate={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          transition={{
            duration: Math.random() * 20 + 10,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}
