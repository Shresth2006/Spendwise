import * as React from "react";
import { 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ViewStyle, 
  TextStyle, 
  ActivityIndicator,
  View
} from "react-native";

// Define the available variants and sizes
export type ButtonVariant = "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
export type ButtonSize = "default" | "sm" | "lg" | "icon";

interface ButtonProps {
  onPress?: () => void;
  children?: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

function Button({
  onPress,
  children,
  variant = "default",
  size = "default",
  disabled = false,
  loading = false,
  style,
  textStyle,
}: ButtonProps) {

  // Map container styles based on variant and size
  const containerStyles = [
    styles.baseContainer,
    variantStyles[variant],
    sizeStyles[size],
    disabled && styles.disabled,
    style,
  ];

  // Map text styles based on variant
  const contentTextStyle = [
    styles.baseText,
    variantTextStyles[variant],
    textStyle,
  ];

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      style={containerStyles}
    >
      {loading ? (
        <ActivityIndicator color={variant === "outline" || variant === "ghost" ? "#9333ea" : "white"} />
      ) : (
        <View style={styles.contentWrapper}>
          {typeof children === "string" ? (
            <Text style={contentTextStyle}>{children}</Text>
          ) : (
            children
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  baseContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },
  baseText: {
    fontSize: 14,
    fontWeight: "500",
  },
  contentWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  disabled: {
    opacity: 0.5,
  },
});

const variantStyles: Record<ButtonVariant, ViewStyle> = {
  default: { backgroundColor: "#9333ea" }, // Your SpendWise Primary Purple
  destructive: { backgroundColor: "#ef4444" },
  outline: { backgroundColor: "transparent", borderWidth: 1, borderColor: "#e5e7eb" },
  secondary: { backgroundColor: "#f3f4f6" },
  ghost: { backgroundColor: "transparent" },
  link: { backgroundColor: "transparent" },
};

const variantTextStyles: Record<ButtonVariant, TextStyle> = {
  default: { color: "white" },
  destructive: { color: "white" },
  outline: { color: "#111827" },
  secondary: { color: "#111827" },
  ghost: { color: "#111827" },
  link: { color: "#9333ea", textDecorationLine: "underline" },
};

const sizeStyles: Record<ButtonSize, ViewStyle> = {
  default: { height: 44, paddingHorizontal: 16 },
  sm: { height: 36, paddingHorizontal: 12 },
  lg: { height: 56, paddingHorizontal: 24 },
  icon: { height: 44, width: 44 },
};

export { Button };