import {
  StyleSheet,
  Text,
  View,
  BackHandler,
  StatusBar,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Animated from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import {showMessage} from 'react-native-flash-message';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {COLORS, FONTS, SIZES, icons} from '../constants';
import {VStack, HStack, Skeleton, Spinner} from 'native-base';
import {Store} from '../store/Store';
// import {DonorSkeleton as SkeletonLoader} from '.';
import axios from 'axios';
import {accessKey, baseUrl, get_invitee_list} from '../webApi/service';

// components
import Header from '../components/Common/Header';
import Card from '../components/Invitees/Card';
import PrimaryButton from '../components/Common/PrimaryButton';

const Invitees = ({navigation, route}) => {
  const store = Store();

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
  const [duration, setDuration] = useState('DAY'); // selected duration
  const [startPkr, setStartPkr] = useState(false); // start date picker
  const [endPkr, setEndPkr] = useState(false); // end date picker
  const [startDt, setStartDt] = useState(
    moment(new Date()).format('DD-MMM-YYYY'),
  ); // start date
  const [endDt, setEndDt] = useState(moment(new Date()).format('DD-MMM-YYYY')); // end date
  const [pageNo, setPageNo] = useState(0); // page number
  const [thatsAllshow, setThatsAllshow] = useState(true); // show thats all message
  const [inviteesList, setInviteesList] = useState([]); // invitees list
  const [skeletonLoader, setSkeletonLoader] = useState(false);

  useEffect(() => {
    getInvitees();

    const unSubscribe = navigation.addListener('focus', () => {
      BackHandler.addEventListener('hardwareBackPress', () => {
        console.log('BackHandler In Invitees is called');
        navigation.goBack();
        return true;
      });
    });
    return unSubscribe;
  }, []);

  // get invitees list
  const getInvitees = async val => {
    setSkeletonLoader(true);

    const payload = {
      accessKey,
      loginId: store?.userData?.userId,
      deviceId: store.deviceId,
      sessionId: store?.userData?.session_id,
      preacherCode: store?.userData?.id,
      userRole: store.userData?.userRole,
      fromDate: val?.startDate ? val.startDate : startDt,
      toDate: val?.endDate ? val.endDate : endDt,
      startWith: val?.startWith
        ? val?.startWith === '#'
          ? ''
          : val?.startWith
        : startWith,
      pageNo: val ? 0 : pageNo,
      perPageCount: '10',
    };

    console.log(
      'PAYLOAD TO GET INVITEES LIST:',
      baseUrl + get_invitee_list,
      payload,
    );

    await axios
      .post(baseUrl + get_invitee_list, payload)
      .then(response => {
        console.log('response', response.data.data);
        response.data.successCode === 1
          ? (setInviteesList(
              val
                ? response.data.data
                : inviteesList?.concat(response.data.data),
            ),
            setPageNo(val ? 1 : pageNo + 1),
            setStartDt(val?.startDate ? val?.startDate : startDt),
            setEndDt(val?.endDate ? val?.endDate : endDt),
            setStartWith(
              val?.startWith
                ? val?.startWith === '#'
                  ? ''
                  : val?.startWith
                : startWith,
            ),
            setThatsAllshow(true),
            setSkeletonLoader(false))
          : (thatsAllshow &&
              (showMessage({
                message: 'Thats all!',
                description: 'No more data found',
                type: 'info',
                floating: true,
                icon: 'auto',
              }),
              setStartWith(
                val?.startWith
                  ? val?.startWith === '#'
                    ? ''
                    : val?.startWith
                  : startWith,
              ),
              setThatsAllshow(false)),
            setStartDt(val?.startDate ? val?.startDate : startDt),
            setEndDt(val?.endDate ? val?.endDate : endDt),
            setSkeletonLoader(false),
            console.log('No more invitees data found'));
        // setSkeletonLoader(false);
      })
      .catch(error => {
        // setSkeletonLoader(false);
        console.log('Error in get receipt:', error);
        showMessage({
          message: 'Error!',
          description: 'Please check your internet connection',
          type: 'danger',
          floating: true,
          icon: 'auto',
        });
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
          headerStyle={{zIndex: 1}}
          color={COLORS.black}
          leftButtonIcon="menu"
          title="INVITEES"
          onPressLeft={() => navigation.openDrawer()}
        />

        {/* TIME DURATION SELECTION BUTTON SECTION */}

        <View style={styles.tymSelBtnSec}>
          <TouchableOpacity // day button
            onPress={() => {
              setInviteesList([]);
              setDuration('DAY'),
                console.log('DAY'),
                getInvitees({
                  startDate: moment(new Date()).format('DD-MMM-YYYY'),
                  endDate: moment(new Date()).format('DD-MMM-YYYY'),
                });
            }}
            style={[
              styles.tymSelBtn,
              {
                backgroundColor:
                  duration === 'DAY' ? COLORS.primary : COLORS.tertiary,
              },
            ]}>
            <Text // day button text
              style={[
                styles.txt,
                {
                  fontFamily:
                    duration === 'DAY'
                      ? FONTS.josefinSansBold
                      : FONTS.josefinSansRegular,
                },
              ]}>
              DAY
            </Text>
          </TouchableOpacity>

          <TouchableOpacity // week button
            onPress={() => {
              setInviteesList([]);
              setDuration('WEEK'),
                console.log('WEEK'),
                getInvitees({
                  startDate: moment(new Date()).format('DD-MMM-YYYY'),
                  endDate: moment(new Date())
                    .add(1, 'weeks')
                    .format('DD-MMM-YYYY'),
                });
            }}
            style={[
              styles.tymSelBtn,
              {
                backgroundColor:
                  duration === 'WEEK' ? COLORS.primary : COLORS.tertiary,
              },
            ]}>
            <Text // week button text
              style={[
                styles.txt,
                {
                  fontFamily:
                    duration === 'WEEK'
                      ? FONTS.josefinSansBold
                      : FONTS.josefinSansRegular,
                },
              ]}>
              WEEK
            </Text>
          </TouchableOpacity>

          <TouchableOpacity // month button
            onPress={() => {
              setInviteesList([]);
              setDuration('MONTH'),
                console.log('MONTH'),
                getInvitees({
                  startDate: moment(new Date()).format('DD-MMM-YYYY'),
                  endDate: moment(new Date())
                    .add(1, 'months')
                    .format('DD-MMM-YYYY'),
                });
            }}
            style={[
              styles.tymSelBtn,
              {
                borderRightWidth: 0,
                backgroundColor:
                  duration === 'MONTH' ? COLORS.primary : COLORS.tertiary,
              },
            ]}>
            <Text // month button text
              style={[
                styles.txt,
                {
                  fontFamily:
                    duration === 'MONTH'
                      ? FONTS.josefinSansBold
                      : FONTS.josefinSansRegular,
                },
              ]}>
              MONTH
            </Text>
          </TouchableOpacity>
        </View>

        {/* CUSTOM TIME SELECTION SECTION */}

        <View // date selection button section
          style={styles.tymSelBtnSec}>
          <TouchableOpacity // custom start date picker button
            onPress={() => setStartPkr(true)}
            style={[
              styles.tymSelBtn,
              {
                paddingLeft: SIZES.width * 0.01,
                justifyContent: 'flex-start',
              },
            ]}>
            <MaterialCommunityIcons
              name="calendar-range"
              size={25}
              color={COLORS.white}
            />
            <Text // custom start date picker button text
              style={styles.txt}>
              From: {startDt}
            </Text>
          </TouchableOpacity>

          <DateTimePickerModal // custom start date picker
            isVisible={startPkr}
            onConfirm={date => {
              setStartPkr(!startPkr);
              setInviteesList([]);
              setStartDt(moment(date).format('DD-MMM-YYYY'));
              getInvitees({
                startDate: moment(date).format('DD-MMM-YYYY'),
              });
              setDuration('');
            }}
            onCancel={() => setStartPkr(false)}
            mode="date"
            is24Hour={true}
            maximumDate={new Date(endDt)}
            minimumDate={new Date()}
            date={new Date(startDt)}
          />

          <TouchableOpacity // custom end date picker button
            onPress={() => setEndPkr(true)}
            style={[
              styles.tymSelBtn,
              {
                borderRightWidth: 0,
                paddingLeft: SIZES.width * 0.01,
                justifyContent: 'flex-start',
              },
            ]}>
            <MaterialCommunityIcons
              name="calendar-range"
              size={25}
              color={COLORS.white}
            />
            <Text // custom end date picker button text
              style={styles.txt}>
              To: {endDt}
            </Text>
          </TouchableOpacity>

          <DateTimePickerModal // custom end date picker
            isVisible={endPkr}
            onConfirm={date => {
              setEndPkr(!endPkr);
              setInviteesList([]), setEndDt(moment(date).format('DD-MMM-YYYY'));
              getInvitees({
                endDate: moment(date).format('DD-MMM-YYYY'),
              });
              setDuration('');
            }}
            onCancel={() => setEndPkr(false)}
            mode="date"
            is24Hour={true}
            minimumDate={new Date(startDt)}
            date={new Date(endDt)}
          />
        </View>

        <View
          style={{
            flexDirection: 'row',
            flex: 1,
            justifyContent: 'center',
          }}>
          {inviteesList?.length === 0 && skeletonLoader ? (
            // ~ SKELETON VIEW
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                width: SIZES.width * 0.9,
              }}>
              {Array(4)
                .fill('😎')
                .map((item, index) => (
                  <VStack
                    key={index}
                    space="3"
                    w={SIZES.width * 0.9}
                    alignSelf="center"
                    p={SIZES.paddingSmall}
                    mb={SIZES.paddingMedium}
                    mt={index === 0 ? SIZES.paddingSmall : 0}
                    bgColor={COLORS.white}
                    borderRadius={SIZES.radiusSmall}>
                    <VStack position={'relative'}>
                      <HStack
                        space={'2'}
                        position={'absolute'}
                        top={SIZES.fontScale * 2}
                        left={SIZES.fontScale * 2}>
                        <Skeleton
                          size="50"
                          rounded="full"
                          endColor={'rgba(0,0,0,0.4)'}
                        />
                        <Skeleton
                          h={'4'}
                          w={'1/2'}
                          borderRadius={SIZES.radiusSmall}
                          endColor={'rgba(0,0,0,0.4)'}
                        />
                      </HStack>
                      <Skeleton
                        h={'20'}
                        borderRadius={SIZES.radiusSmall}
                        endColor={'#599D5570'}
                      />

                      <Skeleton
                        size="5"
                        rounded="full"
                        alignSelf={'center'}
                        endColor={'rgba(0,0,0,0.4)'}
                        position={'absolute'}
                        bottom={SIZES.fontScale * 2}
                        right={SIZES.fontScale * 4}
                      />
                      <Skeleton
                        size="5"
                        rounded="full"
                        alignSelf={'center'}
                        endColor={'rgba(0,0,0,0.4)'}
                        position={'absolute'}
                        bottom={SIZES.fontScale * 2}
                        right={SIZES.fontScale * 50}
                      />
                    </VStack>

                    <HStack
                      space="5"
                      justifyContent={'center'}
                      mx="2"
                      pb="2"
                      mt="1"
                      borderBottomWidth="0.5"
                      borderBottomColor={'rgba(0, 0, 0, 0.1)'}>
                      <Skeleton
                        h={'5'}
                        borderRadius={SIZES.radiusSmall}
                        my={0.5}
                        w="1/4"
                        endColor={'rgba(0,0,0,0.4)'}
                      />

                      <Skeleton
                        h={'5'}
                        borderRadius={SIZES.radiusSmall}
                        my={0.5}
                        w="1/4"
                        endColor={'rgba(0,0,0,0.4)'}
                      />

                      <Skeleton
                        h={'5'}
                        borderRadius={SIZES.radiusSmall}
                        my={0.5}
                        w="1/4"
                        endColor={'rgba(0,0,0,0.4)'}
                      />
                    </HStack>

                    <HStack space={'20'} justifyContent={'center'}>
                      <Skeleton
                        size={'5'}
                        rounded={'full'}
                        endColor={'rgba(0,0,0,0.4)'}
                        alignSelf={'center'}
                      />
                      <Skeleton
                        size={'5'}
                        rounded={'full'}
                        endColor={'rgba(0,0,0,0.4)'}
                        alignSelf={'center'}
                      />
                      <Skeleton
                        size={'5'}
                        rounded={'full'}
                        endColor={'rgba(0,0,0,0.4)'}
                        alignSelf={'center'}
                      />
                    </HStack>
                  </VStack>
                ))}
            </View>
          ) : (
            // PATRON LIST
            <FlatList
              data={inviteesList}
              renderItem={({item, index}) => {
                return (
                  <Card // invitees data card
                    key={item.patronId}
                    index={index}
                    data={item}
                    onPressHeader={() => {
                      setInviteesList([]);
                      setPageNo(0);
                      navigation.navigate('PatronDetails', item);
                    }}
                    setSkeletonLoader={setSkeletonLoader}
                  />
                );
              }}
              key={index => index}
              onEndReached={() => {
                getInvitees();
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
                    paddingVertical: SIZES.height * 0.0015,
                    paddingRight: SIZES.width * 0.01,
                    alignSelf: startWith === item ? 'flex-start' : 'center',
                  }}
                  onPress={() => {
                    getInvitees({startWith: item}), setInviteesList([]);
                  }}>
                  <Text // index text
                    style={[
                      styles.txtIndx,
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
      </LinearGradient>
    </Animated.View>
  );
};

export default Invitees;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: COLORS.white,
  },
  tymSelBtnSec: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.white + '95',
    borderRadius: SIZES.radiusSmall,
    overflow: 'hidden',
    marginTop: SIZES.paddingSmall,
    marginHorizontal: SIZES.paddingSmall,
    height: SIZES.height * 0.06,
  },
  tymSelBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    backgroundColor: COLORS.tertiary,
    borderRightWidth: 2,
    borderColor: COLORS.antiFlashWhite,
  },
  txt: {
    fontSize: SIZES.fontSmall,
    color: COLORS.white,
    fontFamily: FONTS.josefinSansRegular,
  },
  list: {
    alignItems: 'center',
    paddingBottom: SIZES.paddingMedium,
    marginTop: SIZES.paddingSmall,
  },
  txtIndx: {
    fontSize: SIZES.fontSmall,
    fontFamily: FONTS.josefinSansBold,
    color: COLORS.black,
    marginLeft: SIZES.paddingMedium,
  },
});
