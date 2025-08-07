// src/DoctorScheduleCalendar.tsx

import React from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { Header } from "./components/Header";
import { CalendarProvider } from "./context/CalendarContext";
import {
  AvailabilitySlot,
  Event,
  Theme,
} from "./ReactNativeDoctorSchedule.types";

// Define the props for the main calendar component
export interface DoctorScheduleCalendarProps {
  events?: Event[];
  availability?: AvailabilitySlot[];
  theme?: Theme;
  // We will add more props for customization later
}

/**
 * The main component for the doctor schedule library.
 * It wraps all other components with the CalendarProvider to manage state.
 */
const DoctorScheduleCalendar = ({
  theme,
  ...props
}: DoctorScheduleCalendarProps) => {
  return (
    <CalendarProvider theme={theme}>
      <SafeAreaView style={styles.container}>
        <Header />
        <View style={styles.calendarContainer}>
          {/* Calendar views (Day, Week, Month) will be rendered here later */}
        </View>
      </SafeAreaView>
    </CalendarProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  calendarContainer: {
    flex: 1,
  },
});

export default DoctorScheduleCalendar;
