import React from "react";
import { StyleSheet } from "react-native";
import { View, Text, Image } from "react-native";
import { Standing } from "../models/Leagues";

interface PitchLineStandingTableProps {
  standings: Standing[];
  teamId: number | undefined;
  teamAwayId?: number | undefined;
  neighbour?: number | undefined;
  onPress: (teamId: number) => void;
}

const PitchLineStandingTable = ({ standings, teamId, teamAwayId, neighbour, onPress }: PitchLineStandingTableProps) => {
    // if teamAwayId present, filter standings to only include two teams home and away
    if (teamAwayId && standings.length > 0) {
        standings = standings.filter(team => team.team.id === teamId || team.team.id === teamAwayId);
    }
    // get team position
    let teamPos : number;
    if (teamId) {
        const team = standings.find(team => team.team.id === teamId);
        teamPos = team ? team.position : 0;
    } else {
        teamPos = 0;
    }
    // if neighbour is present, filter standings to only include teams with position within 2 of neighbour
    if (neighbour && standings.length > 0) {
        standings = standings.filter(team => Math.abs(team.position - teamPos) <= neighbour);
    }
    return (
        <View style={styles.standingsTable}>
            {standings.map((team: Standing, index: number) => (
                <View
                  key={`${team.team.id}-${team.position}`}
                  style={styles.standingRow}
                  onTouchEnd={() => onPress(team.team.id)}
                >
                  <View style={[styles.positionBadge, team.team.id === teamId &&  styles.currentTeamBadge]}>
                  <Text style={[styles.positionText, team.team.id === teamId && styles.currentTeamText]}>
                    {team.position}
                  </Text>
                  </View>
                  <View style={styles.teamLogo}>
                  {team.team.logo ? (
                    <Image
                    source={{ uri: team.team.logo }}
                    style={{ width: 28, height: 28, borderRadius: 14 }}
                    resizeMode="contain"
                    />
                  ) : (
                    <Text style={styles.logoText}>{team.team.name.charAt(0)}</Text>
                  )}
                  </View>
                  <Text style={[styles.standingTeamName, team.team.id === teamId && styles.currentTeamName]}>
                  {team.team.name}
                  </Text>
                  <Text style={styles.standingPoints}>{team.points}</Text>
                  <View style={styles.formDots}>
                  {team.form.map((result, formIndex) => (
                    <View
                    key={`${team.team.id}-${formIndex}`}
                    style={[
                      styles.formDot,
                      result === 'W'
                      ? styles.formWin
                      : result === 'L'
                      ? styles.formLost
                      : result === 'D'
                      ? styles.formDraw
                      : styles.formFuture,
                    ]}
                    />
                  ))}
                  </View>
                </View>
            ))}
        </View>

    );
}

const styles = StyleSheet.create({
    formWin: {
    backgroundColor: '#10B981'
  },
  formLost: {
    backgroundColor: '#EF4444'
  },
  formDraw: {
    backgroundColor: '#F59E0B'
  },
  formFuture: {
    backgroundColor: '#3B82F6'
  },
teamLogo: {
    width: 32,
    height: 32,
    borderRadius: 16,
    // backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
logoText: {
color: '#FFFFFF',
fontWeight: 'bold',
fontSize: 12,
},
standingsTable: {
    gap: 12,
  },
  standingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  positionBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  currentTeamBadge: {
    backgroundColor: '#3B82F6',
  },
  positionText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#374151',
  },
  currentTeamText: {
    color: '#FFFFFF',
  },
  standingTeamName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  currentTeamName: {
    fontWeight: '600',
    color: '#1F2937',
  },
  standingPoints: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    width: 30,
    textAlign: 'center',
  },
  formDots: {
    flexDirection: 'row',
    gap: 4,
  },
  formDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
})

export default PitchLineStandingTable;