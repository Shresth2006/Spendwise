import { useState, useEffect } from 'react';
import SplashScreen from './components/screens/SplashScreen';
import AuthScreen from './components/screens/AuthScreen';
import WelcomeScreen from './components/screens/WelcomeScreen';
import CategoryPersonalization from './components/screens/CategoryPersonalization';
import BudgetSetup from './components/screens/BudgetSetup';
import HomeDashboard from './components/screens/HomeDashboard';
import BudgetPrediction from './components/screens/BudgetPrediction';
import GoalsSavings from './components/screens/GoalsSavings';
import SpendingCalendar from './components/screens/SpendingCalendar';
import GroupExpenses from './components/screens/GroupExpenses';
import AddExpense from './components/screens/AddExpense';
import Analytics from './components/screens/Analytics';
import Settings from './components/screens/Settings';
import DevTools from './components/DevTools';
import { DarkModeProvider } from './components/DarkModeProvider';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('splash');
  const [userName, setUserName] = useState('Alex');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['Miscellaneous']);
  const [budgetData, setBudgetData] = useState({
    monthly: 50000,
    categories: {} as Record<string, number>
  });
  const [goals, setGoals] = useState([
    {
      id: 1,
      name: 'Emergency Fund',
      target: 100000,
      current: 45000,
      deadline: 'Dec 2025',
      color: 'from-purple-500 to-purple-600',
      suggestedDaily: 300
    },
    {
      id: 2,
      name: 'New Laptop',
      target: 80000,
      current: 52000,
      deadline: 'Mar 2025',
      color: 'from-blue-500 to-blue-600',
      suggestedDaily: 450
    },
    {
      id: 3,
      name: 'Vacation to Goa',
      target: 35000,
      current: 12000,
      deadline: 'Jun 2025',
      color: 'from-indigo-500 to-indigo-600',
      suggestedDaily: 200
    },
  ]);

  useEffect(() => {
    // Auto-navigate from splash to auth after 2 seconds
    if (currentScreen === 'splash') {
      const timer = setTimeout(() => {
        setCurrentScreen('auth');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [currentScreen]);

  const handleAuthComplete = () => {
    setCurrentScreen('welcome');
  };

  const handleWelcomeComplete = (name: string) => {
    setUserName(name);
    setCurrentScreen('categoryPersonalization');
  };

  const handleCategoriesComplete = (categories: string[]) => {
    setSelectedCategories(categories);
    setCurrentScreen('budgetSetup');
  };

  const handleBudgetComplete = (budget: any) => {
    setBudgetData(budget);
    setCurrentScreen('home');
  };

  const navigateTo = (screen: string) => {
    setCurrentScreen(screen);
  };

  const handleLogout = () => {
    // Reset user state
    setUserName('Alex');
    setSelectedCategories(['Miscellaneous']);
    setBudgetData({
      monthly: 50000,
      categories: {}
    });
    // Navigate back to auth screen
    setCurrentScreen('auth');
  };

  const handleAddGoal = (newGoal: any) => {
    const goalWithId = {
      ...newGoal,
      id: goals.length + 1,
      current: 0,
      color: ['from-purple-500 to-purple-600', 'from-blue-500 to-blue-600', 'from-indigo-500 to-indigo-600', 'from-pink-500 to-pink-600'][goals.length % 4],
      suggestedDaily: Math.round((newGoal.target / 180)) // Rough calculation for daily savings
    };
    setGoals([...goals, goalWithId]);
  };

  return (
    <DarkModeProvider>
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        {/* Dev Tools - Screen Navigator */}
        <DevTools currentScreen={currentScreen} onNavigate={navigateTo} />
        
        {/* Mobile Frame Container */}
        <div className="relative w-[393px] h-[852px] bg-white dark:bg-gray-800 rounded-[40px] shadow-2xl overflow-hidden">
          {/* Screen Content */}
          {currentScreen === 'splash' && <SplashScreen />}
          {currentScreen === 'auth' && <AuthScreen onComplete={handleAuthComplete} />}
          {currentScreen === 'welcome' && <WelcomeScreen onComplete={handleWelcomeComplete} />}
          {currentScreen === 'categoryPersonalization' && (
            <CategoryPersonalization 
              onComplete={handleCategoriesComplete}
              initialSelected={selectedCategories}
            />
          )}
          {currentScreen === 'budgetSetup' && (
            <BudgetSetup 
              categories={selectedCategories}
              onComplete={handleBudgetComplete}
            />
          )}
          {currentScreen === 'home' && (
            <HomeDashboard 
              userName={userName}
              navigateTo={navigateTo}
            />
          )}
          {currentScreen === 'budgetPrediction' && (
            <BudgetPrediction navigateTo={navigateTo} />
          )}
          {currentScreen === 'goals' && (
            <GoalsSavings navigateTo={navigateTo} goals={goals} onAddGoal={handleAddGoal} />
          )}
          {currentScreen === 'calendar' && (
            <SpendingCalendar navigateTo={navigateTo} />
          )}
          {currentScreen === 'groupExpenses' && (
            <GroupExpenses navigateTo={navigateTo} />
          )}
          {currentScreen === 'addExpense' && (
            <AddExpense navigateTo={navigateTo} />
          )}
          {currentScreen === 'analytics' && (
            <Analytics navigateTo={navigateTo} />
          )}
          {currentScreen === 'settings' && (
            <Settings userName={userName} navigateTo={navigateTo} onLogout={handleLogout} />
          )}
        </div>
      </div>
    </DarkModeProvider>
  );
}