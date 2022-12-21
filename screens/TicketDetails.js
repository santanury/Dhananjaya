import {
  StyleSheet,
  StatusBar,
  BackHandler,
  ScrollView,
  Text,
  View,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import AntDesign from 'react-native-vector-icons/AntDesign';
import axios from 'axios';
import moment from 'moment';
import {showMessage} from 'react-native-flash-message';
import {COLORS, SIZES, FONTS} from '../constants';
import {Store} from '../store/Store';
import {
  baseUrl,
  ticketing_baseUrl,
  accessKey,
  get_my_work_updates,
} from '../webApi/service';

// components
import Header from '../components/Common/Header';
import Section from '../components/Common/Section';

const TicketDetails = ({navigation, route}) => {
  const store = Store();

  const [history, setHistory] = useState([]); // history state

  useEffect(() => {
    const unSubscribe = navigation.addListener('focus', () => {
      getTicketHistory();
      BackHandler.addEventListener('hardwareBackPress', () => {
        console.log('BackHandler In TicketDetails is called');
        navigation.goBack();
        return true;
      });
    });
    return unSubscribe;
  }, []);

  // get ticket history
  const getTicketHistory = async () => {
    const payload = {
      accessKey,
      loginId: store?.userData?.userId,
      requestId: route?.params?.requestId,
    };

    console.log(
      'GET TICKET HISTORY :',
      ticketing_baseUrl + get_my_work_updates,
      payload,
    );

    await axios
      .post(ticketing_baseUrl + get_my_work_updates, payload)
      .then(res => {
        res?.data?.successCode === 1
          ? setHistory(res?.data?.data)
          : showMessage({
              message: 'Info!',
              description: `There's no history for this ticket`,
              type: 'info',
              floating: true,
              icon: 'auto',
            });
      })
      .catch(err => {
        console.log('Error getting ticket history', err);
        showMessage({
          message: 'Error!',
          description: 'Please check your internet connection',
          type: 'danger',
          floating: true,
          icon: 'auto',
        });
      });
  };

  return (
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
        leftButtonIcon="chevron-left"
        title="TICKET DETAILS"
        onPressLeft={() => navigation.goBack()}
      />

      <ScrollView
        style={{flex: 1}}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{alignItems: 'center'}}>
        <Section name="BASIC DETAILS">
          <>
            <View // subject container
              style={styles.detailsSection}>
              <Text //  subject identifier
                style={styles.identifierTxt}>
                Subject:
              </Text>

              <Text // subject
                style={[styles.valueTxt, {flex: 1.5}]}>
                {route?.params?.requestSubject}
              </Text>
            </View>

            <View // separator
              style={styles.separator}
            />

            <View // description container
              style={styles.detailsSection}>
              <Text //  description identifier
                style={styles.identifierTxt}>
                Description:
              </Text>

              <Text // description
                style={[styles.valueTxt, {flex: 1.5}]}>
                {route?.params?.requestDescription}
              </Text>
            </View>

            <View // separator
              style={styles.separator}
            />

            <View // registered on container
              style={styles.detailsSection}>
              <Text //  registered on identifier
                style={styles.identifierTxt}>
                Requested On:
              </Text>

              <Text // registered on
                style={[styles.valueTxt, {flex: 1.5}]}>
                {moment(route?.params?.taskCreatedOnSort, 'YYYY-MM-DD').format(
                  'DD-MMM-YYYY',
                )}
              </Text>
            </View>

            <View // separator
              style={styles.separator}
            />

            <View // assigned to container
              style={styles.detailsSection}>
              <Text //  assigned to identifier
                style={styles.identifierTxt}>
                Assigned To:
              </Text>

              <Text // assigned to
                style={[styles.valueTxt, {flex: 1.5}]}>
                {route?.params?.requestAssignedTo}
              </Text>
            </View>

            <View // separator
              style={styles.separator}
            />

            <View // category container
              style={styles.detailsSection}>
              <Text //  category identifier
                style={styles.identifierTxt}>
                Category:
              </Text>

              <Text // category
                style={[styles.valueTxt, {flex: 1.5}]}>
                {route?.params?.category}
              </Text>
            </View>

            <View // separator
              style={styles.separator}
            />

            <View // sub category container
              style={styles.detailsSection}>
              <Text // sub category identifier
                style={styles.identifierTxt}>
                Sub Category:
              </Text>

              <Text // sub category
                style={[styles.valueTxt, {flex: 1.5}]}>
                {route?.params?.subcategory}
              </Text>
            </View>

            <View // separator
              style={styles.separator}
            />

            <View // item type container
              style={styles.detailsSection}>
              <Text // item type identifier
                style={styles.identifierTxt}>
                Item Type:
              </Text>

              <Text // item type
                style={[styles.valueTxt, {flex: 1.5}]}>
                {route?.params?.itemType}
              </Text>
            </View>

            <View // separator
              style={styles.separator}
            />

            <View // item container
              style={styles.detailsSection}>
              <Text // item identifier
                style={styles.identifierTxt}>
                Item:
              </Text>

              <Text // item
                style={[styles.valueTxt, {flex: 1.5}]}>
                {route?.params?.item}
              </Text>
            </View>

            {(route?.params?.feedbackPoint != 0 ||
              route?.params?.feedbackRemarks?.replace(/ /g, '')?.length >
                0) && (
              <>
                <View // separator
                  style={styles.separator}
                />

                <View // feedback points container
                  style={[styles.detailsSection, {alignItems: 'center'}]}>
                  <Text // item identifier
                    style={styles.identifierTxt}>
                    Feedback:
                  </Text>

                  <Text // feedback points
                    style={[
                      styles.valueTxt,
                      {flex: 1.5, flexDirection: 'row'},
                    ]}>
                    {[...Array(5).keys()]?.map((item, index) => (
                      <AntDesign
                        key={index}
                        name={
                          Number(route?.params?.feedbackPoint) > index + 1
                            ? 'star'
                            : 'staro'
                        }
                        size={20}
                        color={COLORS.primary}
                      />
                    ))}
                  </Text>
                </View>

                <View // separator
                  style={styles.separator}
                />

                <View // feedback remarks container
                  style={styles.detailsSection}>
                  <Text // item identifier
                    style={styles.identifierTxt}>
                    Remarks:
                  </Text>

                  <Text // feedback remarks
                    style={[styles.valueTxt, {flex: 1.5}]}>
                    {route?.params?.feedbackRemarks}
                  </Text>
                </View>
              </>
            )}
          </>
        </Section>

        {history?.length > 0 && (
          <Section name="TICKET HISTORY">
            {history?.map((item, index) => (
              <View // each payment details section
                key={index}
                style={styles.expandableSubSec}>
                <View // history date container
                  style={styles.detailsSection}>
                  <Text // item identifier
                    style={styles.identifierTxt}>
                    Date:
                  </Text>

                  <Text // history date
                    style={[styles.valueTxt, {flex: 1.5}]}>
                    {item?.logDate}
                  </Text>
                </View>

                <View // separator
                  style={styles.separator}
                />

                <View // description container
                  style={styles.detailsSection}>
                  <Text // item identifier
                    style={styles.identifierTxt}>
                    Description:
                  </Text>

                  <Text // description
                    style={[styles.valueTxt, {flex: 1.5}]}>
                    {item?.taskDescription}
                  </Text>
                </View>

                <View // separator
                  style={styles.separator}
                />

                <View // status container
                  style={styles.detailsSection}>
                  <Text // item identifier
                    style={styles.identifierTxt}>
                    Description:
                  </Text>

                  <Text // status
                    style={[styles.valueTxt, {flex: 1.5}]}>
                    {item?.taskDescription}
                  </Text>
                </View>
              </View>
            ))}
          </Section>
        )}
      </ScrollView>
    </LinearGradient>
  );
};

export default TicketDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: COLORS.antiFlashWhite,
  },
  detailsSection: {
    padding: SIZES.paddingSmall,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  identifierTxt: {
    flex: 1,
    color: COLORS.black,
    fontSize: SIZES.fontSmall,
    fontFamily: FONTS.josefinSansBold,
  },
  valueTxt: {
    flex: 1,
    color: COLORS.black,
    fontSize: SIZES.fontSmall,
    fontFamily: FONTS.josefinSansRegular,
  },
  separator: {height: 1, width: '100%', backgroundColor: COLORS.lightGray},
  expandableSubSec: {
    padding: SIZES.paddingSmall,
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: SIZES.radiusSmall,
    marginTop: SIZES.paddingSmall,
  },
});
