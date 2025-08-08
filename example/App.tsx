import React from "react";
import { StyleSheet, View } from "react-native";
import { DoctorScheduleCalendar, Event } from "react-native-doctor-schedule";

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
    <View style={styles.container}>
      <DoctorScheduleCalendar events={sampleEvents} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
