import * as React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";

export interface SeparatorProps {
  orientation?: "horizontal" | "vertical";
  style?: ViewStyle;
}

/**
 * A visual divider component.
 * Uses StyleSheet.hairlineWidth for a perfectly crisp line on high-density mobile screens.
 */
function Separator({
  orientation = "horizontal",
  style,
  ...props
}: SeparatorProps) {
  return (
    <View
      data-slot="separator-root"
      style={[
        orientation === "horizontal" ? styles.horizontal : styles.vertical,
        style,
      ]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  horizontal: {
    backgroundColor: "#e2e8f0", // border color
    height: StyleSheet.hairlineWidth, // Precise 1px-look on all screens
    width: "100%",
  },
  vertical: {
    backgroundColor: "#e2e8f0",
    width: StyleSheet.hairlineWidth,
    height: "100%",
  },
});

export { Separator };