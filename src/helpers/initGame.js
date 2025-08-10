import { createMap } from '../map.js';
import { createItemManager } from './createItemManager.js';
import { gameState } from '../gameState.js';

export const initGame = () => {
  gameState.map = createMap(40, 24);
  gameState.items = createItemManager();
};
