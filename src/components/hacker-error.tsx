"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  RefreshCw,
  Terminal,
  X,
  AlertCircle,
} from "lucide-react";
import { CRTScanlines } from "./effects/crt-scanlines";
import { GlitchText } from "./effects/glitch-text";

interface HackerErrorProps {
  title?: string;
  message?: string;
  code?: string;
  onRetry?: () => void;
  onClose?: () => void;
  className?: string;
  severity?: "warning" | "error" | "critical";
}

export function HackerError({
  title = "SYSTEM_ERROR//",
  message = "An unexpected error has occurred in the system.",
  code = "ERR_0x" +
    Math.floor(Math.random() * 10000)
      .toString(16)
      .toUpperCase()
      .padStart(4, "0"),
  onRetry,
  onClose,
  className,
  severity = "error",
}: HackerErrorProps) {
  const [isGlitching, setIsGlitching] = useState(false);
  const [errorLines, setErrorLines] = useState<string[]>([]);
  const [seed] = useState(Math.random() * 1000);

  // Color mapping based on severity
  const colorMap = {
    warning: {
      border: "border-amber-500/50",
      bg: "bg-amber-500/10",
      icon: <AlertTriangle className="h-6 w-6 text-amber-500" />,
      glitchColor: "#f59e0b",
    },
    error: {
      border: "border-red-500/50",
      bg: "bg-red-500/10",
      icon: <AlertCircle className="h-6 w-6 text-red-500" />,
      glitchColor: "#ef4444",
    },
    critical: {
      border: "border-red-700/50",
      bg: "bg-red-700/10",
      icon: <X className="h-6 w-6 text-red-700" />,
      glitchColor: "#b91c1c",
    },
  };

  const currentStyle = colorMap[severity];

  useEffect(() => {
    // Random glitch effect
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setIsGlitching(true);
        setTimeout(() => setIsGlitching(false), 200);
      }
    }, 3000);

    // Generate error details
    const errors = [
      `> Error code: ${code}`,
      `> Timestamp: ${new Date().toISOString()}`,
      `> Severity: ${severity.toUpperCase()}`,
      `> System: NETWORK_CORE`,
      `> Module: SECURITY_PROTOCOL`,
      `> Stack trace available in system logs`,
    ];

    errors.forEach((line, index) => {
      setTimeout(() => {
        setErrorLines((prev) => [...prev, line]);
      }, index * 300);
    });

    return () => clearInterval(interval);
  }, [code, severity]);

  return (
    <div className={`relative ${className}`}>
      <CRTScanlines
        intensity="medium"
        seed={seed}
        color={`${currentStyle.glitchColor}20`}
      />

      <Card
        className={`bg-black/70 p-6 ${currentStyle.border} relative mx-auto max-w-md overflow-hidden backdrop-blur-sm`}
      >
        {/* Glitch effect on error */}
        {isGlitching && (
          <motion.div
            className={`absolute inset-0 ${currentStyle.bg}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.3, 0] }}
            transition={{ duration: 0.2 }}
          />
        )}

        {/* Scan line animation */}
        <motion.div
          className={`absolute inset-0 h-1 w-full ${currentStyle.bg}`}
          animate={{
            top: ["0%", "100%", "0%"],
          }}
          transition={{
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />

        <div className="flex items-start gap-4">
          <div className="mt-1">{currentStyle.icon}</div>

          <div className="flex-1">
            <GlitchText
              text={title}
              as="h2"
              className="mb-2 font-mono text-xl font-bold"
              glitchFactor={2}
              color={currentStyle.glitchColor}
              highlightColor="#ffffff"
              seed={seed}
            />

            <p className="mb-4 font-mono text-sm text-gray-300">{message}</p>

            {/* Error details */}
            <div className="mb-4 h-24 overflow-y-auto rounded border border-gray-800 bg-black/50 p-2 font-mono text-xs text-gray-400">
              {errorLines.map((line, index) => (
                <div key={index} className="mb-1">
                  {line}
                </div>
              ))}
              <motion.span
                animate={{ opacity: [0, 1] }}
                transition={{ duration: 0.8, repeat: Number.POSITIVE_INFINITY }}
              >
                _
              </motion.span>
            </div>

            <div className="flex justify-end gap-2">
              {onRetry && (
                <Button
                  onClick={onRetry}
                  variant="outline"
                  className="border-blue-500/30 font-mono text-xs text-blue-300 hover:bg-blue-900/20"
                >
                  <RefreshCw className="mr-2 h-3 w-3" />
                  RETRY//
                </Button>
              )}

              {onClose && (
                <Button
                  onClick={onClose}
                  variant="outline"
                  className="border-gray-700 font-mono text-xs text-gray-300 hover:bg-gray-800/20"
                >
                  <Terminal className="mr-2 h-3 w-3" />
                  CLOSE//
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Animated error indicator */}
        <motion.div
          className="absolute -right-1 -top-1 h-2 w-2 rounded-full"
          style={{ backgroundColor: currentStyle.glitchColor }}
          animate={{
            opacity: [0.6, 1, 0.6],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        />
      </Card>
    </div>
  );
}
