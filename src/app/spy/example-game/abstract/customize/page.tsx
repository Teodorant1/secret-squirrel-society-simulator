"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FileUp, Shield, Skull, Crown } from "lucide-react";

export default function CustomizePage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [formState, setFormState] = useState({
    resistance: {
      name: "Resistance",
      laws: "Emergency Protocols",
      leader: "Commander",
      logo: null as string | null,
    },
    infiltrators: {
      name: "Infiltrators",
      laws: "Shadow Directives",
      leader: "Mastermind",
      logo: null as string | null,
      leaderImage: null as string | null,
    },
  });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    faction: "resistance" | "infiltrators",
    type: "logo" | "leaderImage",
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormState((prev) => ({
          ...prev,
          [faction]: {
            ...prev[faction],
            [type]: reader.result as string,
          },
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Abstract Background Pattern */}
      <motion.div
        className="fixed inset-0 opacity-20"
        animate={{
          background: [
            "radial-gradient(circle at var(--x) var(--y), rgba(var(--primary), 0.1) 0%, transparent 70%)",
            "radial-gradient(circle at var(--x) var(--y), rgba(var(--primary), 0.15) 0%, transparent 70%)",
          ],
        }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
        style={
          {
            "--x": mousePosition.x + "px",
            "--y": mousePosition.y + "px",
          } as never
        }
      />

      {/* Floating Particles */}
      <ParticleField />

      <div className="container relative z-10 mx-auto max-w-4xl space-y-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="mb-4 text-4xl font-bold tracking-tight">
            Customize Operation
          </h1>
          <p className="text-lg text-muted-foreground">
            Configure operation parameters and faction identifiers
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2">
          <FactionCustomization
            faction="resistance"
            data={formState.resistance}
            onChange={(key, value) =>
              setFormState((prev) => ({
                ...prev,
                resistance: { ...prev.resistance, [key]: value },
              }))
            }
            onImageUpload={(e) => handleImageUpload(e, "resistance", "logo")}
            icon={Shield}
            type="primary"
          />

          <FactionCustomization
            faction="infiltrators"
            data={formState.infiltrators}
            onChange={(key, value) =>
              setFormState((prev) => ({
                ...prev,
                infiltrators: { ...prev.infiltrators, [key]: value },
              }))
            }
            onImageUpload={(e) => handleImageUpload(e, "infiltrators", "logo")}
            onLeaderImageUpload={(e) =>
              handleImageUpload(e, "infiltrators", "leaderImage")
            }
            icon={Skull}
            type="destructive"
            showLeaderImage
          />
        </div>

        <motion.div
          className="flex justify-center"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.button
            whileHover={{
              scale: 1.02,
              boxShadow: "0 0 10px rgba(var(--primary), 0.2)",
            }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="rounded-md bg-primary px-8 py-2 text-primary-foreground"
          >
            Confirm Changes
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}

function ParticleField() {
  return (
    <div className="pointer-events-none fixed inset-0">
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-1 w-1 rounded-full bg-primary/20"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          animate={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
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

interface FactionCustomizationProps {
  faction: string;
  data: {
    name: string;
    laws: string;
    leader: string;
    logo: string | null;
    leaderImage?: string | null;
  };
  onChange: (key: string, value: string) => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLeaderImageUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon: React.ElementType;
  type: "primary" | "destructive";
  showLeaderImage?: boolean;
}

function FactionCustomization({
  faction,
  data,
  onChange,
  onImageUpload,
  onLeaderImageUpload,
  icon: Icon,
  type,
  showLeaderImage,
}: FactionCustomizationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="group"
    >
      <Card className="relative overflow-hidden p-6">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100"
          initial={false}
          animate={{
            backgroundPosition: ["100% 0%", "0% 0%"],
          }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />

        <div className="relative space-y-6">
          <div className="flex items-center gap-2 text-xl font-semibold">
            <Icon className="h-5 w-5" />
            <h2>{faction}</h2>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            {/* Form fields */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Label>Designation</Label>
              <Input
                value={data.name}
                onChange={(e) => onChange("name", e.target.value)}
                className="bg-background transition-shadow duration-200 hover:shadow-md"
              />
            </motion.div>

            <div className="space-y-2">
              <Label>Directive Classification</Label>
              <Input
                value={data.laws}
                onChange={(e) => onChange("laws", e.target.value)}
                className="bg-background"
              />
            </div>

            <div className="space-y-2">
              <Label>Command Authority</Label>
              <Input
                value={data.leader}
                onChange={(e) => onChange("leader", e.target.value)}
                className="bg-background"
              />
            </div>

            <div className="space-y-2">
              <Label>Insignia</Label>
              <div className="flex items-center gap-4">
                {data.logo && (
                  <motion.img
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    src={data.logo || "/placeholder.svg"}
                    alt="Faction logo"
                    className="h-16 w-16 rounded object-cover"
                  />
                )}
                <Button variant="outline" className="w-full" asChild>
                  <label className="cursor-pointer">
                    <FileUp className="mr-2 h-4 w-4" />
                    Upload Insignia
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={onImageUpload}
                    />
                  </label>
                </Button>
              </div>
            </div>

            {showLeaderImage && onLeaderImageUpload && (
              <div className="space-y-2">
                <Label>Authority Figure</Label>
                <div className="flex items-center gap-4">
                  {data.leaderImage && (
                    <img
                      src={data.leaderImage || "/placeholder.svg"}
                      alt="Leader"
                      className="h-16 w-16 rounded object-cover"
                    />
                  )}
                  <Button variant="outline" className="w-full" asChild>
                    <label className="cursor-pointer">
                      <Crown className="mr-2 h-4 w-4" />
                      Upload Image
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={onLeaderImageUpload}
                      />
                    </label>
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );
}
