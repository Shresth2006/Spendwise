import * as React from "react";
import { ScrollView, ScrollViewProps, StyleSheet, View, ViewStyle } from "react-native";

interface ScrollAreaProps extends ScrollViewProps {
  className?: string; // Prop compatibility
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
  orientation?: "vertical" | "horizontal";
}

/**
 * ScrollArea in Native uses the high-performance ScrollView.
 * Custom scrollbar styling is limited on mobile to ensure OS-level consistency.
 */
function ScrollArea({
  children,
  style,
  contentContainerStyle,
  orientation = "vertical",
  ...props
}: ScrollAreaProps) {
  return (
    <View style={[styles.root, style]}>
      <ScrollView
        data-slot="scroll-area-viewport"
        horizontal={orientation === "horizontal"}
        // Shows indicator by default, common on mobile
        showsVerticalScrollIndicator={orientation === "vertical"}
        showsHorizontalScrollIndicator={orientation === "horizontal"}
        // Native feel: bounce on scroll end
        bounces={true}
        contentContainerStyle={[styles.content, contentContainerStyle]}
        {...props}
      >
        {children}
      </ScrollView>
    </View>
  );
}

/**
 * In React Native, we don't manually render a 'ScrollBar' component
 * as it is handled by the OS. We export a No-Op for API compatibility.
 */
function ScrollBar() {
  return null;
}

const styles = StyleSheet.create({
  root: {
    flex: 1, // Fill available space
    width: "100%",
  },
  content: {
    // Ensuring the content can expand
    flexGrow: 1,
  },
});

export { ScrollArea, ScrollBar };