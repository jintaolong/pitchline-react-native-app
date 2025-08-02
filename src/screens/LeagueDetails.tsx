import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

const mockLeague = {
    name: 'Premier League',
    country: 'England',
    logo: 'https://upload.wikimedia.org/wikipedia/en/f/f2/Premier_League_Logo.svg',
    season: '2023/2024',
    teams: 20,
    description:
        'The Premier League is the top level of the English football league system. Contested by 20 clubs, it operates on a system of promotion and relegation.',
    topScorer: 'Erling Haaland',
    upcomingMatch: {
        home: 'Manchester United',
        away: 'Liverpool',
        date: '2024-04-15',
        time: '18:30',
    },
};

const LeagueDetailsScreen: React.FC = () => {
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Image source={{ uri: mockLeague.logo }} style={styles.logo} />
            <Text style={styles.title}>{mockLeague.name}</Text>
            <Text style={styles.subtitle}>{mockLeague.country} • {mockLeague.season}</Text>
            <Text style={styles.teams}>Teams: {mockLeague.teams}</Text>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.description}>{mockLeague.description}</Text>
            <Text style={styles.sectionTitle}>Top Scorer</Text>
            <Text style={styles.info}>{mockLeague.topScorer}</Text>
            <Text style={styles.sectionTitle}>Upcoming Match</Text>
            <View style={styles.matchCard}>
                <Text style={styles.matchTeams}>{mockLeague.upcomingMatch.home} vs {mockLeague.upcomingMatch.away}</Text>
                <Text style={styles.matchDate}>{mockLeague.upcomingMatch.date} • {mockLeague.upcomingMatch.time}</Text>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>View Match Details</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 24,
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    logo: {
        width: 100,
        height: 100,
        resizeMode: 'contain',
        marginBottom: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 8,
    },
    teams: {
        fontSize: 16,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginTop: 16,
        marginBottom: 4,
        alignSelf: 'flex-start',
    },
    description: {
        fontSize: 15,
        color: '#444',
        marginBottom: 12,
        alignSelf: 'flex-start',
    },
    info: {
        fontSize: 16,
        color: '#222',
        marginBottom: 12,
        alignSelf: 'flex-start',
    },
    matchCard: {
        width: '100%',
        backgroundColor: '#f3f3f3',
        borderRadius: 10,
        padding: 16,
        marginBottom: 24,
        alignItems: 'flex-start',
    },
    matchTeams: {
        fontSize: 17,
        fontWeight: '500',
        marginBottom: 4,
    },
    matchDate: {
        fontSize: 15,
        color: '#666',
        marginBottom: 12,
    },
    button: {
        backgroundColor: '#3b82f6',
        paddingVertical: 8,
        paddingHorizontal: 18,
        borderRadius: 6,
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 15,
    },
});

export default LeagueDetailsScreen;