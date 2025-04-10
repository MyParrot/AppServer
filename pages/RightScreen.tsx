import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function RightScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Right Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
  },
});