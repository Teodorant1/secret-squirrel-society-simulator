"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, Lock, Shield, Eye, FileWarning } from "lucide-react";
import { GlitchText } from "@/components/effects/glitch-text";
import { TerminalText } from "@/components/effects/terminal-text";
import { CRTScanlines } from "@/components/effects/crt-scanlines";

export default function MuseumPage() {
  const [selectedAnomaly, setSelectedAnomaly] = useState<string | null>(null);
  const [securityLevel, setSecurityLevel] = useState<number>(4);
  const [containmentBreach, setContainmentBreach] = useState<boolean>(false);
  const [redactedMode, setRedactedMode] = useState<boolean>(false);

  useEffect(() => {
    // Random chance of containment breach warning
    const breachInterval = setInterval(() => {
      if (Math.random() < 0.05) {
        setContainmentBreach(true);
        setTimeout(() => setContainmentBreach(false), 5000);
      }
    }, 30000);

    return () => clearInterval(breachInterval);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <CRTScanlines />

      {/* Containment Breach Alert */}
      <AnimatePresence>
        {containmentBreach && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed left-0 right-0 top-0 z-50 flex items-center justify-center bg-destructive p-4 text-destructive-foreground"
          >
            <AlertTriangle className="mr-2 h-6 w-6 animate-pulse" />
            <GlitchText
              text="CONTAINMENT BREACH DETECTED"
              className="font-mono text-lg font-bold"
              intensity="high"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto space-y-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="mb-4 text-4xl font-bold tracking-tight">
            <GlitchText
              text="Foundation Archives"
              className="inline-block"
              intensity="normal"
            />
          </h1>
          <p className="text-lg text-muted-foreground">
            <TerminalText text="Secure. Contain. Protect. - Level 4 Clearance Required" />
          </p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <Badge variant="outline" className="bg-amber-900/20 text-amber-500">
              <Lock className="mr-1 h-3 w-3" />
              Clearance: Level {securityLevel}
            </Badge>
            <Badge
              variant="outline"
              className="bg-emerald-900/20 text-emerald-500"
            >
              <Eye className="mr-1 h-3 w-3" />
              Memetic Hazards: Neutralized
            </Badge>
          </div>
        </motion.div>

        <Tabs defaultValue="anomalies" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="anomalies">
              <GlitchText
                text="Anomalies"
                className="inline-block"
                intensity="normal"
              />
            </TabsTrigger>
            <TabsTrigger value="incidents">
              <GlitchText
                text="Incidents"
                className="inline-block"
                intensity="normal"
              />
            </TabsTrigger>
            <TabsTrigger value="containment">
              <GlitchText
                text="Containment Grid"
                className="inline-block"
                intensity="normal"
              />
            </TabsTrigger>
            <TabsTrigger value="personnel">
              <GlitchText
                text="Personnel"
                className="inline-block"
                intensity="normal"
              />
            </TabsTrigger>
          </TabsList>

          <TabsContent value="anomalies" className="space-y-8">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {SCP_ANOMALIES.map((anomaly, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card
                    className="flex h-full flex-col border-l-4 p-6"
                    style={{ borderLeftColor: getClassColor(anomaly.class) }}
                  >
                    <div className="mb-4 flex items-start justify-between">
                      <Badge variant="outline" className="font-mono">
                        SCP-{anomaly.id}
                      </Badge>
                      <Badge variant={getClassVariant(anomaly.class)}>
                        {anomaly.class}
                      </Badge>
                    </div>
                    <h3 className="mb-2 font-mono font-semibold">
                      {redactedMode ? (
                        <span>{"█".repeat(anomaly.name.length)}</span>
                      ) : (
                        anomaly.name
                      )}
                    </h3>
                    <p className="flex-1 font-mono text-sm leading-relaxed text-muted-foreground">
                      {redactedMode ? (
                        <RedactedText
                          text={anomaly.description}
                          redactionLevel={0.4}
                        />
                      ) : (
                        anomaly.description
                      )}
                    </p>
                    <Button
                      variant="ghost"
                      className="mt-4 font-mono text-xs"
                      onClick={() => setSelectedAnomaly(anomaly.id)}
                    >
                      Access File
                    </Button>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="incidents" className="space-y-8">
            <div className="relative">
              <div className="absolute left-1/2 h-full w-px bg-border" />
              {INCIDENTS.map((incident, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 ? 20 : -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className={`mb-8 flex items-start gap-8 ${index % 2 ? "flex-row-reverse" : ""}`}
                >
                  <div className="flex-1">
                    <Card
                      className="border-l-4 p-6"
                      style={{
                        borderLeftColor: getIncidentColor(incident.severity),
                      }}
                    >
                      <div className="mb-4 flex items-start justify-between">
                        <Badge variant="outline" className="font-mono">
                          {incident.date}
                        </Badge>
                        <FileWarning className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <h3 className="mb-2 font-mono font-semibold">
                        Incident {incident.code}
                      </h3>
                      <p className="font-mono text-sm text-muted-foreground">
                        <RedactedText
                          text={incident.description}
                          redactionLevel={0.3}
                        />
                      </p>
                      <div className="mt-3 flex items-center justify-between">
                        <Badge variant={getIncidentVariant(incident.severity)}>
                          {incident.severity}
                        </Badge>
                        <span className="font-mono text-xs text-muted-foreground">
                          Casualties:{" "}
                          {incident.casualties === "REDACTED" ? (
                            <span className="text-destructive">REDACTED</span>
                          ) : (
                            incident.casualties
                          )}
                        </span>
                      </div>
                    </Card>
                  </div>
                  <div className="relative z-10 mt-8 h-4 w-4 rounded-full bg-primary" />
                  <div className="flex-1" />
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="containment" className="space-y-8">
            <Card className="relative overflow-hidden p-6">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  <h3 className="font-mono text-xl font-semibold">
                    Anomalous Containment Grid
                  </h3>
                </div>
                {/* <Button
                  variant="outline"
                  size="sm"
                  className="font-mono text-xs"
                  onClick={() => setRedactedMode(!redactedMode)}
                >
                  {redactedMode ? "Declassify" : "Redact"} Information
                </Button> */}
              </div>
              <div className="relative aspect-video overflow-hidden rounded-lg border border-muted bg-black">
                <AnomalousContainmentGrid />
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="personnel" className="space-y-8">
            <div className="grid gap-6 md:grid-cols-2">
              {PERSONNEL.map((person, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-6">
                    <div className="mb-4 flex items-start justify-between">
                      <Badge variant="outline" className="font-mono">
                        {person.clearance}
                      </Badge>
                      <Badge
                        variant={
                          person.status === "Active" ? "outline" : "destructive"
                        }
                      >
                        {person.status}
                      </Badge>
                    </div>
                    <h3 className="mb-2 font-mono font-semibold">
                      {redactedMode ? (
                        <span>{"█".repeat(person.name.length)}</span>
                      ) : (
                        person.name
                      )}
                    </h3>
                    <p className="mb-4 font-mono text-sm text-muted-foreground">
                      {redactedMode ? (
                        <RedactedText text={person.role} redactionLevel={0.3} />
                      ) : (
                        person.role
                      )}
                    </p>
                    <div className="flex items-center justify-between font-mono text-xs text-muted-foreground">
                      <span>ID: {person.id}</span>
                      <span>Site: {person.site}</span>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <AnimatePresence>
          {selectedAnomaly && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
              onClick={() => setSelectedAnomaly(null)}
            >
              <motion.div
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 100 }}
                className="container mx-auto mt-20 max-w-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <Card className="border-t-4 border-destructive p-8">
                  <div className="mb-6 flex items-start justify-between">
                    <div>
                      <Badge variant="outline" className="mb-2 font-mono">
                        SCP-{selectedAnomaly}
                      </Badge>
                      <h2 className="font-mono text-2xl font-bold">
                        {SCP_ANOMALIES.find((a) => a.id === selectedAnomaly)
                          ?.name ?? "Unknown Anomaly"}
                      </h2>
                    </div>
                    <Badge variant="destructive">TOP SECRET</Badge>
                  </div>

                  <div className="space-y-4 font-mono text-sm">
                    <div>
                      <h3 className="mb-1 text-muted-foreground">
                        Object Class:
                      </h3>
                      <p>
                        {SCP_ANOMALIES.find((a) => a.id === selectedAnomaly)
                          ?.class ?? "Unknown"}
                      </p>
                    </div>

                    <div>
                      <h3 className="mb-1 text-muted-foreground">
                        Special Containment Procedures:
                      </h3>
                      <p className="leading-relaxed">
                        <RedactedText
                          text={`SCP-${selectedAnomaly} is to be contained in a standard humanoid containment chamber at Site-19. The chamber must be lined with 5cm of lead and surrounded by a Faraday cage. No electronic devices are permitted within 10 meters of the containment area without Level 4 authorization. Weekly psychological evaluations are mandatory for all personnel assigned to SCP-${selectedAnomaly}.`}
                          redactionLevel={0.2}
                        />
                      </p>
                    </div>

                    <div>
                      <h3 className="mb-1 text-muted-foreground">
                        Description:
                      </h3>
                      <p className="leading-relaxed">
                        {SCP_ANOMALIES.find((a) => a.id === selectedAnomaly)
                          ?.fullDescription ?? (
                          <RedactedText
                            text="Full description unavailable. Requires Level 5 clearance for complete access to this file. Contact your HMCL supervisor for temporary clearance elevation if required for mission-critical operations."
                            redactionLevel={0.3}
                          />
                        )}
                      </p>
                    </div>

                    <div>
                      <h3 className="mb-1 text-muted-foreground">Addendum:</h3>
                      <p className="leading-relaxed text-destructive">
                        [DATA EXPUNGED BY ORDER OF O5-█]
                      </p>
                    </div>
                  </div>

                  <Button
                    className="mt-6 font-mono"
                    onClick={() => setSelectedAnomaly(null)}
                  >
                    Close File
                  </Button>
                </Card>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Anomalous Containment Grid Component
function AnomalousContainmentGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      if (canvasRef.current?.parentElement) {
        const { width, height } =
          canvasRef.current.parentElement.getBoundingClientRect();
        setDimensions({ width, height });
        canvasRef.current.width = width;
        canvasRef.current.height = height;
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    // Animation setup
    let animationFrameId: number;
    let particles: Particle[] = [];
    let containmentCells: ContainmentCell[] = [];
    let breachWarnings: BreachWarning[] = [];

    // Initialize particles and cells
    const initializeElements = () => {
      particles = [];
      containmentCells = [];
      breachWarnings = [];

      // Create containment cells grid
      const cellSize = Math.min(dimensions.width, dimensions.height) / 10;
      const cols = Math.floor(dimensions.width / cellSize);
      const rows = Math.floor(dimensions.height / cellSize);

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * cellSize;
          const y = j * cellSize;
          const status =
            Math.random() < 0.8
              ? "contained"
              : Math.random() < 0.5
                ? "warning"
                : "breach";

          containmentCells.push({
            x,
            y,
            width: cellSize,
            height: cellSize,
            status,
            pulsePhase: Math.random() * Math.PI * 2,
            anomalyId: Math.floor(Math.random() * 9000) + 1000,
          });
        }
      }

      // Create floating particles
      for (let i = 0; i < 50; i++) {
        particles.push({
          x: Math.random() * dimensions.width,
          y: Math.random() * dimensions.height,
          radius: Math.random() * 3 + 1,
          color: `rgba(${Math.random() < 0.5 ? "255, 100, 100" : "100, 200, 255"}, ${Math.random() * 0.5 + 0.3})`,
          vx: (Math.random() - 0.5) * 1,
          vy: (Math.random() - 0.5) * 1,
          life: Math.random() * 200 + 100,
        });
      }

      // Create breach warnings
      for (let i = 0; i < 3; i++) {
        breachWarnings.push({
          x: Math.random() * dimensions.width,
          y: Math.random() * dimensions.height,
          time: 0,
          duration: Math.random() * 100 + 100,
          active: false,
          delay: Math.random() * 500,
        });
      }
    };

    // Animation loop
    const animate = () => {
      if (!canvasRef.current) return;
      const ctx = canvasRef.current.getContext("2d");
      if (!ctx) return;

      // Clear canvas
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
      ctx.fillRect(0, 0, dimensions.width, dimensions.height);

      // Draw grid lines
      ctx.strokeStyle = "rgba(50, 120, 180, 0.2)";
      ctx.lineWidth = 0.5;

      // Horizontal lines
      for (let y = 0; y < dimensions.height; y += 20) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(dimensions.width, y);
        ctx.stroke();
      }

      // Vertical lines
      for (let x = 0; x < dimensions.width; x += 20) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, dimensions.height);
        ctx.stroke();
      }

      // Draw containment cells
      containmentCells.forEach((cell) => {
        const padding = 2;

        // Cell background
        let cellColor;
        switch (cell.status) {
          case "contained":
            cellColor = "rgba(0, 100, 0, 0.2)";
            break;
          case "warning":
            cellColor = "rgba(180, 100, 0, 0.3)";
            break;
          case "breach":
            cellColor = "rgba(150, 0, 0, 0.4)";
            break;
        }

        ctx.fillStyle = cellColor;
        ctx.fillRect(
          cell.x + padding,
          cell.y + padding,
          cell.width - padding * 2,
          cell.height - padding * 2,
        );

        // Cell border
        cell.pulsePhase += 0.05;
        const pulseIntensity = (Math.sin(cell.pulsePhase) + 1) / 2;

        let borderColor;
        switch (cell.status) {
          case "contained":
            borderColor = `rgba(0, 255, 0, ${0.2 + pulseIntensity * 0.3})`;
            break;
          case "warning":
            borderColor = `rgba(255, 165, 0, ${0.3 + pulseIntensity * 0.4})`;
            break;
          case "breach":
            borderColor = `rgba(255, 0, 0, ${0.4 + pulseIntensity * 0.5})`;
            break;
        }

        ctx.strokeStyle = borderColor;
        ctx.lineWidth = 1;
        ctx.strokeRect(
          cell.x + padding,
          cell.y + padding,
          cell.width - padding * 2,
          cell.height - padding * 2,
        );

        // Cell ID
        ctx.font = "8px monospace";
        ctx.fillStyle = "rgba(200, 200, 200, 0.7)";
        ctx.fillText(
          `SCP-${cell.anomalyId}`,
          cell.x + padding + 3,
          cell.y + padding + 10,
        );

        // Status indicator
        const statusY = cell.y + cell.height - padding - 5;
        ctx.fillStyle = borderColor;
        ctx.fillRect(
          cell.x + padding + 3,
          statusY,
          cell.width - padding * 2 - 6,
          3,
        );
      });

      // Update and draw particles
      particles.forEach((particle, index) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life--;

        // Bounce off edges
        if (particle.x < 0 || particle.x > dimensions.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > dimensions.height) particle.vy *= -1;

        // Draw particle
        const opacity = Math.min(1, particle.life / 100);
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color.replace(")", `, ${opacity})`);
        ctx.fill();

        // Replace dead particles
        if (particle.life <= 0) {
          particles[index] = {
            x: Math.random() * dimensions.width,
            y: Math.random() * dimensions.height,
            radius: Math.random() * 3 + 1,
            color: `rgba(${Math.random() < 0.5 ? "255, 100, 100" : "100, 200, 255"}, ${Math.random() * 0.5 + 0.3})`,
            vx: (Math.random() - 0.5) * 1,
            vy: (Math.random() - 0.5) * 1,
            life: Math.random() * 200 + 100,
          };
        }
      });

      // Update and draw breach warnings
      breachWarnings.forEach((warning) => {
        warning.time++;

        if (warning.time > warning.delay && !warning.active) {
          warning.active = true;
          warning.time = 0;
        }

        if (warning.active) {
          const progress = warning.time / warning.duration;
          const size = 50 + progress * 100;
          const opacity = Math.sin(progress * Math.PI);

          ctx.beginPath();
          ctx.arc(warning.x, warning.y, size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 0, 0, ${opacity * 0.2})`;
          ctx.fill();

          ctx.beginPath();
          ctx.arc(warning.x, warning.y, size * 0.8, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(255, 50, 50, ${opacity * 0.5})`;
          ctx.lineWidth = 2;
          ctx.stroke();

          if (warning.time >= warning.duration) {
            warning.active = false;
            warning.time = 0;
            warning.x = Math.random() * dimensions.width;
            warning.y = Math.random() * dimensions.height;
            warning.delay = Math.random() * 300;
          }
        }
      });

      // Draw scan line
      const scanLineY = (Date.now() / 20) % dimensions.height;
      ctx.fillStyle = "rgba(100, 200, 255, 0.1)";
      ctx.fillRect(0, scanLineY, dimensions.width, 2);

      // Continue animation
      animationFrameId = requestAnimationFrame(animate);
    };

    // Start animation
    if (dimensions.width > 0 && dimensions.height > 0) {
      initializeElements();
      animate();
    }

    return () => {
      window.removeEventListener("resize", updateDimensions);
      cancelAnimationFrame(animationFrameId);
    };
  }, [dimensions.width, dimensions.height]);

  return <canvas ref={canvasRef} className="absolute inset-0" />;
}

// Helper component for redacted text
function RedactedText({
  text,
  redactionLevel = 0.3,
}: {
  text: string;
  redactionLevel?: number;
}) {
  return (
    <>
      {text.split(" ").map((word, i) => (
        <span key={i}>
          {Math.random() < redactionLevel ? (
            <span className="bg-muted px-1">
              {"█".repeat(Math.max(2, word.length))}
            </span>
          ) : (
            word
          )}{" "}
        </span>
      ))}
    </>
  );
}

// Helper functions for styling
function getClassColor(classification: string): string {
  switch (classification) {
    case "Safe":
      return "#2d862d";
    case "Euclid":
      return "#e6b800";
    case "Keter":
      return "#cc0000";
    case "Thaumiel":
      return "#6666ff";
    case "Apollyon":
      return "#660000";
    default:
      return "#888888";
  }
}

function getClassVariant(
  classification: string,
): "default" | "destructive" | "outline" {
  switch (classification) {
    case "Safe":
      return "outline";
    case "Euclid":
      return "outline";
    case "Keter":
      return "destructive";
    case "Apollyon":
      return "destructive";
    default:
      return "default";
  }
}

function getIncidentColor(severity: string): string {
  switch (severity) {
    case "Minor":
      return "#2d862d";
    case "Moderate":
      return "#e6b800";
    case "Severe":
      return "#cc0000";
    case "Catastrophic":
      return "#660000";
    default:
      return "#888888";
  }
}

function getIncidentVariant(
  severity: string,
): "default" | "destructive" | "outline" {
  switch (severity) {
    case "Minor":
      return "outline";
    case "Moderate":
      return "outline";
    case "Severe":
      return "destructive";
    case "Catastrophic":
      return "destructive";
    default:
      return "default";
  }
}

// Types
interface Particle {
  x: number;
  y: number;
  radius: number;
  color: string;
  vx: number;
  vy: number;
  life: number;
}

interface ContainmentCell {
  x: number;
  y: number;
  width: number;
  height: number;
  status: "contained" | "warning" | "breach";
  pulsePhase: number;
  anomalyId: number;
}

interface BreachWarning {
  x: number;
  y: number;
  time: number;
  duration: number;
  active: boolean;
  delay: number;
}

// SCP Data
const SCP_ANOMALIES = [
  {
    id: "173",
    name: "The Sculpture",
    class: "Euclid",
    description:
      "Animate concrete statue. Cannot move while within direct line of sight. Extremely hostile when unobserved.",
    fullDescription:
      "SCP-173 is constructed from concrete and rebar with traces of Krylon brand spray paint. It is animate and extremely hostile. The object cannot move while within a direct line of sight. Line of sight must not be broken at any time with SCP-173. Personnel assigned to enter container are instructed to alert one another before blinking.",
  },
  {
    id: "096",
    name: "The Shy Guy",
    class: "Euclid",
    description:
      "Humanoid entity that enters a state of extreme distress when its face is viewed by any means.",
    fullDescription:
      "SCP-096 is a humanoid creature measuring approximately 2.38 meters in height. Subject shows very little muscle mass, with preliminary analysis of body mass suggesting mild malnutrition. Arms are grossly out of proportion with the rest of the subject's body, with an approximate length of 1.5 meters each. Skin is mostly devoid of pigmentation, with no sign of any body hair.",
  },
  {
    id: "682",
    name: "Hard-to-Destroy Reptile",
    class: "Keter",
    description:
      "Large, vaguely reptile-like creature of unknown origin. Extremely hostile to all forms of life.",
    fullDescription: null,
  },
  {
    id: "049",
    name: "Plague Doctor",
    class: "Euclid",
    description:
      "Humanoid entity resembling a medieval plague doctor. Causes death with a touch.",
    fullDescription: null,
  },
  {
    id: "3008",
    name: "A Perfect Circle",
    class: "Euclid",
    description:
      "Anomalous spatial phenomenon manifesting as an infinite non-Euclidean space.",
    fullDescription: null,
  },
  {
    id: "055",
    name: "[COGNITOHAZARD REDACTED]",
    class: "Keter",
    description:
      "Object with self-keeping properties that prevent individuals from remembering it.",
    fullDescription: null,
  },
  {
    id: "2317",
    name: "A Door to Another World",
    class: "Apollyon",
    description:
      "Massive entity restrained by seven chains. Six have broken. Containment procedures are failing. XK-Class end-of-world scenario imminent.",
    fullDescription: null,
  },
  {
    id: "3000",
    name: "The Anantashesha",
    class: "Thaumiel",
    description:
      "Massive eel-like entity residing in the Marianas Trench. Consumes human matter and memories.",
    fullDescription: null,
  },
  {
    id: "001",
    name: "[LEVEL 5 CLEARANCE REQUIRED]",
    class: "Apollyon",
    description:
      "Multiple conflicting files exist. True nature unknown. Access restricted to O5 Council.",
    fullDescription: null,
  },
];

const INCIDENTS = [
  {
    date: "1998-07-13",
    code: "1998-ALPHA",
    description:
      "Containment breach of SCP-682. MTF Epsilon-11 deployed. Facility lockdown initiated. Recontainment achieved after 6 hours with significant casualties.",
    severity: "Severe",
    casualties: "27",
  },
  {
    date: "2004-03-22",
    code: "2004-DELTA",
    description:
      "Unexpected manifestation of SCP-106 in administrative wing. Containment specialists deployed emergency procedures. Three researchers exposed to pocket dimension.",
    severity: "Moderate",
    casualties: "3",
  },
  {
    date: "2012-11-05",
    code: "2012-OMEGA",
    description:
      "Multiple Keter-class containment failures following power outage at Site-19. Memetic kill agent deployed. Widespread amnestic administration required for civilian witnesses.",
    severity: "Catastrophic",
    casualties: "REDACTED",
  },
  {
    date: "2018-05-17",
    code: "2018-SIGMA",
    description:
      "Attempted infiltration by Chaos Insurgency operatives at Site-41. Security protocols successfully prevented breach. One anomaly targeted for extraction.",
    severity: "Minor",
    casualties: "4",
  },
];

const PERSONNEL = [
  {
    name: "Dr. Alexandra Mercer",
    id: "RSC-4173-A",
    clearance: "Level 4",
    role: "Senior Containment Specialist, Biological Anomalies Division",
    status: "Active",
    site: "Site-19",
  },
  {
    name: "Dr. Everett Palmer",
    id: "RSC-2045-B",
    clearance: "Level 4",
    role: "Head Researcher, Memetic Hazards Department",
    status: "Active",
    site: "Site-41",
  },
  {
    name: "Agent Marcus Cole",
    id: "MTF-E11-7",
    clearance: "Level 3",
    role: "Mobile Task Force Epsilon-11 'Nine-Tailed Fox', Squad Leader",
    status: "Active",
    site: "Site-19",
  },
  {
    name: "Dr. Simon Hendricks",
    id: "RSC-7701-C",
    clearance: "Level 4",
    role: "Ethics Committee Liaison, Humanoid Containment Division",
    status: "Deceased",
    site: "Site-17",
  },
];
