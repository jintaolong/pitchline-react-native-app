// This code is a React Native component for displaying football matches.
// It includes a calendar for selecting dates, filters for competitions, and a list of matches with details.
import React, { useEffect, useState } from 'react';
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
} from 'react-native';
import MatchCard from '../components/MatchCard';
import { Match } from '../dtos/Matches';
import { getMatchLit } from '../services/matchService';
import { FixtureResponse, Status } from '../dtos/Fixtures';
import log from '../utils/logger';


const getWeekDates = (selectedDate: Date = new Date()) => {
  // Find the Monday of the week containing selectedDate
  const day = selectedDate.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  const startOfWeek = new Date(selectedDate);
  startOfWeek.setDate(selectedDate.getDate() + diff);

  // Calculate the start date (2 weeks before this week's Monday)
  const startDate = new Date(startOfWeek);
  startDate.setDate(startOfWeek.getDate() - 14);

  // Generate 5 weeks (2 before, current, 2 after) = 35 days
  const dates = [];
  for (let i = 0; i < 35; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    dates.push(date);
  }
  return dates;
}


const formatStatus = (status: Status, fixtureStartDate: string) : string => {
  let out = ""
  const startDate = new Date(fixtureStartDate);
  const today = new Date();
  if (status.long === 'Not Started') {
    // You can now use startDate as a Date object
    let prefix = '';
    if (
      startDate.getDate() === today.getDate() &&
      startDate.getMonth() === today.getMonth() &&
      startDate.getFullYear() === today.getFullYear()
    ) {
      prefix = 'Today';
    } else {
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      if (
        startDate.getDate() === tomorrow.getDate() &&
        startDate.getMonth() === tomorrow.getMonth() &&
        startDate.getFullYear() === tomorrow.getFullYear()
      ) {
        prefix = 'Tomorrow';
      } else {
        // Use the exact date as prefix in format YYYY-MM-DD
        prefix = `${startDate.getFullYear()}-${(startDate.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${startDate.getDate().toString().padStart(2, '0')}`;
      }
    }
    out = `${prefix} ${startDate.getHours()}:${startDate.getMinutes().toString().padStart(2, '0')}`;
  } else if (status.long === 'End') {
    out = 'End';
  } else{
    // Inplay
    out = `LIVE ${status.elapsed ? status.elapsed : 0} ${status.extra ? `+${status.extra}` : ''}`;
  }
  // TOOO: handle half time?
  return out;
}



const FootballMatchesScreen = () => {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [allFixtures, setAllFixtures] = useState<Match[]>([]);
  const [fixtures, setFixtures] = useState<Match[]>([]);
  const [selectedFilters, setSelectedFilters] = useState(['All']);
  // const [filteredFixtures, setFilteredFixtures] = useState<Match[]>([]);
  const [showCompetitionModal, setShowCompetitionModal] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // "allCompetitions" is the full list, updated only when allFixtures changes
  const [allCompetitions, setAllCompetitions] = useState<string[]>([]);
  // "competitions" is the filtered list, updated when searchText changes
  const [competitions, setCompetitions] = useState<string[]>([]);

  // Update allCompetitions when allFixtures changes
  useEffect(() => {
    const uniqueCompetitions = Array.from(
      new Set(allFixtures.map(f => f.competition || 'Other'))
    );
    setAllCompetitions(uniqueCompetitions);
    setCompetitions(uniqueCompetitions); // Reset competitions when fixtures change
  }, [allFixtures]);

  // Update competitions when searchText changes
  useEffect(() => {
    if (searchText.trim() === '') {
      setCompetitions(allCompetitions);
    } else {
      setCompetitions(
        allCompetitions.filter(comp =>
          comp.toLowerCase().includes(searchText.toLowerCase())
        )
      );
    }
  }, [searchText, allCompetitions]);

  // Update filtered fixtures when filters or allFixtures change
  useEffect(() => {
    log.debug(`Selected filters: ${selectedFilters.join(', ')}`);
    if (selectedFilters.includes('All')) {
      setFixtures(allFixtures);
      return;
    }
    let filtered = allFixtures;

    const compFilters = selectedFilters.filter(f =>
      f !== 'All' && f !== 'Women' && f !== 'Live Chat'
    );
    if (compFilters.length > 0) {
      filtered = filtered.filter(f =>
        compFilters.includes(f.competition)
      );
    }
    if (selectedFilters.length === 0) {
      filtered = []; // If no filters selected, show all fixtures
    }
    log.debug(`Filtered fixtures count: ${filtered.length}`);
    setFixtures(filtered);
  }, [selectedFilters, allFixtures]);

  const weekDates = getWeekDates();

  const updateAllFixtures = () => {
    let matches: Match[] = [];
    log.debug(`Updating fixtures for date: ${selectedDate.toLocaleDateString()}`);
    // const deltaDay = Math.ceil((selectedDate.getTime() - today.getTime()) / 1000 / 1000 / 60 /60 / 24) + 1;
    // // const deltaDay = selectedDate - today
    // log.debug(deltaDay);
    // Format selectedDate as "MMMM-MM-dd" (e.g., "June-06-10")
    const year = selectedDate.getFullYear();
    const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
    const day = selectedDate.getDate().toString().padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    getMatchLit(formattedDate).then(
      (data: FixtureResponse[]) => {
      matches = data.map((fixture) => {
        const homeTeam = fixture.fixture.teams.home.name;
        const awayTeam = fixture.fixture.teams.away.name;
        const homeLogo = fixture.fixture.teams.home.logo ? fixture.fixture.teams.home.logo : '';
        const awayLogo = fixture.fixture.teams.away.logo ? fixture.fixture.teams.away.logo : '';
        const homeScore = fixture.fixture.goals.home ? fixture.fixture.goals.home : null;
        const awayScore = fixture.fixture.goals.away ? fixture.fixture.goals.away : null;
        // const status = formatStatus(fixture.fixture.fixture.status, fixture.fixture.fixture.date);
        const status = fixture.fixture.fixture.status.short;
        const competition = fixture.fixture.league.name || 'Unknown Competition';
        const competitionId = fixture.fixture.league.id || 0; // Assuming league ID is available
        const channel = 'Sky Sports'; // Placeholder, replace with actual channel data if available
        const viewers = '180,000'; // Placeholder, replace with actual viewers data if available
        const time = fixture.fixture.fixture.date ? new Date(fixture.fixture.fixture.date).toLocaleTimeString() : null;

        return {
        id: fixture.fixture.fixture.id,
        homeTeam: homeTeam,
        awayTeam: awayTeam,
        homeLogo: homeLogo,
        awayLogo: awayLogo,
        homeScore: homeScore,
        awayScore: awayScore,
        status: status,
        competition: competition,
        competitionId: competitionId,
        channel: channel,
        viewers: viewers,
        kickoffTime: fixture.fixture.fixture.date ? new Date(fixture.fixture.fixture.date) : null,
        time: time,
        } as Match;
      });
      setAllFixtures(matches);
      }
    );
  }
  
  // const matches: Match[] = [
  //   {
  //     id: 1,
  //     homeTeam: 'West Ham Utd',
  //     awayTeam: 'Walsall',
  //     homeScore: 0,
  //     awayScore: 1,
  //     status: 'End',
  //     competition: 'Premier League',
  //     channel: 'Sky Sports',
  //     viewers: '180,000',
  //     time: null,
  //   },
  //   {
  //     id: 2,
  //     homeTeam: 'Manchester Utd',
  //     awayTeam: 'Arsenal',
  //     homeScore: 2,
  //     awayScore: 1,
  //     status: 'LIVE',
  //     competition: 'Premier League',
  //     channel: 'Sky Sports',
  //     viewers: '450,000',
  //     time: null,
  //   },
  //   {
  //     id: 3,
  //     homeTeam: 'Real Madrid',
  //     awayTeam: 'Barcelona',
  //     homeScore: null,
  //     awayScore: null,
  //     status: 'Today 19:45',
  //     competition: 'La Liga',
  //     channel: 'ITV Sport',
  //     viewers: '600,000',
  //     time: 'Today 19:45',
  //   },
  //   {
  //     id: 4,
  //     homeTeam: 'Bayern Munich',
  //     awayTeam: 'Borussia Dortmund',
  //     homeScore: null,
  //     awayScore: null,
  //     status: 'Today 20:00',
  //     competition: 'Bundesliga',
  //     channel: 'BT Sport',
  //     viewers: '350,000',
  //     time: 'Today 20:00',
  //   },
  //   {
  //     id: 5,
  //     homeTeam: 'Juventus',
  //     awayTeam: 'Inter Milan',
  //     homeScore: null,
  //     awayScore: null,
  //     status: 'Tomorrow 15:00',
  //     competition: 'Serie A',
  //     channel: 'ESPN',
  //     viewers: '300,000',
  //     time: 'Tomorrow 15:00',
  //   },
  //   {
  //     id: 6,
  //     homeTeam: 'PSG',
  //     awayTeam: 'Marseille',
  //     homeScore: null,
  //     awayScore: null,
  //     status: 'Tomorrow 17:00',
  //     competition: 'Ligue 1',
  //     channel: 'beIN Sports',
  //     viewers: '250,000',
  //     time: 'Tomorrow 17:00',
  //   },
  // ];

  const filteredCompetitions = competitions.filter(comp =>
    comp.toLowerCase().includes(searchText.toLowerCase())
  );

  const toggleFilter = (filter: string) => {
    log.debug(`Toggling filter: ${filter}`);
    let temp_filters = selectedFilters.slice();
    // If toggling a filter other than "All", remove "All" from selectedFilters
    if (filter !== 'All' && temp_filters.includes('All')) {
      temp_filters = temp_filters.filter(f => f !== 'All');
    }
    if (temp_filters.includes(filter)) {
      // unselect the filter if it gets double selected
      setSelectedFilters(temp_filters.filter(f => f !== filter));
    } else {
      setSelectedFilters([...temp_filters, filter]);
    }
  };

  const renderCalendarDate = ({ item }: { item: Date }) => (
    <TouchableOpacity
      style={[
        styles.dateButton,
        selectedDate.getDate() === item.getDate() && styles.selectedDateButton
      ]}
      onPress={() => setSelectedDate(item)}
    >
      <Text style={[
        styles.dayText,
        selectedDate.getDate() === item.getDate() && styles.selectedDateText
      ]}>
        {item.toLocaleDateString('en-US', { weekday: 'short' })}
      </Text>
      <Text style={[
        styles.dateText,
        selectedDate.getDate() === item.getDate() && styles.selectedDateText
      ]}>
        {item.getDate()}
      </Text>
    </TouchableOpacity>
  );

  const renderMatch = ({ item }: { item: Match }) => (
    <MatchCard item={item} />
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
          data={competitions}
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

  useEffect(
    updateAllFixtures, [selectedDate]
  )
  
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
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.calendarContainer}
            keyExtractor={(item: Date, index: number) => item.toISOString() + '-' + index}
            renderItem={renderCalendarDate}
            pagingEnabled={false}
            snapToAlignment="start"
            decelerationRate="fast"
            bounces={true}
            scrollEnabled={true}
            extraData={selectedDate}
            initialScrollIndex={14} // Center today (the 15th day in 0-based index of 35 days)
            getItemLayout={(_, index) => ({
              length: 60, // approximate width of each date button (adjust if needed)
              offset: 60 * index,
              index,
            })}
          />
        </View>

        {/* Filters */}
        <View style={styles.filtersContainer}>
          <Text style={styles.filtersTitle}>Filters</Text>
          
          <View style={styles.filterButtons}>
            <TouchableOpacity
              style={[
          styles.filterButton,
          selectedFilters.includes('All') && styles.activeFilterButton
              ]}
              onPress={() => toggleFilter('All')}
            >
              <Text style={[
          styles.filterButtonText,
          selectedFilters.includes('All') && styles.activeFilterButtonText
              ]}>
          All
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
          styles.filterButton,
          selectedFilters.includes('Women') && styles.activeFilterButton
              ]}
              onPress={() => toggleFilter('Women')}
            >
              <Text style={[
          styles.filterButtonText,
          selectedFilters.includes('Women') && styles.activeFilterButtonText
              ]}>
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
              style={[
          styles.filterButton,
          selectedFilters.includes('Live Chat') && styles.activeFilterButton
              ]}
              onPress={() => toggleFilter('Live Chat')}
            >
              <Text style={[
          styles.filterButtonText,
          selectedFilters.includes('Live Chat') && styles.activeFilterButtonText
              ]}>
          Live Chat
              </Text>
            </TouchableOpacity>
          </View>

          {/* Show selected filters as separate buttons */}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 }}>
            {selectedFilters
              .filter(f => f !== 'All') // Optionally hide "All" from the selected list
              .map(filter => (
          <TouchableOpacity
            key={filter}
            style={[styles.filterButton, styles.activeFilterButton, { marginRight: 8, marginBottom: 8 }]}
            onPress={() => toggleFilter(filter)}
          >
            <Text style={[styles.filterButtonText, styles.activeFilterButtonText]}>
              {filter} ✕
            </Text>
          </TouchableOpacity>
              ))}
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
        {(() => {
          // Group fixtures by competition
          const grouped: { [competition: number]: Match[] } = {};
          const competitionIdMap: { [key: number]: string } = {};
          fixtures.forEach((fixture) => {
            const comp = fixture.competitionId || 0;
            if (!competitionIdMap[comp]) competitionIdMap[comp] = 'Other';
            competitionIdMap[comp] = fixture.competition || 'Other';
            if (!grouped[comp]) grouped[comp] = [];
            grouped[comp].push(fixture);
          });
          // Get sorted competition names
            const competitionIds = Object.keys(grouped).map(Number).sort((a, b) => a - b);
          return competitionIds.map((compId) => (
        <View key={compId}>
            <Text style={{ fontWeight: '500', fontSize: 13, color: '#666', marginLeft: 20, marginTop: 20, marginBottom: 8 }}>{competitionIdMap[compId]}</Text>
          <FlatList
            data={[...grouped[compId]].sort((a, b) => {
          const aTime = a.kickoffTime ? a.kickoffTime.getTime() : Number.MAX_SAFE_INTEGER;
          const bTime = b.kickoffTime ? b.kickoffTime.getTime() : Number.MAX_SAFE_INTEGER;
          return aTime - bTime;
            })}
            renderItem={renderMatch}
            keyExtractor={(item) => item.id ? item.id.toString() : Math.random().toString()}
            scrollEnabled={false}
          />
        </View>
          ));
        })()}
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
    paddingVertical: 10,
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
    borderRadius: 5,
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