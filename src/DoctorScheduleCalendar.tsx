import React from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { Header } from "./components/Header";
import { CalendarProvider, useCalendar } from "./context/CalendarContext";
import {
  AvailabilitySlot,
  Event,
  Theme,
} from "./ReactNativeDoctorSchedule.types";
import { WeekView } from "./views/WeekView";

// Define the props for the main calendar component
export interface DoctorScheduleCalendarProps {
  events?: Event[];
  availability?: AvailabilitySlot[];
  theme?: Theme;
  onEventPress?: (event: Event) => void;
}

/**
 * A helper component to switch between different calendar views.
 */
const CalendarBody = () => {
  const { view } = useCalendar();

  switch (view) {
    case "week":
      return <WeekView />;
    // Day and Month views will be added later
    case "day":
      return null;
    case "month":
      return null;
    default:
      return <WeekView />;
  }
};

/**
 * The main component for the doctor schedule library.
 * It wraps all other components with the CalendarProvider to manage state.
 */
const DoctorScheduleCalendar = ({
  events = [],
  availability = [],
  theme,
  onEventPress,
}: DoctorScheduleCalendarProps) => {
  return (
    <CalendarProvider
      events={events}
      availability={availability}
      theme={theme}
      onEventPress={onEventPress}
    >
      <SafeAreaView style={styles.container}>
        <Header />
        <View style={styles.calendarContainer}>
          <CalendarBody />
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
