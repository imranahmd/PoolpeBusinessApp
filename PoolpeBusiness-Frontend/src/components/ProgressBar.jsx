import React from 'react';
import { View, StyleSheet } from 'react-native';
import Dot from './Dot';

const ProgressBar = ({ steps, currentStep }) => {
  return (
    <View style={styles.container}>
      {steps.map((step, index) => (
        <Dot key={index} isActive={index <= currentStep} label={step.label} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start', // Align items to the start to ensure dots and labels are in line
    marginVertical: 5,
  },
});

export default ProgressBar;
