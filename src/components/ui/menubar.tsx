import * as React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  ScrollView,
} from "react-native";
import { Check, ChevronRight, Circle } from "lucide-react-native";

const MenubarContext = React.createContext<any>(null);

/**
 * Root Menubar Container
 */
function Menubar({ children, style }: any) {
  const [activeMenu, setActiveMenu] = React.useState<string | null>(null);

  return (
    <MenubarContext.Provider value={{ activeMenu, setActiveMenu }}>
      <View style={[styles.menubar, style]}>{children}</View>
    </MenubarContext.Provider>
  );
}

function MenubarMenu({ value, children }: any) {
  return <View>{children}</View>;
}

/**
 * The Button on the bar
 */
function MenubarTrigger({ children, value, style }: any) {
  const { setActiveMenu } = React.useContext(MenubarContext);
  return (
    <TouchableOpacity
      onPress={() => setActiveMenu(value)}
      style={[styles.trigger, style]}
    >
      <Text style={styles.triggerText}>{children}</Text>
    </TouchableOpacity>
  );
}

/**
 * The Floating Menu Content
 */
function MenubarContent({ children, value }: any) {
  const { activeMenu, setActiveMenu } = React.useContext(MenubarContext);
  const isOpen = activeMenu === value;

  return (
    <Modal transparent visible={isOpen} animationType="fade">
      <TouchableWithoutFeedback onPress={() => setActiveMenu(null)}>
        <View style={styles.overlay}>
          <View style={styles.content}>
            <ScrollView bounces={false}>{children}</ScrollView>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

function MenubarItem({ children, onPress, variant = "default" }: any) {
  const { setActiveMenu } = React.useContext(MenubarContext);

  const handlePress = () => {
    setActiveMenu(null);
    if (onPress) onPress();
  };

  return (
    <TouchableOpacity style={styles.item} onPress={handlePress}>
      <Text style={[styles.itemText, variant === "destructive" && styles.destructiveText]}>
        {children}
      </Text>
    </TouchableOpacity>
  );
}

function MenubarSeparator() {
  return <View style={styles.separator} />;
}

const styles = StyleSheet.create({
  menubar: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 8,
    padding: 4,
    height: 44,
    alignItems: "center",
  },
  trigger: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  triggerText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#0f172a",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    width: "80%",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  item: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  itemText: {
    fontSize: 15,
    color: "#0f172a",
  },
  destructiveText: {
    color: "#ef4444",
  },
  separator: {
    height: 1,
    backgroundColor: "#e2e8f0",
    marginVertical: 4,
  },
});

export { Menubar, MenubarMenu, MenubarTrigger, MenubarContent, MenubarItem, MenubarSeparator };