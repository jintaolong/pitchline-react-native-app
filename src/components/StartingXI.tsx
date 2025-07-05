import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Lineup, LineupPlayer } from '../models/Lineups';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { colors, globalStyles } from '../styles/globalStyles';
import { useNavigation } from '@react-navigation/native';
import log from '../utils/logger';


const renderFormationOnPosition = (players: LineupPlayer[], rows: number[]) => {
    // Assign players to rows based on formation
    let playerIndex = 0;
    // Group players by position
    const defenders = players.filter(p => p.position === 'D');
    const midfielders = players.filter(p => p.position === 'M');
    const forwards = players.filter(p => p.position === 'F');
    const gks = players.filter(p => p.position === 'G' || p.position === 'GK');

    // Helper to get next N players from a group
    const take = (arr: any[], n: number) => {
        const taken = arr.slice(0, n);
        arr.splice(0, n);
        return taken;
    };

    // Always start with GK
    let pitchRows: LineupPlayer[][] = [];
    if (gks.length) {
        pitchRows.push([gks[0]]);
    }

    // Now assign rows based on formation and typical football logic
    // e.g. 4-2-3-1: [D-D-D-D][M/D,M/D][M/F,M/F,M/F][F]
    let formationIdx = 0;
    let defCount = rows[formationIdx++];
    let midCount = rows[formationIdx++];
    let attCount = rows.length > 3 ? rows[formationIdx++] : 0;
    let fwCount = rows[formationIdx++] || 0;

    // Defenders
    if (defCount) pitchRows.push(take(defenders, defCount));
    // Midfielders (or hybrid M/D)
    if (midCount) pitchRows.push(take(midfielders, midCount));
    // Attacking mids/forwards (hybrid M/F)
    if (attCount) {
        // Try to fill with midfielders first, then forwards if not enough
        let mids = take(midfielders, attCount);
        let remain = attCount - mids.length;
        let fwds = remain > 0 ? take(forwards, remain) : [];
        pitchRows.push([...mids, ...fwds]);
    }
    // Forwards
    if (fwCount) pitchRows.push(take(forwards, fwCount));

    // If any players left (e.g. weird formation), add them to last row
    const unused = [...defenders, ...midfielders, ...forwards].filter(Boolean);
    if (unused.length) {
        if (pitchRows.length) {
            pitchRows[pitchRows.length - 1].push(...unused);
        } else {
            pitchRows.push(unused);
        }
    }
    return pitchRows;
}


const renderFormationOnPitch = (lineup: Lineup, 
        side: 'home' | 'away', 
        onPressNavigateRoute : (playerId: number) => void): React.ReactNode => {
    if (!lineup || !lineup.formation || !lineup.players) return null;

    // Parse formation string, e.g. "4-2-3-1" => [4,2,3,1]
    const formationArr = lineup.formation.split('-').map(Number);
    // For away, reverse the order so GK is at the top
    // const rows = side === 'home' ? formationArr : [...formationArr].reverse();
    // const rows = formationArr;

    // Get only starting players (should be 11)
    const players = lineup.players;
    let pitchRows: LineupPlayer[][] = [];
    
    players
        // .sort((a, b) => {
        //     return (a.grid?.row || 0) - (b.grid?.row || 0) || (a.grid?.col || 0) - (b.grid?.col || 0);
        // })
        .slice(0, 11).forEach(player => {
            // Ensure player has a grid position
            if (player.grid && player.grid.row !== null && player.grid.col !== null) {
            // if (false) {
                const row = player.grid.row - 1;
                const col = player.grid.col - 1;

                // Initialize row if it doesn't exist
                if (!pitchRows[row]) {
                    pitchRows[row] = [];
                }

                // Add player to the correct position
                pitchRows[row][col] = player;
            }
            else{
                pitchRows = renderFormationOnPosition(players, formationArr);
            }
        });


    // For away, render from top to bottom; for home, from bottom to top
    const renderRows = side === 'away' ? pitchRows : [...pitchRows].reverse();

    return (
        <View style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        justifyContent: 'space-between',
        // pointerEvents: 'none', // so pitch is not touchable
        }}>
        {renderRows.map((row, rowIdx) => (
            <View
            key={rowIdx}
            style={{
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                alignItems: 'center',
                width: '100%',
                position: 'absolute',
                // Squeeze all rows inside their half using a scaled range within 0-50% (away) or 50-100% (home)
                top: (() => {
                    const rowsCount = renderRows.length;
                    if (rowsCount === 1) {
                        // Center single row in its half
                        return side === 'home' ? '75%' : '25%';
                    }
                    // Spread rows evenly within their half
                    const percent = (rowIdx / (rowsCount - 1)) * 40;
                    return side === 'home'
                        ? `${50 + percent}%`
                        : `${percent}%`;
                })(),
            }}
            >
            {row.map((player, idx) => (
                <View
                key={player.id || idx}
                style={{
                    alignItems: 'center',
                    marginHorizontal: 2,
                }}
                >
                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => onPressNavigateRoute(player.id)}
                    style={{
                        alignItems: 'center',
                    }}
                >
                    <View style={{
                        width: 38,
                        height: 38,
                        borderRadius: 19,
                        backgroundColor: side === 'home' ? '#6366F1' : '#3B82F6',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 2,
                        borderWidth: 2,
                        borderColor: '#fff',
                    }}>
                        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 12 }}>
                        {player.number || ''}
                        </Text>
                    </View>
                    <Text
                        style={{
                        fontSize: 10,
                        color: '#1F2937',
                        fontWeight: '500',
                        textAlign: 'center',
                        // maxWidth: 48,
                        }}
                        numberOfLines={1}
                    >
                        {player.name || ''}
                    </Text>
                </TouchableOpacity>
                </View>
            ))}
            </View>
        ))}
        </View>
    );
}

const PitchLineStartingXI = ({homeLineup, awayLineup}: {homeLineup: Lineup; awayLineup: Lineup}) => {
  const navigation = useNavigation();
  const navigateToPlayerDetails = (playerId: number) => {
    log.debug("Navigating to player details for playerId: ", playerId);
    navigation.navigate('PlayerDetails', { playerId : playerId });
  }
  return (
    <View>
        <Text style={globalStyles.title}>Starting XI</Text>
        <View
            style={{
            width: '100%',
            aspectRatio: 2 / 3,
            // backgroundColor: '#e0f2fe',
            borderRadius: 24,
            borderWidth: 2,
            borderColor: colors.backgroundShades.light,
            alignSelf: 'center',
            // marginBottom: 16,
            // overflow: 'hidden',
            position: 'relative',
            // justifyContent: 'center',
            }}
        >
            {/* Pitch lines */}
            <View style={{
                position: 'absolute',
                left: '35%',
                top: '40%',
                width: '30%',
                height: '20%',
                borderRadius: 999,
                borderWidth: 2,
                borderColor: colors.backgroundShades.light, // primary color
            }} />
            {/* Halfway line */}
            <View style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: '50%',
            height: 2,
            backgroundColor: colors.backgroundShades.light,
            }} />
            {/* Home team (bottom) */}
            {homeLineup && renderFormationOnPitch(homeLineup, 'home', navigateToPlayerDetails)}
            {/* Away team (top) */}
            {awayLineup && renderFormationOnPitch(awayLineup, 'away', navigateToPlayerDetails)}
        </View>
    </View>
  );
};

export default PitchLineStartingXI;
