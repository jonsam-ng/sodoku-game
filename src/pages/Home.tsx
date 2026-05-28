import Sudoku from '../components/Sudoku';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center py-8">
      <Sudoku />
    </div>
  );
}