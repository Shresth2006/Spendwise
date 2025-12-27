import * as React from "react";
import { Pressable, Text, StyleSheet, ViewStyle, TextStyle, StyleProp } from "react-native";

interface ToggleProps {
  pressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  variant?: "default" | "outline";
  size?: "sm" | "default" | "lg";
  disabled?: boolean;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

function Toggle({
  pressed = false,
  onPressedChange,
  variant = "default",
  size = "default",
  disabled = false,
  children,
  style,
}: ToggleProps) {
  return (
    <Pressable
      disabled={disabled}
      onPress={() => onPressedChange?.(!pressed)}
      style={({ pressed: isPressing }) => [
        styles.base,
        styles[size],
        variant === "outline" && styles.outline,
        pressed && styles.on,
        disabled && styles.disabled,
        isPressing && styles.pressing,
        style,
      ]}
    >
      {/* Note: If children is a string, wrap it in a Text component. 
        If it's an Icon, it will render directly. 
      */}
      {typeof children === "string" ? (
        <Text style={[styles.text, pressed && styles.textOn]}>{children}</Text>
      ) : (
        children
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
    backgroundColor: "transparent",
    paddingHorizontal: 8,
  },
  // Sizes
  default: { height: 36, paddingHorizontal: 8, minWidth: 36 },
  sm: { height: 32, paddingHorizontal: 6, minWidth: 32 },
  lg: { height: 40, paddingHorizontal: 10, minWidth: 40 },
  
  // Variants
  outline: {
    borderWidth: 1,
    borderColor: "#e2e8f0", // border-input
  },
  
  // States
  on: {
    backgroundColor: "#f1f5f9", // bg-accent
  },
  pressing: {
    opacity: 0.7,
  },
  disabled: {
    opacity: 0.5,
  },
  
  // Text Styles
  text: {
    fontSize: 14,
    fontWeight: "500",
    color: "#0f172a",
  },
  textOn: {
    color: "#0f172a", // accent-foreground
  },
});

export { Toggle };