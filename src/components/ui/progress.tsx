import * as React from "react";
import { View, StyleSheet, Animated, ViewStyle } from "react-native";

interface ProgressProps {
  value?: number; // 0 to 100
  style?: ViewStyle;
  indicatorStyle?: ViewStyle;
}

/**
 * A linear progress bar component.
 * Replicates the shadcn/radix-ui appearance using Native Views and Animations.
 */
function Progress({ value = 0, style, indicatorStyle }: ProgressProps) {
  const animatedWidth = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    // Animate the progress bar width when the value changes
    Animated.spring(animatedWidth, {
      toValue: value,
      useNativeDriver: false, // Width animation doesn't support native driver
      tension: 20,
      friction: 7,
    }).start();
  }, [value]);

  // Interpolate the numerical value into a percentage string
  const width = animatedWidth.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
    extrapolate: "clamp",
  });

  return (
    <View data-slot="progress" style={[styles.root, style]}>
      <Animated.View
        data-slot="progress-indicator"
        style={[
          styles.indicator,
          { width },
          indicatorStyle,
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    position: "relative",
    height: 8, // h-2
    width: "100%",
    backgroundColor: "rgba(147, 51, 234, 0.2)", // primary/20 (assuming purple)
    overflow: "hidden",
    borderRadius: 9999, // rounded-full
  },
  indicator: {
    height: "100%",
    backgroundColor: "#9333ea", // primary (SpendWise Purple)
    flex: 1,
  },
});

export { Progress };