import * as React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
  Pressable,
} from "react-native";
import { Check, ChevronDown } from "lucide-react-native";

const SelectContext = React.createContext<any>(null);

/**
 * Root Component
 */
function Select({ value, onValueChange, children }: any) {
  const [open, setOpen] = React.useState(false);
  
  return (
    <SelectContext.Provider value={{ value, onValueChange, open, setOpen }}>
      <View style={styles.container}>{children}</View>
    </SelectContext.Provider>
  );
}

/**
 * The Button that opens the menu
 */
function SelectTrigger({ children, style, placeholder }: any) {
  const { setOpen, value } = React.useContext(SelectContext);

  return (
    <TouchableOpacity
      onPress={() => setOpen(true)}
      style={[styles.trigger, style]}
      activeOpacity={0.7}
    >
      <View style={styles.valueContainer}>
        {value ? (
          <Text style={styles.triggerText}>{value}</Text>
        ) : (
          <Text style={styles.placeholder}>{placeholder || "Select an option"}</Text>
        )}
      </View>
      <ChevronDown size={16} color="#64748b" style={{ opacity: 0.5 }} />
    </TouchableOpacity>
  );
}

/**
 * The Slide-up Menu (Bottom Sheet style)
 */
function SelectContent({ children }: any) {
  const { open, setOpen } = React.useContext(SelectContext);

  return (
    <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)}>
      <Pressable style={styles.overlay} onPress={() => setOpen(false)}>
        <View style={styles.content}>
          <View style={styles.handle} />
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {children}
          </ScrollView>
        </View>
      </Pressable>
    </Modal>
  );
}

/**
 * Individual Option
 */
function SelectItem({ value: itemValue, children }: any) {
  const { value, onValueChange, setOpen } = React.useContext(SelectContext);
  const isSelected = value === itemValue;

  const handlePress = () => {
    onValueChange?.(itemValue);
    setOpen(false);
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.item}>
      <Text style={[styles.itemText, isSelected && styles.itemTextSelected]}>
        {children}
      </Text>
      {isSelected && <Check size={16} color="#9333ea" />}
    </TouchableOpacity>
  );
}

function SelectLabel({ children }: any) {
  return <Text style={styles.label}>{children}</Text>;
}

const styles = StyleSheet.create({
  container: { width: "100%" },
  trigger: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
    backgroundColor: "#ffffff",
  },
  valueContainer: { flex: 1 },
  triggerText: { fontSize: 14, color: "#0f172a" },
  placeholder: { fontSize: 14, color: "#64748b" },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  content: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
    maxHeight: "50%",
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: "#e2e8f0",
    borderRadius: 2,
    alignSelf: "center",
    marginVertical: 12,
  },
  scrollContent: { paddingHorizontal: 16 },
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#f1f5f9",
  },
  itemText: { fontSize: 16, color: "#0f172a" },
  itemTextSelected: { fontWeight: "600", color: "#9333ea" },
  label: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#64748b",
    marginTop: 16,
    marginBottom: 8,
  },
});

export { Select, SelectTrigger, SelectContent, SelectItem, SelectLabel };