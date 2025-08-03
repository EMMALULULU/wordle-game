'use client';

import { Button, Container, Typography, Box } from '@mui/material';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleStartNewGame = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post('/api/game/new');

      if (response.data) {
        const data = await response.data;
        router.push(`/game/${data.gameId}`);
      } else {
        console.error('Failed to create new game');
      }
    } catch (error) {
      console.error('Error creating new game:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          gap: 4,
        }}
      >
        <Typography variant="h1" component="h1" gutterBottom>
          {isLoading ? 'loading...' : 'Wordle'}
        </Typography>

        <Button
          variant="contained"
          size="large"
          onClick={handleStartNewGame}
          disabled={isLoading}
          sx={{
            fontSize: '1.2rem',
            padding: '12px 32px',
            borderRadius: '8px',
          }}
        >
          Play
        </Button>
      </Box>
    </Container>
  );
}
