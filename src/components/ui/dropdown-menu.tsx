import * as React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  Platform,
} from "react-native";
import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const DropdownMenuContext = React.createContext<any>(null);

/**
 * Root Component
 */
export function DropdownMenu({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const [triggerLayout, setTriggerLayout] = React.useState<any>(null);
  const triggerRef = React.useRef<View>(null);

  const toggle = () => {
    if (triggerRef.current) {
      triggerRef.current.measure((x, y, width, height, pageX, pageY) => {
        setTriggerLayout({ x: pageX, y: pageY, width, height });
        setOpen(!open);
      });
    }
  };

  return (
    <DropdownMenuContext.Provider value={{ open, setOpen, toggle, triggerRef, triggerLayout }}>
      <View>{children}</View>
    </DropdownMenuContext.Provider>
  );
}

/**
 * Trigger Component
 */
export function DropdownMenuTrigger({ children }: { children: React.ReactNode }) {
  const { toggle, triggerRef } = React.useContext(DropdownMenuContext);
  return (
    <TouchableOpacity ref={triggerRef} onPress={toggle} activeOpacity={0.7}>
      {children}
    </TouchableOpacity>
  );
}

/**
 * Content Component (The Popover)
 */
export function DropdownMenuContent({ children }: { children: React.ReactNode }) {
  const { open, setOpen, triggerLayout } = React.useContext(DropdownMenuContext);

  if (!open || !triggerLayout) return null;

  // Simple logic to position menu below the trigger
  const menuStyle = {
    top: triggerLayout.y + triggerLayout.height + 5,
    left: Math.max(10, triggerLayout.x),
  };

  return (
    <Modal transparent visible={open} animationType="fade">
      <TouchableWithoutFeedback onPress={() => setOpen(false)}>
        <View style={styles.overlay}>
          <View style={[styles.content, menuStyle]}>
            {children}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

/**
 * Individual Menu Item
 */
export function DropdownMenuItem({ children, onPress, variant = "default" }: any) {
  const { setOpen } = React.useContext(DropdownMenuContext);

  const handlePress = () => {
    if (onPress) onPress();
    setOpen(false);
  };

  return (
    <TouchableOpacity style={styles.item} onPress={handlePress}>
      <Text style={[
        styles.itemText, 
        variant === "destructive" && { color: "#ef4444" }
      ]}>
        {children}
      </Text>
    </TouchableOpacity>
  );
}

export function DropdownMenuSeparator() {
  return <View style={styles.separator} />;
}

export function DropdownMenuLabel({ children }: { children: React.ReactNode }) {
  return <Text style={styles.label}>{children}</Text>;
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "transparent", // Invisible overlay to catch clicks
  },
  content: {
    position: "absolute",
    minWidth: 160,
    backgroundColor: "white",
    borderRadius: 8,
    padding: 4,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    // Shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    // Elevation for Android
    elevation: 8,
  },
  item: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 4,
  },
  itemText: {
    fontSize: 14,
    color: "#0f172a",
  },
  label: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 12,
    fontWeight: "bold",
    color: "#64748b",
  },
  separator: {
    height: 1,
    backgroundColor: "#e2e8f0",
    marginVertical: 4,
  },
});