import React from 'react';
import { View, Text, StyleSheet } from 'react-native';


const PitchlineComparisonBarChart: React.FC<{ a: number, b: number }> = ({ a, b }) => {
    const aPercentage = (a / (a + b)) * 100;
  return (
    <View style={styles.comparisonBar}>
    <Text style={styles.comparisonNumber}>{a}</Text>
    <View style={styles.comparisonBarContainer}>
        <View style={[styles.comparisonBarFill, { width: `${aPercentage}%`, backgroundColor: '#6366F1' }]} />
    </View>
    <Text style={styles.comparisonNumber}>{b}</Text>
    </View>
    
  );
};

const styles = StyleSheet.create({
  comparisonBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  comparisonNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    minWidth: 30,
  },
  comparisonBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
  },
  comparisonBarFill: {
    height: '100%',
    borderRadius: 4,
  },
});

export default PitchlineComparisonBarChart;