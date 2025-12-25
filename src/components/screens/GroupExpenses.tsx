import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { ArrowLeft, User, Clock } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import BottomNavigation from '../BottomNavigation';

interface GroupExpensesProps {
  navigateTo: (screen: string) => void;
}

export default function GroupExpenses({ navigateTo }: GroupExpensesProps) {
  const pendingPayments = [
    {
      id: 1,
      contact: 'Rahul Kumar',
      amount: 450,
      category: 'Dining',
      description: 'Dinner at Italian Restaurant',
      daysAgo: 2,
      autoDetected: true
    },
    {
      id: 2,
      contact: 'Priya Sharma',
      amount: 320,
      category: 'Transport',
      description: 'Uber ride split',
      daysAgo: 5,
      autoDetected: true
    },
    {
      id: 3,
      contact: 'Amit Patel',
      amount: 280,
      category: 'Entertainment',
      description: 'Movie tickets',
      daysAgo: 7,
      autoDetected: false
    },
    {
      id: 4,
      contact: 'Sneha Reddy',
      amount: 190,
      category: 'Coffee',
      description: 'Cafe bill split',
      daysAgo: 12,
      autoDetected: true
    },
  ];

  const totalPending = pendingPayments.reduce((sum, p) => sum + p.amount, 0);

  // Sort by FIFO (oldest first) - matching your original logic
  const sortedPayments = [...pendingPayments].sort((a, b) => b.daysAgo - a.daysAgo);

  return (
    <LinearGradient
      colors={['#f5f3ff', '#eff6ff']} // from-purple-50 to-blue-50
      style={styles.container}
    >
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigateTo('home')} style={styles.backButton}>
            <ArrowLeft color="#9333ea" size={24} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Pending Payments</Text>
            <Text style={styles.headerSub}>Track shared expenses</Text>
          </View>
        </View>

        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Total Pending Summary Card */}
          <LinearGradient
            colors={['#a855f7', '#9333ea']} // from-purple-500 to-purple-600
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.totalCard}
          >
            <Text style={styles.totalLabel}>Total Pending</Text>
            <Text style={styles.totalAmount}>₹{totalPending.toLocaleString()}</Text>
            <Text style={styles.totalCount}>{sortedPayments.length} pending payments</Text>
          </LinearGradient>

          {/* FIFO List Header */}
          <View style={styles.listHeader}>
            <Text style={styles.listTitle}>Oldest First</Text>
            <View style={styles.fifoIndicator}>
              <Clock size={16} color="#9333ea" />
              <Text style={styles.fifoText}>FIFO Order</Text>
            </View>
          </View>

          {/* Pending Payments Cards */}
          {sortedPayments.map((payment, index) => (
            <View key={payment.id} style={styles.paymentCard}>
              {/* Oldest Badge */}
              {index === 0 && (
                <View style={styles.oldestBadge}>
                  <Text style={styles.oldestText}>Oldest</Text>
                </View>
              )}

              <View style={styles.cardContent}>
                {/* Contact Avatar */}
                <LinearGradient
                  colors={['#c084fc', '#60a5fa']} // from-purple-400 to-blue-400
                  style={styles.avatar}
                >
                  <User size={24} color="white" />
                </LinearGradient>

                <View style={{ flex: 1 }}>
                  {/* Name & Amount */}
                  <View style={styles.row}>
                    <Text style={styles.contactName}>{payment.contact}</Text>
                    <Text style={styles.contactAmount}>₹{payment.amount}</Text>
                  </View>

                  <Text style={styles.description}>{payment.description}</Text>

                  {/* Badges Row */}
                  <View style={styles.badgeRow}>
                    <View style={styles.categoryBadge}>
                      <Text style={styles.categoryText}>{payment.category}</Text>
                    </View>
                    <View style={styles.timeInfo}>
                      <Clock size={12} color="#a855f7" />
                      <Text style={styles.timeText}>{payment.daysAgo} days ago</Text>
                    </View>
                    {payment.autoDetected && (
                      <View style={styles.autoBadge}>
                        <Text style={styles.autoText}>Auto-detected</Text>
                      </View>
                    )}
                  </View>

                  {/* Action Buttons */}
                  <View style={styles.actionRow}>
                    <TouchableOpacity style={styles.paidBtn}>
                      <Text style={styles.paidText}>Mark as Paid</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.remindBtn}>
                      <Text style={styles.remindText}>Remind</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          ))}

          {/* Info/Feature Card */}
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Auto-Detection Active</Text>
            <Text style={styles.infoBody}>
              We automatically detect split payments from your SMS messages to help you track shared expenses
            </Text>
          </View>
        </ScrollView>

        <BottomNavigation active="home" onNavigate={navigateTo} />
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 24, 
    paddingTop: 20, 
    paddingBottom: 24 
  },
  backButton: { marginRight: 16 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#1e1b4b' },
  headerSub: { fontSize: 14, color: '#9333ea' },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 100 },
  totalCard: { 
    borderRadius: 32, 
    padding: 24, 
    marginBottom: 24,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  totalLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 14, marginBottom: 8 },
  totalAmount: { color: 'white', fontSize: 32, fontWeight: 'bold', marginBottom: 8 },
  totalCount: { color: 'rgba(255,255,255,0.8)', fontSize: 14 },
  listHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 8, 
    marginBottom: 16 
  },
  listTitle: { fontSize: 18, fontWeight: 'bold', color: '#1e1b4b' },
  fifoIndicator: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  fifoText: { color: '#9333ea', fontSize: 14, fontWeight: '500' },
  paymentCard: { 
    backgroundColor: 'rgba(255,255,255,0.7)', 
    borderRadius: 32, 
    padding: 20, 
    borderWidth: 1, 
    borderColor: '#f3e8ff', 
    marginBottom: 16,
    position: 'relative'
  },
  cardContent: { flexDirection: 'row', gap: 16 },
  avatar: { 
    width: 48, 
    height: 48, 
    borderRadius: 24, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  contactName: { fontSize: 16, fontWeight: 'bold', color: '#1e1b4b' },
  contactAmount: { fontSize: 16, fontWeight: 'bold', color: '#1e1b4b' },
  description: { fontSize: 14, color: '#6b7280', marginBottom: 12 },
  badgeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  categoryBadge: { backgroundColor: '#f3e8ff', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  categoryText: { color: '#7c3aed', fontSize: 12, fontWeight: '500' },
  timeInfo: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  timeText: { color: '#a855f7', fontSize: 12 },
  autoBadge: { backgroundColor: '#dcfce7', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  autoText: { color: '#15803d', fontSize: 12, fontWeight: '500' },
  oldestBadge: { 
    position: 'absolute', 
    top: -8, 
    right: 20, 
    backgroundColor: '#ef4444', 
    paddingHorizontal: 12, 
    paddingVertical: 4, 
    borderRadius: 20,
    zIndex: 10
  },
  oldestText: { color: 'white', fontSize: 12, fontWeight: 'bold' },
  actionRow: { flexDirection: 'row', gap: 8 },
  paidBtn: { 
    flex: 1, 
    backgroundColor: '#9333ea', 
    paddingVertical: 10, 
    borderRadius: 16, 
    alignItems: 'center' 
  },
  paidText: { color: 'white', fontWeight: 'bold' },
  remindBtn: { 
    flex: 1, 
    backgroundColor: '#f3e8ff', 
    paddingVertical: 10, 
    borderRadius: 16, 
    alignItems: 'center' 
  },
  remindText: { color: '#7c3aed', fontWeight: 'bold' },
  infoCard: { 
    backgroundColor: '#eff6ff', 
    padding: 16, 
    borderRadius: 20, 
    borderWidth: 1, 
    borderColor: '#bfdbfe',
    marginBottom: 20
  },
  infoTitle: { color: '#1e3a8a', fontWeight: 'bold', marginBottom: 4 },
  infoBody: { color: '#1e40af', fontSize: 14, lineHeight: 20 }
});