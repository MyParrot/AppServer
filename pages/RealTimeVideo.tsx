import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Camera, useCameraDevices, getCameraDevice } from 'react-native-vision-camera';
import { captureRef } from 'react-native-view-shot';
import { useIsFocused } from '@react-navigation/native';

export default function RealTimeVideo() {
  const [hasPermission, setHasPermission] = useState(false);
  const cameraRef = useRef<Camera>(null);
  const viewRef = useRef(null);
  const isFocused = useIsFocused();
  const devices = useCameraDevices();
  const device = getCameraDevice(devices, 'back');

  // 1. 권한 확인 및 요청
  useEffect(() => {
    (async () => {
      const current = await Camera.getCameraPermissionStatus();
      console.log('현재 권한 상태:', current);

      if (current !== 'authorized') {
        const request = await Camera.requestCameraPermission();
        console.log('요청 후 권한 상태:', request);
        setHasPermission(request === 'authorized' || request === 'granted');
      } else {
        setHasPermission(true);
      }
    })();
  }, []);

  // 2. 0.3초마다 프레임 전송
  useEffect(() => {
    let interval: NodeJS.Timer;
    if (hasPermission && isFocused && viewRef.current) {
      interval = setInterval(() => {
        captureRef(viewRef, {
          format: 'jpg',
          quality: 0.8,
          result: 'base64',
        })
          .then(base64 => sendFrameToServer(`data:image/jpeg;base64,${base64}`))
          .catch(console.error);
      }, 300);
    }
    return () => clearInterval(interval);
  }, [hasPermission, isFocused]);

  // 3. 프레임 서버 전송
  const sendFrameToServer = (base64Data: string) => {
    fetch('http://localhost:5000/upload_frame', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: base64Data }),
    })
      .then(() => console.log('전송 완료'))
      .catch(console.error);
  };

  // 4. 디버깅용 로그
  useEffect(() => {
    console.log('useCameraDevices():', devices);
    console.log('device:', device);
    console.log('hasPermission:', hasPermission);
    console.log('isFocused:', isFocused);
  }, [devices, device, hasPermission, isFocused]);

  if (!hasPermission) {
    return <View style={styles.container}><Text>카메라 권한 없음</Text></View>;
  }

  if (!device) {
    return <View style={styles.container}><Text>카메라 장치 로딩 중...</Text></View>;
  }

  return (
    <View style={styles.container} ref={viewRef}>
      <Camera
        ref={cameraRef}
        device={device}
        isActive={isFocused}
        style={StyleSheet.absoluteFill}
        photo={true}
      />
      <Text style={styles.label}>실시간 프레임 전송 중...</Text>
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
  label: {
    position: 'absolute',
    bottom: 40,
    color: '#fff',
    fontSize: 18,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
});
