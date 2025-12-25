import * as React from "react";
import {
  View,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
} from "react-native";

const PopoverContext = React.createContext<any>(null);

function Popover({ children }: { children: React.ReactNode }) {
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
    <PopoverContext.Provider value={{ open, setOpen, toggle, triggerRef, triggerLayout }}>
      <View>{children}</View>
    </PopoverContext.Provider>
  );
}

function PopoverTrigger({ children }: { children: React.ReactNode }) {
  const { toggle, triggerRef } = React.useContext(PopoverContext);
  return (
    <TouchableOpacity ref={triggerRef} onPress={toggle} activeOpacity={0.7}>
      {children}
    </TouchableOpacity>
  );
}

function PopoverContent({ children, style }: any) {
  const { open, setOpen, triggerLayout } = React.useContext(PopoverContext);

  if (!open || !triggerLayout) return null;

  const popoverStyle = {
    top: triggerLayout.y + triggerLayout.height + 8,
    // Align center logic
    left: triggerLayout.x + (triggerLayout.width / 2) - 140, 
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

function PopoverAnchor({ children }: { children: React.ReactNode }) {
  return <View>{children}</View>;
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "transparent",
  },
  content: {
    position: "absolute",
    width: 280, // w-72 equivalent
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
});

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor };