import * as React from "react";
import { View, Text, TextInput, StyleSheet, Pressable, Animated } from "react-native";
import { Minus } from "lucide-react-native";

interface InputOTPProps {
  value: string;
  onChangeText: (value: string) => void;
  maxLength?: number;
  children: React.ReactNode;
}

const OTPContext = React.createContext<{ value: string; focusedIndex: number }>({
  value: "",
  focusedIndex: -1,
});

/**
 * The Root Component
 * Uses a hidden TextInput to capture system keyboard input.
 */
function InputOTP({ value, onChangeText, maxLength = 6, children }: InputOTPProps) {
  const inputRef = React.useRef<TextInput>(null);
  const [isFocused, setIsFocused] = React.useState(false);

  const handlePress = () => {
    inputRef.current?.focus();
  };

  return (
    <OTPContext.Provider value={{ value, focusedIndex: isFocused ? value.length : -1 }}>
      <Pressable onPress={handlePress} style={styles.container}>
        {children}
        <TextInput
          ref={inputRef}
          value={value}
          onChangeText={onChangeText}
          maxLength={maxLength}
          keyboardType="number-pad"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={styles.hiddenInput}
          caretHidden
        />
      </Pressable>
    </OTPContext.Provider>
  );
}

function InputOTPGroup({ children }: { children: React.ReactNode }) {
  return <View style={styles.group}>{children}</View>;
}

function InputOTPSlot({ index }: { index: number }) {
  const { value, focusedIndex } = React.useContext(OTPContext);
  const char = value[index];
  const isActive = focusedIndex === index;

  return (
    <View style={[styles.slot, isActive && styles.slotActive]}>
      <Text style={styles.slotText}>{char}</Text>
      {isActive && <FakeCaret />}
    </View>
  );
}

function FakeCaret() {
  const opacity = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0, duration: 500, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 500, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return <Animated.View style={[styles.caret, { opacity }]} />;
}

function InputOTPSeparator() {
  return (
    <View style={styles.separator}>
      <Minus size={16} color="#64748b" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  hiddenInput: {
    position: "absolute",
    opacity: 0,
    width: 1,
    height: 1,
  },
  group: {
    flexDirection: "row",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    overflow: "hidden",
  },
  slot: {
    width: 40,
    height: 48,
    backgroundColor: "#fff",
    borderRightWidth: 1,
    borderRightColor: "#e2e8f0",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  slotActive: {
    zIndex: 10,
    borderColor: "#9333ea",
    borderWidth: 1,
    marginHorizontal: -1, // Overlap border for active state
  },
  slotText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0f172a",
  },
  caret: {
    position: "absolute",
    height: 16,
    width: 2,
    backgroundColor: "#9333ea",
  },
  separator: {
    paddingHorizontal: 4,
  },
});

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator };