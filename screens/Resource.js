import {
  StyleSheet,
  Text,
  View,
  BackHandler,
  StatusBar,
  Platform,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Linking,
  Modal,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import Animated from 'react-native-reanimated';
import {Store} from '../store/Store';
import {COLORS, FONTS, SIZES, icons} from '../constants';

// components
import Header from '../components/Common/Header';
import {useFocusEffect} from '@react-navigation/native';
import {showMessage} from 'react-native-flash-message';
import axios from 'axios';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import CommonModal from '../components/Common/CommonModal';
import {Dropdown} from 'react-native-element-dropdown';
import PrimaryButton from '../components/Common/PrimaryButton';
import {VStack, HStack, Skeleton, Spinner} from 'native-base';

const Resource = ({navigation}) => {
  const {userData, animatedScreen} = Store();
  const [spinnerLoader, setSpinnerLoader] = useState(false);
  const [skeletonLoader, setSkeletonLoader] = useState(true);
  const [filterMode, setFilterMode] = useState(false);
  const [authToken, setAuthToken] = useState('');

  const [resourceList, setResourceList] = useState([]);

  const [modalVisibility, setModalVisibility] = useState(false);

  const [categoryList, setCategoryList] = useState([]);
  const [categoryId, setCategoryId] = useState('');

  const [subCategoryList, setSubCategoryList] = useState([
    {label: 'Select Sub Category', value: null},
  ]);
  const [subCategoryId, setSubCategoryId] = useState('');

  const [resourceTypeList, setResourceTypeList] = useState([]);
  const [resourceTypeId, setResourceTypeId] = useState('');

  const backAction = () => {
    BackHandler.addEventListener('hardwareBackPress', () => {
      console.log('BackHandler In Resource is called');
      navigation.goBack();
      return true;
    });
  };

  useFocusEffect(() => {
    Platform.OS !== 'ios' && backAction();
  });

  useEffect(() => {
    const unSubscribe =
      Platform.OS !== 'ios'
        ? BackHandler.removeEventListener('hardwareBackPress', () => {
            console.log('Called');
            backAction();
          })
        : () => null;

    getToken();

    return unSubscribe;
  }, []);

  // ~> Fn to show toast message
  const showToast = (message, type = 'warning') => {
    showMessage({
      message: type,
      description: message,
      type,

      color: COLORS.white,
      style: {
        width: '90%',
        alignSelf: 'center',
      },
      icon: 'auto',
      floating: true,
      duration: 4000,
    });
  };

  // # GET ACESS TOKEN API call ^(to sent it in header of Get Resource List and dropdown list)
  const getToken = async () => {
    setSkeletonLoader(true);
    try {
      const client = {
        client_id: '95261f05-203c-4420-834d-82eb7a993006',
        client_secret: 'l4ejLyjJqbnCnrt47rMoL34lryO9XPQF6f4T2bfg',
      };
      const getTokenURL =
        'https://dashboard.dhananjaya.org/api/generateAccessToken';
      console.log('URL', getTokenURL, 'data', client);
      const response = await axios.post(getTokenURL, client);
      // console.log('Get Token Response', response.data);

      response.data.status === 'success'
        ? (setAuthToken(response.data.access_token),
          getResourceList(response.data.access_token))
        : (setSkeletonLoader(false), showToast('No resource found'));
    } catch (error) {
      console.log('get Resource Error', error);
      setSkeletonLoader(false);
      showToast('Error occured, Please try again later');
    }
  };

  // # GET RESOURCE LIST API call
  const getResourceList = async token => {
    setSkeletonLoader(true);
    try {
      const authorization = authToken === '' ? token : authToken;
      const resourceListURL =
        'https://dashboard.dhananjaya.org/api/getResources';
      const headers = {
        'Content-Type': 'application/json',
        Authorization: authorization,
      };
      const params = {
        authorization,
        email: userData.email,
        // email: 'kanhu.gouda@hkm-group.org', // ! loginId
        employeeId: userData.userId,
        category_id: categoryId && !filterMode ? categoryId : '',
        sub_category_id: subCategoryId && !filterMode ? subCategoryId : '',
        resource_type_id: resourceTypeId && !filterMode ? resourceTypeId : '',
      };
      // console.log('URL', resourceListURL, 'data', params, 'headers', headers);
      const response = await axios.post(resourceListURL, params, {
        headers: headers,
      });
      console.log('Get resourceList Response data', response.data);

      response.data.status === 'success'
        ? setResourceList(response.data.data)
        : showToast('No resource found', 'info');
      setSkeletonLoader(false);
    } catch (error) {
      console.log('get Resource Error', error);
      setSkeletonLoader(false);
      showToast('Error occured, Please try again later');
    }
  };

  // # open URL in Web
  const cardPressHandler = url => {
    try {
      Linking.canOpenURL(url)
        ? Linking.openURL(url)
        : showToast('Error occured, Please try again later');
    } catch (error) {
      console.log('Open Image URL error', error);
    }
  };

  // # Modal visibilty handler
  const setModal = () => {
    categoryList.length && resourceTypeList.length > 0
      ? setModalVisibility(!modalVisibility)
      : (setSpinnerLoader(true), getCategoryList(), getResourceTypeList());
  };

  // # API call to get CATEGORY LIST
  const getCategoryList = async () => {
    try {
      const categoryListURL =
        'https://dashboard.dhananjaya.org/api/getResourceCategories';
      const headers = {
        Authorization: authToken,
      };
      console.log('URL', categoryListURL);
      const response = await axios.post(categoryListURL, '', {
        headers: headers,
      });
      console.log('Get CategoryList response ', response.data);

      response.data.status === 'success'
        ? setDropDownList(response.data) // @ Response handler
        : showToast('Please try again later');

      setSpinnerLoader(false);
    } catch (error) {
      showToast('Please try again later');
      setSpinnerLoader(false);
      console.log('GeCategoryList Error', error);
    }
  };

  // # API call to get SUB CATEGORY LIST
  const getSubCategoryList = async categoryId => {
    setSpinnerLoader(true);
    try {
      const subCategoryListURL =
        'https://dashboard.dhananjaya.org/api/getResourceSubCategories';
      const headers = {
        'Content-Type': 'application/json',
        Authorization: authToken,
      };
      const params = {
        category_id: categoryId,
      };
      console.log('URL', subCategoryListURL, 'params', params);
      const response = await axios.post(subCategoryListURL, params, {
        headers: headers,
      });
      console.log('Get SUBCategoryList response ', response.data);

      response.data.status === 'success'
        ? setDropDownList(response.data, 'Sub Category') // @ Response handler
        : showToast('Please try again later');

      setSpinnerLoader(false);
    } catch (error) {
      setSpinnerLoader(false);
      showToast('Please try again later');
      console.log('Get SUBCategoryList Error', error);
    }
  };

  // # API call to get RESOURCE TYPE LIST
  const getResourceTypeList = async () => {
    try {
      const resourceTypeURL =
        'https://dashboard.dhananjaya.org/api/getResourceTypes';
      const headers = {
        Authorization: authToken,
      };
      console.log('URL', resourceTypeURL, 'headers', headers);
      const response = await axios.post(resourceTypeURL, '', {
        headers: headers,
      });
      console.log('Get ResourceType response ', response.data);

      response.data.status === 'success'
        ? setDropDownList(response.data, 'Resource Type') // @ Response handler
        : showToast('Please try again later');

      setSpinnerLoader(false);
      setModalVisibility(!modalVisibility);
    } catch (error) {
      showToast('Please try again later');
      setSpinnerLoader(false);
      console.log('Get ResourceType Error', error);
    }
  };

  // # LIST RESPONSE Handler
  const setDropDownList = (data, setFor = 'Category') => {
    if (data.status === 'success') {
      // $ create dropdown list object to list in dropdown
      let listArray = [{label: 'Select ' + setFor, value: null}]; // @ Default Label
      // $ Looping to create dropdown object
      data.data.forEach(item => {
        listArray.push({
          label: item.name,
          value: item.id,
        });
      });

      setFor === 'Category'
        ? setCategoryList(listArray)
        : setFor === 'Resource Type'
        ? setResourceTypeList(listArray)
        : setSubCategoryList(listArray);
      setSpinnerLoader(false);
    } else {
      showToast('Error occured in' + setFor + ' list, Please try again later');
      setSpinnerLoader(false);
    }
  };

  // # CATEGORY CAHNGE handler
  const categoryHandler = item => {
    console.log('category ITEM', item);
    setCategoryId(item.value);
    subCategoryId && setSubCategoryId(null);

    // $ fn to Get SUB CAEGORY LIST
    item.value !== null
      ? getSubCategoryList(item.value)
      : setSubCategoryList([{label: 'Select Sub Category', value: null}]);
  };

  const searchResource = () => {
    (categoryId || subCategoryId || resourceTypeId) &&
      (setResourceList([]),
      getResourceList(),
      setFilterMode(true),
      setSubCategoryList([{label: 'Select Sub Category', value: null}]),
      setSubCategoryId(null));

    setModalVisibility(false);
  };

  const cancelSearch = () => {
    setModalVisibility(false);
    setFilterMode(false);
    setCategoryId('');
    setSubCategoryId(null);
    setResourceTypeId('');
  };

  return (
    <Animated.View // animated container
      style={[styles.container, animatedScreen]}>
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
          leftButtonIcon="menu"
          title="RESOURCE"
          onPressLeft={() => navigation.openDrawer()}
          headerRight={
            authToken !== '' && (
              <TouchableOpacity // right button as touchable
                onPress={() => {
                  !filterMode
                    ? setModal()
                    : (setResourceList([]), cancelSearch(), getResourceList());
                }}>
                <MaterialCommunityIcons // icon
                  name={!filterMode ? 'filter' : 'filter-remove'}
                  size={30}
                  color={COLORS.black}
                />
              </TouchableOpacity>
            )
          }
        />
        <View style={[{flex: 1}, styles.container]}>
          {resourceList.length > 0 ? (
            // ~ CARD VIEW
            <FlatList
              data={resourceList}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={[styles.card]}
                  onPress={() => cardPressHandler(item.resource_url)}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.cardHeaderText}>{item.name}</Text>
                    <MaterialCommunityIcons
                      name={
                        item.resource_type === 'Image'
                          ? 'file-image'
                          : item.resource_type === 'Video'
                          ? 'video-image'
                          : 'file-pdf-box'
                      }
                      size={25}
                      color={COLORS.white}
                    />
                  </View>
                  {/* // # BODY */}
                  <View style={styles.cardBody}>
                    <View
                      style={[{flexDirection: 'row'}, {paddingBottom: '1%'}]}>
                      <Text style={styles.cardLabel}>Category</Text>
                      <Text style={styles.cardValue}>{item.category}</Text>
                    </View>
                    <View
                      style={[
                        {flexDirection: 'row'},
                        {
                          paddingTop: '1%',
                          borderTopColor: '#000' + 5,
                          borderTopWidth: 1,
                        },
                      ]}>
                      <Text style={styles.cardLabel}>Sub Category</Text>
                      <Text style={styles.cardValue}>{item.sub_category}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
            />
          ) : (
            !spinnerLoader &&
            !skeletonLoader && (
              // ~ NO Data View
              <View style={[{flex: 1}, {justifyContent: 'center'}]}>
                {/* <View style={[{flexDirection: 'row'}, styles.noDataView]}>
                  <Text style={styles.noDataText}>No resource found</Text>
                  <AntDesign
                    name="exclamationcircleo"
                    color={COLORS.primaryColor}
                    size={20}
                  />
                </View> */}
              </View>
            )
          )}
          {skeletonLoader && resourceList.length === 0 && (
            <View style={[{flex: 1}, styles.container]}>
              <View style={{flex: 1, alignItems: 'center'}}>
                {Array(4)
                  .fill('😎')
                  .map((item, index) => (
                    <VStack
                      key={index}
                      space="3"
                      w={'90%'}
                      alignSelf="center"
                      p={1}
                      mb={'5%'}
                      bgColor={COLORS.white}
                      borderRadius={SIZES.radiusSmall}>
                      <Skeleton
                        h={10}
                        borderRadius={SIZES.radiusSmall}
                        endColor={'#599D5570'}
                      />
                      <Skeleton
                        size="5"
                        borderRadius={SIZES.radiusSmall}
                        rounded="full"
                        alignSelf={'center'}
                        endColor={'rgba(0,0,0,0.4)'}
                        position={'absolute'}
                        top={SIZES.fontScale * 4}
                        right={SIZES.fontScale * 5}
                      />
                      <HStack
                        space="10"
                        mx="2"
                        pb="2"
                        mt="1"
                        borderBottomWidth="0.5"
                        borderBottomColor={'rgba(0, 0, 0, 0.1)'}>
                        <Skeleton
                          h={3}
                          borderRadius={SIZES.radiusSmall}
                          my={0.5}
                          w="42%"
                          endColor={'rgba(0,0,0,0.4)'}
                        />
                        <Skeleton
                          h={3}
                          borderRadius={SIZES.radiusSmall}
                          my={0.5}
                          w="42%"
                          endColor={'rgba(0,0,0,0.4)'}
                        />
                      </HStack>

                      <HStack
                        space="10"
                        mx="2"
                        pb="2"
                        borderBottomWidth="0.5"
                        borderBottomColor={'rgba(0, 0, 0, 0.1)'}>
                        <Skeleton
                          h={3}
                          borderRadius={SIZES.radiusSmall}
                          my={0.5}
                          w="42%"
                          endColor={'rgba(0,0,0,0.4)'}
                        />
                        <Skeleton
                          h={3}
                          borderRadius={SIZES.radiusSmall}
                          my={0.5}
                          w="42%"
                          endColor={'rgba(0,0,0,0.4)'}
                        />
                      </HStack>
                    </VStack>
                  ))}
              </View>
            </View>
          )}
        </View>
      </LinearGradient>
      <CommonModal
        isOpen={modalVisibility}
        onClose={() => cancelSearch()}
        title={'Filter Resources'}
        closeOnOverlayClick={false}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Dropdown // Category type dropdown
            placeholder="Category"
            style={[styles.dropStyle, {width: SIZES.width * 0.4}]}
            placeholderStyle={styles.dropPlaceholder}
            selectedTextStyle={styles.dropSelectedTxt}
            containerStyle={styles.dropContainer}
            fontFamily={FONTS.josefinSansRegular}
            data={categoryList}
            value={categoryId}
            labelField="label"
            valueField="value"
            renderItem={item => (
              <Text style={styles.dropText}>{item.label}</Text>
            )}
            onChange={item => categoryHandler(item)}
          />
          <Dropdown // Sub-Category type dropdown
            placeholder="Sub Category"
            style={[styles.dropStyle, {width: SIZES.width * 0.4}]}
            placeholderStyle={styles.dropPlaceholder}
            selectedTextStyle={styles.dropSelectedTxt}
            containerStyle={styles.dropContainer}
            fontFamily={FONTS.josefinSansRegular}
            data={subCategoryList}
            value={subCategoryId}
            labelField="label"
            valueField="value"
            renderItem={item => (
              <Text style={styles.dropText}>{item.label}</Text>
            )}
            onChange={item => setSubCategoryId(item.value)}
          />
        </View>
        <Dropdown // Resource Typetype dropdown
          placeholder="Resource Type"
          style={[styles.dropStyle]}
          placeholderStyle={styles.dropPlaceholder}
          selectedTextStyle={styles.dropSelectedTxt}
          containerStyle={styles.dropContainer}
          fontFamily={FONTS.josefinSansRegular}
          data={resourceTypeList}
          value={resourceTypeId}
          labelField="label"
          valueField="value"
          renderItem={item => <Text style={styles.dropText}>{item.label}</Text>}
          onChange={item => setResourceTypeId(item.value)}
        />
        <PrimaryButton
          name="Apply"
          onPress={() => searchResource()}
          style={{alignSelf: 'center', width: SIZES.width * 0.4}}
        />
      </CommonModal>
      {/* // ~ SPINNER MODAL */}
      <Modal visible={spinnerLoader} animationType={'fade'} transparent>
        <View
          style={{
            justifyContent: 'center',
            height: Dimensions.get('screen').height,
            backgroundColor: 'rgba(0,0,0,0.2)',
          }}>
          <Spinner color={COLORS.primary} size="lg" />
        </View>
      </Modal>

      {/* // ~ SKELETON OVERLAY */}
      <Modal visible={skeletonLoader} transparent />
    </Animated.View>
  );
};

export default Resource;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },

  noDataView: {
    // width: '100%',
    alignSelf: 'center',
    alignItems: 'center',
    padding: '3%',
    borderRadius: 4,
    backgroundColor: COLORS.mistyMoss,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,

    elevation: 7,
  },

  noDataText: {
    fontFamily: FONTS.josefinSansSemiBold,
    fontSize: 20,
    marginEnd: '2%',
    color: COLORS.darkGray,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: SIZES.radiusMedium,
    overflow: 'hidden',
    margin: '5%',
    marginTop: '0%',
    padding: SIZES.paddingSmall,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,

    elevation: 7,
  },

  cardHeader: {
    backgroundColor: COLORS.mistyMoss,
    padding: SIZES.paddingSmall,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: SIZES.radiusSmall,
  },

  cardHeaderText: {
    color: '#fff',
    fontSize: Dimensions.get('screen').fontScale * 20,
    width: '80%',
    fontFamily: FONTS.josefinSansSemiBold,
  },

  cardBody: {
    margin: SIZES.paddingSmall,
  },

  cardLabel: {
    width: '45%',
    fontFamily: FONTS.josefinSansBold,
    color: COLORS.black,
  },

  cardValue: {
    width: '53%',
    fontFamily: FONTS.josefinSansMedium,
    color: COLORS.darkGray,
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
});
