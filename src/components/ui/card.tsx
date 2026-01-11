import * as React from "react";
import { View, Text, StyleSheet, ViewStyle, TextStyle } from "react-native";

interface CardProps {
  children?: React.ReactNode;
  style?: ViewStyle;
}

function Card({ style, ...props }: CardProps) {
  return (
    <View
      data-slot="card"
      style={[styles.card, style]}
      {...props}
    />
  );
}

function CardHeader({ style, children, ...props }: CardProps) {
  return (
    <View
      data-slot="card-header"
      style={[styles.header, style]}
      {...props}
    >
      <View style={styles.headerContent}>
        {children}
      </View>
    </View>
  );
}

function CardTitle({ style, ...props }: { children?: React.ReactNode; style?: TextStyle }) {
  return (
    <Text
      data-slot="card-title"
      style={[styles.title, style]}
      {...props}
    />
  );
}

function CardDescription({ style, ...props }: { children?: React.ReactNode; style?: TextStyle }) {
  return (
    <Text
      data-slot="card-description"
      style={[styles.description, style]}
      {...props}
    />
  );
}

/**
 * For CardAction, we use absolute positioning or Flex alignment 
 * to mimic the grid-column-2 behavior from web.
 */
function CardAction({ style, ...props }: CardProps) {
  return (
    <View
      data-slot="card-action"
      style={[styles.action, style]}
      {...props}
    />
  );
}

function CardContent({ style, ...props }: CardProps) {
  return (
    <View
      data-slot="card-content"
      style={[styles.content, style]}
      {...props}
    />
  );
}

function CardFooter({ style, ...props }: CardProps) {
  return (
    <View
      data-slot="card-footer"
      style={[styles.footer, style]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff", // bg-card
    borderRadius: 12, // rounded-xl
    borderWidth: 1,
    borderColor: "#e5e7eb", // border
    flexDirection: "column",
    gap: 24, // gap-6
    overflow: "hidden",
  },
  header: {
    paddingHorizontal: 24, // px-6
    paddingTop: 24, // pt-6
    flexDirection: "row", // To allow CardAction to sit beside text
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 6,
  },
  headerContent: {
    flex: 1,
    flexDirection: "column",
    gap: 6, // gap-1.5
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827", // foreground
    lineHeight: 20,
  },
  description: {
    fontSize: 14,
    color: "#6b7280", // muted-foreground
  },
  action: {
    alignSelf: "flex-start",
  },
  content: {
    paddingHorizontal: 24, // px-6
    paddingBottom: 24, // Matches the web last-child:pb-6 logic
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingBottom: 24,
    paddingTop: 0,
  },
});

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
};