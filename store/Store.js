import React, {useContext, useState, createContext} from 'react';
import {interpolateNode} from 'react-native-reanimated';
const StoreContext = createContext();
import {SIZES} from '../constants';

export function ProvideStore({children}) {
  const store = useProvideStore();
  return (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  );
}
export const Store = () => useContext(StoreContext);

function useProvideStore() {
  // define states here
  const [userData, setUserData] = useState(''); // user data state to access in all screens
  const [progress, setProgress] = useState(); // drawer progress state require to animate screens inside drawer
  const [deviceExist, setDeviceExist] = useState(false); // device exist state for navigation conditions
  const [deviceId, setDeviceId] = useState(''); // device id state require for api calls
  const [sessionId, setSessionId] = useState(''); // session id state require for api calls
  const [patronData, setPatronData] = useState(''); // patron data state require for api calls (for patron details)

  // donation states
  const [ptrnIncmp, setPtrnIncmp] = useState(false); // patronship enrolment incomplete state
  const [donorEditMode, setDonorEditMode] = useState(false); // new donor or existing donor in edit mode or not state
  const [routeInfo, setRouteInfo] = useState({}); // route memory data for donation module
  const [newDonor, setNewDonor] = useState({}); // newly created donor id state

  // animation for screen transition
  const scale = interpolateNode(progress, {
    inputRange: [0, 1],
    outputRange: [1, 0.68],
  });
  const borderRadius = interpolateNode(progress, {
    inputRange: [0, 1],
    outputRange: [1, SIZES.radiusBig],
  });
  const animatedScreen = {
    borderRadius,
    transform: [{scale}],
  };

  return {
    // return states from here
    userData, // user data state
    setUserData, // set user data state
    progress, // drawer progress state
    setProgress, // drawer progress setter
    animatedScreen, // animation styles
    setDeviceExist, // device existance setter
    deviceExist, // device existance state
    deviceId, // device id state
    setDeviceId, // device id setter
    sessionId, // session id state
    setSessionId, // session id setter
    patronData, // patron id state
    setPatronData, // patron id setter

    // donation states
    ptrnIncmp, // enrolment incomplete state
    setPtrnIncmp, // enrolment incomplete setter
    donorEditMode, // donor edit mode state
    setDonorEditMode, // donor edit mode setter
    newDonor, // newly created donor id state
    setNewDonor, // newly created donor id setter
    routeInfo, // route memory info donation
    setRouteInfo, // route memory info donation setter
  };
}
