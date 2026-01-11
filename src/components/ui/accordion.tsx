import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { ChevronDownIcon } from 'lucide-react-native';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

/**
 * Root Accordion Component
 */
export function Accordion({ children, style }: { children: React.ReactNode; style?: any }) {
  return <View style={[styles.accordionRoot, style]}>{children}</View>;
}

/**
 * Accordion Item Component
 * Handles the open/close state logic
 */
export function AccordionItem({ children, style }: { children: React.ReactNode; style?: any }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    // This creates the smooth "slide" effect when content appears
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsOpen(!isOpen);
  };

  // Pass the state to children using React.cloneElement or Context
  // For simplicity and to match your structure, we map children
  return (
    <View style={[styles.accordionItem, style]}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          // Pass isOpen and toggleOpen props to Trigger and Content
          return React.cloneElement(child as React.ReactElement<any>, { isOpen, toggleOpen });
        }
        return child;
      })}
    </View>
  );
}

/**
 * Accordion Trigger Component
 */
export function AccordionTrigger({ 
  children, 
  isOpen, 
  toggleOpen, 
  style 
}: any) {
  const rotateAnim = useRef(new Animated.Value(isOpen ? 1 : 0)).current;

  React.useEffect(() => {
    Animated.timing(rotateAnim, {
      toValue: isOpen ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [isOpen]);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <TouchableOpacity 
      onPress={toggleOpen} 
      activeOpacity={0.7} 
      style={[styles.trigger, style]}
    >
      <Text style={styles.triggerText}>{children}</Text>
      <Animated.View style={{ transform: [{ rotate: rotation }] }}>
        <ChevronDownIcon size={16} color="#6b7280" />
      </Animated.View>
    </TouchableOpacity>
  );
}

/**
 * Accordion Content Component
 */
export function AccordionContent({ children, isOpen, style }: any) {
  if (!isOpen) return null;

  return (
    <View style={[styles.content, style]}>
      <View style={styles.contentInner}>
        {typeof children === 'string' ? (
          <Text style={styles.contentText}>{children}</Text>
        ) : (
          children
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  accordionRoot: {
    width: '100%',
  },
  accordionItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb', // border-b
  },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16, // py-4
    gap: 16,
  },
  triggerText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    flex: 1,
  },
  content: {
    overflow: 'hidden',
  },
  contentInner: {
    paddingBottom: 16, // pb-4
  },
  contentText: {
    fontSize: 14,
    color: '#374151',
  }
});