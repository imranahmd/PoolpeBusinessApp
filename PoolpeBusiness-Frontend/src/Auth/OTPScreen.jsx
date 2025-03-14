import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import {colors} from 'react-native-elements';
import axios from 'axios';
import Config from 'react-native-config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {jwtDecode} from 'jwt-decode';
import AlertModal from '../components/AlertModal';

const OTPScreen = ({navigation, route}) => {
  const {
    mobileNumber,
    showPasswordOption,
    approved,
    showForgotPassword,
    token,
  } = route.params;
  const [otp, setOTP] = useState(Array(4).fill(''));
  const [receivedOTP, setReceivedOTP] = useState('');
  const [otpTimestamp, setOtpTimestamp] = useState(null); // Store OTP timestamp
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [resendOTPEnabled, setResendOTPEnabled] = useState(false);
  const [timer, setTimer] = useState(40);
  const [focusedIndex, setFocusedIndex] = useState(null);
  const inputRefs = useRef([]);
  const apiUrl = Config.REACT_APP_API_URL;

  useEffect(() => {
    fetchOTP();
    startTimer();
  }, [mobileNumber]);

  const onPressLogin = async () => {
    const currentTime = Math.floor(Date.now() / 1000);

    // Check if OTP is expired
    if (otpTimestamp && currentTime - otpTimestamp > 40) {
      showModal('Your OTP has expired. Please request a new one.');
      return;
    }

    if (otp.join('') === receivedOTP) {
      try {
        const token = await AsyncStorage.getItem('@user_token');
        const approved = await AsyncStorage.getItem('@user_approved');

        if (token && approved !== null) {
          const decodedToken = jwtDecode(token);

          await AsyncStorage.setItem('@user_token', token);
          await AsyncStorage.setItem(
            '@user_approved',
            JSON.stringify(approved),
          );
          await AsyncStorage.setItem('@verification_completed', 'true');

          if (isTokenValid(decodedToken)) {
            if (showForgotPassword) {
              navigation.navigate('Forgot Password', {
                mobileNumber,
                token,
              });
            } else if (showPasswordOption) {
              navigation.navigate('Dashboard', {
                mobileNumber: decodedToken.mobileNumber,
                approved: JSON.parse(approved),
                token,
              });
            } else {
              navigation.navigate('Store Selection', {mobileNumber});
            }
          } else {
            showModal('Token has expired. Please login again.');
          }
        } else {
          navigation.navigate('Store Selection', {mobileNumber});
        }
      } catch (error) {
        showModal('An error occurred during login. Please try again.');
        console.error('Failed to fetch the token:', error);
      }
    } else {
      showModal('The OTP you entered is incorrect.');
    }
  };

  const startTimer = () => {
    setResendOTPEnabled(false);
    setTimer(40);
    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setResendOTPEnabled(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const fetchOTP = async () => {
    try {
      const response = await axios.post(
        `${apiUrl}api/admin/otp`,
        {dest: mobileNumber},
        {headers: {'Content-Type': 'application/json'}},
      );
      if (response.data && response.data.otp) {
        console.log(response.data.otp);
        setReceivedOTP(response.data.otp.toString());
        setOtpTimestamp(Math.floor(Date.now() / 1000)); // Set OTP timestamp
        showModal(`Your OTP has been sent to +91-${mobileNumber}`);
      } else {
        showModal('Failed to receive a valid OTP.');
      }
    } catch (error) {
      showModal('An error occurred while fetching OTP.');
    }
  };

  const showModal = message => {
    setModalMessage(message);
    setModalVisible(true);
    setTimeout(() => {
      setModalVisible(false);
    }, 2000);
  };

  const isTokenValid = decodedToken => {
    const currentTime = Math.floor(Date.now() / 1000);
    return decodedToken.exp > currentTime;
  };

  const handleOTPChange = (text, index) => {
    if (text.length > 1) {
      text = text[text.length - 1];
    }

    const newOTP = [...otp];
    newOTP[index] = text;
    setOTP(newOTP);

    if (text && index < 3) {
      inputRefs.current[index + 1].focus();
    } else if (!text && index > 0) {
      if (!newOTP[index - 1]) {
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const handleResendOTP = async () => {
    if (resendOTPEnabled) {
      await fetchOTP();
      startTimer();
    }
  };

  const handleFocus = index => {
    setFocusedIndex(index);

    if (index > 0 && !otp[index - 1]) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleBlur = () => {
    setFocusedIndex(null);
  };

  const renderOTPInput = () => {
    return (
      <View style={styles.otpContainer}>
        {Array(4)
          .fill()
          .map((_, index) => (
            <TextInput
              key={index}
              style={[
                styles.otpBox,
                focusedIndex === index && styles.otpBoxFocused,
              ]}
              value={otp[index]}
              onChangeText={text => handleOTPChange(text, index)}
              maxLength={1}
              keyboardType="numeric"
              ref={el => (inputRefs.current[index] = el)}
              onFocus={() => handleFocus(index)}
              onBlur={handleBlur}
              selection={{start: 1, end: 1}}
            />
          ))}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.body}>
      <View style={styles.appBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={require('../../assets/images/LogoBusiness.png')}
            style={styles.logo}
          />
        </TouchableOpacity>
      </View>
      <View>
        <View style={styles.titleHeading}>
          <Text style={styles.title}>OTP Verification</Text>
          <Text style={styles.subTitle}>
            Please Enter the 4-digit verification code sent to {'\n'}
            +91-{mobileNumber} and the code is valid for 40 seconds.
          </Text>
        </View>
        <View style={{height: 30}}></View>
        <Text style={styles.otpTitle}>Enter Your OTP Here</Text>
        {renderOTPInput()}
      </View>
      <TouchableOpacity
        onPress={onPressLogin}
        style={[
          styles.nextButton,
          otp.join('').length !== 4 && {backgroundColor: '#ccc'},
        ]}
        disabled={otp.join('').length !== 4}>
        <Text style={styles.buttonText}>Verify</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={handleResendOTP}
        disabled={!resendOTPEnabled}
        style={styles.privacyPolicy}>
        <Text
          style={[
            styles.privacyPolicy,
            !resendOTPEnabled && styles.disabledText,
          ]}>
          {resendOTPEnabled ? 'Resend OTP' : `Resend OTP in ${timer}s`}
        </Text>
      </TouchableOpacity>
      <AlertModal
        visible={modalVisible}
        message={modalMessage}
        onDismiss={() => setModalVisible(false)}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  appBar: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 50,
  },
  body: {
    flex: 1,
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  titleHeading: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    color: 'black',
  },
  logo: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 10,
  },
  privacyPolicy: {
    color: colors.primary,
    marginBottom: 20,
    fontWeight: '600',
    marginTop: 10,
    textAlign: 'right',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  otpBox: {
    width: 60,
    height: 60,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
    textAlign: 'center',
    fontSize: 20,
    color: 'black',
  },
  otpBoxFocused: {
    borderColor: '#2058BB',
    borderWidth: 2,
  },
  otpDigit: {
    fontSize: 20,
    color: 'black',
  },
  hiddenInput: {
    position: 'absolute',
    width: '100%',
    height: 60,
    opacity: 0,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 8,
    color: 'black',
  },
  subTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 30,
    color: 'black',
  },
  otpTitle: {
    fontSize: 15,
    marginBottom: 8,
    color: 'grey',
  },
  bottom: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 20,
    width: '100%',
  },
  nextButton: {
    backgroundColor: '#2058BB',
    borderRadius: 10,
    paddingVertical: 15,
    marginTop: 20,
    width: '100%',
    minHeight: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    textAlign: 'center',
  },
  disabledText: {
    color: 'gray',
  },
});

export default OTPScreen;
