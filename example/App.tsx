import React from "react";
import { Alert } from "react-native";
import { DoctorScheduleCalendar, Event } from "react-native-doctor-schedule";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const today = new Date();
const sampleEvents: Event[] = [
  {
    id: 1,
    title: "Anil K. - Follow-up",
    start: new Date(new Date(today).setHours(10, 0, 0, 0)),
    end: new Date(new Date(today).setHours(10, 30, 0, 0)),
    color: "#17a2b8",
  },
  {
    id: 2,
    title: "Sunita P. - New Patient",
    start: new Date(new Date(today).setHours(11, 0, 0, 0)),
    end: new Date(new Date(today).setHours(11, 45, 0, 0)),
    color: "#28a745",
  },
  {
    id: 3,
    title: "Rohan S. - Check-up",
    start: new Date(new Date(today).setDate(today.getDate() + 1)),
    end: new Date(new Date(today).setDate(today.getDate() + 1)),
    color: "#ffc107",
  },
];

export default function App() {
  const handleEventPress = (event: Event) => {
    Alert.alert("Event Pressed", `You tapped on: ${event.title}`);
  };

  const handleEventDragEnd = (event: Event, newDate: Date) => {
    Alert.alert(
      "Event Rescheduled",
      `${event.title} has been moved to ${newDate.toLocaleString()}`
    );
    // Here you would typically update your state or backend with the new event time
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <DoctorScheduleCalendar
        events={sampleEvents}
        onEventPress={handleEventPress}
        onEventDragEnd={handleEventDragEnd}
      />
    </GestureHandlerRootView>
  );
}
