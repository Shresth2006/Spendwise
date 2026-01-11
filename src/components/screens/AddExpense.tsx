import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  Alert,
  ActivityIndicator,
  Platform,
  StatusBar,
} from 'react-native';
import { ArrowLeft, Calendar, Check, ClipboardPaste, Zap } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useDarkMode } from '../DarkModeProvider';
import { transactionService } from '../../services/api'; 

const { width } = Dimensions.get('window');

const CAT_COLORS: Record<string, string> = {
  'Groceries': '#FF6B6B',
  'Dining': '#4ECDC4',
  'Transport': '#45B7D1',
  'Shopping': '#A29BFE',
  'Entertainment': '#FD79A8',
  'Healthcare': '#55E6C1',
  'Bills': '#F9CA24',
  'Miscellaneous': '#6366F1'
};

export default function AddExpense() {
  const navigation = useNavigation<any>();
  const { darkMode: isDark } = useDarkMode();

  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Miscellaneous');
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().split('T')[0]);
  const [rawSms, setRawSms] = useState(''); 
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // High-visibility placeholder color logic
  const placeholderColor = isDark ? '#9CA3AF' : '#64748B'; 

  const categories = Object.keys(CAT_COLORS);

  const handleSave = async () => {
    if (!amount) return;
    setIsProcessing(true);
    try {
      await transactionService.create({
        amount: parseFloat(amount),
        direction: 'debit',
        category: category,
        source: 'manual',
        date: new Date(expenseDate).toISOString(),
      });
      setShowSuccess(true);
      setTimeout(() => navigation.navigate('Home'), 1500); 
    } catch (error) {
      Alert.alert("Error", "Failed to save transaction.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSmartPaste = async () => {
    if (!rawSms) return;
    setIsProcessing(true);
    try {
      const result = await transactionService.processRawText(rawSms);
      if (result.amount) {
        setAmount(result.amount.toString());
        setCategory(result.category || 'Miscellaneous');
        Alert.alert("Success ✨", "Details extracted!");
      }
    } catch (error) {
      Alert.alert("Error", "Extraction failed.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (showSuccess) {
    return (
      <View style={[styles.root, { backgroundColor: isDark ? '#000' : '#F8F9FE' }]}>
        <LinearGradient colors={['#10B981', '#059669']} style={styles.successContainer}>
          <View style={styles.successIconCircle}><Check size={40} color="#10B981" strokeWidth={3} /></View>
          <Text style={styles.successTitle}>Expense Added!</Text>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: isDark ? '#000' : '#F8F9FE' }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} translucent backgroundColor="transparent" />
      
      <View style={{ flex: 1, paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 10 : 0 }}>
        
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.backBtn, { backgroundColor: isDark ? '#161622' : '#FFF' }]}>
            <ArrowLeft size={22} color={isDark ? '#FFF' : '#1A1A1A'} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: isDark ? '#FFF' : '#1A1A1A' }]}>New Expense</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <View style={[styles.mainCard, { backgroundColor: isDark ? '#161622' : '#FFF' }]}>
            <Text style={styles.fieldLabel}>AMOUNT</Text>
            <View style={styles.amountInputRow}>
              <Text style={[styles.currencySymbol, { color: isDark ? '#FFF' : '#1A1A1A' }]}>₹</Text>
              <TextInput
                style={[styles.amountInput, { color: isDark ? '#FFF' : '#1A1A1A' }]}
                value={amount}
                onChangeText={setAmount}
                placeholder="0.00"
                placeholderTextColor={placeholderColor}
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={[styles.secondaryCard, { backgroundColor: isDark ? '#161622' : '#FFF' }]}>
            <View style={styles.labelRow}>
              <Zap size={14} color="#6366F1" fill="#6366F1" style={{ marginRight: 6 }} />
              <Text style={styles.fieldLabel}>SMART PASTE</Text>
            </View>
            <TextInput
              style={[styles.smsInput, { color: isDark ? '#FFF' : '#1A1A1A', backgroundColor: isDark ? '#000' : '#F1F5F9' }]}
              placeholder="Paste bank SMS or UPI notification here..."
              placeholderTextColor={placeholderColor}
              value={rawSms}
              onChangeText={setRawSms}
              multiline
            />
            <TouchableOpacity activeOpacity={0.8} style={styles.smartBtn} onPress={handleSmartPaste}>
              <LinearGradient colors={['#6366F1', '#8B5CF6']} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={styles.smartBtnGrad}>
                <ClipboardPaste size={16} color="white" style={{ marginRight: 8 }} />
                <Text style={styles.smartBtnText}>Extract Details</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionLabel}>CATEGORY</Text>
          <View style={styles.categoryGrid}>
            {categories.map((cat) => {
              const isActive = category === cat;
              const catColor = CAT_COLORS[cat];
              return (
                <TouchableOpacity 
                  key={cat} 
                  onPress={() => setCategory(cat)} 
                  activeOpacity={0.7}
                  style={[
                    styles.catBtn, 
                    { 
                      backgroundColor: isActive ? catColor : (isDark ? '#161622' : '#FFF'),
                      borderColor: isActive ? catColor : (isDark ? '#333' : '#E2E8F0'),
                    }
                  ]}
                >
                  <Text style={[styles.catBtnText, { color: isActive ? '#FFF' : (isDark ? '#94A3B8' : '#64748B') }]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={styles.sectionLabel}>DATE</Text>
          <View style={[styles.dateCard, { backgroundColor: isDark ? '#161622' : '#FFF' }]}>
            <Calendar size={18} color="#6366F1" style={{ marginRight: 12 }} />
            <TextInput style={[styles.dateInput, { color: isDark ? '#FFF' : '#1A1A1A' }]} value={expenseDate} onChangeText={setExpenseDate} />
          </View>

          <View style={{ height: 220 }} />
        </ScrollView>

        <View style={[styles.footer, { backgroundColor: isDark ? '#000' : '#F8F9FE' }]}>
          <TouchableOpacity activeOpacity={0.9} onPress={handleSave} disabled={!amount || isProcessing}>
            <LinearGradient colors={['#6366F1', '#A855F7']} style={styles.saveBtn}>
              {isProcessing ? <ActivityIndicator color="white" /> : <Text style={styles.saveBtnText}>Confirm Transaction</Text>}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginBottom: 20 },
  backBtn: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 24, fontWeight: '900', marginLeft: 16 },
  scrollContent: { paddingHorizontal: 20 },
  mainCard: { borderRadius: 28, padding: 24, marginBottom: 20 },
  fieldLabel: { fontSize: 10, fontWeight: '900', color: '#94A3B8', letterSpacing: 1.2 },
  labelRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  amountInputRow: { flexDirection: 'row', alignItems: 'center' },
  currencySymbol: { fontSize: 32, fontWeight: '900', marginRight: 8 },
  amountInput: { fontSize: 48, fontWeight: '900', flex: 1, padding: 0 },
  secondaryCard: { borderRadius: 28, padding: 20, marginBottom: 25 },
  smsInput: { borderRadius: 16, padding: 15, height: 80, fontSize: 14, marginBottom: 15, textAlignVertical: 'top' },
  smartBtn: { borderRadius: 12, overflow: 'hidden' },
  smartBtnGrad: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12 },
  smartBtnText: { color: 'white', fontWeight: '800' },
  sectionLabel: { fontSize: 11, fontWeight: '900', color: '#94A3B8', marginBottom: 15, marginLeft: 5 },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 25 },
  catBtn: { width: (width - 50) / 2, paddingVertical: 16, borderRadius: 20, alignItems: 'center', borderWidth: 1.5 },
  catBtnText: { fontSize: 14, fontWeight: '800' },
  dateCard: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, borderRadius: 18 },
  dateInput: { flex: 1, fontSize: 16, fontWeight: '700' },
  footer: { 
    paddingHorizontal: 20, 
    paddingTop: 10,
    paddingBottom: Platform.OS === 'android' ? 85 : 35, 
    position: 'absolute',
    bottom: 0,
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)'
  },
  saveBtn: { paddingVertical: 18, borderRadius: 24, alignItems: 'center' },
  saveBtnText: { color: 'white', fontSize: 18, fontWeight: '900' },
  successContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  successIconCircle: { width: 90, height: 90, backgroundColor: 'white', borderRadius: 45, alignItems: 'center', justifyContent: 'center', marginBottom: 25 },
  successTitle: { fontSize: 32, fontWeight: '900', color: 'white' },
});