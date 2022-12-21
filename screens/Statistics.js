import {StyleSheet, Text, View, BackHandler} from 'react-native';
import React, {useState, useEffect} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import Animated from 'react-native-reanimated';
import {Store} from '../store/Store';
import {COLORS, FONTS, SIZES, icons} from '../constants';

// components
import Header from '../components/Common/Header';

const Statistics = ({navigation}) => {
  const store = Store();

  useEffect(() => {
    const unSubscribe = navigation.addListener('focus', () => {
      BackHandler.addEventListener('hardwareBackPress', () => {
        console.log('BackHandler In Statistics is called');
        navigation.goBack();
        return true;
      });
    });
    return unSubscribe;
  }, []);

  return (
    <View // animated container
      style={[
        styles.container,
        // store.animatedScreen
      ]}>
      <LinearGradient // gradient container
        colors={[COLORS.tertiary, COLORS.quaternary, COLORS.mistyMoss]}
        style={styles.container}>
        <Header // header
          headerStyle={{zIndex: 1}}
          color={COLORS.black}
          leftButtonIcon="menu"
          title="STASTICS"
          onPressLeft={() => navigation.openDrawer()}
        />
      </LinearGradient>
    </View>
  );
};

export default Statistics;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: COLORS.white,
  },
});
