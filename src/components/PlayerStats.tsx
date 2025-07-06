import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Player } from '../models/Players';

const PitchLinePlayerStats = ({ player } : { player: Player }) => {

    const statTabs = [
        { key: 'games', label: 'Games' },
        { key: 'attack', label: 'Attack' },
        { key: 'defense', label: 'Defense' },
        { key: 'discipline', label: 'Discipline' },
    ];

    const [selectedTab, setSelectedTab] = useState('games');

    const renderStatsTable = () => {
        switch (selectedTab) {
        case 'games':
            return (
            <View>
                <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Appearances</Text>
                <Text style={styles.infoValue}>{player.stats.games.appearences}</Text>
                </View>
                <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Start XI</Text>
                <Text style={styles.infoValue}>{player.stats.games.lineups}</Text>
                </View>
                <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Minutes</Text>
                <Text style={styles.infoValue}>{player.stats.games.minutes}</Text>
                </View>
                {/* <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Number</Text>
                <Text style={styles.infoValue}>{player.stats.games.number ?? '-'}</Text>
                </View> */}
                {/* <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Position</Text>
                <Text style={styles.infoValue}>{player.stats.games.position}</Text>
                </View> */}
                {/* <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Rating</Text>
                <Text style={styles.infoValue}>{player.stats.games.rating ?? '-'}</Text>
                </View>
                <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Captain</Text>
                <Text style={styles.infoValue}>{player.stats.games.captain ? 'Yes' : 'No'}</Text>
                </View> */}
                <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Sub In</Text>
                <Text style={styles.infoValue}>{player.stats.substitutes.in ?? '-'}</Text>
                </View>
                <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Sub Out</Text>
                <Text style={styles.infoValue}>{player.stats.substitutes.out ?? '-'}</Text>
                </View>
                <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Bench</Text>
                <Text style={styles.infoValue}>{player.stats.substitutes.bench ?? '-'}</Text>
                </View>
            </View>
            );
        case 'attack':
            return (
            <View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Goals</Text>
                    <Text style={styles.infoValue}>{player.stats.goals.total ?? 0}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Assists</Text>
                    <Text style={styles.infoValue}>{player.stats.goals.assists ?? 0}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Shots (Total)</Text>
                    <Text style={styles.infoValue}>{player.stats.shots.total ?? 0}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Shots (On Target)</Text>
                    <Text style={styles.infoValue}>{player.stats.shots.on ?? 0}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Passes (Total)</Text>
                    <Text style={styles.infoValue}>{player.stats.passes.total ?? 0}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Key Passes</Text>
                    <Text style={styles.infoValue}>{player.stats.passes.key ?? 0}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Dribbles (Attempts)</Text>
                    <Text style={styles.infoValue}>{player.stats.dribbles.total ?? 0}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Dribbles (Successful)</Text>
                    <Text style={styles.infoValue}>{player.stats.dribbles.successful ?? 0}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Fouls (Drawn)</Text>
                    <Text style={styles.infoValue}>{player.stats.fouls.total ?? 0}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Penalty Won</Text>
                    <Text style={styles.infoValue}>{player.stats.penalty.won ?? 0}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Penalty Scored</Text>
                    <Text style={styles.infoValue}>{player.stats.penalty.scored ?? 0}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Penalty Missed</Text>
                    <Text style={styles.infoValue}>{player.stats.penalty.missed ?? 0}</Text>
                </View>
            </View>
            );
        case 'defense':
            return (
            <View>
                <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Tackles</Text>
                <Text style={styles.infoValue}>{player.stats.tackles.total ?? 0}</Text>
                </View>
                <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Blocks</Text>
                <Text style={styles.infoValue}>{player.stats.tackles.successful ?? 0}</Text>
                </View>
                <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Duels (Total)</Text>
                <Text style={styles.infoValue}>{player.stats.duels.total ?? 0}</Text>
                </View>
                <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Duels (Won)</Text>
                <Text style={styles.infoValue}>{player.stats.duels.won ?? 0}</Text>
                </View>

            </View>
            );
        case 'discipline':
            return (
            <View>
                <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Fouls (Committed)</Text>
                <Text style={styles.infoValue}>{player.stats.fouls.committed ?? 0}</Text>
                </View>
                <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Yellow Cards</Text>
                <Text style={styles.infoValue}>{player.stats.cards.yellow ?? 0}</Text>
                </View>
                <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Red Cards</Text>
                <Text style={styles.infoValue}>{player.stats.cards.red ?? 0}</Text>
                </View>
            </View>
            );
        default:
            return null;
        }
    };

    return (
        <View style={styles.section}>
        <View style={{ flexDirection: 'row', marginBottom: 16 }}>
            {statTabs.map(tab => (
            <TouchableOpacity
                key={tab.key}
                style={[
                { flex: 1, paddingVertical: 8, alignItems: 'center', borderBottomWidth: 2 },
                selectedTab === tab.key
                    ? { borderBottomColor: '#6366F1' }
                    : { borderBottomColor: 'transparent' }
                ]}
                onPress={() => setSelectedTab(tab.key)}
            >
                <Text style={[
                { fontSize: 14, fontWeight: '600' },
                selectedTab === tab.key
                    ? { color: '#6366F1' }
                    : { color: '#6B7280' }
                ]}>
                {tab.label}
                </Text>
            </TouchableOpacity>
            ))}
        </View>
        {renderStatsTable()}
        </View>
    );
}

const styles = StyleSheet.create({
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 4,
    },
    infoLabel: {
        fontSize: 14,
        color: '#6B7280',
    },
    infoValue: {
        fontSize: 14,
        fontWeight: 'bold',
    },
});

export default PitchLinePlayerStats;