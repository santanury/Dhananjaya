import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Linking,
  Alert,
  TextInput,
} from 'react-native';
import React, {useState} from 'react';
import * as Animatable from 'react-native-animatable';
import axios from 'axios';
import LinearGradient from 'react-native-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {Dropdown} from 'react-native-element-dropdown';
import {showMessage} from 'react-native-flash-message';
import moment from 'moment';
import {Store} from '../../store/Store';
import {COLORS, SIZES, FONTS, SHADOW} from '../../constants';
import {accessKey, baseUrl, insert_donor_followup} from '../../webApi/service';

// components
import CommonModal from '../Common/CommonModal';
import AnimatableLowerModal from '../Common/AnimatableLowerModal';
import PrimaryButton from '../Common/PrimaryButton';

const Card = props => {
  const store = Store();

  const [noSelect, setNoSelect] = useState(false); // number select modal
  const [contactType, setContactType] = useState(''); // modal name
  const [followUpMdl, setFollowUpMdl] = useState(false); // follow up modal
  const [followTyps] = useState([
    {value: 'Call', label: 'Call'},
    {value: 'Visit', label: 'Visit'},
    {value: 'Invite', label: 'Invite'},
  ]); // follow up types
  const [followUpDatePicker, setFollowUpDatePicker] = useState(false); // follow up date picker
  const [folloUpTyp, setFolloUpTyp] = useState('Call'); // follow up type
  const [followUpDate, setFollowUpDate] = useState(new Date()); // follow up date
  const [selectedFollowUpDate, setSelectedFollowUpDate] = useState(''); // selected follow up date
  const [remark, setRemark] = useState(''); // follow up remark

  // submit follow up
  const submitFollowUp = async () => {
    props.setSkeletonLoader(true);

    const payload = {
      accessKey,
      sessionId: store?.userData?.session_id,
      deviceId: store?.deviceId,
      loginId: store?.userData?.userId,
      donorId: props?.data?.donorId,
      followupOn: selectedFollowUpDate,
      remarks: remark,
      followupType: folloUpTyp,
      followupBy: store?.userData?.id,
    };

    console.log('SUBMIT FOLLOW UP :', baseUrl + insert_donor_followup, payload);
    await axios
      .post(baseUrl + insert_donor_followup, payload)
      .then(res => {
        res.data.successCode === 1
          ? (setFollowUpMdl(false),
            setFolloUpTyp('Call'),
            setSelectedFollowUpDate(''),
            setFollowUpDate(new Date()),
            setRemark(''),
            showMessage({
              message: 'Success!',
              description: 'Follow up added successfully',
              type: 'success',
              floating: true,
              icon: 'auto',
            }))
          : showMessage({
              message: 'Opps!',
              description: 'Something went wrong',
              type: 'danger',
              floating: true,
              icon: 'auto',
            });
        props.setSkeletonLoader(false);
      })
      .catch(err => {
        props.setSkeletonLoader(false);
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
    <Animatable.View // container
      animation={'zoomIn'}
      duration={700}
      delay={props.index * 100}
      style={styles.container}>
      <TouchableOpacity // card gradient
        activeOpacity={1}
        onPress={() => props.onPress()}>
        {/* CARD HEADER */}

        <LinearGradient
          style={styles.header}
          colors={['#599D5570', '#599D5560', '#599D5550']}>
          <View // name & donor id
            style={{flex: 1}}>
            <Text // name on the card
              style={styles.identifierTxt}>
              {props?.data?.name}
            </Text>
            <Text // donor id text
              style={styles.valueTxt}>
              {props?.data?.donorId}
            </Text>
            <View // communicate button container
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
              }}>
              <TouchableOpacity // follow up button
                onPress={() => setFollowUpMdl(true)}>
                <MaterialCommunityIcons // follow up icon
                  name="account-clock-outline"
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
                onPress={() => {
                  props?.data?.mobileNos || props?.data?.mobileNos === ':'
                    ? props?.data?.mobileNos.split(':').length > 1
                      ? (setNoSelect(true), setContactType('C'))
                      : Linking.openURL(`tel:${props?.data?.mobileNos}`)
                    : Alert.alert(
                        'No Mobile Number',
                        'No Mobile Number is available for this donor',
                        [{text: 'OK'}],
                        {cancelable: false},
                      );
                }}>
                <MaterialCommunityIcons // call icon
                  name="phone"
                  size={25}
                  color={COLORS.blue}
                />
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>

        {/* MODAL TO ADD FOLLOW UP */}

        <CommonModal
          title="FOLLOW WITH PROSPECT"
          isOpen={followUpMdl}
          onClose={() => {
            setFollowUpMdl(false),
              setFolloUpTyp('Call'),
              setSelectedFollowUpDate(''),
              setFollowUpDate(new Date()),
              setRemark('');
          }}>
          <View // followup type selector container
            style={{flexDirection: 'row', marginBottom: SIZES.paddingMedium}}>
            <Dropdown // followup type selector
              placeholder="Donation Category"
              style={styles.dropStyle}
              placeholderStyle={styles.dropPlaceholder}
              selectedTextStyle={styles.dropSelectedTxt}
              containerStyle={styles.dropContainer}
              fontFamily={FONTS.josefinSansRegular}
              data={followTyps}
              value={folloUpTyp}
              labelField="label"
              valueField="value"
              renderItem={item => (
                <Text style={styles.dropText}>{item.label}</Text>
              )}
              onChange={item => setFolloUpTyp(item.value)}
            />

            <TouchableOpacity // followup date button
              onPress={() => setFollowUpDatePicker(true)}
              style={[styles.valCont1, {marginTop: 0, alignItems: 'center'}]}
              activeOpacity={1}>
              <MaterialCommunityIcons // from date icon
                name="calendar-range"
                size={30}
                color={COLORS.flatBlue}
              />
              <View>
                <Text // date text
                  style={[styles.valueTxt, {flex: 0}]}>
                  {selectedFollowUpDate
                    ? selectedFollowUpDate.split(' ')[0]
                    : 'MMM-DD-YYYY'}
                </Text>
                <View // separator
                  style={styles.separator}
                />
                <Text // time text
                  style={[styles.valueTxt, {flex: 0}]}>
                  {selectedFollowUpDate
                    ? selectedFollowUpDate.split(' ')[1]
                    : 'HH:MM'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          <View // add comment container
            style={styles.addCommentInputCont}>
            <TextInput // comment text input
              style={styles.addCommentInput}
              placeholderTextColor={COLORS.gray}
              placeholder="Type your comment here"
              keyboardAppearance="dark"
              keyboardType="default"
              returnKeyLabel="next"
              returnKeyType="done"
              multiline={true}
              textAlignVertical="top"
              underlineColorAndroid="transparent"
              onChangeText={text => setRemark(text)}
              value={remark}
              maxLength={150}
            />
            <Text // no. of characters left indicator
              style={styles.characterLeft}>
              {0 + remark?.length}/150
            </Text>
          </View>

          <PrimaryButton // submit button
            disabled={!folloUpTyp || !selectedFollowUpDate}
            name="SUBMIT"
            icon="check"
            style={{
              width: '100%',
              backgroundColor:
                folloUpTyp && selectedFollowUpDate
                  ? COLORS.saveEnabled
                  : COLORS.lightGray,
              elevation:
                folloUpTyp && selectedFollowUpDate ? SHADOW.elevation : 0,
              shadowOpacity:
                folloUpTyp && selectedFollowUpDate ? SHADOW.shadowOpacity : 0,
            }}
            onPress={submitFollowUp}
          />
        </CommonModal>

        <DateTimePickerModal // date picker
          isVisible={followUpDatePicker}
          onConfirm={date => {
            setFollowUpDate(date),
              setSelectedFollowUpDate(
                moment(date).format('DD-MMM-YYYY HH:mm:ss'),
              );
            setFollowUpDatePicker(false);
          }}
          onCancel={() => setFollowUpDatePicker(false)}
          mode="datetime"
          is24Hour={true}
          minimumDate={new Date()}
          date={followUpDate}
        />

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
                    contactType === 'W'
                      ? (Linking.openURL(`whatsapp://send?phone=${91 + item}`),
                        setNoSelect(false))
                      : (Linking.openURL(`tel:${item}`), setNoSelect(false));
                  }}
                />
              );
            })}
        </AnimatableLowerModal>

        {/* CARD BODY */}
        <>
          <View // patronship payment attribute tuple
            style={styles.detailsSection}>
            <Text style={[styles.identifierTxt, {textAlign: 'center'}]}>
              TYPE
            </Text>

            <Text style={[styles.identifierTxt, styles.valueTxtEx]}>
              CLEARED
            </Text>

            <Text style={[styles.identifierTxt, {textAlign: 'center'}]}>
              PDC
            </Text>
          </View>

          <View // separator
            style={styles.separator}
          />

          <View // patronship payment details tupple
            style={styles.detailsSection}>
            <Text // patronship value identifier
              style={[styles.valueTxt, {textAlign: 'center'}]}>
              Patronship
            </Text>

            <Text // patronship cleared value
              style={[styles.valueTxt, styles.valueTxtEx]}>
              {
                Number(props?.data?.ptrnClearedAmount?.replace(/,/g, ''))
                  ?.toLocaleString('en-IN', {
                    maximumFractionDigits: 2,
                    style: 'currency',
                    currency: 'INR',
                  })
                  ?.split('.')[0]
              }
            </Text>

            <Text // patronship pdc value
              style={[styles.valueTxt, {textAlign: 'center'}]}>
              {
                Number(props?.data?.PtrnPdcAmount?.replace(/,/g, ''))
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

          <View // paid section
            style={styles.detailsSection}>
            <Text // total paid identifier
              style={styles.identifierTxt}>
              Total Paid:
            </Text>
            <Text // total paid value
              style={styles.valueTxt}>
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

            <Text // last paid identifier
              style={styles.identifierTxt}>
              Last Paid:
            </Text>
            <Text // last paid value
              style={styles.valueTxt}>
              {
                Number(props?.data?.lastPaidAmount?.replace(/,/g, ''))
                  ?.toLocaleString('en-IN', {
                    maximumFractionDigits: 2,
                    style: 'currency',
                    currency: 'INR',
                  })
                  ?.split('.')[0]
              }
            </Text>
          </View>
        </>
      </TouchableOpacity>
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
  separator: {
    height: 1,
    width: '100%',
    backgroundColor: COLORS.lightGray,
  },
  dropStyle: {
    flex: 0.7,
    height: SIZES.height * 0.065,
    borderColor: COLORS.lightGray,
    borderRadius: SIZES.radiusSmall,
    borderWidth: 1,
    backgroundColor: COLORS.antiFlashWhite,
    paddingHorizontal: SIZES.paddingSmall,
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
  addCommentInputCont: {
    height: SIZES.height * 0.1,
    borderRadius: SIZES.radiusSmall,
    backgroundColor: COLORS.antiFlashWhite,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    marginBottom: SIZES.paddingMedium,
  },
  addCommentInput: {
    flex: 1,
    padding: SIZES.paddingSmall,
    fontSize: SIZES.fontSmall,
    fontFamily: FONTS.josefinSansRegular,
    color: COLORS.black,
  },
  characterLeft: {
    color: COLORS.gray,
    alignSelf: 'flex-end',
    marginRight: SIZES.paddingSmall,
    marginBottom: SIZES.paddingSmall,
  },
  valCont1: {
    flexDirection: 'row',
    flex: 1,
    marginTop: SIZES.paddingSmall,
    paddingHorizontal: SIZES.paddingSmall,
  },
  detailsSection: {
    padding: SIZES.paddingSmall,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
