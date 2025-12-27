import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TrendingUp, PieChart as PieIcon, BarChart3 } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { PieChart, BarChart } from 'react-native-chart-kit';
import { useNavigation } from '@react-navigation/native';
import { useDarkMode } from '../DarkModeProvider';
import BottomNavigation from '../BottomNavigation';
import { transactionService } from '../../services/api';

const screenWidth = Dimensions.get('window').width;

export default function Analytics({ goals = [] }: { goals?: any[] }) {
  const navigation = useNavigation<any>();
  const { darkMode: isDark } = useDarkMode();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  const analyticsData = useMemo(() => {
    const debits = transactions.filter(t => t.direction === 'debit');
    const actualGoalSavings = goals.reduce((sum, g) => sum + (g.current || 0), 0);

    const categoryMap: { [key: string]: number } = {};
    debits.forEach(t => {
      const cat = t.category || 'Miscellaneous';
      categoryMap[cat] = (categoryMap[cat] || 0) + t.amount;
    });

    if (actualGoalSavings > 0) {
      categoryMap['Savings'] = (categoryMap['Savings'] || 0) + actualGoalSavings;
    }

    const palette = ['#6366F1', '#EC4899', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];
    
    const pieData = Object.keys(categoryMap).map((name, index) => ({
      name,
      value: categoryMap[name],
      color: name === 'Savings' ? '#8B5CF6' : palette[index % palette.length],
      legendFontColor: isDark ? '#94A3B8' : '#4B5563',
      legendFontSize: 12
    })).sort((a, b) => b.value - a.value);

    // Monthly Logic
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const now = new Date();
    const currentMonthLabel = monthNames[now.getMonth()];
    
    const monthTotals: { [key: string]: number } = {};
    debits.forEach(t => {
      const date = new Date(t.date || Date.now());
      const label = monthNames[date.getMonth()];
      monthTotals[label] = (monthTotals[label] || 0) + t.amount;
    });

    const thisMonthTotal = (monthTotals[currentMonthLabel] || 0) + actualGoalSavings;
    
    const barLabels = [];
    for (let i = 4; i >= 0; i--) {
      const d = new Date();
      d.setMonth(now.getMonth() - i);
      barLabels.push(monthNames[d.getMonth()]);
    }

    const barValues = barLabels.map(l => (monthTotals[l] || 0) + (l === currentMonthLabel ? actualGoalSavings : 0));

    return { 
      pieData, 
      barData: { labels: barLabels, datasets: [{ data: barValues }] },
      thisMonthTotal,
      currentMonthLabel,
    };
  }, [transactions, goals, isDark]);

  const chartConfig = {
    backgroundGradientFrom: isDark ? '#161622' : '#FFFFFF',
    backgroundGradientTo: isDark ? '#161622' : '#FFFFFF',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(99, 102, 241, ${opacity})`,
    labelColor: (opacity = 1) => isDark ? `rgba(148, 163, 184, ${opacity})` : `rgba(75, 85, 99, ${opacity})`,
    barPercentage: 0.6,
    propsForLabels: { fontSize: 10, fontWeight: '700' }
  };

  if (loading) {
    return (
      <View style={[styles.root, { justifyContent: 'center', backgroundColor: isDark ? '#000' : '#F8F9FE' }]}>
        <ActivityIndicator size="large" color="#6366F1" />
      </View>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: isDark ? '#000' : '#F8F9FE' }]}>
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        
        {/* TAB-STYLE HEADER (Back button removed) */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.headerTitle, { color: isDark ? '#FFF' : '#1A1A1A' }]}>Analytics</Text>
            <Text style={styles.headerSubtitle}>Monthly Spending Insights</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* TOTAL SPENDING CARD */}
          <LinearGradient colors={['#6366F1', '#A855F7']} start={{x:0, y:0}} end={{x:1, y:1}} style={styles.mainBalanceCard}>
            <View>
              <Text style={styles.balanceLabel}>Total Spent in {analyticsData.currentMonthLabel}</Text>
              <Text style={styles.balanceAmount}>₹{analyticsData.thisMonthTotal.toLocaleString()}</Text>
            </View>
            <View style={styles.balanceIconCircle}>
              <TrendingUp color="white" size={24} />
            </View>
          </LinearGradient>

          {/* DISTRIBUTION CHART */}
          <View style={[styles.chartCard, { backgroundColor: isDark ? '#161622' : '#FFF' }]}>
            <View style={styles.cardHeader}>
              <PieIcon size={18} color="#6366F1" style={{ marginRight: 8 }} />
              <Text style={[styles.cardTitle, { color: isDark ? '#FFF' : '#1A1A1A' }]}>Category Distribution</Text>
            </View>
            
            <View style={styles.pieContainer}>
              <PieChart
                data={analyticsData.pieData}
                width={screenWidth - 40}
                height={200}
                chartConfig={chartConfig}
                accessor="value"
                backgroundColor="transparent"
                paddingLeft="20"
                hasLegend={false}
                absolute
              />
            </View>

            {/* UPGRADED LEGEND LIST */}
            <View style={styles.legendList}>
              {analyticsData.pieData.map((item, i) => (
                <View key={i} style={styles.legendRow}>
                  <View style={[styles.dot, { backgroundColor: item.color }]} />
                  <Text style={[styles.legendName, { color: isDark ? '#94A3B8' : '#64748B' }]}>{item.name}</Text>
                  <Text style={[styles.legendValue, { color: isDark ? '#FFF' : '#1A1A1A' }]}>₹{item.value.toLocaleString()}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* TREND CHART */}
          <View style={[styles.chartCard, { backgroundColor: isDark ? '#161622' : '#FFF' }]}>
            <View style={styles.cardHeader}>
              <BarChart3 size={18} color="#6366F1" style={{ marginRight: 8 }} />
              <Text style={[styles.cardTitle, { color: isDark ? '#FFF' : '#1A1A1A' }]}>Monthly Trend</Text>
            </View>
            <BarChart
              data={analyticsData.barData}
              width={screenWidth - 60}
              height={220}
              yAxisLabel="₹"
              yAxisSuffix=""
              chartConfig={chartConfig}
              style={styles.barChartStyle}
              fromZero
              showValuesOnTopOfBars
            />
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>
      </SafeAreaView>
      <BottomNavigation />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 25, // Matched to Goals screen
    paddingVertical: 20 
  },
  headerTitle: { fontSize: 28, fontWeight: '900', letterSpacing: -0.5 },
  headerSubtitle: { fontSize: 12, color: '#6366F1', fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 10 },
  
  mainBalanceCard: { borderRadius: 30, padding: 25, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, elevation: 8, shadowColor: '#6366F1', shadowOpacity: 0.3 },
  balanceLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: '700', marginBottom: 5 },
  balanceAmount: { color: 'white', fontSize: 32, fontWeight: '900' },
  balanceIconCircle: { width: 50, height: 50, borderRadius: 25, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },

  chartCard: { borderRadius: 28, padding: 20, marginBottom: 20, elevation: 4, shadowOpacity: 0.05 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  cardTitle: { fontSize: 16, fontWeight: '800' },
  
  pieContainer: { alignItems: 'center', marginLeft: -20 }, 
  legendList: { marginTop: 10 },
  legendRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.03)' },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: 12 },
  legendName: { flex: 1, fontSize: 14, fontWeight: '600' },
  legendValue: { fontSize: 14, fontWeight: '800' },

  barChartStyle: { marginVertical: 8, borderRadius: 16, marginLeft: -15 },
});