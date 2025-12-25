import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Switch,
  Platform,
} from 'react-native';
import {
  ArrowLeft,
  User,
  Bell,
  Moon,
  Database,
  LogOut,
  ChevronRight,
  Wallet,
} from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useDarkMode } from '../DarkModeProvider';
import { useNavigation } from '@react-navigation/native'; // Added Navigation Hook

interface SettingsProps {
  userName?: string;
  onLogout?: () => void;
}

export default function Settings({ userName, onLogout }: SettingsProps) {
  // --- HOOKS ---
  const navigation = useNavigation<any>();
  const { darkMode, toggleDarkMode } = useDarkMode();
  const [notifications, setNotifications] = useState(true);

  const isDark = darkMode;

  // --- HANDLERS ---
  const handleBack = () => {
    // Standardized back button logic using the hook
    navigation.goBack(); 
  };

  const handleLogoutAction = () => {
    if (typeof onLogout === 'function') {
      onLogout();
    } else {
      // Fallback: If no logout function is passed, redirect to Auth
      navigation.replace('Auth');
    }
  };

  return (
    <LinearGradient
      colors={isDark ? ['#111827', '#1f2937'] : ['#f5f3ff', '#eff6ff']}
      style={styles.container}
    >
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <ArrowLeft color={isDark ? '#a78bfa' : '#9333ea'} size={24} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: isDark ? '#fff' : '#1e1b4b' }]}>
            Settings
          </Text>
        </View>

        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Profile Card */}
          <LinearGradient
            colors={isDark ? ['#4c1d95', '#6d28d9'] : ['#8b5cf6', '#7c3aed']}
            style={styles.profileCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.profileInfo}>
              <View style={styles.avatarCircle}>
                <User color="white" size={32} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.profileName}>{userName || 'User'}</Text>
                <Text style={styles.profileEmail}>user@example.com</Text>
              </View>
              <ChevronRight color="white" size={24} />
            </View>
          </LinearGradient>

          {/* Preferences Section */}
          <View style={[styles.section, { backgroundColor: isDark ? 'rgba(31, 41, 55, 0.7)' : 'rgba(255, 255, 255, 0.7)', borderColor: isDark ? '#374151' : '#ede9fe' }]}>
            <Text style={[styles.sectionTitle, { color: isDark ? '#fff' : '#1e1b4b' }]}>Preferences</Text>
            
            <View style={styles.settingRow}>
              <View style={[styles.iconBox, { backgroundColor: isDark ? 'rgba(139, 92, 246, 0.2)' : '#f3e8ff' }]}>
                <Moon color={isDark ? '#a78bfa' : '#9333ea'} size={20} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.rowLabel, { color: isDark ? '#fff' : '#1e1b4b' }]}>Dark Mode</Text>
                <Text style={[styles.rowSubLabel, { color: isDark ? '#9ca3af' : '#9333ea' }]}>Toggle theme</Text>
              </View>
              <Switch
                value={darkMode}
                onValueChange={toggleDarkMode}
                trackColor={{ false: '#d1d5db', true: '#9333ea' }}
                thumbColor="#fff"
              />
            </View>
          </View>

          {/* Logout */}
          <TouchableOpacity 
            style={[styles.logoutBtn, { backgroundColor: isDark ? 'rgba(239, 68, 68, 0.1)' : '#fef2f2', borderColor: isDark ? '#991b1b' : '#fecaca' }]} 
            onPress={handleLogoutAction}
          >
            <LogOut color="#ef4444" size={20} />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingTop: Platform.OS === 'android' ? 40 : 10,
    paddingHorizontal: 24,
    marginBottom: 10
  },
  backButton: { marginRight: 16 },
  headerTitle: { fontSize: 24, fontWeight: 'bold' },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 100 },
  profileCard: { 
    borderRadius: 30, 
    padding: 24, 
    marginBottom: 20,
    elevation: 8,
  },
  profileInfo: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  avatarCircle: { 
    width: 64, 
    height: 64, 
    backgroundColor: 'rgba(255, 255, 255, 0.2)', 
    borderRadius: 32, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  profileName: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  profileEmail: { color: 'rgba(255, 255, 255, 0.8)', fontSize: 14 },
  section: { 
    borderRadius: 30, 
    padding: 8, 
    borderWidth: 1, 
    marginBottom: 20,
    overflow: 'hidden'
  },
  sectionTitle: { fontSize: 16, fontWeight: '600', paddingHorizontal: 16, paddingVertical: 12 },
  settingRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 16, 
    gap: 12,
  },
  iconBox: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  rowLabel: { fontSize: 16, fontWeight: '500' },
  rowSubLabel: { fontSize: 12 },
  logoutBtn: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: 12, 
    padding: 16, 
    borderRadius: 24, 
    borderWidth: 2,
    marginBottom: 20 
  },
  logoutText: { color: '#ef4444', fontWeight: 'bold', fontSize: 16 },
});