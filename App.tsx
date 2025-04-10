// import RealTimeVideo from './pages/RealTimeVideo';

// const App = () => {
//   return <RealTimeVideo />;
// };

// export default App;


import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './pages/Home';
import RealTimeVideo from './pages/RealTimeVideo';
import Call911 from './pages/Call911';
import LeftScreen from './pages/LeftScreen';
import RightScreen from './pages/RightScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="RealTimeVideo" component={RealTimeVideo} />
        <Stack.Screen name="Call911" component={Call911} />
        <Stack.Screen name="LeftScreen" component={LeftScreen} />
        <Stack.Screen name="RightScreen" component={RightScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}