"use client";

import * as React from "react";
import { Platform, TouchableOpacity, View, StyleSheet } from "react-native";

// Platform-aware imports: Radix (web) and lucide for web; use native fallbacks for React Native
let CheckboxPrimitive: any = null;
let CheckIcon: any = null;

if (Platform.OS === "web") {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    CheckboxPrimitive = require("@radix-ui/react-checkbox");
  } catch {
    CheckboxPrimitive = null;
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    CheckIcon = require("lucide-react").Check;
  } catch {
    CheckIcon = null;
  }
}

// Provide native-safe fallbacks when not running on web or when packages are missing
if (!CheckboxPrimitive) {
  CheckboxPrimitive = {
    Root: ({ checked, onCheckedChange, children, style, ...rest }: any) => (
      <TouchableOpacity
        accessibilityRole="checkbox"
        accessibilityState={{ checked: !!checked }}
        onPress={() => onCheckedChange && onCheckedChange(!checked)}
        style={style}
        {...rest}
      >
        {children}
      </TouchableOpacity>
    ),
    Indicator: ({ children, style, ...rest }: any) => (
      <View style={style} {...rest}>
        {children}
      </View>
    ),
  };
}

if (!CheckIcon) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    CheckIcon = require("lucide-react-native").Check;
  } catch {
    // Final fallback: simple square to show a checked state
    CheckIcon = ({ size = 14, color = "#000" }: any) => (
      <View style={{ width: size, height: size, backgroundColor: color, borderRadius: 2 }} />
    );
  }
}

import { cn } from "./utils";

function Checkbox({ className, ...props }: { className?: string } & Record<string, any>) {
  const webClass = cn(
    "peer border bg-input-background dark:bg-input/30 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:data-[state=checked]:bg-primary data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
    className,
  );

  const indicatorClassWeb = "flex items-center justify-center text-current transition-none";

  const rootProps: any = Platform.OS === "web" ? { className: webClass } : { style: styles.root };
  const indicatorProps: any = Platform.OS === "web" ? { className: indicatorClassWeb } : { style: styles.indicator };

  // Only add data-slot attributes on web (they're invalid on native Text/Touchable components)
  const dataSlotRoot = Platform.OS === "web" ? ({ "data-slot": "checkbox" } as any) : {};
  const dataSlotIndicator = Platform.OS === "web" ? ({ "data-slot": "checkbox-indicator" } as any) : {};

  return (
    <CheckboxPrimitive.Root {...dataSlotRoot} {...rootProps} {...props}>
      <CheckboxPrimitive.Indicator {...dataSlotIndicator} {...indicatorProps}>
        {Platform.OS === "web" ? (
          <CheckIcon className="size-3.5" />
        ) : (
          <CheckIcon size={14} color="#fff" />
        )}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

const styles = StyleSheet.create({
  root: {
    width: 20,
    height: 20,
    borderRadius: 4,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
  },
  indicator: {
    alignItems: "center",
    justifyContent: "center",
  },
});

export { Checkbox };
