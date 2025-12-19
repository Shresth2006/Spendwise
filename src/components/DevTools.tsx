import { useState } from 'react';
import { Code2 } from 'lucide-react';

interface DevToolsProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
}

export default function DevTools({ currentScreen, onNavigate }: DevToolsProps) {
  const [isOpen, setIsOpen] = useState(false);

  const screens = [
    { id: 'splash', name: '🎬 Splash' },
    { id: 'auth', name: '🔐 Auth' },
    { id: 'welcome', name: '👋 Welcome' },
    { id: 'categoryPersonalization', name: '📂 Categories' },
    { id: 'budgetSetup', name: '💰 Budget Setup' },
    { id: 'home', name: '🏠 Home' },
    { id: 'budgetPrediction', name: '📈 Prediction' },
    { id: 'goals', name: '🎯 Goals' },
    { id: 'calendar', name: '📅 Calendar' },
    { id: 'groupExpenses', name: '👥 Group' },
    { id: 'addExpense', name: '➕ Add' },
    { id: 'analytics', name: '📊 Analytics' },
    { id: 'settings', name: '⚙️ Settings' },
  ];

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="absolute top-4 right-4 z-50 w-10 h-10 bg-gray-800 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-700 transition-colors"
        title="Dev Tools - Navigate Screens"
      >
        <Code2 className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className="absolute top-4 right-4 z-50 bg-gray-800 text-white rounded-2xl shadow-2xl p-4 w-64">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">Screen Navigator</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-400 hover:text-white"
        >
          ✕
        </button>
      </div>
      <div className="space-y-1 max-h-96 overflow-y-auto">
        {screens.map(screen => (
          <button
            key={screen.id}
            onClick={() => {
              onNavigate(screen.id);
              setIsOpen(false);
            }}
            className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
              currentScreen === screen.id
                ? 'bg-purple-600 text-white'
                : 'hover:bg-gray-700 text-gray-300'
            }`}
          >
            {screen.name}
          </button>
        ))}
      </div>
      <p className="text-gray-500 text-xs mt-3">
        Click any screen to navigate
      </p>
    </div>
  );
}
