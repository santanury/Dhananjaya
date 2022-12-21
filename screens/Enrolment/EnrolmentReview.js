import {
  View,
  Text,
  StyleSheet,
  BackHandler,
  ScrollView,
  StatusBar,
} from 'react-native';
import {Buffer} from 'buffer';
import React, {useState, useEffect} from 'react';
import axios from 'axios';
import LinearGradient from 'react-native-linear-gradient';
import {showMessage} from 'react-native-flash-message';
import {RadioButton} from 'react-native-paper';
import moment from 'moment';
import {Store} from '../../store/Store';
import {COLORS, SIZES, FONTS} from '../../constants';

import {
  baseUrl,
  accessKey,
  get_patron_stage,
  create_patron,
} from '../../webApi/service';

// components
import Header from '../../components/Common/Header';
import LabelCard from '../../components/Common/LabelCard';
import PrimaryButton from '../../components/Common/PrimaryButton';

const EnrolmentReview = ({navigation, route}) => {
  const store = Store();

  const [routePayload, setRoutePayload] = useState({}); // route data for next screen
  const [isDonorPatron, setIsDonorPatron] = useState('N'); // is patron & donor same person
  const [isDonated, setIsDonated] = useState('N'); // has donated before or not

  useEffect(() => {
    const unSubscribe = navigation.addListener('focus', () => {
      BackHandler.addEventListener('hardwareBackPress', () => {
        console.log('BackHandler In EnrolmentReview is called');
        store.ptrnIncmp
          ? navigation.navigate('EnrolmentBahumanaPuja')
          : navigation.goBack();
        return true;
      });
      fetchUnfinished();
    });
    return unSubscribe;
  }, []);

  // fetch unsaved data
  const fetchUnfinished = async () => {
    let unsaved;

    const payload = {
      accessKey,
      deviceId: store?.deviceId,
      loginId: store?.userData?.userId,
      sessionId: store?.userData?.session_id,
      preacherCode: store?.userData?.id,
    };

    console.log('FETCH UNSAVED:', baseUrl + get_patron_stage, payload);

    await axios
      .post(baseUrl + get_patron_stage, payload)
      .then(res => {
        res.data.successCode === 1
          ? ((unsaved = JSON.parse(
              Buffer.from(res.data?.data[0]?.ptrnForm, 'base64').toString(
                'utf8',
              ),
            )),
            console.log('UNSAVED IN ENROLMENT REVIEW', unsaved),
            setRoutePayload(unsaved))
          : showMessage({
              message: 'Opps!',
              description: 'Something went wrong',
              type: 'danger',
              floating: true,
              icon: 'auto',
            });
      })
      .catch(err => {
        console.log('Error:', err),
          showMessage({
            message: 'Error!',
            description: 'Please check your internet connection',
            type: 'danger',
            floating: true,
            icon: 'auto',
          });
      });
  };

  // create patron
  const createPatron = async () => {
    let pujaDeails =
      routePayload?.pujaDeails?.length > 0
        ? JSON.stringify(routePayload?.pujaDeails)
        : '';

    let body = {
      accessKey,
      deviceId: store?.deviceId,
      loginId: store?.userData?.userId,
      sessionId: store?.userData?.session_id,
      userRole: store?.userData?.userRole,
      preacherCode: store?.userData?.id,
      createdBy: store?.userData?.id,

      trustId: store?.userData?.centerId,
      centerId: store?.userData?.centerId,

      salutation: routePayload?.salutation ? routePayload?.salutation : '',
      firstName: routePayload?.firstName ? routePayload?.firstName : '',
      lastName: routePayload?.lastName ? routePayload?.lastName : '',
      dob: routePayload?.dob ? routePayload?.dob : '',
      occupation: routePayload?.occupation ? routePayload?.occupation : '',
      spouseName: routePayload?.spouseName ? routePayload?.spouseName : '',
      mobile: routePayload?.mobileNumber ? routePayload?.mobileNumber : '',
      mobile2: routePayload?.mobile2 ? routePayload?.mobile2 : '',
      email: routePayload?.email ? routePayload?.email : '',
      email2: routePayload?.email2 ? routePayload?.email2 : '',
      pan: routePayload?.pan ? routePayload?.pan : '',
      nationality: routePayload?.nationality ? routePayload?.nationality : '',

      regAddress1: routePayload?.resDoor ? routePayload?.resDoor : '',
      regAddress2: routePayload?.resHouse ? routePayload?.resHouse : '',
      regAddress3: routePayload?.resStreet ? routePayload?.resStreet : '',
      regArea: routePayload?.resArea ? routePayload?.resArea : '',
      regCity: routePayload?.resCity ? routePayload?.resCity : '',
      regState: routePayload?.resState ? routePayload?.resState : '',
      regCountry: routePayload?.resCountry ? routePayload?.resCountry : '',
      regPincode: routePayload?.resPincode ? routePayload?.resPincode : '',

      offAddress1: routePayload?.offDoor ? routePayload?.offDoor : '',
      offAddress2: routePayload?.offBuilding ? routePayload?.offBuilding : '',
      offAddress3: routePayload?.offStreet ? routePayload?.offStreet : '',
      offArea: routePayload?.offArea ? routePayload?.offArea : '',
      offCity: routePayload?.offCity ? routePayload?.offCity : '',
      offState: routePayload?.offState ? routePayload?.offState : '',
      offCountry: routePayload?.offCountry ? routePayload?.offCountry : '',
      offPincode: routePayload?.offPincode ? routePayload?.offPincode : '',
      addressType: routePayload?.mailingPref ? routePayload?.mailingPref : '',
      mailingPref: routePayload?.mailingPref ? routePayload?.mailingPref : '',

      com1: routePayload?.com1 ? routePayload?.com1 : '',
      com2: routePayload?.com2 ? routePayload?.com2 : '',
      newsletter: routePayload?.newsletter ? routePayload?.newsletter : '',
      nameInscription: routePayload?.nameInscription
        ? routePayload?.nameInscription
        : '',
      lLocation: routePayload?.lLocation ? routePayload?.lLocation : '',
      yagna: routePayload?.yagna ? routePayload?.yagna : '',
      pujaDeails,
      isDonorPatron,
      isDonated,

      sevaCode: routePayload?.route?.sevaCode
        ? routePayload?.route?.sevaCode
        : '',
      sevaAmount: routePayload?.route?.sevaAmount
        ? routePayload?.route?.sevaAmount?.replace(/,/g, '') // <- conversion from 108,000 to 108000
        : '',

      // occupation: '',

      // slname1: '',
      // slname2: '',
      // slname3: '',
      // slname4: '',
      // slname5: '',
      // slname6: '',
      // patronLocation: '',
    };

    console.log('CREATE PATRON PAYLOAD:', baseUrl + create_patron, body);

    await axios
      .post(baseUrl + create_patron, body)
      .then(res => {
        res?.data?.successCode === 1
          ? (store.setPtrnIncmp(false),
            showMessage({
              message: 'Success!',
              description: 'Patron created successfully',
              type: 'success',
              floating: true,
              icon: 'auto',
            }),
            store?.setRouteInfo({
              ...routePayload?.route,
              patronId: res?.data?.patronId,
            }),
            !res?.data?.donorId
              ? navigation?.navigate('DonorSelection', {from: 'ENRL'})
              : (store.setNewDonor({
                  donorId: res?.data?.donorId,
                  salutation: routePayload?.salutation,
                  firstName: routePayload?.firstName,
                  lastName: routePayload?.lastName,
                  mobileNumber: routePayload?.mobileNumber,
                  mobile2: routePayload?.mobile2,
                  email: routePayload?.email,
                  email2: routePayload?.email2,
                  nationality: routePayload?.nationality,
                  pan: routePayload?.pan,
                }),
                navigation.navigate('DonationReceiept', {from: 'ENRL'})))
          : (showMessage({
              message: 'Opps!',
              description: 'Something went wrong',
              type: 'danger',
              floating: true,
              icon: 'auto',
            }),
            navigation.navigate('CustomDrawer'));
      })
      .catch(err => {
        console.log('CREATE PATRON:', err),
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
        title="PATRONSHIP PREVIEW"
        onPressLeft={() => {
          store.ptrnIncmp
            ? navigation.navigate('EnrolmentBahumanaPuja')
            : navigation.goBack();
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
              // dob review
              routePayload?.dob?.length > 0 && (
                <View style={styles.valCont}>
                  <Text style={styles.identifierTxt}>DOB :</Text>
                  <Text style={styles.valueTxt}>
                    {moment(routePayload?.dob, 'MM-DD-YYYY').format(
                      'DD/MMM/YYYY',
                    )}
                  </Text>
                </View>
              )
            }

            {
              // occupatin review
              routePayload?.occupation?.length > 0 && (
                <View style={styles.valCont}>
                  <Text style={styles.identifierTxt}>Occupation :</Text>
                  <Text style={styles.valueTxt}>
                    {routePayload?.occupation}
                  </Text>
                </View>
              )
            }

            {
              // spouce review
              routePayload?.spouseName?.length > 0 && (
                <View style={styles.valCont}>
                  <Text style={styles.identifierTxt}>Spouce Name :</Text>
                  <Text style={styles.valueTxt}>
                    {routePayload?.spouseName}
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

        {(routePayload?.resDoor?.length > 0 ||
          routePayload?.resHouse?.length > 0 ||
          routePayload?.resStreet?.length > 0 ||
          routePayload?.resArea?.length > 0 ||
          routePayload?.resCity?.length > 0 ||
          routePayload?.resState?.length > 0 ||
          routePayload?.resCountry?.length ||
          routePayload?.resPincode?.length > 0) && (
          <LabelCard name="RESIDENTIAL ADDRESS DETAILS">
            {
              // residential door review
              routePayload?.resDoor?.length > 0 && (
                <View style={[styles.valCont, {marginTop: 0}]}>
                  <Text style={styles.identifierTxt}>Door Number :</Text>
                  <Text style={styles.valueTxt}>{routePayload?.resDoor}</Text>
                </View>
              )
            }
            {
              // residential house review
              routePayload?.resHouse?.length > 0 && (
                <View style={styles.valCont}>
                  <Text style={styles.identifierTxt}>House :</Text>
                  <Text style={styles.valueTxt}>{routePayload?.resHouse}</Text>
                </View>
              )
            }

            {
              // residential street review
              routePayload?.resStreet?.length > 0 && (
                <View style={styles.valCont}>
                  <Text style={styles.identifierTxt}>Street :</Text>
                  <Text style={styles.valueTxt}>{routePayload?.resStreet}</Text>
                </View>
              )
            }

            {
              // residential area review
              routePayload?.resArea?.length > 0 && (
                <View style={styles.valCont}>
                  <Text style={styles.identifierTxt}>Area / Locality :</Text>
                  <Text style={styles.valueTxt}>{routePayload?.resArea}</Text>
                </View>
              )
            }

            {
              // residential city review
              routePayload?.resCity?.length > 0 && (
                <View style={styles.valCont}>
                  <Text style={styles.identifierTxt}>City :</Text>
                  <Text style={styles.valueTxt}>{routePayload?.resCity}</Text>
                </View>
              )
            }

            {
              // residential state review
              routePayload?.resState?.length > 0 && (
                <View style={styles.valCont}>
                  <Text style={styles.identifierTxt}>State :</Text>
                  <Text style={styles.valueTxt}>{routePayload?.resState}</Text>
                </View>
              )
            }

            {
              // residential country review
              routePayload?.resCountry?.length > 0 && (
                <View style={styles.valCont}>
                  <Text style={styles.identifierTxt}>Country :</Text>
                  <Text style={styles.valueTxt}>
                    {routePayload?.resCountry}
                  </Text>
                </View>
              )
            }

            {
              // residential pin review
              routePayload?.resPincode?.length > 0 && (
                <View style={styles.valCont}>
                  <Text style={styles.identifierTxt}>PIN Code :</Text>
                  <Text style={styles.valueTxt}>
                    {routePayload?.resPincode}
                  </Text>
                </View>
              )
            }
          </LabelCard>
        )}

        {/* OFFICE ADDRESS REVIEW SECTION */}

        {(routePayload?.offDoor?.length > 0 ||
          routePayload?.offBuilding?.length > 0 ||
          routePayload?.offStreet?.length > 0 ||
          routePayload?.offArea?.length > 0 ||
          routePayload?.offCity?.length > 0 ||
          routePayload?.offState?.length > 0 ||
          routePayload?.offCountry?.length > 0 ||
          routePayload?.offPincode?.length > 0) && (
          <LabelCard name="OFFICE ADDRESS DETAILS">
            {
              // office door review
              routePayload?.offDoor?.length > 0 && (
                <View style={[styles.valCont, {marginTop: 0}]}>
                  <Text style={styles.identifierTxt}>Door Number :</Text>
                  <Text style={styles.valueTxt}>{routePayload?.offDoor}</Text>
                </View>
              )
            }

            {
              // office building review
              routePayload?.offBuilding?.length > 0 && (
                <View style={styles.valCont}>
                  <Text style={styles.identifierTxt}>Building :</Text>
                  <Text style={styles.valueTxt}>
                    {routePayload?.offBuilding}
                  </Text>
                </View>
              )
            }

            {
              // office street review
              routePayload?.offStreet?.length > 0 && (
                <View style={styles.valCont}>
                  <Text style={styles.identifierTxt}>Street :</Text>
                  <Text style={styles.valueTxt}>{routePayload?.offStreet}</Text>
                </View>
              )
            }

            {
              // office area review
              routePayload?.offArea?.length > 0 && (
                <View style={styles.valCont}>
                  <Text style={styles.identifierTxt}>Area / Locality :</Text>
                  <Text style={styles.valueTxt}>{routePayload?.offArea}</Text>
                </View>
              )
            }

            {
              // office city review
              routePayload?.offCity?.length > 0 && (
                <View style={styles.valCont}>
                  <Text style={styles.identifierTxt}>City :</Text>
                  <Text style={styles.valueTxt}>{routePayload?.offCity}</Text>
                </View>
              )
            }

            {
              // office state review
              routePayload?.offState?.length > 0 && (
                <View style={styles.valCont}>
                  <Text style={styles.identifierTxt}>State :</Text>
                  <Text style={styles.valueTxt}>{routePayload?.offState}</Text>
                </View>
              )
            }

            {
              // office country review
              routePayload?.offCountry?.length > 0 && (
                <View style={styles.valCont}>
                  <Text style={styles.identifierTxt}>Country :</Text>
                  <Text style={styles.valueTxt}>
                    {routePayload?.offCountry}
                  </Text>
                </View>
              )
            }

            {
              // office pin review
              routePayload?.offPincode?.length > 0 && (
                <View style={styles.valCont}>
                  <Text style={styles.identifierTxt}>PIN Code :</Text>
                  <Text style={styles.valueTxt}>
                    {routePayload?.offPincode}
                  </Text>
                </View>
              )
            }
          </LabelCard>
        )}

        {/* BAHUMANA DETAILS REVIEW SECTION */}

        {(routePayload?.com1?.length?.length > 0 ||
          routePayload?.com2?.length > 0 ||
          routePayload?.newsletter?.length > 0 ||
          routePayload?.nameInscription?.length > 0 ||
          routePayload?.lLocation?.length > 0 ||
          routePayload?.yagna?.length > 0) && (
          <LabelCard name="BAHUMANA DETAILS">
            {routePayload?.com1?.length > 0 &&
              routePayload?.com1Label?.length > 0 && (
                <View // commentry 1 review
                  style={styles.valCont}>
                  <Text style={styles.identifierTxt}>Commentry 1 :</Text>
                  <Text style={styles.valueTxt}>{routePayload?.com1Label}</Text>
                </View>
              )}

            {
              // commentry 2 review

              routePayload?.com2?.length > 0 &&
                routePayload?.com2Label?.length > 0 && (
                  <View style={styles.valCont}>
                    <Text style={styles.identifierTxt}>Commentry 2 :</Text>
                    <Text style={styles.valueTxt}>
                      {routePayload?.com2Label}
                    </Text>
                  </View>
                )
            }

            {
              // newsletter review

              routePayload?.newsletter?.length > 0 &&
                routePayload?.newsletterLabel?.length > 0 && (
                  <View style={styles.valCont}>
                    <Text style={styles.identifierTxt}>Newsletter 2 :</Text>
                    <Text style={styles.valueTxt}>
                      {routePayload?.newsletterLabel}
                    </Text>
                  </View>
                )
            }

            {
              // wall inscription review
              routePayload?.nameInscription?.length > 0 && (
                <View style={styles.valCont}>
                  <Text style={styles.identifierTxt}>Wall Inscription :</Text>
                  <Text style={styles.valueTxt}>
                    {routePayload?.nameInscription}
                  </Text>
                </View>
              )
            }

            {
              // wall inscription location review
              routePayload?.lLocation?.length > 0 && (
                <View style={styles.valCont}>
                  <Text style={styles.identifierTxt}>Location :</Text>
                  <Text style={styles.valueTxt}>{routePayload?.lLocation}</Text>
                </View>
              )
            }

            {
              // yagna review

              routePayload?.yagna?.length > 0 &&
                routePayload?.yagnaLable?.length > 0 && (
                  <View style={styles.valCont}>
                    <Text style={styles.identifierTxt}>Yagna :</Text>
                    <Text style={styles.valueTxt}>
                      {routePayload?.yagnaLabel}
                    </Text>
                  </View>
                )
            }
          </LabelCard>
        )}

        {/* PUJA DATES REVIEW SECTION */}

        {[
          ...Array(
            Math.max(
              typeof routePayload?.pujaDeails?.length === 'number'
                ? routePayload?.pujaDeails?.length
                : 0,
            ),
          ).keys(),
        ].map((item, index) => (
          <LabelCard key={index} name={`PUJA DATE ${index + 1}`}>
            {
              // date review

              routePayload?.pujaDeails?.[index]?.month &&
                routePayload?.pujaDeails?.[index]?.day && (
                  <View style={styles.valCont}>
                    <Text style={styles.identifierTxt}>Date :</Text>
                    <Text style={styles.valueTxt}>
                      {routePayload?.pujaDeails?.[index]?.month +
                        ` ` +
                        routePayload?.pujaDeails?.[index]?.day}
                    </Text>
                  </View>
                )
            }

            {
              // occasion review
              routePayload?.pujaDeails?.[index]?.occasion && (
                <View style={styles.valCont}>
                  <Text style={styles.identifierTxt}>Ocassion :</Text>
                  <Text style={styles.valueTxt}>
                    {routePayload?.pujaDeails?.[index]?.occasion}
                  </Text>
                </View>
              )
            }
            {
              // name review
              routePayload?.pujaDeails?.[index]?.name && (
                <View style={styles.valCont}>
                  <Text style={styles.identifierTxt}>Name :</Text>
                  <Text style={styles.valueTxt}>
                    {routePayload?.pujaDeails?.[index]?.name}
                  </Text>
                </View>
              )
            }
            {
              // relation review
              routePayload?.pujaDeails?.[index]?.relation && (
                <View style={styles.valCont}>
                  <Text style={styles.identifierTxt}>Relation :</Text>
                  <Text style={styles.valueTxt}>
                    {routePayload?.pujaDeails?.[index]?.relation}
                  </Text>
                </View>
              )
            }
          </LabelCard>
        ))}

        {/* DONATIO CHOICE */}

        <LabelCard name="DONATION">
          {/* DONOR PATRON SAME SELECTION */}

          <>
            <Text style={styles.identifierTxt}>
              Is the donor same as patron?
            </Text>
            <View style={styles.valCont}>
              <View style={{flexDirection: 'row'}}>
                <RadioButton
                  value="Y"
                  status={isDonorPatron === 'Y' ? 'checked' : 'unchecked'}
                  onPress={() => setIsDonorPatron('Y')}
                />
                <Text style={[styles.valueTxt, {flex: 0}]}>Yes</Text>
              </View>

              <View style={{flexDirection: 'row'}}>
                <RadioButton
                  value="N"
                  status={isDonorPatron === 'N' ? 'checked' : 'unchecked'}
                  onPress={() => (setIsDonorPatron('N'), setIsDonated('N'))}
                />
                <Text style={[styles.valueTxt, {flex: 0}]}>No</Text>
              </View>
            </View>
          </>

          {/* PREVIOUS DONATION SELECTION SECTION */}

          {isDonorPatron === 'Y' && (
            <>
              <Text style={styles.identifierTxt}>
                Has the donor donated before?
              </Text>
              <View style={styles.valCont}>
                <View style={{flexDirection: 'row'}}>
                  <RadioButton
                    value="Y"
                    status={isDonated === 'Y' ? 'checked' : 'unchecked'}
                    onPress={() => setIsDonated('Y')}
                  />
                  <Text style={[styles.valueTxt, {flex: 0}]}>Yes</Text>
                </View>

                <View style={{flexDirection: 'row'}}>
                  <RadioButton
                    value="N"
                    status={isDonated === 'N' ? 'checked' : 'unchecked'}
                    onPress={() => setIsDonated('N')}
                  />
                  <Text style={[styles.valueTxt, {flex: 0}]}>No</Text>
                </View>
              </View>
            </>
          )}
        </LabelCard>

        <PrimaryButton
          icon="check"
          style={styles.primaryBtn}
          name="Create Patron "
          onPress={createPatron}
        />
      </ScrollView>
    </LinearGradient>
  );
};

export default EnrolmentReview;

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
