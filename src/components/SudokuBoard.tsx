import React from 'react';
import { useSudokuStore } from '@/store/useSudokuStore';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const SudokuBoard: React.FC = () => {
  const { board, selectedCell, selectCell, setCellValue } = useSudokuStore();

  // 键盘支持
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedCell) return;
      
      // 数字键 1-9
      if (e.key >= '1' && e.key <= '9') {
        setCellValue(parseInt(e.key));
        return;
      }
      
      // 删除键
      if (e.key === 'Backspace' || e.key === 'Delete') {
        setCellValue(null);
        return;
      }
      
      // 方向键导航
      const [row, col] = selectedCell;
      if (e.key === 'ArrowUp' && row > 0) {
        selectCell(row - 1, col);
      } else if (e.key === 'ArrowDown' && row < 8) {
        selectCell(row + 1, col);
      } else if (e.key === 'ArrowLeft' && col > 0) {
        selectCell(row, col - 1);
      } else if (e.key === 'ArrowRight' && col < 8) {
        selectCell(row, col + 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCell, selectCell, setCellValue]);

  const isSameRow = (row: number) => selectedCell && selectedCell[0] === row;
  const isSameCol = (col: number) => selectedCell && selectedCell[1] === col;
  const isSameBox = (row: number, col: number) => {
    if (!selectedCell) return false;
    const [sr, sc] = selectedCell;
    return Math.floor(row / 3) === Math.floor(sr / 3) && 
           Math.floor(col / 3) === Math.floor(sc / 3);
  };
  const isSameValue = (value: number | null) => {
    if (!selectedCell || value === null) return false;
    const [sr, sc] = selectedCell;
    return board[sr][sc].value === value;
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6">
      <div className="grid grid-cols-9 gap-0 border-2 border-gray-800 rounded-xl overflow-hidden">
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const isSelected = selectedCell?.[0] === rowIndex && selectedCell?.[1] === colIndex;
            const related = !isSelected && (isSameRow(rowIndex) || isSameCol(colIndex) || isSameBox(rowIndex, colIndex));
            const sameValueHighlight = isSameValue(cell.value);
            
            // 计算边框样式
            const borderRight = (colIndex + 1) % 3 === 0 && colIndex !== 8 ? 'border-r-2 border-r-gray-800' : 'border-r border-r-gray-300';
            const borderBottom = (rowIndex + 1) % 3 === 0 && rowIndex !== 8 ? 'border-b-2 border-b-gray-800' : 'border-b border-b-gray-300';

            return (
              <button
                key={`${rowIndex}-${colIndex}`}
                onClick={() => selectCell(rowIndex, colIndex)}
                className={cn(
                  "aspect-square flex items-center justify-center text-2xl sm:text-3xl font-semibold transition-all duration-150 outline-none select-none",
                  borderRight,
                  borderBottom,
                  isSelected && "bg-blue-500 text-white",
                  !isSelected && related && "bg-blue-100",
                  !isSelected && sameValueHighlight && !cell.error && "bg-blue-200",
                  !isSelected && !related && !sameValueHighlight && "bg-white hover:bg-gray-50",
                  cell.error && !isSelected && "bg-red-100",
                  cell.error && isSelected && "bg-red-500",
                  cell.fixed && !cell.error && !isSelected && "text-gray-800",
                  cell.fixed && !cell.error && isSelected && "text-white",
                  !cell.fixed && !cell.error && !isSelected && "text-blue-600",
                  !cell.fixed && !cell.error && isSelected && "text-white",
                  cell.error && !isSelected && "text-red-600",
                  cell.error && isSelected && "text-white"
                )}
              >
                {cell.value}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};
