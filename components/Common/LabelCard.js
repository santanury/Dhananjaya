import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {SIZES, COLORS, FONTS, SHADOW} from '../../constants';

const LabelCard = props => {
  return (
    <View style={[styles.container, props.style]}>
      <View // header
        style={styles.header}>
        <Text // header text
          style={styles.txt}>
          {props.name}
        </Text>
        {props.rightItem}
      </View>
      <View // separator
        style={styles.separator}
      />
      {props.children}
    </View>
  );
};

export default LabelCard;

const styles = StyleSheet.create({
  container: {
    padding: SIZES.paddingMedium,
    width: SIZES.width * 0.9,
    marginBottom: SIZES.paddingMedium,
    borderRadius: SIZES.radiusMedium,
    backgroundColor: COLORS.white,
    ...SHADOW,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  txt: {
    flex: 10,
    fontFamily: FONTS.josefinSansSemiBold,
    fontSize: SIZES.fontSmall,
    color: COLORS.black,
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.gray,
    marginVertical: SIZES.paddingMedium,
  },
});
