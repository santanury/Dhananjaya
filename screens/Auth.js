import {
  SafeAreaView,
  StyleSheet,
  TextInput,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  BackHandler,
  Alert,
  Modal,
  Dimensions,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {Dropdown} from 'react-native-element-dropdown';
import moment from 'moment';
import axios from 'axios';
import OtpInputs from 'react-native-otp-inputs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {showMessage} from 'react-native-flash-message';
import {COLORS, SIZES, FONTS, SHADOW} from '../constants';
import {Store} from '../store/Store';
import {
  baseUrl,
  verify_user_login,
  verify_user_pin,
  update_pin,
  accessKey,
} from '../webApi/service';
import {Spinner} from 'native-base';

// components
import PrimaryButton from '../components/Common/PrimaryButton';

const Auth = ({navigation}) => {
  const store = Store();

  const [username, setUsername] = useState(''); // username state
  const [password, setPassword] = useState(''); // password state
  const [newPin, setNewPin] = useState(''); // new pin state
  const [confirmPin, setConfirmPin] = useState(''); // confirm pin state
  const [showPass, setShowPass] = useState(false); // show password state
  const [showVerifySec, setShowVerifySec] = useState(false); // new otp section state
  const [showDropSec, setShowDropSec] = useState(false); // center selection state
  const [centerList, setCenterList] = useState([]); // center selection state
  const [center, setCenter] = useState(''); // center selection state
  const [trustList, setTrustList] = useState([]); // trust selection state
  const [trust, setTrust] = useState(''); // trust selection state
  const [userDataTemp, setUserDataTemp] = useState({}); // user data state

  const [spinnerLoader, setSpinnerLoader] = useState(false);

  useEffect(() => {
    const unSubscribe = navigation.addListener('focus', () => {
      BackHandler.addEventListener('hardwareBackPress', () => {
        console.log('BackHandler In Auth is called');
        Alert.alert(
          'Exit App',
          'Are you sure you want to exit the app?',
          [
            {text: 'Cancel', style: 'cancel'},
            {text: 'OK', onPress: () => BackHandler.exitApp()},
          ],
          {cancelable: false},
        );
        return true;
      });
    });
    return unSubscribe;
  }, []);

  // verify pin
  const verifyPin = async pin => {
    pin.length === 4
      ? (setSpinnerLoader(true),
        await axios
          .post(baseUrl + verify_user_pin, {
            accessKey,
            deviceId: store.deviceId,
            pinNo: pin,
          })
          .then(res => {
            res.data.successCode === 1
              ? storeUserDetails(res.data)
              : showMessage({
                  message: 'Wrong PIN!',
                  description: 'Please enter a valid PIN',
                  type: 'danger',
                  floating: true,
                  icon: 'auto',
                });
            setSpinnerLoader(false);
          })
          .catch(err => {
            showMessage({
              message: 'Error!',
              description: 'Please check your internet connection',
              type: 'danger',
              floating: true,
              icon: 'auto',
            });
            setSpinnerLoader(false);
          }))
      : null;
  };

  // store data in async storage
  const storeUserDetails = async data => {
    data?.centerList?.length === 1 && data?.trustList?.length === 1
      ? (console.log(
          'User ID',
          data?.data[0]?.id +
            '#' +
            data?.centerList[0]?.centerId +
            '#' +
            data?.trustList[0]?.trustId,
        ),
        await AsyncStorage.setItem(
          '@storage_Key',
          JSON.stringify({
            userId:
              data?.data[0]?.id +
              '#' +
              data?.centerList[0]?.centerId +
              '#' +
              data?.trustList[0]?.trustId,
            centerId: data?.centerList[0]?.centerId,
            trustId: data?.trustList[0]?.trustId,
            mobile_no: data?.data[0]?.mobileNo,
            email: data?.data[0]?.email,
            id: data?.data[0]?.id,
            name: data?.data[0]?.name,
            image_url: data?.data[0]?.image_url,
            qr_cor_url: data?.data[0]?.qr_cor_url,
            qr_norcor_url: data?.data[0]?.qr_norcor_url,
            qr_prcr_url: data?.data[0]?.qr_prcr_url,
            qr_prcr_link: data?.data[0]?.qr_prcr_link,
            session_id: data?.data[0]?.session_id,
            userRole: data?.data[0]?.userRole,
            last_login: data?.data[0]?.last_login,
            date: moment(new Date()).format('DD-MMM-YYYY'),
          }),
        )
          .then(() => {
            console.log(
              'Async storage set for single center and trust',
              'Navigating to home screen',
            );
            store.setUserData({
              ...data?.data[0],
              centerId: data?.centerList[0]?.centerId,
              trustId: data?.trustList[0]?.trustId,
              userId:
                data?.data[0]?.id +
                '#' +
                data?.centerList[0]?.centerId +
                '#' +
                data?.trustList[0]?.trustId,
            });
            navigation.navigate('CustomDrawer');
          })
          .catch(err =>
            showMessage({
              message: 'Opps!',
              description: 'Something went wrong',
              type: 'danger',
              floating: true,
              icon: 'auto',
            }),
          ))
      : (setUserDataTemp(data?.data[0]),
        setCenterList(data?.centerList),
        setTrustList(data?.trustList),
        setShowDropSec(true));
  };

  // trust center selection
  const trustCenterSelect = async () => {
    console.log('User ID', userDataTemp?.id + '#' + center + '#' + trust);
    await AsyncStorage.setItem(
      '@storage_Key',
      JSON.stringify({
        userId: userDataTemp?.id + '#' + center + '#' + trust,
        centerId: center,
        trustId: trust,
        mobile_no: userDataTemp?.mobileNo,
        email: userDataTemp?.email,
        id: userDataTemp?.id,
        name: userDataTemp?.name,
        image_url: userDataTemp?.image_url,
        qr_cor_url: userDataTemp?.qr_cor_url,
        qr_norcor_url: userDataTemp?.qr_norcor_url,
        qr_prcr_url: userDataTemp?.qr_prcr_url,
        qr_prcr_link: userDataTemp?.qr_prcr_link,
        session_id: userDataTemp?.session_id,
        userRole: userDataTemp?.userRole,
        last_login: userDataTemp?.last_login,
        date: moment(new Date()).format('DD-MMM-YYYY'),
      }),
    )
      .then(() => {
        console.log(
          'Async storage set for selected center and trust',
          'Navigating to home screen',
        );
        store.setUserData({
          ...userDataTemp,
          centerId: center,
          trustId: trust,
          userId: userDataTemp?.id + '#' + center + '#' + trust,
        });
        navigation.navigate('CustomDrawer');
      })
      .catch(err =>
        showMessage({
          message: 'Opps!',
          description: 'Something went wrong',
          type: 'danger',
          floating: true,
          icon: 'auto',
        }),
      );
  };

  // generate pin
  const generatePin = async () => {
    newPin.length === 0
      ? showMessage({
          message: 'Warning!',
          description: 'PIN cannot be empty',
          type: 'warning',
          floating: true,
          icon: 'auto',
        })
      : confirmPin.length === 0
      ? showMessage({
          message: 'Warning!',
          description: 'Confirm PIN cannot be empty',
          type: 'warning',
          floating: true,
          icon: 'auto',
        })
      : newPin !== confirmPin
      ? showMessage({
          message: 'Error!',
          description: 'PIN did not match',
          type: 'danger',
          floating: true,
          icon: 'auto',
        })
      : (setSpinnerLoader(true),
        axios
          .post(baseUrl + update_pin, {
            accessKey: accessKey,
            deviceId: store.deviceId,
            loginId: username,
            sessionId: store.sessionId,
            newPin: '1234',
          })
          .then(res => {
            res?.data?.successCode === 1
              ? (showMessage({
                  message: 'Success!',
                  description: 'PIN generated successfully',
                  type: 'success',
                  floating: true,
                  icon: 'auto',
                }),
                setShowVerifySec(false),
                store.setDeviceExist(true))
              : (showMessage({
                  message: 'Warning!',
                  description: res?.data?.message,
                  type: 'warning',
                  floating: true,
                  icon: 'auto',
                }),
                setShowVerifySec(false));
            setSpinnerLoader(false);
          })
          .catch(err => {
            showMessage({
              message: 'Error!',
              description: 'Please check your internet connection',
              type: 'danger',
              floating: true,
              icon: 'auto',
            });
            setSpinnerLoader(false);
          }));
  };

  // login function
  const verifyUserLogin = async () => {
    username.length === 0
      ? showMessage({
          message: 'Warning!',
          description: 'Username cannot be empty',
          type: 'warning',
          floating: true,
          icon: 'auto',
        })
      : password.length === 0
      ? showMessage({
          message: 'Warning!',
          description: 'Password cannot be empty',
          type: 'warning',
          floating: true,
          icon: 'auto',
        })
      : await axios
          .post(baseUrl + verify_user_login, {
            userName: username,
            password: password,
            accessKey: accessKey,
            deviceId: store.deviceId,
          })
          .then(res =>
            res.data.successCode === 1
              ? (console.log('Session ID:', res.data?.data[0]?.session_id),
                store.setSessionId(res.data?.data[0]?.session_id),
                store.setDeviceExist(false),
                setShowVerifySec(true))
              : showMessage({
                  message: 'Warning!',
                  description: 'Invalid username or password',
                  type: 'warning',
                  floating: true,
                  icon: 'auto',
                }),
          )
          .catch(err =>
            showMessage({
              message: 'Error!',
              description: 'Please check your internet connection',
              type: 'danger',
              floating: true,
              icon: 'auto',
            }),
          );
  };

  return (
    <SafeAreaView // container
      style={styles.container}>
      <LinearGradient // gradient background
        colors={[COLORS.tertiary, COLORS.quaternary, COLORS.mistyMoss]}
        style={styles.container}>
        <StatusBar // status bar
          backgroundColor={COLORS.tertiary}
          barStyle="default"
        />
        <View // heading container
          style={styles.headingCont}>
          <Text // heading
            style={styles.txt}>
            D H A N A N J A Y A
          </Text>
        </View>
        {store.deviceExist && showDropSec ? (
          // trust and center selection
          <>
            <Dropdown // dropdown for center
              placeholder="Select Center"
              style={styles.dropStyle}
              placeholderStyle={styles.dropPlaceholder}
              selectedTextStyle={styles.dropSelectedTxt}
              containerStyle={styles.dropContainer}
              fontFamily={FONTS.josefinSansRegular}
              data={centerList?.map(center => {
                return {label: center.centerName, value: center.centerId};
              })}
              value={center}
              labelField="label"
              valueField="value"
              renderItem={item => (
                <Text style={styles.dropText}>{item.label}</Text>
              )}
              onChange={item => setCenter(item.value)}
            />

            <Dropdown // dropdown for trust
              disable={center.length === 0}
              placeholder="Select Trust"
              style={[
                styles.dropStyle,
                {
                  backgroundColor:
                    center.length === 0 ? 'transparent' : COLORS.antiFlashWhite,
                },
              ]}
              placeholderStyle={styles.dropPlaceholder}
              selectedTextStyle={styles.dropSelectedTxt}
              containerStyle={styles.dropContainer}
              fontFamily={FONTS.josefinSansRegular}
              data={trustList?.map(trust => {
                return {label: trust.trustName, value: trust.trustId};
              })}
              value={trust}
              labelField="label"
              valueField="value"
              renderItem={item => (
                <Text style={styles.dropText}>{item.label}</Text>
              )}
              onChange={item => setTrust(item.value)}
            />
            <PrimaryButton // trust center selection button
              disabled={
                center.length === 0 || trust.length === 0 ? true : false
              }
              icon="spa-outline"
              name="Proceed"
              style={{
                marginTop: SIZES.paddingHuge,
                backgroundColor:
                  center.length === 0 || trust.length === 0
                    ? COLORS.primary + '50'
                    : COLORS.primary,
                shadowOpacity:
                  center.length === 0 || trust.length === 0
                    ? 0
                    : SHADOW.shadowOpacity,
                elevation:
                  center.length === 0 || trust.length === 0
                    ? 0
                    : SHADOW.elevation,
              }}
              onPress={trustCenterSelect}
            />
          </>
        ) : store.deviceExist ? (
          // verify pin
          <>
            <View // verification pin input container
              style={styles.container}>
              <OtpInputs // verification pin input
                textAlign="center"
                color={COLORS.black}
                fontFamily={FONTS.josefinSansRegular}
                style={styles.otpInputs}
                inputContainerStyles={styles.otpBox}
                handleChange={code => verifyPin(code)}
                numberOfInputs={4}
              />
            </View>
          </>
        ) : showVerifySec ? (
          // new pin
          <>
            <OtpInputs // new pin input
              textAlign="center"
              color={COLORS.black}
              fontFamily={FONTS.josefinSansRegular}
              style={[styles.otpInputs, {marginTop: 0}]}
              inputContainerStyles={styles.otpBox}
              handleChange={code => setNewPin(code)}
              numberOfInputs={4}
            />
            <OtpInputs // confirm pin input
              textAlign="center"
              color={COLORS.black}
              fontFamily={FONTS.josefinSansRegular}
              style={[styles.otpInputs, {marginTop: '5%'}]}
              inputContainerStyles={styles.otpBox}
              handleChange={code => setConfirmPin(code)}
              numberOfInputs={4}
            />
            <PrimaryButton // generate pin button
              style={{marginTop: SIZES.paddingHuge}}
              icon="check"
              name="Verify"
              onPress={generatePin}
            />
          </>
        ) : (
          // login
          <>
            <TextInput // username input
              style={styles.input}
              placeholder="Username"
              placeholderTextColor={COLORS.gray}
              onChangeText={text => setUsername(text)}
              value={username}
            />
            <View // password input container
              style={[
                styles.input,
                {marginTop: '5%', flexDirection: 'row', paddingRight: '5%'},
              ]}>
              <TextInput // password input
                style={{
                  flex: 1,
                  color: COLORS.black,
                  fontSize: SIZES.fontMedium,
                  fontFamily: FONTS.josefinSansRegular,
                  color: COLORS.black,
                }}
                secureTextEntry={!showPass}
                placeholder="Password"
                placeholderTextColor={COLORS.gray}
                onChangeText={text => setPassword(text)}
                value={password}
              />
              <TouchableOpacity // show password button
                onPress={() => setShowPass(!showPass)}>
                <MaterialCommunityIcons // show password icon
                  name={!showPass ? 'eye-off-outline' : 'eye-outline'}
                  color={COLORS.gray}
                  size={22}
                />
              </TouchableOpacity>
            </View>

            <PrimaryButton // login button
              style={{marginTop: SIZES.paddingHuge}}
              icon="login"
              name="Login"
              onPress={verifyUserLogin}
            />
          </>
        )}
        {/* // ~ SPINNER MODAL */}
        <Modal visible={spinnerLoader} animationType={'fade'} transparent>
          <View
            style={{
              justifyContent: 'center',
              height: Dimensions.get('screen').height,
              backgroundColor: 'rgba(0,0,0,0.2)',
            }}>
            <Spinner color={COLORS.primary} size="lg" />
          </View>
        </Modal>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default Auth;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },
  headingCont: {
    height: SIZES.height * 0.1,
    width: SIZES.width * 0.85,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: SIZES.paddingHuge,
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
  dropStyle: {
    height: 50,
    width: '80%',
    borderColor: COLORS.lightGray,
    borderRadius: SIZES.radiusSmall,
    borderWidth: 1,
    marginBottom: '1%',
    marginTop: '2%',
    backgroundColor: COLORS.antiFlashWhite,
    paddingHorizontal: '2%',
  },
  dropPlaceholder: {
    color: COLORS.gray,
    fontSize: SIZES.fontSmall,
  },
  dropSelectedTxt: {
    color: COLORS.black,
    fontSize: SIZES.fontSmall,
  },
  dropContainer: {
    borderColor: COLORS.lightGray,
    borderRadius: SIZES.radiusSmall,
    borderWidth: 1,
    overflow: 'hidden',
  },
  dropText: {
    color: COLORS.black,
    padding: '5%',
    fontFamily: FONTS.josefinSansRegular,
  },
  input: {
    width: '80%',
    height: 55,
    borderRadius: SIZES.radiusMedium,
    backgroundColor: COLORS.white,
    paddingLeft: '5%',
    alignItems: 'center',
    justifyContent: 'center',
    color: COLORS.black,
    fontSize: SIZES.fontMedium,
    fontFamily: FONTS.josefinSansRegular,
  },
  otpInputs: {
    marginTop: '40%',
    width: '70%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  otpBox: {
    borderColor: COLORS.gray,
    width: SIZES.width * 0.14,
    height: SIZES.width * 0.14,
    borderRadius: SIZES.radiusSmall,
    backgroundColor: COLORS.antiFlashWhite,
  },
});
