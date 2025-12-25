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

export default function BottomNavigation() {
  const navigation = useNavigation<any>();
  const route = useRoute();

  // Automatically detect the active tab based on the current screen name
  const currentActive = route.name.toLowerCase();

  const tabs = [
    { id: 'home', label: 'Home', icon: Home, screen: 'Home' },
    { id: 'calendar', label: 'Calendar', icon: Calendar, screen: 'Calendar' },
    { id: 'goals', label: 'Goals', icon: Target, screen: 'Goals' },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp, screen: 'Analytics' },
    { id: 'settings', label: 'Settings', icon: Settings, screen: 'Settings' },
  ];

  return (
    <View style={styles.wrapper}>
      <SafeAreaView edges={['bottom']} style={styles.safeArea}>
        <View style={styles.container}>
          {tabs.map(({ id, label, icon: Icon, screen }) => {
            const isActive = currentActive === id;
            
            return (
              <TouchableOpacity
                key={id}
                onPress={() => navigation.navigate(screen)}
                activeOpacity={0.7}
                style={styles.tabItem}
                accessibilityRole="button"
                accessibilityState={{ selected: isActive }}
              >
                <Icon 
                  size={24} 
                  color={isActive ? '#9333ea' : '#d8b4fe'} 
                  strokeWidth={isActive ? 2.5 : 1.5} 
                />
                <Text 
                  numberOfLines={1}
                  style={[
                    styles.label, 
                    isActive ? styles.labelActive : styles.labelInactive
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
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f3e8ff',
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
  safeArea: {
    backgroundColor: '#fff',
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
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
    marginTop: 4,
  },
  labelActive: {
    color: '#9333ea',
  },
  labelInactive: {
    color: '#d8b4fe',
  },
});