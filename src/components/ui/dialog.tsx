"use client";

import * as React from "react";
import { Platform, View, Text, Modal, TouchableOpacity, StyleSheet } from "react-native";

// Platform-aware Icons and Primitives
let DialogPrimitive: any = null;
let XIcon: any = null;

if (Platform.OS === "web") {
  try {
    DialogPrimitive = require("@radix-ui/react-dialog");
    XIcon = require("lucide-react").X;
  } catch {
    DialogPrimitive = null;
  }
}

// Fallback for Native Icons
if (!XIcon) {
  try {
    XIcon = require("lucide-react-native").X;
  } catch {
    XIcon = ({ size = 16, color = "#000" }: any) => <Text style={{ fontSize: size, color }}>×</Text>;
  }
}

import { cn } from "./utils";

// --- NATIVE IMPLEMENTATIONS ---
const DialogContext = React.createContext<any>(null);

function NativeDialog({ open: openProp, defaultOpen, onOpenChange, children }: any) {
  const [openInternal, setOpenInternal] = React.useState(!!defaultOpen);
  const isControlled = openProp !== undefined;
  const open = isControlled ? openProp : openInternal;

  const setOpen = (next: boolean) => {
    if (!isControlled) setOpenInternal(next);
    if (typeof onOpenChange === "function") onOpenChange(next);
  };

  return (
    <DialogContext.Provider value={{ open, setOpen }}>
      {children}
    </DialogContext.Provider>
  );
}

const DialogNativeTrigger = ({ children, style, ...props }: any) => {
  const ctx = React.useContext(DialogContext);
  return (
    <TouchableOpacity onPress={() => ctx.setOpen(!ctx.open)} style={style} {...props}>
      {children}
    </TouchableOpacity>
  );
};

const DialogNativeClose = ({ children, style, ...props }: any) => {
  const ctx = React.useContext(DialogContext);
  return (
    <TouchableOpacity accessibilityRole="button" onPress={() => ctx.setOpen(false)} style={style} {...props}>
      {children}
    </TouchableOpacity>
  );
};

function DialogNativeContent({ children, style, ...props }: any) {
  const ctx = React.useContext(DialogContext);
  if (!ctx.open) return null;
  return (
    <Modal visible={!!ctx.open} transparent animationType="fade" onRequestClose={() => ctx.setOpen(false)}>
      <View style={nativeStyles.modalRoot}>
        <View style={nativeStyles.overlay} />
        <View style={[nativeStyles.content, style]} {...props}>
          {children}
          <DialogNativeClose style={nativeStyles.closeButton}>
            <XIcon size={18} color="#374151" />
          </DialogNativeClose>
        </View>
      </View>
    </Modal>
  );
}

const DialogNativeHeader = ({ children, style }: any) => <View style={[nativeStyles.header, style]}>{children}</View>;
const DialogNativeFooter = ({ children, style }: any) => <View style={[nativeStyles.footer, style]}>{children}</View>;
const DialogNativeTitle = ({ children, style }: any) => <Text style={[nativeStyles.title, style]}>{children}</Text>;
const DialogNativeDescription = ({ children, style }: any) => <Text style={[nativeStyles.description, style]}>{children}</Text>;
const DialogNativePortal = ({ children }: any) => <>{children}</>;

const nativeStyles = StyleSheet.create({
  modalRoot: { flex: 1, justifyContent: "center", alignItems: "center" },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.5)" },
  content: { backgroundColor: "#fff", padding: 24, borderRadius: 16, minWidth: 300, maxWidth: "90%", elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8 },
  closeButton: { position: "absolute", top: 12, right: 12 },
  header: { marginBottom: 16 },
  footer: { marginTop: 16, flexDirection: "row", justifyContent: "flex-end", gap: 10 },
  title: { fontSize: 20, fontWeight: "600", color: '#111827' },
  description: { color: "#6b7280", fontSize: 14, marginTop: 4 },
});

// --- EXPORTS ---
const Dialog = Platform.OS === "web" && DialogPrimitive ? DialogPrimitive.Root : NativeDialog;
const DialogTrigger = Platform.OS === "web" && DialogPrimitive ? DialogPrimitive.Trigger : DialogNativeTrigger;
const DialogClose = Platform.OS === "web" && DialogPrimitive ? DialogPrimitive.Close : DialogNativeClose;
const DialogContent = Platform.OS === "web" && DialogPrimitive ? DialogPrimitive.Content : DialogNativeContent;
const DialogHeader = Platform.OS === "web" && DialogPrimitive ? (props: any) => <div {...props} /> : DialogNativeHeader;
const DialogFooter = Platform.OS === "web" && DialogPrimitive ? (props: any) => <div {...props} /> : DialogNativeFooter;
const DialogTitle = Platform.OS === "web" && DialogPrimitive ? DialogPrimitive.Title : DialogNativeTitle;
const DialogDescription = Platform.OS === "web" && DialogPrimitive ? DialogPrimitive.Description : DialogNativeDescription;
const DialogPortal = Platform.OS === "web" && DialogPrimitive ? DialogPrimitive.Portal : DialogNativePortal;

export {
  Dialog,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogPortal,
};