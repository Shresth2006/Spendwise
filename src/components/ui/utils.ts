import {
  StyleSheet,
  ViewStyle,
  TextStyle,
  ImageStyle,
  Platform,
} from "react-native";

type Style = ViewStyle | TextStyle | ImageStyle;

/**
 * Cross-platform `cn` helper:
 * - Web: joins className strings
 * - Native: flattens style objects
 */
export function cn(
  ...styles: (Style | Style[] | string | undefined | null | false)[]
): any {
  // 🌐 Web: return className string
  if (Platform.OS === "web") {
    return styles
      .filter((s): s is string => typeof s === "string")
      .join(" ");
  }

  // 📱 Native: flatten RN styles
  const nativeStyles = styles.filter(
    (s): s is Style | Style[] =>
      typeof s !== "string" && s !== undefined && s !== null && s !== false
  );

  return StyleSheet.flatten(nativeStyles as any);
}
