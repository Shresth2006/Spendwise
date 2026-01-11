import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  TextInput,
  Modal,
  Alert,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  Plus,
  Target,
  Calendar,
  TrendingUp,
  Wallet,
  X,
  Edit2,
  Trash2,
} from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import auth from '@react-native-firebase/auth';
import BottomNavigation from '../BottomNavigation';
import { useDarkMode } from '../DarkModeProvider';
import { goalService } from '../../services/api';

const THEME_COLORS = ['#6366F1', '#EC4899', '#8B5CF6', '#10B981', '#F59E0B'];

// FIXED: Define the Goal interface to clear red ".id" errors
interface Goal {
  id: string;
  name: string;
  target: number;
  current: number;
  deadline: string;
  user_id?: string;
}

export default function GoalsSavings({ 
  goals = [] as Goal[], 
  totalSpendable = 0, 
  monthlyLimit = 0, 
  onAddGoal, 
  onUpdateGoal, 
  onDeleteGoal,
  setGlobalBalances 
}: any) {
  const { darkMode: isDark } = useDarkMode();
  const isMounted = useRef(true);

  const [createVisible, setCreateVisible] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [addAmountGoal, setAddAmountGoal] = useState<Goal | null>(null);
  const [amountToAdd, setAmountToAdd] = useState('');

  // Form States
  const [name, setName] = useState('');
  const [target, setTarget] = useState('');
  const [deadline, setDeadline] = useState<string | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [pickerDate, setPickerDate] = useState(new Date());

  const theme = {
    bg: isDark ? '#000' : '#F8F9FE',
    card: isDark ? '#161622' : '#FFFFFF',
    text: isDark ? '#FFF' : '#1E1B4B',
    subText: isDark ? '#94A3B8' : '#64748B',
    border: isDark ? 'rgba(255,255,255,0.1)' : '#E2E8F0',
    inputBg: isDark ? '#1E1E2D' : '#F8FAFC',
    primary: '#6366F1',
    modalOverlay: 'rgba(0,0,0,0.7)',
  };

  const { totalSaved, totalTarget, progress } = useMemo(() => {
    const saved = goals.reduce((s: number, g: Goal) => s + (g.current || 0), 0);
    const tgt = goals.reduce((s: number, g: Goal) => s + (g.target || 0), 0);
    return { totalSaved: saved, totalTarget: tgt, progress: tgt > 0 ? (saved / tgt) * 100 : 0 };
  }, [goals]);

  // --- LOGIC: ADD FUNDS TO GOAL ---
  const handleAddFunds = async () => {
    if (!addAmountGoal) return;
    const amount = Number(amountToAdd);
    if (!amount || amount <= 0) return;

    const remainingToTarget = addAmountGoal.target - (addAmountGoal.current || 0);
    if (amount > remainingToTarget) {
      Alert.alert("Limit Reached", `You only need ₹${remainingToTarget} to finish this goal.`);
      return;
    }

    if (amount > monthlyLimit) {
      Alert.alert("Over Budget", "This amount exceeds your remaining monthly allowance!");
      return;
    }

    const user = auth().currentUser;
    if (!user) return;

    try {
      const newCurrent = (addAmountGoal.current || 0) + amount;
      
      if (newCurrent >= addAmountGoal.target) {
        Alert.alert("Goal Achieved! 🎉", `Saved for ${addAmountGoal.name}.`);
        await goalService.delete(addAmountGoal.id);
        onDeleteGoal(addAmountGoal.id);
      } 
      else {
        await goalService.update(addAmountGoal.id, { current: newCurrent });
        onUpdateGoal({ ...addAmountGoal, current: newCurrent });
      }

      if (setGlobalBalances) {
        setGlobalBalances(totalSpendable - amount, monthlyLimit - amount);
      }

      setAddAmountGoal(null);
      setAmountToAdd('');
    } catch (e) {
      Alert.alert("Error", "Could not update goal.");
    }
  };

  // --- LOGIC: MANUAL DELETE ---
  const handleManualDelete = (goal: Goal) => {
    Alert.alert(
      "Delete Goal?",
      "Saved money (₹" + goal.current + ") will be returned to your allowance.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete & Refund", 
          style: "destructive", 
          onPress: async () => {
            const user = auth().currentUser;
            if (user) {
              await goalService.delete(goal.id);
              onDeleteGoal(goal.id);
              if (setGlobalBalances) {
                setGlobalBalances(totalSpendable + goal.current, monthlyLimit + goal.current);
              }
            }
          } 
        }
      ]
    );
  };

  const handleSaveGoal = async () => {
    if (!name.trim() || !target || !deadline) return Alert.alert("Missing Info", "Please fill all fields.");
    const user = auth().currentUser;
    if (!user) return;

    const goalData: Goal = { 
      id: editingGoal?.id || Math.random().toString(36).substr(2, 9),
      name: name.trim(), 
      target: Number(target), 
      current: editingGoal?.current || 0,
      deadline,
      user_id: user.uid
    };

    try {
      if (editingGoal) {
        await goalService.update(goalData.id, goalData);
        onUpdateGoal(goalData);
      } else {
        await goalService.create(goalData);
        onAddGoal(goalData);
      }
      resetForm();
    } catch (e) {
      Alert.alert("Error", "Could not save goal.");
    }
  };

  const openEdit = (goal: Goal) => {
    setEditingGoal(goal);
    setName(goal.name);
    setTarget(goal.target.toString());
    setDeadline(goal.deadline);
    setCreateVisible(true);
  };

  const resetForm = () => {
    setName(''); setTarget(''); setDeadline(null); 
    setCreateVisible(false); setEditingGoal(null);
  };

  const onDateChange = (_: any, date?: Date) => {
    setShowPicker(Platform.OS === 'ios');
    if (date) {
      setPickerDate(date);
      setDeadline(date.toISOString().split('T')[0]);
    }
  };

  return (
    <View style={[styles.root, { backgroundColor: theme.bg }]}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        
        <View style={styles.header}>
          <View>
            <Text style={[styles.headerTitle, { color: theme.text }]}>Savings Goals</Text>
            <View style={styles.walletBadge}>
              <Wallet size={12} color={theme.primary} />
              <Text style={styles.walletText}>₹{monthlyLimit.toLocaleString()} Allowance Left</Text>
            </View>
            <Text style={[styles.accountLabel, { color: theme.subText }]}>
              Actual Bank: ₹{totalSpendable.toLocaleString()}
            </Text>
          </View>
          <TouchableOpacity style={styles.addBtn} onPress={() => { resetForm(); setCreateVisible(true); }}>
            <Plus size={24} color="white" />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          
          <LinearGradient 
            colors={isDark ? ['#4F46E5', '#7C3AED'] : ['#6366F1', '#9333EA']} 
            start={{x:0,y:0}} end={{x:1,y:1}} 
            style={styles.summaryCard}
          >
            <View style={styles.summaryHeader}>
              <Text style={styles.summaryLabel}>TOTAL GOAL SAVINGS</Text>
              <TrendingUp size={18} color="white" opacity={0.7} />
            </View>
            <Text style={styles.summaryAmount}>₹{totalSaved.toLocaleString()}</Text>
            <View style={styles.summaryFooter}>
              <Text style={styles.summaryTarget}>Overall Target: ₹{totalTarget.toLocaleString()}</Text>
              <Text style={styles.summaryPct}>{progress.toFixed(0)}%</Text>
            </View>
            <View style={styles.summaryProgressBg}>
              <View style={[styles.summaryProgressFill, { width: `${Math.min(progress, 100)}%` }]} />
            </View>
          </LinearGradient>

          <View style={styles.listContainer}>
            {goals.map((goal: Goal, index: number) => {
              const color = THEME_COLORS[index % THEME_COLORS.length];
              const pct = Math.min((goal.current / goal.target) * 100, 100);

              return (
                <View key={goal.id} style={[styles.barRow, { backgroundColor: theme.card }]}>
                  <View style={[styles.iconWrapper, { backgroundColor: color + (isDark ? '25' : '15') }]}>
                    <Target size={22} color={color} />
                  </View>

                  <View style={styles.mainInfo}>
                    <Text style={[styles.goalTitle, { color: theme.text }]} numberOfLines={1}>{goal.name}</Text>
                    <Text style={[styles.goalSubText, { color: theme.subText }]}>₹{goal.target - goal.current} left</Text>
                  </View>

                  <View style={styles.statsContainer}>
                    <View style={styles.moneyRow}>
                      <Text style={[styles.currentText, { color: theme.text }]}>₹{goal.current.toLocaleString()}</Text>
                    </View>
                    
                    <View style={styles.progressActionRow}>
                      <View style={[styles.progressBarBg, { backgroundColor: isDark ? '#2D2D3F' : '#F1F5F9' }]}>
                        <View style={[styles.progressBarFill, { width: `${pct}%`, backgroundColor: color }]} />
                      </View>
                      
                      <TouchableOpacity style={styles.iconActionBtn} onPress={() => setAddAmountGoal(goal)}>
                        <Plus size={16} color={theme.primary} />
                      </TouchableOpacity>

                      <TouchableOpacity style={styles.iconActionBtn} onPress={() => openEdit(goal)}>
                        <Edit2 size={14} color={theme.subText} />
                      </TouchableOpacity>

                      <TouchableOpacity style={styles.iconActionBtn} onPress={() => handleManualDelete(goal)}>
                        <Trash2 size={14} color="#EF4444" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        </ScrollView>
      </SafeAreaView>

      <Modal visible={!!addAmountGoal} transparent animationType="fade">
        <View style={[styles.modalBg, { backgroundColor: theme.modalOverlay }]}>
          <View style={[styles.modal, { backgroundColor: theme.card }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Add Funds</Text>
            <Text style={{color: theme.subText, marginBottom: 10, fontSize: 12}}>
                Target remaining: ₹{addAmountGoal ? addAmountGoal.target - addAmountGoal.current : 0}
            </Text>
            <TextInput 
              style={[styles.modalInput, { backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }]} 
              placeholder="₹ 0" 
              placeholderTextColor={theme.subText}
              keyboardType="numeric" 
              value={amountToAdd} 
              onChangeText={setAmountToAdd} 
              autoFocus 
            />
            <View style={styles.modalActions}>
              <TouchableOpacity onPress={() => setAddAmountGoal(null)}>
                <Text style={[styles.cancelText, { color: theme.subText }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmBtn} onPress={handleAddFunds}>
                <Text style={styles.confirmBtnText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={createVisible} animationType="slide" transparent>
        <View style={[styles.modalBg, { backgroundColor: theme.modalOverlay }]}>
          <View style={[styles.modal, { backgroundColor: theme.card }]}>
            <View style={styles.modalHeaderRow}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>{editingGoal ? 'Edit Goal' : 'New Goal'}</Text>
              <TouchableOpacity onPress={resetForm}><X size={24} color={theme.subText} /></TouchableOpacity>
            </View>
            <TextInput 
              style={[styles.modalInput, { backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }]} 
              placeholder="Goal Name" 
              placeholderTextColor={theme.subText}
              value={name} 
              onChangeText={setName} 
            />
            <TextInput 
              style={[styles.modalInput, { backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }]} 
              placeholder="Target Amount" 
              placeholderTextColor={theme.subText}
              keyboardType="numeric" 
              value={target} 
              onChangeText={setTarget} 
            />
            <TouchableOpacity style={[styles.dateBtn, { backgroundColor: theme.inputBg, borderColor: theme.border }]} onPress={() => setShowPicker(true)}>
              <Calendar size={18} color={theme.primary} />
              <Text style={[styles.dateBtnText, { color: deadline ? theme.text : theme.subText }]}>{deadline || 'Target Date'}</Text>
            </TouchableOpacity>
            
            {showPicker && (
              <DateTimePicker value={pickerDate} mode="date" display="default" onChange={onDateChange} minimumDate={new Date()} />
            )}
            
            <TouchableOpacity style={styles.createBtn} onPress={handleSaveGoal}>
              <Text style={styles.confirmBtnText}>{editingGoal ? 'Save' : 'Create'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <BottomNavigation />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  safeArea: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 25, paddingVertical: 20 },
  headerTitle: { fontSize: 28, fontWeight: '900' },
  walletBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  walletText: { color: '#6366F1', fontSize: 13, fontWeight: '800' },
  accountLabel: { fontSize: 10, fontWeight: '600', marginTop: 2 },
  addBtn: { width: 48, height: 48, backgroundColor: '#6366F1', borderRadius: 16, justifyContent: 'center', alignItems: 'center', elevation: 4 },
  scroll: { paddingHorizontal: 25, paddingBottom: 140 },
  summaryCard: { borderRadius: 30, padding: 25, marginBottom: 25, elevation: 8 },
  summaryHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 11, fontWeight: '900' },
  summaryAmount: { color: 'white', fontSize: 36, fontWeight: '900', marginVertical: 8 },
  summaryFooter: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  summaryTarget: { color: 'white', fontSize: 13, fontWeight: '700' },
  summaryPct: { color: 'white', fontSize: 13, fontWeight: '900' },
  summaryProgressBg: { height: 6, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 3, overflow: 'hidden' },
  summaryProgressFill: { height: '100%', backgroundColor: 'white' },
  listContainer: { gap: 12 },
  barRow: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 24, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 },
  iconWrapper: { width: 46, height: 46, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  mainInfo: { flex: 1 },
  goalTitle: { fontSize: 16, fontWeight: '900' },
  goalSubText: { fontSize: 11, fontWeight: '600', marginTop: 2 },
  statsContainer: { flex: 1.5, alignItems: 'flex-end' },
  moneyRow: { flexDirection: 'row', alignItems: 'baseline', marginBottom: 6 },
  currentText: { fontSize: 15, fontWeight: '900' },
  targetText: { fontSize: 10, fontWeight: '700', marginLeft: 2 },
  progressActionRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  progressBarBg: { height: 4, flex: 1, borderRadius: 2, overflow: 'hidden' },
  progressBarFill: { height: '100%' },
  iconActionBtn: { padding: 4 },
  modalBg: { flex: 1, justifyContent: 'center', padding: 25 },
  modal: { borderRadius: 30, padding: 25 },
  modalHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: '900' },
  modalInput: { borderRadius: 12, padding: 15, marginBottom: 15, borderWidth: 1, fontWeight: '700' },
  dateBtn: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 15, borderRadius: 12, borderWidth: 1, marginBottom: 20 },
  dateBtnText: { fontWeight: '700' },
  modalActions: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cancelText: { fontWeight: '800' },
  confirmBtn: { backgroundColor: '#6366F1', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12 },
  confirmBtnText: { color: 'white', fontWeight: '900' },
  createBtn: { backgroundColor: '#6366F1', padding: 18, borderRadius: 16, alignItems: 'center' },
});