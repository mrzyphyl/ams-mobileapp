import React, { useEffect, useState } from 'react'
import { Text, View, StyleSheet, Button } from 'react-native'
import { BarCodeScanner } from 'expo-barcode-scanner'
import COLORS from '../constants/colors'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'

const QRScanner = ({navigation}) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [text, setText] = useState('Not yet scanned')
  const [userData, setUserData] = useState(null)
  const [filteredAttendance, setFilteredAttendance] = useState([])

  useEffect(() => {
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
            const userFullName = `${userData.firstname} ${userData.middlename} ${userData.lastname}`
            const filteredData = result.data.filter(item =>
              item.fullname === userFullName
            )

            console.log('filteredData', filteredData)
            setFilteredAttendance(filteredData)
          })
          .catch((err) => console.log(err))
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
      }
    }
    fetchUserData()
  }, [])

  const askForCameraPermission = () => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted')
    })()
  }

  // Request Camera Permission
  useEffect(() => {
    askForCameraPermission()
  }, []);

  // What happens when we scan the bar code
  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true)
    setText(data)

    if (filteredAttendance.length > 0) {
      const Attendance = JSON.parse(data)

      try {
        console.log(Attendance)
        axios.post(`https://ams-webservice.onrender.com/api/student-user-attendance/attendance/add/${filteredAttendance[0]._id}`, {
          ...Attendance,
          headers: {
            'Content-Type': 'application/json',
          }
        })
        .then((response) => {
          console.log('Attendance Added Successfully:', response.data)
          })
          .catch((error) => {
            if (error.response) {
              // The request was made, but the server responded with a non-2xx status
              console.log('Server Error Data:', error.response.data)
              console.log('Server Error Status:', error.response.status)
              console.log('Server Error Headers:', error.response.headers)
              console.error(error)
            } else if (error.request) {
              // The request was made, but no response was received (e.g., network error)
              console.log('Request Error:', error.request)
              console.error(error)
            } else {
              // Something happened in setting up the request that triggered an error
              console.log('Other Error:', error.message)
              console.error(error)
            }
            console.log('Error Config:', error.config)
            console.error(error)
          })
      } catch (error) {
        console.error('POST request error:', error)
      }
    } else {
      console.log('No attendance data found.')
    }
  }

  // Check permissions and return the screens
  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text>Requesting for camera permission</Text>
      </View>)
  }
  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={{ margin: 10 }}>No access to camera</Text>
        <Button title={'Allow Camera'} onPress={() => askForCameraPermission()} />
      </View>)
  }

  // Return the View
  return (
    <View style={styles.container}>
      <View style={styles.barcodebox}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={{ height: 400, width: 400 }} />
      </View>
      {scanned ? (
        <Text style={styles.maintext}>Scanned Complete</Text>
      ) : (
        <Text style={styles.maintext}></Text>
      )}

      {scanned && <Button title={'Scan again?'} onPress={() => setScanned(false)} color={COLORS.primary} />}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  maintext: {
    fontSize: 16,
    margin: 20,
  },
  barcodebox: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 300,
    width: 300,
    overflow: 'hidden',
    borderRadius: 30,
    backgroundColor: 'tomato'
  }
})

export default QRScanner