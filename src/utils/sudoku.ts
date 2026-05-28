export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Cell {
  value: number | null;
  fixed: boolean;
  error: boolean;
}

export type Board = Cell[][];

// 生成一个完整的数独解答
function generateSolution(): number[][] {
  const board = Array(9).fill(null).map(() => Array(9).fill(0));
  solveSudoku(board);
  return board;
}

// 数独求解算法（回溯法）
function solveSudoku(board: number[][]): boolean {
  const empty = findEmpty(board);
  if (!empty) return true;
  
  const [row, col] = empty;
  const numbers = shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  
  for (const num of numbers) {
    if (isValid(board, row, col, num)) {
      board[row][col] = num;
      if (solveSudoku(board)) return true;
      board[row][col] = 0;
    }
  }
  return false;
}

// 查找空位置
function findEmpty(board: number[][]): [number, number] | null {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) return [row, col];
    }
  }
  return null;
}

// 检查数字是否有效
function isValid(board: number[][], row: number, col: number, num: number): boolean {
  // 检查行
  for (let x = 0; x < 9; x++) {
    if (board[row][x] === num) return false;
  }
  
  // 检查列
  for (let x = 0; x < 9; x++) {
    if (board[x][col] === num) return false;
  }
  
  // 检查3x3方块
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  for (let x = 0; x < 3; x++) {
    for (let y = 0; y < 3; y++) {
      if (board[boxRow + x][boxCol + y] === num) return false;
    }
  }
  return true;
}

// 打乱数组
function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// 根据难度移除数字
function removeNumbers(board: number[][], difficulty: Difficulty): number[][] {
  const result = board.map(row => [...row]);
  let cellsToRemove: number;
  
  switch (difficulty) {
    case 'easy':
      cellsToRemove = 35;
      break;
    case 'medium':
      cellsToRemove = 45;
      break;
    case 'hard':
      cellsToRemove = 55;
      break;
  }
  
  let removed = 0;
  while (removed < cellsToRemove) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);
    if (result[row][col] !== 0) {
      result[row][col] = 0;
      removed++;
    }
  }
  
  return result;
}

// 生成数独游戏
export function generateSudoku(difficulty: Difficulty): { puzzle: Board; solution: number[][] } {
  const solution = generateSolution();
  const puzzleBoard = removeNumbers(solution, difficulty);
  
  const puzzle: Board = puzzleBoard.map(row => 
    row.map(value => ({
      value: value === 0 ? null : value,
      fixed: value !== 0,
      error: false
    }))
  );
  
  return { puzzle, solution };
}

// 检查数独是否完成
export function isComplete(board: Board): boolean {
  return board.every(row => row.every(cell => cell.value !== null));
}

// 检查数独是否正确
export function isCorrect(board: Board, solution: number[][]): boolean {
  return board.every((row, r) => 
    row.every((cell, c) => cell.value === solution[r][c])
  );
}

// 检查当前棋盘的错误
export function checkErrors(board: Board): Board {
  return board.map((row, r) => 
    row.map((cell, c) => {
      if (cell.value === null || cell.fixed) {
        return { ...cell, error: false };
      }
      
      const hasError = !isValidBoard(board, r, c, cell.value);
      return { ...cell, error: hasError };
    })
  );
}

// 检查特定位置的数字是否有效
function isValidBoard(board: Board, row: number, col: number, num: number): boolean {
  // 检查行
  for (let x = 0; x < 9; x++) {
    if (x !== col && board[row][x].value === num) return false;
  }
  
  // 检查列
  for (let x = 0; x < 9; x++) {
    if (x !== row && board[x][col].value === num) return false;
  }
  
  // 检查3x3方块
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  for (let x = 0; x < 3; x++) {
    for (let y = 0; y < 3; y++) {
      const r = boxRow + x;
      const c = boxCol + y;
      if (r !== row || c !== col) {
        if (board[r][c].value === num) return false;
      }
    }
  }
  return true;
}
