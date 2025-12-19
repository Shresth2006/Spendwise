import { Home, Calendar, Target, TrendingUp, Settings } from 'lucide-react';

interface BottomNavigationProps {
  active: string;
  onNavigate: (screen: string) => void;
}

export default function BottomNavigation({ active, onNavigate }: BottomNavigationProps) {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-purple-100 dark:border-gray-700 px-4 pb-6 pt-3">
      <div className="flex justify-around items-center">
        {tabs.map(({ id, label, icon: Icon }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              className={`flex flex-col items-center gap-1 transition-colors ${
                isActive ? 'text-purple-600 dark:text-purple-400' : 'text-purple-300 dark:text-gray-500'
              }`}
            >
              <Icon className="w-6 h-6" strokeWidth={isActive ? 2 : 1.5} />
              <span className="text-xs">{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}