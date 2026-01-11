import * as React from "react";
import { View, Text, StyleSheet, ViewStyle, TextStyle } from "react-native";

// Defining types for our variants
export interface BadgeProps {
  children?: React.ReactNode;
  variant?: "default" | "secondary" | "destructive" | "outline";
  style?: ViewStyle;
  textStyle?: TextStyle;
}

function Badge({ 
  children, 
  variant = "default", 
  style, 
  textStyle 
}: BadgeProps) {
  
  // Logic to determine background and border styles
  const getContainerStyle = () => {
    switch (variant) {
      case "secondary":
        return styles.secondaryContainer;
      case "destructive":
        return styles.destructiveContainer;
      case "outline":
        return styles.outlineContainer;
      default:
        return styles.defaultContainer;
    }
  };

  // Logic to determine text color
  const getTextColorStyle = () => {
    switch (variant) {
      case "secondary":
        return styles.secondaryText;
      case "destructive":
        return styles.destructiveText;
      case "outline":
        return styles.outlineText;
      default:
        return styles.defaultText;
    }
  };

  return (
    <View style={[styles.baseBadge, getContainerStyle(), style]}>
      {typeof children === "string" ? (
        <Text style={[styles.baseText, getTextColorStyle(), textStyle]}>
          {children}
        </Text>
      ) : (
        children
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  baseBadge: {
    alignSelf: 'flex-start', // w-fit
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6, // rounded-md
    borderWidth: 1,
    paddingHorizontal: 8, // px-2
    paddingVertical: 2, // py-0.5
  },
  baseText: {
    fontSize: 12, // text-xs
    fontWeight: '500', // font-medium
  },
  // Containers
  defaultContainer: {
    backgroundColor: '#9333ea', // Using your primary purple
    borderColor: 'transparent',
  },
  secondaryContainer: {
    backgroundColor: '#f3f4f6',
    borderColor: 'transparent',
  },
  destructiveContainer: {
    backgroundColor: '#ef4444',
    borderColor: 'transparent',
  },
  outlineContainer: {
    backgroundColor: 'transparent',
    borderColor: '#e5e7eb',
  },
  // Text Colors
  defaultText: {
    color: '#ffffff',
  },
  secondaryText: {
    color: '#1f2937',
  },
  destructiveText: {
    color: '#ffffff',
  },
  outlineText: {
    color: '#111827',
  },
});

export { Badge };