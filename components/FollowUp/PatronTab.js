import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React from 'react';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {FlatList} from 'react-native-gesture-handler';
import {COLORS, FONTS, SIZES} from '../../constants';
import CardPatron from './CardPatron';
import {PatronSkeleton as SkeletonLoader} from './SkeletonLoader';

const PatronTab = ({
  jumpTo,
  ptDuration,
  ptEndDt,
  ptEndPkr,
  ptStartDt,
  ptStartPkr,
  setPtDuration,
  setPatronList,
  setPtEndDt,
  getPatronFollowup,
  setPtEndPkr,
  patronList,
  setPtStartPkr,
  setPtStartDt,
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
            setPatronList([]);
            setPtDuration('DAY'),
              console.log('DAY'),
              getPatronFollowup({
                startDate: moment(new Date()).format('DD-MMM-YYYY'),
                endDate: moment(new Date()).format('DD-MMM-YYYY'),
              });
          }}
          style={[
            styles.tymSelBtn,
            {
              backgroundColor:
                ptDuration === 'DAY' ? COLORS.primary : COLORS.tertiary,
            },
          ]}>
          <Text // day button text
            style={[
              styles.txt,
              {
                fontFamily:
                  ptDuration === 'DAY'
                    ? FONTS.josefinSansBold
                    : FONTS.josefinSansRegular,
              },
            ]}>
            DAY
          </Text>
        </TouchableOpacity>

        <TouchableOpacity // week button
          onPress={() => {
            setPatronList([]);
            setPtDuration('WEEK'),
              console.log('WEEK'),
              getPatronFollowup({
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
                ptDuration === 'WEEK' ? COLORS.primary : COLORS.tertiary,
            },
          ]}>
          <Text // week button text
            style={[
              styles.txt,
              {
                fontFamily:
                  ptDuration === 'WEEK'
                    ? FONTS.josefinSansBold
                    : FONTS.josefinSansRegular,
              },
            ]}>
            WEEK
          </Text>
        </TouchableOpacity>

        <TouchableOpacity // month button
          onPress={() => {
            setPatronList([]);
            setPtDuration('MONTH'),
              console.log('MONTH'),
              getPatronFollowup({
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
                ptDuration === 'MONTH' ? COLORS.primary : COLORS.tertiary,
            },
          ]}>
          <Text // month button text
            style={[
              styles.txt,
              {
                fontFamily:
                  ptDuration === 'MONTH'
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
        <TouchableOpacity // start date picker button
          onPress={() => setPtStartPkr(true)}
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
          <Text // start date picker button text
            style={styles.txt}>
            From: {ptStartDt}
          </Text>
        </TouchableOpacity>

        <DateTimePickerModal // custom start date picker
          isVisible={ptStartPkr}
          onConfirm={date => {
            setPtStartPkr(!ptStartPkr);
            setPatronList([]);
            setPtStartDt(moment(date).format('DD-MMM-YYYY'));
            console.log('START CALL');
            getPatronFollowup({
              startDate: moment(date).format('DD-MMM-YYYY'),
            });
            setPtDuration('');
          }}
          onCancel={() => setPtStartPkr(false)}
          mode="date"
          is24Hour={true}
          maximumDate={new Date(ptEndDt)}
          date={new Date(ptStartDt)}
        />

        <TouchableOpacity // end date picker button
          onPress={() => setPtEndPkr(true)}
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
          <Text // end date picker button text
            style={styles.txt}>
            To: {ptEndDt}
          </Text>
        </TouchableOpacity>

        <DateTimePickerModal // custom end date picker
          isVisible={ptEndPkr}
          onConfirm={date => {
            setPtEndPkr(!ptEndPkr);
            setPatronList([]);
            setPtEndDt(moment(date).format('DD-MMM-YYYY'));
            console.log('END CALL');
            getPatronFollowup({endDate: moment(date).format('DD-MMM-YYYY')});
            setPtDuration('');
          }}
          onCancel={() => setPtEndPkr(false)}
          mode="date"
          is24Hour={true}
          minimumDate={new Date(ptStartDt)}
          date={new Date(ptEndDt)}
        />
      </View>

      {patronList.length === 0 && skeletonLoader ? (
        <SkeletonLoader />
      ) : (
        <FlatList // follow up list
          data={patronList}
          renderItem={({item, index}) => (
            <CardPatron
              key={index}
              index={index}
              data={item}
              ptStartDt={ptStartDt}
              ptEndDt={ptEndDt}
              ptDuration={ptDuration}
              patronList={patronList}
              setPatronList={setPatronList}
              setSpinnerLoader={setSpinnerLoader}
            />
          )}
          keyExtractor={(item, index) => item.patronId}
          onEndReached={() => getPatronFollowup()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
};

export default PatronTab;

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
