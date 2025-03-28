import { relations, sql } from "drizzle-orm";
import {
  integer,
  pgTableCreator,
  timestamp,
  varchar,
  boolean,
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator(
  (name) => `secret-squirrel-society-simulator_${name}`,
);

export const cronjob_Runs = createTable("cronjob_Runs", {
  runDate: timestamp("runDate", { withTimezone: true }).primaryKey().notNull(),
});

export const match = createTable("match", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 255 }),
  creator_owner: varchar("creator_owner", { length: 255 })
    .notNull()
    .default(""),
  password: varchar("password", { length: 255 }),
  players_array: varchar("players", { length: 3000 })
    .array()
    .notNull()
    .default(sql`'{}'::text[]`),
  // fascists: varchar("fascists", { length: 3000 })
  //   .array()
  //   .notNull()
  //   .default(sql`'{}'::text[]`),
  // liberals: varchar("liberals", { length: 3000 })
  //   .array()
  //   .notNull()
  //   .default(sql`'{}'::text[]`),

  deck: varchar("deck", { length: 3000 })
    .array()
    .notNull()
    .default(sql`'{}'::text[]`),

  discard_pile: varchar("deck", { length: 3000 })
    .array()
    .notNull()
    .default(sql`'{}'::text[]`),

  failed_elections: integer("failed_elections").notNull().default(0),
  liberal_laws: integer("liberal_laws").notNull().default(0),
  fascist_laws: integer("fascist_laws").notNull().default(0),
  president: varchar("president", { length: 2000 }).notNull().default(""),
  chancellor: varchar("chancellor", { length: 2000 }).notNull().default(""),
  veto_power_unlocked: boolean("veto_power_unlocked").default(false).notNull(),
  liberal_faction_name: varchar("liberal_faction_name", { length: 2000 })
    .notNull()
    .default("liberal"),
  fascist_faction_name: varchar("fascist_faction_name", { length: 2000 })
    .notNull()
    .default("fascist"),
  president_role_name: varchar("president_role_name", { length: 2000 })
    .notNull()
    .default("president"),
  chancellor_role_name: varchar("chancellor_role_name", { length: 2000 })
    .notNull()
    .default("chancellor"),
  hitler_role_name: varchar("hitler_role_name", { length: 2000 }).notNull(),

  liberal_faction_image_url: varchar("liberal_faction_image_url", {
    length: 2000,
  })
    .notNull()
    .default("0"),
  fascist_faction_image_url: varchar("fascist_faction_image_url", {
    length: 2000,
  })
    .notNull()
    .default("0"),
  president_role_image_url: varchar("president_role_image_url", {
    length: 2000,
  })
    .notNull()
    .default(""),
  chancellor_role_image_url: varchar("chancellor_role_image_url", {
    length: 2000,
  })
    .notNull()
    .default(""),
  hitler_role_image_url: varchar("hitler_role_image_url", { length: 2000 }),

  stage: varchar("stage", { length: 2000 }).notNull().default("lobby"),
  substage: varchar("substage", { length: 2000 }).notNull().default("lobby"),
  waiting_on: varchar("waiting_on", { length: 2000 }).notNull().default("All"),

  hitler: varchar("hitler", { length: 2000 }).notNull().default(""),
  isOver: boolean("isOver").notNull().default(false),
  hitler_has_intel: boolean("hitler_has_intel").notNull().default(false),
  result: varchar("result", { length: 2000 }).default("TBA"),
  scheduled_for_deletion: boolean("scheduled_for_deletion").default(false),
  has_started: boolean("has_started").default(false),
});

export const election = createTable("election", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  president_candidate: varchar("president", { length: 2000 })
    .notNull()
    .default("TBA"),
  chancellor_candidate: varchar("chancellor", { length: 2000 })
    .notNull()
    .default("TBA"),
  // votes: varchar("votes", { length: 2000 }).notNull().default(0),
  // votes_needed: integer("votes").notNull().default(0),
  match: varchar("match", { length: 255 })
    .notNull()
    .references(() => match.id, { onDelete: "cascade", onUpdate: "cascade" }),
  created_at: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const vote = createTable("vote", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  username: varchar("username", { length: 255 })
    .notNull()
    .references(() => player.username, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  voting_yes: boolean("voting_yes"),
  election: varchar("election", { length: 255 })
    .notNull()
    .references(() => election.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
});

export const player = createTable("player", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  username: varchar("username", { length: 255 })
    .notNull()
    .unique()
    .references(() => actual_users.username, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  hashed_password: varchar("hashed_password", { length: 255 }).notNull(),
  score: integer("score").default(0).notNull(),
  match: varchar("match", { length: 255 })
    .notNull()
    .references(() => match.id, { onDelete: "cascade", onUpdate: "cascade" }),
  is_fascist: boolean("is_fascist").notNull().default(false),
  is_hitler: boolean("is_hitler").notNull().default(false),
  party: varchar("party", { length: 255 }),
  role: varchar("role", { length: 255 }),

  intel: varchar("intel", { length: 3000 })
    .array()
    .notNull()
    .default(sql`'{}'::text[]`),

  joined_at: timestamp("joined_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const actual_users = createTable("actual_users", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  username: varchar("username", { length: 255 }).unique().notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),

  image: varchar("image", { length: 255 }),
});

export const matchRelations = relations(match, ({ many }) => ({
  players: many(player),
  elections: many(election),
}));

export const playerRelations = relations(player, ({ one }) => ({
  match: one(match, {
    fields: [player.match],
    references: [match.id],
  }),
}));
export const electionRelations = relations(election, ({ one, many }) => ({
  match: one(match, {
    fields: [election.match],
    references: [match.id],
  }),
  votes: many(vote),
}));

export const voteRelations = relations(vote, ({ one }) => ({
  election: one(election, {
    fields: [vote.election],
    references: [election.id],
  }),
}));

export type match_type = typeof match.$inferInsert;
