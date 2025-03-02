/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface TerminalTextProps {
  text: string;
  className?: string;
  typingSpeed?: number;
  blinkCursor?: boolean;
  startDelay?: number;
}

export function TerminalText({
  text,
  className,
  typingSpeed = 50,
  blinkCursor = true,
  startDelay = 0,
}: TerminalTextProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [mysticalEffect, setMysticalEffect] = useState(false);
  const [glowColor, setGlowColor] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Ethereal colors for the text glow effect
  const etherealColors = [
    "#00a2ff80", // cyan
    "#ff00ff80", // magenta
    "#4a9eff80", // blue
    //  "#ff71ce80", // pink
    //   "#01cdfe80", // bright cyan
  ];

  // Mystical symbols that occasionally appear
  const mysticalSymbols = "✧⚝✺❈❋⚜";

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    let typingInterval: NodeJS.Timeout;

    // eslint-disable-next-line prefer-const
    timeout = setTimeout(() => {
      setIsTyping(true);
      let currentIndex = 0;

      typingInterval = setInterval(() => {
        if (currentIndex <= text.length) {
          setDisplayedText((prev) => {
            // Occasionally add mystical symbols
            if (Math.random() < 0.05) {
              setMysticalEffect(true);
              setTimeout(() => setMysticalEffect(false), 500);
              return (
                text.substring(0, currentIndex) +
                mysticalSymbols[
                  Math.floor(Math.random() * mysticalSymbols.length)
                ]
              );
            }
            return text.substring(0, currentIndex);
          });
          currentIndex++;
        } else {
          clearInterval(typingInterval);
          setIsTyping(false);
        }
      }, typingSpeed);
    }, startDelay);

    // Ethereal glow color cycle
    const glowInterval = setInterval(() => {
      setGlowColor((prev) => (prev + 1) % etherealColors.length);
    }, 2000);

    return () => {
      clearTimeout(timeout);
      clearInterval(typingInterval);
      clearInterval(glowInterval);
    };
  }, [text, typingSpeed, startDelay]);

  // Ethereal particle effect
  const renderParticles = () => {
    return Array.from({ length: 3 }).map((_, i) => (
      <motion.div
        key={i}
        className="pointer-events-none absolute"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        }}
        animate={{
          y: [0, -20],
          x: [0, Math.random() * 20 - 10],
          opacity: [0, 0.5, 0],
          scale: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          delay: i * 0.3,
        }}
      >
        {mysticalSymbols[Math.floor(Math.random() * mysticalSymbols.length)]}
      </motion.div>
    ));
  };

  return (
    <div className={cn("relative", className)} ref={containerRef}>
      {/* Ethereal background glow */}
      <motion.div
        className="absolute inset-0 -z-10 opacity-20"
        animate={{
          background: [
            `radial-gradient(circle, ${etherealColors[glowColor]} 0%, transparent 70%)`,
            `radial-gradient(circle, ${etherealColors[(glowColor + 1) % etherealColors.length]} 20%, transparent 90%)`,
          ],
        }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
      />

      {/* Main text with glow effect */}
      <motion.span
        style={{
          textShadow: `0 0 10px ${etherealColors[glowColor]}`,
        }}
        animate={{
          textShadow: mysticalEffect
            ? [
                `0 0 10px ${etherealColors[glowColor]}`,
                `0 0 20px ${etherealColors[glowColor]}`,
                `0 0 10px ${etherealColors[glowColor]}`,
              ]
            : "",
        }}
        transition={{ duration: 0.5 }}
      >
        {displayedText}
      </motion.span>

      {/* Mystical cursor */}
      {(isTyping || blinkCursor) && (
        <motion.span
          animate={{
            opacity: [1, 0, 1], // Blinking effect remains
            height: "1em", // Fixed height
          }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
        />
      )}

      {/* Ethereal particles */}
      <AnimatePresence>{isTyping && renderParticles()}</AnimatePresence>
    </div>
  );
}
