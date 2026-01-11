import * as React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle, TextStyle } from "react-native";
import { ChevronRight, MoreHorizontal } from "lucide-react-native";

function Breadcrumb({ style, ...props }: { children: React.ReactNode; style?: ViewStyle }) {
  return <View style={style} {...props} />;
}

function BreadcrumbList({ style, ...props }: { children: React.ReactNode; style?: ViewStyle }) {
  return (
    <View
      style={[styles.list, style]}
      {...props}
    />
  );
}

function BreadcrumbItem({ style, ...props }: { children: React.ReactNode; style?: ViewStyle }) {
  return (
    <View
      style={[styles.item, style]}
      {...props}
    />
  );
}

function BreadcrumbLink({
  onPress,
  children,
  style,
  textStyle,
}: {
  onPress?: () => void;
  children: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}) {
  return (
    <TouchableOpacity onPress={onPress} style={style} activeOpacity={0.7}>
      <Text style={[styles.linkText, textStyle]}>{children}</Text>
    </TouchableOpacity>
  );
}

function BreadcrumbPage({ children, style, textStyle }: { children: React.ReactNode; style?: ViewStyle; textStyle?: TextStyle }) {
  return (
    <View style={style}>
      <Text style={[styles.pageText, textStyle]}>{children}</Text>
    </View>
  );
}

function BreadcrumbSeparator({
  children,
  style,
}: {
  children?: React.ReactNode;
  style?: ViewStyle;
}) {
  return (
    <View style={[styles.separator, style]}>
      {children ?? <ChevronRight size={14} color="#94a3b8" />}
    </View>
  );
}

function BreadcrumbEllipsis({ style }: { style?: ViewStyle }) {
  return (
    <View style={[styles.ellipsis, style]}>
      <MoreHorizontal size={16} color="#64748b" />
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
  },
  linkText: {
    fontSize: 14,
    color: "#64748b", // muted-foreground
  },
  pageText: {
    fontSize: 14,
    fontWeight: "400",
    color: "#0f172a", // foreground
  },
  separator: {
    marginHorizontal: 8,
  },
  ellipsis: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
});

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
};