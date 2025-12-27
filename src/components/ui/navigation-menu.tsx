import * as React from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Animated, 
  LayoutAnimation, 
  Platform,
  ViewStyle
} from "react-native";
import { ChevronDown } from "lucide-react-native";

// Context to manage which menu item is expanded
const NavigationContext = React.createContext<{
  activeItem: string | null;
  setActiveItem: (id: string | null) => void;
}>({ activeItem: null, setActiveItem: () => {} });

function NavigationMenu({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  const [activeItem, setActiveItem] = React.useState<string | null>(null);

  return (
    <NavigationContext.Provider value={{ activeItem, setActiveItem }}>
      <View style={[styles.menuRoot, style]}>{children}</View>
    </NavigationContext.Provider>
  );
}

function NavigationMenuList({ children }: { children: React.ReactNode }) {
  return <View style={styles.list}>{children}</View>;
}

function NavigationMenuItem({ id, children }: { id: string; children: React.ReactNode }) {
  return <View style={styles.item}>{children}</View>;
}

function NavigationMenuTrigger({ id, children }: { id: string; children: React.ReactNode }) {
  const { activeItem, setActiveItem } = React.useContext(NavigationContext);
  const isOpen = activeItem === id;

  const toggle = () => {
    // Smooth layout transition for mobile
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setActiveItem(isOpen ? null : id);
  };

  return (
    <TouchableOpacity onPress={toggle} style={styles.trigger} activeOpacity={0.7}>
      <Text style={styles.triggerText}>{children}</Text>
      <View style={{ transform: [{ rotate: isOpen ? "180deg" : "0deg" }] }}>
        <ChevronDown size={16} color="#64748b" />
      </View>
    </TouchableOpacity>
  );
}

function NavigationMenuContent({ id, children }: { id: string; children: React.ReactNode }) {
  const { activeItem } = React.useContext(NavigationContext);
  if (activeItem !== id) return null;

  return (
    <View style={styles.content}>
      {children}
    </View>
  );
}

function NavigationMenuLink({ children, onPress }: { children: React.ReactNode; onPress?: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.link} activeOpacity={0.6}>
      <Text style={styles.linkText}>{children}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  menuRoot: {
    width: "100%",
    backgroundColor: "#fff",
  },
  list: {
    flexDirection: "column",
  },
  item: {
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  trigger: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  triggerText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#0f172a",
  },
  content: {
    backgroundColor: "#f8fafc",
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  link: {
    paddingVertical: 10,
  },
  linkText: {
    fontSize: 14,
    color: "#64748b",
  }
});

export { 
  NavigationMenu, 
  NavigationMenuList, 
  NavigationMenuItem, 
  NavigationMenuTrigger, 
  NavigationMenuContent, 
  NavigationMenuLink 
};