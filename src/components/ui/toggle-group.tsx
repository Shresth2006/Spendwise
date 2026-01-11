import * as React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle, TextStyle } from "react-native";

const ToggleGroupContext = React.createContext<{
  value?: string | string[];
  onValueChange?: (val: any) => void;
  type: "single" | "multiple";
}>({ type: "single" });

function ToggleGroup({
  value,
  onValueChange,
  type = "single",
  children,
  style,
}: {
  value?: string | string[];
  onValueChange?: (val: any) => void;
  type?: "single" | "multiple";
  children: React.ReactNode;
  style?: ViewStyle;
}) {
  const handlePress = (itemValue: string) => {
    if (type === "single") {
      onValueChange?.(itemValue === value ? undefined : itemValue);
    } else {
      const currentValues = Array.isArray(value) ? value : [];
      const nextValues = currentValues.includes(itemValue)
        ? currentValues.filter((v) => v !== itemValue)
        : [...currentValues, itemValue];
      onValueChange?.(nextValues);
    }
  };

  return (
    <ToggleGroupContext.Provider value={{ value, onValueChange: handlePress, type }}>
      <View style={[styles.group, style]}>
        {children}
      </View>
    </ToggleGroupContext.Provider>
  );
}

function ToggleGroupItem({
  value: itemValue,
  children,
  style,
}: {
  value: string;
  children: React.ReactNode;
  style?: ViewStyle;
}) {
  const { value, onValueChange } = React.useContext(ToggleGroupContext);
  
  const isPressed = Array.isArray(value) 
    ? value.includes(itemValue) 
    : value === itemValue;

  return (
    <TouchableOpacity
      onPress={() => onValueChange?.(itemValue)}
      activeOpacity={0.7}
      style={[
        styles.item,
        isPressed && styles.itemPressed,
        style,
      ]}
    >
      <Text style={[styles.itemText, isPressed && styles.itemTextPressed]}>
        {children}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  group: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    overflow: "hidden", // Ensures children don't bleed over border radius
    alignSelf: "flex-start",
  },
  item: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRightWidth: 1,
    borderRightColor: "#e2e8f0",
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  itemPressed: {
    backgroundColor: "#f1f5f9", // bg-muted/accent
  },
  itemText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#64748b",
  },
  itemTextPressed: {
    color: "#0f172a",
  },
});

export { ToggleGroup, ToggleGroupItem };