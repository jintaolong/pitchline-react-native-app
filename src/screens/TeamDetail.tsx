import { RouteProp, useNavigation } from '@react-navigation/native';
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
import { getLeagueStanding, getTeamDetails } from '../services/teamService';
import { TeamDto, TeamFixtureDto } from '../dtos/Teams';
import { LeagueStandingDto, TeamStandingDto } from '../dtos/Leagues';
import { RecentFixture, Team } from '../models/Teams';
import { League, Standing } from '../models/Leagues';
import PitchLineStandingTable from '../components/StandingTable';

const { width } = Dimensions.get('window');

type TeamDetailsScreenRouteProp = RouteProp<{ params: { teamId: number } }, 'params'>;

const TeamDetailsScreen = ({route}: {route: TeamDetailsScreenRouteProp}) => {
  const navigation = useNavigation();
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
    fixtures: [],
  });
  const [teamLeagues, setTeamLeagues] = useState<League | null>(null);
  const [mostRecentFixture, setMostRecentFixture] = useState<TeamFixtureDto | undefined>(undefined);
  // const [domesticLeagueStanding, setDomesticLeagueStanding] = useState<Standing[]>([]);
  useEffect(() => {
    getTeamDetails(teamId).then((data: TeamDto | null) => {
      if(!!data){
        setTeamDetail(data);
      }
    });
  }, [teamId]);

  const [recentFixtures, setRecentFixtures] = useState<RecentFixture[]>([]);
  useEffect(() => {
    // update standing
    getLeagueStanding(teamDetail.team.id, new Date().getFullYear()).then((data: LeagueStandingDto | null) => {
      if(!!data){
        setTeamLeagues({
          id: data.league.id,
          name: data.league.name,
          country: data.league.country,
          logo: data.league.logo,
          flag: data.league.flag,
          season: data.season,
          currentSeason: data.season,
          currentStandings: data.standings.map((standingGroup: TeamStandingDto[]) => {
            return standingGroup.map((standing: TeamStandingDto) => {
              return {
                position: standing.rank,
                team: {
                  id: standing.team.id,
                  name: standing.team.name,
                  logo: standing.team.logo,
                },
                group: standing.group,
                points: standing.points,
                form: standing.form.split(''),
              } as Standing;
            });
          }),
        } as League);
        // setDomesticLeagueStanding();
      }
    });
    // update recent form
    if (teamDetail && teamDetail.fixtures.length > 0) {
      const today = new Date();
      const recentPastForm = teamDetail.fixtures.filter(fixture => {
        return fixture.fixture.date && new Date(fixture.fixture.date) < today;
      }).slice(-5, undefined).map((fixture: TeamFixtureDto) => {
        let thisTeam = fixture.teams.home.id == teamId ? fixture.teams.home : fixture.teams.away;
        let opponentTeam = fixture.teams.home.id == teamId ? fixture.teams.away : fixture.teams.home;
        return {
          result: thisTeam.winner ? 'W' : opponentTeam.winner ? 'L' : 'D',
          competition: fixture.league.name,
          fixtureId: fixture.fixture.id,
          home: {
            id: fixture.teams.home.id,
            name: fixture.teams.home.name
          } as Team,
          away: {
            id: fixture.teams.away.id,
            name: fixture.teams.away.name
          } as Team,
          date: fixture.fixture.date,
        } as RecentFixture
      }); // Get the last 5 past fixtures
      const futureForm = teamDetail.fixtures.filter(fixture => {
        return fixture.fixture.date && new Date(fixture.fixture.date) > today;
      }).slice(undefined, 5).map((fixture: TeamFixtureDto) => {
        return {
          result: 'O',
          competition: fixture.league.name,
          fixtureId: fixture.fixture.id,
          home: {
            id: fixture.teams.home.id,
            name: fixture.teams.home.name
          } as Team,
          away: {
            id: fixture.teams.away.id,
            name: fixture.teams.away.name
          } as Team,
          date: fixture.fixture.date,
        } as RecentFixture
      });  // Get the next 5 future fixtures
      setRecentFixtures([...recentPastForm, ...futureForm])
      // get most recent one fixture
      // const mostRecentFixture = recentPastForm.reduce((latest, current) => {
      //   return new Date(current.date) > new Date(latest.date) ? current : latest;
      // }, recentPastForm[0]);
      const mostRecentFixture = teamDetail.fixtures.filter(fixture => {
        return fixture.fixture.date && new Date(fixture.fixture.date) < today;
      }).sort((a, b) => {
        return new Date(b.fixture.date).getTime() - new Date(a.fixture.date).getTime();
      }).at(0);
      setMostRecentFixture(mostRecentFixture);
    }
    
    console.log('Recent Form:', recentFixtures);
  }, [teamDetail]);

  // const leagueStandings = [
  //   { position: 1, team: 'Arsenal', points: 30, form: ['W', 'W', 'W', 'W', 'W'] },
  //   { position: 2, team: 'Manchester City', points: 29, form: ['W', 'W', 'W', 'W', 'D'] },
  //   { position: 3, team: 'Liverpool FC', points: 27, form: ['W', 'W', 'W', 'W', 'W'] },
  //   { position: 4, team: 'Chelsea', points: 25, form: ['W', 'W', 'W', 'W', 'W'] },
  //   { position: 5, team: 'Tottenham', points: 23, form: ['L', 'L', 'W', 'W', 'W'] }
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
                    {mostRecentFixture?.teams.home.logo ? (
                      <Image
                        source={{ uri: mostRecentFixture.teams.home.logo }}
                        style={{ width: 24, height: 24, borderRadius: 12 }}
                        resizeMode="contain"
                      />
                    ) : (
                      <Text style={styles.logoText}>
                        {mostRecentFixture?.teams.home.name?.charAt(0) ?? ''}
                      </Text>
                    )}
                  </View>
                  <Text style={styles.teamName}>{mostRecentFixture?.teams.home.name ?? ''}</Text>
                </View>
                
                <View style={styles.matchScore}>
                  <Text style={styles.matchDate}>
                  {mostRecentFixture?.fixture.date
                    ? (() => {
                      const d = new Date(mostRecentFixture.fixture.date);
                      const yyyy = d.getFullYear();
                      const mm = String(d.getMonth() + 1).padStart(2, '0');
                      const dd = String(d.getDate()).padStart(2, '0');
                      return `${yyyy}-${mm}-${dd}`;
                    })()
                    : ''}
                  </Text>
                  <Text style={styles.scoreText}>{mostRecentFixture?.goals.home ?? 0} - {mostRecentFixture?.goals.away ?? 0}</Text>
                  <Text style={styles.matchDate}>
                  {mostRecentFixture?.fixture.date
                    ? (() => {
                      const d = new Date(mostRecentFixture.fixture.date);
                      let hours = d.getUTCHours();
                      const minutes = d.getUTCMinutes();
                      const ampm = hours >= 12 ? ' PM' : ' AM';
                      hours = hours % 12;
                      hours = hours ? hours : 12; // the hour '0' should be '12'
                      const min = String(minutes).padStart(2, '0');
                      return `${hours}:${min}${ampm} GMT`;
                    })()
                    : ''}
                  </Text>
                  <Text style={styles.competition}>{mostRecentFixture?.league.name ?? ''}</Text>
                </View>
                
                <View style={styles.teamInfo}>
                  <View style={styles.teamLogo}>
                    {mostRecentFixture?.teams.away.logo ? (
                      <Image
                        source={{ uri: mostRecentFixture.teams.away.logo }}
                        style={{ width: 24, height: 24, borderRadius: 12 }}
                        resizeMode="contain"
                      />
                    ) : (
                      <Text style={styles.logoText}>
                        {mostRecentFixture?.teams.home.name?.charAt(0) ?? ''}
                      </Text>
                    )}
                  </View>
                  <Text style={styles.teamName}>{mostRecentFixture?.teams.away.name ?? ''}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Form & Upcoming */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Form & Upcoming</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginHorizontal: -8}}>
              <View style={[styles.formContainer, {paddingHorizontal: 8}]}>
              {recentFixtures.map((form, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                  styles.formBox,
                  form.result === 'W'
                    ? styles.formWin
                    : form.result === 'L'
                    ? styles.formLost
                    : form.result === 'D'
                    ? styles.formDraw
                    : styles.formFuture,
                  ]}
                  onPress={() => {
                  // @ts-ignore
                  if (form.fixtureId) {
                    // @ts-ignore
                    if (typeof navigation !== 'undefined') {
                    navigation.navigate(
                      form.result !== 'O' ? 'Postmatch' : 'Prematch', 
                      { fixtureId: form.fixtureId }
                    );
                    }
                  }
                  }}
                >
                  <Text style={styles.formResult}>{form.result}</Text>
                  <Text style={styles.formCompetition}>
                  {form.competition
                    .split(' ')
                    .map(word => word[0])
                    .join('')
                    .toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
              </View>
            </ScrollView>
          </View>

          {/* League Standings */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>League Standings</Text>
            
            {/* League Tabs */}
            <View style={styles.leagueTabs}>
              {teamLeagues && teamLeagues.currentStandings && teamLeagues.currentStandings.length > 0 && teamLeagues.currentStandings.map((standing: Standing[], index) => {
                let leagueName =  `Unknown League ${index + 1}`;
                if (standing.length > 0){
                  leagueName = standing[0].group;
                  if (leagueName === 'Domestic League') {
                    setActiveLeague('Domestic League');
                  }
                }
                return (
                  <TouchableOpacity
                    key={index}
                    style={[styles.leagueTab, (activeLeague === leagueName || teamLeagues.currentStandings.length === 1) && styles.activeLeagueTab]}
                    onPress={() => setActiveLeague(leagueName)}
                  >
                    <Text style={[styles.leagueTabText, activeLeague === leagueName && styles.activeLeagueTabText]}>
                      {leagueName}
                    </Text>
                  </TouchableOpacity>
                )
              })}
            </View>

            {/* Standings Table */}
            { teamLeagues && teamLeagues.currentStandings && teamLeagues.currentStandings.length > 0 && teamLeagues.currentStandings.map((standing: Standing[], index) => (
              <PitchLineStandingTable key={index} standings={standing} teamId={teamId} />
            ))}
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
    // backgroundColor: '#6366F1',
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
  formWin: {
    backgroundColor: '#10B981'
  },
  formLost: {
    backgroundColor: '#EF4444'
  },
  formDraw: {
    backgroundColor: '#F59E0B'
  },
  formFuture: {
    backgroundColor: '#3B82F6'
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