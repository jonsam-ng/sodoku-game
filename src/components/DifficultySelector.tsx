import React from 'react';
import { useSudokuStore } from '@/store/useSudokuStore';
import { Difficulty } from '@/utils/sudoku';

interface DifficultyOption {
  value: Difficulty;
  label: string;
}

const difficulties: DifficultyOption[] = [
  { value: 'easy', label: '简单' },
  { value: 'medium', label: '中等' },
  { value: 'hard', label: '复杂' }
];

export const DifficultySelector: React.FC = () => {
  const { difficulty, setDifficulty, newGame } = useSudokuStore();

  const handleDifficultyChange = (newDifficulty: Difficulty) => {
    if (newDifficulty !== difficulty) {
      setDifficulty(newDifficulty);
      newGame();
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-4">
      <div className="flex items-center gap-4">
        <span className="text-gray-600 font-medium whitespace-nowrap">难度:</span>
        <div className="flex-1 flex bg-gray-100 rounded-xl p-1">
          {difficulties.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => handleDifficultyChange(value)}
              className={`
                flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all duration-200
                ${difficulty === value 
                  ? 'bg-blue-500 text-white shadow-md transform scale-105' 
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-200'}
              `}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
