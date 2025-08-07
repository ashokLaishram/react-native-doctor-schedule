import { differenceInMinutes, getDay } from "date-fns";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useCalendar } from "../context/CalendarContext";
import { Event } from "../ReactNativeDoctorSchedule.types";

interface EventCardProps {
  event: Event;
  hourHeight: number;
}

export const EventCard = ({ event, hourHeight }: EventCardProps) => {
  const { theme } = useCalendar();

  const durationInMinutes = differenceInMinutes(event.end, event.start);
  const height = (durationInMinutes / 60) * hourHeight;
  const top =
    event.start.getHours() * hourHeight +
    (event.start.getMinutes() / 60) * hourHeight;

  // Day index (Monday = 0)
  const dayIndex = getDay(event.start) === 0 ? 6 : getDay(event.start) - 1;
  const left = `${(100 / 7) * dayIndex}%`;

  return (
    <View
      style={[
        styles.card,
        {
          top,
          height,
          left,
          width: `${100 / 7}%`,
          backgroundColor: event.color || "#007bff",
        },
        theme.eventCard,
      ]}
    >
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
    marginHorizontal: 1, // To create a small gap between events
    overflow: "hidden",
  },
  title: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#ffffff",
  },
});
