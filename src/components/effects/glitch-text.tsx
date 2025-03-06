/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import type React from "react";
import { useState, useEffect, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlitchTextProps {
  text: string;
  className?: string;
  glitchFactor?: number;
  as?: React.ElementType;
  intensity?: "normal" | "high" | "extreme";
}

export function GlitchText({
  text,
  className,
  glitchFactor = 1,
  as: Component = "span",
  intensity = "normal",
}: GlitchTextProps) {
  const [isGlitching, setIsGlitching] = useState(false);
  const [glitchTextIndex, setGlitchTextIndex] = useState(0);
  const [etherealPhase, setEtherealPhase] = useState(0);
  const frameRef = useRef<number | null>(null);
  const lastGlitchTimeRef = useRef(0);

  // Mystical symbols for text transformation
  const mysticalSymbols = "⚡☽★☀⚔️✧⚝✺❈❋⚜";

  // Ethereal neon color cycle
  const etherealColors = [
    "#00a2ff", // cyan
    "#ff00ff", // magenta
    "#4a9eff", // blue
    "#ff71ce", // pink
    "#01cdfe", // bright cyan
    "#05ffa1", // mint
    "#b967ff", // purple
    "#fffb96", // yellow
  ];

  // Intensity settings
  const intensitySettings = {
    normal: { interval: 2000, duration: 150, probability: 0.2, maxOffset: 5 },
    high: { interval: 1500, duration: 300, probability: 0.4, maxOffset: 10 },
    extreme: { interval: 1000, duration: 500, probability: 0.6, maxOffset: 15 },
  };
  const settings = intensitySettings[intensity];

  // Precompute glitch variations to avoid redundant recalculations
  const glitchedVariants = useMemo(() => {
    return Array.from({ length: 5 }, () =>
      text
        .split("")
        .map((char) =>
          Math.random() < 0.3
            ? mysticalSymbols[
                Math.floor(Math.random() * mysticalSymbols.length)
              ]
            : char,
        )
        .join(""),
    );
  }, [text]);

  // Animation loop using requestAnimationFrame
  useEffect(() => {
    const glitchLoop = (time: number) => {
      if (time - lastGlitchTimeRef.current > settings.interval / glitchFactor) {
        if (Math.random() < settings.probability * glitchFactor) {
          setIsGlitching(true);
          setGlitchTextIndex((prev) => (prev + 1) % glitchedVariants.length);

          setTimeout(() => {
            setIsGlitching(false);
          }, settings.duration);
        }
        lastGlitchTimeRef.current = time;
      }
      frameRef.current = requestAnimationFrame(glitchLoop);
    };

    frameRef.current = requestAnimationFrame(glitchLoop);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [glitchFactor, settings, glitchedVariants]);

  // Ethereal color cycling
  useEffect(() => {
    const interval = setInterval(() => {
      setEtherealPhase((prev) => (prev + 1) % etherealColors.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Component className={cn("relative inline-block", className)}>
      {/* Base text with ethereal glow */}
      <motion.span
        style={{
          color: etherealColors[etherealPhase],
          textShadow: `0 0 10px ${etherealColors[etherealPhase]}40`,
        }}
        animate={{
          x: isGlitching ? [-2, 2, -1, 1, 0] : 0,
          y: isGlitching ? [1, -1, 1, -1, 0] : 0,
        }}
        transition={{ duration: 0.2 }}
      >
        {isGlitching ? glitchedVariants[glitchTextIndex] : text}
      </motion.span>

      {/* RGB offset overlays */}
      {isGlitching && (
        <>
          <motion.span
            className="absolute left-0 top-0 z-10"
            style={{
              color: "#ff0000", // Red channel offset
              mixBlendMode: "screen",
            }}
            animate={{
              opacity: [0, 0.7, 0],
              x: [settings.maxOffset, -settings.maxOffset, 0],
            }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            {glitchedVariants[glitchTextIndex]}
          </motion.span>

          <motion.span
            className="absolute left-0 top-0 z-10"
            style={{
              color: "#00ff00", // Green channel offset
              mixBlendMode: "screen",
            }}
            animate={{
              opacity: [0, 0.7, 0],
              x: [-settings.maxOffset, settings.maxOffset, 0],
            }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            {glitchedVariants[glitchTextIndex]}
          </motion.span>
        </>
      )}

      {/* Ethereal glow effect */}
      {isGlitching && (
        <motion.div
          className="absolute inset-0 -z-10"
          animate={{
            background: [
              `radial-gradient(circle, ${etherealColors[etherealPhase]}20 0%, transparent 70%)`,
              `radial-gradient(circle, ${etherealColors[(etherealPhase + 1) % etherealColors.length]}40 20%, transparent 90%)`,
            ],
          }}
          transition={{
            duration: 1,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />
      )}
    </Component>
  );
}
