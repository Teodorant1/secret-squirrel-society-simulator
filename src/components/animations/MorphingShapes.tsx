import React from "react";
import { motion } from "framer-motion";

function MorphingShapes() {
  return (
    <div className="relative inset-0 mx-12 flex items-center justify-center">
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          animate={{
            rotate: [0, 360],
            scale: [1, 1.2, 0.8, 1],
            borderRadius: ["20%", "50%", "30%", "20%"],
          }}
          transition={{
            duration: 10 + i * 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          style={{
            width: `${100 - i * 15}px`,
            height: `${100 - i * 15}px`,
            border: `2px solid rgba(${i % 2 ? "0, 142, 150" : "66, 167, 213"}, ${0.7 - i * 0.1})`,
            backgroundColor: `rgba(${i % 2 ? "19, 101, 104" : "17, 74, 116"}, ${0.1 - i * 0.02})`,
          }}
        />
      ))}
    </div>
  );
}

export default MorphingShapes;
