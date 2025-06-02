import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import LaunchScreen from './screens/Launch';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RegisterScreen from './screens/Register';
import { BottomNavigatorStackParamList, RootStackParamList } from './navigation/RootStackParamList';
import TabNavigator from './navigation/TabNavigator';
import PreMatchDetailsScreen from './screens/PreMatch';

const Stack = createNativeStackNavigator<RootStackParamList>();
// const BottomNavigator = createNativeStackNavigator<BottomNavigatorStackParamList>();

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
