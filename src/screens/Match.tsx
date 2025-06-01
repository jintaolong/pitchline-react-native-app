import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import CalendarSelector from '../components/CalendarSelector';
import MatchCard from '../components/MatchCard';
import Filters from '../components/Filters';
import { MatchData } from '../dtos/Matches';

const mockMatches: MatchData[] = [
  {
    id: 1,
    homeTeam: 'Manchester Utd',
    awayTeam: 'Arsenal',
    status: 'LIVE',
    score: '2 - 1',
    league: 'Premier League',
    broadcaster: 'Sky Sports',
    viewers: 450000,
    homeAvatar: '', // Add URI
    awayAvatar: '',
  },
  // Add more mock matches here...
];

const MatchesScreen = () =>{
  const [selectedDate, setSelectedDate] = useState<string>('2025-06-01');
  const [selectedFilters, setSelectedFilters] = useState<Record<string, any>>({});

  return (
    <ScrollView style={styles.container}>
      <CalendarSelector selectedDate={selectedDate} onSelectDate={setSelectedDate} />
      <Filters onFilterChange={setSelectedFilters} />
      <View style={styles.list}>
        {mockMatches.map((match) => (
          <MatchCard key={match.id} match={match} />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  list: { marginTop: 16 },
});

export default MatchesScreen;