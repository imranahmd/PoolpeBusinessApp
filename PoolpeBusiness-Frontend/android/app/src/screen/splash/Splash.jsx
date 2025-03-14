import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Image, Text, Alert} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import {CommonActions} from '@react-navigation/native';

const Splash = ({navigation}) => {
  const [isConnected, setIsConnected] = useState(null);

  useEffect(() => {
    console.log('Splash screen mounted'); // Debug log

    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    if (isConnected !== null) {
      const timer = setTimeout(() => {
        if (isConnected) {
          console.log('Navigating to Onboarding Screen'); // Debug log
          navigation.dispatch(
            CommonActions.reset({
              index: 1,
              routes: [{name: 'Onboarding Screen'}], // Update with your desired screen
            }),
          );
        } else {
          console.log('No internet connection. Showing error message.'); // Debug log
          Alert.alert(
            'Network Error',
            'No internet connection. Please check your network settings.',
          );
        }
      }, 3000); // 3 seconds delay

      return () => {
        console.log('Splash screen unmounted'); // Debug log
        clearTimeout(timer); // Cleanup the timer
        unsubscribe(); // Unsubscribe from NetInfo listener
      };
    }
  }, [isConnected, navigation]);

  return (
    <View style={styles.container}>
      <Image
        source={require('../../../../../assets/images/LogoBusiness.png')}
        style={styles.logo}
      />
      <Text style={styles.text}>Poolpe Business</Text>
      <Image
        source={require('../../../../../assets/images/SScreen.png')}
        style={styles.bottomImage}
      />

      {/* Connection Status Bar */}
      {/* <View style={[styles.statusBar, { backgroundColor: isConnected ? 'green' : 'red' }]}>
        <Text style={styles.statusText}>{isConnected ? 'Online' : 'Offline'}</Text>
      </View> */}
      {!isConnected && (
        <View style={[styles.statusBar, {backgroundColor: 'red'}]}>
          <Text style={styles.statusText}>Offline</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingBottom: 20,
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
  text: {
    marginTop: 20,
    fontSize: 25,
    fontWeight: '500',
    color: '#2058BB',
  },
  bottomImage: {
    width: '70%',
    height: '30%',
    position: 'absolute',
    bottom: 5,
  },
  statusBar: {
    width: '100%',
    height: 50,
    position: 'absolute',
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 18,
    color: '#fff',
  },
});

export default Splash;
