import * as React from "react";
import { View, StyleSheet, Platform } from "react-native";
import { Calendar as RNCalendar, DateData } from "react-native-calendars";
import { ChevronLeft, ChevronRight } from "lucide-react-native";

export type CalendarProps = {
  onDateSelect?: (date: string) => void;
  selectedDate?: string;
  className?: string; // Kept for prop compatibility
};

function Calendar({ onDateSelect, selectedDate }: CalendarProps) {
  return (
    <View style={styles.container}>
      <RNCalendar
        // Mapping styles to Shadcn 'Ghost' and 'Default' variants
        theme={{
          backgroundColor: "#ffffff",
          calendarBackground: "#ffffff",
          textSectionTitleColor: "#64748b", // muted-foreground
          selectedDayBackgroundColor: "#9333ea", // primary (purple)
          selectedDayTextColor: "#ffffff",
          todayTextColor: "#9333ea",
          dayTextColor: "#0f172a",
          textDisabledColor: "#94a3b8",
          dotColor: "#9333ea",
          selectedDotColor: "#ffffff",
          arrowColor: "#64748b",
          monthTextColor: "#0f172a",
          indicatorColor: "#9333ea",
          textDayFontWeight: "400",
          textMonthFontWeight: "bold",
          textDayHeaderFontWeight: "500",
          textDayFontSize: 14,
          textMonthFontSize: 16,
          textDayHeaderFontSize: 12,
        }}
        // Custom Arrows using Lucide
        renderArrow={(direction: "left" | "right") =>
          direction === "left" ? (
            <ChevronLeft size={20} color="#64748b" />
          ) : (
            <ChevronRight size={20} color="#64748b" />
          )
        }
        enableSwipeMonths={true}
        markedDates={{
          [selectedDate || ""]: {
            selected: true,
            disableTouchEvent: true,
          },
        }}
        onDayPress={(day: DateData) => {
          if (onDateSelect) onDateSelect(day.dateString);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0", // border
    backgroundColor: "#ffffff",
    padding: 4,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
});

export { Calendar };