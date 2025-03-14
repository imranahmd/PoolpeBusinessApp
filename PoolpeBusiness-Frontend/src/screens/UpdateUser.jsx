// // import React, {useState, useEffect} from 'react';
// // import {
// //   View,
// //   Text,
// //   StyleSheet,
// //   TextInput,
// //   TouchableOpacity,
// //   KeyboardAvoidingView,
// //   Platform,
// //   ScrollView,
// //   Alert,
// // } from 'react-native';
// // import DocumentPicker from 'react-native-document-picker';
// // import RNFS from 'react-native-fs'; // Import react-native-fs for file operations
// // import {useDispatch} from 'react-redux';
// // import {registerUser} from '../reducers/userSlice';
// // import ProgressBar from './ProgressBar';
// // import {Picker} from '@react-native-picker/picker';
// // import CheckBox from '@react-native-community/checkbox'; // Import CheckBox component
// // import Config from 'react-native-config';

// // const UpdateUser = ({navigation, route}) => {
// //   const {mobileNumber} = route.params;
// //   const apiUrl = Config.REACT_APP_API_URL;

// //   const [formDetails, setFormDetails] = useState({
// //     sellerIdentifier: '',
// //     businessname: '',
// //     settlementAccountName: '',
// //     mobileNumber: mobileNumber,
// //     emailId: '',
// //     mcc: '',
// //     turnoverType: '', // default value
// //     acceptanceType: '', // default value
// //     ownershipType: '', // default value
// //     city: '',
// //     district: '',
// //     stateCode: '',
// //     pinCode: '',
// //     pan: '',
// //     gstNumber: '',
// //     settlementAccountNumber: '',
// //     settlementIFSC: '',
// //     latitude: 12.3456789,
// //     longitude: 98.7654321,
// //     addressLine1: '',
// //     addressLine2: '',
// //     llpInOrCin: '',
// //     udyogAadhaar: '',
// //     dob: '',
// //     doi: '',
// //     electricityBoardCode: '',
// //     apiKey: '',
// //     hash: '',
// //     qrString: '',
// //     panDocument: '',
// //     profilePhoto: '',
// //   });

// //   const [currentPage, setCurrentPage] = useState(0);
// //   const [isTermsChecked, setIsTermsChecked] = useState(false);
// //   const [isPrivacyChecked, setIsPrivacyChecked] = useState(false);
// //   const [userData, setUserData] = useState(null); // New state for storing API response data

// //   const dispatch = useDispatch();

// //   const fetchUserData = async () => {
// //     try {
// //       const response = await fetch(`${apiUrl}api/auth/getUser`, {
// //         method: 'POST',
// //         headers: {
// //           'Content-Type': 'application/json',
// //         },
// //         body: JSON.stringify({
// //           mobileNumber: mobileNumber,
// //         }),
// //       });

// //       const data = await response.json();
// //       console.log(data); // Check the structure of the response
// //       setUserData(data);

// //       setFormDetails(prevState => ({
// //         ...prevState,
// //         sellerIdentifier: data.userData.sellerIdentifier || '',
// //         businessname: data.userData.businessname || '',
// //         settlementAccountName: data.userData.settlementAccountName || '',
// //         mobileNumber: data.userData.mobileNumber || '',
// //         emailId: data.userData.emailId || '',
// //         mcc: data.userData.mcc ? data.userData.mcc.toString() : '',
// //         turnoverType: data.userData.turnoverType || '',
// //         acceptanceType: data.userData.acceptanceType || '',
// //         ownershipType: data.userData.ownershipType || '',
// //         city: data.userData.city || '',
// //         district: data.userData.district || '',
// //         stateCode: data.userData.stateCode || '',
// //         pinCode: data.userData.pinCode || '',
// //         pan: data.userData.pan || '',
// //         gstNumber: data.userData.gstNumber || '',
// //         settlementAccountNumber: data.userData.settlementAccountNumber || '',
// //         settlementIFSC: data.userData.settlementIFSC || '',
// //         latitude: data.userData.latitude || 0,
// //         longitude: data.userData.longitude || 0,
// //         addressLine1: data.userData.addressLine1 || '',
// //         addressLine2: data.userData.addressLine2 || '',
// //         llpInOrCin: data.userData.llpInOrCin || '',
// //         udyogAadhaar: data.userData.udyogAadhaar || '',
// //         dob: data.userData.dob || '',
// //         doi: data.userData.doi || '',
// //         electricityBoardCode: data.userData.electricityBoardCode || '',
// //         apiKey: data.userData.apiKey || '',
// //         hash: data.userData.hash || '',
// //         qrString: data.userData.qrString || '',
// //         panDocument: data.userData.panDocument || '',
// //         profilePhoto: data.userData.profilePhoto || '',
// //       }));
// //     } catch (error) {
// //       console.error('Error fetching user data:', error);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchUserData();
// //   }, []);

// //   const resetFormFields = () => {
// //     setFormDetails({
// //       sellerIdentifier: '',
// //       businessname: '',
// //       settlementAccountName: '',
// //       mobileNumber: '',
// //       emailId: '',
// //       mcc: '',
// //       turnoverType: '', // default value
// //       acceptanceType: '', // default value
// //       ownershipType: '', // default value
// //       city: '',
// //       district: '',
// //       stateCode: '',
// //       pinCode: '',
// //       pan: '',
// //       gstNumber: '',
// //       settlementAccountNumber: '',
// //       settlementIFSC: '',
// //       latitude: 0,
// //       longitude: 0,
// //       addressLine1: '',
// //       addressLine2: '',
// //       llpInOrCin: '',
// //       udyogAadhaar: '',
// //       dob: '',
// //       doi: '',
// //       electricityBoardCode: '',
// //       apiKey: '',
// //       hash: '',
// //       qrString: '',
// //       panDocument: '',
// //       profilePhoto: '',
// //     });
// //   };

// //   const handleInputChange = (fieldName, value) => {
// //     if (fieldName === 'profilePhoto' || fieldName === 'panDocument') {
// //       // Handle base64 encoding for file uploads
// //       handleDocumentPick(fieldName);
// //     } else {
// //       setFormDetails(prevState => ({
// //         ...prevState,
// //         [fieldName]: value,
// //       }));
// //     }
// //   };

// //   const handleDocumentPick = async fieldName => {
// //     try {
// //       const res = await DocumentPicker.pick({
// //         type: [DocumentPicker.types.allFiles],
// //       });

// //       // Read file as base64
// //       const base64Data = await RNFS.readFile(res[0].uri, 'base64');

// //       setFormDetails(prevState => ({
// //         ...prevState,
// //         [fieldName]: base64Data,
// //       }));
// //     } catch (err) {
// //       if (DocumentPicker.isCancel(err)) {
// //         console.log('User cancelled the document picker');
// //       } else {
// //         console.error('Unknown error: ', err);
// //       }
// //     }
// //   };

// //   const handleContinue = () => {
// //     if (!isTermsChecked || !isPrivacyChecked) {
// //       Alert.alert(
// //         'Error',
// //         'Please agree to the Terms and Conditions and accept the Privacy Policy before continuing.',
// //       );
// //       return;
// //     }

// //     Alert.alert('Registration successful');
// //     resetFormFields();
// //     navigation.navigate('Add Password', {
// //       mobileNumber: mobileNumber,
// //     });
// //   };

// //   const renderFormFields = (fields, pageIndex) => {
// //     return fields.map((field, index) => (
// //       <View key={field.name} style={styles.fieldContainer}>
// //         <Text style={styles.fieldLabel}>{field.placeholder}</Text>
// //         {field.type === 'document' ? (
// //           <TouchableOpacity
// //             style={styles.uploadButton}
// //             onPress={() => handleDocumentPick(field.name)}
// //             accessibilityLabel={`Upload ${field.placeholder} document`}>
// //             <Text style={[styles.buttonText, styles.blackText]}>
// //               {formDetails[field.name]
// //                 ? `Selected: ${formDetails[field.name].substring(0, 20)}...`
// //                 : field.placeholder}
// //             </Text>
// //           </TouchableOpacity>
// //         ) : field.type === 'dropdown' ? (
// //           <Picker
// //             selectedValue={formDetails[field.name]}
// //             onValueChange={value => handleInputChange(field.name, value)}
// //             style={styles.input}
// //             accessibilityLabel={`Select ${field.placeholder}`}>
// //             {field.options.map(option => (
// //               <Picker.Item key={option} label={option} value={option} />
// //             ))}
// //           </Picker>
// //         ) : (
// //           <TextInput
// //             style={styles.input}
// //             placeholder={field.placeholder}
// //             onChangeText={text => handleInputChange(field.name, text)}
// //             value={formDetails[field.name]}
// //             accessibilityLabel={`${field.placeholder} input field`}
// //           />
// //         )}
// //       </View>
// //     ));
// //   };

// //   const formPages = [
// //     [
// //       {name: 'businessname', placeholder: 'Business Name'},
// //       {
// //         name: 'acceptanceType',
// //         placeholder: 'Acceptance Type',
// //         type: 'dropdown',
// //         options: ['', , 'ONLINE', 'OFFLINE'],
// //       },
// //       {
// //         name: 'ownershipType',
// //         placeholder: 'Ownership Type',
// //         type: 'dropdown',
// //         options: [
// //           '',
// //           'PROPRIETARY',
// //           'PARTNERSHIP',
// //           'PRIVATE',
// //           'PUBLIC',
// //           'LLP',
// //           'SOCIETY',
// //           'TRUST',
// //           'GOVT',
// //         ],
// //       },
// //       {
// //         name: 'turnoverType',
// //         placeholder: 'Turnover Type',
// //         type: 'dropdown',
// //         options: ['', 'SMALL', 'LARGE'],
// //       },
// //       {name: 'sellerIdentifier', placeholder: 'Seller Identifier'},
// //     ],
// //     [
// //       {name: 'city', placeholder: 'City'},
// //       {name: 'district', placeholder: 'District'},
// //       {name: 'stateCode', placeholder: 'State Code'},
// //       {name: 'pinCode', placeholder: 'Pin Code'},
// //       {name: 'addressLine1', placeholder: 'Address Line 1'},
// //       {name: 'addressLine2', placeholder: 'Address Line 2'},
// //     ],
// //     [
// //       {name: 'mcc', placeholder: 'MCC'},
// //       {
// //         name: 'settlementAccountName',
// //         placeholder: 'Settlement Account Name',
// //       },
// //       {
// //         name: 'settlementAccountNumber',
// //         placeholder: 'Settlement Account Number',
// //       },
// //       {name: 'settlementIFSC', placeholder: 'Settlement IFSC'},
// //       {name: 'mobileNumber', placeholder: 'Mobile Number'},
// //     ],
// //     [
// //       {name: 'udyogAadhaar', placeholder: 'Udyog Aadhar'},
// //       {name: 'gstNumber', placeholder: 'GSTN Number'},
// //       {name: 'pan', placeholder: 'PAN Number'},
// //       {
// //         name: 'panDocument',
// //         placeholder: 'PAN Document',
// //         type: 'document',
// //       },
// //       {name: 'emailId', placeholder: 'Email ID'},
// //     ],
// //     [
// //       {
// //         name: 'profilePhoto',
// //         placeholder: 'Profile Photo',
// //         type: 'document',
// //       },
// //       {name: 'electricityBoardCode', placeholder: 'Electricity Board Code'},
// //       {name: 'llpInOrCin', placeholder: 'LlpInOrCin'},
// //       {name: 'doi', placeholder: 'Date of Incorporation'},
// //       {name: 'dob', placeholder: 'Date of Birth'},
// //     ],
// //   ];

// //   const stepLabels = [
// //     'Business Details',
// //     'Business Location',
// //     'Bank Details',
// //     'KYC',
// //     'Additional Information',
// //     'Documents',
// //   ];

// //   return (
// //     <KeyboardAvoidingView
// //       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
// //       style={styles.container}>
// //       <ScrollView contentContainerStyle={styles.scrollViewContent}>
// //         <View style={styles.header}>
// //           <Text style={styles.headerText}>Update My Details</Text>
// //         </View>
// //         <View style={styles.body}>
// //           <ProgressBar
// //             steps={stepLabels.map(label => ({label}))}
// //             currentStep={currentPage}
// //           />
// //           <Text style={styles.stepLabel}>{stepLabels[currentPage]}</Text>
// //           <View style={styles.formView}>
// //             {renderFormFields(formPages[currentPage], currentPage)}
// //           </View>
// //           {currentPage === formPages.length - 1 && (
// //             <View style={styles.checkboxContainer}>
// //               <View style={styles.checkboxWrapper}>
// //                 <CheckBox
// //                   value={isTermsChecked}
// //                   onValueChange={setIsTermsChecked}
// //                   accessibilityLabel="Terms and Conditions Checkbox"
// //                   style={styles.checkbox}
// //                 />
// //                 <Text style={styles.beforeLinkText}>I agree to </Text>
// //                 <TouchableOpacity
// //                   onPress={() => navigation.navigate('Terms And Condition')}>
// //                   <Text style={styles.linkText}>Terms and Condition</Text>
// //                 </TouchableOpacity>
// //               </View>
// //               <View style={styles.checkboxWrapper}>
// //                 <CheckBox
// //                   value={isPrivacyChecked}
// //                   onValueChange={setIsPrivacyChecked}
// //                   accessibilityLabel="Privacy Policy Checkbox"
// //                   style={styles.checkbox}
// //                 />
// //                 <Text style={styles.beforeLinkText}>I accept </Text>
// //                 <TouchableOpacity
// //                   onPress={() => navigation.navigate('Privacy Policy')}>
// //                   <Text style={styles.linkText}>Privacy Policy</Text>
// //                 </TouchableOpacity>
// //               </View>
// //             </View>
// //           )}
// //           <View style={styles.buttonContainer}>
// //             {currentPage > 0 && (
// //               <TouchableOpacity
// //                 onPress={() => setCurrentPage(currentPage - 1)}
// //                 style={[styles.button, styles.backButton]}>
// //                 <Text style={styles.buttonText}>Back</Text>
// //               </TouchableOpacity>
// //             )}
// //             {currentPage < formPages.length - 1 ? (
// //               <TouchableOpacity
// //                 onPress={() => setCurrentPage(currentPage + 1)}
// //                 style={[styles.button, styles.nextButton]}>
// //                 <Text style={styles.buttonText}>Next</Text>
// //               </TouchableOpacity>
// //             ) : (
// //               <TouchableOpacity
// //                 onPress={handleContinue}
// //                 style={[
// //                   styles.button,
// //                   styles.submitButton,
// //                   (!isTermsChecked || !isPrivacyChecked) &&
// //                     styles.disabledButton,
// //                 ]}
// //                 disabled={!isTermsChecked || !isPrivacyChecked}>
// //                 <Text style={styles.buttonText}>Register</Text>
// //               </TouchableOpacity>
// //             )}
// //           </View>
// //         </View>
// //       </ScrollView>
// //     </KeyboardAvoidingView>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     backgroundColor: 'white', // Set background color to white
// //   },
// //   scrollViewContent: {
// //     flexGrow: 1,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },
// //   header: {
// //     backgroundColor: '#2058BB',
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     height: 60,
// //     width: '100%',
// //   },
// //   headerText: {
// //     color: 'white',
// //     fontSize: 20,
// //     fontWeight: 'bold',
// //   },
// //   body: {
// //     flex: 1,
// //     padding: 20,
// //     justifyContent: 'center',
// //     backgroundColor: 'white', // Ensure inner view background is white
// //   },
// //   formView: {
// //     flex: 1,
// //     marginBottom: 20,
// //   },
// //   fieldContainer: {
// //     marginBottom: 15,
// //   },
// //   fieldLabel: {
// //     fontSize: 16,
// //     marginBottom: 5,
// //     color: 'black',
// //   },
// //   input: {
// //     height: 48, // Ensuring minimum height of 48dp for touch targets
// //     borderColor: 'gray',
// //     borderWidth: 1,
// //     paddingLeft: 8,
// //     borderRadius: 10,
// //     color: 'black',
// //   },
// //   uploadButton: {
// //     height: 48, // Ensuring minimum height of 48dp for touch targets
// //     borderColor: 'gray',
// //     borderWidth: 1,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     borderRadius: 10,
// //   },
// //   buttonContainer: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //   },
// //   button: {
// //     height: 48, // Ensuring minimum height of 48dp for touch targets
// //     flex: 1,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     marginHorizontal: 5,
// //     borderRadius: 10,
// //   },
// //   backButton: {
// //     backgroundColor: 'black',
// //   },
// //   nextButton: {
// //     backgroundColor: '#2058BB',
// //   },
// //   submitButton: {
// //     backgroundColor: '#2058BB',
// //   },
// //   disabledButton: {
// //     backgroundColor: '#808080',
// //   },
// //   buttonText: {
// //     color: '#FFFFFF',
// //     fontSize: 16,
// //   },
// //   stepLabel: {
// //     fontSize: 20,
// //     fontWeight: 'bold',
// //     marginTop: 5,
// //     marginBottom: 15,
// //     textAlign: 'center',
// //     color: 'black',
// //   },
// //   blackText: {
// //     color: 'black',
// //   },
// //   checkboxContainer: {
// //     marginBottom: 10,
// //   },
// //   checkboxWrapper: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     marginBottom: 2,
// //     marginTop: -20,
// //   },
// //   checkbox: {
// //     width: 48,
// //     height: 48,
// //   },
// //   linkText: {
// //     color: '#2058BB',
// //     marginLeft: 2,
// //   },
// //   beforeLinkText: {
// //     marginBottom: 2,
// //   },
// // });

// // export default UpdateUser;



// import React, {useState, useEffect} from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TextInput,
//   TouchableOpacity,
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
//   Alert,
//   Image,
// } from 'react-native';
// import DocumentPicker from 'react-native-document-picker';
// import RNFS from 'react-native-fs'; // Import react-native-fs for file operations
// import {useDispatch} from 'react-redux';
// import {registerUser} from '../reducers/userSlice';
// import ProgressBar from './ProgressBar';
// import {Picker} from '@react-native-picker/picker';
// import CheckBox from '@react-native-community/checkbox'; // Import CheckBox component
// import Config from 'react-native-config';
// import Pdf from 'react-native-pdf'; // Import react-native-pdf for displaying PDFs

// const UpdateUser = ({navigation, route}) => {
//   const {mobileNumber} = route.params;
//   const apiUrl = Config.REACT_APP_API_URL;

//   const [formDetails, setFormDetails] = useState({
//     sellerIdentifier: '',
//     businessname: '',
//     settlementAccountName: '',
//     mobileNumber: mobileNumber,
//     emailId: '',
//     mcc: '',
//     turnoverType: '', // default value
//     acceptanceType: '', // default value
//     ownershipType: '', // default value
//     city: '',
//     district: '',
//     stateCode: '',
//     pinCode: '',
//     pan: '',
//     gstNumber: '',
//     settlementAccountNumber: '',
//     settlementIFSC: '',
//     latitude: 12.3456789,
//     longitude: 98.7654321,
//     addressLine1: '',
//     addressLine2: '',
//     llpInOrCin: '',
//     udyogAadhaar: '',
//     dob: '',
//     doi: '',
//     electricityBoardCode: '',
//     apiKey: '',
//     hash: '',
//     qrString: '',
//     panDocument: '',
//     profilePhoto: '',
//   });

//   const [currentPage, setCurrentPage] = useState(0);
//   const [isTermsChecked, setIsTermsChecked] = useState(false);
//   const [isPrivacyChecked, setIsPrivacyChecked] = useState(false);
//   const [userData, setUserData] = useState(null); // New state for storing API response data

//   const dispatch = useDispatch();

//   const fetchUserData = async () => {
//     try {
//       const response = await fetch(`${apiUrl}api/auth/getUser`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           mobileNumber: mobileNumber,
//         }),
//       });

//       const data = await response.json();
//       console.log(data); // Check the structure of the response
//       setUserData(data);

//       setFormDetails(prevState => ({
//         ...prevState,
//         sellerIdentifier: data.userData.sellerIdentifier || '',
//         businessname: data.userData.businessname || '',
//         settlementAccountName: data.userData.settlementAccountName || '',
//         mobileNumber: data.userData.mobileNumber || '',
//         emailId: data.userData.emailId || '',
//         mcc: data.userData.mcc ? data.userData.mcc.toString() : '',
//         turnoverType: data.userData.turnoverType || '',
//         acceptanceType: data.userData.acceptanceType || '',
//         ownershipType: data.userData.ownershipType || '',
//         city: data.userData.city || '',
//         district: data.userData.district || '',
//         stateCode: data.userData.stateCode || '',
//         pinCode: data.userData.pinCode || '',
//         pan: data.userData.pan || '',
//         gstNumber: data.userData.gstNumber || '',
//         settlementAccountNumber: data.userData.settlementAccountNumber || '',
//         settlementIFSC: data.userData.settlementIFSC || '',
//         latitude: data.userData.latitude || 0,
//         longitude: data.userData.longitude || 0,
//         addressLine1: data.userData.addressLine1 || '',
//         addressLine2: data.userData.addressLine2 || '',
//         llpInOrCin: data.userData.llpInOrCin || '',
//         udyogAadhaar: data.userData.udyogAadhaar || '',
//         dob: data.userData.dob || '',
//         doi: data.userData.doi || '',
//         electricityBoardCode: data.userData.electricityBoardCode || '',
//         apiKey: data.userData.apiKey || '',
//         hash: data.userData.hash || '',
//         qrString: data.userData.qrString || '',
//         panDocument: data.userData.panDocument || '',
//         profilePhoto: data.userData.profilePhoto || '',
//       }));
//     } catch (error) {
//       console.error('Error fetching user data:', error);
//     }
//   };

//   useEffect(() => {
//     fetchUserData();
//   }, []);

//   const resetFormFields = () => {
//     setFormDetails({
//       sellerIdentifier: '',
//       businessname: '',
//       settlementAccountName: '',
//       mobileNumber: '',
//       emailId: '',
//       mcc: '',
//       turnoverType: '', // default value
//       acceptanceType: '', // default value
//       ownershipType: '', // default value
//       city: '',
//       district: '',
//       stateCode: '',
//       pinCode: '',
//       pan: '',
//       gstNumber: '',
//       settlementAccountNumber: '',
//       settlementIFSC: '',
//       latitude: 0,
//       longitude: 0,
//       addressLine1: '',
//       addressLine2: '',
//       llpInOrCin: '',
//       udyogAadhaar: '',
//       dob: '',
//       doi: '',
//       electricityBoardCode: '',
//       apiKey: '',
//       hash: '',
//       qrString: '',
//       panDocument: '',
//       profilePhoto: '',
//     });
//   };

//   const handleInputChange = (fieldName, value) => {
//     if (fieldName === 'profilePhoto' || fieldName === 'panDocument') {
//       // Handle base64 encoding for file uploads
//       handleDocumentPick(fieldName);
//     } else {
//       setFormDetails(prevState => ({
//         ...prevState,
//         [fieldName]: value,
//       }));
//     }
//   };

//   const handleDocumentPick = async fieldName => {
//     try {
//       const res = await DocumentPicker.pick({
//         type: [DocumentPicker.types.allFiles],
//       });

//       // Read file as base64
//       const base64Data = await RNFS.readFile(res[0].uri, 'base64');

//       setFormDetails(prevState => ({
//         ...prevState,
//         [fieldName]: base64Data,
//       }));
//     } catch (err) {
//       if (DocumentPicker.isCancel(err)) {
//         console.log('User cancelled the document picker');
//       } else {
//         console.error('Unknown error: ', err);
//       }
//     }
//   };

//   const handleContinue = () => {
//     if (!isTermsChecked || !isPrivacyChecked) {
//       Alert.alert(
//         'Error',
//         'Please agree to the Terms and Conditions and accept the Privacy Policy before continuing.',
//       );
//       return;
//     }

//     Alert.alert('Registration successful');
//     resetFormFields();
//     navigation.navigate('Add Password', {
//       mobileNumber: mobileNumber,
//     });
//   };

//   const renderDocumentPreview = (fieldName, mimeType) => {
//     if (mimeType.startsWith('image/')) {
//       return (
//         <Image
//           source={{uri: `data:${mimeType};base64,${formDetails[fieldName]}`}}
//           style={styles.imagePreview}
//         />
//       );
//     } else if (mimeType === 'application/pdf') {
//       return (
//         <Pdf
//           source={{
//             uri: `data:application/pdf;base64,${formDetails[fieldName]}`,
//           }}
//           style={styles.pdfPreview}
//         />
//       );
//     } else {
//       return null;
//     }
//   };

//   const renderFormFields = (fields, pageIndex) => {
//     return fields.map((field, index) => (
//       <View key={field.name} style={styles.fieldContainer}>
//         <Text style={styles.fieldLabel}>{field.placeholder}</Text>
//         {field.type === 'document' ? (
//           <View>
//             <TouchableOpacity
//               style={styles.uploadButton}
//               onPress={() => handleDocumentPick(field.name)}
//               accessibilityLabel={`Upload ${field.placeholder} document`}>
//               <Text style={[styles.buttonText, styles.blackText]}>
//                 {formDetails[field.name]
//                   ? `Selected: ${formDetails[field.name].substring(0, 20)}...`
//                   : field.placeholder}
//               </Text>
//             </TouchableOpacity>
//             {formDetails[field.name] && renderDocumentPreview(field.name, field.mimeType)}
//           </View>
//         ) : field.type === 'dropdown' ? (
//           <Picker
//             selectedValue={formDetails[field.name]}
//             onValueChange={value => handleInputChange(field.name, value)}
//             style={styles.input}
//             accessibilityLabel={`Select ${field.placeholder}`}>
//             {field.options.map(option => (
//               <Picker.Item key={option} label={option} value={option} />
//             ))}
//           </Picker>
//         ) : (
//           <TextInput
//             style={styles.input}
//             placeholder={field.placeholder}
//             onChangeText={text => handleInputChange(field.name, text)}
//             value={formDetails[field.name]}
//             accessibilityLabel={field.placeholder}
//             keyboardType={field.keyboardType || 'default'}
//           />
//         )}
//       </View>
//     ));
//   };

//   const formFields = [
//     [
//       {name: 'businessname', placeholder: 'Business Name'},
//       {name: 'settlementAccountName', placeholder: 'Settlement Account Name'},
//       {name: 'mobileNumber', placeholder: 'Mobile Number'},
//       {name: 'emailId', placeholder: 'Email ID'},
//       {name: 'mcc', placeholder: 'MCC'},
//       {
//         name: 'turnoverType',
//         placeholder: 'Turnover Type',
//         type: 'dropdown',
//         options: ['Option 1', 'Option 2', 'Option 3'],
//       },
//       {
//         name: 'acceptanceType',
//         placeholder: 'Acceptance Type',
//         type: 'dropdown',
//         options: ['Option 1', 'Option 2', 'Option 3'],
//       },
//       {
//         name: 'ownershipType',
//         placeholder: 'Ownership Type',
//         type: 'dropdown',
//         options: ['Option 1', 'Option 2', 'Option 3'],
//       },
//     ],
//     [
//       {name: 'city', placeholder: 'City'},
//       {name: 'district', placeholder: 'District'},
//       {name: 'stateCode', placeholder: 'State Code'},
//       {name: 'pinCode', placeholder: 'Pin Code'},
//       {name: 'pan', placeholder: 'PAN'},
//       {name: 'gstNumber', placeholder: 'GST Number'},
//       {name: 'settlementAccountNumber', placeholder: 'Settlement Account Number'},
//       {name: 'settlementIFSC', placeholder: 'Settlement IFSC'},
//     ],
//     [
//       {name: 'latitude', placeholder: 'Latitude'},
//       {name: 'longitude', placeholder: 'Longitude'},
//       {name: 'addressLine1', placeholder: 'Address Line 1'},
//       {name: 'addressLine2', placeholder: 'Address Line 2'},
//       {name: 'llpInOrCin', placeholder: 'LLP In or CIN'},
//       {name: 'udyogAadhaar', placeholder: 'Udyog Aadhaar'},
//       {name: 'dob', placeholder: 'Date of Birth'},
//       {name: 'doi', placeholder: 'Date of Incorporation'},
//     ],
//     [
//       {name: 'electricityBoardCode', placeholder: 'Electricity Board Code'},
//       {name: 'apiKey', placeholder: 'API Key'},
//       {name: 'hash', placeholder: 'Hash'},
//       {name: 'qrString', placeholder: 'QR String'},
//       {name: 'panDocument', placeholder: 'Upload PAN Document', type: 'document', mimeType: 'application/pdf'},
//       {name: 'profilePhoto', placeholder: 'Upload Profile Photo', type: 'document', mimeType: 'image/jpeg'},
//     ],
//   ];

//   const handleNextPage = () => {
//     if (currentPage < formFields.length - 1) {
//       setCurrentPage(currentPage + 1);
//     } else {
//       handleContinue();
//     }
//   };

//   const handlePreviousPage = () => {
//     if (currentPage > 0) {
//       setCurrentPage(currentPage - 1);
//     }
//   };

//   return (
//     <KeyboardAvoidingView
//       style={styles.container}
//       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
//       <ScrollView contentContainerStyle={styles.scrollContainer}>
//         <View style={styles.headerContainer}>
//           <Text style={styles.headerText}>Update User</Text>
//         </View>
//         <View style={styles.progressBarContainer}>
//           <ProgressBar
//             steps={formFields.length}
//             currentStep={currentPage + 1}
//           />
//         </View>
//         <View style={styles.formContainer}>
//           {renderFormFields(formFields[currentPage], currentPage)}
//           <View style={styles.checkboxContainer}>
//             <CheckBox
//               value={isTermsChecked}
//               onValueChange={setIsTermsChecked}
//               style={styles.checkbox}
//             />
//             <Text style={styles.checkboxLabel}>I agree to the Terms and Conditions</Text>
//           </View>
//           <View style={styles.checkboxContainer}>
//             <CheckBox
//               value={isPrivacyChecked}
//               onValueChange={setIsPrivacyChecked}
//               style={styles.checkbox}
//             />
//             <Text style={styles.checkboxLabel}>I accept the Privacy Policy</Text>
//           </View>
//           <View style={styles.buttonContainer}>
//             {currentPage > 0 && (
//               <TouchableOpacity
//                 style={[styles.button, styles.backButton]}
//                 onPress={handlePreviousPage}
//                 accessibilityLabel="Go to previous page">
//                 <Text style={styles.buttonText}>Back</Text>
//               </TouchableOpacity>
//             )}
//             <TouchableOpacity
//               style={styles.button}
//               onPress={handleNextPage}
//               accessibilityLabel="Go to next page or submit">
//               <Text style={styles.buttonText}>
//                 {currentPage === formFields.length - 1 ? 'Submit' : 'Next'}
//               </Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </ScrollView>
//     </KeyboardAvoidingView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   scrollContainer: {
//     flexGrow: 1,
//     justifyContent: 'center',
//   },
//   headerContainer: {
//     alignItems: 'center',
//     padding: 20,
//   },
//   headerText: {
//     fontSize: 24,
//     fontWeight: 'bold',
//   },
//   progressBarContainer: {
//     marginVertical: 20,
//     paddingHorizontal: 20,
//   },
//   formContainer: {
//     paddingHorizontal: 20,
//   },
//   fieldContainer: {
//     marginBottom: 20,
//   },
//   fieldLabel: {
//     fontSize: 16,
//     marginBottom: 5,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 5,
//     padding: 10,
//     fontSize: 16,
//   },
//   checkboxContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginVertical: 10,
//   },
//   checkbox: {
//     marginRight: 10,
//   },
//   checkboxLabel: {
//     fontSize: 16,
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   button: {
//     backgroundColor: '#007bff',
//     padding: 15,
//     borderRadius: 5,
//     alignItems: 'center',
//     justifyContent: 'center',
//     flex: 1,
//     marginHorizontal: 5,
//   },
//   backButton: {
//     backgroundColor: '#6c757d',
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   blackText: {
//     color: '#000',
//   },
//   uploadButton: {
//     backgroundColor: '#ccc',
//     padding: 10,
//     borderRadius: 5,
//     alignItems: 'center',
//     marginTop: 5,
//   },
//   imagePreview: {
//     width: 100,
//     height: 100,
//     marginTop: 10,
//   },
//   pdfPreview: {
//     width: '100%',
//     height: 200,
//     marginTop: 10,
//   },
// });

// export default UpdateUser;

