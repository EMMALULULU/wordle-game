'use client';

import React, { useState, useEffect, use } from 'react';
import {
  Stack,
  Typography,
  CircularProgress,
  Box,
  Button,
} from '@mui/material';
import { VirtualKeyboard } from '@/components/VirtualKeyboard';
import { LetterBoard, LetterRow } from '@/components/LettersBoard';
import { green } from '@mui/material/colors';
import { GAME_CONFIG } from '@/lib/game/config';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export type GameState = 'win' | 'lose' | 'in_progress' | 'loading';

interface GamePageProps {
  params: Promise<{ gameId: string }>;
}

export default function WordleGame({ params }: GamePageProps) {
  const { gameId } = use(params);

  const router = useRouter();
  const MAX_ROUNDS = GAME_CONFIG.MAX_ROUNDS;
  const [letterBoardState, setLetterBoardState] = useState<LetterRow[]>(
    Array(MAX_ROUNDS)
      .fill(null)
      .map(() => ({
        letters: Array(GAME_CONFIG.WORD_LENGTH)
          .fill(null)
          .map(() => ({ letter: '', status: 'UNUSED' })),
        isCompleted: false,
      }))
  );
  const [currentRoundIdx, setCurrentRoundIdx] = useState(0);
  const [currentLetterIdx, setCurrentLetterIdx] = useState(0);
  const [gameState, setGameState] = useState<GameState>('loading');
  const [guessedLetters, setGuessedLetters] = useState<Set<string>>(new Set());
  const [correctLetters, setCorrectLetters] = useState<Set<string>>(new Set());
  const [misplacedLetters, setMisplacedLetters] = useState<Set<string>>(
    new Set()
  );
  const [guessNotValid, setGuessNotValid] = useState(false);
  const [verifying, setVerifying] = useState<number | undefined>(undefined);

  // load game state for each gameId
  useEffect(() => {
    const loadGame = async () => {
      try {
        const response = await axios.get(`/api/game/${gameId}`);

        if (response.data) {
          const gameData = response.data;

          if (gameData.guesses && gameData.guesses.length > 0) {
            setLetterBoardState(gameData.guesses);
            setCurrentRoundIdx(gameData.currentRound);
          }

          if (gameData.letterStates) {
            const letterStates = gameData.letterStates;
            setGuessedLetters(new Set(letterStates.guessedLetters));
            setCorrectLetters(new Set(letterStates.correctLetters));
            setMisplacedLetters(new Set(letterStates.misplacedLetters));
          }
          setGameState(gameData.status);
        } else {
          console.error('Failed to load game');
          router.push('/');
        }
      } catch (error) {
        console.error('Error loading game:', error);
        router.push('/');
      }
    };

    loadGame();
  }, [gameId, router]);

  const handleKeyPress = (key: string) => {
    if (gameState !== 'in_progress') return;

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
      currentLetterIdx < GAME_CONFIG.WORD_LENGTH &&
      currentRoundIdx < MAX_ROUNDS;

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

  const handleEnter = async () => {
    if (currentLetterIdx !== 5) return;

    const currentGuessLetters = letterBoardState[currentRoundIdx].letters.map(
      (tile) => tile.letter
    );
    const currentGuess = currentGuessLetters.join('');

    if (
      !GAME_CONFIG.WORD_LIST.find(
        (w) => w.toUpperCase() === currentGuess.toUpperCase()
      )
    ) {
      setGuessNotValid(true);
      return;
    }
    try {
      setVerifying(currentRoundIdx);
      const response = await axios.post('/api/game/guess', {
        gameId,
        guess: currentGuess,
      });

      const data = response.data;
      if (data) {
        //update the submitted row state
        setLetterBoardState((prev) => {
          const nextState = [...prev];
          nextState[currentRoundIdx] = data.row;
          return nextState;
        });
        setCurrentRoundIdx(data.currentRound);

        setGameState(data.status);

        if (data.letterStates) {
          setGuessedLetters(new Set(data.letterStates.guessedLetters));
          setCorrectLetters(new Set(data.letterStates.correctLetters));
          setMisplacedLetters(new Set(data.letterStates.misplacedLetters));
        }
        setGuessNotValid(false);
        setCurrentLetterIdx(0);
      }
    } finally {
      setVerifying(undefined);
    }
  };

  if (gameState === 'loading') {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Stack alignItems="center" justifyContent="center" spacing={3} padding={5}>
      <Typography variant="h6" color="text.secondary">
        Game ID: {gameId}
      </Typography>

      {gameState === 'win' && (
        <>
          <Typography variant="h5" color={green[500]}>
            Congratulations! You won!
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => {
              router.push('/');
            }}
            sx={{
              fontSize: '1.2rem',
              padding: '12px 32px',
              borderRadius: '8px',
            }}
          >
            Play again
          </Button>
        </>
      )}
      {gameState === 'lose' && (
        <>
          <Typography variant="h5" color="white">
            {`Game Over!`}
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => {
              router.push('/');
            }}
            sx={{
              fontSize: '1.2rem',
              padding: '12px 32px',
              borderRadius: '8px',
            }}
          >
            Play again
          </Button>
        </>
      )}
      {guessNotValid && (
        <Typography variant="h5" color="white">
          word not in list, try again
        </Typography>
      )}
      <LetterBoard
        letterBoardState={letterBoardState}
        verifyingIdx={verifying}
      />

      <VirtualKeyboard
        onKeyPress={handleKeyPress}
        guessedLetters={guessedLetters}
        correctLetters={correctLetters}
        misplacedLetters={misplacedLetters}
        disabled={gameState !== 'in_progress'}
      />
    </Stack>
  );
}
