import { RouteProp } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  Image,
  Dimensions,
} from 'react-native';
import { getTeamDetails } from '../services/teamService';
import { TeamDto } from '../dtos/Teams';
import { LeagueStandingDto } from '../dtos/Leagues';

const { width } = Dimensions.get('window');

type TeamDetailsScreenRouteProp = RouteProp<{ params: { teamId: number } }, 'params'>;

const TeamDetailsScreen = ({route}: {route: TeamDetailsScreenRouteProp}) => {
  const [activeLeague, setActiveLeague] = useState('Domestic League');
  const {teamId} = route.params;
  const [teamDetail, setTeamDetail] = useState<TeamDto>({
    _id: 'dummy_id',
    team_id: 1,
    team_name: 'Dummy Team',
    team: {
      id: 1,
      name: 'Dummy Team',
      code: 'DT',
      country: 'Nowhere',
      founded: 1900,
      national: false,
      logo: '',
    },
    coach: {},
    squad: [],
    venue: {
      id: 1,
      name: 'Dummy Stadium',
      address: '123 Dummy St',
      city: 'Dummytown',
      capacity: 10000,
      surface: 'Grass',
      image: '',
    },
  });
  const [domesticLeagueStanding, setDomesticLeagueStanding] = useState<LeagueStandingDto>(
    {
      _id: "",
      league_id: 0,
      season: 0,
      league: {
        id: 0,
        name: "",
        country: "",
        logo: "",
        flag: "",
        season: 0,
        standings: [[]]
      },
      standings: [[]]
    }
  );
  useEffect(() => {
    getTeamDetails(teamId).then((data: TeamDto | null) => {
      if(!!data){
        setTeamDetail(data);
      }
    });
  }, [teamId]);

  const formResults = [
    { result: 'W', competition: 'PL', color: '#10B981' },
    { result: 'L', competition: 'UCL', color: '#EF4444' },
    { result: 'W', competition: 'PL', color: '#10B981' },
    { result: 'D', competition: 'UCL', color: '#F59E0B' },
    { result: 'D', competition: 'PL', color: '#F59E0B' },
    { result: 'O', competition: 'OPP', color: '#3B82F6', isUpcoming: true }
  ];

  const leagueStandings = [
    { position: 1, team: 'Arsenal', points: 30, form: ['W', 'W', 'W', 'W', 'W'] },
    { position: 2, team: 'Manchester City', points: 29, form: ['W', 'W', 'W', 'W', 'D'] },
    { position: 3, team: 'Liverpool FC', points: 27, form: ['W', 'W', 'W', 'W', 'W'] },
    { position: 4, team: 'Chelsea', points: 25, form: ['W', 'W', 'W', 'W', 'W'] },
    { position: 5, team: 'Tottenham', points: 23, form: ['L', 'L', 'W', 'W', 'W'] }
  ];

  // const squadMembers = [
  //   { name: 'Kevin De Bruyne', position: 'Midfielder', hasPhoto: true },
  //   { name: 'Erling Haaland', position: 'Forward', hasPhoto: true },
  //   { name: 'Rodri', position: 'Midfielder', hasPhoto: true },
  //   { name: 'Ruben Dias', position: 'Defender', hasPhoto: false },
  //   { name: 'Ederson', position: 'Goalkeeper', hasPhoto: true },
  //   { name: 'Bernardo Silva', position: 'Midfielder', hasPhoto: true }
  // ];

  const getFormColor = (result: string) => {
    switch (result) {
      case 'W': return '#10B981';
      case 'L': return '#EF4444';
      case 'D': return '#F59E0B';
      default: return '#9CA3AF';
    }
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <SafeAreaView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton}>
              <Text style={styles.backArrow}>←</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{teamDetail.team.name}</Text>
            <View style={styles.headerSpacer} />
          </View>

          {/* Most Recent Match */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Most Recent Match</Text>
            <View style={styles.matchCard}>
              <View style={styles.matchTeams}>
                <View style={styles.teamInfo}>
                  <View style={styles.teamLogo}>
                    <Text style={styles.logoText}>MC</Text>
                  </View>
                  <Text style={styles.teamName}>Manchester City</Text>
                </View>
                
                <View style={styles.matchScore}>
                  <Text style={styles.scoreText}>1 - 1</Text>
                  <Text style={styles.matchDate}>2023-11-11</Text>
                  <Text style={styles.competition}>Premier League</Text>
                </View>
                
                <View style={styles.teamInfo}>
                  <View style={[styles.teamLogo, styles.liverpoolLogo]}>
                    <Text style={styles.logoText}>L</Text>
                  </View>
                  <Text style={styles.teamName}>Liverpool FC</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Form & Upcoming */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Form & Upcoming</Text>
            <View style={styles.formContainer}>
              {formResults.map((form, index) => (
                <View key={index} style={[styles.formBox, { backgroundColor: form.color }]}>
                  <Text style={styles.formResult}>{form.result}</Text>
                  <Text style={styles.formCompetition}>{form.competition}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* League Standings */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>League Standings</Text>
            
            {/* League Tabs */}
            <View style={styles.leagueTabs}>
              <TouchableOpacity 
                style={[styles.leagueTab, activeLeague === 'Domestic League' && styles.activeLeagueTab]}
                onPress={() => setActiveLeague('Domestic League')}
              >
                <Text style={[styles.leagueTabText, activeLeague === 'Domestic League' && styles.activeLeagueTabText]}>
                  Domestic League
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.leagueTab, activeLeague === 'Regional League' && styles.activeLeagueTab]}
                onPress={() => setActiveLeague('Regional League')}
              >
                <Text style={[styles.leagueTabText, activeLeague === 'Regional League' && styles.activeLeagueTabText]}>
                  Regional League
                </Text>
              </TouchableOpacity>
            </View>

            {/* Standings Table */}
            <View style={styles.standingsTable}>
              {leagueStandings.map((team, index) => (
                <View key={index} style={styles.standingRow}>
                  <View style={[styles.positionBadge, team.position === 2 && styles.currentTeamBadge]}>
                    <Text style={[styles.positionText, team.position === 2 && styles.currentTeamText]}>
                      {team.position}
                    </Text>
                  </View>
                  <View style={styles.teamLogo}>
                    <Text style={styles.logoText}>{team.team.charAt(0)}</Text>
                  </View>
                  <Text style={[styles.standingTeamName, team.position === 2 && styles.currentTeamName]}>
                    {team.team}
                  </Text>
                  <Text style={styles.standingPoints}>{team.points}</Text>
                  <View style={styles.formDots}>
                    {team.form.map((result, formIndex) => (
                      <View 
                        key={formIndex} 
                        style={[styles.formDot, { backgroundColor: getFormColor(result) }]} 
                      />
                    ))}
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Club Ranking */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Club Ranking</Text>
            <View style={styles.rankingCard}>
              <Text style={styles.rankingLabel}>UEFA Ranking</Text>
              <Text style={styles.rankingNumber}>#2</Text>
              <Text style={styles.rankingSubtext}>Club Coefficients</Text>
            </View>
          </View>

          {/* Squad & Management */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Squad & Management</Text>
            <View style={styles.squadGrid}>
              {teamDetail.squad.map((player, index) => (
                <View key={index} style={styles.playerCard}>
                  <View style={styles.playerPhoto}>
                    {!player.player.photo ? (
                      <View style={styles.photoPlaceholder}>
                        <Text style={styles.photoText}>👤</Text>
                      </View>
                    ) : (
                      // <View style={styles.noPhoto} />
                      <Image
                        source={{ uri: player.player.photo }}
                        style={{ width: '100%', height: '100%' }}
                        resizeMode="cover"
                      />
                    )}
                  </View>
                  <Text style={styles.playerName}>{player.player.name}</Text>
                  {/* <Text style={styles.playerPosition}>{player.statistics.}</Text> */}
                </View>
              ))}
              
              {/* Large placeholder card */}
              <View style={styles.largePlayerCard}>
                <View style={styles.largePlayerPhoto}>
                  <View style={styles.largePhotoPlaceholder} />
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backButton: {
    padding: 8,
  },
  backArrow: {
    fontSize: 20,
    color: '#374151',
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
  },
  headerSpacer: {
    width: 36,
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  matchCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
  },
  matchTeams: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  teamInfo: {
    alignItems: 'center',
    flex: 1,
  },
  teamLogo: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  liverpoolLogo: {
    backgroundColor: '#DC2626',
  },
  logoText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  teamName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
    textAlign: 'center',
  },
  matchScore: {
    alignItems: 'center',
    flex: 1,
  },
  scoreText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F59E0B',
    marginBottom: 4,
  },
  matchDate: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 2,
  },
  competition: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  formContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  formBox: {
    padding: 8,
    borderRadius: 6,
    alignItems: 'center',
    minWidth: 50,
  },
  formResult: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 2,
  },
  formCompetition: {
    color: '#FFFFFF',
    fontSize: 10,
  },
  leagueTabs: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 4,
    marginBottom: 16,
  },
  leagueTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeLeagueTab: {
    backgroundColor: '#FFFFFF',
  },
  leagueTabText: {
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  activeLeagueTabText: {
    color: '#1F2937',
    fontWeight: '600',
  },
  standingsTable: {
    gap: 12,
  },
  standingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  positionBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  currentTeamBadge: {
    backgroundColor: '#3B82F6',
  },
  positionText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#374151',
  },
  currentTeamText: {
    color: '#FFFFFF',
  },
  standingTeamName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  currentTeamName: {
    fontWeight: '600',
    color: '#1F2937',
  },
  standingPoints: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    width: 30,
    textAlign: 'center',
  },
  formDots: {
    flexDirection: 'row',
    gap: 4,
  },
  formDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  rankingCard: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
  },
  rankingLabel: {
    fontSize: 16,
    color: '#9CA3AF',
    marginBottom: 8,
  },
  rankingNumber: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#6366F1',
    marginBottom: 8,
  },
  rankingSubtext: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  squadGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  playerCard: {
    width: (width - 64) / 2,
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
  },
  playerPhoto: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 8,
    overflow: 'hidden',
  },
  photoPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoText: {
    fontSize: 24,
  },
  noPhoto: {
    width: '100%',
    height: '100%',
    backgroundColor: '#D1D5DB',
  },
  playerName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 4,
  },
  playerPosition: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  largePlayerCard: {
    width: width - 64,
    height: 120,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  largePlayerPhoto: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  largePhotoPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#D1D5DB',
    borderRadius: 40,
  },
  bottomNav: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  activeNavItem: {
    borderTopWidth: 2,
    borderTopColor: '#6366F1',
  },
  navIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  navLabel: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  activeNavLabel: {
    color: '#6366F1',
    fontWeight: '600',
  },
});

export default TeamDetailsScreen;