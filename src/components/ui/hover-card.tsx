import * as React from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  ViewStyle,
  TextStyle,
} from "react-native";

const HoverCardContext = React.createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerLayout: { x: number; y: number; width: number; height: number } | null;
  setTriggerLayout: (layout: any) => void;
}>({
  open: false,
  setOpen: () => {},
  triggerLayout: null,
  setTriggerLayout: () => {},
});

function HoverCard({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const [triggerLayout, setTriggerLayout] = React.useState(null);

  return (
    <HoverCardContext.Provider value={{ open, setOpen, triggerLayout, setTriggerLayout }}>
      <View>{children}</View>
    </HoverCardContext.Provider>
  );
}

function HoverCardTrigger({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  const { setOpen, setTriggerLayout } = React.useContext(HoverCardContext);
  const ref = React.useRef<View>(null);

  const handlePress = () => {
    ref.current?.measure((x, y, width, height, pageX, pageY) => {
      setTriggerLayout({ x: pageX, y: pageY, width, height });
      setOpen(true);
    });
  };

  return (
    <TouchableOpacity ref={ref} onPress={handlePress} style={style} activeOpacity={0.7}>
      {children}
    </TouchableOpacity>
  );
}

function HoverCardContent({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  const { open, setOpen, triggerLayout } = React.useContext(HoverCardContext);

  if (!open || !triggerLayout) return null;

  // Position content below the trigger
  const popoverStyle: ViewStyle = {
    top: triggerLayout.y + triggerLayout.height + 8,
    left: Math.max(16, triggerLayout.x - 40), // Simple centering logic
  };

  return (
    <Modal transparent visible={open} animationType="fade">
      <TouchableWithoutFeedback onPress={() => setOpen(false)}>
        <View style={styles.overlay}>
          <View style={[styles.content, popoverStyle, style]}>
            {children}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "transparent", // Captures outside taps to close
  },
  content: {
    position: "absolute",
    width: 260, // w-64 equivalent
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
});

export { HoverCard, HoverCardTrigger, HoverCardContent };