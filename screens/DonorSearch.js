import {
  SafeAreaView,
  StyleSheet,
  StatusBar,
  Text,
  View,
  ScrollView,
  TextInput,
  BackHandler,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {Dropdown} from 'react-native-element-dropdown';
import {Checkbox} from 'react-native-paper';
import axios from 'axios';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import {showMessage} from 'react-native-flash-message';
import {COLORS, SIZES, FONTS} from '../constants';
import {Store} from '../store/Store';
import {baseUrl, get_donor_preacher_list, accessKey} from '../webApi/service';

// components
import Header from '../components/Common/Header';
import SearchBar from '../components/Search/SearchBar';
import CollapsableSection from '../components/Common/CollapsableSection';
import PrimaryButton from '../components/Common/PrimaryButton';

const DonorSearch = ({navigation}) => {
  const store = Store();

  // reference for search input
  const donorIdRef = useRef(null); // donor id search bar ref
  const donorNameRef = useRef(null); // donor name search bar ref
  const phoneRef = useRef(null); // phone search bar ref
  const emailRef = useRef(null); // email search bar ref
  const addressRef = useRef(null); // address search bar ref
  const stateRef = useRef(null); // state search bar ref
  const cityRef = useRef(null); // city search bar ref
  const PINRef = useRef(null); // zip search bar ref
  const drRef = useRef(null); // date range search bar ref

  // lens for search input states
  const [donorIdLens, setDonorIdLens] = useState(true); // donor id search bar lens
  const [donorNameLens, setDonorNameLens] = useState(true); // donor name search bar lens
  const [phoneLens, setPhoneLens] = useState(true); // phone lens
  const [emailLens, setEmailLens] = useState(true); // email lens
  const [addressLens, setAddressLens] = useState(true); // address lens
  const [stateLens, setStateLens] = useState(true); // state lens
  const [cityLens, setCityLens] = useState(true); // city lens
  const [PINLens, setPINLens] = useState(true); // zip lens
  const [drLens, setDrLens] = useState(true); // date range lens

  // section open/close states
  const [donorSearchOpn, setDonorSearchOpn] = useState(false); // donor search section open/close state
  const [contactSearchOpn, setContactSearchOpn] = useState(false); // contact search open
  const [fundraiserSearchOpn, setFundraiserSearchOpn] = useState(false); // fundraiser search open
  const [locationSearchOpn, setLocationSearchOpn] = useState(false); // location search open
  const [donationSearchOpn, setDonationSearchOpn] = useState(false); // donation search open

  // donor section states
  const [donorIdSearchkey, setDonorIdSearchkey] = useState(''); // donor id search key
  const [donorNameSearchkey, setDonorNameSearchkey] = useState(''); // donor name search key

  // contact section states
  const [phoneSearchkey, setPhoneSearchkey] = useState(''); // phone search key
  const [emailSearchkey, setEmailSearchkey] = useState(''); // email search key

  // fundraiser section states
  const [allocatedFundraiserList, setAllocatedFundraiserList] = useState([]); // allocated fundraiser list
  const [allocatedFundraiser, setAllocatedFundraiser] = useState(''); // allocated fundraiser
  const [enrolledFundraiserList, setEnrolledFundraiserList] = useState([]); // enrolled fundraiser list
  const [enrolledFundraiser, setEnrolledFundraiser] = useState(''); // enrolled fundraiser

  // location section states
  const [addressSearchkey, setAddressSearchkey] = useState(''); // address search key
  const [stateSearchkey, setStateSearchkey] = useState(''); // state search key
  const [citySearchkey, setCitySearchkey] = useState(''); // city search key
  const [PINSearchkey, setPINSearchkey] = useState(''); // zip search key
  const [residentialType, setResidentialType] = useState(false); // residential type
  const [officeType, setOfficeType] = useState(false); // office type

  // donation section states
  const [fromDatePicker, setFromDatePicker] = useState(false); // from date picker
  const [toDatePicker, setToDatePicker] = useState(false); // to date picker
  const [fromDate, setFromDate] = useState(new Date()); // from date hook
  const [selectedFromDate, setSelectedFromDate] = useState(null); // selected from date
  const [toDate, setToDate] = useState(new Date()); // end date hook
  const [selectedToDate, setSelectedToDate] = useState(null); // selected to date
  const [ranger] = useState([
    {label: 'Equal', value: '='},
    {label: 'More than', value: '>'},
    {label: 'Less than', value: '<'},
    {label: 'Between', value: '><'},
  ]); // amount range
  const [paidAmtCondition, setPaidAmtCondition] = useState(''); // paid range
  const [lastPaidAmtCondition, setLastAmtRanger] = useState(''); // last range
  const [paidAmount1, setPaidAmount1] = useState(''); // paid first
  const [paidAmount2, setPaidAmount2] = useState(''); // paid second
  const [lastPaidAmount1, setMinLastPaidAmount] = useState(''); // last first
  const [lastPaidAmount2, setMaxLastPaidAmount] = useState(''); // last second
  const [drSearchkey, setDrSearchkey] = useState(''); // date range search key
  const [incPatronPay, setIncPatronPay] = useState(false); // include patron payment
  const [excPatronPay, setExcPatronPay] = useState(false); // exclude patron payment

  const [donationCatLst] = useState([
    {label: 'Donataion Category', value: ''},
    {label: 'Green, paid within 6 months', value: 'Green'},
    {label: 'Orange, last paid before 6 months', value: 'Orange'},
    {label: 'Red, last paid before 2 years', value: 'Red'},
  ]); // donation category list
  const [donationCat, setDonationCat] = useState(''); // donation category

  useEffect(() => {
    const unSubscribe = navigation.addListener('focus', () => {
      getFundraiser();
      BackHandler.addEventListener('hardwareBackPress', () => {
        console.log('BackHandler In Donor Search is called');
        navigation.goBack();
        return true;
      });
    });

    return unSubscribe;
  }, []);

  // fetch fund raiser list
  const getFundraiser = async () => {
    await axios
      .post(baseUrl + get_donor_preacher_list, {
        accessKey: accessKey,
        deviceId: store.deviceId,
        loginId: store.userData?.userId,
        sessionId: store.userData?.session_id,
        userRole: store.userData?.userRole,
      })
      .then(res => {
        setAllocatedFundraiserList(res.data.allocatedPreacher);
        setEnrolledFundraiserList(res.data.enrolledPreacher);
      })
      .catch(err =>
        showMessage({
          message: 'Error!',
          description: 'Please check your internet connection',
          type: 'danger',
          floating: true,
          icon: 'auto',
        }),
      );
  };

  // search function
  const search = () => {
    // name validation
    donorNameSearchkey && !/^[a-zA-Z ]*$/.test(donorNameSearchkey)
      ? showMessage({
          message: 'Warning!',
          description: 'Please enter valid name',
          type: 'warning',
          floating: true,
          icon: 'auto',
        })
      : // indian phone number validation
      phoneSearchkey && !/^[0-9]{10}$/.test(phoneSearchkey)
      ? showMessage({
          message: 'Warning!',
          description: 'Please enter valid phone number',
          type: 'warning',
          floating: true,
          icon: 'auto',
        }) // pin code validation
      : PINSearchkey && PINSearchkey.length !== 7
      ? showMessage({
          message: 'Warning!',
          description: 'Please enter valid PIN code',
          type: 'warning',
          floating: true,
          icon: 'auto',
        }) // paid amount validation if case of between
      : paidAmtCondition === '><' && (!paidAmount1 || !paidAmount2)
      ? paidAmount2
        ? showMessage({
            message: 'Warning!',
            description: 'Please enter a minimum Paid amount',
            type: 'warning',
            floating: true,
            icon: 'auto',
          })
        : paidAmount1
        ? showMessage({
            message: 'Warning!',
            description: 'Please enter a maximum Paid amount',
            type: 'warning',
            floating: true,
            icon: 'auto',
          })
        : showMessage({
            message: 'Warning!',
            description: 'Please enter both Paid amount',
            type: 'warning',
            floating: true,
            icon: 'auto',
          })
      : // last paid amount validation if case of between
      lastPaidAmtCondition === '><' && (!lastPaidAmount1 || !lastPaidAmount2)
      ? lastPaidAmount2
        ? showMessage({
            message: 'Warning!',
            description: 'Please enter a minimum Last Paid amount',
            type: 'warning',
            floating: true,
            icon: 'auto',
          })
        : lastPaidAmount1
        ? showMessage({
            message: 'Warning!',
            description: 'Please enter a maximum Last Paid amount',
            type: 'warning',
            floating: true,
            icon: 'auto',
          })
        : showMessage({
            message: 'Warning!',
            description: 'Please enter both Last Paid amount',
            type: 'warning',
            floating: true,
            icon: 'auto',
          })
      : // in case of only one date exists show error
      selectedFromDate && !selectedToDate
      ? showMessage({
          message: 'Warning!',
          description: 'Please enter To Date',
          type: 'warning',
          floating: true,
          icon: 'auto',
        })
      : selectedToDate && !selectedFromDate
      ? showMessage({
          message: 'Warning!',
          description: 'Please enter From Date',
          type: 'warning',
          floating: true,
          icon: 'auto',
        })
      : navigation.navigate('Donor', {
          donorIdSearchkey,
          donorNameSearchkey,
          phoneSearchkey,
          emailSearchkey,
          allocatedFundraiser,
          enrolledFundraiser,
          addressSearchkey,
          stateSearchkey,
          citySearchkey,
          PINSearchkey,
          residentialType,
          officeType,
          selectedFromDate,
          selectedToDate,
          paidAmtCondition,
          paidAmount1,
          paidAmount2,
          lastPaidAmtCondition,
          lastPaidAmount1,
          lastPaidAmount2,
          drSearchkey,
          incPatronPay,
          excPatronPay,
          donationCat,
        });
  };

  // set address with params
  const setAddress = params => {
    setAddressSearchkey(params),
      params.length === 0 &&
        !stateSearchkey &&
        !citySearchkey &&
        !PINSearchkey &&
        (setResidentialType(false), setOfficeType(false));
  };

  // set state with params
  const setState = params => {
    setStateSearchkey(params);
    params.length === 0 &&
      !addressSearchkey &&
      !citySearchkey &&
      !PINSearchkey &&
      (setResidentialType(false), setOfficeType(false));
  };

  // set city with params
  const setCity = params => {
    setCitySearchkey(params);
    params.length === 0 &&
      !addressSearchkey &&
      !stateSearchkey &&
      !PINSearchkey &&
      (setResidentialType(false), setOfficeType(false));
  };

  // set pin with params
  const setPIN = params => {
    setPINSearchkey(params);
    params.length === 0 &&
      !addressSearchkey &&
      !stateSearchkey &&
      !citySearchkey &&
      (setResidentialType(false), setOfficeType(false));
  };

  const donorIdPress = () => {
    donorIdRef.current.focus(),
      setDonorIdLens(false),
      !donorNameSearchkey && setDonorNameLens(true),
      !phoneSearchkey && setPhoneLens(true),
      !emailSearchkey && setEmailLens(true),
      !addressSearchkey && setAddressLens(true),
      !stateSearchkey && setStateLens(true),
      !citySearchkey && setCityLens(true),
      !PINSearchkey && setPINLens(true),
      !drSearchkey && setDrLens(true);
  };

  const donorNamePress = () => {
    donorNameRef.current.focus(),
      setDonorNameLens(false),
      !donorIdSearchkey && setDonorIdLens(true),
      !phoneSearchkey && setPhoneLens(true),
      !emailSearchkey && setEmailLens(true),
      !addressSearchkey && setAddressLens(true),
      !stateSearchkey && setStateLens(true),
      !citySearchkey && setCityLens(true),
      !PINSearchkey && setPINLens(true),
      !drSearchkey && setDrLens(true);
  };

  const phonePress = () => {
    phoneRef.current.focus(),
      setPhoneLens(false),
      !donorIdSearchkey && setDonorIdLens(true),
      !donorNameSearchkey && setDonorNameLens(true),
      !emailSearchkey && setEmailLens(true),
      !addressSearchkey && setAddressLens(true),
      !stateSearchkey && setStateLens(true),
      !citySearchkey && setCityLens(true),
      !PINSearchkey && setPINLens(true),
      !drSearchkey && setDrLens(true);
  };

  const emailPress = () => {
    emailRef.current.focus(),
      setEmailLens(false),
      !donorIdSearchkey && setDonorIdLens(true),
      !donorNameSearchkey && setDonorNameLens(true),
      !phoneSearchkey && setPhoneLens(true),
      !addressSearchkey && setAddressLens(true),
      !stateSearchkey && setStateLens(true),
      !citySearchkey && setCityLens(true),
      !PINSearchkey && setPINLens(true),
      !drSearchkey && setDrLens(true);
  };

  const addressPress = () => {
    addressRef.current.focus(),
      setAddressLens(false),
      !donorIdSearchkey && setDonorIdLens(true),
      !donorNameSearchkey && setDonorNameLens(true),
      !phoneSearchkey && setPhoneLens(true),
      !emailSearchkey && setEmailLens(true),
      !stateSearchkey && setStateLens(true),
      !citySearchkey && setCityLens(true),
      !PINSearchkey && setPINLens(true),
      !drSearchkey && setDrLens(true);
  };

  const statePress = () => {
    stateRef.current.focus(),
      setStateLens(false),
      !donorIdSearchkey && setDonorIdLens(true),
      !donorNameSearchkey && setDonorNameLens(true),
      !phoneSearchkey && setPhoneLens(true),
      !emailSearchkey && setEmailLens(true),
      !addressSearchkey && setAddressLens(true),
      !citySearchkey && setCityLens(true),
      !PINSearchkey && setPINLens(true),
      !drSearchkey && setDrLens(true);
  };

  const cityPress = () => {
    cityRef.current.focus(),
      setCityLens(false),
      !donorIdSearchkey && setDonorIdLens(true),
      !donorNameSearchkey && setDonorNameLens(true),
      !phoneSearchkey && setPhoneLens(true),
      !emailSearchkey && setEmailLens(true),
      !addressSearchkey && setAddressLens(true),
      !stateSearchkey && setStateLens(true),
      !PINSearchkey && setPINLens(true),
      !drSearchkey && setDrLens(true);
  };

  const PINPress = () => {
    PINRef.current.focus(),
      setPINLens(false),
      !donorIdSearchkey && setDonorIdLens(true),
      !donorNameSearchkey && setDonorNameLens(true),
      !phoneSearchkey && setPhoneLens(true),
      !emailSearchkey && setEmailLens(true),
      !addressSearchkey && setAddressLens(true),
      !stateSearchkey && setStateLens(true),
      !citySearchkey && setCityLens(true),
      !drSearchkey && setDrLens(true);
  };

  const drPress = () => {
    drRef.current.focus(),
      setDrLens(false),
      !donorIdSearchkey && setDonorIdLens(true),
      !donorNameSearchkey && setDonorNameLens(true),
      !phoneSearchkey && setPhoneLens(true),
      !emailSearchkey && setEmailLens(true),
      !addressSearchkey && setAddressLens(true),
      !stateSearchkey && setStateLens(true),
      !citySearchkey && setCityLens(true),
      !PINSearchkey && setPINLens(true);
  };

  return (
    <SafeAreaView // container
      style={styles.container}>
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
          leftButtonIcon="chevron-left"
          title="SEARCH"
          onPressLeft={() => navigation.goBack()}
        />
        <ScrollView
          style={{flex: 1}}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            alignItems: 'center',
            paddingBottom: SIZES.paddingHuge,
          }}>
          {/* DONOR SECTION */}

          <CollapsableSection
            name="DONOR"
            leftItem={
              <MaterialCommunityIcons // left icon
                name="hand-coin-outline"
                size={25}
                color={COLORS.darkGray}
                style={{marginRight: SIZES.paddingSmall}}
              />
            }
            setOpen={setDonorSearchOpn}
            open={donorSearchOpn}>
            <>
              <SearchBar // search by donor id
                onPress={() => donorIdPress()}
                onFocus={() => donorIdPress()}
                lens={donorIdLens}
                reference={donorIdRef}
                style={styles.searchBar}
                placeholder="Donor Id"
                keyboardType="numeric"
                value={donorIdSearchkey}
                onChangeText={setDonorIdSearchkey}
                onSubmitEditing={search}
              />
              <SearchBar // search by donor name
                onPress={() => donorNamePress()}
                onFocus={() => donorNamePress()}
                reference={donorNameRef}
                lens={donorNameLens}
                style={styles.searchBar}
                placeholder="Donor Name"
                keyboardType="default"
                value={donorNameSearchkey}
                onChangeText={setDonorNameSearchkey}
                onSubmitEditing={search}
              />
            </>
          </CollapsableSection>

          {/* CONTACT SECTION */}

          <CollapsableSection
            name="CONTACT"
            leftItem={
              <MaterialCommunityIcons // left icon
                name="phone-outline"
                size={25}
                color={COLORS.darkGray}
                style={{marginRight: SIZES.paddingSmall}}
              />
            }
            setOpen={setContactSearchOpn}
            open={contactSearchOpn}>
            <>
              <SearchBar // search by phone number
                onPress={() => phonePress()}
                onFocus={() => phonePress()}
                reference={phoneRef}
                lens={phoneLens}
                style={styles.searchBar}
                placeholder="Phone Number"
                maxLength={10}
                keyboardType="numeric"
                value={phoneSearchkey}
                onChangeText={setPhoneSearchkey}
                onSubmitEditing={search}
              />
              <SearchBar // search by email
                onPress={() => emailPress()}
                onFocus={() => emailPress()}
                reference={emailRef}
                lens={emailLens}
                style={styles.searchBar}
                placeholder="Email"
                keyboardType="email-address"
                value={emailSearchkey}
                onChangeText={setEmailSearchkey}
                onSubmitEditing={search}
              />
            </>
          </CollapsableSection>

          {/* FUNDRAISER SECTION */}

          <CollapsableSection
            name="FUNDRAISER"
            leftItem={
              <MaterialCommunityIcons // left icon
                name="cash-refund"
                size={25}
                color={COLORS.darkGray}
                style={{marginRight: SIZES.paddingSmall}}
              />
            }
            setOpen={setFundraiserSearchOpn}
            open={fundraiserSearchOpn}>
            <>
              <Dropdown // search by allocated fundraiser
                placeholder="Allocated Fundraiser"
                style={styles.dropStyle}
                placeholderStyle={styles.dropPlaceholder}
                selectedTextStyle={styles.dropSelectedTxt}
                containerStyle={styles.dropContainer}
                fontFamily={FONTS.josefinSansRegular}
                data={
                  allocatedFundraiserList &&
                  allocatedFundraiserList.map(item => {
                    return {
                      label: item.preacherCode,
                      value: item.preacherCode,
                    };
                  })
                }
                value={allocatedFundraiser}
                labelField="label"
                valueField="value"
                renderItem={item => (
                  <Text style={styles.dropText}>{item.label}</Text>
                )}
                onChange={item => setAllocatedFundraiser(item.value)}
              />

              <Dropdown // search by enrolled fundraiser
                placeholder="Enrolled Fundraiser"
                style={styles.dropStyle}
                placeholderStyle={styles.dropPlaceholder}
                selectedTextStyle={styles.dropSelectedTxt}
                containerStyle={styles.dropContainer}
                fontFamily={FONTS.josefinSansRegular}
                data={
                  enrolledFundraiserList &&
                  enrolledFundraiserList?.map(item => {
                    return {
                      label: item.preacherCode,
                      value: item.preacherCode,
                    };
                  })
                }
                value={enrolledFundraiser}
                labelField="label"
                valueField="value"
                renderItem={item => (
                  <Text style={styles.dropText}>{item.label}</Text>
                )}
                onChange={item => setEnrolledFundraiser(item.value)}
              />
            </>
          </CollapsableSection>

          {/* LOCATION SECTION */}

          <CollapsableSection
            name="LOCATION"
            leftItem={
              <MaterialCommunityIcons // left icon
                name="map-marker-radius-outline"
                size={25}
                color={COLORS.darkGray}
                style={{marginRight: SIZES.paddingSmall}}
              />
            }
            setOpen={setLocationSearchOpn}
            open={locationSearchOpn}>
            <>
              <SearchBar // search by address
                onPress={() => addressPress()}
                onFocus={() => addressPress()}
                reference={addressRef}
                lens={addressLens}
                style={styles.searchBar}
                placeholder="Address"
                keyboardType="default"
                value={addressSearchkey}
                onChangeText={setAddress}
                onSubmitEditing={search}
              />
              <SearchBar // search by state
                onPress={() => statePress()}
                onFocus={() => statePress()}
                reference={stateRef}
                lens={stateLens}
                style={styles.searchBar}
                placeholder="State"
                keyboardType="default"
                value={stateSearchkey}
                onChangeText={setState}
                onSubmitEditing={search}
              />
              <SearchBar // search by city
                onPress={() => cityPress()}
                onFocus={() => cityPress()}
                reference={cityRef}
                lens={cityLens}
                style={styles.searchBar}
                placeholder="City"
                keyboardType="default"
                value={citySearchkey}
                onChangeText={setCity}
                onSubmitEditing={search}
              />
              <SearchBar // search by pin
                onPress={() => PINPress()}
                onFocus={() => PINPress()}
                reference={PINRef}
                lens={PINLens}
                style={styles.searchBar}
                placeholder="PIN"
                keyboardType="numeric"
                maxLength={7}
                value={PINSearchkey}
                onChangeText={setPIN}
                onSubmitEditing={search}
              />
              <View // address type button section
                style={{flexDirection: 'row', padding: SIZES.paddingSmall}}>
                <TouchableOpacity // residential button
                  activeOpacity={1}
                  onPress={() => {
                    !addressSearchkey &&
                    !stateSearchkey &&
                    !citySearchkey &&
                    !PINSearchkey
                      ? showMessage({
                          message: 'Empty!',
                          description:
                            'Please enter atleast one location value',
                          type: 'warning',
                          floating: true,
                          icon: 'auto',
                        })
                      : setResidentialType(!residentialType);
                  }}
                  style={styles.subSection}>
                  <Checkbox // residential checkbox
                    status={residentialType ? 'checked' : 'unchecked'}
                  />
                  <Text // residential address text
                    style={styles.txt}>
                    Residential
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity // office button
                  activeOpacity={1}
                  onPress={() => {
                    !addressSearchkey &&
                    !stateSearchkey &&
                    !citySearchkey &&
                    !PINSearchkey
                      ? showMessage({
                          message: 'Empty!',
                          description:
                            'Please enter atleast one location value',
                          type: 'warning',
                          floating: true,
                          icon: 'auto',
                        })
                      : setOfficeType(!officeType);
                  }}
                  style={styles.subSection}>
                  <Checkbox // office checkbox
                    status={officeType ? 'checked' : 'unchecked'}
                  />
                  <Text // office address
                    style={styles.txt}>
                    Office
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          </CollapsableSection>

          {/* DONATION SECTION */}

          <CollapsableSection
            name="DONATION"
            leftItem={
              <MaterialCommunityIcons // left icon
                name="hand-coin-outline"
                size={25}
                color={COLORS.darkGray}
                style={{marginRight: SIZES.paddingSmall}}
              />
            }
            setOpen={setDonationSearchOpn}
            open={donationSearchOpn}>
            <>
              <View // from till date section
                style={{flexDirection: 'row', padding: SIZES.paddingSmall}}>
                <TouchableOpacity // from date button
                  onPress={() => setFromDatePicker(true)}
                  style={styles.subSection}
                  activeOpacity={1}>
                  <MaterialCommunityIcons // from date icon
                    name="calendar-range"
                    size={30}
                    color={COLORS.flatBlue}
                  />
                  <Text // residential address text
                    style={styles.txt}>
                    From {selectedFromDate ? selectedFromDate : '---/--/----'}
                  </Text>
                </TouchableOpacity>

                <DatePicker // from date picker
                  open={fromDatePicker}
                  modal
                  onConfirm={date => {
                    setFromDate(date);
                    setSelectedFromDate(moment(date).format('DD-MMM-YYYY'));
                    setFromDatePicker(false);
                  }}
                  onCancel={() => setFromDatePicker(false)}
                  mode="date"
                  date={fromDate}
                  maximumDate={toDate}
                />

                <TouchableOpacity // till date button
                  onPress={() => setToDatePicker(true)}
                  style={styles.subSection}
                  activeOpacity={1}>
                  <MaterialCommunityIcons // till date icon
                    name="calendar-range"
                    size={30}
                    color={COLORS.flatBlue}
                  />
                  <Text // office address
                    style={styles.txt}>
                    Till {selectedToDate ? selectedToDate : '---/--/----'}
                  </Text>
                </TouchableOpacity>

                <DatePicker // to date picker
                  open={toDatePicker}
                  modal
                  onConfirm={date => {
                    setToDate(date);
                    setSelectedToDate(moment(date).format('DD-MMM-YYYY'));
                    setToDatePicker(false);
                  }}
                  onCancel={() => setToDatePicker(false)}
                  mode="date"
                  date={toDate}
                  minimumDate={fromDate ? fromDate : toDate}
                  maximumDate={new Date()}
                />
              </View>
              <View style={{flexDirection: 'row'}}>
                <View style={{flex: 1, marginRight: SIZES.width * 0.01}}>
                  <Dropdown // paid amount identity dropdown
                    placeholder="Paid Type"
                    style={styles.dropStyle}
                    placeholderStyle={styles.dropPlaceholder}
                    selectedTextStyle={styles.dropSelectedTxt}
                    containerStyle={styles.dropContainer}
                    fontFamily={FONTS.josefinSansRegular}
                    data={ranger}
                    value={paidAmtCondition}
                    labelField="label"
                    valueField="value"
                    renderItem={item => (
                      <Text style={styles.dropText}>{item.label}</Text>
                    )}
                    onChange={item => setPaidAmtCondition(item.value)}
                  />
                  <TextInput // paid amount minimum input
                    style={styles.input}
                    placeholder={
                      paidAmtCondition === '><' ? 'Min Paid' : 'Paid Amount'
                    }
                    placeholderTextColor={COLORS.gray}
                    keyboardAppearance="dark"
                    keyboardType="numeric"
                    returnKeyType="done"
                    color={COLORS.black}
                    onChangeText={text => setPaidAmount1(text)}
                    value={paidAmount1}
                  />
                  {paidAmtCondition === '><' && (
                    <TextInput // paid amount maximum input
                      style={[styles.input, {margin: '2%'}]}
                      placeholder="Max Paid"
                      placeholderTextColor={COLORS.gray}
                      keyboardAppearance="dark"
                      keyboardType="numeric"
                      returnKeyType="done"
                      color={COLORS.black}
                      onChangeText={text => setPaidAmount2(text)}
                      value={paidAmount2}
                    />
                  )}
                </View>
                <View style={{flex: 1, marginLeft: SIZES.width * 0.01}}>
                  <Dropdown // last amount identity dropdown
                    placeholder="Last Paid Type"
                    style={styles.dropStyle}
                    placeholderStyle={styles.dropPlaceholder}
                    selectedTextStyle={styles.dropSelectedTxt}
                    containerStyle={styles.dropContainer}
                    fontFamily={FONTS.josefinSansRegular}
                    data={ranger}
                    value={lastPaidAmtCondition}
                    labelField="label"
                    valueField="value"
                    renderItem={item => (
                      <Text style={styles.dropText}>{item.label}</Text>
                    )}
                    onChange={item => setLastAmtRanger(item.value)}
                  />
                  <TextInput // last amount minimum input
                    style={styles.input}
                    placeholder={
                      lastPaidAmtCondition === '><' ? 'Max Last' : 'Last Amount'
                    }
                    placeholderTextColor={COLORS.gray}
                    keyboardAppearance="dark"
                    keyboardType="numeric"
                    returnKeyType="done"
                    color={COLORS.black}
                    onChangeText={text => setMinLastPaidAmount(text)}
                    value={lastPaidAmount1}
                  />
                  {lastPaidAmtCondition === '><' && (
                    <TextInput // last amount maximum input
                      style={styles.input}
                      placeholder="Min Last"
                      placeholderTextColor={COLORS.gray}
                      keyboardAppearance="dark"
                      keyboardType="numeric"
                      returnKeyType="done"
                      color={COLORS.black}
                      onChangeText={text => setMaxLastPaidAmount(text)}
                      value={lastPaidAmount2}
                    />
                  )}
                </View>
              </View>
              <SearchBar // search by drnumber
                onPress={() => drPress()}
                onFocus={() => drPress()}
                reference={drRef}
                style={styles.searchBar}
                lens={drLens}
                placeholder="DR Number"
                value={drSearchkey}
                onChangeText={text => setDrSearchkey(text)}
                onSubmitEditing={search}
              />

              <View // include exclude payment type
                style={{padding: SIZES.paddingSmall}}>
                <TouchableOpacity // included patronship payment button
                  activeOpacity={1}
                  onPress={() => setIncPatronPay(!incPatronPay)}
                  style={[styles.subSection, {flex: 0}]}>
                  <Checkbox // included patronship payment checkbox
                    status={incPatronPay ? 'checked' : 'unchecked'}
                  />
                  <Text // included patronship payment text
                    style={styles.txt}>
                    Include Patronship Payment
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity // exclude donors paid for patronship button
                  activeOpacity={1}
                  onPress={() => setExcPatronPay(!excPatronPay)}
                  style={[styles.subSection, {flex: 0}]}>
                  <Checkbox // exclude donors paid for patronship checkbox
                    status={excPatronPay ? 'checked' : 'unchecked'}
                  />
                  <Text // exclude donors paid for patronship text
                    style={styles.txt}>
                    Exclude Donors Paid For Patronship
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          </CollapsableSection>

          {/* DONATION CATEGORY DROPDOWN */}

          <View
            style={{
              width: SIZES.width * 0.8,
              padding: SIZES.paddingSmall,
              backgroundColor: COLORS.white,
              borderRadius: SIZES.radiusMedium,
            }}>
            <Dropdown // donation category selector
              placeholder="Donation Category"
              style={{
                width: '100%',
                borderRadius: SIZES.radiusMedium - 3,
                height: SIZES.height * 0.06,
                borderRadius: SIZES.radiusSmall,
                backgroundColor: COLORS.antiFlashWhite,
                paddingHorizontal: SIZES.paddingSmall,
              }}
              placeholderStyle={styles.dropPlaceholder}
              selectedTextStyle={styles.dropSelectedTxt}
              containerStyle={styles.dropContainer}
              fontFamily={FONTS.josefinSansRegular}
              data={donationCatLst}
              value={donationCat}
              labelField="label"
              valueField="value"
              renderItem={item => (
                <Text style={styles.dropText}>{item.label}</Text>
              )}
              onChange={item => setDonationCat(item.value)}
            />
          </View>
        </ScrollView>

        <PrimaryButton // search button
          style={{
            position: 'absolute',
            bottom: SIZES.paddingSmall,
            alignSelf: 'center',
            width: SIZES.width * 0.9,
          }}
          icon="magnify"
          name="Search"
          onPress={search}
        />
      </LinearGradient>
    </SafeAreaView>
  );
};

export default DonorSearch;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: COLORS.lightGray,
  },
  searchBar: {flex: 1, marginTop: SIZES.paddingSmall},
  dropStyle: {
    width: '100%',
    height: SIZES.height * 0.065,
    borderColor: COLORS.lightGray,
    borderRadius: SIZES.radiusSmall,
    borderWidth: 1,
    backgroundColor: COLORS.antiFlashWhite,
    paddingHorizontal: SIZES.paddingSmall,
    marginTop: SIZES.paddingSmall,
  },
  dropPlaceholder: {
    color: COLORS.gray,
    fontSize: SIZES.fontSmall,
  },
  dropSelectedTxt: {
    color: COLORS.black,
    fontSize: SIZES.fontSmall,
  },
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
  txt: {
    color: COLORS.black,
    textAlign: 'center',
    fontSize: SIZES.fontSmall,
    fontFamily: FONTS.josefinSansRegular,
  },
  subSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  input: {
    width: '100%',
    borderRadius: SIZES.radiusSmall,
    backgroundColor: COLORS.antiFlashWhite,
    borderColor: COLORS.lightGray,
    borderWidth: 1,
    fontSize: SIZES.fontSmall,
    fontFamily: FONTS.josefinSansRegular,
    height: SIZES.height * 0.065,
    marginTop: SIZES.paddingSmall,
  },
});
