import * as React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from "react-native";
import {
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
} from "lucide-react-native";

import { cn } from "./utils";
import { Button } from "./button";

function Pagination({ style, ...props }: { style?: ViewStyle; children: React.ReactNode }) {
  return (
    <View
      data-slot="pagination"
      style={[styles.pagination, style]}
      {...props}
    />
  );
}

function PaginationContent({ style, ...props }: { style?: ViewStyle; children: React.ReactNode }) {
  return (
    <View
      data-slot="pagination-content"
      style={[styles.content, style]}
      {...props}
    />
  );
}

function PaginationItem({ style, ...props }: { style?: ViewStyle; children: React.ReactNode }) {
  return <View data-slot="pagination-item" style={style} {...props} />;
}

type PaginationLinkProps = {
  isActive?: boolean;
  onPress?: () => void;
  children: React.ReactNode;
  style?: ViewStyle;
};

function PaginationLink({
  isActive,
  onPress,
  children,
  style,
}: PaginationLinkProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        styles.link,
        isActive ? styles.linkActive : styles.linkGhost,
        style,
      ]}
    >
      <View style={styles.linkInner}>
        {typeof children === "string" ? (
          <Text style={[styles.linkText, isActive && styles.linkTextActive]}>{children}</Text>
        ) : (
          children
        )}
      </View>
    </TouchableOpacity>
  );
}

function PaginationPrevious({ onPress, ...props }: any) {
  return (
    <PaginationLink
      onPress={onPress}
      style={styles.navButton}
      {...props}
    >
      <ChevronLeft size={18} color="#64748b" />
      <Text style={styles.navText}>Prev</Text>
    </PaginationLink>
  );
}

function PaginationNext({ onPress, ...props }: any) {
  return (
    <PaginationLink
      onPress={onPress}
      style={styles.navButton}
      {...props}
    >
      <Text style={styles.navText}>Next</Text>
      <ChevronRight size={18} color="#64748b" />
    </PaginationLink>
  );
}

function PaginationEllipsis() {
  return (
    <View style={styles.ellipsis}>
      <MoreHorizontal size={16} color="#64748b" />
    </View>
  );
}

const styles = StyleSheet.create({
  pagination: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  link: {
    minWidth: 36,
    height: 36,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  linkInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  linkActive: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    backgroundColor: "transparent",
  },
  linkGhost: {
    backgroundColor: "transparent",
  },
  linkText: {
    fontSize: 14,
    color: "#0f172a",
  },
  linkTextActive: {
    fontWeight: "600",
  },
  navButton: {
    paddingHorizontal: 8,
  },
  navText: {
    fontSize: 14,
    color: "#64748b",
  },
  ellipsis: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
});

export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
};