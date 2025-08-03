import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { gamesTable } from '@/db/schema';
import { eq } from 'drizzle-orm';

// get game status

interface RouteParams {
  params: Promise<{
    gameId: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { gameId } = await params;

    const game = await db
      .select()
      .from(gamesTable)
      .where(eq(gamesTable.id, decodeURIComponent(gameId)))
      .limit(1);

    if (game.length === 0) {
      return NextResponse.json({ error: 'Game not found' }, { status: 404 });
    }

    const gameData = game[0];

    return NextResponse.json({
      gameId: gameData.id,
      maxRounds: gameData.maxRounds,
      currentRound: gameData.currentRound,
      status: gameData.status,
      letterStates: JSON.parse(gameData.letterStates),
      guesses: JSON.parse(gameData.guesses),
      candidates: JSON.parse(gameData.candidates),
    });
  } catch (error) {
    console.error('Failed to get game:', error);
    return NextResponse.json({ error: 'Failed to get game' }, { status: 500 });
  }
}
