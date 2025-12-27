import * as React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  ScrollView,
  Keyboard,
  Platform,
} from "react-native";
import { PanelLeft } from "lucide-react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// Constants
const SIDEBAR_WIDTH = 280;
const COLLAPSED_WIDTH = 64;

type SidebarContextProps = {
  state: "expanded" | "collapsed";
  open: boolean;
  setOpen: (open: boolean) => void;
  toggleSidebar: () => void;
};

const SidebarContext = React.createContext<SidebarContextProps | null>(null);

export function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) throw new Error("useSidebar must be used within SidebarProvider");
  return context;
}

export function SidebarProvider({ children, defaultOpen = true }: any) {
  const [open, setOpen] = React.useState(defaultOpen);
  const translateX = React.useRef(new Animated.Value(defaultOpen ? 0 : -SIDEBAR_WIDTH)).current;

  const toggleSidebar = React.useCallback(() => {
    const toValue = open ? -SIDEBAR_WIDTH : 0;
    setOpen(!open);
    Animated.spring(translateX, {
      toValue,
      useNativeDriver: true,
      friction: 8,
    }).start();
  }, [open]);

  const state = open ? "expanded" : "collapsed";

  return (
    <SidebarContext.Provider value={{ state, open, setOpen, toggleSidebar }}>
      <View style={styles.providerContainer}>
        {children}
      </View>
    </SidebarContext.Provider>
  );
}

export function Sidebar({ children }: { children: React.ReactNode }) {
  const { open, toggleSidebar } = useSidebar();
  
  // Logic for the backdrop (overlay) when sidebar is open on mobile
  return (
    <>
      {open && (
        <TouchableOpacity 
          style={styles.overlay} 
          activeOpacity={1} 
          onPress={toggleSidebar} 
        />
      )}
      <View style={[styles.sidebar, !open && styles.sidebarCollapsed]}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          {children}
        </ScrollView>
      </View>
    </>
  );
}

export function SidebarTrigger() {
  const { toggleSidebar } = useSidebar();
  return (
    <TouchableOpacity onPress={toggleSidebar} style={styles.trigger}>
      <PanelLeft size={24} color="#0f172a" />
    </TouchableOpacity>
  );
}

export function SidebarContent({ children }: any) {
  return <View style={styles.content}>{children}</View>;
}

export function SidebarGroup({ children }: any) {
  return <View style={styles.group}>{children}</View>;
}

export function SidebarMenu({ children }: any) {
  return <View style={styles.menu}>{children}</View>;
}

export function SidebarMenuItem({ children }: any) {
  return <View style={styles.menuItem}>{children}</View>;
}

export function SidebarMenuButton({ children, isActive, onPress }: any) {
  return (
    <TouchableOpacity 
      onPress={onPress}
      style={[styles.menuButton, isActive && styles.menuButtonActive]}
    >
      <View style={styles.menuButtonInner}>
        {children}
      </View>
    </TouchableOpacity>
  );
}

export function SidebarHeader({ children }: any) {
  return <View style={styles.header}>{children}</View>;
}

export function SidebarFooter({ children }: any) {
  return <View style={styles.footer}>{children}</View>;
}

const styles = StyleSheet.create({
  providerContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: SIDEBAR_WIDTH,
    backgroundColor: '#fff',
    borderRightWidth: 1,
    borderRightColor: '#e2e8f0',
    zIndex: 100,
    elevation: 5,
  },
  sidebarCollapsed: {
    width: 0,
    display: 'none',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    zIndex: 99,
  },
  trigger: {
    padding: 10,
    borderRadius: 8,
  },
  content: {
    flex: 1,
    padding: 12,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  group: {
    marginBottom: 20,
  },
  menu: {
    gap: 4,
  },
  menuItem: {
    width: '100%',
  },
  menuButton: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: 'transparent',
  },
  menuButtonActive: {
    backgroundColor: '#f1f5f9',
  },
  menuButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
});