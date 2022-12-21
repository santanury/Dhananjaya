import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {SIZES, COLORS, FONTS, SHADOW} from '../../constants';

const Section = props => {
  return (
    <View style={[styles.container, props.style]}>
      <View // header container
        style={styles.header}>
        {props.leftItem}
        <Text // header text
          style={styles.txt}>
          {props.name}
        </Text>
        {props.rightItem}
      </View>
      {props.children}
    </View>
  );
};

export default Section;

const styles = StyleSheet.create({
  container: {
    padding: SIZES.paddingSmall,
    width: SIZES.width * 0.9,
    marginBottom: SIZES.paddingMedium,
    borderRadius: SIZES.radiusMedium,
    backgroundColor: COLORS.white,
    ...SHADOW,
  },
  header: {
    height: SIZES.height * 0.07,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.paddingSmall,
    borderRadius: SIZES.radiusMedium - 3,
    backgroundColor: COLORS.palePink,
  },
  txt: {
    flex: 1,
    fontSize: SIZES.fontSmall,
    fontFamily: FONTS.josefinSansBold,
    color: COLORS.black,
  },
});
