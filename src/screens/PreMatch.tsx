import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  Dimensions,
  Image
} from 'react-native';
import PitchlinePieChart from '../components/PieChart';
import PitchlineComparisonBarChart from '../components/ComparisonBarChart';
import WDLBarChart from '../components/WDLBarChart';
// import Slider from '@react-native-community/slider';
import { getFixture, getMatchLineups } from '../services/matchService';
import { Lineup, LineupPlayer } from '../models/Lineups';

const { width } = Dimensions.get('window');

import { RouteProp, useNavigation } from '@react-navigation/native';
import log from '../utils/logger';
import { LineupsResponseDto } from '../dtos/Lineups';
import { getH2HResults, getH2HStats, getLeagueStanding } from '../services/teamService';
import { FixtureResponseDto } from '../dtos/Fixtures';
import { Fixture, Team, Venue } from '../models/Fixtures';
import { MatchDto, ResultsDto } from '../dtos/Results';
import { H2HResults } from '../models/Results';
import H2HStats from '../components/H2HStats';
import ValveSelector from '../components/ValveSelector';
import { H2HStatsDto } from '../dtos/Stats';
import { Stats } from '../models/Stats';
import { fixtureDtoToFixture, leagueStandingDtoToLeague, lineUpDtoToLineupPlayer } from '../utils/mappers';
import PitchLineStartingXI from '../components/StartingXI';
import PitchLineStandingTable from '../components/StandingTable';
import { Standing } from '../models/Leagues';
import { LeagueStandingDto } from '../dtos/Leagues';
import { globalStyles } from '../styles/globalStyles';
import { mockEmptyFixture } from '../utils/mocks';

type PreMatchDetailsScreenRouteProp = RouteProp<{ params: { fixtureId: number } }, 'params'>;

const PreMatchDetailsScreen = ({ route }: { route: PreMatchDetailsScreenRouteProp }) => {
  const navigation = useNavigation();
  const {fixtureId} = route.params;
  log.debug(`PreMatchDetailsScreen: fixtureId=${fixtureId}`);
  const [fixture, setFixture] = useState<Fixture>(mockEmptyFixture());
  const [h2hResults, setH2hResults] = useState<H2HResults[]>([]);
  const [homeLineup, setHomeLineup] = useState<Lineup | null>(null);
  const [awayLineup, setAwayLineup] = useState<Lineup | null>(null);
  const [statsWindow, setStatsWindow] = useState(1);
  const [stats, setStats] = useState<Stats>({
    homeWin: -1,
    homeDraw: -1,
    homeLost: -1,
    homeGoals: -1,
    awayGoals: -1,
    homeShots: -1,
    awayShots: -1,
  } as Stats);
  const [standing, setStanding] = useState<Standing[]>([]);

  React.useEffect(() => {
    setStanding([]); // Reset standing when fixtureId changes
    getFixture(fixtureId).then((data: FixtureResponseDto | null) => {
      if (!!data){
        log.debug(`Got fixture with id ${fixtureId} as following`);
        setFixture(fixtureDtoToFixture(data));
      }
    })
  }, [fixtureId]);

  React.useEffect(() => {
    getMatchLineups(fixtureId).then((data: LineupsResponseDto | null) => {
      console.log('Match lineups:', data);  
      if (!!data) {
        if (data.lineups.length == 2){
          const home = lineUpDtoToLineupPlayer(data.lineups[0]);
          const away = lineUpDtoToLineupPlayer(data.lineups[1]);
          setHomeLineup(home);
          setAwayLineup(away);
        }else{
          log.debug('Unexpected number of lineups:', data.lineups.length);
        }
      } else {
        log.error('Failed to fetch match lineups');
      }
    });
  }, [fixtureId]);

  React.useEffect(() => {
    getH2HResults(fixture.homeTeam.teamId, fixture.awayTeam.teamId).then(
    (data: ResultsDto | null) => {
      if (!!data){
        setH2hResults(
          data?.matches.map((result: MatchDto) => {
            return {
              fixtureId: result.fixture.id,
              leagueShort: result.league.name,
              homeScore: result.goals.home,
              awayScore: result.goals.away,
              winDrawLose:
                result.goals.home > result.goals.away
                  ? "W"
                  : result.goals.home < result.goals.away
                  ? "L"
                  : "D",
            } as H2HResults
          })
        );
      }
    }
  );
  }, [fixtureId]);

  React.useEffect(() => {
    if(fixture){
        log.debug(`PostMatch: Fetching league standings for fixture: ${fixture.league.id} in year ${new Date().getFullYear()}`);
          getLeagueStanding(fixture.league.id, new Date().getFullYear()).then((data: LeagueStandingDto | null) => {
          if(!!data){
            let league = leagueStandingDtoToLeague(data) || null;
            league 
              && league.currentStandings 
              && league.currentStandings.length > 0 
              && league.currentStandings.filter((standing: Standing[], index) => {
                let leagueName = `Unknown League ${index + 1}`;
                if (standing.length > 0) {
                  leagueName = standing[0].group;
                  if (leagueName === 'Domestic League') {
                    return true;
                  }
                }
            });
            if (league && league.currentStandings.length > 0) {
              setStanding(
                league.currentStandings[0] || []
              )
            }
          }
        });
        }
  }, [fixture])

  React.useEffect(() => {
    log.debug(`Stats window selected to ${statsWindow}`);
    getH2HStats(fixture.homeTeam.teamId, fixture.awayTeam.teamId, statsWindow).then((
      data : H2HStatsDto[]
    ) => {
      if (data && data.length > 0) {
        const summed = data.reduce((acc, curr) => {
          return {
            _id: acc._id,
            season: acc.season,
            team1_id: acc.team1_id,
            team2_id: acc.team2_id,
            team1_wins: acc.team1_wins + (curr.team1_wins || 0),
            team2_wins: acc.team2_wins + (curr.team2_wins || 0),
            team1_goals: acc.team1_goals + (curr.team1_goals || 0),
            team2_goals: acc.team2_goals + (curr.team2_goals || 0),
            home_matches: acc.home_matches + (curr.home_matches || 0),
            draws: acc.draws + (curr.draws || 0),
          } as H2HStatsDto;
        }, {
          _id: '',
          season: 0,
          team1_id: 0,
          team2_id: 0,
          home_matches: 0,
          team1_goals: 0,
          team2_goals: 0,
          team1_wins: 0,
          team2_wins: 0,
          draws: 0,
        });
        // log.debug(summed);
        setStats({
          homeWin: summed.team1_wins,
          homeDraw: summed.draws,
          homeLost: summed.team2_wins,
          homeGoals: summed.team1_goals,
          awayGoals: summed.team2_goals,
          homeShots: 0,
          awayShots: 0,
        } as Stats);
      }else{
        setStats({
          homeWin: 0,
          homeDraw: 0,
          homeLost: 0,
          homeGoals: 0,
          awayGoals: 0,
          homeShots: 0,
          awayShots: 0,
        } as Stats);
      }

    })

  }, [statsWindow])

  return (
      <SafeAreaView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton}>
              <Text style={styles.backArrow}>←</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{fixture.league.name}</Text>
            <View style={styles.headerSpacer} />
          </View>

          {/* Match Info */}
          <View style={styles.matchInfo}>
            <Text style={styles.matchDate}>{fixture.kickoffDate}</Text>

            <View style={styles.teamsContainer}>
              <TouchableOpacity onPress={() => {
                 if (fixture.homeTeam.teamId !== 0){
                   navigation.navigate('TeamDetails', {teamId: fixture.homeTeam.teamId})
                 }
                }}>
                <View style={styles.teamSection}>
                  <View style={styles.teamLogo}>
                    {fixture.homeTeam.logoUrl ? (
                      <Image
                        source={{ uri: fixture.homeTeam.logoUrl }}
                        style={{ width: 32, height: 32, resizeMode: 'contain' }}
                      />
                    ) : (
                      <Text style={styles.logoText}>{fixture.homeTeam.short}</Text>
                    )}
                  </View>
                  <Text style={styles.teamName}>{fixture.homeTeam.name}</Text>
                </View>
              </TouchableOpacity>
              <View style={styles.timeSection}>
                <Text style={styles.matchTime}>{fixture.kickoffTime.toLocaleUpperCase()}</Text>
                <Text style={styles.venue}>
                  {fixture.venue && typeof fixture.venue === 'object' && fixture.venue.name}
                </Text>
                <Text style={styles.venue}>
                  {fixture.venue && typeof fixture.venue === 'object' && fixture.venue.city}
                </Text>
              </View>
              <TouchableOpacity onPress={() => {
                 if (fixture.awayTeam.teamId !== 0){
                   navigation.navigate('TeamDetails', {teamId: fixture.awayTeam.teamId})
                 }
                }}>

                <View style={styles.teamSection}>
                  <View style={styles.teamLogo}>
                    {fixture.awayTeam.logoUrl ? (
                      <Image
                        source={{ uri: fixture.awayTeam.logoUrl }}
                        style={{ width: 32, height: 32, resizeMode: 'contain' }}
                      />
                    ) : (
                      <Text style={styles.logoText}>{fixture.awayTeam.short}</Text>
                    )}
                  </View>
                  <Text style={styles.teamName}>{fixture.awayTeam.name}</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Starting XI */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Starting XI</Text>
            {homeLineup && awayLineup ? (
                <PitchLineStartingXI 
                  homeLineup={homeLineup}
                  awayLineup={awayLineup}
                />
              ) : (
                <Text  style={globalStyles.emptyListText}>No lineups available</Text>
              )
            }
          </View>

          {/* Stats */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Stats</Text>
            
            {/* Recent Form */}
            <Text style={styles.statsLabel}>Head-to-head</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
              {/* <View style={styles.formContainer}> */}
              {h2hResults.length > 0 ? 
                h2hResults.map((result: H2HResults) => (
                  <H2HStats 
                    key={result.fixtureId}
                    result={result}
                  />
                )) :(
                  <View style={globalStyles.emptyListContainer}> 
                    <Text style={globalStyles.emptyListText}>No head-to-head records found</Text>
                  </View>
                )
              }
            {/* </View> */}
            </ScrollView>
            <View>
              <ValveSelector 
                onChange={(newWindow: number) => {
                  setStatsWindow(newWindow);
                }}
              />
            </View>
             {/* Win/Draw/Loss */}
            {stats.homeWin !== -1 && stats.homeDraw !== -1 && stats.homeLost !== -1 && (
              <View style={styles.statsRow}>
                <Text style={styles.statsLabel}>Win/Draw/Loss</Text>
                <WDLBarChart win={stats.homeWin} draw={stats.homeDraw} loss={stats.homeLost} />
              </View>
            )}

            {/* Goals Scored */}
            { stats.homeGoals !== -1 && stats.awayGoals !== -1 && (
              <View style={styles.statsRow}>
              <Text style={styles.statsLabel}>Goals scored</Text>
              <View style={styles.goalsContainer}>
                <PitchlinePieChart
                  data={[
                    {
                      key: fixture.homeTeam.name,
                      value: stats.homeGoals,
                      svg: { fill: '#6366F1' },
                    },
                    {
                      key: fixture.awayTeam.name,
                      value: stats.awayGoals,
                      svg: { fill: '#3B82F6' },
                    },
                  ]
                } 
                  radius={50}
                />
              </View>
            </View>
            )}
            {/* <View style={styles.statsRow}>
              <Text style={styles.statsLabel}>Goals conceded</Text>
              <PitchlineComparisonBarChart
                a={stats.awayGoals}
                b={stats.homeGoals}
              />
            </View> */}

            {/* Shots */}
            { stats.homeShots !== -1 && stats.awayShots !== -1 && (
              <View style={styles.statsRow}>
                <Text style={styles.statsLabel}>Total Shots</Text>
                <PitchlineComparisonBarChart
                  a={stats.homeShots}
                  b={stats.awayShots}
                />
              </View>
            )}
          </View>

          {/* Standings */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Standings</Text>
            { standing && standing.length > 0 ?
              (
                <View>
                  <PitchLineStandingTable 
                        standings={standing}
                        teamId={fixture?.homeTeam.teamId || undefined}
                        teamAwayId={fixture?.awayTeam.teamId || undefined}
                        onPress={(id: number) => {
                          navigation.navigate('TeamDetails', { teamId : id });
                        }}       
                      />
                  <Text style={globalStyles.footNotes}>
                    Last updated: {standing && standing.length > 0 && standing[0].lastUpdated
                      ? standing[0].lastUpdated
                      : 'N/A'}
                  </Text>
                </View>
              )
              : <Text style={globalStyles.emptyListText}>No standings available</Text>
            }
          </View>
        </ScrollView>
      </SafeAreaView>
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
  matchInfo: {
    padding: 20,
    alignItems: 'center',
  },
  matchDate: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 8,
  },
  teamsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  teamSection: {
    alignItems: 'center',
    flex: 1,
  },
  teamLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    // backgroundColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  arsenalLogo: {
    backgroundColor: '#DC2626',
  },
  logoText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  teamName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  timeSection: {
    alignItems: 'center',
    flex: 1,
  },
  matchTime: {
    fontSize: 18,
    letterSpacing: 1,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  venue: {
    fontSize: 12,
    textAlign: 'center',
    color: '#9CA3AF',
  },
  section: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  lineupContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  teamLineup: {
    flex: 1,
  },
  playerText: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 4,
  },
  rightAlign: {
    textAlign: 'right',
  },
  formContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
    alignSelf: 'center',
    maxWidth: 60, // or use maxWidth: 320,
  },
  formBox: {
    padding: 8,
    borderRadius: 6,
    alignItems: 'center',
    minWidth: 50,
  },
  formText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  formSubtext: {
    color: '#FFFFFF',
    fontSize: 12,
  },
  formLeague: {
    color: '#FFFFFF',
    fontSize: 10,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#374151',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  statsRow: {
    marginBottom: 20,
  },
  statsLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  wdlContainer: {
    flexDirection: 'row',
    height: 30,
    borderRadius: 4,
    overflow: 'hidden',
  },
  wdlBar: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  wdlText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  goalsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  standingsContainer: {
    gap: 12,
  },
  standingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  position: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    width: 20,
  },
  smallLogo: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  smallLogoText: {
    fontSize: 10,
  },
  standingTeam: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  standingGames: {
    fontSize: 14,
    color: '#9CA3AF',
    width: 30,
    textAlign: 'center',
  },
  standingDiff: {
    fontSize: 14,
    color: '#9CA3AF',
    width: 30,
    textAlign: 'center',
  },
  standingPoints: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    width: 30,
    textAlign: 'center',
  },
});

export default PreMatchDetailsScreen;