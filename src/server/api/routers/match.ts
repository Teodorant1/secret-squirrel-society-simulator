import { z } from "zod";
import {
  GetAllRelevantGames,
  nominate_chancellor,
  start_game,
  get_info_on_game,
  join_game,
  create_game,
  vote_in_election,
  discard_policy,
  handle_special_power,
  handle_veto,
  test_handle_special_power,
} from "@/random-functions/backend/backend1";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const MatchRouter = createTRPCRouter({
  // test_handle_special_power: protectedProcedure
  //   .input(
  //     z.object({
  //       match_id: z.string(),
  //       match_password: z.string(),
  //       player_password: z.string(),
  //       target: z.string(),
  //       special_power: z.string(),
  //     }),
  //   )
  //   .mutation(async ({ ctx, input }) => {
  //     try {
  //       // const game = await start_game(input.match_id, input.player_id);

  //       const result = await ctx.db.transaction(async (tx) => {
  //         return await test_handle_special_power(
  //           tx,
  //           input.special_power,
  //           input.match_id,
  //           ctx.session.user.username,
  //           input.target,
  //           input.player_password,
  //           input.match_password,
  //         );
  //       });

  //       return {
  //         result: result,
  //         error: false,
  //         error_description: null,
  //       };
  //     } catch (error) {
  //       console.error("Error in discard_policy mutation:", error);
  //       if (error instanceof Error) {
  //         console.log(error.message);
  //         return {
  //           error: true,
  //           error_description: error.message,
  //           result: null,
  //         };
  //       }
  //       return {
  //         error: true,
  //         error_description: "Something went wrong. Please try again.",
  //         result: null,
  //       };
  //     }
  //   }),
  discard_policy: protectedProcedure
    .input(
      z.object({
        match_id: z.string(),
        match_password: z.string(),
        player_password: z.string(),
        index: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // const game = await start_game(input.match_id, input.player_id);

        const discard_policy_result = await ctx.db.transaction(async (tx) => {
          return await discard_policy(
            tx,
            input.match_id,
            ctx.session.user.username,
            input.match_password,
            input.player_password,
            input.index,
          );
        });

        return {
          discard_policy_result: discard_policy_result,
          error: false,
          error_description: null,
        };
      } catch (error) {
        console.error("Error in discard_policy mutation:", error);
        if (error instanceof Error) {
          console.log(error.message);
          return {
            error: true,
            error_description: error.message,
            discard_policy_result: null,
          };
        }
        return {
          error: true,
          error_description: "Something went wrong. Please try again.",
          discard_policy_result: null,
        };
      }
    }),
  handle_special_power: protectedProcedure
    .input(
      z.object({
        match_id: z.string(),
        match_password: z.string(),
        player_password: z.string(),
        target: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // const game = await start_game(input.match_id, input.player_id);

        const handled_special_power = await ctx.db.transaction(async (tx) => {
          return await handle_special_power(
            tx,
            input.match_id,
            ctx.session.user.username,
            input.target,
            input.player_password,
            input.match_password,
          );
        });

        return {
          handled_special_power: handled_special_power,
          error: false,
          error_description: null,
        };
      } catch (error) {
        console.error("Error in handle_special_power mutation:", error);
        if (error instanceof Error) {
          console.log(error.message);
          return {
            error: true,
            error_description: error.message,
            handled_special_power: null,
          };
        }
        return {
          error: true,
          error_description: "Something went wrong. Please try again.",
          handled_special_power: null,
        };
      }
    }),
  handle_veto: protectedProcedure
    .input(
      z.object({
        match_id: z.string(),
        match_password: z.string(),
        player_password: z.string(),
        voting_yes: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // const game = await start_game(input.match_id, input.player_id);

        const veto_result = await ctx.db.transaction(async (tx) => {
          return await handle_veto(
            tx,
            input.match_id,
            input.match_password,
            ctx.session.user.username,
            input.player_password,
            input.voting_yes,
          );
        });

        return {
          veto_result: veto_result,
          error: false,
          error_description: null,
        };
      } catch (error) {
        console.error("Error in handle_veto mutation:", error);
        if (error instanceof Error) {
          console.log(error.message);
          return {
            error: true,
            error_description: error.message,
            veto_result: null,
          };
        }
        return {
          error: true,
          error_description: "Something went wrong. Please try again.",
          veto_result: null,
        };
      }
    }),
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

        const election_result = await ctx.db.transaction(
          async (tx) => {
            return await vote_in_election(
              tx,
              input.match_id,
              input.match_password,
              ctx.session.user.username,
              input.player_password,
              input.voting_yes,
              input.president_candidate,
              input.chancellor_candidate,
            );
          },
          {
            isolationLevel: "serializable",
            accessMode: "read write",
            deferrable: true,
          },
        );

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

        const nominated_chancellor = await ctx.db.transaction(async (tx) => {
          return await nominate_chancellor(
            tx,
            input.match_id,
            ctx.session.user.username,
            input.match_password,
            input.player_password,
            input.candidate,
          );
        });

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
        const info = await ctx.db.transaction(async (tx) => {
          const innerinfo = await get_info_on_game(
            tx,
            input.match_id,
            ctx.session.user.username,
            input.match_password,
            input.player_password,
          );

          return innerinfo;
        });

        // const current_date = new Date();
        // console.error("current_date", current_date);

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
        const game = await ctx.db.transaction(async (tx) => {
          return await start_game(
            tx,
            input.match_id,
            ctx.session.user.username,
            input.match_password,
            input.password,
          );
        });

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
        const game = await ctx.db.transaction(async (tx) => {
          return await create_game(
            tx,
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
        });
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
        const game = await ctx.db.transaction(async (tx) => {
          return await join_game(
            tx,
            input.match_id,
            ctx.session.user.username,
            input.password,
            input.match_password,
          );
        });

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
