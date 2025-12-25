import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet, 
  Dimensions 
} from 'react-native';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { BarChart, LineChart } from 'react-native-chart-kit';
import { useNavigation } from '@react-navigation/native'; // Added import

const screenWidth = Dimensions.get('window').width;

// Navigation prop is no longer needed as a custom interface here
export default function SpendingCalendar() {
  const navigation = useNavigation<any>(); // Initialize navigation hook
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [chartType, setChartType] = useState<'line' | 'bar'>('bar');
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();
  const today = new Date();
  const todayDate = (today.getMonth() === currentMonth && today.getFullYear() === currentYear) ? today.getDate() : null;

  // Mock data - In a real app, this would come from a database/API
  const dailySpending: Record<number, { amount: number; status: 'normal' | 'high' | 'overspend' }> = {
    1: { amount: 1200, status: 'normal' },
    2: { amount: 890, status: 'normal' },
    3: { amount: 2100, status: 'high' },
    6: { amount: 3200, status: 'overspend' },
    13: { amount: 3500, status: 'overspend' },
  };

  const dayExpenses = selectedDay ? [
    { category: 'Groceries', amount: 650, time: '10:30 AM' },
    { category: 'Transport', amount: 245, time: '2:15 PM' },
    { category: 'Dining', amount: 905, time: '7:45 PM' },
  ] : [];

  const chartData = {
    labels: ["1", "5", "10", "15", "20", "25", "30"],
    datasets: [{
      data: Object.values(dailySpending).map(d => d.amount).slice(0, 7).length > 0 
            ? Object.values(dailySpending).map(d => d.amount).slice(0, 7) 
            : [0, 0, 0, 0, 0, 0, 0]
    }]
  };

  const chartConfig = {
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    color: (opacity = 1) => `rgba(147, 51, 234, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return '#dcfce7'; 
      case 'high': return '#fef9c3';   
      case 'overspend': return '#fee2e2'; 
      default: return '#fff';
    }
  };

  const getStatusTextColor = (status: string) => {
    switch (status) {
      case 'normal': return '#15803d';
      case 'high': return '#a16207';
      case 'overspend': return '#b91c1c';
      default: return '#6b7280';
    }
  };

  return (
    <LinearGradient colors={['#f5f3ff', '#eff6ff']} style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Header */}
        <View style={styles.header}>
          {/* FIX: Changed navigateTo('home') to navigation.goBack() or navigation.navigate('Home') */}
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ArrowLeft size={24} color="#9333ea" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Calendar</Text>
        </View>

        {/* Month Selector */}
        <View style={styles.selectorCard}>
          <TouchableOpacity onPress={() => setCurrentMonth(prev => prev === 0 ? 11 : prev - 1)}>
            <ChevronLeft size={24} color="#9333ea" />
          </TouchableOpacity>
          <Text style={styles.monthText}>{monthNames[currentMonth]} {currentYear}</Text>
          <TouchableOpacity onPress={() => setCurrentMonth(prev => prev === 11 ? 0 : prev + 1)}>
            <ChevronRight size={24} color="#9333ea" />
          </TouchableOpacity>
        </View>

        {/* Chart Section */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Spending Trend</Text>
            <View style={styles.toggleGroup}>
              <TouchableOpacity 
                style={[styles.toggleBtn, chartType === 'bar' && styles.toggleActive]}
                onPress={() => setChartType('bar')}
              >
                <Text style={[styles.toggleText, chartType === 'bar' && styles.textWhite]}>Bar</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.toggleBtn, chartType === 'line' && styles.toggleActive]}
                onPress={() => setChartType('line')}
              >
                <Text style={[styles.toggleText, chartType === 'line' && styles.textWhite]}>Line</Text>
              </TouchableOpacity>
            </View>
          </View>

          {chartType === 'bar' ? (
            <BarChart
              data={chartData}
              width={screenWidth - 80}
              height={180}
              chartConfig={chartConfig}
              yAxisLabel="₹"
              yAxisSuffix=""
              fromZero
              style={{ borderRadius: 16 }}
            />
          ) : (
            <LineChart
              data={chartData}
              width={screenWidth - 80}
              height={180}
              chartConfig={chartConfig}
              bezier
              style={{ borderRadius: 16 }}
            />
          )}
        </View>

        {/* Calendar Grid */}
        <View style={styles.card}>
          <View style={styles.gridHeader}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <Text key={d} style={styles.dayLabel}>{d}</Text>
            ))}
          </View>
          <View style={styles.grid}>
            {Array.from({ length: firstDayOfWeek }).map((_, i) => (
              <View key={`empty-${i}`} style={styles.dayCell} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const spend = dailySpending[day];
              return (
                <TouchableOpacity 
                  key={day} 
                  onPress={() => setSelectedDay(day)}
                  style={[
                    styles.dayCell, 
                    spend && { backgroundColor: getStatusColor(spend.status), borderColor: '#ddd' },
                    selectedDay === day && { borderWidth: 2, borderColor: '#9333ea' },
                    day === todayDate && { backgroundColor: '#f3e8ff' }
                  ]}
                >
                  <Text style={[styles.dayText, spend && { color: getStatusTextColor(spend.status) }]}>{day}</Text>
                  {spend && <Text style={styles.tinyAmount}>₹{spend.amount}</Text>}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Day Details */}
        {selectedDay && (
          <View style={styles.card}>
            <View style={styles.detailHeader}>
              <Text style={styles.detailTitle}>{monthNames[currentMonth]} {selectedDay}</Text>
              <Text style={styles.detailAmount}>₹{dailySpending[selectedDay]?.amount || 0}</Text>
            </View>
            {dayExpenses.map((exp, i) => (
              <View key={i} style={styles.expenseItem}>
                <View>
                  <Text style={styles.expCat}>{exp.category}</Text>
                  <Text style={styles.expTime}>{exp.time}</Text>
                </View>
                <Text style={styles.expAmt}>₹{exp.amount}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 60, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#4c1d95', marginLeft: 15 },
  selectorCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.7)', marginHorizontal: 20, padding: 15, borderRadius: 20 },
  monthText: { fontSize: 18, fontWeight: '600', color: '#4c1d95' },
  card: { backgroundColor: 'rgba(255,255,255,0.7)', marginHorizontal: 20, marginTop: 20, padding: 20, borderRadius: 30, borderWidth: 1, borderColor: '#ddd' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  cardTitle: { fontSize: 18, color: '#4c1d95', fontWeight: 'bold' },
  toggleGroup: { flexDirection: 'row', backgroundColor: '#f3e8ff', borderRadius: 10, padding: 2 },
  toggleBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  toggleActive: { backgroundColor: '#9333ea' },
  toggleText: { color: '#9333ea', fontWeight: '600' },
  textWhite: { color: '#fff' },
  gridHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  dayLabel: { width: (screenWidth - 80) / 7, textAlign: 'center', color: '#9333ea', fontWeight: '600' },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  dayCell: { width: (screenWidth - 100) / 7, aspectRatio: 1, justifyContent: 'center', alignItems: 'center', margin: 2, borderRadius: 10, backgroundColor: '#fff' },
  dayText: { fontSize: 14, fontWeight: '500' },
  tinyAmount: { fontSize: 8, color: '#6b7280' },
  detailHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  detailTitle: { fontSize: 18, fontWeight: 'bold', color: '#4c1d95' },
  detailAmount: { fontSize: 18, color: '#4c1d95' },
  expenseItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f3e8ff' },
  expCat: { color: '#4c1d95', fontWeight: '500' },
  expTime: { color: '#9333ea', fontSize: 12 },
  expAmt: { color: '#4c1d95', fontWeight: 'bold' }
});