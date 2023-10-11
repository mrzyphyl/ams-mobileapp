import React, { useEffect, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import { Attendance, Home, Login, Signup, Welcome, QRScanner } from './screens'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { StyleSheet } from 'react-native'
import COLORS from './constants/colors'
import { View } from 'react-native'
import { Image } from 'react-native'

const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()

const AuthStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Welcome" component={Welcome} options={{ headerShown: false }} />
    <Stack.Screen name="Login" options={{ headerShown: false }}>
      {props => <Login {...props} />}
    </Stack.Screen>
    <Stack.Screen name="Signup" component={Signup} options={{ headerShown: false }} />
  </Stack.Navigator>
)
 
export default function App() {
  const [userIsLoggedIn, setUserIsLoggedIn] = useState(false)

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
        <Tab.Navigator 
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: styles.tabBar
        }}
        >
          <Tab.Screen 
          name="Home" 
          component={Home} 
          options={{
            tabBarIcon: ({focused}) => (
              <View style={styles.tabBarIconContainer}>
                <Image
                source={require('./assets/icons8-home-96.png')}
                resizeMode='contain'
                style={styles.tabBarIcon}
                />
              </View>
            )
          }}
          />

          <Tab.Screen 
          name="QRScanner" 
          component={QRScanner} 
          options={{
            tabBarIcon: ({focused}) => (
              <View style={styles.qrBarIconContainer}>
                <Image
                source={require('./assets/icons8-qr-96.png')}
                resizeMode='contain'
                style={styles.tabBarIcon}
                />
              </View>
            )
          }}
          />

          <Tab.Screen 
          name="Attendance" 
          component={Attendance}
          options={{
            tabBarIcon: ({focused}) => (
              <View style={styles.tabBarIconContainer}>
                <Image
                source={require('./assets/icons8-attendance-64.png')}
                resizeMode='contain'
                style={styles.tabBarIcon}
                />
              </View>
            )
          }}
          />

        </Tab.Navigator>
      ) : (
        <AuthStack />
      )}
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    padding: 0,
    left: 16,
    right: 16,
    bottom: 20,
    height: 56,
    borderRadius: 16,
    backgroundColor: COLORS.white,
    shadowOffset: {
      height: 6,
      width: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },

  qrBarIconContainer:{
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    height: 70,
    width: 70,
    borderRadius: 70,
    shadowOffset: {
      height: 6,
      width: 3,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 3,
  },

  tabBarIconContainer:{
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center'
  },

  tabBarIcon: {
    width: 50,
    height: 50,
  }
})