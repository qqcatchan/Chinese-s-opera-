import React from 'react'
import { Text, View, StyleSheet } from 'react-native'
import { Camera } from 'expo-camera'
import { useState, useEffect } from 'react'

export default function App() {
  const [hasPermission, setHasPermission] = useState(null)

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync()
      setHasPermission(status === 'granted')
    })()
  }, [])

  if (hasPermission === null) return <View><Text>Requesting camera permission</Text></View>
  if (hasPermission === false) return <View><Text>No access to camera</Text></View>

  return (
    <View style={styles.container}>
      <Camera style={styles.camera} type={Camera.Constants.Type.front} />
      <Text style={styles.note}>This is a minimal Expo camera example. Integrate tfjs-react-native for on-device models.</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  camera: { flex: 1 },
  note: { padding: 12 }
})
