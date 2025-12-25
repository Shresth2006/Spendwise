import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import { User } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

// NOTE: We are using standard Views instead of LinearGradient 
// to ensure the screen doesn't turn black while your native links are being fixed.

export default function WelcomeScreen() {
  const [name, setName] = useState('');
  const navigation = useNavigation<any>();

  const handleContinue = () => {
    if (name.trim()) {
      // Navigate to Auth screen and pass the name as a parameter
      navigation.navigate('Auth', { userName: name.trim() });
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          
          {/* Avatar Preview */}
          <View style={styles.avatarContainer}>
            <View style={styles.avatarCircle}>
              <User size={64} color="white" strokeWidth={1.5} />
            </View>
          </View>

          {/* Question */}
          <Text style={styles.title}>What should we call you?</Text>
          <Text style={styles.subtitle}>Let's personalize your experience</Text>

          {/* Name Input */}
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Enter your name"
              placeholderTextColor="#a78bfa"
              value={name}
              onChangeText={setName}
              autoFocus
              onSubmitEditing={handleContinue}
              selectionColor="#9333ea"
            />
          </View>

          {/* Continue Button */}
          <TouchableOpacity
            onPress={handleContinue}
            disabled={!name.trim()}
            activeOpacity={0.8}
            style={[
              styles.button, 
              !name.trim() ? styles.buttonDisabled : styles.buttonEnabled
            ]}
          >
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>

          {/* Progress Indicator */}
          <View style={styles.progressContainer}>
            <View style={[styles.progressStep, { backgroundColor: '#9333ea' }]} />
            <View style={[styles.progressStep, { backgroundColor: '#ddd6fe', marginHorizontal: 8 }]} />
            <View style={[styles.progressStep, { backgroundColor: '#ddd6fe' }]} />
          </View>
          <Text style={styles.stepText}>Step 1 of 3</Text>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f3ff', // Light purple background
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  avatarContainer: {
    marginBottom: 32,
  },
  avatarCircle: {
    width: 112,
    height: 112,
    borderRadius: 56,
    backgroundColor: '#c084fc', // Purple color
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  title: {
    fontSize: 28,
    color: '#4c1d95',
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 16,
    color: '#9333ea',
    textAlign: 'center',
    marginBottom: 32,
  },
  inputWrapper: {
    width: '100%',
    maxWidth: 400,
    marginBottom: 32,
  },
  input: {
    backgroundColor: 'white',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#ede9fe',
    textAlign: 'center',
    fontSize: 18,
    color: '#4c1d95',
  },
  button: {
    width: '100%',
    maxWidth: 400,
    paddingVertical: 16,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonEnabled: {
    backgroundColor: '#9333ea',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonDisabled: {
    backgroundColor: '#d8b4fe',
    opacity: 0.6,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  progressContainer: {
    marginTop: 48,
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressStep: {
    width: 32,
    height: 6,
    borderRadius: 3,
  },
  stepText: {
    color: '#a78bfa',
    marginTop: 12,
    fontSize: 14,
  },
});