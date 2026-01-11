import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, StatusBar, Dimensions } from 'react-native';
import { Wallet } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useDarkMode } from '../DarkModeProvider';

const { width } = Dimensions.get('window');

export default function SplashScreen() {
  const { darkMode: isDark } = useDarkMode();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.loop(
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 2500,
        useNativeDriver: false,
      })
    ).start();
  }, []);

  const theme = {
    bg: isDark ? '#000' : '#F8F9FE',
    text: isDark ? '#FFF' : '#1E1B4B',
    accent: '#6366F1',
    glow1: '#6366F1',
    glow2: '#9333EA',
    sub: isDark ? 'rgba(255,255,255,0.4)' : '#94A3B8'
  };

  const loaderWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <StatusBar 
        barStyle={isDark ? 'light-content' : 'dark-content'} 
        translucent 
        backgroundColor="transparent" 
      />

      {/* THE CIRCLES (The background glows) */}
      <View style={[styles.glowCircle, { 
        backgroundColor: theme.glow1, 
        top: '15%', 
        left: -width * 0.2, 
        opacity: isDark ? 0.25 : 0.1 
      }]} />
      
      <View style={[styles.glowCircle, { 
        backgroundColor: theme.glow2, 
        bottom: '15%', 
        right: -width * 0.2, 
        opacity: isDark ? 0.2 : 0.08 
      }]} />

      <Animated.View style={[
        styles.content, 
        { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }
      ]}>
        
        {/* Logo */}
        <Wallet size={75} color={theme.accent} strokeWidth={1.8} />

        <View style={styles.textGroup}>
          <Text style={[styles.brand, { color: theme.text }]}>
            Spend<Text style={{ color: theme.accent }}>Wise</Text>
          </Text>
          <Text style={[styles.tagline, { color: theme.sub }]}>
            YOUR FINANCES • SIMPLIFIED
          </Text>
        </View>

        {/* Themed Progress Line */}
        <View style={styles.loaderContainer}>
          <View style={[styles.loaderBg, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }]}>
            <Animated.View style={[styles.loaderFill, { width: loaderWidth }]}>
              <LinearGradient
                colors={[theme.accent, theme.glow2]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={StyleSheet.absoluteFill}
              />
            </Animated.View>
          </View>
        </View>
      </Animated.View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  glowCircle: {
    position: 'absolute',
    width: width * 0.9,
    height: width * 0.9,
    borderRadius: (width * 0.9) / 2,
    // Blur is handled via opacity and spread for performance, 
    // though you could use BlurView if you want it more "glassy"
  },
  content: {
    alignItems: 'center',
    zIndex: 10,
  },
  textGroup: {
    alignItems: 'center',
    marginTop: 20,
  },
  brand: {
    fontSize: 44,
    fontWeight: '900',
    letterSpacing: -1.5,
  },
  tagline: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 4,
    marginTop: 8,
    textTransform: 'uppercase',
  },
  loaderContainer: {
    marginTop: 60,
    width: 160,
  },
  loaderBg: {
    width: '100%',
    height: 3,
    borderRadius: 10,
    overflow: 'hidden',
  },
  loaderFill: {
    height: '100%',
  },
  footerText: {
    position: 'absolute',
    bottom: 50,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
});