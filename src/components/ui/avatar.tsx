import * as React from "react";
import { View, Image, Text, StyleSheet, ImageProps, ViewProps } from "react-native";

// Context to share loading state between Avatar root and its children
const AvatarContext = React.createContext<{
  hasError: boolean;
  setHasError: (val: boolean) => void;
  isLoading: boolean;
  setIsLoading: (val: boolean) => void;
}>({
  hasError: false,
  setHasError: () => {},
  isLoading: true,
  setIsLoading: () => {},
});

function Avatar({ style, children, ...props }: ViewProps) {
  const [hasError, setHasError] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  return (
    <AvatarContext.Provider value={{ hasError, setHasError, isLoading, setIsLoading }}>
      <View 
        style={[styles.avatarRoot, style]} 
        {...props}
      >
        {children}
      </View>
    </AvatarContext.Provider>
  );
}

function AvatarImage({ style, source, ...props }: ImageProps) {
  const { setHasError, setIsLoading, hasError } = React.useContext(AvatarContext);

  // If there's an error, don't render the image at all so fallback shows
  if (hasError) return null;

  return (
    <Image
      style={[styles.avatarImage, style]}
      source={source}
      onLoadStart={() => setIsLoading(true)}
      onLoadEnd={() => setIsLoading(false)}
      onError={() => {
        setHasError(true);
        setIsLoading(false);
      }}
      {...props}
    />
  );
}

function AvatarFallback({ style, children, ...props }: ViewProps) {
  const { hasError, isLoading } = React.useContext(AvatarContext);

  // Show fallback only if image failed to load or is still loading
  if (!hasError && !isLoading) return null;

  return (
    <View 
      style={[styles.avatarFallback, style]} 
      {...props}
    >
      {typeof children === "string" ? (
        <Text style={styles.fallbackText}>{children}</Text>
      ) : (
        children
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  avatarRoot: {
    position: "relative",
    flexDirection: "row",
    height: 40, // size-10
    width: 40,
    overflow: "hidden",
    borderRadius: 20, // rounded-full
  },
  avatarImage: {
    height: "100%",
    width: "100%",
    aspectRatio: 1,
  },
  avatarFallback: {
    height: "100%",
    width: "100%",
    backgroundColor: "#f3f4f6", // bg-muted
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
  },
  fallbackText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6b7280",
  },
});

export { Avatar, AvatarImage, AvatarFallback };