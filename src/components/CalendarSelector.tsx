// import React, { JSX } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

// interface Props {
//   selectedDate: string;
//   onSelectDate: (date: string) => void;
// }

// const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
// const dates = ['11', '12', '13', '14', '15', '16', '17'];

// export default function CalendarSelector({ selectedDate, onSelectDate }: Props): JSX.Element {
//   return (
//     <View style={styles.container}>
//       {dates.map((date, idx) => {
//         const isSelected = date === '15'; // Replace with actual selection logic
//         return (
//           <TouchableOpacity key={idx} style={[styles.day, isSelected && styles.selected]}>
//             <Text style={styles.dayLabel}>{days[idx]}</Text>
//             <Text style={[styles.dateLabel, isSelected && styles.selectedText]}>{date}</Text>
//           </TouchableOpacity>
//         );
//       })}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flexDirection: 'row', justifyContent: 'space-between' },
//   day: { alignItems: 'center', padding: 10 },
//   dayLabel: { color: '#999' },
//   dateLabel: { fontSize: 16 },
//   selected: {
//     backgroundColor: '#D7D7F3',
//     borderRadius: 8,
//     padding: 10,
//   },
//   selectedText: { fontWeight: 'bold' },
// });

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

// Mock calendar data - you can replace this with your actual calendar logic
const mockCalendarDays = [
  { day: 'M', date: 11, isSelected: false },
  { day: 'T', date: 12, isSelected: false },
  { day: 'W', date: 13, isSelected: false },
  { day: 'T', date: 14, isSelected: false },
  { day: 'F', date: 15, isSelected: true }, // Selected day
  { day: 'S', date: 16, isSelected: false },
  { day: 'S', date: 17, isSelected: false },
];

const CalendarSelector = ({ selectedDate, onSelectDate }: any) => {
  return (
    <View style={styles.container}>
      <View style={styles.calendarRow}>
        {mockCalendarDays.map((dayData, index) => (
            <TouchableOpacity
              key={`calendar-selector-${index}-${dayData.day}-${dayData.date}`}
              style={[
              styles.dayContainer,
              dayData.isSelected && styles.selectedDayContainer
              ]}
              onPress={() => onSelectDate(`2025-06-${dayData.date}`)}
              accessibilityLabel={`calendar-selector-day-${dayData.day}-date-${dayData.date}`}
              testID={`calendar-selector-btn-${index}-${dayData.day}-${dayData.date}`}
            >
              <Text style={[
              styles.dayText,
              dayData.isSelected && styles.selectedDayText
              ]}>
              {dayData.day}
              </Text>
              <Text style={[
              styles.dateText,
              dayData.isSelected && styles.selectedDateText
              ]}>
              {dayData.date}
              </Text>
            </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FAFAFA',
  },
  calendarRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dayContainer: {
    width: 48,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: 'transparent',
  },
  selectedDayContainer: {
    backgroundColor: '#D1D5DB', // Light gray background for selected day
  },
  dayText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: 4,
  },
  selectedDayText: {
    color: '#374151',
    fontWeight: '600',
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  selectedDateText: {
    color: '#1F2937',
    fontWeight: '700',
  },
});

export default CalendarSelector;