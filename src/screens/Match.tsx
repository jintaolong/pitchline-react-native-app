// This code is a React Native component for displaying football matches.
// It includes a calendar for selecting dates, filters for competitions, and a list of matches with details.
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  TextInput,
  FlatList,
  Image,
} from 'react-native';

const FootballMatchesScreen = () => {
  const [selectedDate, setSelectedDate] = useState(15);
  const [selectedFilters, setSelectedFilters] = useState(['Women']);
  const [showCompetitionModal, setShowCompetitionModal] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Sample data
  const weekDates = [
    { day: 'M', date: 11 },
    { day: 'T', date: 12 },
    { day: 'W', date: 13 },
    { day: 'T', date: 14 },
    { day: 'F', date: 15 },
    { day: 'S', date: 16 },
    { day: 'S', date: 17 },
  ];

  const competitions = [
    'Premier League',
    'La Liga',
    'Bundesliga',
    'Serie A',
    'Ligue 1',
    'Champions League',
    'Europa League',
  ];

  const matches = [
    {
      id: 1,
      homeTeam: 'West Ham Utd',
      awayTeam: 'Walsall',
      homeScore: 0,
      awayScore: 1,
      status: 'End',
      competition: 'Premier League',
      channel: 'Sky Sports',
      viewers: '180,000',
      time: null,
    },
    {
      id: 2,
      homeTeam: 'Manchester Utd',
      awayTeam: 'Arsenal',
      homeScore: 2,
      awayScore: 1,
      status: 'LIVE',
      competition: 'Premier League',
      channel: 'Sky Sports',
      viewers: '450,000',
      time: null,
    },
    {
      id: 3,
      homeTeam: 'Real Madrid',
      awayTeam: 'Barcelona',
      homeScore: null,
      awayScore: null,
      status: 'Today 19:45',
      competition: 'La Liga',
      channel: 'ITV Sport',
      viewers: '600,000',
      time: 'Today 19:45',
    },
    {
      id: 4,
      homeTeam: 'Bayern Munich',
      awayTeam: 'Borussia Dortmund',
      homeScore: null,
      awayScore: null,
      status: 'Today 20:00',
      competition: 'Bundesliga',
      channel: 'BT Sport',
      viewers: '350,000',
      time: 'Today 20:00',
    },
    {
      id: 5,
      homeTeam: 'Juventus',
      awayTeam: 'Inter Milan',
      homeScore: null,
      awayScore: null,
      status: 'Tomorrow 15:00',
      competition: 'Serie A',
      channel: 'ESPN',
      viewers: '300,000',
      time: 'Tomorrow 15:00',
    },
    {
      id: 6,
      homeTeam: 'PSG',
      awayTeam: 'Marseille',
      homeScore: null,
      awayScore: null,
      status: 'Tomorrow 17:00',
      competition: 'Ligue 1',
      channel: 'beIN Sports',
      viewers: '250,000',
      time: 'Tomorrow 17:00',
    },
  ];

  const filteredCompetitions = competitions.filter(comp =>
    comp.toLowerCase().includes(searchText.toLowerCase())
  );

  const toggleFilter = (filter: string) => {
    if (selectedFilters.includes(filter)) {
      setSelectedFilters(selectedFilters.filter(f => f !== filter));
    } else {
      setSelectedFilters([...selectedFilters, filter]);
    }
  };

  const renderCalendarDate = ({ item }: { item: { day: string; date: number } }) => (
    <TouchableOpacity
      style={[
        styles.dateButton,
        selectedDate === item.date && styles.selectedDateButton
      ]}
      onPress={() => setSelectedDate(item.date)}
    >
      <Text style={[
        styles.dayText,
        selectedDate === item.date && styles.selectedDateText
      ]}>
        {item.day}
      </Text>
      <Text style={[
        styles.dateText,
        selectedDate === item.date && styles.selectedDateText
      ]}>
        {item.date}
      </Text>
    </TouchableOpacity>
  );

  type Match = {
    id: number;
    homeTeam: string;
    awayTeam: string;
    homeScore: number | null;
    awayScore: number | null;
    status: string;
    competition: string;
    channel: string;
    viewers: string;
    time: string | null;
  };

  const renderMatch = ({ item }: { item: Match }) => (
    <View style={styles.matchCard}>
      <View style={styles.matchHeader}>
        <Text style={styles.statusText}>{item.status}</Text>
        <View style={styles.competitionContainer}>
          <Text style={styles.competitionText}>{item.competition}</Text>
          <TouchableOpacity style={styles.favoriteButton}>
            <Text style={styles.favoriteIcon}>♡</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.matchContent}>
        <View style={styles.teamContainer}>
          <View style={styles.teamInfo}>
            <View style={styles.teamAvatar} />
            <Text style={styles.teamName}>{item.homeTeam}</Text>
          </View>
          
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreText}>
              {item.homeScore !== null ? item.homeScore : ''}
            </Text>
            <Text style={styles.scoreSeparator}>-</Text>
            <Text style={styles.scoreText}>
              {item.awayScore !== null ? item.awayScore : ''}
            </Text>
          </View>
          
          <View style={styles.teamInfo}>
            <Text style={styles.teamName}>{item.awayTeam}</Text>
            <View style={styles.teamAvatar} />
          </View>
        </View>
        
        <View style={styles.matchFooter}>
          <View style={styles.channelInfo}>
            <Text style={styles.channelIcon}>📺</Text>
            <Text style={styles.channelText}>{item.channel}</Text>
          </View>
          <View style={styles.viewersInfo}>
            <Text style={styles.viewersIcon}>👁</Text>
            <Text style={styles.viewersText}>{item.viewers}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderCompetitionModal = () => (
    <Modal
      visible={showCompetitionModal}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setShowCompetitionModal(false)}>
            <Text style={styles.modalCloseButton}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Select Competition</Text>
          <TouchableOpacity onPress={() => setShowCompetitionModal(false)}>
            <Text style={styles.modalDoneButton}>Done</Text>
          </TouchableOpacity>
        </View>
        
        <TextInput
          style={styles.searchInput}
          placeholder="Search competitions..."
          value={searchText}
          onChangeText={setSearchText}
        />
        
        <FlatList
          data={filteredCompetitions}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.competitionItem}
              onPress={() => {
                toggleFilter(item);
                setShowCompetitionModal(false);
              }}
            >
              <Text style={styles.competitionItemText}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      </SafeAreaView>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Matches</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.notificationButton}>
            <Text style={styles.notificationIcon}>🔔</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.profileButton}>
            <View style={styles.profileAvatar} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {/* Calendar */}
        <View style={styles.calendar}>
          <FlatList
            data={weekDates}
            renderItem={renderCalendarDate}
            keyExtractor={(item) => item.date.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            scrollEnabled={false}
            contentContainerStyle={styles.calendarContainer}
          />
        </View>

        {/* Filters */}
        <View style={styles.filtersContainer}>
          <Text style={styles.filtersTitle}>Filters</Text>
          
          <View style={styles.filterButtons}>
            <TouchableOpacity
              style={[styles.filterButton, styles.activeFilterButton]}
              onPress={() => toggleFilter('Women')}
            >
              <Text style={[styles.filterButtonText, styles.activeFilterButtonText]}>
                Women
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.filterButton}
              onPress={() => setShowCompetitionModal(true)}
            >
              <Text style={styles.filterButtonText}>Competition ▼</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.filterButton}
              onPress={() => toggleFilter('Live Chat')}
            >
              <Text style={styles.filterButtonText}>Live Chat</Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity
            style={styles.advancedFiltersButton}
            onPress={() => setShowAdvancedFilters(!showAdvancedFilters)}
          >
            <Text style={styles.advancedFiltersText}>Advanced Filters</Text>
            <Text style={styles.advancedFiltersIcon}>
              {showAdvancedFilters ? '▲' : '▼'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Matches List */}
        <FlatList
          data={matches}
          renderItem={renderMatch}
          keyExtractor={(item) => item.id.toString()}
          scrollEnabled={false}
        />
      </ScrollView>

      {renderCompetitionModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationButton: {
    marginRight: 15,
  },
  notificationIcon: {
    fontSize: 20,
  },
  profileButton: {
    width: 30,
    height: 30,
  },
  profileAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#6B73FF',
  },
  content: {
    flex: 1,
  },
    calendar: {
    backgroundColor: 'white',
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  calendarContainer: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  dateButton: {
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    flex: 1,
    // marginHorizontal: 2,
  },
  selectedDateButton: {
    backgroundColor: '#9CA3AF',
  },
  dayText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  dateText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  selectedDateText: {
    color: 'white',
  },
  // calendar: {
  //   backgroundColor: 'white',
  //   paddingVertical: 20,

  // },
  // dateButton: {
  //   alignItems: 'center',
  //   paddingHorizontal: 20,
  //   paddingVertical: 10,
  //   marginHorizontal: 5,
  //   borderRadius: 8,
  // },
  // selectedDateButton: {
  //   backgroundColor: '#9CA3AF',
  // },
  // dayText: {
  //   fontSize: 12,
  //   color: '#666',
  //   marginBottom: 5,
  // },
  // dateText: {
  //   fontSize: 16,
  //   fontWeight: 'bold',
  // },
  // selectedDateText: {
  //   color: 'white',
  // },
  filtersContainer: {
    backgroundColor: 'white',
    margin: 15,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  filtersTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  filterButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  filterButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginRight: 10,
    marginBottom: 10,
  },
  activeFilterButton: {
    backgroundColor: '#6B73FF',
    borderColor: '#6B73FF',
  },
  filterButtonText: {
    color: '#666',
  },
  activeFilterButtonText: {
    color: 'white',
  },
  advancedFiltersButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  advancedFiltersText: {
    fontSize: 16,
    fontWeight: '500',
  },
  advancedFiltersIcon: {
    fontSize: 12,
  },
  matchCard: {
    backgroundColor: 'white',
    marginHorizontal: 15,
    marginBottom: 10,
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  matchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  statusText: {
    fontSize: 12,
    color: '#FF6B6B',
    fontWeight: 'bold',
  },
  competitionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  competitionText: {
    fontSize: 12,
    color: '#666',
    marginRight: 10,
  },
  favoriteButton: {
    padding: 5,
  },
  favoriteIcon: {
    fontSize: 16,
  },
  matchContent: {
    flex: 1,
  },
  teamContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  teamInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  teamAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#6B73FF',
    marginRight: 8,
  },
  teamName: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  scoreText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6B73FF',
    minWidth: 20,
    textAlign: 'center',
  },
  scoreSeparator: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 5,
    color: '#6B73FF',
  },
  matchFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  channelInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  channelIcon: {
    fontSize: 12,
    marginRight: 5,
  },
  channelText: {
    fontSize: 12,
    color: '#666',
  },
  viewersInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewersIcon: {
    fontSize: 12,
    marginRight: 5,
  },
  viewersText: {
    fontSize: 12,
    color: '#666',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalCloseButton: {
    color: '#666',
    fontSize: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalDoneButton: {
    color: '#6B73FF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  searchInput: {
    margin: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    fontSize: 16,
  },
  competitionItem: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  competitionItemText: {
    fontSize: 16,
  },
});

export default FootballMatchesScreen;