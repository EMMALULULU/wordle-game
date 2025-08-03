// src/lib/api/dto.ts
import { z } from 'zod';
import { GAME_CONFIG } from '@/lib/game/config';
import { gameStatusEnum, letterStateEnum } from '@/lib/enums';

export const LetterDto = z.object({
  letter: z.string().length(1),
  status: z.enum(letterStateEnum),
});
export type Letter = z.infer<typeof LetterDto>;

export const LetterRowDto = z.object({
  letters: z.array(LetterDto).length(GAME_CONFIG.WORD_LENGTH),
  isCompleted: z.boolean(),
});
export type LetterRow = z.infer<typeof LetterRowDto>;

export const CreateGameRequestDto = z.object({});
export type CreateGameRequest = z.infer<typeof CreateGameRequestDto>;

export const SubmitGuessRequestDto = z.object({
  gameId: z.string(),
  guess: z
    .string()
    .length(GAME_CONFIG.WORD_LENGTH)
    .refine((val) => GAME_CONFIG.WORD_LIST.includes(val.toUpperCase()), {
      message: 'Guess must be a valid word',
    }),
});
export type SubmitGuessRequest = z.infer<typeof SubmitGuessRequestDto>;

export const CreateGameResponseDto = z.object({
  gameId: z.string().min(1),
});
export type CreateGameResponse = z.infer<typeof CreateGameResponseDto>;

export const SubmitGuessResponseDto = z.object({
  row: LetterRowDto,
  status: z.enum(gameStatusEnum),
  currentRound: z.number(),
  letterStates: z.object({
    guessedLetters: z.array(z.string()),
    correctLetters: z.array(z.string()),
    misplacedLetters: z.array(z.string()),
  }).optional(),
});
export type SubmitGuessResponse = z.infer<typeof SubmitGuessResponseDto>;
