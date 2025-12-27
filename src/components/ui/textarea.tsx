import * as React from "react";
import {
  TextInput,
  StyleSheet,
  TextInputProps,
  Platform,
  NativeSyntheticEvent,
  TextInputFocusEventData,
  TextStyle,
  StyleProp,
} from "react-native";

export interface TextareaProps extends TextInputProps {
  style?: StyleProp<TextStyle>;
}

function Textarea({ style, onFocus, onBlur, ...props }: TextareaProps) {
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
  const dataSlotProp = Platform.OS === "web" ? ({ "data-slot": "textarea" } as any) : {};

  return (
    <TextInput
      {...dataSlotProp}
      multiline
      numberOfLines={4}
      textAlignVertical="top" // Ensures text starts at the top on Android
      placeholderTextColor="#64748b"
      style={[
        styles.base,
        isFocused && styles.focused,
        props.editable === false && styles.disabled,
        style,
      ]}
      onFocus={handleFocus}
      onBlur={handleBlur}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    width: "100%",
    minHeight: 80, // min-h-16 equivalent
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    backgroundColor: "#ffffff",
    paddingHorizontal: 12,
    paddingTop: 10, // Added for vertical alignment balance
    paddingBottom: 10,
    fontSize: 16, // Prevents iOS auto-zoom
    color: "#0f172a",
    ...Platform.select({
      web: {
        outlineStyle: "none",
      },
    }),
  },
  focused: {
    borderColor: "#9333ea", // primary ring color
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

export { Textarea };