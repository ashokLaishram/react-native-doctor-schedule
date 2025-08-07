import React, { createContext, ReactNode, useContext, useState } from "react";
import { Theme, ViewMode } from "../ReactNativeDoctorSchedule.types";

/**
 * Defines the shape of the data and functions that will be available
 * through the CalendarContext.
 */
interface CalendarContextType {
  currentDate: Date;
  view: ViewMode;
  theme: Theme; // Add theme to the context
  setCurrentDate: (date: Date) => void;
  setView: (view: ViewMode) => void;
}

interface CalendarProviderProps {
  children: ReactNode;
  theme?: Theme;
}

// Create the context with a default undefined value.
// The actual value will be provided by the CalendarProvider.
const CalendarContext = createContext<CalendarContextType | undefined>(
  undefined
);

/**
 * The CalendarProvider component is a wrapper that provides the calendar's
 * state and functions to all child components.
 *
 * @param {object} props - The component props.
 * @param {ReactNode} props.children - The child components to be rendered.
 */
export const CalendarProvider = ({
  children,
  theme = {},
}: CalendarProviderProps) => {
  // State for the currently displayed date. Defaults to today.
  const [currentDate, setCurrentDate] = useState(new Date());

  // State for the current view mode ('day', 'week', or 'month'). Defaults to 'week'.
  const [view, setView] = useState<ViewMode>("week");

  const value = {
    currentDate,
    view,
    setCurrentDate,
    setView,
    theme,
  };

  return (
    <CalendarContext.Provider value={value}>
      {children}
    </CalendarContext.Provider>
  );
};

/**
 * A custom hook that provides an easy way for child components to access
 * the calendar's state and functions. It also handles error checking
 * to ensure it's used within a CalendarProvider.
 */
export const useCalendar = (): CalendarContextType => {
  const context = useContext(CalendarContext);
  if (context === undefined) {
    throw new Error("useCalendar must be used within a CalendarProvider");
  }
  return context;
};
