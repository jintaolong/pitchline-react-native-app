import React, { JSX } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Match } from '../dtos/Matches';
import { useNavigation } from '@react-navigation/native';

interface Props {
  // match: MatchData;
  item: Match
}

export default function MatchCard({ item }: Props): JSX.Element {
  const navigation = useNavigation();
  const onPressNavigateRoute = item.status === 'End' ? 'Postmatch' : item.status === 'LIVE' ? 'Inplay' : 'Prematch';

  return (
    <TouchableOpacity 
          // style={[styles.settingsItem, isLast && styles.lastItem]} 
          onPress={() => navigation.navigate(onPressNavigateRoute)}
          // disabled={hasSwitch}
        >
        <View style={styles.matchCard}>
          <View style={styles.matchHeader}>
            <Text style={styles.statusText}>{item.status}</Text>
            <View style={styles.competitionContainer}>
              <Text style={styles.competitionText}>{item.competition}</Text>
              <TouchableOpacity style={styles.favoriteButton}>
                <Text style={styles.favoriteIcon}>♡</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.matchContent}>
            <View style={styles.teamContainer}>
              <TouchableOpacity  
                style={styles.teamInfo}
                onPress={() => navigation.navigate('TeamDetails')}
              >
                <View style={styles.teamInfo}>
                    <View style={styles.teamAvatar} />
                    <Text style={styles.teamName}>{item.homeTeam}</Text>
                </View>
              </TouchableOpacity>
              <View style={styles.scoreContainer}>
                <Text style={styles.scoreText}>
                  {item.homeScore !== null ? item.homeScore : ''}
                </Text>
                <Text style={styles.scoreSeparator}>-</Text>
                <Text style={styles.scoreText}>
                  {item.awayScore !== null ? item.awayScore : ''}
                </Text>
              </View>
              <TouchableOpacity 
                style={styles.teamInfo}
                onPress={() => navigation.navigate('TeamDetails')}
              >
                <View style={styles.teamInfo}>    
                    <Text style={styles.teamName}>{item.awayTeam}</Text>    
                    <View style={styles.teamAvatar} />
                </View>
              </TouchableOpacity>
            </View>
            
            <View style={styles.matchFooter}>
              <View style={styles.channelInfo}>
                <Text style={styles.channelIcon}>📺</Text>
                <Text style={styles.channelText}>{item.channel}</Text>
              </View>
              <View style={styles.viewersInfo}>
                <Text style={styles.viewersIcon}>👁</Text>
                <Text style={styles.viewersText}>{item.viewers}</Text>
              </View>
            </View>
          </View>
        </View>
    </TouchableOpacity>
    
  );
}

const styles = StyleSheet.create({
    matchCard: {
    backgroundColor: 'white',
    marginHorizontal: 15,
    marginBottom: 10,
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  matchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  statusText: {
    fontSize: 12,
    color: '#FF6B6B',
    fontWeight: 'bold',
  },
  competitionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  competitionText: {
    fontSize: 12,
    color: '#666',
    marginRight: 10,
  },
  favoriteButton: {
    padding: 5,
  },
  favoriteIcon: {
    fontSize: 16,
  },
  matchContent: {
    flex: 1,
  },
  teamContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  teamInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  teamAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#6B73FF',
    marginRight: 8,
  },
  teamName: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  scoreText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6B73FF',
    minWidth: 20,
    textAlign: 'center',
  },
  scoreSeparator: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 5,
    color: '#6B73FF',
  },
  matchFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  channelInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  channelIcon: {
    fontSize: 12,
    marginRight: 5,
  },
  channelText: {
    fontSize: 12,
    color: '#666',
  },
  viewersInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewersIcon: {
    fontSize: 12,
    marginRight: 5,
  },
  viewersText: {
    fontSize: 12,
    color: '#666',
  },
});