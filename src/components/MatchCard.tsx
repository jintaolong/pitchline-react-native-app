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
      onPress={() => navigation.navigate(onPressNavigateRoute)}
    >
      <View style={styles.matchCard}>
        {/* <View style={styles.matchHeader}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View> */}
        
        <View style={styles.matchContent}>
          <View style={styles.teamContainer}>
            {/* Fixture start date/time */}
            <View style={styles.fixtureTimeContainer}>
              <Text style={styles.fixtureTimeText}>
                {item.kickoffTime
                  ? new Date(item.kickoffTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  : ''}
              </Text>
              <Text style={styles.fixtureDateText}>
                {item.kickoffTime
                  ? new Date(item.kickoffTime).toLocaleDateString([], { month: 'short', day: 'numeric' })
                  : ''}
              </Text>
            </View>
            <TouchableOpacity  
              style={styles.teamInfo}
              onPress={() => navigation.navigate('TeamDetails')}
            >
              <View style={styles.teamInfo}>
                <Text style={styles.teamName}>{item.homeTeam}</Text>
                {item.homeLogo ? (
                  <Image source={{ uri: item.homeLogo }} style={[styles.teamAvatar, styles.teamAvatarPlaceholder]} />
                ) : (
                  <View style={styles.teamAvatar} />
                )}
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
                {item.awayLogo ? (
                  <Image source={{ uri: item.awayLogo }} style={[styles.teamAvatar, styles.teamAvatarPlaceholder]} />
                ) : (
                  <View style={styles.teamAvatar} />
                )}
                <Text style={styles.teamName}>{item.awayTeam}</Text>
              </View>
            </TouchableOpacity>
          </View>
          
          {/* <View style={styles.matchFooter}>
            <View style={styles.channelInfo}>
              <Text style={styles.channelIcon}>📺</Text>
              <Text style={styles.channelText}>{item.channel}</Text>
            </View>
            <View style={styles.viewersInfo}>
              <Text style={styles.viewersIcon}>👁</Text>
              <Text style={styles.viewersText}>{item.viewers}</Text>
            </View>
          </View> */}
        </View>
      </View>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  matchCard: {
    backgroundColor: 'white',
    marginHorizontal: 15,
    marginBottom: 5,
    borderRadius: 5,
    padding: 10, // reduced from 15 to 10
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  matchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6, // reduced from 15 to 6
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
    marginBottom: 6, // reduced from 15 to 6
  },
  teamInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center', // <-- Center align team info horizontally
  },
  teamAvatar: {
    width: 20, // reduced from 24 to 20
    height: 20, // reduced from 24 to 20
    borderRadius: 10, // adjusted for new size
    backgroundColor: '#6B73FF',
    marginRight: 5, // reduced from 8 to 5
  },
  teamAvatarPlaceholder: {
    backgroundColor: '#FFFFFF',
  },
  teamName: {
    fontSize: 13, // reduced from 14 to 13
    fontWeight: '500',
    flex: 1,
    textAlign: 'center', // <-- Center text inside team name
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 5, // reduced from 10 to 5
  },
  scoreText: {
    fontSize: 15, // reduced from 18 to 15
    fontWeight: 'bold',
    color: '#6B73FF',
    minWidth: 20,
    textAlign: 'center',
  },
  scoreSeparator: {
    fontSize: 15, // reduced from 18 to 15
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
  fixtureTimeContainer: {
    alignItems: 'center',
    marginRight: 10,
    minWidth: 48,
  },
  fixtureTimeText: {
    fontSize: 12,
    color: '#333',
    fontWeight: 'bold',
  },
  fixtureDateText: {
    fontSize: 11,
    color: '#888',
  },
});
