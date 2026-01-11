import * as React from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  ViewStyle,
  LayoutAnimation,
} from "react-native";

const TooltipContext = React.createContext<{
  visible: boolean;
  setVisible: (v: boolean) => void;
  triggerLayout: { x: number; y: number; width: number; height: number } | null;
  setTriggerLayout: (l: any) => void;
}>({
  visible: false,
  setVisible: () => {},
  triggerLayout: null,
  setTriggerLayout: () => {},
});

function TooltipProvider({ children }: { children: React.ReactNode }) {
  return <View>{children}</View>;
}

function Tooltip({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = React.useState(false);
  const [triggerLayout, setTriggerLayout] = React.useState(null);

  return (
    <TooltipContext.Provider value={{ visible, setVisible, triggerLayout, setTriggerLayout }}>
      {children}
    </TooltipContext.Provider>
  );
}

function TooltipTrigger({ children }: { children: React.ReactNode }) {
  const { setVisible, setTriggerLayout } = React.useContext(TooltipContext);
  const ref = React.useRef<View>(null);

  const handleLongPress = () => {
    ref.current?.measure((x, y, width, height, pageX, pageY) => {
      setTriggerLayout({ x: pageX, y: pageY, width, height });
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setVisible(true);
    });
  };

  return (
    <TouchableOpacity
      ref={ref}
      onLongPress={handleLongPress}
      delayLongPress={200}
      activeOpacity={0.8}
    >
      {children}
    </TouchableOpacity>
  );
}

function TooltipContent({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  const { visible, setVisible, triggerLayout } = React.useContext(TooltipContext);

  if (!visible || !triggerLayout) return null;

  // Position logic: Centers the tooltip above the trigger
  const tooltipStyle: ViewStyle = {
    position: "absolute",
    bottom: (styles.screenHeight - triggerLayout.y) + 8,
    left: triggerLayout.x + triggerLayout.width / 2 - 60, // Rough centering
  };

  return (
    <Modal transparent visible={visible} animationType="fade">
      <TouchableWithoutFeedback onPress={() => setVisible(false)}>
        <View style={styles.overlay}>
          <View style={[styles.content, tooltipStyle, style]}>
            <Text style={styles.text}>{children}</Text>
            {/* Arrow Tip */}
            <View style={styles.arrow} />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  screenHeight: require("react-native").Dimensions.get("window").height,
  overlay: {
    flex: 1,
    backgroundColor: "transparent",
  },
  content: {
    backgroundColor: "#0f172a", // bg-primary (dark)
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    width: 120,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "#ffffff",
    fontSize: 12,
    textAlign: "center",
  },
  arrow: {
    position: "absolute",
    bottom: -4,
    width: 8,
    height: 8,
    backgroundColor: "#0f172a",
    transform: [{ rotate: "45deg" }],
  },
});

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };