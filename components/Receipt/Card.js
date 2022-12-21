import {StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import {Store} from '../../store/Store';
import {COLORS, SIZES, FONTS, SHADOW} from '../../constants';

const Card = props => {
  const store = Store();

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
        <View // name & prospect id
          style={{flex: 1}}>
          <Text // name on the card
            style={styles.identifierTxt}>
            {props?.data?.donorName}
          </Text>
          <Text // prospect id
            style={styles.valueTxt}>
            {props?.data?.donorId}
          </Text>
        </View>
      </LinearGradient>

      {/* CARD BODY CONTENT */}
      <>
        <View // dr number container
          style={[styles.detailsSection, {flex: 1}]}>
          <Text // dr number identifier
            style={styles.identifierTxt}>
            DR No:
          </Text>
          <Text // dr number value
            style={[styles.valueTxt, {flex: 1.5}]}>
            {props?.data?.drNumber}
          </Text>
          <Text // dr date identifier
            style={[styles.identifierTxt, {flex: 0.7}]}>
            Date:
          </Text>
          <Text // dr date value
            style={[styles.valueTxt, {flex: 1.5}]}>
            {props?.data?.drDate}
          </Text>
        </View>

        <View // separator
          style={styles.separator}
        />

        <View // seva container
          style={styles.detailsSection}>
          <Text // seva identifier
            style={styles.identifierTxt}>
            Seva:
          </Text>
          <Text // seva value
            style={styles.valueTxt}>
            {props?.data?.sevaCode}
          </Text>
        </View>

        <View // separator
          style={styles.separator}
        />

        <View // amount container
          style={[styles.detailsSection, {flex: 1}]}>
          <Text // amount identifier
            style={styles.identifierTxt}>
            Amount:
          </Text>
          <Text // amount value
            style={[styles.valueTxt, {flex: 1.5}]}>
            {props?.data?.amount}
          </Text>
          <Text // payment mode identifier
            style={[styles.identifierTxt, {flex: 0.7}]}>
            Mode:
          </Text>
          <Text // payment mode value
            style={[styles.valueTxt, {flex: 1.5}]}>
            {props?.data?.paymentMode}
          </Text>
        </View>

        <View // separator
          style={styles.separator}
        />

        <View // 80G container
          style={styles.detailsSection}>
          <Text // 80G identifier
            style={styles.identifierTxt}>
            80(G) Opted:
          </Text>
          <Text // 80G value
            style={[styles.valueTxt, {flex: 2}]}>
            {props?.data?.is80gRequired}
          </Text>
        </View>
      </>
    </Animatable.View>
  );
};

export default Card;

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
