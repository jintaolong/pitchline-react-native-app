import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/Home';
import MatchesScreen from '../screens/Match';
import SettingsScreen from '../screens/Settings';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

export type RootTabParamList = {
  Home: undefined;
  Matches: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        // tabBarIcon: ({ color, size }) => {
        tabBarIcon: ({ size, color}) => {
          let iconName: keyof typeof Ionicons.glyphMap =
            route.name === 'Home'
              ? 'home'
              : route.name === 'Matches'
              ? 'list'
              : 'settings';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#5C6EF8',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ headerShown: false }}
      />
      <Tab.Screen 
        name="Matches" 
        component={MatchesScreen} 
        options={{ headerShown: false }}
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen} 
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
}

export default TabNavigator;