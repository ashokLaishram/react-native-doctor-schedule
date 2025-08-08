import {
  addDays,
  addMonths,
  format,
  startOfWeek,
  subDays,
  subMonths,
} from "date-fns";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useCalendar } from "../context/CalendarContext";
import { ViewMode } from "../ReactNativeDoctorSchedule.types";

/**
 * The Header component displays the current date, navigation controls,
 * and the view switcher.
 */
export const Header = () => {
  const { currentDate, view, setCurrentDate, setView, theme } = useCalendar();

  // --- Navigation Handlers ---
  const goToNext = () => {
    let newDate;
    if (view === "day") newDate = addDays(currentDate, 1);
    else if (view === "week") newDate = addDays(currentDate, 7);
    else newDate = addMonths(currentDate, 1);
    setCurrentDate(newDate);
  };

  const goToPrevious = () => {
    let newDate;
    if (view === "day") newDate = subDays(currentDate, 1);
    else if (view === "week") newDate = subDays(currentDate, 7);
    else newDate = subMonths(currentDate, 1);
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // --- Header Text Logic ---
  const getHeaderText = () => {
    switch (view) {
      case "day":
        return format(currentDate, "MMMM d, yyyy");
      case "week":
        const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
        const weekEnd = addDays(weekStart, 6);
        // FIX: Corrected date formatting for clarity
        return `${format(weekStart, "MMM d")} - ${format(
          weekEnd,
          "MMM d, yyyy"
        )}`;
      case "month":
        return format(currentDate, "MMMM yyyy");
      default:
        return "";
    }
  };

  return (
    <View style={[styles.container, theme.headerContainer]}>
      <Text style={[styles.headerText, theme.headerText]}>
        {getHeaderText()}
      </Text>
      <View style={styles.controlsContainer}>
        {/* View Switcher */}
        <View style={[styles.viewSwitcher, theme.viewSwitcherContainer]}>
          {(["day", "week", "month"] as ViewMode[]).map((mode) => (
            <TouchableOpacity
              key={mode}
              style={[
                styles.viewButton,
                theme.viewButton,
                view === mode && styles.viewButtonActive,
                view === mode && theme.viewButtonActive,
              ]}
              onPress={() => setView(mode)}
            >
              <Text
                style={[
                  styles.viewButtonText,
                  theme.viewButtonText,
                  view === mode && styles.viewButtonTextActive,
                  view === mode && theme.viewButtonTextActive,
                ]}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Navigation Buttons */}
        <TouchableOpacity
          onPress={goToPrevious}
          style={[styles.navButton, theme.navButton]}
        >
          <Text style={[styles.navButtonText, theme.navButtonText]}>{"<"}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={goToToday}>
          <Text style={[styles.todayButtonText, theme.todayButtonText]}>
            Today
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={goToNext}
          style={[styles.navButton, theme.navButton]}
        >
          <Text style={[styles.navButtonText, theme.navButtonText]}>{">"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    backgroundColor: "#f8f9fa",
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#212529",
    marginBottom: 12,
  },
  controlsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  viewSwitcher: {
    flexDirection: "row",
    backgroundColor: "#e9ecef",
    borderRadius: 8,
  },
  viewButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  viewButtonActive: {
    backgroundColor: "#007bff",
  },
  viewButtonText: {
    fontSize: 14,
    color: "#495057",
  },
  viewButtonTextActive: {
    color: "#ffffff",
    fontWeight: "600",
  },
  navButton: {
    padding: 8,
  },
  navButtonText: {
    fontSize: 20,
    color: "#495057",
  },
  todayButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#007bff",
    marginHorizontal: 12,
  },
});
