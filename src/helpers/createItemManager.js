import { gameState } from "../gameState";

export const createItemManager = () => {
    const spawnItems = (type, count) => {
        const emptyCells = gameState.map.getEmptyCells();
        
        Array.from({ length: Math.min(count, emptyCells.length) }).forEach(() => {
            const randomIndex = Math.floor(Math.random() * emptyCells.length);

            const pos = emptyCells.splice(randomIndex, 1)[0];

            gameState.map.setCell(pos.x, pos.y, type);
        });
    };

    return {
        spawnItems
    };
};
