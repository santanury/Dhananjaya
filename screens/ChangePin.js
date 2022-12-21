import {
  StyleSheet,
  Text,
  View,
  BackHandler,
  StatusBar,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import {Store} from '../store/Store';
import {COLORS, FONTS, SIZES, icons} from '../constants';

// components
import Header from '../components/Common/Header';
import OtpInputs from 'react-native-otp-inputs';
import * as Animatable from 'react-native-animatable';
import {accessKey, baseUrl, change_pin} from '../webApi/service';
import axios from 'axios';
import {showMessage} from 'react-native-flash-message';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const ChangePin = ({navigation}) => {
  const {animatedScreen, userData, deviceId} = Store();

  let otpViewRef = useRef(null);
  let otpNewInputRef = useRef(null);
  let otpCnfrmInputRef = useRef(null);

  const [newOtp, setNewOtp] = useState('');
  const [cnfrmOtp, setCnfrmOtp] = useState('');
  const [pinBox, setPinBox] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  // @ Animation
  const position = useSharedValue(SIZES.width + 100);
  const scale = useSharedValue(0);

  const animatedOTPStyle = useAnimatedStyle(
    () => ({
      transform: [{translateX: position.value}],
    }),
    [],
  );
  const animatedLabelStyle = useAnimatedStyle(() => {
    return {transform: [{scale: scale.value}]};
  }, []);

  const animator = () => {
    position.value = withSpring(0, {
      duration: 700,
      // stiffness: 100,
      // damping: 20,
      // mass: 20,
      // overshootClamping: true,
      // restDisplacementThreshold: 1,
      // restSpeedThreshold: 5,
    });
    scale.value = withSpring(1, {duration: 700});
  };

  useEffect(() => {
    const unSubscribe = navigation.addListener('focus', () => {
      BackHandler.addEventListener('hardwareBackPress', () => {
        console.log('BackHandler In ChangePin is called');
        navigation.goBack();
        return true;
      });
    });

    animator();

    return unSubscribe;
  }, []);

  const showToast = (message, type = 'warning') =>
    showMessage({
      message: type[0].toUpperCase() + type.slice(1),
      description: message,
      type,
      icon: type,
      duration: 3000,
      floating: true,
    });

  const validater = () => {
    console.log('pinBox', pinBox, 'newOtp', newOtp, 'cnfrmOtp', cnfrmOtp);
    if (newOtp.length !== 4 && pinBox === 1) {
      showToast('New OTP is not valid');
      return true;
    }
    if ((cnfrmOtp.length !== 4 || cnfrmOtp != newOtp) && pinBox === 2) {
      otpCnfrmInputRef.focus();
      showToast('Confirm OTP is not valid');
      return true;
    }

    let tempOtp = ''; // @ variable to store otp
    if (pinBox === 1) {
      // @ animating confirm otp box
      position.value = SIZES.width + 100;
      scale.value = 0;
      animator();
      // # emptying New otp box and setting state again
      tempOtp = newOtp;
      otpNewInputRef.reset();
      setNewOtp(tempOtp);
    } else {
      tempOtp = cnfrmOtp;
      otpCnfrmInputRef.reset();
      setCnfrmOtp(tempOtp);
    }

    // @ change state until it is 2
    pinBox < 2 && setPinBox(prevState => prevState + 1);

    // @ send OTP to server
    pinBox === 2 && changePin();
  };

  const changePin = async () => {
    try {
      setSubmitted(true);
      const params = {
        accessKey: accessKey,
        deviceId: deviceId,
        loginId: userData.userId,
        sessionId: userData.session_id,
        oldPin: '',
        newPin: newOtp,
      };
      const URL = baseUrl + change_pin;
      console.log('Change pin api URL: ', URL, ' \n Params: ', params);

      const response = await axios.post(URL, params);

      console.log('Change pin api response: ', response.data);
      const {data} = response;
      setSubmitted(false);
      if (data.successCode === 1) {
        showToast('Pin changed successfully', 'success');
        navigation.goBack();
      } else {
        showToast(data.message); // # alert
        position.value = -SIZES.width + 100; // # animating otp box
        scale.value = 0; // # animating label
        animator();
        setPinBox(1);
        otpNewInputRef.reset();
        setCnfrmOtp('');
      }
    } catch (error) {
      setSubmitted(false);
      console.log('Change pin error', error);
    }
  };

  return (
    <Animated.View // animated container
      style={[{flex: 1, overflow: 'hidden'}, animatedScreen]}>
      <LinearGradient // gradient container
        colors={[COLORS.tertiary, COLORS.quaternary, COLORS.mistyMoss]}
        style={{flex: 1, overflow: 'hidden'}}>
        <StatusBar // status bar
          backgroundColor={COLORS.tertiary}
          barStyle="default"
        />
        <Header // header
          headerStyle={{zIndex: 1}}
          color={COLORS.black}
          leftButtonIcon="menu"
          title="CHANGE PIN"
          onPressLeft={() => navigation.openDrawer()}
        />
        <ScrollView>
          <View style={styles.container}>
            <View
              style={{
                marginTop: '2%',
                width: 200,
                height: 200,
                alignItems: 'center',
                justifyContent: 'flex-end',
              }}>
              {!userData.image_url ? (
                <Image
                  source={{uri: userData.image_url}}
                  resizeMode="contain"
                />
              ) : (
                <Image
                  source={require('../assets/icons/avatar.png')}
                  resizeMode="contain"
                />
              )}
              <Text
                style={{
                  fontFamily: FONTS.josefinSansRegular,
                  marginVertical: '3%',
                  color: COLORS.black,
                }}>
                {userData.name}
              </Text>
            </View>

            <View style={styles.headingCont}>
              {/* {pinBox === 2 && (
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={() => {
                    otpCnfrmInputRef.reset();
                    setCnfrmOtp('');
                    setPinBox(1);
                    position.value = -SIZES.width + 100; // # animating otp box
                    scale.value = 0; // # animating label
                    animator();
                  }}>
                  <MaterialCommunityIcons
                    name="arrow-left-bold"
                    size={30}
                    color={COLORS.black}
                  />
                </TouchableOpacity>
              )} */}
              <Animated.View // heading container
                style={[animatedLabelStyle]}>
                <Text // heading
                  style={styles.txt}>
                  {pinBox === 1 ? 'ENTER NEW PIN' : 'CONFIRM NEW PIN'}
                </Text>
              </Animated.View>
            </View>

            <View // verification pin input container
              style={{alignItems: 'center'}}>
              <Animated.View
                ref={ref => (otpViewRef = ref)}
                style={animatedOTPStyle}>
                {pinBox === 1 ? (
                  <OtpInputs // pin input
                    ref={ref => (otpNewInputRef = ref)}
                    defaultValue={newOtp}
                    textAlign="center"
                    color={COLORS.black}
                    fontFamily={FONTS.josefinSansRegular}
                    style={styles.otpInputs}
                    inputContainerStyles={styles.otpBox}
                    handleChange={otp => setNewOtp(otp)}
                    numberOfInputs={4}
                    secureTextEntry={true}
                  />
                ) : (
                  <OtpInputs // pin input
                    ref={ref => (otpCnfrmInputRef = ref)}
                    defaultValue={cnfrmOtp}
                    textAlign="center"
                    color={COLORS.black}
                    fontFamily={FONTS.josefinSansRegular}
                    style={styles.otpInputs}
                    inputContainerStyles={styles.otpBox}
                    handleChange={otp => setCnfrmOtp(otp)}
                    numberOfInputs={4}
                    secureTextEntry={true}
                  />
                )}
              </Animated.View>
              <TouchableOpacity
                disabled={submitted}
                onPress={() => {
                  validater();
                }}
                style={[styles.save]}>
                {submitted ? (
                  <ActivityIndicator size="small" color={COLORS.white} />
                ) : (
                  <Text style={styles.saveBtnTxt}>
                    {pinBox === 1 ? 'Next' : 'Save'}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </Animated.View>
  );
};

export default ChangePin;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
    alignItems: 'center',
  },

  headingCont: {
    height: 65,
    width: '87%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '13%',
  },

  backButton: {
    alignSelf: 'flex-start',
    position: 'absolute',
    bottom: '60%',
    left: '5%',
  },

  otpInputs: {
    marginTop: '8%',
    width: '75%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },

  otpBox: {
    borderColor: COLORS.gray,
    width: 50,
    height: 50,
    borderRadius: SIZES.radiusSmall,
    backgroundColor: COLORS.antiFlashWhite,
  },

  txt: {
    fontSize: SIZES.fontSmall,
    fontFamily: FONTS.josefinSansBold,
    color: COLORS.black,
  },

  save: {
    minWidth: '30%',
    minHeight: '8%',
    flexDirection: 'row',
    marginBottom: '3%',
    padding: '2%',
    paddingHorizontal: '4%',
    borderRadius: SIZES.radiusSmall,
    marginTop: '8%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 8,
  },

  saveBtnTxt: {
    // width: '100%',
    textAlign: 'center',
    fontFamily: FONTS.josefinSansSemiBold,
    fontSize: SIZES.fontMedium,
    color: COLORS.white,
    letterSpacing: 1,
  },
});
