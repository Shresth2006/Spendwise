import React, { useState, useMemo } from 'react';
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
  Trash2,
  Wallet,
  Trophy,
  X,
  Edit2,
} from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import BottomNavigation from '../BottomNavigation';
import { useDarkMode } from '../DarkModeProvider'; // Import your hook

const { width } = Dimensions.get('window');
const THEME_COLORS = ['#6366F1', '#EC4899', '#8B5CF6', '#10B981', '#F59E0B'];

export default function GoalsSavings({ goals, totalSpendable, onAddGoal, onUpdateGoal, onDeleteGoal }: any) {
  const { darkMode: isDark } = useDarkMode();
  
  const [createVisible, setCreateVisible] = useState(false);
  const [editingGoal, setEditingGoal] = useState<any>(null);
  const [addAmountGoal, setAddAmountGoal] = useState<any>(null);
  const [amountToAdd, setAmountToAdd] = useState('');

  // Form States
  const [name, setName] = useState('');
  const [target, setTarget] = useState('');
  const [deadline, setDeadline] = useState<string | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [pickerDate, setPickerDate] = useState(new Date());

  // --- DYNAMIC THEME ---
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
    const saved = goals.reduce((s: number, g: any) => s + (g.current || 0), 0);
    const tgt = goals.reduce((s: number, g: any) => s + (g.target || 0), 0);
    return { totalSaved: saved, totalTarget: tgt, progress: tgt > 0 ? (saved / tgt) * 100 : 0 };
  }, [goals]);

  const handleSaveGoal = () => {
    if (!name.trim() || !target || !deadline) return Alert.alert("Missing Info", "Please fill all fields.");
    const goalData = { name: name.trim(), target: Number(target), deadline };
    if (editingGoal) {
      onUpdateGoal({ ...editingGoal, ...goalData });
    } else {
      onAddGoal(goalData);
    }
    resetForm();
  };

  const resetForm = () => {
    setName(''); setTarget(''); setDeadline(null); 
    setCreateVisible(false); setEditingGoal(null);
  };

  const openEdit = (goal: any) => {
    setEditingGoal(goal);
    setName(goal.name);
    setTarget(goal.target.toString());
    setDeadline(goal.deadline);
    setCreateVisible(true);
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
        
        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.headerTitle, { color: theme.text }]}>Goals</Text>
            <View style={styles.walletBadge}>
              <Wallet size={12} color={theme.primary} />
              <Text style={styles.walletText}>₹{totalSpendable.toLocaleString()} Available</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.addBtn} onPress={() => setCreateVisible(true)}>
            <Plus size={24} color="white" />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          
          {/* SUMMARY CARD */}
          <LinearGradient 
            colors={isDark ? ['#4F46E5', '#7C3AED'] : ['#6366F1', '#9333EA']} 
            start={{x:0,y:0}} end={{x:1,y:1}} 
            style={styles.summaryCard}
          >
            <View style={styles.summaryHeader}>
              <Text style={styles.summaryLabel}>TOTAL SAVED</Text>
              <TrendingUp size={18} color="white" opacity={0.7} />
            </View>
            <Text style={styles.summaryAmount}>₹{totalSaved.toLocaleString()}</Text>
            <View style={styles.summaryFooter}>
              <Text style={styles.summaryTarget}>Target: ₹{totalTarget.toLocaleString()}</Text>
              <Text style={styles.summaryPct}>{progress.toFixed(0)}%</Text>
            </View>
            <View style={styles.summaryProgressBg}>
              <View style={[styles.summaryProgressFill, { width: `${Math.min(progress, 100)}%` }]} />
            </View>
          </LinearGradient>

          {/* GOALS LIST */}
          <View style={styles.listContainer}>
            {goals.map((goal: any, index: number) => {
              const color = THEME_COLORS[index % THEME_COLORS.length];
              const pct = Math.min((goal.current / goal.target) * 100, 100);
              const isDone = pct >= 100;

              return (
                <View key={goal.id} style={[styles.barRow, { backgroundColor: theme.card }]}>
                  {/* Left Icon */}
                  <View style={[styles.iconWrapper, { backgroundColor: color + (isDark ? '25' : '15') }]}>
                    <Target size={22} color={color} />
                  </View>

                  {/* Middle Info */}
                  <View style={styles.mainInfo}>
                    <Text style={[styles.goalTitle, { color: theme.text }]} numberOfLines={1}>{goal.name}</Text>
                    <Text style={[styles.goalSubText, { color: theme.subText }]}>{goal.deadline}</Text>
                  </View>

                  {/* Right Stats & Actions */}
                  <View style={styles.statsContainer}>
                    <View style={styles.moneyRow}>
                      <Text style={[styles.currentText, { color: theme.text }]}>₹{goal.current.toLocaleString()}</Text>
                      <Text style={[styles.targetText, { color: theme.subText }]}>/ ₹{goal.target.toLocaleString()}</Text>
                    </View>
                    
                    <View style={styles.progressActionRow}>
                      <View style={[styles.progressBarBg, { backgroundColor: isDark ? '#2D2D3F' : '#F1F5F9' }]}>
                        <View style={[styles.progressBarFill, { width: `${pct}%`, backgroundColor: isDone ? '#F59E0B' : color }]} />
                      </View>
                      
                      <TouchableOpacity 
                        style={[styles.actionBtn, { backgroundColor: isDark ? '#2D2D3F' : '#F0F4FF' }]} 
                        onLongPress={() => onDeleteGoal(goal.id)}
                        onPress={() => setAddAmountGoal(goal)}
                      >
                        <Plus size={16} color={theme.primary} />
                      </TouchableOpacity>

                      <TouchableOpacity onPress={() => openEdit(goal)} style={styles.editBtnSmall}>
                        <Edit2 size={12} color={theme.subText} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* ADD FUNDS MODAL */}
      <Modal visible={!!addAmountGoal} transparent animationType="fade">
        <View style={[styles.modalBg, { backgroundColor: theme.modalOverlay }]}>
          <View style={[styles.modal, { backgroundColor: theme.card }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Add Funds</Text>
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
              <TouchableOpacity style={styles.confirmBtn} onPress={() => { onUpdateGoal({ ...addAmountGoal, current: (addAmountGoal.current || 0) + Number(amountToAdd) }); setAmountToAdd(''); setAddAmountGoal(null); }}>
                <Text style={styles.confirmBtnText}>Add Funds</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* CREATE/EDIT GOAL MODAL */}
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
              <DateTimePicker 
                value={pickerDate} 
                mode="date" 
                display="default" 
                onChange={onDateChange} 
                minimumDate={new Date()} 
              />
            )}
            
            <TouchableOpacity style={styles.createBtn} onPress={handleSaveGoal}>
              <Text style={styles.confirmBtnText}>{editingGoal ? 'Save Changes' : 'Create Goal'}</Text>
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
  barRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 16, 
    borderRadius: 24, 
    elevation: 2,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8,
  },
  iconWrapper: { width: 46, height: 46, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  mainInfo: { flex: 1 },
  goalTitle: { fontSize: 16, fontWeight: '900' },
  goalSubText: { fontSize: 11, fontWeight: '600', marginTop: 2 },
  
  statsContainer: { flex: 1.5, alignItems: 'flex-end' },
  moneyRow: { flexDirection: 'row', alignItems: 'baseline', marginBottom: 6 },
  currentText: { fontSize: 15, fontWeight: '900' },
  targetText: { fontSize: 10, fontWeight: '700', marginLeft: 2 },
  
  progressActionRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  progressBarBg: { height: 4, flex: 1, borderRadius: 2, overflow: 'hidden' },
  progressBarFill: { height: '100%' },
  actionBtn: { width: 28, height: 28, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  editBtnSmall: { padding: 4 },

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