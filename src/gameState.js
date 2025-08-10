export const defaultGameState = {
  map: null,
  player: null,
  enemies: [],
  items: [],
  isRunning: false
}

export let gameState = defaultGameState;

export const resetGameState = () => {
  gameState = defaultGameState;
}