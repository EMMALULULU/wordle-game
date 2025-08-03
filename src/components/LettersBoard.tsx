import { Stack, styled, Typography } from '@mui/material';

import { grey } from '@mui/material/colors';
import { ColorMap } from '@/const';

const PulseRow = styled(Stack, {
  shouldForwardProp: (prop) => prop !== 'verifying',
})<{ verifying?: boolean }>(({ verifying }) => ({
  background: 'black',
  borderRadius: '50%',
  margin: 20,
  height: 20,
  width: 20,
  ...(verifying && {
    filter: 'drop-shadow(0 0 8px #aed581)',
    animation: 'pulse 2s infinite',
    '@keyframes pulse': {
      '0%': {
        transform: 'scale(0.95)',
        boxShadow: '0 0 0 0 rgba(0, 0, 0, 0.7)',
      },
      '70%': {
        transform: 'scale(1)',
        boxShadow: '0 0 0 10px rgba(0, 0, 0, 0)',
      },
      '100%': {
        transform: 'scale(0.95)',
        boxShadow: '0 0 0 0 rgba(0, 0, 0, 0)',
      },
    },
  }),
}));

export type LetterStatus = 'H' | 'P' | 'M' | 'UNUSED';

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
  verifyingIdx,
}: {
  letterBoardState: LetterRow[];
  verifyingIdx?: number;
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
            <PulseRow
              verifying={rowIndex === verifyingIdx}
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
            </PulseRow>
          ))}
        </Stack>
      ))}
    </Stack>
  );
};

function getCellBgColor(state: LetterStatus): string | undefined {
  switch (state) {
    case 'H':
      return ColorMap['hit'];
    case 'P':
      return ColorMap['present'];
    case 'M':
      return ColorMap['miss'];
    default:
      return;
  }
}
