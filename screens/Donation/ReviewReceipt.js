import {View, Text, StyleSheet, BackHandler, ScrollView} from 'react-native';
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import LinearGradient from 'react-native-linear-gradient';
import moment from 'moment';
import {showMessage} from 'react-native-flash-message';
import {Store} from '../../store/Store';
import {COLORS, SIZES, FONTS} from '../../constants';
import {
  baseUrl,
  accessKey,
  get_blocked_slot,
  generate_app_receipt,
} from '../../webApi/service';

// components
import Header from '../../components/Common/Header';
import LabelCard from '../../components/Common/LabelCard';
import PrimaryButton from '../../components/Common/PrimaryButton';

const ReviewReceipt = ({navigation, route}) => {
  var converter = require('number-to-words');
  const store = Store();

  const [receieptCreated, setReceiptCreated] = useState(false); // receipt created or not

  useEffect(() => {
    const unSubscribe = navigation.addListener('focus', () => {
      console.log('Review Receipt Focused');
      BackHandler.addEventListener('hardwareBackPress', () => {
        console.log('BackHandler In Review Receipt is called');
        navigation.goBack();
        return true;
      });
    });
    return unSubscribe;
  }, [store?.routeInfo]);

  // on press create receipt
  const onPressCreateReceipt = async () => {
    setReceiptCreated(true);
    const payload = {
      accessKey,
      deviceId: store?.deviceId,
      loginId: store?.userData?.userId,
      sessionId: store?.userData?.session_id,
      categoryId: store?.routeInfo?.categoryCode,
      subCategoryId: store?.routeInfo?.purposeId,
      sevaId: store?.routeInfo?.sevaId,
      bookedOn: moment(new Date()).format('YYYY-MM-DD'),
      sevaCalendarId: store?.routeInfo?.sevaCalendarId,
      donationCode: store?.routeInfo?.donationCode,
    };

    console.log('GET BLOCKED SLOT IDS :', baseUrl + get_blocked_slot, payload);

    await axios
      .post(baseUrl + get_blocked_slot, payload)
      .then(res => {
        res?.data?.successCode === 1
          ? createReceiept(res?.data?.data?.[0]?.slotId)
          : (showMessage({
              message: 'Opps!',
              description: res?.data?.message,
              type: 'warning',
              floating: true,
              icon: 'auto',
            }),
            setReceiptCreated(false));
      })
      .catch(err => {
        console.log('Error while getting blocked slot', err);
        showMessage({
          message: 'Error!',
          description: 'Please check your internet connection',
          type: 'danger',
          floating: true,
          icon: 'auto',
        });
        setReceiptCreated(false);
      });
  };

  // create receiept
  const createReceiept = async params => {
    let payload = {
      accessKey,
      deviceId: store?.deviceId,
      loginId: store?.userData?.userId,
      sessionId: store?.userData?.session_id,
      trustId: store?.userData?.trustId,
      centerId: store?.userData?.centerId,

      preacherCode:
        store?.newDonor?.preacherCode?.replace(/ /g, '')?.length > 0
          ? store?.newDonor?.preacherCode
          : store?.userData?.id,
      createdBy: store?.userData?.id,
      patronId: store?.routeInfo?.patronId ? store?.routeInfo?.patronId : '',
      donorId: store?.newDonor?.donorId,
      drAmount: store?.routeInfo?.drAmount ? store?.routeInfo?.drAmount : '0',
      sevaId: store?.routeInfo?.sevaId,
      donorName:
        store?.newDonor?.salutation +
        ' ' +
        store?.newDonor?.firstName +
        ' ' +
        store?.newDonor?.lastName,
      emailID: store?.newDonor?.email ? store?.newDonor?.email : '',
      mobile: store?.newDonor?.mobileNumber
        ? store?.newDonor?.mobileNumber
        : '',
      pan: store?.newDonor?.pan ? store?.newDonor?.pan : '',
      sevaCode: store?.routeInfo?.sevaCode ? store?.routeInfo?.sevaCode : '',
      sevaCalendarId: store?.routeInfo?.sevaCalendarId
        ? store?.routeInfo?.sevaCalendarId
        : store?.routeInfo?.sevaCalendarId,
      donationCode: store?.routeInfo?.donationCode
        ? store?.routeInfo?.donationCode
        : '',
      slotBased: store?.routeInfo?.slotBased ? store?.routeInfo?.slotBased : '',
      is80gRequired: store?.routeInfo?.is80gRequired
        ? store?.routeInfo?.is80gRequired
        : '',
      paymentMode: store?.routeInfo?.paymentMode
        ? store?.routeInfo?.paymentMode
        : '',
      noOfCheques: store?.routeInfo?.noOfCheques
        ? store?.routeInfo?.noOfCheques
        : '',
      insBank: store?.routeInfo?.referenceNo
        ? store?.routeInfo?.referenceNo
        : '',
      currencyCode: store?.routeInfo?.currency
        ? store?.routeInfo?.currency
        : '',
      sevakartaName: store?.routeInfo?.sevakartaName
        ? store?.routeInfo?.sevakartaName
        : '',
      // sevaDate: store?.routeInfo?.sevaDate
      //   ? store?.routeInfo?.sevaDate
      //   : store?.routeInfo?.drSevaDate,
      drDate: moment(new Date())?.format('DD-MMM-YYYY'),
      drSevaDate: store?.routeInfo?.drSevaDate
        ? store?.routeInfo?.drSevaDate
        : '',

      ...(store?.routeInfo?.categoryId === '5' && {
        noOfSlots: store?.routeInfo?.noOfSlots,
      }),

      ...(store?.routeInfo?.slotBased === 'Y' && {slotId: params}),
    };

    console.log('GENERATE RECEIPT:', baseUrl + generate_app_receipt, payload);

    await axios
      .post(baseUrl + generate_app_receipt, payload)
      .then(res => {
        res?.data?.successCode === 1
          ? (showMessage({
              message: 'Success!',
              description: `Receipt created successfully,\nYour DR Number is ${res?.data?.data?.[0]?.drNumber}`,
              type: 'success',
              floating: true,
              icon: 'auto',
              autoHide: false,
              duration: 20000, // <-not required / useless when autoHide is false
            }),
            setTimeout(() => {
              store?.setNewDonor({}),
                store?.setRouteInfo({}),
                navigation.navigate('CustomDrawer');
            }, 10000))
          : (showMessage({
              message: 'Opps!',
              description: 'Something went wrong, receipt not generated',
              type: 'info',
              floating: true,
              icon: 'auto',
            }),
            setReceiptCreated(false),
            console.log('Response in generate receipt', res.data));
      })
      .catch(err => {
        console.log('Error create receipt', err);
        showMessage({
          message: 'Error!',
          description: 'Please check your internet connection',
          type: 'danger',
          floating: true,
          icon: 'auto',
        });
        setReceiptCreated(false);
      });
  };

  return (
    <LinearGradient // gradient container
      colors={[COLORS.tertiary, COLORS.quaternary, COLORS.mistyMoss]}
      style={styles.container}>
      <Header // header
        color={COLORS.black}
        leftButtonIcon="chevron-left"
        title="REVIEW RECIEPT"
        onPressLeft={() => navigation.goBack()}
      />
      <ScrollView
        style={{flex: 1}}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          alignItems: 'center',
          paddingBottom: SIZES.paddingHuge,
        }}>
        {/* PERSONAL DETAILS REVIEW SECTION */}

        <LabelCard name="PERSONAL DETAILS">
          {
            // patron id review
            store?.newDonor?.patronId && (
              <View style={[styles.valCont, {marginTop: 0}]}>
                <Text style={styles.identifierTxt}>Patron ID :</Text>
                <Text style={styles.valueTxt}>{store?.newDonor?.patronId}</Text>
              </View>
            )
          }

          {
            // donor id review
            store?.newDonor?.donorId?.length > 0 && (
              <View
                style={[
                  styles.valCont,
                  {
                    marginTop: store?.newDonor?.patronId
                      ? SIZES.paddingSmall
                      : 0,
                  },
                ]}>
                <Text style={styles.identifierTxt}>Donor ID :</Text>
                <Text style={styles.valueTxt}>{store?.newDonor?.donorId}</Text>
              </View>
            )
          }

          {
            // name review
            (store?.newDonor?.salutation?.length > 0 ||
              store?.newDonor?.firstName?.length > 0 ||
              store?.newDonor?.lastName?.length > 0) && (
              <View style={styles.valCont}>
                <Text style={styles.identifierTxt}>Donor Name :</Text>
                <Text style={styles.valueTxt}>
                  {store?.newDonor?.salutation +
                    ' ' +
                    store?.newDonor?.firstName +
                    ' ' +
                    store?.newDonor?.lastName}
                </Text>
              </View>
            )
          }

          {
            // mobile review
            store?.newDonor?.mobileNumber?.length > 0 && (
              <View style={styles.valCont}>
                <Text style={styles.identifierTxt}>Mobile :</Text>
                <Text style={styles.valueTxt}>
                  {store?.newDonor?.mobileNumber}
                </Text>
              </View>
            )
          }

          {
            // alternate mobile review
            store?.newDonor?.alternateMobile?.length > 0 && (
              <View style={styles.valCont}>
                <Text style={styles.identifierTxt}>Alternate Mobile :</Text>
                <Text style={styles.valueTxt}>
                  {store?.newDonor?.alternateMobile}
                </Text>
              </View>
            )
          }

          {
            // email review
            store?.newDonor?.email?.length > 0 && (
              <View style={styles.valCont}>
                <Text style={styles.identifierTxt}>Email :</Text>
                <Text style={styles.valueTxt}>{store?.newDonor?.email}</Text>
              </View>
            )
          }

          {
            // alternate email review
            store?.newDonor?.alternateEmai?.length > 0 && (
              <View style={styles.valCont}>
                <Text style={styles.identifierTxt}>Alternate Email :</Text>
                <Text style={styles.valueTxt}>
                  {store?.newDonor?.alternateEmail}
                </Text>
              </View>
            )
          }
          {
            // pan review
            store?.newDonor?.pan?.length > 0 && (
              <View style={styles.valCont}>
                <Text style={styles.identifierTxt}>PAN :</Text>
                <Text style={styles.valueTxt}>{store?.newDonor?.pan}</Text>
              </View>
            )
          }

          {
            // nationality review
            store?.newDonor?.nationalityLabel?.length > 0 && (
              <View style={styles.valCont}>
                <Text style={styles.identifierTxt}>Nationalilty :</Text>
                <Text style={styles.valueTxt}>
                  {store?.newDonor?.nationalityLabel}
                </Text>
              </View>
            )
          }
        </LabelCard>

        {/* SEVA DETAILS REVIEW SECTION */}

        <LabelCard name="SEVA DETAILS">
          {
            // seva category review
            store?.routeInfo?.categoryName?.length > 0 && (
              <View style={styles.valCont}>
                <Text style={styles.identifierTxt}>Seva Category :</Text>
                <Text style={styles.valueTxt}>
                  {store?.routeInfo?.categoryName?.replace(/\w\S*/g, txt => {
                    return (
                      txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
                    );
                  })}
                </Text>
              </View>
            )
          }

          {
            // seva purpose review
            store?.routeInfo?.purposeTitle?.length > 0 && (
              <View style={styles.valCont}>
                <Text style={styles.identifierTxt}>Seva Purpose :</Text>
                <Text style={styles.valueTxt}>
                  {store?.routeInfo?.purposeTitle?.replace(/\w\S*/g, txt => {
                    return (
                      txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
                    );
                  })}
                </Text>
              </View>
            )
          }

          {
            // seva name review
            store?.routeInfo?.sevaName?.length > 0 && (
              <View style={styles.valCont}>
                <Text style={styles.identifierTxt}>Seva Name :</Text>
                <Text style={styles.valueTxt}>
                  {store?.routeInfo?.sevaName
                    ?.replace(/-/g, ' ')
                    ?.replace(/\w\S*/g, txt => {
                      return (
                        txt.charAt(0).toUpperCase() +
                        txt.substr(1).toLowerCase()
                      );
                    })}
                </Text>
              </View>
            )
          }

          {
            // seva karta name review
            store?.routeInfo?.sevakartaName?.length > 0 && (
              <View style={styles.valCont}>
                <Text style={styles.identifierTxt}>Seva Karta Name :</Text>
                <Text style={styles.valueTxt}>
                  {store?.routeInfo?.sevakartaName}
                </Text>
              </View>
            )
          }

          {
            // seva date review
            store?.routeInfo?.sevaDate?.length > 0 && (
              <View style={styles.valCont}>
                <Text style={styles.identifierTxt}>Seva Date :</Text>
                <Text style={styles.valueTxt}>
                  {store?.routeInfo?.sevaDate}
                </Text>
              </View>
            )
          }

          {
            // dr seva date review
            store?.routeInfo?.drSevaDate?.length > 0 && (
              <View style={styles.valCont}>
                <Text style={styles.identifierTxt}>DR Seva Date :</Text>
                <Text style={styles.valueTxt}>
                  {store?.routeInfo?.drSevaDate}
                </Text>
              </View>
            )
          }
        </LabelCard>

        {/* PAYMENT DETAILS REVIEW SECTION */}

        <LabelCard name="PAYMENT DETAILS">
          {
            // payment mode review
            store?.routeInfo?.paymentMode?.length > 0 && (
              <View style={[styles.valCont, {marginTop: 0}]}>
                <Text style={styles.identifierTxt}>Payment Mode :</Text>
                <Text style={styles.valueTxt}>
                  {store?.routeInfo?.paymentMode}
                </Text>
              </View>
            )
          }

          {
            // amount review
            store?.routeInfo?.drAmount?.length > 0 && (
              <>
                <View // amount value review  `
                  style={styles.valCont}>
                  <Text
                    style={
                      styles.identifierTxt
                    }>{`Amount in ${store?.routeInfo?.currency}:`}</Text>
                  <Text style={styles.valueTxt}>
                    {store?.routeInfo?.drAmount}
                  </Text>
                </View>

                <View // amount in words review
                  style={styles.valCont}>
                  <Text style={styles.identifierTxt}>Amount in Words :</Text>
                  <Text style={styles.valueTxt}>
                    {converter
                      .toWords(store?.routeInfo?.drAmount)
                      ?.replace(/\w\S*/g, txt => {
                        return (
                          txt.charAt(0).toUpperCase() +
                          txt.substr(1).toLowerCase()
                        );
                      })}
                  </Text>
                </View>
              </>
            )
          }

          {
            // 80g required review
            store?.routeInfo?.is80gRequired?.length > 0 && (
              <View style={styles.valCont}>
                <Text style={styles.identifierTxt}>Require for 80G :</Text>
                <Text style={styles.valueTxt}>
                  {store?.routeInfo?.is80gRequired === 'Y' ? 'Yes' : 'No'}
                </Text>
              </View>
            )
          }
        </LabelCard>

        {!receieptCreated && (
          <PrimaryButton
            icon="playlist-edit"
            style={styles.primaryBtn}
            name="Create Reciept"
            onPress={onPressCreateReceipt}
          />
        )}
      </ScrollView>
    </LinearGradient>
  );
};

export default ReviewReceipt;

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
