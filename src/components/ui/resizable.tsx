import * as React from "react";
import {
  View,
  StyleSheet,
  PanResponder,
  Animated,
  Dimensions,
  ViewStyle,
} from "react-native";
import { GripVertical } from "lucide-react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const ResizableContext = React.createContext<any>(null);

/**
 * Root Group: Manages the split ratio between two panels.
 */
function ResizablePanelGroup({ children, direction = "horizontal", style }: any) {
  // We use a ratio (0 to 1) to determine how much space the first panel takes
  const [panelRatio] = React.useState(new Animated.Value(0.5));

  return (
    <ResizableContext.Provider value={{ panelRatio, direction }}>
      <View style={[
        styles.group, 
        direction === "vertical" ? styles.vertical : styles.horizontal, 
        style
      ]}>
        {children}
      </View>
    </ResizableContext.Provider>
  );
}

/**
 * Individual Panel: Sized based on the shared Animated ratio.
 */
function ResizablePanel({ children, index }: { children: React.ReactNode; index: number }) {
  const { panelRatio, direction } = React.useContext(ResizableContext);

  const flexStyle = index === 0 
    ? { flex: panelRatio } 
    : { flex: Animated.subtract(1, panelRatio) };

  return (
    <Animated.View style={[styles.panel, flexStyle]}>
      {children}
    </Animated.View>
  );
}

/**
 * Handle: The draggable divider.
 */
function ResizableHandle({ withHandle }: { withHandle?: boolean }) {
  const { panelRatio, direction } = React.useContext(ResizableContext);

  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        // Calculate new ratio based on drag position
        const newRatio = direction === "horizontal"
          ? gestureState.moveX / SCREEN_WIDTH
          : gestureState.moveY / Dimensions.get("window").height;
        
        // Clamp between 0.1 and 0.9 so panels don't disappear
        if (newRatio >= 0.1 && newRatio <= 0.9) {
          panelRatio.setValue(newRatio);
        }
      },
    })
  ).current;

  return (
    <View 
      {...panResponder.panHandlers} 
      style={[
        styles.handleBase, 
        direction === "vertical" ? styles.handleVertical : styles.handleHorizontal
      ]}
    >
      {withHandle && (
        <View style={styles.grip}>
          <GripVertical size={12} color="#64748b" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  group: { flex: 1 },
  horizontal: { flexDirection: "row" },
  vertical: { flexDirection: "column" },
  panel: { overflow: "hidden" },
  handleBase: {
    backgroundColor: "#e2e8f0",
    zIndex: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  handleHorizontal: { width: 4, height: "100%" },
  handleVertical: { height: 4, width: "100%" },
  grip: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 2,
  },
});

export { ResizablePanelGroup, ResizablePanel, ResizableHandle };