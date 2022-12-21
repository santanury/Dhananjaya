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
import {Store} from '../store/Store';
// import {DonorSkeleton as SkeletonLoader} from '.';
import axios from 'axios';
import {accessKey, baseUrl, get_preacher_receipt_list} from '../webApi/service';

// components
import Header from '../components/Common/Header';
import Card from '../components/Receipt/Card';
import PrimaryButton from '../components/Common/PrimaryButton';

const Receipt = ({navigation, route}) => {
  const store = Store();

  const [duration, setDuration] = useState('DAY'); // selected duration
  const [startPkr, setStartPkr] = useState(false); // start date picker
  const [endPkr, setEndPkr] = useState(false); // end date picker
  const [startDt, setStartDt] = useState(
    moment(new Date()).format('DD-MMM-YYYY'),
  ); // start date
  const [endDt, setEndDt] = useState(moment(new Date()).format('DD-MMM-YYYY')); // end date
  const [pageNo, setPageNo] = useState(0); // page number
  const [thatsAllshow, setThatsAllshow] = useState(true); // show thats all message
  const [receiptList, setReceiptList] = useState([]); // receipt list
  const [skeletonLoader, setSkeletonLoader] = useState(false);

  useEffect(() => {
    const unSubscribe = navigation.addListener('focus', () => {
      BackHandler.addEventListener('hardwareBackPress', () => {
        console.log('BackHandler In Receipt is called');
        navigation.goBack();
        return true;
      });
      getReceiptList();
    });
    return unSubscribe;
  }, []);

  // get receipt list
  const getReceiptList = async duration => {
    // setSkeletonLoader(true);

    const payload = {
      accessKey,
      loginId: store?.userData?.userId,
      deviceId: store.deviceId,
      sessionId: store?.userData?.session_id,
      preacherCode: store?.userData?.id,
      fromDate: duration?.startDate ? duration.startDate : startDt,
      toDate: duration?.endDate ? duration.endDate : endDt,
      startWith: '',
    };

    console.log(
      'PAYLOAD TO GET RECEIPT LIST:',
      baseUrl + get_preacher_receipt_list,
      payload,
    );

    await axios
      .post(baseUrl + get_preacher_receipt_list, payload)
      .then(response => {
        response.data.successCode === 1
          ? (duration && console.log(duration ? 'duration' : 'not duration'),
            setReceiptList(
              duration
                ? response.data.data
                : receiptList.concat(response.data.data),
            ),
            setPageNo(duration ? 1 : pageNo + 1),
            setStartDt(duration?.startDate ? duration?.startDate : startDt),
            setEndDt(duration?.endDate ? duration?.endDate : endDt),
            setThatsAllshow(true))
          : (thatsAllshow &&
              (showMessage({
                message: 'Thats all!',
                description: 'No receipt found',
                type: 'info',
                floating: true,
                icon: 'auto',
              }),
              setThatsAllshow(false)),
            setStartDt(duration?.startDate ? duration?.startDate : startDt),
            setEndDt(duration?.endDate ? duration?.endDate : endDt),
            console.log('No more donor data found'));
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
          title="RECEIPT"
          onPressLeft={() => navigation.openDrawer()}
          headerRight={
            <TouchableOpacity // left button as touchable
              onPress={() => navigation.goBack()}>
              <MaterialCommunityIcons // icon
                name="home-circle-outline"
                size={35}
                color={COLORS.black}
              />
            </TouchableOpacity>
          }
        />

        {/* TIME DURATION SELECTION BUTTON SECTION */}

        <View style={styles.tymSelBtnSec}>
          <TouchableOpacity // day button
            onPress={() => {
              setReceiptList([]);
              setDuration('DAY'),
                console.log('DAY'),
                getReceiptList({
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
              setReceiptList([]);
              setDuration('WEEK'),
                console.log('WEEK'),
                getReceiptList({
                  startDate: moment(new Date())
                    .subtract(1, 'weeks')
                    .format('DD-MMM-YYYY'),
                  endDate: moment(new Date()).format('DD-MMM-YYYY'),
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
              setReceiptList([]);
              setDuration('MONTH'),
                console.log('MONTH'),
                getReceiptList({
                  startDate: moment(new Date())
                    .subtract(1, 'months')
                    .format('DD-MMM-YYYY'),
                  endDate: moment(new Date()).format('DD-MMM-YYYY'),
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
              setReceiptList([]);
              setStartDt(moment(date).format('DD-MMM-YYYY'));
              getReceiptList({
                startDate: moment(date).format('DD-MMM-YYYY'),
              });
              setDuration('');
            }}
            onCancel={() => setStartPkr(false)}
            mode="date"
            is24Hour={true}
            maximumDate={new Date(endDt)}
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
              setReceiptList([]), setEndDt(moment(date).format('DD-MMM-YYYY'));
              getReceiptList({
                endDate: moment(date).format('DD-MMM-YYYY'),
              });
              setDuration('');
            }}
            onCancel={() => setEndPkr(false)}
            mode="date"
            is24Hour={true}
            minimumDate={new Date(startDt)}
            maximumDate={new Date()}
            date={new Date(endDt)}
          />
        </View>

        {receiptList?.length === 0 && skeletonLoader ? (
          // <SkeletonLoader />
          <Text>Test</Text>
        ) : (
          <FlatList // follow up list
            data={receiptList}
            renderItem={({item, index}) => (
              <Card
                key={index}
                index={index}
                data={item}
                // setSpinnerLoader={setSpinnerLoader}
              />
            )}
            keyExtractor={(item, index) => index}
            // onEndReached={() => getProspectFollowup()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.list}
          />
        )}

        {/* CREATE RECEIPT BUTTON */}

        <PrimaryButton
          name="CREATE RECEIPT"
          onPress={() => navigation.navigate('DonorSelection')}
          style={{
            width: SIZES.width,
            borderRadius: 0,
            backgroundColor: COLORS.spanishBistra,
          }}
        />
      </LinearGradient>
    </Animated.View>
  );
};

export default Receipt;

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
});
