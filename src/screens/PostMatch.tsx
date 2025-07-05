import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  Dimensions,
} from 'react-native';
import { getEvents, getFixture, getFixtureStats, getMatchLineups } from '../services/matchService';
import { Lineup, LineupPlayer } from '../models/Lineups';
import { Fixture } from '../models/Fixtures';
import { MatchStats, MatchStatsDetail, Stats, WordCloudEntry } from '../models/Stats';
import { FixtureDto, FixtureResponseDto } from '../dtos/Fixtures';
import log from '../utils/logger';
import { fixtureDtoToFixture, lineUpDtoToLineupPlayer, teamMatchStatDtoToMatchStatsDetail, leagueStandingDtoToLeague } from '../utils/mappers';
import { LineupsResponseDto } from '../dtos/Lineups';
import { EventDto, EventsResponseDto } from '../dtos/Events';
import { MatchEvent } from '../models/Events';
import { MatchStatDto } from '../dtos/Stats';
import PitchlineComparisonBarChart from '../components/ComparisonBarChart';
import PitchlinePieChart from '../components/PieChart';
import PitchLineTimeline from '../components/Timeline';
import PitchLineStartingXI from '../components/StartingXI';
import PitchLineStandingTable from '../components/StandingTable';
import { getLeagueStanding } from '../services/teamService';
import { LeagueStandingDto } from '../dtos/Leagues';
import { League, Standing } from '../models/Leagues';

const { width } = Dimensions.get('window');

type PostMatchScreenRouteProp = {
  params: {
    fixtureId: number;
  };
};

type PostMatchScreenProps = {
  route: PostMatchScreenRouteProp;
};


const PostMatchScreen = ({ route }: PostMatchScreenProps) => {
  const navigation = useNavigation();
  const { fixtureId } = route.params; // Get fixtureId from route params
  const [activeTab, setActiveTab] = useState('Live');

  const [fixture, setFixture] = useState<Fixture | null>(null);
  const [standing, setStanding] = useState<Standing[]>([]);
  const [homeLineup, setHomeLineup] = useState<Lineup | null>(null);
  const [awayLineup, setAwayLineup] = useState<Lineup | null>(null);
  const [stats, setStats] = useState<MatchStats | null>(null);
  const [matchEvents, setMatchEvents] = useState<MatchEvent[]>([]);
  const [wordCloudWords, setWordCloudWords] = useState<WordCloudEntry[]>([]);

  useEffect(() => {
    getFixture(fixtureId).then((data: FixtureResponseDto | null) => {
      log.debug(`Got data: ${data}`);
      if (!!data){
        setFixture(fixtureDtoToFixture(data));
      }
    });
    getMatchLineups(fixtureId).then((data: LineupsResponseDto | null) => {
      console.log('Match lineups:', data);  
      if (!!data) {
        if (data.lineups.length == 2){
          const home = lineUpDtoToLineupPlayer(data.lineups[0]);
          const away = lineUpDtoToLineupPlayer(data.lineups[1]);
          setHomeLineup(home);
          setAwayLineup(away);
        }else{
          console.error('Unexpected number of lineups:', data.lineups.length);
        }
      } else {
        console.error('Failed to fetch match lineups');
      }
    });

    getFixtureStats(fixtureId).then((data: MatchStatDto | null) => {
      if (!!data) {
        setStats({
          home: teamMatchStatDtoToMatchStatsDetail(data.statistics[0]),
          away: teamMatchStatDtoToMatchStatsDetail(data.statistics[1]),
        } as MatchStats);
      } else {
        log.error('Failed to fetch match stats');
      }
    });
  }, [fixtureId]);

  useEffect(() => {

    // getPostMatchStats(fixtureId).then(setStats);
    getEvents(fixtureId).then((data: EventsResponseDto | null) => {
      if(!!data){
        let events = data.events.map((event: EventDto) => {
          // log.debug("Processing event: ", event);
          // log.debug("Mapping event with team id : ", event.team.id);
          // log.debug("Fixture away team id: ", fixture?.awayTeam.teamId);
          return {
            time: event.time.elapsed + (event.time.extra ? `+${event.time.extra}` : "") + "'",
            event: {
              type: event.type || "",
              details: event.detail || "",
            },
            player: event.player ? {
              id: event.player.id,
              name: event.player.name,
              number: event.player.number || 0,
              image: event.player.photo || undefined, // Use photo if available
            } as LineupPlayer : undefined,
            supportPlayer: event.assist ? {
              id: event.assist.id,
              name: event.assist.name,
              number: event.assist.number || 0,
              image: event.assist.photo || undefined, // Use photo if available
            } as LineupPlayer : undefined,
            team: event.team ? (event.team.id === fixture?.awayTeam.teamId ? 'away' : 'home') : undefined // default as home events
          } as MatchEvent
        });
        setMatchEvents(events);
        // let wordCloud = data.events.map((event: EventDto) => {
        // Aggregate word occurrences by player name and event type
        const wordMap: { [key: string]: { count: number; color: string } } = {};
        // Collect all words from type, detail, and player name into a bag
        data.events.forEach((event: EventDto) => {
          const bag: { word: string; color: string }[] = [];
        // Helper to split and push words
          const pushWords = (str: string | undefined, color: string) => {
            if (!str) return;
            str.split(/\s+/).forEach(word => {
            const upper = word.toUpperCase();
            // Skip if the word is purely numeric or looks like an initial (e.g., "J.")
            if (
              upper &&
              !/^\d+$/.test(upper) &&
              !/^[A-Z]\.$/.test(upper)
            ) {
              bag.push({ word: upper, color });
            }
            });
          };
          // Assign color based on event type
          // Assign a color from a palette based on the word key (for more variety)
          const colorPalette = [
          "#10B981", // green
          "#F59E0B", // yellow
          "#EF4444", // red
          "#3B82F6", // blue
          "#6366F1", // indigo
          "#8B5CF6", // violet
          "#06B6D4", // cyan
          "#EC4899", // pink
          "#84CC16", // lime
          "#F97316", // orange
          ];
          // Use the index of the key in the bag, mod 10, to pick a color
          const key = (event.type || "") + (event.detail || "") + (event.player?.name || "");
          let color = colorPalette[0];
          // Find the index of the key in the bag so far
          const bagIndex = bag.findIndex(({ word }) => word === key.toUpperCase());
          if (bagIndex >= 0) {
            color = colorPalette[bagIndex % colorPalette.length];
          } else {
            // fallback: hash as before if not found
            let hash = 0;
            for (let i = 0; i < key.length; i++) {
            hash = (hash * 31 + key.charCodeAt(i)) % colorPalette.length;
            }
            color = colorPalette[Math.abs(hash)];
          }
          pushWords(event.type, color);
          pushWords(event.detail, color);
          if (event.player && event.player.name) {
            pushWords(event.player.name, color);
          }
          // Count words in wordMap
          bag.forEach(({ word, color }) => {
            if (wordMap[word]) {
              wordMap[word].count += 1;
            } else {
              wordMap[word] = { count: 1, color };
            }
          });
        });

        // Convert to array and map count to font size
        const minFont = 12, maxFont = 32;
        const counts = Object.values(wordMap).map(w => w.count);
        // log.debug(counts);
        const minCount = Math.min(...counts);
        const maxCount = Math.max(...counts);

        const wordCloud: WordCloudEntry[] = Object.entries(wordMap).map(([text, { count, color }]) => {
          // Linear scale for font size
          let size = minFont;
          if (maxCount !== minCount) {
            size = minFont + ((count - minCount) / (maxCount - minCount)) * (maxFont - minFont);
          }
          return { text, size, color };
        });

        setWordCloudWords(wordCloud);
        // })
      }
    });

    if(fixture){
      log.debug(`PostMatch: Fetching league standings for fixture: ${fixture.league.id} in year ${new Date().getFullYear()}`);
      getLeagueStanding(fixture.league.id, new Date().getFullYear()).then((data: LeagueStandingDto | null) => {
      if(!!data){
        let league = leagueStandingDtoToLeague(data) || null;
        league 
          && league.currentStandings 
          && league.currentStandings.length > 0 
          && league.currentStandings.filter((standing: Standing[], index) => {
            let leagueName =  `Unknown League ${index + 1}`;
            if (standing.length > 0){
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
            <Text style={styles.headerTitle}>{fixture?.league.name}</Text>
            <View style={styles.headerSpacer} />
          </View>

          {/* Match Result */}
          <View style={styles.matchResult}>
            <Text style={styles.matchDate}>{fixture?.kickoffDate}</Text>
            <View style={styles.scoreContainer}>
              <View style={styles.teamSection}>
                <TouchableOpacity
                  onPress={() => {
                  if (fixture?.homeTeam.teamId) {
                    navigation.navigate('TeamDetails', { teamId: fixture.homeTeam.teamId });
                  }
                  }}
                  style={styles.teamLogo}
                  activeOpacity={0.7}
                >
                  {fixture?.homeTeam.logoUrl ? (
                  <Image
                    source={{ uri: fixture.homeTeam.logoUrl }}
                    style={{ width: 32, height: 32, resizeMode: 'contain' }}
                  />
                  ) : (
                  <Text style={styles.logoText}>{fixture?.homeTeam.short}</Text>
                  )}
                </TouchableOpacity>
                <Text style={[styles.teamName, { textAlign: 'center' }]}>{fixture?.homeTeam.name}</Text>
              </View>
              
              <View style={styles.scoreSection}>
                <Text style={styles.finalScore}>
                  {fixture?.goals?.home != null ? fixture.goals.home : 0}
                  :
                  {fixture?.goals?.away != null ? fixture.goals.away : 0}
                </Text>
                <Text style={styles.venue}>
                  {fixture?.venue && typeof fixture.venue === 'object' && fixture.venue.name}
                </Text>
                <Text style={styles.venue}>
                  {fixture?.venue && typeof fixture.venue === 'object' && fixture.venue.city}
                </Text>
              </View>
              
              <View style={styles.teamSection}>
                <TouchableOpacity
                  onPress={() => {
                    if (fixture?.awayTeam.teamId) {
                      navigation.navigate('TeamDetails', { teamId: fixture.awayTeam.teamId });
                    }
                  }}
                  style={styles.teamLogo}
                  activeOpacity={0.7}
                >
                  {fixture?.awayTeam.logoUrl ? (
                    <Image
                      source={{ uri: fixture.awayTeam.logoUrl }}
                      style={{ width: 32, height: 32, resizeMode: 'contain' }}
                    />
                  ) : (
                    <Text style={styles.logoText}>{fixture?.awayTeam.short}</Text>
                  )}
                </TouchableOpacity>
                <Text style={[styles.teamName, { textAlign: 'center' }]}>{fixture?.awayTeam.name}</Text>
              </View>
            </View>
          </View>

          {/* Stats */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Stats</Text>
            
            {/* Possession */}
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Possession</Text>
              <PitchlinePieChart
                  data={[
                    {
                      key: fixture?.homeTeam.name || 'Home',
                      value: stats?.home.ballPossession || 0,
                      svg: { fill: '#6366F1' },
                    },
                    {
                      key: fixture?.awayTeam.name || 'Away',
                      value: stats?.away.ballPossession || 0,
                      svg: { fill: '#3B82F6' },
                    },
                  ]}
                radius={50}
              />
            </View>

            {/* Shots on target */}
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Shots on target</Text>
              <PitchlineComparisonBarChart
                  a={stats?.home.shotsOnGoal || 0}
                  b={stats?.away.shotsOnGoal || 0}
              />
            </View>

            {/* Shots off target */}
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Shots off target</Text>
              <PitchlineComparisonBarChart
                  a={stats?.home.shotsOffGoal || 0}
                  b={stats?.away.shotsOffGoal || 0}
              />
            </View>
            {/* Total Shots */}
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Total shots</Text>
              <PitchlineComparisonBarChart
                a={stats?.home.totalShots || 0}
                b={stats?.away.totalShots || 0}
              />
            </View>

            {/* Corners */}
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Corners</Text>
              <PitchlineComparisonBarChart
                a={stats?.home.cornerKicks || 0}
                b={stats?.away.cornerKicks || 0}
              />
            </View>

            {/* Fouls */}
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Fouls</Text>
              <PitchlineComparisonBarChart
                a={stats?.home.fouls || 0}
                b={stats?.away.fouls || 0}
              />
            </View>

            {/* Cards */}
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Cards</Text>
              <PitchlineComparisonBarChart
                a={(stats?.home.yellowCards || 0) + (stats?.home.redCards || 0)}
                b={(stats?.away.yellowCards || 0) + (stats?.away.redCards || 0)}
              />
            </View>
          </View>

          {/* Timeline Tabs */}
          <View style={styles.tabContainer}>
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'Live' && styles.activeTab]}
              onPress={() => setActiveTab('Live')}
            >
              <Text style={[styles.tabText, activeTab === 'Live' && styles.activeTabText]}>Live</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'Density' && styles.activeTab]}
              onPress={() => setActiveTab('Density')}
            >
              <Text style={[styles.tabText, activeTab === 'Density' && styles.activeTabText]}>Density</Text>
            </TouchableOpacity>
          </View>

          {/* Match Timeline */}
          <View style={styles.section}>
            <PitchLineTimeline
              matchEvents={matchEvents}
            /> 
          </View>

          {/* Commentary Word Cloud */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Commentary word cloud</Text>
            <View style={styles.wordCloud}>
              {wordCloudWords.map((word, index) => (
                <Text 
                  key={index} 
                  style={[
                    styles.wordCloudText, 
                    { fontSize: word.size, color: word.color }
                  ]}
                >
                  {word.text}
                </Text>
              ))}
            </View>
          </View>

          {/* Starting XI */}
          {/* <View style={styles.section}>
            <Text style={styles.sectionTitle}>Starting XI</Text>
          </View> */}
          <View style={styles.section}>
          {homeLineup && awayLineup ? (
              <PitchLineStartingXI 
                homeLineup={homeLineup}
                awayLineup={awayLineup}
              />
            ) : (
              <Text>No lineups available</Text>
            )
          }
          </View>

          {/* Standings */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Standings</Text>
            <PitchLineStandingTable 
              standings={standing}
              teamId={fixture?.homeTeam.teamId || undefined}
              teamAwayId={fixture?.awayTeam.teamId || undefined}
            />
           
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
  matchResult: {
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  matchDate: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 8,
  },
  scoreContainer: {
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
  awayLogo: {
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
  scoreSection: {
    alignItems: 'center',
    flex: 1,
  },
  finalScore: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
    letterSpacing: 7
  },
  venue: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
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
  statRow: {
    marginBottom: 20,
  },
  statLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  possessionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  possessionStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  possessionIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#6366F1',
  },
  awayIndicator: {
    backgroundColor: '#3B82F6',
  },
  possessionTeam: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  possessionPercent: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  possessionChart: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#6366F1',
  },
  possessionPie: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  comparisonBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  comparisonNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    minWidth: 30,
  },
  comparisonBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
  },
  comparisonBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    margin: 20,
    borderRadius: 8,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: '#FFFFFF',
  },
  tabText: {
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#1F2937',
    fontWeight: '600',
  },
  wordCloud: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    padding: 20,
  },
  wordCloudText: {
    fontWeight: 'bold',
    margin: 4,
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

export default PostMatchScreen;