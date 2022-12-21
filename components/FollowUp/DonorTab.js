import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React from 'react';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {FlatList} from 'react-native-gesture-handler';
import {COLORS, FONTS, SIZES} from '../../constants';
import {DonorSkeleton as SkeletonLoader} from './SkeletonLoader';
import CardDonor from './CardDonor';

const DonorTab = ({
  dnDuration,
  setDnDuration,
  dnStartPkr,
  setDnStartPkr,
  dnEndPkr,
  setDnEndPkr,
  dnStartDt,
  setDnStartDt,
  dnEndDt,
  setDnEndDt,
  getDonorFollowup,
  donorList,
  setDonorList,
  skeletonLoader,
  setSpinnerLoader,
}) => {
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
            setDnStartPkr(!dnStartPkr);
            setDonorList([]);
            setDnStartDt(moment(date).format('DD-MMM-YYYY'));
            console.log('START CALL');
            getDonorFollowup({
              startDate: moment(date).format('DD-MMM-YYYY'),
            });
            setDnDuration('');
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
            setDnEndPkr(!dnEndPkr);
            setDonorList([]);
            setDnEndDt(moment(date).format('DD-MMM-YYYY'));
            console.log('END CALL');
            getDonorFollowup({
              endDate: moment(date).format('DD-MMM-YYYY'),
            });
            setDnDuration('');
          }}
          onCancel={() => setDnEndPkr(false)}
          mode="date"
          is24Hour={true}
          minimumDate={new Date(dnStartDt)}
          date={new Date(dnEndDt)}
        />
      </View>
      {donorList.length === 0 && skeletonLoader ? (
        <SkeletonLoader />
      ) : (
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
              setSpinnerLoader={setSpinnerLoader}
            />
          )}
          keyExtractor={(item, index) => item.donorId}
          onEndReached={() => getDonorFollowup()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          setSpinnerLoader={setSpinnerLoader}
        />
      )}
    </View>
  );
};

export default DonorTab;

const styles = StyleSheet.create({
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
