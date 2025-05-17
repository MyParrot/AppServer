import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Camera, useCameraDevices, getCameraDevice, PhotoFile } from 'react-native-vision-camera';
import { useIsFocused } from '@react-navigation/native';
import { readFile } from 'react-native-fs';
import { useNavigation } from '@react-navigation/native';
import Tts from 'react-native-tts';
import { stat } from 'react-native-fs';
import ImageResizer from 'react-native-image-resizer';

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
      try {
        const status = await Camera.requestCameraPermission();
        setHasPermission(status === 'authorized' || status === 'granted');
      } catch (error) {
        console.error("Failed to get camera permission:", error);
        Alert.alert("Error", "Failed to get camera permission.");
      }
    })();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timer;

    const takeAndSendPhoto = async () => {
      if (!cameraRef.current) return;

      try {
        const photo: PhotoFile = await cameraRef.current.takePhoto({
          qualityPrioritization: 'speed',
          flash: 'off',
          skipMetadata: true,
        });

        console.log('Original resolution:', photo.width + ' x ' + photo.height);

        const resized = await ImageResizer.createResizedImage(
          photo.path,
          640,
          480,
          'JPEG',
          90
        );

        const info = await stat(resized.uri);
        console.log('Resized file size:', (info.size / (1024 * 1024)).toFixed(2), 'MB');

        const base64 = await readFile(resized.uri, 'base64');
        console.log('Base64 size:', ((base64.length * 0.75) / (1024 * 1024)).toFixed(2), 'MB');

        await sendFrameToServer(`data:image/jpeg;base64,${base64}`);

        console.log('Photo sent successfully');
      } catch (error) {
        console.error('Failed to take/send photo:', error);
      }
    };

    if (hasPermission && isFocused) {
      interval = setInterval(takeAndSendPhoto, 1000);
    }

    return () => clearInterval(interval);
  }, [hasPermission, isFocused]);

const sendFrameToServer = async (base64Data: string) => {
    try {
      const response = await fetch('https://api.hwangrock.com/upload_frame', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64Data }),
      });

      const contentType = response.headers.get('Content-Type');
      console.log('Content-Type:', contentType);

      const data: AIResponse = await response.json();

      if (data.status === 'success' && data.summary && data.summary !== prevSummaryRef.current) {
        setAiResult(data);
        prevSummaryRef.current = data.summary;

        try {
          Tts.stop();
          Tts.speak(data.summary);
        } catch (ttsError) {
          console.error("Failed to speak result:", ttsError);
        }
      }
    } catch (error) {
      console.error('Server did not respond or returned invalid data:', error);
    }
  };

  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Text>Camera permission denied</Text>
      </View>
    );
  }

  if (!device) {
    return (
      <View style={styles.container}>
        <Text>Loading camera device...</Text>
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
          onPress={() => navigation.navigate('EmergencyCall')}
          accessibilityLabel="Go to emergency call">
          <Text style={styles.navButtonText}>Emergency{'\n'}Call</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate('Pedometer')}
          accessibilityLabel="Go to pedometer">
          <Text style={styles.navButtonText}>Pedometer</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate('Album')}
          accessibilityLabel="Go to album">
          <Text style={styles.navButtonText}>Album</Text>
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
    textAlign: 'center',
    color: '#FFD700',
    fontSize: 20,
    fontWeight: 'bold',
  },
});