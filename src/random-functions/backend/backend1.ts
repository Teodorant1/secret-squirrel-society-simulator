import bcrypt from "bcrypt";
import { db } from "@/server/db";
import { election, match, player, vote } from "@/server/db/schema";
import { eq, and, desc } from "drizzle-orm";

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
  { policy: 1, action: null },
  { policy: 2, action: null },
  { policy: 3, action: "PeekNextThreePolicies" },
  { policy: 4, action: "Execution" },
  { policy: 5, action: "Execution" },
  { policy: 6, action: "Fascist Victory!" },
];

// Fascist track for 7-8 players
export const fascistTrack_2 = [
  { policy: 1, action: null },
  { policy: 2, action: "InvestigatePlayer" },
  { policy: 3, action: "SpecialElection" },
  { policy: 4, action: "Execution" },
  { policy: 5, action: "Execution" },
  { policy: 6, action: "Fascist Victory!" },
];

// Fascist track for 9-10 players
export const fascistTrack_3 = [
  { policy: 1, action: null },
  { policy: 2, action: "InvestigatePlayer" },
  { policy: 3, action: "PolicyPeek" },
  { policy: 4, action: "Execution" },
  { policy: 5, action: "Execution" },
  { policy: 6, action: "Fascist Victory!" },
];

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
        fascist_numbers: 2,
        hitler_has_intel: true,
      };
    case 6:
      return {
        fascist_track: fascistTrack_1,
        fascist_numbers: 2,
        hitler_has_intel: true,
      };
    case 7:
      return {
        fascist_track: fascistTrack_2,
        fascist_numbers: 3,
        hitler_has_intel: false,
      };
    case 8:
      return {
        fascist_track: fascistTrack_2,
        fascist_numbers: 3,
        hitler_has_intel: false,
      };
    case 9:
      return {
        fascist_track: fascistTrack_3,
        fascist_numbers: 4,
        hitler_has_intel: false,
      };
    default:
      return {
        fascist_track: fascistTrack_3,
        fascist_numbers: 4,
        hitler_has_intel: false,
      };
  }
}

export async function start_game(
  match_id: string,
  playerID: string,
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
          "It is impossible to join the match at this time, it has either already started and/or finished",
        );
      }

      if (found_match.creator_owner !== playerID) {
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

      const new_players = shuffleArray(players);
      const just_the_names: string[] = [];

      if (!new_players.length || !new_players) {
        throw new Error("No players found.");
      }
      for (let i = 0; i < new_players.length && i < 10; i++) {
        console.log(i);
        just_the_names.push(new_players[i]!.username);
      }
      const new_just_the_names = shuffleArray(just_the_names);
      const shuffled_policies = shuffleArray(policies);

      for (let i = 0; i < config.fascist_numbers; i++) {
        if (i === 0) {
          await tx
            .update(match)
            .set({
              president: new_just_the_names[0],
              players_array: new_just_the_names,
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

      const hilter_is_intel =
        current_match?.hitler + " is " + current_match?.hitler_role_name;

      ideology_intel_array.push(hilter_is_intel);
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
              eq(player.is_hitler, true),
              eq(player.match, current_match.id),
            ),
          );
      }
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
  playerID: string,
  password: string,
  player_password: string,
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
          players: true,
        },
      });
      if (!found_match) {
        throw new Error("Match not found.");
      }
      if (found_match.password !== password) {
        throw new Error("Wrong Password, ACCESS DENIED!");
      }
      const players = found_match.players;

      const is_present_in_match = Check_if_player_is_present_in_match(
        player_password,
        playerID,
        players,
      );
      if (!is_present_in_match?.ispresent) {
        throw new Error("You are not present in the match!");
      }

      // const intel = {
      //   hitler: found_match.hitler,
      // };
      const state = {
        id: found_match.id,
        name: found_match.name,
        creator_owner: found_match.creator_owner,
        password: found_match.password,
        failed_elections: found_match.failed_elections,
        liberal_laws: found_match.liberal_laws,
        fascist_laws: found_match.fascist_laws,
        president: found_match.president,
        chancellor: found_match.chancellor,
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
      };

      return state;
    },
    {
      isolationLevel: "read committed",
      accessMode: "read write",
      deferrable: true,
    },
  );
}

export function Check_if_player_is_present_in_match(
  password: string,
  playerName: string,
  all_players: {
    match: string;
    id: string;
    username: string;
    hashed_password: string;
    score: number;
    is_fascist: boolean;
    is_hitler: boolean;
    party: string | null;
    role: string | null;
    intel: string[];
    joined_at: Date;
  }[],
) {
  for (const player of all_players) {
    if (player.username === playerName && player.hashed_password === password) {
      return {
        ispresent: true,
        isFascist: player.is_fascist,
        isHitler: player.is_hitler,
      };
    }
  }

  return null;
}

export async function join_game(
  match_id: string,
  player_name: string,
  password: string,
) {
  return await db.transaction(
    async (tx) => {
      const locked_match = await tx
        .select()
        .from(match)
        .where(eq(match.id, match_id))
        .for("update");

      // Fetch the match with eager-loaded relations and lock it for update
      const found_match = await tx.query.match.findFirst({
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
      if (found_match.has_started || found_match.isOver) {
        throw new Error(
          "It is impossible to join the match at this time, it has either already started and/or finished",
        );
      }

      const players = found_match.players || [];
      if (players.length >= 9) {
        throw new Error("Match is at full capacity and cannot be joined");
      }

      const hashed_password = await hashPassword(password);

      const new_player = await tx
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
        found_match,
        players,
        singular_new_player,
      };
    },
    {
      isolationLevel: "read committed",
      accessMode: "read write",
      deferrable: true,
    },
  );
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
  password: string,
) {
  return await db.transaction(
    async (tx) => {
      // Insert the new match and return it
      const new_match_return = await tx
        .insert(match)
        .values({
          name,
          creator_owner: username,
          password,
          liberal_faction_name,
          fascist_faction_name,
          president_role_name,
          chancellor_role_name,
          hitler_role_name,
          liberal_faction_image_url,
          fascist_faction_image_url,
          president_role_image_url,
          chancellor_role_image_url,
        })
        .returning();

      const new_match = new_match_return[0];

      if (!new_match) {
        throw new Error("Failed to create match");
      }

      const create_user_result = await join_game(
        new_match.id,
        username,
        player_password,
      );

      return { new_match, create_user_result }; // Return the created match
    },
    {
      isolationLevel: "read committed",
      accessMode: "read write",
      deferrable: true,
    },
  );
}
