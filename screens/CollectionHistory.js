import {
  StyleSheet,
  Text,
  View,
  BackHandler,
  StatusBar,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Animated from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import moment from 'moment';
import {showMessage} from 'react-native-flash-message';
import {Dropdown} from 'react-native-element-dropdown';
import {COLORS, FONTS, SIZES, icons} from '../constants';
import {Store} from '../store/Store';
// import {DonorSkeleton as SkeletonLoader} from '.';
import axios from 'axios';
import {
  accessKey,
  baseUrl,
  get_seva_category_list,
  get_seva_sub_category_list,
  get_seva_details,
  get_donation_details,
} from '../webApi/service';

// components
import Header from '../components/Common/Header';
import Card from '../components/CollectionHistory/Card';
import PrimaryButton from '../components/Common/PrimaryButton';

const CollectionHistory = ({navigation, route}) => {
  const store = Store();

  const [year, setYear] = useState(''); //  year state
  const [donationCats, setDonationCats] = useState([]); // donation category options array state
  const [donationSubCats, setDonationSubCats] = useState([]); // donation sub-category options array state
  const [sevaList, setSevaList] = useState([]); // seva options array state
  const [donationCat, setDonationCat] = useState(''); // selected donation category state
  const [donationSubCat, setDonationSubCat] = useState(''); // selected donation sub category state
  const [sevaCode, setSevaCode] = useState(''); // selected seva state
  const [collectionList, setCollectionList] = useState([]); // collection history list

  useEffect(() => {
    const unSubscribe = navigation.addListener('focus', () => {
      BackHandler.addEventListener('hardwareBackPress', () => {
        console.log('BackHandler In CollectionHistory is called');
        navigation.goBack();
        return true;
      });
      getDonationCategories();
    });
    return unSubscribe;
  }, []);

  // get donation category list
  const getDonationCategories = async () => {
    console.log(
      '',
      '\n======== GET SEVA CATEGORIES ========',
      '\naccessKey:',
      accessKey,
      '\ndeviceId:',
      store?.deviceId,
      '\nloginId:',
      store?.userData?.userId,
      '\nsessionId:',
      store?.userData?.session_id,
      '\n================================',
    );

    await axios
      .post(baseUrl + get_seva_category_list, {
        accessKey: accessKey,
        deviceId: store?.deviceId,
        loginId: store?.userData?.userId,
        sessionId: store?.userData?.session_id,
      })
      .then(res => {
        res.data.successCode === 1
          ? setDonationCats(res.data.data)
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

  // get donation sub-categories list
  const getDonationSubCategories = async id => {
    console.log(
      '',
      '\n======== GET SEVA SUB CATEGORIES ========',
      '\naccessKey:',
      accessKey,
      '\ndeviceId:',
      store?.deviceId,
      '\nloginId:',
      store?.userData?.userId,
      '\nsessionId:',
      store?.userData?.session_id,
      '\nsevaCategoryId:',
      id,
      '\n================================',
    );

    await axios
      .post(baseUrl + get_seva_sub_category_list, {
        accessKey: accessKey,
        deviceId: store?.deviceId,
        loginId: store?.userData?.userId,
        sessionId: store?.userData?.session_id,
        categoryId: id,
      })
      .then(res => {
        res.data.successCode === 1
          ? setDonationSubCats(res.data?.data)
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
    console.log(
      '',
      '\n======== GET SEVA DETAILS ========',
      '\naccessKey:',
      accessKey,
      '\ndeviceId:',
      store?.deviceId,
      '\nloginId:',
      store?.userData?.userId,
      '\nsessionId:',
      store?.userData?.session_id,
      '\ncategoryId:',
      donationCat,
      '\nsubCategoryId:',
      ids.value,
      '\n================================',
    );

    await axios
      .post(baseUrl + get_seva_details, {
        accessKey: accessKey,
        deviceId: store?.deviceId,
        loginId: store?.userData?.userId,
        sessionId: store?.userData?.session_id,
        categoryId: donationCat,
        subCategoryId: ids.value,
      })
      .then(res => {
        res.data.successCode === 1
          ? setSevaList(res.data.data)
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

  // get collection history
  const getCollectionHistory = async () => {
    setCollectionList([]);
    const payload = {
      accessKey,
      loginId: store?.userData?.userId,
      deviceId: store.deviceId,
      sessionId: store?.userData?.session_id,
      preacherCode: store?.userData?.id,
      purposeId: donationSubCat,
      finYear: year,
      sevaCode,
    };

    console.log(baseUrl + get_donation_details, payload);

    !year
      ? showMessage({
          message: 'Warning!',
          description: 'Please select a ',
          type: 'warning',
          floating: true,
          icon: 'auto',
        })
      : !donationCat
      ? showMessage({
          message: 'Warning!',
          description: 'Please select a category',
          type: 'warning',
          floating: true,
          icon: 'auto',
        })
      : !donationSubCat
      ? showMessage({
          message: 'Warning!',
          description: 'Please select a sub-category',
          type: 'warning',
          floating: true,
          icon: 'auto',
        })
      : await axios
          .post(baseUrl + get_donation_details, payload)
          .then(res => {
            console.log(res?.data);
            res.data.successCode === 1
              ? setCollectionList(res.data.data)
              : showMessage({
                  message: 'Thats all!',
                  description: 'No data found',
                  type: 'warning',
                  floating: true,
                  icon: 'auto',
                });
          })
          .catch(err => {
            console.log('Error in fetching collection history:', err);
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
          headerStyle={{zIndex: 1}}
          color={COLORS.black}
          leftButtonIcon="menu"
          title="COLLECTION HISTORY"
          onPressLeft={() => navigation.openDrawer()}
        />

        <View style={{flexDirection: 'row'}}>
          <Dropdown // year dropdown
            placeholder="Select Year"
            style={[styles.dropStyle, {flex: 1, marginRight: 0}]}
            placeholderStyle={styles.dropPlaceholder}
            selectedTextStyle={styles.dropSelectedTxt}
            containerStyle={styles.dropContainer}
            fontFamily={FONTS.josefinSansRegular}
            data={[...Array(5).keys()].map(year => ({
              value: (
                Number(moment(new Date()).format('YYYY')) - year
              ).toString(),
              label: (
                Number(moment(new Date()).format('YYYY')) - year
              ).toString(),
            }))}
            value={year}
            labelField="label"
            valueField="value"
            renderItem={item => (
              <Text style={styles.dropText}>{item.label}</Text>
            )}
            onChange={item => setYear(item.value)}
          />

          <Dropdown // category dropdown
            placeholder="Select Category"
            style={[styles.dropStyle, {flex: 2}]}
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
              <Text style={styles.dropText}>{item.label}</Text>
            )}
            onChange={item => (
              setDonationCat(item.value),
              setDonationSubCat([]),
              setSevaList([]),
              setDonationSubCat(''),
              setSevaCode(''),
              getDonationSubCategories(item.value)
            )}
          />
        </View>

        <Dropdown // sub category dropdown
          placeholder="Select Sub"
          style={[styles.dropStyle, {marginVertical: SIZES.paddingSmall}]}
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
          renderItem={item => <Text style={styles.dropText}>{item.label}</Text>}
          onChange={item => (
            setDonationSubCat(item.value),
            setSevaList([]),
            setSevaCode(''),
            getSevaList(item)
          )}
        />

        <View style={{flexDirection: 'row'}}>
          <Dropdown // seva dropdown
            placeholder="Select seva"
            style={[styles.dropStyle, {flex: 2, marginRight: 0}]}
            placeholderStyle={styles.dropPlaceholder}
            selectedTextStyle={styles.dropSelectedTxt}
            containerStyle={styles.dropContainer}
            fontFamily={FONTS.josefinSansRegular}
            data={sevaList?.map(item => ({
              label: item.sevaName.toUpperCase(),
              value: item.sevaCode,
            }))}
            value={sevaCode}
            labelField="label"
            valueField="value"
            renderItem={item => (
              <Text style={styles.dropText}>{item.label}</Text>
            )}
            onChange={item => {
              setSevaCode(item.value);
            }}
          />

          <PrimaryButton // fetch button
            style={{
              flex: 1,
              marginHorizontal: SIZES.paddingSmall,
              borderRadius: SIZES.radiusBig,
            }}
            name="Fetch"
            onPress={getCollectionHistory}
          />
        </View>

        <FlatList // follow up list
          data={collectionList}
          renderItem={({item, index}) => (
            <Card
              key={index}
              index={index}
              data={item}
              // setSpinnerLoader={setSpinnerLoader}
            />
          )}
          keyExtractor={(item, index) => index}
          // onEndReached={() => getProspectFollowup()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
        />
      </LinearGradient>
    </Animated.View>
  );
};

export default CollectionHistory;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: COLORS.white,
  },
  dropStyle: {
    marginHorizontal: SIZES.paddingSmall,
    height: SIZES.height * 0.065,
    borderColor: COLORS.lightGray,
    borderRadius: SIZES.radiusSmall,
    borderWidth: 1,
    backgroundColor: COLORS.antiFlashWhite,
    paddingHorizontal: SIZES.paddingSmall,
  },
  dropPlaceholder: {color: COLORS.gray, fontSize: SIZES.fontSmall - 2},
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
  list: {
    alignItems: 'center',
    paddingBottom: SIZES.paddingMedium,
    marginTop: SIZES.paddingSmall,
  },
});
