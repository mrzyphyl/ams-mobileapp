import { View, Text, Pressable, ScrollView, Image, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { LinearGradient } from "expo-linear-gradient"
import COLORS from '../constants/colors'
import Button from '../components/Button'
import { SafeAreaView } from 'react-native-safe-area-context'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import moment from 'moment-timezone'

const Attendance = ({navigation}) => {
  const [userData, setUserData] = useState(null)
  const [attendanceData, setAttendanceData] = useState([])
  const [filteredAttendance, setFilteredAttendance] = useState([])

  const targetTimezone = 'Asia/Manila'

  useEffect(() => {
    // Retrieve user data from AsyncStorage when the component mounts
    const fetchUserData = async () => {
      try {
        const userString = await AsyncStorage.getItem('userData')
        console.log('Current User', userString)
        if (userString) {
          const userData = JSON.parse(userString)
          setUserData(userData)
          axios.get('http://192.168.1.65:5000/api/student-user-attendance/attendance')
          .then((result) => {
            console.log('Attendance Data:', result.data)
            setAttendanceData(result.data)

            // Filter attendance data based on user's name
            const userFullName = `${userData.firstname} ${userData.middlename} ${userData.lastname}`
            const filteredData = result.data.filter(item =>
              item.fullname === userFullName
            )

            const currentDate = moment().format('YYYY-MM-DD');
            const filteredDataByDate = filteredData.map(item => {
              // Filter the attendance array for today's date
              const todayAttendance = item.attendance.filter(attendance => {
                const attendanceTimeInDate = moment(attendance.attendanceTimeIn).tz(targetTimezone).format('YYYY-MM-DD');
                return attendanceTimeInDate === currentDate;
              })
              // Only include the attendance for today in the result
              return {
                ...item,
                attendance: todayAttendance,
              };
            })

            console.log('filteredData', filteredDataByDate)
            setFilteredAttendance(filteredDataByDate)
          })
          .catch((err) => console.log(err))
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
      }
    }
    fetchUserData()
  }, [])

  const clearStorage = async () => {
    try {
      await AsyncStorage.clear()
      console.log('All items removed from AsyncStorage.')
      navigation.navigate( 'Welcome' )
    } catch (error) {
      console.error(`Error clearing AsyncStorage: ${error}`)
    }
  }

    return (
    <LinearGradient
      style={{
        flex: 1
      }}
      colors={[COLORS.secondary, COLORS.primary]}
    >
      <SafeAreaView>
        <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
          <View style={{ 
            flex: 1, 
            paddingHorizontal: 22, 
            paddingTop: 5 ,
            justifyContent: 'center', 
            alignItems: 'center',
            marginTop: 50,
          }}>
            <Text style={{
              fontSize: 50,
              fontWeight: 800,
              color: COLORS.white,
              marginTop: 12, // Adjust this margin
            }}>Your Attendance</Text>

            <View style={{
              backgroundColor: 'white',
              borderRadius: 10,
              padding: 10,
              marginVertical: 22,
              width: '90%', // Adjust the width as needed
              alignItems: 'center', // Center the content
            }}>
              <Text style={{
                fontSize: 16,
                color: COLORS.black,
                marginVertical: 4, 
                marginBottom: 20
              }}>This is your attendance for today</Text>
              {filteredAttendance.map((user, userIndex) => (
                <View key={userIndex} style={{ alignItems: 'center', marginBottom: 20 }}>
                  {user.attendance.map((attendance, index) => (
                    <View key={index} style={{ alignItems: 'center' }}>
                      <Text style={{ color: COLORS.black }}>
                        Date: {attendance.attendanceTimeIn}
                      </Text>
                      <Text style={{ color: COLORS.black }}>
                        Subject Code: {attendance.subject_code}
                      </Text>
                      <Text style={{ color: COLORS.black }}>
                        Subject Name: {attendance.subject_name}
                      </Text>
                      <Text style={{ color: COLORS.black }}>
                        Subject Time: {attendance.subject_time}
                      </Text>
                      <Text style={{ color: COLORS.black, marginBottom: 20 }}>
                        Subject Instructor: {attendance.subject_instructor}
                      </Text>
                    </View>
                  ))}
                </View>
              ))}
            </View> 
            
            <Button
              title="Log Out"
              onPress={clearStorage}
              style={{
                marginTop: 22,
                marginBottom: 100,
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

export default Attendance