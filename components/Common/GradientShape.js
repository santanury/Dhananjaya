import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {COLORS, SIZES, SHADOW} from '../../constants';

const GradientShape = () => {
  return (
    <LinearGradient // triangle shape
      colors={[
        COLORS.primary,
        COLORS.primary,
        COLORS.primary,
        COLORS.mistyMoss,
      ]}
      style={{
        width: SIZES.height * 2,
        height: SIZES.height,
        position: 'absolute',
        alignSelf: 'center',
        top: -SIZES.height / 1.7,
        borderRadius: SIZES.radiusHuge,
        backgroundColor: COLORS.primary,
        transform: [{rotate: '-25deg'}],
        ...SHADOW,
      }}
    />
  );
};

export default GradientShape;
