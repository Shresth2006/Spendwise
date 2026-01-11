import 'react-native-gesture-handler';
import * as React from 'react';
import { StatusBar, Platform, LogBox } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { DarkModeProvider, useDarkMode } from './components/DarkModeProvider';
import { palette } from './styles/theme';
import { useSmsListener } from './services/smsListener';
import { goalService } from './services/api'; // Import your service

// Screens
import SplashScreen from './components/screens/SplashScreen';
import WelcomeScreen from './components/screens/WelcomeScreen';
import AuthScreen from './components/screens/AuthScreen';
import HomeDashboard from './components/screens/HomeDashboard';
import SpendingCalendar from './components/screens/SpendingCalendar';
import Analytics from './components/screens/Analytics';
import GoalsSavings from './components/screens/GoalsSavings';
import Settings from './components/screens/Settings';
import AddExpense from './components/screens/AddExpense';
import BudgetSetup from './components/screens/BudgetSetup';
import BudgetPrediction from './components/screens/BudgetPrediction';
import CategoryPersonalization from './components/screens/CategoryPersonalization';
import GroupExpenses from './components/screens/GroupExpenses';
import AlertsScreen from './components/screens/AlertsScreen'; 

const Stack = createNativeStackNavigator();

function AppNavigation() {
  const { darkMode } = useDarkMode();
  const colors = darkMode ? palette.dark : palette.light;

  const [initializing, setInitializing] = React.useState(true);
  const [isSplashVisible, setIsSplashVisible] = React.useState(true);
  const [user, setUser] = React.useState<FirebaseAuthTypes.User | null>(null);
  const [isProfileComplete, setIsProfileComplete] = React.useState(false);

  // --- FINANCIAL STATE ---
  const [goals, setGoals] = React.useState<any[]>([]);
  const [totalSpendable, setTotalSpendable] = React.useState(0);
  const [monthlyLimit, setMonthlyLimit] = React.useState(0);

  // 1. Load initial data from AsyncStorage (for speed)
  React.useEffect(() => {
    const loadLocalData = async () => {
      try {
        const [g, s, l] = await Promise.all([
          AsyncStorage.getItem('@user_goals'),
          AsyncStorage.getItem('@total_spendable'),
          AsyncStorage.getItem('@monthly_limit')
        ]);
        if (g) setGoals(JSON.parse(g));
        if (s) setTotalSpendable(JSON.parse(s));
        if (l) setMonthlyLimit(JSON.parse(l));
      } catch (e) { console.error(e); }
    };
    loadLocalData();
  }, []);

  // 2. Fetch fresh data from Cloud when user logs in (for accuracy)
  React.useEffect(() => {
    if (user) {
        const syncWithCloud = async () => {
            try {
                const cloudGoals = await goalService.getAll();
                if (cloudGoals.length > 0) setGoals(cloudGoals);
            } catch (e) { console.log("Cloud sync delayed..."); }
        };
        syncWithCloud();
    }
  }, [user]);

  // Sync state back to local storage whenever it changes
  React.useEffect(() => {
    const saveData = async () => {
      try {
        await AsyncStorage.setItem('@user_goals', JSON.stringify(goals));
        await AsyncStorage.setItem('@total_spendable', JSON.stringify(totalSpendable));
        await AsyncStorage.setItem('@monthly_limit', JSON.stringify(monthlyLimit));
      } catch (e) { console.error(e); }
    };
    saveData();
  }, [goals, totalSpendable, monthlyLimit]);

  const handleUpdateGoal = (updatedGoal: any) => {
    setGoals(prev => prev.map(g => g.id === updatedGoal.id ? updatedGoal : g));
  };

  const handleAddGoal = (newGoal: any) => {
    setGoals(prev => [...prev, newGoal]);
  };

  const handleDeleteGoal = (id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  const checkProfileStatus = async () => {
    const currentUser = auth().currentUser;
    if (currentUser) {
      await currentUser.reload();
      const updatedUser = auth().currentUser;
      setIsProfileComplete(updatedUser?.displayName?.includes('| DONE') || false);
      setUser(updatedUser);
    }
  };

  React.useEffect(() => {
    const timer = setTimeout(() => setIsSplashVisible(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  React.useEffect(() => {
    const subscriber = auth().onAuthStateChanged((userState) => {
      setUser(userState);
      setIsProfileComplete(userState?.displayName?.includes('| DONE') || false);
      if (initializing) setInitializing(false);
    });
    return subscriber;
  }, [initializing]);

  const navTheme = React.useMemo(() => ({
    ...(darkMode ? DarkTheme : DefaultTheme),
    colors: { 
      ...(darkMode ? DarkTheme.colors : DefaultTheme.colors), 
      background: colors.background, 
      card: colors.card, 
      text: colors.foreground, 
      border: colors.border, 
      primary: colors.primary 
    },
  }), [darkMode, colors]);

  const getCleanName = () => user?.displayName?.split('|')[0].trim() || "User";

  return (
    <NavigationContainer theme={navTheme}>
      <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />
      <Stack.Navigator screenOptions={{ headerShown: false, animation: Platform.OS === 'android' ? 'fade_from_bottom' : 'default' }}>
        {(isSplashVisible || initializing) ? (
          <Stack.Screen name="Splash" component={SplashScreen} />
        ) : !user ? (
          <Stack.Screen name="Auth" component={AuthScreen} />
        ) : (
          <Stack.Group>
            {!isProfileComplete ? (
              <>
                <Stack.Screen name="Welcome" component={WelcomeScreen} />
                <Stack.Screen name="CategoryPersonalization" component={CategoryPersonalization as any} />
                <Stack.Screen name="BudgetSetup">
                  {(props) => (
                    <BudgetSetup 
                      {...props} 
                      onComplete={checkProfileStatus} 
                      setGlobalBalances={(s: number, l: number) => {
                        setTotalSpendable(s); 
                        setMonthlyLimit(l);
                      }} 
                    />
                  )}
                </Stack.Screen>
              </>
            ) : (
              <>
                <Stack.Screen name="Home">
                  {(props) => (
                    <HomeDashboard 
                      {...props} 
                      userName={getCleanName()} 
                      goals={goals} 
                      totalSpendable={totalSpendable} 
                      monthlyLimit={monthlyLimit} 
                    />
                  )}
                </Stack.Screen>
                
                <Stack.Screen name="Goals">
                  {(props) => (
                    <GoalsSavings 
                      {...props} 
                      goals={goals} 
                      totalSpendable={totalSpendable} 
                      monthlyLimit={monthlyLimit} 
                      onAddGoal={handleAddGoal} 
                      onUpdateGoal={handleUpdateGoal} 
                      onDeleteGoal={handleDeleteGoal}
                      setGlobalBalances={(s: number, l: number) => {
                        setTotalSpendable(s);
                        setMonthlyLimit(l);
                      }}
                    />
                  )}
                </Stack.Screen>

                <Stack.Screen name="Analytics">
                   {(props) => <Analytics {...props} goals={goals} />}
                </Stack.Screen>

                <Stack.Screen name="Calendar">
                   {(props) => <SpendingCalendar {...props} goals={goals} />}
                </Stack.Screen>

                <Stack.Screen name="Settings">
                  {(props) => (
                    <Settings 
                      {...props} 
                      userName={getCleanName()} 
                      totalSpendable={totalSpendable} 
                      monthlyLimit={monthlyLimit} 
                      setTotalSpendable={setTotalSpendable} 
                      setMonthlyLimit={setMonthlyLimit} 
                      onLogout={() => auth().signOut()} 
                    />
                  )}
                </Stack.Screen>

                <Stack.Screen name="Alerts" component={AlertsScreen} /> 
                <Stack.Screen name="AddExpense" component={AddExpense as any} />
                <Stack.Screen name="BudgetPrediction" component={BudgetPrediction as any} />
                <Stack.Screen name="GroupExpenses" component={GroupExpenses as any} />
              </>
            )}
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  useSmsListener();
  return (
    <SafeAreaProvider>
      <DarkModeProvider>
        <AppNavigation />
      </DarkModeProvider>
    </SafeAreaProvider>
  );
}