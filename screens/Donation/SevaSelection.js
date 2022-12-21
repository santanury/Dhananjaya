import {
  View,
  Text,
  StyleSheet,
  BackHandler,
  FlatList,
  TouchableOpacity,
  StatusBar,
  TextInput,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import axios from 'axios';
import {Calendar} from 'react-native-calendars';
import moment from 'moment';
import LinearGradient from 'react-native-linear-gradient';
import {showMessage} from 'react-native-flash-message';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Store} from '../../store/Store';
import {COLORS, SIZES, FONTS, SHADOW} from '../../constants';
import {
  baseUrl,
  accessKey,
  get_seva_details,
  get_slot_detail,
  generate_manual_receipt,
} from '../../webApi/service';

// components
import Header from '../../components/Common/Header';
import CommonModal from '../../components/Common/CommonModal';
import AnimatableLowerModal from '../../components/Common/AnimatableLowerModal';
import PrimaryButton from '../../components/Common/PrimaryButton';

const SevaSelection = ({navigation, route}) => {
  const store = Store();

  const drNumRef = useRef(null);
  const drAmtRef = useRef(null);
  const sevakRef = useRef(null);
  const slNumRef = useRef(null);

  const [sevaList, setSevaList] = useState([]); // seva options array
  const [benefitsMdl, setBenefitsMdl] = useState(false); // benifits modal
  const [info, setInfo] = useState({}); // benifits array
  const [dateMdl, setDateMdl] = useState(false); // slot booking datepicker modal
  const [plgSlotmdl, setPlgSlotMdl] = useState(false); // pilgrimage slot booking modal
  const [noOfSlots, setNoOfSlots] = useState(''); // number of slots for pilgrimage booking
  const [slotDates, setSlotDates] = useState([]); // slot based seva dates
  const [selSlotDate, setSelSlotDate] = useState({}); // clicked available slot date
  const [tempSevaInfo, setTempSevaInfo] = useState({}); // seva info
  const [receiptTypMdl, setReceiptTypMdl] = useState(false); // receipt type selection modal open state
  const [receiptTyp, setReceiptTyp] = useState(''); // selected receipt type
  const [manualMdl, setManualMdl] = useState(false); // modal for manual entry
  const [manualData, setManualData] = useState({}); // dr number for manual entry
  const [sevaData, setSevaData] = useState({}); // seva data for route

  useEffect(() => {
    getSevaList();
    const unSubscribe = navigation.addListener('focus', () => {
      console.log('Seva Selection Focused');
      BackHandler.addEventListener('hardwareBackPress', () => {
        console.log('BackHandler In SevaSelection is called');

        // removing sub-category related data from routeInfo state when back clicked
        if (Object.keys(store?.routeInfo)?.length > 0) {
          let tempObj = store?.routeInfo;
          tempObj?.purposeCode && delete tempObj?.purposeCode;
          tempObj?.purposeId && delete tempObj?.purposeId;
          tempObj?.purposeTitle && delete tempObj?.purposeTitle;
          store?.setRouteInfo(tempObj);
        }

        navigation.goBack();
        return true;
      });
    });
    return unSubscribe;
  }, []);

  // get seva list / or verify if slots are still avilable
  const getSevaList = async () => {
    const payload = {
      accessKey,
      deviceId: store?.deviceId,
      loginId: store?.userData?.userId,
      sessionId: store?.userData?.session_id,
      categoryId: store?.routeInfo?.categoryId,
      subCategoryId: store?.routeInfo?.purposeId,
    };

    console.log('GET SEVA LIST:', baseUrl + get_seva_details, payload);

    await axios
      .post(baseUrl + get_seva_details, payload)
      .then(res => {
        res?.data?.successCode === 1
          ? setSevaList(res?.data?.data)
          : showMessage({
              message: 'Opps!',
              description: 'No sava available for this category',
              type: 'warning',
              floating: true,
              icon: 'auto',
            });
      })
      .catch(err => {
        console.log('Get seva details error:', err),
          showMessage({
            message: 'Error!',
            description: 'Please check your internet connection',
            type: 'danger',
            floating: true,
            icon: 'auto',
          });
      });
  };

  // on press seva
  const onPressSeva = item => {
    const {sevaDates, sevaAmountOptions, sevaBenefits, ...compactItem} = item;

    store?.routeInfo?.categoryId === '1'
      ? (store.setRouteInfo({...store?.routeInfo, ...compactItem}),
        navigation.navigate('EnrolmentRegistration'))
      : store?.routeInfo?.categoryId === '5'
      ? (setTempSevaInfo(item), setPlgSlotMdl(true))
      : item?.slotBased === 'Y'
      ? (setTempSevaInfo(item), setReceiptTypMdl(true))
      : (store.setRouteInfo({
          ...store?.routeInfo,
          ...compactItem,
        }),
        navigation.navigate('DonorSelection'));
  };

  // slot-based filter function
  const fliterSlotbased = () => {
    // removing sevaDates array to lightning item and to pass as route data
    const {sevaDates, sevaAmountOptions, sevaBenefits, ...compactItem} =
      tempSevaInfo;

    tempSevaInfo?.sevaDates?.length > 1
      ? (setSlotDates(tempSevaInfo?.sevaDates),
        setSevaData(compactItem),
        setDateMdl(true))
      : receiptTyp === 'M'
      ? (setManualData({
          categoryId: store?.routeInfo?.categoryId,
          subCategoryId: store?.routeInfo?.purposeId,
          sevaId: tempSevaInfo?.sevaId,
          bookedOn: moment(new Date()).format('YYYY-MM-DD'),
          sevaCode: tempSevaInfo?.sevaCode,
          donationCode: tempSevaInfo?.donationCode,
          sevaAmount: tempSevaInfo?.sevaAmount,
          sevaCalendarId: selSlotDate?.sevaCalendarId,
        }),
        setDateMdl(false),
        setManualMdl(true))
      : (store.setRouteInfo({
          ...store?.routeInfo,
          ...compactItem,
          sevaDate: moment(
            tempSevaInfo?.sevaDates?.[0]?.sevaDate,
            'YYYY-MM-DD',
          ).format('DD-MMM-YYYY'),
        }),
        navigation.navigate('DonorSelection'));
  };

  // generate manual receipt
  const generateReceipt = async params => {
    const payload = {
      accessKey,
      deviceId: store?.deviceId,
      loginId: store?.userData?.userId,
      sessionId: store?.userData?.session_id,
      categoryId: store?.routeInfo?.categoryId,
      subCategoryId: store?.routeInfo?.purposeId,
      drNumber: manualData?.drNumber,
      sevaId: manualData?.sevaId,
      drAmount: manualData?.drAmount,
      bookedOn: manualData?.bookedOn,
      sevaCode: manualData?.sevaCode,
      donationCode: manualData?.donationCode,
      sevaCalendarId: manualData?.sevaCalendarId,
      sevaAmount: manualData?.sevaAmount,
      patronId: '0',
      // slotId:"1"
    };

    console.log(
      'CREATE MANUAL RECEIPT:',
      baseUrl + generate_manual_receipt,
      payload,
    );

    !manualData?.drNumber || manualData?.drNumber?.length === 0
      ? showMessage({
          message: 'Warning!',
          description: 'Please provide DR number',
          type: 'warning',
          floating: true,
          icon: 'auto',
        })
      : manualData?.drNumber?.length < 10
      ? showMessage({
          message: 'Warning!',
          description: 'Please provide a valid DR number',
          type: 'warning',
          floating: true,
          icon: 'auto',
        })
      : !manualData?.drAmount || manualData?.drAmount?.length === 0
      ? showMessage({
          message: 'Warning!',
          description: 'Please provide DR amount',
          type: 'warning',
          floating: true,
          icon: 'auto',
        })
      : manualData?.drAmount === '0'
      ? showMessage({
          message: 'Warning!',
          description: 'DR amount should be more than zero',
          type: 'warning',
          floating: true,
          icon: 'auto',
        })
      : !manualData?.sevakName || manualData?.sevakName?.length === '0'
      ? showMessage({
          message: 'Warning!',
          description: 'Please enter a Sevak name',
          type: 'warning',
          floating: true,
          icon: 'auto',
        })
      : await axios
          .post(baseUrl + generate_manual_receipt, payload)
          .then(res => {
            res.data.successCode === 1
              ? res?.data?.data?.[0]?.result === 1
                ? (showMessage({
                    message: 'Success!',
                    description: 'Seva successfully booked',
                    type: 'success',
                    floating: true,
                    icon: 'auto',
                  }),
                  setReceiptTyp(''),
                  setSelSlotDate({}),
                  setTempSevaInfo({}),
                  setManualData({}),
                  getSevaList(),
                  setManualMdl(false))
                : showMessage({
                    message: 'Record not saved!',
                    description: res?.data?.data?.[0]?.message,
                    type: 'warning',
                    floating: true,
                    icon: 'auto',
                  })
              : (showMessage({
                  message: 'Opps!',
                  description: 'Something went wrong',
                  type: 'warning',
                  floating: true,
                  icon: 'auto',
                }),
                setReceiptTyp(''),
                setSelSlotDate({}),
                setTempSevaInfo({}),
                setManualData({}),
                getSevaList(),
                setManualMdl(false));
          })
          .catch(err => {
            console.log('Manual receipt error:', err);
            showMessage({
              message: 'Error!',
              description: 'Please check your internet connection',
              type: 'danger',
              floating: true,
              icon: 'auto',
            });
          });
  };

  const pilgrimageProcess = async () => {
    const {sevaDates, sevaAmountOptions, sevaBenefits, ...compactItem} =
      tempSevaInfo;

    const payload = {
      accessKey,
      sevaCalendarId: Number(compactItem?.sevaCalendarId),
    };

    console.log('PILGRIMAGE PROCESS :', baseUrl + get_slot_detail, payload);

    noOfSlots === '0' || !noOfSlots
      ? showMessage({
          message: 'Warning!',
          description: 'Please select atleast one slot',
          type: 'warning',
          floating: true,
          icon: 'auto',
        })
      : typeof Number(noOfSlots) >
        typeof Number(tempSevaInfo?.sevaDates?.[0]?.slotsAvailable)
      ? showMessage({
          message: 'Warning!',
          description: 'You cannot book more slots than available',
          type: 'warning',
          floating: true,
          icon: 'auto',
        })
      : await axios
          .post(baseUrl + get_slot_detail, payload) // <- work pending here, api not created
          .then(res => {
            console.log(res);
            store?.setRouteInfo({
              ...store?.routeInfo,
              ...compactItem,
              noOfSlots,
              sevaDate: moment(
                tempSevaInfo?.sevaDates?.[0]?.sevaDate,
                'YYYY-MM-DD',
              ).format('DD-MMM-YYYY'),
            });
            setPlgSlotMdl(false), navigation.navigate('DonorSelection');
          })
          .catch(err => {
            console.log('Error in pilgrimage process', err);
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
        headerStyle={{zIndex: 1}}
        color={COLORS.black}
        leftButtonIcon="chevron-left"
        title="SEVA SELECTION"
        onPressLeft={() => navigation.goBack()}
      />

      {/* SEVA BENEFITS MODAL */}

      <CommonModal
        isOpen={benefitsMdl}
        onClose={() => setBenefitsMdl(false)}
        title={info?.sevaName?.toUpperCase() + ' ' + 'BENEFITS'}>
        <Text // seva information
          style={[styles.txt, {color: COLORS.black}]}>
          {info.sevaBenefits}
        </Text>
      </CommonModal>

      {/* PILGRIMAGE SLOT BOOKING MODAL */}

      <CommonModal
        isOpen={plgSlotmdl}
        onClose={() => (
          setTempSevaInfo({}), setNoOfSlots(''), setPlgSlotMdl(false)
        )}
        title={`BOOK ${tempSevaInfo?.sevaName?.toUpperCase()}`}>
        <TextInput // number of slots for pilgrimage input
          ref={slNumRef}
          style={[styles.input, {marginBottom: 0}]}
          placeholder="No. of Slots"
          placeholderTextColor={COLORS.gray}
          keyboardAppearance="dark"
          keyboardType="numeric"
          maxLength={3}
          returnKeyType="done"
          color={COLORS.black}
          onChangeText={text => setNoOfSlots(text)}
          value={noOfSlots}
        />

        <View // available / booked / reserved slots count
          style={{
            flexDirection: 'row',
            paddingVertical: SIZES.paddingMedium,
          }}>
          <View // available
            style={styles.daysInfoSec}>
            <Text style={styles.identifierTxt}>Available : </Text>
            <Text style={styles.valueTxt}>
              {tempSevaInfo?.sevaDates?.[0]?.slotsAvailable}
            </Text>
          </View>

          <View // booked
            style={styles.daysInfoSec}>
            <Text style={styles.identifierTxt}>Booked : </Text>
            <Text style={styles.valueTxt}>
              {tempSevaInfo?.sevaDates?.[0]?.slotsBooked}
            </Text>
          </View>

          <View // release
            style={styles.daysInfoSec}>
            <Text style={styles.identifierTxt}>Released : </Text>
            <Text style={styles.valueTxt}>
              {tempSevaInfo?.sevaDates?.[0]?.slotsReleased}
            </Text>
          </View>
        </View>

        <PrimaryButton // proceed button
          disabled={!noOfSlots}
          style={{
            width: '100%',
            backgroundColor: !noOfSlots ? COLORS.lightGray : COLORS.primary,
            elevation: !noOfSlots ? 0 : SHADOW.elevation,
            shadowOpacity: !noOfSlots ? 0 : SHADOW.shadowOpacity,
          }}
          name="Procees"
          icon="check-underline"
          onPress={() => pilgrimageProcess()}
        />
      </CommonModal>

      {/* MANUAL / APP BOOKING SELECTION MODAL */}

      <AnimatableLowerModal
        title={`BOOK ${tempSevaInfo?.sevaName?.toUpperCase()}`}
        isOpen={receiptTypMdl}
        onClose={() => (
          setReceiptTyp(''),
          setTempSevaInfo({}),
          setSelSlotDate({}),
          setReceiptTypMdl(false)
        )}>
        <PrimaryButton
          style={{marginBottom: SIZES.paddingMedium}}
          icon="clipboard-edit-outline"
          name="MANUAL"
          onPress={() => (
            setReceiptTyp('M'), setReceiptTypMdl(false), fliterSlotbased()
          )}
        />
        <PrimaryButton
          style={{marginBottom: SIZES.paddingSmall}}
          icon="cellphone-text"
          name=" USE APP"
          onPress={() => (
            setReceiptTyp('A'), setReceiptTypMdl(false), fliterSlotbased()
          )}
        />
      </AnimatableLowerModal>

      {/* SEVA SLOT BOOKING MODAL */}

      <CommonModal
        isOpen={dateMdl}
        onClose={() => (
          setReceiptTyp(''),
          setSelSlotDate({}),
          setTempSevaInfo({}),
          setDateMdl(false)
        )}>
        <Calendar
          headerStyle={styles.calendarHeader}
          theme={{
            indicatorColor: COLORS.black,
            arrowColor: COLORS.black,
            todayTextColor: COLORS.secondary,
            textDayStyle: {
              fontFamily: FONTS.josefinSansRegular,
            },
            monthTextColor: COLORS.black,
            'stylesheet.calendar.header': {
              dayHeader: {
                color: COLORS.black,
              },
            },
          }}
          dayComponent={({date}) => {
            return (
              <TouchableOpacity
                activeOpacity={1}
                style={[
                  styles.calendarDay,
                  {
                    backgroundColor:
                      new Date(date.dateString) >=
                      new Date().setUTCHours(0, 0, 0, 0)
                        ? new Date(date.dateString)?.setUTCHours(0, 0, 0, 0) ===
                          new Date(selSlotDate?.sevaDate)?.setUTCHours(
                            0,
                            0,
                            0,
                            0,
                          )
                          ? COLORS.secondary
                          : slotDates?.some(
                              each =>
                                new Date(each?.sevaDate)?.setUTCHours(
                                  0,
                                  0,
                                  0,
                                  0,
                                ) ===
                                new Date(date.dateString)?.setUTCHours(
                                  0,
                                  0,
                                  0,
                                  0,
                                ),
                            )
                          ? COLORS.quaternary
                          : COLORS.palePink
                        : COLORS.lightGray,
                    borderWidth:
                      new Date(date.dateString)?.setUTCHours(0, 0, 0, 0) ===
                      new Date(selSlotDate?.sevaDate)?.setUTCHours(0, 0, 0, 0)
                        ? 2
                        : 0,

                    borderColor: COLORS.primary,
                  },
                ]}
                onPress={() =>
                  new Date(date.dateString) >=
                  new Date().setUTCHours(0, 0, 0, 0)
                    ? slotDates?.some(
                        each =>
                          new Date(each?.sevaDate)?.setUTCHours(0, 0, 0, 0) ===
                          new Date(date.dateString)?.setUTCHours(0, 0, 0, 0),
                      )
                      ? setSelSlotDate(
                          slotDates?.find(
                            each =>
                              new Date(each?.sevaDate)?.setUTCHours(
                                0,
                                0,
                                0,
                                0,
                              ) ===
                              new Date(date.dateString)?.setUTCHours(
                                0,
                                0,
                                0,
                                0,
                              ),
                          ),
                        )
                      : (setSelSlotDate({}),
                        showMessage({
                          message: 'Warning!',
                          description: 'This seva is not allowed on this date',
                          type: 'warning',
                          floating: true,
                          icon: 'auto',
                        }))
                    : (setSelSlotDate({}),
                      showMessage({
                        message: 'Warning!',
                        description: 'Cannot select a past date',
                        type: 'warning',
                        floating: true,
                        icon: 'auto',
                      }))
                }>
                <Text style={styles.calendarDayTxt}>
                  {date.dateString.split('-')[2]?.replace(/^0+/, '')}
                </Text>
              </TouchableOpacity>
            );
          }}
          // Initially visible month. Default = now
          initialDate={moment(new Date()).format('YYYY-MM-DD')}
          // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
          minDate={moment(new Date()).format('YYYY-MM-DD')}
        />

        {Object.keys(selSlotDate).length > 0 && (
          <>
            <View // available / booked / reserved slots count
              style={{
                flexDirection: 'row',
                paddingVertical: SIZES.paddingMedium,
              }}>
              <View // available
                style={styles.daysInfoSec}>
                <Text style={styles.identifierTxt}>Available : </Text>
                <Text style={styles.valueTxt}>
                  {selSlotDate?.slotsAvailable}
                </Text>
              </View>

              <View // booked
                style={styles.daysInfoSec}>
                <Text style={styles.identifierTxt}>Booked : </Text>
                <Text style={styles.valueTxt}>{selSlotDate?.slotsBooked}</Text>
              </View>

              <View // release
                style={styles.daysInfoSec}>
                <Text style={styles.identifierTxt}>Released : </Text>
                <Text style={styles.valueTxt}>
                  {selSlotDate?.slotsReleased}
                </Text>
              </View>
            </View>

            <PrimaryButton // proceed button
              disabled={
                selSlotDate?.slotsAvailable === selSlotDate?.slotsBooked
              }
              style={{
                width: '100%',
                backgroundColor:
                  selSlotDate?.slotsAvailable === selSlotDate?.slotsBooked
                    ? COLORS.lightGray
                    : COLORS.primary,
                elevation:
                  selSlotDate?.slotsAvailable === selSlotDate?.slotsBooked
                    ? 0
                    : SHADOW.elevation,
                shadowOpacity:
                  selSlotDate?.slotsAvailable === selSlotDate?.slotsBooked
                    ? 0
                    : SHADOW.shadowOpacity,
              }}
              name="Procees"
              icon="check-underline"
              onPress={() => {
                receiptTyp === 'M'
                  ? (setManualData({
                      categoryId: store?.routeInfo?.categoryId,
                      subCategoryId: store?.routeInfo?.purposeId,
                      sevaId: tempSevaInfo?.sevaId,
                      bookedOn: moment(new Date()).format('YYYY-MM-DD'),
                      sevaCode: tempSevaInfo?.sevaCode,
                      donationCode: tempSevaInfo?.donationCode,
                      sevaAmount: tempSevaInfo?.sevaAmount,
                      sevaCalendarId: selSlotDate?.sevaCalendarId,
                    }),
                    setDateMdl(false),
                    setManualMdl(true))
                  : (store?.setRouteInfo({
                      ...store?.routeInfo,
                      ...sevaData, // same item data but from a state
                      sevaDate: moment(
                        selSlotDate?.sevaDate,
                        'YYYY-MM-DD',
                      ).format('DD-MMM-YYYY'),
                      sevaCalendarId: selSlotDate?.sevaCalendarId,
                    }),
                    navigation.navigate('DonorSelection'));
              }}
            />
          </>
        )}
      </CommonModal>

      {/* MANUAL ENTRY MODAL */}

      <CommonModal
        isOpen={manualMdl}
        onClose={() => (
          setReceiptTyp(''),
          setSelSlotDate({}),
          setTempSevaInfo({}),
          setManualData({}),
          setManualMdl(false)
        )}
        title={`BOOK ${tempSevaInfo?.sevaName?.toUpperCase()}`}>
        <TextInput // manual dr number input
          ref={drNumRef}
          style={styles.input}
          placeholder="DR Number"
          placeholderTextColor={COLORS.gray}
          keyboardAppearance="dark"
          keyboardType="numeric"
          maxLength={10}
          returnKeyType="done"
          color={COLORS.black}
          onChangeText={text => {
            setManualData({...manualData, drNumber: text});
          }}
          value={manualData?.drNumber}
        />

        <TextInput // manual dr amount input
          ref={drAmtRef}
          style={styles.input}
          placeholder="DR Amount"
          placeholderTextColor={COLORS.gray}
          keyboardAppearance="dark"
          keyboardType="number-pad"
          returnKeyType="done"
          color={COLORS.black}
          onChangeText={text => {
            setManualData({...manualData, drAmount: text});
          }}
          value={manualData?.drAmount}
        />

        <TextInput // sevak name input
          ref={sevakRef}
          style={styles.input}
          placeholder="Sevak Name"
          placeholderTextColor={COLORS.gray}
          keyboardAppearance="dark"
          keyboardType="default"
          returnKeyType="done"
          color={COLORS.black}
          onChangeText={text => {
            setManualData({...manualData, sevakName: text});
          }}
          value={manualData?.sevakName}
        />

        <PrimaryButton // submit button
          name="SUBMIT"
          icon="check"
          style={{
            height: SIZES.height * 0.065,
            width: '100%',
            backgroundColor: COLORS.saveEnabled,
            ...SHADOW,
          }}
          onPress={() => generateReceipt()}
        />
      </CommonModal>

      <FlatList // seva list
        data={sevaList}
        keyExtractor={(item, index) => index}
        showsVerticalScrollIndicator={false}
        renderItem={({item, index}) => (
          <View // donation button
            style={[
              styles.btn,
              {marginTop: !(index === 0) ? SIZES.paddingSmall : 0},
            ]}>
            {/* TOP SECTION */}

            <View style={styles.topSec}>
              {!(
                item.sevaBenefits === ' ' || item.sevaBenefits?.lenngth === 0
              ) && (
                <TouchableOpacity // info button
                  style={{marginRight: SIZES.paddingSmall}}
                  onPress={() => (setInfo(item), setBenefitsMdl(true))}>
                  <AntDesign
                    name="exclamationcircleo"
                    size={20}
                    color={COLORS.blue}
                  />
                </TouchableOpacity>
              )}

              <Text // button text
                style={styles.txt}>
                {item.sevaName}
              </Text>

              <TouchableOpacity // book button
                onPress={() => onPressSeva(item)}>
                <Text // book text
                  style={[
                    styles.txt,
                    {
                      flex: 0,
                      padding: SIZES.paddingSmall,
                      borderRadius: SIZES.radiusSmall,
                      backgroundColor: COLORS.saveEnabled,
                    },
                  ]}>
                  BOOK
                </Text>
              </TouchableOpacity>
            </View>

            <View // separator
              style={styles.separator}
            />

            {/* SLOT INFORMATION SECTION */}

            {item?.slotBased === 'Y' && item?.sevaDates?.length === 1 && (
              <>
                <View style={styles.valCont1}>
                  <View // available
                    style={[
                      styles.daysInfoSec,
                      {borderRightWidth: 1, borderColor: COLORS.white},
                    ]}>
                    <Text style={styles.identifierTxt}>Available</Text>
                    <Text style={styles.valueTxt}>
                      {` ${item?.sevaDates?.[0]?.slotsAvailable}`}
                    </Text>
                  </View>

                  <View // booked
                    style={[
                      styles.daysInfoSec,
                      {borderRightWidth: 1, borderColor: COLORS.white},
                    ]}>
                    <Text style={styles.identifierTxt}>Booked</Text>
                    <Text style={styles.valueTxt}>
                      {` ${item?.sevaDates?.[0]?.slotsBooked}`}
                    </Text>
                  </View>

                  <View // release
                    style={styles.daysInfoSec}>
                    <Text style={styles.identifierTxt}>Released</Text>
                    <Text style={styles.valueTxt}>
                      {` ${item?.sevaDates?.[0]?.slotsReleased}`}
                    </Text>
                  </View>
                </View>

                <View // separator
                  style={styles.separator}
                />
              </>
            )}

            {/* BOTTOM SECTION  / */}

            <View style={{width: '100%', flexDirection: 'row'}}>
              <Text // lower text identifier
                style={[styles.txt, {flex: 0, color: COLORS.black}]}>
                {store?.routeInfo?.categoryId === '1'
                  ? `Seva Amount `
                  : Number(item?.sevaMinAmount?.replace(/,/g, ''))
                      ?.toLocaleString('en-IN', {
                        maximumFractionDigits: 2,
                        style: 'currency',
                        currency: 'INR',
                      })
                      ?.split('.')[0]
                  ? `Minimum Seva Amount `
                  : 'As per donors wish'}
              </Text>
              <Text // lower text value
                style={[styles.txt, {flex: 0}]}>
                {store?.routeInfo?.categoryId === '1'
                  ? Number(item?.sevaAmount?.replace(/,/g, ''))
                      ?.toLocaleString('en-IN', {
                        maximumFractionDigits: 2,
                        style: 'currency',
                        currency: 'INR',
                      })
                      ?.split('.')[0]
                  : Number(item?.sevaMinAmount?.replace(/,/g, ''))
                      ?.toLocaleString('en-IN', {
                        maximumFractionDigits: 2,
                        style: 'currency',
                        currency: 'INR',
                      })
                      ?.split('.')[0]
                  ? Number(item?.sevaMinAmount?.replace(/,/g, ''))
                      ?.toLocaleString('en-IN', {
                        maximumFractionDigits: 2,
                        style: 'currency',
                        currency: 'INR',
                      })
                      ?.split('.')[0]
                  : ''}
              </Text>
            </View>
          </View>
        )}
        contentContainerStyle={styles.list}
      />
    </LinearGradient>
  );
};

export default SevaSelection;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: COLORS.white,
  },
  identifierTxt: {
    color: COLORS.black,
    fontSize: SIZES.fontSmall,
    fontFamily: FONTS.josefinSansBold,
  },
  valueTxt: {
    color: COLORS.black,
    fontSize: SIZES.fontSmall,
    fontFamily: FONTS.josefinSansRegular,
    textAlignVertical: 'center',
  },
  list: {
    alignItems: 'center',
    paddingBottom: SIZES.paddingMedium,
  },
  btn: {
    width: SIZES.width * 0.95,
    padding: SIZES.paddingSmall,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: SIZES.radiusMedium,
    overflow: 'hidden',
    backgroundColor: COLORS.blue + 40,
  },
  topSec: {
    width: '100%',
    flexDirection: 'row',
    // alignItems: 'center',
  },
  txt: {
    flex: 1,
    textAlignVertical: 'center',
    fontFamily: FONTS.josefinSansMedium,
    fontSize: SIZES.fontMedium,
    color: COLORS.white,
  },
  valCont1: {flexDirection: 'row', flex: 1},
  separator: {
    width: '100%',
    height: 1,
    backgroundColor: COLORS.lightGray,
    marginVertical: SIZES.paddingSmall,
  },
  calendarHeader: {
    borderBottomWidth: 1,
    borderColor: COLORS.gray,
  },
  calendarDay: {
    borderRadius: SIZES.radiusSmall,
    height: SIZES.width * 0.1,
    width: SIZES.width * 0.1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarDayTxt: {
    color: COLORS.white,
    fontFamily: FONTS.josefinSansRegular,
  },
  dayHidden: {
    color: COLORS.lightGray,
  },
  daysInfoSec: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
  },
  input: {
    height: SIZES.height * 0.065,
    fontSize: SIZES.fontSmall,
    fontFamily: FONTS.josefinSansRegular,
    borderRadius: SIZES.radiusSmall,
    backgroundColor: COLORS.antiFlashWhite,
    borderColor: COLORS.lightGray,
    marginBottom: SIZES.paddingMedium,
    borderWidth: 1,
    paddingLeft: 10,
    color: COLORS.black,
  },
});
