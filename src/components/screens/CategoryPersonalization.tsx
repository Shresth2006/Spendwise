import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import {
  ShoppingCart, Utensils, Home, Car, Heart, Shirt,
  Smartphone, Plane, GraduationCap, Gift, Coffee,
  Dumbbell, Music, Gamepad2, PawPrint, Wrench,
  Sparkles, TrendingUp, CreditCard, MoreHorizontal,
} from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = (width - 48 - 24) / 3; // Accounts for screen padding and grid gaps

interface CategoryPersonalizationProps {
  onComplete: (categories: string[]) => void;
  initialSelected: string[];
}

const CATEGORIES = [
  { id: 'groceries', label: 'Groceries', icon: ShoppingCart },
  { id: 'dining', label: 'Dining Out', icon: Utensils },
  { id: 'housing', label: 'Housing', icon: Home },
  { id: 'transport', label: 'Transport', icon: Car },
  { id: 'healthcare', label: 'Healthcare', icon: Heart },
  { id: 'clothing', label: 'Clothing', icon: Shirt },
  { id: 'electronics', label: 'Electronics', icon: Smartphone },
  { id: 'travel', label: 'Travel', icon: Plane },
  { id: 'education', label: 'Education', icon: GraduationCap },
  { id: 'gifts', label: 'Gifts', icon: Gift },
  { id: 'coffee', label: 'Coffee & Tea', icon: Coffee },
  { id: 'fitness', label: 'Fitness', icon: Dumbbell },
  { id: 'entertainment', label: 'Entertainment', icon: Music },
  { id: 'gaming', label: 'Gaming', icon: Gamepad2 },
  { id: 'pets', label: 'Pets', icon: PawPrint },
  { id: 'maintenance', label: 'Maintenance', icon: Wrench },
  { id: 'beauty', label: 'Beauty', icon: Sparkles },
  { id: 'investments', label: 'Investments', icon: TrendingUp },
  { id: 'bills', label: 'Bills', icon: CreditCard },
  { id: 'miscellaneous', label: 'Miscellaneous', icon: MoreHorizontal },
];

export default function CategoryPersonalization({ onComplete, initialSelected }: CategoryPersonalizationProps) {
  const [selected, setSelected] = useState<string[]>(initialSelected);

  const toggleCategory = (id: string) => {
    if (id === 'miscellaneous') return;
    setSelected(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  return (
    <LinearGradient
      colors={['#f5f3ff', '#eff6ff']}
      style={styles.container}
    >
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Choose your categories</Text>
          <Text style={styles.subtitle}>Select the expense categories you use most</Text>
        </View>

        {/* Categories Grid */}
        <ScrollView 
            contentContainerStyle={styles.gridScroll}
            showsVerticalScrollIndicator={false}
        >
          <View style={styles.grid}>
            {CATEGORIES.map(({ id, label, icon: Icon }) => {
              const isSelected = selected.includes(id);
              const isMiscellaneous = id === 'miscellaneous';

              return (
                <TouchableOpacity
                  key={id}
                  onPress={() => toggleCategory(id)}
                  disabled={isMiscellaneous}
                  activeOpacity={0.7}
                  style={[
                    styles.categoryBtn,
                    isSelected ? styles.categoryBtnSelected : styles.categoryBtnUnselected
                  ]}
                >
                  {isSelected ? (
                    <LinearGradient
                      colors={['#a855f7', '#9333ea']}
                      // Combine absoluteFill with the borderRadius in one style array
                      style={[StyleSheet.absoluteFill, { borderRadius: 16 }]} 
                    />
                  ) : null}
                  <Icon 
                    size={24} 
                    color={isSelected ? 'white' : '#9333ea'} 
                    strokeWidth={1.5} 
                  />
                  <Text style={[
                    styles.categoryLabel,
                    { color: isSelected ? 'white' : '#7c3aed' }
                  ]}>
                    {label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        {/* Bottom Section */}
        <View style={styles.footer}>
          <Text style={styles.selectionCount}>
            {selected.length} categories selected
          </Text>

          <TouchableOpacity
            onPress={() => onComplete(selected)}
            style={styles.continueBtnWrapper}
          >
            <LinearGradient
              colors={['#9333ea', '#7e22ce']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.continueBtn}
            >
              <Text style={styles.continueBtnText}>Continue</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Progress Indicator */}
          <View style={styles.progressContainer}>
            <View style={[styles.progressStep, styles.stepActive]} />
            <View style={[styles.progressStep, styles.stepActive]} />
            <View style={[styles.progressStep, styles.stepInactive]} />
          </View>
          <Text style={styles.stepText}>Step 2 of 3</Text>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 24, paddingTop: 12 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#4c1d95', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#9333ea' },
  gridScroll: { paddingHorizontal: 24, paddingBottom: 24 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  categoryBtn: {
    width: COLUMN_WIDTH,
    height: 90,
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  categoryBtnUnselected: {
    backgroundColor: 'white',
    borderColor: '#ede9fe',
  },
  categoryBtnSelected: {
    borderColor: '#7c3aed',
    // Shadow for selected state
    elevation: 4,
    shadowColor: '#9333ea',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  categoryLabel: {
    fontSize: 11,
    marginTop: 8,
    textAlign: 'center',
    fontWeight: '500',
  },
  footer: {
    padding: 24,
    backgroundColor: 'white', // Replicates your white gradient fade
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
  selectionCount: {
    textAlign: 'center',
    color: '#9333ea',
    marginBottom: 16,
    fontSize: 14,
  },
  continueBtnWrapper: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  continueBtn: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueBtnText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  progressContainer: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  progressStep: {
    width: 32,
    height: 6,
    borderRadius: 3,
  },
  stepActive: { backgroundColor: '#9333ea' },
  stepInactive: { backgroundColor: '#ddd6fe' },
  stepText: {
    textAlign: 'center',
    color: '#a78bfa',
    marginTop: 8,
    fontSize: 12,
  },
});