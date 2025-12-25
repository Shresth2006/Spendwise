import * as React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Modal,
} from "react-native";
import { Code2, X } from "lucide-react-native";

interface DevToolsProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
}

export default function DevTools({ currentScreen, onNavigate }: DevToolsProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const screens = [
    { id: "splash", name: "🎬 Splash" },
    { id: "auth", name: "🔐 Auth" },
    { id: "welcome", name: "👋 Welcome" },
    { id: "categoryPersonalization", name: "📂 Categories" },
    { id: "budgetSetup", name: "💰 Budget Setup" },
    { id: "home", name: "🏠 Home" },
    { id: "budgetPrediction", name: "📈 Prediction" },
    { id: "goals", name: "🎯 Goals" },
    { id: "calendar", name: "📅 Calendar" },
    { id: "groupExpenses", name: "👥 Group" },
    { id: "addExpense", name: "➕ Add" },
    { id: "analytics", name: "📊 Analytics" },
    { id: "settings", name: "⚙️ Settings" },
  ];

  return (
    <>
      {/* Floating Action Button (FAB) */}
      <SafeAreaView style={styles.fabContainer}>
        <TouchableOpacity
          onPress={() => setIsOpen(true)}
          style={styles.fab}
          activeOpacity={0.8}
        >
          <Code2 size={20} color="white" />
        </TouchableOpacity>
      </SafeAreaView>

      {/* Navigation Modal */}
      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.modalContent}>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Screen Navigator</Text>
              <TouchableOpacity onPress={() => setIsOpen(false)}>
                <X size={20} color="#94a3b8" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
              <View style={styles.buttonGrid}>
                {screens.map((screen) => {
                  const isActive = currentScreen === screen.id;
                  return (
                    <TouchableOpacity
                      key={screen.id}
                      onPress={() => {
                        onNavigate(screen.id);
                        setIsOpen(false);
                      }}
                      style={[
                        styles.screenButton,
                        isActive && styles.activeButton,
                      ]}
                    >
                      <Text
                        style={[
                          styles.screenText,
                          isActive && styles.activeText,
                        ]}
                      >
                        {screen.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>
            
            <Text style={styles.footerText}>Dev Mode: Screen Jump</Text>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  fabContainer: {
    position: "absolute",
    top: 10,
    right: 16,
    zIndex: 999,
  },
  fab: {
    backgroundColor: "#1e293b",
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#1e293b",
    width: "100%",
    maxHeight: "80%",
    borderRadius: 20,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  scrollArea: {
    width: "100%",
  },
  buttonGrid: {
    gap: 8,
  },
  screenButton: {
    width: "100%",
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#334155",
  },
  activeButton: {
    backgroundColor: "#9333ea",
  },
  screenText: {
    color: "#cbd5e1",
    fontSize: 15,
    fontWeight: "500",
  },
  activeText: {
    color: "white",
  },
  footerText: {
    color: "#64748b",
    fontSize: 12,
    textAlign: "center",
    marginTop: 16,
  },
});