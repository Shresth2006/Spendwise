import * as React from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ViewStyle,
  Pressable,
} from "react-native";
import { X } from "lucide-react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const SheetContext = React.createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
}>({ open: false, setOpen: () => {} });

function Sheet({ open: openProp, onOpenChange, children }: any) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const open = openProp !== undefined ? openProp : internalOpen;
  const setOpen = onOpenChange !== undefined ? onOpenChange : setInternalOpen;

  return (
    <SheetContext.Provider value={{ open, setOpen }}>
      {children}
    </SheetContext.Provider>
  );
}

function SheetTrigger({ children }: { children: React.ReactNode }) {
  const { setOpen } = React.useContext(SheetContext);
  return (
    <TouchableOpacity onPress={() => setOpen(true)} activeOpacity={0.7}>
      {children}
    </TouchableOpacity>
  );
}

function SheetClose({ children }: { children: React.ReactNode }) {
  const { setOpen } = React.useContext(SheetContext);
  return (
    <TouchableOpacity onPress={() => setOpen(false)} activeOpacity={0.7}>
      {children}
    </TouchableOpacity>
  );
}

function SheetContent({
  children,
  side = "right",
  style,
}: {
  children: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  style?: ViewStyle;
}) {
  const { open, setOpen } = React.useContext(SheetContext);

  // Map side to native animation types
  // Note: Native Modal only supports 'slide' (bottom-up) or 'fade'.
  // For 'left' or 'right', we use 'fade' or custom animations.
  const animationType = side === "bottom" ? "slide" : "fade";

  return (
    <Modal
      visible={open}
      transparent
      animationType={animationType}
      onRequestClose={() => setOpen(false)}
    >
      <View style={styles.root}>
        <Pressable style={styles.overlay} onPress={() => setOpen(false)} />
        <View style={[styles.content, styles[side], style]}>
          {children}
          <TouchableOpacity
            onPress={() => setOpen(false)}
            style={styles.closeBtn}
          >
            <X size={20} color="#64748b" />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const SheetHeader = ({ children }: any) => <View style={styles.header}>{children}</View>;
const SheetFooter = ({ children }: any) => <View style={styles.footer}>{children}</View>;
const SheetTitle = ({ children }: any) => <Text style={styles.title}>{children}</Text>;
const SheetDescription = ({ children }: any) => <Text style={styles.description}>{children}</Text>;

const styles = StyleSheet.create({
  root: { flex: 1 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  content: {
    position: "absolute",
    backgroundColor: "white",
    padding: 20,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  right: { top: 0, bottom: 0, right: 0, width: SCREEN_WIDTH * 0.8 },
  left: { top: 0, bottom: 0, left: 0, width: SCREEN_WIDTH * 0.8 },
  top: { top: 0, left: 0, right: 0, height: SCREEN_HEIGHT * 0.3 },
  bottom: { bottom: 0, left: 0, right: 0, height: SCREEN_HEIGHT * 0.4, borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  closeBtn: { position: "absolute", top: 16, right: 16, padding: 4 },
  header: { marginBottom: 16 },
  footer: { marginTop: "auto", paddingTop: 16 },
  title: { fontSize: 18, fontWeight: "600", color: "#0f172a" },
  description: { fontSize: 14, color: "#64748b", marginTop: 4 },
});

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
};