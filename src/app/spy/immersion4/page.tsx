"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

export default function Immersion4Page() {
  return (
    <div className="relative min-h-screen overflow-hidden py-12">
      {/* Abstract Background Pattern */}
      {/* <motion.div
        className="fixed inset-0 opacity-20"
        animate={{
          background: [
            "radial-gradient(circle at 30% 30%, rgba(66, 167, 213, 0.4) 0%, transparent 70%)",
            "radial-gradient(circle at 70% 70%, rgba(0, 142, 150, 0.4) 0%, transparent 70%)",
          ],
        }}
        transition={{
          duration: 15,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
      /> */}

      <div className="container relative z-10 mx-auto space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h1 className="mb-4 text-4xl font-bold tracking-tight">
            Abstract Patterns
          </h1>
        </motion.div>
        <div className="grid gap-8 md:grid-cols-2">
          Morphing Shapes
          <Card className="relative overflow-hidden border-opacity-20 bg-opacity-20 p-6 backdrop-blur-sm">
            <div className="relative h-[300px]">
              <MorphingShapes />
            </div>
          </Card>
          Flowing Gradient
          <Card className="relative overflow-hidden border-opacity-20 bg-opacity-20 p-6 backdrop-blur-sm">
            <div className="relative h-[300px]">
              <FlowingGradient />
            </div>
          </Card>
        </div>
        Pulsing Circles
        <Card className="relative overflow-hidden border-opacity-20 bg-opacity-20 p-6 backdrop-blur-sm">
          <div className="relative h-[200px]">
            <PulsingCircles />
          </div>
        </Card>
        <div className="grid gap-8 md:grid-cols-2">
          Particle Field
          <Card className="relative overflow-hidden border-opacity-20 bg-opacity-20 p-6 backdrop-blur-sm">
            <div className="relative h-[300px]">
              <ParticleCanvas />
            </div>
          </Card>
          Wave Pattern
          <Card className="relative overflow-hidden border-opacity-20 bg-opacity-20 p-6 backdrop-blur-sm">
            <div className="relative h-[300px]">
              <WavePattern />
            </div>
          </Card>
        </div>
        Connection Lines
        <Card className="relative overflow-hidden border-opacity-20 bg-opacity-20 p-6 backdrop-blur-sm">
          <div className="relative h-[300px]">
            <ConnectionLines />
          </div>
        </Card>
      </div>
    </div>
  );
}

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

function FlowingGradient() {
  return (
    <motion.div
      className="absolute inset-0"
      animate={{
        background: [
          "linear-gradient(45deg, #008E96 0%, #114A74 50%, #42A7D5 100%)",
          "linear-gradient(135deg, #42A7D5 0%, #196568 50%, #008E96 100%)",
          "linear-gradient(225deg, #114A74 0%, #42A7D5 50%, #137A88 100%)",
          "linear-gradient(315deg, #196568 0%, #008E96 50%, #114A74 100%)",
        ],
      }}
      transition={{
        duration: 15,
        repeat: Number.POSITIVE_INFINITY,
        ease: "linear",
      }}
    />
  );
}

function PulsingCircles() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          animate={{
            scale: [0, 1],
            opacity: [0.8, 0],
          }}
          transition={{
            duration: 4,
            repeat: Number.POSITIVE_INFINITY,
            delay: i * 0.5,
            ease: "easeOut",
          }}
          style={{
            width: "100%",
            height: "100%",
            border: `1px solid rgba(${i % 2 ? "66, 167, 213" : "0, 142, 150"}, ${1 - i * 0.1})`,
          }}
        />
      ))}
    </div>
  );
}

function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const particles: Array<{
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
    }> = [];

    // Create particles
    for (let i = 0; i < 50; i++) {
      const colors = [
        "rgba(0, 142, 150, 0.7)",
        "rgba(66, 167, 213, 0.7)",
        "rgba(19, 122, 136, 0.7)",
      ];
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 1,
        speedY: (Math.random() - 0.5) * 1,
        color: colors[Math.floor(Math.random() * colors.length)] ?? "",
      });
    }

    function animate() {
      const canvas = canvasRef.current;
      if (!canvas) return; // Prevents execution if canvas is null

      const ctx = canvas.getContext("2d");
      if (!ctx) return; // Prevents execution if ctx is null

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Ensure particles array exists
      if (!particles || particles.length === 0) return;

      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (!p) continue; // Prevents possible 'undefined' error

        p.x += p.speedX;
        p.y += p.speedY;

        // Bounce off edges
        if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
        if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        // Draw connections
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          if (!p2) continue; // Prevents possible 'undefined' error

          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(126, 181, 212, ${0.1 - distance * 0.001})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(animate);
    }

    animate();

    return () => {
      // Cleanup if needed
    };
  }, []);

  return <canvas ref={canvasRef} className="h-full w-full" />;
}

function WavePattern() {
  return (
    <div className="absolute inset-0">
      {Array.from({ length: 10 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute bottom-0 left-0 right-0 h-1 bg-opacity-30"
          style={{
            backgroundColor: i % 2 ? "#42A7D5" : "#008E96",
            bottom: `${i * 10}%`,
          }}
          animate={{
            y: [0, 10, -10, 0],
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

function ConnectionLines() {
  const nodes = Array.from({ length: 12 }, (_, i) => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 2,
  }));

  return (
    <div className="absolute inset-0">
      {/* Connection lines */}
      {nodes.map((node, i) =>
        nodes.slice(i + 1).map((target, j) => (
          <motion.div
            key={`${i}-${j}`}
            className="absolute left-0 top-0 h-px"
            style={{
              width: `${Math.hypot(target.x - node.x, target.y - node.y)}%`,
              left: `${node.x}%`,
              top: `${node.y}%`,
              transformOrigin: "left center",
              transform: `rotate(${Math.atan2(target.y - node.y, target.x - node.x)}rad)`,
              backgroundColor: j % 2 ? "#42A7D5" : "#008E96",
            }}
            animate={{
              opacity: [0.1, 0.3, 0.1],
              height: ["1px", "2px", "1px"],
            }}
            transition={{
              duration: Math.random() * 2 + 2,
              repeat: Number.POSITIVE_INFINITY,
            }}
          />
        )),
      )}

      {/* Nodes */}
      {nodes.map((node, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: `${node.size}px`,
            height: `${node.size}px`,
            left: `${node.x}%`,
            top: `${node.y}%`,
            transform: "translate(-50%, -50%)",
            backgroundColor:
              i % 3 === 0 ? "#008E96" : i % 3 === 1 ? "#42A7D5" : "#137A88",
          }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: Math.random() * 2 + 1,
            repeat: Number.POSITIVE_INFINITY,
          }}
        />
      ))}
    </div>
  );
}
