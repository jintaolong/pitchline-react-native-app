// This code is a React Native component for displaying football matches.
// It includes a calendar for selecting dates, filters for competitions, and a list of matches with details.
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  TextInput,
  FlatList,
  SectionList,
  Animated,
  ScrollView
} from 'react-native';
import MatchCard from '../components/MatchCard';
import { Match } from '../models/Matches';
import { getMatchLit } from '../services/matchService';
import { FixtureResponseDto } from '../dtos/Fixtures';
import log from '../utils/logger';
import { addFavourite, Favourite, FavouriteType, getFavourites, removeFavourite } from '../utils/follow';
import { fixtureDtoToMatch } from '../utils/mappers';
import { globalStyles } from '../styles/globalStyles';
import MatchCardHeader from '../components/MatchCardHeader';
import { useIsFocused } from '@react-navigation/native';

const CALENDAR_SPAN = 60;

interface ScreenCalendarDate {
  selectedDate : Date;
  calendarStartDate: Date;
  calendarEndDate: Date;
  calendarScrollIndex: number;
}

interface GroupedFixtures {
  [competitionId: number]: {
    name: string;
    matches: Match[];
  };
}

interface GroupFilter {
  name: string;
  id: number;
}

const getWeekDates = (selectedDate: Date = new Date()) => {
  // Find the Monday of the week containing selectedDate
  const day = selectedDate.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  const startOfWeek = new Date(selectedDate);
  startOfWeek.setDate(selectedDate.getDate() + diff);

  // Calculate the start date (2 weeks before this week's Monday)
  const startDate = new Date(startOfWeek);
  startDate.setDate(startOfWeek.getDate() - CALENDAR_SPAN);

  // Generate 5 weeks (2 before, current, 2 after) = 35 days
  const dates = [];
  for (let i = 0; i < CALENDAR_SPAN * 2; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    dates.push(date);
  }
  return dates;
}

const getCalendarScrollIndex = (selectedDate: Date, startDate: Date) => {
  let timeGap = selectedDate.getTime() - startDate.getTime();
  let calendarScrollIndex = Math.floor(timeGap / (1000 * 60 * 60 * 24)) - 7;
  return calendarScrollIndex;
}

const FootballMatchesScreen = () => {
  const today = new Date();
  const weekDates = getWeekDates();
  const [selectedDate, setSelectedDate] = useState<ScreenCalendarDate>({
    selectedDate: today,
    calendarStartDate: weekDates[0],
    calendarEndDate: weekDates[weekDates.length - 1],
    calendarScrollIndex: getCalendarScrollIndex(today, weekDates[0]),
    // calendarScrollIndex: 10 - 2
  });
  const [allGroupedFixtures, setAllGroupedFixtures] = useState<GroupedFixtures>({});
  const [selectedGroups, setSelectedGroups] = useState<number[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<GroupFilter[]>([{ name: 'All', id: 0 }]);
  const [showCompetitionModal, setShowCompetitionModal] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [favouriteLeagues, setFavouriteLeagues] = useState<Favourite[]>([]);

  useEffect(() => {
    getFavourites().then((favs: Favourite[]) => {
      setFavouriteLeagues(
        favs.filter(fav => {
              return fav.type === 'league';
        })
      );
      // const favsMap: { [key: number]: boolean } = {};
      // favs.forEach(fav => {
      //   favsMap[fav.id] = true;
      // });
      // setFavouriteLeagues(favsMap);
    });
  }, []);

  // const isFocused = useIsFocused();
  // useEffect(() => {
  //   if (isFocused) {
  //     getFavourites()
  //       .then((favs) => {
  //         setFavouriteLeagues(
  //           favs.filter(fav => {
  //             return fav.type === 'league';
  //           })
  //         );
  //       })
  //       .catch((error) => {
  //         console.error('Error fetching favourites:', error);
  //       });
  //   }
  // }, [isFocused]);

  // const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Animated value for filter container height
  // const filterAnim = useRef(new Animated.Value(1)).current; // 1 = expanded, 0 = collapsed

  // Update filtered fixtures when filters or allFixtures change
  useEffect(() => {
    log.debug(`Selected filters: ${selectedFilters.join(', ')}`);
    if (selectedFilters.find(f => f.name === 'All')) {
      // setFixtures(allFixtures);
      setSelectedGroups(Object.keys(allGroupedFixtures).map(Number));
      return;
    }
    let filteredGroupIds = Object.keys(allGroupedFixtures).map(Number);

    const compFilters = selectedFilters.filter(f =>
      f.name !== 'All' && f.name !== 'Women' && f.name !== 'Live Chat'
    );
    if (compFilters.length > 0) {
      filteredGroupIds = compFilters.map(compFilter => compFilter.id);
    }
    if (selectedFilters.length === 0) {
      filteredGroupIds = []; // If no filters selected, show all fixtures
    }
    log.debug(`Filtered fixtures count: ${filteredGroupIds.length}`);
    // setFixtures(filtered);
    setSelectedGroups(filteredGroupIds);
  }, [selectedFilters, allGroupedFixtures]);


  const updateAllFixtures = () => {
    log.debug(`Updating fixtures for date: ${selectedDate.selectedDate.toLocaleDateString()}`);
    // Format selectedDate as "MMMM-MM-dd" (e.g., "June-06-10")
    const year = selectedDate.selectedDate.getFullYear();
    const month = (selectedDate.selectedDate.getMonth() + 1).toString().padStart(2, '0');
    const day = selectedDate.selectedDate.getDate().toString().padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    getMatchLit(formattedDate).then(
      (data: FixtureResponseDto[]) => {
      // Group fixtures by competition
      const grouped: GroupedFixtures = {};
      data.forEach((fixture) => {
        const competition = fixture.fixture.league.name || 'Unknown Competition';
        const competitionId = fixture.fixture.league.id || 0; // Assuming league ID is available
        
        let comp = competitionId || 0;
        grouped[comp] = grouped[comp] || { name: competition, matches: [] };
        grouped[comp].matches.push(fixtureDtoToMatch(fixture));
        });
        setAllGroupedFixtures(grouped);
        
        // Get sorted competition names
        const competitionIds = Object.keys(grouped).map(Number).sort((a, b) => a - b);
        setSelectedGroups(competitionIds)
      });
      }
    // );
  // }
  
  useEffect(() => {
    // reset everything
    setSelectedGroups([]);
    // update ref
    updateAllFixtures();
  }, [selectedDate]);

  const filteredGroups = selectedGroups.filter(groupId =>
    allGroupedFixtures[groupId].name.toLowerCase().includes(searchText.toLowerCase())
  );
  
  // const handleMatchlistScroll = Animated.event(
  //   [{ nativeEvent: { contentOffset: { y: filterAnim } } }],
  //   { useNativeDriver: false }
  // );
  
  // Interpolate height or scale
  // const filterHeight = filterAnim.interpolate({
  //   inputRange: [0, 1], // adjust 100 to how much scroll you want for full collapse
  //   outputRange: [70, 0], // 70 = expanded height, 0 = collapsed
  //   extrapolate: 'clamp',
  // });

  const toggleFilter = (filter: { name: string; id: number }) => {
    log.debug(`Toggling filter: ${filter}`);
    let temp_filters = selectedFilters.slice();
    // If toggling a filter other than "All", remove "All" from selectedFilters
    if (filter.name !== 'All' && temp_filters.find(f => f.name === 'All')) {
      temp_filters = temp_filters.filter(f => f.name !== 'All');
    }
    if (temp_filters.find(f => f.name === filter.name)) {
      // unselect the filter if it gets double selected
      setSelectedFilters(temp_filters.filter(f => f.id !== filter.id));
    } else {
      setSelectedFilters([...temp_filters, filter]);
    }
  };

  const renderCalendarDate = ({ item }: { item: Date }) => (
    <TouchableOpacity
      style={[
        styles.dateButton,
        selectedDate.selectedDate.toDateString() === item.toDateString() && styles.selectedDateButton
      ]}
      onPress={() => {
        // calendarRef.current = item;
        setSelectedDate(
          {
            selectedDate: item,
            calendarStartDate: weekDates[0],
            calendarEndDate: weekDates[weekDates.length - 1],
            calendarScrollIndex: getCalendarScrollIndex(item, weekDates[0]),
          } as ScreenCalendarDate
        );
      }}
    >
      <Text style={[
        styles.dayText,
        selectedDate.selectedDate.getDate() === item.getDate() && styles.selectedDateText
      ]}>
        {item.toLocaleDateString('en-US', { weekday: 'short' })}
      </Text>
      <Text style={[
        styles.dateText,
        selectedDate.selectedDate.getDate() === item.getDate() && styles.selectedDateText
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
          data={Object.keys(allGroupedFixtures)}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.competitionItem}
              onPress={() => {
                toggleFilter({
                  name: allGroupedFixtures[Number(item)].name,
                  id: Number(item),
                });
                setShowCompetitionModal(false);
              }}
            >
              <Text style={styles.competitionItemText}>{allGroupedFixtures[Number(item)].name}</Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={<Text style={globalStyles.emptyListText}>No competitions found</Text>}
        />
      </SafeAreaView>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* <View style={styles.header}>
        <Text style={styles.headerTitle}>Matches</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.notificationButton}>
            <Text style={styles.notificationIcon}>🔔</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.profileButton}>
            <View style={styles.profileAvatar} />
          </TouchableOpacity>
        </View>
      </View> */}


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
            // snapToAlignment="start"
            decelerationRate="fast"
            bounces={true}
            scrollEnabled={true}
            // extraData={selectedDate}
            initialScrollIndex={selectedDate.calendarScrollIndex} // Center today
            getItemLayout={(_, index) => ({
              length: 60, // approximate width of each date button (adjust if needed)
              offset: 60 * index,
              index,
            })}
          />
        </View>

        {/* Filters */}
        <Animated.View style={[styles.filtersContainer, { height: 70, overflow: 'hidden' }]}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={[styles.filterButtons, { flexDirection: 'row', flexWrap: 'wrap' }]}>
              <TouchableOpacity
                style={[
            styles.filterButton,
            selectedFilters.find(f => f.name === 'All') && styles.activeFilterButton
                ]}
                onPress={() => toggleFilter({ name: 'All', id: 0 })}
              >
                <Text style={[
            styles.filterButtonText,
            selectedFilters.find(f => f.name === 'All') && styles.activeFilterButtonText
                ]}>
            All
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.filterButton}
                onPress={() => setShowCompetitionModal(true)}
              >
                <Text style={styles.filterButtonText}>Competition ▼</Text>
              </TouchableOpacity>
              
            {/* Show selected filters as separate buttons */}
              {selectedFilters
                .filter(f => f.name !== 'All') // Optionally hide "All" from the selected list
                .map(filter => (
              <TouchableOpacity
              key={filter.id}
              style={[styles.filterButton, styles.activeFilterButton]}
              onPress={() => toggleFilter(filter)}
              >
              <Text style={[styles.filterButtonText, styles.activeFilterButtonText]}>
                {filter.name} ✕
              </Text>
              </TouchableOpacity>
                ))}
            </View>

          </ScrollView>
        </Animated.View>

        {/* Matches List */}
    <SectionList
      sections={filteredGroups.map(groupId => ({
        id: groupId,
        title: allGroupedFixtures[groupId].name,
        data: allGroupedFixtures[groupId].matches || [],
      }))}
      keyExtractor={(item) => `${item.competitionId}-${item.id}`}
      renderSectionHeader={({ section: { id, title } }) => {
        // let favIconName = favouriteLeagues[Number(id)] ? 'bell-minus' : 'bell-plus-outline';
        return (
          <MatchCardHeader 
            section={{ id, title, type: 'league' }}
            favourites={favouriteLeagues}
            OnSelect={(favourite: Favourite) => setFavouriteLeagues(prev => [...prev, favourite])}
            OnDeselect={(favourite: Favourite) => setFavouriteLeagues(prev => prev.filter(fav => fav.id !== favourite.id))}
          />
        )
    }}
      renderItem={renderMatch}
      ListEmptyComponent={() => (
        <View style={globalStyles.emptyListText}>
          <Text>No matches found</Text>
        </View>
      )}
      // onScroll={handleMatchlistScroll}
    />

      {renderCompetitionModal()}
    </SafeAreaView>
  );
};

const PRIMARY_COLOR = '#6B73FF';

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
    backgroundColor: PRIMARY_COLOR,
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
    marginHorizontal: 2,
    borderWidth: 2,
    borderColor: 'transparent',
    backgroundColor: 'transparent',
  },
  selectedDateButton: {
    borderColor: PRIMARY_COLOR,
    backgroundColor: 'transparent',
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
    color: PRIMARY_COLOR,
  },
  triangleCorner: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 0,
    height: 0,
    borderLeftWidth: 0,
    borderRightWidth: 12,
    borderBottomWidth: 12,
    borderStyle: 'solid',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: PRIMARY_COLOR,
    backgroundColor: 'transparent',
    zIndex: 10,
  },
  filtersContainer: {
    backgroundColor: 'white',
    // margin: 15,
    padding: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  filtersTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    // marginBottom: 15,
  },
  filterButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    // marginBottom: 15,
  },
  filterButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginRight: 10,
    // marginBottom: 10,
  },
  activeFilterButton: {
    backgroundColor: PRIMARY_COLOR,
    borderColor: PRIMARY_COLOR,
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
    backgroundColor: PRIMARY_COLOR,
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
    color: PRIMARY_COLOR,
    minWidth: 20,
    textAlign: 'center',
  },
  scoreSeparator: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 5,
    color: PRIMARY_COLOR,
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
    color: PRIMARY_COLOR,
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