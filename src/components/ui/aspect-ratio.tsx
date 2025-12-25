import * as React from "react";
import { View, ViewProps, StyleSheet } from "react-native";

interface AspectRatioProps extends ViewProps {
  ratio?: number; // Defaults to 1 (square)
  children: React.ReactNode;
}

/**
 * A component to constrain children to a specific aspect ratio.
 * In React Native, we use the style prop 'aspectRatio'.
 */
function AspectRatio({ ratio = 1, children, style, ...props }: AspectRatioProps) {
  return (
    <View 
      data-slot="aspect-ratio" 
      style={[{ aspectRatio: ratio, width: '100%' }, style]} 
      {...props}
    >
      {children}
    </View>
  );
}

export { AspectRatio };