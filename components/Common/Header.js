import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {COLORS, SIZES, FONTS} from '../../constants';

const Header = props => {
  return (
    <View // header as container
      style={[styles.container, props.headerStyle]}>
      {props.leftButtonIcon && (
        <TouchableOpacity // left button as touchable
          style={{zIndex: 1}}
          onPress={props.onPressLeft}>
          <MaterialCommunityIcons // icon
            name={props.leftButtonIcon}
            size={35}
            color={COLORS.black}
          />
        </TouchableOpacity>
      )}
      <Text // title
        style={styles.title}>
        {props.title}
      </Text>
      {props.headerRight && props.headerRight}
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    height: SIZES.height * 0.075,
    width: SIZES.width,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    backgroundColor: 'transparent',
  },
  title: {
    fontFamily: FONTS.josefinSansMedium,
    width: SIZES.width,
    fontSize: SIZES.fontMedium,
    position: 'absolute',
    textAlign: 'center',
    letterSpacing: 0.5,
    color: COLORS.black,
  },
});
