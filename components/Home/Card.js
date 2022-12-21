import {StyleSheet, Text, Image, View, TouchableOpacity} from 'react-native';
import React from 'react';
import * as Animatable from 'react-native-animatable';
import {COLORS, SIZES, FONTS} from '../../constants';

const Card = props => {
  return (
    <Animatable.View
      animation={'fadeInDown'}
      duration={1000}
      delay={props.index * 50}
      style={styles.container}>
      <TouchableOpacity // card as container
        style={{alignItems: 'center', justifyContent: 'center'}}
        onPress={props.onPress}>
        <Image // card image
          source={props.icon}
          style={styles.image}
        />
        <Text // card text
          style={styles.text}>
          {props.name}
        </Text>
      </TouchableOpacity>
    </Animatable.View>
  );
};

export default Card;

const styles = StyleSheet.create({
  container: {
    marginTop: '5%',
    marginLeft: SIZES.width * 0.05,
    height: SIZES.height * 0.17,
    width: SIZES.width * 0.266666666666666,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: SIZES.radiusBig,
    backgroundColor: COLORS.white,
    shadowColor: COLORS.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 10,
  },
  image: {
    height: SIZES.height * 0.1,
    width: SIZES.width * 0.1,
    resizeMode: 'contain',
  },
  text: {
    fontFamily: FONTS.josefinSansMedium,
    fontSize: SIZES.fontSmall,
    color: COLORS.black,
    textAlign: 'center',
    paddingHorizontal: '5%',
  },
});
