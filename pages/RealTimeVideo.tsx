import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Camera, CameraDevice, getCameraDevice } from 'react-native-vision-camera';

export default function RealTimeVideo() {
  const [device, setDevice] = useState<CameraDevice | null>(null);

  useEffect(() => {
    (async () => {
      // 권한 요청
      await Camera.requestCameraPermission();
      // await Camera.requestMicrophonePermission(); // 필요하면 써

      // 사용 가능한 카메라 목록 가져오기
      const devices = await Camera.getAvailableCameraDevices();
      const back = getCameraDevice(devices, 'back'); // 후면 카메라 선택
      setDevice(back); // 문제없음
    })();
  }, []);

  if (device == null) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>📷 카메라 장치 로딩 중...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        video={true}
        audio={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: 'white',
    fontSize: 18,
  },
});