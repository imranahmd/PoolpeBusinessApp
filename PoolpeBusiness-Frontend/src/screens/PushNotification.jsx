import PushNotification from 'react-native-push-notification';

PushNotification.configure({
  onNotification: function (notification) {
    console.log('Notification:', notification);
  },
  requestPermissions: Platform.OS === 'ios',
});

export const showPushNotification = (title, message) => {
  PushNotification.localNotification({
    title: title,
    message: message,
    playSound: true,
    soundName: 'default',
    // Add additional properties here if needed
  });
};
