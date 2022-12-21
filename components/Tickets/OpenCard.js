import {StyleSheet, TouchableOpacity, Text, View} from 'react-native';
import React, {useState} from 'react';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import moment from 'moment';
import {Store} from '../../store/Store';
import {COLORS, SIZES, FONTS, SHADOW} from '../../constants';

const OpenCard = props => {
  return (
    <Animatable.View // container
      animation={'zoomIn'}
      duration={700}
      delay={props.index * 100}
      style={styles.container}>
      {/* CARD HEADER */}

      <LinearGradient // card header
        style={styles.header}
        colors={[
          COLORS.activeGreen + '70',
          COLORS.activeGreen + '60',
          COLORS.activeGreen + '50',
        ]}>
        <TouchableOpacity
          onPress={() => {
            props?.navigation.navigate('TicketDetails', props?.data);
          }}
          activeOpacity={1}
          style={{flex: 1}}>
          <View // ticket number
            style={{flex: 1}}>
            <Text style={styles.identifierTxt}>{props?.data?.requestNo}</Text>
          </View>

          <View // date
          >
            <Text style={styles.valueTxt}>
              {moment(props?.data?.createdOntime, 'YYYY-MM-DD').format(
                'DD-MMM-YYYY',
              )}
            </Text>
          </View>
        </TouchableOpacity>
      </LinearGradient>

      {/* CARD BODY CONTENT */}
      <>
        <View // subject container
          style={styles.detailsSection}>
          <Text // subject identifier
            style={styles.identifierTxt}>
            Subject:
          </Text>
          <Text // subject value
            style={[styles.valueTxt, {flex: 1.5}]}>
            {props?.data?.requestSubject}
          </Text>
        </View>

        <View // separator
          style={styles.separator}
        />

        <View // description container
          style={styles.detailsSection}>
          <Text // description identifier
            style={styles.identifierTxt}>
            Description:
          </Text>
          <Text // description value
            style={[styles.valueTxt, {flex: 1.5}]}>
            {props?.data?.requestDescription}
          </Text>
        </View>

        {props?.data?.requestAssignedTo?.replace(/ /g, '')?.length > 0 && (
          <>
            <View // separator
              style={styles.separator}
            />

            <View // assign to container
              style={styles.detailsSection}>
              <Text // assign to identifier
                style={styles.identifierTxt}>
                Assign To:
              </Text>
              <Text // assign to value
                style={[styles.valueTxt, {flex: 1.5}]}>
                {props?.data?.requestAssignedTo}
              </Text>
            </View>
          </>
        )}
      </>
    </Animatable.View>
  );
};

export default OpenCard;

const styles = StyleSheet.create({
  container: {
    width: SIZES.width * 0.9,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusMedium,
    marginBottom: SIZES.paddingMedium,
    padding: SIZES.paddingSmall,
    ...SHADOW,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: SIZES.paddingSmall,
    borderRadius: SIZES.radiusMedium - 3,
    backgroundColor: COLORS.white,
  },
  identifierTxt: {
    flex: 1,
    color: COLORS.black,
    fontSize: SIZES.fontSmall,
    fontFamily: FONTS.josefinSansBold,
  },
  valueTxt: {
    flex: 3.7,
    color: COLORS.black,
    fontSize: SIZES.fontSmall,
    fontFamily: FONTS.josefinSansRegular,
  },
  separator: {
    height: 1,
    width: '100%',
    backgroundColor: COLORS.lightGray,
  },
  detailsSection: {
    padding: SIZES.paddingSmall,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
