import React from 'react';
import { useSudokuStore } from '@/store/useSudokuStore';

export const NumberPad: React.FC = () => {
  const { setCellValue, selectedCell, board } = useSudokuStore();

  const canEdit = selectedCell && !board[selectedCell[0]][selectedCell[1]].fixed;

  return (
    <div className="bg-white rounded-2xl shadow-xl p-4">
      <div className="grid grid-cols-5 gap-3">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <button
            key={num}
            onClick={() => canEdit && setCellValue(num)}
            disabled={!canEdit}
            className={`
              aspect-square flex items-center justify-center text-2xl font-semibold rounded-xl
              transition-all duration-150 active:scale-95
              ${canEdit 
                ? 'bg-gray-100 hover:bg-blue-100 text-gray-800' 
                : 'bg-gray-50 text-gray-300 cursor-not-allowed'}
            `}
          >
            {num}
          </button>
        ))}
        <button
          onClick={() => canEdit && setCellValue(null)}
          disabled={!canEdit}
          className={`
            col-span-1 flex items-center justify-center text-xl font-semibold rounded-xl
            transition-all duration-150 active:scale-95
            ${canEdit 
              ? 'bg-red-100 hover:bg-red-200 text-red-600' 
              : 'bg-gray-50 text-gray-300 cursor-not-allowed'}
          `}
        >
          ⌫
        </button>
      </div>
    </div>
  );
};
