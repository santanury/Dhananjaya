import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {COLORS, FONTS, SIZES, SHADOW} from '../../constants';

const PrimaryButton = props => {
  return (
    // button as container
    <TouchableOpacity
      disabled={props.disabled}
      style={[styles.button, props.style]}
      onPress={props.onPress}>
      {props.icon && (
        <MaterialCommunityIcons // icon
          style={[props.iconStyle]}
          name={props.icon}
          size={25}
          color={props.iconColor ? props.iconColor : COLORS.white}
        />
      )}
      {props.name && (
        <Text // label
          style={[
            styles.buttonText,
            props.icon && props.name && {marginLeft: SIZES.paddingMedium},
            props.textStyle,
          ]}>
          {props.name}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default PrimaryButton;

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
    height: SIZES.height * 0.065,
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radiusSmall,
    shadowColor: COLORS.black,
    ...SHADOW,
  },
  buttonText: {
    fontFamily: FONTS.josefinSansSemiBold,
    fontSize: SIZES.fontMedium,
    color: COLORS.white,
  },
});
