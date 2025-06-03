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
} from 'react-native';

const { width } = Dimensions.get('window');

const PostMatchScreen = () => {
  const [activeTab, setActiveTab] = useState('Live');

  const matchEvents = [
    { time: "1'", event: "Kick-off", icon: "⚽", color: "#9CA3AF" },
    { time: "12'", event: "Corner awarded (Home Team)", icon: "📐", color: "#3B82F6" },
    { time: "28'", event: "Foul by Player X (Away Team)", icon: "⚠️", color: "#F59E0B" },
    { time: "35'", event: "Yellow card (Home Team)", icon: "🟨", color: "#F59E0B" },
    { time: "45'", event: "Goal! Scored by Player Y (Home Team)", icon: "⚽", color: "#10B981" },
    { time: "46'", event: "Second half begins", icon: "▶️", color: "#9CA3AF" },
    { time: "62'", event: "Substitution: Player A ON, Player B OFF (Home Team)", icon: "🔄", color: "#3B82F6" },
    { time: "78'", event: "Offside decision (Away Team)", icon: "🚩", color: "#F59E0B" },
    { time: "89'", event: "Red card (Away Team)", icon: "🟥", color: "#EF4444" },
    { time: "90+5'", event: "Full-time", icon: "⏱️", color: "#9CA3AF" }
  ];

  const manchesterLineup = [
    "24 André Onana", "15 Leny Yoro", "5 Harry Maguire", "23 Luke Shaw",
    "3 Noussair Mazraoui", "18 Casemiro", "8 Bruno Fernandes", "13 Patrick Dorgu",
    "37 Kobbie Mainoo", "17 Alejandro Garnacho", "9 Rasmus Højlund"
  ];

  const arsenalLineup = [
    "David Raya 22", "Ben White 4", "William Saliba 2", "Jakub Kiwior 15",
    "Myles Lewis-Skelly 41", "Thomas Partey 5", "Declan Rice 41", "Martin Ødegaard 8",
    "Bukayo Saka 7", "Leandro Trossard 19", "Gabriel Martinelli 11"
  ];

  const wordCloudWords = [
    { text: "HAALAND", size: 24, color: "#EF4444" },
    { text: "SAKA", size: 20, color: "#F59E0B" },
    { text: "GOAL", size: 28, color: "#10B981" },
    { text: "BALL", size: 22, color: "#3B82F6" },
    { text: "FOUL", size: 16, color: "#8B5CF6" },
    { text: "PASS", size: 18, color: "#06B6D4" },
    { text: "SHOT", size: 16, color: "#F97316" },
    { text: "SAVE", size: 14, color: "#84CC16" },
    { text: "CORNER", size: 14, color: "#EC4899" },
    { text: "OFFSIDE", size: 12, color: "#6B7280" }
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
            <Text style={styles.headerTitle}>Premier League</Text>
            <View style={styles.headerSpacer} />
          </View>

          {/* Match Result */}
          <View style={styles.matchResult}>
            <Text style={styles.matchDate}>Sat 17 May 2025</Text>
            <View style={styles.scoreContainer}>
              <View style={styles.teamSection}>
                <View style={styles.teamLogo}>
                  <Text style={styles.logoText}>MU</Text>
                </View>
                <Text style={styles.teamName}>Manchester Utd</Text>
              </View>
              
              <View style={styles.scoreSection}>
                <Text style={styles.finalScore}>2-1</Text>
                <Text style={styles.venue}>Old Trafford, Manchester</Text>
              </View>
              
              <View style={styles.teamSection}>
                <View style={[styles.teamLogo, styles.arsenalLogo]}>
                  <Text style={styles.logoText}>A</Text>
                </View>
                <Text style={styles.teamName}>Arsenal</Text>
              </View>
            </View>
          </View>

          {/* Stats */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Stats</Text>
            
            {/* Possession */}
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Possession</Text>
              <View style={styles.possessionContainer}>
                <View style={styles.possessionStat}>
                  <View style={styles.possessionIndicator} />
                  <Text style={styles.possessionTeam}>MAN</Text>
                  <Text style={styles.possessionPercent}>75%</Text>
                </View>
                <View style={styles.possessionChart}>
                  <View style={styles.possessionPie} />
                </View>
                <View style={styles.possessionStat}>
                  <Text style={styles.possessionPercent}>25%</Text>
                  <Text style={styles.possessionTeam}>ARS</Text>
                  <View style={[styles.possessionIndicator, styles.arsenalIndicator]} />
                </View>
              </View>
            </View>

            {/* Shots on target */}
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Shots on target</Text>
              <View style={styles.comparisonBar}>
                <Text style={styles.comparisonNumber}>33</Text>
                <View style={styles.comparisonBarContainer}>
                  <View style={[styles.comparisonBarFill, { width: '60%', backgroundColor: '#6366F1' }]} />
                </View>
                <Text style={styles.comparisonNumber}>22</Text>
              </View>
            </View>

            {/* Shots off target */}
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Shots off target</Text>
              <View style={styles.comparisonBar}>
                <Text style={styles.comparisonNumber}>3</Text>
                <View style={styles.comparisonBarContainer}>
                  <View style={[styles.comparisonBarFill, { width: '50%', backgroundColor: '#6366F1' }]} />
                </View>
                <Text style={styles.comparisonNumber}>3</Text>
              </View>
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
            <Text style={styles.sectionTitle}>Match Timeline</Text>
            <View style={styles.timeline}>
              {matchEvents.map((event, index) => (
                <View key={index} style={styles.timelineEvent}>
                  <Text style={styles.eventTime}>{event.time}</Text>
                  <View style={[styles.eventIcon, { backgroundColor: event.color }]}>
                    <Text style={styles.eventIconText}>{event.icon}</Text>
                  </View>
                  <Text style={styles.eventDescription}>{event.event}</Text>
                </View>
              ))}
            </View>
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
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Starting XI</Text>
            <View style={styles.lineupContainer}>
              <View style={styles.teamLineup}>
                {manchesterLineup.map((player, index) => (
                  <Text key={index} style={styles.playerText}>{player}</Text>
                ))}
              </View>
              <View style={styles.teamLineup}>
                {arsenalLineup.map((player, index) => (
                  <Text key={index} style={[styles.playerText, styles.rightAlign]}>{player}</Text>
                ))}
              </View>
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

        {/* Bottom Navigation */}
        {/* <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navItem}>
            <Text style={styles.navIcon}>🏠</Text>
            <Text style={styles.navLabel}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.navItem, styles.activeNavItem]}>
            <Text style={styles.navIcon}>📊</Text>
            <Text style={[styles.navLabel, styles.activeNavLabel]}>Matches</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <Text style={styles.navIcon}>⚙️</Text>
            <Text style={styles.navLabel}>Settings</Text>
          </TouchableOpacity>
        </View> */}
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
    backgroundColor: '#DC2626',
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
  scoreSection: {
    alignItems: 'center',
    flex: 1,
  },
  finalScore: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  venue: {
    fontSize: 12,
    color: '#9CA3AF',
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
  arsenalIndicator: {
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
  timeline: {
    gap: 16,
  },
  timelineEvent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  eventTime: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    width: 40,
  },
  eventIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventIconText: {
    fontSize: 12,
  },
  eventDescription: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
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