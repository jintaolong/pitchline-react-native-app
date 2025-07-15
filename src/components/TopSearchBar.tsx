import { useNavigation } from '@react-navigation/native';
import React, { useState, useRef } from 'react';
import {
// import { useNavigation } from '@react-navigation/native';

View,
TextInput,
TouchableOpacity,
Image,
Text,
StyleSheet,
Keyboard,
ScrollView,
SectionList,
Dimensions,
} from 'react-native';
// import { mockTopSearchData } from '../utils/mocks';
import log from '../utils/logger';
import { globalStyles } from '../styles/globalStyles';
import { SearchItemDto } from '../dtos/SearchTerms';
// import { mockTopSearchData } from '../utils/mocks';
// import myData from '../assets/data/yourfile.json';

// or


type GroupSelection = {
    header: boolean;
    type: string; // 'league' | 'team' | 'player'
    key: string;
};

type TopSearchBarProps = {
fetchSuggestions: (query: string) => Promise<SearchItemDto[]>;
};

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const TopSearchBar: React.FC<TopSearchBarProps> = ({ fetchSuggestions }) => {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState<SearchItemDto[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    // const [currentSuggestionContainerHeight, setCurrentSuggestionContainerHeight] = useState(0);
    const navigation = useNavigation();
    const inputRef = useRef<TextInput>(null);
    // const suggestionsContainerRef = useRef<View>(null);

    const handleChange = async (text: string) => {
        setQuery(text);
        if (text.length > 1) {
            fetchSuggestions(text).then((filteredResults) => {
                log.debug(`Fetched ${filteredResults.length} results for query: ${text}`)
                // Filter results based on the query;
                // const filteredResults = searchData.filter(item =>
                //     item.name.toLowerCase().includes(text.toLowerCase())
                // );
                // log.debug(`Filtered results: ${filteredResults.length} items found`);        
                // const searchData = mockTopSearchData;
               log.debug(`Fetched ${filteredResults.length} results for query: ${text}`);
                setSuggestions(filteredResults);
                setShowSuggestions(true);
            });
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    const handleSelect = (item: SearchItemDto) => {
        log.debug(`Selected item: ${item.name} (${item.type})`);
        setShowSuggestions(false);
        setQuery('');
        setSuggestions([]);
        Keyboard.dismiss();
        // Navigate based on type
        if (item.type === 'league') {
            navigation.navigate('LeagueDetails', { leagueId: item.id });
        } else if (item.type === 'team') {
            navigation.navigate('TeamDetails', { teamId: item.id });
        } else if (item.type === 'player') {
            navigation.navigate('PlayerDetails', { playerId: item.id });
        }
    };

    // Prepare sections for SectionList
    const suggestionTypes = ['league', 'team', 'player'];
    const sections = suggestionTypes
        .map(type => ({
            title: type.charAt(0).toUpperCase() + type.slice(1) + 's',
            data: suggestions.filter(item => item.type === type),
        }))
        .filter(section => section.data.length > 0);

    return (
        <View 
            style={[
            styles.container,
            showSuggestions && suggestions.length > 0 && { flex: 1 }
            ]}
            onLayout={event => {
            const { height } = event.nativeEvent.layout;
            log.debug('TopSearchBar container height:', height);
            }}
        >
            <TextInput
                ref={inputRef}
                style={[
                    styles.input,
                    showSuggestions && {
                        elevation: 4,
                        shadowColor: '#000',
                        shadowOpacity: 0.1,
                        shadowRadius: 8,
                        shadowOffset: { width: 0, height: 2 },
                        borderBottomLeftRadius: 0,
                        borderBottomRightRadius: 0,
                    }
                ]}
                placeholder="Search leagues, teams, players..."
                value={query}
                onChangeText={handleChange}
                onFocus={() => setShowSuggestions(suggestions.length > 0)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
                returnKeyType="search"
            />
            {showSuggestions && suggestions.length > 0 && (
            <View
                style={styles.suggestionsContainer}
            >
                <SectionList
                sections={sections}
                keyExtractor={item => `${item.type}${item.id}`}
                keyboardShouldPersistTaps="handled"
                renderSectionHeader={({ section: { title } }) => (
                    <Text style={{ fontWeight: 'bold', fontSize: 14, marginVertical: 6, marginLeft: 8 }}>
                    {title}
                    </Text>
                )}
                renderItem={({ item }) => (
                    <TouchableOpacity
                    style={styles.suggestionItem}
                    onPress={() => handleSelect(item)}
                    >
                    <Image source={{ uri: item.photo || '' }} style={styles.image} />
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.type}>
                        {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                    </Text>
                    </TouchableOpacity>
                )}
                showsVerticalScrollIndicator
                onContentSizeChange={() => {
                    // This will trigger a re-render and shrink the container if content reduces
                    // No-op here, but ensures SectionList recalculates its height
                    if (showSuggestions) {
                        setShowSuggestions(false);
                        setShowSuggestions(true);
                    }
                }}
                ListEmptyComponent={() => (
                    <Text style={globalStyles.emptyListText}>No results found</Text>
                )}
                />
            </View>
            )}
        </View>
);
};

const styles = StyleSheet.create({
container: {
    padding: 10,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    zIndex: 1,
    position: 'relative', // <-- Add this line to ensure the container is positioned correctly
},
input: {
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f2f2f2',
    paddingHorizontal: 16,
    fontSize: 16,
},
suggestionsContainer: {
    position: 'absolute',
    top: 50,
    left: 16,
    right: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    zIndex: 100,    // <-- ensure it's above other content
    overflow: 'hidden', // <-- ensure children are clipped
    maxHeight: SCREEN_HEIGHT - 48,
    height: SCREEN_HEIGHT - 48,
},
suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
},
image: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
    backgroundColor: '#ddd',
},
name: {
    fontSize: 16,
    flex: 1,
},
type: {
    fontSize: 12,
    color: '#888',
    marginLeft: 8,
},
});

export default TopSearchBar;