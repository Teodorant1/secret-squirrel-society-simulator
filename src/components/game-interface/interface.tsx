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
  Info,
  ShieldBan,
  FileMinus2,
} from "lucide-react";
import { GlitchText } from "@/components/effects/glitch-text";
import { TerminalText } from "@/components/effects/terminal-text";
import { api } from "@/trpc/react";
import { useSession } from "next-auth/react";
import {
  CanBeNominated_for_chancellor,
  notInArray,
} from "@/random-functions/frontend/frontend1";
import { stageEnum, substageEnum } from "@/server/db/schema";
import { HackerError } from "../hacker-error";

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
  function show_ongoing_election() {
    if (!session) {
      return false;
    }

    // if (match_query.data?.game_info?.ongoingElection) {
    //   console.log(
    //     "match_query.data.game_info.ongoingElection.voting_list.includes( session?.user.username, )",
    //     match_query.data.game_info.ongoingElection.voting_list.includes(
    //       session?.user.username,
    //     ),
    //   );

    //   console.log(
    //     match_query.data.game_info.ongoingElection?.chancellor_candidate,
    //   );
    // }
    if (
      match_query.data?.game_info?.substage === substageEnum.enumValues[2] &&
      match_query.data.game_info.stage === stageEnum.enumValues[1] &&
      match_query.data.game_info.ongoingElection?.chancellor_candidate &&
      match_query.data.game_info.ongoingElection.voting_list.includes(
        session?.user.username,
      )
    ) {
      return true;
    }
    return false;
  }
  function show_executive_button() {
    if (match_query.data?.game_info?.executive_power_enabled) {
      return true;
    }
    return false;
  }
  type ExecutivePowerButtonProps = {
    player: string;
    executivePower: string;
    onUsePower: (targetPlayer: string) => void;
  };

  function ExecutivePowerButton({
    player,
    executivePower,
    onUsePower,
  }: ExecutivePowerButtonProps) {
    return (
      <button
        onClick={() => onUsePower(player)}
        className="m-2 bg-blue-700 p-2 text-white"
      >
        Power: {executivePower} {" --> "} {player}
      </button>
    );
  }

  function show_nominate_button(agent: string) {
    // console.log("show_nominate_button", match_query.data);
    if (
      match_query.data?.game_info &&
      match_query.data.game_info.waiting_on === session?.user.username &&
      match_query.data.game_info.president === session?.user.username &&
      match_query.data.game_info.stage === stageEnum.enumValues[1] &&
      match_query.data.game_info.substage === substageEnum.enumValues[1] &&
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
      match_query.data.game_info.creator_owner === session?.user.username &&
      match_query.data.game_info.player_size > 4
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

  async function refetch_n_show() {
    await match_query.refetch();

    console.log(match_query.data);
  }

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

  const handle_veto = api.match.handle_veto.useMutation({
    onSuccess: async (data) => {
      setIsLoading(false);
      if (data.error === false) {
        setTerminalLines((prev) => [
          ...prev,
          "> handle_vetoaction successful. Welcome to the network.",
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

  const handle_handle_veto = (voting_yes: boolean) => {
    if (isLoading) return;

    setIsLoading(true);
    setIsError(null);
    setTerminalLines((prev) => [
      ...prev,
      `> Processing handle_start_game for ${"username"}...`,
    ]);
    handle_veto.mutate({
      match_id: match_id ?? "",
      match_password: playerPassword,
      player_password: match_password,
      voting_yes: false,
    });
  };
  const handle_special_power = api.match.handle_special_power.useMutation({
    onSuccess: async (data) => {
      setIsLoading(false);
      if (data.error === false) {
        setTerminalLines((prev) => [
          ...prev,
          "> handle_special_poweraction successful. Welcome to the network.",
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

  const handle_handle_special_power = (target: string) => {
    if (isLoading) return;

    setIsLoading(true);
    setIsError(null);
    setTerminalLines((prev) => [
      ...prev,
      `> Processing handle_start_game for ${"username"}...`,
    ]);
    handle_special_power.mutate({
      match_id: match_id ?? "",
      match_password: playerPassword,
      player_password: match_password,
      target: target,
    });
  };

  const discard_policy = api.match.discard_policy.useMutation({
    onSuccess: async (data) => {
      setIsLoading(false);
      if (data.error === false) {
        setTerminalLines((prev) => [
          ...prev,
          "> discard_policyaction successful. Welcome to the network.",
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

  const handle_discard_policy = (index: number) => {
    if (isLoading) return;

    console.log("executing handle_discard_policy");

    setIsLoading(true);
    setIsError(null);
    setTerminalLines((prev) => [
      ...prev,
      `> Processing handle_start_game for ${"username"}...`,
    ]);
    discard_policy.mutate({
      match_id: match_id ?? "",
      match_password: playerPassword,
      player_password: match_password,
      index: index,
    });
  };

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
        await match_query.refetch();
      }
    },
  });
  const handle_vote_in_elections = (
    // president_candidate: string,
    // chancellor_candidate: string,
    voting_yes: boolean,
    // match_id: string,
    // match_password: string,
    // player_password: string,
  ) => {
    if (isLoading) return;

    setIsLoading(true);
    setIsError(null);
    setTerminalLines((prev) => [
      ...prev,
      `> Processing handle_vote_in_elections for ${"username"}...`,
    ]);
    vote_in_elections.mutate({
      match_id: match_id!,
      president_candidate:
        match_query.data?.game_info?.ongoingElection?.president_candidate ?? "",
      chancellor_candidate:
        match_query.data?.game_info?.ongoingElection?.chancellor_candidate ??
        "",
      voting_yes: voting_yes,
      match_password: match_password,
      player_password: playerPassword,
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

  function am_i_alive() {
    if (!session) {
      return false;
    }
    if (
      match_query.data?.game_info?.player_order.includes(session?.user.username)
    ) {
      return true;
    }
    return false;
  }

  function InfoBox() {
    const gameInfo = match_query.data?.game_info;
    if (!gameInfo) return null;

    return (
      <Card className="relative overflow-hidden border-blue-500/30 bg-black/50 p-6 backdrop-blur-sm">
        {/* Scanline animation */}
        <motion.div
          className="absolute inset-0 h-1 w-full bg-blue-400/10"
          animate={{ top: ["0%", "100%", "0%"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />

        <h3 className="mb-6 flex items-center gap-2 text-xl font-semibold">
          <Info className="h-5 w-5 text-blue-400" />
          <GlitchText text={"GAME STATUS//"} className="font-mono" />
          <motion.div
            className="ml-2 h-1.5 w-1.5 rounded-full bg-blue-400"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </h3>

        <div className="space-y-2 font-mono text-sm text-blue-100">
          <InfoLine label={`MATCH_ID:`} value={gameInfo.id} />
          <InfoLine
            label={`${gameInfo.president_role_name}:`}
            value={gameInfo.president}
          />

          <InfoLine label={`Players in Lobby:`} value={gameInfo.player_size} />
          <InfoLine
            label={`${gameInfo.chancellor_role_name}:`}
            value={gameInfo.chancellor}
          />
          <InfoLine
            label={`Previous ${gameInfo.president_role_name}:`}
            value={gameInfo.last_President}
          />
          <InfoLine
            label={`Previous ${gameInfo.chancellor_role_name}:`}
            value={gameInfo.last_Chancellor}
          />
          <InfoLine
            label={`${gameInfo.liberal_faction_name} Laws:`}
            value={gameInfo.liberal_laws_number}
          />
          <InfoLine
            label={`${gameInfo.fascist_faction_name} Laws:`}
            value={gameInfo.fascist_laws_number}
          />
          {gameInfo.veto_power_unlocked && (
            <InfoLine
              label={"Veto Power:"}
              value="Unlocked"
              className="text-red-500"
            />
          )}
          <InfoLine
            label={"Failed Elections:"}
            value={gameInfo.failed_elections}
          />
          <InfoLine label={"Deck Size:"} value={gameInfo.decksize} />
          <InfoLine label={"Discard Size:"} value={gameInfo.discard_size} />
          <InfoLine label={"Stage:"} value={gameInfo.stage} />
          <InfoLine label={"Substage:"} value={gameInfo.substage} />
          <InfoLine label={"Waiting On:"} value={gameInfo.waiting_on} />
        </div>
      </Card>
    );
  }

  type InfoLineProps = {
    label: string;
    value: string | number | null | undefined;
    className?: string;
  };

  function InfoLine({ label, value, className = "" }: InfoLineProps) {
    return (
      <div
        className={`flex items-center justify-between px-2 py-1 ${className}`}
      >
        <span className="text-blue-400">{label}</span>
        <span className="text-blue-200">{value ?? "??"}</span>
      </div>
    );
  }
  function VotingCard() {
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
            {match_query.data?.game_info?.ongoingElection?.president_candidate}{" "}
            for {" " + match_query.data?.game_info?.president_role_name + " "}{" "}
            and{" "}
          </span>{" "}
          <span className="text-purple-400">
            {match_query.data?.game_info?.ongoingElection?.chancellor_candidate}
            {" for "} {match_query.data?.game_info?.chancellor_role_name + " "}
          </span>
          ?
        </div>
        {match_query.data?.game_info?.ongoingElection?.chancellor_candidate &&
          match_query.data?.game_info?.ongoingElection?.president_candidate && (
            <div className="flex gap-4">
              <button
                onClick={() => {
                  handle_vote_in_elections(true);
                }}
                className="rounded-lg bg-green-600 px-4 py-2 text-white transition hover:bg-green-700"
              >
                {isLoading ? "..." : "VOTE FOR"}
              </button>
              <button
                onClick={() => {
                  handle_vote_in_elections(false);
                }}
                className="rounded-lg bg-red-600 px-4 py-2 text-white transition hover:bg-red-700"
              >
                {isLoading ? "..." : "VOTE AGAINST"}
              </button>
            </div>
          )}
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
                  <div className="flex-col justify-between font-mono text-sm">
                    <span className="mx-2">
                      <strong>
                        {match_query.data?.game_info?.president_role_name}:
                      </strong>{" "}
                      {election.president_candidate}
                    </span>
                    <span className="mx-2">
                      <strong>
                        {match_query.data?.game_info?.chancellor_role_name}:
                      </strong>{" "}
                      {election.chancellor_candidate}
                    </span>
                    <span
                      className={
                        election.passed
                          ? "mx-5 text-green-400"
                          : "mx-5 text-red-400"
                      }
                    >
                      {election.passed ? "PASSED" : "REJECTED"}
                    </span>
                    <div>Date:{election.created_at.toISOString()}</div>
                    <div className="m-2 flex-wrap p-2">
                      {election.votes.map((vote, index) => (
                        <div
                          key={index}
                          className={`m-1 p-2 text-white ${
                            vote.voting_yes
                              ? ""
                              : "border-red-600/40 bg-red-600/50"
                          }`}
                        >
                          {vote.username} +{" "}
                          {vote.voting_yes === true
                            ? "VOTED FOR"
                            : "VOTED AGAINST"}
                        </div>
                      ))}
                    </div>
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
                              {show_executive_button() && (
                                <ExecutivePowerButton
                                  player={agent}
                                  executivePower={
                                    match_query.data.game_info
                                      ?.executive_power ??
                                    "error can't figure out executive power name"
                                  }
                                  onUsePower={handle_handle_special_power}
                                />
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

  type DiscardPolicyCard_boxProps = {
    policies: string[];
    onDiscard: (index: number) => void;
    className?: string; // Optional class override
    title?: string; // Optional override for heading
  };

  function DiscardPolicyCard_box({
    policies,
    onDiscard,
    className = "",
    title = "DISCARD//POLICY",
  }: DiscardPolicyCard_boxProps) {
    if (!policies) {
      return <>NO POLICIES</>;
    }

    return (
      <Card
        className={`relative overflow-hidden border-red-500/30 bg-black/50 p-6 backdrop-blur-sm ${className}`}
      >
        {/* Scan line animation */}
        <motion.div
          className="absolute inset-0 h-1 w-full bg-red-400/10"
          animate={{
            top: ["0%", "100%", "0%"],
          }}
          transition={{
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />

        <h3 className="mb-6 flex items-center gap-2 text-xl font-semibold text-red-300">
          <FileMinus2 className="h-5 w-5 text-red-400" />
          <GlitchText text={title} className="font-mono" />
        </h3>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {policies.map((policy, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="group relative"
            >
              <Card
                onClick={() => onDiscard(index)}
                className={`cursor-pointer border ${
                  policy === "fascist"
                    ? "border-red-600 bg-red-800/40"
                    : "border-blue-500 bg-blue-800/30"
                } p-4 transition-all duration-300 ease-in-out hover:shadow-lg`}
              >
                <div className="flex flex-col items-center space-y-2">
                  <ShieldBan
                    className={`h-8 w-8 ${
                      policy === "fascist" ? "text-red-300" : "text-blue-300"
                    }`}
                  />
                  <span
                    className={`font-mono text-lg ${
                      policy === "fascist" ? "text-red-100" : "text-blue-100"
                    }`}
                  >
                    {policy === "liberal"
                      ? match_query.data?.game_info?.liberal_faction_name +
                        " policy "
                      : match_query.data?.game_info?.fascist_faction_name +
                        " policy "}
                  </span>
                  <span className="text-xs text-white/50 group-hover:text-white/80">
                    {match_query.data?.game_info?.chancellor ===
                    session?.user.username
                      ? "Click to pass"
                      : "Click to discard"}
                  </span>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
        <div>{should_show_veto_button() && <Veto_buttons />}</div>
      </Card>
    );
  }

  function should_show_veto_button() {
    if (
      session?.user.username === match_query.data?.game_info?.chancellor &&
      match_query.data?.game_info?.veto_power_unlocked === true &&
      match_query.data.game_info.chancellor_has_activated_veto === false
    ) {
      return true;
    }

    if (
      session?.user.username === match_query.data?.game_info?.president &&
      match_query.data?.game_info?.veto_power_unlocked === true &&
      match_query.data.game_info.chancellor_has_activated_veto === true
    ) {
      return true;
    }

    return false;
  }

  function Veto_buttons() {
    return (
      <>
        <button
          onClick={() => {
            handle_handle_veto(true);
          }}
          className="m-3 bg-blue-700 p-3"
        >
          {" "}
          VETO THE RESOLUTION{" "}
        </button>{" "}
        <button
          onClick={() => {
            handle_handle_veto(false);
          }}
          className="m-3 bg-blue-700 p-3"
        >
          DON{"'"}T VETO THE RESOLUTION{" "}
        </button>
      </>
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
      {isError && (
        <HackerError message={errorText} onClose={() => setIsError(false)} />
      )}
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
        <button
          onClick={() => {
            void refetch_n_show();
          }}
        >
          REFETCH AND PRINT
        </button>
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
          {match_query.data && <InfoBox />}
          {match_query.data &&
            Array.isArray(match_query.data.game_info?.president_laws) &&
            match_query.data.game_info?.president_laws?.length > 0 &&
            match_query.data.game_info?.president ===
              session?.user.username && (
              <DiscardPolicyCard_box
                title={
                  match_query.data.game_info?.president_role_name +
                  " legislation Corner "
                }
                policies={match_query.data.game_info?.president_laws ?? []}
                onDiscard={handle_discard_policy}
              />
            )}
          {match_query.data &&
            match_query.data.game_info?.chancellor === session?.user.username &&
            Array.isArray(match_query.data.game_info?.chancellor_laws) &&
            match_query.data.game_info?.chancellor_laws?.length > 0 && (
              <DiscardPolicyCard_box
                title={
                  match_query.data.game_info?.chancellor_role_name +
                  " legislation Corner "
                }
                policies={match_query.data.game_info?.chancellor_laws ?? []}
                onDiscard={handle_discard_policy}
              />
            )}
          {match_query.data?.game_info?.player_order && <PlayersCard />}
          {match_query.data?.game_info && (
            <Intel_Card title={"INTELLIGENCE_REPORTS//"} />
          )}

          {match_query.data && show_ongoing_election() && <VotingCard />}
          {match_query.data && <PreviousElectionsCard />}
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
