"use client";

import * as React from "react";
import { Platform, View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet } from "react-native";

// Platform-aware Command primitive and Search icon
let CommandPrimitive: any = null;
let SearchIcon: any = null;

if (Platform.OS === "web") {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    CommandPrimitive = require("cmdk");
  } catch {
    CommandPrimitive = null;
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    SearchIcon = require("lucide-react").Search;
  } catch {
    SearchIcon = null;
  }
}

import { cn } from "./utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./dialog";

function Command({ className, ...props }: any) {
  if (Platform.OS === "web" && CommandPrimitive) {
    return (
      <CommandPrimitive
        data-slot="command"
        className={cn(
          "bg-popover text-popover-foreground flex h-full w-full flex-col overflow-hidden rounded-md",
          className,
        )}
        {...props}
      />
    );
  }

  return (
    <View style={[styles.command, (props.style as any)]} {...props}>
      {props.children}
    </View>
  );
}

function CommandDialog({
  title = "Command Palette",
  description = "Search for a command to run...",
  children,
  ...props
}: any) {
  return (
    <Dialog {...props}>
      <DialogHeader className="sr-only">
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <DialogContent className="overflow-hidden p-0">
        <Command className="[&_[cmdk-group-heading]]:text-muted-foreground **:data-[slot=command-input-wrapper]:h-12 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group]]:px-2 [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  );
}

function CommandInput({ className, ...props }: any) {
  if (Platform.OS === "web" && CommandPrimitive) {
    return (
      <div
        data-slot="command-input-wrapper"
        className="flex h-9 items-center gap-2 border-b px-3"
      >
        {SearchIcon ? <SearchIcon className="size-4 shrink-0 opacity-50" /> : null}
        <CommandPrimitive.Input
          data-slot="command-input"
          className={cn(
            "placeholder:text-muted-foreground flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50",
            className,
          )}
          {...props}
        />
      </div>
    );
  }

  return (
    <View style={styles.inputWrapper}>
      {SearchIcon ? <SearchIcon size={16} color="#6b7280" /> : <Text style={styles.searchFallback}>🔎</Text>}
      <TextInput {...props} style={[styles.textInput, (props.style as any)]} placeholderTextColor="#9CA3AF" />
    </View>
  );
}

function CommandList({ className, ...props }: any) {
  if (Platform.OS === "web" && CommandPrimitive) {
    return (
      <CommandPrimitive.List
        data-slot="command-list"
        className={cn(
          "max-h-[300px] scroll-py-1 overflow-x-hidden overflow-y-auto",
          className,
        )}
        {...props}
      />
    );
  }

  return (
    <ScrollView {...props} style={[styles.list, (props.style as any)]} />
  );
}

function CommandEmpty({ ...props }: any) {
  if (Platform.OS === "web" && CommandPrimitive) {
    return (
      <CommandPrimitive.Empty data-slot="command-empty" className="py-6 text-center text-sm" {...props} />
    );
  }

  return <Text style={styles.empty} {...props} />;
}

function CommandGroup({ className, ...props }: any) {
  if (Platform.OS === "web" && CommandPrimitive) {
    return (
      <CommandPrimitive.Group
        data-slot="command-group"
        className={cn(
          "text-foreground [&_[cmdk-group-heading]]:text-muted-foreground overflow-hidden p-1 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium",
          className,
        )}
        {...props}
      />
    );
  }

  return <View style={[styles.group, (props.style as any)]} {...props} />;
}

function CommandSeparator({ className, ...props }: any) {
  if (Platform.OS === "web" && CommandPrimitive) {
    return <CommandPrimitive.Separator data-slot="command-separator" className={cn("bg-border -mx-1 h-px", className)} {...props} />;
  }

  return <View style={[styles.separator, (props.style as any)]} {...props} />;
}

function CommandItem({ className, ...props }: any) {
  if (Platform.OS === "web" && CommandPrimitive) {
    return (
      <CommandPrimitive.Item
        data-slot="command-item"
        className={cn(
          "data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
          className,
        )}
        {...props}
      />
    );
  }

  return (
    <TouchableOpacity activeOpacity={0.7} style={[styles.item, (props.style as any)]} {...props}>
      {props.children}
    </TouchableOpacity>
  );
}

function CommandShortcut({ className, ...props }: any) {
  if (Platform.OS === "web" && CommandPrimitive) {
    return (
      <span
        data-slot="command-shortcut"
        className={cn(
          "text-muted-foreground ml-auto text-xs tracking-widest",
          className,
        )}
        {...props}
      />
    );
  }

  return <Text style={[styles.shortcut, (props.style as any)]} {...props} />;
}

const styles = StyleSheet.create({
  command: {
    backgroundColor: "#fff",
    color: "#111827",
    width: "100%",
    height: "100%",
    borderRadius: 8,
    overflow: "hidden",
  },
  inputWrapper: { flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 12, paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: "#E5E7EB" },
  textInput: { flex: 1, height: 40, fontSize: 14, padding: 8 },
  searchFallback: { marginRight: 8, fontSize: 16 },
  list: { maxHeight: 300 },
  empty: { paddingVertical: 12, textAlign: "center", color: "#6b7280" },
  group: { padding: 8 },
  separator: { height: 1, backgroundColor: "#E5E7EB", marginVertical: 6 },
  item: { paddingVertical: 10, paddingHorizontal: 8 },
  shortcut: { color: "#6b7280", marginLeft: "auto", fontSize: 12, letterSpacing: 2 },
});

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
};
