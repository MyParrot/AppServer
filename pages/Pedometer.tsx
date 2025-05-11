import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Platform, PermissionsAndroid } from 'react-native';
import GoogleFit, { Scopes } from 'react-native-google-fit';

export default function PedometerScreen() {
  const [steps, setSteps] = useState(0);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const requestPermissions = async () => {
      if (Platform.OS !== 'android') {
        setIsAvailable(false);
        return;
      }

      if (Platform.Version >= 29) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACTIVITY_RECOGNITION,
          {
            title: '활동 인식 권한 요청',
            message: '걸음 수 측정을 위해 활동 인식 권한이 필요합니다.',
            buttonPositive: '허용',
          }
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          setIsAvailable(false);
          return;
        }
      }

      const options = {
        scopes: [Scopes.FITNESS_ACTIVITY_READ, Scopes.FITNESS_ACTIVITY_WRITE],
      };

      GoogleFit.authorize(options)
      .then(authResult => {
        console.log('authResult:', authResult);
        if (authResult.success) {
          console.log('Google Fit 인증 성공');
          setIsAvailable(true);
          fetchStepCount();
          observeStepChanges();
          intervalId = setInterval(fetchStepCount, 10000);
        } else {
          console.warn('인증 실패:', authResult.message);
          setIsAvailable(false);
        }
      })
      .catch(err => {
        console.error('Google Fit 오류', err);
        setIsAvailable(false);
      });
    };

    const fetchStepCount = () => {
      const start = new Date();
      start.setHours(0, 0, 0, 0);
      const end = new Date();

      GoogleFit.getDailyStepCountSamples({
        startDate: start.toISOString(),
        endDate: end.toISOString(),
      }).then(results => {
        const sample = results.find(r => r.steps.length > 0);
        if (sample) {
          const todaySteps = sample.steps[0].value;
          setSteps(todaySteps);
        }
      });
    };

    const observeStepChanges = () => {
      GoogleFit.observeSteps((newStepData) => {
        console.log('실시간 걸음 수 감지:', newStepData);
        fetchStepCount();
      });
    };

    requestPermissions();

    return () => {
      GoogleFit.unsubscribeListeners();
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>오늘의 걸음 수</Text>
      <Text style={styles.stepCount}>{steps.toLocaleString()} 보</Text>
      <Text style={styles.status}>
        {isAvailable === null
          ? 'Google Fit 확인 중...'
          : isAvailable
          ? '연결됨'
          : 'Google Fit 데이터를 사용할 수 없습니다'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: '#FFD700',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  stepCount: {
    fontSize: 48,
    color: '#fff',
    fontWeight: 'bold',
  },
  status: {
    marginTop: 20,
    fontSize: 16,
    color: '#aaa',
  },
});