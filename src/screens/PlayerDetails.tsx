import React, { useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  Dimensions,
} from 'react-native';
import { Player } from '../models/Players';
import { getPlayerDetail } from '../services/playerService';
import { PlayerDataDto } from '../dtos/Players';

const { width } = Dimensions.get('window');

const PlayerDetailsScreen = ({playerId}: {playerId: number}) => {

  const [player, setPlayer] = React.useState<Player>({
    info: {
      icon: '👤',
      label: 'X the GOAT',
      value: 'Forward'
    },
    careerTimeline: [],
    achievements: [],
    radarAttributes: []
  });

  useEffect(() => {
    getPlayerDetail(playerId).then((data: PlayerDataDto | null) => {
      if (!!data) {
        setPlayer({
          info: {
            icon: data.info.icon,
            label: data.info.label,
            value: data.info.value
          },
          careerTimeline: data.careerTimeline.map(item => ({
            team: item.team,
            period: item.period,
            isActive: item.isActive
          })),
          achievements: data.achievements.map(item => ({
            title: item.title,
            icon: item.icon,
            color: item.color,
            count: item.count,
            subtitle: item.subtitle
          })),
          radarAttributes: data.radarAttributes.map(attr => ({
            attribute: attr.attribute,
            value: attr.value
          }))
        } as Player);
      }
    });
  }, [playerId]);


  const playerInfo = [
    { icon: '🏳️', label: 'Nationality', value: 'Argentina' },
    { icon: '📅', label: 'Date of Birth', value: 'June 24, 1987' },
    { icon: '#', label: 'Number', value: '10' },
    { icon: '🦶', label: 'Preferred Foot', value: 'Left' },
    { icon: '💰', label: 'Valuation', value: '€35M' },
    { icon: '📏', label: 'Height', value: '1.70m' },
    { icon: '⚖️', label: 'Weight', value: '72kg' },
    { icon: '📋', label: 'Contract Ends', value: '2025' }
  ];

  const careerTimeline = [
    { team: 'FC Barcelona', period: '2004 - 2021', isActive: false },
    { team: 'Paris Saint-Germain', period: '2021 - 2023', isActive: false },
    { team: 'Inter Miami CF', period: '2023 - Present', isActive: true }
  ];

  const achievements = [
    { title: 'Ballon d\'Or', icon: '🏆', color: '#F59E0B', count: null },
    { title: 'The Best FIFA Men\'s Player', icon: '🥇', color: '#3B82F6', count: 'x2' },
    { title: 'FIFA World Cup', subtitle: '2022', icon: '🏆', color: '#10B981', count: null },
    { title: 'Champions League', icon: '🏆', color: '#8B5CF6', count: 'x4' },
    { title: 'La Liga Title', icon: '🛡️', color: '#EF4444', count: 'x10' },
    { title: 'European Golden Shoe', icon: '👟', color: '#F59E0B', count: 'x6' }
  ];

  const radarData = [
    { attribute: 'Pace', value: 85 },
    { attribute: 'Shooting', value: 95 },
    { attribute: 'Checking', value: 90 },
    { attribute: 'Dribbling', value: 98 },
    { attribute: 'Defending', value: 40 },
    { attribute: 'Physical', value: 75 }
  ];

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
                <Text style={styles.playerImageText}>👤</Text>
              </View>
            </View>
            <View style={styles.playerInfo}>
              <Text style={styles.playerName}>Lionel Messi</Text>
              <Text style={styles.playerPosition}>Forward</Text>
              <View style={styles.teamInfo}>
                <View style={styles.teamLogo}>
                  <Text style={styles.teamLogoText}>IM</Text>
                </View>
                <Text style={styles.teamName}>Inter Miami CF</Text>
              </View>
              <View style={styles.ratingsContainer}>
                <View style={styles.ratingBadge}>
                  <Text style={styles.ratingLabel}>Overall</Text>
                  <Text style={styles.ratingValue}>92</Text>
                </View>
                <View style={styles.ratingBadge}>
                  <Text style={styles.ratingLabel}>Potential</Text>
                  <Text style={styles.ratingValue}>92</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Player Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Player Information</Text>
            <View style={styles.infoGrid}>
              {playerInfo.map((info, index) => (
                <View key={index} style={styles.infoRow}>
                  <View style={styles.infoLeft}>
                    <Text style={styles.infoIcon}>{info.icon}</Text>
                    <Text style={styles.infoLabel}>{info.label}</Text>
                  </View>
                  <Text style={styles.infoValue}>{info.value}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Career Timeline */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Career Timeline</Text>
            <View style={styles.timeline}>
              {careerTimeline.map((career, index) => (
                <View key={index} style={styles.timelineItem}>
                  <View style={[styles.timelineDot, career.isActive && styles.activeTimelineDot]} />
                  <View style={styles.timelineContent}>
                    <View style={styles.teamLogo}>
                      <Text style={styles.teamLogoText}>
                        {career.team.split(' ').map(word => word.charAt(0)).join('')}
                      </Text>
                    </View>
                    <View style={styles.timelineText}>
                      <Text style={styles.timelineTeam}>{career.team}</Text>
                      <Text style={styles.timelinePeriod}>{career.period}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Achievements */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Achievements</Text>
            <View style={styles.achievementsGrid}>
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
            </View>
          </View>

          {/* Strengths & Weaknesses */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Strengths & Weaknesses</Text>
            <View style={styles.radarContainer}>
              <View style={styles.radarChart}>
                {/* Simplified radar chart representation */}
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