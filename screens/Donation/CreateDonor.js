import {
  View,
  Text,
  StyleSheet,
  BackHandler,
  PermissionsAndroid,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Switch} from 'react-native-paper';
import axios from 'axios';
import Geolocation from 'react-native-geolocation-service';
import Geocoder from 'react-native-geocoding';
import {Dropdown} from 'react-native-element-dropdown';
import LinearGradient from 'react-native-linear-gradient';
import {showMessage} from 'react-native-flash-message';
import {Store} from '../../store/Store';
import {COLORS, SIZES, FONTS} from '../../constants';
import {
  baseUrl,
  accessKey,
  get_salutation_list,
  create_donor,
  GOOGLE_API_KEY,
} from '../../webApi/service';

// components
import Header from '../../components/Common/Header';
import Section from '../../components/Common/Section';
import LabelCard from '../../components/Common/LabelCard';
import PrimaryButton from '../../components/Common/PrimaryButton';

Geocoder.init(GOOGLE_API_KEY);

const CreateDonor = ({navigation, route}) => {
  const store = Store();

  const firstNameRef = useRef(null);
  const mobileRef = useRef(null);

  const [detailsEditable, setDetailsEditable] = useState(true); // screen mode state
  const [resEditable, setResEditable] = useState(true); // residential section mode state
  const [offEditable, setOffEditable] = useState(true); // office section mode state

  // PERSONAL DETAILS STATES
  const [salutations, setSalutations] = useState([]); // salutations array
  const [nationalities] = useState([
    {label: 'Indian', value: 'I'},
    {label: 'Other', value: 'O'},
  ]); // nationalities array

  const [donorId, setDonorId] = useState(''); // newly created donor id
  const [salutation, setSalutation] = useState(''); // selected salutation
  const [firstName, setFirstName] = useState(''); // first name state
  const [lastName, setLastName] = useState(''); // last name state
  const [mobileNumber, setMobileNumber] = useState(''); // mobile state
  const [mobile2, setMobile2] = useState(''); // alternate mobile state
  const [email, setEmail] = useState(''); // email state
  const [email2, setEmail2] = useState(''); // alternate email state
  const [pan, setPan] = useState(''); // pan state
  const [nationality, setNationality] = useState('I'); // nationality state

  // RESIDENTIAL ADDRESS STATES
  const [regAddress1, setRegAddress1] = useState(''); // residential door state
  const [regAddress2, setRegAddress2] = useState(''); // residential house no state
  const [regAddress3, setRegAddress3] = useState(''); // residential street state
  const [regArea, setRegArea] = useState(''); // residential area state
  const [regCity, setRegCity] = useState(''); // residential city state
  const [regState, setRegState] = useState(''); // residential state state
  const [regCountry, setRegCountry] = useState(''); // residential country state
  const [regPinCode, setRegPinCode] = useState(''); // residential pincode state
  // OFFICE ADDRESS STATES
  const [offAddress1, setOffAddress1] = useState(''); // office door state
  const [offAddress2, setOffAddress2] = useState(''); // office house no state
  const [offAddress3, setOffAddress3] = useState(''); // office street state
  const [offArea, setOffArea] = useState(''); // office area state
  const [offCity, setOffCity] = useState(''); // office city state
  const [offState, setOffState] = useState(''); // office state state
  const [offCountry, setOffCountry] = useState(''); // office country state
  const [offPinCode, setOffPinCode] = useState(''); // office pincode state

  const [mailingPref, setMailingPref] = useState(''); // contact type state

  useEffect(() => {
    const unSubscribe = navigation.addListener('focus', () => {
      console.log('Create Donor Focused');
      BackHandler.addEventListener('hardwareBackPress', () => {
        console.log('BackHandler In Create Edit Donor is called');
        navigation.goBack();
        return true;
      });
      getSalutations();
      Object.keys(store?.newDonor).length > 0 &&
        (setFirstName(store?.newDonor?.firstName),
        setLastName(store?.newDonor?.lastName),
        setMobileNumber(store?.newDonor?.mobileNumber),
        setMobile2(store?.newDonor?.mobile2),
        setEmail(store?.newDonor?.email),
        setEmail2(store?.newDonor?.email2),
        setPan(store?.newDonor?.pan),
        setNationality(store?.newDonor?.nationality));
    });
    return unSubscribe;
  }, [store?.newDonor]);

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
          (setRegAddress1(
            address.find(each => each.types[0] === 'plus_code')
              ? address.find(each => each.types[0] === 'plus_code')?.long_name
              : address.find(each => each.types[0] === 'premise')
              ? address.find(each => each.types[0] === 'premise')?.long_name
              : regAddress1,
          ),
          setRegAddress2(
            address.find(each => each.types[0] === 'premise')
              ? address.find(each => each.types[0] === 'premise')?.long_name
              : address.find(each => each.types[0] === 'plus_code')
              ? address.find(each => each.types[0] === 'plus_code')?.long_name
              : address.find(each => each.types[0] === 'neighborhood')
              ? address.find(each => each.types[0] === 'neighborhood')
                  ?.long_name
              : regAddress2,
          ),
          setRegAddress3(
            address.find(each => each.types[0] === 'neighborhood')
              ? address.find(each => each.types[0] === 'neighborhood')
                  ?.long_name
              : address.find(each => each.types[0] === 'route')
              ? address.find(each => each.types[0] === 'route')?.long_name
              : regAddress2,
          ),
          setRegArea(
            address.find(each => each.types[2] === 'sublocality_level_2')
              ? address.find(each => each.types[2] === 'sublocality_level_2')
                  ?.long_name
              : address.find(each => each.types[2] === 'sublocality_level_1')
              ? address.find(each => each.types[2] === 'sublocality_level_1')
                  ?.long_name
              : regArea,
          ),
          setRegCity(
            address.find(each => each.types[0] === 'locality')
              ? address.find(each => each.types[0] === 'locality')?.long_name
              : address.find(
                  each => each.types[0] === 'administrative_area_level_2',
                )
              ? address.find(
                  each => each.types[0] === 'administrative_area_level_2',
                )?.long_name
              : regCity,
          ),
          setRegState(
            address.find(
              each => each.types[0] === 'administrative_area_level_1',
            )
              ? address.find(
                  each => each.types[0] === 'administrative_area_level_1',
                )?.long_name
              : regState,
          ),
          setRegCountry(
            address.find(each => each.types[0] === 'country')
              ? address.find(each => each.types[0] === 'country')?.long_name
              : regCountry,
          ),
          setRegPinCode(
            address.find(each => each.types[0] === 'postal_code')
              ? address.find(each => each.types[0] === 'postal_code')?.long_name
              : regPinCode,
          ));

        params.type === 'O' &&
          (setOffAddress1(
            address.find(each => each.types[0] === 'plus_code')
              ? address.find(each => each.types[0] === 'plus_code')?.long_name
              : address.find(each => each.types[0] === 'premise')
              ? address.find(each => each.types[0] === 'premise')?.long_name
              : offAddress1,
          ),
          setOffAddress2(
            address.find(each => each.types[0] === 'premise')
              ? address.find(each => each.types[0] === 'premise')?.long_name
              : address.find(each => each.types[0] === 'plus_code')
              ? address.find(each => each.types[0] === 'plus_code')?.long_name
              : address.find(each => each.types[0] === 'neighborhood')
              ? address.find(each => each.types[0] === 'neighborhood')
                  ?.long_name
              : offAddress2,
          ),
          setOffAddress3(
            address.find(each => each.types[0] === 'neighborhood')
              ? address.find(each => each.types[0] === 'neighborhood')
                  ?.long_name
              : address.find(each => each.types[0] === 'route')
              ? address.find(each => each.types[0] === 'route')?.long_name
              : offAddress3,
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
          setOffPinCode(
            address.find(each => each.types[0] === 'postal_code')
              ? address.find(each => each.types[0] === 'postal_code')?.long_name
              : offPinCode,
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

  // next functionality
  const next = async quick => {
    console.log('NEXT CALLED');
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
      : email && !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
      ? showMessage({
          message: 'Warning!',
          description: 'Please enter valid email',
          type: 'warning',
          floating: true,
          icon: 'auto',
        })
      : quick
      ? save(quick)
      : !mailingPref
      ? showMessage({
          message: 'Warning!',
          description: 'Please select a mailing address',
          type: 'warning',
          floating: true,
          icon: 'auto',
        })
      : (mailingPref === 'R' &&
          !regAddress1 &&
          !regAddress2 &&
          !regAddress3 &&
          !regArea &&
          !regCity &&
          !regState &&
          !regCountry &&
          !regPinCode) ||
        (mailingPref === 'O' &&
          !offAddress1 &&
          !offAddress2 &&
          !offAddress3 &&
          !offArea &&
          !offCity &&
          !offState &&
          !offCountry &&
          !offPinCode)
      ? showMessage({
          message: 'Warning!',
          description: 'Selected mailing address cannot be empty',
          type: 'warning',
          floating: true,
          icon: 'auto',
        })
      : (setDetailsEditable(false),
        setResEditable(false),
        setOffEditable(false));
  };

  // save functionality
  const save = async quick => {
    const payload = {
      accessKey,
      deviceId: store?.deviceId,
      loginId: store?.userData?.userId,
      sessionId: store?.userData?.session_id,
      userRole: store.userData?.userRole,
      preacherCode: store.userData?.id,

      isMasked: store?.newDonor?.isMasked ? store?.newDonor?.isMasked : '',
      donorId: donorId
        ? donorId
        : store?.newDonor?.donorId
        ? store?.newDonor?.donorId
        : '',
      salutation,
      firstName,
      lastName,
      mobileNumber,
      mobile2,
      email,
      email2,
      pan,
      nationality,

      regAddress1: quick ? '' : regAddress1,
      regAddress2: quick ? '' : regAddress2,
      regAddress3: quick ? '' : regAddress3,
      regArea: quick ? '' : regArea,
      regCity: quick ? '' : regCity,
      regState: quick ? '' : regState,
      regCountry: quick ? '' : regCountry,
      regPinCode: quick ? '' : regPinCode,

      offAddress1: quick ? '' : offAddress1,
      offAddress2: quick ? '' : offAddress2,
      offAddress3: quick ? '' : offAddress3,
      offArea: quick ? '' : offArea,
      offCity: quick ? '' : offCity,
      offState: quick ? '' : offState,
      offCountry: quick ? '' : offCountry,
      offPinCode: quick ? '' : offPinCode,

      addressType: mailingPref,
    };

    console.log(
      'CREATE DONOR:',
      baseUrl + create_donor,
      payload,
      quick ? '\nquick save' : '\ndetailed save',
    );

    await axios
      .post(baseUrl + create_donor, payload)
      .then(res => {
        res?.data?.successCode === 1
          ? (quick
              ? (setDonorId(res?.data?.data?.[0]?.donorId),
                setDetailsEditable(false))
              : (setDetailsEditable(true),
                store?.setNewDonor({
                  ...store?.newDonor, // added because masked flag not reaching after one edit click
                  ...res?.data?.data?.[0],
                  salutation,
                  firstName,
                  lastName,
                  mobileNumber,
                  mobile2,
                  email,
                  email2,
                  pan,
                  nationality,
                  regAddress1,
                  regAddress2,
                  regAddress3,
                  regArea,
                  regCity,
                  regState,
                  regCountry,
                  regPinCode,
                  offAddress1,
                  offAddress2,
                  offAddress3,
                  offArea,
                  offCity,
                  offState,
                  offCountry,
                  offPinCode,
                }),
                navigation.navigate('DonationReceiept')),
            showMessage({
              message: 'Success!',
              description: `Donor ${
                store?.newDonor?.donorId && detailsEditable
                  ? 'updated'
                  : 'created'
              } successfully`,
              type: 'success',
              floating: true,
              icon: 'auto',
            }))
          : showMessage({
              message: 'Opps!',
              description: 'Something went wrong',
              type: 'danger',
              floating: true,
              icon: 'auto',
            });
      })
      .catch(err => {
        console.log('save error', err),
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
      <Header // header
        color={COLORS.black}
        leftButtonIcon="chevron-left"
        title="CREATE / UPDATE DONOR"
        onPressLeft={() => navigation.goBack()}
      />
      <ScrollView
        style={{flex: 1}}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          alignItems: 'center',
          paddingBottom: SIZES.paddingHuge,
        }}>
        {/* PERSONAL DETAILS SECTION */}

        {detailsEditable ? (
          <Section // editable personal details section
            name="PERSONAL DETAILS"
            leftItem={
              <MaterialCommunityIcons // left icon
                name="card-account-details-outline"
                size={25}
                color={COLORS.darkGray}
                style={{marginRight: SIZES.paddingSmall}}
              />
            }
            rightItem={
              Object.keys(store?.newDonor).length === 0 && (
                <TouchableOpacity onPress={() => next('quick')}>
                  <MaterialCommunityIcons // left icon
                    name="content-save-outline"
                    size={25}
                    color={COLORS.blue}
                  />
                </TouchableOpacity>
              )
            }>
            <>
              {store?.routeInfo?.patronId && (
                <View
                  style={[
                    styles.input,
                    {borderWidth: 0, flexDirection: 'row'},
                  ]}>
                  <Text style={styles.identifierTxt}>Patron ID :</Text>
                  <Text style={[styles.valueTxt, {flex: 1.5}]}>
                    {store?.routeInfo?.patronId}
                  </Text>
                </View>
              )}

              {(donorId?.length > 0 || store?.newDonor?.donorId) && (
                <View
                  style={[
                    styles.input,
                    {borderWidth: 0, flexDirection: 'row'},
                  ]}>
                  <Text style={styles.identifierTxt}>Donor ID :</Text>
                  <Text style={[styles.valueTxt, {flex: 1.5}]}>
                    {/* quick and normal save  states */}
                    {donorId ? donorId : store?.newDonor?.donorId}
                  </Text>
                </View>
              )}

              <View // name section
                style={{flexDirection: 'row'}}>
                <Dropdown // salutauion dropdown
                  disable={
                    donorId?.length > 0 || store?.newDonor?.donorId?.length > 0
                  }
                  placeholder="Sal"
                  style={[
                    styles.dropStyle,
                    {
                      flex: 1,
                      borderWidth:
                        donorId?.length > 0 ||
                        store?.newDonor?.donorId?.length > 0
                          ? 0
                          : 1,
                    },
                  ]}
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
                  editable={!(donorId || store?.newDonor?.donorId)}
                  ref={firstNameRef}
                  style={[
                    styles.input,
                    {
                      flex: 1,
                      marginHorizontal: SIZES.paddingSmall,
                      borderWidth: donorId || store?.newDonor?.donorId ? 0 : 1,
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
                  editable={
                    !(
                      donorId?.length > 0 ||
                      store?.newDonor?.donorId?.length > 0
                    )
                  }
                  style={[
                    styles.input,
                    {
                      flex: 1,
                      borderWidth:
                        donorId?.length > 0 ||
                        store?.newDonor?.donorId?.length > 0
                          ? 0
                          : 1,
                    },
                  ]}
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

              <TextInput // mobile input
                editable={!(store?.newDonor?.isMasked === 'Y')}
                ref={mobileRef}
                style={[
                  styles.input,
                  {borderWidth: store?.newDonor?.isMasked === 'Y' ? 0 : 1},
                ]}
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
                editable={!(store?.newDonor?.isMasked === 'Y')}
                style={[
                  styles.input,
                  {borderWidth: store?.newDonor?.isMasked === 'Y' ? 0 : 1},
                ]}
                placeholder="Email"
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
                placeholder="PAN Number"
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
                placeholder="Select Nationality"
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
            </>
          </Section>
        ) : (
          <LabelCard // personal details review section
            name="PERSONAL DETAILS"
            rightItem={
              Object.keys(store?.newDonor).length === 0 && (
                <TouchableOpacity onPress={() => setDetailsEditable(true)}>
                  <Text style={[styles.identifierTxt, {color: COLORS.blue}]}>
                    EDIT
                  </Text>
                </TouchableOpacity>
              )
            }>
            {
              // donor id review
              (donorId?.length > 0 || store?.newDonor?.donorId?.length > 0) && (
                <View style={[styles.valCont, {marginTop: 0}]}>
                  <Text style={styles.identifierTxt}>Donor ID :</Text>
                  <Text style={styles.valueTxt}>
                    {donorId ? donorId : store?.newDonor?.donorId}
                  </Text>
                </View>
              )
            }

            {
              // name review
              (salutation?.length > 0 ||
                firstName?.length > 0 ||
                lastName?.length > 0) && (
                <View
                  style={[
                    styles.valCont,
                    {
                      marginTop:
                        donorId?.length > 0 ||
                        store?.newDonor?.donorId?.length > 0
                          ? SIZES.paddingSmall
                          : 0,
                    },
                  ]}>
                  <Text style={styles.identifierTxt}>Donor Name :</Text>
                  <Text style={styles.valueTxt}>
                    {salutation + ' ' + firstName + ' ' + lastName}
                  </Text>
                </View>
              )
            }

            {
              // mobileNumber review
              mobileNumber?.length > 0 && (
                <View style={styles.valCont}>
                  <Text style={styles.identifierTxt}>Mobile :</Text>
                  <Text style={styles.valueTxt}>{mobileNumber}</Text>
                </View>
              )
            }

            {
              // alternate mobile review
              mobile2?.length > 0 && (
                <View style={styles.valCont}>
                  <Text style={styles.identifierTxt}>Alternate Mobile :</Text>
                  <Text style={styles.valueTxt}>{mobile2}</Text>
                </View>
              )
            }

            {
              // email review
              email?.length > 0 && (
                <View style={styles.valCont}>
                  <Text style={styles.identifierTxt}>Email :</Text>
                  <Text style={styles.valueTxt}>{email}</Text>
                </View>
              )
            }

            {
              // alternate email review
              email2?.length > 0 && (
                <View style={styles.valCont}>
                  <Text style={styles.identifierTxt}>Alternate Email :</Text>
                  <Text style={styles.valueTxt}>{email2}</Text>
                </View>
              )
            }

            {
              // pan review
              pan?.length > 0 && (
                <View style={styles.valCont}>
                  <Text style={styles.identifierTxt}>PAN :</Text>
                  <Text style={styles.valueTxt}>{pan}</Text>
                </View>
              )
            }

            {
              // nationality review
              nationality?.length > 0 && (
                <View style={styles.valCont}>
                  <Text style={styles.identifierTxt}>Nationalilty :</Text>
                  <Text style={styles.valueTxt}>
                    {
                      nationalities.find(each => each.value === nationality)
                        ?.label
                    }
                  </Text>
                </View>
              )
            }
          </LabelCard>
        )}

        {/* RESIDENTIAL ADDRESS REVIEW SECTION */}

        {Object.keys(store?.newDonor).length === 0 && !resEditable && (
          <LabelCard
            name="RESIDENTIAL ADDRESS"
            rightItem={
              <TouchableOpacity onPress={() => setResEditable(true)}>
                <Text style={[styles.identifierTxt, {color: COLORS.blue}]}>
                  EDIT
                </Text>
              </TouchableOpacity>
            }>
            {
              // preference review
              mailingPref?.length > 0 && (
                <View style={[styles.valCont, {marginTop: 0}]}>
                  <Text style={styles.identifierTxt}>Preffered Mailing :</Text>
                  <Text style={styles.valueTxt}>
                    {mailingPref === 'R' ? 'Yes' : 'No'}
                  </Text>
                </View>
              )
            }

            {
              //  address review
              (regAddress1?.length > 0 ||
                regAddress2?.length > 0 ||
                regAddress3?.length > 0 ||
                regArea?.length > 0 ||
                regCity?.length > 0 ||
                regState?.length > 0 ||
                regCountry?.length > 0 ||
                regPinCode?.length > 0) && (
                <View style={styles.valCont}>
                  <Text style={styles.identifierTxt}>Address :</Text>
                  <Text style={styles.valueTxt}>
                    {regAddress1 +
                      (regAddress1 && ', ') +
                      regAddress2 +
                      (regAddress1 && ', ') +
                      regAddress3 +
                      (regAddress3 && ', ') +
                      regArea +
                      (regArea && ', ') +
                      regCity +
                      (regCity && ', ') +
                      regState +
                      (regState && ', ') +
                      regCountry +
                      (regCountry && ', ') +
                      regPinCode +
                      (regPinCode && ', ')}
                  </Text>
                </View>
              )
            }
          </LabelCard>
        )}

        {/* ADDRESS EDIT SECTION */}

        {Object.keys(store?.newDonor).length === 0 &&
          (resEditable || offEditable) && (
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

              {resEditable && (
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
                        mailingPref === 'R'
                          ? setMailingPref('')
                          : setMailingPref('R')
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
                    onChangeText={text => setRegAddress1(text)}
                    value={regAddress1}
                  />

                  <TextInput // residential house number input
                    style={styles.input}
                    placeholder="House / Apartment / Building"
                    placeholderTextColor={COLORS.gray}
                    keyboardAppearance="dark"
                    keyboardType="default"
                    returnKeyType="done"
                    color={COLORS.black}
                    onChangeText={text => setRegAddress2(text)}
                    value={regAddress2}
                  />

                  <TextInput // residential street input
                    style={styles.input}
                    placeholder="Street"
                    placeholderTextColor={COLORS.gray}
                    keyboardAppearance="dark"
                    keyboardType="default"
                    returnKeyType="done"
                    color={COLORS.black}
                    onChangeText={text => setRegAddress3(text)}
                    value={regAddress3}
                  />

                  <TextInput // residential area input
                    style={styles.input}
                    placeholder="Area / Locality"
                    placeholderTextColor={COLORS.gray}
                    keyboardAppearance="dark"
                    keyboardType="default"
                    returnKeyType="done"
                    color={COLORS.black}
                    onChangeText={text => setRegArea(text)}
                    value={regArea}
                  />

                  <TextInput // residential city input
                    style={styles.input}
                    placeholder="City"
                    placeholderTextColor={COLORS.gray}
                    keyboardAppearance="dark"
                    keyboardType="default"
                    returnKeyType="done"
                    color={COLORS.black}
                    onChangeText={text => setRegCity(text)}
                    value={regCity}
                  />

                  <TextInput // residential state input
                    style={styles.input}
                    placeholder="State"
                    placeholderTextColor={COLORS.gray}
                    keyboardAppearance="dark"
                    keyboardType="default"
                    returnKeyType="done"
                    color={COLORS.black}
                    onChangeText={text => setRegState(text)}
                    value={regState}
                  />

                  <TextInput // residential country input
                    style={styles.input}
                    placeholder="Country"
                    placeholderTextColor={COLORS.gray}
                    keyboardAppearance="dark"
                    keyboardType="default"
                    returnKeyType="done"
                    color={COLORS.black}
                    onChangeText={text => setRegCountry(text)}
                    value={regCountry}
                  />

                  <TextInput // residential pin code input
                    style={styles.input}
                    placeholder="PIN Code"
                    placeholderTextColor={COLORS.gray}
                    keyboardAppearance="dark"
                    keyboardType="number-pad"
                    returnKeyType="done"
                    color={COLORS.black}
                    onChangeText={text => setRegPinCode(text)}
                    value={regPinCode}
                  />
                </>
              )}

              {/* OFFICE ADDRESS SECTION */}

              {offEditable && (
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
                        mailingPref === 'O'
                          ? setMailingPref('')
                          : setMailingPref('O')
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
                    onChangeText={text => setOffAddress1(text)}
                    value={offAddress1}
                  />

                  <TextInput // office house number input
                    style={styles.input}
                    placeholder="House / Apartment / Building"
                    placeholderTextColor={COLORS.gray}
                    keyboardAppearance="dark"
                    keyboardType="default"
                    returnKeyType="done"
                    color={COLORS.black}
                    onChangeText={text => setOffAddress2(text)}
                    value={offAddress2}
                  />

                  <TextInput // office street input
                    style={styles.input}
                    placeholder="Street"
                    placeholderTextColor={COLORS.gray}
                    keyboardAppearance="dark"
                    keyboardType="default"
                    returnKeyType="done"
                    color={COLORS.black}
                    onChangeText={text => setOffAddress3(text)}
                    value={offAddress3}
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
                    onChangeText={text => setOffPinCode(text)}
                    value={offPinCode}
                  />
                </>
              )}
            </Section>
          )}

        {/* OFFICE ADDRESS REVIEW SECTION */}

        {Object.keys(store?.newDonor).length === 0 && !offEditable && (
          <LabelCard
            name="OFFICE ADDRESS"
            rightItem={
              <TouchableOpacity onPress={() => setOffEditable(true)}>
                <Text style={[styles.identifierTxt, {color: COLORS.blue}]}>
                  EDIT
                </Text>
              </TouchableOpacity>
            }>
            <View // preference review
              style={[styles.valCont, {marginTop: 0}]}>
              <Text style={styles.identifierTxt}>Preffered Mailing :</Text>
              <Text style={styles.valueTxt}>
                {mailingPref === 'O' ? 'Yes' : 'No'}
              </Text>
            </View>

            {
              // address review
              (offAddress1?.length > 0 ||
                offAddress2?.length > 0 ||
                offAddress3?.length > 0 ||
                offArea?.length > 0 ||
                offCity?.length > 0 ||
                offState?.length > 0 ||
                offCountry?.length > 0 ||
                offPinCode?.length > 0) && (
                <View style={styles.valCont}>
                  <Text style={styles.identifierTxt}>Address :</Text>
                  <Text style={styles.valueTxt}>
                    {offAddress1 +
                      (offAddress1 && ', ') +
                      offAddress2 +
                      (offAddress2 && ', ') +
                      offAddress3 +
                      (offAddress3 && ', ') +
                      offArea +
                      (offArea && ', ') +
                      offCity +
                      (offCity && ', ') +
                      offState +
                      (offState && ', ') +
                      offCountry +
                      (offCountry && ', ') +
                      offPinCode +
                      (offPinCode && ', ')}
                  </Text>
                </View>
              )
            }
          </LabelCard>
        )}

        <PrimaryButton // next button
          style={[
            styles.primaryBtn,
            {
              backgroundColor:
                !Object.keys(store?.newDonor).length > 0 &&
                (detailsEditable || resEditable || offEditable)
                  ? COLORS.primary
                  : COLORS.saveEnabled,
            },
          ]}
          name={
            Object.keys(store?.newDonor).length > 0
              ? 'Update'
              : detailsEditable || resEditable || offEditable
              ? 'Next'
              : 'Save'
          }
          onPress={() =>
            Object.keys(store?.newDonor).length === 0 &&
            (detailsEditable || resEditable || offEditable)
              ? next()
              : save()
          }
        />
      </ScrollView>
    </LinearGradient>
  );
};

export default CreateDonor;

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
});
