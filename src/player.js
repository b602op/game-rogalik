import { gameState } from "./gameState";

export const createPlayer = (x, y) => {
    let state = gameState.player || {
        x,
        y,
        health: 100,
        maxHealth: 100,
        attackPower: 10
    };

    const takeDamage = () => {
        state.health -= 3;

        gameState.map.setCell(state.x, state.y, { type: "P", action: 'attack', color: "red" });
    };

    const addHeal = () => {
        state.health = state.maxHealth;
    };

    const increaseAttack = () => {
        state.attackPower += 10;
    };

    const getState = () => ({ ...state });

    const setPosition = (newX, newY) => {
        state.x = newX;
        state.y = newY;
        gameState.map.setCell(newX, newY, 'P');
    };

    return {
        takeDamage,
        addHeal,
        increaseAttack,
        getState,
        setPosition
    };
};

const directions = [
    {dx: -1, dy: 0}, {dx: 1, dy: 0},
    {dx: 0, dy: -1}, {dx: 0, dy: 1},
    {dx: -1, dy: -1}, {dx: 1, dy: -1},
    {dx: -1, dy: 1}, {dx: 1, dy: 1}
];

export const playerAttack = () => {
    const attackEnemy = []

    const { x: playerX, y: playerY, attackPower } = gameState.player.getState()
  
    directions.forEach(({dx, dy}) => {
        const x = playerX + dx;
        const y = playerY + dy;
        gameState.map.setCell(x, y, { action: 'attack', color: "yellow" });
        
        gameState.enemies.forEach(enemy => {
            if (enemy.x === x && enemy.y === y) {
                attackEnemy.push(enemy)
            } 
        });
    })

    attackEnemy.forEach((enemy) => {
        const damagedEnemy = {
            ...enemy,
            health: enemy.health - attackPower
        };
        
        if (damagedEnemy.health <= 0) {
            gameState.enemies = gameState.enemies.filter((e) => e !== enemy);
            gameState.map.setCell(enemy.x, enemy.y, '-');
        } else {
            gameState.enemies = gameState.enemies.map((e) => (e === enemy ? damagedEnemy : e));
        }
    })
};