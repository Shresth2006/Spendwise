import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, StatusBar } from 'react-native';
import { Wallet } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native'; // Import navigation hook

export default function SplashScreen() {
  const navigation = useNavigation<any>();

  // Animation values
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 1. Loading Dots Animation Logic
    const animate = (dot: Animated.Value, delay: number) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, {
            toValue: -15,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    animate(dot1, 0);
    animate(dot2, 150);
    animate(dot3, 300);

    // 2. Navigation Timer: Automatically move to next screen after 2.5 seconds
    const timer = setTimeout(() => {
      // We use 'replace' so the user cannot go back to the splash screen
      navigation.replace('Welcome'); 
    }, 2500);

    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, [dot1, dot2, dot3, navigation]);

  return (
    <View style={styles.container}>
      <StatusBar 
        barStyle="light-content" 
        translucent 
        backgroundColor="transparent" 
      />
      
      <View style={styles.content}>
        <View style={styles.logoBackground}>
          <Wallet size={60} color="white" strokeWidth={1.5} />
        </View>

        <Text style={styles.appName}>SpendWise</Text>
        <Text style={styles.tagline}>Smart spending, smarter savings</Text>
      </View>

      <View style={styles.dotContainer}>
        <Animated.View style={[styles.dot, { transform: [{ translateY: dot1 }] }]} />
        <Animated.View style={[styles.dot, { transform: [{ translateY: dot2 }], marginHorizontal: 12 }]} />
        <Animated.View style={[styles.dot, { transform: [{ translateY: dot3 }] }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#9333ea', 
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoBackground: {
    width: 100,
    height: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  appName: {
    color: 'white',
    fontSize: 40,
    fontWeight: 'bold',
    letterSpacing: -1,
    marginBottom: 10,
  },
  tagline: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  dotContainer: {
    position: 'absolute',
    bottom: 80,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    backgroundColor: 'white',
    borderRadius: 5,
    opacity: 0.7,
  },
});