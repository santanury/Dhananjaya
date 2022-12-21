import {
  StyleSheet,
  Text,
  View,
  BackHandler,
  TouchableOpacity,
  FlatList,
  Pressable,
  StatusBar,
  Modal,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import Animated from 'react-native-reanimated';
import {Store} from '../store/Store';
import {COLORS, FONTS, SIZES, icons} from '../constants';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Animatable from 'react-native-animatable';
import moment from 'moment';
import DatePicker from 'react-native-modern-datepicker';
import {showMessage} from 'react-native-flash-message';

import {accessKey, baseUrl, get_collection_report} from '../webApi/service';
import axios from 'axios';

// components
import Header from '../components/Common/Header';
import {VStack, HStack, Skeleton} from 'native-base';

const CollectionReport = ({navigation}) => {
  const {animatedScreen, userData, deviceId} = Store();

  let textAnimateRef = useRef(null);

  const currentPeriod = moment(
    moment(new Date()).format('MMM-YYYY'),
    'MMM-YYYY',
  );
  const [period, setPeriod] = useState(moment(new Date()).format('MMM-YYYY'));
  const [periodChngSts, setPeriodChngSts] = useState('');
  const [reports, setReports] = useState([]);
  const [showPicker, setShowPicker] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // @ Month and Year change Fn
  const changePeriod = (to = 'previous') => {
    let newPeriod = moment(period, 'MMM-YYYY');
    to === 'previous'
      ? (newPeriod = newPeriod.subtract(1, 'month'))
      : (newPeriod = newPeriod.add(1, 'month'));

    setPeriodChngSts(to);
    setIsLoading(true);
    setPeriod(newPeriod.format('MMM-YYYY'));
  };

  // @ Animate Month and Year Text before calling API
  const animator = async () => {
    if (periodChngSts === 'previous') {
      await textAnimateRef.slideInLeft(300);
      getCollectionReport();
    } else if (periodChngSts === 'next') {
      await textAnimateRef.slideInRight(300);
      getCollectionReport();
    } else {
      await textAnimateRef.bounceIn(300);
      getCollectionReport();
    }
  };
  useEffect(() => {
    animator();
  }, [period]);

  // ~> API CALL to get collection report
  const getCollectionReport = async () => {
    try {
      const URL = baseUrl + get_collection_report;
      const params = {
        accessKey: accessKey,
        deviceId: deviceId,
        loginId: userData.userId,
        sessionId: userData.session_id,
        month: moment(period, 'MMM-YYYY').format('M'), // # Extracting month from period
        year: moment(period, 'MMM-YYYY').format('YYYY'), // # Extracting year from period
      };
      console.log('getCollectionReport URL', URL, 'params', params);

      const response = await axios.post(URL, params);
      // console.log('getCollectionReport ---->', typeof response.data);
      const {data} = response;

      if (data.successCode === 1) {
        setReports(data.data);
      }
      setIsLoading(false);
    } catch (error) {
      console.log('get_collection_report error', error);
      setIsLoading(false);
    }
  };

  const showToast = (message, type = 'warning') =>
    showMessage({
      message: type[0].toUpperCase() + type.slice(1),
      description: message,
      type,
      icon: type,
      duration: 3000,
      position: {bottom: '3%'},
      style: {
        borderRadius: SIZES.radiusSmall,
        width: '80%',
        alignSelf: 'center',
      },
    });

  useEffect(() => {
    const unSubscribe = navigation.addListener('focus', () => {
      BackHandler.addEventListener('hardwareBackPress', () => {
        console.log('BackHandler In CollectionReport is called');
        navigation.goBack();
        return true;
      });
    });

    return unSubscribe;
  }, []);

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
          title="COLLECTION REPORT"
          onPressLeft={() => navigation.openDrawer()}
        />
        <View style={{flex: 1}}>
          {/* // @ ******** Date Section ******** */}
          <View style={[styles.dateSection, styles.boxShadow]}>
            <TouchableOpacity
              disabled={isLoading}
              onPress={() => changePeriod()}>
              <MaterialCommunityIcons
                name="arrow-left-drop-circle"
                size={30}
                color={isLoading ? COLORS.gray : COLORS.black}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setShowPicker(true)}
              disabled={isLoading}>
              <Animatable.Text
                ref={ref => (textAnimateRef = ref)}
                style={styles.dateText}>
                {period}
              </Animatable.Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => changePeriod('next')}
              disabled={
                moment(period, 'MMM-YYYY').isSame(currentPeriod) || isLoading
              }>
              <MaterialCommunityIcons
                name="arrow-right-drop-circle"
                size={30}
                color={
                  moment(period, 'MMM-YYYY').isSame(currentPeriod) || isLoading
                    ? COLORS.gray
                    : COLORS.black
                }
              />
            </TouchableOpacity>
          </View>

          {!isLoading ? (
            <FlatList
              showsVerticalScrollIndicator={false}
              data={reports}
              renderItem={({item, index}) => (
                <Animatable.View
                  animation={'bounceIn'}
                  duration={1000}
                  delay={(index + 1) * 100}
                  style={[
                    styles.card(index, reports.length),
                    styles.boxShadow,
                  ]}>
                  <Text style={styles.cardHeading}>{item.branchName}</Text>
                  <View style={styles.cardRow}>
                    <Text style={styles.cardRowLabel}>
                      Patronship Donations
                    </Text>
                    <Text style={styles.cardRowValue}>{item.patronship}</Text>
                  </View>

                  <View style={styles.cardRow}>
                    <Text style={styles.cardRowLabel}>Festival Donations</Text>
                    <Text style={styles.cardRowValue}>{item.festival}</Text>
                  </View>

                  <View style={styles.cardRow}>
                    <Text style={styles.cardRowLabel}>Temple Donations</Text>
                    <Text style={styles.cardRowValue}>{item.temple}</Text>
                  </View>

                  <View style={styles.lastCardRow}>
                    <Text style={styles.cardRowLabel}>
                      Charitable Donations
                    </Text>
                    <Text style={styles.cardRowValue}>{item.charitable}</Text>
                  </View>
                </Animatable.View>
              )}
            />
          ) : (
            <View style={{alignItems: 'center', height: '100%'}}>
              {[1, 2, 3].map((item, index) => (
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
                      size="5"
                      borderRadius={SIZES.radiusSmall}
                      my={0.5}
                      rounded="full"
                      alignSelf={'center'}
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
                      size="5"
                      borderRadius={SIZES.radiusSmall}
                      my={0.5}
                      rounded="full"
                      alignSelf={'center'}
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
                      size="5"
                      borderRadius={SIZES.radiusSmall}
                      my={0.5}
                      rounded="full"
                      alignSelf={'center'}
                      endColor={'rgba(0,0,0,0.4)'}
                    />
                  </HStack>

                  <HStack space="10" mx="2" pb="2" mb="1">
                    <Skeleton
                      h={3}
                      borderRadius={SIZES.radiusSmall}
                      my={0.5}
                      w="42%"
                      endColor={'rgba(0,0,0,0.4)'}
                    />
                    <Skeleton
                      size="5"
                      borderRadius={SIZES.radiusSmall}
                      my={0.5}
                      rounded="full"
                      alignSelf={'center'}
                      endColor={'rgba(0,0,0,0.4)'}
                    />
                  </HStack>
                </VStack>
              ))}
            </View>
          )}
        </View>
        {
          // ? Month and Year Picker
          showPicker && (
            <Pressable
              onPress={() => setShowPicker(false)}
              style={{
                position: 'absolute',
                top: 0,
                width: '100%',
                height: '100%',
                justifyContent: 'flex-end',
                backgroundColor: '#000' + 3,
              }}>
              <Animatable.View animation={'slideInUp'} duration={500}>
                <DatePicker
                  mode="monthYear"
                  selectorEndingYear={moment(new Date()).year()}
                  onMonthYearChange={selectedDate => {
                    const selectedMonth = moment(
                        selectedDate,
                        'YYYY-MM',
                      ).format('M'),
                      currentPeriodMonth = moment(
                        currentPeriod,
                        'MMM-YYYY',
                      ).format('M');
                    -currentPeriodMonth <= -selectedMonth
                      ? (setIsLoading(true),
                        setPeriod(
                          moment(selectedDate, 'YYYY-MM').format('MMM-YYYY'),
                        ),
                        setPeriodChngSts(''),
                        setShowPicker(false))
                      : showToast("Can't be greater than current month");
                  }}
                  current={`${moment(period, 'MMM-YYYY').format('YYYY-MM')}`}
                  style={{
                    borderTopLeftRadius: SIZES.radiusBig,
                    borderTopRightRadius: SIZES.radiusBig,
                  }}
                />
              </Animatable.View>
            </Pressable>
          )
        }
        <Modal visible={isLoading} transparent />
      </LinearGradient>
    </Animated.View>
  );
};

export default CollectionReport;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: COLORS.white,
  },

  dateSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 2,
    width: '90%',
    alignSelf: 'center',
    padding: '3%',
    marginBottom: '5%',
    borderRadius: SIZES.radiusSmall,

    borderColor: COLORS.white,
    backgroundColor: COLORS.mistyMoss,
  },

  dateText: {
    fontSize: 18,
    fontFamily: FONTS.josefinSansBold,
    color: COLORS.black,
  },

  card: (index, arrLen) => ({
    flex: 1,
    width: '90%',
    alignSelf: 'center',
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusMedium,
    marginBottom: arrLen - 1 !== index ? '5%' : '8%',
    padding: '1%',
    overflow: 'hidden',
  }),

  cardHeading: {
    fontSize: 16,
    fontFamily: FONTS.josefinSansBold,
    color: COLORS.black,
    padding: '2%',
    paddingVertical: '5%',
    backgroundColor: '#599D5570',
    borderRadius: SIZES.radiusMedium - 3,
  },

  cardRow: {
    flexDirection: 'row',
    padding: '5%',
    borderBottomWidth: 1,
    borderColor: COLORS.lightGray,
  },

  lastCardRow: {
    flexDirection: 'row',
    padding: '5%',
  },

  cardRowLabel: {
    fontFamily: FONTS.josefinSansBold,
    color: COLORS.black,
    width: '50%',
  },

  cardRowValue: {
    fontFamily: FONTS.josefinSansItalic,
    color: COLORS.black,
  },

  boxShadow: {
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 10,
  },
});
