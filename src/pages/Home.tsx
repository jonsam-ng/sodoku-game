import Sudoku from '../components/Sudoku';
import { useTheme } from '../hooks/useTheme';

export default function Home() {
  const { theme, toggleTheme } = useTheme();

  const getThemeIcon = () => {
    if (theme === 'system') return '⚙️';
    if (theme === 'dark') return '🌙';
    return '☀️';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center py-8 relative">
      {/* 主题切换按钮 */}
      <button
        onClick={toggleTheme}
        className="absolute top-4 right-4 p-3 rounded-full bg-white dark:bg-gray-700 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 active:scale-95"
        aria-label="Toggle theme"
      >
        <span className="text-2xl">{getThemeIcon()}</span>
      </button>
      
      <Sudoku />
    </div>
  );
}
