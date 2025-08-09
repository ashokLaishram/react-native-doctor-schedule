import {
  addDays,
  addMonths,
  differenceInMinutes,
  format,
  getDay,
  isWithinInterval,
  setHours,
  setMinutes,
  startOfWeek,
  subDays,
  subMonths,
} from "date-fns";
import React, { useEffect, useRef, useState } from "react";
import {
  LayoutChangeEvent,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
  PanGestureHandlerEventPayload,
} from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

// --- CORE TYPES ---
export type ViewMode = "day" | "week" | "month";

export interface Event {
  id: string | number;
  title: string;
  start: Date;
  end: Date;
  color?: string;
}

export interface AvailabilitySlot {
  start: Date;
  end: Date;
}

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
  weekViewContainer?: StyleProp<ViewStyle>;
  dayLabelContainer?: StyleProp<ViewStyle>;
  dayLabelText?: StyleProp<TextStyle>;
  dayLabelNumberText?: StyleProp<TextStyle>;
  timeGridContainer?: StyleProp<ViewStyle>;
  timeLabel?: StyleProp<TextStyle>;
  gridCell?: StyleProp<ViewStyle>;
  eventCard?: StyleProp<ViewStyle>;
  eventCardTitle?: StyleProp<TextStyle>;
}

// --- PROPS INTERFACE ---
export interface DoctorScheduleCalendarProps {
  events?: Event[];
  availability?: AvailabilitySlot[];
  theme?: Theme;
  onEventPress?: (event: Event) => void;
  onEventDragEnd?: (event: Event, newDate: Date) => void;
  renderEventPopup?: (event: Event, onClose: () => void) => React.ReactElement;
}

const HOUR_HEIGHT = 60;

// --- SUB-COMPONENTS ---

const Header = ({
  currentDate,
  setCurrentDate,
  view,
  setView,
  theme,
}: {
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  view: ViewMode;
  setView: (view: ViewMode) => void;
  theme: Theme;
}) => {
  const goToNext = () => {
    let newDate;
    if (view === "day") newDate = addDays(currentDate, 1);
    else if (view === "week") newDate = addDays(currentDate, 7);
    else newDate = addMonths(currentDate, 1);
    setCurrentDate(newDate);
  };

  const goToPrevious = () => {
    let newDate;
    if (view === "day") newDate = subDays(currentDate, 1);
    else if (view === "week") newDate = subDays(currentDate, 7);
    else newDate = subMonths(currentDate, 1);
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const getHeaderText = () => {
    switch (view) {
      case "day":
        return format(currentDate, "MMMM d, yyyy");
      case "week":
        const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
        const weekEnd = addDays(weekStart, 6);
        return `${format(weekStart, "MMM d")} - ${format(
          weekEnd,
          "MMM d, yyyy"
        )}`;
      case "month":
        return format(currentDate, "MMMM yyyy");
      default:
        return "";
    }
  };

  return (
    <View style={[headerStyles.container, theme.headerContainer]}>
      <Text style={[headerStyles.headerText, theme.headerText]}>
        {getHeaderText()}
      </Text>
      <View style={headerStyles.controlsContainer}>
        <View style={[headerStyles.viewSwitcher, theme.viewSwitcherContainer]}>
          {(["day", "week", "month"] as ViewMode[]).map((mode) => (
            <TouchableOpacity
              key={mode}
              style={[
                headerStyles.viewButton,
                theme.viewButton,
                view === mode && headerStyles.viewButtonActive,
                view === mode && theme.viewButtonActive,
              ]}
              onPress={() => setView(mode)}
            >
              <Text
                style={[
                  headerStyles.viewButtonText,
                  theme.viewButtonText,
                  view === mode && headerStyles.viewButtonTextActive,
                  view === mode && theme.viewButtonTextActive,
                ]}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity
          onPress={goToPrevious}
          style={[headerStyles.navButton, theme.navButton]}
        >
          <Text style={[headerStyles.navButtonText, theme.navButtonText]}>
            {"<"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={goToToday}>
          <Text style={[headerStyles.todayButtonText, theme.todayButtonText]}>
            Today
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={goToNext}
          style={[headerStyles.navButton, theme.navButton]}
        >
          <Text style={[headerStyles.navButtonText, theme.navButtonText]}>
            {">"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const TimeGrid = ({
  hourHeight,
  theme,
}: {
  hourHeight: number;
  theme: Theme;
}) => {
  const hours = Array.from({ length: 24 }).map((_, i) => i);
  return (
    <View style={[timeGridStyles.container, theme.timeGridContainer]}>
      {hours.map((hour) => (
        <View
          key={hour}
          style={[timeGridStyles.hourRow, { height: hourHeight }]}
        >
          <Text style={[timeGridStyles.timeLabel, theme.timeLabel]}>
            {hour > 0 ? `${hour}:00` : ""}
          </Text>
        </View>
      ))}
    </View>
  );
};

const EventCard = ({
  event,
  hourHeight,
  theme,
  weekViewWidth,
  onEventPress,
  onEventDragEnd,
  currentDate,
}: {
  event: Event;
  hourHeight: number;
  theme: Theme;
  weekViewWidth: number;
  onEventPress?: (event: Event) => void;
  onEventDragEnd?: (event: Event, newDate: Date) => void;
  currentDate: Date;
}) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const zIndex = useSharedValue(10);

  if (weekViewWidth === 0) return null;

  const durationInMinutes = differenceInMinutes(event.end, event.start);
  const height = (durationInMinutes / 60) * hourHeight;
  const top =
    event.start.getHours() * hourHeight +
    (event.start.getMinutes() / 60) * hourHeight;
  const dayIndex = getDay(event.start) === 0 ? 6 : getDay(event.start) - 1;
  const dayColumnWidth = weekViewWidth / 7;
  const margin = 1;
  const left = dayColumnWidth * dayIndex + margin;
  const width = dayColumnWidth - margin * 2;

  const panGesture = Gesture.Pan()
    .onStart(() => {
      zIndex.value = 100;
    })
    .onUpdate((e: PanGestureHandlerEventPayload) => {
      translateX.value = e.translationX;
      translateY.value = e.translationY;
    })
    .onEnd((e) => {
      const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
      const draggedToDayIndex = Math.floor(
        (left + e.translationX) / dayColumnWidth
      );
      const draggedToHour = Math.round((top + e.translationY) / hourHeight);
      const newDate = addDays(weekStart, draggedToDayIndex);
      const finalDate = setMinutes(setHours(newDate, draggedToHour), 0);
      if (onEventDragEnd) runOnJS(onEventDragEnd)(event, finalDate);
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
      zIndex.value = 10;
    });

  const tapGesture = Gesture.Tap().onEnd(() => {
    if (onEventPress) runOnJS(onEventPress)(event);
  });

  const composedGesture = Gesture.Exclusive(panGesture, tapGesture);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
    zIndex: zIndex.value,
  }));

  const dynamicStyles: ViewStyle = {
    top,
    height,
    left,
    width,
    backgroundColor: event.color || "#007bff",
  };

  return (
    <GestureDetector gesture={composedGesture}>
      <Animated.View
        style={[
          eventCardStyles.card,
          dynamicStyles,
          theme.eventCard,
          animatedStyle,
        ]}
      >
        <Animated.Text
          style={[eventCardStyles.title, theme.eventCardTitle]}
          numberOfLines={1}
        >
          {event.title}
        </Animated.Text>
      </Animated.View>
    </GestureDetector>
  );
};

const WeekView = ({
  events,
  theme,
  currentDate,
  onEventPress,
  onEventDragEnd,
  weekViewWidth,
  setWeekViewWidth,
}: {
  events: Event[];
  availability: AvailabilitySlot[];
  theme: Theme;
  currentDate: Date;
  onEventPress?: (event: Event) => void;
  onEventDragEnd?: (event: Event, newDate: Date) => void;
  weekViewWidth: number;
  setWeekViewWidth: (width: number) => void;
}) => {
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
    <View style={[weekViewStyles.container, theme.weekViewContainer]}>
      <View
        style={[weekViewStyles.dayLabelsContainer, theme.dayLabelContainer]}
      >
        <View style={weekViewStyles.timeGutter} />
        {weekDays.map((day) => (
          <View key={day.toISOString()} style={weekViewStyles.dayLabel}>
            <Text style={[weekViewStyles.dayName, theme.dayLabelText]}>
              {format(day, "E")}
            </Text>
            <Text style={[weekViewStyles.dayNumber, theme.dayLabelNumberText]}>
              {format(day, "d")}
            </Text>
          </View>
        ))}
      </View>
      <ScrollView ref={scrollViewRef}>
        <View style={weekViewStyles.gridContainer}>
          <TimeGrid hourHeight={HOUR_HEIGHT} theme={theme} />
          <View style={weekViewStyles.eventGrid} onLayout={onLayout}>
            <View style={StyleSheet.absoluteFill}>
              {Array.from({ length: 24 }).map((_, i) => (
                <View
                  key={i}
                  style={[
                    weekViewStyles.horizontalLine,
                    { top: i * HOUR_HEIGHT },
                  ]}
                />
              ))}
            </View>
            {weekDays.map((day) => (
              <View key={day.toISOString()} style={weekViewStyles.dayColumn}>
                <View style={weekViewStyles.dayColumnLine} />
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
                  theme={theme}
                  weekViewWidth={weekViewWidth}
                  onEventPress={onEventPress}
                  onEventDragEnd={onEventDragEnd}
                  currentDate={currentDate}
                />
              ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const EventDetailModal = ({
  event,
  isVisible,
  onClose,
  renderPopup,
}: {
  event: Event;
  isVisible: boolean;
  onClose: () => void;
  renderPopup?: (event: Event, onClose: () => void) => React.ReactElement;
}) => {
  const renderDefaultContent = () => (
    <View>
      <Text style={modalStyles.title}>{event.title}</Text>
      <Text style={modalStyles.time}>
        {format(event.start, "p")} - {format(event.end, "p")}
      </Text>
    </View>
  );

  return (
    <Modal
      transparent={true}
      visible={isVisible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={modalStyles.backdrop}>
        <View style={modalStyles.modalContent}>
          {renderPopup ? renderPopup(event, onClose) : renderDefaultContent()}
          {!renderPopup && (
            <TouchableOpacity onPress={onClose} style={modalStyles.closeButton}>
              <Text style={modalStyles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
};

// --- MAIN COMPONENT ---
const DoctorScheduleCalendar = ({
  events = [],
  availability = [],
  theme = {},
  onEventPress,
  onEventDragEnd,
  renderEventPopup,
}: DoctorScheduleCalendarProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<ViewMode>("week");
  const [weekViewWidth, setWeekViewWidth] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const handleEventPress = (event: Event) => {
    setSelectedEvent(event);
    onEventPress?.(event);
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
  };

  const renderCalendarBody = () => {
    switch (view) {
      case "week":
        return (
          <WeekView
            events={events}
            availability={availability}
            theme={theme}
            currentDate={currentDate}
            onEventPress={handleEventPress}
            onEventDragEnd={onEventDragEnd}
            weekViewWidth={weekViewWidth}
            setWeekViewWidth={setWeekViewWidth}
          />
        );
      default:
        return null;
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <Header
          currentDate={currentDate}
          setCurrentDate={setCurrentDate}
          view={view}
          setView={setView}
          theme={theme}
        />
        <View style={styles.calendarContainer}>{renderCalendarBody()}</View>
        {selectedEvent && (
          <EventDetailModal
            event={selectedEvent}
            isVisible={!!selectedEvent}
            onClose={handleCloseModal}
            renderPopup={renderEventPopup}
          />
        )}
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

// --- STYLESHEETS ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ffffff" },
  calendarContainer: { flex: 1 },
});

const headerStyles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    backgroundColor: "#f8f9fa",
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#212529",
    marginBottom: 12,
  },
  controlsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  viewSwitcher: {
    flexDirection: "row",
    backgroundColor: "#e9ecef",
    borderRadius: 8,
  },
  viewButton: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8 },
  viewButtonActive: { backgroundColor: "#007bff" },
  viewButtonText: { fontSize: 14, color: "#495057" },
  viewButtonTextActive: { color: "#ffffff", fontWeight: "600" },
  navButton: { padding: 8 },
  navButtonText: { fontSize: 20, color: "#495057" },
  todayButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#007bff",
    marginHorizontal: 12,
  },
});

const weekViewStyles = StyleSheet.create({
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
  gridContainer: { flexDirection: "row", paddingTop: 10 },
  eventGrid: { flex: 1, flexDirection: "row" },
  dayColumn: { flex: 1, height: 24 * HOUR_HEIGHT },
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

const timeGridStyles = StyleSheet.create({
  container: {
    width: 50,
    paddingRight: 5,
    borderRightWidth: 1,
    borderRightColor: "#e0e0e0",
  },
  hourRow: { justifyContent: "flex-start", alignItems: "flex-end" },
  timeLabel: {
    fontSize: 10,
    color: "#6c757d",
    position: "absolute",
    top: -6,
    right: 5,
  },
});

const eventCardStyles = StyleSheet.create({
  card: {
    position: "absolute",
    borderRadius: 4,
    padding: 4,
    overflow: "hidden",
  },
  title: { fontSize: 12, fontWeight: "bold", color: "#ffffff" },
});

const modalStyles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 24,
    borderRadius: 8,
    width: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 12 },
  time: { fontSize: 16, marginBottom: 24 },
  closeButton: {
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  closeButtonText: { color: "white", fontWeight: "600" },
});

export default DoctorScheduleCalendar;
