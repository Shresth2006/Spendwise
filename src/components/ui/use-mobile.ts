import * as React from "react";
import { useWindowDimensions } from "react-native";

// Standard breakpoint for tablets (iPad Mini is ~744-768px)
const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const { width } = useWindowDimensions();
  
  // React Native hooks handle the 'change' listener automatically.
  // Whenever the device rotates or a split-view changes, 'width' updates.
  const isMobile = React.useMemo(() => {
    return width < MOBILE_BREAKPOINT;
  }, [width]);

  return isMobile;
}