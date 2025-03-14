import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  StyleSheet,
} from 'react-native';
import Swiper from 'react-native-swiper';

const {width, height} = Dimensions.get('window');

const OnboardingScreen = ({navigation}) => {
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <View style={{flex: 3, marginTop: 20}}>
        <View style={styles.header}>
          <View style={{flex: 2, position: 'relative'}}>
            <TouchableOpacity
              onPress={() => navigation.navigate('Mobile Number')}
              style={styles.skipButton}>
              <Text style={styles.buttonText}>Skip</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{flex: 12}}>
          <Swiper
            showsPagination={true}
            loop={true}
            autoplay={true}
            autoplayTimeout={3}
            removeClippedSubviews={false}>
            <View style={styles.slide}>
              <View style={[styles.container, {marginTop: 30}]}>
                <Image
                  source={require('../../assets/images/Slide1.png')}
                  style={styles.image}
                />
              </View>
              <View style={styles.titleContainer}>
                <Text style={styles.title}>Integrated Payment Gateway</Text>
                <Text style={styles.body}>
                  Accept all payment modes through one unified platform. Say
                  goodbye to payment hassles.
                </Text>
              </View>
            </View>
            <View style={styles.slide}>
              <View style={[styles.container, {marginTop: 30}]}>
                <Image
                  source={require('../../assets/images/Slide2.png')}
                  style={styles.image}
                />
              </View>
              <View style={styles.titleContainer}>
                <Text style={styles.title}>Sales Analytics & Reporting</Text>
                <Text style={styles.body1}>
                  Gain valuable insights into sales performance, customer
                  behavior, and revenue trends.
                </Text>
              </View>
            </View>
            <View style={styles.slide}>
              <View style={styles.container}>
                <Image
                  source={require('../../assets/images/Slide3.png')}
                  style={styles.image}
                />
              </View>

              <View style={styles.titleContainer}>
                <Text style={styles.title}>
                  Access Your Sales History Easily
                </Text>
                <Text style={styles.body}>
                  Effortlessly review your past sales history to track
                  performance and make informed decisions.
                </Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate('Mobile Number')}
                  style={styles.nextButton}>
                  <Text style={styles.buttonText}>Get Started</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Swiper>
        </View>
      </View>
    </SafeAreaView>
  );
};

const imageSize = width * 0.8;

const styles = StyleSheet.create({
  header: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: imageSize,
    height: imageSize,
    borderRadius: imageSize / 2,
    overflow: 'hidden',
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 10,
  },
  image: {
    width: '80%',
    height: '80%',
  },
  titleContainer: {
    display: 'flex',
    width: width * 0.9,
    height: height * 0.35,
    flexDirection: 'column',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginVertical: 10,
    borderRadius: 20,
    backgroundColor: '#2058BB',
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    width: 250,
    marginTop: 20,
    color: 'white',
    textAlign: 'center',
  },
  body: {
    fontSize: 16,
    marginHorizontal: 20,
    marginTop: 20,
    textAlign: 'center',
    marginBottom: 20,
    color: 'white',
  },
  body1: {
    fontSize: 16,
    marginLeft: 10,
    marginTop: 20,
    textAlign: 'center',
    marginBottom: 20,
    color: 'white',
    width: '90%',
  },
  nextButton: {
    backgroundColor: '#fff',
    borderRadius: 30,
    paddingVertical: 10,
    width: '35%',
    position: 'absolute',
    bottom: 25,
    right: 10,
  },
  skipButton: {
    backgroundColor: '#E9EEF8',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: width * 0.3,
  },
  buttonText: {
    color: '#2058BB',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default OnboardingScreen;
