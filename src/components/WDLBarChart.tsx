import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface WDLBarChartProps {
  win: number;
  draw: number;
  loss: number;
}

const WDLBarChart: React.FC<WDLBarChartProps> = ({ win, draw, loss }) => (
  <View style={styles.wdlContainer}>
    <View style={[styles.wdlBar, { backgroundColor: '#6366F1', flex: win }]}>
      <Text style={styles.wdlText}>{win}</Text>
    </View>
    <View style={[styles.wdlBar, { backgroundColor: '#D1D5DB', flex: draw }]}>
      <Text style={styles.wdlText}>{draw}</Text>
    </View>
    <View style={[styles.wdlBar, { backgroundColor: '#3B82F6', flex: loss }]}>
      <Text style={styles.wdlText}>{loss}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  wdlContainer: {
    flexDirection: 'row',
    height: 30,
    borderRadius: 4,
    overflow: 'hidden',
  },
  wdlBar: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  wdlText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
});

export default WDLBarChart;