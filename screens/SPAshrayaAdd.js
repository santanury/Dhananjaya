import {SafeAreaView, StyleSheet, StatusBar, BackHandler} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {WebView} from 'react-native-webview';
import {COLORS, SIZES, FONTS} from '../constants';
import {Store} from '../store/Store';
import {addAshrayaBaseWeb} from '../webApi/service';

// components
import Header from '../components/Common/Header';

const SPAshrayaAdd = ({navigation}) => {
  const store = Store();

  useEffect(() => {
    const unSubscribe = navigation.addListener('focus', () => {
      console.log('SP Ashraya Add Focused');
      BackHandler.addEventListener('hardwareBackPress', () => {
        console.log('BackHandler In SP Ashraya Add is called');
        navigation.goBack();
        return true;
      });
    });
    return unSubscribe;
  }, []);

  console.log('WEB VIEW URL :', addAshrayaBaseWeb + store?.userData?.id);

  return (
    <SafeAreaView // container
      style={styles.container}>
      <LinearGradient // gradient container
        colors={[COLORS.tertiary, COLORS.quaternary, COLORS.mistyMoss]}
        style={styles.container}>
        <StatusBar // status bar
          backgroundColor={COLORS.tertiary}
          barStyle="default"
        />

        {/* HEADER */}

        <Header
          color={COLORS.black}
          leftButtonIcon="chevron-left"
          title="ADD SP ASHRAYA"
          onPressLeft={() => navigation.goBack()}
        />

        <WebView
          style={{backgroundColor: 'transparent'}}
          source={{
            uri: addAshrayaBaseWeb + store?.userData?.id,
          }}
        />
      </LinearGradient>
    </SafeAreaView>
  );
};

export default SPAshrayaAdd;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: COLORS.lightGray,
  },
});
