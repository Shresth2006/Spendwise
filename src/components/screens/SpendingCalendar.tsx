import React, { useState, useEffect, useMemo } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet, 
  Dimensions,
  ActivityIndicator,
  TextInput,
  Alert,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  ChevronLeft, 
  ChevronRight, 
  Settings as SettingsIcon, 
  X, 
  Check, 
  Calendar as CalendarIcon,
  Activity
} from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import BottomNavigation from '../BottomNavigation';
import { transactionService } from '../../services/api'; 
import { useDarkMode } from '../DarkModeProvider';

const screenWidth = Dimensions.get('window').width;
const CARD_MARGIN = 20;
const CARD_PADDING = 20;
const AVAILABLE_WIDTH = screenWidth - (CARD_MARGIN * 2) - (CARD_PADDING * 2);
const CELL_MARGIN = 4;
const CELL_SIZE = (AVAILABLE_WIDTH / 7) - (CELL_MARGIN * 2);

const HIGH_LIMIT_KEY = '@spending_high_limit';
const OVER_LIMIT_KEY = '@spending_over_limit';

// UPDATED: Added goals to the props interface
export default function SpendingCalendar({ goals = [] }: { goals?: any[] }) {
  const { darkMode: isDark } = useDarkMode();
  
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState<number | null>(new Date().getDate());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  
  const [showSettings, setShowSettings] = useState(false);
  const [highLimit, setHighLimit] = useState('1500');
  const [overLimit, setOverLimit] = useState('3000');

  const theme = {
    bg: isDark ? '#000' : '#F8F9FE',
    card: isDark ? '#161622' : '#FFFFFF',
    text: isDark ? '#FFF' : '#1A1A1A',
    subText: isDark ? '#94A3B8' : '#64748B',
    border: isDark ? 'rgba(255,255,255,0.1)' : '#F1F5F9',
    inputBg: isDark ? '#1E1E2D' : '#F8FAFC',
    cellDefault: isDark ? '#1E1E2D' : '#F8FAFC',
    primary: '#6366F1'
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  useEffect(() => {
    const initializeData = async () => {
      try {
        setLoading(true);
        const [savedHigh, savedOver] = await Promise.all([
          AsyncStorage.getItem(HIGH_LIMIT_KEY),
          AsyncStorage.getItem(OVER_LIMIT_KEY)
        ]);
        if (savedHigh !== null) setHighLimit(savedHigh);
        if (savedOver !== null) setOverLimit(savedOver);
        const data = await transactionService.getAll();
        setTransactions(data);
      } catch (error) {
        console.error("Initialization error:", error);
      } finally {
        setLoading(false);
      }
    };
    initializeData();
  }, []);

  const handleSaveLimits = async () => {
    try {
      await Promise.all([
        AsyncStorage.setItem(HIGH_LIMIT_KEY, highLimit),
        AsyncStorage.setItem(OVER_LIMIT_KEY, overLimit)
      ]);
      setShowSettings(false);
      Alert.alert("Success ✨", "Spending indicators updated.");
    } catch (error) {
      Alert.alert("Error", "Failed to save settings.");
    }
  };

  // UPDATED: useMemo now calculates transactions AND goals
  const { dailySpending, daysInMonth, firstDayOfWeek, todayDate } = useMemo(() => {
    const spending: Record<number, { amount: number; status: 'normal' | 'high' | 'overspend', items: any[] }> = {};
    const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();
    const startDay = new Date(currentYear, currentMonth, 1).getDay();
    const now = new Date();
    const isCurrentMonth = now.getMonth() === currentMonth && now.getFullYear() === currentYear;
    const currentDay = isCurrentMonth ? now.getDate() : null;

    // 1. Process regular transactions
    transactions.forEach(tx => {
      const d = new Date(tx.date);
      if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
        const day = d.getDate();
        if (!spending[day]) spending[day] = { amount: 0, status: 'normal', items: [] };
        if (tx.direction === 'debit' || tx.direction === 'expense') {
          spending[day].amount += Math.abs(Number(tx.amount) || 0);
          spending[day].items.push(tx);
        }
      }
    });

    // 2. Process Goal Contributions (Savings)
    // Note: Since goal contributions deduct from allowance, we show them as spending on the calendar
    goals.forEach(goal => {
      // Assuming goal contributions were made today/this month for visibility
      // In a real app, you would use goal.lastUpdated or a history array
      if (goal.current > 0) {
        const d = new Date(); 
        if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
          const day = d.getDate();
          if (!spending[day]) spending[day] = { amount: 0, status: 'normal', items: [] };
          
          spending[day].amount += Number(goal.current) || 0;
          spending[day].items.push({
            id: goal.id,
            merchant: `Savings: ${goal.name}`,
            category: 'Savings',
            amount: goal.current,
            date: d.toISOString(),
            isGoal: true
          });
        }
      }
    });

    const hLimit = parseFloat(highLimit) || 1500;
    const oLimit = parseFloat(overLimit) || 3000;

    Object.keys(spending).forEach((day: any) => {
      const amt = spending[day].amount;
      spending[day].status = amt > oLimit ? 'overspend' : amt > hLimit ? 'high' : 'normal';
    });

    return { dailySpending: spending, daysInMonth: totalDays, firstDayOfWeek: startDay, todayDate: currentDay };
  }, [transactions, goals, currentMonth, currentYear, highLimit, overLimit]);

  const changeMonth = (offset: number) => {
    setSelectedDay(null);
    let newMonth = currentMonth + offset;
    let newYear = currentYear;
    if (newMonth < 0) { newMonth = 11; newYear -= 1; }
    else if (newMonth > 11) { newMonth = 0; newYear += 1; }
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  const getStatusColor = (status: string) => {
    if (isDark) {
      if (status === 'normal') return 'rgba(74, 222, 128, 0.15)';
      if (status === 'high') return 'rgba(250, 204, 21, 0.15)';
      if (status === 'overspend') return 'rgba(248, 113, 113, 0.15)';
    } else {
      if (status === 'normal') return '#E8F5E9';
      if (status === 'high') return '#FFF9C4';
      if (status === 'overspend') return '#FFEBEE';
    }
    return theme.cellDefault;
  };

  const getStatusTextColor = (status: string) => {
    if (status === 'normal') return isDark ? '#4ADE80' : '#2E7D32';
    if (status === 'high') return isDark ? '#FACC15' : '#F57F17';
    if (status === 'overspend') return isDark ? '#F87171' : '#C62828';
    return theme.subText;
  };

  if (loading) {
    return (
      <View style={[styles.root, { justifyContent: 'center', backgroundColor: theme.bg }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  const selectedDayExpenses = selectedDay ? dailySpending[selectedDay]?.items || [] : [];

  return (
    <View style={[styles.root, { backgroundColor: theme.bg }]}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        
        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.headerTitle, { color: theme.text }]}>Calendar</Text>
            <View style={styles.badge}>
              <Activity size={12} color={theme.primary} />
              <Text style={styles.badgeText}>Spending Flow</Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => setShowSettings(!showSettings)} style={styles.iconBtn}>
            {showSettings ? <X size={22} color="white" /> : <SettingsIcon size={22} color="white" />}
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {showSettings && (
            <View style={[styles.settingsCard, { backgroundColor: theme.card }]}>
              <Text style={[styles.settingsTitle, { color: theme.text }]}>Spending Thresholds</Text>
              <View style={styles.inputRow}>
                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { color: isDark ? '#FACC15' : '#B45309' }]}>Warning (Yellow)</Text>
                  <TextInput 
                    style={[styles.input, { backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }]} 
                    value={highLimit}
                    onChangeText={setHighLimit}
                    keyboardType="numeric"
                    placeholder="1500"
                    placeholderTextColor={theme.subText}
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { color: isDark ? '#F87171' : '#B91C1C' }]}>Critical (Red)</Text>
                  <TextInput 
                    style={[styles.input, { backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }]} 
                    value={overLimit}
                    onChangeText={setOverLimit}
                    keyboardType="numeric"
                    placeholder="3000"
                    placeholderTextColor={theme.subText}
                  />
                </View>
              </View>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSaveLimits}>
                <LinearGradient colors={['#6366F1', '#4F46E5']} start={{x:0,y:0}} end={{x:1,y:0}} style={styles.saveBtnGrad}>
                  <Check size={18} color="#fff" />
                  <Text style={styles.saveBtnText}>Apply Settings</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}

          {/* MONTH SELECTOR */}
          <View style={[styles.selectorCard, { backgroundColor: theme.card }]}>
            <TouchableOpacity onPress={() => changeMonth(-1)} style={styles.arrowBtn}>
              <ChevronLeft size={24} color={theme.primary} />
            </TouchableOpacity>
            <Text style={[styles.monthText, { color: theme.text }]}>{monthNames[currentMonth]} {currentYear}</Text>
            <TouchableOpacity onPress={() => changeMonth(1)} style={styles.arrowBtn}>
              <ChevronRight size={24} color={theme.primary} />
            </TouchableOpacity>
          </View>

          {/* CALENDAR GRID */}
          <View style={[styles.calendarContainer, { backgroundColor: theme.card }]}>
            <View style={styles.gridHeader}>
              {['S','M','T','W','T','F','S'].map((d, i) => (
                <Text key={i} style={styles.dayLabel}>{d}</Text>
              ))}
            </View>

            <View style={styles.grid}>
              {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                <View key={`empty-${i}`} style={styles.dayCellEmpty} />
              ))}

              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const spend = dailySpending[day];
                const isSelected = selectedDay === day;
                const isToday = day === todayDate;

                return (
                  <TouchableOpacity
                    key={day}
                    activeOpacity={0.7}
                    onPress={() => setSelectedDay(day)}
                    style={[
                      styles.dayCell,
                      { backgroundColor: theme.cellDefault },
                      spend && { backgroundColor: getStatusColor(spend.status) },
                      isSelected && styles.selectedDayCell,
                      isToday && !isSelected && { borderColor: theme.primary, borderWidth: 2, borderStyle: 'dashed' }
                    ]}
                  >
                    <Text style={[
                      styles.dayText, 
                      { color: theme.text },
                      spend && { color: getStatusTextColor(spend.status) },
                      isSelected && { color: '#FFF' }
                    ]}>{day}</Text>
                    {spend && spend.amount > 0 && (
                      <Text numberOfLines={1} style={[
                        styles.tinyAmount,
                        { color: theme.subText },
                        isSelected && { color: 'rgba(255,255,255,0.9)' }
                      ]}>₹{Math.round(spend.amount)}</Text>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* DETAIL VIEW */}
          {selectedDay && (
            <View style={[styles.detailCard, { backgroundColor: theme.card }]}>
              <View style={[styles.detailHeader, { borderBottomColor: theme.border }]}>
                <View style={styles.detailTitleRow}>
                  <View style={styles.popIcon}>
                     <CalendarIcon size={14} color="#FFF" />
                  </View>
                  <Text style={[styles.detailTitle, { color: theme.text }]}>{selectedDay} {monthNames[currentMonth]}</Text>
                </View>
                <Text style={styles.detailAmount}>₹{Math.round(dailySpending[selectedDay]?.amount || 0)}</Text>
              </View>
              
              {selectedDayExpenses.length > 0 ? selectedDayExpenses.map((tx, i) => (
                <View key={i} style={[styles.expenseItem, { borderBottomColor: theme.border }, i === selectedDayExpenses.length - 1 && { borderBottomWidth: 0 }]}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.expCat, { color: theme.text }]}>{tx.merchant || tx.category || 'Other'}</Text>
                    <Text style={[styles.expTime, { color: theme.subText }]}>
                      {tx.isGoal ? "Savings Allocation" : new Date(tx.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                  </View>
                  <Text style={[styles.expAmt, tx.isGoal && { color: '#6366F1' }]}>
                    {tx.isGoal ? `+₹${tx.amount}` : `-₹${tx.amount}`}
                  </Text>
                </View>
              )) : (
                <View style={styles.emptyContainer}>
                  <Text style={[styles.noDataText, { color: theme.subText }]}>Rest day! No expenses found.</Text>
                </View>
              )}
            </View>
          )}
          <View style={{ height: 100 }} />
        </ScrollView>
      </SafeAreaView>
      <BottomNavigation />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  safeArea: { flex: 1 },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 25, 
    paddingTop: Platform.OS === 'ios' ? 10 : 20,
    paddingBottom: 10
  },
  headerTitle: { fontSize: 28, fontWeight: '900' },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  badgeText: { color: '#6366F1', fontSize: 13, fontWeight: '800' },
  iconBtn: { 
    width: 48, 
    height: 48, 
    backgroundColor: '#6366F1', 
    borderRadius: 16, 
    justifyContent: 'center', 
    alignItems: 'center', 
    elevation: 4 
  },
  scrollContent: { paddingBottom: 40 },
  settingsCard: { marginHorizontal: 20, padding: 20, borderRadius: 24, marginBottom: 20, elevation: 4 },
  settingsTitle: { fontSize: 16, fontWeight: '800', marginBottom: 15 },
  inputRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  inputGroup: { width: '47%' },
  inputLabel: { fontSize: 11, fontWeight: '800', marginBottom: 8, textTransform: 'uppercase' },
  input: { borderRadius: 12, padding: 12, fontWeight: '700', borderWidth: 1 },
  saveBtn: { borderRadius: 14, overflow: 'hidden' },
  saveBtnGrad: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14 },
  saveBtnText: { color: '#FFF', fontWeight: '800', marginLeft: 8, fontSize: 15 },
  selectorCard: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginHorizontal: 20, 
    marginVertical: 15,
    padding: 12, 
    borderRadius: 20, 
    elevation: 2 
  },
  arrowBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  monthText: { fontSize: 18, fontWeight: '800' },
  calendarContainer: { marginHorizontal: 20, padding: 18, borderRadius: 28, elevation: 3 },
  gridHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  dayLabel: { width: AVAILABLE_WIDTH / 7, textAlign: 'center', color: '#6366F1', fontWeight: '900', fontSize: 13 },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  dayCell: { width: CELL_SIZE, height: CELL_SIZE + 8, justifyContent: 'center', alignItems: 'center', margin: CELL_MARGIN, borderRadius: 14 },
  dayCellEmpty: { width: CELL_SIZE, height: CELL_SIZE + 8, margin: CELL_MARGIN },
  selectedDayCell: { backgroundColor: '#6366F1' },
  dayText: { fontSize: 15, fontWeight: '800' },
  tinyAmount: { fontSize: 8, fontWeight: '800', marginTop: 2 },
  detailCard: { marginHorizontal: 20, marginTop: 20, padding: 24, borderRadius: 28, elevation: 3 },
  detailHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, paddingBottom: 15, borderBottomWidth: 1 },
  detailTitleRow: { flexDirection: 'row', alignItems: 'center' },
  popIcon: { backgroundColor: '#6366F1', padding: 5, borderRadius: 8, marginRight: 8 },
  detailTitle: { fontSize: 18, fontWeight: '900' },
  detailAmount: { fontSize: 20, color: '#6366F1', fontWeight: '900' },
  expenseItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1 },
  expCat: { fontWeight: '800', fontSize: 15 },
  expTime: { fontSize: 12, fontWeight: '600', marginTop: 2 },
  expAmt: { color: '#EF4444', fontWeight: '900', fontSize: 15 },
  emptyContainer: { paddingVertical: 20, alignItems: 'center' },
  noDataText: { fontWeight: '600', fontStyle: 'italic' }
});