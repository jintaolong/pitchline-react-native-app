import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, SectionList, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Match } from '../models/Matches';
import MatchCard from '../components/MatchCard';
import TopSearchBar from '../components/TopSearchBar';
import { Favourite, FavouriteType, getFavourites, removeFavourite } from '../utils/follow';
import { useIsFocused } from '@react-navigation/native';
import { getUpcomingMatches } from '../services/matchService';
import { FixtureResponseDto } from '../dtos/Fixtures';
import { fixtureDtoToMatch } from '../utils/mappers';
import { getLeagueStanding, getTeamDetails } from '../services/teamService';
import { useNavigation } from '@react-navigation/native';
import log from '../utils/logger';
import { Team } from '../models/Teams';
import TeamCard, { TeamCardTeam } from '../components/TeamCard';
import { globalStyles } from '../styles/globalStyles';
import MatchCardHeader from '../components/MatchCardHeader';
import { SearchItemDto } from '../dtos/SearchTerms';
import { fetchTopbarSearchOptions } from '../services/searchService';

const UPCOMING_GAME_DAY_SPAN = 3;


// interface NoMatchTeamOrLeagues {
//   id: number;
//   name: string;
//   logo: string;
// }
type MatchOrLeagueOrTeam = {
  id: number;
  name: string;
  logo: string;
};

// const searchData: SearchItemDto[] = require('../../assets/data/search_data.json');

const HomeScreen = () => {
  // log.debug(searchData.at(0));
  const navigation = useNavigation();

  // const updateMaps = (favs: Favourite[]) => {
  //     // Build maps for team and league names
  //     const teams: number[] = [];
  //     const leagues: number[] = [];
  //     favs.forEach(fav => {
  //       if (fav.type === 'team') teams.push(fav.id);
  //       if (fav.type === 'league') leagues.push(fav.id);
  //     });
  //     // setTeamMap(teams);
  // }
  
  const [favourites, setFavourites] = useState<Favourite[]>([]);
  // const [upcomingFavouriteMatches, setUpcomingFavouriteMatches] = useState<Match[]>([]);
  const [teamMatches, setTeamMatches] = useState<{ [teamId: number]: {name: string, matches: Match[]} }>({});
  const [leagueMatches, setLeagueMatches] = useState<{ [leagueId: number]: {name: string, matches: Match[]} }>({});
  // const [teamMap, setTeamMap] = useState<number[]>([]);
  const [favTeamHasMatch, setFavTeamHasMatch] = useState<{ [teamId: number]: boolean }>({});
  const [favLeagueHasMatch, setFavLeagueHasMatch] = useState<{ [leagueId: number]: boolean }>({});
  const [noMatchTeams, setNoMatchTeams] = useState<MatchOrLeagueOrTeam[]>([]);
  const [activeTab, setActiveTab] = useState<'teams' | 'leagues'>('teams');
  const [noMatchLeagues, setNoMatchLeagues] = useState<MatchOrLeagueOrTeam[]>([]);

  const renderMatch = ({ item }: { item: Match }) => item.status !== 'NA' ? (
    <MatchCard item={item} />
  ) : (
    <TeamCard 
      team={item} 
      onPress={(team) => navigation.navigate('TeamDetails', { teamId: team.id })} 
      onUnfollow={(team: TeamCardTeam ) => {
          const fav = favourites.find(fav => fav.id === team.id && fav.type === 'team');
          if (fav) {
            removeFavourite(fav).then(() => {
              setFavourites(prev => prev.filter(fav => (fav.id !== team.id && fav.type === 'team') || fav.type !== 'team'));
              // log.debug(`Unfollowed team: ${item.homeTeam.name || item.awayTeam.name}`);
            });
          }
        }}  
    />
  );

  const renderLeague = ({ item }: { item: Match }) => (
    item.status !== 'NA' ? (
      <MatchCard item={item} />
    ) : (
      <TeamCard 
        team={item} 
        onPress={(team) => navigation.navigate('LeagueDetails', { leagueId: team.id })} 
        onUnfollow={(league: TeamCardTeam) => {
          const fav = favourites.find(fav => fav.id === league.id && fav.type === 'league');
          if (fav) {
            removeFavourite(fav).then(() => {
              setFavourites(prev => prev.filter(fav => (fav.id !== league.id && fav.type === 'league') || fav.type !== 'league'));
              // log.debug(`Unfollowed league: ${item.homeTeam.name || item.awayTeam.name}`);
            });
          }
        }}
      />
    )
  );

  // const renderTeam = ({ item }: { item: Team }) => (
  //   <TeamCard team={item} onPress={(team) => navigation.navigate('TeamDetails', { teamId: team.id })} />
  // );
  
  // Dummy fetchSuggestions implementation
  const fetchSuggestions = async (query: string) => {
    log.debug(`Fetching suggestions for query: ${query}`);
    // log.debug(`Total search data items: ${searchData.length}`);
    const results = await fetchTopbarSearchOptions(query);
    // const results = searchData.filter(item =>
    //   item.name.toLowerCase().includes(query.toLowerCase())
    // );
    // log.debug(`Filtered results: ${results.length} items found`);
    // Use a simple in-memory index for prefix search to improve performance
    // Build a Map from first letter to array of items for quick narrowing
    // const [searchIndex, setSearchIndex] = useState<Map<string, SearchItem[]>>(new Map());

    // useEffect(() => {
    //   // Build the index once on mount
    //   const index = new Map<string, SearchItem[]>();
    //   for (const item of searchData) {
    //     const first = item.name[0]?.toLowerCase() || '';
    //     if (!index.has(first)) index.set(first, []);
    //     index.get(first)!.push(item);
    //   }
    //   setSearchIndex(index);
    // }, []);

    // let result: SearchItem[] = [];
    // if (query.length > 0) {
    //   const first = query[0].toLowerCase();
    //   const candidates = searchIndex.get(first) || [];
    //   result = candidates.filter(item =>
    //     item.name.toLowerCase().startsWith(query.toLowerCase())
    //   );
    // } else {
    //   result = [];
    // }
    // log.debug(`Fetched ${result.length} results for query: ${query}`);
    return results;
  };

  // initial fetch of favourites
  useEffect(() => {
    getFavourites().then((favs) => {
      setFavourites(favs);
      // updateMaps(favs);
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
          // updateMaps(favs);
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
        const favLeagueHasMatch = favourites.reduce<{ [leagueId: number]: boolean }>((acc, fav) => {
          if (fav.type === 'league') {
            acc[fav.id] = false;
          }
          return acc;
        }, {});

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
            favourites.forEach(fav => {
              if (fav.type === 'team') {
              const teamId = fav.id;
              let teamName = homeId === teamId ? match.fixture.teams.home.name : match.fixture.teams.away.name;
              if (homeId === teamId || awayId === teamId) {
                if (!teamMatches[teamId]) teamMatches[teamId] = { name: '', matches: [] };
                teamMatches[teamId].matches.push(fixtureDtoToMatch(match));
                teamMatches[teamId].name = teamName;
                favTeamHasMatch[teamId] = true; // Mark that this team has a match
              }
              }
            });
            setTeamMatches(teamMatches);
            setFavTeamHasMatch(favTeamHasMatch);
            favourites.forEach(fav => {
              if (fav.type === 'league' && match.fixture.league.id === fav.id) {
              let leagueName = match.fixture.league.name;
              if (!leagueMatches[fav.id]) leagueMatches[fav.id] = { name: '', matches: [] };
              leagueMatches[fav.id].matches.push(fixtureDtoToMatch(match));
              leagueMatches[fav.id].name = leagueName;
              favLeagueHasMatch[fav.id] = true; // Mark that this league has a match
              }
            });

            setLeagueMatches(leagueMatches);
            setFavLeagueHasMatch(favLeagueHasMatch);
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
        })) as MatchOrLeagueOrTeam[]);
        })
      .catch(error => {
        console.error('Error fetching team details:', error);
      });
  }, [favTeamHasMatch])

  useEffect(() => {
    // Fetch leagues with no matches
    const leaguesToFetch = Object.entries(favLeagueHasMatch)
      .filter(([_, hasMatch]) => !hasMatch)
      .map(([leagueId]) => Number(leagueId));

    Promise.all(
      leaguesToFetch.map(leagueId =>
        getLeagueStanding(leagueId, new Date().getFullYear()).then(leagueDetail => {
          return {
            id: leagueId,
            name: leagueDetail?.league.name || `League ${leagueId}`,
            logo:
              leagueDetail?.league.logo || '', // TODO: Fallback logo
          };
        })
      )
    )
    .then((results) => {
      setNoMatchLeagues(results.map(league => ({
        id: league.id,
        name: league.name,
        logo: league.logo,
      })) as MatchOrLeagueOrTeam[]);
    })
    .catch(error => {
      console.error('Error fetching league details:', error);
    });
  }, [favLeagueHasMatch]);


  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <TopSearchBar fetchSuggestions={fetchSuggestions} />

      {/* <View>
        <Text>
          {favourites.map(fav => fav.type === 'team' ? `Team ${fav.id}` : `League ${fav.id}`).join(', ') || 'No favourites selected.'}
        </Text>
      </View> */}
      {/* Tabs */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'teams' && styles.activeTab]}
          onPress={() => setActiveTab('teams')}
        >
          <Text style={[styles.tabText, activeTab === 'teams' && styles.activeTabText]}>Teams</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'leagues' && styles.activeTab]}
          onPress={() => setActiveTab('leagues')}
        >
          <Text style={[styles.tabText, activeTab === 'leagues' && styles.activeTabText]}>Leagues</Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      {activeTab === 'teams' ? (
        <SectionList
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 16 }} // <-- Add paddingBottom here
          sections={[
            ...Object.entries(teamMatches).map(([teamId, { name, matches }]) => ({
              id: Number(teamId),
              title: name || `Team ${teamId}`,
              data: matches,
              key: `team-${teamId}`,
            })),
            {
              id : -1,
              title: "No Upcoming Matches",
              data: noMatchTeams.map((team) => {
                return {
                  id: team.id,
                  homeTeam: team,
                  awayTeam: team,
                  homeLogo: team.logo,
                  awayLogo: team.logo,
                  status: 'NA',
                  competition: 'No Matches',
                  competitionId: 0,
                  channel: 'NA',
                  viewers: 'NA',
                } as Match;
              }),
              key: `no-match-team`,
            }
          ]}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderMatch}
          // renderSectionHeader={({ section: { title } }) => (
          //   <View style={styles.sectionHeaderRow}>
          //     <Text style={styles.sectionHeaderText}>{title}</Text>
          //   </View>
          // )}
          renderSectionHeader={({ section: { id, title, data } }) => (
            <MatchCardHeader 
              section={{ id, title, type: 'team' }}
              favourites={favourites}
              OnSelect={(favourite: Favourite) => 
                setFavourites(prev => [...prev, favourite])
              }
              OnDeselect={(favourite: Favourite) => 
                setFavourites(prev => prev
                  .filter(fav => 
                    (fav.id !== favourite.id && fav.type === 'team') || fav.type !== 'team'))
              }
            />
          )}
          ListEmptyComponent={
            <Text style={globalStyles.emptyListText}>
              You haven't followed any teams yet.
            </Text>
          }
          stickySectionHeadersEnabled={false}
        />
      ) : (
        <SectionList
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 16 }} // <-- Add paddingBottom here
          sections={[
            ...Object.entries(leagueMatches).map(([leagueId, { name, matches }]) => ({
            id: Number(leagueId),
            title: name || `League ${leagueId}`,
            data: matches,
            key: `league-${leagueId}`,
          })),
          {
            id: -1,
            title: "No Upcoming Matches",
            data: noMatchLeagues.map((league) => {
              return {
                id: league.id,
                homeTeam: league,
                awayTeam: league,
                homeLogo: league.logo,
                awayLogo: league.logo,
                status: 'NA',
                competition: 'No Matches',
                competitionId: 0,
                channel: 'NA',
                viewers: 'NA',
              } as Match;
            }),
            key: `no-match-league`,
          }
        ]
        }
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderLeague}
        renderSectionHeader={({ section: { id, title, data } }) => (
          <MatchCardHeader 
            section={{ id, title, type: 'league' }}
            favourites={favourites}
            OnSelect={(favourite: Favourite) => 
              setFavourites(prev => [...prev, favourite])
            }
            OnDeselect={(favourite: Favourite) => 
              setFavourites(prev => 
                prev.filter(fav => 
                  (fav.id !== favourite.id && fav.type === 'league') || fav.type !== 'league'))
            }
          />
        )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              No upcoming fixtures for your favourite leagues.
            </Text>
          }
          stickySectionHeadersEnabled={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    zIndex: 10,
  },
  tabBar: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 8,
    borderRadius: 8,
    backgroundColor: '#eee',
    overflow: 'hidden',
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#fff',
  },
  tabText: {
    fontWeight: '500',
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    color: '#6B73FF',
    fontWeight: '700',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
    marginTop: 20,
    marginBottom: 8,
  },
  sectionHeaderText: {
    fontWeight: '500',
    fontSize: 13,
    color: '#666',
    flex: 1,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    color: '#888',
  },
  noMatchTitle: {
    marginLeft: 20,
    marginTop: 20,
    marginBottom: 8,
    fontWeight: '500',
    fontSize: 13,
    color: '#666',
  },
});

export default HomeScreen;