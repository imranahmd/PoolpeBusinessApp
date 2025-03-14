import React, { useEffect } from 'react';
import { Modal, View, Text, StyleSheet, useColorScheme } from 'react-native';

const AlertModal = ({ visible, message, onDismiss }) => {
  const colorScheme = useColorScheme();
  const styles = colorScheme === 'dark' ? darkStyles : lightStyles;

  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        onDismiss();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={visible}
      onRequestClose={onDismiss}
    >
      <View style={styles.modalBackground}>
        <View style={styles.alertBox}>
          <Text style={styles.alertBoxText}>{message}</Text>
        </View>
      </View>
    </Modal>
  );
};

const lightStyles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  alertBox: {
    height: 100,
    width: 300,
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  alertBoxText: {
    fontSize: 18,
    color: 'black',
  },
});

const darkStyles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  alertBox: {
    height: 100,
    width: 300,
    padding: 15,
    backgroundColor: '#333',
    borderRadius: 10,
    alignItems: 'center',
  },
  alertBoxText: {
    fontSize: 18,
    color: 'white',
  },
});

export default AlertModal;
