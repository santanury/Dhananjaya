import {
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  View,
  Text,
  BackHandler,
  PermissionsAndroid,
  TextInput,
  ScrollView,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import axios from 'axios';
import Geolocation from 'react-native-geolocation-service';
import Geocoder from 'react-native-geocoding';
import Animated from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {showMessage} from 'react-native-flash-message';
import {Dropdown} from 'react-native-element-dropdown';
import {COLORS, SIZES, FONTS} from '../../constants';
import {Store} from '../../store/Store';
import {
  baseUrl,
  accessKey,
  get_salutation_list,
  create_prospect,
  get_prospect_details,
  get_prospect_address,
  update_prospect_address,
} from '../../webApi/service';

// components
import Header from '../../components/Common/Header';
import Section from '../../components/Common/Section';
import PrimaryButton from '../../components/Common/PrimaryButton';

const CreateProspect = ({navigation, route}) => {
  const store = Store();

  // PERSONAL DETAILS STATES
  const [salutations, setSalutations] = useState([]); // salutations array
  const [nationalities] = useState([
    {label: 'Indian', value: 'I'},
    {label: 'Other', value: 'O'},
  ]); // nationalities array
  const [salutation, setSalutation] = useState(''); // selected salutation
  const [firstName, setFirstName] = useState(''); // first name state
  const [lastName, setLastName] = useState(''); // last name state
  const [mobileNumber, setMobileNumber] = useState(''); // mobile state
  const [mobile2, setMobile2] = useState(''); // alternate mobile state
  const [email, setEmail] = useState(''); // email state
  const [email2, setEmail2] = useState(''); // alternate email state
  const [nationality, setNationality] = useState(''); // nationality state
  const [interests] = useState(['25', '50', '75']); // interest percentages
  const [interest, setInterest] = useState(''); // selected interest
  const [remarks, setRemarks] = useState(''); // remarks for the prospect

  // RESIDENTIAL ADDRESS STATES
  const [door, setDoor] = useState(''); // residential door state
  const [house, setHouse] = useState(''); // residential house no state
  const [street, setStreet] = useState(''); // residential street state
  const [area, setArea] = useState(''); // residential area state
  const [city, setCity] = useState(''); // residential city state
  const [state, setState] = useState(''); // residential state state
  const [country, setCountry] = useState(''); // residential country state
  const [pincode, setPincode] = useState(''); // residential pincode state

  const firstNameRef = useRef(null);
  const mobileRef = useRef(null);
  const mobile2Ref = useRef(null);
  const emailRef = useRef(null);

  console.log(interest);

  useEffect(() => {
    const unSubscribe = navigation.addListener('focus', () => {
      BackHandler.addEventListener('hardwareBackPress', () => {
        console.log('BackHandler In CreateProspect');
        navigation.goBack();
        return true;
      });
      (route?.params?.type === 'C' || route?.params?.type === 'EP') &&
        getSalutations();
      route?.params?.type === 'EP' && getProspectDetails(route?.params);
      route?.params?.type === 'EA' && getProspectAddress(route?.params);
    });
    return unSubscribe;
  }, [route?.params?.type]);

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
    console.log(params);
    await Geocoder.from(...params)
      .then(json => {
        const address = json.results[0].address_components;

        setDoor(
          address.find(each => each.types[0] === 'plus_code')
            ? address.find(each => each.types[0] === 'plus_code')?.long_name
            : address.find(each => each.types[0] === 'premise')
            ? address.find(each => each.types[0] === 'premise')?.long_name
            : door,
        ),
          setHouse(
            address.find(each => each.types[0] === 'premise')
              ? address.find(each => each.types[0] === 'premise')?.long_name
              : address.find(each => each.types[0] === 'plus_code')
              ? address.find(each => each.types[0] === 'plus_code')?.long_name
              : address.find(each => each.types[0] === 'neighborhood')
              ? address.find(each => each.types[0] === 'neighborhood')
                  ?.long_name
              : house,
          ),
          setStreet(
            address.find(each => each.types[0] === 'neighborhood')
              ? address.find(each => each.types[0] === 'neighborhood')
                  ?.long_name
              : address.find(each => each.types[0] === 'route')
              ? address.find(each => each.types[0] === 'route')?.long_name
              : street,
          ),
          setArea(
            address.find(each => each.types[2] === 'sublocality_level_2')
              ? address.find(each => each.types[2] === 'sublocality_level_2')
                  ?.long_name
              : address.find(each => each.types[2] === 'sublocality_level_1')
              ? address.find(each => each.types[2] === 'sublocality_level_1')
                  ?.long_name
              : area,
          ),
          setCity(
            address.find(each => each.types[0] === 'locality')
              ? address.find(each => each.types[0] === 'locality')?.long_name
              : address.find(
                  each => each.types[0] === 'administrative_area_level_2',
                )
              ? address.find(
                  each => each.types[0] === 'administrative_area_level_2',
                )?.long_name
              : city,
          ),
          setState(
            address.find(
              each => each.types[0] === 'administrative_area_level_1',
            )
              ? address.find(
                  each => each.types[0] === 'administrative_area_level_1',
                )?.long_name
              : state,
          ),
          setCountry(
            address.find(each => each.types[0] === 'country')
              ? address.find(each => each.types[0] === 'country')?.long_name
              : country,
          ),
          setPincode(
            address.find(each => each.types[0] === 'postal_code')
              ? address.find(each => each.types[0] === 'postal_code')?.long_name
              : pincode,
          );
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
  const getLocation = async () => {
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
            getLocName(pos);
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

  // get prospect details
  const getProspectDetails = async params => {
    console.log(
      '',
      '\n======== GET PROSPECT DATA ========',
      '\naccessKey:',
      accessKey,
      '\nloginId:',
      store.userData?.userId,
      '\nsessionId:',
      store.userData?.session_id,
      '\ndeviceId:',
      store.deviceId,
      '\nuserRole:',
      store?.userData?.userRole,
      '\nprospectId:',
      params?.prospectId,
      '\n================================',
    );

    await axios
      .post(baseUrl + get_prospect_details, {
        accessKey,
        deviceId: store?.deviceId,
        loginId: store?.userData?.userId,
        sessionId: store?.userData?.session_id,
        userRole: store?.userData?.userRole,
        prospectId: params?.prospectId,
      })
      .then(res => {
        res?.data?.successCode === 1
          ? (setSalutation(res?.data?.prospectDetails?.[0]?.salutation),
            setFirstName(res?.data?.prospectDetails?.[0]?.firstName),
            setLastName(res?.data?.prospectDetails?.[0]?.lastName),
            (res?.data?.prospectDetails?.[0]?.mobileNos ||
              res?.data?.prospectDetails?.[0]?.mobileNos === ':') &&
              (res?.data?.prospectDetails?.[0]?.mobileNos.split(':').length > 1
                ? (setMobileNumber(
                    res?.data?.prospectDetails?.[0]?.mobileNos?.split(':')[0],
                  ),
                  setMobile2(
                    res?.data?.prospectDetails?.[0]?.mobileNos?.split(':')[1],
                  ))
                : setMobileNumber(res?.data?.prospectDetails?.[0]?.mobileNos)),
            (res?.data?.prospectDetails?.[0]?.emailIds ||
              res?.data?.prospectDetails?.[0]?.emailIds === ':') &&
              (res?.data?.prospectDetails?.[0]?.emailIds.split(':').length > 1
                ? (setEmail(
                    res?.data?.prospectDetails?.[0]?.emailIds?.split(':')[0],
                  ),
                  setEmail2(
                    res?.data?.prospectDetails?.[0]?.emailIds?.split(':')[1],
                  ))
                : setEmail(res?.data?.prospectDetails?.[0]?.emailIds)),
            setNationality(res?.data?.prospectDetails?.[0]?.nationality),
            setInterest(res?.data?.prospectDetails?.[0]?.level),
            setRemarks(res?.data?.prospectDetails?.[0]?.remarks))
          : showMessage({
              message: 'Opps!',
              description: 'Something went wrong',
              type: 'warning',
              floating: true,
              icon: 'auto',
            });
      })
      .catch(err => {
        console.log('Error fetching prospect data:', err);
        showMessage({
          message: 'Error!',
          description: 'Please check your internet connection',
          type: 'danger',
          floating: true,
          icon: 'auto',
        });
      });
  };

  // get prospect address
  const getProspectAddress = async params => {
    console.log(
      '',
      '\n======== GET PROSPECT ADDRESS ========',
      '\naccessKey:',
      accessKey,
      '\nloginId:',
      store.userData?.userId,
      '\nsessionId:',
      store.userData?.session_id,
      '\ndeviceId:',
      store.deviceId,
      '\nuserRole:',
      store?.userData?.userRole,
      '\nprospectId:',
      params?.prospectId,
      '\n================================',
    );

    await axios
      .post(baseUrl + get_prospect_address, {
        accessKey,
        deviceId: store?.deviceId,
        loginId: store?.userData?.userId,
        sessionId: store?.userData?.session_id,
        userRole: store?.userData?.userRole,
        prospectId: params?.prospectId,
      })
      .then(res => {
        res?.data?.successCode === 1
          ? (setDoor(res?.data?.contactDetails?.[0]?.resAddress1),
            setHouse(res?.data?.contactDetails?.[0]?.resAddress2),
            setStreet(res?.data?.contactDetails?.[0]?.resAddress3),
            setArea(res?.data?.contactDetails?.[0]?.resAddress4),
            setCity(res?.data?.contactDetails?.[0]?.resCity),
            setState(res?.data?.contactDetails?.[0]?.resState),
            setCountry(res?.data?.contactDetails?.[0]?.resCountry),
            setPincode(res?.data?.contactDetails?.[0]?.resPinCode))
          : showMessage({
              message: 'Opps!',
              description: 'Something went wrong',
              type: 'warning',
              floating: true,
              icon: 'auto',
            });
      })
      .catch(err => {
        console.log('Error fetching prospect address data:', err);
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
    route?.params?.type === 'EA'
      ? updateAddress()
      : firstName?.length === 0
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
      : !nationality
      ? showMessage({
          message: 'Warning!',
          description: 'Please select a nationality',
          type: 'warning',
          floating: true,
          icon: 'auto',
        })
      : !interest
      ? showMessage({
          message: 'Warning!',
          description: 'Please select interest percentage',
          type: 'warning',
          floating: true,
          icon: 'auto',
        })
      : route?.params?.type === 'EP'
      ? updateProspect()
      : navigation.navigate('ReviewProspect', {
          salutation,
          firstName,
          lastName,
          mobileNumber,
          mobile2,
          email,
          email2,
          nationality,
          door,
          house,
          street,
          area,
          city,
          state,
          country,
          pincode,
          interest,
          remarks,
        });
  };

  // update prospect
  const updateProspect = async () => {
    console.log(
      '\n======== UPDATE PROSPECT DETAILS ========',
      '\nurl ' + baseUrl + create_prospect,

      '\naccessKey:',
      accessKey,
      '\ndeviceId:',
      store?.deviceId,
      '\nloginId:',
      store?.userData?.userId,
      '\nsessionId:',
      store?.userData?.session_id,

      '\nprospectId:',
      route?.params?.prospectId,
      '\nsalutation:',
      salutation,
      '\nfirstName:',
      firstName,
      '\nlastName:',
      lastName,
      '\nmobileNo:',
      mobileNumber,
      '\nmobile2:',
      mobile2,
      '\nemail:',
      email,
      '\nemail2:',
      email2,

      '\nnationality:',
      nationality,

      '\nlevel:',
      interest,
      '\nremarks:',
      remarks,

      '\n================================',
    );

    await axios
      .post(baseUrl + create_prospect, {
        accessKey,
        deviceId: store?.deviceId,
        loginId: store?.userData?.userId,
        sessionId: store?.userData?.session_id,

        prospectId: route?.params?.prospectId,
        salutation: salutation,
        firstName: firstName,
        lastName: lastName,
        mobileNo: mobileNumber,
        mobile2: mobile2,
        email: email,
        email2: email2,

        nationality: nationality,

        level: interest,
        remarks: remarks,
      })
      .then(res =>
        res.data.successCode === 1
          ? (showMessage({
              message: 'Success!',
              description: 'Prospect updated successfully',
              type: 'success',
              floating: true,
              icon: 'auto',
            }),
            navigation.navigate('Prospect'))
          : showMessage({
              message: 'Opps!',
              description: 'Something went wrong',
              type: 'danger',
              floating: true,
              icon: 'auto',
            }),
      )
      .catch(
        err => (
          console.log('Error updating prospect details', err),
          showMessage({
            message: 'Error!',
            description: 'Please check your internet connection',
            type: 'danger',
            floating: true,
            icon: 'auto',
          })
        ),
      );
  };

  // update address
  const updateAddress = async () => {
    console.log(
      '\n======== UPDATE PROSPECT ADDRESS ========',
      '\nurl ' + baseUrl + update_prospect_address,

      '\naccessKey:',
      accessKey,
      '\ndeviceId:',
      store?.deviceId,
      '\nloginId:',
      store?.userData?.userId,
      '\nsessionId:',
      store?.userData?.session_id,

      '\nprospectId:',
      route?.params?.prospectId,
      '\nregAddress1:',
      door,
      '\nregAddress2:',
      house,
      '\nregAddress3:',
      street,
      '\nregArea:',
      area,
      '\nregCity:',
      city,
      '\nregState:',
      state,
      '\nregCountry:',
      country,
      '\nregPincode:',
      pincode,
      '\naddressType:',
      'R',

      '\n================================',
    );

    await axios
      .post(baseUrl + update_prospect_address, {
        accessKey,
        deviceId: store?.deviceId,
        loginId: store?.userData?.userId,
        sessionId: store?.userData?.session_id,

        prospectId: route?.params?.prospectId,
        regAddress1: door,
        regAddress2: house,
        regAddress3: street,
        regArea: area,
        regCity: city,
        regState: state,
        regCountry: country,
        regPincode: pincode,
        addressType: 'R',
      })
      .then(res =>
        res.data.successCode === 1
          ? (showMessage({
              message: 'Success!',
              description: 'Address updated successfully',
              type: 'success',
              floating: true,
              icon: 'auto',
            }),
            navigation.navigate('Prospect'))
          : showMessage({
              message: 'Opps!',
              description: 'Something went wrong',
              type: 'danger',
              floating: true,
              icon: 'auto',
            }),
      )
      .catch(
        err => (
          console.log('Error updating prospect address', err),
          showMessage({
            message: 'Error!',
            description: 'Please check your internet connection',
            type: 'danger',
            floating: true,
            icon: 'auto',
          })
        ),
      );
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
          leftButtonIcon="chevron-left"
          title={
            route?.params?.type === 'EP'
              ? 'EDIT PROSPECT DETAILS'
              : route?.params?.type === 'EA'
              ? 'EDIT PROSPECT ADDRESS'
              : 'CREATE PROSPECT'
          }
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

          {(route?.params?.type === 'C' || route?.params?.type === 'EP') && (
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

              <Dropdown // interest dropdown
                placeholder="Interest"
                style={styles.dropStyle}
                placeholderStyle={styles.dropPlaceholder}
                selectedTextStyle={styles.dropSelectedTxt}
                containerStyle={styles.dropContainer}
                fontFamily={FONTS.josefinSansRegular}
                data={interests?.map(each => {
                  return {label: `${each}%`, value: each};
                })}
                value={interest}
                labelField="label"
                valueField="value"
                renderItem={item => (
                  <Text style={styles.dropText}>{item.label}</Text>
                )}
                onChange={item => setInterest(item.value)}
              />

              <View // add remarks container
                style={styles.addCommentInputCont}>
                <TextInput // remarks input
                  ref={emailRef}
                  style={styles.addCommentInput}
                  placeholder="Remarks"
                  multiline={true}
                  textAlignVertical="top"
                  placeholderTextColor={COLORS.gray}
                  keyboardAppearance="dark"
                  keyboardType="default"
                  returnKeyType="done"
                  color={COLORS.black}
                  onChangeText={text => setRemarks(text)}
                  value={remarks}
                  maxLength={500}
                />

                <Text // no. of characters left indicator
                  style={styles.characterLeft}>
                  {0 + remarks?.length}/500
                </Text>
              </View>
            </Section>
          )}

          {/* ADDRESS SECTION */}

          {(route?.params?.type === 'C' || route?.params?.type === 'EA') && (
            <Section
              name="ADDRESS"
              leftItem={
                <MaterialCommunityIcons // left icon
                  name="map-marker-multiple-outline"
                  size={25}
                  color={COLORS.darkGray}
                  style={{marginRight: SIZES.paddingSmall}}
                />
              }
              rightItem={
                <TouchableOpacity onPress={() => getLocation()}>
                  <MaterialCommunityIcons // location icon
                    name="map-marker-plus"
                    size={25}
                    color={COLORS.flatBlue}
                  />
                </TouchableOpacity>
              }>
              {/* ADDRESS SECTION */}

              <>
                <TextInput // residential door number input
                  style={styles.input}
                  placeholder="Door Number"
                  placeholderTextColor={COLORS.gray}
                  keyboardAppearance="dark"
                  keyboardType="default"
                  returnKeyType="done"
                  color={COLORS.black}
                  onChangeText={text => setDoor(text)}
                  value={door}
                />

                <TextInput // residential house number input
                  style={styles.input}
                  placeholder="House / Apartment / Building"
                  placeholderTextColor={COLORS.gray}
                  keyboardAppearance="dark"
                  keyboardType="default"
                  returnKeyType="done"
                  color={COLORS.black}
                  onChangeText={text => setHouse(text)}
                  value={house}
                />

                <TextInput // residential street input
                  style={styles.input}
                  placeholder="Street"
                  placeholderTextColor={COLORS.gray}
                  keyboardAppearance="dark"
                  keyboardType="default"
                  returnKeyType="done"
                  color={COLORS.black}
                  onChangeText={text => setStreet(text)}
                  value={street}
                />

                <TextInput // residential area input
                  style={styles.input}
                  placeholder="Area / Locality"
                  placeholderTextColor={COLORS.gray}
                  keyboardAppearance="dark"
                  keyboardType="default"
                  returnKeyType="done"
                  color={COLORS.black}
                  onChangeText={text => setArea(text)}
                  value={area}
                />

                <TextInput // residential city input
                  style={styles.input}
                  placeholder="City"
                  placeholderTextColor={COLORS.gray}
                  keyboardAppearance="dark"
                  keyboardType="default"
                  returnKeyType="done"
                  color={COLORS.black}
                  onChangeText={text => setCity(text)}
                  value={city}
                />

                <TextInput // residential state input
                  style={styles.input}
                  placeholder="State"
                  placeholderTextColor={COLORS.gray}
                  keyboardAppearance="dark"
                  keyboardType="default"
                  returnKeyType="done"
                  color={COLORS.black}
                  onChangeText={text => setState(text)}
                  value={state}
                />

                <TextInput // residential country input
                  style={styles.input}
                  placeholder="Country"
                  placeholderTextColor={COLORS.gray}
                  keyboardAppearance="dark"
                  keyboardType="default"
                  returnKeyType="done"
                  color={COLORS.black}
                  onChangeText={text => setCountry(text)}
                  value={country}
                />

                <TextInput // residential pin code input
                  style={styles.input}
                  placeholder="PIN Code"
                  placeholderTextColor={COLORS.gray}
                  keyboardAppearance="dark"
                  keyboardType="number-pad"
                  returnKeyType="done"
                  color={COLORS.black}
                  onChangeText={text => setPincode(text)}
                  value={pincode}
                />
              </>
            </Section>
          )}

          <PrimaryButton // next button
            style={styles.primaryBtn}
            name="Next"
            onPress={() => next()}
          />
        </ScrollView>
      </LinearGradient>
    </Animated.View>
  );
};

export default CreateProspect;

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
  addCommentInputCont: {
    marginTop: SIZES.paddingSmall,
    width: '100%',
    borderRadius: SIZES.radiusSmall,
    backgroundColor: COLORS.antiFlashWhite,
    overflow: 'hidden',
    borderColor: COLORS.lightGray,
    borderWidth: 1,
  },
  addCommentInput: {
    flex: 1,
    paddingHorizontal: SIZES.paddingSmall,
    paddingVertical: SIZES.paddingSmall,
    fontSize: SIZES.fontSmall,
    fontFamily: FONTS.josefinSansRegular,
    color: COLORS.black,
  },
  characterLeft: {
    color: COLORS.gray,
    alignSelf: 'flex-end',
    marginRight: SIZES.paddingSmall,
    marginBottom: SIZES.paddingSmall,
  },
  primaryBtn: {
    alignSelf: 'center',
    width: SIZES.width * 0.9,
  },
});
