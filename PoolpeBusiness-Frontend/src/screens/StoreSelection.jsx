import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {useNavigation} from '@react-navigation/native'; // Import the navigation hook
import ScanToPayPhysicalStoreImage from '../components/AllIcons';

const StoreSelection = ({route}) => {
  const {mobileNumber} = route.params;
  const navigation = useNavigation(); // Get the navigation object

  const [selectedStore, setSelectedStore] = useState(null);

  const handleSelection = storeType => {
    setSelectedStore(storeType);
  };

  const handleContinue = () => {
    if (selectedStore) {
      navigation.navigate('Business Type', {mobileNumber: mobileNumber}); // Navigate to the "Business Type" screen
    }
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
        <Text style={styles.headerTitle}>Store Selection</Text>
        {/* <Image
          source={require('../../../../assets/images/profile1.png')}
          style={styles.iconImages}
        /> */}
      </View>

      <View style={styles.headerImageContainer}>
        <Image
          source={require('../../assets/images/Illustration.png')}
          style={styles.headerImage}
        />
      </View>

      <Text style={styles.title}>Let's get started!</Text>
      <Text style={styles.subtitle}>
        Choose your store type below or search your business category to get
        started.
      </Text>

      {/* <View style={styles.searchContainer}>
        <Image
          source={require('../../../../assets/images/search.png')}
          style={styles.iconImages}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search your business category"
          placeholderTextColor="#000"
        />
      </View> */}

      <View style={styles.boxContainer}>
        <TouchableOpacity
          style={[
            styles.box,
            selectedStore === 'Physical' && styles.selectedBox,
          ]}
          onPress={() => handleSelection('Physical')}>
          <Image
            source={require('../../assets/images/storefront.png')}
            style={styles.boxImage}
          />
          <Text style={styles.boxTitle}>Physical Store</Text>
          <Text style={styles.boxSubtitle}>
            For eg. Grocery store, wholesale store, Retail etc.
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.box,
            selectedStore === 'Digital' && styles.selectedBox,
          ]}
          onPress={() => handleSelection('Digital')}>
          <Image
            source={require('../../assets/images/digital_Store.png')}
            style={styles.boxImage}
          />
          <Text style={styles.boxTitle}>Digital Store</Text>
          <Text style={styles.boxSubtitle}>
            For eg. Instagram, Facebook, Shopify etc.
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.continueButton, !selectedStore && styles.disabledButton]}
        disabled={!selectedStore}
        onPress={handleContinue} // Call handleContinue onPress
      >
        <Text style={styles.continueButtonText}>Continue</Text>
      </TouchableOpacity>

      <View style={styles.assistanceContainer}>
        {/* <Text style={styles.assistanceTitle}>Need Assistance?</Text> */}
        {/* <Text style={styles.assistanceSubtitle}>
          Explore FAQs or raise a ticket for personalised assistance in our Help
          Center.
        </Text> */}
        <TouchableOpacity style={styles.helpCenterButton}>
          <Text style={styles.helpCenterButtonText}>Help Center</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#E6EDFD',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,

    backgroundColor: '#2058BB', // Set background color
    paddingVertical: 10, // Add vertical padding
  },
  headerText: {
    color: '#fff', // Set text color to white
    fontSize: 22, // Increased font size
    fontWeight: 'bold',
    padding: 20,
  },
  headerImageContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: '28%',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#E6EDFD',
    // Changed background color
  },
  backButton: {
    width: 48, // Increased width for larger touch target
    height: 48, // Increased height for larger touch target
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerImage: {
    width: '65%', // Increased width
    height: 180, // Increased height
    resizeMode: 'cover',
  },
  iconImages: {
    width: 30, // Increased width
    height: 30, // Increased height
    resizeMode: 'cover',
  },
  title: {
    color: '#000',
    fontSize: 26, // Increased font size
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    color: '#000',
    fontSize: 16, // Increased font size
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    height: 48,
    color: '#000',
  },
  boxContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  box: {
    width: '48%',
    padding: 15, // Increased padding
    borderRadius: 10,
    backgroundColor: '#E6EDFD',
    alignItems: 'center',
  },
  selectedBox: {
    borderColor: '#2058BB',
    borderWidth: 2,

  },
  boxImage: {
    width: 70, // Increased width
    height: 70, // Increased height
    resizeMode: 'contain',
    marginBottom: 10,
  },
  boxTitle: {
    fontSize: 18, // Increased font size
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
  },
  boxSubtitle: {
    fontSize: 14, // Increased font size
    textAlign: 'center',
    color: '#000',
  },
  continueButton: {
    backgroundColor: '#2058BB',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
    marginHorizontal: 20,
  },
  disabledButton: {
    backgroundColor: '#888',
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 18, // Increased font size
    fontWeight: 'bold',
  },
  assistanceContainer: {
    alignItems: 'center',
  },
  assistanceTitle: {
    color: '#000',
    fontSize: 18, // Increased font size
    fontWeight: 'bold',
    marginBottom: 5,
  },
  assistanceSubtitle: {
    color: '#000',
    fontSize: 14, // Increased font size
    textAlign: 'center',
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  helpCenterButton: {
    backgroundColor: '#E6EDFD',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  helpCenterButtonText: {
    color: '#000',
    fontSize: 18, // Increased font size
    fontWeight: 'bold',
  },
});

export default StoreSelection;
