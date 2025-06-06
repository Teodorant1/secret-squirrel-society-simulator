"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
// import { ParticleField } from "@/components/animations/particleField";
//  "@/components/effects/crt-scanlines";
import { GlitchText } from "@/components/effects/glitch-text";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { EyeIcon, EyeOffIcon, LockIcon, UserIcon } from "lucide-react";
import { api } from "@/trpc/react";
import { HackerError } from "@/components/hacker-error";
import Game_Interface from "@/components/game-interface/interface";

// Mock match data
interface Match {
  id: string;
  name: string;
  players: number;
  maxPlayers: number;
  status: "waiting" | "in-progress" | "completed";
  createdBy: string;
  hasPassword: boolean;
}

export default function CustomizePage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  // const [formState, setFormState] = useState({
  //   resistance: {
  //     name: "Resistance",
  //     laws: "Emergency Protocols",
  //     leader: "Commander",
  //     logo: null as string | null,
  //   },
  //   infiltrators: {
  //     name: "Infiltrators",
  //     laws: "Shadow Directives",
  //     leader: "Mastermind",
  //     logo: null as string | null,
  //     leaderImage: null as string | null,
  //   },
  // });

  // Liberal
  const [LiberalName, setLiberalName] = useState<string | null>("Liberal");
  const [LiberalLaws, setLiberalLaws] = useState<string | null>("Liberal Laws");

  const [LiberalLogo, setLiberalLogo] = useState<string | null>(
    "https://www.techzone.rs/wp-content/uploads/2025/02/PUMPAJ-Viber-stikeri-preuzimanje.webp",
  );

  // Fascist
  const [FascistName, setFascistName] = useState<string | null>("Fascist");
  const [FascistLaws, setFascistLaws] = useState<string | null>("Fascist Laws");
  const [Hitler_role_name, setHitler_role_name] = useState<string | null>(
    "Hitler",
  );
  const [LiberalLeader, setLiberalLeader] = useState<string | null>(
    "Party Chairman",
  );
  const [FascistLogo, setFascistLogo] = useState<string | null>(
    "https://scontent.fbeg1-1.fna.fbcdn.net/v/t39.30808-6/483880050_1416029293148067_3659740942524122031_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=aa7b47&_nc_ohc=hjcvy3prGAcQ7kNvwHklnVR&_nc_oc=AdmABF2CqX9zVF8BUeESogo6ele3SLo0By7mFgo1l4PKApG8M0V5GnQRFYyV1HBMxHE&_nc_zt=23&_nc_ht=scontent.fbeg1-1.fna&_nc_gid=SPz0rykhZ9WhqALblPFO3Q&oh=00_AfPUqv8Umf6AjJOPVUhIJxiDMnC3FIPhGzhUtKEP9CaRbg&oe=68493191",
  );
  const [hitler_role_image_url, sethitler_role_image_url] = useState<
    string | null
  >(
    "https://psychologyinrussia.com/upload/iblock/e26/k3v3c5fattu6vflfq0ya7hnxqrlsyz51/DridP.jpg",
  );

  const [presidentRoleName, setpresidentRoleName] = useState<string | null>(
    "President",
  );
  const [chancellorRoleName, setchancellorRoleName] = useState<string | null>(
    "Chancellor",
  );

  const [presidentRole_image_url, setpresidentRole_image_url] = useState<
    string | null
  >(
    "https://upload.wikimedia.org/wikipedia/commons/3/36/Seal_of_the_President_of_the_United_States.svg",
  );
  const [chancellorRole_image_url, setchancellorRole_image_url] = useState<
    string | null
  >(
    "https://upload.wikimedia.org/wikipedia/commons/d/da/Coat_of_arms_of_Germany.svg",
  );

  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const matches = api.match.GetAvailableGames.useQuery();

  // const [matches, setMatches] = useState<Match[]>([
  //   {
  //     id: "m1",
  //     name: "Alpha Operation",
  //     players: 3,
  //     maxPlayers: 8,
  //     status: "waiting",
  //     createdBy: "Agent_X",
  //     hasPassword: true,
  //   },
  //   {
  //     id: "m2",
  //     name: "Covert Strike",
  //     players: 5,
  //     maxPlayers: 6,
  //     status: "waiting",
  //     createdBy: "Phantom",
  //     hasPassword: false,
  //   },
  //   {
  //     id: "m3",
  //     name: "Shadow Protocol",
  //     players: 8,
  //     maxPlayers: 8,
  //     status: "in-progress",
  //     createdBy: "Cipher",
  //     hasPassword: true,
  //   },
  //   {
  //     id: "m4",
  //     name: "Midnight Raid",
  //     players: 4,
  //     maxPlayers: 10,
  //     status: "waiting",
  //     createdBy: "Spectre",
  //     hasPassword: false,
  //   },
  // ]);
  const [activeTab, setActiveTab] = useState("matches");
  const [showPassword, setShowPassword] = useState(false);

  // New state for user credentials and match creation
  const [userPassword, setUserPassword] = useState("");
  const [newMatchName, setNewMatchName] = useState("Default");
  const [MatchPassword, setMatchPassword] = useState("");
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
  const [showMatchPassword, setShowMatchPassword] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState<boolean | null>(false);
  const [errorText, setErrorText] = useState("");
  const [HasSucceeded_join_or_create, setHasSucceeded_join_or_create] =
    useState(false);
  const [hasStartedGame, sethasStartedGame] = useState(false);
  const [match_id, setmatch_id] = useState<string | null>(null);

  function CanShowGame() {
    if (match_id && hasStartedGame) {
      return true;
    }
    return false;
  }

  const create_game = api.match.create_game.useMutation({
    onSuccess: async (data) => {
      setIsLoading(false);
      if (data.error === false) {
        setTerminalOutput((prev) => [
          ...prev,
          "> Creation of game action is successful. Welcome to the network.",
        ]);
        sethasStartedGame(true);
        setmatch_id(data.game!.new_match.id);
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

  const handle_Create_game = () => {
    if (isLoading) return;

    setIsLoading(true);
    setIsError(null);
    setTerminalOutput((prev) => [
      ...prev,
      `> Processing handle_Create_game for ${"username"}...`,
    ]);
    create_game.mutate({
      name: newMatchName,
      player_password: userPassword,
      password: MatchPassword,
      liberal_faction_name: LiberalName ?? "Liberal",
      fascist_faction_name: FascistName ?? "Fascist",
      president_role_name: presidentRoleName ?? "President",
      chancellor_role_name: chancellorRoleName ?? "Chancellor",
      hitler_role_name: Hitler_role_name ?? "Hitler",
      liberal_faction_image_url:
        LiberalLogo ??
        "https://www.techzone.rs/wp-content/uploads/2025/02/PUMPAJ-Viber-stikeri-preuzimanje.webp",
      fascist_faction_image_url:
        FascistLogo ??
        "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Ingsoc_Oceania_flag_1984.svg/2560px-Ingsoc_Oceania_flag_1984.svg.png",
      president_role_image_url:
        presidentRole_image_url ??
        "https://upload.wikimedia.org/wikipedia/commons/3/36/Seal_of_the_President_of_the_United_States.svg",
      chancellor_role_image_url:
        chancellorRole_image_url ??
        "https://upload.wikimedia.org/wikipedia/commons/d/da/Coat_of_arms_of_Germany.svg",
      hitler_role_image_url:
        hitler_role_image_url ??
        "https://i.icanvas.com/3607?d=2&sh=h&t=1734534059",
    });
  };
  const join_game = api.match.join_game.useMutation({
    onSuccess: async (data) => {
      setIsLoading(false);
      if (data.error === false) {
        setTerminalOutput((prev) => [
          ...prev,
          "> Join Game action successful. Welcome to the network.",
        ]);
        sethasStartedGame(true);
        setmatch_id(data.game);
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
  const handle_join_game = (match_id: string) => {
    if (isLoading) return;

    setIsLoading(true);
    setIsError(null);
    setTerminalOutput((prev) => [
      ...prev,
      `> Processing handle_join_game for ${"username"}...`,
    ]);
    join_game.mutate({
      match_id: match_id,
      password: userPassword,
      match_password: MatchPassword,
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);

    // Initialize terminal with boot sequence
    const bootSequence = [
      "> Initializing system modules...",
      "> Loading faction templates...",
      "> Establishing secure connection...",
      "> Scanning for available matches...",
      "> System ready.",
      "> Awaiting user input...",
    ];

    bootSequence.forEach((line, index) => {
      setTimeout(() => {
        setTerminalOutput((prev) => [...prev, line]);
      }, index * 500);
    });

    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // const handleImageUpload = (
  //   event: React.ChangeEvent<HTMLInputElement>,
  //   faction: "resistance" | "infiltrators",
  //   type: "logo" | "leaderImage",
  // ) => {
  //   const file = event.target.files?.[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       setFormState((prev) => ({
  //         ...prev,
  //         [faction]: {
  //           ...prev[faction],
  //           [type]: reader.result as string,
  //         },
  //       }));

  //       // Add terminal output
  //       setTerminalOutput((prev) => [
  //         ...prev,
  //         `> ${type === "logo" ? "Insignia" : "Authority figure"} uploaded for ${faction}`,
  //       ]);
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };

  // const handleInputChange = (
  //   faction: "resistance" | "infiltrators",
  //   key: string,
  //   value: string,
  // ) => {
  //   setFormState((prev) => ({
  //     ...prev,
  //     [faction]: {
  //       ...prev[faction],
  //       [key]: value,
  //     },
  //   }));

  //   // Add terminal output with typing effect
  //   setTerminalOutput((prev) => [
  //     ...prev,
  //     `> Updating ${key} for ${faction}: "${value}"`,
  //   ]);
  // };

  // const proceedWithJoining = (matchId: string) => {
  //   setTerminalOutput((prev) => [
  //     ...prev,
  //     `> Requesting access to match ${matchId}...`,
  //   ]);

  //   if (userPassword.trim() === "") {
  //     setTerminalOutput((prev) => [
  //       ...prev,
  //       `> WARNING: No agent password set. Security compromised.`,
  //     ]);
  //   }

  //   setTimeout(() => {
  //     setTerminalOutput((prev) => [
  //       ...prev,
  //       `> Access granted. Joining match...`,
  //     ]);
  //     setShowPasswordModal(false);
  //     setMatchPassword("");
  //   }, 1000);
  // };

  // const handlePasswordSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (selectedMatchId) {
  //     setTerminalOutput((prev) => [
  //       ...prev,
  //       `> Verifying operation password...`,
  //     ]);

  //     setTimeout(() => {
  //       if (MatchPassword === "secret") {
  //         // In a real app, this would check against the actual password
  //         proceedWithJoining(selectedMatchId);
  //       } else {
  //         setTerminalOutput((prev) => [
  //           ...prev,
  //           `> ERROR: Invalid operation password. Access denied.`,
  //         ]);
  //       }
  //     }, 800);
  //   }
  // };

  // const handleStartNewMatch = () => {
  //   if (newMatchName.trim() === "") {
  //     setTerminalOutput((prev) => [
  //       ...prev,
  //       `> ERROR: Operation name required.`,
  //     ]);
  //     return;
  //   }

  //   setTerminalOutput((prev) => [
  //     ...prev,
  //     `> Initializing new match instance: "${newMatchName}"...`,
  //   ]);

  //   if (userPassword.trim() === "") {
  //     setTerminalOutput((prev) => [
  //       ...prev,
  //       `> WARNING: No agent password set. Security compromised.`,
  //     ]);
  //   }

  //   setTimeout(() => {
  //     setTerminalOutput((prev) => [
  //       ...prev,
  //       `> Match created. Waiting for players to join...`,
  //     ]);
  //     // Add a new match to the list
  //     const newMatch: Match = {
  //       id: `m${matches.length + 1}`,
  //       name: newMatchName,
  //       players: 1,
  //       maxPlayers: 8,
  //       status: "waiting",
  //       createdBy: "You",
  //       hasPassword: newMatchPassword.trim() !== "",
  //     };
  //     setMatches((prev) => [newMatch, ...prev]);
  //     setNewMatchName("");
  //     setNewMatchPassword("");
  //   }, 1500);
  // };

  const filteredMatches = matches.data?.AvailableGames?.filter(
    (match) =>
      match.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      match.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      match.creator_owner.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="relative h-full overflow-hidden bg-background">
      {isError && <HackerError message={errorText} />}
      {CanShowGame() ? (
        <Game_Interface
          match_password={MatchPassword}
          playerPassword={userPassword}
          match_id={match_id}
        />
      ) : (
        <div>
          {" "}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-8 h-fit rounded-lg border border-green-500/30 bg-black/70 p-4 font-mono text-sm text-green-400"
          >
            <div className="mb-2 flex items-center">
              <div className="mr-2 h-3 w-3 animate-pulse rounded-full bg-green-500"></div>
              <div className="text-xs text-green-300">SYSTEM TERMINAL</div>
            </div>
            <div className="h-fit space-y-1 overflow-y-auto">
              {terminalOutput.map((line, index) => (
                <div key={index} className="leading-tight">
                  {line}
                </div>
              ))}
            </div>
          </motion.div>
          {/* CRT Scanlines Effect */}
          {/*  */}
          {/* Abstract Background Pattern
      <motion.div
        className="fixed inset-0 opacity-30"
        style={
          {
            background: "radial-gradient(circle at var(--x) var(--y), rgba(0, 162, 255, 0.15) 0%, transparent 60%)",
            "--x": mousePosition.x + "px",
            "--y": mousePosition.y + "px",
          } as any
        }
      /> */}
          {/* Digital noise background */}
          {/* <div className="fixed inset-0 opacity-5">
        <svg className="h-full w-full">
          <filter id="customizeNoise">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.65"
              numOctaves="3"
              stitchTiles="stitch"
            />
            <feColorMatrix
              type="matrix"
              values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 0.5 0"
            />
          </filter>
          <rect width="100%" height="100%" filter="url(#customizeNoise)" />
        </svg>
      </div> */}
          {/* Floating Particles */}
          {/* <ParticleField /> */}
          {/* deleted max-w-4xl class */}
          <div className="container relative z-10 mx-auto space-y-8 py-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <GlitchText
                text="OPERATION_INTERFACE//"
                as="h1"
                className="mb-2 text-4xl font-bold"
                intensity="high"
              />
              <p className="mb-8 text-blue-400">
                Match search and faction customization
              </p>
            </motion.div>
            {/* Create New Match Section */}
            <div className="mb-6 rounded-lg border border-green-500/30 bg-gray-800/30 p-4">
              <h3 className="mb-3 font-medium text-green-400">
                Create New Operation
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-sm text-gray-400">
                    Operation Name
                  </label>
                  <Input
                    type="text"
                    placeholder="Enter operation name..."
                    value={newMatchName}
                    onChange={(e) => setNewMatchName(e.target.value)}
                    className="w-full border border-green-500/30 bg-gray-800/50 text-white"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm text-gray-400">
                    Operation Password (Optional)
                  </label>
                  <div className="relative">
                    <Input
                      type={showMatchPassword ? "text" : "password"}
                      placeholder="Set password for this operation..."
                      value={MatchPassword}
                      onChange={(e) => setMatchPassword(e.target.value)}
                      className="w-full border border-green-500/30 bg-gray-800/50 pr-10 text-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowMatchPassword(!showMatchPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-white"
                    >
                      {showMatchPassword ? (
                        <EyeOffIcon className="h-4 w-4" />
                      ) : (
                        <EyeIcon className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <Button
                  onClick={() => {
                    handle_Create_game();
                    console.log("creating new match");
                  }}
                  className="mt-2 w-full bg-green-600 text-white hover:bg-green-700"
                >
                  <span className="mr-2">
                    {isLoading ? "Loading..." : "CREATE NEW OPERATION"}
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </Button>
              </div>
            </div>
            {/* Agent Password Section */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="rounded-lg border border-cyan-500/30 bg-gray-900/50 p-4 backdrop-blur-sm"
            >
              <div className="flex flex-col items-center gap-4 md:flex-row">
                <div className="w-full">
                  <label className="mb-1 flex items-center text-sm text-gray-400">
                    <UserIcon className="mr-1 h-4 w-4" />
                    Agent Password
                  </label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Set your agent password..."
                      value={userPassword}
                      onChange={(e) => setUserPassword(e.target.value)}
                      className="w-full border border-cyan-500/30 bg-gray-800/50 pr-10 text-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-white"
                    >
                      {showPassword ? (
                        <EyeOffIcon className="h-4 w-4" />
                      ) : (
                        <EyeIcon className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  <p className="mt-1 text-xs text-cyan-400/70">
                    This password will be used for all your operations
                  </p>
                </div>
              </div>
            </motion.div>

            <Tabs
              defaultValue="matches"
              className="w-full"
              onValueChange={setActiveTab}
            >
              <TabsList className="mb-8 grid w-full grid-cols-2">
                <TabsTrigger
                  value="matches"
                  className="data-[state=active]:bg-blue-900/50"
                >
                  <GlitchText
                    text="MATCH_SEARCH"
                    as="span"
                    intensity="normal"
                    className="text-sm"
                  />
                </TabsTrigger>
                <TabsTrigger
                  value="customize"
                  className="data-[state=active]:bg-blue-900/50"
                >
                  <GlitchText
                    text="FACTION_CONFIG"
                    as="span"
                    intensity="normal"
                    className="text-sm"
                  />
                </TabsTrigger>
              </TabsList>

              <TabsContent value="matches" className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="rounded-lg border border-blue-500/30 bg-gray-900/50 p-6 backdrop-blur-sm"
                >
                  {/* Search Section */}
                  <div className="mb-4">
                    <label className="mb-1 block text-sm text-gray-400">
                      Search Operations
                    </label>
                    <Input
                      type="text"
                      placeholder="Search by name or creator..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full border border-blue-500/30 bg-gray-800/50 text-white"
                    />
                  </div>

                  <div className="max-h-[400px] space-y-3 overflow-y-auto pr-2">
                    {matches.data && filteredMatches!.length > 0 ? (
                      filteredMatches!.map((match) => (
                        <motion.div
                          key={match.id}
                          initial={{ opacity: 0, x: -5 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3 }}
                          className={`rounded-md border p-4 ${"border-green-500/30 bg-gray-800/50"} flex flex-col items-start justify-between gap-4 md:flex-row md:items-center`}
                        >
                          <div>
                            <div className="flex items-center">
                              <div
                                className={
                                  "mr-2 h-2 w-2 rounded-full bg-green-500"
                                }
                              ></div>
                              <h3 className="flex items-center font-medium text-white">
                                <GlitchText
                                  text={match.name}
                                  as="span"
                                  intensity="normal"
                                  className="text-md"
                                />
                              </h3>
                            </div>
                            <div className="mt-1 text-sm text-gray-400">
                              Created by: {match.creator_owner} • Players:
                              {match.players.length} • ID:{match.id}
                            </div>
                          </div>

                          <Button
                            onClick={() => handle_join_game(match.id)}
                            className={`${"bg-gray-600"} text-white`}
                          >
                            {isLoading ? "Loading..." : "Join Match"}
                          </Button>
                        </motion.div>
                      ))
                    ) : (
                      <div className="py-8 text-center text-gray-400">
                        No matches found. Try a different search or start a new
                        operation.
                      </div>
                    )}
                  </div>
                </motion.div>
              </TabsContent>

              <TabsContent value="customize" className="space-y-7">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                  {/* Title Settings */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="rounded-lg border border-blue-500/30 bg-gray-900/50 p-6 backdrop-blur-sm"
                  >
                    <GlitchText
                      text="TITTLE SETTINGS"
                      as="h2"
                      className="mb-4 text-2xl font-bold text-blue-400"
                      intensity="normal"
                    />

                    <div className="space-y-4">
                      <div>
                        <label className="mb-1 block text-sm text-gray-400">
                          President Role Name
                        </label>
                        <input
                          type="text"
                          value={presidentRoleName ?? "President"}
                          onChange={(e) => setpresidentRoleName(e.target.value)}
                          className="w-full rounded border border-blue-500/30 bg-gray-800/50 px-3 py-2 text-white"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm text-gray-400">
                          Chancellor Role Name
                        </label>
                        <input
                          type="text"
                          value={chancellorRoleName ?? "Chancellor"}
                          onChange={(e) =>
                            setchancellorRoleName(e.target.value)
                          }
                          className="w-full rounded border border-blue-500/30 bg-gray-800/50 px-3 py-2 text-white"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm text-gray-400">
                          President Insignia
                        </label>
                        <input
                          type="text"
                          value={presidentRole_image_url ?? ""}
                          onChange={(e) =>
                            setpresidentRole_image_url(e.target.value)
                          }
                          className="w-full rounded border border-blue-500/30 bg-gray-800/50 px-3 py-2 text-white"
                        />
                        {presidentRole_image_url && (
                          <div className="mt-2 rounded border border-blue-500/30 p-2">
                            <img
                              src={
                                presidentRole_image_url || "/placeholder.svg"
                              }
                              alt="Resistance Logo"
                              className="mx-auto h-20"
                            />
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="mb-1 block text-sm text-gray-400">
                          Chancellor Insignia
                        </label>
                        <input
                          type="text"
                          value={chancellorRole_image_url ?? ""}
                          onChange={(e) =>
                            setchancellorRole_image_url(e.target.value)
                          }
                          className="w-full rounded border border-blue-500/30 bg-gray-800/50 px-3 py-2 text-white"
                        />
                        {chancellorRole_image_url && (
                          <div className="mt-2 rounded border border-blue-500/30 p-2">
                            <img
                              src={
                                chancellorRole_image_url || "/placeholder.svg"
                              }
                              alt="Resistance Logo"
                              className="mx-auto h-20"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                  {/* Resistance Faction */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="rounded-lg border border-blue-500/30 bg-gray-900/50 p-6 backdrop-blur-sm"
                  >
                    <GlitchText
                      text="RESISTANCE"
                      as="h2"
                      className="mb-4 text-2xl font-bold text-blue-400"
                      intensity="normal"
                    />

                    <div className="space-y-4">
                      <div>
                        <label className="mb-1 block text-sm text-gray-400">
                          Faction Name
                        </label>
                        <input
                          type="text"
                          value={LiberalName ?? "Liberal"}
                          onChange={(e) => setLiberalName(e.target.value)}
                          className="w-full rounded border border-blue-500/30 bg-gray-800/50 px-3 py-2 text-white"
                        />
                      </div>

                      <div>
                        <label className="mb-1 block text-sm text-gray-400">
                          Laws Codename
                        </label>
                        <input
                          type="text"
                          value={LiberalLaws ?? "Liberal Laws"}
                          onChange={(e) => setLiberalLaws(e.target.value)}
                          className="w-full rounded border border-blue-500/30 bg-gray-800/50 px-3 py-2 text-white"
                        />
                      </div>

                      <div>
                        <label className="mb-1 block text-sm text-gray-400">
                          Leader Title
                        </label>
                        <input
                          type="text"
                          value={LiberalLeader ?? "Liberal Leader"}
                          onChange={(e) => setLiberalLeader(e.target.value)}
                          className="w-full rounded border border-blue-500/30 bg-gray-800/50 px-3 py-2 text-white"
                        />
                      </div>

                      <div>
                        <label className="mb-1 block text-sm text-gray-400">
                          Faction Insignia
                        </label>
                        <input
                          type="text"
                          value={LiberalLogo ?? ""}
                          onChange={(e) => setLiberalLogo(e.target.value)}
                          className="w-full rounded border border-blue-500/30 bg-gray-800/50 px-3 py-2 text-white"
                        />
                        {LiberalLogo && (
                          <div className="mt-2 rounded border border-blue-500/30 p-2">
                            <img
                              src={LiberalLogo || "/placeholder.svg"}
                              alt="Resistance Logo"
                              className="mx-auto h-20"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>

                  {/* Infiltrators Faction */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="rounded-lg border border-purple-500/30 bg-gray-900/50 p-6 backdrop-blur-sm"
                  >
                    <GlitchText
                      text="INFILTRATORS"
                      as="h2"
                      className="mb-4 text-2xl font-bold text-purple-400"
                      intensity="normal"
                    />

                    <div className="space-y-4">
                      <div>
                        <label className="mb-1 block text-sm text-gray-400">
                          Faction Name
                        </label>
                        <input
                          type="text"
                          value={FascistName ?? ""}
                          onChange={(e) => setFascistName(e.target.value)}
                          className="w-full rounded border border-purple-500/30 bg-gray-800/50 px-3 py-2 text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-1 block text-sm text-gray-400">
                        Laws Codename
                      </label>
                      <input
                        type="text"
                        value={FascistLaws ?? ""}
                        onChange={(e) => setFascistLaws(e.target.value)}
                        className="w-full rounded border border-purple-500/30 bg-gray-800/50 px-3 py-2 text-white"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-sm text-gray-400">
                        Leader Title
                      </label>
                      <input
                        type="text"
                        value={Hitler_role_name ?? ""}
                        onChange={(e) => setHitler_role_name(e.target.value)}
                        className="w-full rounded border border-purple-500/30 bg-gray-800/50 px-3 py-2 text-white"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-sm text-gray-400">
                        Faction Insignia
                      </label>
                      <input
                        type="text"
                        value={FascistLogo ?? ""}
                        onChange={(e) => setFascistLogo(e.target.value)}
                        className="w-full rounded border border-blue-500/30 bg-gray-800/50 px-3 py-2 text-white"
                      />
                      {FascistLogo && (
                        <div className="mt-2 rounded border border-blue-500/30 p-2">
                          <img
                            src={FascistLogo || "/placeholder.svg"}
                            alt="Resistance Logo"
                            className="mx-auto h-20"
                          />
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="mb-1 block text-sm text-gray-400">
                        Leader Image
                      </label>
                      <input
                        type="text"
                        value={hitler_role_image_url ?? ""}
                        onChange={(e) =>
                          sethitler_role_image_url(e.target.value)
                        }
                        className="w-full rounded border border-blue-500/30 bg-gray-800/50 px-3 py-2 text-white"
                      />
                      {hitler_role_image_url && (
                        <div className="mt-2 rounded border border-blue-500/30 p-2">
                          <img
                            src={hitler_role_image_url || "/placeholder.svg"}
                            alt="Resistance Logo"
                            className="mx-auto h-20"
                          />
                        </div>
                      )}
                    </div>
                  </motion.div>
                </div>

                {/* Save Button */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  className="mt-8 flex justify-center"
                >
                  {/* <Button className="flex items-center rounded-md bg-blue-600 px-6 py-2 font-medium text-white transition-colors duration-200 hover:bg-blue-700">
                <span className="mr-2">SAVE CONFIGURATION</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </Button> */}
                </motion.div>
              </TabsContent>
            </Tabs>
          </div>
          {/* Password Modal */}
          {/* {showPasswordModal && (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-black/70">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mx-4 w-full max-w-md rounded-lg border border-yellow-500/50 bg-gray-900 p-6"
          >
            <GlitchText
              text="PASSWORD REQUIRED"
              as="h3"
              className="mb-4 text-center text-xl font-bold text-yellow-400"
              intensity="high"
            />

            <p className="mb-4 text-center text-gray-300">
              This operation is protected. Enter the password to join.
            </p>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm text-gray-400">
                  Operation Password
                </label>
                <div className="relative">
                  <Input
                    type={showMatchPassword ? "text" : "password"}
                    placeholder="Enter password..."
                    value={MatchPassword}
                    onChange={(e) => setMatchPassword(e.target.value)}
                    className="w-full border border-yellow-500/30 bg-gray-800 pr-10 text-white"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowMatchPassword(!showMatchPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-white"
                  >
                    {showMatchPassword ? (
                      <EyeOffIcon className="h-4 w-4" />
                    ) : (
                      <EyeIcon className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex space-x-3">
                <Button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="w-1/2 bg-gray-700 text-white hover:bg-gray-600"
                >
                  CANCEL
                </Button>
                <Button
                  type="submit"
                  className="w-1/2 bg-yellow-600 text-white hover:bg-yellow-700"
                >
                  VERIFY
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )} */}
        </div>
      )}
    </div>
  );
}
