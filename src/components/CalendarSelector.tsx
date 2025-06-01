import React, { JSX } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface Props {
  selectedDate: string;
  onSelectDate: (date: string) => void;
}

const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const dates = ['11', '12', '13', '14', '15', '16', '17'];

export default function CalendarSelector({ selectedDate, onSelectDate }: Props): JSX.Element {
  return (
    <View style={styles.container}>
      {dates.map((date, idx) => {
        const isSelected = date === '15'; // Replace with actual selection logic
        return (
          <TouchableOpacity key={idx} style={[styles.day, isSelected && styles.selected]}>
            <Text style={styles.dayLabel}>{days[idx]}</Text>
            <Text style={[styles.dateLabel, isSelected && styles.selectedText]}>{date}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', justifyContent: 'space-between' },
  day: { alignItems: 'center', padding: 10 },
  dayLabel: { color: '#999' },
  dateLabel: { fontSize: 16 },
  selected: {
    backgroundColor: '#D7D7F3',
    borderRadius: 8,
    padding: 10,
  },
  selectedText: { fontWeight: 'bold' },
});