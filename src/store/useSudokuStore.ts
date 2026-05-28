import { create } from 'zustand';
import { Board, Difficulty, generateSudoku, checkErrors, isComplete, isCorrect } from '@/utils/sudoku';

interface SudokuState {
  board: Board;
  solution: number[][];
  difficulty: Difficulty;
  selectedCell: [number, number] | null;
  isWon: boolean;
  isChecking: boolean;
  setDifficulty: (difficulty: Difficulty) => void;
  newGame: () => void;
  selectCell: (row: number, col: number) => void;
  setCellValue: (value: number | null) => void;
  checkBoard: () => void;
  getHint: () => void;
  resetBoard: () => void;
}

const initialDifficulty: Difficulty = 'easy';
const { puzzle: initialBoard, solution: initialSolution } = generateSudoku(initialDifficulty);

export const useSudokuStore = create<SudokuState>((set, get) => ({
  board: initialBoard,
  solution: initialSolution,
  difficulty: initialDifficulty,
  selectedCell: null,
  isWon: false,
  isChecking: false,

  setDifficulty: (difficulty: Difficulty) => {
    set({ difficulty });
  },

  newGame: () => {
    const { difficulty } = get();
    const { puzzle, solution } = generateSudoku(difficulty);
    set({
      board: puzzle,
      solution,
      selectedCell: null,
      isWon: false,
      isChecking: false
    });
  },

  selectCell: (row: number, col: number) => {
    set({ selectedCell: [row, col] });
  },

  setCellValue: (value: number | null) => {
    const { board, selectedCell, solution, isWon } = get();
    if (!selectedCell || isWon) return;

    const [row, col] = selectedCell;
    if (board[row][col].fixed) return;

    const newBoard = board.map((r, ri) =>
      r.map((cell, ci) => {
        if (ri === row && ci === col) {
          return { ...cell, value, error: false };
        }
        return cell;
      })
    );

    const newIsWon = isComplete(newBoard) && isCorrect(newBoard, solution);

    set({ board: newBoard, isWon: newIsWon });
  },

  checkBoard: () => {
    const { board } = get();
    const checkedBoard = checkErrors(board);
    set({ board: checkedBoard, isChecking: true });
    
    setTimeout(() => {
      set({ isChecking: false });
    }, 1500);
  },

  getHint: () => {
    const { board, solution, selectedCell } = get();
    if (selectedCell) {
      const [row, col] = selectedCell;
      if (!board[row][col].fixed) {
        const value = solution[row][col];
        get().setCellValue(value);
        return;
      }
    }

    // 如果没有选中的单元格或单元格是固定的，找一个空的可编辑单元格
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (!board[r][c].fixed && board[r][c].value === null) {
          const value = solution[r][c];
          const newBoard = board.map((row, ri) =>
            row.map((cell, ci) => {
              if (ri === r && ci === c) {
                return { ...cell, value, error: false };
              }
              return cell;
            })
          );
          
          const newIsWon = isComplete(newBoard) && isCorrect(newBoard, solution);
          
          set({ 
            board: newBoard, 
            selectedCell: [r, c],
            isWon: newIsWon 
          });
          return;
        }
      }
    }
  },

  resetBoard: () => {
    const { board } = get();
    const resetBoard = board.map(row =>
      row.map(cell => ({
        ...cell,
        value: cell.fixed ? cell.value : null,
        error: false
      }))
    );
    set({ board: resetBoard, isWon: false });
  }
}));
