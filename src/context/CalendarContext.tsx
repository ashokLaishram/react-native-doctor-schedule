import React, { createContext, ReactNode, useState } from "react";
import {
  AvailabilitySlot,
  Event,
  Theme,
  ViewMode,
} from "../ReactNativeDoctorSchedule.types";

/**
 * Defines the shape of the data and functions that will be available
 * through the CalendarContext.
 */
interface CalendarContextType {
  currentDate: Date;
  view: ViewMode;
  theme: Theme;
  events: Event[];
  availability: AvailabilitySlot[];
  setCurrentDate: (date: Date) => void;
  setView: (view: ViewMode) => void;
}

// Create the context with a default undefined value.
const CalendarContext = createContext<CalendarContextType | undefined>(
  undefined
);

interface CalendarProviderProps {
  children: ReactNode;
  theme?: Theme;
  events: Event[];
  availability: AvailabilitySlot[];
}

/**
 * The CalendarProvider component is a wrapper that provides the calendar's
 * state and functions to all child components.
 */
export const CalendarProvider = ({
  children,
  theme = {},
  events = [],
  availability = [],
}: CalendarProviderProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<ViewMode>("week");

  const value = {
    currentDate,
    view,
    theme,
    events,
    availability,
    setCurrentDate,
    setView,
  };

  return (
    <CalendarContext.Provider value={value}>
      {children}
    </CalendarContext.Provider>
  );
};
/**
 * A custom hook that provides an easy way for child components to access
 * the calendar's state and functions.
 */
export const useCalendar = (): CalendarContextType => {
  const context = useContext(CalendarContext);
  if (context === undefined) {
    throw new Error("useCalendar must be used within a CalendarProvider");
  }
  return context;
};
