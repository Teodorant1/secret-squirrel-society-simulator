/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type React from "react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Users,
  FileText,
  Eye,
  AlertTriangle,
  Shield,
  Terminal,
} from "lucide-react";

import { GlitchText } from "@/components/effects/glitch-text";
import { TerminalText } from "@/components/effects/terminal-text";
import { api } from "@/trpc/react";
import { useSession } from "next-auth/react";
import { notInArray } from "@/random-functions/frontend/frontend1";

// nomination , election , ?? potential anarchy , 1st law selection , 2nd law selection , optional_skip

interface Game_Interface_Props {
  match_password: string;
  playerPassword: string;
  match_id: string | null;
}

export default function Game_Interface({
  match_password,
  playerPassword,
  match_id,
}: Game_Interface_Props) {
  const { data: session } = useSession();

  function ShowStartButton() {
    if (
      match_query.data &&
      match_query.data.game_info?.has_started === false &&
      match_query.data.game_info.creator_owner === session?.user.username
    ) {
      return true;
    }
    return false;
  }

  const match_query = api.match.get_data_on_match.useQuery(
    {
      match_id: match_id ?? "null",
      match_password: match_password,
      player_password: playerPassword,
    },
    {
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      refetchInterval: 10000,
    },
  );

  //   const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [systemStatus, setSystemStatus] = useState<
    "online" | "compromised" | "alert"
  >("online");

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState<boolean | null>(false);
  const [errorText, setErrorText] = useState("");

  useEffect(() => {
    // const handleMouseMove = (e: MouseEvent) => {
    //   setMousePosition({ x: e.clientX, y: e.clientY });
    // };
    // window.addEventListener("mousemove", handleMouseMove);

    // Initialize terminal with boot sequence
    const bootSequence = [
      "> Initializing system...",
      "> Loading security protocols...",
      "> Establishing secure connection...",
      "> System ready.",
      "> Monitoring active operations...",
    ];

    bootSequence.forEach((line, index) => {
      setTimeout(() => {
        setTerminalLines((prev) => [...prev, line]);
      }, index * 500);
    });

    // Randomly change system status
    const statusInterval = setInterval(() => {
      const random = Math.random();
      if (random > 0.8) {
        setSystemStatus("alert");
        setTimeout(() => setSystemStatus("online"), 3000);
      } else if (random > 0.6 && random <= 0.8) {
        setSystemStatus("compromised");
        setTimeout(() => setSystemStatus("online"), 5000);
      }
    }, 10000);

    return () => {
      clearInterval(statusInterval);
    };
  }, []);

  const start_game = api.match.start_game.useMutation({
    onSuccess: async (data) => {
      setIsLoading(false);
      if (data.error === false) {
        setTerminalLines((prev) => [
          ...prev,
          "> Start Game action successful. Welcome to the network.",
        ]);
        await match_query.refetch();
      } else {
        setIsError(true);
        setErrorText(
          data.error_description ?? "An unknown error has occurred.",
        );
        setTerminalLines((prev) => [
          ...prev,
          `> ERROR: ${data.error_description}`,
        ]);
      }
    },
  });

  const handle_start_game = () => {
    if (isLoading) return;

    setIsLoading(true);
    setIsError(null);
    setTerminalLines((prev) => [
      ...prev,
      `> Processing handle_start_game for ${"username"}...`,
    ]);
    start_game.mutate({
      match_id: match_id ?? "",
      password: playerPassword,
      match_password: match_password,
    });
  };

  function PlayersCard() {
    return (
      <Card className="relative overflow-hidden border-blue-500/30 bg-black/50 p-6 backdrop-blur-sm">
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

        <h3 className="mb-6 flex items-center gap-2 text-xl font-semibold">
          <Users className="h-5 w-5 text-blue-400" />

          <GlitchText text={"PLAYERS//"} className="font-mono" />
          {/* Add small warning indicator */}
          <motion.div
            className="ml-2 h-1.5 w-1.5 rounded-full bg-red-600"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          />
        </h3>
        <div className="space-y-2">
          {match_query.data?.game_info?.has_started ? (
            "Game hasn't started yet!"
          ) : (
            <div>
              {match_query.data?.game_info?.original_players_array &&
                match_query.data?.game_info?.original_players_array.length >
                  0 &&
                match_query.data?.game_info?.original_players_array.map(
                  (agent, index) => (
                    <motion.div
                      key={index}
                      whileHover={{
                        scale: 1.01,
                        transition: { duration: 0.2 },
                      }}
                      className="group"
                    >
                      <Card className="relative overflow-hidden border-blue-500/20 bg-black/70">
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent"
                          initial={{ x: "100%" }}
                          whileHover={{ x: "0%" }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                        />
                        <div className="relative p-4">
                          <div className="flex items-center justify-between font-mono">
                            <span>
                              OPERATIVE_{agent} {"  "}
                              {match_query.data.game_info?.player_order &&
                                notInArray(
                                  match_query.data.game_info?.player_order,
                                  agent,
                                ) && <div className="">ELIMINATED</div>}
                            </span>
                            <Badge
                              // variant={
                              //   agent.status === "COMPROMISED" ? "destructive" : "outline"
                              // }
                              variant={"outline"}
                              // className={
                              //   agent.status !== "COMPROMISED"
                              //     ? "border-blue-500/30 text-blue-300"
                              //     : ""
                              // }
                              className={"border-blue-500/30 text-blue-300"}
                            >
                              {agent}
                              {/* Add small warning indicator for compromised status */}
                              {true && (
                                <motion.div
                                  className="ml-1 inline-block h-1 w-1 rounded-full bg-amber-500"
                                  animate={{ opacity: [0.6, 1, 0.6] }}
                                  transition={{
                                    duration: 1.5,
                                    repeat: Number.POSITIVE_INFINITY,
                                  }}
                                />
                              )}
                            </Badge>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ),
                )}
            </div>
          )}
        </div>
      </Card>
    );
  }
  function ParticleField() {
    return (
      <div className="pointer-events-none fixed inset-0">
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-0.5 w-0.5 rounded-full bg-blue-500/10"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              scale: Math.random() * 0.5 + 0.5,
            }}
            animate={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: Math.random() * 30 + 20,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
              scale: {
                duration: Math.random() * 2 + 1,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              },
            }}
          />
        ))}
      </div>
    );
  }

  function SurveillanceCard({
    title,
    data,
    type,
  }: {
    title: string;
    data: any[];
    type: "players" | "intel";
  }) {
    return (
      <Card className="relative overflow-hidden border-blue-500/30 bg-black/50 p-6 backdrop-blur-sm">
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

        <h3 className="mb-6 flex items-center gap-2 text-xl font-semibold">
          {type === "players" ? (
            <Users className="h-5 w-5 text-blue-400" />
          ) : (
            <FileText className="h-5 w-5 text-blue-400" />
          )}
          <GlitchText text={title} className="font-mono" />
          {/* Add small warning indicator */}
          <motion.div
            className="ml-2 h-1.5 w-1.5 rounded-full bg-red-600"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          />
        </h3>
        <div className="space-y-2">
          {data.map((item, index) => (
            <motion.div
              key={index}
              whileHover={{
                scale: 1.01,
                transition: { duration: 0.2 },
              }}
              className="group"
            >
              <Card className="relative overflow-hidden border-blue-500/20 bg-black/70">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent"
                  initial={{ x: "100%" }}
                  whileHover={{ x: "0%" }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
                <div className="relative p-4">
                  {type === "players" ? (
                    <div className="flex items-center justify-between font-mono">
                      <span>OPERATIVE_{item.id}</span>
                      <Badge
                        variant={
                          item.status === "COMPROMISED"
                            ? "destructive"
                            : "outline"
                        }
                        className={
                          item.status !== "COMPROMISED"
                            ? "border-blue-500/30 text-blue-300"
                            : ""
                        }
                      >
                        {item.status}
                        {/* Add small warning indicator for compromised status */}
                        {item.status === "COMPROMISED" && (
                          <motion.div
                            className="ml-1 inline-block h-1 w-1 rounded-full bg-amber-500"
                            animate={{ opacity: [0.6, 1, 0.6] }}
                            transition={{
                              duration: 1.5,
                              repeat: Number.POSITIVE_INFINITY,
                            }}
                          />
                        )}
                      </Badge>
                    </div>
                  ) : (
                    <div className="font-mono text-sm text-blue-300/80">
                      {item}
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </Card>
    );
  }

  function ProgressCard({
    title,
    progress,
    milestones,
    icon: Icon,
    type,
  }: {
    title: string;
    progress: number;
    milestones: string[];
    icon: React.ElementType;
    type: "primary" | "destructive";
  }) {
    return (
      <Card className="relative overflow-hidden border-blue-500/30 bg-black/50 p-6 backdrop-blur-sm">
        {/* Data stream animation */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-[1px] bg-blue-400/30"
          animate={{
            scaleX: [0, 1],
            x: ["0%", "100%"],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />

        <h3 className="mb-6 flex items-center gap-2 text-xl font-semibold">
          <Icon className="h-5 w-5 text-blue-400" />
          <GlitchText text={title} className="font-mono" />
        </h3>
        <Progress value={progress} className="h-2 bg-blue-950/50">
          <motion.div
            className={`h-full ${type === "primary" ? "bg-blue-500" : "bg-red-500"}`}
            initial={{ width: 0 }}
            animate={{
              width: `${progress}%`,
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              width: { duration: 1, ease: "easeOut" },
              opacity: {
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              },
            }}
          />
        </Progress>
        <div className="mt-4 space-y-2">
          {milestones.map((milestone, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="group"
            >
              <Card
                className={`relative overflow-hidden border-blue-500/20 bg-black/70 p-4 ${index < progress / 25 ? "bg-blue-900/10" : ""}`}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100"
                  initial={false}
                  animate={{
                    backgroundPosition: ["100% 0%", "0% 0%"],
                  }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                />
                <div className="relative">
                  <p className="font-mono text-sm text-blue-300/80">
                    {milestone}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </Card>
    );
  }
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="container relative z-10 mx-auto space-y-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8 text-center"
        >
          <div className="flex items-center justify-center gap-2">
            <GlitchText
              text="OPERATION_STATUS//"
              as="h1"
              className="mb-4 font-mono text-4xl font-bold tracking-tight"
              glitchFactor={1.5}
            />
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.7, 1, 0.7],
              }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
              className={`h-3 w-3 rounded-full ${
                systemStatus === "online"
                  ? "bg-blue-500"
                  : systemStatus === "alert"
                    ? "bg-amber-500"
                    : "bg-red-600"
              }`}
            />
          </div>
          <TerminalText
            text="Monitoring active operations and intelligence gathering"
            className="text-lg text-blue-300/80"
            typingSpeed={20}
          />
        </motion.div>

        {ShowStartButton() && (
          <motion.div
            className="flex flex-col justify-center gap-4 sm:flex-row"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Button
              size="lg"
              className="group relative min-w-[200px] overflow-hidden bg-blue-600 hover:bg-blue-700"
              onClick={() => {
                handle_start_game();
              }}
            >
              <span className="relative z-10 flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span>START_GAME//</span>
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
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="grid gap-6 md:grid-cols-2"
        >
          {match_query.data?.game_info?.player_order && (
            <SurveillanceCard
              title="ACTIVE_OPERATIVES//"
              data={PLAYERS}
              type="players"
            />
          )}
          <SurveillanceCard
            title="ACTIVE_OPERATIVES//"
            data={PLAYERS}
            type="players"
          />
          <SurveillanceCard
            title="INTELLIGENCE_REPORTS//"
            data={INTEL_REPORTS}
            type="intel"
          />
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2">
          <ProgressCard
            title="RESISTANCE_OPERATIONS//"
            progress={40}
            milestones={RESISTANCE_MILESTONES}
            icon={Shield}
            type="primary"
          />
          <ProgressCard
            title="SHADOW_OPERATIONS//"
            progress={60}
            milestones={INFILTRATOR_MILESTONES}
            icon={AlertTriangle}
            type="destructive"
          />
        </div>

        <Card className="relative overflow-hidden border-blue-500/30 bg-black/50 p-6 backdrop-blur-sm">
          {/* Terminal animation */}
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

          <h3 className="mb-6 flex items-center gap-2 text-xl font-semibold">
            <Eye className="h-5 w-5 text-blue-400" />
            <GlitchText
              text="CLASSIFIED_INTELLIGENCE//"
              className="font-mono"
            />
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            {CLASSIFIED_INFO.map((info, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="group"
              >
                <Card className="relative overflow-hidden border-blue-500/20 bg-black/70 p-4">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100"
                    initial={false}
                    animate={{
                      backgroundPosition: ["100% 0%", "0% 0%"],
                    }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                  />
                  <div className="relative">
                    <GlitchText
                      text={info.title}
                      className="mb-2 font-mono font-semibold"
                    />
                    <p className="font-mono text-sm text-blue-300/80">
                      {info.content}
                    </p>
                    <Badge
                      variant="outline"
                      className="mt-2 border-blue-500/30 text-blue-300"
                    >
                      {info.clearance}
                    </Badge>

                    {/* Add small warning indicator for high clearance levels */}
                    {info.clearance === "Level Omega" && (
                      <motion.div
                        className="absolute right-0 top-0 h-1.5 w-1.5 rounded-full bg-red-600"
                        animate={{ opacity: [0.6, 1, 0.6] }}
                        transition={{
                          duration: 1.5,
                          repeat: Number.POSITIVE_INFINITY,
                        }}
                      />
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* Terminal output */}
        <Card className="border-blue-500/30 bg-black/70 p-6 backdrop-blur-sm">
          <div className="mb-4 flex items-center gap-2">
            <Terminal className="h-5 w-5 text-blue-400" />
            <GlitchText text="SYSTEM_TERMINAL//" className="font-mono" />
          </div>
          <div className="h-32 overflow-y-auto rounded border border-blue-500/20 bg-black/50 p-4 font-mono text-sm text-blue-300/80">
            {terminalLines.map((line, index) => (
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
    </div>
  );
}

const PLAYERS = [
  { id: "001", status: "ACTIVE" },
  { id: "002", status: "COMPROMISED" },
  { id: "003", status: "ACTIVE" },
  { id: "004", status: "UNKNOWN" },
  { id: "005", status: "ACTIVE" },
];

const INTEL_REPORTS = [
  "Suspicious activity detected in sector 7",
  "Policy document intercepted: contents classified",
  "Unauthorized access attempt detected",
  "Surveillance confirms double agent presence",
];

const RESISTANCE_MILESTONES = [
  "Intelligence Network Established",
  "Counter-surveillance Active",
  "Secure Communications Pending",
  "Operation Success Imminent",
];

const INFILTRATOR_MILESTONES = [
  "Phase 1: Infiltration Complete",
  "Phase 2: Assets Compromised",
  "Phase 3: Control Established",
  "Phase 4: Operation Takeover",
];

const CLASSIFIED_INFO = [
  {
    title: "OPERATION_DETAILS",
    content:
      "Multiple agents report evidence of deep cover operatives within command structure",
    clearance: "Level Alpha",
  },
  {
    title: "ASSET_STATUS",
    content: "Critical resources compromised. Containment protocols initiated.",
    clearance: "Level Beta",
  },
  {
    title: "THREAT_ASSESSMENT",
    content:
      "High probability of insider threat. Enhanced monitoring recommended.",
    clearance: "Level Gamma",
  },
  {
    title: "CONTINGENCY_PLANS",
    content: "Failsafe measures prepared. Awaiting authorization.",
    clearance: "Level Omega",
  },
];
