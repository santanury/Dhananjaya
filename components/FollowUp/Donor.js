import {StyleSheet, Text, View, TouchableOpacity, FlatList} from 'react-native';
import React, {useState, useEffect} from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {showMessage} from 'react-native-flash-message';
import axios from 'axios';
import moment from 'moment';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {COLORS, FONTS, SIZES} from '../../constants';
import {Store} from '../../store/Store';

import {
  baseUrl,
  accessKey,
  get_patron_followup_list,
  get_donor_followup_list,
  get_prospect_followup_list,
} from '../../webApi/service';

// components
import CardDonor from './CardDonor';

const Donor = () => {
  const store = Store();

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

  useEffect(() => {
    const unSubscribe = navigation.addListener('focus', () => {
      getDonorFollowup();
    });
    return unSubscribe;
  }, []);

  // get donor followup
  const getDonorFollowup = async duration => {
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
      })
      .catch(error => {
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
    <View // tab container
      style={{flex: 1}}>
      <View // time duretion selection button section
        style={styles.tymSelBtnSec}>
        <TouchableOpacity // day button
          onPress={() => {
            setDonorList([]);
            setDnDuration('DAY'),
              console.log('DAY'),
              getDonorFollowup({
                startDate: moment(new Date()).format('DD-MMM-YYYY'),
                endDate: moment(new Date()).format('DD-MMM-YYYY'),
              });
          }}
          style={[
            styles.tymSelBtn,
            {
              backgroundColor:
                dnDuration === 'DAY' ? COLORS.primary : COLORS.tertiary,
            },
          ]}>
          <Text // day button text
            style={[
              styles.txt,
              {
                fontFamily:
                  dnDuration === 'DAY'
                    ? FONTS.josefinSansBold
                    : FONTS.josefinSansRegular,
              },
            ]}>
            DAY
          </Text>
        </TouchableOpacity>

        <TouchableOpacity // week button
          onPress={() => {
            setDonorList([]);
            setDnDuration('WEEK'),
              console.log('WEEK'),
              getDonorFollowup({
                startDate: moment(new Date()).format('DD-MMM-YYYY'),
                endDate: moment(new Date())
                  .add(1, 'weeks')
                  .format('DD-MMM-YYYY'),
              });
          }}
          style={[
            styles.tymSelBtn,
            {
              backgroundColor:
                dnDuration === 'WEEK' ? COLORS.primary : COLORS.tertiary,
            },
          ]}>
          <Text // week button text
            style={[
              styles.txt,
              {
                fontFamily:
                  dnDuration === 'WEEK'
                    ? FONTS.josefinSansBold
                    : FONTS.josefinSansRegular,
              },
            ]}>
            WEEK
          </Text>
        </TouchableOpacity>

        <TouchableOpacity // month button
          onPress={() => {
            setDonorList([]);
            setDnDuration('MONTH'),
              console.log('MONTH'),
              getDonorFollowup({
                startDate: moment(new Date()).format('DD-MMM-YYYY'),
                endDate: moment(new Date())
                  .add(1, 'months')
                  .format('DD-MMM-YYYY'),
              });
          }}
          style={[
            styles.tymSelBtn,
            {
              borderRightWidth: 0,
              backgroundColor:
                dnDuration === 'MONTH' ? COLORS.primary : COLORS.tertiary,
            },
          ]}>
          <Text // month button text
            style={[
              styles.txt,
              {
                fontFamily:
                  dnDuration === 'MONTH'
                    ? FONTS.josefinSansBold
                    : FONTS.josefinSansRegular,
              },
            ]}>
            MONTH
          </Text>
        </TouchableOpacity>
      </View>

      <View // date selection button section
        style={styles.tymSelBtnSec}>
        <TouchableOpacity // custom start date picker button
          onPress={() => setDnStartPkr(true)}
          style={[
            styles.tymSelBtn,
            {
              paddingLeft: SIZES.width * 0.01,
              justifyContent: 'flex-start',
            },
          ]}>
          <MaterialCommunityIcons
            name="calendar-range"
            size={25}
            color={COLORS.white}
          />
          <Text // custom start date picker button text
            style={styles.txt}>
            From: {dnStartDt}
          </Text>
        </TouchableOpacity>

        <DateTimePickerModal // custom start date picker
          isVisible={dnStartPkr}
          onConfirm={date => {
            setDonorList([]),
              setDnStartDt(moment(date).format('DD-MMM-YYYY')),
              console.log('START CALL'),
              getDonorFollowup({
                startDate: moment(date).format('DD-MMM-YYYY'),
              }),
              setDnDuration(''),
              setDnStartPkr(false);
          }}
          onCancel={() => setDnStartPkr(false)}
          mode="date"
          is24Hour={true}
          maximumDate={new Date(dnEndDt)}
          date={new Date(dnStartDt)}
        />

        <TouchableOpacity // custom end date picker button
          onPress={() => setDnEndPkr(true)}
          style={[
            styles.tymSelBtn,
            {
              borderRightWidth: 0,
              paddingLeft: SIZES.width * 0.01,
              justifyContent: 'flex-start',
            },
          ]}>
          <MaterialCommunityIcons
            name="calendar-range"
            size={25}
            color={COLORS.white}
          />
          <Text // custom end date picker button text
            style={styles.txt}>
            To: {dnEndDt}
          </Text>
        </TouchableOpacity>

        <DateTimePickerModal // custom end date picker
          isVisible={dnEndPkr}
          onConfirm={date => {
            setDonorList([]),
              setDnEndDt(moment(date).format('DD-MMM-YYYY')),
              console.log('END CALL'),
              getDonorFollowup({
                endDate: moment(date).format('DD-MMM-YYYY'),
              }),
              setDnDuration(''),
              setDnEndPkr(false);
          }}
          onCancel={() => setDnEndPkr(false)}
          mode="date"
          is24Hour={true}
          minimumDate={new Date(dnStartDt)}
          date={new Date(dnEndDt)}
        />
      </View>

      <FlatList // follow up list
        data={donorList}
        renderItem={({item, index}) => (
          <CardDonor
            key={index}
            index={index}
            data={item}
            dnStartDt={dnStartDt}
            dnEndDt={dnEndDt}
            donorList={donorList}
            setDonorList={setDonorList}
          />
        )}
        keyExtractor={(item, index) => item.donorId}
        onEndReached={() => getDonorFollowup()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

export default Donor;

const styles = StyleSheet.create({
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
    marginTop: SIZES.paddingSmall,
    marginHorizontal: SIZES.paddingSmall,
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
});
