// M -> MISSED (score 1)
// H -> HIT (score 2)
// P -> PRESENT (score 0)

export function getFeedback(guess: string, candidate: string): string {
  const feedback = Array(guess.length).fill('M');
  const candidateLetters = candidate.split('');

  // First pass: Check for exact matches (HIT)
  for (let i = 0; i < guess.length; i++) {
    if (guess[i] === candidateLetters[i]) {
      feedback[i] = 'H';
      candidateLetters[i] = '';
    }
  }

  // Second pass: Check for present but wrong position
  for (let i = 0; i < guess.length; i++) {
    if (feedback[i] !== 'H') {
      const presentIndex = candidateLetters.indexOf(guess[i]);
      if (presentIndex !== -1) {
        feedback[i] = 'P';
        candidateLetters[presentIndex] = '';
      }
    }
  }

  return feedback.join('');
}

export function getMostMatchesPatternCandidates(
  guess: string,
  candidates: string[]
): {
  feedback: string[];
  newCandidates: string[];
} {
  const feedbackMap: Record<string, { candidates: string[]; score: number }> =
    {};
  const normalizedGuess = guess.toUpperCase();

  // 1. Calculate all feedback patterns and their scores
  candidates.forEach((candidate) => {
    const feedback = getFeedback(normalizedGuess, candidate.toUpperCase());
    if (!feedbackMap[feedback]) {
      // Calculate pattern score
      let score = 0;
      for (const f of feedback) {
        score += f === 'M' ? 1 : f === 'H' ? 2 : 0;
      }
      feedbackMap[feedback] = {
        candidates: [],
        score,
      };
    }
    feedbackMap[feedback].candidates.push(candidate);
  });

  const allMissKey = 'M'.repeat(guess.length);
  if (feedbackMap[allMissKey]) {
    return {
      feedback: allMissKey.split(''),
      newCandidates: feedbackMap[allMissKey].candidates,
    };
  }

  let bestPattern = '';
  let minScore = Infinity;
  let maxCandidates = 0;

  for (const [pattern, data] of Object.entries(feedbackMap)) {
    if (
      data.score < minScore ||
      (data.score === minScore && data.candidates.length > maxCandidates)
    ) {
      minScore = data.score;
      maxCandidates = data.candidates.length;
      bestPattern = pattern;
    }
  }

  if (!bestPattern && candidates.length > 0) {
    bestPattern = getFeedback(normalizedGuess, candidates[0].toUpperCase());
  }

  return {
    feedback: bestPattern.split(''),
    newCandidates: feedbackMap[bestPattern]?.candidates || [],
  };
}
