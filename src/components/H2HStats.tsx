import { FC } from "react";
import {
} from 'react-native';
import { View, Text, StyleSheet } from "react-native";
import { H2HResults } from "../models/Results";

type H2HStatsProps = {
  result: H2HResults
}

const H2HStats: FC<H2HStatsProps> = ({result}) => {
    // const result = homeScore > awayScore ? 'W' : homeScore < awayScore ? 'L' : 'D';
    return (
        <View
            key={
          result.fixtureId && result.fixtureId !== 0
              ? `${result.leagueShort}-${result.fixtureId}`
              : `${result.leagueShort}-${Math.random().toString(36).substr(2, 9)}`
            }
            style={[
          styles.formBox,
          result.homeScore > result.awayScore
              ? styles.recentFormWin
              : result.homeScore < result.awayScore
              ? styles.recentFormLose
              : styles.recentFormDraw
            ]}
        >
            <Text style={styles.formText}>{result.winDrawLose}</Text>
            <Text style={styles.formSubtext}>{`${result.homeScore}-${result.awayScore}`}</Text>
            <Text
              style={[styles.formLeague, { fontSize: 10, opacity: 0.8 }]}
            >
              {result.leagueShort}
            </Text>
        </View>
    );

}

const styles = StyleSheet.create({
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
  recentFormWin: {
    backgroundColor: '#10B981'
  },
  recentFormDraw: {
    backgroundColor: '#F59E0B'
  },
  recentFormLose: {
    backgroundColor: '#EF4444'
  },
});

export default H2HStats;