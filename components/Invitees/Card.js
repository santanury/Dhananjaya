import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Linking,
  Alert,
  TextInput,
  Image,
  Pressable,
  ScrollView,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import * as Animatable from 'react-native-animatable';
import axios from 'axios';
import LinearGradient from 'react-native-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {Dropdown} from 'react-native-element-dropdown';
import {showMessage} from 'react-native-flash-message';
import moment from 'moment';
import {Store} from '../../store/Store';
import {COLORS, SIZES, FONTS, SHADOW, icons} from '../../constants';
import {accessKey, baseUrl, get_seva_history} from '../../webApi/service';

// components
import CommonModal from '../Common/CommonModal';
import AnimatableLowerModal from '../Common/AnimatableLowerModal';
import PrimaryButton from '../Common/PrimaryButton';

const Card = props => {
  const store = Store();

  const [expandId, setExpandId] = useState(null); // expand id
  const [imgUri, setImgUri] = useState(''); // image uri
  const [noSelect, setNoSelect] = useState(false); // number select modal
  const [contactType, setContactType] = useState(''); // modal name
  const [sevaHistory, setSevaHistory] = useState([]); // seva history

  useEffect(() => {
    setImgUri(props?.data?.photo + '?time=' + new Date().getTime()); // set the updated image url
  }, []);

  // individual card expansion function
  const expand = index => {
    expandId === index ? setExpandId(null) : setExpandId(index);
  };

  // get seva history
  const getSevaHistory = async () => {
    const payload = {
      accessKey: accessKey,
      sessionId: store?.userData?.session_id,
      deviceId: store?.deviceId,
      loginId: store?.userData?.userId,
      patronId: props?.data?.patronId,
    };

    console.log('GET SEVA HISTORY DATA:', baseUrl + get_seva_history, payload);

    await axios
      .post(baseUrl + get_seva_history, payload)
      .then(res => {
        res.data.successCode === 1
          ? (setSevaHistory(res.data.data), console.log(res.data.data))
          : showMessage({
              message: 'Opps!',
              description: 'Something went wrong',
              type: 'danger',
              floating: true,
              icon: 'auto',
            });
      })
      .catch(err => {
        console.log('Error in fetching seva history:', err);
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
      {/* CARD HEADER */}

      <LinearGradient
        style={styles.header}
        colors={
          props?.data?.patronStatus === 'H'
            ? [
                COLORS.activeGreen + 80,
                COLORS.activeGreen + 70,
                COLORS.activeGreen + 50,
              ]
            : [
                COLORS.inactiveRed + 80,
                COLORS.inactiveRed + 70,
                COLORS.inactiveRed + 50,
              ]
        }>
        <TouchableOpacity // more details button
          activeOpacity={1}
          style={{flexDirection: 'row', flex: 1}}
          onPress={props?.onPressHeader}>
          <View // image container
            style={{flex: 1}}>
            <Image // profile image
              resizeMode="cover"
              source={
                !imgUri ||
                imgUri.split('?')[0] ===
                  'http://104.41.133.33/dhananjayaphotos/patron/blank.jpg'
                  ? icons.avatar
                  : {uri: imgUri}
              }
              style={styles.profileImg}
            />
          </View>
          <View // name & patron id & type
            style={{flex: 3, justifyContent: 'center'}}>
            <Text // name on the card
              style={[styles.identifierTxt, {flex: 0}]}>
              {props?.data?.name}
            </Text>
            <Text // patron id & registered for text
              style={[styles.valueTxt, {flex: 0}]}>
              {props?.data?.patronId} {props?.data?.sevaType}
            </Text>
          </View>

          <View // mailing status section
            style={{flex: 0.5, alignItems: 'flex-end'}}>
            <View
              style={{
                height: SIZES.width * 0.05,
                width: SIZES.width * 0.05,
                borderRadius: (SIZES.width * 0.05) / 2,
                backgroundColor: COLORS.white,
                backgroundColor:
                  props?.data?.mailStatus === 'S'
                    ? COLORS.saveEnabled
                    : COLORS.inactiveRed,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <MaterialCommunityIcons // from date icon
                name="email-send-outline"
                size={12}
                color={COLORS.white}
              />
            </View>
          </View>
        </TouchableOpacity>
      </LinearGradient>

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

      {/* CARD BODY SECTION */}

      <View>
        <Pressable // expand and collapse button
          onPress={() => expand(props?.index)}>
          <View style={{paddingVertical: SIZES.paddingSmall}}>
            <View // payment identifiers tupple
              style={{flexDirection: 'row'}}>
              <Text // commited amount identifier
                style={[styles.identifierTxt, {textAlign: 'center'}]}>
                Commited
              </Text>

              <Text // paid amount identifier
                style={[styles.identifierTxt, {textAlign: 'center'}]}>
                Paid
              </Text>

              <Text // balance amount identifier
                style={[styles.identifierTxt, {textAlign: 'center'}]}>
                Balance
              </Text>
            </View>

            <View // payment value tupple
              style={{flexDirection: 'row'}}>
              <Text // commited amount value
                style={[styles.valueTxt, {textAlign: 'center'}]}>
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

              <Text // paid amount value
                style={[styles.valueTxt, {textAlign: 'center'}]}>
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

              <Text // balance amount value
                style={[styles.valueTxt, {textAlign: 'center'}]}>
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
          </View>

          {/* EXPANDABLE INFO SECTION */}

          {expandId === props?.index && (
            <>
              <View // separator
                style={styles.separator}
              />
              <View // last paid raiser section
                style={styles.valCont1}>
                <Text // last paid raiser identifier
                  style={styles.identifierTxt}>
                  Last Paid:
                </Text>
                <Text // last paid raiser value
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

              <View // last paid on section
                style={styles.valCont1}>
                <Text // last paid on identifier
                  style={styles.identifierTxt}>
                  Last Paid on:
                </Text>
                <Text // last paid raiser value
                  style={styles.valueTxt}>
                  {/* {props?.data?.lastPaidDate} */}
                  {props?.data?.lastPaidDate &&
                    moment(props?.data?.lastPaidDate, 'DD-MMM-YYYY').format(
                      'DD/MM/YYYY',
                    )}
                </Text>
              </View>

              <View // registered for section
                style={styles.valCont1}>
                <Text // registered for identifier
                  style={styles.identifierTxt}>
                  Registered for:
                </Text>
                <Text // registered for value
                  style={styles.valueTxt}>
                  {props?.data?.registeredFor}
                </Text>
              </View>
              <View // spouce section
                style={styles.valCont1}>
                <Text // spouce identifier
                  style={styles.identifierTxt}>
                  Spouce:
                </Text>
                <Text // spouce value
                  style={styles.valueTxt}>
                  {props?.data?.spouseName}
                </Text>
              </View>
              <View // occupation section
                style={styles.valCont1}>
                <Text // occupation identifier
                  style={styles.identifierTxt}>
                  Occupation:
                </Text>
                <Text // occupation value
                  style={styles.valueTxt}>
                  {props?.data?.occupation}
                </Text>
              </View>
            </>
          )}
          <MaterialCommunityIcons // expand collapse icon indicator
            style={{alignSelf: 'center'}}
            name={expandId === props?.index ? 'chevron-up' : 'chevron-down'}
            size={25}
            color={COLORS.blue}
          />
        </Pressable>

        {/* SEPARATOR */}

        <View style={styles.separator} />

        {/* LOWER BUTTON CONTAINER */}

        <View style={styles.valCont1}>
          <TouchableOpacity // call button
            style={styles.lowerBtn}
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

          <TouchableOpacity // email button
            onPress={() => {
              Linking.openURL(`mailto:${props?.data?.emailIds}`);
            }}
            style={styles.lowerBtn}>
            <MaterialCommunityIcons // email button icon
              name="email-fast-outline"
              size={25}
              color={COLORS.flatBlue}
            />
          </TouchableOpacity>

          <TouchableOpacity // history button
            style={styles.lowerBtn}
            onPress={() => getSevaHistory()}>
            <MaterialCommunityIcons // history button icon
              name="history"
              size={25}
              color={'#964B00'}
            />
          </TouchableOpacity>

          {/* MODAL TO SHOW HISTORY */}

          <CommonModal
            title="PATRON SEVA HISTORY"
            isOpen={sevaHistory?.length > 0}
            onClose={() => setSevaHistory([])}>
            <ScrollView style={{height: SIZES.height * 0.5}}>
              {sevaHistory?.map((item, index) => (
                <View key={index}>
                  <View // enrollment / upgrade / redefine container
                    style={styles.valCont1}>
                    <Text // enrollment / upgrade / redefine identifier
                      style={[styles.identifierTxt, {flex: 1}]}>
                      {item?.enrlmntType === 'N'
                        ? 'Enrolled on:'
                        : item?.enrlmntType === 'R'
                        ? 'Redefined on:'
                        : 'Upgraded on:'}
                    </Text>
                    <Text // enrollment / upgrade / redefine value
                      style={styles.valueTxt}>
                      {item?.enrldDate?.replace(/-/g, ' ')}
                    </Text>
                  </View>
                  <View // seva container
                    style={styles.valCont1}>
                    <Text // seva identifier
                      style={[styles.identifierTxt, {flex: 1}]}>
                      For
                    </Text>
                    <Text // seva value
                      style={styles.valueTxt}>
                      {item?.sevaCode}
                    </Text>
                  </View>
                  <View // preacher container
                    style={[
                      styles.valCont1,
                      {marginVertical: SIZES.paddingSmall},
                    ]}>
                    <Text // preacher identifier
                      style={[styles.identifierTxt, {flex: 1}]}>
                      By
                    </Text>
                    <Text // preacher value
                      style={styles.valueTxt}>
                      {item?.prcrCode}
                    </Text>
                  </View>
                  {sevaHistory?.length !== index + 1 && (
                    <View // separator
                      style={styles.separator}
                    />
                  )}
                </View>
              ))}
            </ScrollView>
          </CommonModal>
        </View>
      </View>
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
    flex: 1.2,
    color: COLORS.black,
    fontSize: SIZES.fontSmall,
    fontFamily: FONTS.josefinSansBold,
  },
  valueTxt: {
    flex: 1.5,
    color: COLORS.black,
    fontSize: SIZES.fontSmall,
    fontFamily: FONTS.josefinSansRegular,
  },
  profileImg: {
    width: SIZES.width * 0.15,
    height: SIZES.width * 0.15,
    borderRadius: (SIZES.width * 0.15) / 2,
    backgroundColor: COLORS.white,
  },
  separator: {
    height: 1,
    width: '100%',
    backgroundColor: COLORS.lightGray,
  },
  lowerBtn: {flex: 1, alignItems: 'center'},
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
});
