import * as React from "react";
import { Text, StyleSheet, TextStyle } from "react-native";

export interface LabelProps {
  children?: React.ReactNode;
  style?: TextStyle;
  disabled?: boolean;
}

/**
 * A stylized Text component used for form labels.
 */
function Label({ children, style, disabled, ...props }: LabelProps) {
  return (
    <Text
      data-slot="label"
      style={[
        styles.base,
        disabled && styles.disabled,
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  base: {
    fontSize: 14, // text-sm
    fontWeight: "500", // font-medium
    color: "#0f172a", // foreground color
    lineHeight: 16, // leading-none (approx)
    marginBottom: 4, // Added for mobile spacing ergonomics
  },
  disabled: {
    opacity: 0.5,
  },
});

export { Label };