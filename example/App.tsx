// example/src/App.tsx

import React from "react";
import { DoctorScheduleCalendar, Event } from "react-native-doctor-schedule";
import { GestureHandlerRootView } from "react-native-gesture-handler";

// Create some sample events to display on the calendar
const sampleEvents: Event[] = [
  {
    id: 1,
    title: "Anil K. - Follow-up",
    start: new Date(new Date().setHours(10, 0, 0, 0)),
    end: new Date(new Date().setHours(10, 30, 0, 0)),
    color: "#17a2b8",
  },
  {
    id: 2,
    title: "Sunita P. - New Patient",
    start: new Date(new Date().setHours(11, 0, 0, 0)),
    end: new Date(new Date().setHours(11, 45, 0, 0)),
    color: "#28a745",
  },
];

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <DoctorScheduleCalendar events={sampleEvents} />
    </GestureHandlerRootView>
  );
}
