/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useEffect, useState, useRef } from "react";

interface CRTScanlinesProps {
  className?: string;
  intensity?: "light" | "medium" | "heavy";
  color?: string;
  seed?: number;
}

export function CRTScanlines({
  className,
  intensity = "medium",
  color = "rgba(0, 162, 255, 0.15)",
  seed,
}: CRTScanlinesProps) {
  const [randomSeed, setRandomSeed] = useState(seed ?? Math.random() * 4000);
  const [auroraPhase, setAuroraPhase] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Ethereal color palette
  const etherealColors = [
    "rgba(0, 162, 255, 0.15)", // cyan
    "rgba(255, 0, 255, 0.15)", // magenta
    "rgba(74, 158, 255, 0.15)", // blue
    "rgba(255, 113, 206, 0.15)", // pink
    "rgba(1, 205, 254, 0.15)", // bright cyan
  ];

  // Keep track of container size
  const [containerSize, setContainerSize] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setContainerSize({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };

    // Initial size update
    updateSize();

    // Resize listener
    const resizeObserver = new ResizeObserver(updateSize);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    // Cleanup resize listener
    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    if (seed === undefined) {
      const seedInterval = setInterval(() => {
        setRandomSeed(Math.random() * 2000);
      }, 10000);

      // Cycle through aurora colors
      const auroraInterval = setInterval(() => {
        setAuroraPhase((prev) => (prev + 1) % etherealColors.length);
      }, 10000);

      return () => {
        clearInterval(seedInterval);
        clearInterval(auroraInterval);
      };
    }
  }, [seed]);

  const intensityMap = {
    light: "opacity-20",
    medium: "opacity-30",
    heavy: "opacity-40",
  };

  // Use seed to create variations in the animation
  const flickerDuration = 0.5 + (randomSeed % 0.5);
  const scanlineDuration = 6 + (randomSeed % 4);
  const scanlineDelay = randomSeed % 2;

  return (
    <div
      ref={containerRef}
      className={cn("pointer-events-none fixed inset-0 z-50", className)}
    >
      {/* Ethereal aurora effect */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            `linear-gradient(45deg, ${etherealColors[auroraPhase]} 0%, transparent 75%)`,
            `linear-gradient(45deg, ${etherealColors[(auroraPhase + 1) % etherealColors.length]} 25%, transparent 100%)`,
          ],
        }}
        transition={{
          duration: flickerDuration,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
      />

      {/* Mystical patterns */}
      <motion.div
        className={`absolute inset-0 ${intensityMap[intensity]}`}
        style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, transparent 0%, ${color} 100%),
          repeating-linear-gradient(0deg, transparent 0%, ${color} 50%, transparent 100%)`,
          backgroundSize: "200% 200%, 100% 4px",
          backgroundPosition: "center",
        }}
        animate={{
          backgroundSize: [
            "200% 200%, 100% 4px",
            "150% 150%, 100% 4px",
            "200% 200%, 100% 4px",
          ],
        }}
        transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY }}
      />

      {/* Enhanced scanlines with ethereal glow */}
      <div
        className={cn("absolute inset-0", intensityMap[intensity])}
        style={{
          backgroundImage: `
            linear-gradient(to bottom,
              transparent 50%,
              ${etherealColors[auroraPhase]} 50%,
              ${etherealColors[(auroraPhase + 1) % etherealColors.length]} 51%,
              transparent 51%
          )`,
          backgroundSize: "100% 4px",
          backgroundRepeat: "repeat",
        }}
      />

      {/* Ethereal vignette effect */}
      <motion.div
        className="absolute inset-0 opacity-30"
        animate={{
          background: [
            `radial-gradient(circle at 50% 50%, transparent 30%, ${etherealColors[auroraPhase]} 100%)`,
            `radial-gradient(circle at 50% 50%, transparent 40%, ${
              etherealColors[(auroraPhase + 1) % etherealColors.length]
            } 100%)`,
          ],
        }}
        transition={{
          duration: 4,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
      />

      {/* Mystical particles */}
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-1 w-1 rounded-full"
          style={{
            background:
              etherealColors[Math.floor(Math.random() * etherealColors.length)],
            boxShadow: `0 0 10px ${etherealColors[auroraPhase]}`,
          }}
          animate={{
            x: [
              `${Math.random() * 100}vw`,
              `${Math.random() * 100}vw`,
              `${Math.random() * 100}vw`,
            ],
            y: [
              `${Math.random() * 100}vh`,
              `${Math.random() * 100}vh`,
              `${Math.random() * 100}vh`,
            ],
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 5 + Math.random() * 5,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />
      ))}

      {/* Enhanced scan line animation */}
      <motion.div
        className="absolute left-0 right-0 h-[2px]"
        style={{
          background: `linear-gradient(to right, transparent, ${etherealColors[auroraPhase]}, transparent)`,
          boxShadow: `0 0 20px ${etherealColors[auroraPhase]}`,
        }}
        animate={{
          top: ["0%", "100%"],
          opacity: [0.3, 0.7, 0.3],
        }}
        transition={{
          top: {
            duration: scanlineDuration,
            ease: "linear",
            repeat: Number.POSITIVE_INFINITY,
            delay: scanlineDelay,
          },
          opacity: {
            duration: flickerDuration,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          },
        }}
      />
    </div>
  );
}
