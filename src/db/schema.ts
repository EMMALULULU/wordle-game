import { GAME_CONFIG } from '@/lib/game/config';
import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export type GuessFeedback = ('hit' | 'present' | 'miss')[];
const game_status = ['in_progress', 'win', 'lose'] as const;

export const gamesTable = sqliteTable('games', {
  id: text('game_id').primaryKey(),
  maxRounds: integer('max_rounds').notNull().default(GAME_CONFIG.MAX_ROUNDS),
  currentRound: integer('current_round').notNull().default(0),
  status: text('status', { enum: game_status })
    .notNull()
    .default('in_progress'),
  letterStates: text('letter_states').notNull().default('{}'),
  guesses: text('guesses').notNull().default('[]'),
  candidates: text('candidates').notNull().default('[]'),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
});

export type InsertGame = typeof gamesTable.$inferInsert;
export type SelectGame = typeof gamesTable.$inferSelect;
