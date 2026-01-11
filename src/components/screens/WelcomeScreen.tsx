import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  ActivityIndicator,
  StatusBar,
  Dimensions
} from 'react-native';
import { User, ArrowRight } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');

export default function WelcomeScreen() {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<any>();
  
  // PRESERVED: Original mounting logic
  const isMounted = useRef(true);
  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);

  // PRESERVED: Original Firebase and Navigation logic
  const handleContinue = async () => {
    if (!name.trim()) return;

    setLoading(true);
    try {
      const currentUser = auth().currentUser;
      
      if (currentUser) {
        // PRESERVED: Logic to update profile for onboarding
        await currentUser.updateProfile({
          displayName: name.trim(),
        });

        if (isMounted.current) {
          navigation.navigate('CategoryPersonalization', { initialSelected: [] });
        }
      } else {
        Alert.alert("Session Error", "Please log in again to continue.");
      }
    } catch (error) {
      console.error("Save Name Error:", error);
      if (isMounted.current) {
        Alert.alert("Error", "We couldn't save your name. Please try again.");
      }
    } finally {
      if (isMounted.current) setLoading(false);
    }
  };

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <LinearGradient colors={['#F8FAFC', '#F1F5F9']} style={StyleSheet.absoluteFill} />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            
            {/* Elegant Avatar Section */}
            <View style={styles.avatarSection}>
              <View style={styles.avatarInnerContainer}>
                <LinearGradient 
                  colors={['#6366F1', '#4F46E5']} 
                  style={styles.avatarCircle}
                >
                  <User size={54} color="white" strokeWidth={1.5} />
                </LinearGradient>
              </View>
              {/* Subtle floor shadow for the avatar */}
              <View style={styles.avatarFloorShadow} />
            </View>

            <View style={styles.textSection}>
              <Text style={styles.title}>What should we call you?</Text>
              <Text style={styles.subtitle}>Let's personalize your experience</Text>
            </View>

            <View style={styles.inputWrapper}>
              <TextInput
                style={[
                    styles.input,
                    name.length > 0 && styles.inputActive
                ]}
                placeholder="Enter your name"
                placeholderTextColor="#94A3B8"
                value={name}
                onChangeText={setName}
                autoFocus
                onSubmitEditing={handleContinue}
                selectionColor="#6366F1"
                editable={!loading}
                autoCorrect={false}
              />
            </View>

            <TouchableOpacity
              onPress={handleContinue}
              disabled={!name.trim() || loading}
              activeOpacity={0.8}
              style={styles.buttonContainer}
            >
              <LinearGradient
                colors={(!name.trim() || loading) ? ['#CBD5E1', '#94A3B8'] : ['#6366F1', '#4F46E5']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={styles.button}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <View style={styles.btnInner}>
                    <Text style={styles.buttonText}>Continue</Text>
                    <ArrowRight size={20} color="white" style={{marginLeft: 8}} />
                  </View>
                )}
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.footer}>
              <View style={styles.progressContainer}>
                <View style={[styles.bullet, styles.bulletActive]} />
                <View style={[styles.bullet, styles.bulletInactive]} />
                <View style={[styles.bullet, styles.bulletInactive]} />
              </View>
              <Text style={styles.stepText}>STEP 1 OF 3</Text>
            </View>

          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1 },
  container: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingHorizontal: 35 
  },
  avatarSection: { alignItems: 'center', marginBottom: 40 },
  avatarInnerContainer: {
    padding: 6,
    backgroundColor: 'white',
    borderRadius: 60,
    zIndex: 1,
    elevation: 10,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
  },
  avatarCircle: { 
    width: 115, 
    height: 115, 
    borderRadius: 58, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  avatarFloorShadow: {
    width: 80,
    height: 10,
    backgroundColor: 'rgba(79, 70, 229, 0.1)',
    borderRadius: 50,
    marginTop: -5,
    transform: [{ scaleX: 1.2 }],
    filter: Platform.OS === 'ios' ? 'blur(5px)' : undefined, // Native blur isn't standard in style props, but used for concept
  },
  textSection: { alignItems: 'center', marginBottom: 40 },
  title: { 
    fontSize: 28, 
    color: '#0F172A', 
    textAlign: 'center', 
    marginBottom: 8, 
    fontWeight: '900',
    letterSpacing: -0.5
  },
  subtitle: { 
    fontSize: 16, 
    color: '#64748B', 
    textAlign: 'center', 
    lineHeight: 22 
  },
  inputWrapper: { width: '100%', marginBottom: 30 },
  input: { 
    backgroundColor: 'white', 
    paddingVertical: 18, 
    paddingHorizontal: 20, 
    borderRadius: 24, 
    borderWidth: 2, 
    borderColor: '#E2E8F0', 
    textAlign: 'center', 
    fontSize: 20, 
    color: '#0F172A',
    fontWeight: '700',
  },
  inputActive: {
    borderColor: '#6366F1',
    backgroundColor: '#FFFFFF',
  },
  buttonContainer: { width: '100%', borderRadius: 20, overflow: 'hidden', elevation: 4 },
  button: { 
    width: '100%', 
    paddingVertical: 18, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  btnInner: { flexDirection: 'row', alignItems: 'center' },
  buttonText: { color: 'white', fontSize: 18, fontWeight: '800' },
  
  footer: { marginTop: 60, alignItems: 'center' },
  progressContainer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  bullet: { height: 6, borderRadius: 3 },
  bulletActive: { width: 32, backgroundColor: '#6366F1' },
  bulletInactive: { width: 12, backgroundColor: '#E2E8F0' },
  stepText: { 
    color: '#6366F1', 
    marginTop: 15, 
    fontSize: 12, 
    fontWeight: '800', 
    letterSpacing: 1.5 
  },
});