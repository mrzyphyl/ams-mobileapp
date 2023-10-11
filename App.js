import React, { useEffect, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import { Attendance, Home, Login, Signup, Welcome, QRScanner } from './screens'
import AsyncStorage from '@react-native-async-storage/async-storage'

const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()

const AuthStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Welcome" component={Welcome} options={{ headerShown: false }} />
    <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
    <Stack.Screen name="Signup" component={Signup} options={{ headerShown: false }} />
  </Stack.Navigator>
)

const HomeStack = () => (
  <Stack.Navigator initialRouteName="Home">
    <Stack.Screen name="HomeScreen" component={Home} options={{ headerShown: false }} />
  </Stack.Navigator>
);

const QRScannerStack = () => (
  <Stack.Navigator initialRouteName="QRScanner">
    <Stack.Screen name="QRScannerScreen" component={QRScanner} options={{ headerShown: false }} />
  </Stack.Navigator>
);

const AttendanceStack = () => (
  <Stack.Navigator initialRouteName="Attendance">
    <Stack.Screen name="AttendanceScreen" component={Attendance} options={{ headerShown: false }} />
  </Stack.Navigator>
);
 
export default function App() {
  const [userIsLoggedIn, setUserIsLoggedIn] = useState(false);

  // Check the user's login status when the app starts
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData')
        if (userData) {
          // User data exists, so the user is logged in
          setUserIsLoggedIn(true);
        }
      } catch (error) {
        console.error('Error checking login status:', error)
      }
    };

    checkLoginStatus()
  }, [])

  return (
    <NavigationContainer>
      {userIsLoggedIn ? (
        <Tab.Navigator initialRouteName="Home">
          <Tab.Screen name="Home" component={HomeStack} />
          <Tab.Screen name="QRScanner" component={QRScannerStack} />
          <Tab.Screen name="Attendance" component={AttendanceStack} />
        </Tab.Navigator>
      ) : (
        <AuthStack />
      )}
    </NavigationContainer>
  )
}