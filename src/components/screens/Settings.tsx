import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Switch,
  Platform,
  Alert,
  StatusBar,
} from 'react-native';
import {
  User,
  Moon,
  LogOut,
  ChevronRight,
  Wallet,
  LayoutGrid,
  Bell,
  ShieldCheck,
  CircleHelp
} from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import auth from '@react-native-firebase/auth'; 
import { useDarkMode } from '../DarkModeProvider';
import BottomNavigation from '../BottomNavigation';
import { useNavigation } from '@react-navigation/native';

// These must match exactly what you are passing in App.tsx
interface SettingsProps {
  userName?: string;
  totalSpendable: number;
  monthlyLimit: number;
  setTotalSpendable: (val: number) => void; 
  setMonthlyLimit: (val: number) => void;
  onLogout?: () => void;
}

export default function Settings({ 
  userName, 
  totalSpendable, 
  monthlyLimit,
  setTotalSpendable,
  setMonthlyLimit,
  onLogout 
}: SettingsProps) {
  const { darkMode: isDark, toggleDarkMode } = useDarkMode();
  const navigation = useNavigation<any>();

  const userEmail = auth().currentUser?.email || 'User Account';

  const SettingRow = ({ icon: Icon, label, value, onPress, color = "#6366F1", showArrow = true }: any) => (
    <TouchableOpacity 
      style={[styles.row, { backgroundColor: isDark ? '#161622' : '#FFF' }]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: isDark ? '#252538' : '#F1F5F9' }]}>
        <Icon size={20} color={color} />
      </View>
      <Text style={[styles.rowLabel, { color: isDark ? '#FFF' : '#1A1A1A' }]}>{label}</Text>
      {value && <Text style={styles.rowValue}>{value}</Text>}
      {showArrow && <ChevronRight size={18} color="#94A3B8" />}
    </TouchableOpacity>
  );

  return (
    <View style={[styles.root, { backgroundColor: isDark ? '#000' : '#F8F9FE' }]}>
      {/* Ensures content doesn't hit the status bar */}
      <SafeAreaView style={{ flex: 1, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <View style={styles.header}>
            <Text style={[styles.headerTitle, { color: isDark ? '#FFF' : '#1A1A1A' }]}>Settings</Text>
          </View>

          {/* PROFILE SUMMARY */}
          <View style={[styles.profileSection, { backgroundColor: isDark ? '#161622' : '#FFF' }]}>
            <LinearGradient colors={['#6366F1', '#A855F7']} style={styles.avatar}>
              <Text style={styles.avatarTxt}>{userName?.[0] || 'U'}</Text>
            </LinearGradient>
            <View style={styles.profileInfo}>
              <Text style={[styles.profileName, { color: isDark ? '#FFF' : '#1A1A1A' }]}>{userName?.split('|')[0].trim()}</Text>
              <Text style={styles.profileEmail}>{userEmail}</Text>
            </View>
          </View>

          {/* SECTION: ACCOUNTS & FINANCES */}
          <Text style={styles.sectionLabel}>ACCOUNT & FINANCES</Text>
          <View style={styles.group}>
            <SettingRow 
              icon={Wallet} 
              label="Balance & Budget" 
              value={`₹${totalSpendable.toLocaleString()}`}
              onPress={() => {
                // Navigate to the Setup screen where editting is possible
                navigation.navigate('BudgetSetup');
              }} 
            />
            <SettingRow 
              icon={LayoutGrid} 
              label="Categories" 
              color="#F59E0B"
              onPress={() => navigation.navigate('CategoryPersonalization')} 
            />
          </View>

          {/* SECTION: PREFERENCES */}
          <Text style={styles.sectionLabel}>PREFERENCES</Text>
          <View style={styles.group}>
            <View style={[styles.row, { backgroundColor: isDark ? '#161622' : '#FFF' }]}>
              <View style={[styles.iconContainer, { backgroundColor: isDark ? '#252538' : '#F1F5F9' }]}>
                <Moon size={20} color="#8B5CF6" />
              </View>
              <Text style={[styles.rowLabel, { color: isDark ? '#FFF' : '#1A1A1A' }]}>Dark Mode</Text>
              <Switch
                value={isDark}
                onValueChange={toggleDarkMode}
                trackColor={{ false: '#E2E8F0', true: '#6366F1' }}
                thumbColor="#FFF"
              />
            </View>
            <SettingRow icon={Bell} label="Notifications" color="#EC4899" onPress={() => {}} />
          </View>

          {/* SECTION: SUPPORT */}
          <Text style={styles.sectionLabel}>SUPPORT</Text>
          <View style={styles.group}>
            <SettingRow icon={ShieldCheck} label="Privacy & Security" color="#10B981" onPress={() => {}} />
            <SettingRow icon={CircleHelp} label="Help Center" color="#64748B" onPress={() => {}} />
          </View>

          {/* LOGOUT */}
          <TouchableOpacity 
            style={styles.logoutBtn} 
            onPress={() => {
                Alert.alert("Logout", "Are you sure?", [
                    { text: "Cancel", style: "cancel" },
                    { text: "Logout", style: "destructive", onPress: onLogout }
                ]);
            }}
          >
            <LogOut size={20} color="#EF4444" />
            <Text style={styles.logoutText}>Log Out Account</Text>
          </TouchableOpacity>

          <Text style={styles.versionText}>Version 1.0.4 (2025)</Text>

        </ScrollView>
        <BottomNavigation />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 140 },
  header: { marginBottom: 25 },
  headerTitle: { fontSize: 32, fontWeight: '900', letterSpacing: -1 },
  
  profileSection: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 24, marginBottom: 30, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10 },
  avatar: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center' },
  avatarTxt: { color: '#FFF', fontSize: 22, fontWeight: '900' },
  profileInfo: { marginLeft: 15 },
  profileName: { fontSize: 18, fontWeight: '800' },
  profileEmail: { fontSize: 13, color: '#94A3B8', fontWeight: '500', marginTop: 2 },

  sectionLabel: { fontSize: 11, fontWeight: '800', color: '#94A3B8', letterSpacing: 1.5, marginBottom: 12, marginLeft: 5 },
  group: { borderRadius: 24, overflow: 'hidden', marginBottom: 25 },
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14 },
  iconContainer: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  rowLabel: { flex: 1, marginLeft: 15, fontSize: 15, fontWeight: '600' },
  rowValue: { fontSize: 14, color: '#6366F1', fontWeight: '700', marginRight: 10 },

  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16, borderRadius: 24, backgroundColor: '#FEF2F2', marginTop: 10, gap: 10 },
  logoutText: { color: '#EF4444', fontWeight: '800', fontSize: 16 },
  versionText: { textAlign: 'center', color: '#94A3B8', fontSize: 12, fontWeight: '600', marginTop: 30 },
});