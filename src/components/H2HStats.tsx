import { FC } from "react";
import {
} from 'react-native';
import { View, Text, StyleSheet } from "react-native";

type H2HStatsProps = {

}

const H2HStats: FC<H2HStatsProps> = () => {
    return (
        <View key={index} style={[styles.formBox, { backgroundColor: form.color }]}>
            <Text style={styles.formText}>{form.result}</Text>
            <Text style={styles.formSubtext}>
            {index === 0 ? '3-2' : index === 1 ? '1-2' : index === 2 ? '1-0' : index === 3 ? '0-0' : '1-1'}
            </Text>
            <Text style={styles.formLeague}>
            {index < 3 ? 'PL' : index === 3 ? 'UCL' : 'PL'}
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
});

export default H2HStats;