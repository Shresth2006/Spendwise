import * as React from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  Animated, 
  Dimensions, 
  Platform,
  StatusBar 
} from "react-native";

const { width } = Dimensions.get("window");

// Simple global event emitter for toasts
let toastRef: (message: string, type?: "default" | "error" | "success") => void;

export const toast = (message: string, type: "default" | "error" | "success" = "default") => {
  if (toastRef) toastRef(message, type);
};

export function Toaster() {
  const [visible, setVisible] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [type, setType] = React.useState<"default" | "error" | "success">("default");
  
  const translateY = React.useRef(new Animated.Value(-100)).current;

  toastRef = (msg, toastType = "default") => {
    setMessage(msg);
    setType(toastType);
    showToast();
  };

  const showToast = () => {
    setVisible(true);
    Animated.sequence([
      Animated.spring(translateY, {
        toValue: Platform.OS === 'ios' ? 60 : 40,
        useNativeDriver: true,
        bounciness: 8,
      }),
      Animated.delay(3000),
      Animated.timing(translateY, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => setVisible(false));
  };

  if (!visible) return null;

  return (
    <Animated.View 
      style={[
        styles.container, 
        styles[type],
        { transform: [{ translateY }] }
      ]}
    >
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 20,
    right: 20,
    padding: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
    // Shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    // Elevation for Android
    elevation: 10,
  },
  default: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  success: {
    backgroundColor: "#10b981",
  },
  error: {
    backgroundColor: "#ef4444",
  },
  text: {
    fontSize: 14,
    fontWeight: "500",
    color: "#0f172a",
    textAlign: "center",
  },
});