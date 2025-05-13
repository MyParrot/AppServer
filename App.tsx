import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RealTimeVideo from './pages/RealTimeVideo';
import Report112 from './pages/Report112';
import Pedometer from './pages/Pedometer';
import Album from './pages/Album';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="RealTimeVideo" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="RealTimeVideo" component={RealTimeVideo} />
        <Stack.Screen name="Report112" component={Report112} />
        <Stack.Screen name="Pedometer" component={Pedometer} />
        <Stack.Screen name="Album" component={Album} />
      </Stack.Navigator>
    </NavigationContainer>
  );
  
}