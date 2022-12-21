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
import {
  baseUrl,
  get_seva_type,
  get_patron_preacher_list,
  accessKey,
} from '../webApi/service';

// components
import Header from '../components/Common/Header';
import SearchBar from '../components/Search/SearchBar';
import CollapsableSection from '../components/Common/CollapsableSection';
import PrimaryButton from '../components/Common/PrimaryButton';

const PatronSearch = ({navigation}) => {
  const store = Store();

  // reference for search input
  const patronIdRef = useRef(null); // patron id search bar ref
  const patronNameRef = useRef(null); // patron name search bar ref
  const phoneRef = useRef(null); // phone search bar ref
  const emailRef = useRef(null); // email search bar ref
  const addressRef = useRef(null); // address search bar ref
  const stateRef = useRef(null); // state search bar ref
  const cityRef = useRef(null); // city search bar ref
  const PINRef = useRef(null); // zip search bar ref
  const drRef = useRef(null); // date range search bar ref

  // lens for search input states
  const [patronIdLens, setPatronIdLens] = useState(true); // patron id lens
  const [patronNameLens, setPatronNameLens] = useState(true); // patron name lens
  const [phoneLens, setPhoneLens] = useState(true); // phone lens
  const [emailLens, setEmailLens] = useState(true); // email lens
  const [addressLens, setAddressLens] = useState(true); // address lens
  const [stateLens, setStateLens] = useState(true); // state lens
  const [cityLens, setCityLens] = useState(true); // city lens
  const [PINLens, setPINLens] = useState(true); // zip lens
  const [drLens, setDrLens] = useState(true); // date range lens

  // section open/close states
  const [patronSearchOpn, setPatronSearchOpn] = useState(false); // patron search open
  const [sevaSearchOpn, setSevaSearchOpn] = useState(false); // seva search open
  const [contactSearchOpn, setContactSearchOpn] = useState(false); // contact search open
  const [fundraiserSearchOpn, setFundraiserSearchOpn] = useState(false); // fundraiser search open
  const [locationSearchOpn, setLocationSearchOpn] = useState(false); // location search open
  const [donationSearchOpn, setDonationSearchOpn] = useState(false); // donation search open

  // patron section states
  const [patronIdSearchkey, setPatronIdSearchkey] = useState(''); // patron id search key
  const [patronNameSearchkey, setPatronNameSearchkey] = useState(''); // patron name search key
  const [availablePtrnStatus, setAvailablePtrnStatus] = useState([
    {label: 'Healthy', value: 'healthy'},
    {label: 'Cancelled', value: 'cancelled'},
    {label: 'Merged', value: 'merged'},
    {label: 'Red Alert', value: 'red_alert'},
    {label: 'Transferred', value: 'transferred'},
    {label: 'Expired', value: 'expired'},
    {label: 'Deactivated', value: 'deactivated'},
    {label: 'Inactive', value: 'inactive'},
  ]); // available ptrn status
  const [patronStatus, setPatronStatus] = useState(''); // patron status

  // seva section states
  const [sevaPurposeList, setSevaPurposeList] = useState([]); // seva purpose list
  const [sevaPurpose, setSevaPurpose] = useState(''); // seva purpose
  const [sevaCodeList, setSevaCodeList] = useState([]); // seva code list
  const [sevaCode, setSevaCode] = useState(''); // seva code

  // contact section states
  const [phoneSearchkey, setPhoneSearchkey] = useState(''); // phone search key
  const [emailSearchkey, setEmailSearchkey] = useState(''); // email search key

  // fundraiser section states
  const [currentFundraiserList, setCurrentFundraiserList] = useState([]); // current fundraiser list
  const [currentFundraiser, setCurrentFundraiser] = useState(''); // current fundraiser
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
  const [ranger, setRanger] = useState([
    {label: 'Equal', value: '='},
    {label: 'More than', value: '>'},
    {label: 'Less than', value: '<'},
    {label: 'Between', value: '><'},
  ]); // amount range
  const [paidAmtCondition, setPaidAmtCondition] = useState(''); // paid range
  const [lastPaidAmtCondition, setLastAmtRanger] = useState(''); // last range
  const [balanceAmtCondition, setbalanceAmtCondition] = useState(''); // balance range
  const [paidAmount1, setPaidAmount1] = useState(''); // paid first
  const [paidAmount2, setPaidAmount2] = useState(''); // paid second
  const [lastPaidAmount1, setMinLastPaidAmount] = useState(''); // last first
  const [lastPaidAmount2, setMaxLastPaidAmount] = useState(''); // last second
  const [balanceAmount1, setMinBalanceAmount] = useState(''); // balance first
  const [balanceAmount2, setMaxBalanceAmount] = useState(''); // balance second
  const [drSearchkey, setDrSearchkey] = useState(''); // date range search key

  useEffect(() => {
    const unSubscribe = navigation.addListener('focus', () => {
      getSevaPurposeList();
      getFundraiser();
      BackHandler.addEventListener('hardwareBackPress', () => {
        console.log('BackHandler In Patron Search is called');
        navigation.goBack();
        return true;
      });
    });

    return unSubscribe;
  }, []);

  // fetch seva purpose list
  const getSevaPurposeList = async () => {
    await axios
      .post(baseUrl + get_seva_type, {
        accessKey: accessKey,
        deviceId: store.deviceId,
        loginId: store.userData?.userId,
        sessionId: store.userData?.session_id,
      })
      .then(res => {
        // console.log('getSevaPurposeList', res.data);
        setSevaPurposeList(res.data.data);
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

  // fetch fund raiser list
  const getFundraiser = async () => {
    await axios
      .post(baseUrl + get_patron_preacher_list, {
        accessKey: accessKey,
        deviceId: store.deviceId,
        loginId: store.userData?.userId,
        sessionId: store.userData?.session_id,
        userRole: store.userData?.userRole,
      })
      .then(res => {
        setCurrentFundraiserList(res.data.currentPreacher);
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
    patronNameSearchkey && !/^[a-zA-Z ]*$/.test(patronNameSearchkey)
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
        })
      : // pin code validation
      PINSearchkey && PINSearchkey.length !== 7
      ? showMessage({
          message: 'Warning!',
          description: 'Please enter valid PIN code',
          type: 'warning',
          floating: true,
          icon: 'auto',
        })
      : // paid amount validation if case of between
      paidAmtCondition === '><' && (!paidAmount1 || !paidAmount2)
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
      : // balance amount validation if case of between
      balanceAmtCondition === '><' && (!balanceAmount1 || !balanceAmount2)
      ? balanceAmount2
        ? showMessage({
            message: 'Warning!',
            description: 'Please enter a minimum Balance amount',
            type: 'warning',
            floating: true,
            icon: 'auto',
          })
        : balanceAmount1
        ? showMessage({
            message: 'Warning!',
            description: 'Please enter a maximum Balance amount',
            type: 'warning',
            floating: true,
            icon: 'auto',
          })
        : showMessage({
            message: 'Warning!',
            description: 'Please enter both Balance amount',
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
      : navigation.navigate('Patron', {
          patronIdSearchkey,
          patronNameSearchkey,
          patronStatus,
          sevaPurpose,
          sevaCode,
          phoneSearchkey,
          emailSearchkey,
          currentFundraiser,
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
          balanceAmtCondition,
          balanceAmount1,
          balanceAmount2,
          drSearchkey,
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

  const patronIdPress = () => {
    patronIdRef.current.focus(),
      setPatronIdLens(false),
      !patronNameSearchkey && setPatronNameLens(true),
      !phoneSearchkey && setPhoneLens(true),
      !emailSearchkey && setEmailLens(true),
      !addressSearchkey && setAddressLens(true),
      !stateSearchkey && setStateLens(true),
      !citySearchkey && setCityLens(true),
      !PINSearchkey && setPINLens(true),
      !drSearchkey && setDrLens(true);
  };
  const patronNamePress = () => {
    patronNameRef.current.focus(),
      setPatronNameLens(false),
      !patronIdSearchkey && setPatronIdLens(true),
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
      !patronIdSearchkey && setPatronIdLens(true),
      !patronNameSearchkey && setPatronNameLens(true),
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
      !patronIdSearchkey && setPatronIdLens(true),
      !patronNameSearchkey && setPatronNameLens(true),
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
      !patronIdSearchkey && setPatronIdLens(true),
      !patronNameSearchkey && setPatronNameLens(true),
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
      !patronIdSearchkey && setPatronIdLens(true),
      !patronNameSearchkey && setPatronNameLens(true),
      !phoneSearchkey && setPhoneLens(true),
      !emailSearchkey && setEmailLens(true),
      !addressSearchkey && setAddressLens(true),
      !citySearchkey && setCityLens(true),
      !PINSearchkey && setPINLens(true);
  };
  const cityPress = () => {
    cityRef.current.focus(),
      setCityLens(false),
      !patronIdSearchkey && setPatronIdLens(true),
      !patronNameSearchkey && setPatronNameLens(true),
      !phoneSearchkey && setPhoneLens(true),
      !emailSearchkey && setEmailLens(true),
      !addressSearchkey && setAddressLens(true),
      !stateSearchkey && setStateLens(true),
      !PINSearchkey && setPINLens(true);
  };
  const PINPress = () => {
    PINRef.current.focus(),
      setPINLens(false),
      !patronIdSearchkey && setPatronIdLens(true),
      !patronNameSearchkey && setPatronNameLens(true),
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
      !patronIdSearchkey && setPatronIdLens(true),
      !patronNameSearchkey && setPatronNameLens(true),
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
        <Header // header
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
          {/* PATRON SECTION */}

          <CollapsableSection
            name="PATRON"
            leftItem={
              <MaterialCommunityIcons // left icon
                name="face-man-shimmer-outline"
                size={25}
                color={COLORS.darkGray}
                style={{marginRight: SIZES.paddingSmall}}
              />
            }
            setOpen={setPatronSearchOpn}
            open={patronSearchOpn}>
            <>
              <SearchBar // search by patron id
                onPress={() => patronIdPress()}
                onFocus={() => patronIdPress()}
                lens={patronIdLens}
                reference={patronIdRef}
                style={styles.searchBar}
                placeholder="Patron Id"
                keyboardType="numeric"
                value={patronIdSearchkey}
                onChangeText={setPatronIdSearchkey}
                onSubmitEditing={search}
              />
              <SearchBar // search by patron name
                onPress={() => patronNamePress()}
                onFocus={() => patronNamePress()}
                reference={patronNameRef}
                lens={patronNameLens}
                style={styles.searchBar}
                placeholder="Patron Name"
                keyboardType="default"
                value={patronNameSearchkey}
                onChangeText={setPatronNameSearchkey}
                onSubmitEditing={search}
              />
              <Dropdown // search by patron status
                placeholder="Patron Status"
                style={styles.dropStyle}
                placeholderStyle={styles.dropPlaceholder}
                selectedTextStyle={styles.dropSelectedTxt}
                containerStyle={styles.dropContainer}
                fontFamily={FONTS.josefinSansRegular}
                data={availablePtrnStatus}
                value={patronStatus}
                labelField="label"
                valueField="value"
                renderItem={item => (
                  <Text style={styles.dropText}>{item.label}</Text>
                )}
                onChange={item => setPatronStatus(item.value)}
              />
            </>
          </CollapsableSection>

          {/* SEVA SECTION */}

          <CollapsableSection
            name="SEVA"
            leftItem={
              <MaterialCommunityIcons // left icon
                name="hand-extended-outline"
                size={25}
                color={COLORS.darkGray}
                style={{marginRight: SIZES.paddingSmall}}
              />
            }
            setOpen={setSevaSearchOpn}
            open={sevaSearchOpn}>
            <>
              <Dropdown // search by seva purpose
                placeholder="Seva Purpose"
                style={styles.dropStyle}
                placeholderStyle={styles.dropPlaceholder}
                selectedTextStyle={styles.dropSelectedTxt}
                containerStyle={styles.dropContainer}
                fontFamily={FONTS.josefinSansRegular}
                data={
                  sevaPurposeList &&
                  sevaPurposeList.map(item => {
                    return {
                      label: item.sevaName,
                      value: item.sevaType,
                      list: item.sevaList,
                    };
                  })
                }
                value={sevaPurpose}
                labelField="label"
                valueField="value"
                renderItem={item => (
                  <Text style={styles.dropText}>{item.label}</Text>
                )}
                onChange={item => {
                  setSevaPurpose(item.value);
                  setSevaCodeList(item.list);
                }}
              />
              <Dropdown // search by seva code
                placeholder="Seva Code"
                style={styles.dropStyle}
                placeholderStyle={styles.dropPlaceholder}
                selectedTextStyle={styles.dropSelectedTxt}
                containerStyle={styles.dropContainer}
                fontFamily={FONTS.josefinSansRegular}
                data={
                  sevaCodeList &&
                  sevaCodeList?.map(item => {
                    return {label: item.sevaName, value: item.sevaCode};
                  })
                }
                value={sevaCode}
                labelField="label"
                valueField="value"
                renderItem={item => (
                  <Text style={styles.dropText}>{item.label}</Text>
                )}
                onChange={item => setSevaCode(item.value)}
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
              <SearchBar // search by phone
                onPress={() => phonePress()}
                onFocus={() => phonePress()}
                maxLength={10}
                reference={phoneRef}
                lens={phoneLens}
                style={styles.searchBar}
                placeholder="Phone"
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
              <Dropdown // search by current fundraiser
                placeholder="Current Fundraiser"
                style={styles.dropStyle}
                placeholderStyle={styles.dropPlaceholder}
                selectedTextStyle={styles.dropSelectedTxt}
                containerStyle={styles.dropContainer}
                fontFamily={FONTS.josefinSansRegular}
                data={
                  currentFundraiserList &&
                  currentFundraiserList.map(item => {
                    return {
                      label: item.preacherCode,
                      value: item.preacherCode,
                    };
                  })
                }
                value={currentFundraiser}
                labelField="label"
                valueField="value"
                renderItem={item => (
                  <Text style={styles.dropText}>{item.label}</Text>
                )}
                onChange={item => setCurrentFundraiser(item.value)}
              />
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
                  enrolledFundraiserList.map(item => {
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
                <View style={{flex: 1}}>
                  <Dropdown // paid amount identity dropdown
                    placeholder="Paid Type"
                    style={styles.dropStyle}
                    placeholderStyle={styles.dropPlaceholder}
                    selectedTextStyle={[
                      styles.dropSelectedTxt,
                      {textAlign: 'center'},
                    ]}
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
                      style={styles.input}
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
                <View style={{flex: 1, marginHorizontal: SIZES.paddingSmall}}>
                  <Dropdown // last amount identity dropdown
                    placeholder="Last Paid Type"
                    style={styles.dropStyle}
                    placeholderStyle={styles.dropPlaceholder}
                    selectedTextStyle={[
                      styles.dropSelectedTxt,
                      {textAlign: 'center'},
                    ]}
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
                <View style={{flex: 1}}>
                  <Dropdown // balance amount identity dropdown
                    placeholder="Balance Type"
                    style={styles.dropStyle}
                    placeholderStyle={styles.dropPlaceholder}
                    selectedTextStyle={styles.dropSelectedTxt}
                    containerStyle={styles.dropContainer}
                    fontFamily={FONTS.josefinSansRegular}
                    data={ranger}
                    value={balanceAmtCondition}
                    labelField="label"
                    valueField="value"
                    renderItem={item => (
                      <Text style={styles.dropText}>{item.label}</Text>
                    )}
                    onChange={item => setbalanceAmtCondition(item.value)}
                  />
                  <TextInput // balance amount minimum input
                    style={styles.input}
                    placeholder={
                      balanceAmtCondition === '><' ? 'Min Balance' : 'Balance'
                    }
                    placeholderTextColor={COLORS.gray}
                    keyboardAppearance="dark"
                    keyboardType="numeric"
                    returnKeyType="done"
                    color={COLORS.black}
                    onChangeText={text => setMinBalanceAmount(text)}
                    value={balanceAmount1}
                  />
                  {balanceAmtCondition === '><' && (
                    <TextInput // balance amount maximum input
                      style={styles.input}
                      placeholder="Max Balance"
                      placeholderTextColor={COLORS.gray}
                      keyboardAppearance="dark"
                      keyboardType="numeric"
                      returnKeyType="done"
                      color={COLORS.black}
                      onChangeText={text => setMaxBalanceAmount(text)}
                      value={balanceAmount2}
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
            </>
          </CollapsableSection>
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

export default PatronSearch;

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
