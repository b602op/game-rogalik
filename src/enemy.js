import { gameState } from './gameState.js';

export const createEnemy = (x, y) => {
    const enemy = {
        x,
        y,
        health: 40,
        maxHealth: 40,
    };
    gameState.enemies.push(enemy);
    return enemy;
};

export const moveEnemy = (enemy) => {
    const { x, y, attackPower } = enemy;

    let newX = x;
    let newY = y;
    
    const { x: playerX, y: playerY } = gameState.player.getState();

    const isPlayerNear = Math.abs(x - playerX) <= 1 && Math.abs(y - playerY) <= 1;

    if (isPlayerNear) {
        gameState.player.takeDamage();
        return enemy;
    }

    if (x < playerX) {
        newX += 1;
    } else {
        newX -= 1;
    }
    
    if (y < playerY) {
        newY += 1;
    } else {
        newY -= 1;
    }

    if (Math.random() < 0.5) {
        newX = x;
    } else {
        newY = y;
    }
    
    if (!gameState.map.isInBounds(newX, newY)) return enemy;
    
    const targetCell = gameState.map.getCell(newX, newY);

    if (targetCell !== '-') return enemy;
    
    gameState.map.setCell(x, y, '-');
    gameState.map.setCell(newX, newY, 'E');
    
    return { ...enemy, x: newX, y: newY };
};