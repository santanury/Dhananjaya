import {
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  View,
  FlatList,
  BackHandler,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import Animated from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {showMessage} from 'react-native-flash-message';
import {COLORS, SIZES, FONTS, SHADOW} from '../constants';
import {Store} from '../store/Store';
import {
  baseUrl,
  sevaApiBase,
  get_ashraya_list,
  accessKey,
} from '../webApi/service';
import {Spinner} from 'native-base';

// components
import Header from '../components/Common/Header';
import Card from '../components/SPAshraya/Card';
import PatronCardSkeleton from '../components/Skeletons/PatronCardSkeleton';

const SPAshraya = ({navigation, route}) => {
  const store = Store();

  const [ashrayaList, setAshrayalist] = useState([]); // ashraya list
  const [pageNo, setPageNo] = useState(0);
  const [thatsAllshow, setThatsAllshow] = useState(true); // show thats all message
  const [skeletonLoader, setSkeletonLoader] = useState(true); // LOADER

  useEffect(() => {
    const unSubscribe = navigation.addListener('focus', () => {
      console.log('SP Ashraya Focused');
      BackHandler.addEventListener('hardwareBackPress', () => {
        console.log('BackHandler In SP Ashraya is called');
        navigation.goBack();
        return true;
      });
      getAshrayaList();
    });
    return unSubscribe;
  }, [route?.params]);

  // get ashraya list
  const getAshrayaList = async () => {
    const payload = {
      accessKey,
      preacherCode: store?.userData?.id,
      userRole: store?.userData?.userRole,

      name: route?.params?.nameSearchKey,
      whatsappNo: route?.params?.whatsAppSearchKey,
      language: route?.params?.languageSearchKey,
      mobile: route?.params?.mobileSearchKey,
      email: route?.params?.emailSearchkey,
      address: route?.params?.addressSearchKey,
      currentLevel: route?.params?.currLvlSearchkey,
    };

    console.log(
      'GET ASHRAYA PAYLOAD :',
      sevaApiBase + get_ashraya_list,
      payload,
    );

    await axios
      .post(sevaApiBase + get_ashraya_list, payload)
      .then(res => {
        res.data.successCode === 1
          ? setAshrayalist(
              route.params
                ? res?.data?.data
                : ashrayaList?.concat(res?.data?.data),
            )
          : thatsAllshow &&
            (showMessage({
              message: 'Thats all!',
              description: 'No more data found',
              type: 'info',
              floating: true,
              icon: 'auto',
            }),
            setThatsAllshow(false));
      })
      .catch(err => {
        console.log('Error getting ashraya list :', err);
        setSkeletonLoader(false);
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
          color={COLORS.black}
          leftButtonIcon="menu"
          title="SP ASHRAYA"
          onPressLeft={() => navigation.openDrawer()}
          headerRight={
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity // add button
                onPress={() => navigation.navigate('SPAshrayaAdd')}>
                <MaterialIcons // icon
                  name="add-circle-outline"
                  size={30}
                  color={COLORS.black}
                />
              </TouchableOpacity>

              <TouchableOpacity // search button
                onPress={() => {
                  setAshrayalist([]);
                  // setPageNo(0);
                  navigation.navigate('SPAshrayaSearch');
                }}>
                <MaterialCommunityIcons // icon
                  name="magnify"
                  size={35}
                  color={COLORS.black}
                />
              </TouchableOpacity>
            </View>
          }
        />

        {ashrayaList?.length === 0 && skeletonLoader ? (
          // ~ SKELETON VIEW
          <View style={{flex: 1, alignItems: 'center'}}>
            {Array(4)
              .fill('😎')
              .map((item, index) => (
                <View key={index} />
              ))}
          </View>
        ) : (
          //  PROSPECT LIST

          <FlatList
            data={ashrayaList}
            renderItem={({item, index}) => {
              return (
                <Card // prospect data card
                  key={index}
                  index={index}
                  data={item}
                  ashrayaList={ashrayaList}
                  setAshrayalist={setAshrayalist}
                  getAshrayaList={getAshrayaList}
                  navigation={navigation}
                />
              );
            }}
            keyExtractor={(item, index) => index}
            // onEndReached={() => {
            //   getAshrayaList();
            // }}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.list}
          />
        )}
      </LinearGradient>
    </Animated.View>
  );
};

export default SPAshraya;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: COLORS.white,
  },
  list: {
    alignItems: 'center',
  },
});
