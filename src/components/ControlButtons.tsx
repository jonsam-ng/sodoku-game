import React from 'react';
import { useSudokuStore } from '@/store/useSudokuStore';
import { CheckCircle2, Lightbulb, RotateCcw, Plus } from 'lucide-react';

export const ControlButtons: React.FC = () => {
  const { checkBoard, getHint, resetBoard, newGame } = useSudokuStore();

  return (
    <div className="bg-white rounded-2xl shadow-xl p-4">
      <div className="grid grid-cols-4 gap-3">
        <button
          onClick={checkBoard}
          className="flex flex-col items-center gap-1 py-3 px-2 rounded-xl bg-green-50 hover:bg-green-100 text-green-600 transition-all duration-150 active:scale-95"
        >
          <CheckCircle2 className="w-6 h-6" />
          <span className="text-xs font-semibold">检查</span>
        </button>
        
        <button
          onClick={getHint}
          className="flex flex-col items-center gap-1 py-3 px-2 rounded-xl bg-yellow-50 hover:bg-yellow-100 text-yellow-600 transition-all duration-150 active:scale-95"
        >
          <Lightbulb className="w-6 h-6" />
          <span className="text-xs font-semibold">提示</span>
        </button>
        
        <button
          onClick={resetBoard}
          className="flex flex-col items-center gap-1 py-3 px-2 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-600 transition-all duration-150 active:scale-95"
        >
          <RotateCcw className="w-6 h-6" />
          <span className="text-xs font-semibold">重置</span>
        </button>
        
        <button
          onClick={newGame}
          className="flex flex-col items-center gap-1 py-3 px-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-600 transition-all duration-150 active:scale-95"
        >
          <Plus className="w-6 h-6" />
          <span className="text-xs font-semibold">新游戏</span>
        </button>
      </div>
    </div>
  );
};
