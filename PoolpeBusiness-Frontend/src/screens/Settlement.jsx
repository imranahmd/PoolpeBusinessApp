import React, {useState, useEffect, useCallback, useRef} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  BackHandler,
  Modal,
  Image,
  Alert,
  Pressable,
  TextInput,
} from 'react-native';
import {Buffer} from 'buffer';
import Config from 'react-native-config';
import {useFocusEffect} from '@react-navigation/native';
import {useColorScheme} from 'react-native';
import AlertModal from '../components/AlertModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import Clipboard from '@react-native-clipboard/clipboard';
import ViewShot from 'react-native-view-shot';
import Share from 'react-native-share';
import BottomNavigationBar from './BottomNavigationBar'; // Ensure you have this component imported
import RNFS from 'react-native-fs'; // For file system operations

// Define styles for dark mode
const darkMode = StyleSheet.create({
  container: {
    flex: 1,
    // paddingTop: 20,
    // paddingHorizontal: 16,
    backgroundColor: '#121212', // Dark background
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'left',
    marginBottom: 15,
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: '#2058BB', // Dark header background
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
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  transactionContainer: {
    marginBottom: 15,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
    border: 1,
    borderColor: 'green',
    backgroundColor: '#333', // Dark transaction background
  },
  success: {
    backgroundColor: '#4FC978', // Keep same success color
  },
  failed: {
    backgroundColor: '#DF2C14', // Keep same failed color
  },
  transactionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#444', // Dark border color
  },
  amount: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white', // Dark mode text color
  },
  type: {
    fontSize: 16,
    color: '#DDD', // Light text for dark mode
  },
  transactionType: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  leftColumn: {
    flex: 1,
    gap: 2,
  },
  rightColumn: {
    flex: 1,
    alignItems: 'flex-end',
    gap: 1,
  },
  bold: {
    fontWeight: 'bold',
    color: 'white', // Dark mode text color
  },
  filterButton: {
    backgroundColor: '#2058BB',
    color: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    marginTop: 15,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  buttonGroup: {
    width: '30%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginLeft: 8, // Space between input groups and buttons
  },
  transactionDetails: {
    padding: 16,
    backgroundColor: '#222', // Dark background for details
    borderBottomRightRadius: 20, // Light background for details
    borderBottomLeftRadius: 20,
  },
  qrContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white', // White background for QR modal (unchanged)
  },
  qrImage: {
    width: 250,
    height: 250,
  },
  dateText: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 10,
    marginBottom: 2,
  },
  closeText: {
    marginTop: 20,
    color: 'black',
    fontWeight: 'bold',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#333', // Dark background for modal
  },
  modalContainer: {
    width: '100%',
    backgroundColor: '#ccc', // Dark modal container background
    borderRadius: 10,
    padding: 10,
    position: 'relative',
  },
  closeIcon: {
    // position: 'absolute',
    // top: -100, // Adjust to move closer to the edge of the modal
    // left: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    zIndex: 1,
  },
  closeIconImage: {
    width: 20, // Adjust the size of the close icon image
    height: 20,
    resizeMode: 'contain',
  },
  modalIconClick: {
    backgroundColor: '#555', // Darker background for modal icon click area
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  enlargedQrImage: {
    width: 250,
    height: 250,
    resizeMode: 'contain',
  },
  businessName: {
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 10,
    width: 300,
    color: '#2058BB',
    fontWeight: 'bold',
    fontSize: 32,
  },
  businessUPIID: {
    textAlign: 'center',

    width: 300,
    color: 'white',

    fontSize: 15,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  upiIDContainer: {
    marginTop: 10,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copyIconContainer: {
    marginLeft: 3,
    // Any additional styling for the copy icon container
  },
  copyIcon: {
    width: 20,
    height: 20,
    // Your styles for the copy icon image
  },

  filterIcon: {
    marginTop: 15,
    height: 30,
    width: 30,
    marginleft: -10,
    backgroundColor: '#2058BB',
    borderRadius: 10,
    paddingVertical: 2,
    paddingHorizontal: 4,
  },
  clearIcon: {
    marginTop: 15,
    height: 30,
    width: 30,
    backgroundColor: '#2058BB',
    borderRadius: 10,
    paddingVertical: 2,
    paddingHorizontal: 4,
  },
  copyIcon: {
    width: 20,
    height: 20,
    // Your styles for the copy icon image
  },
  inputGroup: {
    width: '35%', // 60% of the width divided among two input groups
    marginHorizontal: 8, // Space between input groups
  },
  inputGroup: {
    width: '35%', // 60% of the width divided among two input groups
    marginHorizontal: 8, // Space between input groups
  },
  dateInput: {
    width: '100%',
    height: 37,
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 5,
    fontSize: 12,
    padding: 8,
    color: '#333', // Dark text for light mode
    backgroundColor: '#fff', // Light mode background color
  },
  // yesbanklogoimageContainer: {
  //   marginHorizontal: 60,
  //   marginTop: 10,
  //   flexDirection: 'row',
  //   backgroundColor: '#2058BB', // Background color
  //   paddingVertical: 8, // Vertical padding for space above and below the image
  //   paddingHorizontal: 0, // Set horizontal padding to zero to avoid negative padding issues
  //   borderRadius: 10, // Border radius for rounded corners
  //   justifyContent: 'center', // Center the content (image) vertically
  //   alignItems: 'center', // Center the content (image) horizontally
  // },
  yesbanklogoimage: {
    backgroundColor: '#2058BB',
    height: 40, // Height of the image
    width: 40, // Width of the image
    // borderRadius: 10, // Border radius for rounded corners
    // resizeMode:'contain'
  },
  noTransactionsTextContainer: {
    flex: 1,
    justifyContent: 'center', // Center vertically
    alignItems: 'center', // Center horizontally
    marginBottom: 50,
  },
  noTransactionsText: {
    // Ensure it takes up available space
    justifyContent: 'center', // Center vertically
    alignItems: 'center', // Center horizontally
    textAlign: 'center', // Center text within the Text component
    fontSize: 18, // Increase text size
    color: 'white', // Optional: Change the text color
    marginBottom: 20,
  },
  noDataContainer: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noDataText: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    marginBottom: 10,
  },

  modalButton: {
    backgroundColor: '#2058BB',
    padding: 10,
    borderRadius: 5,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  captureView: {
    backgroundColor: 'white', // White background for screenshot
    // padding: 16, // Optional padding
    borderRadius: 8, // Optional border radius
  },
  qrContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBusinessName: {
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 10,
    width: 300,
    color: '#2058BB',
    fontWeight: 'bold',
    fontSize: 32,
  },
  enlargedQrImageContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  downloadShareQRContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    gap: 40,
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: 'white', // Adjust based on your design
  },

  downloadQR: {
    backgroundColor: 'white',
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 45,
    paddingVertical: 8,
    borderRadius: 10,
    marginBottom: 2,
  },
  shareQR: {
    backgroundColor: 'white',
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 45,
    paddingVertical: 8,
    borderRadius: 10,
    marginBottom: 2,
  },
  loadingContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingImage: {
    width: 50,
    height: 50,
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#000',
    marginLeft: 10,
  },
});

// Define styles for light mode
const lightMode = StyleSheet.create({
  // ... (other styles remain unchanged)
  container: {
    flex: 1,
    // paddingTop: 20,
    // paddingHorizontal: 10,
    backgroundColor: '#F0F4FA', // Light background
  },
  header: {
    backgroundColor: '#2058BB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'left',
    marginBottom: 15,
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
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  transactionContainer: {
    marginBottom: 15,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    marginHorizontal: 10,
    shadowRadius: 5,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(102, 102, 102, 0.20)',
    borderRadius: 15,
    backgroundColor: '#FFF', // Light transaction background
  },
  success: {
    backgroundColor: '#4FC978',
  },
  failed: {
    backgroundColor: '#DF2C14',
  },
  transactionRow: {
    // flexDirection: 'row',
    // justifyContent: 'space-between',
    // padding: 16,
    // borderBottomWidth: 1,
    // borderBottomColor: '#CCC', // Light border color
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  amount: {
    fontSize: 22,
    fontWeight: 'bold',
  },

  type: {
    fontSize: 16,
    color: '#333', // Dark text for light mode
  },
  transactionType: {
    fontSize: 16,
    color: '#444',
    fontWeight: 'bold',
  },
  leftColumn: {
    flex: 1,
    gap: 2,
  },
  rightColumn: {
    flex: 1,
    alignItems: 'flex-end',
    gap: 1,
  },
  transactionTime: {
    fontSize: 12,
  },
  bold: {
    fontWeight: 'bold',
    color: '#37474F99',
  },
  filterButton: {
    backgroundColor: '#2058BB',
    color: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    marginTop: 15,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  buttonGroup: {
    width: '30%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginLeft: 8, // Space between input groups and buttons
  },

  transactionDetails: {
    padding: 16,
    backgroundColor: 'white',
    borderBottomRightRadius: 20, // Light background for details
    borderBottomLeftRadius: 20,
  },
  qrContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white', // White background for QR modal
  },
  qrImage: {
    width: 250,
    height: 250,
  },
  dateText: {
    fontWeight: 'bold',
    fontSize: 10,
    marginBottom: 2,
  },
  closeText: {
    marginTop: 20,
    color: 'black',
    fontWeight: 'bold',
  },

  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  modalContainer: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    position: 'relative',
  },
  closeIcon: {
    // position: 'absolute',
    // top: -50, // Adjust to move closer to the edge of the modal
    // left: 40,
    flexDirection: 'row',
    justifyContent: 'center',
    zIndex: 1,
  },
  closeIconImage: {
    width: 20, // Adjust the size of the close icon image
    height: 20,
    resizeMode: 'contain',
  },
  modalIconClick: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  enlargedQrImage: {
    width: 250,
    height: 250,
    resizeMode: 'contain',
  },
  businessName: {
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 10,
    width: 300,
    color: '#2058BB',
    fontWeight: 'bold',
    fontSize: 32,
  },
  tnID: {
    color: '#37474F',
  },

  businessUPIID: {
    color: '#37474FCC',
    fontSize: 15,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 25,
    marginBottom: 20,
  },
  filterIcon: {
    marginTop: 15,
    height: 30,
    width: 30,
    marginleft: -10,
    backgroundColor: '#2058BB',
    borderRadius: 10,
    paddingVertical: 2,
    paddingHorizontal: 4,
  },
  clearIcon: {
    marginTop: 15,
    height: 30,
    width: 30,
    backgroundColor: '#2058BB',
    borderRadius: 10,
    paddingVertical: 2,
    paddingHorizontal: 4,
  },
  successText: {
    fontSize: 10,
    color: 'green',
    fontWeight: 'bold',
  },

  yesbanklogoimage: {
    backgroundColor: '#2058BB',
    height: 40, // Height of the image
    width: 40, // Width of the image
    // borderRadius: 10, // Border radius for rounded corners
    // resizeMode:'contain'
  },

  upiIDContainer: {
    marginTop: 10,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copyIconContainer: {
    marginLeft: 3,
    // Any additional styling for the copy icon container
  },
  copyIcon: {
    width: 20,
    height: 20,
    // Your styles for the copy icon image
  },
  inputGroup: {
    width: '35%', // 60% of the width divided among two input groups
    marginHorizontal: 8, // Space between input groups
  },
  dateInput: {
    width: '100%',
    height: 37,
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 5,
    fontSize: 12,
    padding: 8,
    color: '#333', // Dark text for light mode
    backgroundColor: '#fff', // Light mode background color
  },
  noTransactionsTextContainer: {
    flex: 1,
    justifyContent: 'center', // Center vertically
    alignItems: 'center', // Center horizontally
    marginBottom: 50,
  },
  noTransactionsText: {
    justifyContent: 'center', // Center vertically
    alignItems: 'center', // Center horizontally
    textAlign: 'center', // Center text within the Text component
    fontSize: 18, // Increase text size
    color: 'black', // Optional: Change the text color
    marginBottom: 20,
  },
  noDataContainer: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noDataText: {
    fontSize: 18,
    color: 'black',
    textAlign: 'center',
    marginBottom: 10,
  },
  modalButton: {
    backgroundColor: '#2058BB',
    padding: 10,
    borderRadius: 5,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  captureView: {
    backgroundColor: 'white', // White background for screenshot
    // padding: 16, // Optional padding
    borderRadius: 8, // Optional border radius
  },
  qrContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBusinessName: {
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 10,
    width: 300,
    color: '#2058BB',
    fontWeight: 'bold',
    fontSize: 32,
  },
  enlargedQrImageContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  downloadShareQRContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    gap: 40,
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: 'white', // Adjust based on your design
  },

  downloadQR: {
    backgroundColor: 'white',
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 45,
    paddingVertical: 8,
    borderRadius: 10,
    marginBottom: 2,
  },
  shareQR: {
    backgroundColor: 'white',
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 45,
    paddingVertical: 8,
    borderRadius: 10,
    marginBottom: 2,
  },
  loadingContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingImage: {
    width: 50,
    height: 50,
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#000',
    marginLeft: 10,
  },
});

// Main component for displaying settlement logs
const SettlementLog = ({route, navigation, resetUnseenCount}) => {
  const [settlements, setSettlements] = useState([]);
  const [qrImage, setQrImage] = useState(null);
  const [showQrModal, setShowQrModal] = useState(false);
  const [userData, setUserData] = useState(null);
  const [userBusinessName, setUserBusinessName] = useState('');
  const [userId, setUserId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [upiID, setUPIId] = useState('');
  const [filteredSettlements, setFilteredSettlements] = useState([]);
  const [isBottomBarVisible, setIsBottomBarVisible] = useState(true);
  const [isSettlementVisible, setIsSettlementVisible] = useState('');
  const [isQrModalVisible, setQrModalVisible] = useState(false);
  const [isScreenshotTaking, setIsScreenshotTaking] = useState(false);
  const [alertVisible2, setAlertVisible2] = useState(false);
  const [alertVisible3, setAlertVisible3] = useState(false);
  const [activeScreen, setActiveScreen] = useState(''); // Track active screen
  const [isFilterClicked, setIsFilterClicked] = useState(false); // Track filter clicks
  const {mobileNumber} = route.params;
  const apiUrl = Config.REACT_APP_API_URL;
  const colorScheme = useColorScheme(); // Get color scheme
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [loading, setLoading] = useState(true); // Add loading state
  const styles = colorScheme === 'dark' ? darkMode : lightMode;
  const viewShotRef = useRef(null);

  const downloadScreenshot = async () => {
    setIsScreenshotTaking(true);
    try {
      // Uncomment if needed
      // const hasPermission = await requestStoragePermission();
      // if (!hasPermission) {
      //   console.log('Storage permission denied');
      //   return;
      // }

      const uri = await viewShotRef.current.capture();
      console.log('Captured screenshot URI:', uri);

      const filePath = `${RNFS.PicturesDirectoryPath}/qr_modal_screenshot.png`;
      console.log('Target file path:', filePath);

      const fileExists = await RNFS.exists(uri);
      if (!fileExists) {
        console.log('File at URI does not exist');
        return;
      }

      await RNFS.moveFile(uri, filePath);
      console.log('Screenshot saved to:', filePath);

      // Notify user
      // Alert.alert('Screenshot Saved', `Screenshot saved to: ${filePath}`);
      setAlertVisible3(true);
    } catch (error) {
      // console.error('Error saving screenshot:', error);
      // Alert.alert(
      //   'Error',
      //   'There was an issue saving the screenshot. Please try again.',
      // );
    } finally {
      setIsScreenshotTaking(false);
    }
  };

  const shareScreenshot = async () => {
    setIsScreenshotTaking(true);
    try {
      const uri = await viewShotRef.current.capture();

      const shareOptions = {
        title: 'Share QR Modal Screenshot',
        url: 'file://' + uri,
        type: 'image/png',
      };

      await Share.open(shareOptions);
    } catch (error) {
      // console.error('Error sharing screenshot:', error);
      // Alert.alert(
      //   'Error',
      //   'There was an issue sharing the screenshot. Please try again.',
      // );
    } finally {
      setIsScreenshotTaking(false);
    }
  };

  useEffect(() => {
    // Simulate fetching transactions
    setTimeout(() => {
      setLoading(false); // Set loading to false once transactions are fetched
    }, 1000); // Adjust the timeout to match your actual data fetching time
  }, []);

  const onStartDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || startDate;
    setShowStartPicker(Platform.OS === 'ios');
    setStartDate(currentDate.toISOString().split('T')[0]); // Format to YYYY-MM-DD

    // If the end date is earlier than the new start date, reset the end date
    if (endDate && new Date(endDate) < currentDate) {
      setEndDate(null);
    }
  };

  const onEndDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || endDate;
    setShowEndPicker(Platform.OS === 'ios');

    // Check if the end date is earlier than the start date
    if (startDate && new Date(currentDate) < new Date(startDate)) {
      // Alert.alert('Invalid Date', 'End date cannot be earlier than start date.');
      setIsModalVisible(true);
      return;
    }

    setEndDate(currentDate.toISOString().split('T')[0]); // Format to YYYY-MM-DD
  };

  const saveScreenshot = async () => {
    try {
      // Capture the screenshot
      const uri = await viewShotRef.current.capture();
      console.log('Captured URI:', uri);

      if (!uri) {
        throw new Error('Failed to capture screenshot');
      }

      // Define the path for saving the screenshot
      const filePath = `${RNFS.ExternalDirectoryPath}/modal_screenshot.png`;
      console.log('Saving to path:', filePath);

      // Copy the file
      await RNFS.copyFile(uri, filePath);

      // Verify file existence
      const exists = await RNFS.exists(filePath);
      if (exists) {
        Alert.alert(
          'Saved Successfully',
          `Screenshot has been saved to ${filePath}`,
        );
      } else {
        Alert.alert('File Not Found', `No file found at ${filePath}`);
      }
    } catch (error) {
      // console.error('Error saving screenshot:', error);
      // Alert.alert('Error', 'There was an error saving the screenshot.');
    }
  };

  // Fetch settlement data
  const fetchData = async () => {
    try {
      const response = await fetch(`${apiUrl}api/fundsettle/createfundsettle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({mobileNumber}),
      });
      const data = await response.json();
      // console.log(data.daata.fundSettleList);

      if (data && data.data && data.data.fundSettleList) {
        setSettlements(data.data.fundSettleList);
        console.log('today', settlements);

        setFilteredSettlements(data.data.fundSettleList);
      }
      if (data && data.data && data.data.fundSettleList.length > 0) {
        // Assuming the transactions are sorted with the most recent first
        const mostRecentSettlementTime = data.data.fundSettleList[0].txnTime;

        await AsyncStorage.setItem(
          '@last_seen_settlement_time',
          new Date(mostRecentSettlementTime).toString(),
        );
        console.log(
          'Updated @last_seen_settlement_time:',
          new Date(mostRecentSettlementTime).toString(),
        );

        // Set the transactions to the state
        setSettlements(data.data.fundSettleList);
        setFilteredSettlements(data.data.fundSettleList);
      }
    } catch (error) {
      // console.error('Error fetching data:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const fetchSettlements = async () => {
        try {
          const response = await fetch(
            `${apiUrl}api/fundsettle/createfundsettle`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({mobileNumber}),
            },
          );
          const data = await response.json();
        } catch (error) {
          // console.error('Error fetching data:', error);
        }
      };

      fetchSettlements();

      // Store the last seen transaction ID or timestamp in AsyncStorage
      if (settlements.length > 0) {
        AsyncStorage.setItem(
          '@last_seen_settlement_time',
          new Date(settlements[0].txnTime).toString(),
        );
      }
    }, []),
  );

  useEffect(() => {
    const getUserData = () => {
      fetch(`${apiUrl}api/auth/getUser`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({mobileNumber}),
      })
        .then(response => response.json())
        .then(data => {
          const base64Flag = 'data:image/jpeg;base64,';
          const imageStr = Buffer.from(
            data.userData.profilePhoto.data,
          ).toString('base64');

          setUserData(base64Flag + imageStr);
          setUserId(data.userData.id);
          setUserBusinessName(data.userData.businessname);
        })
        .catch(error => {
          // console.error('Error fetching user data:', error);
          // Alert.alert('Error', 'Failed to fetch user data');
        });
    };

    const fetchQrCode = () => {
      fetch(`${apiUrl}api/qr/createqr`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({mobileNumber}),
      })
        .then(response => response.json())
        .then(data => {
          if (data.status === 201) {
            const qrImageStr = data.data.qrString; // Adjust based on response structure
            setQrImage(
              `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
                qrImageStr,
              )}&size=150x150`,
            );
            setUPIId(qrImageStr.slice(21, 53));
          }
        })
        .catch(error => {
          // console.error('Error generating QR code:', error);
          // Alert.alert('Error', 'Failed to generate QR code');
        });
    };

    fetchData();
    fetchQrCode();
    getUserData();
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

  useFocusEffect(
    useCallback(() => {
      // resetUnseenCount;
      // Reload settlements when the screen is focused again
      fetchData();
    }, []),
  );

  const capitalizeWords = str => {
    return str.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
  };

  const filterSettlements = () => {
    setIsFilterClicked(true); // Set filter clicked to true

    if (!startDate || !endDate) {
      setFilteredSettlements([]); // Clear filtered settlements if dates are not entered
      return;
    }

    const filtered = settlements.filter(settlement => {
      const txnDate = new Date(settlement.txnTime);
      const start = new Date(startDate);
      const end = new Date(endDate);
      return txnDate >= start && txnDate <= end;
    });
    setFilteredSettlements(filtered);
  };

  const clearFilter = () => {
    setStartDate('');
    setEndDate('');
    setFilteredSettlements(settlements);
  };

  const copyToClipboard = () => {
    Clipboard.setString(upiID);
    // Alert.alert(
    //   'Copied to Clipboard',
    //   'UPI ID has been copied to your clipboard.',
    // );
    setAlertVisible2(true);
  };

  const handleNavigation = async screen => {
    setActiveScreen(screen); // Set the active screen

    if (screen === 'Home') {
      try {
        const savedApproved = await AsyncStorage.getItem('@user_approved');
        // Ensure that savedApproved is in a serializable format
        navigation.navigate('Dashboard', {
          mobileNumber: mobileNumber,
          approved: savedApproved ? JSON.parse(savedApproved) : null,
          // resetUnseenCount: () => {
          //   AsyncStorage.setItem('@unseenSettlementsCount', '0'); // Persist reset in AsyncStorage
          // },
        }); // Navigate to Dashboard
      } catch (error) {
        console.error('Error fetching approval status:', error);
        // Handle error appropriately
      }
    } else if (screen === 'My Details') {
      navigation.navigate('My Details', {mobileNumber});
    } else if (screen === 'QR Code') {
      setShowQrModal(true); // Show QR code modal
    } else if (screen === 'History') {
      // Handle History navigation, if needed
    }
  };

  const renderSettlementItem = ({item}) => {
    return <SettlementItem settlement={item} styles={styles} />;
  };

  const handleScroll = event => {
    const {contentOffset, contentSize, layoutMeasurement} = event.nativeEvent;
    const isBottom =
      contentOffset.y >= contentSize.height - layoutMeasurement.height;

    setIsBottomBarVisible(!isBottom);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          accessible={true}
          accessibilityLabel="Go back"
          style={styles.backButton} // Added this line to apply the new styles
        >
          <Image
            source={require('../../assets/images/backArrow.png')}
            style={styles.backArrow}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settlements</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <Image
            source={require('../../assets/images/loading.png')} // Add your custom loading image or spinner here
            style={styles.loadingImage}
          />
          <Text style={styles.loadingText}>Loading settlements...</Text>
        </View>
      ) : settlements.length === 0 ? (
        <View style={styles.noTransactionsTextContainer}>
          <Text style={styles.noTransactionsText}>
            No Settlements visible for this user
          </Text>
          <TouchableOpacity
            style={styles.modalButton}
            onPress={() => navigation.goBack()}>
            <Text style={styles.modalButtonText}>Back to Dashboard</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {activeScreen === 'History' && ( // Conditionally render the filter components
            <View style={styles.filterContainer}>
              <View style={styles.inputGroup}>
                <Text style={styles.dateText}>Start Date(YYYY-MM-DD)</Text>
                <TouchableOpacity onPress={() => setShowStartPicker(true)}>
                  <TextInput
                    style={styles.dateInput}
                    placeholder="Select Start Date"
                    placeholderTextColor={
                      colorScheme === 'dark' ? '#888' : '#999'
                    }
                    value={startDate}
                    editable={false} // Disable manual editing
                  />
                </TouchableOpacity>
                {showStartPicker && (
                  <DateTimePicker
                    value={startDate ? new Date(startDate) : new Date()}
                    mode="date"
                    display="default"
                    onChange={onStartDateChange}
                  />
                )}
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.dateText}>End Date(YYYY-MM-DD)</Text>
                <TouchableOpacity onPress={() => setShowEndPicker(true)}>
                  <TextInput
                    style={styles.dateInput}
                    placeholder="Select End Date"
                    placeholderTextColor={
                      colorScheme === 'dark' ? '#888' : '#999'
                    }
                    value={endDate}
                    editable={false} // Disable manual editing
                  />
                </TouchableOpacity>
                {showEndPicker && (
                  <DateTimePicker
                    value={endDate ? new Date(endDate) : new Date()}
                    mode="date"
                    display="default"
                    onChange={onEndDateChange}
                  />
                )}
              </View>
              <View style={styles.buttonGroup}>
                <TouchableOpacity
                  style={styles.filterButtonContainer}
                  onPress={filterSettlements}>
                  <Image
                    source={require('../../assets/images/filter.png')}
                    style={styles.filterIcon}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.filterButtonContainer}
                  onPress={clearFilter}>
                  <Image
                    source={require('../../assets/images/clear.png')}
                    style={styles.clearIcon}
                  />
                </TouchableOpacity>
              </View>
              <AlertModal
                visible={isModalVisible}
                message="End date cannot be earlier than start date."
                onDismiss={() => setIsModalVisible(false)}
              />
            </View>
          )}
          {isFilterClicked && filteredSettlements.length === 0 ? (
            <Text style={styles.bold}>No data available</Text>
          ) : (
            <FlatList
              data={filteredSettlements}
              keyExtractor={item => item.txnId}
              renderItem={renderSettlementItem}
              contentContainerStyle={styles.listContainer}
              onScroll={handleScroll}
            />
          )}
        </>
      )}

      {isBottomBarVisible && (
        <BottomNavigationBar
          navItems={[
            {
              label: 'Home',
              icon: require('../../assets/images/Home.png'),
              onPress: () => handleNavigation('Home'),
            },
            {
              label: 'Account',
              icon: require('../../assets/images/Profile.png'),
              onPress: () => handleNavigation('My Details'),
            },
            {
              label: 'QR Code',
              icon: require('../../assets/images/qr.png'),
              onPress: () => handleNavigation('QR Code'),
            },
            {
              label: 'History',
              icon: require('../../assets/images/History.png'),
              onPress: () => handleNavigation('History'),
            },
          ]}
          activeOption={activeScreen} // Set the active screen
        />
      )}

      <Modal
        visible={showQrModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowQrModal(false)}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <ViewShot
                ref={viewShotRef}
                options={{format: 'png', quality: 0.9}}
                style={styles.captureView}>
                {qrImage ? (
                  <View>
                    <View>
                      {/* <TouchableOpacity
                        style={styles.closeIcon}
                        onPress={() => setShowQrModal(false)}>
                        <Image
                          source={require('../../assets/images/close.png')}
                          style={styles.closeIconImage}
                        />
                      </TouchableOpacity> */}
                    </View>
                    <View style={styles.screenshotContent}>
                      <View style={styles.qrContent}>
                        <Text style={styles.modalBusinessName}>
                          {capitalizeWords(userBusinessName)}
                        </Text>
                      </View>
                      {qrImage && (
                        <View style={styles.enlargedQrImageContainer}>
                          <Image
                            source={{uri: qrImage}}
                            style={styles.enlargedQrImage}
                          />
                          <View style={styles.upiIDContainer}>
                            <View>
                              <Image
                                source={require('../../assets/images/yesbanklogo.png')}
                                style={styles.yesbanklogoimage}
                              />
                            </View>
                            <View>
                              <Text style={styles.businessUPIID}>{upiID}</Text>
                            </View>
                            <View>
                              <TouchableOpacity onPress={copyToClipboard}>
                                <Image
                                  source={require('../../assets/images/copy.png')}
                                  style={[
                                    styles.copyIcon,
                                    isScreenshotTaking && {opacity: 0}, // Hide during screenshot
                                  ]}
                                />
                                <AlertModal
                                  visible={alertVisible2}
                                  message="UPI ID has been copied to your clipboard"
                                  onDismiss={() => setAlertVisible2(false)}
                                />
                              </TouchableOpacity>
                            </View>
                          </View>
                        </View>
                      )}
                    </View>
                  </View>
                ) : (
                  <View style={styles.noDataContainer}>
                    <Text style={styles.noDataText}>
                      No QR data available for this user
                    </Text>
                    {/* <TouchableOpacity
                      style={styles.modalButton}
                      onPress={() => setShowQrModal(false)}>
                      <Text style={styles.modalButtonText}>OK</Text>
                    </TouchableOpacity> */}
                  </View>
                )}
              </ViewShot>
              {qrImage && (
                <View style={styles.downloadShareQRContainer}>
                  <TouchableOpacity onPress={downloadScreenshot}>
                    <View style={styles.downloadQR}>
                      <Image
                        source={require('../../assets/images/download.png')}
                        style={styles.copyIcon}
                      />
                    </View>
                    <AlertModal
                      visible={alertVisible3}
                      message={`Screenshot saved to: /storage/emulated/0/Pictures/${userBusinessName}_qr_screenshot.png`}
                      onDismiss={() => setAlertVisible3(false)}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={shareScreenshot}>
                    <View style={styles.shareQR}>
                      <Image
                        source={require('../../assets/images/share.png')}
                        style={styles.copyIcon}
                      />
                    </View>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
          <TouchableOpacity
            style={styles.closeIcon}
            onPress={() => setShowQrModal(false)}>
            {/* <Image
              source={require('../../assets/images/close.png')}
              style={styles.closeIconImage}
            /> */}
            <Text
              style={{
                backgroundColor: '#2058BB',
                color: 'white',
                borderRadius: 8,
                marginTop: 5,
                paddingHorizontal: 20,
                paddingVertical: 6,
              }}>
              Close
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

// Component for rendering individual settlement items
const SettlementItem = ({settlement, styles}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <View
      style={[
        styles.transactionContainer,
        // Remove the background color styles here
      ]}>
      <TouchableOpacity onPress={() => setExpanded(!expanded)}>
        {/* <View style={styles.transactionRow}>
          <Text style={[styles.amount]}>₹{settlement.amount}</Text>
          <Text
            style={[
              styles.type,
              settlement.status === 0
                ? styles.successText
                : transaction.status === 1
                ? styles.failedText
                : styles.pendingText,
            ]}>
            {settlement.status === 0
              ? 'SUCCESS'
              : settlement.status === 1
              ? 'FAILED'
              : 'PENDING'}
          </Text>
          <Text style={styles.transactionType}>{settlement.txnTime}</Text>
        </View> */}
        <View style={styles.transactionRow}>
          <View style={styles.leftColumn}>
            <Text
              style={styles.transactionType}
              numberOfLines={1}
              ellipsizeMode="tail">
              {settlement.payerVPA}
            </Text>
            <Text style={styles.transactionTime}>{settlement.txnTime}</Text>
          </View>
          <View style={styles.rightColumn}>
            <Text style={[styles.amount]}>₹{settlement.amount}</Text>
            <Text
              style={[
                styles.type,
                settlement.status === 0
                  ? styles.successText
                  : settlement.status === 1
                  ? styles.failedText
                  : styles.pendingText,
              ]}>
              {settlement.status === 0
                ? 'SUCCESS'
                : settlement.status === 1
                ? 'FAILED'
                : 'PENDING'}
            </Text>
          </View>
        </View>
        {expanded && (
          <View style={styles.transactionDetails}>
            <Text style={styles.bold}>
              Transaction ID:{' '}
              <Text style={styles.tnID}>{settlement.txnId}</Text>
            </Text>
            <Text style={styles.bold}>
              Message:{' '}
              <Text style={styles.tnID}>
                {settlement.responseMessage ===
                'Seller settlement initiated successfully'
                  ? 'Seller settlement successful'
                  : 'Seller settlement failed'}
              </Text>
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default SettlementLog;
