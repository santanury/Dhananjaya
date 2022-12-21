import {StyleSheet, Text, View, TouchableOpacity, Linking} from 'react-native';
import React, {useState} from 'react';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Store} from '../../store/Store';
import {showMessage} from 'react-native-flash-message';
import axios from 'axios';
import {COLORS, SIZES, FONTS, SHADOW} from '../../constants';
import {baseUrl, accessKey, share_payment_link} from '../../webApi/service';

import AnimatableLowerModal from '../Common/AnimatableLowerModal';
import PrimaryButton from '../Common/PrimaryButton';

const Card = props => {
  const store = Store();

  const [pmntLnkMdl, setPmntLnkMdl] = useState(false); // payment link share modal
  const [pmntLnkConTgl, setPmntLnkConTgl] = useState(false); // multiple contacts mode toggle fro payment link
  const [noSelect, setNoSelect] = useState(false); // number select modal
  const [contactType, setContactType] = useState(''); // modal name

  // share payment link
  const sharePaymentLnk = async params => {
    console.log(params?.contact);

    console.log(
      '',
      '\n======== SHARE PAYMENT LINK ========',
      '\naccessKey:',
      accessKey,
      '\nloginId:',
      store.userData?.userId,
      '\nsessionId:',
      store.userData?.session_id,
      '\ndeviceId:',
      store.deviceId,
      '\ndonorId:',
      props?.data?.donorId,
      '\nsendThrough',
      params?.type === 'W'
        ? 'whatsapp'
        : params?.type === 'E'
        ? 'email'
        : 'sms',
      '\n================================',
    );

    await axios
      .post(baseUrl + share_payment_link, {
        accessKey,
        loginId: store.userData?.userId,
        sessionId: store.userData?.session_id,
        deviceId: store.deviceId,
        donorId: props?.data?.donorId,
        sendThrough:
          params?.type === 'W'
            ? 'whatsapp'
            : params?.type === 'E'
            ? 'email'
            : 'sms',
      })
      .then(res => {
        res?.data?.successCode === 1
          ? params?.type === 'W'
            ? (console.log(res?.data?.whatsappMessage),
              params?.contact?.length === 10
                ? Linking.openURL(
                    `whatsapp://send?phone=${`+91${params?.contact}`}&text=${
                      res?.data?.whatsappMessage
                    }`,
                  )
                : Linking.openURL(
                    `whatsapp://send?phone=${params?.contact}&text=${res?.data?.whatsappMessage}`,
                  ))
            : params?.type === 'E'
            ? showMessage({
                message: 'Success!',
                description: 'Payment link shared via email',
                type: 'info',
                floating: true,
                icon: 'auto',
              })
            : showMessage({
                message: 'Success!',
                description: 'Payment link shared via message',
                type: 'info',
                floating: true,
                icon: 'auto',
              })
          : showMessage({
              message: 'Opps!',
              description: 'Something went wrong',
              type: 'warning',
              floating: true,
              icon: 'auto',
            });
        setPmntLnkMdl(false), setPmntLnkConTgl(false), setContactType('');
      })
      .catch(err => {
        console.log('Error share payment link', err);
        showMessage({
          message: 'Error!',
          description: 'Please check your internet connection',
          type: 'danger',
          floating: true,
          icon: 'auto',
        });
      });

    // params?.type === 'W'
    //   ? Linking.openURL(
    //       `whatsapp://send?phone=${params?.contact}&text=${
    //         'Hare Krishna,' + '\n' + '\nYour payment link is:' + '\n'
    //       }`,
    //     )
    //   : params?.type === 'M'
    //   ? Linking.openURL(
    //       `mailto:${params?.contact}?subject=${'Payment Link'}&body=${'Hello'}`,
    //     )
    //   : Linking.openURL(
    //       `mailto:${params?.contact}?subject=${'Payment Link'}&body=${
    //         'Hare Krishna,' + '\n' + '\nYour payment link is:' + '\n'
    //       }`,
    //     );
  };

  return (
    <Animatable.View // container
      animation={'zoomIn'}
      duration={700}
      delay={props.index * 100}
      style={styles.container}>
      {/* CARD HEADER */}

      <LinearGradient // card header
        style={styles.header}
        colors={[
          COLORS.activeGreen + '70',
          COLORS.activeGreen + '60',
          COLORS.activeGreen + '50',
        ]}>
        <View // name & prospect id
          style={{flex: 1}}>
          <Text // name on the card
            style={styles.identifierTxt}>
            {props?.data?.donorName}
          </Text>
          <Text // prospect id
            style={styles.valueTxt}>
            {props?.data?.donorId}
          </Text>
        </View>

        <View // header right item container
          style={{flexDirection: 'row'}}>
          <TouchableOpacity // payment link button
            onPress={() => setPmntLnkMdl(true)}
            style={[styles.lowerBtn, {marginRight: SIZES.paddingSmall}]}>
            <MaterialCommunityIcons // payment button
              name="credit-card"
              size={25}
              color={COLORS.primary}
            />
          </TouchableOpacity>

          <TouchableOpacity // call button
            style={[styles.lowerBtn, {marginRight: SIZES.paddingSmall}]}
            onPress={() =>
              props?.data?.mobileNos || props?.data?.mobileNos === ':'
                ? props?.data?.mobileNos.split(':').length > 1
                  ? (setNoSelect(true), setContactType('C'))
                  : Linking.openURL(`tel:${props?.data?.mobileNos}`)
                : Alert.alert(
                    'No Mobile Number',
                    'No Mobile Number is available for this donor',
                    [{text: 'OK'}],
                    {cancelable: false},
                  )
            }>
            <MaterialCommunityIcons // call icon
              name="phone"
              size={25}
              color={COLORS.blue}
            />
          </TouchableOpacity>

          <TouchableOpacity // whatsapp button
            style={styles.lowerBtn}
            onPress={() => {
              props?.data?.mobileNos || props?.data?.mobileNos === ':'
                ? props?.data?.mobileNos.split(':').length > 1
                  ? (setNoSelect(true), setContactType('W'))
                  : (console.log(props?.data?.mobileNos.length),
                    props?.data?.mobileNos?.length === 10
                      ? Linking.openURL(
                          `whatsapp://send?phone=${`+91${props?.data?.mobileNos}`}`,
                        )
                      : Linking.openURL(
                          `whatsapp://send?phone=${
                            91 + props?.data?.mobileNos
                          }`,
                        ))
                : Alert.alert(
                    'No Mobile Number',
                    'No Mobile Number is available for this donor',
                    [{text: 'OK'}],
                    {cancelable: false},
                  );
            }}>
            <MaterialCommunityIcons // whatsapp icon
              name="whatsapp"
              size={25}
              color={COLORS.whatsApp}
            />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* SHARE PAYMENT LINK */}

      <AnimatableLowerModal
        title="SHARE PAYMENT LINK"
        isOpen={pmntLnkMdl}
        onClose={() => (
          setPmntLnkMdl(false), setPmntLnkConTgl(false), setContactType('')
        )}>
        {!pmntLnkConTgl ? (
          <View // icon button container
            style={{flexDirection: 'row'}}>
            <TouchableOpacity // whatsApp button
              onPress={() =>
                props?.data?.mobileNos?.split(':').length > 0
                  ? props?.data?.mobileNos?.split(':').length > 1
                    ? (setContactType('W'), setPmntLnkConTgl(true))
                    : sharePaymentLnk({
                        type: 'W',
                        contact: props?.data?.mobileNos,
                      })
                  : showMessage({
                      message: 'Warning!',
                      description: 'No number available to send payment link',
                      type: 'warning',
                      floating: true,
                      icon: 'auto',
                      position: 'top',
                    })
              }
              style={[styles.shareBtn, {backgroundColor: COLORS.whatsApp}]}>
              <MaterialCommunityIcons // whatsApp icon
                name="whatsapp"
                size={25}
                color={COLORS.white}
              />
              <Text
                style={[styles.clkValueTxt, {flex: 0, color: COLORS.white}]}>
                WhatsApp
              </Text>
            </TouchableOpacity>

            <TouchableOpacity // message button
              onPress={() =>
                props?.data?.mobileNos?.split(':').length > 0
                  ? props?.data?.mobileNos?.split(':').length > 1
                    ? (setContactType('M'), setPmntLnkConTgl(true))
                    : sharePaymentLnk({
                        type: 'M',
                        contact: props?.data?.mobileNos,
                      })
                  : showMessage({
                      message: 'Warning!',
                      description: 'No number available to send payment link',
                      type: 'warning',
                      floating: true,
                      icon: 'auto',
                      position: 'top',
                    })
              }
              style={[
                styles.shareBtn,
                {
                  marginHorizontal: SIZES.paddingSmall,
                  backgroundColor: COLORS.flatBlue,
                },
              ]}>
              <MaterialCommunityIcons // message icon
                name="message-reply-outline"
                size={25}
                color={COLORS.white}
              />
              <Text
                style={[styles.clkValueTxt, {flex: 0, color: COLORS.white}]}>
                SMS
              </Text>
            </TouchableOpacity>

            <TouchableOpacity // email button
              onPress={() =>
                props?.data?.mobileNos?.split(':').length > 0
                  ? props?.data?.mobileNos?.split(':').length > 1
                    ? (setContactType('E'), setPmntLnkConTgl(true))
                    : sharePaymentLnk({
                        type: 'E',
                        contact: props?.data?.emailIds,
                      })
                  : showMessage({
                      message: 'Warning!',
                      description: 'No email available to send payment link',
                      type: 'warning',
                      floating: true,
                      icon: 'auto',
                      position: 'top',
                    })
              }
              style={[styles.shareBtn, {backgroundColor: COLORS.blue}]}>
              <MaterialCommunityIcons // email icon
                name="email-outline"
                size={25}
                color={COLORS.white}
              />
              <Text
                style={[styles.clkValueTxt, {flex: 0, color: COLORS.white}]}>
                Email
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {(contactType === 'W' || contactType === 'M'
              ? props?.data?.mobileNos
              : props?.data?.emailIds
            )
              ?.split(':')
              ?.map((contact, index) => (
                <PrimaryButton // upload button
                  style={{marginBottom: SIZES.paddingMedium}}
                  icon={
                    contactType === 'W'
                      ? 'whatsapp'
                      : contactType === 'M'
                      ? 'message-reply-outline'
                      : 'email-outline'
                  }
                  name={contact}
                  key={index}
                  onPress={() => sharePaymentLnk({type: contactType, contact})}
                />
              ))}
          </>
        )}
      </AnimatableLowerModal>

      {/* MODAL TO SELECT NUMBER */}

      <AnimatableLowerModal
        title={props?.data?.name}
        isOpen={noSelect}
        onClose={() => setNoSelect(false)}>
        {props?.data?.mobileNos &&
          props?.data?.mobileNos.split(':').length > 1 &&
          props?.data?.mobileNos.split(':').map((item, index) => {
            return (
              <PrimaryButton // upload button
                style={{marginBottom: SIZES.paddingMedium}}
                icon={contactType === 'W' ? 'whatsapp' : 'phone'}
                name={item}
                key={index}
                onPress={() => {
                  let formattedNum = item?.length === 10 ? `+91${item}` : item;
                  contactType === 'W'
                    ? Linking.openURL(`whatsapp://send?phone=${formattedNum}`)
                    : Linking.openURL(`tel:${formattedNum}`);
                  setNoSelect(false);
                }}
              />
            );
          })}
      </AnimatableLowerModal>

      {/* CARD BODY CONTENT */}
      <>
        <View // dr number container
          style={[styles.detailsSection, {flex: 1}]}>
          <Text // dr number identifier
            style={styles.identifierTxt}>
            DR No:
          </Text>
          <Text // dr number value
            style={[styles.valueTxt, {flex: 1.5}]}>
            {props?.data?.drNumber}
          </Text>
          <Text // dr date identifier
            style={[styles.identifierTxt, {flex: 0.7}]}>
            Date:
          </Text>
          <Text // dr date value
            style={[styles.valueTxt, {flex: 1.5}]}>
            {props?.data?.drDate}
          </Text>
        </View>

        <View // separator
          style={styles.separator}
        />

        <View // seva container
          style={styles.detailsSection}>
          <Text // seva identifier
            style={styles.identifierTxt}>
            Seva:
          </Text>
          <Text // seva value
            style={styles.valueTxt}>
            {props?.data?.sevaCode}
          </Text>
        </View>

        <View // separator
          style={styles.separator}
        />

        <View // amount container
          style={[styles.detailsSection, {flex: 1}]}>
          <Text // amount identifier
            style={styles.identifierTxt}>
            Amount:
          </Text>
          <Text // amount value
            style={[styles.valueTxt, {flex: 1.5}]}>
            {props?.data?.amount}
          </Text>
          <Text // payment mode identifier
            style={[styles.identifierTxt, {flex: 0.7}]}>
            Mode:
          </Text>
          <Text // payment mode value
            style={[styles.valueTxt, {flex: 1.5}]}>
            {props?.data?.paymentMode}
          </Text>
        </View>

        <View // separator
          style={styles.separator}
        />

        <View // 80G container
          style={styles.detailsSection}>
          <Text // 80G identifier
            style={styles.identifierTxt}>
            80(G) Opted:
          </Text>
          <Text // 80G value
            style={[styles.valueTxt, {flex: 2}]}>
            {props?.data?.is80gRequired}
          </Text>
        </View>
      </>
    </Animatable.View>
  );
};

export default Card;

const styles = StyleSheet.create({
  container: {
    width: SIZES.width * 0.9,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusMedium,
    marginBottom: SIZES.paddingMedium,
    padding: SIZES.paddingSmall,
    ...SHADOW,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: SIZES.paddingSmall,
    borderRadius: SIZES.radiusMedium - 3,
    backgroundColor: COLORS.white,
  },
  identifierTxt: {
    flex: 1,
    color: COLORS.black,
    fontSize: SIZES.fontSmall,
    fontFamily: FONTS.josefinSansBold,
  },
  valueTxt: {
    flex: 3.7,
    color: COLORS.black,
    fontSize: SIZES.fontSmall,
    fontFamily: FONTS.josefinSansRegular,
  },
  clkValueTxt: {
    flex: 1,
    color: COLORS.blue,
    fontSize: SIZES.fontSmall,
    fontFamily: FONTS.josefinSansRegular,
  },
  separator: {
    height: 1,
    width: '100%',
    backgroundColor: COLORS.lightGray,
  },
  shareBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: SIZES.width * 0.25,
    height: SIZES.width * 0.25,
    borderRadius: SIZES.radiusSmall,
    marginVertical: SIZES.paddingMedium,
    ...SHADOW,
  },
  detailsSection: {
    padding: SIZES.paddingSmall,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
