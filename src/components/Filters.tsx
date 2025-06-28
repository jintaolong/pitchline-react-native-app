// components/Filters.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, TextInput, FlatList } from 'react-native';

const presetFilters = ['Women', 'Competition', 'Live Chat'];

const competitionList = [
  'Premier League',
  'La Liga',
  'Bundesliga',
  'Serie A',
  'Ligue 1',
  'Champions League',
  'Europa League',
];

export default function Filters({
  onFilterChange,
}: {
  onFilterChange: (filters: { [key: string]: string | boolean }) => void;
}) {
  const [competitionModalVisible, setCompetitionModalVisible] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<{ [key: string]: string | boolean }>({});
  const [competitionSearch, setCompetitionSearch] = useState('');

  const toggleFilter = (filter: string) => {
    if (filter === 'Competition') {
      setCompetitionModalVisible(true);
    } else {
      const updated = {
        ...selectedFilters,
        [filter]: !selectedFilters[filter],
      };
      setSelectedFilters(updated);
      onFilterChange(updated);
    }
  };

  const selectCompetition = (name: string) => {
    const updated = {
      ...selectedFilters,
      Competition: name,
    };
    setSelectedFilters(updated);
    setCompetitionModalVisible(false);
    setCompetitionSearch('');
    onFilterChange(updated);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Filters</Text>
      <View style={styles.filterRow}>
        {presetFilters.map((filter) => (
            <TouchableOpacity
            key={`filter-${filter}-${selectedFilters[filter] ? selectedFilters[filter] : 'inactive'}`}
            style={[
              styles.filterButton,
              selectedFilters[filter] && styles.filterButtonActive,
            ]}
            onPress={() => toggleFilter(filter)}
            >
            <Text style={styles.filterText}>{filter}</Text>
            </TouchableOpacity>
        ))}
      </View>

      {/* Competition Modal */}
      <Modal visible={competitionModalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <TextInput
              placeholder="Search competition..."
              style={styles.searchInput}
              value={competitionSearch}
              onChangeText={setCompetitionSearch}
            />
            <FlatList
              data={competitionList.filter((item) =>
                item.toLowerCase().includes(competitionSearch.toLowerCase())
              )}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.competitionItem}
                  onPress={() => selectCompetition(item)}
                >
                  <Text style={styles.filterText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity onPress={() => setCompetitionModalVisible(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 16,
    backgroundColor: '#fff',
    marginTop: 8,
    elevation: 2,
  },
  title: {
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 8,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  filterButtonActive: {
    backgroundColor: '#5C6EF8',
  },
  filterText: {
    color: '#333',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 24,
  },
  modalBox: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    maxHeight: '70%',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 8,
    marginBottom: 12,
  },
  competitionItem: {
    paddingVertical: 8,
  },
  cancelText: {
    marginTop: 12,
    color: '#888',
    textAlign: 'center',
  },
});