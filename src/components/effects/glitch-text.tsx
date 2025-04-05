"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlitchTextProps {
  text: string;
  className?: string;
  glitchFactor?: number;
  color?: string;
  highlightColor?: string;
  as?: React.ElementType;
  seed?: number;
  intensity?: "normal" | "high" | "extreme";
}

export function GlitchText({
  text,
  className,
  glitchFactor = 1,
  color = "#00a2ff",
  highlightColor = "#ff00ff",
  as: Component = "span",
  seed,
  intensity = "normal",
}: GlitchTextProps) {
  const [isGlitching, setIsGlitching] = useState(false);
  const [randomSeed, setRandomSeed] = useState(seed ?? Math.random() * 1000);
  const [glitchText, setGlitchText] = useState(text);
  const [etherealPhase, setEtherealPhase] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Mystical symbols for text transformation
  const mysticalSymbols = "⚡☽★☀⚔️✧⚝✺❈❋⚜";

  // Ethereal color transitions
  const etherealColors = [
    "#00a2ff", // cyan
    "#ff00ff", // magenta
    "#4a9eff", // blue
    //    "#ff71ce", // pink
    "#01cdfe", // bright cyan
    //    "#05ffa1", // mint
    "#b967ff", // purple
    //    "#fffb96", // yellow
  ];

  // Intensity settings with ethereal modifications
  const intensitySettings = {
    normal: {
      glitchInterval: 2000,
      glitchDuration: 150,
      glitchProbability: 0.2,
      maxOffset: 5,
      textChangeProbability: 0.3,
      etherealProbability: 0.2,
    },
    high: {
      glitchInterval: 1500,
      glitchDuration: 300,
      glitchProbability: 0.4,
      maxOffset: 10,
      textChangeProbability: 0.5,
      etherealProbability: 0.4,
    },
    extreme: {
      glitchInterval: 1000,
      glitchDuration: 500,
      glitchProbability: 0.6,
      maxOffset: 15,
      textChangeProbability: 0.7,
      etherealProbability: 0.6,
    },
  };

  // Ensure we have valid settings by defaulting to 'normal' if intensity is invalid
  const settings = intensitySettings[intensity] || intensitySettings.normal;

  // Ethereal color cycle effect
  useEffect(() => {
    const interval = setInterval(() => {
      setEtherealPhase((prev) => (prev + 1) % etherealColors.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Main glitch effect with ethereal modifications
  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Ensure we have valid settings
    const currentSettings = settings || intensitySettings.normal;
    const glitchInterval =
      currentSettings.glitchInterval / glitchFactor + (randomSeed % 1000);

    intervalRef.current = setInterval(() => {
      if (Math.random() < currentSettings.glitchProbability * glitchFactor) {
        setIsGlitching(true);

        // Generate ethereal glitched text
        if (Math.random() < currentSettings.textChangeProbability) {
          const glitched = text
            .split("")
            .map((char) => {
              if (Math.random() < currentSettings.etherealProbability) {
                return mysticalSymbols[
                  Math.floor(Math.random() * mysticalSymbols.length)
                ];
              }
              if (Math.random() < 0.2) {
                return String.fromCharCode(
                  0x0370 + Math.floor(Math.random() * 50),
                ); // Greek letters
              }
              return char;
            })
            .join("");
          setGlitchText(glitched);
        }

        setTimeout(() => {
          setIsGlitching(false);
          setGlitchText(text);
        }, currentSettings.glitchDuration);
      }
    }, glitchInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [glitchFactor, randomSeed, text, settings]);

  // Ethereal clip path generation
  const getEtherealClipPath = () => {
    const r1 = (randomSeed * 10) % 100;
    const r2 = (randomSeed * 20) % 100;
    const offset = (settings || intensitySettings.normal).maxOffset;
    return `polygon(${r1 % offset}% 0%, 100% ${r2 % offset}%, ${100 - (r1 % offset)}% 100%, 0% ${100 - (r2 % offset)}%)`;
  };

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
        {glitchText}
      </motion.span>

      {/* Ethereal overlay layers */}
      <motion.span
        className="absolute left-0 top-0 z-10"
        style={{
          color: etherealColors[(etherealPhase + 2) % etherealColors.length],
          mixBlendMode: "screen",
        }}
        animate={{
          opacity: isGlitching ? [0, 0.7, 0] : 0,
          x: isGlitching ? [settings.maxOffset, -settings.maxOffset, 0] : 0,
          clipPath: isGlitching
            ? [
                getEtherealClipPath(),
                getEtherealClipPath(),
                getEtherealClipPath(),
              ]
            : "none",
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {glitchText}
      </motion.span>

      {/* Mystical aura effect */}
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

      {/* Ethereal particles */}
      {isGlitching &&
        Array.from({ length: 3 }).map((_, i) => (
          <motion.span
            key={i}
            className="pointer-events-none absolute left-0 top-0"
            style={{
              color:
                etherealColors[(etherealPhase + i) % etherealColors.length],
              opacity: 0.5,
            }}
            animate={{
              y: [0, -10, 0],
              x: [0, i * 5 - 5, 0],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 0.5,
              delay: i * 0.1,
              repeat: Number.POSITIVE_INFINITY,
            }}
          >
            {
              mysticalSymbols[
                Math.floor(Math.random() * mysticalSymbols.length)
              ]
            }
          </motion.span>
        ))}
    </Component>
  );
}
