import {
  StyleSheet,
  Text,
  View,
  BackHandler,
  ScrollView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated from 'react-native-reanimated';
import {Store} from '../../store/Store';
import {COLORS, FONTS, SIZES, SHADOW, icons} from '../../constants';

// components
import Header from '../../components/Common/Header';
import PrimaryButton from '../../components/Common/PrimaryButton';

const MISMenu = ({navigation}) => {
  const store = Store();

  const [misMenu] = useState([
    {
      name: 'Year / Month Collection',
      icon: 'calendar-month-outline',
      flag: 'YMC',
    },
    {name: 'Annadana Collection', icon: 'hand-coin-outline', flag: 'ADC'},
    {name: 'Preacher Collection', icon: 'glasses', flag: 'PC'},
    {name: 'Kind Donation Collection', icon: 'hand-heart-outline', flag: 'KDC'},
    {name: 'FRDC Attendance', icon: 'food-outline', flag: 'FRDCA'},
    {
      name: 'Preacher wise Year Collection',
      icon: 'calendar-multiple',
      flag: 'PWYC',
    },
  ]); // mis report menu buttons

  const [misBranchMenu] = useState([
    {name: 'VK Hill Collection', flag: 'VKHC'},
    {name: 'Gunjur Collection', flag: 'GC'},
    {name: 'Avalabetta Collection', flag: 'AVC'},
  ]); // mis report menu buttons for branches

  useEffect(() => {
    const unSubscribe = navigation.addListener('focus', () => {
      BackHandler.addEventListener('hardwareBackPress', () => {
        console.log('BackHandler In MISMenu is called');
        navigation.goBack();
        return true;
      });
    });
    return unSubscribe;
  }, []);

  return (
    <Animated.View // animated container
      style={[styles.container, store.animatedScreen]}>
      <LinearGradient // gradient container
        colors={[COLORS.tertiary, COLORS.quaternary, COLORS.mistyMoss]}
        style={styles.container}>
        <StatusBar // status bar
          backgroundColor={COLORS.tertiary}
          barStyle="default"
        />
        <Header // header
          headerStyle={{zIndex: 1}}
          color={COLORS.black}
          leftButtonIcon="menu"
          title="MIS REPORT MENU"
          onPressLeft={() => navigation.openDrawer()}
        />
        <ScrollView
          style={{flex: 1}}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            alignItems: 'center',
            paddingBottom: SIZES.paddingHuge,
          }}>
          {misMenu?.map(
            // menu buttons
            (item, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.section,
                  {marginTop: index === 0 ? 0 : SIZES.paddingSmall},
                ]}
                onPress={() =>
                  navigation.navigate('MISReport', {flag: item.flag})
                }>
                <MaterialCommunityIcons // icon
                  name={item.icon}
                  size={25}
                  color={COLORS.black}
                />
                <Text
                  style={[
                    styles.buttonText,
                    item.icon && {marginLeft: SIZES.paddingMedium},
                  ]}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            ),
          )}

          {/* BRANCH SECTIONS */}

          <View style={[styles.section, {backgroundColor: COLORS.palePink}]}>
            <Text style={styles.buttonText}>BRANCHES</Text>
          </View>

          {misBranchMenu?.map(
            // branch wise menu buttons
            (item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.section}
                onPress={() =>
                  navigation.navigate('MISReport', {flag: item.flag})
                }>
                <Text style={styles.buttonText}>{item.name}</Text>
              </TouchableOpacity>
            ),
          )}
        </ScrollView>
      </LinearGradient>
    </Animated.View>
  );
};

export default MISMenu;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: COLORS.white,
  },

  buttonText: {
    color: COLORS.black,
    fontFamily: FONTS.josefinSansRegular,
    fontSize: SIZES.fontMedium,
  },
  section: {
    flexDirection: 'row',
    backgroundColor: COLORS.antiFlashWhite,
    marginTop: SIZES.paddingSmall,
    width: SIZES.width,
    padding: SIZES.paddingMedium,
  },
});
