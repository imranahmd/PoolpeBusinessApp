// InternetStatus.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { useNavigation } from '@react-navigation/native';

const InternetStatus = ({ children }) => {
  const [isConnected, setIsConnected] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
      if (state.isConnected) {
        navigation.navigate('Onboarding Screen');
      }
    });

    // Clean up the subscription
    return () => unsubscribe();
  }, [navigation]);

  if (!isConnected) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>No internet connection. Please check your connection and try again.</Text>
      </View>
    );
  }

  return <>{children}</>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  text: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
  },
});

export default InternetStatus;
