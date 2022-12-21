import {
  StyleSheet,
  Text,
  View,
  BackHandler,
  useWindowDimensions,
  Image,
  ScrollView,
  TextInput,
  Linking,
  StatusBar,
  Platform,
  Modal,
  Dimensions,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import Animated from 'react-native-reanimated';
import {Store} from '../store/Store';
import {COLORS, FONTS, SIZES, icons} from '../constants';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import {Radio, HStack, Box, Icon, Spinner} from 'native-base';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import PrimaryButton from '../components/Common/PrimaryButton';
import {showMessage} from 'react-native-flash-message';
import * as Animatable from 'react-native-animatable';

import axios from 'axios';
import {baseUrl, send_payment_link, accessKey} from '../webApi/service';

// components
import Header from '../components/Common/Header';

// ? QRCode Tab(Sub) Component
const QRCodeTab = ({userData, deviceId, tabIndex}) => {
  const [name, setName] = useState(''); // # Name
  const [mobile, setMobile] = useState(''); // # Mobile
  const [email, setEmail] = useState(''); // # Email
  const [shareVia, setShareVia] = useState(''); // # Share Via

  const [spinnerLoader, setSpinnerLoader] = useState(false); // # LOADER

  let animateRef = useRef(null);

  useEffect(() => {
    animateRef?.pulse(1500);
  }, [tabIndex]);

  const showToast = (message, type = 'warning') =>
    showMessage({
      message: type[0].toUpperCase() + type.slice(1),
      description: message,
      type,
      icon: type,
      duration: 3000,
      position: {bottom: '3%'},
      style: {
        borderRadius: SIZES.radiusSmall,
        width: '80%',
        alignSelf: 'center',
      },
    });

  const validater = () => {
    if (!name) {
      showToast('Name is not valid');
      return;
    }

    if (shareVia === '') {
      showToast('Select a platform to share');
      return;
    }

    if (shareVia === 'email') {
      // @ email validation with regex
      const regex =
        /^(([^<>()\[\]\\.,;:\s@"A-Z]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (!regex.test(email)) {
        showToast('Email is not valid');
        return;
      }
    } else {
      if (!mobile || mobile.length < 10) {
        showToast('Mobile Number is not valid');
        return;
      }
    }

    sendPaymentLink();
  };

  const sendPaymentLink = async () => {
    setSpinnerLoader(true);
    try {
      const params = {
        accessKey: accessKey,
        deviceId: deviceId,
        loginId: userData.userId,
        sessionId: userData.session_id,
        donorName: name,
        mobile,
        email,
        sendThrough: shareVia,
      };
      const URL = baseUrl + send_payment_link;
      console.log('send_payment_link URL', URL, 'params', params);
      const response = await axios.post(URL, params);
      console.log('send_payment_link response', response.data);
      const {data} = response;
      if (data.successCode === 1) {
        if (data.hasOwnProperty('whatsappMessage')) {
          try {
            await Linking.openURL(
              `whatsapp://send?text=${data.whatsappMessage}&phone=91${mobile}`,
            );
          } catch (error) {
            console.log('Linking openirl Error', error);
          }
        } else
          showToast(
            'Message sent successfully through ' +
              (shareVia === 'sms' ? 'SMS' : 'E-mail'),
            'success',
          );

        setName('');
        setMobile('');
        setEmail('');
        setShareVia('');
      }
      setSpinnerLoader(false);
    } catch (error) {
      setSpinnerLoader(false);
      console.log('send_payment_link Error', error);
      showToast('Something went wrong');
    }
  };

  return (
    <ScrollView style={{flex: 1}} keyboardShouldPersistTaps="handled">
      <Animatable.View
        ref={ref => (animateRef = ref)}
        animation={'zoomIn'}
        style={styles.tabContainer}>
        {/*// # container for QR Code Image */}
        <View style={styles.qrImgContainer}>
          <Image
            source={{uri: userData.qr_prcr_url}}
            style={styles.qrImg}
            resizeMode="cover"
          />
          {/* // @ Box with Border */}
          <View style={styles.borderBox} />

          {/* // @ Horizontal Box to hide  Border */}
          <View
            style={[
              styles.borderHider,
              {width: '100%', height: '60%', top: '15%'},
            ]}
          />

          {/* // @ Vertical Box to hide  Border */}
          <View style={[styles.borderHider, {height: '100%', width: '60%'}]} />
        </View>

        {/*// # Form container */}
        <View style={{padding: '3%'}}>
          <TextInput
            style={[styles.inputs]}
            placeholder="Name"
            placeholderTextColor={COLORS.gray}
            returnKeyType="next"
            onChangeText={setName}
            keyboardType={
              Platform.OS === 'ios' ? 'ascii-capable' : 'visible-password'
            }
          />

          <TextInput
            style={[styles.inputs]}
            placeholder="Mobile"
            keyboardType="numeric"
            placeholderTextColor={COLORS.gray}
            returnKeyType="next"
            onChangeText={setMobile}
          />

          <TextInput
            style={[styles.inputs]}
            placeholder="E-mail"
            placeholderTextColor={COLORS.gray}
            onChangeText={setEmail}
            keyboardType="email-address"
          />

          {/* // # RADIO BUTTON */}
          <Radio.Group
            name="MyRadioGroup"
            marginBottom="6%"
            onChange={setShareVia}>
            <HStack space="3" justifyContent="space-around" w="full">
              <Radio
                _text={styles.radioBtnText}
                value="whatsapp"
                size={'md'}
                colorScheme="green"
                icon={<Icon as={MaterialCommunityIcons} name="whatsapp" />}>
                WhatsApp
              </Radio>

              <Radio
                _text={styles.radioBtnText}
                value="sms"
                size={'md'}
                colorScheme="yellow"
                icon={<Icon as={MaterialCommunityIcons} name="message-text" />}>
                SMS
              </Radio>

              <Radio
                _text={styles.radioBtnText}
                size={'md'}
                colorScheme="blue"
                value="email"
                icon={<Icon as={MaterialCommunityIcons} name="email" />}>
                Email
              </Radio>
            </HStack>
          </Radio.Group>

          {/* // # SAVE BUTTON */}
          <PrimaryButton
            name={'Send'}
            onPress={() => validater()}
            style={[styles.save]}
            textStyle={styles.saveBtnTxt}
          />
        </View>
      </Animatable.View>
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
    </ScrollView>
  );
};

// ? QRCode Tab(Sub) Component (Corpus and Non-Corpus)
const QrImageTab = ({image, tabIndex}) => {
  let animateRef = useRef(null);

  useEffect(() => {
    animateRef?.pulse(1500);
  }, [tabIndex]);

  return (
    <Animatable.View
      ref={ref => (animateRef = ref)}
      style={{flex: 1, marginTop: '3%'}}>
      <View style={styles.qrImgTabContainer}>
        <Image
          source={{uri: image}}
          style={{width: '90%', height: '90%'}}
          resizeMode="contain"
        />
      </View>
    </Animatable.View>
  );
};

// ? MAIN Component (TAB VIEW)
const QRCode = ({navigation}) => {
  const {animatedScreen, userData, deviceId} = Store();
  const layout = useWindowDimensions();

  const [index, setIndex] = useState(0); // # state to store tab index
  const [routes, setRoutes] = useState([
    {key: 'QrCode', title: 'QR Code'},
    {key: 'Corpus', title: 'Corpus'},
    {key: 'NonCorpus', title: 'Non-Corpus'},
  ]); // # used to navigate between tabs {key: identifier, title: component}

  useEffect(() => {
    const unSubscribe = navigation.addListener('focus', () => {
      BackHandler.addEventListener('hardwareBackPress', () => {
        console.log('BackHandler In QRCode is called');
        navigation.goBack();
        return true;
      });
    });

    // console.log('deviceId QRCode', deviceId);

    return unSubscribe;
  }, []);

  // @ View Contains button to navigate to tabs
  const _renderTabBar = props => (
    <TabBar
      {...props}
      style={[styles.tabBar, styles.approvalContainer]}
      indicatorStyle={{
        backgroundColor: COLORS.white,
        height: '100%',
      }}
      activeColor={COLORS.primary}
      inactiveColor="#000"
      labelStyle={styles.tabBarLabel}
    />
  );

  // @ Screens To render As Tabs
  const renderScene = ({route, jumpTo}) => {
    switch (route.key) {
      case 'QrCode':
        return (
          <QRCodeTab userData={userData} deviceId={deviceId} tabIndex={index} />
        );
      case 'Corpus':
        return <QrImageTab image={userData.qr_cor_url} tabIndex={index} />;
      case 'NonCorpus':
        return <QrImageTab image={userData.qr_norcor_url} tabIndex={index} />;
      default:
        return null;
    }
  };

  return (
    <Animated.View // animated container
      style={[styles.container, animatedScreen]}>
      <LinearGradient // gradient container
        colors={[COLORS.tertiary, COLORS.quaternary, COLORS.mistyMoss]}
        style={styles.container}>
        <StatusBar // status bar
          backgroundColor={COLORS.tertiary}
          barStyle="default"
        />
        <Header // header
          headerStyle={{zIndex: 1}}
          color={COLORS.black}
          leftButtonIcon="menu"
          title="QR CODE"
          onPressLeft={() => navigation.openDrawer()}
        />
        <View style={{flex: 1}}>
          <TabView
            navigationState={{index, routes}}
            renderScene={renderScene}
            renderTabBar={_renderTabBar}
            onIndexChange={index => {
              setIndex(index);
            }}
            initialLayout={{width: layout.width}}
          />
        </View>
      </LinearGradient>
    </Animated.View>
  );
};

export default QRCode;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: COLORS.white,
  },

  tabBar: {
    width: SIZES.width * 0.95,
    alignSelf: 'center',
    backgroundColor: COLORS.tertiary,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    elevation: 15,
    marginVertical: '2%',
    borderRadius: SIZES.radiusMedium,
    overflow: 'hidden',
  },

  tabBarLabel: {
    fontSize: 12,
    fontFamily: FONTS.josefinSansBold,
    textAlign: 'center',
    textTransform: 'none',
  },

  tabContainer: {
    flex: 1,
    width: '90%',
    alignSelf: 'center',
    backgroundColor: '#fff',
    borderRadius: SIZES.radiusBig,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: '3%',
  },

  qrImgContainer: {
    width: '100%',
    height: 300,
    marginTop: '4%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  qrImg: {
    width: '59.5%',
    height: '90%',
    // tintColor: 'pink',
  },

  borderBox: {
    width: '80%',
    height: '80%',
    borderWidth: 3,
    zIndex: -2,
    borderColor: COLORS.black,
    position: 'absolute',
    top: '5%',
    alignSelf: 'center',
    overflow: 'hidden',
  },

  borderHider: {
    backgroundColor: COLORS.white,
    zIndex: -1,
    position: 'absolute',
    alignSelf: 'center',
  },

  inputs: {
    borderWidth: 1,
    borderRadius: SIZES.radiusSmall,
    backgroundColor: COLORS.antiFlashWhite,
    borderColor: COLORS.lightGray,
    padding: '3%',
    paddingHorizontal: '5%',
    marginBottom: '3%',
    fontFamily: FONTS.josefinSansRegular,
    color: COLORS.black,
  },

  radioBtnText: {
    fontSize: 12,
    fontFamily: FONTS.josefinSansBold,
  },

  save: {
    alignSelf: 'center',
    marginBottom: '3%',
    padding: '2%',
    height: 'auto',
    width: '40%',
    borderRadius: SIZES.radiusSmall,
    // alignItems: 'center',
  },

  saveBtnTxt: {
    width: '100%',
    textAlign: 'center',
  },

  qrImgTabContainer: {
    width: '90%',
    height: SIZES.height * 0.82,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusBig,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
