import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Alert,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mail, Lock, Chrome } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

// 🚀 IMPORT YOUR REAL AUTH SERVICES
import { signInWithGoogle, signInWithEmail } from '../../services/auth'; 

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<any>();

  // EMAIL LOGIN/SIGNUP LOGIC
  const handleEmailAuth = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      await signInWithEmail(email, password);
      navigation.replace('Home');
    } catch (error: any) {
      Alert.alert("Authentication Failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  // GOOGLE LOGIN LOGIC
  const handleGoogleAuth = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      navigation.replace('Home');
    } catch (error: any) {
      // Google Sign-in error codes can be handled here
      console.log(error.code);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f3ff" />
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
              <Text style={styles.title}>{isLogin ? 'Welcome back' : 'Get started'}</Text>
              <Text style={styles.subtitle}>{isLogin ? 'Sign in to continue' : 'Create your account'}</Text>
            </View>

            <View style={styles.form}>
              {/* Email Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email</Text>
                <View style={styles.inputWrapper}>
                  <Mail size={20} color="#a78bfa" style={styles.inputIcon} />
                  <TextInput
                    style={styles.textInput}
                    placeholder="your@email.com"
                    placeholderTextColor="#a78bfa"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
              </View>

              {/* Password Input (MANDATORY FOR REAL AUTH) */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Password</Text>
                <View style={styles.inputWrapper}>
                  <Lock size={20} color="#a78bfa" style={styles.inputIcon} />
                  <TextInput
                    style={styles.textInput}
                    placeholder="••••••••"
                    placeholderTextColor="#a78bfa"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                  />
                </View>
              </View>

              <TouchableOpacity 
                activeOpacity={0.8} 
                onPress={handleEmailAuth}
                style={[styles.primaryBtn, loading && { backgroundColor: '#a78bfa' }]}
                disabled={loading}
              >
                {loading ? <ActivityIndicator color="white" /> : (
                  <Text style={styles.primaryBtnText}>{isLogin ? 'Sign In' : 'Create Account'}</Text>
                )}
              </TouchableOpacity>

              <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* GOOGLE BUTTON LINKED TO REAL SERVICE */}
              <TouchableOpacity 
                style={styles.googleBtn} 
                activeOpacity={0.7} 
                onPress={handleGoogleAuth}
                disabled={loading}
              >
                <Chrome size={20} color="#9333ea" />
                <Text style={styles.googleBtnText}>Continue with Google</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setIsLogin(!isLogin)} style={styles.toggleBtn}>
                <Text style={styles.toggleText}>
                  {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f3ff' },
  safeArea: { flex: 1 },
  keyboardView: { flex: 1 },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 40 },
  header: { paddingTop: 20, marginBottom: 32 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#4c1d95', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#9333ea' },
  form: { flex: 1 },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 16, color: '#4c1d95', marginBottom: 8, fontWeight: '500' },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#ede9fe',
    paddingHorizontal: 16,
  },
  inputIcon: { marginRight: 12 },
  textInput: { flex: 1, paddingVertical: 16, fontSize: 16, color: '#4c1d95' },
  primaryBtn: { 
    backgroundColor: '#9333ea', borderRadius: 20, paddingVertical: 18, alignItems: 'center', marginTop: 24,
    elevation: 4, shadowColor: '#9333ea', shadowOpacity: 0.3, shadowRadius: 8, shadowOffset: { width: 0, height: 4 },
  },
  primaryBtnText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  dividerRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 24 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#ddd6fe' },
  dividerText: { color: '#a78bfa', fontSize: 14, marginHorizontal: 16 },
  googleBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: 'white',
    borderRadius: 20, borderWidth: 2, borderColor: '#ede9fe', paddingVertical: 16,
  },
  googleBtnText: { color: '#4c1d95', fontSize: 16, fontWeight: '600', marginLeft: 12 },
  toggleBtn: { marginTop: 24, alignItems: 'center' },
  toggleText: { color: '#9333ea', fontSize: 14, fontWeight: '500' },
});