import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Alert,
  ActivityIndicator,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { IndianRupee, Wallet, Landmark, Sparkles } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useRoute } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import { transactionService } from '../../services/api';

const CATEGORY_COLORS = [
  ['#6366F1', '#818CF8'], ['#EC4899', '#F472B6'],
  ['#F59E0B', '#FBBF24'], ['#10B981', '#34D399'],
  ['#8B5CF6', '#A78BFA'], ['#F43F5E', '#FB7185'],
  ['#0EA5E9', '#38BDF8'],
];

export default function BudgetSetup({ onComplete, setGlobalBalances }: any) {
  const route = useRoute<any>();
  const isMounted = useRef(true);

  const selectedCategoryIds = route.params?.selectedCategories || [];
  
  const [totalAccountBalance, setTotalAccountBalance] = useState('');
  const [monthlyLimit, setMonthlyLimit] = useState('');
  const [categoryBudgets, setCategoryBudgets] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);

  const monthlyLimitNum = parseInt(monthlyLimit) || 0;
  const accountBalanceNum = parseInt(totalAccountBalance) || 0;
  const totalAllocated = Object.values(categoryBudgets).reduce((sum, val) => sum + (parseInt(val) || 0), 0);
  const remaining = monthlyLimitNum - totalAllocated;
  const percentAllocated = monthlyLimitNum > 0 ? (totalAllocated / monthlyLimitNum) * 100 : 0;

  const handleCategoryChange = (id: string, val: string) => {
    const cleanVal = val.replace(/[^0-9]/g, '');
    setCategoryBudgets(prev => ({ ...prev, [id]: cleanVal }));
  };

  const handleComplete = async () => {
    if (!totalAccountBalance || !monthlyLimit || monthlyLimitNum <= 0) {
      Alert.alert("Required Fields", "Please enter your account balance and monthly limit.");
      return;
    }

    setLoading(true);
    try {
      const currentUser = auth().currentUser;
      if (currentUser) {
        const formattedCats: Record<string, number> = {};
        Object.keys(categoryBudgets).forEach(key => {
          formattedCats[key] = parseInt(categoryBudgets[key]) || 0;
        });

        await transactionService.saveUserBudgets({
          monthlyLimit: monthlyLimitNum,
          categoryBudgets: formattedCats,
        });

        if (setGlobalBalances) {
          setGlobalBalances(accountBalanceNum, monthlyLimitNum);
        }

        const baseName = currentUser.displayName?.split('|')[0].trim() || "User";
        await currentUser.updateProfile({ displayName: `${baseName} | DONE` });
        
        if (onComplete && isMounted.current) {
          await onComplete();
        }
      }
    } catch (error: any) {
      console.error("Setup Error:", error);
      if (isMounted.current) {
        Alert.alert("Connection Error", "Could not save settings.");
        setLoading(false);
      }
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />
      <LinearGradient colors={['#F8FAFC', '#F1F5F9']} style={StyleSheet.absoluteFill} />
      
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
          style={styles.contentWrapper}
        >
          {/* HEADER SPACING MATCHED */}
          <View style={styles.header}>
            <Text style={styles.title}>Budgeting</Text>
            <Text style={styles.subtitle}>Finalize your monthly plan</Text>
          </View>

          <ScrollView 
            contentContainerStyle={styles.scrollContent} 
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.inputSection}>
              <View style={styles.inputCard}>
                <View style={styles.inputHeader}>
                  <Landmark size={14} color="#6366F1" />
                  <Text style={styles.label}>TOTAL AMOUNT IN ACCOUNT</Text>
                </View>
                <View style={styles.inputRow}>
                  <IndianRupee size={24} color="#0F172A" strokeWidth={2.5} />
                  <TextInput
                    style={styles.mainInput}
                    keyboardType="numeric"
                    value={totalAccountBalance}
                    onChangeText={(val) => setTotalAccountBalance(val.replace(/[^0-9]/g, ''))}
                    placeholder="0"
                    placeholderTextColor="#CBD5E1"
                  />
                </View>
              </View>

              <View style={styles.inputCard}>
                <View style={styles.inputHeader}>
                  <Wallet size={14} color="#6366F1" />
                  <Text style={styles.label}>MONTHLY ALLOWANCE (BUDGET)</Text>
                </View>
                <View style={styles.inputRow}>
                  <IndianRupee size={24} color="#0F172A" strokeWidth={2.5} />
                  <TextInput
                    style={styles.mainInput}
                    keyboardType="numeric"
                    value={monthlyLimit}
                    onChangeText={(val) => {
                      setMonthlyLimit(val.replace(/[^0-9]/g, ''));
                      setCategoryBudgets({});
                    }}
                    placeholder="0"
                    placeholderTextColor="#CBD5E1"
                  />
                </View>
              </View>
            </View>

            <LinearGradient 
              colors={['#6366F1', '#4F46E5']} 
              start={{x: 0, y: 0}} end={{x: 1, y: 1}} 
              style={styles.overviewCard}
            >
              <View style={styles.overviewRow}>
                <View>
                  <Text style={styles.overviewLabel}>ALLOCATED</Text>
                  <Text style={styles.overviewValue}>₹{totalAllocated.toLocaleString()}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.overviewLabel}>REMAINING</Text>
                  <Text style={[styles.overviewValue, remaining < 0 && { color: '#FECACA' }]}>
                    ₹{remaining.toLocaleString()}
                  </Text>
                </View>
              </View>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: `${Math.min(percentAllocated, 100)}%` }]} />
              </View>
            </LinearGradient>

            <View style={styles.sectionHeader}>
              <Sparkles size={16} color="#6366F1" />
              <Text style={styles.sectionTitle}>Category Breakdown</Text>
            </View>

            {selectedCategoryIds.map((id: string, index: number) => {
              const colors = CATEGORY_COLORS[index % CATEGORY_COLORS.length];
              return (
                <View key={id} style={styles.categoryItem}>
                   <LinearGradient colors={colors} style={styles.colorIndicator} />
                   <View style={styles.categoryInfo}>
                      <Text style={styles.categoryText}>{id.replace(/_/g, ' ')}</Text>
                      <View style={styles.smallInputBox}>
                        <Text style={styles.currency}>₹</Text>
                        <TextInput
                          style={styles.categoryInput}
                          keyboardType="numeric"
                          value={categoryBudgets[id] || ''}
                          onChangeText={(val) => handleCategoryChange(id, val)}
                          placeholder="0"
                          placeholderTextColor="#CBD5E1"
                        />
                      </View>
                   </View>
                </View>
              );
            })}
          </ScrollView>

          {/* FOOTER STYLE MATCHED TO PERSONALIZATION PAGE */}
          <View style={styles.footer}>
            <View style={styles.footerTopRow}>
              <Text style={styles.selectionCount}>Step 3 of 3</Text>
              <View style={styles.progressBullets}>
                <View style={[styles.bullet, styles.bulletDone]} />
                <View style={[styles.bullet, styles.bulletDone]} />
                <View style={[styles.bullet, styles.bulletActive]} />
              </View>
            </View>

            <TouchableOpacity 
              onPress={handleComplete} 
              disabled={loading} 
              activeOpacity={0.8}
              style={styles.mainBtn}
            >
              <LinearGradient 
                colors={(!monthlyLimit || loading) ? ['#CBD5E1', '#94A3B8'] : ['#6366F1', '#4F46E5']} 
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={styles.gradientBtn}
              >
                {loading ? <ActivityIndicator color="white" /> : <Text style={styles.mainBtnText}>Complete Setup</Text>}
              </LinearGradient>
            </TouchableOpacity>
          </View>
          
          {/* CRITICAL SYSTEM SPACER */}
          {Platform.OS === 'android' && <View style={styles.androidSpacer} />}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  safeArea: { flex: 1, backgroundColor: 'white' },
  contentWrapper: { 
    flex: 1, 
    backgroundColor: '#F8FAFC',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: { 
    paddingHorizontal: 25, 
    paddingTop: 20, 
    paddingBottom: 20 
  },
  title: { fontSize: 28, fontWeight: '900', color: '#0F172A', letterSpacing: -0.5 },
  subtitle: { fontSize: 16, color: '#64748B', marginTop: 4, lineHeight: 22 },
  
  scrollContent: { 
    paddingHorizontal: 25, 
    paddingBottom: 40 
  },
  inputSection: { gap: 12, marginBottom: 20 },
  inputCard: { 
    backgroundColor: 'white', 
    borderRadius: 24, 
    padding: 20, 
    borderWidth: 2, 
    borderColor: '#E2E8F0' 
  },
  inputHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  label: { fontSize: 11, color: '#64748B', fontWeight: '700', letterSpacing: 0.5 },
  inputRow: { flexDirection: 'row', alignItems: 'center' },
  mainInput: { flex: 1, fontSize: 28, fontWeight: '800', color: '#0F172A', marginLeft: 10, padding: 0 },
  
  overviewCard: { 
    borderRadius: 24, 
    padding: 24, 
    marginBottom: 25, 
    elevation: 4,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  overviewRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  overviewLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 11, fontWeight: '800', letterSpacing: 1 },
  overviewValue: { color: 'white', fontSize: 24, fontWeight: '900' },
  progressBarBg: { height: 8, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 10, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: 'white', borderRadius: 10 },
  
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 15 },
  sectionTitle: { fontSize: 19, fontWeight: '800', color: '#1E293B' },
  categoryItem: { 
    flexDirection: 'row', 
    backgroundColor: 'white', 
    borderRadius: 20, 
    marginBottom: 10, 
    overflow: 'hidden', 
    borderWidth: 2, 
    borderColor: '#E2E8F0' 
  },
  colorIndicator: { width: 6 },
  categoryInfo: { flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  categoryText: { fontSize: 16, fontWeight: '700', color: '#1E293B', textTransform: 'capitalize' },
  smallInputBox: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#F1F5F9', 
    paddingHorizontal: 12, 
    borderRadius: 14, 
    width: 110,
    height: 45
  },
  currency: { fontSize: 14, fontWeight: '800', color: '#6366F1', marginRight: 4 },
  categoryInput: { flex: 1, fontSize: 16, fontWeight: '700', color: '#0F172A', padding: 0 },

  footer: {
    backgroundColor: 'white',
    paddingHorizontal: 25,
    paddingTop: 20,
    paddingBottom: Platform.OS === 'ios' ? 10 : 15,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 20,
  },
  footerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  selectionCount: { fontSize: 15, fontWeight: '700', color: '#6366F1' },
  progressBullets: { flexDirection: 'row', gap: 6 },
  bullet: { height: 6, borderRadius: 3 },
  bulletDone: { backgroundColor: '#6366F1', width: 20 },
  bulletActive: { backgroundColor: '#6366F1', width: 20 },
  
  mainBtn: { borderRadius: 18, overflow: 'hidden' },
  gradientBtn: { paddingVertical: 16, alignItems: 'center' },
  mainBtnText: { color: 'white', fontSize: 18, fontWeight: '800' },
  androidSpacer: { height: 45, backgroundColor: 'white' }
});