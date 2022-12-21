import {
  StyleSheet,
  StatusBar,
  Text,
  View,
  Pressable,
  ScrollView,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
  Linking,
  BackHandler,
  TextInput,
  Modal,
  Dimensions,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
import Geolocation from 'react-native-geolocation-service';
import Geocoder from 'react-native-geocoding';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Dropdown} from 'react-native-element-dropdown';
import {Checkbox} from 'react-native-paper';
import {showMessage} from 'react-native-flash-message';
import {COLORS, FONTS, SIZES, SHADOW} from '../constants';
import {Store} from '../store/Store';
import {
  accessKey,
  baseUrl,
  get_donor_details,
  update_daonor_address_location,
  get_donor_address,
  update_donor_address,
  search_dr_data,
  GOOGLE_API_KEY,
} from '../webApi/service';

// components
import Header from '../components/Common/Header';
import PrimaryButton from '../components/Common/PrimaryButton';
import Section from '../components/Common/Section';
import CollapsableSection from '../components/Common/CollapsableSection';
import CommonModal from '../components/Common/CommonModal';
import {Spinner} from 'native-base';

Geocoder.init(GOOGLE_API_KEY);

const DonorDetails = ({navigation, route}) => {
  const store = Store();

  // basic details section states
  const [donorDetails, setDonorDetails] = useState({}); // donor details

  // contact section states
  const [addressTypes] = useState([
    {label: 'Residential', value: 'R'},
    {label: 'Office', value: 'O'},
  ]); // available address types

  // address tagging states
  const [tagModal, setTagModal] = useState(false); // address to tag modal
  const [tagAddress, setTagAddress] = useState(''); // address to tag
  const [tagMailingPref, setTagMailingPref] = useState('R'); // type of address to tag
  const [latitude, setLattitude] = useState(''); // latitude to tag
  const [longitude, setLongitude] = useState(''); // longitude to tag
  // navigation address states
  const [navigationMdl, setNavigationMdl] = useState(false); // tagged address modal
  const [navigationAddress, setNavigationAddress] = useState(''); // tagged addresses
  // update address states
  const [updateAddressMdl, setUpdateAddressMdl] = useState(false); // update address modal
  const [updateTyp, setUpdateTyp] = useState(''); // update address type
  const [address1, setAddress1] = useState(''); //update address line 1
  const [address2, setAddress2] = useState(''); //update address line 2
  const [address3, setAddress3] = useState(''); //update address line 3
  const [area, setArea] = useState(''); // update area
  const [city, setCity] = useState(''); // update city
  const [state, setState] = useState(''); // update state
  const [country, setCountry] = useState(''); // update country
  const [PIN, setPIN] = useState(''); // update pin
  const [updateMailingPref, setUpdateMailingPref] = useState(false); // update mailing preference

  // payment section states
  const [paymentListOpn, setPaymentListOpn] = useState(false); // payment list open
  const [paymentIndexLst, setPaymentIndexLst] = useState([]); // payment index list

  // other payment section section states
  const [otherPaymentListOpn, setOtherPaymentListOpn] = useState(false); // other payment list open
  const [otherPaymentList, setOtherPaymentList] = useState([]); // other payment list
  const [otherPaymentIndexLst, setOtherPaymentIndexLst] = useState([]); // other payment index list

  const [isLoading, setIsLoading] = useState(false); // LOADER

  useEffect(() => {
    getDonorDetails();
    const unSubscribe = navigation.addListener('focus', () => {
      BackHandler.addEventListener('hardwareBackPress', () => {
        console.log('BackHandler In Donor Details is called');
        navigation.goBack();
        return true;
      });
    });
    return unSubscribe;
  }, []);

  // get donor details
  const getDonorDetails = async () => {
    const payload = {
      accessKey,
      deviceId: store?.deviceId,
      loginId: store?.userData?.userId,
      sessionId: store?.userData?.session_id,
      donorId: route?.params?.donorId,
    };

    console.log('GET DONOR DETAILS :', baseUrl + get_donor_details, payload);

    setIsLoading(true);
    await axios
      .post(baseUrl + get_donor_details, payload)
      .then(response => (setDonorDetails(response.data), setIsLoading(false)))
      .catch(error => {
        setIsLoading(false);
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
    setIsLoading(true);
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
            setIsLoading(false);
          },
          {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
        );
      } else {
        console.log('Location permission denied');
        setIsLoading(false);
      }
    }
  };

  // get location name
  const getLocName = async params => {
    console.log('Latitude:', params[0]);
    console.log('Longitude:', params[1]);
    await Geocoder.from(...params)
      .then(json => {
        const address = json.results[0]?.formatted_address;
        console.log(address);
        setTagAddress(address);
        setLattitude(params[0]);
        setLongitude(params[1]);
        setTagModal(true);
        setIsLoading(false);
      })
      .catch(error => {
        setIsLoading(false);
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

  // tag location
  const tagLoc = async () => {
    const payload = {
      accessKey,
      loginId: store.userData?.userId,
      sessionId: store.userData?.session_id,
      deviceId: store.deviceId,
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      location: tagAddress,
      mailingPref: tagMailingPref,
      donorId: donorDetails?.donorDetails?.[0]?.donorId,
    };
    setIsLoading(true);
    console.log(
      'TAG LOCATION :',
      baseUrl + update_daonor_address_location,
      payload,
    );
    await axios
      .post(baseUrl + update_daonor_address_location, payload)
      .then(res => {
        setIsLoading(false);
        setTagModal(false);
        showMessage({
          message: 'Success!',
          description: 'Address Tagged successfully',
          type: 'success',
          floating: true,
          icon: 'auto',
        });
      })
      .catch(err => {
        setIsLoading(false);
        showMessage({
          message: 'Error!',
          description: 'Please check your internet connection',
          type: 'danger',
          floating: true,
          icon: 'auto',
        });
      });
  };

  // get navigation addresses
  const getNavAddresses = async params => {
    const payload = {
      accessKey,
      loginId: store.userData?.userId,
      sessionId: store.userData?.session_id,
      deviceId: store.deviceId,
      donorId: donorDetails?.donorDetails?.[0]?.donorId,
    };

    setIsLoading(true);
    console.log('NAVIGATION PAYLOAD :', baseUrl + get_donor_address, payload);
    await axios
      .post(baseUrl + get_donor_address, payload)
      .then(res => {
        res.data.successCode === 1
          ? params?.length > 0
            ? (params === 'R' &&
                (setUpdateTyp('R'),
                setAddress1(res.data.contactDetails?.[0]?.resAddress1),
                setAddress2(res.data.contactDetails?.[0]?.resAddress2),
                setAddress3(res.data.contactDetails?.[0]?.resAddress3),
                setArea(res.data.contactDetails?.[0]?.resAddress3),
                setCity(res.data.contactDetails?.[0]?.resCity),
                setState(res.data.contactDetails?.[0]?.resState),
                setCountry(res.data.contactDetails?.[0]?.resCountry),
                setPIN(res.data.contactDetails?.[0]?.resPinCode),
                setUpdateAddressMdl(true)),
              params === 'O' &&
                (setUpdateTyp('O'),
                setAddress1(res.data.contactDetails?.[0]?.offAddress1),
                setAddress2(res.data.contactDetails?.[0]?.offAddress2),
                setAddress3(res.data.contactDetails?.[0]?.offAddress3),
                setArea(res.data.contactDetails?.[0]?.offAddress3),
                setCity(res.data.contactDetails?.[0]?.offCity),
                setState(res.data.contactDetails?.[0]?.offState),
                setCountry(res.data.contactDetails?.[0]?.offCountry),
                setPIN(res.data.contactDetails?.[0]?.offPinCode),
                setUpdateAddressMdl(true)))
            : (setNavigationAddress(res.data.contactDetails[0]),
              setNavigationMdl(true))
          : showMessage({
              message: 'Empty!',
              description: 'No tagged address found',
              type: 'info',
              floating: true,
              icon: 'auto',
            });
        setIsLoading(false);
      })
      .catch(err => {
        setIsLoading(false);
        showMessage({
          message: 'Error!',
          description: 'Please check your internet connection',
          type: 'danger',
          floating: true,
          icon: 'auto',
        });
      });
  };

  // open navigation
  const openNav = async params => {
    console.log(
      '',
      '\n======== OPEN NAV ========',
      '\nlongitude:',
      params.longitude,
      '\nlatitude:',
      params.latitude,
      '\nlocation:',
      params.location,
      '\n================================',
    );

    const scheme = Platform.select({ios: 'maps:0,0?q=', android: 'geo:0,0?q='});
    const latLng = `${params.latitude},${params.longitude}`;
    const label = params.location;
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
    });

    Linking.openURL(url);
    setNavigationMdl(false);
  };

  // update address
  const updateAddress = async () => {
    const payload = {
      accessKey,
      loginId: store.userData?.userId,
      sessionId: store.userData?.session_id,
      donorId: donorDetails?.donorDetails?.[0]?.donorId,
      mailingPref: updateMailingPref ? updateTyp : '',
      regAddress1: address1,
      regAddress2: address2,
      regAddress3: address3,
      regArea: area,
      regCity: city,
      regState: state,
      regCountry: country,
      regPincode: PIN,
      offAddress1: address1,
      offAddress2: address2,
      offAddress3: address3,
      offArea: area,
      offCity: city,
      offState: state,
      offCountry: country,
      offPincode: PIN,
      addressType: updateTyp,
    };
    console.log('UPDATE ADDRESS :', baseUrl + update_donor_address, payload);
    setIsLoading(true);

    await axios
      .post(baseUrl + update_donor_address, payload)
      .then(res => {
        res.data.successCode === 1
          ? (showMessage({
              message: 'Success!',
              description: 'Address updated successfully',
              type: 'success',
              floating: true,
              icon: 'auto',
            }),
            clearUpdateStates(),
            getDonorDetails())
          : (showMessage({
              message: 'Opps!',
              description: 'Something went wrong',
              type: 'danger',
              floating: true,
              icon: 'auto',
            }),
            clearUpdateStates());
        setIsLoading(false);
      })
      .catch(err => {
        setIsLoading(false);
        showMessage({
          message: 'Error!',
          description: 'Please check your internet connection',
          type: 'danger',
          floating: true,
          icon: 'auto',
        }),
          clearUpdateStates();
      });
  };

  // clear update address states
  const clearUpdateStates = () => {
    setUpdateAddressMdl(false);
    setUpdateMailingPref(false);
    setAddress1('');
    setAddress2('');
    setAddress3('');
    setArea('');
    setCity('');
    setState('');
    setCountry('');
    setPIN('');
  };

  // search
  const createReceipt = async () => {
    const payload = {
      accessKey,
      deviceId: store?.deviceId,
      loginId: store?.userData?.userId,
      sessionId: store?.userData?.session_id,
      userRole: store?.userData?.userRole,
      searchField: 'donorId',
      searchValue: donorDetails?.donorDetails?.[0]?.donorId,
    };

    console.log('SEARCH DONOR DATA:', baseUrl + search_dr_data, payload);

    await axios
      .post(baseUrl + search_dr_data, payload)
      .then(res => {
        res.data.successCode === 1
          ? (store.setNewDonor(res?.data?.data?.[0]),
            navigation.navigate('DonationReceiept'))
          : showMessage({
              message: 'Opps!',
              description: 'Something went wrong while fetching donor data',
              type: 'warning',
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
        title="DONOR DETAILS"
        onPressLeft={() => navigation.navigate('Donor')}
      />

      {/* SCROLLABLE CARD CONTAINER */}

      <ScrollView
        style={{flex: 1}}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{alignItems: 'center'}}>
        {/* BASIC DETAILS CARD  */}

        <View style={styles.contentContainer}>
          <View // donor name and button container
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <View // donor salutation & name
              style={{flex: 4}}>
              <Text // name
                style={styles.primaryTxt}>
                {donorDetails?.donorDetails?.[0]?.salutation}{' '}
                {donorDetails?.donorDetails?.[0].name}
              </Text>
              <Text // donor id
                style={[
                  styles.primaryTxt,
                  {
                    fontFamily: FONTS.josefinSansRegular,
                    marginTop: SIZES.paddingMedium,
                  },
                ]}>
                {donorDetails?.donorDetails?.[0]?.donorId}
              </Text>
            </View>

            {/* <View // button container
              style={{flex: 1, alignItems: 'flex-end'}}>
              <TouchableOpacity // payment link button
                style={{padding: SIZES.paddingSmall}}>
                <MaterialCommunityIcons // payment button
                  name="credit-card"
                  size={25}
                  color={COLORS.primary}
                />
              </TouchableOpacity>
              <TouchableOpacity // upgrade button
                style={{padding: SIZES.paddingSmall}}>
                <MaterialCommunityIcons // upgrade icon
                  name="stairs-up"
                  size={25}
                  color={COLORS.warning}
                />
              </TouchableOpacity>
            </View> */}
          </View>
        </View>

        {/* DONATION DETAILS */}

        <Section name="DONATION">
          <View // payment identifiers tupple
            style={styles.detailsSection}>
            <Text style={[styles.identifierTxt, {textAlign: 'center'}]}>
              TYPE
            </Text>

            <Text style={[styles.identifierTxt, styles.valueTxtEx]}>
              CLEARED
            </Text>

            <Text style={[styles.identifierTxt, {textAlign: 'center'}]}>
              PDC
            </Text>
          </View>

          <View // separator
            style={styles.separator}
          />

          <View // patronship payment details tupple
            style={styles.detailsSection}>
            <Text // patronship value identifier
              style={[styles.valueTxt, {textAlign: 'center'}]}>
              Patronship
            </Text>

            <Text // patronship cleared value
              style={[styles.valueTxt, styles.valueTxtEx]}>
              {
                Number(
                  donorDetails?.donorDetails?.[0]?.ptrnClearedAmount?.replace(
                    /,/g,
                    '',
                  ),
                )
                  ?.toLocaleString('en-IN', {
                    maximumFractionDigits: 2,
                    style: 'currency',
                    currency: 'INR',
                  })
                  ?.split('.')[0]
              }
            </Text>

            <Text // patronship pdc value
              style={[styles.valueTxt, {textAlign: 'center'}]}>
              {
                Number(
                  donorDetails?.donorDetails?.[0]?.PtrnPdcAmount?.replace(
                    /,/g,
                    '',
                  ),
                )
                  ?.toLocaleString('en-IN', {
                    maximumFractionDigits: 2,
                    style: 'currency',
                    currency: 'INR',
                  })
                  ?.split('.')[0]
              }
            </Text>
          </View>

          <View // other payment details tupple
            style={styles.detailsSection}>
            <Text // other value identifier
              style={[styles.valueTxt, {textAlign: 'center'}]}>
              Other
            </Text>

            <Text // other cleared value
              style={[styles.valueTxt, styles.valueTxtEx]}>
              {
                Number(
                  donorDetails?.donorDetails?.[0]?.OtherClearedAmount?.replace(
                    /,/g,
                    '',
                  ),
                )
                  ?.toLocaleString('en-IN', {
                    maximumFractionDigits: 2,
                    style: 'currency',
                    currency: 'INR',
                  })
                  ?.split('.')[0]
              }
            </Text>

            <Text // other pdc value
              style={[styles.valueTxt, {textAlign: 'center'}]}>
              {
                Number(
                  donorDetails?.donorDetails?.[0]?.OtherPdcAmount?.replace(
                    /,/g,
                    '',
                  ),
                )
                  ?.toLocaleString('en-IN', {
                    maximumFractionDigits: 2,
                    style: 'currency',
                    currency: 'INR',
                  })
                  ?.split('.')[0]
              }
            </Text>
          </View>

          <View // separator
            style={styles.separator}
          />

          <View // paid section
            style={styles.detailsSection}>
            <Text // total paid identifier
              style={styles.identifierTxt}>
              Total Paid:
            </Text>
            <Text // total paid value
              style={styles.valueTxt}>
              {
                Number(
                  donorDetails?.donorDetails?.[0]?.paidAmount?.replace(
                    /,/g,
                    '',
                  ),
                )
                  ?.toLocaleString('en-IN', {
                    maximumFractionDigits: 2,
                    style: 'currency',
                    currency: 'INR',
                  })
                  ?.split('.')[0]
              }
            </Text>

            <Text // last paid identifier
              style={styles.identifierTxt}>
              Last Paid:
            </Text>
            <Text // last paid value
              style={styles.valueTxt}>
              {
                Number(
                  donorDetails?.donorDetails?.[0]?.lastPaidAmount?.paidAmount?.replace(
                    /,/g,
                    '',
                  ),
                )
                  ?.toLocaleString('en-IN', {
                    maximumFractionDigits: 2,
                    style: 'currency',
                    currency: 'INR',
                  })
                  ?.split('.')[0]
              }
            </Text>
          </View>

          <View // separator
            style={styles.separator}
          />

          <View // spouce section
            style={styles.detailsSection}>
            <Text // spouce identifier
              style={styles.identifierTxt}>
              Spouce:
            </Text>
            <Text // spouce name
              style={styles.valueTxt}>
              {donorDetails?.donorDetails?.[0]?.spouseName
                ? donorDetails?.donorDetails?.[0]?.spouseName
                : 'N/A'}
            </Text>
          </View>

          <View // separator
            style={styles.separator}
          />

          <View // spouce section
            style={styles.detailsSection}>
            <Text // spouce identifier
              style={styles.identifierTxt}>
              Birth Date:
            </Text>
            <Text // spouce name
              style={styles.valueTxt}>
              {donorDetails?.donorDetails?.[0]?.dob
                ? donorDetails?.donorDetails?.[0]?.dob
                : 'N/A'}
            </Text>
          </View>
        </Section>

        {/* CONTACT LOCATION CARD */}

        <Section
          name="CONTACT & LOCATION"
          rightItem={
            <>
              <TouchableOpacity // add location button
                onPress={getLocation}>
                <MaterialCommunityIcons // add location icon
                  name="map-marker-plus"
                  size={25}
                  color={COLORS.flatBlue}
                />
              </TouchableOpacity>
              <TouchableOpacity // edit location button
                onPress={getNavAddresses}
                style={{marginLeft: SIZES.paddingSmall}}>
                <MaterialCommunityIcons // edit location icon
                  name="navigation-variant"
                  size={25}
                  color={COLORS.flatBlue}
                />
              </TouchableOpacity>
            </>
          }>
          {/* TAG ADDRESS MODAL */}

          <CommonModal
            title="TAG ADDRESS"
            isOpen={tagModal}
            onClose={() => setTagModal(false)}>
            <Dropdown // address type dropdown
              placeholder="Address Type"
              style={[styles.dropStyle, {width: SIZES.width * 0.4}]}
              placeholderStyle={styles.dropPlaceholder}
              selectedTextStyle={styles.dropSelectedTxt}
              containerStyle={styles.dropContainer}
              fontFamily={FONTS.josefinSansRegular}
              data={addressTypes}
              value={tagMailingPref}
              labelField="label"
              valueField="value"
              renderItem={item => (
                <Text style={styles.dropText}>{item.label}</Text>
              )}
              onChange={item => setTagMailingPref(item.value)}
            />

            <TextInput // address to tag input
              editable={false}
              style={[
                styles.input,
                {height: SIZES.height * 0.1, textAlignVertical: 'top'},
              ]}
              placeholderTextColor={COLORS.gray}
              placeholder="Enter address"
              keyboardAppearance="dark"
              keyboardType="default"
              returnKeyType="done"
              value={tagAddress}
              multiline={true}
              onChangeText={text => setTagAddress(text)}
            />

            <PrimaryButton // tag location button
              disabled={!(tagAddress.length > 0 && tagMailingPref)}
              name="TAG"
              icon="tag-outline"
              style={{
                width: '100%',
                backgroundColor:
                  tagAddress.length > 0 && tagMailingPref
                    ? COLORS.saveEnabled
                    : COLORS.lightGray,
                elevation:
                  tagAddress.length > 0 && tagMailingPref
                    ? SHADOW.elevation
                    : 0,
                shadowOpacity:
                  tagAddress.length > 0 && tagMailingPref
                    ? SHADOW.shadowOffset
                    : 0,
              }}
              onPress={() => tagLoc()}
            />
          </CommonModal>

          {/* TAGGED ADDRESS / NAVIGATON MODAL */}

          <CommonModal
            title="NAVIGATE TO ADDRESS"
            isOpen={navigationMdl}
            onClose={() => setNavigationMdl(false)}>
            {
              // open navigation button for tagged office address
              navigationAddress?.offLocation?.length > 0 &&
                navigationAddress?.offLatitude?.length > 0 &&
                navigationAddress?.offLongitude?.length > 0 && (
                  <TouchableOpacity // open navigation button
                    onPress={() =>
                      openNav({
                        location: navigationAddress?.offLocation,
                        latitude: navigationAddress?.offLatitude,
                        longitude: navigationAddress?.offLongitude,
                      })
                    }
                    style={styles.opnNavBtn}>
                    <Text // tagged office address
                      style={styles.navBtnTxt}>
                      Official : {navigationAddress?.offLocation}
                    </Text>
                  </TouchableOpacity>
                )
            }

            {
              // open navigation button for tagged residential address
              navigationAddress?.regLocation?.length > 0 &&
                navigationAddress?.regLatitude?.length > 0 &&
                navigationAddress?.regLongitude?.length > 0 && (
                  <TouchableOpacity // open navigation button
                    onPress={() =>
                      openNav({
                        location: navigationAddress?.regLocation,
                        latitude: navigationAddress?.regLatitude,
                        longitude: navigationAddress?.regLongitude,
                      })
                    }
                    style={[styles.opnNavBtn, {marginBottom: 0}]}>
                    <Text // tagged residential address
                      style={styles.navBtnTxt}>
                      Residential : {navigationAddress?.regLocation}
                    </Text>
                  </TouchableOpacity>
                )
            }
          </CommonModal>

          <View // mailing address container
            style={styles.detailsSection}>
            <View // identifier and address container
              style={{flex: 6}}>
              <Text //  mailing address identifier
                style={styles.identifierTxt}>
                {`Mailing Address ${
                  donorDetails?.contactDetails?.[0]?.mailingPreference === 'R'
                    ? '(Residential)'
                    : donorDetails?.contactDetails?.[0]?.mailingPreference ===
                      'O'
                    ? '(Official)'
                    : ''
                } :`}
              </Text>
              <Text // mailing address
                style={styles.valueTxt}>
                {donorDetails?.contactDetails?.[0]?.mailingPreference === 'R'
                  ? donorDetails?.contactDetails?.[0]?.resedenceAddress
                    ? donorDetails?.contactDetails?.[0]?.resedenceAddress
                    : 'N/A'
                  : donorDetails?.contactDetails?.[0]?.mailingPreference === 'O'
                  ? donorDetails?.contactDetails?.[0]?.officeAddress
                    ? donorDetails?.contactDetails?.[0]?.officeAddress
                    : 'N/A'
                  : 'N/A'}
              </Text>
            </View>
            <View // buttons container
              style={{flex: 1, alignItems: 'flex-end'}}>
              <TouchableOpacity // edit mailing address button
                onPress={() =>
                  getNavAddresses(
                    donorDetails?.contactDetails?.[0]?.mailingPreference,
                  )
                }>
                <MaterialCommunityIcons // edit mailing address icon
                  name="pencil"
                  size={25}
                  color={COLORS.flatBlue}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View // separator
            style={styles.separator}
          />

          <View // alternate address container
            style={styles.detailsSection}>
            <View // identifier and address container
              style={{flex: 6}}>
              <Text // alternate address identifier
                style={styles.identifierTxt}>
                {`Alternate Address ${
                  donorDetails?.contactDetails?.[0]?.mailingPreference === 'R'
                    ? '(Official)'
                    : donorDetails?.contactDetails?.[0]?.mailingPreference ===
                      'O'
                    ? '(Residential)'
                    : ''
                } :`}
              </Text>
              <Text // alternate address
                style={styles.valueTxt}>
                {donorDetails?.contactDetails?.[0]?.mailingPreference === 'R'
                  ? donorDetails?.contactDetails?.[0]?.officeAddress
                    ? donorDetails?.contactDetails?.[0]?.officeAddress
                    : 'N/A'
                  : donorDetails?.contactDetails?.[0]?.mailingPreference === 'O'
                  ? donorDetails?.contactDetails?.[0]?.resedenceAddress
                    ? donorDetails?.contactDetails?.[0]?.resedenceAddress
                    : 'N/A'
                  : 'N/A'}
              </Text>
            </View>
            <View // buttons container
              style={{flex: 1, alignItems: 'flex-end'}}>
              <TouchableOpacity // edit alternate address button
                onPress={() =>
                  getNavAddresses(
                    donorDetails?.contactDetails?.[0]?.mailingPreference === 'R'
                      ? 'O'
                      : 'R',
                  )
                }>
                <MaterialCommunityIcons // edit alternate address icon
                  name="pencil"
                  size={25}
                  color={COLORS.flatBlue}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* UPDATE ADDRESS MODAL */}

          <CommonModal
            title={`UPDATE ${
              updateTyp === 'R' ? 'RESIDENTIAL' : 'OFFICE'
            } ADDRESS`}
            // {`UPDATE  ADDRESS`}
            isOpen={updateAddressMdl}
            onClose={() => clearUpdateStates()}>
            <ScrollView style={{height: SIZES.height * 0.7}}>
              <TextInput // address line 1 input
                style={styles.input}
                placeholderTextColor={COLORS.gray}
                placeholder="Address Line 1"
                keyboardAppearance="dark"
                keyboardType="default"
                returnKeyType="done"
                value={address1}
                onChangeText={text => setAddress1(text)}
              />
              <TextInput // address line 2 input
                style={styles.input}
                placeholderTextColor={COLORS.gray}
                placeholder="Address Line 2"
                keyboardAppearance="dark"
                keyboardType="default"
                returnKeyType="done"
                value={address2}
                onChangeText={text => setAddress2(text)}
              />

              <TextInput // address line 3 input
                style={styles.input}
                placeholderTextColor={COLORS.gray}
                placeholder="Address Line 3"
                keyboardAppearance="dark"
                keyboardType="default"
                returnKeyType="done"
                value={address3}
                onChangeText={text => setAddress3(text)}
              />

              <TextInput // area input
                style={styles.input}
                placeholderTextColor={COLORS.gray}
                placeholder="Area"
                keyboardAppearance="dark"
                keyboardType="default"
                returnKeyType="done"
                value={area}
                onChangeText={text => setArea(text)}
              />

              <TextInput // city input
                style={styles.input}
                placeholderTextColor={COLORS.gray}
                placeholder="City"
                keyboardAppearance="dark"
                keyboardType="default"
                returnKeyType="done"
                value={city}
                onChangeText={text => setCity(text)}
              />

              <TextInput // state input
                style={styles.input}
                placeholderTextColor={COLORS.gray}
                placeholder="State"
                keyboardAppearance="dark"
                keyboardType="default"
                returnKeyType="done"
                value={state}
                onChangeText={text => setState(text)}
              />

              <TextInput // country input
                style={styles.input}
                placeholderTextColor={COLORS.gray}
                placeholder="Country"
                keyboardAppearance="dark"
                keyboardType="default"
                returnKeyType="done"
                value={country}
                onChangeText={text => setCountry(text)}
              />

              <TextInput // pin input
                style={styles.input}
                placeholderTextColor={COLORS.gray}
                placeholder="PIN"
                keyboardAppearance="dark"
                keyboardType="number-pad"
                returnKeyType="done"
                value={PIN}
                maxLength={7}
                onChangeText={text => setPIN(text)}
              />

              <TouchableOpacity // included patronship payment button
                activeOpacity={1}
                onPress={() => setUpdateMailingPref(!updateMailingPref)}
                style={{
                  flexDirection: 'row',
                  marginBottom: SIZES.paddingMedium,
                }}>
                <Checkbox // included patronship payment checkbox
                  status={updateMailingPref ? 'checked' : 'unchecked'}
                />
                <Text // included patronship payment text
                  style={styles.dropText}>
                  Preffer as mailing address
                </Text>
              </TouchableOpacity>

              <PrimaryButton // tag location button
                disabled={
                  !(
                    address1 ||
                    address2 ||
                    address3 ||
                    area ||
                    city ||
                    state ||
                    country ||
                    PIN
                  )
                }
                name="UPDATE"
                icon="content-save-outline"
                style={{
                  width: '100%',
                  backgroundColor:
                    address1 ||
                    address2 ||
                    address3 ||
                    area ||
                    city ||
                    state ||
                    country ||
                    PIN
                      ? COLORS.saveEnabled
                      : COLORS.lightGray,
                  elevation:
                    address1 ||
                    address2 ||
                    address3 ||
                    area ||
                    city ||
                    state ||
                    country ||
                    PIN
                      ? SHADOW.elevation
                      : 0,
                  shadowOpacity:
                    address1 ||
                    address2 ||
                    address3 ||
                    area ||
                    city ||
                    state ||
                    country ||
                    PIN
                      ? SHADOW.shadowOpacity
                      : 0,
                }}
                onPress={() => updateAddress()}
              />
            </ScrollView>
          </CommonModal>

          <View // separator
            style={styles.separator}
          />

          <View // phone number container
            style={styles.detailsSection}>
            <Text //  phone number identifier
              style={styles.identifierTxt}>
              Mobile:
            </Text>

            <View // mobile number container
              style={{flex: 2.5}}>
              {donorDetails?.contactDetails?.[0]?.mobileNos ? ( // if mobile number exists
                donorDetails?.contactDetails?.[0]?.mobileNos.split(':').length >
                1 ? ( // in case of multiple mobile numbers
                  donorDetails?.contactDetails?.[0]?.mobileNos
                    .split(':')
                    .map((mobileNo, index) => (
                      <TouchableOpacity // phone number action button
                        key={index}
                        onPress={() => Linking.openURL(`tel:${mobileNo}`)}>
                        <Text // phone number
                          style={styles.clkValueTxt}>
                          {mobileNo}
                        </Text>
                      </TouchableOpacity>
                    )) // in case of single mobile number
                ) : (
                  <TouchableOpacity // phone number action button
                    onPress={() =>
                      Linking.openURL(
                        `tel:${donorDetails?.contactDetails?.[0]?.mobileNos}`,
                      )
                    }>
                    <Text // phone number
                      style={styles.clkValueTxt}>
                      {donorDetails?.contactDetails?.[0]?.mobileNos}
                    </Text>
                  </TouchableOpacity>
                )
              ) : (
                // if mobile number does not exist
                <Text style={styles.valueTxt}>N/A</Text>
              )}
            </View>
          </View>

          <View // separator
            style={styles.separator}
          />

          <View // email container
            style={styles.detailsSection}>
            <Text //  email identifier
              style={styles.identifierTxt}>
              Email:
            </Text>

            <View // email container
              style={{flex: 2.5}}>
              {donorDetails?.contactDetails?.[0]?.emailIds ? ( // if email is present
                donorDetails?.contactDetails?.[0]?.emailIds.split(':').length >
                1 ? ( // in case of multiple email ids
                  donorDetails?.contactDetails?.[0]?.emailIds
                    .split(':')
                    .map((email, index) => (
                      <TouchableOpacity // email id action button
                        key={index}
                        onPress={() => Linking.openURL(`mailto:${email}`)}>
                        <Text // email ids
                          style={styles.clkValueTxt}>
                          {email}
                        </Text>
                      </TouchableOpacity>
                    ))
                ) : (
                  // in case of single email id
                  <TouchableOpacity // email id action button
                    onPress={() =>
                      Linking.openURL(
                        `mailto:${donorDetails?.contactDetails?.[0]?.emailIds}`,
                      )
                    }>
                    <Text // email id
                      style={styles.clkValueTxt}>
                      {donorDetails?.contactDetails?.[0]?.emailIds}
                    </Text>
                  </TouchableOpacity>
                )
              ) : (
                // if email is not present
                <Text style={styles.valueTxt}>N/A</Text>
              )}
            </View>
          </View>
        </Section>

        {/* PATRONSSHIP PAYMENT LIST CARD */}

        <CollapsableSection
          name="PATRONSHIP PAYMENT"
          setOpen={setPaymentListOpn}
          open={paymentListOpn}
          rightItem={
            <Text // total amount
              style={styles.identifierTxt}>
              {donorDetails?.patronPaymentTotalAmt?.[0]}
            </Text>
          }>
          {donorDetails?.patronPaymentDetails?.map((payment, index) => (
            <Pressable // payment container
              key={index}
              onPress={() => {
                setPaymentIndexLst(
                  paymentIndexLst?.includes(index)
                    ? paymentIndexLst?.filter(item => item !== index)
                    : paymentIndexLst.concat(index),
                );
              }}
              style={{width: '100%'}}>
              <View // payment section
                style={styles.detailsSection}>
                <Text style={[styles.clkValueTxt, {flex: 0.9}]}>
                  {payment?.drDt}
                </Text>
                <Text style={styles.clkValueTxt}>{payment?.sevaCode}</Text>
                <Text style={[styles.clkValueTxt, {flex: 0.2}]}>
                  {payment?.paymentStatus}
                </Text>
                <Text
                  style={[styles.clkValueTxt, {flex: 0.7, textAlign: 'right'}]}>
                  {payment?.amount}
                </Text>
              </View>

              {paymentIndexLst?.includes(index) && (
                <View // each payment details section
                  style={styles.expandableSubSec}>
                  <View // dr number & payment mode section
                    style={{flexDirection: 'row'}}>
                    <View // dr number section
                      style={styles.valCont1}>
                      <Text // dr number identifier
                        style={[styles.identifierTxt, styles.identifierTxtEx]}>
                        DR Number:
                      </Text>
                      <Text // dr number value
                        style={styles.valueTxt}>
                        {payment?.drNo}
                      </Text>
                    </View>
                    <View // payment mode section
                      style={styles.valCont2}>
                      <Text // payment mode identifier
                        style={[styles.identifierTxt, styles.identifierTxtEx]}>
                        Type:
                      </Text>
                      <Text // payment mode value
                        style={styles.valueTxt}>
                        {payment?.paymentMode}
                      </Text>
                    </View>
                  </View>

                  <View // instrument number and date section
                    style={{flexDirection: 'row'}}>
                    <View // instrument number section
                      style={styles.valCont1}>
                      <Text // instrument number identifier
                        style={[styles.identifierTxt, styles.identifierTxtEx]}>
                        Ins No:
                      </Text>
                      <Text // instrument number value
                        style={styles.valueTxt}>
                        {payment?.insNo}
                      </Text>
                    </View>

                    <View // instrument date section
                      style={styles.valCont2}>
                      <Text // instrument date identifier
                        style={[styles.identifierTxt, styles.identifierTxtEx]}>
                        On:
                      </Text>
                      <Text // instrument date value
                        style={styles.valueTxt}>
                        {payment?.insDate}
                      </Text>
                    </View>
                  </View>

                  <View // preacher & payment status section
                    style={{flexDirection: 'row'}}>
                    <View // preacher section
                      style={styles.valCont1}>
                      <Text // preacher identifier
                        style={[styles.identifierTxt, styles.identifierTxtEx]}>
                        Preacher:
                      </Text>
                      <Text // preacher value
                        style={styles.valueTxt}>
                        {payment?.preacher}
                      </Text>
                    </View>
                    <View // payment status section
                      style={styles.valCont2}>
                      <Text // payment status identifier
                        style={[styles.identifierTxt, styles.identifierTxtEx]}>
                        Status:
                      </Text>
                      <Text // payment status value
                        style={styles.valueTxt}>
                        {payment?.paymentStatus}
                      </Text>
                    </View>
                  </View>
                  <View // seva section
                    style={{flexDirection: 'row'}}>
                    <Text // seva identifier
                      style={[styles.identifierTxt, styles.identifierTxtEx]}>
                      Seva Name:
                    </Text>
                    <Text // seva value
                      style={styles.valueTxt}>
                      {payment?.sevaName
                        .split(' ')
                        .map(
                          word =>
                            word.charAt(0).toUpperCase() +
                            word.slice(1).toLowerCase(),
                        )
                        .join(' ')}
                    </Text>
                  </View>
                </View>
              )}

              {index !== donorDetails?.patronPaymentDetails?.length - 1 &&
                !paymentIndexLst?.includes(index) && (
                  <View // separator
                    style={styles.separator}
                  />
                )}
            </Pressable>
          ))}
        </CollapsableSection>

        {/* OTHER PAYMENT LIST CARD */}

        <CollapsableSection
          name="OTHER PAYMENT"
          setOpen={setOtherPaymentListOpn}
          open={otherPaymentListOpn}>
          {otherPaymentList?.map((payment, index) => (
            <Pressable // payment container
              key={index}
              onPress={() => {
                setOtherPaymentIndexLst(
                  otherPaymentIndexLst?.includes(index)
                    ? otherPaymentIndexLst?.filter(item => item !== index)
                    : otherPaymentIndexLst.concat(index),
                );
              }}
              style={{width: '100%'}}>
              <View // payment section
                style={styles.detailsSection}>
                <Text style={[styles.clkValueTxt, {flex: 0.9}]}>
                  {payment?.drDt}
                </Text>
                <Text style={styles.clkValueTxt}>{payment?.sevaCode}</Text>
                <Text style={[styles.clkValueTxt, {flex: 0.2}]}>
                  {payment?.paymentStatus}
                </Text>
                <Text
                  style={[styles.clkValueTxt, {flex: 0.7, textAlign: 'right'}]}>
                  {payment?.amount}
                </Text>
              </View>

              {otherPaymentIndexLst?.includes(index) && (
                <View // each payment details section
                  style={styles.expandableSubSec}>
                  <View // dr number & payment mode section
                    style={{flexDirection: 'row'}}>
                    <View // dr number section
                      style={styles.valCont1}>
                      <Text // dr number identifier
                        style={[styles.identifierTxt, styles.identifierTxtEx]}>
                        DR Number:
                      </Text>
                      <Text // dr number value
                        style={styles.valueTxt}>
                        {payment?.drNo}
                      </Text>
                    </View>
                    <View // payment mode section
                      style={styles.valCont2}>
                      <Text // payment mode identifier
                        style={[styles.identifierTxt, styles.identifierTxtEx]}>
                        Type:
                      </Text>
                      <Text // payment mode value
                        style={styles.valueTxt}>
                        {payment?.paymentMode}
                      </Text>
                    </View>
                  </View>

                  <View // instrument number and date section
                    style={{flexDirection: 'row'}}>
                    <View // instrument number section
                      style={styles.valCont1}>
                      <Text // instrument number identifier
                        style={[styles.identifierTxt, styles.identifierTxtEx]}>
                        Ins No:
                      </Text>
                      <Text // instrument number value
                        style={styles.valueTxt}>
                        {payment?.insNo}
                      </Text>
                    </View>

                    <View // instrument date section
                      style={styles.valCont2}>
                      <Text // instrument date identifier
                        style={[styles.identifierTxt, styles.identifierTxtEx]}>
                        On:
                      </Text>
                      <Text // instrument date value
                        style={styles.valueTxt}>
                        {payment?.insDate}
                      </Text>
                    </View>
                  </View>

                  <View // preacher & payment status section
                    style={{flexDirection: 'row'}}>
                    <View // preacher section
                      style={styles.valCont1}>
                      <Text // preacher identifier
                        style={[styles.identifierTxt, styles.identifierTxtEx]}>
                        Preacher:
                      </Text>
                      <Text // preacher value
                        style={styles.valueTxt}>
                        {payment?.preacher}
                      </Text>
                    </View>
                    <View // payment status section
                      style={styles.valCont2}>
                      <Text // payment status identifier
                        style={[styles.identifierTxt, styles.identifierTxtEx]}>
                        Status:
                      </Text>
                      <Text // payment status value
                        style={styles.valueTxt}>
                        {payment?.paymentStatus}
                      </Text>
                    </View>
                  </View>
                  <View // seva section
                    style={{flexDirection: 'row'}}>
                    <Text // seva identifier
                      style={[styles.identifierTxt, styles.identifierTxtEx]}>
                      Seva Name:
                    </Text>
                    <Text // seva value
                      style={styles.valueTxt}>
                      {payment?.sevaName
                        .split(' ')
                        .map(
                          word =>
                            word.charAt(0).toUpperCase() +
                            word.slice(1).toLowerCase(),
                        )
                        .join(' ')}
                    </Text>
                  </View>
                </View>
              )}

              {index !== otherPaymentList?.length - 1 &&
                !otherPaymentIndexLst?.includes(index) && (
                  <View // separator
                    style={styles.separator}
                  />
                )}
            </Pressable>
          ))}
        </CollapsableSection>
      </ScrollView>

      {/* CREATE RECEIPT BUTTON */}

      <PrimaryButton
        name="CREATE RECEIPT"
        onPress={createReceipt}
        style={{
          width: SIZES.width,
          borderRadius: 0,
          backgroundColor: COLORS.spanishBistra,
        }}
      />
      {/* // ~ SPINNER MODAL */}
      <Modal visible={isLoading} animationType={'fade'} transparent>
        <View
          style={{
            justifyContent: 'center',
            height: Dimensions.get('screen').height,
            backgroundColor: 'rgba(0,0,0,0.2)',
          }}>
          <Spinner color={COLORS.primary} size="lg" />
        </View>
      </Modal>
    </LinearGradient>
  );
};

export default DonorDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: COLORS.antiFlashWhite,
  },
  contentContainer: {
    alignItems: 'center',
    width: SIZES.width * 0.9,
    padding: SIZES.paddingSmall,
    marginBottom: SIZES.height * 0.025,
    borderRadius: SIZES.radiusMedium,
    backgroundColor: COLORS.white,
    ...SHADOW,
  },
  primaryTxt: {
    width: '100%',
    textAlign: 'center',
    fontSize: SIZES.fontMedium,
    fontFamily: FONTS.josefinSansBold,
    color: COLORS.black,
    backgroundColor: COLORS.palePink,
    borderRadius: SIZES.radiusSmall,
    alignItems: 'center',
    padding: SIZES.paddingSmall,
  },
  identifierTxt: {
    flex: 1,
    color: COLORS.black,
    fontSize: SIZES.fontSmall,
    fontFamily: FONTS.josefinSansBold,
  },
  identifierTxtEx: {flex: 0, marginRight: SIZES.paddingSmall},
  valueTxt: {
    flex: 1,
    color: COLORS.black,
    fontSize: SIZES.fontSmall,
    fontFamily: FONTS.josefinSansRegular,
  },
  valueTxtEx: {
    textAlign: 'center',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: COLORS.lightGray,
  },
  clkValueTxt: {
    flex: 1,
    color: COLORS.blue,
    fontSize: SIZES.fontSmall,
    fontFamily: FONTS.josefinSansRegular,
  },
  valCont1: {flexDirection: 'row', flex: 1, marginBottom: SIZES.paddingSmall},
  valCont2: {flexDirection: 'row', flex: 0.65},
  separator: {height: 1, width: '100%', backgroundColor: COLORS.lightGray},
  expandableSubSec: {
    padding: SIZES.paddingSmall,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: SIZES.radiusSmall,
  },
  detailsSection: {
    padding: SIZES.paddingSmall,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dropStyle: {
    height: SIZES.height * 0.065,
    borderColor: COLORS.lightGray,
    borderRadius: SIZES.radiusSmall,
    borderWidth: 1,
    marginBottom: SIZES.paddingMedium,
    backgroundColor: COLORS.antiFlashWhite,
    paddingHorizontal: SIZES.paddingSmall,
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
  opnNavBtn: {
    padding: SIZES.paddingMedium,
    borderRadius: SIZES.radiusSmall,
    backgroundColor: COLORS.flatBlue,
    borderColor: COLORS.lightGray,
    marginBottom: SIZES.paddingMedium,
  },
});
