import { differenceInMinutes, getDay } from "date-fns";
import React from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";
import { useCalendar } from "../context/CalendarContext";
import { Event } from "../ReactNativeDoctorSchedule.types";

interface EventCardProps {
  event: Event;
  hourHeight: number;
}

export const EventCard = ({ event, hourHeight }: EventCardProps) => {
  const { theme, weekViewWidth } = useCalendar();

  // Return null if the container width hasn't been measured yet
  if (weekViewWidth === 0) {
    return null;
  }

  const durationInMinutes = differenceInMinutes(event.end, event.start);
  const height = (durationInMinutes / 60) * hourHeight;
  const top =
    event.start.getHours() * hourHeight +
    (event.start.getMinutes() / 60) * hourHeight;

  // Day index (Monday = 0)
  const dayIndex = getDay(event.start) === 0 ? 6 : getDay(event.start) - 1;
  const dayColumnWidth = weekViewWidth / 7;
  // FIX: Account for horizontal margin when calculating width and position
  const margin = 1;
  const left = dayColumnWidth * dayIndex + margin;
  const width = dayColumnWidth - margin * 2;

  const dynamicStyles: ViewStyle = {
    top,
    height,
    left,
    width,
    backgroundColor: event.color || "#007bff",
  };

  return (
    <View style={[styles.card, dynamicStyles, theme.eventCard]}>
      <Text style={[styles.title, theme.eventCardTitle]} numberOfLines={1}>
        {event.title}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    position: "absolute",
    borderRadius: 4,
    padding: 4,
    overflow: "hidden",
  },
  title: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#ffffff",
  },
});
