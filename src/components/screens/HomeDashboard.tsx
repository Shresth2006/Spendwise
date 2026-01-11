import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Plus, Target, ChevronRight, Zap, 
  ShoppingCart, Utensils, Home, Car, Heart, 
  Smartphone, Music, CreditCard, MoreHorizontal, Bell 
} from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Circle } from 'react-native-svg';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import { useDarkMode } from '../DarkModeProvider';
import BottomNavigation from '../BottomNavigation';
// FIXED: Added reminderService to imports
import { transactionService, reminderService } from '../../services/api'; 

const { width } = Dimensions.get('window');

const getCategoryMetadata = (name: string) => {
  const normalized = name.toLowerCase().trim();
  const meta: { [key: string]: { icon: any; color: string; tint: string } } = {
    food: { icon: Utensils, color: '#F87171', tint: '#FEF2F2' },
    dining: { icon: Utensils, color: '#F87171', tint: '#FEF2F2' },
    groceries: { icon: ShoppingCart, color: '#F87171', tint: '#FEF2F2' },
    shopping: { icon: ShoppingCart, color: '#FB923C', tint: '#FFF7ED' },
    clothing: { icon: ShoppingCart, color: '#FB923C', tint: '#FFF7ED' },
    housing: { icon: Home, color: '#34D399', tint: '#ECFDF5' },
    bills: { icon: CreditCard, color: '#94A3B8', tint: '#F8FAFC' },
    transport: { icon: Car, color: '#60A5FA', tint: '#EFF6FF' },
    health: { icon: Heart, color: '#F472B6', tint: '#FDF2F8' },
    healthcare: { icon: Heart, color: '#F472B6', tint: '#FDF2F8' },
    electronics: { icon: Smartphone, color: '#22D3EE', tint: '#ECFEFF' },
    entertainment: { icon: Music, color: '#818CF8', tint: '#EEF2FF' },
  };
  return meta[normalized] || { icon: MoreHorizontal, color: '#94A3B8', tint: '#F8FAFC' };
};

export default function HomeDashboard({ userName, totalSpendable, monthlyLimit, goals = [] }: any) {
  const navigation = useNavigation<any>();
  const { darkMode: isDark } = useDarkMode();
  
  const [transactions, setTransactions] = useState<any[]>([]);
  const [budgetData, setBudgetData] = useState<any>({ monthly_limit: 0, category_budgets: {} });
  const [reminders, setReminders] = useState<any[]>([]); // New state for reminders
  const [loading, setLoading] = useState(true);

  // Calculate dynamic savings total from goals
  const goalTotal = useMemo(() => {
    return goals.reduce((sum: number, g: any) => sum + (Number(g.current) || 0), 0);
  }, [goals]);

  // FIXED: Logic to check for alerts due TODAY
  const hasAlert = useMemo(() => {
    const today = new Date().toLocaleDateString('en-GB'); // DD/MM/YYYY
    return reminders.some(rem => rem.dueDate === today);
  }, [reminders]);

  const loadData = async () => {
    try {
      const user = auth().currentUser;
      // If no user, don't attempt to fetch reminders to prevent crash
      const [txs, bgt, rems] = await Promise.all([
        transactionService.getAll(),
        transactionService.getUserBudgets(), 
        user ? reminderService.getAll() : Promise.resolve([]) // Fixed Service call
      ]);
      setTransactions(txs || []);
      setBudgetData(bgt || { monthly_limit: 0, category_budgets: {} });
      setReminders(rems || []);
    } catch (e) { 
      console.error("Dashboard Load Error:", e); 
    } finally { 
      setLoading(false); 
    }
  };

  useFocusEffect(useCallback(() => { loadData(); }, []));

  const stats = useMemo(() => {
    const expenses = transactions.filter((t) => t.direction === 'debit' || t.direction === 'expense');
    const spent = expenses.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
    
    const spendMap: { [key: string]: number } = {};
    expenses.forEach(t => {
      const cat = t.category || 'Other';
      spendMap[cat] = (spendMap[cat] || 0) + (Number(t.amount) || 0);
    });

    const breakdown = Object.entries(budgetData.category_budgets || {}).map(([name, limit]) => ({
      name,
      amount: spendMap[name] || 0,
      budget: Number(limit) || 1, 
    })).sort((a, b) => b.amount - a.amount);

    return { 
      spent, 
      breakdown, 
      percent: monthlyLimit > 0 ? (spent / monthlyLimit) * 100 : 0 
    };
  }, [transactions, budgetData, monthlyLimit]);

  if (loading) {
    return (
      <View style={[styles.root, { justifyContent: 'center', backgroundColor: isDark ? '#000' : '#F8F9FE' }]}>
        <ActivityIndicator size="large" color="#6366F1" />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <LinearGradient 
        colors={isDark ? ['#0F172A', '#020617'] : ['#F8FAFC', '#F1F5F9']} 
        style={StyleSheet.absoluteFill} 
      />

      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <View style={styles.header}>
            <View>
              <Text style={[styles.greeting, { color: isDark ? '#FFF' : '#0F172A' }]}>Hi, {userName?.split(' ')[0]} ✨</Text>
              <View style={styles.walletBadge}>
                 <Zap size={14} color="#6366F1" fill="#6366F1" />
                 <Text style={[styles.walletText, { color: isDark ? '#94A3B8' : '#64748B' }]}>₹{totalSpendable?.toLocaleString()} Available</Text>
              </View>
            </View>
            <View style={styles.headerRight}>
               {/* NOTIFICATION BELL WITH RED DOT */}
               <TouchableOpacity onPress={() => navigation.navigate('Alerts')} style={styles.notificationBtn}>
                  <View>
                    <Bell size={24} color={isDark ? '#FFF' : '#0F172A'} />
                    {hasAlert && <View style={styles.redDot} />}
                  </View>
               </TouchableOpacity>
               
               <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
                <LinearGradient colors={['#6366F1', '#4F46E5']} style={styles.avatar}>
                  <Text style={styles.avatarTxt}>{userName?.[0]}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>

          <LinearGradient colors={['#6366F1', '#4F46E5']} start={{x:0, y:0}} end={{x:1, y:1}} style={styles.mainCard}>
            <View style={styles.cardContent}>
              <View>
                <Text style={styles.cardLabelText}>MONTHLY SPENDING</Text>
                <Text style={styles.mainAmountText}>₹{stats.spent.toLocaleString()}</Text>
                <View style={styles.limitPill}>
                  <Text style={styles.limitText}>Limit: ₹{monthlyLimit.toLocaleString()}</Text>
                </View>
              </View>
              <View style={styles.chartBox}>
                <Svg height="80" width="80" style={{ transform: [{ rotate: '-90deg' }] }}>
                  <Circle stroke="rgba(255,255,255,0.2)" fill="transparent" strokeWidth="8" r="32" cx="40" cy="40" />
                  <Circle 
                    stroke="#FFF" 
                    fill="transparent" 
                    strokeWidth="8" 
                    strokeDasharray={201} 
                    strokeDashoffset={201 - (Math.min(stats.percent, 100) / 100) * 201} 
                    strokeLinecap="round" 
                    r="32" cx="40" cy="40" 
                  />
                </Svg>
                <View style={styles.abs}><Text style={styles.percentTxt}>{stats.percent.toFixed(0)}%</Text></View>
              </View>
            </View>
          </LinearGradient>

          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: isDark ? '#FFF' : '#0F172A' }]}>Goal Achievement</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Goals')}><ChevronRight size={20} color="#6366F1" /></TouchableOpacity>
          </View>
          <View style={[styles.goalCard, { backgroundColor: isDark ? '#1E293B' : '#FFF', borderColor: isDark ? '#334155' : '#E2E8F0' }]}>
            <View style={styles.goalRow}>
              <View style={[styles.goalIconContainer, { backgroundColor: '#6366F115' }]}>
                <Target size={24} color="#6366F1" />
              </View>
              <View style={{ flex: 1, marginLeft: 15 }}>
                <Text style={styles.goalLabel}>TOTAL SAVED</Text>
                <Text style={[styles.goalValue, { color: isDark ? '#FFF' : '#0F172A' }]}>₹{goalTotal.toLocaleString()}</Text>
              </View>
            </View>
          </View>

          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: isDark ? '#FFF' : '#0F172A' }]}>Budget Tracking</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Settings')}><Text style={styles.seeAllText}>Manage</Text></TouchableOpacity>
          </View>

          <View style={styles.budgetGrid}>
            {stats.breakdown.map((item, index) => {
              const { icon: Icon, color } = getCategoryMetadata(item.name);
              const progress = Math.min((item.amount / item.budget) * 100, 100);
              const isOver = item.amount > item.budget;

              return (
                <View 
                  key={`${item.name}-${index}`} 
                  style={[
                    styles.budgetCard, 
                    { 
                      backgroundColor: isDark ? '#1E293B' : '#FFFFFF', 
                      borderColor: isDark ? '#334155' : '#E2E8F0'
                    }
                  ]}
                >
                  <View style={styles.cardMainContent}>
                    <View style={styles.budgetRow}>
                      <View style={styles.leftInfo}>
                        <View style={[styles.iconBox, { backgroundColor: color + '15' }]}>
                          <Icon size={16} color={color} />
                        </View>
                        <Text style={[styles.catName, { color: isDark ? '#E2E8F0' : '#334155' }]} numberOfLines={1}>
                          {item.name}
                        </Text>
                      </View>

                      <View style={styles.rightInfo}>
                        <Text style={[styles.spentAmount, { color: isDark ? '#F8FAFC' : '#1E293B' }]}>
                          ₹{item.amount.toLocaleString()}
                        </Text>
                        <Text style={styles.limitLabel}> / {item.budget.toLocaleString()}</Text>
                      </View>
                    </View>

                    <View style={styles.progressContainer}>
                      <View style={[styles.progressBg, { backgroundColor: isDark ? '#0F172A' : '#F1F5F9' }]}>
                        <View 
                          style={[
                            styles.progressFill, 
                            { width: `${progress}%`, backgroundColor: isOver ? '#EF4444' : color }
                          ]} 
                        />
                      </View>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        </ScrollView>

        <BottomNavigation />
        
        <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('AddExpense')}>
          <LinearGradient colors={['#6366F1', '#4F46E5']} style={styles.fabGrad}>
            <Plus size={32} color="#FFF" />
          </LinearGradient>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 160, paddingTop: 15 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  greeting: { fontSize: 26, fontWeight: '900', letterSpacing: -0.5 },
  walletBadge: { flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 6 },
  walletText: { fontSize: 13, fontWeight: '700' },
  notificationBtn: { padding: 8, position: 'relative' },
  redDot: {
    position: 'absolute',
    right: 8,
    top: 8,
    width: 10,
    height: 10,
    backgroundColor: '#EF4444',
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  avatar: { width: 45, height: 45, borderRadius: 15, justifyContent: 'center', alignItems: 'center', elevation: 4 },
  avatarTxt: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  
  mainCard: { borderRadius: 30, padding: 25, marginBottom: 30, elevation: 8 },
  cardContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardLabelText: { fontSize: 11, color: 'rgba(255,255,255,0.7)', fontWeight: '900', letterSpacing: 1 },
  mainAmountText: { fontSize: 34, fontWeight: '900', color: '#FFF', marginTop: 4 },
  limitPill: { marginTop: 12, backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20, alignSelf: 'flex-start' },
  limitText: { fontSize: 11, color: '#FFF', fontWeight: '800' },
  chartBox: { justifyContent: 'center', alignItems: 'center' },
  abs: { position: 'absolute' },
  percentTxt: { fontSize: 18, fontWeight: '900', color: '#FFF' },

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15, marginTop: 5 },
  sectionTitle: { fontSize: 19, fontWeight: '900', letterSpacing: -0.3 },
  seeAllText: { fontSize: 14, fontWeight: '700', color: '#6366F1' },

  goalCard: { padding: 18, borderRadius: 24, borderWidth: 1, marginBottom: 25 },
  goalRow: { flexDirection: 'row', alignItems: 'center' },
  goalIconContainer: { width: 48, height: 48, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  goalLabel: { fontSize: 10, color: '#94A3B8', fontWeight: '900', letterSpacing: 1 },
  goalValue: { fontSize: 24, fontWeight: '900', marginTop: 2 },

  budgetGrid: { gap: 12 },
  budgetCard: { borderRadius: 20, borderWidth: 1, height: 85, justifyContent: 'center' },
  cardMainContent: { paddingHorizontal: 16 },
  budgetRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  leftInfo: { flexDirection: 'row', alignItems: 'center' },
  iconBox: { width: 32, height: 32, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  catName: { fontSize: 14, fontWeight: '700', textTransform: 'capitalize' },
  rightInfo: { flexDirection: 'row', alignItems: 'baseline' },
  spentAmount: { fontSize: 15, fontWeight: '800' },
  limitLabel: { fontSize: 11, color: '#94A3B8', fontWeight: '600' },
  progressContainer: { width: '100%' },
  progressBg: { height: 6, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 3 },

  fab: { position: 'absolute', right: 25, bottom: 100, width: 64, height: 64, borderRadius: 22, elevation: 8 },
  fabGrad: { width: '100%', height: '100%', borderRadius: 22, justifyContent: 'center', alignItems: 'center' }
});