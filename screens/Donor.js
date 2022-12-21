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
import {showMessage} from 'react-native-flash-message';
import {COLORS, SIZES, FONTS, SHADOW} from '../constants';
import {Store} from '../store/Store';
import {baseUrl, get_donor_list, accessKey} from '../webApi/service';
import {Spinner} from 'native-base';

// components
import Header from '../components/Common/Header';
import Card from '../components/Donor/Card';
import AnimatableLowerModal from '../components/Common/AnimatableLowerModal';
import PrimaryButton from '../components/Common/PrimaryButton';
import DonorCardSkeleton from '../components/Skeletons/DonorCardSkeleton';

const Donor = ({navigation, route}) => {
  const store = Store();

  const [donorList, setDonorList] = useState([]);
  const [pageNo, setPageNo] = useState(0);
  const [orderType, setOrderType] = useState('desc'); // order type
  const [openSort, setOpenSort] = useState(false); // open sort
  const [sortList] = useState([
    {
      label: 'Donor ID',
      value: 'VIEW_DONOR_DETAILS.DONOR_ID',
      icon: 'identifier',
    },
    {
      label: 'Name',
      value: 'VIEW_DONOR_DETAILS.FIRST_NAME',
      icon: 'format-font',
    },
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
  const [sortVal, setSortVal] = useState('VIEW_DONOR_DETAILS.DONOR_ID'); // sort value
  const [sortValTmp, setSortValTmp] = useState(''); // sort value
  const [sortFaded, setSortFaded] = useState(true); // sort faded
  const [routeData, setRouteData] = useState(''); // route data
  const [thatsAllshow, setThatsAllshow] = useState(true); // show thats all message
  const [skeletonLoader, setSkeletonLoader] = useState(true); // LOADER

  useEffect(() => {
    const unSubscribe = navigation.addListener('focus', () => {
      console.log('Donor Focused');
      BackHandler.addEventListener('hardwareBackPress', () => {
        console.log('BackHandler In Donor is called');
        navigation.goBack();
        return true;
      });
      getDonorList();
    });
    return unSubscribe;
  }, [route.params]);

  // get donor list
  const getDonorList = async val => {
    setSkeletonLoader(true);
    const previousListLenght = donorList.length;

    val && setOpenSort(false);

    const payload = {
      loginId: store?.userData?.userId,
      accessKey: accessKey,
      deviceId: store.deviceId,
      pageNo: val || (!routeData && route.params) ? 0 : pageNo,
      perPageCount: '10',
      sessionId: store?.userData?.session_id,
      orderBy:
        val && (val === 'asc' || val === 'desc') && sortValTmp
          ? sortValTmp
          : sortVal,
      orderType: val && (val === 'asc' || val === 'desc') ? val : orderType,
      userRole: store?.userData?.userRole,
      startWith:
        val && !(val === 'asc' || val === 'desc')
          ? val === '#'
            ? ''
            : val
          : startWith,
      donorId: route?.params?.donorIdSearchkey,
      donorName: route?.params?.donorNameSearchkey,
      phoneNo: route?.params?.phoneSearchkey,
      email: route?.params?.emailSearchkey,
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
      drNo: route?.params?.drSearchkey,
      incPatronPay: route?.params?.incPatronPay ? 'y' : '',
      excPatronPay: route?.params?.excPatronPay ? 'y' : '',
      donationCat: route?.params?.donationCat,
    };

    console.log('DONOR LIST:', baseUrl + get_donor_list, payload);

    await axios
      .post(baseUrl + get_donor_list, payload)
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
            setDonorList(
              val || (!routeData && route.params)
                ? response.data.data
                : donorList.concat(response.data.data),
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
        showMessage({
          message: 'Error!',
          description: 'Please check your internet connection',
          type: 'danger',
          floating: true,
          icon: 'auto',
        });

        console.log('donor list', error);

        setSkeletonLoader(false);
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
          title="DONOR"
          onPressLeft={() => navigation.openDrawer()}
          headerRight={
            <TouchableOpacity // right button as touchable
              onPress={() => {
                setDonorList([]);
                setPageNo(0);
                navigation.navigate('DonorSearch');
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
          {donorList.length === 0 && skeletonLoader ? (
            // ~ SKELETON VIEW
            <View style={{flex: 1, alignItems: 'center'}}>
              {Array(4)
                .fill('😎')
                .map((item, index) => (
                  <DonorCardSkeleton key={index} />
                ))}
            </View>
          ) : (
            // DONOR LIST
            <FlatList
              data={donorList}
              renderItem={({item, index}) => {
                return (
                  <Card // donor data card
                    key={index}
                    index={index}
                    data={item}
                    onPress={() => {
                      setDonorList([]),
                        setPageNo(0),
                        navigation.navigate('DonorDetails', item);
                    }}
                  />
                );
              }}
              key={index => index}
              onEndReached={() => {
                getDonorList();
              }}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.list}
              setSkeletonLoader={setSkeletonLoader}
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
                    getDonorList(item), setDonorList([]);
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
                getDonorList('asc'), setDonorList([]), setOpenSort(false);
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
                getDonorList('desc'), setDonorList([]), setOpenSort(false);
              }}
            />
          </View>
        </AnimatableLowerModal>

        {/* // ~ SPINNER MODAL */}
        <Modal
          visible={skeletonLoader && donorList.length > 0 ? true : false}
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

export default Donor;

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
