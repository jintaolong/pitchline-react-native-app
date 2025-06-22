import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import LaunchScreen from './screens/Launch';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RegisterScreen from './screens/Register';
import { RootStackParamList } from './navigation/RootStackParamList';
import TabNavigator from './navigation/TabNavigator';
import PreMatchDetailsScreen from './screens/PreMatch';
import PostMatchScreen from './screens/PostMatch';
import InPlayDetailsScreen from './screens/InPlayDetails';
import TeamDetailsScreen from './screens/TeamDetail';
import PlayerDetailsScreen from './screens/PlayerDetails';

const Stack = createNativeStackNavigator<RootStackParamList>();
// const BottomNavigator = createNativeStackNavigator<BottomNavigatorStackParamList>();

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
export default function App() {
  const isLoggedIn = false; // Replace with actual authentication logic
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
        <Stack.Navigator initialRouteName={isLoggedIn ? 'Main' : 'Launch'}>
            <Stack.Group>
              <Stack.Screen 
              name="Main"
              component={TabNavigator}
              options={{ headerShown: false }}
              />
              <Stack.Screen 
              name="Prematch"
              component={PreMatchDetailsScreen}
              options={{ headerShown: false }}
              />
              <Stack.Screen 
              name="Postmatch"
              component={PostMatchScreen}
              options={{ headerShown: false }}
              />
              <Stack.Screen 
              name="Inplay"
              component={InPlayDetailsScreen}
              options={{ headerShown: false }}
              />
            </Stack.Group>
            <Stack.Group>
              <Stack.Screen 
                name="TeamDetails"
                component={TeamDetailsScreen}
                options={{ title: 'TeamDetails' }}
              />
              <Stack.Screen 
                name="PlayerDetails"
                component={PlayerDetailsScreen}
                options={{ title: 'PlayerDetails' }}
              />
            </Stack.Group>
            <Stack.Group>
              <Stack.Screen
                name="Launch"
                component={LaunchScreen}
                options={{ title: 'Welcome' }}
              />
              <Stack.Screen
                name="Register"
                component={RegisterScreen}
                options={{ title: 'Register' }}
              />
            </Stack.Group>
        </Stack.Navigator>
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
