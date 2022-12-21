import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React from 'react';
import * as Animatable from 'react-native-animatable';
import {COLORS, SIZES, FONTS, SHADOW} from '../../constants';
import LinearGradient from 'react-native-linear-gradient';

const DonorSearchCard = props => {
  return (
    <Animatable.View // container
      animation={'zoomIn'}
      duration={700}
      delay={props.index * 100}
      style={styles.container}>
      <TouchableOpacity // card button
        onPress={() => props.onPress()}>
        {/* HEADER */}

        <LinearGradient
          style={styles.header}
          colors={['#599D5570', '#599D5560', '#599D5550']}>
          <Text // name on the card
            style={styles.identifierTxt}>
            {`${props?.data?.salutation && props?.data?.salutation} ${
              props?.data?.firstName && props?.data?.firstName
            } ${props?.data?.lastName && props?.data?.lastName}`}
          </Text>

          <Text // donor id
            style={styles.valueTxt}>
            {props?.data?.donorId && props?.data?.donorId}
          </Text>

          <Text // preacher code
            style={styles.valueTxt}>
            {props?.data?.preacherCode && props?.data?.preacherCode}
          </Text>
        </LinearGradient>

        {/* CARD BODY CONTEND */}

        <View style={styles.body}>
          <Text // mobile number
            style={[styles.valueTxt, {marginTop: SIZES.paddingSmall}]}>
            {props?.data?.mobileNumber && props?.data?.mobileNumber}
          </Text>

          <Text // mobile number
            style={styles.valueTxt}>
            {props?.data?.email && props?.data?.email}
          </Text>
        </View>
      </TouchableOpacity>
    </Animatable.View>
  );
};

export default DonorSearchCard;

const styles = StyleSheet.create({
  container: {
    width: SIZES.width * 0.9,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusMedium,
    padding: SIZES.paddingSmall,
    marginBottom: SIZES.paddingMedium,
    ...SHADOW,
  },
  header: {
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
    flex: 1,
    color: COLORS.black,
    fontSize: SIZES.fontSmall,
    fontFamily: FONTS.josefinSansRegular,
  },
  body: {
    flex: 1,
  },
});
