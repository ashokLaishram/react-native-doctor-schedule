import { addDays, format, isWithinInterval, startOfWeek } from "date-fns";
import React, { useEffect, useRef } from "react";
import {
  LayoutChangeEvent,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { EventCard } from "../components/EventCard";
import { TimeGrid } from "../components/TimeGrid";
import { useCalendar } from "../context/CalendarContext";

const HOUR_HEIGHT = 60;

export const WeekView = () => {
  const { currentDate, events, theme, setWeekViewWidth } = useCalendar();
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }).map((_, i) =>
    addDays(weekStart, i)
  );
  const scrollViewRef = useRef<ScrollView>(null);

  const onLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    setWeekViewWidth(width);
  };

  useEffect(() => {
    scrollViewRef.current?.scrollTo({ y: HOUR_HEIGHT * 8, animated: false });
  }, []);

  return (
    <View style={[styles.container, theme.weekViewContainer]}>
      <View style={[styles.dayLabelsContainer, theme.dayLabelContainer]}>
        <View style={styles.timeGutter} />
        {weekDays.map((day) => (
          <View key={day.toISOString()} style={styles.dayLabel}>
            <Text style={[styles.dayName, theme.dayLabelText]}>
              {format(day, "E")}
            </Text>
            <Text style={[styles.dayNumber, theme.dayLabelNumberText]}>
              {format(day, "d")}
            </Text>
          </View>
        ))}
      </View>

      <ScrollView ref={scrollViewRef}>
        <View style={styles.gridContainer}>
          <TimeGrid hourHeight={HOUR_HEIGHT} />
          <View style={styles.eventGrid} onLayout={onLayout}>
            <View style={StyleSheet.absoluteFill}>
              {Array.from({ length: 24 }).map((_, i) => (
                <View
                  key={i}
                  style={[styles.horizontalLine, { top: i * HOUR_HEIGHT }]}
                />
              ))}
            </View>

            {weekDays.map((day) => (
              <View key={day.toISOString()} style={styles.dayColumn}>
                <View style={styles.dayColumnLine} />
              </View>
            ))}
            {events
              .filter((event) =>
                isWithinInterval(event.start, {
                  start: weekStart,
                  end: addDays(weekStart, 7),
                })
              )
              .map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  hourHeight={HOUR_HEIGHT}
                />
              ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  dayLabelsContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    backgroundColor: "#f8f9fa",
  },
  timeGutter: { width: 50 },
  dayLabel: { flex: 1, alignItems: "center", paddingVertical: 8 },
  dayName: { fontSize: 12, color: "#6c757d" },
  dayNumber: { fontSize: 16, fontWeight: "600", color: "#212529" },
  gridContainer: {
    flexDirection: "row",
    // FIX: Add top padding to make space for the 0:00 label
    //paddingTop: 10,
  },
  eventGrid: { flex: 1, flexDirection: "row" },
  dayColumn: {
    flex: 1,
    height: 24 * HOUR_HEIGHT,
  },
  dayColumnLine: {
    width: 1,
    height: "100%",
    backgroundColor: "#e0e0e0",
    position: "absolute",
    right: 0,
  },
  horizontalLine: {
    height: 1,
    width: "100%",
    backgroundColor: "#e0e0e0",
    position: "absolute",
  },
});
