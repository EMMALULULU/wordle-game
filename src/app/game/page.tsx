'use client';

import React, { useState } from 'react';
import { Stack, Typography } from '@mui/material';
import { VirtualKeyboard } from '@/components/VirtualKeyboard';
import {
  LetterBoard,
  LetterRow,
  LetterStatus,
} from '@/components/LettersBoard';
import { green } from '@mui/material/colors';
import { GAME_CONFIG } from '@/lib/game/config';

const WORD_LENGTH = 5;

export type GameState = 'WIN' | 'LOSE' | 'INPROGRESS';

export default function WordleGame() {
  const targetWord =
    GAME_CONFIG.WORD_LIST[
      Math.floor(Math.random()) * (GAME_CONFIG.WORD_LIST.length - 1)
    ];
  const MAX_ROUNDS = GAME_CONFIG.MAX_ROUNDS;
  const [letterBoardState, setLetterBoardState] = useState<LetterRow[]>(
    Array(MAX_ROUNDS)
      .fill(null)
      .map(() => ({
        letters: Array(WORD_LENGTH)
          .fill(null)
          .map(() => ({ letter: '', status: 'UNUSED' })),
        isCompleted: false,
      }))
  );
  const [currentRoundIdx, setCurrentRoundIdx] = useState(0);
  const [currentLetterIdx, setCurrentLetterIdx] = useState(0);
  const [gameState, setGameState] = useState<GameState>('INPROGRESS');
  const [guessedLetters, setGuessedLetters] = useState<Set<string>>(new Set());
  const [correctLetters, setCorrectLetters] = useState<Set<string>>(new Set());
  const [misplacedLetters, setMisplacedLetters] = useState<Set<string>>(
    new Set()
  );

  const handleKeyPress = (key: string) => {
    if (gameState !== 'INPROGRESS') return;

    if (key === 'ENTER') {
      handleEnter();
    } else if (key === 'DELETE') {
      handleDelete();
    } else {
      handleLetter(key);
    }
  };

  const handleLetter = (letter: string) => {
    const isValidEnter =
      currentLetterIdx < WORD_LENGTH && currentRoundIdx < MAX_ROUNDS;
    if (!isValidEnter) return;

    setLetterBoardState((prev) => {
      const nextState = [...prev];

      nextState[currentRoundIdx].letters[currentLetterIdx] = {
        letter,
        status: 'UNUSED',
      };
      return nextState;
    });
    setCurrentLetterIdx((prev) => prev + 1);
  };

  const handleDelete = () => {
    if (currentLetterIdx > 0) {
      setLetterBoardState((prev) => {
        const newGameState = [...prev];
        newGameState[currentRoundIdx].letters[currentLetterIdx - 1] = {
          letter: '',
          status: 'UNUSED',
        };
        return newGameState;
      });
      setCurrentLetterIdx((prev) => prev - 1);
    }
  };

  const handleEnter = () => {
    if (currentLetterIdx !== 5) return;

    const currentGuessLetters = letterBoardState[currentRoundIdx].letters.map(
      (tile) => tile.letter
    );

    const nextBoardState = [...letterBoardState];
    const newGuessedLetters = new Set(guessedLetters);
    const newCorrectLetters = new Set(correctLetters);
    const newMisplacedLetters = new Set(misplacedLetters);

    currentGuessLetters.forEach((letter, i) => {
      let letterState: LetterStatus = 'MISS';

      if (targetWord[i] === letter) {
        newCorrectLetters.add(letter);
        letterState = 'HIT';
      } else if (targetWord.includes(letter)) {
        newMisplacedLetters.add(letter);
        letterState = 'PRESENT';
      } else {
        newGuessedLetters.add(letter);
      }

      nextBoardState[currentRoundIdx].letters[i].status =
        letterState satisfies LetterStatus;
    });

    setCurrentLetterIdx(0);
    setCurrentRoundIdx((prev) => prev + 1);
    setGuessedLetters(newGuessedLetters);
    setCorrectLetters(newCorrectLetters);
    setMisplacedLetters(newMisplacedLetters);
    console.log(currentRoundIdx);
    if (currentGuessLetters.join('') === targetWord) {
      setGameState('WIN');
    } else if (currentRoundIdx === MAX_ROUNDS - 1) {
      setGameState('LOSE');
    }
  };

  return (
    <Stack alignItems="center" justifyContent="center" spacing={3} padding={5}>
      {gameState === 'WIN' && (
        <Typography variant="h5" color={green[500]}>
          Congratulations! You won!
        </Typography>
      )}
      {gameState === 'LOSE' && (
        <Typography variant="h5" color="white">
          {`Game Over! The word was ${targetWord}`}
        </Typography>
      )}
      <LetterBoard letterBoardState={letterBoardState} />

      <VirtualKeyboard
        onKeyPress={handleKeyPress}
        guessedLetters={guessedLetters}
        correctLetters={correctLetters}
        misplacedLetters={misplacedLetters}
        disabled={gameState !== 'INPROGRESS'}
      />
    </Stack>
  );
}
