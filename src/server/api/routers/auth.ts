import { eq } from "drizzle-orm";
import { hashPassword, sleep } from "@/random-functions/backend/backend1";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { actual_users } from "@/server/db/schema";

export const authRouter = createTRPCRouter({
  register: publicProcedure
    .input(
      z.object({
        username: z.string().min(2),
        email: z.string().min(2).email(),
        password: z.string().min(2),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        if (input.password.length < 2) {
          throw new Error("Password too short");
        }

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
