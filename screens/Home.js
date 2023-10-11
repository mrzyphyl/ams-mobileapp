import { View, Text, Pressable, ScrollView, Image, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { LinearGradient } from "expo-linear-gradient"
import COLORS from '../constants/colors'
import Button from '../components/Button'
import { SafeAreaView } from 'react-native-safe-area-context'
import AsyncStorage from '@react-native-async-storage/async-storage'

const Home = ({ navigation }) => {
  const [userData, setUserData] = useState(null)

  useEffect(() => {
    // Retrieve user data from AsyncStorage when the component mounts
    const fetchUserData = async () => {
      try {
        const userString = await AsyncStorage.getItem('userData')
        console.log(userString)
        if (userString) {
          const userData = JSON.parse(userString)
          setUserData(userData);
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
      }
    };

    fetchUserData()
  }, [])

  return (
    <LinearGradient
      style={{
        flex: 1
      }}
      colors={[COLORS.secondary, COLORS.primary]}
    >
      <SafeAreaView>
        <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
          <View style={styles.container}>
            <Image
              source={require('../assets/hero2.jpg')}
              style={{
                  height: 200,
                  width: 200,
              }}
              />
          </View>

          <View style={{ flex: 1, paddingHorizontal: 22, paddingTop: 5 }}>
            <Text style={{
              fontSize: 50,
              fontWeight: 800,
              color: COLORS.white,
              marginTop: 12, // Adjust this margin
            }}>Welcome Back</Text>
            {userData ? (
              <Text style={{
                fontSize: 46,
                fontWeight: 800,
                color: COLORS.white
              }}>{userData.firstname}</Text>
            ) : (
              <Text style={{
                fontSize: 46,
                fontWeight: 800,
                color: COLORS.white
              }}>Guest</Text>
            )}
            <View style={{ marginVertical: 22 }}>
              <Text style={{
                fontSize: 16,
                color: COLORS.white,
                marginVertical: 4
              }}>Attendance checking has never been easier!</Text>
              <Text style={{
                fontSize: 16,
                color: COLORS.white,
              }}>Just scan the QR code provided</Text>
            </View>

            <Button
              title="Add your Attendance Now"
              onPress={() => navigation.navigate("QRScanner")}
              style={{
                marginTop: 22,
                width: "100%"
              }}
            />

          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center',
  }
})

export default Home