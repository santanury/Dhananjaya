import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React from 'react';
import {Modal} from 'native-base';
import * as Animatable from 'react-native-animatable';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {COLORS, SIZES, FONTS} from '../../constants';

const CommonModal = props => {
  return (
    <Modal // edit puja date modal
      isOpen={props.isOpen}
      onClose={() => props.onClose()}
      closeOnOverlayClick={
        props.closeOnOverlayClick === false ? props.closeOnOverlayClick : true
      }>
      <Animatable.View // visible section of edit puja date modal
        animation={'bounceIn'}
        duration={500}
        style={styles.container}>
        <View // header section
          style={styles.header}>
          <Text // header text
            style={styles.txt}>
            {props.title}
          </Text>
          <TouchableOpacity // close button
            style={{flex: 1, alignItems: 'flex-end'}}
            onPress={() => props.onClose()}>
            <MaterialCommunityIcons // close icon
              name="close"
              size={25}
              color={COLORS.gray}
            />
          </TouchableOpacity>
        </View>
        <View // separator
          style={styles.separator}
        />
        {props.children}
      </Animatable.View>
    </Modal>
  );
};

export default CommonModal;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusMedium,
    width: SIZES.width * 0.95,
    padding: SIZES.paddingMedium,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  txt: {
    flex: 10,
    fontFamily: FONTS.josefinSansSemiBold,
    fontSize: SIZES.fontMedium,
    color: COLORS.black,
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.gray,
    marginVertical: SIZES.paddingMedium,
  },
});
