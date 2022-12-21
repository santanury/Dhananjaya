import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {SIZES, COLORS, FONTS, SHADOW} from '../../constants';

const CollapsableSection = props => {
  return (
    // container
    <View style={[styles.container, props.style]}>
      <TouchableOpacity // header container
        activeOpacity={0.8}
        onPress={() => props.setOpen(!props.open)}
        style={styles.header}>
        {props.leftItem}
        <Text // header text
          style={styles.txt}>
          {props.name}
        </Text>
        {props.rightItem}
        {props.open ? (
          <MaterialCommunityIcons // collapse icon
            name="chevron-up"
            size={25}
            color={COLORS.gray}
          />
        ) : (
          <MaterialCommunityIcons // expand icon
            name="chevron-down"
            size={25}
            color={COLORS.gray}
          />
        )}
      </TouchableOpacity>
      {props.open && props.children}
    </View>
  );
};

export default CollapsableSection;

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
    flex: 4,
    fontSize: SIZES.fontSmall,
    fontFamily: FONTS.josefinSansBold,
    color: COLORS.black,
  },
});
