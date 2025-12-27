import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { ArrowLeft, TrendingUp, AlertTriangle } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { LineChart } from 'react-native-chart-kit';
import BottomNavigation from '../BottomNavigation';

const screenWidth = Dimensions.get('window').width;

interface BudgetPredictionProps {
  navigateTo: (screen: string) => void;
}

export default function BudgetPrediction({ navigateTo }: BudgetPredictionProps) {
  const monthlyBudget = 50000;
  const predictedSpend = 54200;
  const overspend = predictedSpend - monthlyBudget;

  const chartData = {
    labels: ['Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        data: [45200, 48900, 51200, 47800, 32450],
        color: (opacity = 1) => `rgba(147, 51, 234, ${opacity})`, // Purple (Actual)
        strokeWidth: 3,
      },
      {
        data: [45200, 48900, 51200, 47800, 54200],
        color: (opacity = 1) => `rgba(239, 68, 68, ${opacity})`, // Red (Predicted)
        strokeWidth: 2,
        withDots: true,
      },
    ],
    legend: ['Actual', 'Predicted'],
  };

  const chartConfig = {
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(147, 51, 234, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
    style: { borderRadius: 16 },
    propsForDots: { r: '4', strokeWidth: '2' },
  };

  return (
    <LinearGradient colors={['#f5f3ff', '#eff6ff']} style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigateTo('home')} style={styles.backButton}>
            <ArrowLeft color="#9333ea" size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Budget Prediction</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Alert Card */}
          <View style={styles.alertCard}>
            <View style={styles.alertIconBox}>
              <AlertTriangle color="#dc2626" size={24} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.alertTitle}>Budget Warning</Text>
              <Text style={styles.alertBody}>
                At your current pace, you may exceed your budget by{' '}
                <Text style={{ fontWeight: 'bold' }}>₹{overspend.toLocaleString()}</Text>
              </Text>
            </View>
          </View>

          {/* Prediction Chart Card */}
          <View style={styles.glassCard}>
            <Text style={styles.cardTitle}>Spending Trend</Text>
            <LineChart
              data={chartData}
              width={screenWidth - 80}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={{ marginVertical: 8, borderRadius: 16 }}
              withInnerLines={true}
              fromZero={true}
            />
            
            {/* Legend Mapping */}
            <View style={styles.legendContainer}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#9333ea' }]} />
                <Text style={styles.legendText}>Actual</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#ef4444', borderRadius: 0 }]} />
                <Text style={styles.legendText}>Predicted</Text>
              </View>
            </View>
          </View>

          {/* Insights Section */}
          <View style={styles.glassCard}>
            <View style={styles.sectionHeader}>
              <TrendingUp color="#9333ea" size={20} />
              <Text style={styles.sectionTitle}>Smart Insights</Text>
            </View>
            <View style={styles.insightList}>
              {[
                'Your dining expenses are 40% higher than last month',
                'Try reducing coffee shop visits by 3 per week to save ₹1,800',
                "You've been spending more on weekends - consider meal prepping",
              ].map((text, i) => (
                <View key={i} style={styles.insightRow}>
                  <View style={styles.insightDot} />
                  <Text style={styles.insightText}>{text}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Recommendations Card */}
          <LinearGradient colors={['#9333ea', '#7e22ce']} style={styles.promoCard}>
            <Text style={styles.promoTitle}>Suggested Action</Text>
            <Text style={styles.promoBody}>
              To stay within budget, try limiting daily spending to ₹1,200 for the rest of the month
            </Text>
            <TouchableOpacity style={styles.promoButton}>
              <Text style={styles.promoButtonText}>Set Daily Limit</Text>
            </TouchableOpacity>
          </LinearGradient>
        </ScrollView>

        <BottomNavigation active="home" onNavigate={navigateTo} />
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', padding: 24, paddingTop: 12 },
  backButton: { marginRight: 16 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#1e1b4b' },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 100 },
  alertCard: {
    flexDirection: 'row',
    backgroundColor: '#fff1f2',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#fecaca',
    marginBottom: 16,
    alignItems: 'center',
    gap: 12,
  },
  alertIconBox: { width: 48, height: 48, backgroundColor: '#fee2e2', borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
  alertTitle: { fontSize: 16, fontWeight: 'bold', color: '#7f1d1d' },
  alertBody: { fontSize: 14, color: '#b91c1c', marginTop: 2 },
  glassCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 32,
    padding: 24,
    borderWidth: 1,
    borderColor: '#f3e8ff',
    marginBottom: 16,
  },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#1e1b4b', marginBottom: 12 },
  legendContainer: { flexDirection: 'row', justifyContent: 'center', gap: 24, marginTop: 8 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  legendDot: { width: 16, height: 4, borderRadius: 2 },
  legendText: { color: '#4c1d95', fontSize: 14 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1e1b4b' },
  insightList: { gap: 12 },
  insightRow: { flexDirection: 'row', gap: 12 },
  insightDot: { width: 6, height: 6, backgroundColor: '#9333ea', borderRadius: 3, marginTop: 6 },
  insightText: { flex: 1, color: '#4c1d95', lineHeight: 20 },
  promoCard: { borderRadius: 32, padding: 24 },
  promoTitle: { color: 'white', fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  promoBody: { color: 'rgba(255,255,255,0.8)', fontSize: 14, marginBottom: 16, lineHeight: 20 },
  promoButton: { backgroundColor: 'white', paddingVertical: 12, borderRadius: 16, alignItems: 'center' },
  promoButtonText: { color: '#9333ea', fontWeight: 'bold' },
});