import React, { useState, useEffect, useCallback } from 'react';
import { generateSudoku, checkSolution, isComplete, Difficulty, SudokuGrid, SudokuGame, isValidPlacement } from '../utils/sudoku';

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
  const [showDifficultyModal, setShowDifficultyModal] = useState(true);

  const startNewGame = useCallback((diff: Difficulty) => {
    const newGame = generateSudoku(diff);
    setGame(newGame);
    setSelectedCell(null);
    setTime(0);
    setIsPlaying(true);
    setShowSuccess(false);
    setMistakes(0);
    setShowDifficultyModal(false);
  }, []);

  const handleSelectDifficulty = (diff: Difficulty) => {
    setDifficulty(diff);
    startNewGame(diff);
  };

  const handleNewGameClick = () => {
    setShowDifficultyModal(true);
    setIsPlaying(false);
  };

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
    
    // 检查是否完成且正确
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

  const getDifficultyText = (diff: Difficulty) => {
    return diff === 'easy' ? '简单' : diff === 'medium' ? '中等' : '复杂';
  };

  // 检查当前选中的数字是否违反规则
  const isConflict = (row: number, col: number, value: number | null) => {
    if (!game || value === null) return false;
    const valueGrid: (number | null)[][] = game.grid.map(r => r.map(c => c.value));
    valueGrid[row][col] = null; // 临时移除当前格子
    const hasConflict = !isValidPlacement(valueGrid, row, col, value);
    return hasConflict;
  };

  return (
    <div className={`flex flex-col items-center gap-6 p-4 ${className}`}>
      {/* 难度选择弹窗 */}
      {showDifficultyModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 shadow-2xl max-w-sm w-full mx-4 transform transition-all animate-in fade-in zoom-in duration-200">
            <div className="text-center mb-8">
              <div className="text-5xl mb-4">🎯</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">选择难度</h2>
              <p className="text-gray-500">请选择您想要挑战的难度级别</p>
            </div>
            <div className="flex flex-col gap-4">
              {(['easy', 'medium', 'hard'] as Difficulty[]).map((diff) => (
                <button
                  key={diff}
                  onClick={() => handleSelectDifficulty(diff)}
                  className={`w-full py-5 rounded-2xl text-lg font-bold transition-all transform hover:scale-105 active:scale-95 shadow-sm ${
                    diff === 'easy'
                      ? 'bg-gradient-to-r from-green-50 to-green-100 text-green-700 border-2 border-green-200 hover:from-green-100 hover:to-green-200'
                      : diff === 'medium'
                      ? 'bg-gradient-to-r from-yellow-50 to-yellow-100 text-yellow-700 border-2 border-yellow-200 hover:from-yellow-100 hover:to-yellow-200'
                      : 'bg-gradient-to-r from-red-50 to-red-100 text-red-700 border-2 border-red-200 hover:from-red-100 hover:to-red-200'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-2xl">
                      {diff === 'easy' ? '🌱' : diff === 'medium' ? '🌿' : '🔥'}
                    </span>
                    <span>{getDifficultyText(diff)}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {game && !showDifficultyModal && (
        <>
          {/* 信息栏 */}
          <div className="flex items-center gap-6 bg-white rounded-2xl px-8 py-4 shadow-sm border border-gray-100">
            <div className="flex flex-col items-center min-w-[80px]">
              <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">时间</span>
              <span className="text-2xl font-bold text-gray-800">{formatTime(time)}</span>
            </div>
            <div className="w-px h-12 bg-gray-200" />
            <div className="flex flex-col items-center min-w-[80px]">
              <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">难度</span>
              <span className="text-xl font-bold text-blue-600">{getDifficultyText(difficulty)}</span>
            </div>
            <div className="w-px h-12 bg-gray-200" />
            <div className="flex flex-col items-center min-w-[80px]">
              <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">错误</span>
              <span className="text-2xl font-bold text-red-500">{mistakes}</span>
            </div>
          </div>

          {/* 数独网格 */}
          <div className="relative">
            <div 
              className="grid grid-cols-9 bg-gray-800 gap-[3px] p-1 rounded-2xl overflow-hidden shadow-xl border-2 border-gray-800"
            >
              {game.grid.map((row, rowIndex) =>
                row.map((cell, colIndex) => {
                  const isSelected = selectedCell?.[0] === rowIndex && selectedCell?.[1] === colIndex;
                  const isRelated = isSameRow(rowIndex) || isSameCol(colIndex) || isSameBox(rowIndex, colIndex);
                  const hasSameValue = isSameValue(cell.value);
                  const isRightBorder = (colIndex + 1) % 3 === 0 && colIndex !== 8;
                  const isBottomBorder = (rowIndex + 1) % 3 === 0 && rowIndex !== 8;
                  const hasConflict = !cell.fixed && cell.value !== null && isConflict(rowIndex, colIndex, cell.value);

                  return (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      onClick={() => handleCellClick(rowIndex, colIndex)}
                      className={`
                        aspect-square flex items-center justify-center text-2xl font-bold cursor-pointer
                        transition-all duration-200 ease-out
                        ${cell.fixed ? 'text-gray-800' : 'text-blue-600'}
                        ${cell.error || hasConflict ? 'text-red-500 bg-red-50' : ''}
                        ${isSelected 
                          ? 'bg-blue-200 ring-2 ring-blue-500 z-10 scale-105 shadow-md' 
                          : isRelated 
                            ? 'bg-blue-50' 
                            : 'bg-white hover:bg-blue-50/50'}
                        ${hasSameValue && !isSelected ? 'bg-blue-100/80' : ''}
                        ${isRightBorder ? 'border-r-4 border-gray-800' : 'border-r border-gray-200'}
                        ${isBottomBorder ? 'border-b-4 border-gray-800' : 'border-b border-gray-200'}
                        ${(rowIndex === 0) ? 'border-t border-gray-200' : ''}
                        ${(colIndex === 0) ? 'border-l border-gray-200' : ''}
                      `}
                    >
                      {cell.value}
                    </div>
                  );
                })
              )}
            </div>

            {/* 成功完成弹窗 */}
            {showSuccess && (
              <div className="absolute inset-0 bg-white/98 backdrop-blur-xl rounded-2xl flex flex-col items-center justify-center gap-6 z-50 animate-in fade-in zoom-in duration-300">
                <div className="text-6xl animate-bounce">🎉</div>
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">恭喜完成!</h2>
                  <p className="text-gray-500">您成功完成了数独游戏</p>
                </div>
                
                {/* 游戏信息卡片 */}
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 w-full max-w-xs border border-blue-100">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-medium">难度</span>
                      <span className="text-lg font-bold text-blue-600">{getDifficultyText(difficulty)}</span>
                    </div>
                    <div className="w-full h-px bg-gray-200" />
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-medium">用时</span>
                      <span className="text-2xl font-bold text-purple-600">{formatTime(time)}</span>
                    </div>
                    <div className="w-full h-px bg-gray-200" />
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-medium">错误次数</span>
                      <span className="text-lg font-bold text-red-500">{mistakes}</span>
                    </div>
                  </div>
                </div>
                
                {/* 再来一局按钮 */}
                <button
                  onClick={handleNewGameClick}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                >
                  再来一局
                </button>
              </div>
            )}
          </div>

          {/* 功能按钮 */}
          <div className="flex gap-4">
            <button
              onClick={handleNewGameClick}
              className="flex flex-col items-center gap-2 px-5 py-3 text-gray-600 hover:text-blue-500 transition-all hover:bg-blue-50 rounded-xl"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="text-sm font-medium">新游戏</span>
            </button>
            <button
              onClick={handleCheck}
              className="flex flex-col items-center gap-2 px-5 py-3 text-gray-600 hover:text-green-500 transition-all hover:bg-green-50 rounded-xl"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium">检查</span>
            </button>
            <button
              onClick={handleHint}
              className="flex flex-col items-center gap-2 px-5 py-3 text-gray-600 hover:text-purple-500 transition-all hover:bg-purple-50 rounded-xl"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <span className="text-sm font-medium">提示</span>
            </button>
            <button
              onClick={handleClear}
              className="flex flex-col items-center gap-2 px-5 py-3 text-gray-600 hover:text-red-500 transition-all hover:bg-red-50 rounded-xl"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span className="text-sm font-medium">清除</span>
            </button>
          </div>

          {/* 数字键盘 */}
          <div className="grid grid-cols-5 gap-3 w-full max-w-md">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button
                key={num}
                onClick={() => handleNumberInput(num)}
                className="aspect-square flex items-center justify-center text-2xl font-bold bg-white text-gray-800 rounded-2xl shadow-md hover:shadow-xl transition-all transform hover:scale-105 active:scale-95 border-2 border-gray-100 hover:border-blue-300"
              >
                {num}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Sudoku;
