import { JSX, useEffect } from 'react';
import { useState } from 'react'
import { View, Text, FlatList, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Match } from '../models/Matches';
import MatchCard from '../components/MatchCard';
import TopSearchBar from '../components/TopSearchBar';
import { Favourite, getFavourites } from '../utils/follow';
import { useIsFocused } from '@react-navigation/native';
import { getUpcomingMatches } from '../services/matchService';
import { FixtureResponseDto } from '../dtos/Fixtures';
import { fixtureDtoToMatch } from '../utils/mappers';
import { SectionList } from 'react-native';
import { getTeamDetails } from '../services/teamService';
import { useNavigation } from '@react-navigation/native';
import log from '../utils/logger';
import { Team } from '../models/Teams';
import TeamCard from '../components/TeamCard';

const UPCOMING_GAME_DAY_SPAN = 3;


// interface NoMatchTeamOrLeagues {
//   id: number;
//   name: string;
//   logo: string;
// }

export default function HomeScreen(): JSX.Element {
  
  const navigation = useNavigation();

  const updateMaps = (favs: Favourite[]) => {
      // Build maps for team and league names
      const teams: number[] = [];
      const leagues: number[] = [];
      favs.forEach(fav => {
        if (fav.type === 'team') teams.push(fav.id);
        if (fav.type === 'league') leagues.push(fav.id);
      });
      setTeamMap(teams);
      setLeagueMap(leagues);
  }
  
  const [favourites, setFavourites] = useState<Favourite[]>([]);
  // const [upcomingFavouriteMatches, setUpcomingFavouriteMatches] = useState<Match[]>([]);
  const [teamMatches, setTeamMatches] = useState<{ [teamId: number]: {name: string, matches: Match[]} }>({});
  const [leagueMatches, setLeagueMatches] = useState<{ [leagueId: number]: {name: string, matches: Match[]} }>({});
  const [teamMap, setTeamMap] = useState<number[]>([]);
  const [leagueMap, setLeagueMap] = useState<number[]>([]);
  const [favTeamHasMatch, setFavTeamHasMatch] = useState<{ [teamId: number]: boolean }>({});
  const [noMatchTeams, setNoMatchTeams] = useState<Team[]>([]);
  // const [noMatchLeagues, setNoMatchLeagues] = useState<NoMatchTeamOrLeagues[]>([]);

  const renderMatch = ({ item }: { item: Match }) => (
    <MatchCard item={item} />
  );

  const renderTeam = ({ item }: { item: Team }) => (
    <TeamCard team={item} onPress={(team) => navigation.navigate('TeamDetails', { teamId: team.id })} />
  );
  
  // Dummy fetchSuggestions implementation
  const fetchSuggestions = async (query: string) => {
    return [];
  };

  useEffect(() => {
    getFavourites().then((favs) => {
      setFavourites(favs);
      updateMaps(favs);
    }).catch((error) => {
      console.error('Error fetching favourites:', error);
    });
  }, []);

  const isFocused = useIsFocused();
  useEffect(() => {
    if (isFocused) {
      getFavourites()
        .then((favs) => {
          setFavourites(favs);
          // Build maps for team and league names
          updateMaps(favs);
        })
        .catch((error) => {
          console.error('Error fetching favourites:', error);
        });
    }
  }, [isFocused]);

  useEffect(() => {
    getUpcomingMatches(UPCOMING_GAME_DAY_SPAN)
      .then((matches: FixtureResponseDto[]) => {
               
        // Group matches by favourite teams and leagues
        const teamMatches: { [teamId: number]: {name: string, matches: Match[]} } = {};
        const leagueMatches: { [leagueId: number]: {name: string, matches: Match[]} } = {};
        const favTeamHasMatch = favourites.reduce<{ [teamId: number]: boolean }>((acc, fav) => {
          if (fav.type === 'team') {
            acc[fav.id] = false;
          }
          return acc;
        }, {});
        // const favLeagueHasMatch = favourites.reduce<{ [leagueId: number]: boolean }>((acc, fav) => {
        //   if (fav.type === 'league') {
        //     acc[fav.id] = false;
        //   }
        //   return acc;
        // }, {});

        matches
          .filter((match: FixtureResponseDto) => {
            let home = match.fixture.teams.home.id;
            let away = match.fixture.teams.away.id;
            let comp = match.fixture.league.id;
            return (
              favourites.some(fav => fav.type === 'team' && (fav.id === home || fav.id === away)) ||
              favourites.some(fav => fav.type === 'league' && fav.id === comp)
            );
          })
          .forEach((match: FixtureResponseDto) => {
            const homeId = match.fixture.teams.home.id;
            const awayId = match.fixture.teams.away.id;
            teamMap.forEach(teamId => {
              let teamName = homeId == teamId ? match.fixture.teams.home.name : match.fixture.teams.away.name;
              if (homeId === teamId || awayId === teamId) {
                if (!teamMatches[teamId]) teamMatches[teamId] = {name: '', matches: []};
                teamMatches[teamId].matches.push(fixtureDtoToMatch(match));
                teamMatches[teamId].name = teamName;
                favTeamHasMatch[teamId] = true; // Mark that this team has a match
              }
            });
            setTeamMatches(teamMatches);
            setFavTeamHasMatch(favTeamHasMatch);
            leagueMap.forEach(leagueId => {
              let leagueName = match.fixture.league.name;
              if (match.fixture.league.id === leagueId) {
                if (!leagueMatches[leagueId]) leagueMatches[leagueId] = {name: '', matches: []};
                leagueMatches[leagueId].matches.push(fixtureDtoToMatch(match));
                leagueMatches[leagueId].name = leagueName;
                // favLeagueHasMatch[leagueId] = true; // Mark that this league has a match
              }
            });
            setLeagueMatches(leagueMatches);
          
          });
      })
      .catch((error) => {
        console.error('Error fetching upcoming matches:', error);
      });
  }, [favourites]);

  useEffect(() => {
    // ...existing code...
      const teamsToFetch = Object.entries(favTeamHasMatch)
        .filter(([_, hasMatch]) => !hasMatch)
        .map(([teamId]) => Number(teamId));

      Promise.all(
        teamsToFetch.map(teamId =>
          getTeamDetails(teamId).then(teamDetail => ({
            id: teamId,
            name: teamDetail?.team_name || `Team ${teamId}`,
            logo:
              teamDetail?.past_fixtures?.[0]?.teams.home?.id === teamId
                ? teamDetail?.past_fixtures?.[0]?.teams.home?.logo
                : teamDetail?.past_fixtures?.[0]?.teams.away?.logo,
          }))
        )
      )
      .then((results) => {
        setNoMatchTeams(results.map(team => ({
          id: team.id,
          name: team.name,
          logo: team.logo,
        })) as Team[]);
        })
      .catch(error => {
        console.error('Error fetching team details:', error);
      });
  }, [favTeamHasMatch])


  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <TopSearchBar fetchSuggestions={fetchSuggestions} />
      <ScrollView style={styles.content}>
        <View style={{ flexDirection: 'row', alignItems: 'center', height: 24, marginVertical: 24, marginHorizontal: 20 }}>
          <View style={{ flex: 1, height: 1, backgroundColor: '#ddd' }} />
          <Text style={{ marginHorizontal: 8, fontWeight: '500', fontSize: 13, color: '#666' }}>
            Teams
          </Text>
          <View style={{ flex: 1, height: 1, backgroundColor: '#ddd' }} />
        </View>
        <SectionList
              sections={
            Object.entries(teamMatches).map(([teamId, { name, matches }]) => ({
              title: name || `Team ${teamId}`,
              data: matches,
              key: `team-${teamId}`,
            }))
              }
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderMatch}
              renderSectionHeader={({ section: { title } }) => (
              <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 20, marginTop: 20, marginBottom: 8 }}>
                <Text style={{ fontWeight: '500', fontSize: 13, color: '#666', flex: 1 }}>{title}</Text>
              </View>
              )}
              ListEmptyComponent={
            <Text style={{ textAlign: 'center', marginTop: 40 }}>
              No upcoming fixtures for your favourite teams.
            </Text>
              }
              stickySectionHeadersEnabled={false}
        />
        {noMatchTeams.length > 0 && (
            <View>
            <Text style={{ marginLeft: 20, marginTop: 20, marginBottom: 8, fontWeight: '500', fontSize: 13, color: '#666' }}>
              No upcoming matches
            </Text>
            <FlatList
              data={noMatchTeams}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderTeam}
              // horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 20 }}
            />
            </View>
        )}
        <View style={{ flexDirection: 'row', alignItems: 'center', height: 24, marginVertical: 24, marginHorizontal: 20 }}>
          <View style={{ flex: 1, height: 1, backgroundColor: '#ddd' }} />
          <Text style={{ marginHorizontal: 8, fontWeight: '500', fontSize: 13, color: '#666' }}>
            Leagues
          </Text>
          <View style={{ flex: 1, height: 1, backgroundColor: '#ddd' }} />
        </View>
        <SectionList
          sections={
        Object.entries(leagueMatches).map(([leagueId, { name, matches }]) => ({
          title: name || `League ${leagueId}`,
          data: matches,
          key: `league-${leagueId}`,
        }))
          }
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderMatch}
          renderSectionHeader={({ section: { title } }) => (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 20, marginTop: 20, marginBottom: 8 }}>
            <Text style={{ fontWeight: '500', fontSize: 13, color: '#666', flex: 1 }}>{title}</Text>
          </View>
          )}
          ListEmptyComponent={
        <Text style={{ textAlign: 'center', marginTop: 40 }}>
          No upcoming fixtures for your favourite leagues.
        </Text>
          }
          stickySectionHeadersEnabled={false}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    zIndex: 10,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 12,
    marginHorizontal: 20,
  },
});