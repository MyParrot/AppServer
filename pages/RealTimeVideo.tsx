import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Camera, useCameraDevices, getCameraDevice, PhotoFile } from 'react-native-vision-camera';
import { useIsFocused } from '@react-navigation/native';
import { readFile } from 'react-native-fs';
import { useNavigation } from '@react-navigation/native';
import Tts from 'react-native-tts';

interface AIResponse {
  status: string;
  summary?: string;
  s3_url?: string;
}

export default function RealTimeVideo() {
  const [hasPermission, setHasPermission] = useState(false);
  const [aiResult, setAiResult] = useState<AIResponse | null>(null);
  const prevSummaryRef = useRef<string | null>(null);
  const cameraRef = useRef<Camera>(null);
  const isFocused = useIsFocused();
  const devices = useCameraDevices();
  const device = getCameraDevice(devices, 'back');
  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === 'authorized' || status === 'granted');
    })();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timer;

    const takeAndSendPhoto = async () => {
      if (!cameraRef.current) return;

      try {
        const photo: PhotoFile = await cameraRef.current.takePhoto({
          qualityPrioritization: 'speed',
        });

        const base64 = await readFile(photo.path, 'base64');
        await sendFrameToServer(`data:image/jpeg;base64,${base64}`);
        console.log('사진 전송 완료');
      } catch (error) {
        console.error('사진 촬영 또는 전송 실패:', error);
      }
    };

    if (hasPermission && isFocused) {
      interval = setInterval(takeAndSendPhoto, 1000);
    }

    return () => clearInterval(interval);
  }, [hasPermission, isFocused]);

  const sendFrameToServer = async (base64Data: string) => {
    try {
      const response = await fetch('/upload_frame', { // server address, http://ipaddress:5000/upload_frame
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64Data }),
      });
  
      const data: AIResponse = await response.json();
      if (data.status === 'success' && data.summary && data.summary !== prevSummaryRef.current) {
        setAiResult(data);
        prevSummaryRef.current = data.summary;

        Tts.stop();
        Tts.speak(data.summary);
      }
    } catch (error) {
      console.error('서버 응답 실패:', error);
    }
  };
  

  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Text>카메라 권한 없음</Text>
      </View>
    );
  }

  if (!device) {
    return (
      <View style={styles.container}>
        <Text>카메라 장치 로딩 중...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        ref={cameraRef}
        device={device}
        isActive={isFocused}
        style={StyleSheet.absoluteFill}
        photo={true}
      />
      
      {aiResult?.status === 'success' && aiResult.summary && (
        <View style={styles.resultBox}>
          <Text style={styles.resultText}>{aiResult.summary}</Text>
        </View>
      )}
      
      <View style={styles.navBar}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate('Report112')}
          accessibilityLabel="긴급 신고 이동">
          <Text style={styles.navButtonText}>긴급 신고</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate('Pedometer')}
          accessibilityLabel="만보기 이동">
          <Text style={styles.navButtonText}>만보기</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate('Album')}
          accessibilityLabel="앨범 이동">
          <Text style={styles.navButtonText}>앨범</Text>
        </TouchableOpacity>
      </View>
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
    bottom: 150,
    color: '#fff',
    fontSize: 18,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  resultBox: {
    position: 'absolute',
    top: 40,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 10,
    borderRadius: 8,
  },
  resultText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  navBar: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#FFFFFF', 
    width: '100%',
    flexDirection: 'row',
  },
  navButton: {
    flex: 1,
    height: 130,
    borderWidth: 10,
    borderColor: '#FFFFFF',
    backgroundColor: '#11264f', 
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
  },
  navButtonText: {
    color: '#FFD700',
    fontSize: 25,
    fontWeight: 'bold',
  },
});