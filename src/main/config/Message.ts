export const Message = {
  START_GAME: 'Starting game',
  PLAYER_TURN: (playerName: string) => `Starting player ${playerName} turn`,
  CHOOSE_PIECE: (playerName: string) => `${playerName}, choose piece to add`,
  CHOOSE_PIECE_TO_MOVE: (playerName: string) =>
    `${playerName}, choose piece to move`,
  CHOOSE_PIECE_TO_REMOVE: (playerName: string) =>
    `${playerName}, choose piece to remove`,
  GAME_OVER: (playerName: string) =>
    `Congratulations, ${playerName}! You won this match!`,
};
