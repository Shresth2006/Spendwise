import { useEffect } from 'react';
import { PermissionsAndroid, Platform, DeviceEventEmitter } from 'react-native';
import { transactionService } from './api';

export const useSmsListener = () => {
  useEffect(() => {
    const startListening = async () => {
      if (Platform.OS !== 'android') return;

      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
        PermissionsAndroid.PERMISSIONS.READ_SMS,
      ]);

      if (granted['android.permission.RECEIVE_SMS'] === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("🚀 SMS LISTENER IS LIVE AND READY"); // MUST SEE THIS IN METRO
        
        DeviceEventEmitter.addListener('onSMSReceiver', (message: any) => {
          console.log("📩 APP DETECTED SMS:", message.body);
          // Directly hit the backend without any keywords
          transactionService.processRawText(message.body, message.address);
        });
      } else {
        console.log("❌ SMS PERMISSION DENIED");
      }
    };

    startListening();
    return () => DeviceEventEmitter.removeAllListeners('onSMSReceiver');
  }, []);
};