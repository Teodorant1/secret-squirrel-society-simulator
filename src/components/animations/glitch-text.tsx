"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface GlitchTextProps {
  children: string;
  className?: string;
}

export function GlitchText({ children, className }: GlitchTextProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className={className}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <motion.span
        style={{ display: "inline-block" }}
        animate={
          isHovered
            ? {
                x: [-1, 1, 0],
                color: ["#ff0000", "#0000ff", "currentColor"],
              }
            : {}
        }
        transition={{
          duration: 0.2,
          repeat: isHovered ? Number.POSITIVE_INFINITY : 0,
        }}
      >
        {children}
      </motion.span>
    </motion.div>
  );
}
