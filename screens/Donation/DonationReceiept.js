import {
  View,
  Text,
  StyleSheet,
  BackHandler,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import {Dropdown} from 'react-native-element-dropdown';
import {Checkbox, RadioButton} from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import {showMessage} from 'react-native-flash-message';
import {Store} from '../../store/Store';
import {COLORS, SIZES, FONTS} from '../../constants';
import {
  baseUrl,
  accessKey,
  get_seva_category_list,
  get_seva_sub_category_list,
  get_patron_list_for_donor,
  get_seva_details,
  get_currency_list,
} from '../../webApi/service';

// components
import Header from '../../components/Common/Header';
import Section from '../../components/Common/Section';
import LabelCard from '../../components/Common/LabelCard';
import PrimaryButton from '../../components/Common/PrimaryButton';

const DonationReceiept = ({navigation, route}) => {
  const store = Store();

  // PERSONAL DETAILS STATES
  const [nationalities] = useState([
    {label: 'Indian', value: 'I'},
    {label: 'Other', value: 'O'},
  ]); // nationalities array

  const [donationCats, setDonationCats] = useState([]); // donation category options array state
  const [donationSubCats, setDonationSubCats] = useState([]); // donation sub-category options array state
  const [sevaList, setSevaList] = useState([]); // seva options array state
  const [donationCat, setDonationCat] = useState(''); // selected donation category state
  const [donationSubCat, setDonationSubCat] = useState(''); // selected donation sub category state
  const [sevaId, setSevaId] = useState(''); // selected seva state
  const [is80gRequired, setIs80gRequired] = useState('N'); // user 80g requirement
  const [partialPayment, setPartialPayment] = useState(false); // partial payment state
  const [drAmount, setDrAmount] = useState(''); // seva amount state
  const [currencyList, setCurrencyList] = useState([]); // currency options array state
  const [currency, setCurrency] = useState('INR'); // selected currency state
  const [paymentModeList] = useState([
    {value: 'CH', label: 'CASH'},
    {value: 'CQ', label: 'CHEQUE'},
    {value: 'DD', label: 'DEMAND DRAFT'},
    {value: 'DC', label: 'DEBIT CARD'},
    {value: 'CC', label: 'CREDIT CARD'},
    {value: 'XR', label: 'BANK TRANSFER'},
    {value: 'WB', label: 'WEB TRANSFER'},
    {value: 'KD', label: 'KIND'},
    {value: 'AC', label: 'NACH'},
    {value: 'MS', label: 'M SWIPE'},
    {value: 'PT', label: 'PAYTM'},
    {value: 'BD', label: 'Billdesk'},
    {value: 'IM', label: 'Instamojo'},
  ]); // payment mode list state
  const [paymentMode, setPaymentMode] = useState('Cash'); // payment mode state
  const [noOfCheques, setNoOfCheques] = useState(''); // number of cheques state
  const [referenceNo, setReferenceNo] = useState(''); // payment mode reference number state
  const [sevakartaName, setSevakartaName] = useState(''); // seva karta name state
  const [opnDatePkr, setOpnDatePkr] = useState(false); // date picker modal state
  const [drSevaDate, setDrSevaDate] = useState(); // selected sava date state

  useEffect(() => {
    // partialPayment <- work from here
    const unSubscribe = navigation.addListener('focus', () => {
      console.log('Donation Receipt Focused');
      BackHandler.addEventListener('hardwareBackPress', () => {
        console.log('BackHandler In Donation Receipt is called');
        // navigation.navigate('DonorSelection');
        route?.params?.from === 'ENRL'
          ? navigation.navigate('CustomDrawer')
          : navigation.goBack();
        return true;
      });
      getCurrencyList();
      !store?.routeInfo?.categoryId &&
        !store?.routeInfo?.purposeId &&
        !store?.routeInfo?.sevaId &&
        getDonationCategories(),
        store?.routeInfo?.is80gRequired &&
          setIs80gRequired(store?.routeInfo?.is80gRequired);
      store?.routeInfo?.drAmount
        ? setDrAmount(store?.routeInfo?.drAmount)
        : store?.routeInfo?.sevaMinAmount &&
          (store?.routeInfo?.categoryId === '5'
            ? setDrAmount(
                (
                  Number(store?.routeInfo?.sevaMinAmount?.replace(/\,/g, '')) *
                  Number(store?.routeInfo?.noOfSlots)
                ).toString(),
              )
            : setDrAmount(store?.routeInfo?.sevaMinAmount?.replace(/\,/g, '')));
      store?.routeInfo?.currency && setCurrency(store?.routeInfo?.currency);
      store?.routeInfo?.paymentMode &&
        setPaymentMode(store?.routeInfo?.paymentMode);
      store?.routeInfo?.noOfCheques &&
        setNoOfCheques(store?.routeInfo?.noOfCheques);
      store?.routeInfo?.referenceNo &&
        setReferenceNo(store?.routeInfo?.referenceNo);
      store?.routeInfo?.sevakartaName &&
        setSevakartaName(store?.routeInfo?.sevakartaName);
      store?.routeInfo?.drSevaDate &&
        setDrSevaDate(new Date(store?.routeInfo?.drSevaDate));
    });
    return unSubscribe;
  }, [store?.routeInfo]);

  // get donation category list
  const getDonationCategories = async () => {
    const payload = {
      accessKey,
      deviceId: store?.deviceId,
      loginId: store?.userData?.userId,
      sessionId: store?.userData?.session_id,
    };

    console.log(
      'GET SEVA CATEGORIES:',
      baseUrl + get_seva_category_list,
      payload,
    );

    await axios
      .post(baseUrl + get_seva_category_list, payload)
      .then(res => {
        res.data.successCode === 1
          ? setDonationCats(
              // res.data.data?.filter(each => each?.categoryId !== '1'),
              res.data.data, // <- changed beacuse patronship balance payment
            )
          : (setDonationCats([]),
            setDonationSubCats([]),
            setSevaList([]),
            showMessage({
              message: 'Opps!',
              description: 'No options available right now',
              type: 'info',
              floating: true,
              icon: 'auto',
            }));
      })
      .catch(err => {
        console.log('Error Category:', err),
          showMessage({
            message: 'Error!',
            description: 'Please check your internet connection',
            type: 'danger',
            floating: true,
            icon: 'auto',
          });
      });
  };

  // get patron list connected to donor
  const getPatronList = async categoryId => {
    const payload = {
      accessKey,
      deviceId: store?.deviceId,
      loginId: store?.userData?.userId,
      sessionId: store?.userData?.session_id,
      donorId: store?.newDonor?.donorId,
    };

    console.log(
      'GET PATRON LIST:',
      baseUrl + get_patron_list_for_donor,
      payload,
    );

    await axios
      .post(baseUrl + get_patron_list_for_donor, payload)
      .then(res => {
        console.log(res?.data);
      })
      .catch(err => {
        console.log('Error in patron fetching:', err);
      });
  };

  // get donation sub-categories list
  const getDonationSubCategories = async id => {
    const payload = {
      accessKey,
      deviceId: store?.deviceId,
      loginId: store?.userData?.userId,
      sessionId: store?.userData?.session_id,
      categoryId: id,
    };

    console.log(
      'GET SEVA SUB CATEGORIES:',
      baseUrl + get_seva_sub_category_list,
      payload,
    );

    await axios
      .post(baseUrl + get_seva_sub_category_list, payload)
      .then(res => {
        res.data.successCode === 1
          ? setDonationSubCats(
              res.data?.data?.filter(each => each?.isActive === 'Y'),
            )
          : (setDonationSubCats([]),
            setSevaList([]),
            showMessage({
              message: 'Opps!',
              description: 'No purpose available for this category',
              type: 'info',
              floating: true,
              icon: 'auto',
            }));
      })
      .catch(err => {
        console.log('Error Sub Category:', err),
          showMessage({
            message: 'Error!',
            description: 'Please check your internet connection',
            type: 'danger',
            floating: true,
            icon: 'auto',
          });
      });
  };

  // get seva list
  const getSevaList = async ids => {
    const payload = {
      accessKey,
      deviceId: store?.deviceId,
      loginId: store?.userData?.userId,
      sessionId: store?.userData?.session_id,
      categoryId: donationCat,
      subCategoryId: ids.value,
    };

    console.log('GET SEVA DETAILS:', baseUrl + get_seva_details, payload);

    await axios
      .post(baseUrl + get_seva_details, payload)
      .then(res => {
        res.data.successCode === 1
          ? (setSevaList(
              res.data.data?.filter(each => each?.slotBased !== 'Y'),
            ),
            console.log(res.data.data?.filter(each => each?.slotBased !== 'Y')))
          : (setSevaList([]),
            showMessage({
              message: 'Opps!',
              description: 'No sava available for this purpose',
              type: 'info',
              floating: true,
              icon: 'auto',
            }));
      })
      .catch(err => {
        console.log('Error Seva:', err),
          showMessage({
            message: 'Error!',
            description: 'Please check your internet connection',
            type: 'danger',
            floating: true,
            icon: 'auto',
          });
      });
  };

  // get currency list
  const getCurrencyList = async () => {
    const payload = {
      accessKey,
      deviceId: store?.deviceId,
      loginId: store?.userData?.userId,
      sessionId: store?.userData?.session_id,
    };

    console.log('GET CURRENCY CODE:', baseUrl + get_currency_list, payload);

    await axios
      .post(baseUrl + get_currency_list, payload)
      .then(res =>
        res.data.successCode === 1
          ? setCurrencyList(res.data.data)
          : showMessage({
              message: 'Opps!',
              description: 'No currency available now',
              type: 'info',
              floating: true,
              icon: 'auto',
            }),
      )
      .catch(err => {
        console.log('Error currency list:', err),
          showMessage({
            message: 'Error!',
            description: 'Please check your internet connection',
            type: 'danger',
            floating: true,
            icon: 'auto',
          });
      });
  };

  // review donation reciept
  const review = async () => {
    // nationality data extraction
    let nationalityLabel = nationalities.find(
      each => each.value === store?.newDonor?.nationality,
    )?.label;

    // category data extraction
    let categoryName;
    let categoryCode;
    donationCat &&
      ((categoryName = donationCats
        ?.find(each => each?.categoryId === donationCat)
        ?.categoryName.toUpperCase()),
      (categoryCode = donationCats?.find(
        each => each?.categoryId === donationCat,
      )?.categoryCode));

    // sub category / purpose data extraction
    let purposeTitle;
    let subCategoryCode;
    donationSubCat &&
      ((purposeTitle = donationSubCats
        ?.find(each => each?.purposeId === donationSubCat)
        ?.purposeTitle?.toUpperCase()),
      (subCategoryCode = donationSubCats?.find(
        each => each?.purposeId === donationSubCat,
      )?.purposeCode));

    // seva data extraction
    let seveName;
    let sevaCode;
    let sevaCalendarId;
    let donationCode;
    let slotBased;
    let sevaDate;
    sevaId &&
      ((seveName = sevaList
        ?.find(each => each.sevaId === sevaId)
        ?.sevaName?.toUpperCase()),
      (sevaCode = sevaList?.find(each => each.sevaId === sevaId)?.sevaCode),
      (sevaCalendarId = sevaList?.find(
        each => each.sevaId === sevaId,
      )?.sevaCalendarId),
      (donationCode = sevaList?.find(
        each => each.sevaId === sevaId,
      )?.donationCode),
      (slotBased = sevaList?.find(each => each.sevaId === sevaId)?.slotBased),
      (sevaDate = sevaList?.find(each => each.sevaId === sevaId)?.sevaDates?.[0]
        ?.sevaDate));

    // extra route data
    let dataFromCurrent = {
      ...(sevaDate && {sevaDate}), // sevaDate
      ...(sevaId && {sevaId}), // seva
      ...(seveName && {seveName}), // seveName
      ...(sevaCode && {sevaCode}), // sevaCode
      ...(sevaCalendarId && {sevaCalendarId}), // sevaCalendarId
      ...(donationCode && {donationCode}), // donationCode
      ...(slotBased && {slotBased}), // slotBased
      ...(categoryName && {categoryName}), // categoryName
      ...(purposeTitle && {purposeTitle}), // purposeTitle
    };

    !(store?.routeInfo?.categoryId || donationCat)
      ? showMessage({
          message: 'Warning!',
          description: 'Please select a category',
          type: 'warning',
          floating: true,
          icon: 'auto',
        })
      : !(store?.routeInfo?.purposeId || donationSubCat)
      ? showMessage({
          message: 'Warning!',
          description: 'Please select a sub-category',
          type: 'warning',
          floating: true,
          icon: 'auto',
        })
      : !(store?.routeInfo?.sevaId || sevaId)
      ? showMessage({
          message: 'Warning!',
          description: 'Please select a seva',
          type: 'warning',
          floating: true,
          icon: 'auto',
        })
      : (store?.routeInfo?.isPartialPayment === 'N' ||
          sevaList?.find(each => each?.sevaId === sevaId)?.isPartialPayment ===
            'Y') &&
        (Number(drAmount) <
          Number(store?.routeInfo?.sevaAmount?.replace(/\,/g, '')) ||
          Number(drAmount) <
            Number(sevaList?.find(each => each?.sevaId === sevaId)?.sevaAmount))
      ? showMessage({
          message: 'Warning!',
          description: 'Partial payment is not allowed for this seva',
          type: 'warning',
          floating: true,
          icon: 'auto',
        })
      : (store?.routeInfo?.sevaMinAmount ||
          sevaList?.find(each => each?.sevaId === sevaId)?.sevaMinAmount) &&
        (Number(drAmount) <
          Number(store?.routeInfo?.sevaMinAmount?.replace(/\,/g, '')) ||
          Number(drAmount) <
            Number(
              sevaList?.find(each => each?.sevaId === sevaId)?.sevaMinAmount,
            ))
      ? showMessage({
          message: 'Warning!',
          description: 'Amount cannot be less than minimum seva amount',
          type: 'warning',
          floating: true,
          icon: 'auto',
        })
      : Number(drAmount) < 1
      ? showMessage({
          message: 'Warning!',
          description: 'Amount cannot be zero',
          type: 'warning',
          floating: true,
          icon: 'auto',
        })
      : !currency
      ? showMessage({
          message: 'Warning!',
          description: 'Please select a currency type',
          type: 'warning',
          floating: true,
          icon: 'auto',
        })
      : !paymentMode
      ? showMessage({
          message: 'Warning!',
          description: 'Please select a payment mode',
          type: 'warning',
          floating: true,
          icon: 'auto',
        })
      : paymentMode === 'Cheque' && Number(noOfCheques) < 1
      ? showMessage({
          message: 'Warning!',
          description: 'No of cheques should be more than zero',
          type: 'warning',
          floating: true,
          icon: 'auto',
        })
      : (paymentMode === 'Cheque' ||
          paymentMode === 'Cheque' ||
          paymentMode === 'Credit/Debit' ||
          paymentMode === 'Bank Transfer' ||
          paymentMode === 'M-Swipe' ||
          paymentMode === 'PayTM' ||
          paymentMode === 'Razorpay') &&
        referenceNo?.length < 1
      ? showMessage({
          message: 'Warning!',
          description: 'Please add reference number',
          type: 'warning',
          floating: true,
          icon: 'auto',
        })
      : (store?.setRouteInfo({
          ...store?.routeInfo,
          ...(Object.keys(dataFromCurrent).length > 0 && {...dataFromCurrent}), // spreading object based on condition
          is80gRequired,
          drAmount,
          paymentMode,
          noOfCheques,
          referenceNo,
          currency,
          sevakartaName,
          drSevaDate:
            store?.routeInfo?.blockSevaDate === 'N' ||
            sevaList?.find(each => each?.sevaId === sevaId)?.blockSevaDate ===
              'N'
              ? moment(drSevaDate)?.format('DD-MMM-YYYY')
              : '',
        }),
        navigation.navigate('ReviewReceipt'));
  };

  return (
    <LinearGradient // gradient container
      colors={[COLORS.tertiary, COLORS.quaternary, COLORS.mistyMoss]}
      style={styles.container}>
      <Header // header
        color={COLORS.black}
        leftButtonIcon="chevron-left"
        title="CREATE RECEIPT"
        onPressLeft={() =>
          // navigation.navigate('DonorSelection')
          route?.params?.from === 'ENRL'
            ? navigation.navigate('CustomDrawer')
            : navigation.goBack()
        }
      />
      <ScrollView
        style={{flex: 1}}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          alignItems: 'center',
          paddingBottom: SIZES.paddingHuge,
        }}>
        {/* PERSONAL DETAILS REVIEW SECTION */}

        <LabelCard
          name="PERSONAL DETAILS"
          rightItem={
            <TouchableOpacity
              onPress={() => navigation.navigate('CreateDonor', route?.params)}>
              <Text style={[styles.identifierTxt, {color: COLORS.blue}]}>
                EDIT
              </Text>
            </TouchableOpacity>
          }>
          {
            // patron id review
            store?.routeInfo?.patronId && (
              <View style={[styles.valCont, {marginTop: 0}]}>
                <Text style={styles.identifierTxt}>Patron ID :</Text>
                <Text style={styles.valueTxt}>
                  {store?.routeInfo?.patronId}
                </Text>
              </View>
            )
          }

          {
            // donor id review
            store?.newDonor?.donorId && (
              <View
                style={[
                  styles.valCont,
                  {
                    marginTop: store?.routeInfo?.patronId
                      ? SIZES.paddingSmall
                      : 0,
                  },
                ]}>
                <Text style={styles.identifierTxt}>Donor ID :</Text>
                <Text style={styles.valueTxt}>{store?.newDonor?.donorId}</Text>
              </View>
            )
          }

          {
            // name review
            (store?.newDonor?.salutation?.length > 0 ||
              store?.newDonor?.firstName?.length > 0 ||
              store?.newDonor?.lastName?.length > 0) && (
              <View
                style={[
                  styles.valCont,
                  {
                    marginTop: store?.newDonor?.donorId
                      ? SIZES.paddingSmall
                      : 0,
                  },
                ]}>
                <Text style={styles.identifierTxt}>Donor Name :</Text>
                <Text style={styles.valueTxt}>
                  {store?.newDonor?.salutation +
                    ' ' +
                    store?.newDonor?.firstName +
                    ' ' +
                    store?.newDonor?.lastName}
                </Text>
              </View>
            )
          }

          {
            // mobile review
            store?.newDonor?.mobileNumber?.length > 0 && (
              <View style={styles.valCont}>
                <Text style={styles.identifierTxt}>Mobile :</Text>
                <Text style={styles.valueTxt}>
                  {store?.newDonor?.mobileNumber}
                </Text>
              </View>
            )
          }

          {
            // alternate mobile review
            store?.newDonor?.mobile2?.length > 0 && (
              <View style={styles.valCont}>
                <Text style={styles.identifierTxt}>Alternate Mobile :</Text>
                <Text style={styles.valueTxt}>{store?.newDonor?.mobile2}</Text>
              </View>
            )
          }

          {
            // email review
            store?.newDonor?.email?.length > 0 && (
              <View style={styles.valCont}>
                <Text style={styles.identifierTxt}>Email :</Text>
                <Text style={styles.valueTxt}>{store?.newDonor?.email}</Text>
              </View>
            )
          }

          {
            // alternate email review
            store?.newDonor?.email2?.length > 0 && (
              <View style={styles.valCont}>
                <Text style={styles.identifierTxt}>Alternate Email :</Text>
                <Text style={styles.valueTxt}>{store?.newDonor?.email2}</Text>
              </View>
            )
          }

          {
            // pan review
            store?.newDonor?.pan?.length > 0 && (
              <View style={styles.valCont}>
                <Text style={styles.identifierTxt}>PAN :</Text>
                <Text style={styles.valueTxt}>{store?.newDonor?.pan}</Text>
              </View>
            )
          }
          <View // nationality review
            style={styles.valCont}>
            <Text style={styles.identifierTxt}>Nationalilty :</Text>
            <Text style={styles.valueTxt}>
              {
                nationalities.find(
                  each => each.value === store?.newDonor?.nationality,
                )?.label
              }
            </Text>
          </View>
        </LabelCard>

        {/* SEVA DETAILS SECTION */}

        <Section
          name="SEVA DETAILS"
          leftItem={
            <MaterialCommunityIcons // left icon
              name="hand-extended-outline"
              size={25}
              color={COLORS.darkGray}
              style={{marginRight: SIZES.paddingSmall}}
            />
          }>
          {store?.routeInfo?.categoryId && store?.routeInfo?.categoryName ? (
            <View // category review
              style={[styles.valCont, styles.valContEx]}>
              <Text style={styles.identifierTxt}>Category :</Text>
              <Text style={styles.valueTxt}>
                {store?.routeInfo?.categoryName?.toUpperCase()}
              </Text>
            </View>
          ) : (
            <Dropdown // category dropdown
              placeholder="Select Category"
              style={styles.dropStyle}
              placeholderStyle={styles.dropPlaceholder}
              selectedTextStyle={styles.dropSelectedTxt}
              containerStyle={styles.dropContainer}
              fontFamily={FONTS.josefinSansRegular}
              data={donationCats?.map(item => ({
                label: item.categoryName.toUpperCase(),
                value: item.categoryId,
              }))}
              value={donationCat}
              labelField="label"
              valueField="value"
              renderItem={item => (
                <Text style={styles.dropText}>{item.label.toUpperCase()}</Text>
              )}
              onChange={item => (
                setDonationCat(item.value),
                setDonationSubCat([]),
                setSevaList([]),
                setDonationSubCat(''),
                setSevaId(''),
                setIs80gRequired('N'),
                setPartialPayment(false),
                getDonationSubCategories(item.value),
                item.value === '1' && getPatronList(item.value)
              )}
            />
          )}

          {
            // ((store?.routeInfo?.purposeId && store?.routeInfo?.purposeTitle) ||
            //   donationSubCats?.length > 0) &&

            store?.routeInfo?.purposeId && store?.routeInfo?.purposeTitle ? (
              <View // sub-category review
                style={[styles.valCont, styles.valContEx]}>
                <Text style={styles.identifierTxt}>Sub Category :</Text>
                <Text style={styles.valueTxt}>
                  {store?.routeInfo?.purposeTitle?.toUpperCase()}
                </Text>
              </View>
            ) : (
              <Dropdown // sub category dropdown
                placeholder="Select Sub-Category"
                style={styles.dropStyle}
                placeholderStyle={styles.dropPlaceholder}
                selectedTextStyle={styles.dropSelectedTxt}
                containerStyle={styles.dropContainer}
                fontFamily={FONTS.josefinSansRegular}
                data={donationSubCats?.map(item => ({
                  label: item.purposeTitle.toUpperCase(),
                  value: item.purposeId,
                }))}
                value={donationSubCat}
                labelField="label"
                valueField="value"
                renderItem={item => (
                  <Text style={styles.dropText}>
                    {item.label.toUpperCase()}
                  </Text>
                )}
                onChange={item => (
                  setDonationSubCat(item.value),
                  setSevaList([]),
                  setSevaId(''),
                  setIs80gRequired('N'),
                  setPartialPayment(false),
                  getSevaList(item)
                )}
              />
            )
          }

          {
            // ((store?.routeInfo?.sevaId && store?.routeInfo?.sevaName) ||
            //   sevaList?.length > 0) &&

            store?.routeInfo?.sevaId && store?.routeInfo?.sevaName ? (
              <View // seva review
                style={[styles.valCont, styles.valContEx]}>
                <Text style={styles.identifierTxt}>Seva :</Text>
                <Text style={styles.valueTxt}>
                  {store?.routeInfo?.sevaName?.toUpperCase()}
                </Text>
              </View>
            ) : (
              <Dropdown // seva dropdown
                placeholder="Select Seva"
                style={styles.dropStyle}
                placeholderStyle={styles.dropPlaceholder}
                selectedTextStyle={styles.dropSelectedTxt}
                containerStyle={styles.dropContainer}
                fontFamily={FONTS.josefinSansRegular}
                data={sevaList?.map(item => ({
                  label: item.sevaName.toUpperCase(),
                  value: item.sevaId,
                }))}
                value={sevaId}
                labelField="label"
                valueField="value"
                renderItem={item => (
                  <Text style={styles.dropText}>
                    {item.label.toUpperCase()}
                  </Text>
                )}
                onChange={item => {
                  setIs80gRequired('N');
                  setPartialPayment(false);
                  setSevaId(item.value);
                }}
              />
            )
          }

          {(store?.routeInfo?.isEghtyG === 'Y' ||
            sevaList?.find(each => each?.sevaId === sevaId)?.isEghtyG ===
              'Y') && (
            <View // 80G information
              style={[styles.valCont, {paddingHorizontal: SIZES.paddingSmall}]}>
              <Text style={[styles.valueTxt, {flex: 1}]}>
                Donor wants 80G :
              </Text>

              <View style={styles.radio}>
                <View style={styles.radio}>
                  <RadioButton
                    status={is80gRequired === 'Y' ? 'checked' : 'unchecked'}
                    onPress={() => setIs80gRequired('Y')}
                  />
                  <Text style={styles.valueTxt}>Yes</Text>
                </View>
                <View style={styles.radio}>
                  <RadioButton
                    status={is80gRequired === 'N' ? 'checked' : 'unchecked'}
                    onPress={() => setIs80gRequired('N')}
                  />
                  <Text style={styles.valueTxt}>No</Text>
                </View>
              </View>
            </View>
          )}

          {(store?.routeInfo?.isEghtyG === 'Y' ||
            sevaList?.find(each => each?.sevaId === sevaId)?.isEghtyG ===
              'Y') &&
            (store?.routeInfo?.sevaMinAmount ||
              sevaList?.find(each => each?.sevaId === sevaId) ||
              store?.routeInfo?.isPartialPayment === 'Y' ||
              sevaList?.find(each => each?.sevaId === sevaId)
                ?.isPartialPayment === 'Y') && (
              <View style={styles.separator} />
            )}

          {(store?.routeInfo?.sevaMinAmount ||
            sevaList?.find(each => each?.sevaId === sevaId) ||
            store?.routeInfo?.isPartialPayment === 'Y' ||
            sevaList?.find(each => each?.sevaId === sevaId)
              ?.isPartialPayment === 'Y') && (
            <View // amount information
              style={[styles.valCont, {paddingHorizontal: SIZES.paddingSmall}]}>
              {(store?.routeInfo?.sevaMinAmount ||
                sevaList?.find(each => each?.sevaId === sevaId)
                  ?.sevaMinAmount) && (
                <Text style={[styles.valueTxt, {flex: 1}]}>
                  {`Minimum ${
                    store?.routeInfo?.sevaMinAmount
                      ? Number(
                          store?.routeInfo?.sevaMinAmount?.replace(/,/g, ''),
                        )
                          ?.toLocaleString('en-IN', {
                            maximumFractionDigits: 2,
                            style: 'currency',
                            currency: 'INR',
                          })
                          ?.split('.')[0]
                      : Number(
                          sevaList
                            ?.find(each => each?.sevaId === sevaId)
                            ?.sevaMinAmount?.replace(/,/g, ''),
                        )
                          ?.toLocaleString('en-IN', {
                            maximumFractionDigits: 2,
                            style: 'currency',
                            currency: 'INR',
                          })
                          ?.split('.')[0]
                  }`}
                </Text>
              )}

              {
                // partial payment checkbox
                (store?.routeInfo?.isPartialPayment === 'Y' ||
                  sevaList?.find(each => each?.sevaId === sevaId)
                    ?.isPartialPayment === 'Y') && (
                  <View style={{flexDirection: 'row', flex: 1}}>
                    <Checkbox
                      disabled={store?.routeInfo?.isPartialPayment === 'N'}
                      status={partialPayment ? 'checked' : 'unchecked'}
                      onPress={() => setPartialPayment(!partialPayment)}
                    />
                    <Text style={styles.valueTxt}>Partial Payment</Text>
                  </View>
                )
              }
            </View>
          )}

          {/* store?.routeInfo?.categoryId === '5' */}

          <TextInput // amount input
            editable={store?.routeInfo?.categoryId != '5'}
            style={[
              styles.input,
              {borderWidth: store?.routeInfo?.categoryId != '5' ? 1 : 0},
            ]}
            placeholder="Amount"
            placeholderTextColor={COLORS.gray}
            keyboardAppearance="dark"
            keyboardType="numeric"
            returnKeyType="done"
            color={COLORS.black}
            onChangeText={text => setDrAmount(text)}
            value={drAmount}
          />

          <Dropdown // currency dropdown
            placeholder="Select Currency"
            style={styles.dropStyle}
            placeholderStyle={styles.dropPlaceholder}
            selectedTextStyle={styles.dropSelectedTxt}
            containerStyle={styles.dropContainer}
            fontFamily={FONTS.josefinSansRegular}
            data={currencyList?.map(item => ({
              // label: item.currency, // <- changing according to sreedhar sir's requirements
              label: item.currencyCode,
              value: item.currencyCode,
            }))}
            value={currency}
            labelField="label"
            valueField="value"
            renderItem={item => (
              <Text style={styles.dropText}>{item.label.toUpperCase()}</Text>
            )}
            onChange={item => setCurrency(item.value)}
          />

          <Dropdown // payment mode dropdown
            placeholder="Select Currency"
            style={styles.dropStyle}
            placeholderStyle={styles.dropPlaceholder}
            selectedTextStyle={styles.dropSelectedTxt}
            containerStyle={styles.dropContainer}
            fontFamily={FONTS.josefinSansRegular}
            data={paymentModeList}
            value={paymentMode}
            labelField="label"
            valueField="value"
            renderItem={item => (
              <Text style={styles.dropText}>{item.label}</Text>
            )}
            onChange={item => setPaymentMode(item.value)}
          />

          {paymentMode === 'Cheque' && (
            <TextInput // number of cheques input
              style={styles.input}
              placeholder="Number of Cheques"
              placeholderTextColor={COLORS.gray}
              keyboardAppearance="dark"
              keyboardType="numeric"
              returnKeyType="done"
              color={COLORS.black}
              onChangeText={text => setNoOfCheques(text)}
              value={noOfCheques}
            />
          )}

          {(paymentMode === 'Cheque' ||
            paymentMode === 'Credit/Debit' ||
            paymentMode === 'Bank Transfer' ||
            paymentMode === 'M-Swipe' ||
            paymentMode === 'PayTM' ||
            paymentMode === 'Razorpay') && (
            <TextInput // reference number input
              style={styles.input}
              placeholder="Reference Number"
              placeholderTextColor={COLORS.gray}
              keyboardAppearance="dark"
              keyboardType="default"
              returnKeyType="done"
              color={COLORS.black}
              onChangeText={text => setReferenceNo(text)}
              value={referenceNo}
            />
          )}

          {
            // seva karta input
            (store?.routeInfo?.blockSevakName === 'N' ||
              sevaList?.find(each => each?.sevaId === sevaId)
                ?.blockSevakName === 'N') && (
              <TextInput
                style={styles.input}
                placeholder="Seva Karta Name"
                placeholderTextColor={COLORS.gray}
                keyboardAppearance="dark"
                keyboardType="default"
                returnKeyType="done"
                color={COLORS.black}
                onChangeText={text => setSevakartaName(text)}
                value={sevakartaName}
              />
            )
          }

          {
            // dr seva date button
            (store?.routeInfo?.blockSevaDate === 'N' ||
              sevaList?.find(each => each?.sevaId === sevaId)?.blockSevaDate ===
                'N') && (
              <PrimaryButton
                style={[styles.input, styles.dateBtn]}
                onPress={() => setOpnDatePkr(true)}
                iconColor={COLORS.flatBlue}
                icon="calendar-range"
                textStyle={{
                  color: COLORS.darkGray,
                  fontSize: SIZES.fontSmall,
                  fontFamily: FONTS.josefinSansRegular,
                }}
                name={
                  drSevaDate
                    ? moment(drSevaDate)?.format('DD-MMM-YYYY')
                    : 'DR Seva Date ---/--/----'
                }
              />
            )
          }

          <DateTimePickerModal // date picker
            isVisible={opnDatePkr}
            modal
            onConfirm={date => (setDrSevaDate(date), setOpnDatePkr(false))}
            onCancel={() => setOpnDatePkr(false)}
            mode="date"
            date={drSevaDate}
            minimumDate={new Date()}
          />
        </Section>

        {/* CREATE RECIEPTBUTTON */}

        <PrimaryButton
          icon="eye-check-outline"
          style={styles.primaryBtn}
          name="Review Receiept"
          onPress={review}
        />
      </ScrollView>
    </LinearGradient>
  );
};

export default DonationReceiept;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: COLORS.white,
  },
  identifierTxt: {
    flex: 1,
    color: COLORS.black,
    fontSize: SIZES.fontSmall,
    fontFamily: FONTS.josefinSansBold,
  },
  identifierTxtEx: {flex: 0, textAlignVertical: 'center'},
  valueTxt: {
    flex: 1.2,
    color: COLORS.black,
    fontSize: SIZES.fontSmall,
    fontFamily: FONTS.josefinSansRegular,
    textAlignVertical: 'center',
  },
  valCont: {
    flexDirection: 'row',
    flex: 1,
    marginTop: SIZES.paddingSmall,
  },
  valContEx: {
    paddingHorizontal: SIZES.paddingSmall,
    backgroundColor: COLORS.antiFlashWhite,
    borderRadius: SIZES.radiusSmall,
    padding: SIZES.paddingMedium,
  },
  dropStyle: {
    flex: 0.7,
    height: SIZES.height * 0.065,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: SIZES.radiusSmall,
    backgroundColor: COLORS.antiFlashWhite,
    paddingHorizontal: SIZES.paddingSmall,
    marginTop: SIZES.paddingSmall,
  },
  dropPlaceholder: {color: COLORS.gray, fontSize: SIZES.fontSmall},
  dropSelectedTxt: {color: COLORS.black, fontSize: SIZES.fontSmall},
  dropContainer: {
    borderColor: COLORS.lightGray,
    borderRadius: SIZES.radiusSmall,
    borderWidth: 1,
    overflow: 'hidden',
  },
  dropText: {
    color: COLORS.black,
    padding: SIZES.paddingSmall,
    fontFamily: FONTS.josefinSansRegular,
  },
  separator: {
    height: 1,
    width: '100%',
    backgroundColor: COLORS.lightGray,
  },
  input: {
    marginTop: SIZES.paddingSmall,
    width: '100%',
    borderRadius: SIZES.radiusSmall,
    backgroundColor: COLORS.antiFlashWhite,
    borderColor: COLORS.lightGray,
    borderWidth: 1,
    fontSize: SIZES.fontSmall,
    fontFamily: FONTS.josefinSansRegular,
    height: SIZES.height * 0.065,
    paddingHorizontal: SIZES.paddingSmall,
    alignItems: 'center',
  },
  radio: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  detailsSection: {
    padding: SIZES.paddingSmall,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateBtn: {
    justifyContent: 'flex-start',
    elevation: 0,
    shadowOpacity: 0,
  },
  primaryBtn: {
    alignSelf: 'center',
    width: SIZES.width * 0.9,
  },
});
