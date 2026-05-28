import React, { useState, useEffect, useCallback } from 'react';
import { generateSudoku, checkSolution, isComplete, Difficulty, SudokuGrid, SudokuGame } from '../utils/sudoku';

interface SudokuProps {
  className?: string;
}

const Sudoku: React.FC<SudokuProps> = ({ className = '' }) => {
  const [game, setGame] = useState<SudokuGame | null>(null);
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [time, setTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [mistakes, setMistakes] = useState(0);

  const startNewGame = useCallback((diff: Difficulty) => {
    const newGame = generateSudoku(diff);
    setGame(newGame);
    setSelectedCell(null);
    setTime(0);
    setIsPlaying(true);
    setShowSuccess(false);
    setMistakes(0);
  }, []);

  useEffect(() => {
    startNewGame(difficulty);
  }, [startNewGame, difficulty]);

  useEffect(() => {
    let interval: number;
    if (isPlaying && !showSuccess) {
      interval = window.setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, showSuccess]);

  const handleCellClick = (row: number, col: number) => {
    setSelectedCell([row, col]);
  };

  const handleNumberInput = (num: number) => {
    if (!game || !selectedCell) return;

    const [row, col] = selectedCell;
    if (game.grid[row][col].fixed) return;

    const newGrid = game.grid.map((r, ri) =>
      r.map((cell, ci) => {
        if (ri === row && ci === col) {
          return { ...cell, value: num, error: false };
        }
        return cell;
      })
    );

    setGame({ ...game, grid: newGrid });
    
    if (isComplete(newGrid)) {
      const { correct } = checkSolution(newGrid, game.solution);
      if (correct) {
        setShowSuccess(true);
        setIsPlaying(false);
      }
    }
  };

  const handleClear = () => {
    if (!game || !selectedCell) return;

    const [row, col] = selectedCell;
    if (game.grid[row][col].fixed) return;

    const newGrid = game.grid.map((r, ri) =>
      r.map((cell, ci) => {
        if (ri === row && ci === col) {
          return { ...cell, value: null, error: false };
        }
        return cell;
      })
    );

    setGame({ ...game, grid: newGrid });
  };

  const handleCheck = () => {
    if (!game) return;

    const { correct, errors } = checkSolution(game.grid, game.solution);
    const newGrid = game.grid.map((row, ri) =>
      row.map((cell, ci) => ({
        ...cell,
        error: errors.some(([r, c]) => r === ri && c === ci),
      }))
    );

    setGame({ ...game, grid: newGrid });
    setMistakes((prev) => prev + errors.length);
    
    if (correct && isComplete(newGrid)) {
      setShowSuccess(true);
      setIsPlaying(false);
    }
  };

  const handleHint = () => {
    if (!game || !selectedCell) return;

    const [row, col] = selectedCell;
    if (game.grid[row][col].fixed) {
      let found = false;
      for (let i = 0; i < 9 && !found; i++) {
        for (let j = 0; j < 9 && !found; j++) {
          if (!game.grid[i][j].fixed && game.grid[i][j].value !== game.solution[i][j]) {
            setSelectedCell([i, j]);
            found = true;
          }
        }
      }
      return;
    }

    const newGrid = game.grid.map((r, ri) =>
      r.map((cell, ci) => {
        if (ri === row && ci === col) {
          return { ...cell, value: game.solution[row][col], error: false };
        }
        return cell;
      })
    );

    setGame({ ...game, grid: newGrid });

    if (isComplete(newGrid)) {
      const { correct } = checkSolution(newGrid, game.solution);
      if (correct) {
        setShowSuccess(true);
        setIsPlaying(false);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const isSameRow = selectedCell ? (row: number) => row === selectedCell[0] : () => false;
  const isSameCol = selectedCell ? (col: number) => col === selectedCell[1] : () => false;
  const isSameBox = selectedCell ? (row: number, col: number) => {
    const selectedBoxRow = Math.floor(selectedCell[0] / 3);
    const selectedBoxCol = Math.floor(selectedCell[1] / 3);
    return Math.floor(row / 3) === selectedBoxRow && Math.floor(col / 3) === selectedBoxCol;
  } : () => false;
  const isSameValue = selectedCell && game ? (value: number | null) => {
    if (value === null) return false;
    const [row, col] = selectedCell;
    return game.grid[row][col].value === value;
  } : () => false;

  return (
    <div className={`flex flex-col items-center gap-6 p-4 ${className}`}>
      <div className="text-3xl font-bold text-gray-800 mb-2">数独</div>
      
      <div className="flex items-center gap-8 bg-white rounded-2xl px-6 py-3 shadow-sm">
        <div className="flex flex-col items-center">
          <span className="text-xs text-gray-500 uppercase tracking-wider">时间</span>
          <span className="text-xl font-semibold text-gray-800">{formatTime(time)}</span>
        </div>
        <div className="w-px h-10 bg-gray-200" />
        <div className="flex flex-col items-center">
          <span className="text-xs text-gray-500 uppercase tracking-wider">错误</span>
          <span className="text-xl font-semibold text-gray-800">{mistakes}</span>
        </div>
      </div>

      <div className="flex bg-gray-100 rounded-xl p-1">
        {(['easy', 'medium', 'hard'] as Difficulty[]).map((diff) => (
          <button
            key={diff}
            onClick={() => setDifficulty(diff)}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
              difficulty === diff
                ? 'bg-white text-blue-500 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            {diff === 'easy' ? '简单' : diff === 'medium' ? '中等' : '复杂'}
          </button>
        ))}
      </div>

      {game && (
        <div className="relative">
          <div 
            className="grid grid-cols-9 bg-gray-800 gap-0.5 p-0.5 rounded-xl overflow-hidden shadow-lg"
          >
            {game.grid.map((row, rowIndex) =>
              row.map((cell, colIndex) => {
                const isSelected = selectedCell?.[0] === rowIndex && selectedCell?.[1] === colIndex;
                const isRelated = isSameRow(rowIndex) || isSameCol(colIndex) || isSameBox(rowIndex, colIndex);
                const hasSameValue = isSameValue(cell.value);
                const isRightBorder = (colIndex + 1) % 3 === 0 && colIndex !== 8;
                const isBottomBorder = (rowIndex + 1) % 3 === 0 && rowIndex !== 8;

                return (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    onClick={() => handleCellClick(rowIndex, colIndex)}
                    className={`
                      aspect-square flex items-center justify-center text-2xl font-medium cursor-pointer
                      transition-all duration-150
                      ${cell.fixed ? 'text-gray-800 font-semibold' : 'text-blue-500'}
                      ${cell.error ? 'text-red-500 bg-red-50' : ''}
                      ${isSelected ? 'bg-blue-200' : isRelated ? 'bg-blue-50' : 'bg-white'}
                      ${hasSameValue && !isSelected ? 'bg-blue-100' : ''}
                      ${isRightBorder ? 'border-r-2 border-gray-800' : ''}
                      ${isBottomBorder ? 'border-b-2 border-gray-800' : ''}
                      hover:bg-blue-100
                    `}
                  >
                    {cell.value}
                  </div>
                );
              })
            )}
          </div>

          {showSuccess && (
            <div className="absolute inset-0 bg-white/95 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center gap-4">
              <div className="text-4xl">🎉</div>
              <div className="text-2xl font-bold text-gray-800">恭喜完成!</div>
              <div className="text-gray-600">用时: {formatTime(time)}</div>
              <button
                onClick={() => startNewGame(difficulty)}
                className="bg-blue-500 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-600 transition-colors shadow-lg"
              >
                新游戏
              </button>
            </div>
          )}
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={() => startNewGame(difficulty)}
          className="flex flex-col items-center gap-1 px-4 py-2 text-gray-600 hover:text-blue-500 transition-colors"
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span className="text-xs">新游戏</span>
        </button>
        <button
          onClick={handleCheck}
          className="flex flex-col items-center gap-1 px-4 py-2 text-gray-600 hover:text-blue-500 transition-colors"
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-xs">检查</span>
        </button>
        <button
          onClick={handleHint}
          className="flex flex-col items-center gap-1 px-4 py-2 text-gray-600 hover:text-blue-500 transition-colors"
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <span className="text-xs">提示</span>
        </button>
        <button
          onClick={handleClear}
          className="flex flex-col items-center gap-1 px-4 py-2 text-gray-600 hover:text-blue-500 transition-colors"
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          <span className="text-xs">清除</span>
        </button>
      </div>

      <div className="grid grid-cols-5 gap-2 w-full max-w-sm">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <button
            key={num}
            onClick={() => handleNumberInput(num)}
            className="aspect-square flex items-center justify-center text-xl font-semibold bg-white text-gray-800 rounded-xl shadow-sm hover:bg-gray-50 active:scale-95 transition-all"
          >
            {num}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Sudoku;
