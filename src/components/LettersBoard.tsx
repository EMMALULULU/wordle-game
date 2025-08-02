import { Stack, Typography } from '@mui/material';

import { grey } from '@mui/material/colors';
import { ColorMap } from './const';

export type LetterStatus = 'HIT' | 'PRESENT' | 'MISS' | 'UNUSED';

export type LetterCell = {
  letter: string;
  status: LetterStatus;
};

export type LetterRow = {
  letters: LetterCell[];
  isCompleted: boolean;
};

export const LetterBoard = ({
  letterBoardState,
}: {
  letterBoardState: LetterRow[];
}) => {
  return (
    <Stack spacing={1}>
      {letterBoardState.map((row, rowIndex) => (
        <Stack
          direction="row"
          spacing={1}
          justifyContent="center"
          key={rowIndex}
        >
          {row.letters.map((cell, colIndex) => (
            <Stack
              justifyContent="center"
              alignItems="center"
              key={colIndex}
              sx={{
                width: 56,
                height: 56,
                backgroundColor: getCellBgColor(cell.status),
                border: `2px solid ${getCellBgColor(cell.status) ?? grey[800]}`,
                borderRadius: 1,
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  transform: 'scale(1.05)',
                },
              }}
            >
              <Typography variant="h5" color="white" fontWeight="bold">
                {cell.letter}
              </Typography>
            </Stack>
          ))}
        </Stack>
      ))}
    </Stack>
  );
};

function getCellBgColor(state: LetterStatus): string | undefined {
  switch (state) {
    case 'HIT':
      return ColorMap['hit'];
    case 'PRESENT':
      return ColorMap['present'];
    case 'MISS':
      return ColorMap['miss'];
    default:
      return;
  }
}
