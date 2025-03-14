import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet, Text } from 'react-native';

const BottomNavigationBar = ({
  handleMyDetails,
  handleUpdatePassword,
  handleLogout,
  handleHome,
  handleHistory,
  qrImage,
  setQrModalVisible,
  activeOption,
  navItems = [], // Add default value for navItems
}) => {
  return (
    <View style={styles.navbar}>
      {navItems.map((item) => (
        <TouchableOpacity
          key={item.label}
          onPress={item.onPress}
          style={[
            styles.navbarItem,
            activeOption === item.label && styles.activeOption,
          ]}>
          <Image source={item.icon} style={styles.navbarIcon} />
          <Text style={styles.navbarText}>{item.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 65,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  navbarItem: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  navbarIcon: {
    width: 30,
    height: 30,
  },
  navbarText: {
    color: 'black',
    fontSize: 12,
  },
  activeOption: {
    borderColor: '#2058BB',
    borderWidth: 1,
    borderRadius: 5,
  },
});

export default BottomNavigationBar;
