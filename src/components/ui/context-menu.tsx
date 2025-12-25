"use client";

import * as React from "react";
import { Platform, View, Text, TouchableOpacity, StyleSheet } from "react-native";

// Platform-aware imports for Radix & lucide
let ContextMenuPrimitive: any = null;
let CheckIcon: any = null;
let ChevronRightIcon: any = null;
let CircleIcon: any = null;

if (Platform.OS === "web") {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    ContextMenuPrimitive = require("@radix-ui/react-context-menu");
  } catch {
    ContextMenuPrimitive = null;
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const icons = require("lucide-react");
    CheckIcon = icons.Check;
    ChevronRightIcon = icons.ChevronRight;
    CircleIcon = icons.Circle;
  } catch {
    CheckIcon = ChevronRightIcon = CircleIcon = null;
  }
}

// Native fallbacks for icons
if (!CheckIcon) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    CheckIcon = require("lucide-react-native").CheckIcon;
  } catch {
    CheckIcon = ({ size = 16, color = "#000" }: any) => (
      <View style={{ width: size, height: size, backgroundColor: color, borderRadius: 2 }} />
    );
  }
}

if (!ChevronRightIcon) {
  ChevronRightIcon = ({ size = 16, color = "#000" }: any) => (
    <Text style={{ fontSize: size, color }}>{">"}</Text>
  );
}

if (!CircleIcon) {
  CircleIcon = ({ size = 12, color = "#000" }: any) => (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: color }} />
  );
}

import { cn } from "./utils";

// Declare all exported symbols first and assign per-platform
let ContextMenu: any;
let ContextMenuTrigger: any;
let ContextMenuContent: any;
let ContextMenuItem: any;
let ContextMenuCheckboxItem: any;
let ContextMenuRadioItem: any;
let ContextMenuLabel: any;
let ContextMenuSeparator: any;
let ContextMenuShortcut: any;
let ContextMenuGroup: any;
let ContextMenuPortal: any;
let ContextMenuSub: any;
let ContextMenuSubContent: any;
let ContextMenuSubTrigger: any;
let ContextMenuRadioGroup: any;

if (Platform.OS === "web" && ContextMenuPrimitive) {
  ContextMenu = (props: any) => <ContextMenuPrimitive.Root data-slot="context-menu" {...props} />;
  ContextMenuTrigger = (props: any) => <ContextMenuPrimitive.Trigger data-slot="context-menu-trigger" {...props} />;
  ContextMenuGroup = (props: any) => <ContextMenuPrimitive.Group data-slot="context-menu-group" {...props} />;
  ContextMenuPortal = (props: any) => <ContextMenuPrimitive.Portal data-slot="context-menu-portal" {...props} />;
  ContextMenuSub = (props: any) => <ContextMenuPrimitive.Sub data-slot="context-menu-sub" {...props} />;
  ContextMenuRadioGroup = (props: any) => <ContextMenuPrimitive.RadioGroup data-slot="context-menu-radio-group" {...props} />;

  ContextMenuSubTrigger = ({ className, inset, children, ...props }: any) => (
    <ContextMenuPrimitive.SubTrigger
      data-slot="context-menu-sub-trigger"
      data-inset={inset}
      className={cn(
        "focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      {children}
      <ChevronRightIcon className="ml-auto" />
    </ContextMenuPrimitive.SubTrigger>
  );

  ContextMenuSubContent = (props: any) => (
    <ContextMenuPrimitive.SubContent
      data-slot="context-menu-sub-content"
      className={cn(
        "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[8rem] origin-(--radix-context-menu-content-transform-origin) overflow-hidden rounded-md border p-1 shadow-lg",
        (props.className as any),
      )}
      {...props}
    />
  );

  ContextMenuContent = (props: any) => (
    <ContextMenuPrimitive.Portal>
      <ContextMenuPrimitive.Content
        data-slot="context-menu-content"
        className={cn(
          "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 max-h-(--radix-context-menu-content-available-height) min-w-[8rem] origin-(--radix-context-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border p-1 shadow-md",
          (props.className as any),
        )}
        {...props}
      />
    </ContextMenuPrimitive.Portal>
  );

  ContextMenuItem = ({ className, inset, variant = "default", ...props }: any) => (
    <ContextMenuPrimitive.Item
      data-slot="context-menu-item"
      data-inset={inset}
      data-variant={variant}
      className={cn(
        "focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    />
  );

  ContextMenuCheckboxItem = ({ className, children, checked, ...props }: any) => (
    <ContextMenuPrimitive.CheckboxItem
      data-slot="context-menu-checkbox-item"
      className={cn(
        "focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      checked={checked}
      {...props}
    >
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        <ContextMenuPrimitive.ItemIndicator>
          <CheckIcon className="size-4" />
        </ContextMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </ContextMenuPrimitive.CheckboxItem>
  );

  ContextMenuRadioItem = ({ className, children, ...props }: any) => (
    <ContextMenuPrimitive.RadioItem
      data-slot="context-menu-radio-item"
      className={cn(
        "focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        <ContextMenuPrimitive.ItemIndicator>
          <CircleIcon className="size-2 fill-current" />
        </ContextMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </ContextMenuPrimitive.RadioItem>
  );

  ContextMenuLabel = ({ className, inset, ...props }: any) => (
    <ContextMenuPrimitive.Label
      data-slot="context-menu-label"
      data-inset={inset}
      className={cn(
        "text-foreground px-2 py-1.5 text-sm font-medium data-[inset]:pl-8",
        className,
      )}
      {...props}
    />
  );

  ContextMenuSeparator = ({ className, ...props }: any) => (
    <ContextMenuPrimitive.Separator data-slot="context-menu-separator" className={cn("bg-border -mx-1 my-1 h-px", className)} {...props} />
  );

  ContextMenuShortcut = ({ className, ...props }: any) => (
    <span data-slot="context-menu-shortcut" className={cn("text-muted-foreground ml-auto text-xs tracking-widest", className)} {...props} />
  );
} else {
  // Native fallbacks
  const NativeContext = React.createContext<any>({ open: false, setOpen: (_: boolean) => {} });

  ContextMenu = ({ children, ...props }: any) => {
    const [open, setOpen] = React.useState(false);
    return <NativeContext.Provider value={{ open, setOpen }}>{children}</NativeContext.Provider>;
  };

  ContextMenuTrigger = ({ children, onPress, ...props }: any) => {
    const ctx = React.useContext(NativeContext);
    const handlePress = (e: any) => {
      ctx.setOpen(!ctx.open);
      if (typeof onPress === "function") onPress(e);
    };
    return (
      <TouchableOpacity onPress={handlePress} {...props}>
        {children}
      </TouchableOpacity>
    );
  };

  ContextMenuContent = ({ children, style, ...props }: any) => {
    const ctx = React.useContext(NativeContext);
    if (!ctx.open) return null;
    return (
      <View style={[styles.content, style]} {...props}>
        {children}
      </View>
    );
  };

  ContextMenuGroup = ({ children, ...props }: any) => {
    return <View {...props}>{children}</View>;
  };

  ContextMenuPortal = ({ children, ...props }: any) => {
    return <View {...props}>{children}</View>;
  };

  ContextMenuSub = ({ children, ...props }: any) => {
    return <View {...props}>{children}</View>;
  };

  ContextMenuSubTrigger = ({ children, onPress, ...props }: any) => {
    return (
      <TouchableOpacity onPress={onPress} {...props}>
        <View style={styles.subTriggerRow}>
          <View style={{ flex: 1 }}>{children}</View>
          <ChevronRightIcon size={16} color="#374151" />
        </View>
      </TouchableOpacity>
    );
  };

  ContextMenuSubContent = ({ children, style, ...props }: any) => {
    return <View style={[styles.subContent, style]} {...props}>{children}</View>;
  };

  ContextMenuRadioGroup = ({ children, ...props }: any) => {
    return <View {...props}>{children}</View>;
  };

  ContextMenuItem = ({ children, style, ...props }: any) => {
    return (
      <TouchableOpacity activeOpacity={0.7} style={[styles.item, style]} {...props}>
        <Text>{children}</Text>
      </TouchableOpacity>
    );
  };

  ContextMenuCheckboxItem = ({ children, checked, style, ...props }: any) => {
    return (
      <TouchableOpacity activeOpacity={0.7} style={[styles.item, style]} {...props}>
        <View style={styles.leftIcon}>{checked ? <CheckIcon size={16} color="#374151" /> : null}</View>
        <Text>{children}</Text>
      </TouchableOpacity>
    );
  };

  ContextMenuRadioItem = ({ children, selected, style, ...props }: any) => {
    return (
      <TouchableOpacity activeOpacity={0.7} style={[styles.item, style]} {...props}>
        <View style={styles.leftIcon}>{selected ? <CircleIcon size={12} color="#374151" /> : null}</View>
        <Text>{children}</Text>
      </TouchableOpacity>
    );
  };

  ContextMenuLabel = ({ children, style, ...props }: any) => {
    return <Text style={[styles.label, style]} {...props}>{children}</Text>;
  };

  ContextMenuSeparator = ({ style, ...props }: any) => {
    return <View style={[styles.separator, style]} {...props} />;
  };

  ContextMenuShortcut = ({ children, style, ...props }: any) => {
    return <Text style={[styles.shortcut, style]} {...props}>{children}</Text>;
  };

  const styles = StyleSheet.create({
    content: { padding: 8, backgroundColor: "#fff", borderRadius: 8, shadowColor: "#000", shadowOpacity: 0.08, shadowOffset: { width: 0, height: 4 }, shadowRadius: 6 },
    subContent: { padding: 6, backgroundColor: "#fff" },
    subTriggerRow: { flexDirection: "row", alignItems: "center", paddingVertical: 8 },
    item: { paddingVertical: 10, paddingHorizontal: 8, flexDirection: "row", alignItems: "center" },
    leftIcon: { width: 24, alignItems: "center", justifyContent: "center", marginRight: 8 },
    label: { paddingVertical: 6, paddingHorizontal: 8, fontWeight: "500" as any },
    separator: { height: 1, backgroundColor: "#E5E7EB", marginVertical: 6 },
    shortcut: { marginLeft: "auto", color: "#6b7280" },
  });

  }

// export the assigned symbols
export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuRadioGroup,
};
