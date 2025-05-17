import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { initialize, requestPermission, readRecords } from 'react-native-health-connect';

export default function PedometerScreen() {
  const [steps, setSteps] = useState(0);

  const readSteps = async () => {
    try {
      const now = new Date();
      const startOfDay = new Date(now);
      startOfDay.setHours(0, 0, 0, 0);

      const result = await readRecords('Steps', {
        timeRangeFilter: {
          operator: 'between',
          startTime: startOfDay.toISOString(),
          endTime: now.toISOString(),
        },
      });

      const total = result.records.reduce((sum, record) => sum + record.count, 0);
      setSteps(total);
    } catch (error) {
      console.error("Failed to read step data:", error);
      Alert.alert("Error", "Unable to read your step count.");
    }
  };

  useEffect(() => {
    const setup = async () => {
      try {
        const ok = await initialize();
        if (!ok) {
          Alert.alert("Error", "Failed to initialize Health Connect.");
          return;
        }

        await requestPermission([
          { accessType: 'read', recordType: 'Steps' },
        ]);

        await readSteps();
      } catch (error) {
        console.error("Health Connect setup failed:", error);
        Alert.alert("Error", "Health Connect setup failed. Please check permissions.");
      }
    };

    setup();

    const intervalId = setInterval(() => {
      readSteps().catch((err) => {
        console.error("Error in periodic step read:", err);
      });
    }, 3000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>You walked</Text>
      <Text style={styles.steps}>{steps.toLocaleString()}</Text>
      <Text style={styles.label}>steps today!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' },
  label: { fontSize: 30, color: '#FFD700', fontWeight: 'bold' },
  steps: { fontSize: 100, color: '#FFD700', fontWeight: 'bold' },
});