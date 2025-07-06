import React, { useEffect } from 'react';
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
import { Player, PlayerCareer, PlayerInfo, PlayerLeague, PlayerStats, PlayerTeam } from '../models/Players';
import { getPlayerDetail } from '../services/playerService';
import { PlayerDataDto } from '../dtos/Players';
import { Team } from '../models/Teams';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { mockPlayer } from '../utils/mocks';
import { useState } from 'react';
import PitchLinePlayerStats from '../components/PlayerStats';

const { width } = Dimensions.get('window');

const PlayerDetailsScreen = ({playerId}: {playerId: number}) => {

  const [player, setPlayer] = React.useState<Player>(mockPlayer());

  useEffect(() => {
    getPlayerDetail(playerId).then((data: PlayerDataDto | null) => {
      if (!!data) {
        // get current team player is playing for
        let currentTeams: PlayerTeam[] = [];
        let currentLeagues: PlayerLeague[] = [];
        let playerCareer: PlayerCareer[] = [];
        data.statistics
          .sort((a, b) => b.league.season - a.league.season)
          .slice(0, 1)
          // .filter(stat => stat.league.season === new Date().getFullYear())
          .forEach(stat => {
            if (!currentTeams.some(team => team.id === stat.team.id)) {
              currentTeams.push(stat.team as PlayerTeam);
            }
            if (!currentLeagues.some(league => league.id === stat.league.id)) {
              currentLeagues.push(stat.league as PlayerLeague);
            }
          });
        let currentCareer: PlayerCareer;
        data.statistics
          .filter(stat => data.player.nationality !== stat.team.name) // filter out statistics for national team (only focus on club career here)
          .sort((a, b) => b.league.season - a.league.season)
          .forEach(stat => {
            // check if the current career already exists for the player
            if (playerCareer.length > 0) {
              currentCareer = playerCareer.pop() as PlayerCareer;
              if (stat.team.id === currentCareer.team.id 
                && currentCareer.start === stat.league.season.toString()
              ){
                playerCareer.push(currentCareer);
              }else{
                if (currentCareer.team.id === stat.team.id 
                    && currentCareer.start === stat.league.season.toString() + 1) {
                    // update the start year if it was the previous season wth same team
                    currentCareer.start = stat.league.season.toString();
                    playerCareer.push(currentCareer);
                  } else {
                    // this is a new previous career season
                    playerCareer.push(currentCareer);
                    let newPreviousCareer = {
                      team: stat.team as PlayerTeam,
                      start: stat.league.season.toString(),
                      end: stat.league.season.toString(),
                      isActive: stat.league.season === new Date().getFullYear()
                    } as PlayerCareer;
                    playerCareer.push(newPreviousCareer);
                  }
              }
            } else {
              playerCareer.push({
                team: stat.team as PlayerTeam,
                start: stat.league.season.toString(),
                end: stat.league.season.toString(),
                isActive: stat.league.season === new Date().getFullYear()
              });
            }
          });
        // Get the most recent statistics record
        const mostRecentStat = data.statistics
          .sort((a, b) => b.league.season - a.league.season)[0];

        setPlayer({
          info: {
            name: data.player.name,
            age: data.player.age,
            position: mostRecentStat?.games?.position || 'Unknown',
            nationality: data.player.nationality,
            height: data.player.height,
            weight: data.player.weight,
            photo: data.player.photo,
            birth: {
              date: data.player.birth.date,
              place: data.player.birth.place,
              country: data.player.birth.country
            },
            teams: currentTeams,
            leagues: currentLeagues,
            footballAPRating: {
              overall: 6,
              potential: 6,
              season: new Date().getFullYear(),
            },
          } as PlayerInfo,
          careerTimeline: playerCareer as PlayerCareer[],
          stats: {
            games: {
              appearences: mostRecentStat?.games?.appearences ?? 0,
              lineups: mostRecentStat?.games?.lineups ?? 0,
              minutes: mostRecentStat?.games?.minutes ?? 0,
              number: mostRecentStat?.games?.number ?? null,
              position: mostRecentStat?.games?.position ?? 'Unknown',
              rating: mostRecentStat?.games?.rating ?? null,
              captain: mostRecentStat?.games?.captain ?? false,
            },
            substitutes: {
              in: mostRecentStat?.substitutes?.in ?? null,
              out: mostRecentStat?.substitutes?.out ?? null,
              bench: mostRecentStat?.substitutes?.bench ?? null,
            },
            shots: {
              total: mostRecentStat?.shots?.total ?? null,
              on: mostRecentStat?.shots?.on ?? null,
            },
            goals: {
              total: mostRecentStat?.goals?.total ?? null,
              assists: mostRecentStat?.goals?.assists ?? null,
            },
            passes: {
              total: mostRecentStat?.passes?.total ?? null,
              key: mostRecentStat?.passes?.key ?? null,
            },
            tackles: {
              total: mostRecentStat?.tackles?.total ?? null,
              successful: mostRecentStat?.tackles?.blocks ?? null,
            },
            duels: {
              total: mostRecentStat?.duels?.total ?? null,
              won: mostRecentStat?.duels?.won ?? null,
            },
            dribbles: {
              total: mostRecentStat?.dribbles?.attempts ?? null,
              successful: mostRecentStat?.dribbles?.success ?? null,
            },
            fouls: {
              total: mostRecentStat?.fouls?.drawn ?? null,
              committed: mostRecentStat?.fouls?.committed ?? null,
            },
            cards: {
              yellow: mostRecentStat?.cards?.yellow ?? null,
              red: mostRecentStat?.cards?.red ?? null,
            },
            penalty: {
              won: mostRecentStat?.penalty?.won ?? null,
              scored: mostRecentStat?.penalty?.scored ?? null,
              missed: mostRecentStat?.penalty?.missed ?? null,
            },
          } as PlayerStats,
        } as Player);
        
      }
    });
  }, [playerId]);

  // const achievements = [
  //   { title: 'Ballon d\'Or', icon: '🏆', color: '#F59E0B', count: null },
  //   { title: 'The Best FIFA Men\'s Player', icon: '🥇', color: '#3B82F6', count: 'x2' },
  //   { title: 'FIFA World Cup', subtitle: '2022', icon: '🏆', color: '#10B981', count: null },
  //   { title: 'Champions League', icon: '🏆', color: '#8B5CF6', count: 'x4' },
  //   { title: 'La Liga Title', icon: '🛡️', color: '#EF4444', count: 'x10' },
  //   { title: 'European Golden Shoe', icon: '👟', color: '#F59E0B', count: 'x6' }
  // ];

  // const radarData = [
  //   { attribute: 'Pace', value: 85 },
  //   { attribute: 'Shooting', value: 95 },
  //   { attribute: 'Checking', value: 90 },
  //   { attribute: 'Dribbling', value: 98 },
  //   { attribute: 'Defending', value: 40 },
  //   { attribute: 'Physical', value: 75 }
  // ];

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
            <Text style={styles.headerTitle}>Player Details</Text>
            <View style={styles.profileImageSmall}>
              <Text style={styles.profileImageText}>👤</Text>
            </View>
          </View>

          {/* Player Profile */}
          <View style={styles.playerProfile}>
            <View style={styles.playerImageContainer}>
              <View style={styles.playerImage}>
                {player.info.photo ? (
                  <Image
                    source={{ uri: player.info.photo }}
                    style={{ width: 80, height: 80, borderRadius: 40 }}
                    resizeMode="cover"
                  />
                ) : (
                  <Text style={styles.playerImageText}>👤</Text>
                )}
              </View>
            </View>
            <View style={styles.playerInfo}>
              <Text style={styles.playerName}>{player.info.name}</Text>
              <Text style={styles.playerPosition}>{player.info.position}</Text>
              <View style={styles.teamInfo}>
                <View style={styles.teamLogo}>
                  {player.info.teams.length > 0 && player.info.teams[0].logo ? (
                    <Image
                      source={{ uri: player.info.teams[0].logo }}
                      style={{ width: 20, height: 20, borderRadius: 10 }}
                      resizeMode="cover"
                    />
                  ) : (
                    <Text style={styles.teamLogoText}>
                      {player.info.teams.length > 0 && player.info.teams[0].name
                        ? player.info.teams[0].name[0]
                        : ''}
                    </Text>
                  )}
                </View>
                <Text style={styles.teamName}>{
                  player.info.teams.length > 0 
                  && !!player.info.teams[0].name 
                    ? player.info.teams[0].name : ''}</Text>
              </View>
              <View style={styles.ratingsContainer}>
                {/* <View style={styles.ratingBadge}>
                  <Text style={styles.ratingLabel}>Football API rating for season {player.info.footballAPRating?.season || new Date().getFullYear()}</Text>
                  <Text style={styles.ratingValue}>{player.info.footballAPRating?.overall || 'N/A'}</Text>
                </View> */}
                {/* <View style={styles.ratingBadge}>
                  <Text style={styles.ratingLabel}>Potential</Text>
                  <Text style={styles.ratingValue}>{player.info.footballAPRating}</Text>
                </View> */}
              </View>
            </View>
          </View>

          {/* Player Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Player Information</Text>
            <View style={styles.infoGrid}>
                <View style={styles.infoRow}>
                  <View style={styles.infoLeft}>
                    <MaterialCommunityIcons name="flag-outline" size={16} color="#000" style={{ paddingRight: 8 }} />
                    <Text style={styles.infoLabel}>Nationality</Text>
                  </View>
                  <Text style={styles.infoValue}>{player.info.nationality}</Text>
                </View>
                <View style={styles.infoRow}>
                  <View style={styles.infoLeft}>
                    <MaterialCommunityIcons name="calendar-range" size={16} color="#000" style={{ paddingRight: 8 }} />
                    <Text style={styles.infoLabel}>Date of Birth</Text>
                  </View>
                  <Text style={styles.infoValue}>{player.info.birth.date}</Text>
                </View>
                <View style={styles.infoRow}>
                  <View style={styles.infoLeft}>
                    <MaterialCommunityIcons name="numeric" size={16} color="#000" style={{ paddingRight: 8 }} />
                    <Text style={styles.infoLabel}>Age</Text>
                  </View>
                  <Text style={styles.infoValue}>{player.info.age?.toString()}</Text>
                </View>
                <View style={styles.infoRow}>
                  <View style={styles.infoLeft}>
                    <MaterialCommunityIcons name="soccer" size={16} color="#000" style={{ paddingRight: 8 }} />
                    <Text style={styles.infoLabel}>Position</Text>
                  </View>
                  <Text style={styles.infoValue}>{player.info.position}</Text>
                </View>
                <View style={styles.infoRow}>
                  <View style={styles.infoLeft}>
                    <MaterialCommunityIcons name="human-male-height" size={16} color="#000" style={{ paddingRight: 8 }} />
                    <Text style={styles.infoLabel}>Height</Text>
                  </View>
                  <Text style={styles.infoValue}>{player.info.height}</Text>
                </View>
                <View style={styles.infoRow}>
                  <View style={styles.infoLeft}>
                    <MaterialCommunityIcons name="weight-kilogram" size={16} color="#000" style={{ paddingRight: 8 }} />
                    <Text style={styles.infoLabel}>Weight</Text>
                  </View>
                  <Text style={styles.infoValue}>{player.info.weight}</Text>
                </View>
                <View style={styles.infoRow}>
                  <View style={styles.infoLeft}>
                    <MaterialCommunityIcons name="map-marker-outline" size={16} color="#000" style={{ paddingRight: 8 }} />
                    <Text style={styles.infoLabel}>Birth Place</Text>
                  </View>
                  <Text style={styles.infoValue}>{player.info.birth.place}</Text>
                </View>
                <View style={styles.infoRow}>
                  <View style={styles.infoLeft}>
                    <MaterialCommunityIcons name="earth" size={16} color="#000" style={{ paddingRight: 8 }} />
                    <Text style={styles.infoLabel}>Birth Country</Text>
                  </View>
                  <Text style={styles.infoValue}>{player.info.birth.country}</Text>
                </View>
                <View style={styles.infoRow}>
                  <View style={styles.infoLeft}>
                    <MaterialCommunityIcons name="home-group" size={16} color="#000" style={{ paddingRight: 8 }} />
                    <Text style={styles.infoLabel}>Current Team</Text>
                  </View>
                  <Text style={styles.infoValue}>{player.info.teams[0]?.name || ''}</Text>
                </View>
            </View>
          </View>

          {/* Career Timeline */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Career Timeline</Text>
            <View style={styles.timeline}>
              {player.careerTimeline?.map((career, index) => (
                <View key={index} style={styles.timelineItem}>
                  <View style={[styles.timelineDot, career.isActive && styles.activeTimelineDot]} />
                  <View style={styles.timelineContent}>
                    <View style={styles.teamLogo}>
                      <Text style={styles.teamLogoText}>
                        {career.team.logo ? (
                          <Image
                            source={{ uri: career.team.logo }}
                            style={{ width: 20, height: 20, borderRadius: 10 }}
                            resizeMode="cover"
                          />
                        ) : (
                          <Text style={styles.teamLogoText}>?</Text>
                        )}
                      </Text>
                    </View>
                    <View style={styles.timelineText}>
                      <Text style={styles.timelineTeam}>{career.team.name}</Text>
                      <Text style={styles.timelinePeriod}>
                        {career.start} - {career.end !== career.start ? career.end : 'Now'}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>

          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Player Stats</Text>
            <PitchLinePlayerStats player={player} />
          </View>
          {/* Achievements */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Achievements</Text>
            <View style={{ alignItems: 'center', paddingVertical: 16 }}>
              <Text style={{ fontSize: 12, color: '#6B7280' }}>Not Available</Text>
            </View>
            {/* <View style={styles.achievementsGrid}>
              {achievements.map((achievement, index) => (
                <View key={index} style={[styles.achievementCard, { backgroundColor: achievement.color + '20' }]}>
                  <Text style={styles.achievementIcon}>{achievement.icon}</Text>
                  <Text style={styles.achievementTitle}>{achievement.title}</Text>
                  {achievement.subtitle && (
                    <Text style={styles.achievementSubtitle}>{achievement.subtitle}</Text>
                  )}
                  {achievement.count && (
                    <Text style={styles.achievementCount}>{achievement.count}</Text>
                  )}
                </View>
              ))}
            </View> */}
          </View>
          {/* Strengths & Weaknesses */}
          {/* <View style={styles.section}>
            <Text style={styles.sectionTitle}>Strengths & Weaknesses</Text>
            <View style={styles.radarContainer}>
              <View style={styles.radarChart}>
                <View style={styles.radarCenter}>
                  <View style={styles.radarPolygon} />
                </View>
                <View style={styles.radarLabels}>
                  {radarData.map((data, index) => (
                    <View key={index} style={[styles.radarLabel, { 
                      position: 'absolute',
                      top: index < 3 ? 20 : 140,
                      left: (index % 3) * 80 + 40
                    }]}>
                      <Text style={styles.radarLabelText}>{data.attribute}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </View> */}


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
  profileImageSmall: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImageText: {
    fontSize: 16,
  },
  playerProfile: {
    flexDirection: 'row',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  playerImageContainer: {
    marginRight: 16,
  },
  playerImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E5E7EB',
    borderWidth: 3,
    borderColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playerImageText: {
    fontSize: 32,
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  playerPosition: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 8,
  },
  teamInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  teamLogo: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#6B7280',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  teamLogoText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: 'bold',
  },
  teamName: {
    fontSize: 14,
    color: '#6B7280',
  },
  ratingsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  ratingBadge: {
    backgroundColor: '#6366F1',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignItems: 'center',
  },
  ratingLabel: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '500',
  },
  ratingValue: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
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
  infoGrid: {
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoIcon: {
    fontSize: 16,
    marginRight: 12,
    width: 20,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  timeline: {
    gap: 16,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#D1D5DB',
    marginRight: 16,
  },
  activeTimelineDot: {
    backgroundColor: '#6366F1',
  },
  timelineContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  timelineText: {
    marginLeft: 12,
  },
  timelineTeam: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  timelinePeriod: {
    fontSize: 12,
    color: '#6B7280',
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  achievementCard: {
    width: (width - 64) / 2,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  achievementIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  achievementTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 4,
  },
  achievementSubtitle: {
    fontSize: 10,
    color: '#6B7280',
    textAlign: 'center',
  },
  achievementCount: {
    fontSize: 10,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 4,
  },
  radarContainer: {
    alignItems: 'center',
    padding: 20,
  },
  radarChart: {
    width: 200,
    height: 200,
    position: 'relative',
  },
  radarCenter: {
    position: 'absolute',
    top: 50,
    left: 50,
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radarPolygon: {
    width: 80,
    height: 80,
    backgroundColor: '#6366F1',
    opacity: 0.3,
    transform: [{ rotate: '30deg' }],
  },
  radarLabels: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  radarLabel: {
    alignItems: 'center',
  },
  radarLabelText: {
    fontSize: 10,
    color: '#6B7280',
    fontWeight: '500',
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

export default PlayerDetailsScreen;