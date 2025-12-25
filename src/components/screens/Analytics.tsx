import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
// FIXED: Import SafeAreaView from context to prevent layout bugs
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, TrendingUp, TrendingDown } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { PieChart, BarChart } from 'react-native-chart-kit';
import { useNavigation } from '@react-navigation/native';
import BottomNavigation from '../BottomNavigation';
import { transactionService } from '../../services/api';

const screenWidth = Dimensions.get('window').width;

export default function Analytics() {
  const navigation = useNavigation<any>();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch real transactions on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await transactionService.getAll();
        setTransactions(data);
      } catch (error) {
        console.error("Analytics fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // 2. Process Data for Charts
  const analyticsData = useMemo(() => {
    const debits = transactions.filter(t => t.direction === 'debit');
    
    // Group by Category for Pie Chart
    const categoryMap: { [key: string]: number } = {};
    debits.forEach(t => {
      const cat = t.category || 'Miscellaneous';
      categoryMap[cat] = (categoryMap[cat] || 0) + t.amount;
    });

    const colors = ['#9333ea', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
    const pieData = Object.keys(categoryMap).map((name, index) => ({
      name,
      value: categoryMap[name],
      color: colors[index % colors.length],
      legendFontColor: '#7F7F7F',
      legendFontSize: 12
    })).sort((a, b) => b.value - a.value);

    // Group by Month for Bar Chart (Last 5 Months)
    const monthTotals: { [key: string]: number } = {};
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Get current and previous month names for the Comparison Card
    const now = new Date();
    const currentMonthLabel = monthNames[now.getMonth()];
    const lastMonthLabel = monthNames[now.getMonth() === 0 ? 11 : now.getMonth() - 1];

    debits.forEach(t => {
      const date = new Date(t.date || Date.now());
      const label = monthNames[date.getMonth()];
      monthTotals[label] = (monthTotals[label] || 0) + t.amount;
    });

    const barLabels = monthNames.filter(m => monthTotals[m] !== undefined).slice(-5);
    const barValues = barLabels.map(l => monthTotals[l]);

    const thisMonthTotal = monthTotals[currentMonthLabel] || 0;
    const lastMonthTotal = monthTotals[lastMonthLabel] || 0;
    const percentChange = lastMonthTotal === 0 ? 0 : ((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100;

    return { 
      pieData, 
      barData: { labels: barLabels, datasets: [{ data: barValues }] },
      thisMonthTotal,
      lastMonthTotal,
      percentChange,
      currentMonthLabel,
      lastMonthLabel,
      totalSpent: debits.reduce((sum, t) => sum + t.amount, 0)
    };
  }, [transactions]);

  const chartConfig = {
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(147, 51, 234, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
    style: { borderRadius: 16 },
    barPercentage: 0.6,
  };

  if (loading) {
    return (
      <View style={[styles.root, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color="#9333ea" />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <LinearGradient colors={['#f5f3ff', '#eff6ff']} style={styles.container}>
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <ArrowLeft color="#9333ea" size={24} />
            </TouchableOpacity>
            <View>
              <Text style={styles.headerTitle}>Analytics</Text>
              <Text style={styles.headerSubtitle}>Real-time insights</Text>
            </View>
          </View>

          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* Monthly Overview Card */}
            <LinearGradient colors={['#9333ea', '#7c3aed']} style={styles.overviewCard}>
              <Text style={styles.overviewLabel}>{analyticsData.currentMonthLabel} Spending</Text>
              <Text style={styles.overviewAmount}>₹{analyticsData.thisMonthTotal.toLocaleString()}</Text>
              <View style={styles.trendRow}>
                {analyticsData.percentChange <= 0 ? (
                  <>
                    <TrendingDown size={18} color="#bef264" />
                    <Text style={styles.trendTextDown}>
                      {Math.abs(analyticsData.percentChange).toFixed(1)}% less than {analyticsData.lastMonthLabel}
                    </Text>
                  </>
                ) : (
                  <>
                    <TrendingUp size={18} color="#fca5a5" />
                    <Text style={styles.trendTextUp}>
                      {analyticsData.percentChange.toFixed(1)}% more than {analyticsData.lastMonthLabel}
                    </Text>
                  </>
                )}
              </View>
            </LinearGradient>

            {/* Pie Chart Card */}
            <View style={styles.glassCard}>
              <Text style={styles.cardTitle}>Spending by Category</Text>
              {analyticsData.pieData.length > 0 ? (
                <>
                  <PieChart
                    data={analyticsData.pieData}
                    width={screenWidth - 48}
                    height={200}
                    chartConfig={chartConfig}
                    accessor="value"
                    backgroundColor="transparent"
                    paddingLeft="15"
                    absolute
                    hasLegend={false}
                  />
                  <View style={styles.customLegend}>
                    {analyticsData.pieData.map((cat, i) => (
                      <View key={i} style={styles.legendItem}>
                        <View style={[styles.legendDot, { backgroundColor: cat.color }]} />
                        <View style={{ flex: 1 }}>
                          <Text style={styles.legendName}>{cat.name}</Text>
                          <Text style={styles.legendValue}>₹{cat.value.toLocaleString()}</Text>
                        </View>
                      </View>
                    ))}
                  </View>
                </>
              ) : (
                <Text style={styles.emptyText}>No debit transactions found.</Text>
              )}
            </View>

            {/* Bar Chart Card */}
            <View style={styles.glassCard}>
              <Text style={styles.cardTitle}>Monthly Trends</Text>
              {analyticsData.barData.labels.length > 0 ? (
                <BarChart
                  data={analyticsData.barData}
                  width={screenWidth - 80}
                  height={220}
                  yAxisLabel="₹"
                  yAxisSuffix=""
                  chartConfig={chartConfig}
                  fromZero
                  style={{ borderRadius: 16, marginTop: 10 }}
                />
              ) : (
                <Text style={styles.emptyText}>Insufficient monthly data.</Text>
              )}
            </View>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
      <BottomNavigation />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', padding: 24, paddingTop: 12 },
  backButton: { marginRight: 16 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#1e1b4b' },
  headerSubtitle: { fontSize: 14, color: '#9333ea' },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 120 },
  overviewCard: { borderRadius: 32, padding: 24, marginBottom: 16 },
  overviewLabel: { color: '#f3e8ff', fontSize: 14, marginBottom: 8 },
  overviewAmount: { color: 'white', fontSize: 32, fontWeight: 'bold', marginBottom: 12 },
  trendRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  trendTextDown: { color: '#bef264', fontWeight: '500' },
  trendTextUp: { color: '#fca5a5', fontWeight: '500' },
  glassCard: { backgroundColor: 'rgba(255, 255, 255, 0.7)', borderRadius: 32, padding: 24, borderWidth: 1, borderColor: '#f3e8ff', marginBottom: 16 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#1e1b4b', marginBottom: 16 },
  customLegend: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 16 },
  legendItem: { flexDirection: 'row', width: '45%', alignItems: 'center', gap: 8, marginBottom: 8 },
  legendDot: { width: 12, height: 12, borderRadius: 6 },
  legendName: { fontSize: 12, color: '#1e1b4b', fontWeight: '500' },
  legendValue: { fontSize: 12, color: '#9333ea' },
  emptyText: { textAlign: 'center', color: '#9333ea', marginVertical: 20 }
});