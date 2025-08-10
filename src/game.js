
import { createPlayer, playerAttack } from './player.js';
import { createEnemy, moveEnemy } from './enemy.js';
import { gameState } from './gameState.js';
import { checkGameOver } from './helpers/checkGameOver.js';
import { initGame } from './helpers/initGame.js';

export const spawnPlayer = () => {
  const emptyCells = gameState.map.getEmptyCells();
  
  const { x, y } = emptyCells[Math.floor(Math.random() * emptyCells.length)];

  gameState.player = createPlayer(x, y);

  gameState.map.setCell(x, y, 'P');
};

export const spawnEnemies = () => {
  let emptyCells = gameState.map.getEmptyCells();
  const count = 10;
  
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * emptyCells.length);

    const { x, y } = emptyCells[randomIndex];

    createEnemy(x, y);
    
    gameState.map.setCell(x, y, 'E');
  }
};

const spawnAllItems = () => {
  gameState.items.spawnItems('HP', 10);

  gameState.items.spawnItems('SW', 2);
};

export const renderGame = () => {
  const h1 = document.querySelector('h1');
  const field = document.querySelector('.field');
  field.innerHTML = '';

  const { health: playerHealth, maxHealth, attackPower } = gameState.player.getState();
  
  for (let y = 0; y < gameState.map.height; y++) {
    for (let x = 0; x < gameState.map.width; x++) {
      let cellType = gameState.map.getCell(x, y);
      const tile = document.createElement('div');

      if (typeof cellType === "object") {
        tile.style.border = "solid 1px " + cellType.color;
        cellType = cellType.type;
        gameState.map.setCell(x, y, cellType);
        setTimeout(() => {
          tile.style.border = '';
        }, 300);
      }

      tile.className = `tile tile${cellType}`;
      tile.style.left = `${x * 25.6}px`;
      tile.style.top = `${y * 26.6}px`;
      
      if (cellType === 'P' && gameState.player) {
        const health = document.createElement('div');
        health.className = 'health';
        health.style.width = `${(playerHealth / maxHealth * 25.6)}px`;
        tile.appendChild(health);
      }
      
      if (cellType === 'E') {
        const enemy = gameState.enemies.find(e => e.x === x && e.y === y);
        if (enemy) {
          const health = document.createElement('div');
          health.className = 'health';
          health.style.width = `${(enemy.health / enemy.maxHealth * 25.6)}px`;
          tile.appendChild(health);
        }
      }

      h1.innerHTML = `Игровое поле. Здоровья: ${playerHealth} Атака: ${attackPower}`;
      
      field.appendChild(tile);
    }
  }
};

export const movePlayer = (dx, dy) => {
  const { x, y } = gameState.player.getState();

  const newX = x + dx;
  const newY = y + dy;
  
  if (gameState.map.getCell(newX, newY) === 'W') return;

  if (gameState.map.getCell(newX, newY) === 'E') return

  if (gameState.map.getCell(newX, newY) === 'HP') {
    gameState.player.addHeal(newX, newY);
  }

  if (gameState.map.getCell(newX, newY) === 'SW') {
    gameState.player.increaseAttack(newX, newY);
  }

  if (newX < 0) return;
  if (newY < 0) return;
  if (newX >= gameState.map.width) return;
  if (newY >= gameState.map.height) return;
  
  gameState.map.setCell(x, y, '-');
  gameState.player.setPosition(newX, newY);
};



export const startGame = () => {
  initGame();
  
  spawnPlayer();
  spawnAllItems();
  spawnEnemies();

  gameState.isRunning = true;
  
  renderGame();
  
  let canInput = true;
  const inputDelay = 200;

  document.addEventListener('keydown', (e) => {
    if (!gameState.isRunning || !canInput) return;
    
    canInput = false;
    setTimeout(() => {
      canInput = true;
    }, inputDelay);

    switch (e.key.toLowerCase()) {
      case 'ф':
      case 'a': movePlayer(-1, 0); break;
      case 'в':
      case 'd': movePlayer(1, 0); break;
      case 'ц':
      case 'w': movePlayer(0, -1); break;
      case 'ы':
      case 's': movePlayer(0, 1); break;
      case ' ': playerAttack(); break;
      default: 
        canInput = true;
        return;
    }

    const newEnemies = [];

    gameState.enemies.forEach((item) => {
      newEnemies.push(moveEnemy(item, gameState.player))
    })

    gameState.enemies = newEnemies;

    const isEnd = checkGameOver()

    if (isEnd) {
      spawnAllItems();
      if (gameState.enemies.length <= 0) spawnEnemies();
    }

    renderGame();
  });
};