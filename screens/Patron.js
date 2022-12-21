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
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import Animated from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {showMessage} from 'react-native-flash-message';
import {COLORS, SIZES, FONTS, SHADOW} from '../constants';
import {Store} from '../store/Store';
import {baseUrl, get_patron_list, accessKey} from '../webApi/service';
import {Spinner} from 'native-base';

// components
import Header from '../components/Common/Header';
import Card from '../components/Patron/Card';
import AnimatableLowerModal from '../components/Common/AnimatableLowerModal';
import PrimaryButton from '../components/Common/PrimaryButton';
import PatronCardSkeleton from '../components/Skeletons/PatronCardSkeleton';

const Patron = ({navigation, route}) => {
  const store = Store();

  const [patronList, setPatronList] = useState([]); // patron list
  const [pageNo, setPageNo] = useState(0); // page no
  const [orderType, setOrderType] = useState('desc'); // order type
  const [openSort, setOpenSort] = useState(false); // open sort
  const [sortList] = useState([
    {label: 'Patron', value: 'p.PATRON_ID', icon: 'face-man-shimmer-outline'},
    {label: 'Name', value: 'p.FIRST_NAME', icon: 'format-font'},
    {label: 'Seva Code', value: 'p.SEVA_CODE', icon: 'hand-extended-outline'},
    {label: 'Preacher', value: 'p.ALLOC_PRCR_CODE', icon: 'glasses'},
  ]); // sort list

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
  const [sortVal, setSortVal] = useState('p.PATRON_ID'); // sort value
  const [sortValTmp, setSortValTmp] = useState(''); // sort value
  const [sortFaded, setSortFaded] = useState(true); // sort faded
  const [routeData, setRouteData] = useState(''); // route data
  const [thatsAllshow, setThatsAllshow] = useState(true); // show thats all message

  const [skeletonLoader, setSkeletonLoader] = useState(true); // LOADER

  useEffect(() => {
    const unSubscribe = navigation.addListener('focus', () => {
      console.log('Patron Focused');
      BackHandler.addEventListener('hardwareBackPress', () => {
        console.log('BackHandler In Patron is called');
        navigation.goBack();
        return true;
      });
      getPatronList(); // api call when screen is focused
    });
    return unSubscribe;
  }, [route?.params]);

  // get patron list
  const getPatronList = async val => {
    setSkeletonLoader(true);

    const payload = {
      loginId: store.userData?.userId,
      accessKey,
      deviceId: store.deviceId,
      pageNo: val || (!routeData && route.params) ? 0 : pageNo,
      perPageCount: '10',
      sessionId: store.userData?.session_id,
      orderBy:
        val && (val === 'asc' || val === 'desc') && sortValTmp
          ? sortValTmp
          : sortVal,
      orderType: val && (val === 'asc' || val === 'desc') ? val : orderType,
      userRole: store.userData?.userRole,
      startWith:
        val && !(val === 'asc' || val === 'desc')
          ? val === '#'
            ? ''
            : val
          : startWith,
      patronId: route?.params?.patronIdSearchkey,
      patronName: route?.params?.patronNameSearchkey,
      sevaType: route?.params?.sevaPurpose,
      sevaCode: route?.params?.sevaCode,
      phoneNo: route?.params?.phoneSearchkey,
      email: route?.params?.emailSearchkey,
      currentPreacher: route?.params?.currentFundraiser,
      allocatedPreacher: route?.params?.allocatedFundraiser,
      enrolledPreacher: route?.params?.enrolledFundraiser,
      address: route?.params?.addressSearchkey,
      state: route?.params?.stateSearchkey,
      city: route?.params?.citySearchkey,
      pinCode: route?.params?.PINSearchkey,
      includeResidenceAddress: route?.params?.residentialType ? 'y' : '',
      includeOfficeAddress: route?.params?.officeType ? 'y' : '',
      lastPaidFromDate: route?.params?.selectedFromDate,
      lastPaidToDate: route?.params?.selectedToDate,
      paidAmtCondition: route?.params?.paidAmtCondition,
      paidAmount1: route?.params?.paidAmount1,
      paidAmount2: route?.params?.paidAmount2,
      lastPaidAmtCondition: route?.params?.lastPaidAmtCondition,
      lastPaidAmount1: route?.params?.lastPaidAmount1,
      lastPaidAmount2: route?.params?.lastPaidAmount2,
      balanceAmtCondition: route?.params?.balanceAmtCondition,
      balanceAmount1: route?.params?.balanceAmount1,
      balanceAmount2: route?.params?.balanceAmount2,
      drNo: route?.params?.drSearchkey,
    };

    console.log('GET PATRON LIST', baseUrl + get_patron_list, payload);

    await axios
      .post(baseUrl + get_patron_list, payload)
      .then(response => {
        response.data.successCode === 1
          ? (route.params && setRouteData(route.params),
            val && (val === 'asc' || val === 'desc') && sortValTmp
              ? (setSortVal(sortValTmp), setOrderType(val))
              : val && (val === 'asc' || val === 'desc') && setOrderType(val),
            setSortValTmp(''),
            setStartWith(
              val && !(val === 'asc' || val === 'desc')
                ? val === '#'
                  ? ''
                  : val
                : startWith,
            ),
            setPageNo(val ? 1 : pageNo + 1),
            setSortFaded(true),
            setPatronList(
              val || (!routeData && route.params)
                ? response.data.data
                : patronList.concat(response.data.data),
            ),
            setThatsAllshow(true))
          : (thatsAllshow &&
              (showMessage({
                message: 'Thats all!',
                description: 'No more data found',
                type: 'info',
                floating: true,
                icon: 'auto',
              }),
              setThatsAllshow(false)),
            setStartWith(
              val && !(val === 'asc' || val === 'desc')
                ? val === '#'
                  ? ''
                  : val
                : startWith,
            ),
            setThatsAllshow(false));
        setSkeletonLoader(false);
      })
      .catch(error => {
        setSkeletonLoader(false);
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
          title="PATRON"
          onPressLeft={() => navigation.openDrawer()}
          headerRight={
            <TouchableOpacity // right button as touchable
              onPress={() => {
                setPatronList([]),
                  setPageNo(0),
                  navigation.navigate('PatronSearch');
              }}>
              <MaterialCommunityIcons // icon
                name="magnify"
                size={35}
                color={COLORS.black}
              />
            </TouchableOpacity>
          }
        />

        {/* LIST & INDEX CONTAINER */}

        <View
          style={{
            flexDirection: 'row',
            flex: 1,
            justifyContent: 'center',
          }}>
          {patronList?.length === 0 && skeletonLoader ? (
            // SKELETON
            <View style={{alignItems: 'center', flex: 1}}>
              {Array(4)
                .fill('😎')
                .map((item, index) => (
                  <PatronCardSkeleton key={index} />
                ))}
            </View>
          ) : (
            // PATRON LIST

            <FlatList
              data={patronList}
              renderItem={({item, index}) => {
                return (
                  <Card // patron data card
                    key={item.patronId}
                    index={index}
                    data={item}
                    onPressHeader={() => {
                      setPatronList([]),
                        setPageNo(0),
                        navigation.navigate('PatronDetails', item);
                    }}
                    setSkeletonLoader={setSkeletonLoader}
                  />
                );
              }}
              key={index => index}
              onEndReached={() => {
                getPatronList();
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
                    getPatronList(item), setPatronList([]);
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

          {/* SHORT BUTTON */}

          <TouchableOpacity
            onPress={() => setOpenSort(true)}
            style={styles.sortBtn}>
            <MaterialCommunityIcons // sort icon
              name="sort-variant"
              size={30}
              color={COLORS.white}
            />
          </TouchableOpacity>
        </View>

        {/* SORT MODAL */}

        <AnimatableLowerModal
          isOpen={openSort}
          onClose={() => {
            setSortValTmp(''), setOpenSort(false), setSortFaded(true);
          }}
          title="SORT">
          {sortList?.map((item, index) => {
            // sort button list
            return (
              <TouchableOpacity // individual sort button
                onPress={() => {
                  setSortValTmp(item.value);
                  item.value === sortVal
                    ? setSortFaded(true)
                    : setSortFaded(false);
                }}
                style={[
                  styles.individualSortBtn,
                  {
                    backgroundColor:
                      sortValTmp === item.value
                        ? COLORS.gray
                        : sortVal === item.value
                        ? COLORS.lightGray
                        : COLORS.white,
                  },
                ]}
                key={index}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <MaterialCommunityIcons // individual sort button icon
                    name={item.icon}
                    size={30}
                    color={
                      sortValTmp === item.value ? COLORS.black : COLORS.gray
                    }
                  />
                  <Text // individual sort button text
                    style={styles.txt}>
                    {item.label}
                  </Text>
                </View>
                {sortVal === item.value && (
                  <MaterialCommunityIcons // individual sort button checked icon
                    name="check"
                    size={30}
                    color={COLORS.flatBlue}
                  />
                )}
              </TouchableOpacity>
            );
          })}
          <View // ascending and descending button container
            style={{flexDirection: 'row', marginTop: SIZES.height * 0.01}}>
            <PrimaryButton // ascending button
              name="Ascending"
              style={{
                width: SIZES.width * 0.5,
                borderRadius: 0,
                backgroundColor:
                  orderType === 'asc' && sortFaded
                    ? COLORS.lightGray
                    : COLORS.primary,
              }}
              onPress={() => {
                getPatronList('asc'), setPatronList([]), setOpenSort(false);
              }}
            />
            <PrimaryButton // descending button
              name="Descending"
              style={{
                width: SIZES.width * 0.5,
                borderRadius: 0,
                backgroundColor:
                  orderType === 'desc' && sortFaded
                    ? COLORS.lightGray
                    : COLORS.primary,
              }}
              onPress={() => {
                getPatronList('desc'), setPatronList([]), setOpenSort(false);
              }}
            />
          </View>
        </AnimatableLowerModal>

        {/* // ~ SPINNER MODAL */}
        <Modal
          visible={skeletonLoader && patronList.length > 0 ? true : false}
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

export default Patron;

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
  sortBtn: {
    position: 'absolute',
    bottom: SIZES.height * 0.05,
    right: SIZES.width * 0.1,
    backgroundColor: COLORS.flatBlue,
    height: SIZES.height * 0.075,
    width: SIZES.height * 0.075,
    borderRadius: SIZES.height * (0.075 / 2),
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOW,
  },
  individualSortBtn: {
    width: SIZES.width * 0.9,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: SIZES.radiusMedium,
    padding: SIZES.width * 0.03,
    marginBottom: SIZES.paddingSmall,
  },
  txt: {
    fontSize: SIZES.fontSmall,
    fontFamily: FONTS.josefinSansBold,
    color: COLORS.black,
    marginLeft: SIZES.paddingMedium,
  },
});
