import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Platform 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Home, 
  Calendar, 
  Target, 
  TrendingUp, 
  Settings 
} from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

import { useDarkMode } from './DarkModeProvider';
import { palette } from '../styles/theme';

export default function BottomNavigation() {
  const navigation = useNavigation<any>();
  const route = useRoute();

  const { darkMode } = useDarkMode();
  const colors = darkMode ? palette.dark : palette.light;

  const tabs = [
    { label: 'Home', icon: Home, screen: 'Home' },
    { label: 'Calendar', icon: Calendar, screen: 'Calendar' },
    { label: 'Goals', icon: Target, screen: 'Goals' },
    { label: 'Analytics', icon: TrendingUp, screen: 'Analytics' },
    { label: 'Settings', icon: Settings, screen: 'Settings' },
  ];

  return (
    <View style={[styles.wrapper, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
      <SafeAreaView edges={['bottom']} style={{ backgroundColor: colors.card }}>
        <View style={styles.container}>
          {tabs.map(({ label, icon: Icon, screen }) => {
            const isActive = route.name === screen;

            return (
              <TouchableOpacity
                key={screen}
                onPress={() => navigation.navigate(screen)}
                activeOpacity={0.7}
                style={styles.tabItem}
              >
                <Icon 
                  size={24} 
                  color={isActive ? colors.primary : colors.mutedForeground} 
                  strokeWidth={isActive ? 2.5 : 1.5} 
                />
                <Text
                  numberOfLines={1}
                  style={[
                    styles.label,
                    { color: isActive ? colors.primary : colors.mutedForeground },
                  ]}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderTopWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 56,
    paddingHorizontal: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
});
