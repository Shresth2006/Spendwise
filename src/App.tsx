import 'react-native-gesture-handler'; 
import * as React from 'react';
import { useState, useMemo, useEffect } from 'react';
import { StatusBar } from 'react-native';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// FIXED: Import SafeAreaProvider to resolve the "just loading" layout issue
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Theme & Context
import { DarkModeProvider, useDarkMode } from './components/DarkModeProvider';
import { palette } from './styles/theme';

// Hooks & Services
// FIXED: Import your SMS listener hook
import { useSmsListener } from './services/smsListener';

// Screens
import SplashScreen from './components/screens/SplashScreen';
import AuthScreen from './components/screens/AuthScreen';
import WelcomeScreen from './components/screens/WelcomeScreen';
import HomeDashboard from './components/screens/HomeDashboard';
import SpendingCalendar from './components/screens/SpendingCalendar';
import Analytics from './components/screens/Analytics';
import GroupExpenses from './components/screens/GroupExpenses';
import GoalsSavings from './components/screens/GoalsSavings';
import CategoryPersonalization from './components/screens/CategoryPersonalization';
import BudgetSetup from './components/screens/BudgetSetup';
import BudgetPrediction from './components/screens/BudgetPrediction';
import AddExpense from './components/screens/AddExpense';
import Settings from './components/screens/Settings';

export type RootStackParamList = {
  Splash: undefined;
  Welcome: undefined;
  Auth: undefined;
  Home: undefined;
  Calendar: undefined;
  Analytics: undefined;
  GroupExpenses: undefined;
  Goals: undefined;
  CategoryPersonalization: undefined;
  BudgetSetup: undefined;
  BudgetPrediction: undefined;
  AddExpense: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function AppNavigation() {
  const { darkMode } = useDarkMode();
  const colors = darkMode ? palette.dark : palette.light;

  // FIXED: Start the Real-time SMS Listener


  const [goals, setGoals] = useState<any[]>([]);

  const handleAddGoal = (goalData: { name: string; target: number; deadline: string }) => {
    const newGoal = {
      id: Date.now(),
      name: goalData.name,
      target: goalData.target,
      current: 0,
      deadline: goalData.deadline,
      suggestedDaily: Math.round(goalData.target / 30),
      color: '#9333ea',
    };
    setGoals((prev) => [...prev, newGoal]);
  };

  const navigationTheme = useMemo(() => ({
    ...(darkMode ? DarkTheme : DefaultTheme),
    colors: {
      ...(darkMode ? DarkTheme.colors : DefaultTheme.colors),
      background: colors.background,
      card: colors.card,
      text: colors.foreground,
      border: colors.border,
      primary: colors.primary,
    },
  }), [darkMode, colors]);

  return (
    <NavigationContainer theme={navigationTheme}>
      <StatusBar
        barStyle={darkMode ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />

      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
          animation: 'fade',
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Welcome" component={WelcomeScreen as any} />
        <Stack.Screen name="Auth" component={AuthScreen as any} />
        
        {/* FIXED: Pass goals to HomeDashboard so circular progress bar works */}
        <Stack.Screen name="Home">
          {(props) => (
            <HomeDashboard 
              {...props} 
              userName="User" 
              goals={goals} 
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="Calendar" component={SpendingCalendar as any} />
        <Stack.Screen name="Analytics" component={Analytics as any} />
        <Stack.Screen name="GroupExpenses" component={GroupExpenses as any} />
        
        <Stack.Screen name="Goals">
          {(props) => (
            <GoalsSavings 
              {...props} 
              goals={goals} 
              onAddGoal={handleAddGoal} 
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="CategoryPersonalization" component={CategoryPersonalization as any} />
        <Stack.Screen name="BudgetSetup" component={BudgetSetup as any} />
        <Stack.Screen name="BudgetPrediction" component={BudgetPrediction as any} />
        <Stack.Screen name="AddExpense" component={AddExpense as any} />
        <Stack.Screen name="Settings" component={Settings as any} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  useSmsListener();
  return (
    // FIXED: SafeAreaProvider is required for modern SafeAreaView layout calculation
    <SafeAreaProvider>
      <DarkModeProvider>
        <AppNavigation />
      </DarkModeProvider>
    </SafeAreaProvider>
  );
}