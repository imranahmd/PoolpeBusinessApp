import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  useColorScheme,
} from 'react-native';
AlertModal;
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import Config from 'react-native-config';
import AlertModal from '../components/AlertModal';

const AddPassword = ({route}) => {
  const {mobileNumber} = route.params; // Destructure mobileNumber from route.params
  const [mobileNumberr, setMobileNumber] = useState(mobileNumber || ''); // Initialize state with mobileNumber
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false); // State for password visibility
  const navigation = useNavigation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const apiUrl = Config.REACT_APP_API_URL;
  const colorScheme = useColorScheme();

  const placeholderTextColor =
    colorScheme === 'dark' ? 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0.4)';
  const inputBorderColor = colorScheme === 'dark' ? '#444' : '#2058BB';
  const buttonText = colorScheme === 'dark' ? '#fff' : '#fff';
  const backgroundColor = colorScheme === 'dark' ? '#fff' : '#fff';
  const textColor = colorScheme === 'dark' ? '#333' : '#333';

  const handleAddPassword = async () => {
    if (!mobileNumberr || !password) {
      Alert.alert('Error', 'Please enter both mobile number and password.');
      return;
    }

    try {
      const response = await axios.post(`${apiUrl}api/auth/add-password`, {
        mobileNumber: mobileNumberr,
        password: password,
      });
      if (response.status === 200) {
        setIsModalVisible(true);
        // Alert.alert('Password added successfully! Login again to access the application');
        setTimeout(() => {
          navigation.navigate('Dashboard', {mobileNumber: mobileNumber});
        }, 2000);
      } else {
        Alert.alert('Error', 'Failed to add password. Please try again.');
      }
    } catch (error) {
      // console.error(error);
      // Alert.alert('User already found with same credentials!');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Add Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Mobile Number"
        value={mobileNumberr}
        onChangeText={setMobileNumber}
        keyboardType="phone-pad"
        editable={false}
      />
      <View style={styles.passwordContainer}>
        <TextInput
          style={[
            styles.input,
            {borderColor: inputBorderColor, color: textColor},
          ]}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!passwordVisible} // Toggle secureTextEntry based on passwordVisible state
        />
        <TouchableOpacity
          onPress={() => setPasswordVisible(!passwordVisible)}
          style={styles.eyeButton}>
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
        onPress={handleAddPassword}>
        <Text style={styles.addButtonText}>Add Password</Text>
      </TouchableOpacity>
  
      <AlertModal
        visible={isModalVisible}
        message="Password added successfully!"
        onDismiss={() => setIsModalVisible(false)}
      />
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
  inputPassword: {
    width: '90%',

    height: 40,
    paddingHorizontal: 10,
    color: '#333',
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
  updateText: {
    marginTop: 20,
    color: '#2058BB',
    textAlign: 'center',
    fontSize: 15,
    textDecorationLine: 'underline',
  },
});

export default AddPassword;
