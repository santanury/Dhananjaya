import {
  StyleSheet,
  StatusBar,
  BackHandler,
  TouchableOpacity,
  Text,
  FlatList,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated from 'react-native-reanimated';
import axios from 'axios';
import {TabView, TabBar} from 'react-native-tab-view';
import {showMessage} from 'react-native-flash-message';
import {COLORS, SIZES, FONTS} from '../constants';
import {Store} from '../store/Store';
import {
  baseUrl,
  ticketing_baseUrl,
  accessKey,
  get_user_ticket_list,
} from '../webApi/service';

// components
import Header from '../components/Common/Header';
import OpenCard from '../components/Tickets/OpenCard';
import CloseCard from '../components/Tickets/CloseCard';

const Tickets = ({navigation, route}) => {
  const store = Store();

  const [index, setIndex] = useState(0); // tab index
  const [routes] = useState([
    {key: 'open', title: 'OPEN', icon: 'face-man-shimmer-outline'},
    {key: 'close', title: 'CLOSE', icon: 'hand-coin-outline'},
  ]); // available tabs
  const [openTickets, setOpenTickets] = useState([]); // open tickets state
  const [closeTickets, setCloseTickets] = useState([]); // close tickets state

  useEffect(() => {
    getTickets(index === 0 ? 'OPN' : 'CLR');
    const unSubscribe = navigation.addListener('focus', () => {
      console.log('Tickets Focused');
      BackHandler.addEventListener('hardwareBackPress', () => {
        console.log('BackHandler Tickets is called');
        navigation.goBack();
        return true;
      });
      getTickets(index === 0 ? 'OPN' : 'CLR');
    });
    return unSubscribe;
  }, [index]);

  // get tickets
  const getTickets = async status => {
    console.log(status);

    const payload = {
      accessKey,
      projectIdValue: 9,
      taskStaNew: status === 'OPN' ? 'new' : 'Completed',
      taskStaopen: status === 'OPN' ? 'open' : 'Completed',
      userId: store?.userData?.userId,
    };

    console.log(
      'GET TICKET :',
      ticketing_baseUrl + get_user_ticket_list,
      payload,
    );

    await axios
      .post(ticketing_baseUrl + get_user_ticket_list, payload)
      .then(res => {
        res?.data?.successCode === 1
          ? status === 'OPN'
            ? setOpenTickets(res?.data?.data)
            : setCloseTickets(res?.data?.data)
          : showMessage({
              message: 'Thats all!',
              description: 'No tickets to display',
              type: 'info',
              floating: true,
              icon: 'auto',
            });
      })
      .catch(err => {
        console.log(`Error fetching ${status} tickets`, err);
        showMessage({
          message: 'Error!',
          description: 'Please check your internet connection',
          type: 'danger',
          floating: true,
          icon: 'auto',
        });
      });
  };

  const renderScene = ({route, jumpTo}) => {
    switch (route.key) {
      case 'open':
        return (
          <FlatList
            data={openTickets}
            renderItem={({item, index}) => (
              <OpenCard // open card
                data={item}
                index={index}
                navigation={navigation}
              />
            )}
            keyExtractor={(item, index) => index}
            style={{
              marginTop: SIZES.paddingSmall,
            }}
            contentContainerStyle={styles.list}
          />
        );
      case 'close':
        return (
          <FlatList
            data={closeTickets}
            renderItem={({item, index}) => (
              <CloseCard // close card
                data={item}
                index={index}
                navigation={navigation}
                closeTickets={closeTickets}
                setCloseTickets={setCloseTickets}
              />
            )}
            keyExtractor={(item, index) => index}
            style={{
              marginTop: SIZES.paddingSmall,
            }}
            contentContainerStyle={styles.list}
          />
        );
    }
  };

  const renderTabBar = props => {
    return (
      <TabBar
        {...props}
        indicatorStyle={{
          backgroundColor: COLORS.white,
        }}
        style={styles.tabbar}
        renderLabel={({route, focused}) => (
          <Text
            style={{
              fontFamily: FONTS.josefinSansMedium,
              color: focused ? COLORS.white : COLORS.antiFlashWhite,
            }}>
            {route.title}
          </Text>
        )}
      />
    );
  };

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

        {/* HEADER */}

        <Header
          color={COLORS.black}
          leftButtonIcon="chevron-left"
          title="TICKETS"
          onPressLeft={() => navigation.goBack()}
          headerRight={
            <TouchableOpacity // left button as touchable
              onPress={() => navigation.navigate('CreateTicket')}>
              <MaterialCommunityIcons // icon
                name="plus"
                size={35}
                color={COLORS.black}
              />
            </TouchableOpacity>
          }
        />

        <TabView
          renderTabBar={renderTabBar}
          navigationState={{index, routes}}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{width: SIZES.width}}
        />
      </LinearGradient>
    </Animated.View>
  );
};

export default Tickets;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: COLORS.lightGray,
  },
  tabbar: {
    backgroundColor: 'transparent',
    elevation: 0,
    shadowOpacity: 0,
  },
  list: {
    alignItems: 'center',
    paddingBottom: SIZES.paddingMedium,
    marginTop: SIZES.paddingSmall,
  },
});
