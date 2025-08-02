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
import PlayerDetailsScreen from './screens/PlayerDetails';import LeagueDetailsScreen from './screens/LeagueDetails';
import { CopilotProvider } from 'react-native-copilot';

const Stack = createNativeStackNavigator<RootStackParamList>();
// const BottomNavigator = createNativeStackNavigator<BottomNavigatorStackParamList>();

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
const App = () => {
  const isLoggedIn = false; // Replace with actual authentication logic
  return (
    <CopilotProvider overlay='svg' verticalOffset={30}>
      <NavigationContainer
      >
        <StatusBar style="auto" />
        <Stack.Navigator 
          initialRouteName={isLoggedIn ? 'Main' : 'Launch'}
          screenOptions={{
            headerShown: false,
          }}
        >
            <Stack.Group
              screenLayout={
                isLoggedIn ? 'default' : 'modal'
              }
            >
              <Stack.Screen 
              name="Main"
              component={TabNavigator}
              options={{ title: 'PitchLine' }}
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
            <Stack.Group
              screenLayout={
                isLoggedIn ? 'default' : 'modal'
              }>
              <Stack.Screen
                name="LeagueDetails"
                component={LeagueDetailsScreen}
                options={{ title: 'LeagueDetails' }}
              />
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
            <Stack.Group
              screenLayout={
                isLoggedIn ? 'default' : 'modal'
              }
            >
              <Stack.Screen
              name="Launch"
              component={LaunchScreen}
              options={{ headerShown: false }}
              />
              <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{ headerShown: false }}
              />
            </Stack.Group>
        </Stack.Navigator>
    </NavigationContainer>
    </CopilotProvider>
  )
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
