import React, { JSX } from 'react';
import { View, Text, FlatList, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TabNavigator from '../navigation/TabNavigator';
import { Match } from '../models/Matches';
import MatchCard from '../components/MatchCard';
import TopSearchBar from '../components/TopSearchBar';

export default function HomeScreen(): JSX.Element {

    const liveMatches = [
    {
      id: 2,
      homeTeam: 'Manchester Utd',
      awayTeam: 'Arsenal',
      homeScore: 2,
      awayScore: 1,
      status: 'LIVE',
      competition: 'Premier League',
      channel: 'Sky Sports',
      viewers: '450,000',
      time: null,
    }
  ];

  const futureMathces = [
    {
      id: 3,
      homeTeam: 'Real Madrid',
      awayTeam: 'Barcelona',
      homeScore: null,
      awayScore: null,
      status: 'Today 19:45',
      competition: 'La Liga',
      channel: 'ITV Sport',
      viewers: '600,000',
      time: 'Today 19:45',
    },
    {
      id: 4,
      homeTeam: 'Bayern Munich',
      awayTeam: 'Borussia Dortmund',
      homeScore: null,
      awayScore: null,
      status: 'Today 20:00',
      competition: 'Bundesliga',
      channel: 'BT Sport',
      viewers: '350,000',
      time: 'Today 20:00',
    },
    {
      id: 5,
      homeTeam: 'Juventus',
      awayTeam: 'Inter Milan',
      homeScore: null,
      awayScore: null,
      status: 'Tomorrow 15:00',
      competition: 'Serie A',
      channel: 'ESPN',
      viewers: '300,000',
      time: 'Tomorrow 15:00',
    },
    {
      id: 6,
      homeTeam: 'PSG',
      awayTeam: 'Marseille',
      homeScore: null,
      awayScore: null,
      status: 'Tomorrow 17:00',
      competition: 'Ligue 1',
      channel: 'beIN Sports',
      viewers: '250,000',
      time: 'Tomorrow 17:00',
    }
  ]
  
  const renderMatch = ({ item }: { item: Match }) => (
    <MatchCard item={item} />
  );
  

  // Dummy fetchSuggestions implementation
  const fetchSuggestions = async (query: string) => {
    // Replace this with your actual suggestion fetching logic
    return [];
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <TopSearchBar 
        fetchSuggestions={fetchSuggestions} 
      />
      
      <View style={styles.content}>
        <Text style={styles.sectionHeader}>{'Live Matches'}</Text>
        <FlatList
          data={liveMatches}
          renderItem={renderMatch}
          keyExtractor={(item) => item.id.toString()}
          scrollEnabled={false}
        />
        <Text style={styles.sectionHeader}>{'Future Matches'}</Text>
        <FlatList
          data={futureMathces}
          renderItem={renderMatch}
          keyExtractor={(item) => item.id.toString()}
          scrollEnabled={false}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingTop: 16,
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    zIndex: 10, // Ensure it is above other content
    // position: 'relative', // Ensure it is positioned correctly
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 12,
    marginHorizontal: 20,
  },
})