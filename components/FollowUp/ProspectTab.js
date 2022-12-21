import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React from 'react';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {FlatList} from 'react-native-gesture-handler';
import {COLORS, FONTS, SIZES} from '../../constants';
import {PropspectSkeleton as SkeletonLoader} from './SkeletonLoader';
import CardProspect from './CardProspect';

const ProspectTab = ({
  prDuration,
  setPrDuration,
  prStartPkr,
  setPrStartPkr,
  prEndPkr,
  setPrEndPkr,
  prStartDt,
  setPrStartDt,
  prEndDt,
  setPrEndDt,
  getProspectFollowup,
  prospectList,
  setProspectList,
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
            setProspectList([]);
            setPrDuration('DAY'),
              console.log('DAY'),
              getProspectFollowup({
                startDate: moment(new Date()).format('DD-MMM-YYYY'),
                endDate: moment(new Date()).format('DD-MMM-YYYY'),
              });
          }}
          style={[
            styles.tymSelBtn,
            {
              backgroundColor:
                prDuration === 'DAY' ? COLORS.primary : COLORS.tertiary,
            },
          ]}>
          <Text // day button text
            style={[
              styles.txt,
              {
                fontFamily:
                  prDuration === 'DAY'
                    ? FONTS.josefinSansBold
                    : FONTS.josefinSansRegular,
              },
            ]}>
            DAY
          </Text>
        </TouchableOpacity>

        <TouchableOpacity // week button
          onPress={() => {
            setProspectList([]);
            setPrDuration('WEEK'),
              console.log('WEEK'),
              getProspectFollowup({
                startDate: moment(new Date()).format('DD-MMM-YYYY'),
                endDate: moment(new Date())
                  .add(7, 'days')
                  .format('DD-MMM-YYYY'),
              });
          }}
          style={[
            styles.tymSelBtn,
            {
              backgroundColor:
                prDuration === 'WEEK' ? COLORS.primary : COLORS.tertiary,
            },
          ]}>
          <Text // week button text
            style={[
              styles.txt,
              {
                fontFamily:
                  prDuration === 'WEEK'
                    ? FONTS.josefinSansBold
                    : FONTS.josefinSansRegular,
              },
            ]}>
            WEEK
          </Text>
        </TouchableOpacity>

        <TouchableOpacity // month button
          onPress={() => {
            setProspectList([]);
            setPrDuration('MONTH'),
              console.log('MONTH'),
              getProspectFollowup({
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
                prDuration === 'MONTH' ? COLORS.primary : COLORS.tertiary,
            },
          ]}>
          <Text // time duration selection button text
            style={[
              styles.txt,
              {
                fontFamily:
                  prDuration === 'MONTH'
                    ? FONTS.josefinSansBold
                    : FONTS.josefinSansRegular,
              },
            ]}>
            MONTH
          </Text>
        </TouchableOpacity>
      </View>

      {/* CUSTOM DATE PICKER SECTION */}

      <View // custom date picker section
        style={styles.tymSelBtnSec}>
        <TouchableOpacity // custom start date picker button
          onPress={() => setPrStartPkr(true)}
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
            From: {prStartDt}
          </Text>
        </TouchableOpacity>

        <DateTimePickerModal // custom start date picker
          isVisible={prStartPkr}
          onConfirm={date => {
            setPrStartPkr(!prStartPkr);
            setProspectList([]);
            setPrStartDt(moment(date).format('DD-MMM-YYYY'));
            console.log('START CALL');
            getProspectFollowup({
              startDate: moment(date).format('DD-MMM-YYYY'),
            });
            setPrDuration('');
          }}
          onCancel={() => setPrStartPkr(false)}
          mode="date"
          is24Hour={true}
          maximumDate={new Date(prEndDt)}
          date={new Date(prStartDt)}
        />

        <TouchableOpacity // custom end date picker button
          onPress={() => setPrEndPkr(true)}
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
            Till: {prEndDt}
          </Text>
        </TouchableOpacity>

        <DateTimePickerModal // custom end date picker
          isVisible={prEndPkr}
          onConfirm={date => {
            setPrEndPkr(!prEndPkr);
            setProspectList([]);
            setPrEndDt(moment(date).format('DD-MMM-YYYY'));
            console.log('END CALL');
            getProspectFollowup({
              endDate: moment(date).format('DD-MMM-YYYY'),
            });
            setPrDuration('');
          }}
          onCancel={() => setPrEndPkr(false)}
          mode="date"
          is24Hour={true}
          minimumDate={new Date(prStartDt)}
          date={new Date(prEndDt)}
        />
      </View>
      {prospectList.length === 0 && skeletonLoader ? (
        <SkeletonLoader />
      ) : (
        <FlatList // follow up list
          data={prospectList}
          renderItem={({item, index}) => (
            <CardProspect
              key={index}
              index={index}
              data={item}
              prStartDt={prStartDt}
              prEndDt={prEndDt}
              prospectList={prospectList}
              setProspectList={setProspectList}
              setSpinnerLoader={setSpinnerLoader}
            />
          )}
          keyExtractor={(item, index) => item.prospectId}
          onEndReached={() => getProspectFollowup()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
};

export default ProspectTab;

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
