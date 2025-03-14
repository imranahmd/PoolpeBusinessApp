import React, {useState,useCallback} from 'react';
import {View, Text, ScrollView, StyleSheet, Alert,BackHandler} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

const TermsAndCondition = ({navigation}) => {
  //   const {mobileNumber} = route.params;
  const [isChecked, setIsChecked] = useState(false);

  
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

  const handleCheckboxChange = newValue => {
    setIsChecked(newValue);
  };

  const handleProceed = () => {
    if (isChecked) {
      navigation.navigate('Add Password', {mobileNumber: mobileNumber});
    } else {
      Alert.alert('Please accept the terms and conditions to proceed.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>
        Terms and Conditions: Use of PoolPe Business
      </Text>

      <View style={styles.textContainer}>
        <Text style={styles.sectionHeading}>1. Introduction</Text>
        <Text style={styles.paragraph}>
          Welcome to PoolPe Business. These Terms and Conditions ("Terms")
          govern your use of our mobile software application and services
          ("Service"). By using our Service, you agree to be bound by these
          Terms.
        </Text>

        <Text style={styles.sectionHeading}>2. Definitions</Text>
        <Text style={styles.paragraph}>
          ● "User" refers to any individual using our software application.
          {'\n'}● "Service" refers to the financial transaction services
          provided by PoolPe Business.{'\n'}● "Transaction" refers to any
          operation conducted through the software application.
        </Text>

        <Text style={styles.sectionHeading}>3. Eligibility</Text>
        <Text style={styles.paragraph}>
          You must be capable in legal capacity as per Indian govt laws of
          entering into a legally binding agreement to use our Service.
        </Text>

        <Text style={styles.sectionHeading}>4. Account Registration</Text>
        <Text style={styles.paragraph}>
          To use our Service, you must create an account by providing accurate
          information. You are responsible for maintaining the confidentiality
          of your account credentials.
        </Text>

        <Text style={styles.sectionHeading}>5. User Responsibilities</Text>
        <Text style={styles.paragraph}>
          You agree to comply with all applicable laws and not to engage in any
          prohibited activities, such as fraudulent transactions.
        </Text>

        <Text style={styles.sectionHeading}>6. Financial Transactions</Text>
        <Text style={styles.paragraph}>
          Our software application allows you to perform various financial
          transactions. You agree to pay any applicable fees and adhere to
          transaction limits.
        </Text>

        <Text style={styles.sectionHeading}>7. Security and Privacy</Text>
        <Text style={styles.paragraph}>
          We implement security measures to protect your data. You are
          responsible for keeping your account secure. Please review PoolPe
          Business Privacy Policy document for more details.
        </Text>

        <Text style={styles.sectionHeading}>8. Data Collection and Use</Text>
        <Text style={styles.paragraph}>
          We collect and use your data as described in our Privacy Policy
          document. By using our Service, you consent to this data collection
          and use.
        </Text>

        <Text style={styles.sectionHeading}>9. Third-Party Services</Text>
        <Text style={styles.paragraph}>
          Our Service may include integrations with third-party services. You
          agree to comply with their terms and understand that we are not liable
          for their performance.
        </Text>

        <Text style={styles.sectionHeading}>10. Intellectual Property</Text>
        <Text style={styles.paragraph}>
          All content and intellectual property rights in the software
          application are owned by PoolPe Business. You are granted a limited
          license to use the software application for personal, non-commercial
          purposes.
        </Text>

        <Text style={styles.sectionHeading}>
          11. Disclaimers and Limitation of Liability
        </Text>
        <Text style={styles.paragraph}>
          Our Service is provided "as is" without warranties of any kind. We are
          not liable for any damages arising from your use of the Service.
        </Text>

        <Text style={styles.sectionHeading}>12. Indemnification</Text>
        <Text style={styles.paragraph}>
          You agree to indemnify and hold PoolPe Business harmless from any
          claims or liabilities arising from your use of the Service.
        </Text>

        <Text style={styles.sectionHeading}>13. Termination</Text>
        <Text style={styles.paragraph}>
          We may terminate your account for any violation of these Terms. Upon
          termination, your right to use the Service will cease immediately.
        </Text>

        <Text style={styles.sectionHeading}>14. Dispute Resolution</Text>
        <Text style={styles.paragraph}>
          These Terms are governed by the laws of India. Any disputes will be
          resolved through binding arbitration in Delhi.
        </Text>

        <Text style={styles.sectionHeading}>15. Changes to the Service</Text>
        <Text style={styles.paragraph}>
          We reserve the right to modify or discontinue the Service at any time.
          We will notify you of significant changes.
        </Text>

        <Text style={styles.sectionHeading}>16. Contact Information</Text>
        <Text style={styles.paragraph}>
          If you have any questions about these Terms, please contact us at
          help@PoolPe Business.co.in.
        </Text>

        <Text style={styles.sectionHeading}>17. Miscellaneous</Text>
        <Text style={styles.paragraph}>
          These Terms constitute the entire agreement between you and PoolPe
          Business. If any part of these Terms is found to be unenforceable, the
          remaining provisions will remain in full force and effect.
        </Text>
      </View>

      {/* ... other sections of the Terms and Conditions ... */}

      {/* <View style={styles.checkboxContainer}>
        <CheckBox
          value={isChecked}
          onValueChange={handleCheckboxChange}
          tintColors={{true: '#2058BB', false: '#888888'}}
        />
        <Text style={styles.checkboxLabel}>
          I agree to the Terms and Conditions
        </Text>
      </View> */}

      {/* <View style={styles.proceedButton}>
        <Button
          title="Proceed to Add Password"
          onPress={handleProceed}
          disabled={!isChecked}
          color="#2058BB"
        />
      </View> */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  textContainer: {
    marginBottom: 30,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: 'black',
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    color: 'black',
  },
  paragraph: {
    fontSize: 16,
    marginTop: 8,
    lineHeight: 24,
    color: 'black',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
  },
  checkboxLabel: {
    fontSize: 16,
    marginLeft: 8,
    color: 'black',
  },
  proceedButton: {
    marginTop: 24,
    marginBottom: 40,
    borderRadius: 8,
    overflow: 'hidden',
  },
});

export default TermsAndCondition;
