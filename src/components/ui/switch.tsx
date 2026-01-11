import * as React from "react";
import { 
  Pressable, 
  StyleSheet, 
  Animated, 
  Platform, 
  ViewStyle 
} from "react-native";

interface SwitchProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  style?: ViewStyle;
}

function Switch({
  checked = false,
  onCheckedChange,
  disabled = false,
  style,
}: SwitchProps) {
  // Animated value for the thumb's horizontal position
  const animatedValue = React.useRef(new Animated.Value(checked ? 1 : 0)).current;

  React.useEffect(() => {
    // Smooth transition when 'checked' prop changes
    Animated.timing(animatedValue, {
      toValue: checked ? 1 : 0,
      duration: 200,
      useNativeDriver: false, // Background color and layout properties don't support native driver
    }).start();
  }, [checked]);

  // Interpolate position for the thumb
  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 14], // Distance the thumb travels inside the track
  });

  // Interpolate color for the track
  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["#e2e8f0", "#9333ea"], // Unchecked (gray) to Checked (purple)
  });

  return (
    <Pressable
      disabled={disabled}
      onPress={() => onCheckedChange?.(!checked)}
      style={({ pressed }) => [
        styles.root,
        disabled && styles.disabled,
        style,
      ]}
    >
      <Animated.View style={[styles.track, { backgroundColor }]}>
        <Animated.View 
          style={[
            styles.thumb, 
            { transform: [{ translateX }] }
          ]} 
        />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    width: 32, // w-8
    height: 18, // h-4ish
    justifyContent: "center",
  },
  track: {
    width: "100%",
    height: "100%",
    borderRadius: 999,
    justifyContent: "center",
  },
  thumb: {
    width: 14, // size-3.5
    height: 14,
    borderRadius: 7,
    backgroundColor: "#ffffff",
    // Shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    // Elevation for Android
    elevation: 2,
  },
  disabled: {
    opacity: 0.5,
  },
});

export { Switch };