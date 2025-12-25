import * as React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";

const TabsContext = React.createContext<{
  value: string;
  onValueChange: (val: string) => void;
}>({ value: "", onValueChange: () => {} });

function Tabs({
  defaultValue,
  value: controlledValue,
  onValueChange,
  children,
  style,
}: {
  defaultValue?: string;
  value?: string;
  onValueChange?: (val: string) => void;
  children: React.ReactNode;
  style?: ViewStyle;
}) {
  const [internalValue, setInternalValue] = React.useState(defaultValue || "");
  const value = controlledValue !== undefined ? controlledValue : internalValue;

  const handleValueChange = (val: string) => {
    if (onValueChange) {
      onValueChange(val);
    } else {
      setInternalValue(val);
    }
  };

  return (
    <TabsContext.Provider value={{ value, onValueChange: handleValueChange }}>
      <View style={[styles.tabs, style]}>{children}</View>
    </TabsContext.Provider>
  );
}

function TabsList({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  return <View style={[styles.list, style]}>{children}</View>;
}

function TabsTrigger({
  value: triggerValue,
  children,
  style,
}: {
  value: string;
  children: React.ReactNode;
  style?: ViewStyle;
}) {
  const { value, onValueChange } = React.useContext(TabsContext);
  const isActive = value === triggerValue;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => onValueChange(triggerValue)}
      style={[
        styles.trigger,
        isActive && styles.triggerActive,
        style,
      ]}
    >
      <Text style={[styles.triggerText, isActive && styles.triggerTextActive]}>
        {children}
      </Text>
    </TouchableOpacity>
  );
}

function TabsContent({
  value: contentValue,
  children,
  style,
}: {
  value: string;
  children: React.ReactNode;
  style?: ViewStyle;
}) {
  const { value } = React.useContext(TabsContext);

  if (value !== contentValue) return null;

  return <View style={[styles.content, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  tabs: {
    flexDirection: "column",
    gap: 12,
  },
  list: {
    flexDirection: "row",
    backgroundColor: "#f1f5f9", // bg-muted
    borderRadius: 12,
    padding: 4,
    alignSelf: "flex-start",
    minHeight: 40,
  },
  trigger: {
    flex: 1,
    minWidth: 80,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  triggerActive: {
    backgroundColor: "#ffffff",
    // Elevation for Android
    elevation: 2,
    // Shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  triggerText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#64748b", // muted-foreground
  },
  triggerTextActive: {
    color: "#0f172a", // foreground
  },
  content: {
    flex: 1,
  },
});

export { Tabs, TabsList, TabsTrigger, TabsContent };