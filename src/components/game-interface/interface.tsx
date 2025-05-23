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
  History,
  Vote,
} from "lucide-react";

import { GlitchText } from "@/components/effects/glitch-text";
import { TerminalText } from "@/components/effects/terminal-text";
import { api } from "@/trpc/react";
import { useSession } from "next-auth/react";
import {
  CanBeNominated_for_chancellor,
  notInArray,
} from "@/random-functions/frontend/frontend1";

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

  function show_nominate_button(agent: string) {
    if (
      match_query.data?.game_info &&
      match_query.data.game_info.waiting_on === session?.user.username &&
      match_query.data.game_info.president === session?.user.username &&
      match_query.data.game_info.stage === "election" &&
      match_query.data.game_info.substage === "nominating" &&
      CanBeNominated_for_chancellor(agent, match_query.data.game_info)
    ) {
      return true;
    }
    return false;
  }

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
    // {
    //   refetchOnWindowFocus: true,
    //   refetchOnMount: true,
    //   refetchInterval: 10000,
    // },
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

  const nominate_chancellor_candidate =
    api.match.nominate_chancellor_candidate.useMutation({
      onSuccess: async (data) => {
        setIsLoading(false);
        if (data.error === false) {
          setTerminalLines((prev) => [
            ...prev,
            "> nominate_chancellor_candidateaction successful. Welcome to the network.",
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

  const handle_nominate_chancellor_candidate = (candidate: string) => {
    if (isLoading) return;

    setIsLoading(true);
    setIsError(null);
    setTerminalLines((prev) => [
      ...prev,
      `> Processing handle_start_game for ${"username"}...`,
    ]);
    nominate_chancellor_candidate.mutate({
      match_id: match_id ?? "",
      match_password: playerPassword,
      player_password: match_password,
      candidate: candidate,
    });
  };

  const vote_in_elections = api.match.vote_in_elections.useMutation({
    onSuccess: async (data) => {
      setIsLoading(false);
      if (data.error === false) {
        setTerminalLines((prev) => [...prev, "> Voting action successful."]);
      } else {
        setIsError(true);
        setErrorText(
          data.error_description ?? "An unknown error has occurred.",
        );
        setTerminalLines((prev) => [
          ...prev,
          `> ERROR: ${data.error_description}`,
        ]);
        await match_query.refetch();
      }
    },
  });
  const handle_vote_in_elections = (
    president_candidate: string,
    chancellor_candidate: string,
    voting_yes: boolean,
    match_id: string,
    match_password: string,
    player_password: string,
  ) => {
    if (isLoading) return;

    setIsLoading(true);
    setIsError(null);
    setTerminalLines((prev) => [
      ...prev,
      `> Processing handle_vote_in_elections for ${"username"}...`,
    ]);
    vote_in_elections.mutate({
      match_id: match_id,
      president_candidate: president_candidate,
      chancellor_candidate: chancellor_candidate,
      voting_yes: voting_yes,
      match_password: match_password,
      player_password: player_password,
    });
  };

  function getPlayer_badge(agent: string) {
    if (agent === match_query.data?.game_info?.chancellor) {
      return match_query.data?.game_info?.chancellor_role_name;
    }
    if (
      agent === match_query.data?.game_info?.president &&
      agent === match_query.data?.game_info?.last_President
    ) {
      return match_query.data?.game_info?.president_role_name;
    }
    if (agent === match_query.data?.game_info?.president) {
      return match_query.data?.game_info?.president_role_name + " Candidate";
    }

    return "";
  }

  function VotingCard({ onVote }: { onVote: (vote: "ja" | "nein") => void }) {
    return (
      <Card className="relative overflow-hidden border-yellow-500/30 bg-black/50 p-6 backdrop-blur-sm">
        <motion.div
          className="absolute inset-0 h-1 w-full bg-yellow-400/10"
          animate={{ top: ["0%", "100%", "0%"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
        <h3 className="mb-6 flex items-center gap-2 text-xl font-semibold">
          <Vote className="h-5 w-5 text-yellow-400" />
          <GlitchText text="VOTING ROUND//" className="font-mono" />
        </h3>

        <div className="mb-4 font-mono text-sm text-white">
          Do you approve the government of{" "}
          <span className="text-blue-400">
            {match_query.data?.game_info?.ongoingElection?.president_candidate}
          </span>{" "}
          for {" " + match_query.data?.game_info?.president_role_name + " "} and{" "}
          <span className="text-purple-400">
            {match_query.data?.game_info?.ongoingElection?.chancellor_candidate}
            {" for "} {match_query.data?.game_info?.chancellor_role_name + " "}
          </span>
          ?
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => onVote("ja")}
            className="rounded-lg bg-green-600 px-4 py-2 text-white transition hover:bg-green-700"
          >
            VOTE FOR
          </button>
          <button
            onClick={() => onVote("nein")}
            className="rounded-lg bg-red-600 px-4 py-2 text-white transition hover:bg-red-700"
          >
            VOTE AGAINST
          </button>
        </div>
      </Card>
    );
  }
  function PreviousElectionsCard() {
    return (
      <Card className="relative overflow-hidden border-green-500/30 bg-black/50 p-6 backdrop-blur-sm">
        <motion.div
          className="absolute inset-0 h-1 w-full bg-green-400/10"
          animate={{ top: ["0%", "100%", "0%"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
        <h3 className="mb-6 flex items-center gap-2 text-xl font-semibold">
          <History className="h-5 w-5 text-green-400" />
          <GlitchText text="ELECTION LOG//" className="font-mono" />
        </h3>
        <div className="space-y-2">
          {match_query.data?.game_info?.finishedElections.length === 0 ? (
            <p className="text-sm text-gray-400">No elections yet.</p>
          ) : (
            match_query.data?.game_info?.finishedElections.map(
              (election, index) => (
                <Card
                  key={index}
                  className={`border p-4 ${
                    election.passed
                      ? "border-green-500/40 bg-green-800/10"
                      : "border-red-500/40 bg-red-800/10"
                  }`}
                >
                  <div className="flex justify-between font-mono text-sm">
                    <span>
                      <strong>
                        {match_query.data?.game_info?.president_role_name}:
                      </strong>{" "}
                      {election.president_candidate}
                    </span>
                    <span>
                      <strong>
                        {match_query.data?.game_info?.chancellor_role_name}:
                      </strong>{" "}
                      {election.chancellor_candidate}
                    </span>
                    <span
                      className={
                        election.passed ? "text-green-400" : "text-red-400"
                      }
                    >
                      {election.passed ? "PASSED" : "REJECTED"}
                    </span>
                  </div>
                </Card>
              ),
            )
          )}
        </div>
      </Card>
    );
  }
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
          {match_query.data?.game_info?.has_started !== true ? (
            "Game hasn't started yet!" +
            match_query.data?.game_info?.has_started?.valueOf()
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
                              {agent} {"  "}
                              {match_query.data.game_info?.player_order &&
                                notInArray(
                                  match_query.data.game_info?.player_order,
                                  agent,
                                ) && (
                                  <div className="m-3 bg-red-600 p-3 text-white">
                                    ELIMINATED
                                  </div>
                                )}
                              {show_nominate_button(agent) && (
                                <button
                                  onClick={() => {
                                    handle_nominate_chancellor_candidate(agent);
                                  }}
                                  className="m-3 bg-black p-3 text-white"
                                >
                                  NOMINATE AS CHANCELLOR
                                </button>
                              )}
                            </span>
                            {getPlayer_badge(agent)}
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

  function Intel_Card({ title }: { title: string }) {
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
          <FileText className="h-5 w-5 text-blue-400" />
          <GlitchText text={title} className="font-mono" />
          {/* Add small warning indicator */}
          <motion.div
            className="ml-2 h-1.5 w-1.5 rounded-full bg-red-600"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          />
        </h3>
        <div className="space-y-2">
          {match_query.data?.game_info?.this_player?.intel.map(
            (item, index) => (
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
                    <div className="font-mono text-sm text-blue-300/80">
                      {item}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ),
          )}
        </div>
      </Card>
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
        <motion.div className="absolute bottom-0 left-0 right-0 h-[1px] bg-blue-400/30" />

        <h3 className="mb-6 flex items-center gap-2 text-xl font-semibold">
          <Icon className="h-5 w-5 text-blue-400" />
          <GlitchText text={title} className="font-mono" />
        </h3>
        <Progress value={progress} className="h-2 bg-blue-950/50">
          <motion.div
            className={`h-full ${type === "primary" ? "bg-blue-500" : "bg-red-500"}`}
            initial={false}
            animate={{
              width: `${progress}%`,
            }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </Progress>
        <div className="mt-4 space-y-2">
          {milestones.map((milestone, index) => {
            const isActive = index + 1 < progress;

            return (
              <motion.div
                key={index} // Use something stable and unique
                whileHover={{ scale: 1.02 }}
                className="group"
              >
                <Card
                  className={`relative overflow-hidden border-blue-500/20 bg-black/70 p-4 ${
                    isActive ? "bg-blue-600" : ""
                  }`}
                >
                  {/* Gradient hover effect only appears on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                  <div className="relative">
                    <p className="font-mono text-sm text-blue-300/80">
                      {milestone}+{isActive ? " ACTIVATED!" : ""}
                    </p>
                  </div>
                </Card>
              </motion.div>
            );
          })}
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
          {match_query.data?.game_info?.player_order && <PlayersCard />}
          {match_query.data?.game_info && (
            <Intel_Card title={"INTELLIGENCE_REPORTS//"} />
          )}
        </motion.div>
        {match_query.data?.game_info?.fascist_laws &&
          match_query.data?.game_info?.liberal_laws && (
            <div className="grid gap-6 md:grid-cols-2">
              <ProgressCard
                title={
                  match_query.data.game_info.liberal_faction_name +
                  " OPERATIONS//"
                }
                progress={match_query.data.game_info.liberal_laws_number}
                milestones={match_query.data.game_info.liberal_laws}
                icon={Shield}
                type="primary"
              />
              <ProgressCard
                title={
                  match_query.data.game_info.fascist_faction_name +
                  " SHADOW_OPERATIONS//"
                }
                progress={match_query.data.game_info.fascist_laws_number}
                milestones={match_query.data.game_info.fascist_laws}
                icon={AlertTriangle}
                type="destructive"
              />
            </div>
          )}

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
