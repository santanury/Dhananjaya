import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useRef} from 'react';
import Animated from 'react-native-reanimated';
import * as Animatable from 'react-native-animatable';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDrawerProgress} from '@react-navigation/drawer';
import {
  createBottomTabNavigator,
  BottomTabBar,
} from '@react-navigation/bottom-tabs';
import {Store} from '../store/Store';
import {COLORS, SIZES, FONTS, SHADOW} from '../constants';
const Tab = createBottomTabNavigator();

// screens
import Home from '../screens/Home';
import Profile from '../screens/Profile';
import Statistics from '../screens/Statistics';

const TabArr = [
  {
    name: 'HOME',
    iconActive: 'view-grid',
    iconInactive: 'view-grid-outline',
    screen: Home,
  },
  {
    name: 'PROFILE',
    iconActive: 'shield-account',
    iconInactive: 'shield-account-outline',
    screen: Profile,
  },
  {
    name: 'STASTISTICS',
    iconActive: 'message-text',
    iconInactive: 'message-text-outline',
    screen: Statistics,
  },
];

const TabButton = props => {
  const {item, onPress, accessibilityState} = props;
  const focused = accessibilityState.selected;
  const viewRef = useRef(null);

  useEffect(() => {
    focused
      ? viewRef.current.animate({
          0: {scale: 1, rotate: '0deg'},
          1: {scale: 1.5, rotate: '360deg'},
        })
      : viewRef.current.animate({
          0: {scale: 1.5, rotate: '360deg'},
          1: {scale: 1, rotate: '0deg'},
        });
  }, [focused]);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={1}
      style={styles.tabButton}>
      <Animatable.View ref={viewRef} duration={500} style={styles.tabButton}>
        <MaterialCommunityIcons
          name={focused ? item.iconActive : item.iconInactive}
          size={30}
          color={focused ? COLORS.primary : COLORS.tertiary}
        />
      </Animatable.View>
    </TouchableOpacity>
  );
};

const Tabs = ({navigation}) => {
  const store = Store();
  const progress = useDrawerProgress();

  useEffect(() => {
    store.setProgress(progress);
  }, []);

  return (
    // container
    <Animated.View style={[styles.container, store.animatedScreen]}>
      <Tab.Navigator
        screenOptions={styles.screenOptions}
        initialRouteName="Home">
        {TabArr.map((item, index) => {
          return (
            <Tab.Screen
              key={index}
              name={item.name}
              component={item.screen}
              options={{
                // tabBarLabel: item.name,
                tabBarIcon: ({focused, color}) => (
                  <MaterialCommunityIcons size={30} color={color} />
                ),
                tabBarButton: props => <TabButton {...props} item={item} />,
              }}
              listeners={{
                tabPress: e => {
                  item.name === 'PROFILE' &&
                    (e.preventDefault(), // Prevent default action
                    navigation.navigate('Profile'));
                },
              }}
            />
          );
        })}
      </Tab.Navigator>
    </Animated.View>
  );
};

export default Tabs;

const styles = StyleSheet.create({
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  screenOptions: {
    tabBarShowLabel: false,
    headerShown: false,
    tabBarStyle: {
      height: SIZES.height * 0.075,
      position: 'absolute',
      bottom: SIZES.paddingMedium,
      left: SIZES.paddingMedium,
      right: SIZES.paddingMedium,
      borderRadius: SIZES.radiusMedium,
      backgroundColor: COLORS.white,
      ...SHADOW,
    },
  },
});
