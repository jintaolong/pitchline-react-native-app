import React from 'react';
import {
  View,
  Text,
} from 'react-native';

// This screen is for displaying details of a match that is currently in play
const InPlayDetailsScreen = () => {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Match is playing!</Text>
        </View>
    )
}

export default InPlayDetailsScreen;