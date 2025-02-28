"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Eye,
  EyeOff,
  Lock,
  User,
  Mail,
  Terminal,
  Shield,
  Database,
  Cpu,
} from "lucide-react";
import { CRTScanlines } from "@/components/effects/crt-scanlines";
import { GlitchText } from "@/components/effects/glitch-text";
import { TerminalText } from "@/components/effects/terminal-text";

interface HackerRegistrationProps {
  onRegister?: (data: {
    username: string;
    email: string;
    password: string;
  }) => void;
  className?: string;
}

export function HackerRegistration({
  onRegister,
  className,
}: HackerRegistrationProps) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const [isRegistering, setIsRegistering] = useState(false);
  const [seed] = useState(Math.random() * 1000);

  useEffect(() => {
    // Initialize terminal with boot sequence
    const bootSequence = [
      "> Initializing secure registration protocol...",
      "> Establishing encrypted connection...",
      "> Generating cryptographic keys...",
      "> System ready.",
      "> Awaiting user credentials...",
    ];

    bootSequence.forEach((line, index) => {
      setTimeout(() => {
        setTerminalOutput((prev) => [...prev, line]);
      }, index * 500);
    });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setIsRegistering(true);
    setTerminalOutput((prev) => [
      ...prev,
      `> Processing registration for ${username}...`,
    ]);

    // Simulate registration process
    setTimeout(() => {
      setTerminalOutput((prev) => [...prev, "> Validating credentials..."]);

      setTimeout(() => {
        setTerminalOutput((prev) => [...prev, "> Encrypting user data..."]);

        setTimeout(() => {
          setTerminalOutput((prev) => [
            ...prev,
            "> Registration successful. Welcome to the network.",
          ]);
          setIsRegistering(false);

          if (onRegister) {
            onRegister({ username, email, password });
          }
        }, 1000);
      }, 800);
    }, 1000);
  };

  return (
    <div className={`relative ${className}`}>
      <CRTScanlines intensity="light" seed={seed} />

      <Card className="relative mx-auto max-w-md overflow-hidden border-blue-500/30 bg-black/70 p-6 backdrop-blur-sm">
        {/* Scan line animation */}
        <motion.div
          className="absolute inset-0 h-1 w-full bg-blue-400/10"
          animate={{
            top: ["0%", "100%", "0%"],
          }}
          transition={{
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />

        <div className="mb-6 text-center">
          <GlitchText
            text="SECURE_REGISTRATION//"
            as="h2"
            className="mb-2 font-mono text-2xl font-bold"
            glitchFactor={1.5}
            seed={seed}
          />
          <TerminalText
            text="Enter your credentials to join the network"
            className="font-mono text-sm text-blue-300/80"
            typingSpeed={20}
          />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label className="flex items-center gap-2 font-mono text-blue-300">
              <User className="h-4 w-4" />
              USERNAME//
            </Label>
            <div className="relative">
              <Input
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (e.target.value.length > 0 && Math.random() > 0.7) {
                    setTerminalOutput((prev) => [
                      ...prev,
                      `> Username input: ${e.target.value}`,
                    ]);
                  }
                }}
                className="border-blue-500/30 bg-black/50 pl-10 font-mono text-blue-300"
                required
              />
              <Terminal className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-blue-500/70" />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 font-mono text-blue-300">
              <Mail className="h-4 w-4" />
              EMAIL//
            </Label>
            <div className="relative">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-blue-500/30 bg-black/50 pl-10 font-mono text-blue-300"
                required
              />
              <Database className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-blue-500/70" />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 font-mono text-blue-300">
              <Lock className="h-4 w-4" />
              PASSWORD//
            </Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-blue-500/30 bg-black/50 pl-10 font-mono text-blue-300"
                required
              />
              <Shield className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-blue-500/70" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 transform text-blue-500/70"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="terms"
              className="border-blue-500/50 data-[state=checked]:bg-blue-600"
            />
            <label
              htmlFor="terms"
              className="font-mono text-sm leading-none text-blue-300/80 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              I agree to the terms and conditions
            </label>
          </div>

          <Button
            type="submit"
            className="group relative w-full overflow-hidden bg-blue-600 text-primary-foreground hover:bg-blue-700"
            disabled={isRegistering}
          >
            <span className="relative z-10 flex items-center justify-center gap-2 font-mono">
              {isRegistering ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    }}
                  >
                    <Cpu className="h-4 w-4" />
                  </motion.div>
                  PROCESSING//
                </>
              ) : (
                <>
                  <Cpu className="h-4 w-4" />
                  REGISTER//
                </>
              )}
            </span>
            <motion.div
              className="absolute inset-0 bg-blue-400/20"
              animate={{
                y: ["100%", "-100%"],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
            />
          </Button>
        </form>

        {/* Terminal output */}
        <div className="mt-6 h-24 overflow-y-auto rounded border border-blue-500/20 bg-black/50 p-2 font-mono text-xs text-blue-300/80">
          {terminalOutput.map((line, index) => (
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
      </Card>
    </div>
  );
}
