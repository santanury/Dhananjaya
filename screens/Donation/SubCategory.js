import {StyleSheet, BackHandler, FlatList, View} from 'react-native';
import React, {useState, useEffect} from 'react';
import axios from 'axios';
import LinearGradient from 'react-native-linear-gradient';
import {showMessage} from 'react-native-flash-message';
import {Store} from '../../store/Store';
import {COLORS, SIZES} from '../../constants';
import {
  baseUrl,
  accessKey,
  get_seva_sub_category_list,
} from '../../webApi/service';
import {VStack, HStack, Skeleton} from 'native-base';

// components
import Header from '../../components/Common/Header';
import LargeButton from '../../components/Donation&Sub/LargeButton';

const SubCategory = ({navigation, route}) => {
  const store = Store();

  const [donationSubCats, setDonationSubCats] = useState([]); // donation sub-category options array
  const [skeletonLoader, setSkeletonLoader] = useState(false);

  useEffect(() => {
    getDonationSubCategories();
    const unSubscribe = navigation.addListener('focus', () => {
      console.log('Sub Category Focused');
      BackHandler.addEventListener('hardwareBackPress', () => {
        console.log('BackHandler In Sub Category is called');

        // removing category related data from routeInfo state when back clicked
        if (Object.keys(store?.routeInfo)?.length > 0) {
          let tempObj = store?.routeInfo;
          tempObj?.categoryCode && delete tempObj?.categoryCode;
          tempObj?.categoryId && delete tempObj?.categoryId;
          tempObj?.categoryName && delete tempObj?.categoryName;
          store?.setRouteInfo(tempObj);
        }

        navigation.goBack();
        return true;
      });
    });
    return unSubscribe;
  }, []);

  // get donation sub-categories list
  const getDonationSubCategories = async () => {
    setSkeletonLoader(true);

    const payload = {
      accessKey,
      deviceId: store?.deviceId,
      loginId: store?.userData?.userId,
      sessionId: store?.userData?.session_id,
      categoryId: store?.routeInfo?.categoryId,
    };

    console.log(
      ' GET SEVA SUB CATEGORIES:',
      baseUrl + get_seva_sub_category_list,
      payload,
    );

    await axios
      .post(baseUrl + get_seva_sub_category_list, payload)
      .then(res => {
        res.data.successCode === 1
          ? setDonationSubCats(res.data.data)
          : showMessage({
              message: 'Opps!',
              description: 'No donation available for this category',
              type: 'info',
              floating: true,
              icon: 'auto',
            });
        setSkeletonLoader(false);
      })
      .catch(err => {
        setSkeletonLoader(false);
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
        title={
          store?.routeInfo?.categoryName?.split(' ')[0]?.toUpperCase() +
          ' ' +
          'DONATION'
        }
        onPressLeft={() => navigation.goBack()}
      />

      {donationSubCats.length > 0 && skeletonLoader ? (
        <View style={{flex: 1, alignItems: 'center'}}>
          {Array(4)
            .fill('😎')
            .map((item, index) => (
              <VStack
                key={index}
                h={'1/4'}
                w={'90%'}
                mt={index === 0 ? SIZES.paddingSmall : 0}
                mb={SIZES.paddingSmall}
                position={'relative'}>
                <Skeleton
                  h={'full'}
                  // w={'full'}
                  borderRadius={SIZES.radiusSmall}
                  endColor={'rgba(0,0,0,0.2)'}
                />
                <Skeleton
                  h={'5'}
                  borderRadius={SIZES.radiusSmall}
                  endColor={'rgba(0,0,0,0.2)'}
                  position={'absolute'}
                  top={'50%'}
                  w={'80%'}
                  alignSelf={'center'}
                />
              </VStack>
            ))}
        </View>
      ) : (
        <FlatList // donation sub-category options list
          data={donationSubCats}
          keyExtractor={(item, index) => index}
          showsVerticalScrollIndicator={false}
          renderItem={({item, index}) => (
            <LargeButton // donation sub category selection button
              index={index}
              name={item.purposeTitle?.split('(')[0]?.toUpperCase()}
              image={'http://52.172.166.65:8081/iskcon/' + item.purposeUrl}
              onPress={() => {
                // lightning route data
                const {isActive, purposeUrl, ...compactItem} = item;
                store.setRouteInfo({...store?.routeInfo, ...compactItem});
                navigation.navigate('SevaSelection');
              }}
            />
          )}
          contentContainerStyle={styles.list}
        />
      )}
    </LinearGradient>
  );
};

export default SubCategory;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: COLORS.white,
  },
  list: {
    alignItems: 'center',
    paddingBottom: SIZES.paddingMedium,
  },
});
