import { getRandomInt } from './helpers/utils.js';
import { gameState } from './gameState.js';

const createGrid = (width, height, fillValue) => 
  Array.from({ length: height }, () => 
    Array.from({ length: width }, () => fillValue)
  );

const getRandomPosition = (maxX, maxY, sizeX = 0, sizeY = 0) => ({
  x: getRandomInt(1, maxX - sizeX - 1),
  y: getRandomInt(1, maxY - sizeY - 1)
});

const carveArea = (grid, x, y, width, height, value = 'W') => {
  const newGrid = [...grid];
  for (let dy = 0; dy < height; dy++) {
    if (!newGrid[y + dy]) continue;
    newGrid[y + dy] = [...newGrid[y + dy]];
    for (let dx = 0; dx < width; dx++) {
      newGrid[y + dy][x + dx] = value;
    }
  }
  return newGrid;
};

const getEmptyCells = () => {
  const emptyCells = [];

  gameState.map.grid.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell === '-') {
        emptyCells.push({ x, y })
      }
    })
  })

  return emptyCells
}

const generateWalls = (grid, width, height) => {
  let newGrid = [...grid];

  for (let i = 0; i < 10; i++) {
    const wallWidth = getRandomInt(3, 8);

    const wallHeight = getRandomInt(3, 8);

    const { x, y } = getRandomPosition(width, height, wallWidth, wallHeight);

    newGrid = carveArea(newGrid, x, y, wallWidth, wallHeight);
  }

  return newGrid;
};

const isInBounds = (x, y) => {
  return x >= 0 && 
         y >= 0 && 
         x < gameState.map.width && 
         y < gameState.map.height;
};

export const createMap = (width, height) => {
  if (gameState.map) return gameState.map;

  let grid = createGrid(width, height, '-');
  
  grid = generateWalls(grid, width, height);
  
  return {
    width,
    height,
    grid,
    getCell: (x, y) => {
      if (x >= 0 && x < width && y >= 0 && y < height) {
        return gameState.map.grid[y][x]
      }

      return 'W'
    },
    setCell: (x, y, value) => {
      if (!isInBounds(x, y)) return

      if (typeof value === 'object') {
        const cell = gameState.map.grid[y][x]

        gameState.map.grid[y][x] = { type: cell, ...value };
        return
      }

      gameState.map.grid[y][x] = value;
    },
    getEmptyCells,
    isInBounds,
  };
};