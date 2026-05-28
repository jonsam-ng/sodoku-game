import React from 'react';
import { useSudokuStore } from '@/store/useSudokuStore';
import { Trophy, X } from 'lucide-react';

export const WinModal: React.FC = () => {
  const { isWon, newGame } = useSudokuStore();

  if (!isWon) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="mb-6">
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-10 h-10 text-yellow-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">恭喜你！</h2>
          <p className="text-gray-600">你成功完成了这局数独！</p>
        </div>
        
        <button
          onClick={newGame}
          className="w-full py-4 px-6 bg-blue-500 hover:bg-blue-600 text-white text-lg font-semibold rounded-2xl transition-all duration-200 active:scale-95 shadow-lg"
        >
          再来一局
        </button>
      </div>
    </div>
  );
};
