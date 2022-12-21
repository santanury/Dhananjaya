import {
  View,
  Text,
  StyleSheet,
  BackHandler,
  ScrollView,
  StatusBar,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import axios from 'axios';
import LinearGradient from 'react-native-linear-gradient';
import {showMessage} from 'react-native-flash-message';
import {Store} from '../../store/Store';
import {COLORS, SIZES, FONTS} from '../../constants';
import {baseUrl, accessKey, create_prospect} from '../../webApi/service';

// components
import Header from '../../components/Common/Header';
import LabelCard from '../../components/Common/LabelCard';
import PrimaryButton from '../../components/Common/PrimaryButton';

const ReviewProspect = ({navigation, route}) => {
  const store = Store();

  const [routePayload, setRoutePayload] = useState({}); // route data for next screen

  useEffect(() => {
    const unSubscribe = navigation.addListener('focus', () => {
      BackHandler.addEventListener('hardwareBackPress', () => {
        console.log('BackHandler In ProspectReview is called');
        navigation.goBack();
        return true;
      });
      setRoutePayload(route?.params);
    });
    return unSubscribe;
  }, [route?.params]);

  //   create prospect
  const createProspect = async () => {
    console.log(
      '\n======== CREATE PROSPECT ========',
      '\nurl' + baseUrl + create_prospect,

      '\naccessKey:',
      accessKey,
      '\ndeviceId:',
      store?.deviceId,
      '\nloginId:',
      store?.userData?.userId,
      '\nsessionId:',
      store?.userData?.session_id,

      '\nsalutation:',
      routePayload?.salutation,
      '\nfirstName:',
      routePayload?.firstName,
      '\nlastName:',
      routePayload?.lastName,
      '\nmobileNo:',
      routePayload?.mobileNumber,
      '\nmobile2:',
      routePayload?.mobile2,
      '\nemail:',
      routePayload?.email,
      '\nemail2:',
      routePayload?.email2,

      '\nnationality:',
      routePayload?.nationality,
      '\nregAddress1:',
      routePayload?.door,
      '\nregAddress2:',
      routePayload?.house,
      '\nregAddress3:',
      routePayload?.street,
      '\nregArea:',
      routePayload?.area,
      '\nregCity:',
      routePayload?.city,
      '\nregState:',
      routePayload?.state,
      '\nregCountry:',
      routePayload?.country,
      '\nregPincode:',
      routePayload?.pincode,

      '\nlevel:',
      routePayload?.interest,
      '\nremarks:',
      routePayload?.remarks,
      '\n================================',
    );

    await axios
      .post(baseUrl + create_prospect, {
        accessKey,
        deviceId: store?.deviceId,
        loginId: store?.userData?.userId,
        sessionId: store?.userData?.session_id,

        salutation: routePayload?.salutation,
        firstName: routePayload?.firstName,
        lastName: routePayload?.lastName,
        mobileNo: routePayload?.mobileNumber,
        mobile2: routePayload?.mobile2,
        email: routePayload?.email,
        email2: routePayload?.email2,

        nationality: routePayload?.nationality,
        regAddress1: routePayload?.door,
        regAddress2: routePayload?.house,
        regAddress3: routePayload?.street,
        regArea: routePayload?.area,
        regCity: routePayload?.city,
        regState: routePayload?.state,
        regCountry: routePayload?.country,
        regPincode: routePayload?.pincode,

        level: routePayload?.interest,
        remarks: routePayload?.remarks,

        //  "longitude": "-122.08400000000002",
        //  "latitude": "37.421998333333335",
      })
      .then(res =>
        res.data.successCode === 1
          ? (showMessage({
              message: 'Success!',
              description: 'Prospect created successfully',
              type: 'success',
              floating: true,
              icon: 'auto',
            }),
            navigation.navigate('Prospect'))
          : showMessage({
              message: 'Opps!',
              description: 'Something went wrong',
              type: 'danger',
              floating: true,
              icon: 'auto',
            }),
      )
      .catch(
        err => (
          console.log('Error creating prospect', err),
          showMessage({
            message: 'Error!',
            description: 'Please check your internet connection',
            type: 'danger',
            floating: true,
            icon: 'auto',
          })
        ),
      );
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
        title="PREVIEW PROSPECT"
        onPressLeft={() => {
          navigation.goBack();
        }}
      />

      <ScrollView
        style={{flex: 1}}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          alignItems: 'center',
          paddingBottom: SIZES.paddingHuge,
        }}>
        {/* PERSONAL DETAILS REVIEW SECTION */}

        {(routePayload?.salutation?.length > 0 ||
          routePayload?.firstName?.length > 0 ||
          routePayload?.lastName?.length > 0 ||
          routePayload?.mobileNumber?.length > 0 ||
          routePayload?.mobile2?.length > 0 ||
          routePayload?.email?.length > 0 ||
          routePayload?.email2?.length > 0 ||
          (routePayload?.nationality?.length > 0 &&
            routePayload?.nationalityLabel?.length > 0)) && (
          <LabelCard name="PERSONAL DETAILS">
            {
              // name review
              (routePayload?.salutation?.length > 0 ||
                routePayload?.firstName?.length > 0 ||
                routePayload?.lastName?.length > 0) && (
                <View style={[styles.valCont, {marginTop: 0}]}>
                  <Text style={styles.identifierTxt}>Patron Name :</Text>
                  <Text style={styles.valueTxt}>
                    {routePayload?.salutation} {routePayload?.firstName}{' '}
                    {routePayload?.lastName}
                  </Text>
                </View>
              )
            }

            {
              // mobile review
              routePayload?.mobileNumber?.length > 0 && (
                <View style={styles.valCont}>
                  <Text style={styles.identifierTxt}>Mobile :</Text>
                  <Text style={styles.valueTxt}>
                    {routePayload?.mobileNumber}
                  </Text>
                </View>
              )
            }

            {
              // alternate mobile review
              routePayload?.mobile2?.length > 0 && (
                <View style={styles.valCont}>
                  <Text style={styles.identifierTxt}>Alternate Mobile :</Text>
                  <Text style={styles.valueTxt}>{routePayload?.mobile2}</Text>
                </View>
              )
            }

            {
              // email review
              routePayload?.email?.length > 0 && (
                <View style={styles.valCont}>
                  <Text style={styles.identifierTxt}>Email :</Text>
                  <Text style={styles.valueTxt}>{routePayload?.email}</Text>
                </View>
              )
            }

            {
              // alternate email review
              routePayload?.email2?.length > 0 && (
                <View style={styles.valCont}>
                  <Text style={styles.identifierTxt}>Alternate Email :</Text>
                  <Text style={styles.valueTxt}>{routePayload?.email2}</Text>
                </View>
              )
            }

            {
              // nationality email review

              routePayload?.nationality?.length > 0 &&
                routePayload?.nationalityLabel?.length > 0 && (
                  <View style={styles.valCont}>
                    <Text style={styles.identifierTxt}>Nationality :</Text>
                    <Text style={styles.valueTxt}>
                      {routePayload?.nationalityLabel}
                    </Text>
                  </View>
                )
            }
          </LabelCard>
        )}

        {/* RESIDENTIAL ADDRESS REVIEW SECTION */}

        {(routePayload?.door?.length > 0 ||
          routePayload?.house?.length > 0 ||
          routePayload?.street?.length > 0 ||
          routePayload?.area?.length > 0 ||
          routePayload?.city?.length > 0 ||
          routePayload?.state?.length > 0 ||
          routePayload?.country?.length ||
          routePayload?.pincode?.length > 0) && (
          <LabelCard name="ADDRESS DETAILS">
            {
              // residential door review
              routePayload?.door?.length > 0 && (
                <View style={[styles.valCont, {marginTop: 0}]}>
                  <Text style={styles.identifierTxt}>Door Number :</Text>
                  <Text style={styles.valueTxt}>{routePayload?.door}</Text>
                </View>
              )
            }
            {
              // residential house review
              routePayload?.house?.length > 0 && (
                <View style={styles.valCont}>
                  <Text style={styles.identifierTxt}>House :</Text>
                  <Text style={styles.valueTxt}>{routePayload?.house}</Text>
                </View>
              )
            }

            {
              // residential street review
              routePayload?.street?.length > 0 && (
                <View style={styles.valCont}>
                  <Text style={styles.identifierTxt}>Street :</Text>
                  <Text style={styles.valueTxt}>{routePayload?.street}</Text>
                </View>
              )
            }

            {
              // residential area review
              routePayload?.area?.length > 0 && (
                <View style={styles.valCont}>
                  <Text style={styles.identifierTxt}>Area / Locality :</Text>
                  <Text style={styles.valueTxt}>{routePayload?.area}</Text>
                </View>
              )
            }

            {
              // residential city review
              routePayload?.city?.length > 0 && (
                <View style={styles.valCont}>
                  <Text style={styles.identifierTxt}>City :</Text>
                  <Text style={styles.valueTxt}>{routePayload?.city}</Text>
                </View>
              )
            }

            {
              // residential state review
              routePayload?.state?.length > 0 && (
                <View style={styles.valCont}>
                  <Text style={styles.identifierTxt}>State :</Text>
                  <Text style={styles.valueTxt}>{routePayload?.state}</Text>
                </View>
              )
            }

            {
              // residential country review
              routePayload?.country?.length > 0 && (
                <View style={styles.valCont}>
                  <Text style={styles.identifierTxt}>Country :</Text>
                  <Text style={styles.valueTxt}>{routePayload?.country}</Text>
                </View>
              )
            }

            {
              // residential pin review
              routePayload?.pincode?.length > 0 && (
                <View style={styles.valCont}>
                  <Text style={styles.identifierTxt}>PIN Code :</Text>
                  <Text style={styles.valueTxt}>{routePayload?.pincode}</Text>
                </View>
              )
            }
          </LabelCard>
        )}

        <PrimaryButton
          icon="check"
          style={styles.primaryBtn}
          name="Create Prospect"
          onPress={createProspect}
        />
      </ScrollView>
    </LinearGradient>
  );
};

export default ReviewProspect;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: COLORS.white,
  },
  identifierTxt: {
    flex: 1,
    color: COLORS.black,
    fontSize: SIZES.fontSmall,
    fontFamily: FONTS.josefinSansBold,
  },
  identifierTxtEx: {flex: 0, textAlignVertical: 'center'},
  valueTxt: {
    flex: 1.2,
    color: COLORS.black,
    fontSize: SIZES.fontSmall,
    fontFamily: FONTS.josefinSansRegular,
    textAlignVertical: 'center',
  },
  valCont: {
    flexDirection: 'row',
    flex: 1,
    marginTop: SIZES.paddingSmall,
  },
  valContEx: {
    height: SIZES.height * 0.065,
    paddingHorizontal: SIZES.paddingSmall,
    backgroundColor: COLORS.antiFlashWhite,
    borderRadius: SIZES.radiusSmall,
    padding: SIZES.paddingSmall,
  },
  dropStyle: {
    flex: 0.7,
    height: SIZES.height * 0.065,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: SIZES.radiusSmall,
    backgroundColor: COLORS.antiFlashWhite,
    paddingHorizontal: SIZES.paddingSmall,
    marginTop: SIZES.paddingSmall,
  },
  dropPlaceholder: {color: COLORS.gray, fontSize: SIZES.fontSmall},
  dropSelectedTxt: {color: COLORS.black, fontSize: SIZES.fontSmall},
  dropContainer: {
    borderColor: COLORS.lightGray,
    borderRadius: SIZES.radiusSmall,
    borderWidth: 1,
    overflow: 'hidden',
  },
  dropText: {
    color: COLORS.black,
    padding: SIZES.paddingSmall,
    fontFamily: FONTS.josefinSansRegular,
  },
  input: {
    marginTop: SIZES.paddingSmall,
    width: '100%',
    borderRadius: SIZES.radiusSmall,
    backgroundColor: COLORS.antiFlashWhite,
    borderColor: COLORS.lightGray,
    borderWidth: 1,
    fontSize: SIZES.fontSmall,
    fontFamily: FONTS.josefinSansRegular,
    height: SIZES.height * 0.065,
    paddingHorizontal: SIZES.paddingSmall,
    alignItems: 'center',
  },
  detailsSection: {
    padding: SIZES.paddingSmall,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateBtn: {
    justifyContent: 'flex-start',
    elevation: 0,
    shadowOpacity: 0,
  },
  primaryBtn: {
    alignSelf: 'center',
    width: SIZES.width * 0.9,
  },
});
