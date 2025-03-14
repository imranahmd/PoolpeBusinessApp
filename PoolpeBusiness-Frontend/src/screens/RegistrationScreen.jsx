import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  BackHandler,
  PermissionsAndroid,
  Alert,
  Linking,
  Image,
} from 'react-native';
import axios from 'axios';
import DocumentPicker from 'react-native-document-picker';
import RNFS, {copyFile} from 'react-native-fs';
import {useDispatch} from 'react-redux';
import {registerUser} from '../reducers/userSlice';
import ProgressBar from '../components/ProgressBar';
import {Picker} from '@react-native-picker/picker';
import CheckBox from '@react-native-community/checkbox';
import Config from 'react-native-config';
import AlertModal from '../components/AlertModal';
import DateTimePicker from '@react-native-community/datetimepicker';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {Border} from './GlobalStyles';

const RegistrationScreen = ({navigation, route}) => {
  const {mobileNumber, mcc = ''} = route.params;
  const [panFileName, setPanFileName] = useState('');
  const [profilePhotoFileName, setProfilePhotoFileName] = useState('');
  const [hiddenValue, setHiddenValue] = useState('');
  const [panFileSize, setPanFileSize] = useState(0);
  const [profilePhotoFileSize, setProfilePhotoFileSize] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [panFileType, setPanFileType] = useState('');
  const [profilePhotoFileType, setProfilePhotoFileType] = useState('');
  const [isMatch, setIsMatch] = useState(false); // State to track if the values match
  const [datePickerVisible, setDatePickerVisible] = useState({
    dob: false,
    doi: false,
  });

  const [selectedDate, setSelectedDate] = useState({
    dob: new Date(),
    doi: new Date(),
  });

  const dispatch = useDispatch();
  const apiUrl = Config.REACT_APP_API_URL;

  useEffect(() => {
    const backAction = () => {
      Alert.alert('Hold on!', 'Are you sure you want to go back?', [
        {
          text: 'Cancel',
          onPress: () => null,
          style: 'cancel',
        },
        {
          text: 'YES',
          onPress: () =>
            navigation.navigate('Business Type', {
              mobileNumber: mobileNumber,
            }),
        },
      ]);
      return true;
    };

    const openSettings = () => {
      Linking.openSettings().catch(() => {
        Alert.alert('Unable to open settings');
      });
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  const [formDetails, setFormDetails] = useState({
    sellerIdentifier: '',
    businessname: '',
    settlementAccountName: '',
    mobileNumber: mobileNumber,
    emailId: '',
    mcc: mcc ? mcc.toString() : '',
    turnoverType: '',
    acceptanceType: '',
    ownershipType: '',
    city: '',
    district: '',
    stateCode: '',
    pinCode: '',
    pan: '',
    gstNumber: '',
    settlementAccountNumber: '',
    settlementIFSC: '',
    latitude: 12.3456789,
    longitude: 98.7654321,
    addressLine1: '',
    addressLine2: '',
    llpInOrCin: '',
    udyogAadhaar: '',
    dob: '',
    doi: '',
    electricityBoardCode: '',
    apiKey: '',
    hash: '',
    qrString: '',
    panDocument: '',
    profilePhoto: '',
    panFileType: panFileType,
    profilePhotoFileType: profilePhotoFileType,
  });
  console.log('formDetails', panFileType, profilePhotoFileType);

  const [currentPage, setCurrentPage] = useState(0);
  const [isTermsChecked, setIsTermsChecked] = useState(false);
  const [isPrivacyChecked, setIsPrivacyChecked] = useState(false);

  const resetFormFields = () => {
    setFormDetails({
      sellerIdentifier: '',
      businessname: '',
      settlementAccountName: '',
      mobileNumber: mobileNumber,
      emailId: '',
      mcc: mcc ? mcc.toString() : '',
      turnoverType: '',
      acceptanceType: '',
      ownershipType: '',
      city: '',
      district: '',
      stateCode: '',
      pinCode: '',
      pan: '',
      gstNumber: '',
      settlementAccountNumber: '',
      settlementIFSC: '',
      latitude: 12.3456789,
      longitude: 98.7654321,
      addressLine1: '',
      addressLine2: '',
      llpInOrCin: '',
      udyogAadhaar: '',
      dob: '',
      doi: '',
      electricityBoardCode: '',
      apiKey: '',
      hash: '',
      qrString: '',
      panDocument: '',
      profilePhoto: '',
      panFileType: '',
      profilePhotoFileType: '',
    });
  };

  const handleInputChange = (fieldName, value) => {
    if (fieldName === 'profilePhoto' || fieldName === 'panDocument') {
      handleDocumentPick(fieldName);
    } else {
      setFormDetails(prevState => ({
        ...prevState,
        [fieldName]: value,
      }));
    }
  };

  const handleDateChange = (event, selectedDate, fieldName) => {
    if (event.type === 'set') {
      // Check if the date is confirmed
      const currentDate = selectedDate || new Date();
      // Format the date as YYYY-MM-DD
      const formattedDate = currentDate.toISOString().split('T')[0];

      setDatePickerVisible(prevState => ({...prevState, [fieldName]: false}));
      setSelectedDate(prevState => ({...prevState, [fieldName]: currentDate}));

      console.log(formattedDate); // Log the formatted date

      // Update formDetails with the formatted date
      handleInputChange(fieldName, formattedDate);
    } else if (event.type === 'clear') {
      // Handle date clearing
      setDatePickerVisible(prevState => ({...prevState, [fieldName]: false}));
      setSelectedDate(prevState => ({...prevState, [fieldName]: null}));

      console.log('Date cleared'); // Log that the date was cleared

      // Update formDetails with an empty value
      handleInputChange(fieldName, '');
    } else {
      // Close the picker if date is not set
      setDatePickerVisible(prevState => ({...prevState, [fieldName]: false}));
    }
  };

  const handleDocumentPick = async fieldName => {
    const openSettings = () => {
      Linking.openSettings().catch(() => {
        Alert.alert('Unable to open settings');
      });
    };

    const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB in bytes
    // console.log(MAX_FILE_SIZE)

    if (Platform.OS === 'android') {
      try {
        const readVideoPermissionStatus = await check(
          PERMISSIONS.ANDROID.READ_MEDIA_VIDEO,
        );
        const readAudioPermissionStatus = await check(
          PERMISSIONS.ANDROID.READ_MEDIA_AUDIO,
        );
        const readImagesPermissionStatus = await check(
          PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
        );

        // console.log('Read Permission Status:', readVideoPermissionStatus); // Debugging line
        // console.log('Write Permission Status:', readAudioPermissionStatus); // Debugging line
        // console.log('Read Permission Status:', readImagesPermissionStatus); // Debugging line

        if (
          readVideoPermissionStatus === RESULTS.DENIED ||
          readAudioPermissionStatus === RESULTS.DENIED ||
          readImagesPermissionStatus == RESULTS.DENIED
        ) {
          const grantedReadVideo = await request(
            PERMISSIONS.ANDROID.READ_MEDIA_VIDEO,
          );
          const grantedReadAudio = await request(
            PERMISSIONS.ANDROID.READ_MEDIA_AUDIO,
          );
          const grantedReadImages = await request(
            PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
          );

          console.log('Read Videos Granted:', grantedReadVideo); // Debugging line
          console.log('Read Audio Granted:', grantedReadAudio); // Debugging line
          console.log('Read Images Granted:', grantedReadImages);

          if (
            grantedReadVideo !== RESULTS.GRANTED ||
            grantedReadAudio !== RESULTS.GRANTED ||
            grantedReadImages != RESULTS.GRANTED
          ) {
            console.log('Permission denied');
            Alert.alert(
              'Permission Required',
              'This app needs storage access permissions. Please grant them in your device settings.',
              [{text: 'Open Settings', onPress: openSettings}],
            );
            return;
          }
        }

        // Permission is granted, proceed to pick the document
        const res = await DocumentPicker.pick({
          type: [DocumentPicker.types.allFiles],
        });

        // Get file stats including size
        if (res[0].size > MAX_FILE_SIZE) {
          Alert.alert(
            'File Size Error',
            'The selected file is larger than 2 MB. Please select a smaller file.',
          );
          return;
        }

        const fileName = res[0].name;
        const fileType = fileName.split('.').pop(); // Get the last part after the last dot

        if (fieldName === 'panDocument') {
          setPanFileSize(res[0].size);
          setPanFileType(fileType);
        } else if (fieldName === 'profilePhoto') {
          setProfilePhotoFileSize(res[0].size);
          setProfilePhotoFileType(fileType);
        }

        // Read file as base64
        const base64Data = await RNFS.readFile(res[0].uri, 'base64');

        // Set form details with base64 data
        setFormDetails(prevState => ({
          ...prevState,
          [fieldName]: base64Data,
        }));
        if (fieldName === 'panDocument') {
          setPanFileName(res[0].name);
        } else if (fieldName === 'profilePhoto') {
          setProfilePhotoFileName(res[0].name);
        }
        console.log(res[0].name);
      } catch (err) {
        if (DocumentPicker.isCancel(err)) {
          console.log('User cancelled the document picker');
        } else {
          console.error('Unknown error: ', err);
        }
      }
    } else {
      try {
        const res = await DocumentPicker.pickSingle({
          type: [DocumentPicker.types.allFiles],
        });

        if (res.size > MAX_FILE_SIZE) {
          Alert.alert(
            'File Size Error',
            'The selected file is larger than 2 MB. Please select a smaller file.',
          );
          return;
        }

        const fileName = res[0].name;
        const fileType = fileName.split('.').pop(); // Get the last part after the last dot

        handleInputChange(fieldName, res.uri); // Handle the selected document's URI
        if (fieldName === 'panDocument') {
          setPanFileName(res.name);
          console.log(fileType);
          setPanFileType(fileType);
        } else if (fieldName === 'profilePhoto') {
          setProfilePhotoFileName(res.name);
          console.log(fileType);
          setProfilePhotoFileType(fileType);
        }
        if (fieldName === 'panDocument') {
          setPanFileSize(res.size);
        } else if (fieldName === 'profilePhoto') {
          setProfilePhotoFileSize(res.size);
        }
        console.log(res[0].name);
        console.log('ewre', res[0].type);
      } catch (err) {
        if (DocumentPicker.isCancel(err)) {
          console.log('User cancelled document picker');
        } else {
          console.error('DocumentPicker Error: ', err);
        }
      }
    }
  };

  const validateForm = pageIndex => {
    const {
      businessname,
      pan,
      gstNumber,
      panDocument,
      emailId,
      sellerIdentifier,
      city,
      acceptanceType,
      turnoverType,
      district,
      udyogAadhaar,
      pinCode,
      addressLine1,
      mcc,
      settlementAccountName,
      settlementAccountNumber,
      settlementIFSC,
      ownershipType,
      stateCode,
      dob,
      doi,
    } = formDetails;

    const validations = [
      () => {
        if (businessname.trim() === '') {
          Alert.alert('Validation Error', 'Business Name cannot be empty');
          return false;
        }
        if (acceptanceType === '') {
          Alert.alert('Validation Error', 'Acceptance Type must be selected');
          return false;
        }
        if (ownershipType === '') {
          Alert.alert('Validation Error', 'Ownership Type must be selected');
          return false;
        }
        if (turnoverType === '') {
          Alert.alert('Validation Error', 'Turnover Type must be selected');
          return false;
        }
        if (city.trim() === '') {
          Alert.alert('Validation Error', 'City cannot be empty');
          return false;
        }

        return true;
      },
      () => {
        if (district.trim() === '') {
          Alert.alert('Validation Error', 'District cannot be empty');
          return false;
        }
        if (
          !/^\d{2}$/.test(stateCode) ||
          Number(stateCode) < 1 ||
          Number(stateCode) > 36
        ) {
          Alert.alert(
            'Validation Error',
            'State Code must be a number between 01 and 36',
          );
          return false;
        }
        if (!/^\d{6}$/.test(pinCode.trim())) {
          Alert.alert(
            'Validation Error',
            'Pincode must be exactly 6 digits with no alphabets allowed',
          );
          return false;
        }

        if (addressLine1.trim() === '') {
          Alert.alert('Validation Error', 'Address cannot be empty');
          return false;
        }

        return true;
      },
      () => {
        if (mcc.trim() === '') {
          Alert.alert('Validation Error', 'MCC cannot be empty');
          return false;
        }
        if (!/^\d{4}$/.test(mcc)) {
          Alert.alert('Validation Error', 'MCC should be exactly 4 digits');
          return false;
        }
        if (settlementAccountName.trim() === '') {
          Alert.alert(
            'Validation Error',
            'Settlement Account Name cannot be empty',
          );
          return false;
        }
        if (/\d/.test(settlementAccountName)) {
          Alert.alert(
            'Validation Error',
            'Settlement Account Name cannot contain digits',
          );
          return false;
        }

        if (
          !settlementAccountNumber ||
          !/^\d+$/.test(settlementAccountNumber)
        ) {
          Alert.alert(
            'Validation Error',
            'Settlement Account Number must be numeric and cannot be empty',
          );
          return false;
        }
        if (
          !settlementIFSC ||
          !/^[A-Z0-9]{11}$/.test(settlementIFSC) ||
          !/[A-Z]/.test(settlementIFSC) ||
          !/\d/.test(settlementIFSC)
        ) {
          Alert.alert(
            'Validation Error',
            'IFSC Code must be 11 characters long, alphanumeric, and contain both letters and digits',
          );
          return false;
        }

        return true;
      },
      () => {
        if (
          ownershipType !== 'PROPRIETARY' &&
          (!gstNumber || !/^[A-Z0-9]{15}$/.test(gstNumber))
        ) {
          Alert.alert(
            'Validation Error',
            'GSTN Number must be in uppercase with 15 characters',
          );
          return false;
        }
        if (!pan || !/^[A-Z0-9]{10}$/.test(pan)) {
          Alert.alert(
            'Validation Error',
            'PAN must be in uppercase with 10 characters',
          );
          return false;
        }
        if (panDocument === '') {
          Alert.alert('Validation Error', 'Please upload PAN Document');
          return false;
        }
        // if (emailId.trim() === '') {
        //   Alert.alert('Validation Error', 'Email cannot be empty');
        //   return false;
        // }
        return true;
      },
      () => {
        if (ownershipType !== 'PROPRIETARY') {
          if (!doi || !/^\d{4}-\d{2}-\d{2}$/.test(doi)) {
            Alert.alert(
              'Validation Error',
              'Date of Incorporation (DOI) must be in YYYY-MM-DD format and is mandatory for Non Proprietary ownership type',
            );
            return false;
          }
        }
        if (!dob || !/^\d{4}-\d{2}-\d{2}$/.test(dob)) {
          Alert.alert(
            'Validation Error',
            'Date of Birth (DOB) must be in YYYY-MM-DD format',
          );
          return false;
        }

        return true;
      },
    ];

    return validations[pageIndex]();
  };

  const handleNext = () => {
    if (validateForm(currentPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleBack = () => {
    setCurrentPage(currentPage - 1);
  };

  // const handleContinue = async () => {
  //   if (!validateForm(currentPage)) return;

  //   const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB

  //   if (panFileSize > MAX_FILE_SIZE || profilePhotoFileSize > MAX_FILE_SIZE) {
  //     Alert.alert(
  //       'File Size Error',
  //       'One or more selected files are larger than 2 MB. Please select smaller files before proceeding.',
  //     );
  //     return; // Stop the registration process
  //   }

  //   try {
  //     if (!isTermsChecked || !isPrivacyChecked) {
  //       Alert.alert(
  //         'Error',
  //         'Please agree to the Terms and Conditions and accept the Privacy Policy before registering.',
  //       );
  //       return;
  //     }

  //     const payload = {
  //       ...formDetails,
  //     };

  //     const headers = {
  //       'Content-Type': 'application/json',
  //     };

  //     console.log(payload);
  //     const response = await axios.post(
  //       `${apiUrl}api/auth/registration`,
  //       payload,
  //       {headers},
  //     );

  //     if (response.status === 200 || response.status === 201) {
  //       console.log('Registration successful:', response);
  //       setIsModalVisible(true);
  //       dispatch(registerUser(response.data));

  //       console.log('userEmail', payload.emailId);

  //       const emailData = {
  //         to: payload.emailId,
  //         subject: 'User Approval | Poolpe Business',
  //         text: 'Hi Ashutosh',
  //       };

  //       const mailResponse = await axios.post(
  //         `${apiUrl}api/admin/mail`,
  //         emailData,
  //         {headers},
  //       );

  //       if (mailResponse.status === 200 || mailResponse.status === 201) {
  //         console.log('Mail sent successfully:', mailResponse.data);
  //         resetFormFields();
  //         navigation.navigate('Add Password', {
  //           mobileNumber: mobileNumber,
  //         });
  //       } else {
  //         throw new Error('Failed to send email');
  //       }
  //     } else {
  //       throw new Error('Registration failed');
  //     }
  //   } catch (error) {
  //     // console.error(
  //     //   'Error details:',
  //     //   error.response ? error.response.data : error.message,
  //     // );
  //     Alert.alert(
  //       'Error',
  //       error.response
  //         ? ` ${error.response.data.message || error.message}`
  //         : 'Registration completed, but email could not be sent due. Please try again later.',
  //     );
  //   }
  // };

  const handleContinue = async () => {
    if (!validateForm(currentPage)) return;

    const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB

    if (panFileSize > MAX_FILE_SIZE || profilePhotoFileSize > MAX_FILE_SIZE) {
      Alert.alert(
        'File Size Error',
        'One or more selected files are larger than 2 MB. Please select smaller files before proceeding.',
      );
      return; // Stop the registration process
    }

    try {
      if (!isTermsChecked || !isPrivacyChecked) {
        Alert.alert(
          'Error',
          'Please agree to the Terms and Conditions and accept the Privacy Policy before registering.',
        );
        return;
      }

      const payload = {
        ...formDetails,
        panFileType, // Explicitly include file types
        profilePhotoFileType,
      };

      const headers = {
        'Content-Type': 'application/json',
      };

      // console.log(payload);
      console.log('registration iniated /n/n/n');
      const response = await axios.post(
        `${apiUrl}api/auth/registration`,
        payload,
        {headers},
      );
      console.log('registration /n/n/n' + response.data);
      console.log('/n/n response.status' + response.status);
      9;

      if (response.status === 200 || response.status === 201) {
        // console.log('Registration successful:', response);
        setIsModalVisible(true);
        dispatch(registerUser(response.data));

        // console.log('userEmail', payload.emailId);

        const emailData = {
          to: payload.mobileNumber,
          subject: 'User Approval | Poolpe Business',
          text: `Hi Admin, please check user details.`,
        };

        try {
          console.log('mail iniated');
          const mailResponse = await axios.post(
            `${apiUrl}api/admin/mail`,
            emailData,
            {headers},
          );
          console.log('mailResponse', mailResponse);
          if (mailResponse.status === 200 || mailResponse.status === 201) {
            console.log('Mail sent successfully');
            resetFormFields();
            navigation.navigate('Add Password', {
              mobileNumber: mobileNumber,
            });
          } else {
            throw new Error('Failed to send email');
          }
        } catch (mailError) {
          console.error(
            'Error details:',
            mailError.response ? mailError.response.data : mailError.message,
          );

          let errorMessage =
            'Registration completed, but the email could not be sent.';

          if (mailError.response) {
            // Customize the message based on the error response
            if (mailError.response.status === 413) {
              errorMessage +=
                ' The email payload is too large. Please reduce the attachment size or content.';
            } else if (mailError.response.status === 500) {
              errorMessage +=
                ' There was a server error while sending the email. Please try again later.';
            } else {
              errorMessage += ` An unexpected error occurred: ${
                mailError.response.data.message || mailError.message
              }.`;
            }
          } else {
            errorMessage +=
              ' Please check your internet connection and try again.';
          }

          Alert.alert('Error', errorMessage);
        }
      } else {
        throw new Error('Registration failed');
      }
    } catch (error) {
      // console.error('Error details:', error.response ? error.response.data : error.message);
      Alert.alert(
        error.response
          ? ` ${error.response.data.message || error.message}`
          : 'Registration Successful!',
      );
    }
  };

  // const renderFormFields = (fields, pageIndex) => {
  //   let internalHiddenValue = ''; // Internal state to store the hidden value for validation
  //   return fields.map((field, index) => (
  //     <View key={field.name} style={styles.fieldContainer}>
  //       <Text style={styles.fieldLabel}>
  //         {field.placeholder}
  //         {field.mandatory && <Text style={styles.asterisk}> *</Text>}
  //         {field.optional && <Text style={styles.optional}>(Optional)</Text>}
  //       </Text>
  //       {field.type === 'document' ? (
  //         <TouchableOpacity
  //           style={styles.uploadButton}
  //           onPress={() => handleDocumentPick(field.name)}
  //           accessibilityLabel={`Upload ${field.placeholder} document`}>
  //           <Text style={[styles.buttonText, styles.blackText]}>
  //             {field.name === 'panDocument' && panFileName
  //               ? panFileName
  //               : field.name === 'profilePhoto' && profilePhotoFileName
  //               ? profilePhotoFileName
  //               : field.placeholder}
  //           </Text>
  //         </TouchableOpacity>
  //       ) : field.type === 'dropdown' ? (
  //         <View style={styles.borderedPicker}>
  //           <Picker
  //             selectedValue={formDetails[field.name]}
  //             style={styles.input}
  //             onValueChange={value => handleInputChange(field.name, value)}>
  //             {field.options.map((option, index) => (
  //               <Picker.Item
  //                 key={index}
  //                 label={option.label}
  //                 value={option.value}
  //                 enabled={!option.disabled}
  //               />
  //             ))}
  //           </Picker>
  //         </View>
  //       ) : field.type === 'date' || field.type === 'datetime' ? (
  //         <>
  //           <TouchableOpacity
  //             style={styles.dateInputConatiner}
  //             onPress={() =>
  //               setDatePickerVisible(prevState => ({
  //                 ...prevState,
  //                 [field.name]: true,
  //               }))
  //             }>
  //             <Text style={styles.dateInput}>
  //               {formDetails[field.name]
  //                 ? new Date(formDetails[field.name]).toLocaleDateString()
  //                 : 'Select Date'}
  //             </Text>
  //           </TouchableOpacity>

  //           {datePickerVisible[field.name] && (
  //             <DateTimePicker
  //               value={selectedDate[field.name]}
  //               mode={field.type === 'datetime' ? 'datetime' : 'date'}
  //               is24Hour={true}
  //               display="default"
  //               onChange={(event, date) =>
  //                 handleDateChange(event, date, field.name)
  //               }
  //             />
  //           )}
  //         </>
  //       ) : field.name === 'settlementAccountNumberHidden' ? (
  //         <TextInput
  //           style={styles.input}
  //           placeholder={field.placeholder}
  //           placeholderTextColor="#aaa"
  //           value={hiddenValue}
  //           onChangeText={value => setHiddenValue(value)} // Update state when typing
  //           secureTextEntry={true}
  //           keyboardType="numeric"
  //         />
  //       ) : field.name === 'settlementAccountNumberHidden' ? (
  //         <TextInput
  //           style={styles.input}
  //           placeholder={field.placeholder}
  //           placeholderTextColor="#aaa"
  //           value={hiddenValue}
  //           onChangeText={value => setHiddenValue(value)} // Update state when typing
  //           secureTextEntry={true}
  //           keyboardType="numeric"
  //         />
  //       ) : field.name === 'settlementAccountNumber' ? (
  //         <TextInput
  //           style={styles.input}
  //           placeholder={field.placeholder}
  //           placeholderTextColor="#aaa"
  //           value={formDetails[field.name]}
  //           onChangeText={value => handleInputChange(field.name, value)}
  //           onBlur={() => {
  //             // Check if the hidden value matches the visible value on blur
  //             if (hiddenValue && hiddenValue !== formDetails[field.name]) {
  //               Alert.alert(
  //                 'Mismatch',
  //                 'The settlement account numbers do not match. Please ensure both fields have the same value.',
  //               );
  //             }
  //           }}
  //           keyboardType="numeric"
  //         />
  //       ) : field.name === 'settlementAccountNumber' ? (
  //         <TextInput
  //           style={styles.input}
  //           placeholder={field.placeholder}
  //           placeholderTextColor="#aaa"
  //           value={formDetails[field.name]}
  //           onChangeText={value => {
  //             handleInputChange(field.name, value);

  //             // Check if the hidden value matches the visible value
  //             if (internalHiddenValue && internalHiddenValue !== value) {
  //               Alert.alert(
  //                 'Mismatch',
  //                 'The settlement account numbers do not match. Please ensure both fields have the same value.',
  //               );
  //             }
  //           }}
  //           keyboardType="numeric"
  //         />
  //       ) : field.name === 'mcc' ? (
  //         <View style={{flexDirection: 'row', alignItems: 'center'}}>
  //           <TextInput
  //             style={[styles.input, {flex: 1}]}
  //             placeholder={field.placeholder}
  //             placeholderTextColor="#aaa" // Set placeholder text color to black
  //             value={formDetails[field.name]}
  //             onChangeText={value => handleInputChange(field.name, value)}
  //           />
  //           <TouchableOpacity
  //             onPress={() => navigation.navigate('MCC Codes')}
  //             style={styles.downloadButton}>
  //             <Text style={styles.downloadButtonText}>View MCC Codes</Text>
  //           </TouchableOpacity>
  //         </View>
  //       ) : (
  //         <TextInput
  //           style={styles.input}
  //           placeholder={field.placeholder}
  //           placeholderTextColor="#aaa" // Set placeholder text color to black
  //           value={formDetails[field.name]}
  //           onChangeText={value => handleInputChange(field.name, value)}
  //           secureTextEntry={field.name === 'password'}
  //           autoCapitalize={
  //             field.name === 'pan' || field.name === 'gstNumber'
  //               ? 'characters'
  //               : 'none'
  //           }
  //           keyboardType={field.keyboardType || 'default'}
  //         />
  //       )}
  //     </View>
  //   ));
  // };

  const renderFormFields = (fields, pageIndex) => {
    return fields.map((field, index) => (
      <View key={field.name} style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>
          {field.placeholder}
          {field.mandatory && <Text style={styles.asterisk}> *</Text>}
          {field.optional && <Text style={styles.optional}>(Optional)</Text>}
        </Text>
        {field.type === 'document' ? (
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={() => handleDocumentPick(field.name)}
            accessibilityLabel={`Upload ${field.placeholder} document`}>
            <Text style={[styles.buttonText, styles.blackText]}>
              {field.name === 'panDocument' && panFileName
                ? panFileName
                : field.name === 'profilePhoto' && profilePhotoFileName
                ? profilePhotoFileName
                : field.placeholder}
            </Text>
          </TouchableOpacity>
        ) : field.type === 'dropdown' ? (
          <View style={styles.borderedPicker}>
            <Picker
              selectedValue={formDetails[field.name]}
              style={styles.input}
              onValueChange={value => handleInputChange(field.name, value)}>
              {field.options.map((option, index) => (
                <Picker.Item
                  key={index}
                  label={option.label}
                  value={option.value}
                  enabled={!option.disabled}
                />
              ))}
            </Picker>
          </View>
        ) : field.type === 'date' || field.type === 'datetime' ? (
          <>
            <TouchableOpacity
              style={styles.dateInputConatiner}
              onPress={() =>
                setDatePickerVisible(prevState => ({
                  ...prevState,
                  [field.name]: true,
                }))
              }>
              <Text style={styles.dateInput}>
                {formDetails[field.name]
                  ? new Date(formDetails[field.name]).toLocaleDateString()
                  : 'Select Date'}
              </Text>
            </TouchableOpacity>

            {datePickerVisible[field.name] && (
              <DateTimePicker
                value={selectedDate[field.name]}
                mode={field.type === 'datetime' ? 'datetime' : 'date'}
                is24Hour={true}
                display="default"
                onChange={(event, date) =>
                  handleDateChange(event, date, field.name)
                }
              />
            )}
          </>
        ) : field.name === 'settlementAccountNumberHidden' ? (
          <View style={styles.inputWithIcon}>
            <TextInput
              style={styles.input}
              placeholder={field.placeholder}
              placeholderTextColor="#aaa"
              value={hiddenValue}
              onChangeText={value => {
                setHiddenValue(value);

                // Update the match status when typing
                setIsMatch(value === formDetails.settlementAccountNumber);
              }}
              secureTextEntry={true}
              keyboardType="numeric"
            />
          </View>
        ) : field.name === 'settlementAccountNumber' ? (
          <View
            style={{
              position: 'relative',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <TextInput
              style={[styles.input, {flex: 1, paddingRight: 40}]} // Add paddingRight to make space for the image
              placeholder={field.placeholder}
              placeholderTextColor="#aaa"
              value={formDetails[field.name]}
              onChangeText={value => {
                handleInputChange(field.name, value);

                // Update the match status when typing
                setIsMatch(value === hiddenValue);
              }}
              onBlur={() => {
                if (hiddenValue && hiddenValue !== formDetails[field.name]) {
                  Alert.alert(
                    'Mismatch',
                    'The settlement account numbers do not match. Please ensure both fields have the same value.',
                  );
                }
              }}
              keyboardType="numeric"
            />
            {isMatch && formDetails[field.name] && hiddenValue && (
              <Image
                source={require('../../assets/images/verified.png')}
                style={styles.matchIcon}
              />
            )}
          </View>
        ) : field.name === 'mcc' ? (
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TextInput
              style={[styles.input, {flex: 1}]}
              placeholder={field.placeholder}
              placeholderTextColor="#aaa"
              value={formDetails[field.name]}
              onChangeText={value => handleInputChange(field.name, value)}
            />
            <TouchableOpacity
              onPress={() => navigation.navigate('MCC Codes')}
              style={styles.downloadButton}>
              <Text style={styles.downloadButtonText}>View MCC Codes</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TextInput
            style={styles.input}
            placeholder={field.placeholder}
            placeholderTextColor="#aaa"
            value={formDetails[field.name]}
            onChangeText={value => handleInputChange(field.name, value)}
            secureTextEntry={field.name === 'password'}
            autoCapitalize={
              field.name === 'pan' || field.name === 'gstNumber'
                ? 'characters'
                : 'none'
            }
            keyboardType={field.keyboardType || 'default'}
          />
        )}
      </View>
    ));
  };

  const formPages = [
    [
      {name: 'businessname', placeholder: 'Business Name', mandatory: true},

      {
        name: 'acceptanceType',
        placeholder: 'Acceptance Type',
        type: 'dropdown',
        options: [
          {label: '', value: ''},
          {label: 'Offline', value: 'OFFLINE'},
          {label: 'Online', value: 'ONLINE', disabled: true},
        ],
        mandatory: true,
      },
      {
        name: 'ownershipType',
        placeholder: 'Ownership Type',
        type: 'dropdown',
        options: [
          {label: '', value: ''},
          {label: 'Proprietary', value: 'PROPRIETARY'},
          {label: 'Partnership', value: 'PARTNERSHIP'},
          {label: 'Private', value: 'PRIVATE'},
          {label: 'Public', value: 'PUBLIC'},
          {label: 'LLP', value: 'LLP'},
          {label: 'Society', value: 'SOCIETY'},
          {label: 'Trust', value: 'TRUST'},
          {label: 'GOVT', value: 'GOVT'},
        ],
        mandatory: true,
      },
      {
        name: 'turnoverType',
        placeholder: 'Turnover Type',
        type: 'dropdown',
        options: [
          {label: '', value: ''},
          {label: 'Small', value: 'SMALL'},
          {label: 'Large', value: 'LARGE'},
        ],
        mandatory: true,
      },
      // {
      //   name: 'sellerIdentifier',
      //   placeholder: 'Seller Identifier',
      //   mandatory: true,
      // },
      {name: 'city', placeholder: 'City', mandatory: true},
    ],
    [
      {name: 'district', placeholder: 'District', mandatory: true},
      {
        name: 'stateCode',
        placeholder: 'State Code',
        type: 'dropdown',
        options: [
          {label: '', value: ''},
          {label: '01 (Jammu and Kashmir)', value: '01'},
          {label: '02 (Himachal Pradesh)', value: '02'},
          {label: '03 (Punjab)', value: '03'},
          {label: '04 (Chandigarh)', value: '04'},
          {label: '05 (Uttarakhand)', value: '05'},
          {label: '06 (Haryana)', value: '06'},
          {label: '07 (Delhi)', value: '07'},
          {label: '08 (Rajasthan)', value: '08'},
          {label: '09 (Uttar Pradesh)', value: '09'},
          {label: '10 (Bihar)', value: '10'},
          {label: '11 (Sikkim)', value: '11'},
          {label: '12 (Arunachal Pradesh)', value: '12'},
          {label: '13 (Nagaland)', value: '13'},
          {label: '14 (Manipur)', value: '14'},
          {label: '15 (Mizoram)', value: '15'},
          {label: '16 (Tripura)', value: '16'},
          {label: '17 (Meghalaya)', value: '17'},
          {label: '18 (Assam)', value: '18'},
          {label: '19 (West Bengal)', value: '19'},
          {label: '20 (Jharkhand)', value: '20'},
          {label: '21 (Odisha)', value: '21'},
          {label: '22 (Chhattisgarh)', value: '22'},
          {label: '23 (Madhya Pradesh)', value: '23'},
          {label: '24 (Gujarat)', value: '24'},
          {label: '25 (Daman and Diu)', value: '25'},
          {label: '26 (Dadra and Nagar Haveli)', value: '26'},
          {label: '27 (Maharashtra)', value: '27'},
          {label: '28 (Andhra Pradesh)', value: '28'},
          {label: '29 (Karnataka)', value: '29'},
          {label: '30 (Goa)', value: '30'},
          {label: '31 (Lakshadweep)', value: '31'},
          {label: '32 (Kerala)', value: '32'},
          {label: '33 (Tamil Nadu)', value: '33'},
          {label: '34 (Puducherry)', value: '34'},
          {label: '35 (Andaman and Nicobar Islands)', value: '35'},
          {label: '36 (Telangana)', value: '36'},
        ],
        mandatory: true,
      },
      {
        name: 'pinCode',
        placeholder: 'Pin Code',
        mandatory: true,
        keyboardType: 'numeric',
      },
      {name: 'addressLine1', placeholder: 'Address Line 1', mandatory: true},
      {name: 'addressLine2', placeholder: 'Address Line 2'},
    ],
    [
      {
        name: 'mcc',
        placeholder: 'MCC',
        mandatory: true,
        keyboardType: 'numeric',
      },
      {
        name: 'settlementAccountName',
        placeholder: 'Settlement Account Name',
        mandatory: true,
      },
      {
        name: 'settlementAccountNumberHidden',
        placeholder: 'Settlement Account Number',
        mandatory: true,

        keyboardType: 'numeric',
      },
      {
        name: 'settlementAccountNumber',
        placeholder: 'Settlement Account Number',
        mandatory: true,
        keyboardType: 'numeric',
      },
      {name: 'settlementIFSC', placeholder: 'Settlement IFSC', mandatory: true},
    ],
    [
      {name: 'udyogAadhaar', placeholder: 'Udyog Aadhaar', optional: true},
      {
        name: 'gstNumber',
        placeholder: 'GSTN Number',
        mandatory: formDetails.ownershipType !== 'PROPRIETARY',
      },
      {name: 'pan', placeholder: 'PAN Number', mandatory: true},
      {
        name: 'panDocument',
        placeholder: 'PAN Document',
        type: 'document',
        mandatory: true,
      },

      {
        name: 'emailId',
        placeholder: 'Email ID',
        // mandatory: true,
        keyboardType: 'email-address',
      },
    ],
    [
      {
        name: 'profilePhoto',
        placeholder: 'Profile Photo',
        type: 'document',
        mandatory: false,
      },
      {
        name: 'electricityBoardCode',
        placeholder: 'Electricity Board Code',
        optional: true,
      },
      {name: 'llpInOrCin', placeholder: 'LLPInOrCIN', optional: true},
      {
        name: 'doi',
        type: 'date',
        placeholder: 'Date of Incorporation',
        mandatory: formDetails.ownershipType !== 'PROPRIETARY',
      },
      {
        name: 'dob',
        type: 'date',
        placeholder: 'Date of Birth',
        mandatory: true,
      },
    ],
  ];

  const stepLabels = [
    'Business Details',
    'Business Location',
    'Bank Details',
    'KYC',
    'Additional Information',
    'Documents',
  ];

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Registration</Text>
        </View>
        <View style={styles.body}>
          <ProgressBar
            steps={stepLabels.map(label => ({label}))}
            currentStep={currentPage}
          />
          <Text style={styles.stepLabel}>{stepLabels[currentPage]}</Text>
          <View style={styles.formView}>
            {renderFormFields(formPages[currentPage], currentPage)}
          </View>
          {currentPage === formPages.length - 1 && (
            <View style={styles.checkboxContainer}>
              <View style={styles.checkboxWrapper}>
                <CheckBox
                  value={isTermsChecked}
                  onValueChange={setIsTermsChecked}
                  accessibilityLabel="Terms and Conditions Checkbox"
                  style={styles.checkbox}
                />
                <Text style={styles.beforeLinkText}>I agree to </Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate('Terms And Condition')}>
                  <Text style={styles.linkText}>Terms and Condition</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.checkboxWrapper}>
                <CheckBox
                  value={isPrivacyChecked}
                  onValueChange={setIsPrivacyChecked}
                  accessibilityLabel="Privacy Policy Checkbox"
                  style={styles.checkbox}
                />
                <Text style={styles.beforeLinkText}>Accept </Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate('Privacy Policy')}>
                  <Text style={styles.linkText}>Privacy Policy</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          <View style={styles.buttonContainer}>
            {currentPage > 0 && (
              <TouchableOpacity
                onPress={handleBack}
                style={[styles.button, styles.backButton]}>
                <Text style={styles.buttonText}>Back</Text>
              </TouchableOpacity>
            )}
            {currentPage < formPages.length - 1 ? (
              <TouchableOpacity
                onPress={handleNext}
                style={[styles.button, styles.nextButton]}>
                <Text style={styles.buttonText}>Next</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={handleContinue}
                style={[
                  styles.button,
                  styles.submitButton,
                  (!isTermsChecked || !isPrivacyChecked) &&
                    styles.disabledButton,
                ]}
                disabled={!isTermsChecked || !isPrivacyChecked}>
                <Text style={styles.buttonText}>Register</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        <AlertModal
          visible={isModalVisible}
          message="Registration successful. Please create a password for future login."
          onDismiss={() => setIsModalVisible(false)}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white', // Set background color to white
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#2058BB',
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
    width: '100%',
  },
  headerText: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },
  dateInput: {
    color: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: 'white', // Ensure inner view background is white
  },
  formView: {
    flex: 1,
    marginBottom: 20,
  },
  fieldContainer: {
    marginBottom: 15,
  },
  fieldLabel: {
    fontSize: 16,
    marginBottom: 5,
    color: '#06265F',
    fontWeight: 'bold', // or a numeric value like '400' for normal text
  },

  input: {
    height: 48, // Ensuring minimum height of 48dp for touch targets
    borderColor: 'gray',
    borderWidth: 1,
    paddingLeft: 8,
    borderRadius: 10,
    color: 'black',
  },
  dateInputConatiner: {
    height: 48, // Ensuring minimum height of 48dp for touch targets
    borderColor: 'gray',
    borderWidth: 1,
    paddingLeft: 8,
    flexDirection: 'column',
    justifyContent: 'center', // Vertically center the content
    alignItems: 'flex-start', // Horizontally align the content to the left
    borderRadius: 10,
    color: 'black',
  },
  downloadButtonText: {
    marginLeft: 10,
    backgroundColor: '#2058BB',
    borderRadius: 10,
    color: 'white',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  uploadButton: {
    height: 48, // Ensuring minimum height of 48dp for touch targets
    borderColor: 'gray',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    height: 48, // Ensuring minimum height of 48dp for touch targets
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
    borderRadius: 10,
  },
  backButton: {
    backgroundColor: 'black',
  },
  nextButton: {
    backgroundColor: '#2058BB',
  },
  submitButton: {
    backgroundColor: '#2058BB',
  },
  disabledButton: {
    backgroundColor: '#808080',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },

  borderedPicker: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    borderRadius: 4,
  },
  stepLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 5,
    marginBottom: 15,
    textAlign: 'center',
    color: 'black',
  },
  blackText: {
    color: 'black',
  },
  asterisk: {
    color: 'red',
  },
  optional: {
    fontSize: 12,
    color: 'gray',
  },
  checkboxContainer: {
    marginBottom: 10,
  },
  checkboxWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
    marginTop: -20,
  },
  checkbox: {
    width: 48,
    height: 48,
  },
  // boldText: {
  //   fontWeight: 'bold',
  // },
  // disabledText: {
  //   color: '#d3d3d3',
  // },
  linkText: {
    color: '#2058BB',
    marginLeft: 2,
  },

  beforeLinkText: {
    marginBottom: 2,
    color: 'black',
  },
  matchIcon: {
    height: 35,
    width: 35,
    position: 'absolute',
    right: 10,
    top: 5, // Adjust this value to vertically center the image within the TextInput
  },
});

export default RegistrationScreen;
