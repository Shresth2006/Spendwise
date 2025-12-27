import * as React from "react";
import {
  TextInput,
  StyleSheet,
  TextInputProps,
  Platform,
  NativeSyntheticEvent,
  TextInputFocusEventData,
} from "react-native";

export interface InputProps extends TextInputProps {
  className?: string; // Kept for prop compatibility
}

function Input({ style, onFocus, onBlur, ...props }: InputProps) {
  const [isFocused, setIsFocused] = React.useState(false);

  const handleFocus = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    setIsFocused(true);
    if (onFocus) onFocus(e);
  };

  const handleBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    setIsFocused(false);
    if (onBlur) onBlur(e);
  };

  // Only set the data-slot attribute on web where it's meaningful for testing/automation.
  const dataSlotProp = Platform.OS === "web" ? ({ "data-slot": "input" } as any) : {};

  return (
    <TextInput
      {...dataSlotProp}
      style={[
        styles.base,
        isFocused && styles.focused,
        props.editable === false && styles.disabled,
        style,
      ]}
      placeholderTextColor="#64748b" // muted-foreground
      onFocus={handleFocus}
      onBlur={handleBlur}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    width: "100%",
    height: 40, // h-9 equivalent (approx 36-40px)
    borderRadius: 6, // rounded-md
    borderWidth: 1,
    borderColor: "#e2e8f0", // border-input
    backgroundColor: "#ffffff", // bg-input-background
    paddingHorizontal: 12, // px-3
    fontSize: 16, // text-base (prevents iOS auto-zoom on focus)
    color: "#0f172a", // foreground
    ...Platform.select({
      web: {
        outlineStyle: "none",
      },
    }),
  },
  focused: {
    borderColor: "#9333ea", // ring color (SpendWise purple)
    // React Native doesn't support 'ring' spread, so we use border color or shadow
    shadowColor: "#9333ea",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  disabled: {
    opacity: 0.5,
    backgroundColor: "#f1f5f9",
  },
});

export { Input };