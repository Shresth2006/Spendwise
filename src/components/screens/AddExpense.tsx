import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { ArrowLeft, IndianRupee, Tag, Calendar, Check, ClipboardPaste } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native'; // 🚀 Added this
import { useDarkMode } from '../DarkModeProvider';
import { transactionService } from '../../services/api'; 

export default function AddExpense() { // 🚀 Removed navigateTo from props
  const navigation = useNavigation<any>(); // 🚀 Hook for standard navigation
  const { darkMode } = useDarkMode();
  const isDark = darkMode;

  // --- FORM STATE ---
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Miscellaneous');
  const [notes, setNotes] = useState('');
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().split('T')[0]);
  const [rawSms, setRawSms] = useState(''); 
  
  // --- UI STATE ---
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const categories = [
    'Groceries', 'Dining', 'Transport', 'Shopping',
    'Entertainment', 'Healthcare', 'Bills', 'Miscellaneous'
  ];

  // --- METHOD 1: MANUAL SAVE ---
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
      // 🚀 Fixed navigation call
      setTimeout(() => navigation.navigate('Home'), 1500); 
    } catch (error) {
      Alert.alert("Error", "Failed to save transaction.");
    } finally {
      setIsProcessing(false);
    }
  };

  // --- METHOD 2: SMART PASTE EXTRACTION ---
  const handleSmartPaste = async () => {
    if (!rawSms) return;
    setIsProcessing(true);

    try {
      const result = await transactionService.processRawText(rawSms);
      
      if (result.amount) {
        setAmount(result.amount.toString());
        setCategory(result.category || 'Miscellaneous');
        setNotes(`Extracted: ${result.merchant || 'Unknown Merchant'}`);
        Alert.alert("Success", "Details extracted!");
      } else {
        // 🚀 This Alert triggers when the Regex fails to find a number
        Alert.alert("Notice", "We couldn't find an amount. Please enter manually.");
      }
    } catch (error) {
      Alert.alert("Error", "Backend failed to respond.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (showSuccess) {
    return (
      <LinearGradient colors={isDark ? ['#111827', '#1f2937'] : ['#f5f3ff', '#eff6ff']} style={styles.successContainer}>
        <View style={styles.successIconCircle}><Check size={40} color="white" strokeWidth={3} /></View>
        <Text style={[styles.successTitle, { color: isDark ? '#fff' : '#4c1d95' }]}>Expense Added!</Text>
        <Text style={styles.successSubtitle}>Your budget has been adjusted.</Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={isDark ? ['#111827', '#1f2937'] : ['#f5f3ff', '#eff6ff']} style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          {/* 🚀 Changed to navigation.goBack() for the back button */}
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ArrowLeft size={24} color="#9333ea" />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: isDark ? '#fff' : '#1e1b4b' }]}>New Expense</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <View style={[styles.card, isDark && styles.cardDark]}>
            <Text style={styles.cardLabel}>Smart Paste (SMS/UPI Alert)</Text>
            <View style={[styles.inputField, isDark && styles.inputFieldDark]}>
              <TextInput
                style={[styles.fieldTextInput, { color: isDark ? '#fff' : '#000' }]}
                placeholder="Paste bank SMS here..."
                placeholderTextColor="#6b7280"
                value={rawSms}
                onChangeText={setRawSms}
                multiline
              />
            </View>
            <TouchableOpacity style={styles.smartBtn} onPress={handleSmartPaste}>
              <ClipboardPaste size={18} color="white" />
              <Text style={styles.smartBtnText}>Auto-Extract Details</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.card, isDark && styles.cardDark]}>
            <Text style={styles.cardLabel}>Amount</Text>
            <View style={styles.amountInputRow}>
              <IndianRupee size={32} color="#a78bfa" />
              <TextInput
                style={[styles.amountInput, { color: isDark ? '#fff' : '#1e1b4b' }]}
                value={amount}
                onChangeText={setAmount}
                placeholder="0"
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Tag size={20} color="#9333ea" />
              <Text style={[styles.sectionTitle, { color: isDark ? '#fff' : '#1e1b4b' }]}>Category</Text>
            </View>
            <View style={styles.categoryGrid}>
              {categories.map((cat) => (
                <TouchableOpacity key={cat} onPress={() => setCategory(cat)} style={styles.categoryBtnWrapper}>
                  <LinearGradient
                    colors={category === cat ? ['#a855f7', '#9333ea'] : (isDark ? ['#1f2937', '#1f2937'] : ['#ffffff', '#ffffff'])}
                    style={[styles.categoryBtn, category !== cat && styles.categoryBtnBorder]}
                  >
                    <Text style={{ fontWeight: '600', color: category === cat ? 'white' : '#9333ea' }}>{cat}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Calendar size={20} color="#9333ea" />
              <Text style={[styles.sectionTitle, { color: isDark ? '#fff' : '#1e1b4b' }]}>Date</Text>
            </View>
            <View style={[styles.inputField, isDark && styles.inputFieldDark]}>
              <TextInput 
                style={[styles.fieldTextInput, { color: isDark ? '#fff' : '#000' }]} 
                value={expenseDate} 
                onChangeText={setExpenseDate} 
              />
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity onPress={handleSave} disabled={!amount || isProcessing}>
            <LinearGradient colors={['#9333ea', '#7e22ce']} style={styles.saveBtn}>
              {isProcessing ? <ActivityIndicator color="white" /> : <Text style={styles.saveBtnText}>Save Transaction</Text>}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  successContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  successIconCircle: { width: 80, height: 80, backgroundColor: '#22c55e', borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  successTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  successSubtitle: { color: '#9333ea' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 24, paddingTop: 12 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', marginLeft: 16 },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 40 },
  card: { backgroundColor: 'rgba(255, 255, 255, 0.7)', borderRadius: 24, padding: 20, borderWidth: 1, borderColor: '#f3e8ff', marginBottom: 20 },
  cardDark: { backgroundColor: '#1f2937', borderColor: '#374151' },
  cardLabel: { color: '#9333ea', marginBottom: 12, fontWeight: '600' },
  amountInputRow: { flexDirection: 'row', alignItems: 'center' },
  amountInput: { flex: 1, fontSize: 40, fontWeight: 'bold', marginLeft: 8 },
  smartBtn: { backgroundColor: '#9333ea', padding: 10, borderRadius: 12, marginTop: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  smartBtnText: { color: 'white', fontWeight: 'bold' },
  section: { marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold' },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  categoryBtnWrapper: { width: (Dimensions.get('window').width - 48 - 12) / 2 },
  categoryBtn: { paddingVertical: 14, borderRadius: 16, alignItems: 'center' },
  categoryBtnBorder: { borderWidth: 2, borderColor: '#f3e8ff' },
  inputField: { backgroundColor: 'white', borderRadius: 16, paddingHorizontal: 16, minHeight: 50, justifyContent: 'center', borderWidth: 2, borderColor: '#f3e8ff' },
  inputFieldDark: { backgroundColor: '#111827', borderColor: '#374151' },
  fieldTextInput: { fontSize: 16, paddingVertical: 10 },
  footer: { padding: 24 },
  saveBtn: { paddingVertical: 16, alignItems: 'center', borderRadius: 16 },
  saveBtnText: { color: 'white', fontSize: 18, fontWeight: 'bold' }
});