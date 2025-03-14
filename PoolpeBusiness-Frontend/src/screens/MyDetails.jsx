// import React, {useState, useEffect, useCallback} from 'react';
// import {
//   View,
//   Text,
//   ActivityIndicator,
//   ScrollView,
//   StyleSheet,
//   BackHandler,
//   TouchableOpacity,
//   Image,
// } from 'react-native';
// import {Buffer} from 'buffer';
// import Config from 'react-native-config';
// import {useFocusEffect} from '@react-navigation/native';

// const MyDetails = ({route, navigation}) => {
//   const [merchantDetails, setMerchantDetails] = useState(null);
//   const [userImage, setUserImage] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const {mobileNumber, approved} = route.params;
//   const apiUrl = Config.REACT_APP_API_URL;

//   useEffect(() => {
//     const fetchMerchantDetails = async () => {
//       try {
//         const response = await fetch(`${apiUrl}api/auth/getUser`, {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({
//             mobileNumber: mobileNumber,
//           }),
//         });

//         if (!response.ok) {
//           throw new Error('Failed to fetch data');
//         }

//         const data = await response.json();
//         const base64Flag = 'data:image/jpeg;base64,';
//         const imageStr = Buffer.from(data.userData.profilePhoto.data).toString(
//           'base64',
//         );
//         // console.log("from account",data.userData.profilePhoto.data)
//         setUserImage(base64Flag + imageStr);
//         setMerchantDetails(data.userData); // Assuming 'userData' contains the merchant details
//         setLoading(false);
//       } catch (error) {
//         console.error('Error fetching merchant details:', error);
//         setLoading(false);
//       }
//     };

//     fetchMerchantDetails();
//   }, [mobileNumber]);

//   useFocusEffect(
//     useCallback(() => {
//       const onBackPress = () => {
//         navigation.goBack();
//         return true; // Prevent default behavior
//       };

//       BackHandler.addEventListener('hardwareBackPress', onBackPress);

//       return () =>
//         BackHandler.removeEventListener('hardwareBackPress', onBackPress);
//     }, [navigation]),
//   );

//   if (loading) {
//     return (
//       <View style={styles.container}>
//         <ActivityIndicator size="large" color="#0000ff" />
//       </View>
//     );
//   }

//   const handleUpdatePassword = () => {
//     navigation.navigate('Update Password', {mobileNumber, approved});
//   };

//   if (!merchantDetails) {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.noDetailsText}>
//           No details found for mobile number: {mobileNumber}
//         </Text>
//       </View>
//     );
//   }

//   const capitalizeWords = str => {
//     return str.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <TouchableOpacity
//           onPress={() => navigation.goBack()}
//           accessible={true}
//           accessibilityLabel="Go back"
//           style={styles.backButton} // Added this line to apply the new styles
//         >
//           <Image
//             source={require('../../assets/images/backArrow.png')}
//             style={styles.backArrow}
//           />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Account</Text>
//       </View>

//       <ScrollView style={styles.scrollView}>
//         <View style={styles.topSectionContainer}>
//           <View style={styles.topSection}>
//             <Image
//               source={
//                 userImage?.startsWith('data:image/jpeg;base64,') &&
//                 userImage.length > 'data:image/jpeg;base64,'.length
//                   ? {uri: userImage}
//                   : require('../../assets/images/user.png')
//               }
//               style={styles.profileImage}
//             />
//             <View style={styles.nameContainer}>
//               <Text style={styles.topSectionName}>
//                 {capitalizeWords(merchantDetails.businessname)}
//               </Text>
//               <Text style={styles.topSectionId}>
//                 Merchant ID: {merchantDetails.id}
//               </Text>
//             </View>
//           </View>
//           <TouchableOpacity onPress={() => handleUpdatePassword()}>
//             <View style={styles.passwordUpdate}>
//               <Image
//                 style={styles.passwordImage}
//                 source={require('../../assets/images/lock_reset.png')}
//               />
//               <Text style={styles.passwordUpdateText}>Update Password</Text>
//             </View>
//           </TouchableOpacity>
//         </View>

//         <View>
//           <View style={styles.tableContainer}>
//             <Text style={styles.containerLabel}>Personal Information</Text>
//             <View style={styles.row}>
//               <Text style={styles.label}>Date of Birth:</Text>
//               <Text style={styles.value}>{merchantDetails.dob}</Text>
//             </View>
//             <View style={styles.row}>
//               <Text style={styles.label}>PAN:</Text>
//               <Text style={styles.value}>{merchantDetails.pan}</Text>
//             </View>
//           </View>
//           <View style={styles.tableContainer}>
//             <Text style={styles.containerLabel}>Business Information</Text>

//             <View style={styles.row}>
//               <Text style={styles.label}>Business Name:</Text>
//               <Text style={styles.value}>
//                 {capitalizeWords(merchantDetails.businessname)}
//               </Text>
//             </View>
//             <View style={styles.row}>
//               <Text style={styles.label}>Seller Identifier:</Text>
//               <Text style={styles.value}>
//                 {merchantDetails.sellerIdentifier}
//               </Text>
//             </View>
//             <View style={styles.row}>
//               <Text style={styles.label}>GST Number:</Text>
//               <Text style={styles.value}>
//                 {merchantDetails.gstNumber || 'N/A'}
//               </Text>
//             </View>
//             <View style={styles.row}>
//               <Text style={styles.label}>MCC:</Text>
//               <Text style={styles.value}>{merchantDetails.mcc}</Text>
//             </View>
//             <View style={styles.row}>
//               <Text style={styles.label}>Turnover Type:</Text>
//               <Text style={styles.value}>
//                 {capitalizeWords(merchantDetails.turnoverType)}
//               </Text>
//             </View>
//             <View style={styles.row}>
//               <Text style={styles.label}>Acceptance Type:</Text>
//               <Text style={styles.value}>
//                 {capitalizeWords(merchantDetails.acceptanceType)}
//               </Text>
//             </View>

//             <View style={styles.row}>
//               <Text style={styles.label}>Ownership Type:</Text>
//               <Text style={styles.value}>
//                 {capitalizeWords(merchantDetails.ownershipType)}
//               </Text>
//             </View>
//             <View style={styles.row}>
//               <Text style={styles.label}>LLP In or Cin:</Text>
//               <Text style={styles.value}>
//                 {merchantDetails.llpInOrCin || 'N/A'}
//               </Text>
//             </View>

//             <View style={styles.row}>
//               <Text style={styles.label}>Udyog Aadhaar:</Text>
//               <Text style={styles.value}>
//                 {merchantDetails.udyogAadhaar || 'N/A'}
//               </Text>
//             </View>
//             <View style={styles.row}>
//               <Text style={styles.label}>Date of Incorporation:</Text>
//               <Text style={styles.value}>{merchantDetails.doi || 'N/A'}</Text>
//             </View>
//             <View style={styles.row}>
//               <Text style={styles.label}>Electricity Board Code:</Text>
//               <Text style={styles.value}>
//                 {merchantDetails.electricityBoardCode || 'N/A'}
//               </Text>
//             </View>
//           </View>
//           <View style={styles.tableContainer}>
//             <Text style={styles.containerLabel}>Contact Information</Text>
//             <View style={styles.row}>
//               <Text style={styles.label}>Mobile Number:</Text>
//               <Text style={styles.value}>{merchantDetails.mobileNumber}</Text>
//             </View>
//             <View style={styles.row}>
//               <Text style={styles.label}>Email ID:</Text>
//               <Text style={styles.value}>{merchantDetails.emailId}</Text>
//             </View>
//             <View style={styles.row}>
//               <Text style={styles.label}>Address Line 1:</Text>
//               <Text style={styles.value}>{merchantDetails.addressLine1}</Text>
//             </View>
//             <View style={styles.row}>
//               <Text style={styles.label}>Address Line 2:</Text>
//               <Text style={styles.value}>
//                 {merchantDetails.addressLine2 || 'N/A'}
//               </Text>
//             </View>

//             <View style={styles.row}>
//               <Text style={styles.label}>City:</Text>
//               <Text style={styles.value}>{merchantDetails.city}</Text>
//             </View>
//             <View style={styles.row}>
//               <Text style={styles.label}>District:</Text>
//               <Text style={styles.value}>{merchantDetails.district}</Text>
//             </View>
//             <View style={styles.row}>
//               <Text style={styles.label}>State Code:</Text>
//               <Text style={styles.value}>{merchantDetails.stateCode}</Text>
//             </View>
//             <View style={styles.row}>
//               <Text style={styles.label}>Pin Code:</Text>
//               <Text style={styles.value}>{merchantDetails.pinCode}</Text>
//             </View>
//           </View>

//           <View style={styles.tableContainer}>
//             <Text style={styles.containerLabel}>
//               Settlement Account Information
//             </Text>
//             <View style={styles.row}>
//               <Text style={styles.label}>Settlement Account Name:</Text>
//               <Text style={styles.value}>
//                 {capitalizeWords(merchantDetails.settlementAccountName)}
//               </Text>
//             </View>

//             <View style={styles.row}>
//               <Text style={styles.label}>Settlement Account Number:</Text>
//               <Text style={styles.value}>
//                 {merchantDetails.settlementAccountNumber}
//               </Text>
//             </View>
//             <View style={styles.row}>
//               <Text style={styles.label}>Settlement IFSC:</Text>
//               <Text style={styles.value}>{merchantDetails.settlementIFSC}</Text>
//             </View>
//           </View>
//         </View>
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F0F4FA',
//     marginBottom: 10,
//   },
//   header: {
//     backgroundColor: '#2058BB',
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 10,
//     paddingVertical: 10,
//   },
//   backButton: {
//     width: 48, // Increased width for larger touch target
//     height: 48, // Increased height for larger touch target
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   backArrow: {
//     width: 20,
//     height: 20,
//     tintColor: '#fff',
//   },
//   headerTitle: {
//     color: 'white',
//     fontSize: 22,
//     fontWeight: 'bold',
//   },
//   scrollView: {
//     paddingHorizontal: 20,
//   },
//   topSectionContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   topSection: {
//     flexDirection: 'row',
//     marginBottom: 10,
//     marginTop: 10,
//   },
//   nameContainer: {
//     flexDirection: 'column',
//     justifyContent: 'center',
//     alignItems: 'left',
//     marginLeft: 15,
//     marginTop: 8,
//   },
//   topSectionName: {
//     fontWeight: 'bold',
//     color: '#37474F',
//     fontSize: 16,
//     marginBottom: 2,
//   },
//   topSectionId: {
//     fontSize: 13,
//     color: '#000000',
//   },

//   passwordUpdate: {
//     flexDirection: 'row',
//     backgroundColor: '#2058BB',
//     justifyContent: 'center',
//     alignItems: 'center',
//     height: 40,
//     paddingHorizontal: 15,
//     borderRadius: 10,
//   },
//   passwordImage: {
//     height: 20,
//     width: 20,
//     marginHorizontal: 4,
//     borderRadius: 50,
//   },
//   passwordUpdateText: {
//     fontSize: 12,
//     color: 'white',
//     fontWeight: 'bold',
//   },
//   profileImage: {
//     width: 50,
//     height: 50,
//     borderRadius: 40,
//     borderColor: '#2058BB',
//     borderWidth: 1,
//     marginTop: 10,
//     padding: 10,
//   },
//   idvalue: {
//     flex: 1,
//   },
//   tableContainer: {
//     marginTop: 10,
//     borderWidth: 1,
//     borderColor: '#fff',
//     borderRadius: 15,
//     padding: 10,
//     backgroundColor: '#fff',
//   },
//   containerLabel: {
//     color: '#2058BB',
//     fontWeight: 'bold',
//     fontSize: 15,
//     marginBottom: 12,
//   },
//   row: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 8,
//   },
//   label: {
//     // fontWeight: 'bold',
//     marginRight: 5,
//     flex: 1,
//     fontSize: 14,
//     color: 'rgba(55, 71, 79, 0.60)', // Ensure label text is black
//   },
//   value: {
//     flex: 2,
//     fontSize: 14,
//     flexWrap: 'wrap',
//     color: 'black', // Ensure value text is black
//   },
//   noDetailsText: {
//     textAlign: 'center',
//     marginTop: 20,
//     color: 'black', // Ensure text is black
//   },
// });

// export default MyDetails;

// import React, {useState, useEffect, useCallback} from 'react';
// import {
//   View,
//   Text,
//   ActivityIndicator,
//   ScrollView,
//   StyleSheet,
//   BackHandler,
//   TouchableOpacity,
//   Image,
//   TextInput,
// } from 'react-native';
// import {Buffer} from 'buffer';
// import Config from 'react-native-config';
// import {useFocusEffect} from '@react-navigation/native';
// import axios from 'axios';

// const MyDetails = ({route, navigation}) => {
//   const [merchantDetails, setMerchantDetails] = useState(null);
//   const [userImage, setUserImage] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [editingField, setEditingField] = useState(null);
//   const [updatedValue, setUpdatedValue] = useState('');
//   const {mobileNumber, approved} = route.params;
//   const apiUrl = Config.REACT_APP_API_URL;

//   useEffect(() => {
//     const fetchMerchantDetails = async () => {
//       try {
//         const response = await fetch(`${apiUrl}api/auth/getUser`, {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({
//             mobileNumber: mobileNumber,
//           }),
//         });

//         if (!response.ok) {
//           throw new Error('Failed to fetch data');
//         }

//         const data = await response.json();
//         const base64Flag = 'data:image/jpeg;base64,';
//         const imageStr = Buffer.from(data.userData.profilePhoto.data).toString(
//           'base64',
//         );
//         setUserImage(base64Flag + imageStr);
//         setMerchantDetails(data.userData);
//         setLoading(false);
//       } catch (error) {
//         console.error('Error fetching merchant details:', error);
//         setLoading(false);
//       }
//     };

//     fetchMerchantDetails();
//   }, [mobileNumber]);

//   useFocusEffect(
//     useCallback(() => {
//       const onBackPress = () => {
//         navigation.goBack();
//         return true;
//       };

//       BackHandler.addEventListener('hardwareBackPress', onBackPress);

//       return () =>
//         BackHandler.removeEventListener('hardwareBackPress', onBackPress);
//     }, [navigation]),
//   );

//   const handleUpdate = async field => {
//     try {
//       const updatedDetails = {[field]: updatedValue}; // Only send the updated field

//       console.log('Updated Details:', updatedDetails);
//       console.log('Mobile Number:', mobileNumber);

//       const response = await axios.put(
//         `${apiUrl}api/auth/users/${mobileNumber}`,
//         updatedDetails,
//         {
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         },
//       );

//       console.log('Response Status:', response.status);
//       console.log('Response Data:', response.data);

//       setMerchantDetails(prevDetails => ({
//         ...prevDetails,
//         [field]: updatedValue,
//       }));
//       setEditingField(null);
//       setUpdatedValue('');
//     } catch (error) {
//       if (error.response) {
//         console.log('Error Status:', error.response.status);
//         console.log('Error Data:', error.response.data);
//         alert('Error updating details. Please try again.');
//       } else if (error.request) {
//         console.log('No response received:', error.request);
//         alert('No response from the server. Please try again later.');
//       } else {
//         console.log('Error setting up request:', error.message);
//         alert('An error occurred. Please try again later.');
//       }
//     }
//   };

//   if (loading) {
//     return (
//       <View style={styles.container}>
//         <ActivityIndicator size="large" color="#0000ff" />
//       </View>
//     );
//   }

//   const handleUpdatePassword = () => {
//     navigation.navigate('Update Password', {mobileNumber, approved});
//   };

//   const capitalizeWords = str => {
//     return str.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
//   };

//   const renderEditableField = (field, value, label) => {
//     return (
//       <View style={styles.row}>
//         <Text style={styles.label}>{label}:</Text>
//         {editingField === field ? (
//           <View style={styles.editContainer}>
//             <TextInput
//               style={styles.editInput}
//               value={updatedValue}
//               onChangeText={setUpdatedValue}
//               autoFocus
//             />
//             <TouchableOpacity
//               style={styles.saveButton}
//               onPress={() => handleUpdate(field)}>
//               <Text style={styles.saveButtonText}>Save</Text>
//             </TouchableOpacity>
//           </View>
//         ) : (
//           <>
//             <Text style={styles.value}>{value}</Text>
//             <TouchableOpacity
//               onPress={() => {
//                 setEditingField(field);
//                 setUpdatedValue(value);
//               }}>
//               <Image
//                 source={require('../../assets/images/edit_icon.png')}
//                 style={styles.editIcon}
//               />
//             </TouchableOpacity>
//           </>
//         )}
//       </View>
//     );
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <TouchableOpacity
//           onPress={() => navigation.goBack()}
//           accessible={true}
//           accessibilityLabel="Go back"
//           style={styles.backButton}>
//           <Image
//             source={require('../../assets/images/backArrow.png')}
//             style={styles.backArrow}
//           />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Account</Text>
//       </View>

//       <ScrollView style={styles.scrollView}>
//         <View style={styles.topSectionContainer}>
//           <View style={styles.topSection}>
//             <Image
//               source={
//                 userImage?.startsWith('data:image/jpeg;base64,') &&
//                 userImage.length > 'data:image/jpeg;base64,'.length
//                   ? {uri: userImage}
//                   : require('../../assets/images/user.png')
//               }
//               style={styles.profileImage}
//             />
//             <View style={styles.nameContainer}>
//               <Text style={styles.topSectionName}>
//                 {capitalizeWords(merchantDetails.businessname)}
//               </Text>
//               <Text style={styles.topSectionId}>
//                 Merchant ID: {merchantDetails.id}
//               </Text>
//             </View>
//           </View>
//           <TouchableOpacity onPress={handleUpdatePassword}>
//             <View style={styles.passwordUpdate}>
//               <Image
//                 style={styles.passwordImage}
//                 source={require('../../assets/images/lock_reset.png')}
//               />
//               <Text style={styles.passwordUpdateText}>Update Password</Text>
//             </View>
//           </TouchableOpacity>
//         </View>

//         <View>
//           <View style={styles.tableContainer}>
//             <Text style={styles.containerLabel}>Personal Information</Text>
//             {renderEditableField('dob', merchantDetails.dob, 'Date of Birth')}
//             {renderEditableField('pan', merchantDetails.pan, 'PAN')}
//           </View>

//           <View style={styles.tableContainer}>
//             <Text style={styles.containerLabel}>Business Information</Text>
//             {renderEditableField(
//               'businessname',
//               merchantDetails.businessname,
//               'Business Name',
//             )}
//             {renderEditableField(
//               'sellerIdentifier',
//               merchantDetails.sellerIdentifier,
//               'Seller Identifier',
//             )}
//             {renderEditableField(
//               'gstNumber',
//               merchantDetails.gstNumber,
//               'GST Number',
//             )}
//             {renderEditableField('mcc', merchantDetails.mcc, 'MCC')}
//             {renderEditableField(
//               'turnoverType',
//               merchantDetails.turnoverType,
//               'Turnover Type',
//             )}
//             {renderEditableField(
//               'acceptanceType',
//               merchantDetails.acceptanceType,
//               'Acceptance Type',
//             )}
//             {renderEditableField(
//               'ownershipType',
//               merchantDetails.ownershipType,
//               'Ownership Type',
//             )}
//             {renderEditableField(
//               'llpInOrCin',
//               merchantDetails.llpInOrCin,
//               'LLP In or CIN',
//             )}
//             {renderEditableField(
//               'udyogAadhaar',
//               merchantDetails.udyogAadhaar,
//               'Udyog Aadhaar',
//             )}
//             {renderEditableField(
//               'doi',
//               merchantDetails.doi,
//               'Date of Incorporation',
//             )}
//             {renderEditableField(
//               'electricityBoardCode',
//               merchantDetails.electricityBoardCode,
//               'Electricity Board Code',
//             )}
//           </View>

//           <View style={styles.tableContainer}>
//             <Text style={styles.containerLabel}>Contact Information</Text>
//             {renderEditableField(
//               'mobileNumber',
//               merchantDetails.mobileNumber,
//               'Mobile Number',
//             )}
//             {renderEditableField(
//               'emailId',
//               merchantDetails.emailId,
//               'Email ID',
//             )}
//             {renderEditableField(
//               'addressLine1',
//               merchantDetails.addressLine1,
//               'Address Line 1',
//             )}
//             {renderEditableField(
//               'addressLine2',
//               merchantDetails.addressLine2,
//               'Address Line 2',
//             )}
//             {renderEditableField('city', merchantDetails.city, 'City')}
//             {renderEditableField(
//               'district',
//               merchantDetails.district,
//               'District',
//             )}
//             {renderEditableField(
//               'stateCode',
//               merchantDetails.stateCode,
//               'State Code',
//             )}
//             {renderEditableField(
//               'pinCode',
//               merchantDetails.pinCode,
//               'Pin Code',
//             )}
//           </View>

//           <View style={styles.tableContainer}>
//             <Text style={styles.containerLabel}>
//               Settlement Account Information
//             </Text>
//             {renderEditableField(
//               'settlementAccountName',
//               merchantDetails.settlementAccountName,
//               'Settlement Account Name',
//             )}
//             {renderEditableField(
//               'settlementAccountNumber',
//               merchantDetails.settlementAccountNumber,
//               'Settlement Account Number',
//             )}
//             {renderEditableField(
//               'settlementIFSC',
//               merchantDetails.settlementIFSC,
//               'Settlement IFSC',
//             )}
//           </View>
//         </View>
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F0F4FA',
//     marginBottom: 10,
//   },
//   header: {
//     backgroundColor: '#2058BB',
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 10,
//     paddingVertical: 10,
//   },
//   backButton: {
//     width: 48, // Increased width for larger touch target
//     height: 48, // Increased height for larger touch target
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   backArrow: {
//     width: 20,
//     height: 20,
//     tintColor: '#fff',
//   },
//   headerTitle: {
//     color: '#FFF',
//     fontSize: 22,
//     fontWeight: 'bold',
//   },
//   scrollView: {
//     paddingHorizontal: 20,
//   },
//   topSectionContainer: {
//     // backgroundColor: '#fff',
//     // borderRadius: 8,
//     // marginBottom: 20,
//     // paddingVertical: 20,
//     // paddingHorizontal: 10,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   topSection: {
//     flexDirection: 'row',
//     marginTop: 10,
//     marginBottom: 10,
//   },
//   profileImage: {
//     width: 50,
//     height: 50,
//     borderRadius: 40,
//     borderColor: '#2058BB',
//     borderWidth: 1,
//     marginTop: 10,
//     padding: 10,
//   },
//   nameContainer: {
//     // flex: 1,
//     flexDirection: 'column',
//     justifyContent: 'center',
//     alignItems: 'left',
//     marginLeft: 15,
//     marginTop: 8,
//   },
//   topSectionName: {
//     fontWeight: 'bold',
//     color: '#37474F',
//     fontSize: 16,
//     marginBottom: 2,
//   },
//   topSectionId: {
//     fontSize: 13,
//     color: '#000000',
//   },
//   passwordUpdate: {
//     flexDirection: 'row',
//     backgroundColor: '#2058BB',
//     justifyContent: 'center',
//     alignItems: 'center',
//     height: 40,
//     paddingHorizontal: 15,
//     borderRadius: 10,
//   },
//   passwordImage: {
//     height: 20,
//     width: 20,
//     marginHorizontal: 4,
//     borderRadius: 50,
//   },
//   passwordUpdateText: {
//     fontSize: 12,
//     color: 'white',
//     fontWeight: 'bold',
//   },
//   tableContainer: {
//     marginTop: 10,
//     borderWidth: 1,
//     borderColor: '#fff',
//     borderRadius: 15,
//     padding: 10,
//     backgroundColor: '#fff',
//   },
//   containerLabel: {
//     color: '#2058BB',
//     fontWeight: 'bold',
//     fontSize: 15,
//     marginBottom: 12,
//   },
//   row: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 8,
//   },
//   label: {
//     // fontWeight: 'bold',
//     marginRight: 5,
//     flex: 1,
//     fontSize: 14,
//     color: 'rgba(55, 71, 79, 0.60)', // Ensure label text is black
//   },
//   value: {
//     flex: 2,
//     fontSize: 14,
//     flexWrap: 'wrap',
//     color: 'black', // Ensure value text is black
//   },
//   noDetailsText: {
//     textAlign: 'center',
//     marginTop: 20,
//     color: 'black', // Ensure text is black
//   },
//   editIcon: {
//     width: 20,
//     height: 20,
//     marginLeft: 10,
//     tintColor: '#2058BB',
//   },
//   editContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     flex: 2,
//   },
//   editInput: {
//     flex: 1,
//     fontSize: 16,
//     borderBottomWidth: 1,
//     borderColor: '#2058BB',
//     paddingVertical: 2,
//     color: '#000',
//     marginRight: 10,
//   },
//   saveButton: {
//     backgroundColor: '#2058BB',
//     paddingVertical: 5,
//     paddingHorizontal: 10,
//     borderRadius: 4,
//   },
//   saveButtonText: {
//     color: '#fff',
//     fontSize: 14,
//   },
// });

// export default MyDetails;

import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  BackHandler,
  TouchableOpacity,
  Image,
  Alert,
  TextInput,
} from 'react-native';
import {Buffer} from 'buffer';
import Config from 'react-native-config';
import {useFocusEffect} from '@react-navigation/native';
import axios from 'axios';

const MyDetails = ({route, navigation}) => {
  const [merchantDetails, setMerchantDetails] = useState(null);
  const [userImage, setUserImage] = useState(null);
  const [userPAN, setUserPAN] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingField, setEditingField] = useState(null);
  const [updatedValue, setUpdatedValue] = useState('');
  const {mobileNumber, approved} = route.params;
  const apiUrl = Config.REACT_APP_API_URL;

  useEffect(() => {
    const fetchMerchantDetails = async () => {
      try {
        const response = await fetch(`${apiUrl}api/auth/getUser`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            mobileNumber: mobileNumber,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const data = await response.json();
        const base64Flag = 'data:image/jpeg;base64,';
        const imageStr = Buffer.from(data.userData.profilePhoto.data).toString(
          'base64',
        );
        const panStr = Buffer.from(data.userData.panDocument.data).toString(
          'base64',
        );
        setUserImage(base64Flag + imageStr);
        setUserPAN(base64Flag + panStr);
        setMerchantDetails(data.userData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching merchant details:', error);
        setLoading(false);
      }
    };

    fetchMerchantDetails();
  }, [mobileNumber]);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        navigation.goBack();
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [navigation]),
  );

  // const handleUpdate = async field => {
  //   try {
  //     const updatedDetails = {[field]: updatedValue}; // Only send the updated field

  //     console.log('Updated Details:', updatedDetails);
  //     console.log('Mobile Number:', mobileNumber);

  //     const response = await axios.put(
  //       `${apiUrl}api/auth/users/${mobileNumber}`,
  //       updatedDetails,
  //       {
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //       },
  //     );

  //     console.log('Response Status:', response.status);
  //     console.log('Response Data:', response.data);

  //     setMerchantDetails(prevDetails => ({
  //       ...prevDetails,
  //       [field]: updatedValue,
  //     }));
  //     setEditingField(null);
  //     setUpdatedValue('');
  //   } catch (error) {
  //     if (error.response) {
  //       console.log('Error Status:', error.response.status);
  //       console.log('Error Data:', error.response.data);
  //       alert('Error updating details. Please try again.');
  //     } else if (error.request) {
  //       console.log('No response received:', error.request);
  //       alert('No response from the server. Please try again later.');
  //     } else {
  //       console.log('Error setting up request:', error.message);
  //       alert('An error occurred. Please try again later.');
  //     }
  //   }
  // };

  const handleUpdate = async field => {
    try {
      const updatedDetails = {
        mobileNumber: mobileNumber, // include the mobile number
        [field]: updatedValue, // Only send the updated field
      };

      console.log(updatedDetails)

      // Convert the updatedDetails object to URL-encoded format
      const urlEncodedData = new URLSearchParams(updatedDetails).toString();
      console.log(urlEncodedData);

      console.log('Updated Details:', updatedDetails);
      console.log('Mobile Number:', mobileNumber);

      const response = await axios.post(
        `${apiUrl}api/existingseller/editseller`,
        urlEncodedData,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

      if (response.status === 200) {
        // Notify user of success
        Alert.alert(
          'Success',
          `${field.charAt(0).toUpperCase() + field.slice(1)} has been updated successfully.`,
          [{ text: 'OK', onPress: () => setEditingField(null) }]
        );
      }

      console.log('Response Status:', response.status);
      console.log('Response Data:', response.data);

      setMerchantDetails(prevDetails => ({
        ...prevDetails,
        [field]: updatedValue,
      }));
      setEditingField(null);
      setUpdatedValue('');
    } catch (error) {
      if (error.response) {
        console.log('Error Status:', error.response.status);
        console.log('Error Data:', error.response.data);
        alert('Error updating details. Please try again.');
      } else if (error.request) {
        console.log('No response received:', error.request);
        alert('No response from the server. Please try again later.');
      } else {
        console.log('Error setting up request:', error.message);
        alert('An error occurred. Please try again later.');
      }
    }
  };


  

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const handleUpdatePassword = () => {
    navigation.navigate('Update Password', {mobileNumber, approved});
  };

  const capitalizeWords = str => {
    return str.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
  };

  const renderEditableField = (field, value, label) => {
    return (
      <View style={styles.row}>
        <Text style={styles.label}>{label}:</Text>
        {editingField === field ? (
          <View style={styles.editContainer}>
            <TextInput
              style={styles.editInput}
              value={updatedValue}
              onChangeText={setUpdatedValue}
              autoFocus
            />
            <TouchableOpacity
              style={styles.saveButton}
              onPress={() => handleUpdate(field)}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <Text style={styles.value}>{value}</Text>
            <TouchableOpacity
              onPress={() => {
                setEditingField(field);
                setUpdatedValue(value);
              }}>
              <Image
                source={require('../../assets/images/edit_icon.png')}
                style={styles.editIcon}
              />
            </TouchableOpacity>
          </>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          accessible={true}
          accessibilityLabel="Go back"
          style={styles.backButton}>
          <Image
            source={require('../../assets/images/backArrow.png')}
            style={styles.backArrow}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Account</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.topSectionContainer}>
          <View style={styles.topSection}>
            <Image
              source={
                userImage?.startsWith('data:image/jpeg;base64,') &&
                userImage.length > 'data:image/jpeg;base64,'.length
                  ? {uri: userImage}
                  : require('../../assets/images/user.png')
              }
              style={styles.profileImage}
            />
            <View style={styles.nameContainer}>
              <Text style={styles.topSectionName}>
                {capitalizeWords(merchantDetails.businessname)}
              </Text>
              <Text style={styles.topSectionId}>
                Merchant ID: {merchantDetails.id}
              </Text>
            </View>
          </View>
          <TouchableOpacity onPress={handleUpdatePassword}>
            <View style={styles.passwordUpdate}>
              <Image
                style={styles.passwordImage}
                source={require('../../assets/images/lock_reset.png')}
              />
              <Text style={styles.passwordUpdateText}>Update Password</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View>
          <View style={styles.tableContainer}>
            <Text style={styles.containerLabel}>Personal Information</Text>
            {renderEditableField('dob', merchantDetails.dob, 'Date of Birth')}
            {renderEditableField('pan', merchantDetails.pan, 'PAN')}
          </View>

          <View style={styles.tableContainer}>
            <Text style={styles.containerLabel}>Business Information</Text>
            {renderEditableField(
              'businessname',
              merchantDetails.businessname,
              'Business Name',
            )}
            {renderEditableField(
              'sellerIdentifier',
              merchantDetails.sellerIdentifier,
              'Seller Identifier',
            )}
            {renderEditableField(
              'gstNumber',
              merchantDetails.gstNumber,
              'GST Number',
            )}
            {renderEditableField('mcc', merchantDetails.mcc, 'MCC')}
            {renderEditableField(
              'turnoverType',
              merchantDetails.turnoverType,
              'Turnover Type',
            )}
            {renderEditableField(
              'acceptanceType',
              merchantDetails.acceptanceType,
              'Acceptance Type',
            )}
            {renderEditableField(
              'ownershipType',
              merchantDetails.ownershipType,
              'Ownership Type',
            )}
            {renderEditableField(
              'llpInOrCin',
              merchantDetails.llpInOrCin,
              'LLP In or CIN',
            )}
            {renderEditableField(
              'udyogAadhaar',
              merchantDetails.udyogAadhaar,
              'Udyog Aadhaar',
            )}
            {renderEditableField(
              'doi',
              merchantDetails.doi,
              'Date of Incorporation',
            )}
            {renderEditableField(
              'electricityBoardCode',
              merchantDetails.electricityBoardCode,
              'Electricity Board Code',
            )}
          </View>

          <View style={styles.tableContainer}>
            <Text style={styles.containerLabel}>Contact Information</Text>
            {renderEditableField(
              'mobileNumber',
              merchantDetails.mobileNumber,
              'Mobile Number',
            )}
            {renderEditableField(
              'emailId',
              merchantDetails.emailId,
              'Email ID',
            )}
            {renderEditableField(
              'addressLine1',
              merchantDetails.addressLine1,
              'Address Line 1',
            )}
            {renderEditableField(
              'addressLine2',
              merchantDetails.addressLine2,
              'Address Line 2',
            )}
            {renderEditableField('city', merchantDetails.city, 'City')}
            {renderEditableField(
              'district',
              merchantDetails.district,
              'District',
            )}
            {renderEditableField(
              'stateCode',
              merchantDetails.stateCode,
              'State Code',
            )}
            {renderEditableField(
              'pinCode',
              merchantDetails.pinCode,
              'Pin Code',
            )}
          </View>

          <View style={styles.tableContainer}>
            <Text style={styles.containerLabel}>
              Settlement Account Information
            </Text>
            {renderEditableField(
              'settlementAccountName',
              merchantDetails.settlementAccountName,
              'Settlement Account Name',
            )}
            {renderEditableField(
              'settlementAccountNumber',
              merchantDetails.settlementAccountNumber,
              'Settlement Account Number',
            )}
            {renderEditableField(
              'settlementIFSC',
              merchantDetails.settlementIFSC,
              'Settlement IFSC',
            )}
          </View>
          {/* <View style={styles.tableContainer}>
            <Text style={styles.containerLabel}>PAN Document</Text>
            <Image
              source={
                userPAN?.startsWith('data:image/jpeg;base64,') &&
                userPAN.length > 'data:image/jpeg;base64,'.length
                  ? {uri: userPAN}
                  : require('../../assets/images/user.png')
              }
              style={styles.panImage}
            />
          </View> */}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4FA',
    marginBottom: 10,
  },
  header: {
    backgroundColor: '#2058BB',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  backButton: {
    width: 48, // Increased width for larger touch target
    height: 48, // Increased height for larger touch target
    justifyContent: 'center',
    alignItems: 'center',
  },
  backArrow: {
    width: 20,
    height: 20,
    tintColor: '#fff',
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
  scrollView: {
    paddingHorizontal: 20,
  },
  topSectionContainer: {
    // backgroundColor: '#fff',
    // borderRadius: 8,
    // marginBottom: 20,
    // paddingVertical: 20,
    // paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topSection: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 10,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 40,
    borderColor: '#2058BB',
    borderWidth: 1,
    marginTop: 10,
    padding: 10,
  },
  nameContainer: {
    // flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'left',
    marginLeft: 15,
    marginTop: 8,
  },
  topSectionName: {
    fontWeight: 'bold',
    color: '#37474F',
    fontSize: 16,
    marginBottom: 2,
  },
  topSectionId: {
    fontSize: 13,
    color: '#000000',
  },
  passwordUpdate: {
    flexDirection: 'row',
    backgroundColor: '#2058BB',
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  passwordImage: {
    height: 20,
    width: 20,
    marginHorizontal: 4,
    borderRadius: 50,
  },
  passwordUpdateText: {
    fontSize: 12,
    color: 'white',
    fontWeight: 'bold',
  },
  tableContainer: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 15,
    padding: 10,
    backgroundColor: '#fff',
  },
  containerLabel: {
    color: '#2058BB',
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    // fontWeight: 'bold',
    marginRight: 5,
    flex: 1,
    fontSize: 14,
    color: 'rgba(55, 71, 79, 0.60)', // Ensure label text is black
  },
  value: {
    flex: 2,
    fontSize: 14,
    flexWrap: 'wrap',
    color: 'black', // Ensure value text is black
  },
  noDetailsText: {
    textAlign: 'center',
    marginTop: 20,
    color: 'black', // Ensure text is black
  },
  editIcon: {
    width: 20,
    height: 20,
    marginLeft: 10,
    tintColor: '#2058BB',
  },
  editContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 2,
  },
  editInput: {
    flex: 1,
    fontSize: 16,
    borderBottomWidth: 1,
    borderColor: '#2058BB',
    paddingVertical: 2,
    color: '#000',
    marginRight: 10,
  },
  saveButton: {
    backgroundColor: '#2058BB',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 4,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  panImage: {
    width: '100%',
    height: 200,
    borderRadius: 40,
    borderColor: '#2058BB',
    borderWidth: 1,
    marginTop: 10,
    padding: 10,
  },
});

export default MyDetails;
