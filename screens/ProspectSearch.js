import {
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
import Animated from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import {Dropdown} from 'react-native-element-dropdown';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {showMessage} from 'react-native-flash-message';
import {COLORS, SIZES, FONTS} from '../constants';
import {Store} from '../store/Store';

// components
import Header from '../components/Common/Header';
import SearchBar from '../components/Search/SearchBar';
import CollapsableSection from '../components/Common/CollapsableSection';
import PrimaryButton from '../components/Common/PrimaryButton';

const ProspectSearch = ({navigation, route}) => {
  const store = Store();

  // reference for search input
  const prospectIdRef = useRef(null); // prospect id search bar ref
  const prospectNameRef = useRef(null); // prospect name search bar ref
  const phoneRef = useRef(null); // phone search bar ref
  const emailRef = useRef(null); // email search bar ref
  const addressRef = useRef(null); // address search bar ref
  const stateRef = useRef(null); // state search bar ref
  const cityRef = useRef(null); // city search bar ref
  const PINRef = useRef(null); // zip search bar ref

  // lens for search input states
  const [prospectIdLens, setProspectIdLens] = useState(true); // prospect id search bar lens
  const [prospectNameLens, setProspectNameLens] = useState(true); // prospect name search bar lens
  const [phoneLens, setPhoneLens] = useState(true); // phone search bar lens
  const [emailLens, setEmailLens] = useState(true); // email search bar lens
  const [addressLens, setAddressLens] = useState(true); // address search bar lens
  const [stateLens, setStateLens] = useState(true); // state search bar lens
  const [cityLens, setCityLens] = useState(true); // city search bar lens
  const [PINLens, setPINLens] = useState(true); // zip search bar lens

  // section open/close states
  const [prospectSearchOpn, setProspectSearchOpn] = useState(false); // prospect search section open/close state
  const [contactSearchOpn, setContactSearchOpn] = useState(false); // contact search open
  const [locationSearchOpn, setLocationSearchOpn] = useState(false); // location search open

  // prospect section states
  const [prospectIdSearchkey, setProspectIdSearchkey] = useState(''); // prospect id search key
  const [prospectNameSearchkey, setProspectNameSearchkey] = useState(''); // prospect name search key

  // contact section states
  const [phoneSearchkey, setPhoneSearchkey] = useState(''); // phone search key
  const [emailSearchkey, setEmailSearchkey] = useState(''); // email search key

  // location section states
  const [addressSearchkey, setAddressSearchkey] = useState(''); // address search key
  const [stateSearchkey, setStateSearchkey] = useState(''); // state search key
  const [citySearchkey, setCitySearchkey] = useState(''); // city search key
  const [PINSearchkey, setPINSearchkey] = useState(''); // zip search key

  const [prospectLvlLst] = useState([
    {label: 'Select Level', value: ''},
    {label: 'Green, 75%', value: 'Green'},
    {label: 'Yellow, 50%', value: 'Yellow'},
    {label: 'Orange, 25%', value: 'Orange'},
  ]); // prospect level list
  const [prospectLvl, setProspectLvl] = useState(''); // prospect level

  useEffect(() => {
    const unSubscribe = navigation.addListener('focus', () => {
      BackHandler.addEventListener('hardwareBackPress', () => {
        console.log('BackHandler In Prospect Search is called');
        navigation.goBack();
        return true;
      });
    });
    return unSubscribe;
  }, []);

  // search function
  const search = () => {
    // name validation
    prospectNameSearchkey && !/^[a-zA-Z ]*$/.test(prospectNameSearchkey)
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
        })
      : navigation.navigate('Prospect', {
          prospectIdSearchkey,
          prospectNameSearchkey,
          phoneSearchkey,
          emailSearchkey,
          addressSearchkey,
          stateSearchkey,
          citySearchkey,
          PINSearchkey,
          prospectLvl,
        });
  };

  const prospectIdPress = () => {
    prospectIdRef.current.focus(),
      setProspectIdLens(false),
      !prospectNameSearchkey && setProspectNameLens(true);
    !phoneSearchkey && setPhoneLens(true);
    !emailSearchkey && setEmailLens(true);
    !addressSearchkey && setAddressLens(true);
    !stateSearchkey && setStateLens(true);
    !citySearchkey && setCityLens(true);
    !PINSearchkey && setPINLens(true);
  };
  const prospectNamePress = () => {
    prospectNameRef.current.focus(),
      setProspectNameLens(false),
      !prospectIdSearchkey && setProspectIdLens(true);
    !phoneSearchkey && setPhoneLens(true);
    !emailSearchkey && setEmailLens(true);
    !addressSearchkey && setAddressLens(true);
    !stateSearchkey && setStateLens(true);
    !citySearchkey && setCityLens(true);
    !PINSearchkey && setPINLens(true);
  };
  const phonePress = () => {
    phoneRef.current.focus(),
      setPhoneLens(false),
      !prospectIdSearchkey && setProspectIdLens(true);
    !prospectNameSearchkey && setProspectNameLens(true);
    !emailSearchkey && setEmailLens(true);
    !addressSearchkey && setAddressLens(true);
    !stateSearchkey && setStateLens(true);
    !citySearchkey && setCityLens(true);
    !PINSearchkey && setPINLens(true);
  };
  const emailPress = () => {
    emailRef.current.focus(),
      setEmailLens(false),
      !prospectIdSearchkey && setProspectIdLens(true);
    !prospectNameSearchkey && setProspectNameLens(true);
    !phoneSearchkey && setPhoneLens(true);
    !addressSearchkey && setAddressLens(true);
    !stateSearchkey && setStateLens(true);
    !citySearchkey && setCityLens(true);
    !PINSearchkey && setPINLens(true);
  };
  const addressPress = () => {
    addressRef.current.focus(),
      setAddressLens(false),
      !prospectIdSearchkey && setProspectIdLens(true);
    !prospectNameSearchkey && setProspectNameLens(true);
    !phoneSearchkey && setPhoneLens(true);
    !emailSearchkey && setEmailLens(true);
    !stateSearchkey && setStateLens(true);
    !citySearchkey && setCityLens(true);
    !PINSearchkey && setPINLens(true);
  };
  const statePress = () => {
    stateRef.current.focus(),
      setStateLens(false),
      !prospectIdSearchkey && setProspectIdLens(true);
    !prospectNameSearchkey && setProspectNameLens(true);
    !phoneSearchkey && setPhoneLens(true);
    !emailSearchkey && setEmailLens(true);
    !addressSearchkey && setAddressLens(true);
    !citySearchkey && setCityLens(true);
    !PINSearchkey && setPINLens(true);
  };
  const cityPress = () => {
    cityRef.current.focus(),
      setCityLens(false),
      !prospectIdSearchkey && setProspectIdLens(true);
    !prospectNameSearchkey && setProspectNameLens(true);
    !phoneSearchkey && setPhoneLens(true);
    !emailSearchkey && setEmailLens(true);
    !addressSearchkey && setAddressLens(true);
    !stateSearchkey && setStateLens(true);
    !PINSearchkey && setPINLens(true);
  };
  const PINPress = () => {
    PINRef.current.focus(),
      setPINLens(false),
      !prospectIdSearchkey && setProspectIdLens(true);
    !prospectNameSearchkey && setProspectNameLens(true);
    !phoneSearchkey && setPhoneLens(true);
    !emailSearchkey && setEmailLens(true);
    !addressSearchkey && setAddressLens(true);
    !stateSearchkey && setStateLens(true);
    !citySearchkey && setCityLens(true);
  };

  return (
    <Animated.View // animated container
      style={styles.container}>
      <LinearGradient // gradient container
        colors={[COLORS.tertiary, COLORS.quaternary, COLORS.mistyMoss]}
        style={styles.container}>
        <StatusBar // status bar
          backgroundColor={COLORS.tertiary}
          barStyle="default"
        />

        {/* HEADER */}

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
          {/* PROSPECT SECTION */}

          <CollapsableSection
            name="PROSPECT"
            leftItem={
              <MaterialCommunityIcons // left icon
                name="face-man-profile"
                size={25}
                color={COLORS.darkGray}
                style={{marginRight: SIZES.paddingSmall}}
              />
            }
            setOpen={setProspectSearchOpn}
            open={prospectSearchOpn}>
            <>
              <SearchBar // search by prospect id
                onPress={() => prospectIdPress()}
                onFocus={() => prospectIdPress()}
                lens={prospectIdLens}
                reference={prospectIdRef}
                style={styles.searchBar}
                placeholder="Prospect Id"
                keyboardType="numeric"
                value={prospectIdSearchkey}
                onChangeText={setProspectIdSearchkey}
                onSubmitEditing={search}
              />
              <SearchBar // search by prospect name
                onPress={() => prospectNamePress()}
                onFocus={() => prospectNamePress()}
                reference={prospectNameRef}
                lens={prospectNameLens}
                style={styles.searchBar}
                placeholder="Prospect Name"
                keyboardType="default"
                value={prospectNameSearchkey}
                onChangeText={setProspectNameSearchkey}
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
                onChangeText={setAddressSearchkey}
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
                onChangeText={setStateSearchkey}
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
                onChangeText={setCitySearchkey}
                onSubmitEditing={search}
              />
              <SearchBar // search by PIN
                onPress={() => PINPress()}
                onFocus={() => PINPress()}
                reference={PINRef}
                lens={PINLens}
                style={styles.searchBar}
                placeholder="PIN"
                keyboardType="numeric"
                value={PINSearchkey}
                onChangeText={setPINSearchkey}
                onSubmitEditing={search}
              />
            </>
          </CollapsableSection>

          <View // prospect level selector container
            style={{
              width: SIZES.width * 0.8,
              padding: SIZES.paddingSmall,
              backgroundColor: COLORS.white,
              borderRadius: SIZES.radiusMedium,
            }}>
            <Dropdown // prospect level selector
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
              data={prospectLvlLst}
              value={prospectLvl}
              labelField="label"
              valueField="value"
              renderItem={item => (
                <Text style={styles.dropText}>{item.label}</Text>
              )}
              onChange={item => setProspectLvl(item.value)}
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
    </Animated.View>
  );
};

export default ProspectSearch;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: COLORS.lightGray,
  },
  searchBar: {flex: 1, marginTop: SIZES.paddingSmall},
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
});
