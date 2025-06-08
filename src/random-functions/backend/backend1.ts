import bcrypt from "bcrypt";
import { db } from "@/server/db";
import {
  actual_users,
  election,
  match,
  type match_type,
  player,
  stageEnum,
  substageEnum,
  vote,
  type MatchWithPlayers,
} from "@/server/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { CanBeNominated_for_chancellor } from "../frontend/frontend1";
export type Transaction = Parameters<Parameters<typeof db.transaction>[0]>[0];
export type game_info_state = Awaited<ReturnType<typeof get_info_on_game>>;

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
  "Victory!",
];

// Fascist track for 7-8 players
export const fascistTrack_2 = [
  "None",
  "InvestigatePlayer",
  "SpecialElection",
  "Execution",
  "Execution",
  "Victory!",
];

// Fascist track for 9-10 players
export const fascistTrack_3 = [
  "InvestigatePlayer",
  "InvestigatePlayer",
  "SpecialElection",
  "Execution",
  "Execution",
  "Victory!",
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

async function set_up_next_election(
  db: Transaction,
  found_match: match_type,
  is_special_election?: boolean,
  special_election_successor?: string,
) {
  if (!found_match?.alive_players) {
    throw new Error("can't access found_match?.alive_players ");
  }
  if (!found_match?.last_regular_president) {
    throw new Error("can't access found_match?.last_regular_president ");
  }
  const next_president = get_next_president(
    found_match.last_regular_president,
    found_match.alive_players,
  );
  if (!found_match.id) {
    throw new Error("Can't access found_match.id");
  }

  const actual_candidate = is_special_election
    ? special_election_successor
    : next_president;

  const next_election = await db
    .insert(election)
    .values({
      president_candidate: actual_candidate,
      is_special_election: is_special_election === true ? true : false,
      match: found_match.id,
      voting_list: found_match.alive_players,
    })
    .returning();

  const updated_match = await db
    .update(match)
    .set({
      president: actual_candidate,
      chancellor: "",
      stage: stageEnum.enumValues[1],
      substage: substageEnum.enumValues[1],
      waiting_on: actual_candidate,
      executive_power: "",
      executive_power_active: false,
      veto_session_over: false,
      chancellor_has_activated_veto: false,
      president_accepted_veto: false,
    })
    .where(eq(match.id, found_match.id))
    .returning();
  if (!next_election[0] || !updated_match[0]) {
    throw new Error(
      "Error in accessing new election or updated match in set_up_next_election method",
    );
  }

  return next_election;
}

function get_next_president(
  current_president: string,
  alive_players: string[],
) {
  const index = alive_players.indexOf(current_president);

  if (index === -1) {
    throw new Error("Current president is not in the list of alive players");
  }

  const nextIndex = (index + 1) % alive_players.length;
  return alive_players[nextIndex];
}

function is_player_alive(player: string, alive_players: string[]) {
  return alive_players.includes(player);
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
  db: Transaction,
  match_id: string,
  username: string,
  match_password: string,
  player_password: string,
  candidate: string,
) {
  console.log("attempting to nominate a chancellor");

  const info = await get_info_on_game(
    db,
    match_id,
    username,
    match_password,
    player_password,
    true,
  );
  if (info.is_present_in_match && info.is_present_in_match.is_alive === false) {
    throw new Error(
      "It is forbidden to nominate_chancellor from the afterlife",
    );
  }
  if (username !== info.president) {
    throw new Error("You ain't the president!");
  }

  const nombinateAble = CanBeNominated_for_chancellor(candidate, info);

  if (nombinateAble === true && info.found_match_serverside) {
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
          eq(match.id, info.found_match_serverside.id),
          eq(match.isOver, false),
        ),
      );
  } else {
    throw new Error("Can't nominate that person");
  }
  return "op success";
}
export async function victory_check(db: Transaction, found_match: match_type) {
  if (!found_match.id) {
    throw Error("Can't access deck or match perhaps");
  }
  const hitler = found_match.hitler;
  if (!hitler) {
    throw new Error("Hitler doesn't exist");
  }
  if (found_match.liberal_laws === undefined) {
    throw new Error("found_match.liberal_laws doesn't exist");
  }

  console.log("checking victory");
  const hitler_is_alive = found_match.alive_players?.includes(hitler);
  if (hitler_is_alive === false || found_match.liberal_laws > 6) {
    //liberals win
    const update_match = await db
      .update(match)
      .set({
        isOver: true,
        stage: stageEnum.enumValues[4],
        result: found_match.liberal_faction_name ?? "Liberal" + " Victory",
        waiting_on: "Game is over, we're waiting on nobody",
      })
      .where(eq(match.id, found_match.id))
      .returning();
    console.log("liberal victory");

    return true;
  }
  if (
    (found_match.hitler === found_match.chancellor &&
      found_match.fascist_laws &&
      found_match.fascist_laws > 2) ||
    found_match.fascist_laws === 6
  ) {
    // fascists win
    const update_match = await db
      .update(match)
      .set({
        isOver: true,
        stage: stageEnum.enumValues[4],
        result: found_match.fascist_faction_name ?? "Fascist" + " Victory",
        waiting_on: "Game is over, we're waiting on nobody",
      })
      .where(eq(match.id, found_match.id))
      .returning();
    console.log("fascist victory");

    return true;
  }
  console.log("no one has won");
  return false;
}

export async function eot_cleanup_step(
  db: Transaction,
  found_match: match_type,
) {
  if (!found_match.deck || !found_match.discard_pile || !found_match.id) {
    throw Error("Can't access deck or match perhaps");
  }
  if (found_match.deck.length < 3) {
    const combined_policies = [
      ...found_match.deck,
      ...found_match.discard_pile,
    ];

    const new_deck = shuffleArray(combined_policies);

    const updated_match = await db
      .update(match)
      .set({ discard_pile: [], deck: new_deck })
      .where(eq(match.id, found_match.id))
      .returning();

    const actual_updated_match = updated_match[0];
    if (!actual_updated_match) {
      throw new Error("Error in eot_cleanup_step");
    }

    return actual_updated_match;
  }
  return null;
}

export async function start_game(
  db: Transaction,
  match_id: string,
  username: string,
  match_password: string,
  player_password: string,
  // name: string,
) {
  // return await db.transaction(
  //   async (db) => {
  const locked_match = await db
    .select()
    .from(match)
    .where(eq(match.id, match_id))
    .for("update");
  const found_match = await db.query.match.findFirst({
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
  const is_present_in_match = await Check_if_player_is_present_in_match(
    player_password,
    username,
    found_match,
  );
  if (
    (found_match.has_started && is_present_in_match?.ispresent === false) ||
    found_match.isOver
  ) {
    throw new Error(
      "v1 It is impossible to start the match at this time, it has either already started and/or finished",
    );
  }
  if (found_match.players.length < 5) {
    throw new Error("too few players to start a game");
  }
  // if (is_present_in_match?.is_alive === false) {
  // throw new Error("It is forbidden to start games from the afterlife");
  // }
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
      await db
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
      await db
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
      await db
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

  const current_match = await db.query.match.findFirst({
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
  if (!current_match) {
    throw new Error("can't access current_match");
  }
  const current_match_players = current_match?.players;

  const ideology_intel_array: string[] = [];
  const liberal_intel_nugget =
    "You are a " + current_match.liberal_faction_name;
  const liberal_ideology_intel_array: string[] = [liberal_intel_nugget];

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
    await db
      .update(player)
      .set({ intel: ideology_intel_array })
      .where(
        and(eq(player.is_fascist, true), eq(player.match, current_match.id)),
      );
  } else {
    await db
      .update(player)
      .set({ intel: ideology_intel_array })
      .where(
        and(
          eq(player.is_fascist, true),
          eq(player.is_hitler, false),
          eq(player.match, current_match.id),
        ),
      );

    await db
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

  await db
    .update(player)
    .set({ intel: liberal_ideology_intel_array })
    .where(
      and(
        eq(player.is_fascist, false),
        eq(player.is_hitler, false),
        eq(player.match, current_match.id),
      ),
    );
  const the_election = await db
    .insert(election)
    .values({
      match: current_match.id,
      president_candidate: current_match.president,
      voting_list: current_match.alive_players,
    })
    .returning();

  const final_result = await db.query.match.findFirst({
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

  console.log("final_result", final_result);
  // },
  // {
  //   isolationLevel: "read committed",
  //   accessMode: "read write",
  //   deferrable: true,
  // },
  // );
}

// export async function test_peek(
//   db: Transaction,
//   match_id: string,
//   // username: string,
//   // match_password: string,
//   // player_password: string,
// ) {
//   const IS_PRODUCTION = process.env.IS_PRODUCTION;
//   if (IS_PRODUCTION === "true") {
//     return 0;
//   }

//   const actual_new_match = await db.query.match.findFirst({
//     where: eq(match.id, match_id),
//   });

//   if (!actual_new_match?.deck[0]) {
//     throw new Error("Can't access actual_new_match?.deck[0]");
//   }
//   if (!actual_new_match?.deck[1]) {
//     throw new Error("Can't access actual_new_match?.deck[1]");
//   }
//   if (!actual_new_match?.deck[2]) {
//     throw new Error("Can't access actual_new_match?.deck[2]");
//   }

//   const top_of_the_deck = [
//     actual_new_match?.deck[0],
//     actual_new_match?.deck[1],
//     actual_new_match?.deck[2],
//   ];

//   if (!top_of_the_deck) {
//     throw new Error("can't pull 3 cards from top_of_the_deck");
//   }

//   console.log("top_of_the_deck", top_of_the_deck);

//   const top_three_card_intel =
//     "The 3 policies at the top are as follows: " +
//     (actual_new_match.deck[0] === "liberal"
//       ? actual_new_match.liberal_faction_name + " policy"
//       : actual_new_match.fascist_faction_name + " policy") +
//     " , " +
//     (actual_new_match.deck[1] === "liberal"
//       ? actual_new_match.liberal_faction_name + " policy"
//       : actual_new_match.fascist_faction_name + " policy") +
//     " , " +
//     (actual_new_match.deck[2] === "liberal"
//       ? actual_new_match.liberal_faction_name + " policy"
//       : actual_new_match.fascist_faction_name + " policy");

//   console.log("top_three_card_intel", top_three_card_intel);

//   const president_player = actual_new_match.president;
//   console.log("top_three_card_intel", top_three_card_intel);

//   const open_source_intel = actual_new_match.open_source_intel;
//   console.log("open_source_intel", open_source_intel);

//   const nugget_of_intel =
//     actual_new_match.president_role_name +
//     president_player +
//     " has looked at the top 3 cards of the policy deck .";
//   console.log("nugget_of_intel", nugget_of_intel);

//   const new_open_source_intel = [...open_source_intel, nugget_of_intel];
//   console.log("new_open_source_intel", new_open_source_intel);

//   await db
//     .update(match)
//     .set({
//       open_source_intel: new_open_source_intel,
//     })
//     .where(eq(match.id, actual_new_match.id));

//   const president_player_object = await db.query.player.findFirst({
//     where: and(
//       eq(player.match, actual_new_match.id),
//       eq(player.username, president_player),
//     ),
//   });
//   if (!president_player_object?.intel) {
//     throw new Error("cannot access president_player_object?.intel");
//   }
//   const president_player_object_intel = president_player_object.intel;
//   const new_intel_array = [
//     ...president_player_object_intel,
//     top_three_card_intel,
//   ];

//   console.log("new_intel_array", new_intel_array);

//   const updated_president_player_object = await db
//     .update(player)
//     .set({ intel: new_intel_array })
//     .where(
//       and(
//         eq(player.match, actual_new_match.id),
//         eq(player.username, president_player),
//       ),
//     )
//     .returning();

//   console.log(
//     "updated_president_player_object",
//     updated_president_player_object,
//   );

//   return 0;
// }

export async function get_info_on_game(
  db: Transaction,
  match_id: string,
  username: string,
  password: string,
  player_password: string,
  is_server_side?: boolean,
) {
  // const locked_match = await db
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
        orderBy: desc(election.created_at),

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

  // console.log("found_match", found_match);

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

  // if (
  //   ongoingElection?.is_over === false &&
  //   ongoingElection.voting_list.length === 0 &&
  //   username === ongoingElection.president_candidate
  // ) {
  //   console.log("something stinks here");
  //   await tally_vote_results(ongoingElection.id, found_match.alive_players);
  // }

  const chancellor_laws =
    single_player[0]?.username === found_match.chancellor
      ? found_match.chancellor_laws_pile
      : null;

  const president_laws =
    single_player[0]?.username === found_match.president
      ? found_match.president_laws_pile
      : null;

  if (!single_player[0]?.intel) {
    throw new Error("can't access the intel for the player");
  }

  const new_intel_array = [
    ...single_player[0]?.intel,
    ...found_match.open_source_intel,
  ];

  const state = {
    player_size: found_match.players.length,
    decksize: found_match.deck.length,
    discard_size: found_match.discard_pile.length,

    this_player: single_player[0],
    player_intel: new_intel_array,
    open_source_intel: found_match.open_source_intel,

    is_present_in_match: is_present_in_match,
    chancellor_laws: chancellor_laws,
    president_laws: president_laws,

    players: is_present_in_match.usernames,
    player_order: found_match.alive_players,
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

    last_regular_president: found_match.last_regular_president,
    last_President: found_match.last_President,
    last_Chancellor: found_match.last_Chancellor,

    veto_power_unlocked: found_match.veto_power_unlocked,
    veto_session_over: found_match.veto_session_over,
    chancellor_has_activated_veto: found_match.chancellor_has_activated_veto,
    president_accepted_veto: found_match.president_accepted_veto,
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

    executive_power_enabled: found_match.executive_power_active,
    executive_power: found_match.executive_power,

    is_server_side: is_server_side,
    found_match_serverside: is_server_side ? found_match : null,
  };

  return state;
}

export async function discard_policy(
  db: Transaction,
  match_id: string,
  username: string,
  match_password: string,
  player_password: string,
  index: number,
) {
  const info = await get_info_on_game(
    db,
    match_id,
    username,
    match_password,
    player_password,
    true,
  );

  if (info.is_present_in_match && info.is_present_in_match.is_alive === false) {
    throw new Error("It is forbidden to discard policies from the afterlife");
  }

  if (
    info.substage === substageEnum.enumValues[4] &&
    info.stage === stageEnum.enumValues[2] &&
    info.president === username
  ) {
    if (!info.found_match_serverside) {
      throw new Error("can't access info.found_match_serverside");
    }
    // const eot_cleanup_step_1 = await eot_cleanup_step(
    //   info.found_match_serverside,
    // );

    const policies = info.president_laws;
    if (!policies) {
      throw new Error("policies doesn't exist");
    }

    console.error("discard_policy FUNCTION , president part");
    console.log("policies:", policies);

    const removed_policy = policies[index];
    console.log("removed_policy:", removed_policy);

    if (!removed_policy) {
      throw new Error("removed_policy doesn't exist");
    }
    if (!info.found_match_serverside?.discard_pile) {
      throw new Error(
        "info.found_match_serverside?.discard_pile doesn't exist",
      );
    }
    const new_discard = [
      ...info.found_match_serverside?.discard_pile,
      removed_policy,
    ];
    console.log("new_discard:", new_discard);

    policies?.splice(index, 1);

    const updated_match = await db
      .update(match)
      .set({
        discard_pile: new_discard,
        president_laws_pile: [],
        chancellor_laws_pile: policies,
        substage: substageEnum.enumValues[5],
        waiting_on: info.chancellor,
      })
      .where(eq(match.id, info.id))
      .returning();

    const actual_updated_match = updated_match[0];

    if (actual_updated_match) {
      console.log(
        "actual_updated_match exists",
        actual_updated_match.president_laws_pile,
        actual_updated_match.chancellor_laws_pile,
      );
    }
  } else if (
    info.substage === substageEnum.enumValues[5] &&
    info.stage === stageEnum.enumValues[2] &&
    info.chancellor === username
  ) {
    console.error("discard_policy FUNCTION , chancellor part");

    const policies = info.chancellor_laws;
    if (!policies) {
      throw new Error("policies doesn't exist");
    }

    console.log("policies:", policies);

    const picked_policy = policies[index];
    console.log("picked_policy:", picked_policy);

    if (!picked_policy) {
      throw new Error("picked_policy doesn't exist");
    }
    if (!info.found_match_serverside?.discard_pile) {
      throw new Error(
        "info.found_match_serverside?.discard_pile doesn't exist",
      );
    }
    policies?.splice(index, 1);

    const new_discard = [
      ...info.found_match_serverside?.discard_pile,
      ...policies,
    ];

    console.log("new_discard:", new_discard);

    if (picked_policy === "liberal") {
      const new_match = await db
        .update(match)
        .set({
          discard_pile: new_discard,
          president_laws_pile: [],
          chancellor_laws_pile: [],
          liberal_laws: info.found_match_serverside.liberal_laws + 1,
        })
        .where(eq(match.id, info.id))
        .returning();

      const actual_new_match = new_match[0];

      if (!actual_new_match) {
        throw new Error("can't access actual_new_match");
      }
      const game_is_over = await victory_check(db, actual_new_match);
      if (game_is_over === false) {
        await set_up_next_election(db, actual_new_match);
      }
    }

    if (picked_policy === "fascist") {
      const new_match = await db
        .update(match)
        .set({
          discard_pile: new_discard,
          president_laws_pile: [],
          chancellor_laws_pile: [],
          fascist_laws: info.found_match_serverside.fascist_laws + 1,
          substage: substageEnum.enumValues[5],
        })
        .where(eq(match.id, info.id))
        .returning();
      const actual_new_match = new_match[0];
      if (!actual_new_match) {
        throw new Error("can't access actual_new_match");
      }

      if (
        actual_new_match.fascist_laws === 5 &&
        actual_new_match.veto_power_unlocked === false
      ) {
        await db
          .update(match)
          .set({ veto_power_unlocked: true })
          .where(eq(match.id, actual_new_match.id));
      }

      // const cleaned_up_game = await eot_cleanup_step(actual_new_match);
      // if (!cleaned_up_game) {
      //   throw new Error("cleaned_up_game is undefined");
      // }

      const results = is_next_power_special(actual_new_match);
      if (results.isSpecial_law === false || results.exact_law === "Victory!") {
        const game_is_over = await victory_check(db, actual_new_match);
        if (game_is_over === false) {
          await set_up_next_election(db, actual_new_match);
        }
      } else if (
        results.isSpecial_law === true &&
        results.exact_law === "PeekNextThreePolicies"
      ) {
        if (!actual_new_match?.deck[0]) {
          throw new Error("Can't access actual_new_match?.deck[0]");
        }
        if (!actual_new_match?.deck[1]) {
          throw new Error("Can't access actual_new_match?.deck[1]");
        }
        if (!actual_new_match?.deck[2]) {
          throw new Error("Can't access actual_new_match?.deck[2]");
        }

        const top_of_the_deck = [
          actual_new_match?.deck[0],
          actual_new_match?.deck[1],
          actual_new_match?.deck[2],
        ];
        if (!top_of_the_deck) {
          throw new Error("can't pull 3 cards from top_of_the_deck");
        }
        const top_three_card_intel =
          "The 3 policies at the top are as follows: " +
          (actual_new_match.deck[0] === "liberal"
            ? actual_new_match.liberal_faction_name + " policy"
            : actual_new_match.fascist_faction_name + " policy") +
          " , " +
          (actual_new_match.deck[1] === "liberal"
            ? actual_new_match.liberal_faction_name + " policy"
            : actual_new_match.fascist_faction_name + " policy") +
          " , " +
          (actual_new_match.deck[2] === "liberal"
            ? actual_new_match.liberal_faction_name + " policy"
            : actual_new_match.fascist_faction_name + " policy");

        const president_player = actual_new_match.president;

        const open_source_intel = actual_new_match.open_source_intel;
        const nugget_of_intel =
          actual_new_match.president_role_name +
          " " +
          president_player +
          " has looked at the top 3 cards of the policy deck .";

        const new_open_source_intel = [...open_source_intel, nugget_of_intel];

        await db
          .update(match)
          .set({
            open_source_intel: new_open_source_intel,
          })
          .where(eq(match.id, actual_new_match.id));

        const president_player_object = await db.query.player.findFirst({
          where: and(
            eq(player.match, actual_new_match.id),
            eq(player.username, president_player),
          ),
        });
        if (!president_player_object?.intel) {
          throw new Error("cannot access president_player_object?.intel");
        }
        const president_player_object_intel = president_player_object.intel;
        const new_intel_array = [
          ...president_player_object_intel,
          top_three_card_intel,
        ];
        const updated_president_player_object = await db
          .update(player)
          .set({ intel: new_intel_array })
          .where(
            and(
              eq(player.match, actual_new_match.id),
              eq(player.username, president_player),
            ),
          )
          .returning();
        await set_up_next_election(db, actual_new_match);
      } else if (
        results.isSpecial_law === true &&
        results.exact_law !== "PeekNextThreePolicies"
      ) {
        await db
          .update(match)
          .set({
            executive_power_active: true,
            executive_power: results.exact_law,
            stage: stageEnum.enumValues[3],
            substage: substageEnum.enumValues[6],
            waiting_on: actual_new_match.president,
          })
          .where(eq(match.id, actual_new_match.id));
      }
    }
  }
  return 0;
}

export function is_next_power_special(found_match: match_type) {
  if (found_match.fascist_laws === undefined) {
    throw new Error("Can't access found_match.fascist_laws");
  }
  const number_of_fascist_laws = found_match.fascist_laws;
  const fascist_law_index = number_of_fascist_laws - 1;
  if (!found_match.fascist_laws_array) {
    throw new Error("can't access found_match.fascist_laws_array");
  }

  const exact_law = found_match.fascist_laws_array[fascist_law_index];
  if (!exact_law) {
    throw new Error("can't access exact_law");
  }
  const isSpecial_law = exact_law === "None" ? false : true;
  const returns = { isSpecial_law: isSpecial_law, exact_law: exact_law };

  return returns;
}
export async function handle_veto(
  db: Transaction,
  match_id: string,
  match_password: string,
  username: string,
  player_password: string,
  voting_yes: boolean,
) {
  const info = await get_info_on_game(
    db,
    match_id,
    username,
    match_password,
    player_password,
    true,
  );

  if (
    username === info.found_match_serverside?.chancellor &&
    info.found_match_serverside.substage === substageEnum.enumValues[5] &&
    info.found_match_serverside.president_accepted_veto === false
  ) {
    const osint_nugget =
      info.found_match_serverside.chancellor_role_name +
      " " +
      username +
      " wishes to veto the  proposal ";

    const osint_intel_array = info.found_match_serverside.open_source_intel;

    const new_osint_intel_array = [...osint_intel_array, osint_nugget];

    const updated_match = await db
      .update(match)
      .set({
        chancellor_has_activated_veto: voting_yes === true ? true : false,
        open_source_intel: new_osint_intel_array,
        // failed_elections: info.found_match_serverside.failed_elections + 1,
      })
      .where(eq(match.id, info.found_match_serverside.id))
      .returning();
  } else if (
    username === info.found_match_serverside?.president &&
    info.found_match_serverside.substage === substageEnum.enumValues[5] &&
    info.found_match_serverside.president_accepted_veto === false &&
    info.found_match_serverside.chancellor_has_activated_veto === true
  ) {
    const outcome = voting_yes === true ? "accepted" : "rejected";

    const osint_nugget =
      info.found_match_serverside.president_role_name +
      " " +
      username +
      " has " +
      outcome +
      " the veto proposal ";

    const osint_intel_array = info.found_match_serverside.open_source_intel;

    const new_osint_intel_array = [...osint_intel_array, osint_nugget];

    const updated_match = await db
      .update(match)
      .set({
        president_accepted_veto: voting_yes === true ? true : false,
        open_source_intel: new_osint_intel_array,
        veto_session_over: true,
        // failed_elections: info.found_match_serverside.failed_elections + 1,
      })
      .where(eq(match.id, info.found_match_serverside.id))
      .returning();

    const actual_updated_match = updated_match[0];
    if (!actual_updated_match) {
      throw new Error("can't access actual_updated_match in handle_veto() ");
    }
    if (voting_yes === true) {
      const failed_elections = actual_updated_match.failed_elections + 1;
      const commit_anarchy = failed_elections === 3 ? true : false;
      const next_president = get_next_president(
        actual_updated_match.last_regular_president,
        actual_updated_match.alive_players,
      );
      const updated_match = await db
        .update(match)
        .set({
          waiting_on: next_president,
          president: next_president,
          chancellor: "",
          stage: stageEnum.enumValues[1],
          substage: substageEnum.enumValues[1],
          failed_elections: commit_anarchy ? 0 : 3,
          last_Chancellor: commit_anarchy
            ? ""
            : actual_updated_match.last_Chancellor,
          last_President: commit_anarchy
            ? ""
            : actual_updated_match.last_President,
          last_regular_president: commit_anarchy
            ? ""
            : actual_updated_match.last_regular_president,

          executive_power: "",
          executive_power_active: false,
          veto_session_over: false,
          chancellor_has_activated_veto: false,
          president_accepted_veto: false,
        })
        .where(eq(match.id, actual_updated_match.id))
        .returning();

      // const actual_updated_match = updated_match[0];

      if (commit_anarchy) {
        const deck = actual_updated_match.deck;

        const first_policy = deck.shift();

        const is_liberal = first_policy === "liberal" ? true : false;

        if (is_liberal && actual_updated_match) {
          const updated_match = await db
            .update(match)
            .set({
              liberal_laws: actual_updated_match.liberal_laws + 1,
              deck: deck,
            })
            .where(eq(match.id, actual_updated_match.id))
            .returning();
        } else if (!is_liberal && actual_updated_match) {
          const updated_match = await db
            .update(match)
            .set({
              fascist_laws: actual_updated_match.fascist_laws + 1,
              deck: deck,
            })
            .where(eq(match.id, actual_updated_match.id))
            .returning();
        }
      }
    }
  }
  return 0;
}

export async function test_handle_special_power(
  db: Transaction,
  special_power: string,
  found_match_id: string,
  username: string,
  target: string,
  player_password: string,
  match_password: string,
) {
  await db
    .update(match)
    .set({ executive_power: special_power, executive_power_active: true })
    .where(eq(match.id, found_match_id));

  const result = await handle_special_power(
    db,
    found_match_id,
    username,
    target,
    player_password,
    match_password,
  );

  // const mutated_match = await db.query.match.findFirst({
  //   where: eq(match.id, found_match_id),
  // });

  // console.log("mutated_match", mutated_match);
}

export async function handle_special_power(
  db: Transaction,
  found_match_id: string,
  username: string,
  target: string,
  player_password: string,
  match_password: string,
) {
  const info = await get_info_on_game(
    db,
    found_match_id,
    username,
    match_password,
    player_password,
    true,
  );

  const found_match = info.found_match_serverside;
  if (!found_match) {
    throw new Error("");
  }
  if (!found_match.id) {
    throw new Error("can't access found_match.id in handle_special_power ");
  }

  if (!found_match.alive_players?.includes(target)) {
    throw new Error("Target not present among the living, try looking in hell");
  }

  const power = found_match.executive_power;
  const power_is_active = found_match.executive_power_active;

  console.log("arguments", power, power_is_active, target);

  if (username !== found_match.president) {
    throw new Error("You are not the president role, ACCESS DENIED");
  }

  if (power && power_is_active && username === found_match.president) {
    if (power === "InvestigatePlayer") {
      const Investigated_Player = await db.query.player.findFirst({
        where: and(
          eq(player.match, found_match.id),
          eq(player.username, target),
        ),
      });

      const el_presidente = await db.query.player.findFirst({
        where: and(
          eq(player.match, found_match.id),
          eq(player.username, username),
        ),
      });

      if (!Investigated_Player) {
        throw new Error("can't access Investigated_Player");
      }
      const is_fascist = Investigated_Player?.is_fascist;
      const factionName = is_fascist
        ? found_match.fascist_faction_name
        : found_match.liberal_faction_name;

      const intel_nugget = `${Investigated_Player.username} is a member of the ${factionName} faction.`;

      const el_presidente_intel = el_presidente?.intel;
      if (!el_presidente) {
        throw new Error("can't access el_presidente");
      }
      if (!el_presidente_intel) {
        throw new Error("can't access el_presidente_intel");
      }

      const new_el_presidente_intel = [...el_presidente_intel, intel_nugget];
      const osint_nugget =
        found_match.president_role_name +
        " " +
        username +
        " investigated the faction loyalties of " +
        target;

      const osint_intel_array = found_match.open_source_intel;

      if (!osint_intel_array) {
        throw new Error(
          " can't access  osint_intel_array for Investigated_Player executive power",
        );
      }
      if (!new_el_presidente_intel) {
        throw new Error(
          " can't access  new_el_presidente_intel for Investigated_Player executive power",
        );
      }
      const new_osint_intel_array = [...osint_intel_array, osint_nugget];

      const updated_match = await db
        .update(match)
        .set({ open_source_intel: new_osint_intel_array })
        .where(eq(match.id, found_match.id));
      const updated_el_presidente = await db
        .update(player)
        .set({ intel: new_el_presidente_intel })
        .where(
          and(eq(player.match, found_match.id), eq(player.username, username)),
        );
    } else if (power === "Execution") {
      console.log("attemping to execute", target);

      const alive_players = found_match.alive_players;

      const alive_players_after_murder = alive_players.filter(
        (player) => player !== target,
      );

      console.log("alive_players_after_murder", alive_players_after_murder);

      const osint_nugget =
        found_match.president_role_name +
        " " +
        username +
        " executed " +
        target;

      const osint_intel_array = found_match.open_source_intel;

      if (!osint_intel_array) {
        throw new Error(
          " can't access  osint_intel_array for Investigated_Player executive power",
        );
      }

      const new_osint_intel_array = [...osint_intel_array, osint_nugget];
      const updated_execution_match = await db
        .update(match)
        .set({
          alive_players: alive_players_after_murder,
          open_source_intel: new_osint_intel_array,
        })
        .where(eq(match.id, found_match.id))
        .returning();

      const actual_updated_execution_match = updated_execution_match[0];
      if (!actual_updated_execution_match) {
        throw new Error(
          "Can't access actual_updated_execution_match in execution submethod ",
        );
      }

      const game_is_over = await victory_check(
        db,
        actual_updated_execution_match,
      );
      if (game_is_over === false) {
        await set_up_next_election(db, actual_updated_execution_match);
      }
    } else if (power === "SpecialElection") {
      const osint_nugget =
        found_match.president_role_name +
        " " +
        username +
        " declared a special election and nominated his successor: " +
        target;

      const osint_intel_array = found_match.open_source_intel;

      if (!osint_intel_array) {
        throw new Error(
          " can't access  osint_intel_array for Investigated_Player executive power",
        );
      }

      const new_osint_intel_array = [...osint_intel_array, osint_nugget];
      const updated_match = await db
        .update(match)
        .set({ open_source_intel: new_osint_intel_array })
        .where(eq(match.id, found_match.id));

      await set_up_next_election(db, found_match, true, target);
      return 0;
    }
  } else {
    throw new Error("You went to the wrong neighborhood");
  }
  // await set_up_next_election(db, found_match);

  return 0;
}

export async function tally_vote_results(
  db: Transaction,
  election_id: string,
  alive_players: string[],
) {
  console.log("attempting to tally_vote_results");
  const found_election = await db.query.election.findFirst({
    where: eq(election?.id, election_id),
    with: { votes: true, match_struct: true },
  });
  const election_votes = found_election?.votes;
  if (found_election && found_election.votes.length > 0) {
    const yay_votes = election_votes?.filter(
      (vote) => vote.voting_yes === true,
    );

    const nay_votes = election_votes?.filter(
      (vote) => vote.voting_yes === false,
    );
    // console.log("here go the checks");
    // if (nay_votes) {
    //   console.log("nay_votes exists length", nay_votes.length);
    // }
    // if (yay_votes) {
    //   console.log("yay_votes exists length", yay_votes.length);
    // }
    // if (yay_votes) {
    //   console.log("yay_votes exists", yay_votes);
    // }
    // if (yay_votes) {
    //   console.log("yay_votes exists", yay_votes);
    // }
    // console.log(
    //   "yay votes outnumber nay?",
    //   yay_votes!.length > nay_votes!.length,
    // );

    if (yay_votes && nay_votes && yay_votes?.length >= nay_votes?.length) {
      console.log("election passes");
      const updated_election = await db
        .update(election)
        .set({ is_over: true, passed: true })
        .where(eq(election.id, election_id))
        .returning();

      const actual_updated_election = updated_election[0];
      if (!actual_updated_election) {
        throw Error("Error in updating election");
      }
      console.log("found_election.match", found_election.match);
      const match_with_Deck = await db.query.match.findFirst({
        where: eq(match.id, found_election.match),
        columns: { id: true, deck: true, last_President: true },
      });

      console.log("match_with_Deck", match_with_Deck);

      if (!match_with_Deck?.deck[0]) {
        throw new Error("Can't access match_with_Deck?.deck[0]");
      }
      if (!match_with_Deck?.deck[1]) {
        throw new Error("Can't access match_with_Deck?.deck[0]");
      }
      if (!match_with_Deck?.deck[2]) {
        throw new Error("Can't access match_with_Deck?.deck[0]");
      }

      const top_of_the_deck = [
        match_with_Deck?.deck[0],
        match_with_Deck?.deck[1],
        match_with_Deck?.deck[2],
      ];

      if (!top_of_the_deck) {
        throw new Error("can't pull 3 cards from top_of_the_deck");
      }
      const new_deck = match_with_Deck?.deck.slice(3);
      const updated_match = await db
        .update(match)
        .set({
          chancellor: actual_updated_election?.chancellor_candidate,
          last_Chancellor: actual_updated_election.chancellor_candidate,
          last_President: actual_updated_election.president_candidate,
          last_regular_president: actual_updated_election.is_special_election
            ? match_with_Deck.last_President
            : actual_updated_election.president_candidate,
          stage: stageEnum.enumValues[2],
          substage: substageEnum.enumValues[4],
          waiting_on: actual_updated_election.president_candidate,
          failed_elections: 0,
          deck: new_deck,
          president_laws_pile: top_of_the_deck,
        })
        .where(eq(match.id, actual_updated_election.match))
        .returning();

      if (!updated_match[0]) {
        throw new Error("can't access updated_match[0]");
      }

      const eot_cleanup_step_1 = await eot_cleanup_step(db, updated_match[0]);
    } else if (
      yay_votes &&
      nay_votes &&
      yay_votes?.length < nay_votes?.length
    ) {
      console.log("election fails");
      const updated_election = await db
        .update(election)
        .set({ is_over: true, passed: false })
        .where(eq(election.id, election_id))
        .returning();

      const actual_updated_election = updated_election[0];
      if (!actual_updated_election) {
        throw Error("Error in updating election");
      }

      const next_president = get_next_president(
        actual_updated_election.president_candidate,
        alive_players,
      );

      const failed_elections = found_election.match_struct.failed_elections + 1;

      const commit_anarchy = failed_elections === 3;

      const updated_match = await db
        .update(match)
        .set({
          waiting_on: next_president,
          president: next_president,
          chancellor: "",
          stage: stageEnum.enumValues[1],
          substage: substageEnum.enumValues[1],
          failed_elections: commit_anarchy ? 0 : 3,
          last_Chancellor: commit_anarchy
            ? ""
            : found_election.match_struct.last_Chancellor,
          last_President: commit_anarchy
            ? ""
            : found_election.match_struct.last_President,
          last_regular_president: commit_anarchy
            ? ""
            : found_election.match_struct.last_regular_president,
        })
        .where(eq(match.id, actual_updated_election.id))
        .returning();

      const actual_updated_match = updated_match[0];

      if (commit_anarchy) {
        const deck = found_election.match_struct.deck;

        const first_policy = deck.shift();

        const is_liberal = first_policy === "liberal" ? true : false;

        if (is_liberal && actual_updated_match) {
          const updated_match = await db
            .update(match)
            .set({
              liberal_laws: actual_updated_match.liberal_laws + 1,
              deck: deck,
            })
            .where(eq(match.id, actual_updated_match.id))
            .returning();
        } else if (!is_liberal && actual_updated_match) {
          const updated_match = await db
            .update(match)
            .set({
              fascist_laws: actual_updated_match.fascist_laws + 1,
              deck: deck,
            })
            .where(eq(match.id, actual_updated_match.id))
            .returning();
        }
      }

      if (!actual_updated_match) {
        throw new Error("can't access actual_updated_match in order to");
      }

      const game_is_over = await victory_check(db, actual_updated_match);
      if (game_is_over === false) {
        await set_up_next_election(db, actual_updated_match);
      }

      const cleanup = await eot_cleanup_step(db, found_election.match_struct);
    }
  }
  return 0;
}

export async function vote_in_election(
  db: Transaction,
  match_id: string,
  match_password: string,
  username: string,
  player_password: string,
  voting_yes: boolean,
  president_candidate: string,
  chancellor_candidate: string,
) {
  const info = await get_info_on_game(
    db,
    match_id,
    username,
    match_password,
    player_password,
    true,
  );

  if (info.is_present_in_match && info.is_present_in_match.is_alive === false) {
    throw new Error("It is forbidden to vote in elections from the afterlife");
  }

  // return await db.transaction(
  //   async (db) => {
  const locked_election = await db
    .select()
    .from(election)
    .where(and(eq(election.match, match_id), eq(election.is_over, false)))
    .for("update")
    .limit(1);

  // console.error(
  //   "ARGUMENTS",
  //   match_id,
  //   match_password,
  //   username,
  //   player_password,
  //   voting_yes,
  //   president_candidate,
  //   chancellor_candidate,
  // );
  if (
    locked_election[0] &&
    president_candidate === locked_election[0].president_candidate &&
    chancellor_candidate === locked_election[0].chancellor_candidate &&
    locked_election[0].voting_list.includes(username)
  ) {
    if (!locked_election[0]) {
      throw Error("Election doesn't exist");
    }
    const casted_vote = await db
      .insert(vote)
      .values({
        election: locked_election[0].id,
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
        playerID: info.this_player!.id!,
        username: username,
        voting_yes: voting_yes,
      })
      .returning();

    const updated_voting_list = locked_election[0].voting_list.filter(
      (name) => name !== username,
    );

    const spray_voter_with_UV_fluid = await db
      .update(election)
      .set({ voting_list: updated_voting_list })
      .where(
        and(
          eq(election.id, info.ongoingElection!.id),
          eq(election.is_over, false),
          eq(election.match, match_id),
        ),
      )
      .returning();

    const actual_spray_voter_with_UV_fluid = spray_voter_with_UV_fluid[0];

    const alive_players = info.player_order;

    const returning_parcel = {
      alive_players: alive_players,
      vote: casted_vote[0],
      updated_voting_list: spray_voter_with_UV_fluid[0]?.voting_list,
      election_id: locked_election[0].id,
    };

    const voting_list = returning_parcel.updated_voting_list;
    if (!voting_list) {
      throw Error("Can't access tally_vote_results voting_list");
    }
    if (voting_list?.length === 0) {
      await tally_vote_results(
        db,
        returning_parcel.election_id,
        returning_parcel.alive_players,
      );
    }

    return returning_parcel;
  } else {
    {
      throw new Error("Player not eligible to vote in this election");
    }
  }
  //   },

  //   {
  //     isolationLevel: "serializable",
  //     accessMode: "read write",
  //     deferrable: true,
  //   },
  // );
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
    // console.log("arguments", password, playerName);
    // console.log("is_present_player", player);

    const comparison = await bcrypt.compare(
      password.trim(),
      player.hashed_password,
    );
    if (!found_match.alive_players) {
      throw Error("all players seem to be dead!");
    }
    const is_alive = is_player_alive(
      player.username,
      found_match.alive_players,
    );

    if (player.username === playerName && comparison === true) {
      return {
        ispresent: true,
        isOwner: found_match.creator_owner === playerName ? true : false,
        isFascist: player.is_fascist,
        isHitler: player.is_hitler,
        usernames: usernamesArray,
        player: player,
        is_alive: is_alive,
      };
    } else if (player.username === playerName && comparison !== true) {
      return null;
    }
  }

  return null;
}

export async function join_game(
  db: Transaction,
  match_id: string,
  player_name: string,
  password: string,
  match_password: string,
) {
  // return await db.transaction(
  //   async (db) => {
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
  } else {
    if (
      (found_match.has_started && isPresent?.ispresent === false) ||
      found_match.isOver
    ) {
      throw new Error(
        "It is impossible to join the match at this time, it has either already started and/or finished",
      );
    }
    // if (isPresent?.is_alive === false) {
    //   throw new Error("It is forbidden to start games from the afterlife");
    // }

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
  }

  // },
  // {
  //   isolationLevel: "read committed",
  //   accessMode: "read write",
  //   deferrable: true,
  // },
  // );
}

export async function seed_players_into_existing_match(
  db: Transaction,
  match_id: string,
  // db: Transaction,
) {
  const playerUsernames = ["testuser1", "testuser2", "testuser3", "testuser4"];
  const playerPassword = "password";
  const empty_password = "";

  for (const username of playerUsernames) {
    const user_id = `uid-${username}`;
    const player_id = `player-${username}`;
    const hashed = await hashPassword(playerPassword);
    const empty_hashed_password = await hashPassword(empty_password);
    // Upsert actual user
    await db
      .insert(actual_users)
      .values({
        username: username,
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
        username: username,
        hashed_password: empty_hashed_password,
        match: match_id,
      })
      .onConflictDoUpdate({
        target: player.id,
        set: {
          hashed_password: empty_hashed_password,
          match: match_id,
        },
      });
  }

  return { match_id, message: "Test players seeded into match" };
}

export async function create_game(
  db: Transaction,
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
    db,
    new_match.id,
    username,
    player_password,
    matchpassword,
  );
  const IS_PRODUCTION = process.env.IS_PRODUCTION;
  if (IS_PRODUCTION === "false") {
    console.log("simulating test environment and");
    await seed_players_into_existing_match(db, new_match.id);
  }

  return { new_match, create_user_result }; // Return the created match

  // return await db.transaction(
  //   async (db) => {
  //

  // // Insert the new match and return it
  // const new_match_return = await db
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
      // eq(match.isOver, false),
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
