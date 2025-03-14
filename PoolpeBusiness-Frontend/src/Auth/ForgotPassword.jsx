import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  useColorScheme,
} from 'react-native';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import Config from 'react-native-config';
import AlertModal from '../components/AlertModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {jwtDecode} from 'jwt-decode';
import bcrypt from 'bcryptjs';
import {Image} from 'react-native-elements';

const ForgotPassword = ({route}) => {
  const {mobileNumber, token} = route.params;
  const [mobileNumberr, setMobileNumber] = useState(mobileNumber || '');
  const [newPassword, setNewPassword] = useState('');
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigation = useNavigation();
  const colorScheme = useColorScheme(); // Detect light or dark mode
  const apiUrl = Config.REACT_APP_API_URL;
  const [hashedPassword, setHashedPassword] = useState('');

  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        console.log('Decoded Token:', decodedToken);
        setHashedPassword(decodedToken.password); // Ensure this is the correct field
      } catch (error) {
        console.error('Failed to decode token:', error);
      }
    }
  }, [token]);

  const handleForgotPassword = async () => {
    if (!mobileNumberr || !newPassword) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    if (hashedPassword) {
      const isPasswordMatch = await bcrypt.compare(newPassword, hashedPassword);

      if (isPasswordMatch === true) {
        setAlertMessage(
          'This password is your current password. Please set a different password.',
        );
        setAlertVisible(true);
        return;
      }
    }

    try {
      const response = await axios.post(
        `${apiUrl}api/auth/update-new-password`,
        {
          mobileNumber: mobileNumberr,
          newPassword: newPassword,
        },
      );

      if (response.status === 200) {
        try {
          await AsyncStorage.removeItem('@user_token');
          setAlertMessage(
            'Password created successfully! Login again to access the application',
          );
          setAlertVisible(true);

          setTimeout(() => {
            setAlertVisible(false);
            navigation.reset({
              index: 0,
              routes: [{name: 'Mobile Number'}],
            });
          }, 2000);
        } catch (error) {
          console.error('Failed to clear the token:', error);
        }
      } else {
        Alert.alert('Error', 'Failed to update password. Please try again.');
      }
    } catch (error) {
      console.error('Error during API call:', error);
      Alert.alert('Error', 'Failed to update password. Please try again.');
    }
  };

  // Define colors based on color scheme
  const placeholderTextColor =
    colorScheme === 'dark' ? 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0.4)';
  const inputBorderColor = colorScheme === 'dark' ? '#444' : '#2058BB';
  const buttonText = colorScheme === 'dark' ? '#fff' : '#fff';
  const backgroundColor = colorScheme === 'dark' ? '#fff' : '#fff';
  const textColor = colorScheme === 'dark' ? '#333' : '#333';

  return (
    <View style={[styles.container, {backgroundColor}]}>
      <Text style={[styles.header, {color: '#2058BB'}]}>Forgot Password</Text>
      <TextInput
        style={[
          styles.input,
          {borderColor: inputBorderColor, color: textColor},
        ]}
        placeholder="Mobile Number"
        placeholderTextColor={placeholderTextColor}
        value={mobileNumberr}
        onChangeText={setMobileNumber}
        keyboardType="phone-pad"
      />
      <View style={styles.passwordContainer}>
        <TextInput
          style={[
            styles.input,
            {borderColor: inputBorderColor, color: textColor},
          ]}
          placeholder="New Password"
          placeholderTextColor={placeholderTextColor}
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry={!passwordVisible}
        />
        <TouchableOpacity
          style={styles.eyeButton}
          onPress={() => setPasswordVisible(!passwordVisible)}>
          <Image
            source={
              passwordVisible
                ? require('../../assets/images/visible.png')
                : require('../../assets/images/hide.png')
            }
            style={styles.eyeIcon}
          />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={[styles.addButton, {backgroundColor: '#2058BB'}]}
        onPress={handleForgotPassword}>
        <Text style={[styles.addButtonText, {color: buttonText}]}>
          Create New Password
        </Text>
      </TouchableOpacity>
      <AlertModal
        visible={alertVisible}
        message={alertMessage}
        onDismiss={() => setAlertVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '90%',
    height: 40,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  passwordContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  eyeButton: {
    position: 'absolute',
    right: 22,
    bottom: 20,
    padding: 10,
  },
  eyeIcon: {
    width: 20,
    height: 20,
  },
  addButton: {
    width: '90%',
    height: 40,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  addButtonText: {
    fontSize: 16,
  },
});

export default ForgotPassword;
