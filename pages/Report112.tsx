import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Alert } from 'react-native';

export default function Report112() {
  const makeCall = (number: string) => {
    Linking.openURL(`tel:${number}`).catch(() =>
      Alert.alert('전화 연결 실패', '이 기기에서는 전화를 걸 수 없습니다.')
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#d32f2f' }]}
        onPress={() => makeCall('112')}
      >
        <Text style={styles.buttonText}>112 신고</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#f57c00' }]}
        onPress={() => makeCall('119')}
      >
        <Text style={styles.buttonText}>119 신고</Text>
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