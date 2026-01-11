import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  StatusBar,
  Platform,
} from 'react-native';
import {
  ShoppingCart, Utensils, Home, Car, Heart, Shirt,
  Smartphone, Plane, GraduationCap, Gift, Coffee,
  Dumbbell, Music, Gamepad2, PawPrint, Wrench,
  Sparkles, TrendingUp, CreditCard, MoreHorizontal,
} from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = (width - 40 - 24) / 3; 

const CATEGORIES = [
  { id: 'groceries', label: 'Groceries', icon: ShoppingCart, color: '#F59E0B' },
  { id: 'dining', label: 'Dining Out', icon: Utensils, color: '#EF4444' },
  { id: 'housing', label: 'Housing', icon: Home, color: '#10B981' },
  { id: 'transport', label: 'Transport', icon: Car, color: '#3B82F6' },
  { id: 'healthcare', label: 'Healthcare', icon: Heart, color: '#EC4899' },
  { id: 'clothing', label: 'Clothing', icon: Shirt, color: '#8B5CF6' },
  { id: 'electronics', label: 'Electronics', icon: Smartphone, color: '#6366F1' },
  { id: 'travel', label: 'Travel', icon: Plane, color: '#06B6D4' },
  { id: 'education', label: 'Education', icon: GraduationCap, color: '#4F46E5' },
  { id: 'gifts', label: 'Gifts', icon: Gift, color: '#F472B6' },
  { id: 'coffee', label: 'Coffee & Tea', icon: Coffee, color: '#92400E' },
  { id: 'fitness', label: 'Fitness', icon: Dumbbell, color: '#059669' },
  { id: 'entertainment', label: 'Entertainment', icon: Music, color: '#D946EF' },
  { id: 'gaming', label: 'Gaming', icon: Gamepad2, color: '#111827' },
  { id: 'pets', label: 'Pets', icon: PawPrint, color: '#B45309' },
  { id: 'maintenance', label: 'Maintenance', icon: Wrench, color: '#6B7280' },
  { id: 'beauty', label: 'Beauty', icon: Sparkles, color: '#FDA4AF' },
  { id: 'investments', label: 'Investments', icon: TrendingUp, color: '#059669' },
  { id: 'bills', label: 'Bills', icon: CreditCard, color: '#4338CA' },
  { id: 'miscellaneous', label: 'Misc', icon: MoreHorizontal, color: '#94A3B8' },
];

export default function CategoryPersonalization() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  
  const initialSelected = route.params?.initialSelected || [];
  const [selected, setSelected] = useState<string[]>(initialSelected);

  const toggleCategory = (id: string) => {
    if (id === 'miscellaneous') return;
    setSelected(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const handleContinue = () => {
    navigation.navigate('BudgetSetup', { selectedCategories: selected });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />
      <LinearGradient colors={['#F8FAFC', '#F1F5F9']} style={StyleSheet.absoluteFill} />
      
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.contentWrapper}>
          <View style={styles.header}>
            <Text style={styles.title}>Personalize your Feed</Text>
            <Text style={styles.subtitle}>Which categories do you spend on most?</Text>
          </View>

          <ScrollView 
            contentContainerStyle={styles.gridScroll}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.grid}>
              {CATEGORIES.map(({ id, label, icon: Icon, color }) => {
                const isSelected = selected.includes(id);
                return (
                  <TouchableOpacity
                    key={id}
                    onPress={() => toggleCategory(id)}
                    disabled={id === 'miscellaneous'}
                    activeOpacity={0.8}
                    style={[
                      styles.categoryBtn,
                      { borderColor: isSelected ? color : '#E2E8F0' },
                      isSelected && styles.selectedShadow
                    ]}
                  >
                    {isSelected && (
                      <View style={[StyleSheet.absoluteFill, { backgroundColor: color, opacity: 0.1, borderRadius: 24 }]} />
                    )}
                    
                    <View style={[
                      styles.iconCircle, 
                      { backgroundColor: isSelected ? color : '#F1F5F9' }
                    ]}>
                      <Icon size={24} color={isSelected ? 'white' : '#64748B'} strokeWidth={2} />
                    </View>

                    <Text style={[
                      styles.categoryLabel,
                      { color: isSelected ? '#1E293B' : '#64748B', fontWeight: isSelected ? '700' : '500' }
                    ]}>
                      {label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <View style={styles.footerTopRow}>
              <Text style={styles.selectionCount}>{selected.length} Selected</Text>
              <View style={styles.progressBullets}>
                <View style={[styles.bullet, styles.bulletDone]} />
                <View style={[styles.bullet, styles.bulletActive]} />
                <View style={[styles.bullet, styles.bulletNext]} />
              </View>
            </View>

            <TouchableOpacity onPress={handleContinue} style={styles.mainBtn}>
              <LinearGradient
                colors={['#6366F1', '#4F46E5']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientBtn}
              >
                <Text style={styles.mainBtnText}>Continue</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* CRITICAL SPACER: This View pushes everything up above the system bar */}
        {Platform.OS === 'android' && <View style={{ height: 45, backgroundColor: 'white' }} />}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F8FAFC' 
  },
  safeArea: { 
    flex: 1,
    // Setting background to white here ensures the spacer looks seamless with the footer
    backgroundColor: 'white', 
  },
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
  
  gridScroll: { 
    paddingHorizontal: 20, 
    paddingBottom: 30 
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  categoryBtn: {
    width: COLUMN_WIDTH,
    height: 105,
    borderRadius: 24,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    marginBottom: 4,
  },
  selectedShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  categoryLabel: { fontSize: 11, textAlign: 'center' },
  
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
  bulletNext: { backgroundColor: '#E2E8F0', width: 12 },

  mainBtn: { borderRadius: 18, overflow: 'hidden' },
  gradientBtn: { paddingVertical: 16, alignItems: 'center' },
  mainBtnText: { color: 'white', fontSize: 18, fontWeight: '800' },
});