// 文件路径: src/app/api/game/new/route.ts

import { NextResponse } from 'next/server';
import { db } from '@/db';
import { gamesTable } from '@/db/schema';
import { GAME_CONFIG } from '@/lib/game/config';
import { nanoid } from 'nanoid';
import { InferInsertModel } from 'drizzle-orm';
import { CreateGameResponseDto, LetterRow } from '@/lib/api/dto';

// create new game
export async function POST() {
  try {
    const gameId = nanoid(21);
    const initialGuesses: LetterRow[] = Array(GAME_CONFIG.MAX_ROUNDS)
      .fill(null)
      .map(() => ({
        letters: Array(GAME_CONFIG.WORD_LENGTH)
          .fill(null)
          .map(() => ({
            letter: '',
            status: 'UNUSED',
          })),
        isCompleted: false,
      }));
    const newGameData: InferInsertModel<typeof gamesTable> = {
      id: gameId,
      maxRounds: GAME_CONFIG.MAX_ROUNDS,
      currentRound: 0,
      status: 'in_progress',
      letterStates: JSON.stringify({
        guessedLetters: [],
        correctLetters: [],
        misplacedLetters: [],
      }),
      guesses: JSON.stringify(initialGuesses),
      candidates: JSON.stringify(GAME_CONFIG.WORD_LIST),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.insert(gamesTable).values(newGameData);

    const response = CreateGameResponseDto.parse({ gameId });
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Failed to start the game: ', error);

    return NextResponse.json(
      { error: 'Failed to start the game' },
      { status: 500 }
    );
  }
}
