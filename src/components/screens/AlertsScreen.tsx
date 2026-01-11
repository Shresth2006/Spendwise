import React, { useState, useRef, useMemo, useEffect } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, 
  TextInput, ScrollView, KeyboardAvoidingView, Platform, Animated, SafeAreaView, StatusBar, PanResponder 
} from 'react-native';
import { ArrowLeft, Bell, Calendar, Trash2, Zap, FileText, CreditCard, CheckCircle, Wallet, Pencil } from 'lucide-react-native'; 
import { useNavigation } from '@react-navigation/native';
import { useDarkMode } from '../DarkModeProvider';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AlertItem {
  id: number;
  name: string;
  amount: number;
  dueDate: string;
  type: string;
}

const STORAGE_KEY = '@user_reminders';

const SwipeableRow = ({ item, onDelete, onEdit, theme }: { item: AlertItem, onDelete: (id: number) => void, onEdit: (item: AlertItem) => void, theme: any }) => {
  const translateX = useRef(new Animated.Value(0)).current;
  
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dx) > 10,
      onPanResponderMove: (_, gestureState) => {
        translateX.setValue(gestureState.dx);
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx > 120) {
          Animated.spring(translateX, { toValue: 0, useNativeDriver: true }).start();
          onEdit(item);
        } else if (gestureState.dx < -120) {
          Animated.timing(translateX, { toValue: -500, duration: 200, useNativeDriver: true }).start(() => onDelete(item.id));
        } else {
          Animated.spring(translateX, { toValue: 0, useNativeDriver: true }).start();
        }
      },
    })
  ).current;

  return (
    <View style={styles.swipeContainer}>
      <View style={styles.actionBackground}>
        <View style={[styles.actionSide, { backgroundColor: '#3B82F6', alignItems: 'flex-start', paddingLeft: 20 }]}>
          <Pencil size={20} color="#FFF" />
        </View>
        <View style={[styles.actionSide, { backgroundColor: '#EF4444', alignItems: 'flex-end', paddingRight: 20 }]}>
          <Trash2 size={20} color="#FFF" />
        </View>
      </View>

      <Animated.View 
        style={[styles.reminderItem, { backgroundColor: theme.card, transform: [{ translateX }] }]} 
        {...panResponder.panHandlers}
      >
        <View style={[styles.iconBox, { backgroundColor: '#F0F7FF' }]}>
          <Zap size={20} color={theme.accent} />
        </View>
        <View style={styles.reminderContent}>
          <Text style={[styles.remName, { color: theme.textMain }]}>{item.name}</Text>
          <Text style={styles.remMeta}>
            {item.type} • Due {item.dueDate} • ₹{Number(item.amount).toLocaleString('en-IN')}
          </Text>
        </View>
      </Animated.View>
    </View>
  );
};

export default function AlertsScreen() {
  const navigation = useNavigation();
  const { darkMode: isDark } = useDarkMode();

  const theme = {
    bg: isDark ? '#0F172A' : '#F0F7FF',
    card: isDark ? '#1E293B' : '#FFFFFF',
    primary: '#1E293B',
    accent: '#4F46E5', 
    muted: '#94A3B8',
    inputBg: isDark ? '#334155' : '#F8FAFC',
    textMain: isDark ? '#F8FAFC' : '#1E293B',
  };

  const [type, setType] = useState('Bill');
  const [alertName, setAlertName] = useState('');
  const [alertAmount, setAlertAmount] = useState('');
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [dateLabel, setDateLabel] = useState('DD/MM/YYYY');
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const slideAnim = useRef(new Animated.Value(-100)).current;

  // --- Async Logic ---
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const savedAlerts = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedAlerts !== null) {
        setAlerts(JSON.parse(savedAlerts));
      }
    } catch (e) {
      console.error('Failed to load alerts.');
    }
  };

  const saveData = async (updatedAlerts: AlertItem[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedAlerts));
    } catch (e) {
      console.error('Failed to save alerts.');
    }
  };

  const totalDue = useMemo(() => alerts.reduce((sum, item) => sum + item.amount, 0), [alerts]);

  const triggerSuccess = () => {
    Animated.sequence([
      Animated.timing(slideAnim, { toValue: 60, duration: 400, useNativeDriver: true }),
      Animated.delay(1500),
      Animated.timing(slideAnim, { toValue: -100, duration: 400, useNativeDriver: true }),
    ]).start();
  };

  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') setShowPicker(false);
    if (selectedDate) {
      setDate(selectedDate);
      setDateLabel(selectedDate.toLocaleDateString('en-GB'));
    }
  };

  const handleSaveReminder = () => {
    if (alertName && alertAmount && dateLabel !== 'DD/MM/YYYY') {
      let updatedAlerts;
      if (editingId) {
        updatedAlerts = alerts.map(a => a.id === editingId ? { ...a, name: alertName, amount: parseFloat(alertAmount), dueDate: dateLabel, type } : a);
        setEditingId(null);
      } else {
        const newAlert: AlertItem = { id: Date.now(), name: alertName, amount: parseFloat(alertAmount), dueDate: dateLabel, type };
        updatedAlerts = [newAlert, ...alerts];
      }
      setAlerts(updatedAlerts);
      saveData(updatedAlerts);
      setAlertName(''); setAlertAmount(''); setDateLabel('DD/MM/YYYY');
      triggerSuccess();
    }
  };

  const deleteAlert = (id: number) => {
    const updatedAlerts = alerts.filter(a => a.id !== id);
    setAlerts(updatedAlerts);
    saveData(updatedAlerts);
  };

  const startEdit = (item: AlertItem) => {
    setEditingId(item.id);
    setAlertName(item.name);
    setAlertAmount(item.amount.toString());
    setDateLabel(item.dueDate);
    setType(item.type);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      
      <Animated.View style={[styles.successToast, { transform: [{ translateY: slideAnim }] }]}>
        <CheckCircle size={18} color="#FFF" />
        <Text style={styles.successText}>{editingId ? "Updated!" : "Saved!"}</Text>
      </Animated.View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.root}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <ArrowLeft size={22} color={theme.primary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.primary }]}>Alerts</Text>
          <View style={styles.placeholderBox} /> 
        </View>

        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <View style={[styles.summaryCard, { backgroundColor: theme.accent }]}>
            <View style={styles.summaryInfo}>
              <Text style={styles.summaryLabel}>Total Upcoming Due</Text>
              <Text style={styles.summaryAmount}>₹{totalDue.toLocaleString('en-IN')}</Text>
            </View>
            <View style={styles.summaryIconBox}><Wallet size={24} color="#FFF" opacity={0.8} /></View>
          </View>

          <View style={[styles.mainCard, { backgroundColor: theme.card }]}>
            <Text style={[styles.cardTitle, { color: theme.primary }]}>{editingId ? "Edit Reminder" : "Add Reminder"}</Text>
            <View style={styles.selectorRow}>
              {['Bill', 'Loan', 'EMI'].map((t) => (
                <TouchableOpacity key={t} onPress={() => setType(t)} style={[styles.typeTag, type === t ? { backgroundColor: '#EEF2FF', borderColor: theme.accent, borderWidth: 2 } : { borderColor: '#E2E8F0' }]}>
                  <Text style={[styles.typeTagText, { color: type === t ? theme.accent : theme.muted }]}>{t}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={[styles.inputWrapper, { backgroundColor: theme.inputBg }]}>
              <FileText size={18} color={theme.accent} />
              <TextInput placeholder="Title" placeholderTextColor={theme.muted} style={[styles.input, { color: theme.textMain }]} value={alertName} onChangeText={setAlertName} />
            </View>

            <View style={styles.row}>
              <View style={[styles.inputWrapper, { flex: 1, backgroundColor: theme.inputBg }]}>
                <CreditCard size={18} color={theme.accent} />
                <TextInput placeholder="Amount" keyboardType="numeric" style={[styles.input, { color: theme.textMain }]} value={alertAmount} onChangeText={setAlertAmount} />
              </View>
              <TouchableOpacity onPress={() => setShowPicker(true)} style={[styles.inputWrapper, { flex: 1.2, backgroundColor: theme.inputBg }]}>
                <Calendar size={18} color={theme.accent} />
                <Text style={[styles.dateText, { color: dateLabel === 'DD/MM/YYYY' ? theme.muted : theme.textMain }]}>{dateLabel}</Text>
              </TouchableOpacity>
            </View>

            {showPicker && <DateTimePicker value={date} mode="date" display="default" onChange={onDateChange} minimumDate={new Date()} />}

            <TouchableOpacity style={[styles.saveBtn, { backgroundColor: theme.accent }]} onPress={handleSaveReminder}>
              <Text style={styles.saveBtnText}>{editingId ? "Update Reminder" : "Save Reminder"}</Text>
            </TouchableOpacity>
          </View>

          <Text style={[styles.sectionLabel, { color: theme.primary }]}>Active Reminders</Text>
          <Text style={styles.swipeHint}>Swipe left to delete • Swipe right to edit</Text>
          
          {alerts.map((alert) => (
            <SwipeableRow key={alert.id} item={alert} onDelete={deleteAlert} onEdit={startEdit} theme={theme} />
          ))}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  root: { flex: 1 },
  successToast: { position: 'absolute', left: '25%', right: '25%', backgroundColor: '#10B981', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderRadius: 30, zIndex: 100, elevation: 10 },
  successText: { color: '#FFF', fontWeight: 'bold', marginLeft: 8, fontSize: 14 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, height: 60 },
  backBtn: { width: 42, height: 42, borderRadius: 12, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0' },
  headerTitle: { fontSize: 22, fontWeight: 'bold' },
  placeholderBox: { width: 42 },
  scrollContainer: { padding: 20 },
  summaryCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, borderRadius: 24, marginBottom: 25 },
  summaryInfo: { flex: 1 },
  summaryLabel: { color: '#FFF', fontSize: 13, opacity: 0.9 },
  summaryAmount: { color: '#FFF', fontSize: 28, fontWeight: '800' },
  summaryIconBox: { backgroundColor: 'rgba(255,255,255,0.2)', padding: 12, borderRadius: 16 },
  mainCard: { borderRadius: 24, padding: 20, elevation: 5, marginBottom: 30 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  selectorRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  typeTag: { paddingHorizontal: 18, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
  typeTagText: { fontSize: 13, fontWeight: '700' },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, borderRadius: 16, height: 55, marginBottom: 15, borderWidth: 1, borderColor: '#F1F5F9' },
  input: { flex: 1, marginLeft: 10, fontSize: 15 },
  dateText: { marginLeft: 10, fontSize: 15 },
  row: { flexDirection: 'row', gap: 12, marginBottom: 10 },
  saveBtn: { height: 55, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  saveBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  sectionLabel: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  swipeHint: { fontSize: 11, color: '#94A3B8', marginBottom: 15, paddingLeft: 4 },
  swipeContainer: { position: 'relative', marginBottom: 12, borderRadius: 20, overflow: 'hidden' },
  actionBackground: { ...StyleSheet.absoluteFillObject, flexDirection: 'row' },
  actionSide: { flex: 1, justifyContent: 'center' },
  reminderItem: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 20, elevation: 2 },
  iconBox: { width: 48, height: 48, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  reminderContent: { flex: 1, marginLeft: 12 },
  remName: { fontSize: 15, fontWeight: 'bold' },
  remMeta: { fontSize: 12, color: '#64748B', marginTop: 2 },
});