import {Text, View, StyleSheet} from 'react-native';
import React from 'react';
import {COLORS, SIZES, FONTS} from '../../constants';
import {Actionsheet} from 'native-base';

const AnimatableLowerModal = props => {
  return (
    <Actionsheet // sort actionsheet
      isOpen={props.isOpen}
      onClose={() => props.onClose()}
      size="full">
      <Actionsheet.Content>
        <Text // modal title
          style={styles.txt}>
          {props.title}
        </Text>
        {props.children}
      </Actionsheet.Content>
    </Actionsheet>
  );
};

export default AnimatableLowerModal;

const styles = StyleSheet.create({
  txt: {
    fontFamily: FONTS.josefinSansSemiBold,
    fontSize: SIZES.fontMedium,
    color: COLORS.black,
    marginVertical: SIZES.paddingMedium,
  },
});
