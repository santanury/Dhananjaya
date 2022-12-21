import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Linking,
  Image,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import axios from 'axios';
import LinearGradient from 'react-native-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {showMessage} from 'react-native-flash-message';
import moment from 'moment';
import {Store} from '../../store/Store';
import {COLORS, SIZES, FONTS, SHADOW, icons} from '../../constants';
import {baseUrl, accessKey, insert_patron_followup} from '../../webApi/service';

// components
import AnimatableLowerModal from '../Common/AnimatableLowerModal';
import PrimaryButton from '../Common/PrimaryButton';

const CardPatron = props => {
  const store = Store();

  // const [imgUri, setImgUri] = useState(''); // image uri
  const [noSelect, setNoSelect] = useState(false); // number select modal
  const [contactType, setContactType] = useState(''); // modal name
  const [followUpDatePicker, setFollowUpDatePicker] = useState(false); // follow up date picker
  const [followUpDate, setFollowUpDate] = useState(
    props?.data?.followUp?.[0]?.followUpOn,
  ); // follow up date

  // useEffect(() => {
  //   setImgUri(props?.data?.photo + '?time=' + new Date().getTime()); // set the updated image url
  // }, []);

  // update current follow up date
  const updateFollowUpDate = async param => {
    props.setSpinnerLoader(true);
    console.log(
      '',
      '\n========== API PAYLOAD =========="',
      '\naccessKey: ',
      accessKey,
      '\nsessionId:',
      store?.userData?.session_id,
      '\ndeviceId:',
      store?.deviceId,
      '\nloginId:',
      store?.userData?.userId,
      '\ndonorId:',
      props?.data?.patronId,

      !(param === 'del') &&
        ('\nfollowupOn in string:',
        moment(param).format('DD-MMM-YYYY HH:mm:ss')),

      '\nremarks:',
      props?.data?.followUp?.[0]?.remarks,
      '\nfollowupType:',
      props?.data?.followUp?.[0]?.followType,
      '\nfollowupBy:',
      store?.userData?.id,
      '\n postpone:',
      !(param === 'del') ? 'y' : 'c',
      '\n========== VALIDATION ==========',
      '\nStart date in string:',
      props.ptStartDt,
      '\nEnd date in string:',
      props.ptEndDt,
      '\nStart date:',
      moment(props.ptStartDt, 'DD-MMM-YYYY'),
      '\nEnd date:',
      moment(props.ptEndDt, 'DD-MMM-YYYY').endOf('day'),

      !(param === 'del') &&
        ('\nWithin range:',
        param > moment(props.ptStartDt, 'DD-MMM-YYYY') &&
          param < moment(props.ptEndDt, 'DD-MMM-YYYY').endOf('day'),
        '\nDate to change',
        moment(param).format('DD-MMM-YYYY HH:mm:ss'),
        '\n================================'),
    );

    let payload = {
      accessKey: accessKey,
      sessionId: store?.userData?.session_id,
      deviceId: store?.deviceId,
      loginId: store?.userData?.userId,
      patronId: props?.data?.patronId,
      remarks: props?.data?.followUp?.[0]?.remarks,
      followupType: props?.data?.followUp?.[0]?.followType,
      followupBy: store?.userData?.id,
    };

    param === 'del'
      ? (payload = {
          ...payload,
          postpone: 'c',
        })
      : (payload = {
          ...payload,
          postpone: 'y',
          followupOn: moment(param).format('DD-MMM-YYYY HH:mm:ss'),
        });

    await axios
      .post(baseUrl + insert_patron_followup, payload)
      .then(res => {
        res.data.successCode === 1
          ? !(param === 'del')
            ? (showMessage({
                message: 'Success!',
                description: 'Follow up updated successfully',
                type: 'success',
                floating: true,
                icon: 'auto',
              }),
              props.patronList?.map(item => {
                if (item.patronId === props.data.patronId) {
                  if (
                    param > moment(props.ptStartDt, 'DD-MMM-YYYY') &&
                    param < moment(props.ptEndDt, 'DD-MMM-YYYY').endOf('day')
                  ) {
                    setFollowUpDate(
                      moment(param).format('DD MMM YYYY hh:mm A'),
                    ),
                      console.log('date changed');
                  } else {
                    props.setPatronList(
                      props.patronList.filter(
                        item => item.patronId !== props.data.patronId,
                      ),
                    ),
                      console.log('remove from range');
                  }
                }
              }))
            : (showMessage({
                message: 'Success!',
                description: 'Follow up deleted successfully',
                type: 'success',
                floating: true,
                icon: 'auto',
              }),
              props.setPatronList(
                props.patronList.filter(
                  item => item.patronId !== props.data.patronId,
                ),
              ))
          : showMessage({
              message: 'Opps!',
              description: 'Something went wrong',
              type: 'danger',
              floating: true,
              icon: 'auto',
            });
        props.setSpinnerLoader(false);
      })
      .catch(err => {
        showMessage({
          message: 'Error!',
          description: 'Please check your internet connection',
          type: 'danger',
          floating: true,
          icon: 'auto',
        });
        props.setSpinnerLoader(false);
      });
  };

  return (
    <View // container
      style={styles.container}>
      {/* CARD HEADER */}

      <LinearGradient
        style={styles.header}
        colors={['#599D5570', '#599D5560', '#599D5550']}>
        <TouchableOpacity // more details button
          activeOpacity={1}
          style={{flexDirection: 'row', flex: 1}}
          onPress={props?.onPressHeader}>
          <View // image container
            style={{flex: 1}}>
            <Image // profile image
              resizeMode="cover"
              source={
                !props?.data?.photo ||
                props?.data?.photo.split('?')[0] ===
                  'http://104.41.133.33/dhananjayaphotos/patron/blank.jpg'
                  ? icons.avatar
                  : {uri: props?.data?.photo}
              }
              style={styles.profileImg}
            />
          </View>
          <View // name & patron id & type
            style={{marginLeft: SIZES.paddingSmall, flex: 4}}>
            <Text // name on the card
              style={styles.identifierTxt}>
              {props?.data?.name}
            </Text>
            <Text // patron id & registered for text
              style={styles.valueTxt}>
              {props?.data?.patronId} {props?.data?.sevaType}
            </Text>
            <View // communicate button container
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
              }}>
              <TouchableOpacity // edit button
                onPress={() => {
                  console.log('For patron Id:', props.data.patronId);
                  setFollowUpDatePicker(true);
                }}>
                <MaterialCommunityIcons // edit button
                  name="calendar-range"
                  size={25}
                  color={COLORS.darkGray}
                />
              </TouchableOpacity>
              <TouchableOpacity // whatsapp button
                style={{marginLeft: SIZES.paddingSmall}}
                onPress={() => {
                  props?.data?.mobileNos || props?.data?.mobileNos === ':'
                    ? props?.data?.mobileNos.split(':').length > 1
                      ? (setNoSelect(true), setContactType('W'))
                      : Linking.openURL(
                          `whatsapp://send?phone=${
                            91 + props?.data?.mobileNos
                          }`,
                        )
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
              <TouchableOpacity // call button
                style={{marginLeft: SIZES.paddingSmall}}
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
            </View>
          </View>
        </TouchableOpacity>
      </LinearGradient>

      <DateTimePickerModal // date picker
        isVisible={followUpDatePicker}
        onConfirm={date => {
          updateFollowUpDate(date), setFollowUpDatePicker(false);
        }}
        onCancel={() => setFollowUpDatePicker(false)}
        mode="datetime"
        is24Hour={true}
        minimumDate={new Date()}
        date={
          followUpDate
            ? new Date(moment(followUpDate, 'DD-MMM-YYYY hh:mm A').toDate())
            : new Date()
        }
      />

      {/* MODAL TO SELECT NUMBER */}

      <AnimatableLowerModal // modal to select number
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
                  contactType === 'W'
                    ? (Linking.openURL(`whatsapp://send?phone=${91 + item}`),
                      setNoSelect(false))
                    : (Linking.openURL(`tel:${item}`), setNoSelect(false));
                }}
              />
            );
          })}
      </AnimatableLowerModal>

      {/* CARD BODY SECTION */}
      <>
        <View // patronship payment attribute tuple
          style={styles.detailsSection}>
          <Text style={[styles.identifierTxt, {textAlign: 'center'}]}>
            COMMITED
          </Text>

          <Text style={[styles.identifierTxt, styles.valueTxtEx]}>PAID</Text>

          <Text style={[styles.identifierTxt, {textAlign: 'center'}]}>
            BALANCE
          </Text>
        </View>

        <View // separator
          style={styles.separator}
        />

        <View // patronship payment details tupple
          style={styles.detailsSection}>
          <Text style={[styles.valueTxt, {textAlign: 'center'}]}>
            {
              Number(props?.data?.commitedAmount?.replace(/,/g, ''))
                ?.toLocaleString('en-IN', {
                  maximumFractionDigits: 2,
                  style: 'currency',
                  currency: 'INR',
                })
                ?.split('.')[0]
            }
          </Text>

          <Text style={[styles.valueTxt, styles.valueTxtEx]}>
            {
              Number(props?.data?.paidAmount?.replace(/,/g, ''))
                ?.toLocaleString('en-IN', {
                  maximumFractionDigits: 2,
                  style: 'currency',
                  currency: 'INR',
                })
                ?.split('.')[0]
            }
          </Text>

          <Text style={[styles.valueTxt, {textAlign: 'center'}]}>
            {
              Number(props?.data?.balanceAmount?.replace(/,/g, ''))
                ?.toLocaleString('en-IN', {
                  maximumFractionDigits: 2,
                  style: 'currency',
                  currency: 'INR',
                })
                ?.split('.')[0]
            }
          </Text>
        </View>

        <View // separator
          style={styles.separator}
        />

        <View // follow up schedule container
          style={styles.detailsSection}>
          <Text // schedule identifier
            style={styles.identifierTxt}>
            Follow Up:
          </Text>
          <Text // schedule value
            style={[styles.valueTxt, {flex: 1.5}]}>
            {props?.data?.followUp?.[0]?.followType} on{' '}
            {followUpDate.substring(0, 11)} at
            {followUpDate.substring(11)}
          </Text>
        </View>

        <View // separator
          style={styles.separator}
        />

        <View // remarks container
          style={styles.detailsSection}>
          <Text // remarks identifier
            style={styles.identifierTxt}>
            Remarks:
          </Text>
          <Text // remarks value
            style={[styles.valueTxt, {flex: 1.3}]}>
            {props?.data?.followUp?.[0]?.remarks}
          </Text>

          <TouchableOpacity // delete button
            style={{flex: 0.2, alignItems: 'flex-end'}}
            onPress={() => updateFollowUpDate('del')}>
            <MaterialCommunityIcons // delete icon
              name="delete"
              size={25}
              color={COLORS.flatBlue}
            />
          </TouchableOpacity>
        </View>
      </>
    </View>
  );
};

export default CardPatron;

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
    flex: 1,
    color: COLORS.black,
    fontSize: SIZES.fontSmall,
    fontFamily: FONTS.josefinSansRegular,
  },
  valueTxtEx: {
    textAlign: 'center',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: COLORS.lightGray,
  },
  profileImg: {
    width: 60,
    height: 60,
    borderRadius: 60 / 2,
    backgroundColor: COLORS.white,
  },
  separator: {
    height: 1,
    width: '100%',
    backgroundColor: COLORS.lightGray,
  },
  detailsSection: {
    padding: SIZES.paddingSmall,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
