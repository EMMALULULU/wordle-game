'use client';

import React from 'react';
import { grey } from '@mui/material/colors';
import { Box, Button, Paper, styled } from '@mui/material';
import { ColorMap } from '@/const';


const keyboardLetters = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'DELETE'],
];

const KeyboardRow = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  gap: 0.5,
});

export interface VirtualKeyboardProps {
  onKeyPress: (key: string) => void;
  guessedLetters?: Set<string>;
  correctLetters?: Set<string>;
  misplacedLetters?: Set<string>;
  disabled?: boolean;
}

export const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({
  onKeyPress,
  guessedLetters = new Set(),
  correctLetters = new Set(),
  misplacedLetters = new Set(),
  disabled = false,
}) => {
  const getKeyColor = (letter: string): string => {
    if (correctLetters.has(letter)) {
      return ColorMap['hit'];
    }
    if (misplacedLetters.has(letter)) {
      return ColorMap['present'];
    }
    if (guessedLetters.has(letter)) {
      return ColorMap['miss'];
    }
    return grey['600'];
  };

  const handleKeyClick = (key: string) => {
    if (!disabled) {
      onKeyPress(key);
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        padding: 2,
        backgroundColor: 'transparent',
        borderRadius: 4,
        overflow: 'hidden',
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {keyboardLetters.map((row, index) => (
          <KeyboardRow key={index}>
            {row.map((key) => (
              <Button
                key={key}
                onClick={() => handleKeyClick(key)}
                disabled={disabled}
                sx={{
                  minWidth: 40,
                  height: 56,
                  fontSize: '16px',
                  fontWeight: 600,
                  variant: 'contained',
                  backgroundColor: getKeyColor(key),
                  color: 'white',
                  '&:hover': {
                    opacity: 0.8,
                  },
                  borderRadius: 1.25,
                  margin: 0.5,
                }}
              >
                {key}
              </Button>
            ))}
          </KeyboardRow>
        ))}
      </Box>
    </Paper>
  );
};
