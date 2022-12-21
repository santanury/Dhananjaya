import {StyleSheet, StatusBar, Text, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import React, {useEffect} from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import {getUniqueId} from 'react-native-device-info';
import {COLORS, SIZES, FONTS} from '../constants';
import {baseUrl, accessKey, verify_device} from '../webApi/service';
import {Store} from '../store/Store';
import {showMessage} from 'react-native-flash-message';

const Splash = ({navigation}) => {
  const store = Store();

  useEffect(() => {
    const unSubscribe = navigation.addListener('focus', () => {
      console.log('Splash Focused');
      verifyDevice(); // api call when screen is focused
    });
    return unSubscribe;
  }, []);

  // verify device
  const verifyDevice = async () => {
    const uniqueId = await getUniqueId();
    console.log('Device ID:', uniqueId);
    await axios
      .post(baseUrl + verify_device, {
        deviceId: uniqueId,
        accessKey: accessKey,
      })
      .then(res => {
        res.data.successCode === -1
          ? (console.log('Device registered'), checkUserData(uniqueId))
          : (console.log('Device not registered'),
            store.setDeviceExist(false),
            store.setDeviceId(uniqueId),
            navigation.navigate('Auth'));
      })
      .catch(err => {
        console.log(err);
        showMessage({
          message: 'Error!',
          description: 'Please check your internet connection',
          type: 'danger',
          floating: true,
          icon: 'auto',
        });
      });
  };

  // checking data base for user data
  const checkUserData = async uniqueId => {
    await AsyncStorage.getItem('@storage_Key')
      .then(value => {
        const userData = JSON.parse(value);
        userData?.date == moment(new Date()).format('DD-MMM-YYYY')
          ? (console.log('Last login on, ' + userData?.date + ', Today'),
            store.setDeviceExist(true),
            store.setDeviceId(uniqueId),
            store.setUserData(userData),
            navigation.navigate('CustomDrawer'))
          : (console.log('Last login on, ' + userData?.date + ', Yesterday'),
            store.setDeviceExist(true),
            store.setDeviceId(uniqueId),
            navigation.navigate('Auth'));
      })
      .catch(err => {
        store.setDeviceExist(true);
        store.setDeviceId(uniqueId);
        navigation.navigate('Auth');
      });
  };

  return (
    <LinearGradient // gradient background
      colors={[COLORS.primary, COLORS.secondary, COLORS.tertiary]}
      style={styles.container}>
      <StatusBar // status bar
        backgroundColor={COLORS.primary}
        barStyle="default"
      />
      <View // heading container
        style={styles.headingCont}>
        <Text // heading
          style={styles.txt}>
          D H A N A N J A Y A
        </Text>
      </View>
    </LinearGradient>
  );
};

export default Splash;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  headingCont: {
    height: 65,
    width: '87%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '40%',
    borderWidth: 3,
    borderColor: COLORS.white,
  },
  txt: {
    color: COLORS.white,
    textAlign: 'center',
    letterSpacing: 2,
    fontSize: SIZES.fontBig,
    fontFamily: FONTS.josefinSansSemiBold,
  },
});
