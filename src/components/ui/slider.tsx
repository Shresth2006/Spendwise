import * as React from "react";
import {
  View,
  StyleSheet,
  PanResponder,
  Animated,
  Dimensions,
  ViewStyle,
} from "react-native";

interface SliderProps {
  min?: number;
  max?: number;
  value?: number;
  onValueChange?: (value: number) => void;
  style?: ViewStyle;
}

function Slider({
  min = 0,
  max = 100,
  value = 0,
  onValueChange,
  style,
}: SliderProps) {
  const [sliderWidth, setSliderWidth] = React.useState(0);
  // Animated value for the thumb's position
  const animatedValue = React.useRef(new Animated.Value(value)).current;

  // Sync animation with prop changes
  React.useEffect(() => {
    Animated.spring(animatedValue, {
      toValue: value,
      useNativeDriver: false,
    }).start();
  }, [value]);

  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        const offset = Math.max(0, Math.min(gestureState.moveX - (SCREEN_PADDING), sliderWidth));
        const newValue = Math.round((offset / sliderWidth) * (max - min) + min);
        
        if (onValueChange) {
          onValueChange(newValue);
        }
      },
    })
  ).current;

  const SCREEN_PADDING = 24; // Common screen horizontal padding

  const thumbLeft = animatedValue.interpolate({
    inputRange: [min, max],
    outputRange: [0, sliderWidth],
    extrapolate: "clamp",
  });

  return (
    <View 
      style={[styles.root, style]} 
      onLayout={(e) => setSliderWidth(e.nativeEvent.layout.width)}
    >
      {/* Track Background */}
      <View style={styles.track}>
        {/* Active Range Color */}
        <Animated.View 
          style={[
            styles.range, 
            { width: thumbLeft }
          ]} 
        />
      </View>

      {/* Thumb Handle */}
      <Animated.View
        {...panResponder.panHandlers}
        style={[
          styles.thumb,
          { transform: [{ translateX: thumbLeft }] }
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    width: "100%",
    height: 40,
    justifyContent: "center",
    position: "relative",
  },
  track: {
    height: 4, // h-4 equivalent but thinner for native aesthetic
    width: "100%",
    backgroundColor: "#e2e8f0", // bg-muted
    borderRadius: 999,
    overflow: "hidden",
  },
  range: {
    height: "100%",
    backgroundColor: "#9333ea", // bg-primary (SpendWise Purple)
  },
  thumb: {
    position: "absolute",
    left: -8, // Center thumb over the line
    width: 20, // size-4 approx
    height: 20,
    borderRadius: 10,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#9333ea",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
});

export { Slider };