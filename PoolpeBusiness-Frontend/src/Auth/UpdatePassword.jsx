import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  BackHandler,
  useColorScheme,
} from 'react-native';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import Config from 'react-native-config';
import {useFocusEffect} from '@react-navigation/native';
import AlertModal from '../components/AlertModal';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UpdatePassword = ({route}) => {
  const {mobileNumber, approved} = route.params; // Destructure mobileNumber from route.params
  const [mobileNumberr, setMobileNumber] = useState(mobileNumber || ''); // Initialize state with mobileNumber
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertVisible2, setAlertVisible2] = useState(false);
  const [isOldPasswordVisible, setIsOldPasswordVisible] = useState(false);
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const apiUrl = Config.REACT_APP_API_URL;

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        navigation.goBack();
        return true; // Prevent default behavior
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [navigation]),
  );

  const handleUpdatePassword = async () => {
    if (!mobileNumberr || !oldPassword || !newPassword) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    if (oldPassword === newPassword) {
      // Alert.alert(
      //   'Error',
      //   'Old password and new password are the same. Please use a different new password.',
      // );
      setAlertVisible2(true);
      return;
    }

    try {
      const response = await axios.post(`${apiUrl}api/auth/update-password`, {
        mobileNumber: mobileNumberr,
        oldPassword: oldPassword,
        newPassword: newPassword,
      });

      if (response.status === 200) {
        try {
          await AsyncStorage.removeItem('@user_token');
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
      Alert.alert('Current Password was incorrect, Please try again.');
    }
  };

  const toggleOldPasswordVisibility = () => {
    setIsOldPasswordVisible(!isOldPasswordVisible);
  };

  const toggleNewPasswordVisibility = () => {
    setIsNewPasswordVisible(!isNewPasswordVisible);
  };

  const placeholderTextColor =
    colorScheme === 'dark' ? 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0.4)';
  const inputBorderColor = colorScheme === 'dark' ? '#444' : '#2058BB';
  const buttonText = colorScheme === 'dark' ? '#fff' : '#fff';
  const backgroundColor = colorScheme === 'dark' ? '#fff' : '#fff';
  const textColor = colorScheme === 'dark' ? '#333' : '#333';

  return (
    <View style={[styles.container, {backgroundColor}]}>
      <Text style={[styles.header, {color: '#2058BB'}]}>Update Password</Text>

      <View style={styles.passwordContainer}>
        <TextInput
          style={[
            styles.input,
            {borderColor: inputBorderColor, color: textColor},
          ]}
          placeholder="Old Password"
          placeholderTextColor={placeholderTextColor}
          value={oldPassword}
          onChangeText={setOldPassword}
          secureTextEntry={!isOldPasswordVisible}
        />
        <TouchableOpacity
          onPress={toggleOldPasswordVisibility}
          style={styles.eyeButton}>
          <Image
            source={
              isOldPasswordVisible
                ? require('../../assets/images/visible.png')
                : require('../../assets/images/hide.png')
            }
            style={styles.eyeIcon}
          />
        </TouchableOpacity>
      </View>
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
          secureTextEntry={!isNewPasswordVisible}
        />
        <TouchableOpacity
          onPress={toggleNewPasswordVisibility}
          style={styles.eyeButton}>
          <Image
            source={
              isNewPasswordVisible
                ? require('../../assets/images/visible.png')
                : require('../../assets/images/hide.png')
            }
            style={styles.eyeIcon}
          />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={[styles.addButton, {backgroundColor: '#2058BB'}]}
        onPress={handleUpdatePassword}>
        <Text style={styles.addButtonText}>Update Password</Text>
        <AlertModal
          visible={alertVisible}
          message="Password updated successfully! Login again to access the application"
          onDismiss={() => setAlertVisible(false)}
        />
        <AlertModal
          visible={alertVisible2}
          message="Old password and new password are the same. Please use a different new password"
          onDismiss={() => setAlertVisible2(false)}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#2058BB',
  },
  input: {
    width: '90%',
    height: 40,
    borderColor: '#2058BB',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
    color: '#333',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 5,
  },
  eyeButton: {
    position: 'absolute',
    right: 13,
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
    backgroundColor: '#2058BB',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default UpdatePassword;
