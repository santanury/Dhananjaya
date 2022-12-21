import React from 'react';
import {
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Image,
  Text,
  View,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {icons, COLORS, SIZES, FONTS, SHADOW} from '../constants';
import {Store} from '../store/Store';

// screens import
import Tabs from './Tabs';
import Profile from '../screens/Profile';
import QRCode from '../screens/QRCode';
import Resource from '../screens/Resource';
import CollectionReport from '../screens/CollectionReport';
import ChangePin from '../screens/ChangePin';
import Patron from '../screens/Patron';
import Donor from '../screens/Donor';
import Receipt from '../screens/Receipt';
import Prospect from '../screens/Prospect';
import FollowUp from '../screens/FollowUp';
import SPAshraya from '../screens/SPAshraya';
import CollectionHistory from '../screens/CollectionHistory';
import Map from '../screens/Map';
import Tickets from '../screens/Tickets';
import MISMenu from '../screens/MISReport/MISMenu';

const Drawer = createDrawerNavigator();

const CustomDrawerItem = ({icon, label, onPress}) => {
  return (
    <TouchableOpacity // drawer item button
      style={[styles.drawerItem]}
      onPress={onPress}>
      <MaterialCommunityIcons // drawer item icon
        name={icon}
        size={20}
        color={COLORS.white}
      />
      <Text // drawer item label
        style={styles.drawerItemLabel}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const CustomDrawerContent = ({navigation}) => {
  const store = Store();

  // logout function
  const logout = async () => {
    await AsyncStorage.removeItem('@storage_Key'), // remove user data from storage
      store.setUserData({}), // clearing user data in store
      navigation.navigate('Splash');
  };

  return (
    <DrawerContentScrollView // drawer contents
      scrollEnabled={true}
      contentContainerStyle={{flex: 1}}>
      <View style={{flex: 1}}>
        <TouchableOpacity // profile button
          style={styles.profileButton}
          onPress={() => navigation.navigate('Profile')}>
          <Image // profile image
            source={{uri: store.userData?.image_url}}
            style={styles.profileImage}
            resizeMode="cover"
          />

          <View // profile text container
            style={{marginLeft: SIZES.paddingSmall, flex: 1}}>
            <Text // profile name
              style={styles.commonTxt}>
              {store.userData?.name}
            </Text>
            <Text // profile email
              style={[styles.commonTxt, {fontSize: SIZES.fontExtraSmall}]}>
              {store.userData?.email}
            </Text>
          </View>
        </TouchableOpacity>

        <View // drawer items container
          style={styles.drawerItmContainer}>
          {/* <CustomDrawerItem // Map
            icon="map-marker-radius-outline"
            label="Map"
            onPress={() => navigation.navigate('Map')}
          /> */}

          <CustomDrawerItem // MIS reports
            icon="chart-line"
            label="MIS Reports"
            onPress={() => navigation.navigate('MISMenu')}
          />

          <CustomDrawerItem // MIS reports
            icon="ticket-confirmation-outline"
            label="Tickets"
            onPress={() => navigation.navigate('Tickets')}
          />

          <CustomDrawerItem // qr code
            icon="qrcode-scan"
            label="QR Code"
            onPress={() => navigation.navigate('QRCode')}
          />
          <CustomDrawerItem // resource
            icon="human-queue"
            label="Resource"
            onPress={() => navigation.navigate('Resource')}
          />
          <CustomDrawerItem // collection report
            icon="cash-plus"
            label="Collection Report"
            onPress={() => navigation.navigate('CollectionReport')}
          />
          <CustomDrawerItem // change pin
            icon="lock-outline"
            label="Change Pin"
            onPress={() => navigation.navigate('ChangePin')}
          />
        </View>
        <View // logout button container
          style={{marginBottom: 20, paddingHorizontal: 20}}>
          <CustomDrawerItem // logout
            icon="logout"
            label="Logout"
            onPress={logout}
          />
        </View>
      </View>
    </DrawerContentScrollView>
  );
};

const CustomDrawer = () => {
  return (
    <LinearGradient // drawer view
      colors={[
        COLORS.tertiary,
        COLORS.primary,
        COLORS.secondary,
        COLORS.spanishBistra,
      ]}
      style={styles.container}>
      <Drawer.Navigator
        detachInactiveScreens={true}
        // backBehavior="history"
        screenOptions={{
          headerShown: false,
          drawerType: 'slide',
          overlayColor: 'transparent',
          drawerStyle: {flex: 1, width: '65%', backgroundColor: 'transparent'},
          sceneContainerStyle: {backgroundColor: 'transparent'},
        }}
        drawerContent={props => {
          return <CustomDrawerContent navigation={props.navigation} />;
        }}
        useLegacyImplementation
        initialRouteName="Tabs">
        <Drawer.Screen
          name="Tabs"
          component={Tabs}
          options={{unmountOnBlur: true}}
        />
        <Drawer.Screen
          name="Profile"
          component={Profile}
          options={{unmountOnBlur: true}}
        />
        {/* <Drawer.Screen
          name="Map"
          component={Map}
          options={{unmountOnBlur: true}}
        /> */}
        <Drawer.Screen
          name="MISMenu"
          component={MISMenu}
          options={{unmountOnBlur: true}}
        />
        <Drawer.Screen
          name="QRCode"
          component={QRCode}
          options={{unmountOnBlur: true}}
        />
        <Drawer.Screen
          name="Resource"
          component={Resource}
          options={{unmountOnBlur: true}}
        />
        <Drawer.Screen
          name="CollectionReport"
          component={CollectionReport}
          options={{unmountOnBlur: true}}
        />
        <Drawer.Screen
          name="ChangePin"
          component={ChangePin}
          options={{unmountOnBlur: true}}
        />
        <Drawer.Screen
          name="Patron"
          component={Patron}
          options={{unmountOnBlur: true}}
        />
        <Drawer.Screen
          name="Donor"
          component={Donor}
          options={{unmountOnBlur: true}}
        />
        <Drawer.Screen
          name="Receipt"
          component={Receipt}
          options={{unmountOnBlur: true}}
        />
        <Drawer.Screen
          name="Prospect"
          component={Prospect}
          options={{unmountOnBlur: true}}
        />
        <Drawer.Screen
          name="CollectionHistory"
          component={CollectionHistory}
          options={{unmountOnBlur: true}}
        />
        <Drawer.Screen
          name="FollowUp"
          component={FollowUp}
          options={{unmountOnBlur: true}}
        />
        <Drawer.Screen
          name="SPAshraya"
          component={SPAshraya}
          options={{unmountOnBlur: true}}
        />
        <Drawer.Screen
          name="Tickets"
          component={Tickets}
          options={{unmountOnBlur: true}}
        />
      </Drawer.Navigator>
    </LinearGradient>
  );
};

export default CustomDrawer;

const styles = StyleSheet.create({
  drawerItem: {
    marginVertical: SIZES.paddingSmall,
    flexDirection: 'row',
    alignItems: 'center',
    alignItems: 'center',
    borderRadius: SIZES.radiusSmall,
  },
  drawerItemLabel: {
    fontFamily: FONTS.josefinSansRegular,
    fontSize: SIZES.fontMedium,
    color: COLORS.white,
    marginLeft: SIZES.paddingMedium,
  },
  profileButton: {
    paddingLeft: SIZES.paddingMedium,
    paddingRight: SIZES.paddingSmall,
    backgroundColor: COLORS.tertiary,
    flexDirection: 'row',
    width: SIZES.width * 0.6,
    height: SIZES.height * 0.15,
    borderBottomRightRadius: SIZES.radiusBig,
    alignItems: 'center',
  },
  profileImage: {
    width: SIZES.width * 0.15,
    height: SIZES.width * 0.15,
    borderRadius: SIZES.radiusSmall,
    borderWidth: 2,
    borderColor: COLORS.lightGray,
    backgroundColor: COLORS.lightGray + 90,
  },
  commonTxt: {
    fontSize: SIZES.fontMedium,
    color: COLORS.white,
    fontFamily: FONTS.josefinSansMedium,
  },
  drawerItmContainer: {
    flex: 1,
    marginTop: SIZES.paddingBig,
    paddingLeft: SIZES.paddingMedium,
  },
  container: {flex: 1},
});
