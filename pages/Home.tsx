import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Svg, { Polygon } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TouchableWithoutFeedback } from 'react-native';

const Home = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { width, height } = Dimensions.get('window');
  const centerX = width / 2;
  const centerY = height / 2;

  return (
    <View style={styles.container}>
      <Svg height={height} width={width} style={StyleSheet.absoluteFill}>
        {/* Top Triangle */}
        <TouchableWithoutFeedback onPress={() => navigation.navigate('RealTimeVideo')}>
          <Polygon
            points={`0,0 ${width},0 ${centerX},${centerY}`}
            fill="rgba(255,0,0,0.5)"
          />
        </TouchableWithoutFeedback>

        {/* Bottom Triangle */}
        <TouchableWithoutFeedback onPress={() => navigation.navigate('Call911')}>
          <Polygon
            points={`0,${height} ${width},${height} ${centerX},${centerY}`}
            fill="rgba(0,0,255,0.5)"
          />
        </TouchableWithoutFeedback>

        {/* Left Triangle */}
        <TouchableWithoutFeedback onPress={() => navigation.navigate('LeftScreen')}>
          <Polygon
            points={`0,0 0,${height} ${centerX},${centerY}`}
            fill="rgba(0,255,0,0.5)"
          />
        </TouchableWithoutFeedback>

        {/* Right Triangle */}
        <TouchableWithoutFeedback onPress={() => navigation.navigate('RightScreen')}>
          <Polygon
            points={`${width},0 ${width},${height} ${centerX},${centerY}`}
            fill="rgba(255,255,0,0.5)"
          />
        </TouchableWithoutFeedback>
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});

export default Home;