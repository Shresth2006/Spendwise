import React, { useState, useEffect, useRef } from 'react';
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
  ActivityIndicator,
  Dimensions
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Mail, Lock, Chrome, ArrowRight, Eye, EyeOff, ShieldCheck } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
// PRESERVED: Your existing auth service imports
import { signInWithGoogle, signInWithEmail, signUpWithEmail } from '../../services/auth'; 

const { width } = Dimensions.get('window');

export default function AuthScreen() {
  const insets = useSafeAreaInsets();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [secureText, setSecureText] = useState(true);
  
  const isMounted = useRef(true);
  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);

  const handleEmailAuth = async () => {
    if (!email || !password) {
      Alert.alert("Required", "Please enter both email and password.");
      return;
    }
    setLoading(true);
    try {
      if (isLogin) {
        await signInWithEmail(email, password);
      } else {
        await signUpWithEmail(email, password);
      }
    } catch (error: any) {
      if (isMounted.current) {
        Alert.alert("Auth Error", error.message);
        setLoading(false);
      }
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
    } catch (error: any) {
      if (isMounted.current) setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Matching the light slate background from your other screens */}
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <LinearGradient colors={['#F8FAFC', '#F1F5F9']} style={StyleSheet.absoluteFill} />
      
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardView}
        >
          <ScrollView 
            contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 20 }]} 
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.header}>
              <View style={styles.logoWrapper}>
                <LinearGradient colors={['#6366F1', '#4F46E5']} style={styles.logoGradient}>
                  <ShieldCheck color="white" size={32} strokeWidth={2.5} />
                </LinearGradient>
              </View>
              <Text style={styles.title}>{isLogin ? 'Welcome Back' : 'Create Account'}</Text>
              <Text style={styles.subtitle}>
                {isLogin ? 'Sign in to manage your finances' : 'Start your journey to financial freedom'}
              </Text>
            </View>

            <View style={styles.formCard}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>EMAIL ADDRESS</Text>
                <View style={styles.inputWrapper}>
                  <Mail size={18} color="#6366F1" style={styles.inputIcon} />
                  <TextInput
                    style={styles.textInput}
                    placeholder="name@example.com"
                    placeholderTextColor="#CBD5E1"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    editable={!loading}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>PASSWORD</Text>
                <View style={styles.inputWrapper}>
                  <Lock size={18} color="#6366F1" style={styles.inputIcon} />
                  <TextInput
                    style={styles.textInput}
                    placeholder="••••••••"
                    placeholderTextColor="#CBD5E1"
                    secureTextEntry={secureText}
                    value={password}
                    onChangeText={setPassword}
                    editable={!loading}
                  />
                  <TouchableOpacity onPress={() => setSecureText(!secureText)} style={styles.eyeBtn}>
                    {secureText ? <EyeOff size={20} color="#94A3B8" /> : <Eye size={20} color="#6366F1" />}
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity activeOpacity={0.85} onPress={handleEmailAuth} disabled={loading} style={styles.submitBtnWrapper}>
                <LinearGradient
                  colors={['#6366F1', '#4F46E5']}
                  start={{x: 0, y: 0}} end={{x: 1, y: 0}}
                  style={styles.primaryBtn}
                >
                  {loading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <View style={styles.btnContent}>
                      <Text style={styles.primaryBtnText}>{isLogin ? 'Sign In' : 'Join Now'}</Text>
                      <ArrowRight size={18} color="white" style={{marginLeft: 8}} strokeWidth={3} />
                    </View>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>OR CONTINUE WITH</Text>
                <View style={styles.dividerLine} />
              </View>

              <TouchableOpacity style={styles.googleBtn} activeOpacity={0.7} onPress={handleGoogleAuth} disabled={loading}>
                <Chrome size={20} color="#0F172A" />
                <Text style={styles.googleBtnText}>Google</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => setIsLogin(!isLogin)} style={styles.toggleBtn}>
              <Text style={styles.toggleText}>
                {isLogin ? "Don't have an account? " : 'Already have an account? '}
                <Text style={styles.toggleTextBold}>{isLogin ? 'Sign Up' : 'Sign In'}</Text>
              </Text>
            </TouchableOpacity>
          </ScrollView>
          
          {/* Consistent Spacer for System Navbar */}
          {Platform.OS === 'android' && <View style={{ height: 45, backgroundColor: 'transparent' }} />}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  keyboardView: { flex: 1 },
  scrollContent: { paddingHorizontal: 28, paddingBottom: 40 },
  header: { alignItems: 'center', marginBottom: 32 },
  logoWrapper: {
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: 'white',
    padding: 6,
    marginBottom: 20,
    elevation: 10,
    shadowColor: "#6366F1",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
  },
  logoGradient: { flex: 1, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 30, fontWeight: '900', color: '#0F172A', letterSpacing: -0.8 },
  subtitle: { fontSize: 15, color: '#64748B', textAlign: 'center', marginTop: 6, paddingHorizontal: 30, lineHeight: 22 },
  
  formCard: {
    backgroundColor: 'white',
    borderRadius: 32,
    padding: 24,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.04,
    shadowRadius: 20,
  },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 11, color: '#64748B', marginBottom: 8, fontWeight: '800', marginLeft: 4, letterSpacing: 1 },
  inputWrapper: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#F8FAFC', 
    borderRadius: 16, 
    borderWidth: 2, 
    borderColor: '#F1F5F9', 
    paddingHorizontal: 16 
  },
  inputIcon: { marginRight: 12 },
  textInput: { flex: 1, paddingVertical: 16, fontSize: 16, color: '#0F172A', fontWeight: '600' },
  eyeBtn: { padding: 4 },
  
  submitBtnWrapper: { marginTop: 10, borderRadius: 18, overflow: 'hidden' },
  primaryBtn: { 
    paddingVertical: 18, 
    alignItems: 'center', 
    elevation: 8,
    shadowColor: "#6366F1",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  btnContent: { flexDirection: 'row', alignItems: 'center' },
  primaryBtnText: { color: 'white', fontSize: 17, fontWeight: '800' },
  
  dividerRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 25 },
  dividerLine: { flex: 1, height: 1.5, backgroundColor: '#F1F5F9' },
  dividerText: { color: '#94A3B8', fontSize: 10, fontWeight: '800', marginHorizontal: 16, letterSpacing: 1 },
  
  googleBtn: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: 'white', 
    borderRadius: 18, 
    borderWidth: 2, 
    borderColor: '#F1F5F9', 
    paddingVertical: 15 
  },
  googleBtnText: { color: '#0F172A', fontSize: 16, fontWeight: '700', marginLeft: 12 },
  
  toggleBtn: { marginTop: 30, alignItems: 'center' },
  toggleText: { color: '#64748B', fontSize: 15 },
  toggleTextBold: { color: '#6366F1', fontWeight: '800' },
});