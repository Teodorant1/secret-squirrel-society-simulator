"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Lock, User, Mail, Cpu, CheckCircle } from "lucide-react";

import { GlitchText } from "@/components/effects/glitch-text";
import { TerminalText } from "@/components/effects/terminal-text";
import { HackerError } from "./hacker-error";
import { api } from "@/trpc/react";
import Link from "next/link";

export function HackerRegistration({ className }: { className?: string }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const [hasSucceededRegister, setHasSucceededRegister] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState<boolean | null>(false);
  const [errorText, setErrorText] = useState("");
  const [seed] = useState(Math.random() * 1000);

  useEffect(() => {
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

  const makeAccount = api.auth.register.useMutation({
    onSuccess: async (data) => {
      setIsLoading(false);
      if (data.error === false) {
        setHasSucceededRegister(true);
        setTerminalOutput((prev) => [
          ...prev,
          "> Registration successful. Welcome to the network.",
        ]);
      } else {
        setIsError(true);
        setErrorText(
          data.error_description ?? "An unknown error has occurred.",
        );
        setTerminalOutput((prev) => [
          ...prev,
          `> ERROR: ${data.error_description}`,
        ]);
      }
    },
  });

  const handleRegisterClick = () => {
    setIsLoading(true);
    setIsError(null);
    setTerminalOutput((prev) => [
      ...prev,
      `> Processing registration for ${username}...`,
    ]);
    makeAccount.mutate({ username, email, password });
  };

  return (
    <div className={`relative ${className}`}>
      <Card className="relative mx-auto max-w-md overflow-hidden border-blue-500/30 bg-black/70 p-6 backdrop-blur-sm">
        <div className="mb-6 text-center">
          <GlitchText
            text="SECURE_REGISTRATION//"
            as="h2"
            className="mb-2 font-mono text-2xl font-bold"
            glitchFactor={1.5}
          />
        </div>

        {hasSucceededRegister ? (
          <div className="flex flex-col items-center justify-center text-green-400">
            <CheckCircle className="mb-2 h-10 w-10" />
            <p className="text-lg font-bold">Registration Successful!</p>
            <p>Welcome to the network {username} ! </p>
            <p>
              <Link href="/api/auth/signin" className="text-blue-400 underline">
                <GlitchText
                  text="Proceed_to_Sign_In//"
                  as="h2"
                  className="mb-2 font-mono text-2xl font-bold"
                  glitchFactor={1.5}
                />
              </Link>
            </p>
          </div>
        ) : (
          <>
            {isError && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                <HackerError
                  message={errorText}
                  onClose={() => setIsError(false)}
                />
              </div>
            )}

            <form
              onSubmit={(e) => e.preventDefault()}
              className="mt-5 space-y-4"
            >
              <div className="space-y-2">
                <TerminalText
                  text="Enter your credentials to join the network"
                  className="font-mono text-sm text-blue-300/80"
                  typingSpeed={20}
                />
                <Label className="flex items-center gap-2 font-mono text-blue-300">
                  <User className="h-4 w-4" />
                  USERNAME//
                </Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="border-blue-500/30 bg-black/50 font-mono text-blue-300"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2 font-mono text-blue-300">
                  <Mail className="h-4 w-4" />
                  EMAIL//
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-blue-500/30 bg-black/50 font-mono text-blue-300"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2 font-mono text-blue-300">
                  <Lock className="h-4 w-4" />
                  PASSWORD//
                </Label>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-blue-500/30 bg-black/50 font-mono text-blue-300"
                  required
                />
                <Button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>

              <Button
                onClick={handleRegisterClick}
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {isLoading ? (
                  <Cpu className="h-4 w-4 animate-spin" />
                ) : (
                  "REGISTER//"
                )}
              </Button>
            </form>
          </>
        )}
      </Card>
    </div>
  );
}
