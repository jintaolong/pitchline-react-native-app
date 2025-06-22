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
import Slider from '@react-native-community/slider';
import { getFixture, getMatchLineups } from '../services/matchService';
import { LineupPlayer } from '../models/Lineups';

const { width } = Dimensions.get('window');

import { RouteProp, useNavigation } from '@react-navigation/native';
import log from '../utils/logger';
import { LineupsResponseDto } from '../dtos/Lineups';
import { getH2HResults } from '../services/teamService';
import { FixtureResponseDto } from '../dtos/Fixtures';
import { Fixture, Team, Venue } from '../models/Fixtures';
import { MatchDto, ResultsDto } from '../dtos/Results';
import { H2HResults } from '../models/Results';

type PreMatchDetailsScreenRouteProp = RouteProp<{ params: { fixtureId: number } }, 'params'>;

const PreMatchDetailsScreen = ({ route }: { route: PreMatchDetailsScreenRouteProp }) => {
  const navigation = useNavigation();
  const {fixtureId} = route.params;
  log.debug(`PreMatchDetailsScreen: fixtureId=${fixtureId}`);

  const summaryOptions = [
    { label: '1 Month', value: 1 },
    { label: '3 Months', value: 3 },
    { label: '6 Months', value: 6 },
    { label: '1 Year', value: 12 },
    { label: '2 Years', value: 24 },
    // { label: 'Last 5 Years', value: 60 },
    // { label: 'Last 10 Years', value: 120 },
  ];

  const [summaryWindow, setSummaryWindow] = useState(3); // Default: last 3 months
  const [homeLineup, setHomeLineup] = useState<LineupPlayer[]>([]);
  const [awayLineup, setAwayLineup] = useState<LineupPlayer[]>([]);
  // const homeLineup : LineupPlayer[] = [];
  // const awayLineup: LineupPlayer[] = [];
  const [fixture, setFixture] = useState<Fixture>({
    league: '',
    kickoffDate: '',
    kickoffTime: '',
    venue: {
      name: '',
      city: ''
    } as Venue,
    homeTeam: {
      name: 'Home',
      teamId: 0,
      logoUrl: '',
    } as Team,
    awayTeam: {
      name: 'Away',
      teamId: 0,
      logoUrl: '',
    } as Team
  });

  React.useEffect(() => {
    getFixture(fixtureId).then((data: FixtureResponseDto | null) => {
      if (!!data){
        log.debug(`Got fixture with id ${fixtureId} as following`);
        // log.debug(data);
        // Format date string like "2025-06-22T01:00:00+00:00" to "Sat 17 May 2025"
        const kickoffDateObj = new Date(data.fixture.fixture.date);
        setFixture({
          league: data.fixture.league.name,
          kickoffDate: kickoffDateObj.toLocaleDateString('en-GB', {
            weekday: 'short',
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          }).replace(/,/g, ''),
          kickoffTime: kickoffDateObj.toLocaleTimeString('en-GB', {
            hour: '2-digit', 
            minute: '2-digit', 
            hour12: true
          }),
          venue: {
            name: data.fixture.fixture.venue.name,
            city: data.fixture.fixture.venue.city,
          } as Venue,
          homeTeam: {
            name: data.fixture.teams.home.name,
            teamId: data.fixture.teams.home.id,
            logoUrl: data.fixture.teams.home.logo
          } as Team,
          awayTeam: {
            name: data.fixture.teams.away.name,
            teamId: data.fixture.teams.away.id,
            logoUrl: data.fixture.teams.away.logo
          } as Team,
        } as Fixture
      );
      }
    })
  }, [fixtureId]);

  React.useEffect(() => {
    getMatchLineups(fixtureId).then((data: LineupsResponseDto | null) => {
      // Process the data if needed
      console.log('Match lineups:', data);  
      if (!!data) {
        // You can update state or perform actions with the data here
        // For example, you might want to set the lineups in state
        // setLineups(data.lineups);
        if (data.lineups.length == 2){
          const home = data.lineups[0].startXI.map(player => ({
            number: player.player.number,
            name: player.player.name
          } as LineupPlayer));
          const away = data.lineups[1].startXI.map(player => ({
            number: player.player.number,
            name: player.player.name
          } as LineupPlayer));
          setHomeLineup(home);
          setAwayLineup(away);
          // console.log('Home Lineup:', homeLineup);
          // console.log('Away Lineup:', awayLineup);
        }else{
          console.error('Unexpected number of lineups:', data.lineups.length);
        }
        // homeLineup = data.lineups.find(lineup => lineup.team.name === "Manchester Utd")?.startXI || [];
      } else {
        console.error('Failed to fetch match lineups');
      }
    });
  }, [fixtureId]);

  let h2hResults : H2HResults[] = [];

  getH2HResults(fixture.homeTeam.teamId, fixture.awayTeam.teamId).then(
    (data: ResultsDto | null) => {
      if (!!data){
        h2hResults = data?.matches.map((result: MatchDto) => {
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
        });
      }
    }
  );
  // React.useEffect(() => {
  //   getH2HResults()
  // }, [fixtureId])
  
  const recentForm = [
    { result: 'W', color: '#10B981' },
    { result: 'L', color: '#EF4444' },
    { result: 'W', color: '#10B981' },
    { result: 'D', color: '#F59E0B' },
    { result: 'D', color: '#F59E0B' }
  ];

  const goalScored = [
    {
      key: "Man Utd",
      value: 40,
      svg: { fill: '#6366F1' },
    },
    {
      key: "Arsenal",
      value: 30,
      svg: { fill: '#3B82F6' },
    },
  ]

  const getSummaryLabel = (value: number) => {
    const found = summaryOptions.find(opt => opt.value === value);
    return found ? found.label : `Last ${value} Months`;
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
            <Text style={styles.headerTitle}>{fixture.league}</Text>
            <View style={styles.headerSpacer} />
          </View>

          {/* Match Info */}
          <View style={styles.matchInfo}>
            <Text style={styles.matchDate}>{fixture.kickoffDate}</Text>
            <View style={styles.teamsContainer}>
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
              
              <View style={styles.timeSection}>
                <Text style={styles.matchTime}>{fixture.kickoffTime.toLocaleUpperCase()}</Text>
                <Text style={styles.venue}>
                  {fixture.venue && typeof fixture.venue === 'object' && fixture.venue.name}
                </Text>
                <Text style={styles.venue}>
                  {fixture.venue && typeof fixture.venue === 'object' && fixture.venue.city}
                </Text>
              </View>
              
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
            </View>
          </View>

          {/* Starting XI */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Starting XI</Text>
            <View style={styles.lineupContainer}>
              <View style={styles.teamLineup}>
                {homeLineup.map((player, index) => (
                  <Text key={index} style={styles.playerText}>
                    {player.number} {player.name}
                  </Text>
                ))}
              </View>
              <View style={styles.teamLineup}>
                {awayLineup.map((player, index) => (
                  <Text key={index} style={[styles.playerText, styles.rightAlign]}>
                    {player.name} {player.number}
                  </Text>
                ))}
              </View>
            </View>
          </View>

          {/* Stats */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Stats</Text>
            
            {/* Recent Form */}
            <View style={styles.formContainer}>
              {recentForm.map((form, index) => (
                <View key={index} style={[styles.formBox, { backgroundColor: form.color }]}>
                  <Text style={styles.formText}>{form.result}</Text>
                  <Text style={styles.formSubtext}>
                    {index === 0 ? '3-2' : index === 1 ? '1-2' : index === 2 ? '1-0' : index === 3 ? '0-0' : '1-1'}
                  </Text>
                  <Text style={styles.formLeague}>
                    {index < 3 ? 'PL' : index === 3 ? 'UCL' : 'PL'}
                  </Text>
                </View>
              ))}
            </View>

            {/* Summary Window */}
            <View style={styles.summaryContainer}>
              <Text style={styles.summaryLabel}>Summary window:</Text>
              <Text style={styles.summaryValue}>{getSummaryLabel(summaryWindow)}</Text>
            </View>
            <View style={{ width: '100%', height: 24, justifyContent: 'center', marginBottom: 16 }}>
              {/* Custom thick track */}
              <View
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                height: 2,
                borderRadius: 6,
                backgroundColor: '#6366F1',
              }}
              />
              <Slider
                minimumValue={summaryOptions[0].value}
                maximumValue={summaryOptions[summaryOptions.length - 1].value}
                step={1}
                value={summaryWindow}
                onValueChange={(val: number) => {
                  const nearest = summaryOptions.reduce((prev, curr) =>
                  Math.abs(curr.value - val) < Math.abs(prev.value - val) ? curr : prev
                  );
                  setSummaryWindow(nearest.value);
                }}
                minimumTrackTintColor="transparent"
                maximumTrackTintColor="transparent"
                thumbTintColor="#6366F1"
                // trackStyle={{ height: 12, borderRadius: 6, backgroundColor: 'transparent' }}
                style={{ height: 24 }}
              />
            </View>
            
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
              {summaryOptions.filter((opt) => {
                return opt.value == 1 || opt.value == 12 || opt.value == 24;
              }).map(opt => (
                <Text key={opt.value} style={{ fontSize: 10, color: '#6B7280' }}>{opt.label}</Text>
              ))}
            </View>

            {/* Win/Draw/Loss */}
            <View style={styles.statsRow}>
              <Text style={styles.statsLabel}>Win/Draw/Loss</Text>
              <WDLBarChart win={85} draw={53} loss={69} />
            </View>

            {/* Goals Scored */}
            <View style={styles.statsRow}>
              <Text style={styles.statsLabel}>Goals scored</Text>
              <View style={styles.goalsContainer}>
                <PitchlinePieChart
                  data={goalScored} 
                  radius={50}
                />
              </View>
            </View>

            {/* Goals Conceded */}
            <View style={styles.statsRow}>
              <Text style={styles.statsLabel}>Goals conceded</Text>
              <PitchlineComparisonBarChart
                a={33}
                b={22}
              />
            </View>

            {/* Shots */}
            <View style={styles.statsRow}>
              <Text style={styles.statsLabel}>Shots</Text>
              <PitchlineComparisonBarChart
                a={234}
                b={220}
              />
            </View>
          </View>

          {/* Standings */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Standings</Text>
            <View style={styles.standingsContainer}>
              <View style={styles.standingRow}>
                <Text style={styles.position}>6</Text>
                <View style={[styles.teamLogo, styles.arsenalLogo, styles.smallLogo]}>
                  <Text style={styles.smallLogoText}>A</Text>
                </View>
                <Text style={styles.standingTeam}>Arsenal</Text>
                <Text style={styles.standingGames}>15</Text>
                <Text style={styles.standingDiff}>+14</Text>
                <Text style={styles.standingPoints}>56</Text>
              </View>
              <View style={styles.standingRow}>
                <Text style={styles.position}>11</Text>
                <View style={[styles.teamLogo, styles.smallLogo]}>
                  <Text style={styles.smallLogoText}>MU</Text>
                </View>
                <Text style={styles.standingTeam}>Man Utd</Text>
                <Text style={styles.standingGames}>15</Text>
                <Text style={styles.standingDiff}>-2</Text>
                <Text style={styles.standingPoints}>44</Text>
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