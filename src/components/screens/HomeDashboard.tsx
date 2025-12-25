import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
// FIXED: Import SafeAreaView from 'react-native-safe-area-context'
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, TrendingUp, AlertCircle } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Circle } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { useDarkMode } from '../DarkModeProvider';
import BottomNavigation from '../BottomNavigation';
import { transactionService } from '../../services/api'; 

interface HomeDashboardProps {
  userName: string;
  goals?: any[]; 
}

export default function HomeDashboard({ userName, goals = [] }: HomeDashboardProps) {
  const navigation = useNavigation<any>();
  const { darkMode } = useDarkMode();
  const isDark = darkMode;

  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const monthlyAllowance = 50000;

  const loadData = async () => {
    try {
      const data = await transactionService.getAll();
      setTransactions(data);
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCsvImport = () => {
    Alert.alert("Bulk Import", "Import all transactions from sms_raw.csv?", [
      { text: "Cancel", style: "cancel" },
      { text: "Import", onPress: async () => {
          setLoading(true);
          try {
            await transactionService.importCsv();
            Alert.alert("Success", "Historical data loaded!");
            loadData();
          } catch (e) {
            Alert.alert("Error", "CSV file not found on server.");
            setLoading(false);
          }
      }}
    ]);
  };

  const stats = useMemo(() => {
    const actualSpend = transactions
      .filter((t) => t.direction === 'debit')
      .reduce((sum, t) => sum + t.amount, 0);

    const extraIncome = transactions
      .filter((t) => t.direction === 'credit')
      .reduce((sum, t) => sum + t.amount, 0);

    const reservedForGoals = goals.reduce((sum, g) => sum + (g.target / 30), 0); 
    const spendable = (monthlyAllowance + extraIncome) - actualSpend - reservedForGoals;
    const predictedSpend = actualSpend * 1.2; 
    const willExceed = predictedSpend > (monthlyAllowance + extraIncome);
    const percentSpent = Math.min(((actualSpend) / (monthlyAllowance + extraIncome)) * 100, 100);

    return { actualSpend, spendable, reservedForGoals, predictedSpend, willExceed, percentSpent };
  }, [transactions, goals, monthlyAllowance]);

  const radius = 32;
  const stroke = 6;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (stats.percentSpent / 100) * circumference;

  if (loading) {
    return (
      <View style={[styles.root, { justifyContent: 'center', backgroundColor: isDark ? '#111827' : '#f5f3ff' }]}>
        <ActivityIndicator size="large" color="#9333ea" />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <LinearGradient colors={isDark ? ['#111827', '#1f2937'] : ['#f5f3ff', '#eff6ff']} style={styles.container}>
        {/* FIXED: Using the modern SafeAreaView with flex: 1 */}
        <SafeAreaView style={styles.safeArea}>
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            
            <View style={styles.header}>
              <Text style={[styles.greetingText, { color: isDark ? '#fff' : '#1e1b4b' }]}>
                Hello, {userName || 'there'}
              </Text>
              <TouchableOpacity onLongPress={handleCsvImport}>
                <Text style={styles.subGreeting}>Spendable: ₹{stats.spendable.toLocaleString()}</Text>
              </TouchableOpacity>
            </View>

            {transactions.some(t => t.needs_user_review) && (
              <TouchableOpacity style={styles.reviewAlert} onPress={() => Alert.alert("Review", "Categorize miscellaneous items.")}>
                <AlertCircle size={20} color="#dc2626" />
                <Text style={styles.reviewText}>Transactions need review</Text>
              </TouchableOpacity>
            )}

            <View style={[styles.glassCard, isDark && styles.glassCardDark]}>
              <View style={styles.progressRow}>
                <View>
                  <Text style={styles.cardLabel}>Spent this Month</Text>
                  <Text style={[styles.mainAmount, { color: isDark ? '#fff' : '#1e1b4b' }]}>₹{stats.actualSpend.toLocaleString()}</Text>
                  <Text style={styles.budgetLimit}>Goal Reserve: ₹{stats.reservedForGoals.toLocaleString()}</Text>
                </View>
                <View style={styles.circularContainer}>
                  <Svg height="80" width="80" style={{ transform: [{ rotate: '-90deg' }] }}>
                    <Circle stroke={isDark ? '#374151' : '#f3e8ff'} fill="transparent" strokeWidth={stroke} r={radius} cx="40" cy="40" />
                    <Circle stroke="#9333ea" fill="transparent" strokeWidth={stroke} strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" r={radius} cx="40" cy="40" />
                  </Svg>
                  <View style={styles.percentageCenter}>
                    <Text style={[styles.percentText, { color: isDark ? '#fff' : '#1e1b4b' }]}>{stats.percentSpent.toFixed(0)}%</Text>
                  </View>
                </View>
              </View>
            </View>

            <TouchableOpacity 
              style={[styles.alertCard, { backgroundColor: stats.willExceed ? (isDark ? '#450a0a' : '#fff1f2') : (isDark ? '#064e3b' : '#f0fdf4'), borderColor: stats.willExceed ? '#dc2626' : '#10b981' }]}
            >
              <View style={styles.alertContent}>
                <View style={[styles.iconCircle, { backgroundColor: stats.willExceed ? '#fee2e2' : '#dcfce7' }]}>
                  {stats.willExceed ? <AlertCircle size={20} color="#dc2626" /> : <TrendingUp size={20} color="#16a34a" />}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.alertTitle, { color: stats.willExceed ? (isDark ? '#fca5a5' : '#7f1d1d') : (isDark ? '#6ee7b7' : '#14532d') }]}>
                    {stats.willExceed ? 'Budget Risk' : 'On Track'}
                  </Text>
                  <Text style={[styles.alertBody, { color: isDark ? '#d1d5db' : '#15803d' }]}>
                    {stats.willExceed ? `Exceeding by ₹${(stats.predictedSpend - monthlyAllowance).toLocaleString()}` : 'Within monthly limits'}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>

            <View style={[styles.glassCard, isDark && styles.glassCardDark]}>
              <Text style={[styles.sectionTitle, { color: isDark ? '#fff' : '#1e1b4b' }]}>Recent Activity</Text>
              {transactions.slice(0, 5).map((tx, i) => (
                <View key={tx.id || i} style={styles.transactionRow}>
                  <View>
                    <Text style={[styles.txName, { color: isDark ? '#fff' : '#1e1b4b' }]}>{tx.merchant || 'Unknown'}</Text>
                    <Text style={styles.txMeta}>{tx.category} · {tx.source}</Text>
                  </View>
                  <Text style={[styles.txAmount, { color: tx.direction === 'credit' ? '#16a34a' : (isDark ? '#fff' : '#1e1b4b') }]}>
                    {tx.direction === 'credit' ? '+' : '-'}₹{tx.amount.toLocaleString()}
                  </Text>
                </View>
              ))}
            </View>
          </ScrollView>

          <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('AddExpense')}>
            <LinearGradient colors={['#9333ea', '#7e22ce']} style={styles.fabGradient}>
              <Plus size={28} color="white" />
            </LinearGradient>
          </TouchableOpacity>
          <BottomNavigation />
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  container: { flex: 1 },
  safeArea: { flex: 1 }, // Ensure full height
  scrollContent: { paddingHorizontal: 24, paddingBottom: 120 },
  header: { marginTop: 24, marginBottom: 24 },
  greetingText: { fontSize: 24, fontWeight: 'bold' },
  subGreeting: { fontSize: 16, color: '#9333ea', marginTop: 4 },
  reviewAlert: { backgroundColor: '#fef2f2', padding: 12, borderRadius: 16, flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16, borderWidth: 1, borderColor: '#fecaca' },
  reviewText: { color: '#dc2626', fontWeight: '600', fontSize: 13 },
  glassCard: { backgroundColor: 'rgba(255, 255, 255, 0.7)', borderRadius: 32, padding: 24, borderWidth: 1, borderColor: '#f3e8ff', marginBottom: 16 },
  glassCardDark: { backgroundColor: 'rgba(31, 41, 55, 0.7)', borderColor: '#374151' },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardLabel: { fontSize: 14, color: '#9333ea', marginBottom: 4 },
  mainAmount: { fontSize: 32, fontWeight: 'bold' },
  budgetLimit: { fontSize: 14, color: '#6b7280', marginTop: 4 },
  circularContainer: { height: 80, width: 80, justifyContent: 'center', alignItems: 'center' },
  percentageCenter: { position: 'absolute', justifyContent: 'center', alignItems: 'center' },
  percentText: { fontSize: 16, fontWeight: 'bold' },
  alertCard: { borderRadius: 32, padding: 20, borderWidth: 1, marginBottom: 16 },
  alertContent: { flexDirection: 'row', alignItems: 'center' },
  iconCircle: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  alertTitle: { fontSize: 16, fontWeight: 'bold' },
  alertBody: { fontSize: 14, marginTop: 4 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  transactionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  txName: { fontSize: 16, fontWeight: '500' },
  txMeta: { fontSize: 12, color: '#9333ea', marginTop: 2 },
  txAmount: { fontSize: 16, fontWeight: 'bold' },
  fab: { position: 'absolute', bottom: 100, right: 24, width: 56, height: 56, borderRadius: 28, elevation: 8 },
  fabGradient: { flex: 1, borderRadius: 28, justifyContent: 'center', alignItems: 'center' }
});