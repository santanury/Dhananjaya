import {
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  View,
  Text,
  FlatList,
  BackHandler,
  Modal,
  Dimensions,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import axios from 'axios';
import Animated from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {showMessage} from 'react-native-flash-message';
import {COLORS, SIZES, FONTS} from '../constants';
import {Store} from '../store/Store';
import {baseUrl, get_prospect_list, accessKey} from '../webApi/service';
import {VStack, HStack, Skeleton, Spinner} from 'native-base';

// components
import Header from '../components/Common/Header';
import Card from '../components/Prospect/Card';
import ProspectCardSkeleton from '../components/Skeletons/ProspectCardSkeleton';

const Prospect = ({navigation, route}) => {
  const store = Store();

  const [prospectList, setProspectList] = useState([]); // prospect list
  const [indexLst] = useState([
    '#',
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
  ]); // index list
  const [startWith, setStartWith] = useState(''); // start with
  const [pageNo, setPageNo] = useState(0); // page number
  const [routeData, setRouteData] = useState(''); // route data
  const [thatsAllshow, setThatsAllshow] = useState(true); // show thats all message

  const [skeletonLoader, setSkeletonLoader] = useState(true); // LOADER

  useEffect(() => {
    const unSubscribe = navigation.addListener('focus', () => {
      console.log('Prospect Focused');
      BackHandler.addEventListener('hardwareBackPress', () => {
        console.log('BackHandler In Prospect is called');
        navigation.goBack();
        return true;
      });
      getProspectList();
    });
    return unSubscribe;
  }, [route.params]);

  // get prospect list
  const getProspectList = async val => {
    setSkeletonLoader(true);

    const payload = {
      accessKey,
      loginId: store?.userData?.userId,
      deviceId: store.deviceId,
      pageNo: val || (!routeData && route.params) ? 0 : pageNo,
      perPageCount: '10',
      sessionId: store?.userData?.session_id,
      orderBy: 'PROSPECT_ID',
      orderType: 'desc',
      startWith: val ? (val === '#' ? '' : val) : startWith,
      prospectId: route?.params?.prospectIdSearchkey,
      prospectName: route?.params?.prospectNameSearchkey,
      phoneNo: route?.params?.phoneNoSearchkey,
      email: route?.params?.emailSearchkey,
      address: route?.params?.addressSearchkey,
      state: route?.params?.stateSearchkey,
      city: route?.params?.citySearchkey,
      pincode: route?.params?.PINSearchkey,
    };

    console.log('GET PROSPECT LIST:', baseUrl + get_prospect_list, payload);

    await axios
      .post(baseUrl + get_prospect_list, payload)
      .then(response => {
        response.data.successCode === 1
          ? (route.params && setRouteData(route.params),
            setStartWith(val ? (val === '#' ? '' : val) : startWith),
            setPageNo(val ? 1 : pageNo + 1),
            setProspectList(
              val || (!routeData && route.params)
                ? response.data.data
                : prospectList.concat(response.data.data),
            ))
          : (thatsAllshow &&
              (showMessage({
                message: 'Thats all!',
                description: 'No more data found',
                type: 'info',
                floating: true,
                icon: 'auto',
              }),
              setThatsAllshow(false)),
            setStartWith(val ? (val === '#' ? '' : val) : startWith),
            setThatsAllshow(false));
        setSkeletonLoader(false);
      })
      .catch(error => {
        setSkeletonLoader(false);
        console.log('Error getting prospect list ', error);
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
    <Animated.View // animated container
      style={[styles.container, store.animatedScreen]}>
      <LinearGradient // gradient container
        colors={[COLORS.tertiary, COLORS.quaternary, COLORS.mistyMoss]}
        style={styles.container}>
        <StatusBar // status bar
          backgroundColor={COLORS.tertiary}
          barStyle="default"
        />
        {/* HEADER */}
        <Header
          color={COLORS.black}
          leftButtonIcon="menu"
          title="PROSPECT"
          onPressLeft={() => navigation.openDrawer()}
          headerRight={
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity // right button as touchable
                onPress={() => {
                  navigation.navigate('CreateProspect', {type: 'C'});
                }}>
                <AntDesign // add icon
                  name="adduser"
                  size={30}
                  color={COLORS.black}
                />
              </TouchableOpacity>

              <TouchableOpacity // right button as touchable
                onPress={() => {
                  // setDonorList([]),
                  //   setPageNo(0),
                  navigation.navigate('ProspectSearch');
                }}>
                <MaterialCommunityIcons // icon
                  name="magnify"
                  size={35}
                  color={COLORS.black}
                />
              </TouchableOpacity>
            </View>
          }
        />
        {/* // LIST & INDEX CONTAINER */}
        <View
          style={{
            flexDirection: 'row',
            flex: 1,
            justifyContent: 'center',
          }}>
          {prospectList?.length === 0 && skeletonLoader ? (
            // ~ SKELETON VIEW
            <View style={{flex: 1, alignItems: 'center'}}>
              {Array(4)
                .fill('😎')
                .map((item, index) => (
                  <ProspectCardSkeleton key={index} />
                ))}
            </View>
          ) : (
            //  PROSPECT LIST

            <FlatList
              data={prospectList}
              renderItem={({item, index}) => {
                return (
                  <Card // prospect data card
                    key={index}
                    index={index}
                    data={item}
                    navigation={navigation}
                  />
                );
              }}
              keyExtractor={(item, index) => index}
              onEndReached={() => {
                getProspectList();
              }}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.list}
            />
          )}
          {/* INDEX FILTER */}

          <View style={{justifyContent: 'center'}}>
            {indexLst.map((item, index) => {
              return (
                <TouchableOpacity // index button
                  key={item}
                  style={{
                    paddingVertical: SIZES.height * 0.003,
                    paddingRight: SIZES.width * 0.01,
                    alignSelf: startWith === item ? 'flex-start' : 'center',
                  }}
                  onPress={() => {
                    getProspectList(item), setProspectList([]);
                  }}>
                  <Text // index text
                    style={[
                      styles.txt,
                      {
                        marginLeft: 0,
                        fontSize:
                          startWith === item
                            ? SIZES.fontMedium
                            : SIZES.fontSmall,
                        color:
                          startWith === item ? COLORS.black : COLORS.darkGray,
                      },
                    ]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* // ~ SPINNER MODAL */}

        <Modal
          visible={skeletonLoader && prospectList.length > 0 ? true : false}
          animationType={'fade'}
          transparent>
          <View
            style={{
              justifyContent: 'center',
              height: Dimensions.get('screen').height,
              backgroundColor: 'rgba(0,0,0,0.2)',
            }}>
            <Spinner color={COLORS.primary} size="lg" />
          </View>
        </Modal>
        <Modal visible={skeletonLoader} transparent />
      </LinearGradient>
    </Animated.View>
  );
};

export default Prospect;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: COLORS.white,
  },
  list: {
    paddingBottom: SIZES.paddingMedium,
    paddingLeft: SIZES.paddingSmall,
  },
  txt: {
    fontSize: SIZES.fontSmall,
    fontFamily: FONTS.josefinSansBold,
    color: COLORS.black,
    marginLeft: SIZES.paddingMedium,
  },
});
