import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Dot = ({ isActive, label }) => {
  return (
    <View style={styles.dotContainer}>
      <View style={[styles.dot, isActive && styles.activeDot]} />
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  dotContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: '#ccc',
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: '#2058BB',
  },
  label: {
    marginTop: 5,
    width: 60, // Fixed width for labels
    fontSize: 10,
    textAlign: 'center',
    color: 'black',
  },
});

export default Dot;


