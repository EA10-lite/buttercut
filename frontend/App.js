import React, { useState } from 'react';
import { View } from 'react-native';
import HomeScreen from './src/screens/HomeScreen';
import SplashScreen from './src/screens/SplashScreen';

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  const handleSplashFinish = () => {
    setAppIsReady(true);
  };

  if (!appIsReady) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  return (
    <View style={{ flex: 1 }}>
      <HomeScreen />
    </View>
  );
}