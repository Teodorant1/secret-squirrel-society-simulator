import { motion } from "framer-motion";

export function ParticleField() {
  return (
    <div className="pointer-events-none fixed inset-0">
      {Array.from({ length: 50 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-1 w-1 rounded-full bg-blue-500/20"
          initial={{
            x: Math.random(),
            y: Math.random(),
          }}
          animate={{
            x: Math.random(),
            y: Math.random(),
          }}
          transition={{
            duration: Math.random() * 20 + 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}
