import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useCalendar } from "../context/CalendarContext";

interface TimeGridProps {
  hourHeight: number;
}

export const TimeGrid = ({ hourHeight }: TimeGridProps) => {
  const { theme } = useCalendar();
  const hours = Array.from({ length: 24 }).map((_, i) => i);

  return (
    <View style={[styles.container, theme.timeGridContainer]}>
      {hours.map((hour) => (
        <View key={hour} style={[styles.hourRow, { height: hourHeight }]}>
          <Text style={[styles.timeLabel, theme.timeLabel]}>
            {/* FIX: Display all hour labels, including 0:00 */}
            {`${hour}:00`}
          </Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 50,
    paddingRight: 5,
    borderRightWidth: 1,
    borderRightColor: "#e0e0e0",
  },
  hourRow: {
    justifyContent: "flex-start",
    alignItems: "flex-end",
    // FIX: Removed the border from here, as it's now drawn in WeekView
  },
  timeLabel: {
    fontSize: 10,
    color: "#6c757d",
    position: "absolute",
    top: -6, // Position label just above the line
    right: 5,
  },
});
