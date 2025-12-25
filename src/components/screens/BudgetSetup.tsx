import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TextInput,
} from 'react-native';
import { IndianRupee } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import Slider from '@react-native-community/slider';

interface BudgetSetupProps {
  categories: string[];
  onComplete: (budget: any) => void;
}

export default function BudgetSetup({ categories, onComplete }: BudgetSetupProps) {
  const [monthlyBudget, setMonthlyBudget] = useState('50000');
  const [categoryBudgets, setCategoryBudgets] = useState<Record<string, number>>({});

  const budget = parseInt(monthlyBudget) || 0;
  const totalAllocated = Object.values(categoryBudgets).reduce((sum, val) => sum + val, 0);
  const remaining = budget - totalAllocated;
  const percentAllocated = budget > 0 ? (totalAllocated / budget) * 100 : 0;

  const handleCategoryBudgetChange = (category: string, value: number) => {
    setCategoryBudgets(prev => ({
      ...prev,
      [category]: value
    }));
  };

  const handleComplete = () => {
    onComplete({
      monthly: budget,
      categories: categoryBudgets
    });
  };

  return (
    <LinearGradient
      colors={['#f5f3ff', '#eff6ff']} // from-purple-50 to-blue-50
      style={styles.container}
    >
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Set your budget</Text>
          <Text style={styles.subtitle}>Define your monthly spending limits</Text>
        </View>

        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Monthly Budget Input */}
          <View style={styles.inputCard}>
            <Text style={styles.label}>Monthly Budget</Text>
            <View style={styles.inputWrapper}>
              <IndianRupee size={20} color="#a78bfa" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                keyboardType="numeric"
                value={monthlyBudget}
                onChangeText={setMonthlyBudget}
                placeholder="50000"
                placeholderTextColor="#a78bfa"
              />
            </View>
          </View>

          {/* Budget Overview Gradient Card */}
          <LinearGradient
            colors={['#9333ea', '#7e22ce']} // from-purple-500 to-purple-600
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.overviewCard}
          >
            <View style={styles.overviewRow}>
              <Text style={styles.overviewLabel}>Allocated</Text>
              <Text style={styles.overviewValue}>₹{totalAllocated.toLocaleString()}</Text>
            </View>
            <View style={styles.overviewRow}>
              <Text style={styles.overviewLabel}>Remaining</Text>
              <Text style={[styles.overviewValue, remaining < 0 && { color: '#fecaca' }]}>
                ₹{remaining.toLocaleString()}
              </Text>
            </View>
            
            <View style={styles.progressBarBg}>
              <View 
                style={[
                  styles.progressBarFill, 
                  { width: `${Math.min(percentAllocated, 100)}%` }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>
              {percentAllocated.toFixed(0)}% allocated
            </Text>
          </LinearGradient>

          {/* Category Budgets Sliders */}
          <View style={styles.sliderSection}>
            <Text style={styles.sectionTitle}>Category Budgets (Optional)</Text>
            {categories.slice(0, 6).map(category => (
              <View key={category} style={styles.sliderCard}>
                <View style={styles.sliderHeader}>
                  <Text style={styles.categoryLabel}>{category}</Text>
                  <Text style={styles.categoryValue}>
                    ₹{(categoryBudgets[category] || 0).toLocaleString()}
                  </Text>
                </View>
                <Slider
                  style={styles.slider}
                  minimumValue={0}
                  maximumValue={budget}
                  step={500}
                  value={categoryBudgets[category] || 0}
                  onValueChange={(val) => handleCategoryBudgetChange(category, val)}
                  minimumTrackTintColor="#9333ea"
                  maximumTrackTintColor="#f3e8ff"
                  thumbTintColor="#9333ea"
                />
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Bottom Section */}
        <View style={styles.footer}>
          <TouchableOpacity
            onPress={handleComplete}
            style={styles.getStartedWrapper}
          >
            <LinearGradient
              colors={['#9333ea', '#7e22ce']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.getStartedBtn}
            >
              <Text style={styles.getStartedText}>Get Started</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Progress Indicator */}
          <View style={styles.stepContainer}>
            <View style={styles.stepDot} />
            <View style={styles.stepDot} />
            <View style={styles.stepDot} />
          </View>
          <Text style={styles.stepLabel}>Step 3 of 3</Text>
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
  scrollContent: { paddingHorizontal: 24, paddingBottom: 24 },
  inputCard: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#f3e8ff',
  },
  label: { fontSize: 16, color: '#4c1d95', marginBottom: 12, fontWeight: '600' },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f3ff',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#ede9fe',
    paddingHorizontal: 16,
  },
  inputIcon: { marginRight: 8 },
  textInput: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 18,
    color: '#4c1d95',
    fontWeight: '500',
  },
  overviewCard: {
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    elevation: 8,
    shadowColor: '#9333ea',
    shadowOpacity: 0.3,
  },
  overviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  overviewLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 16 },
  overviewValue: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  progressBarBg: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 4,
    marginTop: 8,
    overflow: 'hidden',
  },
  progressBarFill: { height: '100%', backgroundColor: 'white' },
  progressText: { color: 'rgba(255,255,255,0.8)', marginTop: 12, fontSize: 12 },
  sliderSection: { gap: 12 },
  sectionTitle: { fontSize: 16, color: '#4c1d95', fontWeight: 'bold', marginBottom: 4 },
  sliderCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#f3e8ff',
  },
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  categoryLabel: { color: '#4c1d95', textTransform: 'capitalize', fontWeight: '500' },
  categoryValue: { color: '#9333ea', fontWeight: 'bold' },
  slider: { width: '100%', height: 40 },
  footer: {
    padding: 24,
    backgroundColor: 'white',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
  getStartedWrapper: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
  },
  getStartedBtn: { paddingVertical: 16, alignItems: 'center' },
  getStartedText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  stepContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: 16,
  },
  stepDot: { width: 32, height: 6, borderRadius: 3, backgroundColor: '#9333ea' },
  stepLabel: { textAlign: 'center', color: '#a78bfa', marginTop: 8, fontSize: 12 },
});