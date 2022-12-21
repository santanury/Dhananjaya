import {
  SafeAreaView,
  StyleSheet,
  StatusBar,
  Text,
  ScrollView,
  BackHandler,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {Dropdown} from 'react-native-element-dropdown';
import axios from 'axios';
import {showMessage} from 'react-native-flash-message';
import {COLORS, SIZES, FONTS} from '../constants';
import {Store} from '../store/Store';
import {
  accessKey,
  baseUrl,
  sevaApiBase,
  get_language_list,
  get_level_list,
} from '../webApi/service';

// components
import Header from '../components/Common/Header';
import SearchBar from '../components/Search/SearchBar';
import Section from '../components/Common/Section';
import PrimaryButton from '../components/Common/PrimaryButton';

const SPAshrayaSearch = ({navigation}) => {
  const store = Store();

  const nameRef = useRef(null); // name search bar ref
  const whatsAppRef = useRef(null); // whatsApp search bar ref
  const mobileRef = useRef(null); // mobile search bar ref
  const emailRef = useRef(null); // email search bar ref
  const addressRef = useRef(null); // address bar search ref

  const [languageList, setlanguageList] = useState([]); // language list
  const [levelList, setLevelList] = useState([]); // level list

  const [nameSearchKey, setNameSearchkey] = useState(''); // name search key
  const [whatsAppSearchKey, setWhatsAppSearchKey] = useState(''); // whatsApp search key
  const [languageSearchKey, setLanguageSearchKey] = useState(''); // language search key
  const [mobileSearchKey, setMobileSearchKey] = useState(''); // mobile search key
  const [emailSearchkey, setEmailSearchKey] = useState(''); // email search key
  const [addressSearchKey, setAddressSearchKey] = useState(''); // address search key
  const [currLvlSearchkey, setCurrLvlSearchkey] = useState(''); // current level search key

  const [nameLense, setNameLanse] = useState(true);
  const [whatsAppLens, setWhatsApplens] = useState(true);
  const [mobilelens, setMobilelens] = useState(true);
  const [emailLens, setEmailLens] = useState(true);
  const [addressLens, setAddressLens] = useState(true);

  useEffect(() => {
    const unSubscribe = navigation.addListener('focus', () => {
      console.log('SP Ashraya Search Focused');
      BackHandler.addEventListener('hardwareBackPress', () => {
        console.log('BackHandler In SP Ashraya Search is called');
        navigation.goBack();
        return true;
      });
      getLanguageList();
      getLevelList();
    });
    return unSubscribe;
  }, []);

  // get language list
  const getLanguageList = async () => {
    const payload = {accessKey};

    console.log(
      'GET CURRENCY LIST :',
      sevaApiBase + get_language_list,
      payload,
    );

    await axios
      .post(sevaApiBase + get_language_list, payload)
      .then(res => {
        res?.data?.successCode === 1
          ? setlanguageList(res?.data?.data)
          : showMessage({
              message: 'Warning!',
              description: 'No language available right now',
              type: 'warning',
              floating: true,
              icon: 'auto',
            });
      })
      .catch(err => {
        console.log('Error getting currency list', err);
        showMessage({
          message: 'Error!',
          description: 'Please check your internet connection',
          type: 'danger',
          floating: true,
          icon: 'auto',
        });
      });
  };

  // get level list
  const getLevelList = async () => {
    const payload = {accessKey};

    console.log('GET LEVEL LIST :', sevaApiBase + get_level_list, payload);

    await axios
      .post(sevaApiBase + get_level_list, payload)
      .then(res => {
        res?.data?.successCode === 1
          ? setLevelList(res?.data?.data)
          : showMessage({
              message: 'Warning!',
              description: 'No seva available right now',
              type: 'warning',
              floating: true,
              icon: 'auto',
            });
      })
      .catch(err => {
        console.log('Error getting seva list :', err);
        showMessage({
          message: 'Error!',
          description: 'Please check your internet connection',
          type: 'danger',
          floating: true,
          icon: 'auto',
        });
      });
  };

  // on press name
  const nameOnPress = () => {
    nameRef.current.focus();
    setNameLanse(false);
    !whatsAppSearchKey && setWhatsApplens(true);
    !mobileSearchKey && setMobilelens(true);
    !emailSearchkey && setEmailLens(true);
    addressSearchKey && setAddressLens(true);
  };

  // on press name
  const whatsAppOnPress = () => {
    whatsAppRef.current.focus();
    setWhatsApplens(false);
    !nameSearchKey && setNameLanse(true);
    !mobileSearchKey && setMobilelens(true);
    !emailSearchkey && setEmailLens(true);
    !addressSearchKey && setAddressLens(true);
  };

  // on press mobile
  const mobilOnPress = () => {
    mobileRef.current.focus();
    setMobilelens(false);
    !nameSearchKey && setNameLanse(true);
    !whatsAppSearchKey && setWhatsApplens(true);
    !emailSearchkey && setEmailLens(true);
    !addressSearchKey && setAddressLens(true);
  };

  // on press email
  const emailOnPress = () => {
    emailRef.current.focus();
    setEmailLens(false);
    !nameSearchKey && setNameLanse(true);
    !whatsAppSearchKey && setWhatsApplens(true);
    !mobileSearchKey && setMobilelens(true);
    !addressSearchKey && setAddressLens(true);
  };

  // on press address
  const addressOnPress = () => {
    addressRef.current.focus();
    setAddressLens(false);
    !nameSearchKey && setNameLanse(true);
    !whatsAppSearchKey && setWhatsApplens(true);
    !mobileSearchKey && setMobilelens(true);
    !emailSearchkey && setEmailLens(true);
  };

  // search
  const search = () => {
    // name validation
    nameSearchKey && !/^[a-zA-Z ]*$/.test(nameSearchKey)
      ? showMessage({
          message: 'Warning!',
          description: 'Please enter valid name',
          type: 'warning',
          floating: true,
          icon: 'auto',
        })
      : // indian phone number validation
      whatsAppSearchKey && !/^[0-9]{10}$/.test(whatsAppSearchKey)
      ? showMessage({
          message: 'Warning!',
          description: 'Please enter valid WhatsApp number',
          type: 'warning',
          floating: true,
          icon: 'auto',
        })
      : // indian phone number validation
      mobileSearchKey && !/^[0-9]{10}$/.test(mobileSearchKey)
      ? showMessage({
          message: 'Warning!',
          description: 'Please enter valid mobile number',
          type: 'warning',
          floating: true,
          icon: 'auto',
        }) // email validation
      : emailSearchkey &&
        !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(emailSearchkey)
      ? showMessage({
          message: 'Warning!',
          description: 'Please enter valid email',
          type: 'warning',
          floating: true,
          icon: 'auto',
        })
      : navigation.navigate('SPAshraya', {
          nameSearchKey,
          whatsAppSearchKey,
          languageSearchKey,
          mobileSearchKey,
          emailSearchkey,
          addressSearchKey,
          currLvlSearchkey,
        });
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
          <Section>
            <SearchBar // search by name
              onPress={() => nameOnPress()}
              onFocus={() => nameOnPress()}
              lens={nameLense}
              reference={nameRef}
              style={styles.searchBar}
              placeholder="Name"
              keyboardType="default"
              value={nameSearchKey}
              onChangeText={setNameSearchkey}
              onSubmitEditing={search}
            />

            <SearchBar // search by whatsApp
              onPress={() => whatsAppOnPress()}
              onFocus={() => whatsAppOnPress()}
              lens={whatsAppLens}
              reference={whatsAppRef}
              style={styles.searchBar}
              placeholder="WhatsApp Number"
              keyboardType="number-pad"
              maxLength={10}
              value={whatsAppSearchKey}
              onChangeText={setWhatsAppSearchKey}
              onSubmitEditing={search}
            />

            <Dropdown // search by language
              placeholder="Select Language"
              style={styles.dropStyle}
              placeholderStyle={styles.dropPlaceholder}
              selectedTextStyle={styles.dropSelectedTxt}
              containerStyle={styles.dropContainer}
              fontFamily={FONTS.josefinSansRegular}
              data={[
                {label: 'Select Language', value: ''},
                ...languageList?.map(each => ({
                  label: each?.language,
                  value: each?.language,
                })),
              ]}
              value={languageSearchKey}
              labelField="label"
              valueField="value"
              renderItem={item => (
                <Text style={styles.dropText}>{item.label}</Text>
              )}
              onChange={item => setLanguageSearchKey(item.value)}
            />

            <SearchBar // search by mobile
              onPress={() => mobilOnPress()}
              onFocus={() => mobilOnPress()}
              lens={mobilelens}
              reference={mobileRef}
              style={styles.searchBar}
              placeholder="Mobile Number"
              keyboardType="number-pad"
              maxLength={10}
              value={mobileSearchKey}
              onChangeText={setMobileSearchKey}
              onSubmitEditing={search}
            />

            <SearchBar // search by email
              onPress={() => emailOnPress()}
              onFocus={() => emailOnPress()}
              lens={emailLens}
              reference={emailRef}
              style={styles.searchBar}
              placeholder="Email"
              keyboardType="email-address"
              value={emailSearchkey}
              onChangeText={setEmailSearchKey}
              onSubmitEditing={search}
            />

            <SearchBar // search by address
              onPress={() => addressOnPress()}
              onFocus={() => addressOnPress()}
              lens={addressLens}
              reference={addressRef}
              style={styles.searchBar}
              placeholder="Address"
              keyboardType="default"
              value={addressSearchKey}
              onChangeText={setAddressSearchKey}
              onSubmitEditing={search}
            />

            <Dropdown // search by level
              placeholder="Select level"
              style={styles.dropStyle}
              placeholderStyle={styles.dropPlaceholder}
              selectedTextStyle={styles.dropSelectedTxt}
              containerStyle={styles.dropContainer}
              fontFamily={FONTS.josefinSansRegular}
              data={[
                {label: 'Select Level', value: ''},
                ...levelList?.map(each => ({
                  label: each?.level,
                  value: each?.level,
                })),
              ]}
              value={currLvlSearchkey}
              labelField="label"
              valueField="value"
              renderItem={item => (
                <Text style={styles.dropText}>{item.label}</Text>
              )}
              onChange={item => setCurrLvlSearchkey(item.value)}
            />
          </Section>
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

export default SPAshrayaSearch;

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
});
