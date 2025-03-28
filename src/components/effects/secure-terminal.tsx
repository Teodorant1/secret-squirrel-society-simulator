"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Terminal } from "lucide-react";
import { useState, useEffect } from "react";
import { Card } from "../ui/card";

const Secure_terminal = () => {
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  useEffect(() => {
    // const lines = [
    //   "> Establishing secure connection...",
    //   "> Encryption protocols active",
    //   "> Terminal access granted",
    //   "> System ready",
    // ];
    const lines = [
      "Booting up the system...",
      "█ Initializing kernel ████...",
      "SYSTEM CHECK: [OK]",
      "Loading security protocols...",
      "Initiating biometric scan...",
      "███ ERROR ███ Retrying...",
      "Verifying credentials...",
      "Credentials corrupted. Restoring backup...",
      "Reattempting authentication...",
      "Checking security clearance...",
      "██ WARNING ██ Unusual activity detected.",
      "█████ SYSTEM OVERRIDE █████",
      "Validating access level...",
      "███ CRITICAL FAILURE ███ Connection lost...",
      "Re-establishing secure channel...",
      "███████ Decrypting signal ███████",
      "Authorization complete.",
      "█ ACCESS GRANTED █ Welcome, Agent.",
    ];

    let currentLine = 0;
    const lineInterval = setInterval(() => {
      if (currentLine < lines.length) {
        setTerminalLines((prev) => [...prev, lines[currentLine]!]);
        currentLine++;
      } else {
        clearInterval(lineInterval);
      }
    }, 950);

    return () => clearInterval(lineInterval);
  }, []);

  return (
    <Card className="relative overflow-hidden p-6">
      <div className="mb-4 flex items-center gap-2">
        <Terminal className="h-5 w-5" />
        <h3 className="text-xl font-semibold">Secure Terminal</h3>
      </div>
      <div className="h-fit overflow-hidden rounded-md bg-black/10 p-4 font-mono text-sm">
        <AnimatePresence>
          {terminalLines.map((line, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 }}
            >
              {line}
            </motion.div>
          ))}
        </AnimatePresence>
        <motion.span
          animate={{ opacity: [0, 1] }}
          transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY }}
        >
          _
        </motion.span>
      </div>
    </Card>
  );
};

export default Secure_terminal;
