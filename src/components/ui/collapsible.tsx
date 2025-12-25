"use client";

import * as React from "react";
import { Platform, View, TouchableOpacity, StyleSheet } from "react-native";

// Platform-aware import: use Radix on web, native fallback on mobile
let CollapsiblePrimitive: any = null;

if (Platform.OS === "web") {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    CollapsiblePrimitive = require("@radix-ui/react-collapsible");
  } catch {
    CollapsiblePrimitive = null;
  }
}

const CollapsibleContext = React.createContext<any>(null);

function Collapsible({ children, open, defaultOpen, onOpenChange, ...props }: any) {
  // Controlled vs uncontrolled
  const [internalOpen, setInternalOpen] = React.useState(!!defaultOpen);
  const isControlled = open !== undefined;
  const valueOpen = isControlled ? open : internalOpen;
  const setOpen = (next: boolean) => {
    if (!isControlled) setInternalOpen(next);
    if (typeof onOpenChange === "function") onOpenChange(next);
  };

  if (Platform.OS === "web" && CollapsiblePrimitive) {
    return (
      <CollapsiblePrimitive.Root data-slot="collapsible" open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange} {...props}>
        {children}
      </CollapsiblePrimitive.Root>
    );
  }

  return (
    <CollapsibleContext.Provider value={{ open: valueOpen, setOpen }}>
      <View {...props}>{children}</View>
    </CollapsibleContext.Provider>
  );
}

function CollapsibleTrigger({ children, onPress, ...props }: any) {
  const context = React.useContext(CollapsibleContext);

  if (Platform.OS === "web" && CollapsiblePrimitive) {
    return (
      <CollapsiblePrimitive.CollapsibleTrigger data-slot="collapsible-trigger" {...props}>
        {children}
      </CollapsiblePrimitive.CollapsibleTrigger>
    );
  }

  const handlePress = (e: any) => {
    if (context) {
      context.setOpen(!context.open);
    }
    if (typeof onPress === "function") onPress(e);
  };

  return (
    <TouchableOpacity accessibilityRole="button" onPress={handlePress} {...props}>
      {children}
    </TouchableOpacity>
  );
}

function CollapsibleContent({ children, style, ...props }: any) {
  const context = React.useContext(CollapsibleContext);

  if (Platform.OS === "web" && CollapsiblePrimitive) {
    return (
      <CollapsiblePrimitive.CollapsibleContent data-slot="collapsible-content" {...props}>
        {children}
      </CollapsiblePrimitive.CollapsibleContent>
    );
  }

  if (!context) return null;

  return context.open ? (
    <View style={[styles.content, style]} {...props}>
      {children}
    </View>
  ) : null;
}

const styles = StyleSheet.create({
  content: {
    // default native spacing; keep minimal to avoid changing layout
    paddingVertical: 8,
  },
});

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
