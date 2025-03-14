import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  Button,
  Dimensions,
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
  Modal,
  Pressable,
  BackHandler,
  Appearance,
} from 'react-native';
import {Buffer} from 'buffer';
import Config from 'react-native-config';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AlertModal from '../components/AlertModal';
import Clipboard from '@react-native-clipboard/clipboard';
import ViewShot from 'react-native-view-shot';
import {captureScreen} from 'react-native-view-shot';
import Share from 'react-native-share';
import {useRoute, useFocusEffect} from '@react-navigation/native';
import BottomNavigationBar from './BottomNavigationBar';
import RNFS from 'react-native-fs'; // For file system operations
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';

const Dashboard = ({navigation}) => {
  const route = useRoute();
  const [activeOption, setActiveOption] = useState(null);
  const [userData, setUserData] = useState(null);
  const [userBusinessName, setUserBusinessName] = useState('');
  const [userId, setUserId] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [qrImage, setQrImage] = useState(null);
  const [captureScreenshot, setCaptureScreenshot] = useState(false);
  const [upiID, setUPIId] = useState('');
  const [serviceName, setServiceName] = useState(''); // Initialize serviceName state
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertVisible2, setAlertVisible2] = useState(false);
  const [alertVisible3, setAlertVisible3] = useState(false);
  const [currentDateTransaction, setCurrentDateTransaction] = useState('');
  const [isQrModalVisible, setQrModalVisible] = useState(false);
  const [transactionForCurrentDate, setTransactionsForCurrentDate] = useState();
  const [colorScheme, setColorScheme] = useState(Appearance.getColorScheme());
  const [isScreenshotTaking, setIsScreenshotTaking] = useState(false);
  const [confirmLogoutVisible, setConfirmLogoutVisible] = useState(false); // New state for confirmation modal
  const [serviceModalVisible, setServiceModalVisible] = useState(false);
  const {mobileNumber, approved} = route.params;
  const apiUrl = Config.REACT_APP_API_URL;
  const {width, height} = Dimensions.get('window');
  const [unseenTransactionCount, setUnseenTransactionCount] = useState(0);
  const [unseenSettlementsCount, setUnseenSettlementsCount] = useState(0);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [unseenTransactions, setUnseenTransactions] = useState([]);
  const [unseenSettlements, setUnseenSettlements] = useState([]);
  const isLargeScreen = width > 600;
  const viewShotRef = useRef(null);
  const dropdownRef = useRef(null);

  const copyToClipboard = () => {
    Clipboard.setString(upiID);
    setAlertVisible2(true);
  };

  const downloadScreenshot = async () => {
    setIsScreenshotTaking(true);
    try {
      const uri = await viewShotRef.current.capture();
      const filePath = `${RNFS.PicturesDirectoryPath}/${userBusinessName}_qr_screenshot.png`;
      const fileExists = await RNFS.exists(uri);
      if (!fileExists) {
        return;
      }
      await RNFS.moveFile(uri, filePath);
      setAlertVisible3(true);
    } catch (error) {
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
    } finally {
      setIsScreenshotTaking(false);
    }
  };

  useEffect(() => {
    const listener = Appearance.addChangeListener(({colorScheme}) => {
      setColorScheme(colorScheme);
    });
    return () => listener.remove();
  }, []);

  const fetchTransactionData = async () => {
    try {
      const lastSeenTransactionTime = await AsyncStorage.getItem(
        '@last_seen_transaction_time',
      );

      const response = await fetch(`${apiUrl}api/fundorder/createfundorder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({mobileNumber}),
      });
      const data = await response.json();
      if (data && data.data && data.data.fundOrderList) {
        setCurrentDateTransaction(data.totalAmountForCurrentDate);
        setTransactionsForCurrentDate(data.numberOfTransactionsForCurrentDate);
      }

      if (data && data.data && data.data.fundOrderList.length > 0) {
        const unseenTransactions = data.data.fundOrderList.filter(
          transaction => {
            return (
              new Date(transaction.txnTime) > new Date(lastSeenTransactionTime)
            );
          },
        );
        setUnseenTransactions(unseenTransactions);
        setUnseenTransactionCount(unseenTransactions.length);
        await AsyncStorage.setItem(
          '@unseenTransactionsCount',
          unseenTransactions.length.toString(),
        );
      }
    } catch (error) {
      // console.error(error);
    }
  };

  const fetchSettlementsData = async () => {
    try {
      const lastSeenSettlementTime = await AsyncStorage.getItem(
        '@last_seen_settlement_time',
      );

      const response = await fetch(`${apiUrl}api/fundsettle/createfundsettle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({mobileNumber}),
      });
      const data = await response.json();

      if (data && data.data && data.data.fundSettleList.length > 0) {
        const unseenSettlements = data.data.fundSettleList.filter(
          settlement => {
            return (
              new Date(settlement.txnTime) > new Date(lastSeenSettlementTime)
            );
          },
        );
        setUnseenSettlements(unseenSettlements);
        setUnseenSettlementsCount(unseenSettlements.length);
        await AsyncStorage.setItem(
          '@unseenSettlementsCount',
          unseenSettlements.length.toString(),
        );
      }
    } catch (error) {
      // console.error(error);
    }
  };

  // fetchTransactionData();
  // fetchSettlementsData();

  const refreshDashboard = async () => {
    setActiveOption(null);
    setIsDropdownVisible(false);
    setUnseenTransactions([]);
    setUnseenTransactionCount(0);
    setUnseenSettlements([]);
    setUnseenSettlementsCount(0);
    setQrImage(null);
    setUserData(null);
    setUserBusinessName('');
    setUserId('');
    setUPIId('');
    setCurrentDateTransaction('');
    setTransactionsForCurrentDate(null);

    // Fetch the user data again
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
        const imageStr = Buffer.from(data.userData.profilePhoto.data).toString(
          'base64',
        );
        setUserData(base64Flag + imageStr);
        setUserId(data.userData.id);
        setUserBusinessName(data.userData.businessname);
      })
      .catch(error => {
        Alert.alert('Error', 'Failed to fetch user data');
      });

    // Fetch the QR code again
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
          const qrImageStr = data;
          setQrImage(
            `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
              qrImageStr.data.qrString,
            )}&size=150x150`,
          );
          setUPIId(qrImageStr.data.qrString.slice(21, 53));
        }
      })
      .catch(error => {
        Alert.alert('Error', 'Failed to generate QR code');
      });

    // Fetch transaction and settlement data again
    await fetchTransactionData();
    await fetchSettlementsData();
  };

  useEffect(() => {
    fetchTransactionData();
    fetchSettlementsData();
  }, []);
  // useEffect(() => {
  //   const loadUnseenTransactionCount = async () => {
  //     try {
  //       const storedTransactionCount = await AsyncStorage.getItem(
  //         '@unseenTransactionsCount',
  //       );

  //       if (storedTransactionCount !== null) {
  //         setUnseenTransactionCount(parseInt(storedTransactionCount, 10));
  //       }
  //     } catch (error) {}
  //   };
  //   loadUnseenTransactionCount();

  //   const loadUnseenSettlementsCount = async () => {
  //     try {
  //       const storedSettlementCount = await AsyncStorage.getItem(
  //         '@unseenSettlementsCount',
  //       );
  //       if (storedSettlementCount !== null) {
  //         setUnseenSettlementsCount(parseInt(storedSettlementCount, 10));
  //       }
  //     } catch (error) {}
  //   };
  //   loadUnseenSettlementsCount();
  // }, []);

  const handleTransactionClick = async transaction => {
    setIsDropdownVisible(false);
    console.log(unseenTransactions);

    try {
      navigation.navigate('Transactions Log', {
        mobileNumber: mobileNumber,
        transaction: {
          txnId: transaction.txnId,
          payerVPA: transaction.payerVPA,
          amount: transaction.amount,
          txnTime: transaction.txnTime,
        },
      });

      // setUnseenTransactions(prevTransactions =>
      //   prevTransactions.filter(item => item.txnId !== transaction.txnId),
      // );

      // const newUnseenTransactionCount = 0;
      // setUnseenTransactionCount(newUnseenTransactionCount);

      setUnseenTransactions([]);
      setUnseenTransactionCount(0);

      await AsyncStorage.setItem(
        '@unseenTransactionsCount',
        newUnseenTransactionCount.toString(),
      );
    } catch (error) {}
  };

  const handleSettlementsClick = async settlement => {
    setIsDropdownVisible(false);
    try {
      navigation.navigate('Settlement', {
        mobileNumber: mobileNumber,
        settlement: {
          txnId: settlement.txnId,
          responseMessage: settlement.responseMessage,
          amount: settlement.amount,
          txnTime: settlement.txnTime,
        },
      });
      // setUnseenSettlements(prevSettlements =>
      //   prevSettlements.filter(item => item.txnId !== settlement.txnId),
      // );
      // const newUnseenSettlementCount = 0;
      // setUnseenSettlementsCount(newUnseenSettlementCount);
      setUnseenSettlements([]);
      setUnseenSettlementsCount(0);
      await AsyncStorage.setItem(
        '@unseenSettlementsCount',
        newUnseenSettlementCount.toString(),
      );
    } catch (error) {}
  };

  const handleBellClick = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  useEffect(() => {
    if (approved === false) {
      Alert.alert(
        'User is not approved',
        'You need to be approved from Admin end to view your settlement and transactions',
        [{text: 'OK', onPress: () => console.log('OK pressed')}],
        {cancelable: false},
      );
    }

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
        const imageStr = Buffer.from(data.userData.profilePhoto.data).toString(
          'base64',
        );
        setUserData(base64Flag + imageStr);
        setUserId(data.userData.id);
        setUserBusinessName(data.userData.businessname);
      })
      .catch(error => {
        Alert.alert('Error', 'Failed to fetch user data');
      });

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
          const qrImageStr = data;
          setQrImage(
            `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
              qrImageStr.data.qrString,
            )}&size=150x150`,
          );

          setUPIId(qrImageStr.data.qrString.slice(21, 53));
        }
      })
      .catch(error => {
        Alert.alert('Error', 'Failed to generate QR code');
      });

    // const fetchTransactionData = async () => {
    //   try {
    //     const lastSeenTransactionTime = await AsyncStorage.getItem(
    //       '@last_seen_transaction_time',
    //     );

    //     const response = await fetch(`${apiUrl}api/fundorder/createfundorder`, {
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/json',
    //       },
    //       body: JSON.stringify({mobileNumber}),
    //     });
    //     const data = await response.json();
    //     if (data && data.data && data.data.fundOrderList) {
    //       setCurrentDateTransaction(data.totalAmountForCurrentDate);
    //       setTransactionsForCurrentDate(
    //         data.numberOfTransactionsForCurrentDate,
    //       );
    //     }

    //     if (data && data.data && data.data.fundOrderList.length > 0) {
    //       const unseenTransactions = data.data.fundOrderList.filter(
    //         transaction => {
    //           return (
    //             new Date(transaction.txnTime) >
    //             new Date(lastSeenTransactionTime)
    //           );
    //         },
    //       );
    //       setUnseenTransactions(unseenTransactions);
    //       setUnseenTransactionCount(unseenTransactions.length);
    //       await AsyncStorage.setItem(
    //         '@unseenTransactionsCount',
    //         unseenTransactions.length.toString(),
    //       );
    //     }
    //   } catch (error) {
    //     // console.error(error);
    //   }
    // };

    // const fetchSettlementsData = async () => {
    //   try {
    //     const lastSeenSettlementTime = await AsyncStorage.getItem(
    //       '@last_seen_settlement_time',
    //     );

    //     const response = await fetch(
    //       `${apiUrl}api/fundsettle/createfundsettle`,
    //       {
    //         method: 'POST',
    //         headers: {
    //           'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify({mobileNumber}),
    //       },
    //     );
    //     const data = await response.json();

    //     if (data && data.data && data.data.fundSettleList.length > 0) {
    //       const unseenSettlements = data.data.fundSettleList.filter(
    //         settlement => {
    //           return (
    //             new Date(settlement.txnTime) > new Date(lastSeenSettlementTime)
    //           );
    //         },
    //       );
    //       setUnseenSettlements(unseenSettlements);
    //       setUnseenSettlementsCount(unseenSettlements.length);
    //       await AsyncStorage.setItem(
    //         '@unseenSettlementsCount',
    //         unseenSettlements.length.toString(),
    //       );
    //     }
    //   } catch (error) {
    //     // console.error(error);
    //   }
    // };

    // fetchTransactionData();
    // fetchSettlementsData();

    const backAction = () => {
      if (navigation.isFocused()) {
        Alert.alert('Exit App', 'Do you want to exit?', [
          {
            text: 'Cancel',
            onPress: () => null,
            style: 'cancel',
          },
          {
            text: 'YES',
            onPress: () => BackHandler.exitApp(),
          },
        ]);
        return true;
      }
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [approved, mobileNumber]);

  useFocusEffect(
    React.useCallback(() => {
      setActiveOption(null);
    }, []),
  );

  const capitalizeWords = str => {
    return str.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
  };

  const handleMyDetails = () => {
    setIsDropdownVisible(false);
    setActiveOption('My Details');
    navigation.navigate('My Details', {mobileNumber, approved});
  };

  const confirmLogout = async () => {
    setIsDropdownVisible(false);
    try {
      await AsyncStorage.removeItem('@user_token');
      await AsyncStorage.removeItem('@user_approved');

      setAlertVisible(true);
      setTimeout(() => {
        setAlertVisible(false);
        navigation.reset({
          index: 0,
          routes: [{name: 'Mobile Number'}],
        });
      }, 2000);
    } catch (error) {}
  };

  const cancelLogout = () => {
    setConfirmLogoutVisible(false); // Hide confirmation modal
  };

  const handleServiceIconPress = name => {
    setIsDropdownVisible(false);
    setServiceName(name);
    setServiceModalVisible(true);
    const timestamp = new Date().toISOString();

    axios
      .post(`${apiUrl}api/admin/userActivity`, {
        mobileNumber,
        serviceName: name,
        timestamp,
      })
      .then(response => {})
      .catch(error => {
        Alert.alert('Error', 'Failed to record service click');
      });
  };

  return (
    <Pressable
      style={styles.container}
      onPress={() => setIsDropdownVisible(false)}>
      <View style={styles.header}>
        <View style={styles.profileButtonWrapper}>
          <TouchableOpacity>
            <Image
              source={
                userData?.startsWith('data:image/jpeg;base64,') &&
                userData.length > 'data:image/jpeg;base64,'.length
                  ? {uri: userData}
                  : require('../../assets/images/user.png')
              }
              style={styles.profileImage}
            />
          </TouchableOpacity>
          <View style={styles.profileInfoWrapper}>
            <Text style={styles.businessName}>
              Hello! {capitalizeWords(userBusinessName)}
            </Text>
            <Text
              style={[
                styles.approvalText,
                approved ? styles.approvedText : styles.unapprovedText,
              ]}>
              {approved ? 'Approved User' : 'Unapproved User'}
            </Text>
          </View>
        </View>
        <View style={styles.iconWrapper}>
          <TouchableOpacity onPress={handleBellClick}>
            <Image
              source={require('../../assets/images/bell.png')}
              style={styles.navbarIcon}
            />
            {(unseenTransactionCount > 0 || unseenSettlementsCount > 0) && (
              <View style={styles.badgeContainer}>
                <Text style={styles.badgeText}>
                  {unseenTransactionCount + unseenSettlementsCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>

          {(unseenTransactionCount > 0 || unseenSettlementsCount > 0) &&
            isDropdownVisible && (
              <TouchableOpacity
                style={styles.overlay} // Add a full-screen overlay to detect clicks outside
                activeOpacity={1}
                onPressOut={() => setIsDropdownVisible(false)}>
                <View style={styles.dropdownContainer}>
                  {unseenTransactions.length > 0 && (
                    <>
                      <Text style={styles.dropdownTitle}>New Transactions</Text>
                      {unseenTransactions.slice(0, 2).map(transaction => (
                        <TouchableOpacity
                          style={styles.dropdownDataRow}
                          key={transaction.txnId}
                          onPress={() => {
                            setUnseenTransactions([]);
                            setUnseenTransactionCount(0);
                            handleTransactionClick(transaction);
                          }}>
                          <View style={styles.dropdownData}>
                            <Text style={styles.dropdownDataVPA}>
                              {transaction.payerVPA}
                            </Text>
                            <Text style={styles.dropdownDataAmount}>
                              ₹{transaction.amount}
                            </Text>
                          </View>
                          <Text style={styles.dropdownDataTime}>
                            {transaction.txnTime}
                          </Text>
                        </TouchableOpacity>
                      ))}
                      {unseenTransactions.length > 5 && (
                        <TouchableOpacity
                          style={styles.viewMoreButton}
                          onPress={handleTransactionClick}>
                          <Text style={styles.viewMoreText}>View More</Text>
                        </TouchableOpacity>
                      )}
                    </>
                  )}

                  {unseenTransactions.length > 0 &&
                    unseenSettlements.length > 0 && (
                      <View style={styles.separator} />
                    )}

                  {unseenSettlements.length > 0 && (
                    <>
                      <Text style={styles.dropdownTitle}>New Settlements</Text>
                      {unseenSettlements.slice(0, 2).map(settlement => (
                        <TouchableOpacity
                          style={styles.dropdownDataRow}
                          key={settlement.txnId}
                          onPress={() => {
                            setUnseenSettlements([]);
                            setUnseenSettlementsCount(0);
                            handleSettlementsClick(settlement);
                          }}>
                          <View style={styles.dropdownData}>
                            <Text style={styles.dropdownDataVPA}>
                              {settlement.responseMessage ===
                              'Seller settlement initiated successfully'
                                ? 'Seller settlement successful'
                                : 'Seller settlement failed'}
                            </Text>
                            <Text style={styles.dropdownDataAmount}>
                              ₹{settlement.amount}
                            </Text>
                          </View>
                          <Text style={styles.dropdownDataTime}>
                            {settlement.txnTime}
                          </Text>
                        </TouchableOpacity>
                      ))}
                      {unseenSettlements.length > 5 && (
                        <TouchableOpacity
                          style={styles.viewMoreButton}
                          onPress={handleSettlementsClick}>
                          <Text style={styles.viewMoreText}>View More</Text>
                        </TouchableOpacity>
                      )}
                    </>
                  )}
                </View>
              </TouchableOpacity>
            )}

          <TouchableOpacity onPress={() => setConfirmLogoutVisible(true)}>
            <View style={styles.logoutIconBackground}>
              <Image
                source={require('../../assets/images/logout.png')}
                style={styles.logoutIcon}
              />
            </View>
          </TouchableOpacity>
          {/* <TouchableOpacity onPress={refreshDashboard}>
            <View style={styles.logoutIconBackground}>
              <Image
                source={require('../../assets/images/refresh.png')}
                style={styles.logoutIcon}
              />
            </View>
          </TouchableOpacity> */}
        </View>
      </View>
      <View style={styles.content}>
        <View style={styles.section1}>
          <View style={styles.headerContainer}>
            <Text style={styles.sectionHeaderSubheading}>
              {!transactionForCurrentDate || transactionForCurrentDate === 0
                ? '0 Number of Transactions'
                : `${transactionForCurrentDate} Number of Transactions`}
            </Text>
            <Text style={styles.sectionHeader}>Today's Transaction Amount</Text>
            <Text style={styles.sectionAmount}>
              ₹{currentDateTransaction}/-
            </Text>
          </View>
        </View>

        <View style={styles.section2}>
          <TouchableOpacity
            style={[styles.box, !approved && styles.box]}
            onPress={handleTransactionClick}
            disabled={!approved}>
            <Image
              source={require('../../assets/images/Transactions.png')}
              style={styles.image}
            />
            <View style={[styles.tbutton, !approved && styles.disabledButton]}>
              <Text style={styles.buttonText}>Transactions</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.box, !approved && styles.box]}
            onPress={handleSettlementsClick}
            disabled={!approved}>
            <Image
              source={require('../../assets/images/Settlements.png')}
              style={styles.image}
            />
            <View style={[styles.tbutton, !approved && styles.disabledButton]}>
              <Text style={styles.buttonText}>Settlements</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.section3}>
          <Text style={styles.sectionHeader}>PoolPe Business Services</Text>
          <View style={styles.servicesWrapper}>
            <View style={styles.serviceIconsAlignment}>
              <TouchableOpacity
                style={styles.serviceIcon}
                onPress={() => handleServiceIconPress('Smart Speaker')}>
                <View style={styles.serviceImageContainer}>
                  <Image
                    source={require('../../assets/images/smart-speaker.png')}
                    style={styles.serviceImage}
                  />
                  <Text style={styles.serviceImageText}>Smart Speaker</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.serviceIcon}
                onPress={() => handleServiceIconPress('POS Machine')}>
                <View style={styles.serviceImageContainer}>
                  <Image
                    source={require('../../assets/images/pos-terminal.png')}
                    style={styles.serviceImage}
                  />
                  <Text style={styles.serviceImageText}>POS Machine</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.serviceIcon}
                onPress={() => handleServiceIconPress('Business Loan')}>
                <View style={styles.serviceImageContainer}>
                  <Image
                    source={require('../../assets/images/personal-loan.png')}
                    style={styles.serviceImage}
                  />
                  <Text style={styles.serviceImageText}>Business Loan</Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.serviceIconsAlignment}>
              <TouchableOpacity
                style={styles.serviceIcon}
                onPress={() => handleServiceIconPress('Shop Insurance')}>
                <View style={styles.serviceImageContainer}>
                  <Image
                    source={require('../../assets/images/local-store.png')}
                    style={styles.serviceImage}
                  />
                  <Text style={styles.serviceImageText}>Shop Insurance</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.serviceIcon}
                onPress={() => handleServiceIconPress('Fast Tag Services')}>
                <View style={styles.serviceImageContainer}>
                  <Image
                    source={require('../../assets/images/fast-tag.png')}
                    style={styles.serviceImage}
                  />
                  <Text style={styles.serviceImageText}>Fast Tag Services</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
      <Modal
        visible={isQrModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setQrModalVisible(false)}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <ViewShot
                ref={viewShotRef}
                options={{format: 'png', quality: 0.9}}
                style={styles.captureView}>
                {qrImage ? (
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
                ) : (
                  <View style={styles.noDataContainer}>
                    <Text style={styles.noDataText}>
                      No QR data available for this user
                    </Text>
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
            onPress={() => setQrModalVisible(false)}>
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

      <Modal
        visible={confirmLogoutVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setConfirmLogoutVisible(false)}>
        <Pressable
          style={styles.logoutModalBackground}
          onPress={() => setConfirmLogoutVisible(false)}>
          <View style={styles.logoutConfirmModal}>
            <Text style={styles.modalTitle}>
              Are you sure you want to logout?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={confirmLogout}>
                <Text style={styles.modalButtonText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={cancelLogout}>
                <Text style={styles.modalButtonText}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Modal>

      <Modal
        visible={serviceModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setServiceModalVisible(false)}>
        <Pressable
          style={styles.logoutModalBackground}
          onPress={() => setServiceModalVisible(false)}>
          <View style={styles.serviceModal}>
            <Text style={styles.modalTitle}>
              Thank you for applying for the{' '}
              <Text style={{fontWeight: 'bold', color: '#2058BB'}}>
                {serviceName}
              </Text>{' '}
              service. Our representative will contact you shortly.
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setServiceModalVisible(false)}>
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      <BottomNavigationBar
        navItems={[
          {
            label: 'Account',
            icon: require('../../assets/images/Profile.png'),
            onPress: handleMyDetails,
            style: {
              tintColor: 'blue', // Example: change icon color to blue
              width: 30, // Example: set width
              height: 30, // Example: set height
            },
          },
          {
            label: 'QR Code',
            icon: require('../../assets/images/qr.png'),
            onPress: () => setQrModalVisible(true),
          },
        ]}
        activeOption={activeOption}
      />
      <AlertModal
        visible={alertVisible}
        message="You are being logged out of the application"
        onDismiss={() => setAlertVisible(false)}
      />
    </Pressable>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4FA', // This background color will be visible below section3
  },
  header: {
    width: '100%',
    paddingVertical: responsiveHeight(2),
    paddingHorizontal: responsiveWidth(5),
    backgroundColor: '#2058BB',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 1000,
  },
  profileButtonWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileInfoWrapper: {
    marginLeft: responsiveWidth(2),
  },
  profileImage: {
    width: responsiveWidth(10),
    height: responsiveWidth(10),
    borderRadius: responsiveWidth(5),
  },
  iconWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: responsiveWidth(3),
    position: 'relative',
  },
  closeIcon: {
    flexDirection: 'row',
    justifyContent: 'center',
    zIndex: 1,
    marginTop: 10,
  },
  closeIconImage: {
    width: responsiveWidth(5),
    height: responsiveWidth(5),
    resizeMode: 'contain',
  },
  navbarIcon: {
    width: responsiveWidth(7),
    height: responsiveWidth(7),
    marginHorizontal: responsiveWidth(2.5),
  },
  logoutIconBackground: {
    backgroundColor: '#4078CD',
    borderRadius: responsiveWidth(5),
    width: responsiveWidth(10),
    height: responsiveWidth(10),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: responsiveWidth(1),
  },
  logoutIcon: {
    width: responsiveWidth(7),
    height: responsiveWidth(7),
    padding: responsiveWidth(3),
    borderRadius: responsiveWidth(2.5),
  },
  dotContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: responsiveWidth(1.25),
  },
  dot: {
    color: 'black',
    fontSize: responsiveFontSize(3),
    lineHeight: responsiveFontSize(2),
  },
  approvalText: {
    fontSize: responsiveFontSize(1.5),
  },
  approvedText: {
    color: 'green',
    marginTop: responsiveHeight(0.5),
    backgroundColor: 'white',
    width: '100%',
    textAlign: 'center',
    borderRadius: 4,
    paddingHorizontal: responsiveWidth(1),
    paddingVertical: responsiveHeight(0.5),
  },
  unapprovedText: {
    color: 'red',
    marginTop: responsiveHeight(0.5),
    backgroundColor: 'white',
    textAlign: 'center',
    width: '100%',
    borderRadius: 4,
    paddingHorizontal: responsiveWidth(1),
    paddingVertical: responsiveHeight(0.5),
  },
  content: {
    flexDirection: 'column',
    height: '100%',
    paddingHorizontal: responsiveWidth(4),
    paddingVertical: responsiveHeight(1.5),
  },
  section1: {
    flexDirection: 'column',
    height: responsiveHeight(15),
    paddingTop: responsiveHeight(2),
    backgroundColor: '#fff',
    borderRadius: responsiveWidth(3),
    borderColor: 'rgba(102, 102, 102, 0.20)',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    paddingHorizontal: responsiveWidth(4),
    paddingVertical: responsiveHeight(1.5),
  },
  section2: {
    flexDirection: 'row',
    height: responsiveHeight(28),
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: responsiveWidth(2),
    paddingHorizontal: responsiveWidth(1),
  },
  section3: {
    flexDirection: 'column',
    height: responsiveHeight(32),
    backgroundColor: '#fff',
    borderRadius: responsiveWidth(3),
    paddingHorizontal: responsiveWidth(4),
    paddingTop: responsiveHeight(1.25),
    borderColor: 'rgba(102, 102, 102, 0.20)',
    borderWidth: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  box: {
    width: '45%',
    flexDirection: 'column',
    alignItems: 'center',
    margin: responsiveWidth(1),
  },
  image: {
    width: '120%',
    height: responsiveHeight(20),
    resizeMode: 'cover',
  },
  tbutton: {
    width: '100%',
    backgroundColor: '#2058BB',
    paddingVertical: responsiveHeight(1.25),
    marginTop: responsiveHeight(-0.25),
    borderBottomLeftRadius: responsiveWidth(5),
    borderBottomRightRadius: responsiveWidth(5),
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  buttonText: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: responsiveFontSize(2),
    color: '#fff',
  },
  sectionHeader: {
    fontSize: responsiveFontSize(2),
    fontWeight: '500',
    color: 'black',
  },
  sectionHeaderSubheading: {
    marginTop: responsiveHeight(0.25),
    fontWeight: 'bold',
  },
  sectionHeaderAmount: {
    fontSize: responsiveFontSize(2),
    marginTop: responsiveHeight(0.5),
    color: 'black',
  },
  sectionAmount: {
    fontSize: responsiveFontSize(4.5),
    fontWeight: 'bold',
    color: '#37474F',
    paddingBottom: responsiveHeight(2),
  },
  servicesWrapper: {
    width: '100%',
    flexDirection: 'column',
    alignItems: 'flex-start',
    // paddingTop: responsiveHeight(0.5),
  },
  serviceIcon: {
    marginHorizontal: responsiveWidth(5),
    marginVertical: responsiveHeight(2),
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  serviceImage: {
    width: responsiveWidth(10),
    height: responsiveWidth(10),
  },
  serviceImageText: {
    width: responsiveWidth(16),
    textAlign: 'center',
    color: 'black',
  },
  serviceIconsAlignment: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  serviceImageContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logoutModalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black background
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: responsiveWidth(5),
    borderRadius: responsiveWidth(2.5),
    alignItems: 'center',
  },
  captureView: {
    backgroundColor: 'white',
    borderRadius: responsiveWidth(2),
  },
  logoutConfirmModal: {
    backgroundColor: '#fff',
    padding: responsiveWidth(5),
    borderRadius: responsiveWidth(2.5),
    alignItems: 'center',
  },
  modalIconClick: {
    backgroundColor: '#fff',
    padding: responsiveWidth(5),
    borderRadius: responsiveWidth(2.5),
    alignItems: 'center',
    justifyContent: 'center',
  },
  enlargedQrImageContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  enlargedQrImage: {
    width: responsiveWidth(60),
    height: responsiveWidth(60),
    resizeMode: 'contain',
  },
  businessName: {
    fontSize: responsiveFontSize(2),
    color: '#fff',
  },
  qrContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBusinessName: {
    textAlign: 'center',
    marginTop: responsiveHeight(1.25),
    marginBottom: responsiveHeight(1.25),
    width: responsiveWidth(75),
    color: '#2058BB',
    fontWeight: 'bold',
    fontSize: responsiveFontSize(4),
  },
  businessUPIID: {
    color: '#37474FCC',
    fontSize: responsiveFontSize(2),
  },
  modalTitle: {
    fontSize: responsiveFontSize(2.25),
    marginBottom: responsiveHeight(2),
    color: '#000000',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '60%',
  },
  modalButton: {
    backgroundColor: '#2058BB',
    padding: responsiveWidth(2.5),
    borderRadius: responsiveWidth(2.5),
  },
  upiIDContainer: {
    marginTop: responsiveHeight(1.25),
    flexDirection: 'row',
    gap: responsiveWidth(2),
    alignItems: 'center',
    justifyContent: 'center',
  },
  copyIconContainer: {
    marginLeft: responsiveWidth(0.75),
  },
  copyIcon: {
    width: responsiveWidth(5),
    height: responsiveWidth(5),
  },
  yesbanklogoimage: {
    backgroundColor: '#2058BB',
    height: responsiveWidth(10),
    width: responsiveWidth(10),
  },
  downloadShareQRContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: responsiveHeight(2.5),
    gap: responsiveWidth(10),
    justifyContent: 'space-between',
    padding: responsiveWidth(2.5),
    backgroundColor: 'white',
  },
  downloadQR: {
    backgroundColor: 'white',
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: responsiveWidth(11),
    paddingVertical: responsiveHeight(1),
    borderRadius: responsiveWidth(2.5),
    marginBottom: responsiveHeight(0.5),
  },
  shareQR: {
    backgroundColor: 'white',
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: responsiveWidth(11),
    paddingVertical: responsiveHeight(1),
    borderRadius: responsiveWidth(2.5),
    marginBottom: responsiveHeight(0.5),
  },
  modalButtonText: {
    color: '#fff',
    fontSize: responsiveFontSize(2),
  },
  serviceModal: {
    backgroundColor: '#fff',
    padding: responsiveWidth(5),
    borderRadius: responsiveWidth(2.5),
    alignItems: 'center',
  },
  noDataContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: responsiveWidth(5),
  },
  noDataText: {
    fontSize: responsiveFontSize(2.25),
    color: 'black',
    textAlign: 'center',
    marginBottom: responsiveHeight(1.25),
  },
  badgeContainer: {
    position: 'absolute',
    left: 24,
    top: -8,
    backgroundColor: 'red',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  dropdownContainer: {
    width: 220,
    position: 'absolute',
    top: 55, // adjust based on your layout
    left: -165, // adjust based on your layout
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    zIndex: 1000,
  },
  dropdownTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#2058BB',
    textDecorationLine: 'underline',
  },
  dropdownData: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  dropdownDataVPA: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
  },
  dropdownDataAmount: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  dropdownDataRow: {
    // borderWidth: 1,
    // borderColor: '#444', // Light grey border
    borderRadius: 10, // Optional: to round the corners of each row
    padding: 8,
    backgroundColor: '#2058BB',
    marginBottom: 5,
    marginTop: 10,
  },
  dropdownDataTime: {
    fontSize: 12, // Smaller font for the time
    color: '#fff', // Grey color for less emphasis
    marginTop: -15,
  },
  separator: {
    height: 2,
    backgroundColor: 'black', // Light grey line
    marginVertical: 5,
  },
});
