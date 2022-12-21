import {
  StyleSheet,
  StatusBar,
  FlatList,
  BackHandler,
  Image,
  Alert,
  Text,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import LinearGradient from 'react-native-linear-gradient';
import {showMessage} from 'react-native-flash-message';
import {COLORS, SIZES, FONTS, icons} from '../constants';
import {Store} from '../store/Store';
import {accessKey, baseUrl, get_patron_stage} from '../webApi/service';

// components
import Header from '../components/Common/Header';
import Card from '../components/Home/Card';
import CommonModal from '../components/Common/CommonModal';
import PrimaryButton from '../components/Common/PrimaryButton';

const Home = ({navigation}) => {
  const store = Store();
  const [tiles] = useState([
    {name: 'Patron', icon: icons.patron, route: 'Patron'},
    {name: 'Donor', icon: icons.donor, route: 'Donor'},
    {name: 'Patron Enrolment', icon: icons.patron_enrolment},
    {name: 'Charitable Donations', icon: icons.charitable_donations},
    {name: 'Temple Donations', icon: icons.temple_donations},
    {name: 'Festival Donations', icon: icons.festival_donations},
    {name: 'Invitees', icon: icons.invitees, route: 'Invitees'},
    {name: 'Receipt', icon: icons.receipt, route: 'Receipt'},
    {name: 'Prospect', icon: icons.prospect, route: 'Prospect'},
    {
      name: 'Collection History',
      icon: icons.collection_history,
      route: 'CollectionHistory',
    },
    {name: 'Followup', icon: icons.followup, route: 'FollowUp'},
    {name: 'Pilgrimage', icon: icons.pilgrimage},
    {name: 'SP Ashraya', icon: icons.ashraya, route: 'SPAshraya'},
  ]);
  const [ptrnPndMdl, setPtrnPndMdl] = useState(false); // patronship pending action modal
  const [routeData, setRouteData] = useState({}); // temporary route data for patronship enrolment
  const [route, setRoute] = useState(''); // route to navigate incase of unfinished patron creation

  useEffect(() => {
    const unSubscribe = navigation.addListener('focus', () => {
      BackHandler.addEventListener('hardwareBackPress', () => {
        console.log('BackHandler In Home is called');
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

  // patronship category validation
  const patronshipClick = async item => {
    await axios
      .post(baseUrl + get_patron_stage, {
        accessKey,
        deviceId: store?.deviceId,
        loginId: store?.userData?.userId,
        sessionId: store?.userData?.session_id,
        preacherCode: store?.userData?.id,
      })
      .then(res => {
        res.data.successCode === 1
          ? (console.log('Unsaved Data Exists'),
            setRouteData(item),
            setPtrnPndMdl(true),
            setRoute(res.data?.data?.[0]?.screenNo))
          : (console.log("Unsaved Data Doesn't Exist"),
            store.setRouteInfo(item),
            navigation.navigate('SubCategory'));
      })
      .catch(err => {
        console.log('Error:', err),
          showMessage({
            message: 'Error!',
            description: 'Please check your internet connection',
            type: 'danger',
            floating: true,
            icon: 'auto',
          });
      });
  };

  return (
    <LinearGradient // gradient container
      colors={[COLORS.tertiary, COLORS.quaternary, COLORS.mistyMoss]}
      style={styles.container}>
      <StatusBar // status bar
        backgroundColor={COLORS.tertiary}
        barStyle="default"
      />
      <Header // header
        leftButtonIcon="menu"
        title="HOME"
        onPressLeft={() => navigation.openDrawer()}
        headerRight={
          <Image // profile image
            source={{uri: store?.userData?.image_url}}
            style={styles.rightIcon}
            resizeMode="cover"
          />
        }
      />

      <CommonModal
        title="CONTINUE LAST SESSION"
        isOpen={ptrnPndMdl}
        onClose={() => setPtrnPndMdl(false)}>
        <Text style={styles.identifierTxt}>
          Do you want to continue the unfinished form or start a new one?
        </Text>

        <PrimaryButton // icontinue button
          name="Continue"
          style={styles.optinoBtn}
          onPress={() => (
            store.setPtrnIncmp(true),
            setPtrnPndMdl(false),
            navigation.navigate(
              route === '1'
                ? 'EnrolmentBahumanaPuja'
                : route === '2'
                ? 'EnrolmentReview'
                : 'SubCategory',
            )
          )}
        />
        <PrimaryButton // cancel button
          name="Cancel"
          style={[styles.optinoBtn, {backgroundColor: COLORS.gray}]}
          onPress={() => (
            store.setRouteInfo(routeData),
            store.setPtrnIncmp(false),
            setPtrnPndMdl(false),
            navigation.navigate('SubCategory')
          )}
        />
      </CommonModal>

      <FlatList // flatlist to show options
        data={tiles}
        renderItem={({item, index}) => (
          <Card // card
            key={index}
            index={index}
            name={item.name}
            icon={item.icon}
            onPress={() => {
              item?.name === 'Patron Enrolment'
                ? patronshipClick({
                    categoryCode: 'CD',
                    categoryId: '1',
                    categoryName: 'Patronship Enrollment',
                  }) // enrolment wrong spelling
                : item?.name === 'Charitable Donations'
                ? (store.setRouteInfo({
                    categoryCode: 'GD',
                    categoryId: '4',
                    categoryName: 'Charitable Donations',
                  }),
                  navigation.navigate('SubCategory'))
                : item?.name === 'Festival Donations'
                ? (store.setRouteInfo({
                    categoryCode: 'FS',
                    categoryId: '2',
                    categoryName: 'Festival Donations',
                  }),
                  navigation.navigate('SubCategory'))
                : item?.name === 'Temple Donations'
                ? (store.setRouteInfo({
                    categoryCode: 'NS',
                    categoryId: '3',
                    categoryName: 'Temple Donations',
                  }),
                  navigation.navigate('SubCategory'))
                : item?.name === 'Pilgrimage'
                ? (store.setRouteInfo({
                    categoryCode: 'PG',
                    categoryId: '5',
                    categoryName: 'Pilgrimage',
                  }),
                  navigation.navigate('SubCategory'))
                : navigation.navigate(item.route);
            }}
          />
        )}
        key={index => index}
        numColumns={3}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        style={{marginBottom: 65}}
      />
    </LinearGradient>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    width: SIZES.width,
    paddingBottom: SIZES.height * 0.05,
  },
  rightIcon: {
    width: 40,
    height: 40,
    borderRadius: SIZES.radiusSmall,
    borderWidth: 1,
    borderColor: COLORS.white,
  },
  optinoBtn: {width: '100%', marginTop: SIZES.paddingMedium},
  identifierTxt: {
    width: '100%',
    textAlign: 'center',
    fontSize: SIZES.fontMedium,
    fontFamily: FONTS.josefinSansRegular,
    color: COLORS.black,
    alignItems: 'center',
    padding: SIZES.paddingSmall,
  },
});
