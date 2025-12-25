import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Modal,
  Platform,
} from 'react-native';
import { ArrowLeft, Plus, Target, Calendar, TrendingUp } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import BottomNavigation from '../BottomNavigation';

interface Goal {
  id: number;
  name: string;
  target: number;
  current: number;
  deadline: string;
  color: string;
  suggestedDaily: number;
}

interface GoalsSavingsProps {
  goals?: Goal[]; 
  onAddGoal?: (goal: { name: string; target: number; deadline: string }) => void;
}

export default function GoalsSavings({ goals = [], onAddGoal }: GoalsSavingsProps) {
  // 1. HOOKS (Must always be at the very top level)
  const navigation = useNavigation<any>();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newGoalName, setNewGoalName] = useState('');
  const [newGoalTarget, setNewGoalTarget] = useState('');
  const [newGoalDeadline, setNewGoalDeadline] = useState('');

  // 2. STABLE CALCULATIONS
  const { totalSavings, totalTarget, overallProgress } = useMemo(() => {
    const s = goals.reduce((sum, goal) => sum + (goal.current || 0), 0);
    const t = goals.reduce((sum, goal) => sum + (goal.target || 0), 0);
    const p = t > 0 ? (s / t) * 100 : 0;
    return { totalSavings: s, totalTarget: t, overallProgress: p };
  }, [goals]);

  // 3. LOGIC HANDLERS
  const handleCreateGoal = () => {
    const numericTarget = parseFloat(newGoalTarget);
    if (newGoalName.trim() && !isNaN(numericTarget) && typeof onAddGoal === 'function') {
      onAddGoal({
        name: newGoalName.trim(),
        target: numericTarget,
        deadline: newGoalDeadline || 'No deadline',
      });
      setNewGoalName('');
      setNewGoalTarget('');
      setNewGoalDeadline('');
      setShowCreateModal(false);
    }
  };

  return (
    <View style={styles.root}>
      <LinearGradient colors={['#f5f3ff', '#eff6ff']} style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <ArrowLeft size={24} color="#9333ea" />
            </TouchableOpacity>
            <View style={styles.headerTitleContainer}>
              <Text style={styles.headerTitle}>Goals & Savings</Text>
              <Text style={styles.headerSubtitle}>Track your financial goals</Text>
            </View>
            <TouchableOpacity
              style={styles.plusButton}
              onPress={() => setShowCreateModal(true)}
            >
              <Plus size={24} color="white" strokeWidth={2} />
            </TouchableOpacity>
          </View>

          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Summary Card */}
            <LinearGradient
              colors={['#9333ea', '#7c3aed']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.summaryCard}
            >
              <Text style={styles.summaryLabel}>Total Savings</Text>
              <Text style={styles.summaryAmount}>₹{totalSavings.toLocaleString()}</Text>
              <View style={styles.summaryRow}>
                <Text style={styles.summarySubtext}>Target: ₹{totalTarget.toLocaleString()}</Text>
                <Text style={styles.summarySubtext}>{overallProgress.toFixed(0)}%</Text>
              </View>
              <View style={styles.summaryProgressBarBg}>
                <View style={[styles.summaryProgressBarFill, { width: `${Math.min(overallProgress, 100)}%` }]} />
              </View>
            </LinearGradient>

            {/* Goals List with Safety Check */}
            {goals.length > 0 ? (
              goals.map((goal) => {
                const progress = goal.target > 0 ? (goal.current / goal.target) * 100 : 0;
                const remaining = goal.target - goal.current;
                
                return (
                  <View key={goal.id} style={styles.goalCard}>
                    <View style={styles.goalHeader}>
                      <View style={styles.goalIconBox}>
                        <Target size={24} color="white" />
                      </View>
                      <View style={styles.goalInfo}>
                        <Text style={styles.goalName}>{goal.name}</Text>
                        <View style={styles.deadlineRow}>
                          <Calendar size={14} color="#9333ea" />
                          <Text style={styles.deadlineText}>{goal.deadline}</Text>
                        </View>
                      </View>
                    </View>

                    <View style={styles.progressSection}>
                      <View style={styles.progressLabelRow}>
                        <Text style={styles.progressCurrent}>₹{(goal.current || 0).toLocaleString()}</Text>
                        <Text style={styles.progressTarget}>₹{(goal.target || 0).toLocaleString()}</Text>
                      </View>
                      <View style={styles.progressBarBg}>
                        <View style={[styles.progressBarFill, { width: `${Math.min(progress, 100)}%`, backgroundColor: '#9333ea' }]} />
                      </View>
                      <Text style={styles.progressPercentage}>
                        {progress.toFixed(0)}% complete · ₹{remaining.toLocaleString()} remaining
                      </Text>
                    </View>

                    <View style={styles.suggestionBox}>
                      <View style={styles.suggestionHeader}>
                        <TrendingUp size={16} color="#16a34a" />
                        <Text style={styles.suggestionTitle}>Smart Suggestion</Text>
                      </View>
                      <Text style={styles.suggestionBody}>
                        Add ₹{goal.suggestedDaily || 0} today to stay on track
                      </Text>
                    </View>
                  </View>
                );
              })
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No goals yet. Create one to start saving!</Text>
              </View>
            )}

            <TouchableOpacity
              style={styles.dashedButton}
              onPress={() => setShowCreateModal(true)}
            >
              <View style={styles.dashedButtonIcon}>
                <Plus size={24} color="#9333ea" />
              </View>
              <Text style={styles.dashedButtonText}>Create New Goal</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>

      {/* Modal - Outside ScrollView to prevent hook interference */}
      <Modal
        visible={showCreateModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCreateModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create New Goal</Text>
            <View style={styles.field}>
              <Text style={styles.label}>Goal Name</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Travel Fund"
                value={newGoalName}
                onChangeText={setNewGoalName}
              />
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Target Amount (₹)</Text>
              <TextInput
                style={styles.input}
                placeholder="50000"
                keyboardType="numeric"
                value={newGoalTarget}
                onChangeText={setNewGoalTarget}
              />
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Deadline (Optional)</Text>
              <TextInput
                style={styles.input}
                placeholder="Dec 2025"
                value={newGoalDeadline}
                onChangeText={setNewGoalDeadline}
              />
            </View>
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setShowCreateModal(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.createButton, (!newGoalName.trim() || !newGoalTarget) && { opacity: 0.5 }]} 
                disabled={!newGoalName.trim() || !newGoalTarget} 
                onPress={handleCreateGoal}
              >
                <Text style={styles.createButtonText}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Fixed Hook Context Provider */}
      <BottomNavigation />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1 },
  safeArea: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', padding: 24, paddingTop: Platform.OS === 'ios' ? 12 : 40 },
  backButton: { padding: 4 },
  headerTitleContainer: { flex: 1, marginLeft: 16 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#1e1b4b' },
  headerSubtitle: { fontSize: 14, color: '#9333ea' },
  plusButton: { width: 40, height: 40, backgroundColor: '#9333ea', borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 120 },
  summaryCard: { borderRadius: 32, padding: 24, marginBottom: 16, elevation: 4 },
  summaryLabel: { color: '#f3e8ff', marginBottom: 8 },
  summaryAmount: { color: 'white', fontSize: 32, fontWeight: 'bold', marginBottom: 16 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  summarySubtext: { color: '#f3e8ff' },
  summaryProgressBarBg: { height: 8, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 4, overflow: 'hidden' },
  summaryProgressBarFill: { height: '100%', backgroundColor: 'white' },
  goalCard: { backgroundColor: 'white', borderRadius: 32, padding: 24, marginBottom: 16, borderWidth: 1, borderColor: '#f3e8ff' },
  goalHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  goalIconBox: { width: 48, height: 48, borderRadius: 16, backgroundColor: '#9333ea', justifyContent: 'center', alignItems: 'center' },
  goalInfo: { flex: 1, marginLeft: 16 },
  goalName: { fontSize: 18, fontWeight: 'bold', color: '#1e1b4b' },
  deadlineRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  deadlineText: { color: '#9333ea', fontSize: 14 },
  progressSection: { marginBottom: 16 },
  progressLabelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  progressCurrent: { fontWeight: 'bold', color: '#1e1b4b' },
  progressTarget: { color: '#1e1b4b' },
  progressBarBg: { height: 10, backgroundColor: '#f3e8ff', borderRadius: 5, overflow: 'hidden' },
  progressBarFill: { height: '100%', borderRadius: 5 },
  progressPercentage: { color: '#9333ea', fontSize: 12, marginTop: 8 },
  suggestionBox: { backgroundColor: '#f0fdf4', borderRadius: 24, padding: 16, borderWidth: 1, borderColor: '#bbf7d0' },
  suggestionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  suggestionTitle: { color: '#14532d', fontWeight: 'bold' },
  suggestionBody: { color: '#15803d', fontSize: 14 },
  dashedButton: { width: '100%', backgroundColor: 'white', borderRadius: 32, padding: 24, borderStyle: 'dashed', borderWidth: 2, borderColor: '#c084fc', alignItems: 'center', gap: 12 },
  dashedButtonIcon: { width: 48, height: 48, backgroundColor: '#f3e8ff', borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
  dashedButtonText: { color: '#9333ea', fontWeight: 'bold' },
  emptyContainer: { padding: 40, alignItems: 'center' },
  emptyText: { color: '#9333ea', textAlign: 'center' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 24 },
  modalContent: { backgroundColor: 'white', borderRadius: 32, padding: 24 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#1e1b4b', marginBottom: 20 },
  field: { marginBottom: 16 },
  label: { color: '#4c1d95', marginBottom: 8 },
  input: { backgroundColor: '#f5f3ff', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#ddd6fe', color: '#000' },
  modalActions: { flexDirection: 'row', gap: 12, marginTop: 12 },
  cancelButton: { flex: 1, backgroundColor: '#f5f3ff', padding: 14, borderRadius: 12, alignItems: 'center' },
  cancelButtonText: { color: '#9333ea', fontWeight: 'bold' },
  createButton: { flex: 1, backgroundColor: '#9333ea', padding: 14, borderRadius: 12, alignItems: 'center' },
  createButtonText: { color: 'white', fontWeight: 'bold' },
});