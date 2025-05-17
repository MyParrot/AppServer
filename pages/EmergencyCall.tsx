import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Alert } from 'react-native';

export default function EmergencyCall() {
  const makeCall = async (number: string) => {
    try {
      const supported = await Linking.canOpenURL(`tel:${number}`);
      if (!supported) {
        Alert.alert('Not Supported', 'This device cannot make phone calls.');
        return;
      }

      await Linking.openURL(`tel:${number}`);
    } catch (error) {
      console.error('Error while trying to make a call:', error);
      Alert.alert('Call Failed', 'Call failed. Please check your phone settings.');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#d32f2f' }]}
        onPress={() => makeCall('112')}
      >
        <Text style={styles.buttonText}>Call 112</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#f57c00' }]}
        onPress={() => makeCall('119')}
      >
        <Text style={styles.buttonText}>Call 119</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 50,
  },
  button: {
    width: '80%',
    paddingVertical: 100,
    borderRadius: 20,
    alignItems: 'center',
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 50,
    fontWeight: 'bold',
  },
});