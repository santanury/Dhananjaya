import {
  View,
  Text,
  StyleSheet,
  BackHandler,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import axios from 'axios';
import LinearGradient from 'react-native-linear-gradient';
import {showMessage} from 'react-native-flash-message';
import {Store} from '../../store/Store';
import {COLORS, SIZES, SHADOW, FONTS} from '../../constants';
import {baseUrl, accessKey, search_dr_data} from '../../webApi/service';

// components
import Header from '../../components/Common/Header';
import SearchBar from '../../components/Search/SearchBar';
import PrimaryButton from '../../components/Common/PrimaryButton';
import DonorSearchCard from '../../components/Donation&Sub/DonorSearchCard';

const DonorSelection = ({navigation, route}) => {
  const store = Store();

  const searchRef = useRef(null); // search input reference

  const [searchByOptions] = useState([
    {label: 'DONOR', value: 'donorName', keyboardType: 'default'},
    {label: 'MOBILE', value: 'mobileNo', keyboardType: 'numeric'},
    {label: 'EMAIL', value: 'emailId', keyboardType: 'email-address'},
    {label: 'PATRON ID', value: 'patronId', keyboardType: 'numeric'},
  ]); // search by options array
  const [searchBy, setSearchBy] = useState({
    label: 'DONOR',
    value: 'donorName',
    keyboardType: 'default',
  }); // search by
  const [searchLens, setSearchLens] = useState(true); // search lens
  const [searchkey, setSearchkey] = useState(''); // search key
  const [searchResults, setSearchResults] = useState([]); // search results

  useEffect(() => {
    const unSubscribe = navigation.addListener('focus', () => {
      BackHandler.addEventListener('hardwareBackPress', () => {
        console.log('BackHandler In Donor Selection is called');
        store?.setRouteInfo({});
        route?.params?.from === 'PTDL'
          ? navigation.goBack()
          : navigation.navigate('CustomDrawer');
        return true;
      });
      store?.setNewDonor({});
      route?.params?.from === 'PTDL' &&
        (setSearchBy({
          label: 'PATRON ID',
          value: 'patronId',
          keyboardType: 'numeric',
        }),
        setSearchkey(store?.routeInfo?.patronId),
        search({
          field: 'patronId',
          value: store?.routeInfo?.patronId,
        }));
    });
    return unSubscribe;
  }, []);

  // search
  const search = async params => {
    const payload = {
      accessKey,
      deviceId: store?.deviceId,
      loginId: store?.userData?.userId,
      sessionId: store?.userData?.session_id,
      userRole: store?.userData?.userRole,
      searchField: params.field ? params.field : searchBy.value,
      searchValue: params.value ? params.value : searchkey,
    };

    console.log('SEARCH DONOR DATA:', baseUrl + search_dr_data, payload);

    setSearchResults([]); // reset search results
    await axios
      .post(baseUrl + search_dr_data, payload)
      .then(res => {
        res.data.successCode === 1
          ? setSearchResults(res.data.data)
          : showMessage({
              message: 'Thats all!',
              description: 'No more data found',
              type: 'info',
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
      <Header // header
        headerStyle={{zIndex: 1}}
        color={COLORS.black}
        leftButtonIcon="chevron-left"
        title="DONOR SEARCH"
        onPressLeft={() => {
          store?.setRouteInfo({});
          route?.params?.from === 'PTDL'
            ? navigation.goBack()
            : navigation.navigate('CustomDrawer');
        }}
      />

      {/* DONOR TYPE SELECTION */}

      <View style={styles.optionSec}>
        <View // donor search buton
          style={[
            styles.optionBtn,
            {backgroundColor: COLORS.primary, borderRightWidth: 2},
          ]}>
          <Text // donor search button text
            style={[styles.txt, {fontFamily: FONTS.josefinSansBold}]}>
            SEARCH DONOR
          </Text>
        </View>

        <TouchableOpacity // create new donor button
          onPress={() => navigation.navigate('CreateDonor')}
          style={[styles.optionBtn, {backgroundColor: COLORS.tertiary}]}>
          <Text // create new donor button text
            style={styles.txt}>
            NEW DONOR
          </Text>
        </TouchableOpacity>
      </View>

      {/* SEARCH BY SELECTION SECTION */}

      <View style={[styles.optionSec, {marginHorizontal: SIZES.width * 0.03}]}>
        {searchByOptions.map((item, index) => (
          <TouchableOpacity // search by button
            onPress={() => {
              setSearchBy(item),
                setSearchkey(''),
                searchRef.current.blur(),
                setSearchLens(true);
            }}
            key={index}
            style={[
              styles.optionBtn,
              {
                backgroundColor:
                  searchBy?.value === item.value
                    ? COLORS.primary
                    : COLORS.tertiary,
                borderRightWidth: index === searchByOptions?.length - 1 ? 0 : 2,
              },
            ]}>
            <Text // search by button text
              style={[styles.txt, {fontSize: SIZES.fontSmall - 3}]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* SEARCH SECTION */}

      <View style={styles.searchSec}>
        <SearchBar // search bar
          lens={searchLens}
          onPress={() => {
            setSearchLens(false), searchRef.current.focus();
          }}
          onFocus={() => {
            setSearchLens(false), searchRef.current.focus();
          }}
          placeholder={
            'Search by' +
            ' ' +
            searchBy?.label?.replace(/\w\S*/g, txt => {
              return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            })
          }
          onSubmitEditing={search}
          keyboardType={searchBy.keyboardType}
          reference={searchRef}
          style={styles.search}
          value={searchkey}
          onChangeText={setSearchkey}
        />

        <PrimaryButton // search button
          disabled={searchkey.length === 0}
          onPress={search}
          style={[
            styles.searchBtn,
            {
              backgroundColor: !(searchkey.length === 0)
                ? COLORS.primary
                : COLORS.lightGray,
              elevation: !(searchkey.length === 0) ? SHADOW.elevation : 0,
              shadowOpacity: !(searchkey.length === 0)
                ? SHADOW.shadowOpacity
                : 0,
            },
          ]}
          icon="magnify"
        />
      </View>

      {/* SEARCH RESULTS SECTION */}

      <FlatList
        data={searchResults}
        renderItem={({item, index}) => (
          <DonorSearchCard // search results card
            data={item}
            index={index}
            onPress={() => {
              store.setNewDonor(item);
              navigation.navigate('DonationReceiept');
            }}
          />
        )}
        keyExtractor={(item, index) => index}
        style={{
          marginTop: SIZES.paddingSmall,
        }}
        contentContainerStyle={styles.list}
      />
    </LinearGradient>
  );
};

export default DonorSelection;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: COLORS.white,
  },
  optionSec: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.lightGray,
    borderRadius: SIZES.radiusSmall,
    overflow: 'hidden',
    marginTop: SIZES.paddingSmall,
    marginHorizontal: SIZES.paddingSmall,
  },
  optionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    paddingVertical: SIZES.height * 0.015,
    backgroundColor: COLORS.tertiary,
    borderColor: COLORS.lightGray,
  },
  txt: {
    fontSize: SIZES.fontSmall,
    color: COLORS.white,
    fontFamily: FONTS.josefinSansRegular,
  },
  searchSec: {
    flexDirection: 'row',
    width: SIZES.width * 0.9,
    alignSelf: 'center',
    marginTop: SIZES.paddingSmall,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  search: {
    flex: 1,
    height: SIZES.height * 0.06,
  },
  searchBtn: {
    width: SIZES.width * 0.2,
    marginLeft: SIZES.paddingSmall,
    borderRadius: SIZES.radiusBig,
    height: SIZES.height * 0.06,
  },
  list: {
    paddingBottom: '10%',
    alignItems: 'center',
  },
});
