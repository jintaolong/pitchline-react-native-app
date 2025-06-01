import React, { JSX } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MatchData } from '../dtos/Matches';

interface Props {
  match: MatchData;
}

export default function MatchCard({ match }: Props): JSX.Element {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.status}>{match.status}</Text>
        <Text style={styles.league}>{match.league}</Text>
        <Ionicons name="heart-outline" size={20} color="#888" />
      </View>

      <View style={styles.teams}>
        <View style={styles.team}>
          <Image source={{ uri: match.homeAvatar }} style={styles.avatar} />
          <Text>{match.homeTeam}</Text>
        </View>
        <Text style={styles.score}>{match.score}</Text>
        <View style={styles.team}>
          <Image source={{ uri: match.awayAvatar }} style={styles.avatar} />
          <Text>{match.awayTeam}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Ionicons name="tv-outline" size={16} />
        <Text style={styles.broadcaster}>{match.broadcaster}</Text>
        <Ionicons name="eye-outline" size={16} style={{ marginLeft: 12 }} />
        <Text>{match.viewers.toLocaleString()}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  status: {
    color: '#FF3B30',
    fontWeight: 'bold',
  },
  league: {
    color: '#666',
  },
  teams: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  team: {
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginBottom: 4,
  },
  score: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingHorizontal: 8,
  },
  footer: {
    flexDirection: 'row',
    marginTop: 10,
    alignItems: 'center',
  },
  broadcaster: {
    marginLeft: 4,
    color: '#333',
  },
});