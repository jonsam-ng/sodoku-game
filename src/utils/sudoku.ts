export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Cell {
  value: number | null;
  fixed: boolean;
  error: boolean;
  note: number[];
}

export type SudokuGrid = Cell[][];

export interface SudokuGame {
  grid: SudokuGrid;
  solution: number[][];
  difficulty: Difficulty;
}

const DIFFICULTY_REMOVE_COUNT: Record<Difficulty, number> = {
  easy: 30,
  medium: 45,
  hard: 58,
};

function createEmptyGrid(): number[][] {
  return Array(9).fill(null).map(() => Array(9).fill(0));
}

/**
 * 检查数独规则：行、列、3x3宫格是否有重复数字
 */
export function isValidPlacement(grid: (number | null)[][], row: number, col: number, num: number): boolean {
  // 检查行
  for (let i = 0; i < 9; i++) {
    if (grid[row][i] === num) return false;
  }
  // 检查列
  for (let i = 0; i < 9; i++) {
    if (grid[i][col] === num) return false;
  }
  // 检查3x3宫格
  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (grid[startRow + i][startCol + j] === num) return false;
    }
  }
  return true;
}

function isValid(grid: number[][], row: number, col: number, num: number): boolean {
  for (let i = 0; i < 9; i++) {
    if (grid[row][i] === num) return false;
  }
  for (let i = 0; i < 9; i++) {
    if (grid[i][col] === num) return false;
  }
  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (grid[startRow + i][startCol + j] === num) return false;
    }
  }
  return true;
}

function solveSudoku(grid: number[][]): boolean {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] === 0) {
        const numbers = shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        for (const num of numbers) {
          if (isValid(grid, row, col, num)) {
            grid[row][col] = num;
            if (solveSudoku(grid)) {
              return true;
            }
            grid[row][col] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function generateFullGrid(): number[][] {
  const grid = createEmptyGrid();
  solveSudoku(grid);
  return grid;
}

function createPuzzle(grid: number[][], difficulty: Difficulty): SudokuGrid {
  const puzzle: SudokuGrid = grid.map(row =>
    row.map(value => ({
      value,
      fixed: true,
      error: false,
      note: [],
    }))
  );

  const removeCount = DIFFICULTY_REMOVE_COUNT[difficulty];
  const positions = [];
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      positions.push([i, j]);
    }
  }
  
  const shuffledPositions = shuffleArray(positions);
  for (let i = 0; i < removeCount; i++) {
    const [row, col] = shuffledPositions[i];
    puzzle[row][col].value = null;
    puzzle[row][col].fixed = false;
  }

  return puzzle;
}

export function generateSudoku(difficulty: Difficulty): SudokuGame {
  const solution = generateFullGrid();
  const grid = createPuzzle(solution, difficulty);
  return { grid, solution, difficulty };
}

/**
 * 检查数独是否完整且正确
 * 不仅与答案比对，还验证数独规则
 */
export function checkSolution(grid: SudokuGrid, solution: number[][]): { correct: boolean; errors: [number, number][] } {
  const errors: [number, number][] = [];
  let correct = true;
  
  // 先检查每个格子是否与答案一致
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (grid[i][j].value !== null && grid[i][j].value !== solution[i][j]) {
        errors.push([i, j]);
        correct = false;
      }
    }
  }
  
  // 再验证数独规则：确保每行、每列、每个3x3宫格没有重复数字
  const valueGrid: (number | null)[][] = grid.map(row => row.map(cell => cell.value));
  
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      const num = valueGrid[i][j];
      if (num !== null) {
        // 临时清空当前格子，检查是否有重复
        valueGrid[i][j] = null;
        if (!isValidPlacement(valueGrid, i, j, num)) {
          // 如果有重复且还没标记为错误
          if (!errors.some(([r, c]) => r === i && c === j)) {
            errors.push([i, j]);
            correct = false;
          }
        }
        valueGrid[i][j] = num;
      }
    }
  }
  
  return { correct, errors };
}

export function isComplete(grid: SudokuGrid): boolean {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (grid[i][j].value === null) {
        return false;
      }
    }
  }
  return true;
}
