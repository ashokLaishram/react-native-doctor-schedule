// src/ReactNativeDoctorSchedule.types.ts
import type { StyleProp, TextStyle, ViewStyle } from "react-native";
/**
 * Defines the possible view modes for the calendar.
 */
export type ViewMode = "day" | "week" | "month";

/**
 * Represents a single scheduled event or appointment on the calendar.
 */
export interface Event {
  id: string | number;
  title: string;
  start: Date;
  end: Date;
  // Optional properties can be added later, e.g., color, description
}

/**
 * Represents a block of time when a doctor is available for bookings.
 */
export interface AvailabilitySlot {
  start: Date;
  end: Date;
}

/**
 * Defines the shape of the theme object that can be passed to customize
 * the calendar's appearance.
 */
export interface Theme {
  headerContainer?: StyleProp<ViewStyle>;
  headerText?: StyleProp<TextStyle>;
  viewSwitcherContainer?: StyleProp<ViewStyle>;
  viewButton?: StyleProp<ViewStyle>;
  viewButtonActive?: StyleProp<ViewStyle>;
  viewButtonText?: StyleProp<TextStyle>;
  viewButtonTextActive?: StyleProp<TextStyle>;
  navButton?: StyleProp<ViewStyle>;
  navButtonText?: StyleProp<TextStyle>;
  todayButtonText?: StyleProp<TextStyle>;
  // We will add more theme properties for other components later
}
