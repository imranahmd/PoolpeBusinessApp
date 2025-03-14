import React, {useState,useCallback} from 'react';
import {View, Text, ScrollView, StyleSheet, Alert,BackHandler} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

const PrivacyPolicy = ({navigation}) => {
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
      navigation.navigate('Add Password');
    } else {
      Alert.alert('Please accept the terms and conditions to proceed.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Privacy Policy: PoolPe Business</Text>
      <View style={styles.textContainer}>
        <Text style={styles.paragraph}>
          PoolPe Business (“we”, “our” or “us”) recognizes the importance of
          protecting personal details and information and provides this Privacy
          Policy with respect to the access and use (direct or indirect) of
          PoolPe Business application(“Services”). For the purpose of this
          Privacy Policy, the user of Services may be merchants/sellers/billers,
          customers/buyers/ consumers, or any other persons using Services
          (“User”, “you” or “your”). This Privacy Policy will help you
          understand our policies and procedures regarding the collection,
          handling and use of your information. By using our Services through
          the Sites, you signify your assent to this Privacy Policy and consent
          to the processing of your Information (Personal Information and/or
          Sensitive Personal Data or Information). If you do not agree with this
          Privacy Policy do not, in any manner, use our Services, install and/or
          use the mobile application.
        </Text>

        <Text style={styles.sectionHeading}>Collection of Information</Text>
        <Text style={styles.paragraph}>
          This Privacy Policy covers our treatment of your Information collected
          from (i) Merchants/ Sub-Merchants who use or may want to use services;
          and/or (ii) consumer information that we acquire in the course of our
          business. As a merchant/ sub-merchant, we collect your Information,
          through the registration process, the service agreement that we
          execute and various submitted documents of your credibility that are
          required from time to time. We may ask customers to enter personal
          data when placing an order, such as name, address, phone number,
          credit card/ banking details and e-mail address and use this data to
          protect the merchant and ourselves against risk. As a customer we
          capture your Profiling Information, Correspondence Information, domain
          name from which you contact us, the pages you request, the products
          you buy, the referring site, and the time that you spend on the site.
          For everyone who visits any of our merchant’s website/ purchase page,
          we log IP addresses, the type of operating system that your phone
          uses, and the type of browser software used by you. Further, we may
          also capture your Service Usage and Transactional Information;
          one-time passwords if you have consented for it; Correspondence
          Information; cookies, etc.
        </Text>

        <Text style={styles.sectionHeading}>Disclosure</Text>
        <Text style={styles.paragraph}>
          Information security is critical to our business. We work to protect
          the security of your information during transmission by using Secure
          Sockets Layer (SSL) software, which encrypts information you input. We
          store information gathered on secure computers. We use advanced
          security technology to prevent our computers from being accessed by
          unauthorized persons. It is important for you to protect against
          unauthorized access to your Login ID/password and to your computer. Be
          sure to protect the password used to access our services. We use
          reasonable precautions to keep the personal information disclosed to
          us secure and do not disclose this information to other individuals or
          organizations unless required for provision of Services to you such as
          to banks, card associations. However, we will exchange information
          with other companies and organizations for the purposes of fraud
          protection and risk reduction. You acknowledge and agree that for the
          purpose of sending you updates/ communications, improving product,
          personalisation, offering new features in the existing services you
          are availing, offering new products/ services which may be relevant
          for you and Service efficiency, we may, under controlled and secure
          circumstances, share your Information with our affiliates, associates
          or third parties with whom we have a legal arrangement in place. We
          may disclose your Information pursuant to applicable laws, a directive
          or order of a government entity or statutory authority or any judicial
          or regulatory authority or to law enforcement agencies in any official
          investigation including but not limited to cyber incidents,
          prosecution and punishment of offences. You agree that “PoolPe
          Business” has the right to monitor and to disclose Information as may
          be necessary to satisfy any law, regulation or other governmental
          request. We may transfer Your Information or other information
          collected, stored, processed by us to any other entity or organization
          located in India. We will cooperate with the appropriate law
          enforcement authorities in investigating claims of illegal activity.
          We will only disclose your Information in accordance with this Privacy
          Policy. If we want to use it for any other purpose, we will obtain
          your consent. If you decline to submit Information to us, then we will
          unfortunately not be in a position to provide the Services to you.
          PoolPe Business will never sell or rent personal information of its
          clients to anyone, at any time, for any reason. PoolPe Business may
          use the Customers’ personal information, inter alia, in the following
          ways, viz: i. Monitor, improve and administer the Website and improve
          the quality of services; ii. Analyze how the website is used, diagnose
          service or technical problems, maintain security; iii. Remember
          information to help the Customers effectively access the Website; iv.
          Monitor aggregate metrics such as total number of views, visitors,
          traffic and demographic patterns; v. To confirm the Customer’s
          identity in order to determine its eligibility to use the Website and
          avail of the services; vi. To notify the Customers about changes to
          the Website; vii. To enable PoolPe Business to comply with its legal
          and regulatory obligations; viii. To help the Customers apply for
          certain products and services. ix. For the purpose of sending
          administrative notices, service-related alerts and other similar
          communication with a view to optimizing the efficiency of the Website.
          x. Market research, troubleshooting, protection against error, project
          planning, fraud and other criminal activity.
        </Text>

        <Text style={styles.sectionHeading}>Security of Information</Text>
        <Text style={styles.paragraph}>
          We work to protect the security of your Information during
          transmission by using appropriate software, which encrypts information
          you input. This encrypted information is stored on secure
          systems/computers. We use advanced security technology to prevent our
          computers from being accessed by unauthorized persons. We have also
          implemented information security practices and standards and have in
          place information security programmes and policies containing
          managerial, technical, operational and physical security measures that
          are in compliance with the Indian laws including, so as to protect
          your Information with us from unauthorized access, use, modification,
          damage, disclosure or impairment. However, no data transmission over
          the internet is fully secure, so we cannot ensure or warrant the
          security of any information you submit to us. Further, we do not
          guarantee in any way, the security of any Information that you
          transmit or share on the Site; and you do so at your own risk. We urge
          you to keep your Information confidential and not share it with anyone
          unless necessary. Any of your information which you provide when you
          use our Services to an open, public environment or forum including
          (without limitation) any blog, chat room, community, classifieds or
          discussion board, (a) will not be considered confidential, (b) will
          not be considered as Personal Information, and (c) is not subject to
          protection under this Privacy Policy. Since such public environments
          are accessible by third parties, it is possible that third parties may
          collect or use such information for their own purposes. In the case of
          abuse or breach of security, we are not responsible for any breach of
          security or for any actions of any third parties which receive the
          information illegally. We will not distribute customer information to
          be used in mailing lists, surveys, or any other purpose other than
          what is required to perform our services.
        </Text>

        <Text style={styles.sectionHeading}>Changes to the Privacy Policy</Text>
        <Text style={styles.paragraph}>
          PoolPe Business reserves the right to change, modify, add, or remove
          portions of this Privacy Policy at any time for any reason. In case,
          any changes are made in the Privacy Policy, PoolPe Business shall
          update the same on the website. Users should periodically review this
          page for the latest information on our privacy practices. Once posted,
          those changes are effective immediately, unless stated otherwise.
          Continued access or use of the Services constitutes your acceptance of
          the changes and the amended Privacy Policy. However, if you do not
          agree with the changes, please do not continue to use the Services or
          submit Personal Information to us.
        </Text>

        <Text style={styles.sectionHeading}>Disclaimer</Text>
        <Text style={styles.paragraph}>
          We reserve the right to report any illegal activity by any User, that
          is our -Merchants or their customers to law enforcement for
          prosecution. Please be aware that we do not control the acts of our
          Sub-Merchants, customers, or visitors. In case of any grievance,
          Customers may write to the Grievance Officer at
          help@PoolPeBusiness.co.in. We will respond to the Customer’s request
          within 15 working days.
        </Text>

        <Text style={styles.sectionHeading}>Data Retention</Text>
        <Text style={styles.paragraph}>
          We will retain and use Customer’s information as necessary to comply
          with its legal obligations, resolve disputes, and enforce its
          agreements or its data/document preservation policy or for other
          business purposes.
        </Text>

        <Text style={styles.sectionHeading}>Updates</Text>
        <Text style={styles.paragraph}>
          In the event PoolPe Business modifies this Privacy Policy, the same
          will be updated on the Website. The Customers are encouraged to
          periodically review this page for the latest information on privacy
          practices.
        </Text>

        <Text style={styles.sectionHeading}>Severability</Text>
        <Text style={styles.paragraph}>
          PoolPe Business has made every effort to ensure that this Policy
          adheres with the applicable laws. The invalidity or unenforceability
          of any part of this Policy shall not prejudice or affect the validity
          or enforceability of the remainder of this Policy.
        </Text>

        <Text style={styles.sectionHeading}>No Waiver</Text>
        <Text style={styles.paragraph}>
          The rights and remedies available under this Policy may be exercised
          as often as necessary and are cumulative and not exclusive of rights
          or remedies provided by law. It may be waived only in writing. Delay
          in exercising or non-exercise of any such right or remedy does not
          constitute a waiver of that right or remedy or any other right or
          remedy.
        </Text>

        <Text style={styles.sectionHeading}>Governing Law</Text>
        <Text style={styles.paragraph}>
          This Policy shall be governed by and construed in accordance with the
          laws of India and, subject to the provisions of arbitration set out
          herein, the courts at Delhi shall have exclusive jurisdiction in
          relation to any disputes arising out of or in connection with this
          Policy. If any dispute arises between PoolPe Business and the
          Customers in connection with or arising out of the validity,
          interpretation, implementation, or alleged breach of any provision of
          the Policy, such dispute shall be referred to and finally resolved by
          arbitration in accordance with the Indian Arbitration and Conciliation
          Act, 1996 for the time being in force, which rules are deemed to be
          incorporated by reference in this clause. There shall be one (1)
          arbitrator and the seat of the arbitration shall be Delhi, India. The
          language of the arbitration proceedings and of all written decisions
          and correspondence relating to the arbitration shall be English.
        </Text>

        <Text style={styles.sectionHeading}>Foreign Jurisdiction</Text>
        <Text style={styles.paragraph}>
          PoolPe Business makes no representation that the content contained on
          the Website is appropriate or to be used or accessed outside of India.
          If the Customers use or access the Website from outside India, they do
          so at their own risk and are responsible for compliance with the laws
          of such jurisdiction.
        </Text>

        <Text style={styles.sectionHeading}>Contact</Text>
        <Text style={styles.paragraph}>
          Any questions or concerns should be addressed to:
          help@PoolPeBusiness.co.in.
        </Text>
      </View>

      {/* <View style={styles.checkboxContainer}>
        <CheckBox
          value={isChecked}
          onValueChange={handleCheckboxChange}
        />
        <Text style={styles.checkboxText}>I agree to the Privacy Policy</Text>
      </View>
      <Button title="Proceed" onPress={handleProceed} /> */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  textContainer: {
    marginBottom: 30,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: 'black',
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 10,
    color: 'black',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 40,
  },
  checkboxText: {
    fontSize: 16,
  },
});

export default PrivacyPolicy;
