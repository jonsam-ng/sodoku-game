import React from 'react';
import { SudokuBoard } from '@/components/SudokuBoard';
import { NumberPad } from '@/components/NumberPad';
import { DifficultySelector } from '@/components/DifficultySelector';
import { ControlButtons } from '@/components/ControlButtons';
import { WinModal } from '@/components/WinModal';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <div className="max-w-lg mx-auto">
        {/* 标题 */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">数独</h1>
          <p className="text-gray-500">挑战你的思维</p>
        </div>

        {/* 难度选择 */}
        <div className="mb-4">
          <DifficultySelector />
        </div>

        {/* 数独棋盘 */}
        <div className="mb-4">
          <SudokuBoard />
        </div>

        {/* 控制按钮 */}
        <div className="mb-4">
          <ControlButtons />
        </div>

        {/* 数字键盘 */}
        <div>
          <NumberPad />
        </div>

        {/* 胜利弹窗 */}
        <WinModal />
      </div>
    </div>
  );
}