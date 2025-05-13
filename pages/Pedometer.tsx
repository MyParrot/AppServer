import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { initialize, requestPermission, readRecords } from 'react-native-health-connect';

export default function PedometerScreen() {
  const [steps, setSteps] = useState(0);

  const readSteps = async () => {
    const now = new Date();
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);

    const result = await readRecords('Steps', {
      timeRangeFilter: {
        operator: 'between',
        startTime: startOfDay.toISOString(),
        endTime: now.toISOString(),
      },
    }
  );
    const total = result.records.reduce((sum, record) => sum + record.count, 0);
    setSteps(total);
    // console.log('갱신' + Date() + '걸음수' + total);
  };

  useEffect(() => {
    const setup = async () => {
      const ok = await initialize();
      if (!ok) return;

      await requestPermission([
        { accessType: 'read', recordType: 'Steps' },
      ]);

      await readSteps();
      
    };

    setup();

    const intervalId = setInterval(readSteps, 3000);
    

    return () => clearInterval(intervalId);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>오늘 총</Text>
      <Text style={styles.steps}>{steps.toLocaleString()}</Text>
      <Text style={styles.label}>걸음을 걸었어요!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000'},
  label: { fontSize: 30, color: '#FFD700', fontWeight: 'bold' },
  steps: { fontSize: 100, color: '#FFD700', fontWeight: 'bold' },
});