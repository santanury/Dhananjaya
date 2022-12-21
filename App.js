import 'react-native-gesture-handler';
import React from 'react';
import FlashMessage from 'react-native-flash-message';
import {NativeBaseProvider, Stack} from 'native-base';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

// screens
import Splash from './screens/Splash';
import Auth from './screens/Auth';
import CustomDrawer from './navigation/Drawer';
import PatronDetails from './screens/PatronDetails';
import PatronSearch from './screens/PatronSearch';
import Comment from './screens/Comment';
import DonorDetails from './screens/DonorDetails';
import DonorSearch from './screens/DonorSearch';
import ProspectSearch from './screens/ProspectSearch';
import EnrolmentRegistration from './screens/Enrolment/EnrolmentRegistration';
import EnrolmentBahumanaPuja from './screens/Enrolment/EnrolmentBahumanaPuja';
import EnrolmentReview from './screens/Enrolment/EnrolmentReview';
import SubCategory from './screens/Donation/SubCategory';
import SevaSelection from './screens/Donation/SevaSelection';
import DonorSelection from './screens/Donation/DonorSelection';
import CreateDonor from './screens/Donation/CreateDonor';
import DonationReceiept from './screens/Donation/DonationReceiept';
import ReviewReceipt from './screens/Donation/ReviewReceipt';
import CreateProspect from './screens/AddProspect/CreateProspect';
import ReviewProspect from './screens/AddProspect/ReviewProspect';
import Invitees from './screens/Invitees';
import Receipt from './screens/Receipt';
import CollectionHistory from './screens/CollectionHistory';
import SPAshrayaSearch from './screens/SPAshrayaSearch';
import SPAshrayaAdd from './screens/SPAshrayaAdd';
import MISReport from './screens/MISReport/MISReport';
import CreateTicket from './screens/CreateTicket';
import TicketDetails from './screens/TicketDetails';

import {ProvideStore} from './store/Store';

const stack = createStackNavigator();

const App = () => {
  return (
    <NativeBaseProvider>
      <NavigationContainer>
        <ProvideStore>
          <stack.Navigator
            screenOptions={{headerShown: false}}
            initialRouteName="Splash">
            <stack.Screen name="Splash" component={Splash} />
            <stack.Screen name="Auth" component={Auth} />
            <stack.Screen name="CustomDrawer" component={CustomDrawer} />
            <stack.Screen name="PatronDetails" component={PatronDetails} />
            <stack.Screen name="PatronSearch" component={PatronSearch} />
            <stack.Screen name="Comment" component={Comment} />
            <stack.Screen name="DonorDetails" component={DonorDetails} />
            <stack.Screen name="DonorSearch" component={DonorSearch} />
            <stack.Screen name="ProspectSearch" component={ProspectSearch} />
            <stack.Screen
              name="EnrolmentRegistration"
              component={EnrolmentRegistration}
            />
            <stack.Screen
              name="EnrolmentBahumanaPuja"
              component={EnrolmentBahumanaPuja}
            />
            <stack.Screen name="EnrolmentReview" component={EnrolmentReview} />
            <stack.Screen name="SubCategory" component={SubCategory} />
            <stack.Screen name="SevaSelection" component={SevaSelection} />
            <stack.Screen name="DonorSelection" component={DonorSelection} />
            <stack.Screen name="CreateDonor" component={CreateDonor} />
            <stack.Screen
              name="DonationReceiept"
              component={DonationReceiept}
            />
            <stack.Screen name="ReviewReceipt" component={ReviewReceipt} />
            <stack.Screen name="CreateProspect" component={CreateProspect} />
            <stack.Screen name="ReviewProspect" component={ReviewProspect} />
            <stack.Screen name="Invitees" component={Invitees} />
            <stack.Screen name="Receipt" component={Receipt} />
            <stack.Screen
              name="CollectionHistory"
              component={CollectionHistory}
            />
            <stack.Screen name="SPAshrayaSearch" component={SPAshrayaSearch} />
            <stack.Screen name="SPAshrayaAdd" component={SPAshrayaAdd} />
            <stack.Screen name="MISReport" component={MISReport} />
            <stack.Screen name="CreateTicket" component={CreateTicket} />
            <stack.Screen name="TicketDetails" component={TicketDetails} />
          </stack.Navigator>
        </ProvideStore>
      </NavigationContainer>
      <FlashMessage position="bottom" />
    </NativeBaseProvider>
  );
};

export default App;
