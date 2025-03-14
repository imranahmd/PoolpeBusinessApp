import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
  StyleSheet,
} from 'react-native';

const BusinessType = ({navigation, route}) => {
  const {mobileNumber} = route.params;
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState(null);

  const handleBoxClick = business => {
    setSelectedBusiness(business);
    setModalVisible(true);
  };

  const handleSkip = () => {
    navigation.navigate('Registration', {
      mobileNumber: mobileNumber,
      businessType: '', // Set businessType to null when skipping
      mcc: '', // Set mcc to null when skipping
    });
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const boxData = [
    {
      id: 1,
      name: 'Groceries and Essentials',
      mcc: 5411,
      description:
        ' Supermarkets / Convenience Stores / Specialty Grocers / Bulk Retailers / Household Supplies etc.',
      image: require('../../assets/images/Groceries.png'),
    },
    {
      id: 2,
      name: 'Food and Refreshments',
      mcc: 5812,
      description:
        'Restaurants / Cafes / Bars / Food Trucks / Catering Services etc.',
      image: require('../../assets/images/Food.png'),
    },
    {
      id: 3,
      name: 'Fashion and Retail',
      mcc: 5691,
      description:
        'Clothing Stores / Shoe Shops / Jewelry & Accessories / Department Stores / Thrift Shops etc.',
      image: require('../../assets/images/Fashion.png'),
    },
    {
      id: 4,
      name: 'Service and Utilities',
      mcc: 7629,
      description:
        ' Laundromats / Dry Cleaners / Home Repair / Maintenance Services / Waste Management etc.',
      image: require('../../assets/images/Service.png'),
    },
    {
      id: 5,
      name: 'Healthcare & Wellness ',
      mcc: 8062,
      description:
        ' Pharmacies / Clinics / Fitness Centers / Salons / Spas etc.',
      image: require('../../assets/images/Healthcare.png'),
    },
    {
      id: 6,
      name: 'Fuel Supply',
      mcc: 5172,
      description:
        'Gas Stations / Diesel Fuel / Propane / Electric Vehicle Charging / Aviation Fuel etc.',
      image: require('../../assets/images/Fuel.png'),
    },
    {
      id: 7,
      name: 'Transportation and Commute',
      mcc: 4131,
      description:
        'Public Transit / Rideshare / Taxis / Car Rentals / Parking Services etc.',
      image: require('../../assets/images/Transport.png'),
    },
    {
      id: 8,
      name: 'Financial Services',
      mcc: 9311,
      description:
        'Banks / ATMs / Credit Unions / Insurance Providers / Investment Firms etc.',
      image: require('../../assets/images/Finance.png'),
    },
    {
      id: 9,
      name: 'Fun and Entertainment',
      mcc: 7832,
      description:
        'Movie Theaters / Arcades / Bowling Alleys / Live Music Venues / Sporting Venues etc.',
      image: require('../../assets/images/Entertainment.png'),
    },
    {
      id: 10,
      name: 'Accommodation and Stay',
      mcc: 7011,
      description:
        'Hotels / Motels / Vacation Rentals / Bed & Breakfasts / Campsites etc.',
      image: require('../../assets/images/Hotels.png'),
    },
    {
      id: 11,
      name: 'Other Business',
      description:
        'Office Supplies / Printing Services / IT Support / Consulting Firms / Wholesale Distributors etc.',
      image: require('../../assets/images/Others.png'),
    },
  ];

  return (
    <ScrollView style={{flex: 1, backgroundColor: '#fff'}}>
      <View>
        {/* Header Section */}
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

          <Text style={styles.headerTitle}>Business Type</Text>
        </View>

        {/* Main Content */}
        <View style={{paddingHorizontal: 20, paddingTop: 20}}>
          {/* <Text style={styles.mainTitle}>Business Type</Text> */}
          <Text style={styles.subTitle}>Select your Business Category</Text>
          <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
            <Text style={styles.skipButtonText}>Skip</Text>
          </TouchableOpacity>
          <View style={styles.boxParentContainer}>
            <View style={styles.boxContainer}>
              {boxData.map(item => (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => handleBoxClick(item)}
                  style={styles.box}>
                  <View style={styles.boxContent}>
                    <Text style={styles.boxTitle}>{item.name}</Text>
                    {/* <Text style={styles.boxDescription}>{item.description}</Text> */}
                    <View style={styles.circularImageContainer}>
                      <View style={styles.circularImageBackground} />
                      <Image
                        source={item.image}
                        style={styles.circularImage}
                        resizeMode="cover"
                      />
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </View>

      {/* Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCloseModal}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.selectedBoxContainer}>
              {selectedBusiness && (
                <>
                  <Image
                    source={selectedBusiness.image}
                    style={styles.selectedBoxImage}
                    resizeMode="cover"
                  />
                  <Text style={styles.selectedBoxTitle}>
                    {selectedBusiness.name}
                  </Text>
                  <Text style={styles.selectedBoxDescription}>
                    {selectedBusiness.description}
                  </Text>
                </>
              )}
            </View>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  {backgroundColor: '#E9EEF8', fontWeight: 'bold'},
                ]}
                onPress={handleCloseModal}>
                <Text style={{color: '#2058BB', fontWeight: 'bold'}}>
                  Edit choice
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, {backgroundColor: '#2058BB'}]}
                onPress={() => {
                  handleCloseModal();
                  navigation.navigate('Registration', {
                    mobileNumber: mobileNumber,
                    businessType: selectedBusiness.name,
                    mcc: selectedBusiness.mcc,
                  });
                }}>
                <Text
                  style={{color: '#fff', fontWeight: 'bold', letterSpacing: 1}}>
                  Continue
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
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
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  subTitle: {
    marginTop: 10,
    color: '#000',
    fontWeight: 'bold',
    fontSize: 18,
  },
  skipButton: {
    alignSelf: 'flex-end',
    marginTop: -25,
    marginRight: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  skipButtonText: {
    color: '#2058BB',
    fontSize: 16,
    fontWeight: 'bold',
  },
  boxParentContainer: {
    
  },
  boxContainer: {
    flexDirection: 'row',
    justifyContent:'space-evenly',
    gap:3,
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 20,
    marginBottom: 20,
  },
  box: {
    width: '44%',
    height: 120,
    marginBottom: 30,
    marginRight: '2%',
    borderRadius: 20,
    // overflow: 'hidden',
  },
  boxContent: {
    borderWidth: 1,
    paddingTop: 10,
    // paddingHorizontal: 6,
    borderColor: '#ccc',
    height: 140, // Set fixed height for each box
    justifyContent: 'start',
    alignItems: 'center',
    borderRadius: 20,
    paddingHorizontal: 15,
    
  },
  boxTitle: {
    fontSize: 14,
    marginBottom: 10,
    width:120,
    color: '#000',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  boxDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
    textAlign: 'center',
  },
  circularImageContainer: {
    position: 'absolute',
    bottom: 10,
    top:60,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 4,
    marginBottom:10
  },
  circularImageBackground: {
    backgroundColor: '#C0D3F9',
    width: 90,
    height: 90,
    borderRadius: 60,
    position: 'absolute',
    zIndex: -1,
  },
  circularImage: {
    width: 70,
    height: 70,
    zIndex: 1,
    left: 2,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
  },
  selectedBoxContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  selectedBoxImage: {
    width: 80,
    height: 80,
  },
  selectedBoxTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
    color: '#37474F',
  },
  selectedBoxDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 5,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    paddingVertical: 14,
    paddingHorizontal: 25,
    borderRadius: 24,
    backgroundColor: 'black',
    height: 48,
    justifyContent: 'center',
    width: '48%',
    alignItems: 'center',
  },
});

export default BusinessType;
