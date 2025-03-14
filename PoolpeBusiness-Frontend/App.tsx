import 'react-native-gesture-handler';
import React, {useEffect, useState} from 'react';
import {PermissionsAndroid, Platform} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {Provider} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {jwtDecode} from 'jwt-decode';
import store from './src/store/store';

// screens
import RegistrationScreen from './src/screens/RegistrationScreen';
import MobileNumberScreen from './src/Auth/MobileNumberScreen';
import OTPScreen from './src/Auth/OTPScreen';
import Dashboard from './src/screens/Dashboard';
import OnboardingScreen from './src/screens/OnboardingScreen';
import Splash from './android/app/src/screen/splash/Splash';
import StoreSelection from './src/screens/StoreSelection';
import BusinessType from './src/screens/BusinessType';
import AddPassword from './src/Auth/AddPassword';
import UpdatePassword from './src/Auth/UpdatePassword';
import TransactionsLog from './src/screens/TransactionsLog';
import TermsAndCondition from './src/components/TermsAndCondition';
import Settlement from './src/screens/Settlement';
import PrivacyPolicy from './src/components/PrivacyPolicy';
import MyDetails from './src/screens/MyDetails';
import MCCCodes from './src/components/MCCCodes';
import ForgotPassword from './src/Auth/ForgotPassword';
import InternetStatus from './src/components/InternetStatus';

const Stack = createStackNavigator();

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mobileNumber, setMobileNumber] = useState(null);
  const [approved, setApproved] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const savedToken = await AsyncStorage.getItem('@user_token');
        const savedApproved = await AsyncStorage.getItem('@user_approved');
        const verificationCompleted = await AsyncStorage.getItem(
          '@verification_completed',
        );

        if (
          savedToken &&
          savedApproved !== null &&
          verificationCompleted === 'true'
        ) {
          const decodedToken = jwtDecode(savedToken);
          setToken(decodedToken);
          if (decodedToken && savedApproved) {
            if (isTokenValid(decodedToken)) {
              setMobileNumber(decodedToken.mobileNumber);
              setApproved(JSON.parse(savedApproved));
              setIsAuthenticated(true);
            } else {
              await AsyncStorage.removeItem('@user_token');
              await AsyncStorage.removeItem('@user_approved');
              await AsyncStorage.removeItem('@verification_completed');
              setIsAuthenticated(false);
            }
          } else {
            await AsyncStorage.removeItem('@user_token');
            await AsyncStorage.removeItem('@user_approved');
            await AsyncStorage.removeItem('@verification_completed');
            setIsAuthenticated(false);
          }
        } else {
          await AsyncStorage.removeItem('@user_token');
          await AsyncStorage.removeItem('@user_approved');
          await AsyncStorage.removeItem('@verification_completed');
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error fetching or decoding token:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    const requestPermissions = async () => {
      if (Platform.OS === 'android') {
        try {
          // Request multiple permissions
          const granted = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.CAMERA,
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,

            PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
            PermissionsAndroid.PERMISSIONS.READ_MEDIA_AUDIO,
            PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
          ]);

          // Check if all permissions are granted
          if (
            granted[PermissionsAndroid.PERMISSIONS.CAMERA] ===
              PermissionsAndroid.RESULTS.GRANTED &&
            granted[PermissionsAndroid.PERMISSIONS.ACCESS_MEDIA_LOCATION] ===
              PermissionsAndroid.RESULTS.GRANTED &&
            granted[PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE] ===
              PermissionsAndroid.RESULTS.GRANTED &&
            granted[PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE] ===
              PermissionsAndroid.RESULTS.GRANTED &&
            granted[PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO] ===
              PermissionsAndroid.RESULTS.GRANTED &&
            granted[PermissionsAndroid.PERMISSIONS.READ_MEDIA_AUDIO] ===
              PermissionsAndroid.RESULTS.GRANTED
          ) {
            console.log(
              'You can use the camera, photos, videos, and access external storage',
            );
          } else {
            console.log('Permissions denied');
            // Optionally: Provide user feedback or guide them to app settings
          }
        } catch (err) {
          console.warn('Permission request error:', err);
        }
      }
    };

    checkToken();
    requestPermissions();
  }, []);

  const isTokenValid = token => {
    const currentTime = Date.now() / 1000;
    return token.exp > currentTime;
  };

  if (isLoading) {
    return null; // Render a loading screen while checking token
  }

  return (
    <NavigationContainer>
      <Provider store={store}>
        <Stack.Navigator>
          {isAuthenticated ? (
            <>
              <Stack.Screen
                name="Dashboard"
                component={Dashboard}
                options={{headerShown: false}}
                initialParams={{
                  mobileNumber: mobileNumber,
                  approved: approved,
                }}
              />
              <Stack.Screen
                name="My Details"
                component={MyDetails}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="Update Password"
                component={UpdatePassword}
                options={{headerShown: false}}
                initialParams={{
                  mobileNumber: mobileNumber,
                  approved: approved,
                }}
              />
              <Stack.Screen
                name="Transactions Log"
                component={TransactionsLog}
                options={{headerShown: false}}
                initialParams={{
                  mobileNumber: mobileNumber,
                }}
              />
              <Stack.Screen
                name="Settlement"
                component={Settlement}
                options={{headerShown: false}}
                initialParams={{
                  mobileNumber: mobileNumber,
                }}
              />
              <Stack.Screen
                name="Business Type"
                component={BusinessType}
                options={{headerShown: false}}
                initialParams={{
                  mobileNumber: mobileNumber,
                }}
              />
              <Stack.Screen
                name="Store Selection"
                component={StoreSelection}
                options={{headerShown: false}}
                initialParams={{
                  mobileNumber: mobileNumber,
                }}
              />
              <Stack.Screen
                name="Mobile Number"
                component={MobileNumberScreen}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="Forgot Password"
                component={ForgotPassword}
                options={{headerShown: false}}
                initialParams={{
                  mobileNumber: mobileNumber,
                }}
              />
              <Stack.Screen
                name="Internet Status"
                component={InternetStatus}
                options={{headerShown: false}}
              />
              {/* <Stack.Screen
                name="Add Password"
                component={AddPassword}
                options={{headerShown: false}}
                initialParams={{
                  mobileNumber: mobileNumber,
                }}
              /> */}
              <Stack.Screen
                name="Registration"
                component={RegistrationScreen}
                options={{headerShown: false}}
                initialParams={{
                  mobileNumber: mobileNumber,
                }}
              />
              <Stack.Screen
                name="OTP"
                component={OTPScreen}
                options={{headerShown: false}}
                initialParams={{
                  mobileNumber: mobileNumber,
                  token: token,
                }}
              />
            </>
          ) : (
            <>
              <Stack.Screen
                name="Splash Screen"
                component={Splash}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="Mobile Number"
                component={MobileNumberScreen}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="OTP"
                component={OTPScreen}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="Forgot Password"
                component={ForgotPassword}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="Dashboard"
                component={Dashboard}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="Onboarding Screen"
                component={OnboardingScreen}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="Terms And Condition"
                component={TermsAndCondition}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="Privacy Policy"
                component={PrivacyPolicy}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="Store Selection"
                component={StoreSelection}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="Business Type"
                component={BusinessType}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="Transactions Log"
                component={TransactionsLog}
                options={{headerShown: false}}
                initialParams={{
                  mobileNumber: mobileNumber,
                }}
              />
              <Stack.Screen
                name="Settlement"
                component={Settlement}
                options={{headerShown: false}}
                initialParams={{
                  mobileNumber: mobileNumber,
                }}
              />
              <Stack.Screen
                name="Registration"
                component={RegistrationScreen}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="MCC Codes"
                component={MCCCodes}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="Add Password"
                component={AddPassword}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="Update Password"
                component={UpdatePassword}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="My Details"
                component={MyDetails}
                options={{headerShown: false}}
              />
            </>
          )}
        </Stack.Navigator>
      </Provider>
    </NavigationContainer>
  );
}

export default App;
