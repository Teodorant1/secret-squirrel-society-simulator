import {
  GetAllRelevantGames,
  nominate_chancellor,
  tally_vote_results,
} from "@/random-functions/backend/backend1";
import { z } from "zod";
import {
  start_game,
  get_info_on_game,
  join_game,
  create_game,
  vote_in_election,
} from "@/random-functions/backend/backend1";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const MatchRouter = createTRPCRouter({
  vote_in_elections: protectedProcedure
    .input(
      z.object({
        match_id: z.string(),
        match_password: z.string(),
        player_password: z.string(),
        president_candidate: z.string(),
        chancellor_candidate: z.string(),
        voting_yes: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // const game = await start_game(input.match_id, input.player_id);

        const election_result = await vote_in_election(
          input.match_id,
          input.match_password,
          ctx.session.user.username,
          input.player_password,
          input.voting_yes,
          input.president_candidate,
          input.chancellor_candidate,
        );

        const voting_list = election_result.updated_voting_list;
        if (!voting_list) {
          throw Error("Can't access tally_vote_results voting_list");
        }
        if (voting_list?.length === 0) {
          await tally_vote_results(
            election_result.election_id,
            election_result.alive_players,
          );
        }

        return {
          election_result: "election_result",
          error: false,
          error_description: null,
        };
      } catch (error) {
        console.error("Error in vote_in_elections mutation:", error);
        if (error instanceof Error) {
          console.log(error.message);
          return {
            error: true,
            error_description: error.message,
            election_result: null,
          };
        }
        return {
          error: true,
          error_description: "Something went wrong. Please try again.",
          election_result: null,
        };
      }
    }),
  nominate_chancellor_candidate: protectedProcedure
    .input(
      z.object({
        match_id: z.string(),
        match_password: z.string(),
        player_password: z.string(),
        candidate: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // const game = await start_game(input.match_id, input.player_id);

        const nominated_chancellor = await nominate_chancellor(
          input.match_id,
          ctx.session.user.username,
          input.match_password,
          input.player_password,
          input.candidate,
        );

        return {
          nominated_chancellor: nominated_chancellor,
          error: false,
          error_description: null,
        };
      } catch (error) {
        console.error(
          "Error in nominate_chancellor_candidate mutation:",
          error,
        );
        if (error instanceof Error) {
          console.log(error.message);
          return {
            error: true,
            error_description: error.message,
            nominated_chancellor: null,
          };
        }
        return {
          error: true,
          error_description: "Something went wrong. Please try again.",
          nominated_chancellor: null,
        };
      }
    }),
  get_data_on_match: protectedProcedure
    .input(
      z.object({
        match_id: z.string(),
        match_password: z.string(),
        player_password: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const info = await get_info_on_game(
          input.match_id,
          ctx.session.user.username,
          input.match_password,
          input.player_password,
        );
        const current_date = new Date();
        console.error("current_date", current_date);

        return {
          error: false,
          error_description: null,
          game_info: info,
        };
      } catch (error) {
        console.error("Error in get_data_on_match mutation:", error);
        if (error instanceof Error) {
          console.log(error.message);
          return {
            error: true,
            error_description: error.message,
            game_info: null,
          };
        }
      }
      return {
        error: true,
        error_description: "Something went wrong. Please try again.",
        game_info: null,
      };
    }),
  start_game: protectedProcedure
    .input(
      z.object({
        match_id: z.string(),
        match_password: z.string(),
        password: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // const game = await start_game(input.match_id, input.player_id);
        const game = await start_game(
          input.match_id,
          ctx.session.user.username,
          input.match_password,
          input.password,
        );

        return {
          game,
          error: false,
          error_description: null,
        };
      } catch (error) {
        console.error("Error in start_game mutation:", error);
        if (error instanceof Error) {
          console.log(error.message);
          return {
            error: true,
            error_description: error.message,
            game: null,
          };
        }
        return {
          error: true,
          error_description: "Something went wrong. Please try again.",
          game: null,
        };
      }
    }),
  create_game: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        player_password: z.string(),
        liberal_faction_name: z.string(),
        fascist_faction_name: z.string(),
        president_role_name: z.string(),
        chancellor_role_name: z.string(),
        hitler_role_name: z.string(),
        liberal_faction_image_url: z.string(),
        fascist_faction_image_url: z.string(),
        president_role_image_url: z.string(),
        chancellor_role_image_url: z.string(),
        hitler_role_image_url: z.string(),
        password: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const game = await create_game(
          input.name,
          ctx.session.user.username,
          input.player_password,
          input.liberal_faction_name,
          input.fascist_faction_name,
          input.president_role_name,
          input.chancellor_role_name,
          input.hitler_role_name,
          input.liberal_faction_image_url,
          input.fascist_faction_image_url,
          input.president_role_image_url,
          input.chancellor_role_image_url,
          input.hitler_role_image_url,
          input.password,
        );

        return {
          game: game,
          error: false,
          error_description: null,
        };
      } catch (error) {
        console.error("Error in create game mutation:", error);
        if (error instanceof Error) {
          console.log(error.message);
          return {
            error: true,
            error_description: error.message,
            game: null,
          };
        }
        return {
          error: true,
          error_description: "Something went wrong. Please try again.",
          game: null,
        };
      }
    }),
  join_game: protectedProcedure
    .input(
      z.object({
        match_id: z.string(),
        password: z.string(),
        match_password: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const game = await join_game(
          input.match_id,
          ctx.session.user.username,
          input.password,
          input.match_password,
        );

        return {
          game: game.found_match.id,
          error: false,
          error_description: null,
        };
      } catch (error) {
        console.error("Error in join game mutation:", error);
        if (error instanceof Error) {
          console.log(error.message);
          return {
            error: true,
            error_description: error.message,
            game: null,
          };
        }
        return {
          error: true,
          error_description: "Something went wrong. Please try again.",
          game: null,
        };
      }
    }),

  GetAvailableGames: protectedProcedure.query(async ({ ctx, input }) => {
    try {
      const AvailableGames = await GetAllRelevantGames(
        ctx.session.user.username,
      );

      // const AvailableGames = [
      //   {
      //     name: "Spyfall Showdown",
      //     id: "game_12345",
      //     creator_owner: "user_1",
      //     players: [
      //       { id: "player_1", username: "AgentX" },
      //       { id: "player_2", username: "ShadowFox" },
      //     ],
      //   },
      //   {
      //     name: "Undercover Heist",
      //     id: "game_67890",
      //     creator_owner: "user_2",
      //     players: [
      //       { id: "player_3", username: "SilentWolf" },
      //       { id: "player_4", username: "NightOwl" },
      //       { id: "player_5", username: "GhostCat" },
      //     ],
      //   },
      // ];

      return {
        AvailableGames: AvailableGames,
        error: false,
        error_description: null,
      };
    } catch (error) {
      console.error("Error in GetAvailableGames mutation:", error);
      if (error instanceof Error) {
        console.log(error.message);
        return {
          error: true,
          error_description: error.message,
          AvailableGames: null,
        };
      }
      return {
        error: true,
        error_description: "Something went wrong. Please try again.",
        AvailableGames: null,
      };
    }
  }),
});
