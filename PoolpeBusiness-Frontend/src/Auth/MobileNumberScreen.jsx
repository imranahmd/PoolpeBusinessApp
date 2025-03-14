import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useSelector} from 'react-redux';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode'; // Correct import for jwt-decode
import bcrypt from 'bcryptjs'; // Import bcrypt for password hashing
import Config from 'react-native-config';
import AlertModal from '../components/AlertModal';
import {useFocusEffect} from '@react-navigation/native';

const MobileNumberScreen = ({navigation}) => {
  const [mobileNumber, setMobileNo] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const usersData = useSelector(state => state.users.usersData);
  const [registeredMobileNumber, setRegisteredMobileNumber] = useState('');
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [password, setPassword] = useState('');
  const [showPasswordButton, setShowPasswordButton] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State for toggling password visibility
  const [token, setToken] = useState('');
  const [otpLoginDisabled, setOtpLoginDisabled] = useState(true); // Initially disabled
  const [addPasswordMode, setAddPasswordMode] = useState(false);
  const [approved, setApproved] = useState(false); // New state to hold the approved value
  const [showForgotPassword, setShowForgotPassword] = useState(true); // State to manage visibility of Forgot Password link
  const apiUrl = Config.REACT_APP_API_URL;

  useEffect(() => {
    if (usersData[0]?.user?.MobileNumber) {
      setRegisteredMobileNumber(usersData[0].user.MobileNumber);
    }
  }, [usersData]);

  useFocusEffect(
    React.useCallback(() => {
      setMobileNo('');
      setPassword('');
      setShowForgotPassword(true); // Always true
      setOtpLoginDisabled(true);
    }, []),
  );

  const validateMobileNumber = async text => {
    // Reset the visibility state whenever the text changes
    setShowPasswordButton(false);
    setShowPasswordInput(false);
    setOtpLoginDisabled(true);
    setAddPasswordMode(false);
    setErrorMessage('');
    setShowForgotPassword(false); // Hide by default

    if (text.length === 0) {
      setErrorMessage('');
    } else if (/^\d{10}$/.test(text)) {
      try {
        const response = await axios.post(
          `${apiUrl}api/admin/login`,
          {mobileNumber: text},
          {headers: {'Content-Type': 'application/json'}},
        );

        if (response.data.message === 'User does not exist!!') {
          setShowPasswordButton(false);
          setShowPasswordInput(false);
          setOtpLoginDisabled(false);
          setAddPasswordMode(false);
        } else if (response.data.message === 'Password does not exist!!') {
          setShowPasswordButton(false);
          setShowPasswordInput(false);
          setOtpLoginDisabled(true);
          setErrorMessage(
            'This user is registered but password is not created. Please create a password.',
          );
          setAddPasswordMode(true);
        } else if (response.data.message === 'Login successful') {
          setShowPasswordButton(true);
          setShowPasswordInput(true); // Make sure to show the password input
          setOtpLoginDisabled(false);
          setAddPasswordMode(false);
          setShowForgotPassword(true); // Show Forgot Password link
          const receivedToken = response.data.token;
          console.log(receivedToken);
          const receivedApproved = response.data.approved;
          setToken(receivedToken);
          setApproved(receivedApproved);
          await AsyncStorage.setItem('@user_token', receivedToken);

          await AsyncStorage.setItem(
            '@user_approved',
            JSON.stringify(receivedApproved),
          );
        }
      } catch (error) {
        // handle error if needed
      }
    }
  };

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
          // Decode and validate token
          const decodedToken = jwtDecode(savedToken);
          if (decodedToken && savedApproved) {
            // Check if token is expired or invalid
            if (isTokenValid(decodedToken)) {
              navigation.navigate('Dashboard', {
                mobileNumber: decodedToken.mobileNumber,
                approved: JSON.parse(savedApproved),
                token: savedToken,
              });
            } else {
              // Handle invalid token
              await AsyncStorage.removeItem('@user_token');
              await AsyncStorage.removeItem('@user_approved');
              await AsyncStorage.removeItem('@verification_completed');
              // navigation.navigate('Login');
            }
          } else {
            // Handle missing token or approval status
            await AsyncStorage.removeItem('@user_token');
            await AsyncStorage.removeItem('@user_approved');
            await AsyncStorage.removeItem('@verification_completed');
            // navigation.navigate('Login');
          }
        } else {
          // Handle case where verification is not completed
          await AsyncStorage.removeItem('@user_token');
          await AsyncStorage.removeItem('@user_approved');
          await AsyncStorage.removeItem('@verification_completed');
          // navigation.navigate('Login');
        }
      } catch (error) {
        // console.error('Failed to fetch the token:', error);
      }
    };

    checkToken();
  }, []);

  const handlePasswordLogin = async () => {
    try {
      const decodedToken = jwtDecode(token);
      const hashedPasswordFromToken = decodedToken.password;
      if (bcrypt.compareSync(password, hashedPasswordFromToken)) {
        await AsyncStorage.setItem('@user_token', token);
        await AsyncStorage.setItem('@user_approved', JSON.stringify(approved));
        await AsyncStorage.setItem('@verification_completed', 'true');
        navigation.navigate('Dashboard', {
          mobileNumber: mobileNumber,
          approved: approved,
        });
      } else {
        setErrorMessage('Incorrect password. Please try again.');
      }
    } catch (error) {
      setErrorMessage('An error occurred during login. Please try again.');
      // console.error(error);
    }
  };

  const handleAddPassword = async () => {
    if (!mobileNumber || !password) {
      Alert.alert('Error', 'Please enter both mobile number and password.');
      return;
    }

    try {
      const response = await axios.post(`${apiUrl}api/auth/add-password`, {
        mobileNumber: mobileNumber,
        password: password,
      });
      if (response.status === 200) {
        setAlertVisible(true);
        await AsyncStorage.setItem('@verification_completed', 'true');
      } else {
        Alert.alert('Error', 'Failed to add password. Please try again.');
      }
    } catch (error) {
      // console.error(error);
      Alert.alert('Error', 'User already found with same credentials!');
    }
  };

  const onDismissAlertModal = () => {
    setAlertVisible(false);
    setMobileNo('');
    setPassword('');
    setAddPasswordMode(false);
  };

  const isTokenValid = decodedToken => {
    const currentTime = Math.floor(Date.now() / 1000);
    return decodedToken.exp > currentTime;
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.body}>
          <Image
            source={require('../../assets/images/LogoBusiness.png')}
            style={styles.logo}
          />
          <View style={styles.titleHeading}>
            <Text style={styles.title}>Enter Your Mobile Number</Text>
            <Text style={styles.subTitle}>
              We'll send you a verification code to ensure the security of your
              account.
            </Text>
          </View>
          <View style={styles.inputRow}>
            <Text style={styles.countryCode}>+91</Text>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Phone No"
                placeholderTextColor="#606060"
                style={styles.input}
                keyboardType="numeric"
                onChangeText={text => {
                  if (/^\d{0,10}$/.test(text)) {
                    setMobileNo(text);
                    if (text.length === 10) {
                      validateMobileNumber(text);
                      setOtpLoginDisabled(false);
                    } else if (text.length === 0) {
                      setErrorMessage('');
                      setOtpLoginDisabled(true);
                    } else {
                      setErrorMessage(
                        'Please enter a valid 10-digit mobile number.',
                      );
                      setOtpLoginDisabled(true);
                    }
                  }
                }}
                value={mobileNumber}
              />
            </View>
          </View>
          {showPasswordInput && (
            <View style={styles.inputRow}>
              <TextInput
                name="Password"
                placeholder="Password"
                placeholderTextColor="#606060"
                style={styles.passwordInput}
                secureTextEntry={!showPassword}
                onChangeText={text => setPassword(text)}
                value={password}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeButton}>
                <Image
                  source={
                    showPassword
                      ? require('../../assets/images/visible.png')
                      : require('../../assets/images/hide.png')
                  }
                  style={styles.eyeIcon}
                />
              </TouchableOpacity>
            </View>
          )}
          {showPasswordInput && (
            <TouchableOpacity
              onPress={handlePasswordLogin}
              style={styles.submitButton}>
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
          )}
          {errorMessage && (
            <Text style={styles.errorMessage}>{errorMessage}</Text>
          )}
          <TouchableOpacity
            onPress={() => {
              if (mobileNumber.length === 10) {
                navigation.navigate('OTP', {
                  mobileNumber,
                  showForgotPassword: showForgotPassword,
                  approved: approved,
                  token,
                });
              }
            }}
            disabled={mobileNumber.length !== 10}>
            <Text
              style={[
                styles.forgotPassword,
                mobileNumber.length !== 10 && styles.disabledForgotPassword,
                !showForgotPassword && {display: 'none'}, // Hide when showForgotPassword is false
              ]}>
              Forgot Password?
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <View style={styles.bottom}>
        {addPasswordMode && (
          <View style={styles.addPasswordContainer}>
            <Text style={styles.header}>Add Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholderTextColor="#606060"
            />
            <TouchableOpacity
              onPress={handleAddPassword}
              style={styles.addPasswordButton}>
              <Text style={styles.buttonText}>Create Password</Text>
              <AlertModal
                visible={alertVisible}
                message="Password created successfully! Login again to access the application"
                onDismiss={onDismissAlertModal}
              />
            </TouchableOpacity>
          </View>
        )}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            onPress={() =>
              !otpLoginDisabled &&
              navigation.navigate('OTP', {
                mobileNumber,
                showPasswordOption: showPasswordButton,
              })
            }
            style={[
              styles.nextButton,
              otpLoginDisabled && styles.disabledButton,
            ]}
            disabled={otpLoginDisabled}>
            <Text style={styles.buttonText}>Login via OTP</Text>
          </TouchableOpacity>
          {showPasswordButton && !showPasswordInput && (
            <TouchableOpacity
              onPress={() => setShowPasswordInput(true)}
              style={styles.nextButton}>
              <Text style={styles.buttonText}>Login via Password</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  body: {
    flex: 1,
    marginTop: 50,
    alignItems: 'flex-start',
    paddingHorizontal: 20,
  },
  titleHeading: {
    flexDirection: 'column',
    alignContent: 'flex-start',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#2058BB',
  },
  countryCode: {
    fontSize: 18,
    marginRight: 10,
    color: 'black',
    fontWeight: 'bold',
  },
  inputContainer: {
    flex: 1,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 4,
    color: 'black',
  },
  subTitle: {
    fontSize: 14,
    marginBottom: 20,
    color: '#606060',
  },
  input: {
    fontSize: 16,
    paddingVertical: 10,
    color: 'black',
  },
  logo: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 10,
  },
  bottom: {
    alignItems: 'flex-start',
    paddingBottom: 20,
    paddingHorizontal: 22,
    width: '100%',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  nextButton: {
    backgroundColor: '#2058BB',
    borderRadius: 10,
    paddingVertical: 15,
    width: '48%',
  },
  disabledButton: {
    backgroundColor: 'gray',
  },
  submitButton: {
    backgroundColor: '#2058BB',
    borderRadius: 6,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  errorMessage: {
    color: 'red',
    marginTop: 8,
  },
  forgotPassword: {
    color: '#2058BB',
    fontWeight: 'bold',
    marginTop: 10,
  },
  disabledForgotPassword: {
    color: 'gray',
  },
  passwordInput: {
    fontSize: 16,
    paddingVertical: 10,
    color: 'black',
    borderBottomWidth: 1,
    borderBottomColor: '#2058BB',
    flex: 1,
  },
  addPasswordContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  addPasswordButton: {
    backgroundColor: '#2058BB',
    borderRadius: 10,
    paddingVertical: 15,
    width: '100%',
    marginTop: 10,
  },
  eyeButton: {
    position: 'absolute',
    right: 0,
    padding: 10,
  },
  eyeIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
});

export default MobileNumberScreen;
