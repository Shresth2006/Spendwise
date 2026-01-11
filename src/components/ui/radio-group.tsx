import * as React from "react";
import { View, Pressable, StyleSheet, ViewStyle } from "react-native";
import { Circle } from "lucide-react-native";

const RadioGroupContext = React.createContext<{
  value?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
}>({});

function RadioGroup({
  value,
  onValueChange,
  disabled,
  children,
  style,
}: {
  value?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  children: React.ReactNode;
  style?: ViewStyle;
}) {
  return (
    <RadioGroupContext.Provider value={{ value, onValueChange, disabled }}>
      <View style={[styles.group, style]} data-slot="radio-group">
        {children}
      </View>
    </RadioGroupContext.Provider>
  );
}

function RadioGroupItem({
  value: itemValue,
  style,
  disabled: itemDisabled,
}: {
  value: string;
  style?: ViewStyle;
  disabled?: boolean;
}) {
  const { value, onValueChange, disabled: groupDisabled } = React.useContext(RadioGroupContext);
  
  const isSelected = value === itemValue;
  const isDisabled = groupDisabled || itemDisabled;

  return (
    <Pressable
      data-slot="radio-group-item"
      disabled={isDisabled}
      onPress={() => onValueChange?.(itemValue)}
      style={({ pressed }) => [
        styles.item,
        isSelected && styles.itemSelected,
        isDisabled && styles.disabled,
        pressed && styles.pressed,
        style,
      ]}
    >
      {isSelected && (
        <View style={styles.indicator} data-slot="radio-group-indicator">
          <Circle size={10} color="#9333ea" fill="#9333ea" />
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  group: {
    gap: 12, // grid gap-3 equivalent
  },
  item: {
    aspectRatio: 1,
    height: 20, // size-4 approx
    width: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e2e8f0", // border-input
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
  },
  itemSelected: {
    borderColor: "#9333ea", // primary color
  },
  indicator: {
    alignItems: "center",
    justifyContent: "center",
  },
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.7,
  },
});

export { RadioGroup, RadioGroupItem };