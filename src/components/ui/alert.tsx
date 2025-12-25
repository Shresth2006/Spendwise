import * as React from "react";
import { View, Text, StyleSheet, ViewStyle, TextStyle } from "react-native";

interface AlertProps {
  children?: React.ReactNode;
  variant?: "default" | "destructive";
  style?: ViewStyle;
}

function Alert({ children, variant = "default", style }: AlertProps) {
  const isDestructive = variant === "destructive";

  return (
    <View
      style={[
        styles.alert,
        isDestructive ? styles.alertDestructive : styles.alertDefault,
        style,
      ]}
    >
      {/* To mimic the grid-cols layout from web, we use a row-based flex container.
        If you pass an icon as the first child, wrap it in a View.
      */}
      <View style={styles.contentContainer}>
        {children}
      </View>
    </View>
  );
}

function AlertTitle({ children, style, variant = "default" }: any) {
  const isDestructive = variant === "destructive";
  return (
    <Text
      style={[
        styles.title,
        isDestructive ? { color: "#ef4444" } : { color: "#111827" },
        style,
      ]}
    >
      {children}
    </Text>
  );
}

function AlertDescription({ children, style, variant = "default" }: any) {
  const isDestructive = variant === "destructive";
  return (
    <Text
      style={[
        styles.description,
        isDestructive ? { color: "rgba(239, 68, 68, 0.9)" } : { color: "#6b7280" },
        style,
      ]}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  alert: {
    position: "relative",
    width: "100%",
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  alertDefault: {
    backgroundColor: "#ffffff",
    borderColor: "#e5e7eb",
  },
  alertDestructive: {
    backgroundColor: "#ffffff",
    borderColor: "#fecaca",
  },
  contentContainer: {
    flexDirection: "column",
    gap: 2,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: -0.2,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export { Alert, AlertTitle, AlertDescription };