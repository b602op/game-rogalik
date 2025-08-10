import { gameState } from '../gameState.js';

export const checkGameOver = () => {
  const { health } = gameState.player.getState();

  if (health <= 0) {
    alert('Game Over!');
    gameState.player.addHeal();
    return true
  }
  
  if (gameState.enemies.length === 0) {
    alert('You Win!');
    return true
  }
};