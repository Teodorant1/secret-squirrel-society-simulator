import { eq } from "drizzle-orm";
import { hashPassword, sleep } from "@/random-functions/backend/backend1";
import { z } from "zod";
import {
  start_game,
  get_info_on_game,
  Check_if_player_is_present_in_match,
  join_game,
  create_game,
} from "@/random-functions/backend/backend1";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { actual_users } from "@/server/db/schema";

export const MatchRouter = createTRPCRouter({
  get_data_on_match: protectedProcedure
    .input(
      z.object({
        match_id: z.string(),
        player_id: z.string(),
        match_password: z.string(),
        player_password: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const info = await get_info_on_game(
          input.match_id,
          input.player_id,
          input.match_password,
          input.player_password,
        );

        return {
          error: false,
          error_description: null,
          game_info: info,
        };
      } catch (error) {
        console.error("Error in register mutation:", error);
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
  register: protectedProcedure
    .input(
      z.object({
        username: z.string(),
        email: z.string(),
        password: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const existing_user = await ctx.db.query.actual_users.findFirst({
          where: eq(actual_users.email, input.email.trim()),
        });

        if (existing_user) {
          return {
            error: true,
            error_description:
              "Email or username is taken, please pick something else.",
            user: null,
          };
        }

        const hashedPassword = await hashPassword(input.password.trim());

        const user = await ctx.db
          .insert(actual_users)
          .values({
            username: input.username.trim(),
            email: input.email.trim(),
            password: hashedPassword.trim(),
          })
          .returning();

        await sleep(1);

        return {
          user,
          error: false,
          error_description: null,
        };
      } catch (error) {
        console.error("Error in register mutation:", error);
        if (error instanceof Error) {
          console.log(error.message);
          return {
            error: true,
            error_description: error.message,
            user: null,
          };
        }
        return {
          error: true,
          error_description: "Something went wrong. Please try again.",
          user: null,
        };
      }
    }),
});
