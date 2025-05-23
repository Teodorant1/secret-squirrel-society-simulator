import bcrypt from "bcrypt";
import { db } from "@/server/db";
import {
  actual_users,
  election,
  match,
  match_type,
  player,
  stageEnum,
  substageEnum,
  vote,
  type MatchWithPlayers,
} from "@/server/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { CanBeNominated_for_chancellor } from "../frontend/frontend1";
export type Transaction = Parameters<Parameters<typeof db.transaction>[0]>[0];

const policies = [
  "liberal",
  "liberal",
  "liberal",
  "liberal",
  "liberal",
  "liberal",

  "fascist",
  "fascist",
  "fascist",

  "fascist",
  "fascist",
  "fascist",

  "fascist",
  "fascist",
  "fascist",
  "fascist",
  "fascist",
];

// Fascist track for 5-6 players
export const fascistTrack_1 = [
  "None",
  "None",
  "PeekNextThreePolicies",
  "Execution",
  "Execution",
  "Fascist Victory!",
];

// Fascist track for 7-8 players
export const fascistTrack_2 = [
  "None",
  "InvestigatePlayer",
  "SpecialElection",
  "Execution",
  "Execution",
  "Fascist Victory!",
];

// Fascist track for 9-10 players
export const fascistTrack_3 = [
  "None",
  "InvestigatePlayer",
  "PolicyPeek",
  "Execution",
  "Execution",
  "Fascist Victory!",
];

export const liberal_track = ["None", "None", "None", "None", "Victory!"];

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]; // Create a copy to avoid mutating the original array
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // Random index
    // Swap only if j is a valid index within bounds
    if (j !== undefined) {
      [shuffled[i], shuffled[j]] = [shuffled[j]!, shuffled[i]!]; // Non-null assertion
    }
  }
  return shuffled;
}

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS);
  const salt = await bcrypt.genSalt(saltRounds);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
}
export async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function get_config_based_on_number_of_players(number_of_player: number) {
  switch (number_of_player) {
    case 5:
      return {
        fascist_track: fascistTrack_1,
        liberal_track: liberal_track,
        fascist_numbers: 2,
        hitler_has_intel: true,
      };
    case 6:
      return {
        fascist_track: fascistTrack_1,
        liberal_track: liberal_track,
        fascist_numbers: 2,
        hitler_has_intel: true,
      };
    case 7:
      return {
        fascist_track: fascistTrack_2,
        liberal_track: liberal_track,
        fascist_numbers: 3,
        hitler_has_intel: false,
      };
    case 8:
      return {
        fascist_track: fascistTrack_2,
        liberal_track: liberal_track,
        fascist_numbers: 3,
        hitler_has_intel: false,
      };
    case 9:
      return {
        fascist_track: fascistTrack_3,
        liberal_track: liberal_track,
        fascist_numbers: 4,
        hitler_has_intel: false,
      };
    default:
      return {
        fascist_track: fascistTrack_3,
        liberal_track: liberal_track,
        fascist_numbers: 4,
        hitler_has_intel: false,
      };
  }
}

export async function nominate_chancellor(
  match_id: string,
  username: string,
  match_password: string,
  player_password: string,
  candidate: string,
) {
  const info = await get_info_on_game(
    match_id,
    username,
    match_password,
    player_password,
    true,
  );

  if (username !== info.president) {
    throw new Error("You ain't the president!");
  }

  if (
    CanBeNominated_for_chancellor(candidate, info) &&
    info.found_match_serverside
  ) {
    await db
      .update(election)
      .set({ chancellor_candidate: candidate })
      .where(and(eq(election.match, info.found_match_serverside.id)));

    await db
      .update(match)
      .set({
        substage: substageEnum.enumValues[2],
        waiting_on: "everyone",
      })
      .where(
        and(
          eq(election.match, info.found_match_serverside.id),
          eq(election.is_over, false),
        ),
      );
  } else {
    throw new Error("Can't nominate that person");
  }
  return "op success";
}

export async function start_game(
  match_id: string,
  username: string,
  match_password: string,
  player_password: string,
  // name: string,
) {
  return await db.transaction(
    async (tx) => {
      // const locked_match = await tx
      //   .select()
      //   .from(match)
      //   .where(eq(match.id, match_id))
      //   .for("update");
      const found_match = await tx.query.match.findFirst({
        where: eq(match.id, match_id),
        with: {
          elections: {
            with: {
              votes: true, // Eager load votes
            },
          },
          players: {
            orderBy: desc(player.joined_at), // Sort players by join date (newest first)
          },
        },
      });

      console.log(found_match?.players);

      if (!found_match) {
        throw new Error("Match not found.");
      }
      if (found_match.has_started || found_match.isOver) {
        throw new Error(
          "It is impossible to start the match at this time, it has either already started and/or finished",
        );
      }
      const is_present_in_match = await Check_if_player_is_present_in_match(
        player_password,
        username,
        found_match,
      );

      if (
        found_match.creator_owner !== username ||
        found_match.password !== match_password ||
        !is_present_in_match?.ispresent
      ) {
        throw new Error(
          "You are not the owner, please stand by, an elite clown commando unit is being rerouted to your position",
        );
      }
      const config = get_config_based_on_number_of_players(
        found_match.players.length,
      );
      const players = found_match.players;
      // players.sort(
      //   (a, b) =>
      //     new Date(a.joined_at).getTime() - new Date(b.joined_at).getTime(),
      // );

      // const new_players = players.sort(() => Math.random() - 0.5);

      // first shuffle
      const new_players = shuffleArray(players);
      const just_the_names: string[] = [];

      if (!new_players.length || !new_players) {
        throw new Error("No players found.");
      }
      for (let i = 0; i < new_players.length && i < 10; i++) {
        console.log(i);
        just_the_names.push(new_players[i]!.username);
      }
      //second shuffle
      const new_just_the_names = shuffleArray(just_the_names);
      const shuffled_policies = shuffleArray(policies);
      console.error("fascists numbers", config.fascist_numbers);
      for (let i = 0; i < config.fascist_numbers; i++) {
        if (i === 0) {
          await tx
            .update(match)
            .set({
              president: new_just_the_names[0],
              waiting_on: new_just_the_names[0],
              stage: stageEnum.enumValues[1],
              substage: substageEnum.enumValues[1],

              fascist_laws_array: config.fascist_track,
              liberal_laws_array: config.liberal_track,

              has_started: true,
              alive_players: new_just_the_names,
              original_players_array: new_just_the_names,
              hitler: new_players[i]!.username,
              hitler_has_intel: config.hitler_has_intel,
              deck: shuffled_policies,
            })
            .where(eq(match.id, new_players[i]!.match));
          await tx
            .update(player)
            .set({
              is_fascist: true,
              is_hitler: true,
            })
            .where(
              and(
                eq(player.id, new_players[i]!.id),
                eq(player.username, new_players[i]!.username),
                eq(player.match, new_players[i]!.match),
              ),
            );
        } else {
          await tx
            .update(player)
            .set({
              is_fascist: true,
            })
            .where(
              and(
                eq(player.id, new_players[i]!.id),
                eq(player.username, new_players[i]!.username),
                eq(player.match, new_players[i]!.match),
              ),
            );
        }
      }

      const current_match = await tx.query.match.findFirst({
        where: eq(match.id, match_id),
        with: {
          elections: {
            with: {
              votes: true, // Eager load votes
            },
          },
          players: true,
        },
      });

      const current_match_players = current_match?.players;
      const ideology_intel_array: string[] = [];
      const liberal_ideology_intel_array: string[] = ["You are a liberal"];

      const hitler_is_intel =
        current_match?.hitler + " is " + current_match?.hitler_role_name;

      ideology_intel_array.push(hitler_is_intel);
      if (!current_match_players) {
        throw new Error("No players present!");
      }
      for (const player of current_match_players) {
        const ideology = player.is_fascist
          ? current_match.fascist_faction_name
          : current_match.liberal_faction_name;

        ideology_intel_array.push(player.username + " is " + ideology);
      }

      if (config.hitler_has_intel === true) {
        await tx
          .update(player)
          .set({ intel: ideology_intel_array })
          .where(
            and(
              eq(player.is_fascist, true),
              eq(player.match, current_match.id),
            ),
          );
      } else {
        await tx
          .update(player)
          .set({ intel: ideology_intel_array })
          .where(
            and(
              eq(player.is_fascist, true),
              eq(player.is_hitler, false),
              eq(player.match, current_match.id),
            ),
          );

        await tx
          .update(player)
          .set({ intel: ["You are Hitler!"] })
          .where(
            and(
              eq(player.is_fascist, true),
              eq(player.is_hitler, true),
              eq(player.match, current_match.id),
            ),
          );
      }

      await tx
        .update(player)
        .set({ intel: liberal_ideology_intel_array })
        .where(
          and(
            eq(player.is_fascist, false),
            eq(player.is_hitler, false),
            eq(player.match, current_match.id),
          ),
        );
      const the_election = await tx
        .insert(election)
        .values({
          match: current_match.id,
          president_candidate: current_match.president,
        })
        .returning();
    },

    {
      isolationLevel: "read committed",
      accessMode: "read write",
      deferrable: true,
    },
  );
}
export async function get_info_on_game(
  match_id: string,
  username: string,
  password: string,
  player_password: string,
  is_server_side?: boolean,
) {
  // const locked_match = await tx
  //   .select()
  //   .from(match)
  //   .where(eq(match.id, match_id))
  //   .for("update");

  // const found_match = await db.query.match.findFirst({
  //   where: eq(match.id, match_id),
  //   with: {
  //     elections: {
  //       with: {
  //         votes: true, // Eager load votes
  //       },
  //     },
  //     players: true,
  //   },
  // });

  const found_match = await db.query.match.findFirst({
    where: eq(match.id, match_id),
    with: {
      elections: {
        with: {
          votes: {
            columns: {
              // id: true,
              voting_yes: true,
              username: true,
            },
          },
        },
        // where: eq(election.is_over, true),
      },
      players: true,
    },
  });

  if (!found_match) {
    throw new Error("Match not found.");
  }
  if (found_match.password !== password) {
    throw new Error("Wrong Password, ACCESS DENIED!");
  }

  console.log("found_match", found_match);

  const is_present_in_match = await Check_if_player_is_present_in_match(
    player_password,
    username,
    found_match,
  );
  if (!is_present_in_match?.ispresent) {
    throw new Error("You are not present in the match!");
  }

  // const intel = {
  //   hitler: found_match.hitler,
  // };

  const single_player = found_match.players.filter(
    (player) => player.username === username,
  );

  const config = get_config_based_on_number_of_players(
    found_match.players.length,
  );

  const all_elections = found_match.elections;

  const finishedElections = all_elections.filter((e) => e.is_over);
  const ongoingElection = all_elections.find((e) => !e.is_over); // only one expected

  const chancellor_laws =
    single_player[0]?.username === found_match.chancellor
      ? found_match.chancellor_laws_pile
      : null;

  const president_laws =
    single_player[0]?.username === found_match.president
      ? found_match.president_laws_pile
      : null;

  const state = {
    this_player: single_player[0],

    chancellor_laws: chancellor_laws,
    president_laws: president_laws,

    players: is_present_in_match.usernames,
    player_order: found_match.original_players_array,
    original_players_array: found_match.original_players_array,
    id: found_match.id,
    name: found_match.name,
    creator_owner: found_match.creator_owner,
    password: found_match.password,

    failed_elections: found_match.failed_elections,
    finishedElections: finishedElections,
    ongoingElection: ongoingElection ?? null,

    liberal_laws_number: found_match.liberal_laws,
    fascist_laws_number: found_match.fascist_laws,

    fascist_laws: config.fascist_track,
    liberal_laws: config.liberal_track,

    president: found_match.president,
    chancellor: found_match.chancellor,

    last_President: found_match.last_President,
    last_Chancellor: found_match.last_Chancellor,

    veto_power_unlocked: found_match.veto_power_unlocked,
    liberal_faction_name: found_match.liberal_faction_name,
    fascist_faction_name: found_match.fascist_faction_name,
    president_role_name: found_match.president_role_name,
    chancellor_role_name: found_match.chancellor_role_name,
    hitler_role_name: found_match.hitler_role_name,
    liberal_faction_image_url: found_match.liberal_faction_image_url,
    fascist_faction_image_url: found_match.fascist_faction_image_url,

    president_role_image_url: found_match.president_role_image_url,
    chancellor_role_image_url: found_match.chancellor_role_image_url,
    hitler_role_image_url: found_match.hitler_role_image_url,
    stage: found_match.stage,
    substage: found_match.substage,
    waiting_on: found_match.waiting_on,
    isOver: found_match.isOver,
    result: found_match.result,
    scheduled_for_deletion: found_match.scheduled_for_deletion,
    has_started: found_match.has_started,

    is_server_side: is_server_side,
    found_match_serverside: is_server_side ? found_match : null,
  };

  return state;
}

export type game_info_state = Awaited<ReturnType<typeof get_info_on_game>>;

export async function vote_in_election(
  match_id: string,
  match_password: string,
  username: string,
  player_password: string,
  voting_yes: boolean,
  president_candidate: string,
  chancellor_candidate: string,
) {
  const info = await get_info_on_game(
    match_id,
    username,
    match_password,
    player_password,
    true,
  );
  if (
    info.ongoingElection &&
    president_candidate === info.ongoingElection.president_candidate &&
    chancellor_candidate === info.ongoingElection.chancellor_candidate &&
    info.ongoingElection.voting_list.includes(username)
  ) {
    const casted_vote = await db
      .insert(vote)
      .values({
        election: info.ongoingElection.id,
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
        playerID: info.this_player!.id!,
        username: username,
        voting_yes: voting_yes,
      })
      .returning();

    const spray_voter_with_UV_fluid = "await db.";

    return casted_vote[0];
  } else {
    throw new Error("No election interferrence allowed");
  }
}
export async function Check_if_player_is_present_in_match(
  password: string,
  playerName: string,

  found_match: MatchWithPlayers,
) {
  const the_players = found_match.players;

  const usernamesArray = the_players.map((player) => ({
    username: player.username,
    id: player.id,
  }));

  for (const player of the_players) {
    const comparison = await bcrypt.compare(
      password.trim(),
      player.hashed_password,
    );

    if (player.username === playerName && comparison === true) {
      return {
        ispresent: true,
        isOwner: found_match.creator_owner === playerName ? true : false,
        isFascist: player.is_fascist,
        isHitler: player.is_hitler,
        usernames: usernamesArray,
        player: player,
      };
    }
  }

  return null;
}

export async function join_game(
  match_id: string,
  player_name: string,
  password: string,
  match_password: string,
) {
  // return await db.transaction(
  //   async (tx) => {
  // console.log(match_id, player_name, password, match_password);
  const locked_match = await db
    .select()
    .from(match)
    .where(eq(match.id, match_id))
    .for("update");

  // Fetch the match with eager-loaded relations and lock it for update
  const found_match = await db.query.match.findFirst({
    where: eq(match.id, match_id),
    with: {
      elections: {
        with: {
          votes: true, // Eager load votes
        },
      },
      players: true,
    },
  });

  if (!found_match) {
    throw new Error("Match not found.");
  }

  if (found_match.password !== match_password) {
    throw new Error("Wrong Password");
  }

  const players = found_match.players || [];
  if (players.length == 10) {
    throw new Error("Match is at full capacity and cannot be joined");
  }
  const isPresent = await Check_if_player_is_present_in_match(
    password,
    player_name,
    found_match,
  );

  if (isPresent?.ispresent) {
    return {
      found_match: found_match,
      players: found_match.players,
      singular_new_player: isPresent.player,
    };
  }
  if (found_match.has_started || found_match.isOver) {
    throw new Error(
      "It is impossible to join the match at this time, it has either already started and/or finished",
    );
  }
  const hashed_password = await hashPassword(password.trim());

  const new_player = await db
    .insert(player)
    .values({
      match: match_id,
      username: player_name,
      hashed_password: hashed_password,
    })
    .returning();

  if (!new_player) {
    throw new Error("couldn't create a new player");
  }

  const singular_new_player = new_player[0];

  return {
    found_match: found_match,
    players: players,
    singular_new_player: singular_new_player,
  };
  // },
  // {
  //   isolationLevel: "read committed",
  //   accessMode: "read write",
  //   deferrable: true,
  // },
  // );
}

export async function seed_players_into_existing_match(
  match_id: string,
  // tx: Transaction,
) {
  const playerUsernames = ["testuser1", "testuser2", "testuser3", "testuser4"];
  const playerPassword = "password";

  for (const username of playerUsernames) {
    const user_id = `uid-${username}`;
    const player_id = `player-${username}`;
    const hashed = await hashPassword(playerPassword);

    // Upsert actual user
    await db
      .insert(actual_users)
      .values({
        id: user_id,
        username,
        email: `${username}@example.com`,
        password: hashed,
        image: null,
      })
      .onConflictDoUpdate({
        target: actual_users.username,
        set: {
          email: `${username}@example.com`,
          password: hashed,
        },
      });

    // Upsert player
    await db
      .insert(player)
      .values({
        id: player_id,
        username,
        hashed_password: hashed,
        match: match_id,
        score: 0,
        is_fascist: false,
        is_hitler: false,
        intel: [],
      })
      .onConflictDoUpdate({
        target: player.id,
        set: {
          hashed_password: hashed,
          match: match_id,
        },
      });
  }

  return { match_id, message: "Test players seeded into match" };
}

export async function create_game(
  name: string,
  username: string,
  player_password: string,
  liberal_faction_name: string,
  fascist_faction_name: string,
  president_role_name: string,
  chancellor_role_name: string,
  hitler_role_name: string,
  liberal_faction_image_url: string,
  fascist_faction_image_url: string,
  president_role_image_url: string,
  chancellor_role_image_url: string,
  hitler_role_image_url: string,
  matchpassword: string,
) {
  // Insert the new match and return it
  const new_match_return = await db
    .insert(match)
    .values({
      name: name,
      creator_owner: username,
      password: matchpassword,
      liberal_faction_name: liberal_faction_name,
      fascist_faction_name: fascist_faction_name,
      president_role_name: president_role_name,
      chancellor_role_name: chancellor_role_name,
      hitler_role_name: hitler_role_name,
      liberal_faction_image_url: liberal_faction_image_url,
      fascist_faction_image_url: fascist_faction_image_url,
      president_role_image_url: president_role_image_url,
      chancellor_role_image_url: chancellor_role_image_url,
      hitler_role_image_url: hitler_role_image_url,
    })
    .returning();

  const new_match = new_match_return[0];
  // console.log(match);
  if (!new_match) {
    throw new Error("Failed to create match");
  }

  const create_user_result = await join_game(
    new_match.id,
    username,
    player_password,
    matchpassword,
  );
  const IS_PRODUCTION = process.env.IS_PRODUCTION;
  if (IS_PRODUCTION === "false") {
    console.log("simulating test environment and");
    const result = await seed_players_into_existing_match(new_match.id);
    console.log(result);
  }

  return { new_match, create_user_result }; // Return the created match

  // return await db.transaction(
  //   async (tx) => {
  //

  // // Insert the new match and return it
  // const new_match_return = await tx
  //   .insert(match)
  //   .values({
  //     name: name,
  //     creator_owner: username,
  //     password: matchpassword,
  //     liberal_faction_name: liberal_faction_name,
  //     fascist_faction_name: fascist_faction_name,
  //     president_role_name: president_role_name,
  //     chancellor_role_name: chancellor_role_name,
  //     hitler_role_name: hitler_role_name,
  //     liberal_faction_image_url: liberal_faction_image_url,
  //     fascist_faction_image_url: fascist_faction_image_url,
  //     president_role_image_url: president_role_image_url,
  //     chancellor_role_image_url: chancellor_role_image_url,
  //     hitler_role_image_url: hitler_role_image_url,
  //   })
  //   .returning();
  //
  // const new_match = new_match_return[0];
  // atch);
  // if (!new_match) {
  //   throw new Error("Failed to create match");
  // }
  //

  // const create_user_result = await join_game(
  //   new_match.id,
  //   username,
  //   player_password,
  //   matchpassword,
  // );
  //

  // return { new_match, create_user_result }; // Return the created match
  // },
  // {
  //   isolationLevel: "read committed",
  //   accessMode: "read write",
  //   deferrable: true,
  // },
  // );
}
export async function GetAvailableGames() {
  const available_games = await db.query.match.findMany({
    where: eq(match.has_started, false),
    columns: {
      id: true,
      name: true,
      creator_owner: true,
    },
    with: {
      players: {
        columns: { username: true, id: true },
      },
    },
  });

  return available_games;
}

export async function GetPlayerStartedGames(username: string) {
  const startedGames = await db.query.match.findMany({
    where: and(
      eq(match.has_started, true),
      // Only include matches where at least one player matches this username
      // But since we can't filter `with.players` directly, we will filter afterward
      // This gets all started matches and their players
      // You can refine this later if needed using subqueries
    ),
    columns: {
      id: true,
      name: true,
      creator_owner: true,
    },
    with: {
      players: {
        columns: { username: true, id: true },
      },
    },
  });

  // Filter the matches to only those the player has joined
  const joinedMatches = startedGames.filter((match) =>
    match.players.some((player) => player.username === username),
  );

  return joinedMatches;
}

export async function GetAllRelevantGames(username: string) {
  // 1. Get games that haven't started (available to join)
  const fresh_games = await GetAvailableGames();

  // 2. Get games that *have* started where the player has joined
  const startedGames = await GetPlayerStartedGames(username);

  // 3. Combine the two lists
  const allGames = [...startedGames, ...fresh_games];

  return allGames;
}
