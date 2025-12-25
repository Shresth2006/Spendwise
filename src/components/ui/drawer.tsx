import * as React from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  PanResponder,
  Animated,
  ViewStyle,
} from "react-native";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const DrawerContext = React.createContext<any>(null);

function Drawer({ open, onOpenChange, children }: any) {
  return (
    <DrawerContext.Provider value={{ open, setOpen: onOpenChange }}>
      {children}
    </DrawerContext.Provider>
  );
}

function DrawerTrigger({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  const { setOpen } = React.useContext(DrawerContext);
  return (
    <TouchableOpacity onPress={() => setOpen(true)} style={style} activeOpacity={0.7}>
      {children}
    </TouchableOpacity>
  );
}

function DrawerContent({ children, style }: any) {
  const { open, setOpen } = React.useContext(DrawerContext);
  const panY = React.useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  // Reset position when opening
  React.useEffect(() => {
    if (open) {
      Animated.spring(panY, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 10,
      }).start();
    } else {
      Animated.timing(panY, {
        toValue: SCREEN_HEIGHT,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [open]);

  // Gesture handling for the "Drag to Dismiss" feel
  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          panY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 150) {
          setOpen(false);
        } else {
          Animated.spring(panY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  return (
    <Modal visible={open} transparent animationType="none" onRequestClose={() => setOpen(false)}>
      <View style={styles.overlay}>
        <TouchableOpacity 
          style={StyleSheet.absoluteFill} 
          onPress={() => setOpen(false)} 
          activeOpacity={1} 
        />
        <Animated.View
          style={[
            styles.content,
            style,
            { transform: [{ translateY: panY }] }
          ]}
          {...panResponder.panHandlers}
        >
          {/* Handle bar to mimic Vaul/Mobile UI */}
          <View style={styles.handle} />
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
}

const DrawerHeader = ({ children, style }: any) => <View style={[styles.header, style]}>{children}</View>;
const DrawerFooter = ({ children, style }: any) => <View style={[styles.footer, style]}>{children}</View>;
const DrawerTitle = ({ children, style }: any) => <Text style={[styles.title, style]}>{children}</Text>;
const DrawerDescription = ({ children, style }: any) => <Text style={[styles.description, style]}>{children}</Text>;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  content: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
    maxHeight: SCREEN_HEIGHT * 0.8,
  },
  handle: {
    width: 40,
    height: 5,
    backgroundColor: "#e2e8f0",
    borderRadius: 3,
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 8,
  },
  header: { padding: 20, gap: 4 },
  footer: { padding: 20, marginTop: "auto" },
  title: { fontSize: 18, fontWeight: "600", color: "#0f172a" },
  description: { fontSize: 14, color: "#64748b" },
});

export {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
};