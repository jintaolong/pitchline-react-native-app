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

const PreMatchDetailsScreen = () => {
  const [summaryWindow, setSummaryWindow] = useState(10); // Years

  const manchesterLineup = [
    { number: 24, name: "André Onana" },
    { number: 15, name: "Leny Yoro" },
    { number: 5, name: "Harry Maguire" },
    { number: 23, name: "Luke Shaw" },
    { number: 3, name: "Noussair Mazraoui" },
    { number: 18, name: "Casemiro" },
    { number: 8, name: "Bruno Fernandes" },
    { number: 13, name: "Patrick Dorgu" },
    { number: 37, name: "Kobbie Mainoo" },
    { number: 17, name: "Alejandro Garnacho" },
    { number: 9, name: "Rasmus Højlund" }
  ];

  const arsenalLineup = [
    { number: 22, name: "David Raya" },
    { number: 4, name: "Ben White" },
    { number: 2, name: "William Saliba" },
    { number: 15, name: "Jakub Kiwior" },
    { number: 41, name: "Myles Lewis-Skelly" },
    { number: 5, name: "Thomas Partey" },
    { number: 41, name: "Declan Rice" },
    { number: 8, name: "Martin Ødegaard" },
    { number: 7, name: "Bukayo Saka" },
    { number: 19, name: "Leandro Trossard" },
    { number: 11, name: "Gabriel Martinelli" }
  ];

  const recentForm = [
    { result: 'W', color: '#10B981' },
    { result: 'L', color: '#EF4444' },
    { result: 'W', color: '#10B981' },
    { result: 'D', color: '#F59E0B' },
    { result: 'D', color: '#F59E0B' }
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

          {/* Match Info */}
          <View style={styles.matchInfo}>
            <Text style={styles.matchDate}>Sat 17 May 2025</Text>
            <View style={styles.teamsContainer}>
              <View style={styles.teamSection}>
                <View style={styles.teamLogo}>
                  <Text style={styles.logoText}>MU</Text>
                </View>
                <Text style={styles.teamName}>Manchester Utd</Text>
              </View>
              
              <View style={styles.timeSection}>
                <Text style={styles.matchTime}>19:45</Text>
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

          {/* Starting XI */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Starting XI</Text>
            <View style={styles.lineupContainer}>
              <View style={styles.teamLineup}>
                {manchesterLineup.map((player, index) => (
                  <Text key={index} style={styles.playerText}>
                    {player.number} {player.name}
                  </Text>
                ))}
              </View>
              <View style={styles.teamLineup}>
                {arsenalLineup.map((player, index) => (
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
              <Text style={styles.summaryValue}>Last 10 Years</Text>
            </View>

            {/* Win/Draw/Loss */}
            <View style={styles.statsRow}>
              <Text style={styles.statsLabel}>Win/Draw/Loss</Text>
              <View style={styles.wdlContainer}>
                <View style={[styles.wdlBar, { backgroundColor: '#6366F1', flex: 85 }]}>
                  <Text style={styles.wdlText}>85</Text>
                </View>
                <View style={[styles.wdlBar, { backgroundColor: '#D1D5DB', flex: 53 }]}>
                  <Text style={styles.wdlText}>53</Text>
                </View>
                <View style={[styles.wdlBar, { backgroundColor: '#3B82F6', flex: 69 }]}>
                  <Text style={styles.wdlText}>69</Text>
                </View>
              </View>
            </View>

            {/* Goals Scored */}
            <View style={styles.statsRow}>
              <Text style={styles.statsLabel}>Goals scored</Text>
              <View style={styles.goalsContainer}>
                <View style={styles.goalsStat}>
                  <View style={styles.goalsIndicator} />
                  <Text style={styles.goalsTeam}>MAN</Text>
                  <Text style={styles.goalsNumber}>78</Text>
                </View>
                <View style={styles.pieChart}>
                  <View style={styles.pieSlice} />
                </View>
                <View style={styles.goalsStat}>
                  <Text style={styles.goalsNumber}>43</Text>
                  <Text style={styles.goalsTeam}>ARS</Text>
                  <View style={[styles.goalsIndicator, styles.arsenalIndicator]} />
                </View>
              </View>
            </View>

            {/* Goals Conceded */}
            <View style={styles.statsRow}>
              <Text style={styles.statsLabel}>Goals conceded</Text>
              <View style={styles.comparisonBar}>
                <Text style={styles.comparisonNumber}>33</Text>
                <View style={styles.comparisonBarContainer}>
                  <View style={[styles.comparisonBarFill, { width: '60%', backgroundColor: '#6366F1' }]} />
                </View>
                <Text style={styles.comparisonNumber}>22</Text>
              </View>
            </View>

            {/* Shots */}
            <View style={styles.statsRow}>
              <Text style={styles.statsLabel}>Shots</Text>
              <View style={styles.comparisonBar}>
                <Text style={styles.comparisonNumber}>234</Text>
                <View style={styles.comparisonBarContainer}>
                  <View style={[styles.comparisonBarFill, { width: '52%', backgroundColor: '#6366F1' }]} />
                </View>
                <Text style={styles.comparisonNumber}>220</Text>
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
  timeSection: {
    alignItems: 'center',
    flex: 1,
  },
  matchTime: {
    fontSize: 24,
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
  goalsStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  goalsIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#6366F1',
  },
  arsenalIndicator: {
    backgroundColor: '#3B82F6',
  },
  goalsTeam: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  goalsNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  pieChart: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#6366F1',
  },
  pieSlice: {
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

export default PreMatchDetailsScreen;