import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PieChart } from 'react-native-svg-charts';
import { Text as SvgText } from 'react-native-svg';
// import { PieChartData } from 'react-native-svg-charts';


type PieSvgItem = {
  fill: string;
  onPress?: () => void;
}

type PieChartDataItem = {
  key: string;
  value: number;
  svg: PieSvgItem;
};

type PitchlinePieChartProps = {
  data: PieChartDataItem[];
  radius?: number;
};


// type LabelProps = {
//   slices: {
//     pieCentroid: [number, number];
//     labelCentroid: [number, number];
//     data: PieChartDataItem & { amount?: number };
//   }[];
//   height: number;
//   width: number;
// };

// const Labels: React.FC<LabelProps> = ({ slices, height, width }) => {
  // return slices.map((slice, index) => {
  //   const { labelCentroid, pieCentroid, data } = slice;
    // return (
      
    // );
  // });
// };

const PitchlinePieChart: React.FC<PitchlinePieChartProps> = ({ data }) => {
  return (
    <View style={{ 
      flexDirection: 'row', 
      alignItems: 'center', 
      justifyContent: 'center',
      width: '100%', 
      // height: 'auto'
    }}>
      {/* Left Legend */}
      <View style={[styles.blockContainer, { alignItems: 'flex-start' }]}>
      {data[0] && (
        <View style={styles.legendContainer}>
          <View 
        style={[styles.legendCube, { backgroundColor: data[0].svg.fill }]}
          />
          <View>
        <Text style={styles.legendName}>{data[0].key}</Text>
          </View>
          <View>
        <Text style={styles.legendValue}>{data[0].value}</Text>
          </View>
        </View>
      )}
      </View>
      {/* Pie Chart */}
      <View style={[styles.blockContainer, { alignItems: 'center' }]}>
        <PieChart
          style={{ height: 100, width: 100 }}
          data={
        data[0]?.value === 0 && data[1]?.value === 0
          ? [
          { ...data[0], value: 1 },
          { ...data[1], value: 1 },
            ]
          : data
          }
          spacing={0}
          outerRadius={'95%'}
        />
      </View>
      {/* Right Legend */}
      <View style={[styles.blockContainer, { alignItems: 'flex-end' }]}>
      {data[1] && (
        <View style={styles.legendContainer}>
        <View>
            <Text style={styles.legendValue}>{data[1].value}</Text>
        </View>
        <View>
          <Text style={styles.legendName}>{data[1].key}</Text>
        </View>
        <View
          style={[styles.legendCube, { backgroundColor: data[1].svg.fill }]}
        />
        </View>
      )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  blockContainer: {
    width: '33.33%',
    // minWidth: 0,
    // maxWidth: '33.33%',
    // height: '100%',
    // alignItems: 'center',
    // flexShrink: 1,
    // flexGrow: 0,
  },
  legendCube: {
    width: 12,
    height: 12,
    borderRadius: 0,
  },
  legendName: {
    fontSize: 12,
    color: '#333',
    marginHorizontal: 8,
    flexShrink: 1,
    flexWrap: 'wrap',
    maxWidth: '100%',
  },
  legendValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginHorizontal: 2,
    flexShrink: 1,
    maxWidth: '100%',
  },
  legendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 0,
    maxWidth: '100%',
    justifyContent: 'center',
    flex: 1,
    flexShrink: 1,
    flexWrap: 'wrap',
  }
});

export default PitchlinePieChart;