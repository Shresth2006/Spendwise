import React, { createContext, useContext, useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";

// Context to manage visibility state across sub-components
const AlertDialogContext = createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
}>({ open: false, setOpen: () => {} });

function AlertDialog({ children, open: controlledOpen, onOpenChange }: any) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = onOpenChange !== undefined ? onOpenChange : setInternalOpen;

  return (
    <AlertDialogContext.Provider value={{ open, setOpen }}>
      {children}
    </AlertDialogContext.Provider>
  );
}

function AlertDialogTrigger({ children, asChild }: any) {
  const { setOpen } = useContext(AlertDialogContext);
  return (
    <TouchableOpacity onPress={() => setOpen(true)} activeOpacity={0.7}>
      {children}
    </TouchableOpacity>
  );
}

// Portals are handled automatically by RN Modal
function AlertDialogPortal({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

function AlertDialogContent({ children, style }: any) {
  const { open, setOpen } = useContext(AlertDialogContext);

  return (
    <Modal
      transparent
      visible={open}
      animationType="fade"
      onRequestClose={() => setOpen(false)}
    >
      <TouchableWithoutFeedback onPress={() => setOpen(false)}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            <View style={[styles.content, style]}>
              {children}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

function AlertDialogHeader({ children, style }: any) {
  return <View style={[styles.header, style]}>{children}</View>;
}

function AlertDialogFooter({ children, style }: any) {
  return <View style={[styles.footer, style]}>{children}</View>;
}

function AlertDialogTitle({ children, style }: any) {
  return <Text style={[styles.title, style]}>{children}</Text>;
}

function AlertDialogDescription({ children, style }: any) {
  return <Text style={[styles.description, style]}>{children}</Text>;
}

function AlertDialogAction({ children, onPress, style }: any) {
  const { setOpen } = useContext(AlertDialogContext);
  const handlePress = () => {
    if (onPress) onPress();
    setOpen(false);
  };

  return (
    <TouchableOpacity style={[styles.actionBtn, style]} onPress={handlePress}>
      <Text style={styles.actionText}>{children}</Text>
    </TouchableOpacity>
  );
}

function AlertDialogCancel({ children, style }: any) {
  const { setOpen } = useContext(AlertDialogContext);
  return (
    <TouchableOpacity 
      style={[styles.cancelBtn, style]} 
      onPress={() => setOpen(false)}
    >
      <Text style={styles.cancelText}>{children}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  content: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "white",
    borderRadius: 16,
    padding: 24,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  header: {
    marginBottom: 16,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 20,
  },
  actionBtn: {
    backgroundColor: "#9333ea", // Matches your purple theme
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  actionText: {
    color: "white",
    fontWeight: "600",
  },
  cancelBtn: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  cancelText: {
    color: "#374151",
    fontWeight: "600",
  },
});

export {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogPortal
};