import {
  View,
  Text,
  StyleSheet,
  BackHandler,
  ScrollView,
  TextInput,
  PermissionsAndroid,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import {Buffer} from 'buffer';
import React, {useState, useEffect, useRef} from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Switch} from 'react-native-paper';
import axios from 'axios';
import Geolocation from 'react-native-geolocation-service';
import Geocoder from 'react-native-geocoding';
import LinearGradient from 'react-native-linear-gradient';
import DatePicker from 'react-native-date-picker';
import {showMessage} from 'react-native-flash-message';
import {Dropdown} from 'react-native-element-dropdown';
import moment from 'moment';
import {Store} from '../../store/Store';
import {COLORS, SIZES, FONTS} from '../../constants';
import {
  baseUrl,
  accessKey,
  get_salutation_list,
  create_patron_stage,
  get_patron_stage,
} from '../../webApi/service';

// components
import Header from '../../components/Common/Header';
import Section from '../../components/Common/Section';
import PrimaryButton from '../../components/Common/PrimaryButton';

const EnrolmentRegistration = ({navigation, route}) => {
  const store = Store();

  const firstNameRef = useRef(null);
  const mobileRef = useRef(null);
  const mobile2Ref = useRef(null);
  const emailRef = useRef(null);
  const panRef = useRef(null);

  // PERSONAL DETAILS STATES
  const [salutations, setSalutations] = useState([]); // salutations array
  const [nationalities] = useState([
    {label: 'Indian', value: 'I'},
    {label: 'Other', value: 'O'},
  ]); // nationalities array
  const [salutation, setSalutation] = useState(''); // selected salutation
  const [firstName, setFirstName] = useState(''); // first name state
  const [lastName, setLastName] = useState(''); // last name state
  const [opnDatePkr, setOpnDatePkr] = useState(false); // dob picker modal
  const [dob, setDob] = useState(''); // date of birth
  const [occupation, setOccupation] = useState(''); // occupation state
  const [spouseName, setSpouseName] = useState(''); // spouse name state
  const [mobileNumber, setMobileNumber] = useState(''); // mobile state
  const [mobile2, setMobile2] = useState(''); // alternate mobile state
  const [email, setEmail] = useState(''); // email state
  const [email2, setEmail2] = useState(''); // alternate email state
  const [pan, setPan] = useState(''); // pan number state
  const [nationality, setNationality] = useState('I'); // nationality state

  // RESIDENTIAL ADDRESS STATES
  const [resDoor, setResDoor] = useState(''); // residential door state
  const [resHouse, setResHouse] = useState(''); // residential house no state
  const [resStreet, setResStreet] = useState(''); // residential street state
  const [resArea, setResArea] = useState(''); // residential area state
  const [resCity, setResCity] = useState(''); // residential city state
  const [resState, setResState] = useState(''); // residential state state
  const [resCountry, setResCountry] = useState(''); // residential country state
  const [resPincode, setResPincode] = useState(''); // residential pincode state
  // OFFICE ADDRESS STATES
  const [offDoor, setOffDoor] = useState(''); // office door state
  const [offBuilding, setOffBuilding] = useState(''); // office house no state
  const [offStreet, setOffStreet] = useState(''); // office street state
  const [offArea, setOffArea] = useState(''); // office area state
  const [offCity, setOffCity] = useState(''); // office city state
  const [offState, setOffState] = useState(''); // office state state
  const [offCountry, setOffCountry] = useState(''); // office country state
  const [offPincode, setOffPincode] = useState(''); // office pincode state

  const [mailingPref, setMailingPref] = useState(''); // contact type state
  const [routePayload, setRoutePayload] = useState({}); // route data for next screen

  useEffect(() => {
    const unSubscribe = navigation.addListener('focus', () => {
      BackHandler.addEventListener('hardwareBackPress', () => {
        console.log('BackHandler In EnrolmentRegistration is called');
        store.ptrnIncmp
          ? navigation.navigate('CustomDrawer')
          : navigation.goBack();
        return true;
      });
      store.ptrnIncmp && fetchUnfinished();
      getSalutations();
    });
    return unSubscribe;
  }, []);

  // get salutations
  const getSalutations = async () => {
    await axios
      .post(baseUrl + get_salutation_list, {
        accessKey: accessKey,
        deviceId: store?.deviceId,
        loginId: store?.userData?.userId,
        sessionId: store?.userData?.session_id,
      })
      .then(res => {
        res.data.successCode === 1
          ? (setSalutations(res.data.data),
            res?.data?.data?.length > 0 && setSalutation(res.data.data[0]))
          : showMessage({
              message: 'Opps!',
              description: 'Something went wrong',
              type: 'danger',
              floating: true,
              icon: 'auto',
            });
      })
      .catch(err => {
        console.log('SALUTATION LIST ERROR', err);
        showMessage({
          message: 'Error!',
          description: 'Please check your internet connection',
          type: 'danger',
          floating: true,
          icon: 'auto',
        });
      });
  };

  // get location name
  const getLocName = async params => {
    console.log(params.pos);
    await Geocoder.from(...params.pos)
      .then(json => {
        const address = json.results[0].address_components;
        params.type === 'R' &&
          (setResDoor(
            address.find(each => each.types[0] === 'plus_code')
              ? address.find(each => each.types[0] === 'plus_code')?.long_name
              : address.find(each => each.types[0] === 'premise')
              ? address.find(each => each.types[0] === 'premise')?.long_name
              : resDoor,
          ),
          setResHouse(
            address.find(each => each.types[0] === 'premise')
              ? address.find(each => each.types[0] === 'premise')?.long_name
              : address.find(each => each.types[0] === 'plus_code')
              ? address.find(each => each.types[0] === 'plus_code')?.long_name
              : address.find(each => each.types[0] === 'neighborhood')
              ? address.find(each => each.types[0] === 'neighborhood')
                  ?.long_name
              : resHouse,
          ),
          setResStreet(
            address.find(each => each.types[0] === 'neighborhood')
              ? address.find(each => each.types[0] === 'neighborhood')
                  ?.long_name
              : address.find(each => each.types[0] === 'route')
              ? address.find(each => each.types[0] === 'route')?.long_name
              : resStreet,
          ),
          setResArea(
            address.find(each => each.types[2] === 'sublocality_level_2')
              ? address.find(each => each.types[2] === 'sublocality_level_2')
                  ?.long_name
              : address.find(each => each.types[2] === 'sublocality_level_1')
              ? address.find(each => each.types[2] === 'sublocality_level_1')
                  ?.long_name
              : resArea,
          ),
          setResCity(
            address.find(each => each.types[0] === 'locality')
              ? address.find(each => each.types[0] === 'locality')?.long_name
              : address.find(
                  each => each.types[0] === 'administrative_area_level_2',
                )
              ? address.find(
                  each => each.types[0] === 'administrative_area_level_2',
                )?.long_name
              : resCity,
          ),
          setResState(
            address.find(
              each => each.types[0] === 'administrative_area_level_1',
            )
              ? address.find(
                  each => each.types[0] === 'administrative_area_level_1',
                )?.long_name
              : resState,
          ),
          setResCountry(
            address.find(each => each.types[0] === 'country')
              ? address.find(each => each.types[0] === 'country')?.long_name
              : resCountry,
          ),
          setResPincode(
            address.find(each => each.types[0] === 'postal_code')
              ? address.find(each => each.types[0] === 'postal_code')?.long_name
              : resPincode,
          ));

        params.type === 'O' &&
          (setOffDoor(
            address.find(each => each.types[0] === 'plus_code')
              ? address.find(each => each.types[0] === 'plus_code')?.long_name
              : address.find(each => each.types[0] === 'premise')
              ? address.find(each => each.types[0] === 'premise')?.long_name
              : offDoor,
          ),
          setOffBuilding(
            address.find(each => each.types[0] === 'premise')
              ? address.find(each => each.types[0] === 'premise')?.long_name
              : address.find(each => each.types[0] === 'plus_code')
              ? address.find(each => each.types[0] === 'plus_code')?.long_name
              : address.find(each => each.types[0] === 'neighborhood')
              ? address.find(each => each.types[0] === 'neighborhood')
                  ?.long_name
              : offBuilding,
          ),
          setOffStreet(
            address.find(each => each.types[0] === 'neighborhood')
              ? address.find(each => each.types[0] === 'neighborhood')
                  ?.long_name
              : address.find(each => each.types[0] === 'route')
              ? address.find(each => each.types[0] === 'route')?.long_name
              : offStreet,
          ),
          setOffArea(
            address.find(each => each.types[2] === 'sublocality_level_2')
              ? address.find(each => each.types[2] === 'sublocality_level_2')
                  ?.long_name
              : address.find(each => each.types[2] === 'sublocality_level_1')
              ? address.find(each => each.types[2] === 'sublocality_level_1')
                  ?.long_name
              : offArea,
          ),
          setOffCity(
            address.find(each => each.types[0] === 'locality')
              ? address.find(each => each.types[0] === 'locality')?.long_name
              : address.find(
                  each => each.types[0] === 'administrative_area_level_2',
                )
              ? address.find(
                  each => each.types[0] === 'administrative_area_level_2',
                )?.long_name
              : offCity,
          ),
          setOffState(
            address.find(
              each => each.types[0] === 'administrative_area_level_1',
            )
              ? address.find(
                  each => each.types[0] === 'administrative_area_level_1',
                )?.long_name
              : offState,
          ),
          setOffCountry(
            address.find(each => each.types[0] === 'country')
              ? address.find(each => each.types[0] === 'country')?.long_name
              : offCountry,
          ),
          setOffPincode(
            address.find(each => each.types[0] === 'postal_code')
              ? address.find(each => each.types[0] === 'postal_code')?.long_name
              : offPincode,
          ));
      })
      .catch(error => {
        console.warn(error),
          showMessage({
            message: 'Error!',
            description: 'Please check your internet connection',
            type: 'danger',
            floating: true,
            icon: 'auto',
          });
      });
  };

  // get location lat long
  const getLocation = async type => {
    console.log('', '\n======== GET LOCATION ========');
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'This app needs access to your location',
          buttonNext: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the location');
        await Geolocation.getCurrentPosition(
          position => {
            // console.log('Latitude:', position.coords.latitude);
            // console.log('Longitude:', position.coords.longitude);
            const pos = [position.coords.latitude, position.coords.longitude];
            getLocName({pos, type});
          },
          error => {
            // See error code charts below.
            console.log(error.code, error.message);
          },
          {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
        );
      } else {
        console.log('Location permission denied');
        showMessage({
          message: 'Warning!',
          description: 'You denied user permission',
          type: 'warning',
          floating: true,
          icon: 'auto',
        });
      }
    }
  };

  // fetch unsaved data
  const fetchUnfinished = async () => {
    let unsaved;
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
          ? ((unsaved = JSON.parse(
              Buffer.from(res.data?.data[0]?.ptrnForm, 'base64').toString(
                'utf8',
              ),
            )),
            console.log('UNSAVED IN REGISTRATION', unsaved),
            setRoutePayload(unsaved),
            setSalutation(unsaved?.salutation),
            setFirstName(unsaved?.firstName),
            setLastName(unsaved?.lastName),
            setDob(unsaved?.dob),
            setOccupation(unsaved?.occupation),
            setSpouseName(unsaved?.spouseName),
            setMobileNumber(unsaved?.mobileNumber),
            setMobile2(unsaved?.mobile2),
            setEmail(unsaved?.email),
            setEmail2(unsaved?.email2),
            setPan(unsaved?.pan),
            setNationality(unsaved?.nationality),
            setResDoor(unsaved?.resDoor),
            setResHouse(unsaved?.resHouse),
            setResStreet(unsaved?.resStreet),
            setResArea(unsaved?.resArea),
            setResCity(unsaved?.resCity),
            setResState(unsaved?.resState),
            setResCountry(unsaved?.resCountry),
            setResPincode(unsaved?.resPincode),
            setOffDoor(unsaved?.offDoor),
            setOffBuilding(unsaved?.offBuilding),
            setOffStreet(unsaved?.offStreet),
            setOffArea(unsaved?.offArea),
            setOffCity(unsaved?.offCity),
            setOffState(unsaved?.offState),
            setOffCountry(unsaved?.offCountry),
            setOffPincode(unsaved?.offPincode),
            setMailingPref(unsaved?.mailingPref))
          : showMessage({
              message: 'Opps!',
              description: 'Something went wrong',
              type: 'danger',
              floating: true,
              icon: 'auto',
            });
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

  // save unsaved data
  const saveUnfinished = async () => {
    let nationalityLabel = nationalities?.find(
      each => each.value === nationality,
    )?.label;

    const payload = {
      accessKey,
      deviceId: store?.deviceId,
      loginId: store?.userData?.userId,
      sessionId: store?.userData?.session_id,
      preacherCode: store?.userData?.id,
      screenNo: '1',
      ptrnForm: Buffer.from(
        JSON.stringify({
          ...routePayload,
          route: routePayload?.route ? routePayload?.route : store?.routeInfo,
          salutation,
          firstName,
          lastName,
          dob,
          occupation,
          spouseName,
          mobileNumber,
          mobile2,
          email,
          email2,
          pan,
          nationality,
          nationalityLabel,
          resDoor,
          resHouse,
          resStreet,
          resArea,
          resCity,
          resState,
          resCountry,
          resPincode,
          offDoor,
          offBuilding,
          offStreet,
          offArea,
          offCity,
          offState,
          offCountry,
          offPincode,
          mailingPref,
        }),
        'utf-8',
      ).toString('base64'),
    };

    console.log('SAVE UNFINISHED :', baseUrl + create_patron_stage, payload);

    await axios
      .post(baseUrl + create_patron_stage, payload)
      .then(res => {
        res.data.successCode === 1
          ? (console.log('STATES SAVED TO TEMPORARY API'),
            navigation.navigate('EnrolmentBahumanaPuja'))
          : showMessage({
              message: 'Opps!',
              description: 'Something went wrong',
              type: 'danger',
              floating: true,
              icon: 'auto',
            });
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

  // next functionality
  const next = async () => {
    firstName?.length === 0
      ? (firstNameRef.current.focus(),
        showMessage({
          message: 'Warning!',
          description: 'Please enter first name',
          type: 'warning',
          floating: true,
          icon: 'auto',
        }))
      : mobileNumber?.length === 0
      ? (mobileRef.current.focus(),
        showMessage({
          message: 'Warning!',
          description: 'Please enter mobile number',
          type: 'warning',
          floating: true,
          icon: 'auto',
        }))
      : mobileNumber?.length < 10
      ? (mobileRef.current.focus(),
        showMessage({
          message: 'Warning!',
          description: 'Please enter valid mobile number',
          type: 'warning',
          floating: true,
          icon: 'auto',
        }))
      : !(mobile2?.length === 0) && mobile2?.length < 10
      ? (mobile2Ref.current.focus(),
        showMessage({
          message: 'Warning!',
          description: 'Please enter valid alternate mobile number',
          type: 'warning',
          floating: true,
          icon: 'auto',
        }))
      : email?.length === 0
      ? (emailRef.current.focus(),
        showMessage({
          message: 'Warning!',
          description: 'Please enter email ID',
          type: 'warning',
          floating: true,
          icon: 'auto',
        }))
      : email && !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
      ? showMessage({
          message: 'Warning!',
          description: 'Please enter valid email',
          type: 'warning',
          floating: true,
          icon: 'auto',
        })
      : pan?.length === 0
      ? (panRef.current.focus(),
        showMessage({
          message: 'Warning!',
          description: 'Please enter a pan number',
          type: 'warning',
          floating: true,
          icon: 'auto',
        }))
      : !nationality
      ? showMessage({
          message: 'Warning!',
          description: 'Please select a nationality',
          type: 'warning',
          floating: true,
          icon: 'auto',
        })
      : !mailingPref
      ? showMessage({
          message: 'Warning!',
          description: 'Please select a mailing address',
          type: 'warning',
          floating: true,
          icon: 'auto',
        })
      : (mailingPref === 'R' &&
          !resDoor &&
          !resHouse &&
          !resStreet &&
          !resArea &&
          !resCity &&
          !resState &&
          !resCountry &&
          !resPincode) ||
        (mailingPref === 'O' &&
          !offDoor &&
          !offBuilding &&
          !offStreet &&
          !offArea &&
          !offCity &&
          !offState &&
          !offCountry &&
          !offPincode)
      ? showMessage({
          message: 'Warning!',
          description: 'Selected mailing address cannot be empty',
          type: 'warning',
          floating: true,
          icon: 'auto',
        })
      : saveUnfinished();
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
        title="REGISTRATION"
        onPressLeft={() => {
          store.ptrnIncmp
            ? navigation.navigate('CustomDrawer')
            : navigation.goBack();
        }}
      />
      <ScrollView
        style={{flex: 1}}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          alignItems: 'center',
          paddingBottom: SIZES.paddingHuge,
        }}>
        {/* PERSONAL DETAILS SECTION */}

        <Section
          name="PERSONAL DETAILS"
          leftItem={
            <MaterialCommunityIcons // left icon
              name="card-account-details-outline"
              size={25}
              color={COLORS.darkGray}
              style={{marginRight: SIZES.paddingSmall}}
            />
          }>
          <View // name section
            style={{flexDirection: 'row'}}>
            <Dropdown // salutauion dropdown
              placeholder="Salutation"
              style={[styles.dropStyle, {flex: 1}]}
              placeholderStyle={styles.dropPlaceholder}
              selectedTextStyle={styles.dropSelectedTxt}
              containerStyle={styles.dropContainer}
              fontFamily={FONTS.josefinSansRegular}
              data={
                salutations &&
                salutations.map(item => {
                  return {
                    label: item,
                    value: item,
                  };
                })
              }
              value={salutation}
              labelField="label"
              valueField="value"
              renderItem={item => (
                <Text style={styles.dropText}>{item.label}</Text>
              )}
              onChange={item => setSalutation(item.value)}
            />

            <TextInput // first name input
              ref={firstNameRef}
              style={[
                styles.input,
                {
                  flex: 1,
                  marginHorizontal: SIZES.paddingSmall,
                },
              ]}
              placeholder="First Name*"
              placeholderTextColor={COLORS.gray}
              keyboardAppearance="dark"
              keyboardType="default"
              returnKeyType="done"
              color={COLORS.black}
              onChangeText={text => {
                setFirstName(text);
              }}
              value={firstName}
            />

            <TextInput // last name input
              style={[styles.input, {flex: 1}]}
              placeholder="Last Name"
              placeholderTextColor={COLORS.gray}
              keyboardAppearance="dark"
              keyboardType="default"
              returnKeyType="done"
              color={COLORS.black}
              onChangeText={text => setLastName(text)}
              value={lastName}
            />
          </View>

          <PrimaryButton // dob button
            style={[styles.input, styles.dateBtn]}
            onPress={() => setOpnDatePkr(true)}
            iconColor={COLORS.flatBlue}
            icon="calendar-range"
            textStyle={{
              color: COLORS.darkGray,
              fontSize: SIZES.fontSmall,
              fontFamily: FONTS.josefinSansRegular,
            }}
            name={`Date of Birth : ${
              dob
                ? moment(dob, 'MM-DD-YYYY').format('DD/MMM/YYYY')
                : `--/--/----`
            }`}
          />

          <DatePicker // from date picker
            open={opnDatePkr}
            modal
            onConfirm={date => {
              setDob(moment(date)?.format('MM-DD-YYYY'));
              setOpnDatePkr(false);
            }}
            onCancel={() => setOpnDatePkr(false)}
            mode="date"
            date={
              dob
                ? new Date(moment(dob, 'MM-DD-YYYY').toDate())
                : new Date(moment(new Date(), 'MM-DD-YYYY').toDate())
            }
            maximumDate={new Date()}
          />

          <TextInput // occupation input
            style={styles.input}
            placeholder="Occupation"
            placeholderTextColor={COLORS.gray}
            keyboardAppearance="dark"
            keyboardType="default"
            returnKeyType="done"
            color={COLORS.black}
            onChangeText={text => setOccupation(text)}
            value={occupation}
          />

          <TextInput // spouce name input
            style={styles.input}
            placeholder="Spouce Name"
            placeholderTextColor={COLORS.gray}
            keyboardAppearance="dark"
            keyboardType="default"
            returnKeyType="done"
            color={COLORS.black}
            onChangeText={text => setSpouseName(text)}
            value={spouseName}
          />

          <TextInput // mobile input
            ref={mobileRef}
            style={styles.input}
            placeholder="Mobile Number*"
            placeholderTextColor={COLORS.gray}
            keyboardAppearance="dark"
            keyboardType="number-pad"
            returnKeyType="done"
            color={COLORS.black}
            maxLength={10}
            onChangeText={text => setMobileNumber(text)}
            value={mobileNumber}
          />

          <TextInput // alternate mobile number input
            ref={mobile2Ref}
            style={styles.input}
            placeholder="Alternate Mobile Number"
            placeholderTextColor={COLORS.gray}
            keyboardAppearance="dark"
            keyboardType="number-pad"
            returnKeyType="done"
            color={COLORS.black}
            maxLength={10}
            onChangeText={text => setMobile2(text)}
            value={mobile2}
          />

          <TextInput // email input
            ref={emailRef}
            style={styles.input}
            placeholder="Email*"
            placeholderTextColor={COLORS.gray}
            keyboardAppearance="dark"
            keyboardType="email-address"
            returnKeyType="done"
            color={COLORS.black}
            onChangeText={text => setEmail(text)}
            value={email}
          />

          <TextInput // alternate email input
            style={styles.input}
            placeholder="Alternate Email"
            placeholderTextColor={COLORS.gray}
            keyboardAppearance="dark"
            keyboardType="email-address"
            returnKeyType="done"
            color={COLORS.black}
            onChangeText={text => setEmail2(text)}
            value={email2}
          />

          <TextInput // pan input
            style={styles.input}
            ref={panRef}
            placeholder="PAN*"
            placeholderTextColor={COLORS.gray}
            keyboardAppearance="dark"
            keyboardType="default"
            returnKeyType="done"
            color={COLORS.black}
            maxLength={10}
            onChangeText={text => setPan(text)}
            value={pan}
          />

          <Dropdown // nationality dropdown
            placeholder="Select Nationality*"
            style={styles.dropStyle}
            placeholderStyle={styles.dropPlaceholder}
            selectedTextStyle={styles.dropSelectedTxt}
            containerStyle={styles.dropContainer}
            fontFamily={FONTS.josefinSansRegular}
            data={nationalities}
            value={nationality}
            labelField="label"
            valueField="value"
            renderItem={item => (
              <Text style={styles.dropText}>{item.label}</Text>
            )}
            onChange={item => setNationality(item.value)}
          />
        </Section>

        {/* ADDRESS SECTION */}

        <Section
          name="ADDRESS"
          leftItem={
            <MaterialCommunityIcons // left icon
              name="map-marker-multiple-outline"
              size={25}
              color={COLORS.darkGray}
              style={{marginRight: SIZES.paddingSmall}}
            />
          }>
          {/* RESIDENTIAL ADDRESS SECTION */}

          <>
            <View // residential address section header
              style={styles.detailsSection}>
              <Text // residential address section identifier
                style={styles.identifierTxt}>
                RESIDENTIAL ADDRESS
              </Text>

              <TouchableOpacity onPress={() => getLocation('R')}>
                <MaterialCommunityIcons // location icon
                  name="map-marker-plus"
                  size={25}
                  color={COLORS.flatBlue}
                />
              </TouchableOpacity>

              <Switch
                style={{marginLeft: SIZES.paddingSmall}}
                value={mailingPref === 'R' ? true : false}
                onValueChange={() =>
                  mailingPref === 'R' ? setMailingPref('') : setMailingPref('R')
                }
              />
            </View>

            <TextInput // residential door number input
              style={[styles.input, {marginTop: 0}]}
              placeholder="Door Number"
              placeholderTextColor={COLORS.gray}
              keyboardAppearance="dark"
              keyboardType="default"
              returnKeyType="done"
              color={COLORS.black}
              onChangeText={text => setResDoor(text)}
              value={resDoor}
            />

            <TextInput // residential house number input
              style={styles.input}
              placeholder="House / Apartment / Building"
              placeholderTextColor={COLORS.gray}
              keyboardAppearance="dark"
              keyboardType="default"
              returnKeyType="done"
              color={COLORS.black}
              onChangeText={text => setResHouse(text)}
              value={resHouse}
            />

            <TextInput // residential street input
              style={styles.input}
              placeholder="Street"
              placeholderTextColor={COLORS.gray}
              keyboardAppearance="dark"
              keyboardType="default"
              returnKeyType="done"
              color={COLORS.black}
              onChangeText={text => setResStreet(text)}
              value={resStreet}
            />

            <TextInput // residential area input
              style={styles.input}
              placeholder="Area / Locality"
              placeholderTextColor={COLORS.gray}
              keyboardAppearance="dark"
              keyboardType="default"
              returnKeyType="done"
              color={COLORS.black}
              onChangeText={text => setResArea(text)}
              value={resArea}
            />

            <TextInput // residential city input
              style={styles.input}
              placeholder="City"
              placeholderTextColor={COLORS.gray}
              keyboardAppearance="dark"
              keyboardType="default"
              returnKeyType="done"
              color={COLORS.black}
              onChangeText={text => setResCity(text)}
              value={resCity}
            />

            <TextInput // residential state input
              style={styles.input}
              placeholder="State"
              placeholderTextColor={COLORS.gray}
              keyboardAppearance="dark"
              keyboardType="default"
              returnKeyType="done"
              color={COLORS.black}
              onChangeText={text => setResState(text)}
              value={resState}
            />

            <TextInput // residential country input
              style={styles.input}
              placeholder="Country"
              placeholderTextColor={COLORS.gray}
              keyboardAppearance="dark"
              keyboardType="default"
              returnKeyType="done"
              color={COLORS.black}
              onChangeText={text => setResCountry(text)}
              value={resCountry}
            />

            <TextInput // residential pin code input
              style={styles.input}
              placeholder="PIN Code"
              placeholderTextColor={COLORS.gray}
              keyboardAppearance="dark"
              keyboardType="number-pad"
              returnKeyType="done"
              color={COLORS.black}
              onChangeText={text => setResPincode(text)}
              value={resPincode}
            />
          </>

          {/* OFFICE ADDRESS SECTION */}

          <>
            <View // office address section header
              style={styles.detailsSection}>
              <Text // office address section identifier
                style={styles.identifierTxt}>
                OFFICE ADDRESS
              </Text>

              <TouchableOpacity onPress={() => getLocation('O')}>
                <MaterialCommunityIcons // location icon
                  name="map-marker-plus"
                  size={25}
                  color={COLORS.flatBlue}
                />
              </TouchableOpacity>
              <Switch
                style={{marginLeft: SIZES.paddingSmall}}
                value={mailingPref === 'O' ? true : false}
                onValueChange={() =>
                  mailingPref === 'O' ? setMailingPref('') : setMailingPref('O')
                }
              />
            </View>

            <TextInput // office door number input
              style={[styles.input, {marginTop: 0}]}
              placeholder="Door Number"
              placeholderTextColor={COLORS.gray}
              keyboardAppearance="dark"
              keyboardType="default"
              returnKeyType="done"
              color={COLORS.black}
              onChangeText={text => setOffDoor(text)}
              value={offDoor}
            />

            <TextInput // office house number input
              style={styles.input}
              placeholder="House / Apartment / Building"
              placeholderTextColor={COLORS.gray}
              keyboardAppearance="dark"
              keyboardType="default"
              returnKeyType="done"
              color={COLORS.black}
              onChangeText={text => setOffBuilding(text)}
              value={offBuilding}
            />

            <TextInput // office street input
              style={styles.input}
              placeholder="Street"
              placeholderTextColor={COLORS.gray}
              keyboardAppearance="dark"
              keyboardType="default"
              returnKeyType="done"
              color={COLORS.black}
              onChangeText={text => setOffStreet(text)}
              value={offStreet}
            />

            <TextInput // office area input
              style={styles.input}
              placeholder="Area / Locality"
              placeholderTextColor={COLORS.gray}
              keyboardAppearance="dark"
              keyboardType="default"
              returnKeyType="done"
              color={COLORS.black}
              onChangeText={text => setOffArea(text)}
              value={offArea}
            />

            <TextInput // office city input
              style={styles.input}
              placeholder="City"
              placeholderTextColor={COLORS.gray}
              keyboardAppearance="dark"
              keyboardType="default"
              returnKeyType="done"
              color={COLORS.black}
              onChangeText={text => setOffCity(text)}
              value={offCity}
            />

            <TextInput // office state input
              style={styles.input}
              placeholder="State"
              placeholderTextColor={COLORS.gray}
              keyboardAppearance="dark"
              keyboardType="default"
              returnKeyType="done"
              color={COLORS.black}
              onChangeText={text => setOffState(text)}
              value={offState}
            />

            <TextInput // office country input
              style={styles.input}
              placeholder="Country"
              placeholderTextColor={COLORS.gray}
              keyboardAppearance="dark"
              keyboardType="default"
              returnKeyType="done"
              color={COLORS.black}
              onChangeText={text => setOffCountry(text)}
              value={offCountry}
            />

            <TextInput // office pin code input
              style={styles.input}
              placeholder="PIN Code"
              placeholderTextColor={COLORS.gray}
              keyboardAppearance="dark"
              keyboardType="number-pad"
              returnKeyType="done"
              color={COLORS.black}
              onChangeText={text => setOffPincode(text)}
              value={offPincode}
            />
          </>
        </Section>

        <PrimaryButton // next button
          style={styles.primaryBtn}
          name="Next"
          onPress={() => next()}
        />
      </ScrollView>
    </LinearGradient>
  );
};

export default EnrolmentRegistration;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: COLORS.white,
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
  identifierTxt: {
    flex: 1,
    color: COLORS.black,
    fontSize: SIZES.fontSmall,
    fontFamily: FONTS.josefinSansBold,
  },
  valueTxt: {
    flex: 1.1,
    color: COLORS.black,
    fontSize: SIZES.fontSmall,
    fontFamily: FONTS.josefinSansRegular,
    textAlignVertical: 'center',
  },
  valCont: {flexDirection: 'row', flex: 1, marginTop: SIZES.paddingSmall},
  detailsSection: {
    padding: SIZES.paddingSmall,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  primaryBtn: {
    alignSelf: 'center',
    width: SIZES.width * 0.9,
  },
  dateBtn: {
    justifyContent: 'flex-start',
    elevation: 0,
    shadowOpacity: 0,
  },
});
