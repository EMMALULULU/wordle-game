export const gameStatusEnum = ['in_progress', 'win', 'lose'] as const;
export const letterStateEnum = ['H', 'M', 'P', 'UNUSED'] as const;
export const gameStateMap = {
  win: 'win',
  in_progress: 'in_progress',
  lose: 'lose',
};
