// src/app/api/game/guess/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/db'; // 你的 Drizzle 实例
import { gamesTable } from '@/db/schema'; // 导入 games 表
import { GAME_CONFIG } from '@/lib/game/config';
import { eq } from 'drizzle-orm';
import { SubmitGuessResponseDto, LetterRow } from '@/lib/api/dto';
import {  getMostMatchesPatternCandidates } from '@/lib/api/game';

export async function POST(req: Request) {
  try {
    const { gameId, guess } = await req.json();
    if (!gameId || !guess || guess.length !== GAME_CONFIG.WORD_LENGTH) {
      return NextResponse.json(
        { error: 'Invalid gameId or guess' },
        { status: 400 }
      );
    }

    const games = await db
      .select()
      .from(gamesTable)
      .where(eq(gamesTable.id, gameId))
      .limit(1);

    const game = games[0];

    if (!game) {
      return NextResponse.json({ error: 'Game not found' }, { status: 404 });
    }

    if (game.status !== 'in_progress' || game.currentRound >= game.maxRounds) {
      return NextResponse.json({ error: 'Game is over' }, { status: 400 });
    }
    const candidates = JSON.parse(game.candidates) as string[];
    console.log('Current candidates:', candidates);

    const { feedback, newCandidates } = getMostMatchesPatternCandidates(
      guess.toUpperCase(),
      candidates
    );

    const newRow: LetterRow = {
      letters: guess
        .toUpperCase()
        .split('')
        .map((letter: string, i: number) => ({
          letter,
          status: feedback[i],
        })),
      isCompleted: true,
    };

    const guesses: LetterRow[] = JSON.parse(game.guesses);
    guesses[game.currentRound] = newRow;

    const currentLetterStates = JSON.parse(game.letterStates);
    const newLetterStates = { ...currentLetterStates };

    guess
      .toUpperCase()
      .split('')
      .forEach((letter: string, index: number) => {
        const status = feedback[index];

        if (status === 'H') {
          if (!newLetterStates.correctLetters.includes(letter)) {
            newLetterStates.correctLetters.push(letter);
          }
        } else if (status === 'P') {
          if (!newLetterStates.misplacedLetters.includes(letter)) {
            newLetterStates.misplacedLetters.push(letter);
          }
        } else if (status === 'M') {
          if (!newLetterStates.guessedLetters.includes(letter)) {
            newLetterStates.guessedLetters.push(letter);
          }
        }
      });

    console.log('updatedCandidates', newCandidates);


    const isCorrectGuess = feedback.every(status => status === 'H');
    
    const newStatus = isCorrectGuess
      ? 'win'
      : game.currentRound + 1 >= game.maxRounds
      ? 'lose'
      : 'in_progress';
    const newCurrentRound = game.currentRound + 1;

    await db
      .update(gamesTable)
      .set({
        currentRound: game.currentRound + 1,
        guesses: JSON.stringify(guesses),
        candidates: JSON.stringify(newCandidates),
        letterStates: JSON.stringify(newLetterStates),
        status: newStatus,
        updatedAt: new Date(),
      })
      .where(eq(gamesTable.id, gameId));

    const response = SubmitGuessResponseDto.parse({
      row: newRow,
      status: newStatus,
      currentRound: newCurrentRound,
      letterStates: newLetterStates,
    });
    console.log('Sending response:', response);
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Failed to process guess:', error);
    return NextResponse.json(
      { error: 'Failed to process guess' },
      { status: 500 }
    );
  }
}
