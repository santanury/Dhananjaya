import {
  StyleSheet,
  StatusBar,
  Text,
  View,
  BackHandler,
  TouchableOpacity,
  FlatList,
  Modal,
  Dimensions,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Animated from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {showMessage} from 'react-native-flash-message';
import axios from 'axios';
import moment from 'moment';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {TabView, TabBar} from 'react-native-tab-view';
import {COLORS, FONTS, SIZES} from '../constants';
import {Store} from '../store/Store';
import {
  baseUrl,
  accessKey,
  get_patron_followup_list,
  get_donor_followup_list,
  get_prospect_followup_list,
} from '../webApi/service';

// components
import Header from '../components/Common/Header';
import CardPatron from '../components/FollowUp/CardPatron';
import CardProspect from '../components/FollowUp/CardProspect';
import CardDonor from '../components/FollowUp/CardDonor';
import PatronTab from '../components/FollowUp/PatronTab';
import {Spinner} from 'native-base';
import DonorTab from '../components/FollowUp/DonorTab';
import ProspectTab from '../components/FollowUp/ProspectTab';

const FollowUp = ({navigation}) => {
  const store = Store();

  const [index, setIndex] = useState(0); // tab index
  const [routes] = useState([
    {key: 'patron', title: 'PATRON', icon: 'face-man-shimmer-outline'},
    {key: 'donor', title: 'DONOR', icon: 'hand-coin-outline'},
    {key: 'prospect', title: 'PROSPECT', icon: 'location-enter'},
  ]); // available tabs

  // PATRON
  const [ptDuration, setPtDuration] = useState('MONTH'); // selected duration
  const [ptStartPkr, setPtStartPkr] = useState(false); // start date picker
  const [ptEndPkr, setPtEndPkr] = useState(false); // end date picker
  const [ptStartDt, setPtStartDt] = useState(
    moment(new Date()).format('DD-MMM-YYYY'),
  ); // start date
  const [ptEndDt, setPtEndDt] = useState(
    moment(new Date()).add(1, 'months').format('DD-MMM-YYYY'),
  ); // end date
  const [ptPageNo, setPtPageNo] = useState(0); // page number
  const [patronList, setPatronList] = useState([]); // patron list

  // DONOR
  const [dnDuration, setDnDuration] = useState('MONTH'); // selected duration
  const [dnStartPkr, setDnStartPkr] = useState(false); // start date picker
  const [dnEndPkr, setDnEndPkr] = useState(false); // end date picker
  const [dnStartDt, setDnStartDt] = useState(
    moment(new Date()).format('DD-MMM-YYYY'),
  ); // start date
  const [dnEndDt, setDnEndDt] = useState(
    moment(new Date()).add(1, 'months').format('DD-MMM-YYYY'),
  ); // end date
  const [dnPageNo, setDnPageNo] = useState(0); // page number
  const [donorList, setDonorList] = useState([]); // donor list

  // PROSPECT
  const [prDuration, setPrDuration] = useState('MONTH'); // selected duration
  const [prStartPkr, setPrStartPkr] = useState(false); // start date picker
  const [prEndPkr, setPrEndPkr] = useState(false); // end date picker
  const [prStartDt, setPrStartDt] = useState(
    moment(new Date()).format('DD-MMM-YYYY'),
  ); // start date
  const [prEndDt, setPrEndDt] = useState(
    moment(new Date()).add(1, 'months').format('DD-MMM-YYYY'),
  ); // end date
  const [prPageNo, setPrPageNo] = useState(0); // page number
  const [prospectList, setProspectList] = useState([]); // prospect list

  const [thatsAllshow, setThatsAllshow] = useState(true); // show thats all message

  const [spinnerLoader, setSpinnerLoader] = useState(false);
  const [skeletonLoader, setSkeletonLoader] = useState(false);

  useEffect(() => {
    const unSubscribe = navigation.addListener('focus', () => {
      BackHandler.addEventListener('hardwareBackPress', () => {
        console.log('BackHandler In Follow Up is called');
        navigation.goBack();
        return true;
      });
      getPatronFollowup();
      getDonorFollowup();
      getProspectFollowup();
    });
    return unSubscribe;
  }, []);

  // get patron followup
  const getPatronFollowup = async duration => {
    setSkeletonLoader(true);
    await axios
      .post(baseUrl + get_patron_followup_list, {
        loginId: store.userData?.userId,
        accessKey: accessKey,
        deviceId: store.deviceId,
        sessionId: store.userData?.session_id,
        userRole: store.userData?.userRole,
        fromDate: duration?.startDate ? duration.startDate : ptStartDt,
        toDate: duration?.endDate ? duration.endDate : ptEndDt,
        pageNo: duration ? 0 : ptPageNo,
        perPageCount: '10',
        followup: 'y',
      })
      .then(response => {
        response.data.successCode === 1
          ? (duration && console.log(duration ? 'duration' : 'not duration'),
            setPatronList(
              duration
                ? response.data.data
                : patronList.concat(response.data.data),
            ),
            setPtPageNo(duration ? 1 : ptPageNo + 1),
            setPtStartDt(duration?.startDate ? duration?.startDate : ptStartDt),
            setPtEndDt(duration?.endDate ? duration?.endDate : ptEndDt),
            setThatsAllshow(true))
          : (thatsAllshow &&
              (showMessage({
                message: 'Thats all!',
                description: 'No more data found',
                type: 'info',
                floating: true,
                icon: 'auto',
              }),
              setThatsAllshow(false)),
            setPtStartDt(duration?.startDate ? duration?.startDate : ptStartDt),
            setPtEndDt(duration?.endDate ? duration?.endDate : ptEndDt),
            console.log('No more patron data found'));
        setSkeletonLoader(false);
      })
      .catch(error => {
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

  // get donor followup
  const getDonorFollowup = async duration => {
    setSkeletonLoader(true);
    await axios
      .post(baseUrl + get_donor_followup_list, {
        loginId: store.userData?.userId,
        accessKey: accessKey,
        deviceId: store.deviceId,
        sessionId: store.userData?.session_id,
        userRole: store.userData?.userRole,
        fromDate: duration?.startDate ? duration.startDate : dnStartDt,
        toDate: duration?.endDate ? duration.endDate : dnEndDt,
        pageNo: duration ? 0 : dnPageNo,
        perPageCount: '10',
        followup: 'y',
      })
      .then(response => {
        response.data.successCode === 1
          ? (duration && console.log(duration ? 'duration' : 'not duration'),
            setDonorList(
              duration
                ? response.data.data
                : donorList.concat(response.data.data),
            ),
            setDnPageNo(duration ? 1 : dnPageNo + 1),
            setDnStartDt(duration?.startDate ? duration?.startDate : dnStartDt),
            setDnEndDt(duration?.endDate ? duration?.endDate : dnEndDt),
            setThatsAllshow(true))
          : (thatsAllshow &&
              (showMessage({
                message: 'Thats all!',
                description: 'No more data found',
                type: 'info',
                floating: true,
                icon: 'auto',
              }),
              setThatsAllshow(false)),
            setDnStartDt(duration?.startDate ? duration?.startDate : dnStartDt),
            setDnEndDt(duration?.endDate ? duration?.endDate : dnEndDt),
            console.log('No more donor data found'));
        setSkeletonLoader(false);
      })
      .catch(error => {
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

  // get prospect followup
  const getProspectFollowup = async duration => {
    setSkeletonLoader(true);
    await axios
      .post(baseUrl + get_prospect_followup_list, {
        loginId: store.userData?.userId,
        accessKey: accessKey,
        deviceId: store.deviceId,
        sessionId: store.userData?.session_id,
        fromDate: duration?.startDate ? duration.startDate : prStartDt,
        toDate: duration?.endDate ? duration.endDate : prEndDt,
        pageNo: duration ? 0 : prPageNo,
        perPageCount: '10',
        followup: 'y',
      })
      .then(response => {
        response.data.successCode === 1
          ? (duration && console.log(duration ? 'duration' : 'not duration'),
            setProspectList(
              duration
                ? response.data.data
                : prospectList.concat(response.data.data),
            ),
            setPrPageNo(duration ? 1 : prPageNo + 1),
            setPrStartDt(duration?.startDate ? duration?.startDate : prStartDt),
            setPrEndDt(duration?.endDate ? duration?.endDate : prEndDt),
            setThatsAllshow(true))
          : (thatsAllshow &&
              (showMessage({
                message: 'Thats all!',
                description: 'No more data found',
                type: 'info',
                floating: true,
                icon: 'auto',
              }),
              setThatsAllshow(false)),
            setPrStartDt(duration?.startDate ? duration?.startDate : prStartDt),
            setPrEndDt(duration?.endDate ? duration?.endDate : prEndDt),
            console.log('No more prospect data found'));
        setSkeletonLoader(false);
      })
      .catch(error => {
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

  // PATRON
  // const FirstRoute = () => (
  //   <View // tab container
  //     style={{flex: 1}}>
  //     <View // time duretion selection button section
  //       style={styles.tymSelBtnSec}>
  //       <TouchableOpacity // day button
  //         onPress={() => {
  //           setPatronList([]);
  //           setPtDuration('DAY'),
  //             console.log('DAY'),
  //             getPatronFollowup({
  //               startDate: moment(new Date()).format('DD-MMM-YYYY'),
  //               endDate: moment(new Date()).format('DD-MMM-YYYY'),
  //             });
  //         }}
  //         style={[
  //           styles.tymSelBtn,
  //           {
  //             backgroundColor:
  //               ptDuration === 'DAY' ? COLORS.primary : COLORS.tertiary,
  //           },
  //         ]}>
  //         <Text // day button text
  //           style={[
  //             styles.txt,
  //             {
  //               fontFamily:
  //                 ptDuration === 'DAY'
  //                   ? FONTS.josefinSansBold
  //                   : FONTS.josefinSansRegular,
  //             },
  //           ]}>
  //           DAY
  //         </Text>
  //       </TouchableOpacity>

  //       <TouchableOpacity // week button
  //         onPress={() => {
  //           setPatronList([]);
  //           setPtDuration('WEEK'),
  //             console.log('WEEK'),
  //             getPatronFollowup({
  //               startDate: moment(new Date()).format('DD-MMM-YYYY'),
  //               endDate: moment(new Date())
  //                 .add(1, 'weeks')
  //                 .format('DD-MMM-YYYY'),
  //             });
  //         }}
  //         style={[
  //           styles.tymSelBtn,
  //           {
  //             backgroundColor:
  //               ptDuration === 'WEEK' ? COLORS.primary : COLORS.tertiary,
  //           },
  //         ]}>
  //         <Text // week button text
  //           style={[
  //             styles.txt,
  //             {
  //               fontFamily:
  //                 ptDuration === 'WEEK'
  //                   ? FONTS.josefinSansBold
  //                   : FONTS.josefinSansRegular,
  //             },
  //           ]}>
  //           WEEK
  //         </Text>
  //       </TouchableOpacity>

  //       <TouchableOpacity // month button
  //         onPress={() => {
  //           setPatronList([]);
  //           setPtDuration('MONTH'),
  //             console.log('MONTH'),
  //             getPatronFollowup({
  //               startDate: moment(new Date()).format('DD-MMM-YYYY'),
  //               endDate: moment(new Date())
  //                 .add(1, 'months')
  //                 .format('DD-MMM-YYYY'),
  //             });
  //         }}
  //         style={[
  //           styles.tymSelBtn,
  //           {
  //             borderRightWidth: 0,
  //             backgroundColor:
  //               ptDuration === 'MONTH' ? COLORS.primary : COLORS.tertiary,
  //           },
  //         ]}>
  //         <Text // month button text
  //           style={[
  //             styles.txt,
  //             {
  //               fontFamily:
  //                 ptDuration === 'MONTH'
  //                   ? FONTS.josefinSansBold
  //                   : FONTS.josefinSansRegular,
  //             },
  //           ]}>
  //           MONTH
  //         </Text>
  //       </TouchableOpacity>
  //     </View>

  //     <View // date selection button section
  //       style={styles.tymSelBtnSec}>
  //       <TouchableOpacity // start date picker button
  //         onPress={() => setPtStartPkr(true)}
  //         style={[
  //           styles.tymSelBtn,
  //           {
  //             paddingLeft: SIZES.width * 0.01,
  //             justifyContent: 'flex-start',
  //           },
  //         ]}>
  //         <MaterialCommunityIcons
  //           name="calendar-range"
  //           size={25}
  //           color={COLORS.white}
  //         />
  //         <Text // start date picker button text
  //           style={styles.txt}>
  //           From: {ptStartDt}
  //         </Text>
  //       </TouchableOpacity>

  //       <DateTimePickerModal // custom start date picker
  //         isVisible={ptStartPkr}
  //         onConfirm={date => {
  //           setPatronList([]),
  //             setPtStartDt(moment(date).format('DD-MMM-YYYY')),
  //             console.log('START CALL'),
  //             getPatronFollowup({
  //               startDate: moment(date).format('DD-MMM-YYYY'),
  //             }),
  //             setPtDuration(''),
  //             setPtStartPkr(false);
  //         }}
  //         onCancel={() => setPtStartPkr(false)}
  //         mode="date"
  //         is24Hour={true}
  //         maximumDate={new Date(ptEndDt)}
  //         date={new Date(ptStartDt)}
  //       />

  //       <TouchableOpacity // end date picker button
  //         onPress={() => setPtEndPkr(true)}
  //         style={[
  //           styles.tymSelBtn,
  //           {
  //             borderRightWidth: 0,
  //             paddingLeft: SIZES.width * 0.01,
  //             justifyContent: 'flex-start',
  //           },
  //         ]}>
  //         <MaterialCommunityIcons
  //           name="calendar-range"
  //           size={25}
  //           color={COLORS.white}
  //         />
  //         <Text // end date picker button text
  //           style={styles.txt}>
  //           To: {ptEndDt}
  //         </Text>
  //       </TouchableOpacity>

  //       <DateTimePickerModal // custom end date picker
  //         isVisible={ptEndPkr}
  //         onConfirm={date => {
  //           setPatronList([]),
  //             setPtEndDt(moment(date).format('DD-MMM-YYYY')),
  //             console.log('END CALL'),
  //             getPatronFollowup({endDate: moment(date).format('DD-MMM-YYYY')}),
  //             setPtDuration(''),
  //             setPtEndPkr(false);
  //         }}
  //         onCancel={() => setPtEndPkr(false)}
  //         mode="date"
  //         is24Hour={true}
  //         minimumDate={new Date(ptStartDt)}
  //         date={new Date(ptEndDt)}
  //       />
  //     </View>

  //     <FlatList // follow up list
  //       data={patronList}
  //       renderItem={({item, index}) => (
  //         <CardPatron
  //           key={index}
  //           index={index}
  //           data={item}
  //           ptStartDt={ptStartDt}
  //           ptEndDt={ptEndDt}
  //           ptDuration={ptDuration}
  //           patronList={patronList}
  //           setPatronList={setPatronList}
  //         />
  //       )}
  //       keyExtractor={(item, index) => item.patronId}
  //       onEndReached={() => getPatronFollowup()}
  //       showsVerticalScrollIndicator={false}
  //       contentContainerStyle={styles.list}
  //     />
  //   </View>
  // );

  // DONOR
  // const SecondRoute = () => (
  //   <View // tab container
  //     style={{flex: 1}}>
  //     <View // time duretion selection button section
  //       style={styles.tymSelBtnSec}>
  //       <TouchableOpacity // day button
  //         onPress={() => {
  //           setDonorList([]);
  //           setDnDuration('DAY'),
  //             console.log('DAY'),
  //             getDonorFollowup({
  //               startDate: moment(new Date()).format('DD-MMM-YYYY'),
  //               endDate: moment(new Date()).format('DD-MMM-YYYY'),
  //             });
  //         }}
  //         style={[
  //           styles.tymSelBtn,
  //           {
  //             backgroundColor:
  //               dnDuration === 'DAY' ? COLORS.primary : COLORS.tertiary,
  //           },
  //         ]}>
  //         <Text // day button text
  //           style={[
  //             styles.txt,
  //             {
  //               fontFamily:
  //                 dnDuration === 'DAY'
  //                   ? FONTS.josefinSansBold
  //                   : FONTS.josefinSansRegular,
  //             },
  //           ]}>
  //           DAY
  //         </Text>
  //       </TouchableOpacity>

  //       <TouchableOpacity // week button
  //         onPress={() => {
  //           setDonorList([]);
  //           setDnDuration('WEEK'),
  //             console.log('WEEK'),
  //             getDonorFollowup({
  //               startDate: moment(new Date()).format('DD-MMM-YYYY'),
  //               endDate: moment(new Date())
  //                 .add(1, 'weeks')
  //                 .format('DD-MMM-YYYY'),
  //             });
  //         }}
  //         style={[
  //           styles.tymSelBtn,
  //           {
  //             backgroundColor:
  //               dnDuration === 'WEEK' ? COLORS.primary : COLORS.tertiary,
  //           },
  //         ]}>
  //         <Text // week button text
  //           style={[
  //             styles.txt,
  //             {
  //               fontFamily:
  //                 dnDuration === 'WEEK'
  //                   ? FONTS.josefinSansBold
  //                   : FONTS.josefinSansRegular,
  //             },
  //           ]}>
  //           WEEK
  //         </Text>
  //       </TouchableOpacity>

  //       <TouchableOpacity // month button
  //         onPress={() => {
  //           setDonorList([]);
  //           setDnDuration('MONTH'),
  //             console.log('MONTH'),
  //             getDonorFollowup({
  //               startDate: moment(new Date()).format('DD-MMM-YYYY'),
  //               endDate: moment(new Date())
  //                 .add(1, 'months')
  //                 .format('DD-MMM-YYYY'),
  //             });
  //         }}
  //         style={[
  //           styles.tymSelBtn,
  //           {
  //             borderRightWidth: 0,
  //             backgroundColor:
  //               dnDuration === 'MONTH' ? COLORS.primary : COLORS.tertiary,
  //           },
  //         ]}>
  //         <Text // month button text
  //           style={[
  //             styles.txt,
  //             {
  //               fontFamily:
  //                 dnDuration === 'MONTH'
  //                   ? FONTS.josefinSansBold
  //                   : FONTS.josefinSansRegular,
  //             },
  //           ]}>
  //           MONTH
  //         </Text>
  //       </TouchableOpacity>
  //     </View>

  //     <View // date selection button section
  //       style={styles.tymSelBtnSec}>
  //       <TouchableOpacity // custom start date picker button
  //         onPress={() => setDnStartPkr(true)}
  //         style={[
  //           styles.tymSelBtn,
  //           {
  //             paddingLeft: SIZES.width * 0.01,
  //             justifyContent: 'flex-start',
  //           },
  //         ]}>
  //         <MaterialCommunityIcons
  //           name="calendar-range"
  //           size={25}
  //           color={COLORS.white}
  //         />
  //         <Text // custom start date picker button text
  //           style={styles.txt}>
  //           From: {dnStartDt}
  //         </Text>
  //       </TouchableOpacity>

  //       <DateTimePickerModal // custom start date picker
  //         isVisible={dnStartPkr}
  //         onConfirm={date => {
  //           setDonorList([]),
  //             setDnStartDt(moment(date).format('DD-MMM-YYYY')),
  //             console.log('START CALL'),
  //             getDonorFollowup({
  //               startDate: moment(date).format('DD-MMM-YYYY'),
  //             }),
  //             setDnDuration(''),
  //             setDnStartPkr(false);
  //         }}
  //         onCancel={() => setDnStartPkr(false)}
  //         mode="date"
  //         is24Hour={true}
  //         maximumDate={new Date(dnEndDt)}
  //         date={new Date(dnStartDt)}
  //       />

  //       <TouchableOpacity // custom end date picker button
  //         onPress={() => setDnEndPkr(true)}
  //         style={[
  //           styles.tymSelBtn,
  //           {
  //             borderRightWidth: 0,
  //             paddingLeft: SIZES.width * 0.01,
  //             justifyContent: 'flex-start',
  //           },
  //         ]}>
  //         <MaterialCommunityIcons
  //           name="calendar-range"
  //           size={25}
  //           color={COLORS.white}
  //         />
  //         <Text // custom end date picker button text
  //           style={styles.txt}>
  //           To: {dnEndDt}
  //         </Text>
  //       </TouchableOpacity>

  //       <DateTimePickerModal // custom end date picker
  //         isVisible={dnEndPkr}
  //         onConfirm={date => {
  //           setDonorList([]),
  //             setDnEndDt(moment(date).format('DD-MMM-YYYY')),
  //             console.log('END CALL'),
  //             getDonorFollowup({
  //               endDate: moment(date).format('DD-MMM-YYYY'),
  //             }),
  //             setDnDuration(''),
  //             setDnEndPkr(false);
  //         }}
  //         onCancel={() => setDnEndPkr(false)}
  //         mode="date"
  //         is24Hour={true}
  //         minimumDate={new Date(dnStartDt)}
  //         date={new Date(dnEndDt)}
  //       />
  //     </View>

  //     <FlatList // follow up list
  //       data={donorList}
  //       renderItem={({item, index}) => (
  //         <CardDonor
  //           key={index}
  //           index={index}
  //           data={item}
  //           dnStartDt={dnStartDt}
  //           dnEndDt={dnEndDt}
  //           donorList={donorList}
  //           setDonorList={setDonorList}
  //         />
  //       )}
  //       keyExtractor={(item, index) => item.donorId}
  //       onEndReached={() => getDonorFollowup()}
  //       showsVerticalScrollIndicator={false}
  //       contentContainerStyle={styles.list}
  //     />
  //   </View>
  // );

  // PROSPECT
  // const ThirdRoute = () => (
  //   <View // tab container
  //     style={{flex: 1}}>
  //     <View // time duretion selection button section
  //       style={styles.tymSelBtnSec}>
  //       <TouchableOpacity // day button
  //         onPress={() => {
  //           setProspectList([]);
  //           setPrDuration('DAY'),
  //             console.log('DAY'),
  //             getProspectFollowup({
  //               startDate: moment(new Date()).format('DD-MMM-YYYY'),
  //               endDate: moment(new Date()).format('DD-MMM-YYYY'),
  //             });
  //         }}
  //         style={[
  //           styles.tymSelBtn,
  //           {
  //             backgroundColor:
  //               prDuration === 'DAY' ? COLORS.primary : COLORS.tertiary,
  //           },
  //         ]}>
  //         <Text // day button text
  //           style={[
  //             styles.txt,
  //             {
  //               fontFamily:
  //                 prDuration === 'DAY'
  //                   ? FONTS.josefinSansBold
  //                   : FONTS.josefinSansRegular,
  //             },
  //           ]}>
  //           DAY
  //         </Text>
  //       </TouchableOpacity>

  //       <TouchableOpacity // week button
  //         onPress={() => {
  //           setProspectList([]);
  //           setPrDuration('WEEK'),
  //             console.log('WEEK'),
  //             getProspectFollowup({
  //               startDate: moment(new Date()).format('DD-MMM-YYYY'),
  //               endDate: moment(new Date())
  //                 .add(7, 'days')
  //                 .format('DD-MMM-YYYY'),
  //             });
  //         }}
  //         style={[
  //           styles.tymSelBtn,
  //           {
  //             backgroundColor:
  //               prDuration === 'WEEK' ? COLORS.primary : COLORS.tertiary,
  //           },
  //         ]}>
  //         <Text // week button text
  //           style={[
  //             styles.txt,
  //             {
  //               fontFamily:
  //                 prDuration === 'WEEK'
  //                   ? FONTS.josefinSansBold
  //                   : FONTS.josefinSansRegular,
  //             },
  //           ]}>
  //           WEEK
  //         </Text>
  //       </TouchableOpacity>

  //       <TouchableOpacity // month button
  //         onPress={() => {
  //           setProspectList([]);
  //           setPrDuration('MONTH'),
  //             console.log('MONTH'),
  //             getProspectFollowup({
  //               startDate: moment(new Date()).format('DD-MMM-YYYY'),
  //               endDate: moment(new Date())
  //                 .add(1, 'months')
  //                 .format('DD-MMM-YYYY'),
  //             });
  //         }}
  //         style={[
  //           styles.tymSelBtn,
  //           {
  //             borderRightWidth: 0,
  //             backgroundColor:
  //               prDuration === 'MONTH' ? COLORS.primary : COLORS.tertiary,
  //           },
  //         ]}>
  //         <Text // time duration selection button text
  //           style={[
  //             styles.txt,
  //             {
  //               fontFamily:
  //                 prDuration === 'MONTH'
  //                   ? FONTS.josefinSansBold
  //                   : FONTS.josefinSansRegular,
  //             },
  //           ]}>
  //           MONTH
  //         </Text>
  //       </TouchableOpacity>
  //     </View>

  //     {/* CUSTOM DATE PICKER SECTION */}

  //     <View // custom date picker section
  //       style={styles.tymSelBtnSec}>
  //       <TouchableOpacity // custom start date picker button
  //         onPress={() => setPrStartPkr(true)}
  //         style={[
  //           styles.tymSelBtn,
  //           {
  //             paddingLeft: SIZES.width * 0.01,
  //             justifyContent: 'flex-start',
  //           },
  //         ]}>
  //         <MaterialCommunityIcons
  //           name="calendar-range"
  //           size={25}
  //           color={COLORS.white}
  //         />
  //         <Text // custom start date picker button text
  //           style={styles.txt}>
  //           From: {prStartDt}
  //         </Text>
  //       </TouchableOpacity>

  //       <DateTimePickerModal // custom start date picker
  //         isVisible={prStartPkr}
  //         onConfirm={date => {
  //           setProspectList([]),
  //             setPrStartDt(moment(date).format('DD-MMM-YYYY')),
  //             console.log('START CALL'),
  //             getProspectFollowup({
  //               startDate: moment(date).format('DD-MMM-YYYY'),
  //             }),
  //             setPrDuration(''),
  //             setPrStartPkr(false);
  //         }}
  //         onCancel={() => setPrStartPkr(false)}
  //         mode="date"
  //         is24Hour={true}
  //         maximumDate={new Date(prEndDt)}
  //         date={new Date(prStartDt)}
  //       />

  //       <TouchableOpacity // custom end date picker button
  //         onPress={() => setPrEndPkr(true)}
  //         style={[
  //           styles.tymSelBtn,
  //           {
  //             borderRightWidth: 0,
  //             paddingLeft: SIZES.width * 0.01,
  //             justifyContent: 'flex-start',
  //           },
  //         ]}>
  //         <MaterialCommunityIcons
  //           name="calendar-range"
  //           size={25}
  //           color={COLORS.white}
  //         />
  //         <Text // custom end date picker button text
  //           style={styles.txt}>
  //           Till: {prEndDt}
  //         </Text>
  //       </TouchableOpacity>

  //       <DateTimePickerModal // custom end date picker
  //         isVisible={prEndPkr}
  //         onConfirm={date => {
  //           setProspectList([]),
  //             setPrEndDt(moment(date).format('DD-MMM-YYYY')),
  //             console.log('END CALL'),
  //             getProspectFollowup({
  //               endDate: moment(date).format('DD-MMM-YYYY'),
  //             }),
  //             setPrDuration('');
  //           setPrEndPkr(false);
  //         }}
  //         onCancel={() => setPrEndPkr(false)}
  //         mode="date"
  //         is24Hour={true}
  //         minimumDate={new Date(prStartDt)}
  //         date={new Date(prEndDt)}
  //       />
  //     </View>

  //     <FlatList // follow up list
  //       data={prospectList}
  //       renderItem={({item, index}) => (
  //         <CardProspect
  //           key={index}
  //           index={index}
  //           data={item}
  //           prStartDt={prStartDt}
  //           prEndDt={prEndDt}
  //           prospectList={prospectList}
  //           setProspectList={setProspectList}
  //         />
  //       )}
  //       keyExtractor={(item, index) => item.prospectId}
  //       onEndReached={() => getProspectFollowup()}
  //       showsVerticalScrollIndicator={false}
  //       contentContainerStyle={styles.list}
  //     />
  //   </View>
  // );

  const renderScene = ({route, jumpTo}) => {
    switch (route.key) {
      case 'patron':
        return (
          <PatronTab
            jumpTo={jumpTo}
            ptDuration={ptDuration}
            setPtDuration={setPtDuration}
            ptEndDt={ptEndDt}
            setPtEndDt={setPtEndDt}
            ptEndPkr={ptEndPkr}
            setPtEndPkr={setPtEndPkr}
            ptStartDt={ptStartDt}
            setPtStartDt={setPtStartDt}
            ptStartPkr={ptStartPkr}
            setPtStartPkr={setPtStartPkr}
            patronList={patronList}
            setPatronList={setPatronList}
            getPatronFollowup={getPatronFollowup}
            skeletonLoader={skeletonLoader}
            setSpinnerLoader={setSpinnerLoader}
          />
        );
      case 'donor':
        return (
          <DonorTab
            jumpTo={jumpTo}
            dnDuration={dnDuration}
            setDnDuration={setDnDuration}
            dnStartPkr={dnStartPkr}
            setDnStartPkr={setDnStartPkr}
            dnEndPkr={dnEndPkr}
            setDnEndPkr={setDnEndPkr}
            dnStartDt={dnStartDt}
            setDnStartDt={setDnStartDt}
            dnEndDt={dnEndDt}
            setDnEndDt={setDnEndDt}
            getDonorFollowup={getDonorFollowup}
            donorList={donorList}
            setDonorList={setDonorList}
            skeletonLoader={skeletonLoader}
            setSpinnerLoader={setSpinnerLoader}
          />
        );
      case 'prospect':
        return (
          <ProspectTab
            jumpTo={jumpTo}
            prDuration={prDuration}
            setPrDuration={setPrDuration}
            prStartPkr={prStartPkr}
            setPrStartPkr={setPrStartPkr}
            prEndPkr={prEndPkr}
            setPrEndPkr={setPrEndPkr}
            prStartDt={prStartDt}
            setPrStartDt={setPrStartDt}
            prEndDt={prEndDt}
            setPrEndDt={setPrEndDt}
            getProspectFollowup={getProspectFollowup}
            prospectList={prospectList}
            setProspectList={setProspectList}
            skeletonLoader={skeletonLoader}
            setSpinnerLoader={setSpinnerLoader}
          />
        );
    }
  };

  const renderTabBar = props => {
    return (
      <TabBar
        {...props}
        indicatorStyle={{
          backgroundColor: COLORS.white,
        }}
        style={styles.tabbar}
        renderLabel={({route, focused}) => (
          <Text
            style={{
              fontFamily: FONTS.josefinSansMedium,
              color: focused ? COLORS.white : COLORS.antiFlashWhite,
            }}>
            {route.title}
          </Text>
        )}
      />
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
        <Header // header
          headerStyle={{zIndex: 1}}
          color={COLORS.black}
          leftButtonIcon="menu"
          title="FOLLOW UP"
          onPressLeft={() => navigation.openDrawer()}
        />
        <TabView
          renderTabBar={renderTabBar}
          navigationState={{index, routes}}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{width: SIZES.width}}
        />

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
      </LinearGradient>
    </Animated.View>
  );
};

export default FollowUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: COLORS.white,
  },
  tabbar: {
    backgroundColor: 'transparent',
    elevation: 0,
    shadowOpacity: 0,
  },
  tymSelBtnSec: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.white + '95',
    borderRadius: SIZES.radiusSmall,
    overflow: 'hidden',
    marginTop: SIZES.height * 0.02,
    marginHorizontal: SIZES.width * 0.02,
    height: SIZES.height * 0.06,
  },
  tymSelBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    backgroundColor: COLORS.tertiary,
    borderRightWidth: 2,
    borderColor: COLORS.antiFlashWhite,
  },
  txt: {
    fontSize: SIZES.fontSmall,
    color: COLORS.white,
    fontFamily: FONTS.josefinSansRegular,
  },
  list: {
    alignItems: 'center',
    paddingBottom: SIZES.paddingMedium,
    marginTop: SIZES.paddingSmall,
  },
});
