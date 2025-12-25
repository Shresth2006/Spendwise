import * as React from "react";
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  ViewStyle, 
  TextStyle 
} from "react-native";

/**
 * Root Table container. 
 * Uses a horizontal ScrollView so wide tables don't break the mobile layout.
 */
function Table({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  return (
    <ScrollView horizontal bounces={false} showsHorizontalScrollIndicator={true}>
      <View style={[styles.table, style]}>
        {children}
      </View>
    </ScrollView>
  );
}

function TableHeader({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  return <View style={[styles.header, style]}>{children}</View>;
}

function TableBody({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  return <View style={style}>{children}</View>;
}

function TableRow({ children, style, isLast }: { children: React.ReactNode; style?: ViewStyle; isLast?: boolean }) {
  return (
    <View style={[styles.row, !isLast && styles.rowBorder, style]}>
      {children}
    </View>
  );
}

function TableHead({ children, style }: { children: React.ReactNode; style?: TextStyle }) {
  return (
    <View style={styles.cellBase}>
      <Text style={[styles.headText, style]}>{children}</Text>
    </View>
  );
}

function TableCell({ children, style }: { children: React.ReactNode; style?: TextStyle }) {
  return (
    <View style={styles.cellBase}>
      <Text style={[styles.cellText, style]}>{children}</Text>
    </View>
  );
}

function TableFooter({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  return <View style={[styles.footer, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  table: {
    minWidth: "100%",
    flexDirection: "column",
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  cellBase: {
    padding: 12,
    minWidth: 100, // Ensures columns have enough space
  },
  headText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748b",
    textAlign: "left",
  },
  cellText: {
    fontSize: 14,
    color: "#0f172a",
    textAlign: "left",
  },
  footer: {
    backgroundColor: "#f8fafc",
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    flexDirection: "row",
  },
});

export { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableFooter };