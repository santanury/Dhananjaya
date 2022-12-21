import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Linking,
  TextInput,
  Alert,
} from 'react-native';
import React, {useState} from 'react';
import * as Animatable from 'react-native-animatable';
import axios from 'axios';
import LinearGradient from 'react-native-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Dropdown} from 'react-native-element-dropdown';
import {showMessage} from 'react-native-flash-message';
import {Store} from '../../store/Store';
import {COLORS, SIZES, FONTS, SHADOW} from '../../constants';
import {
  accessKey,
  baseUrl,
  sevaApiBase,
  get_next_level,
  get_language_list,
  update_level_details,
  update_people_count,
} from '../../webApi/service';

// components
import CommonModal from '../Common/CommonModal';
import AnimatableLowerModal from '../Common/AnimatableLowerModal';
import PrimaryButton from '../Common/PrimaryButton';

const Card = props => {
  const store = Store();

  const [contactType, setContactType] = useState(''); // modal name // payment link send through mode state
  const [noSelect, setNoSelect] = useState(false); // number select modal
  const [upgradeMdl, setUpgradeMdl] = useState(false); // upgrade ashraya modal
  const [nextlvl, setNextLvl] = useState(''); // next level state
  const [languageList, setlanguagelist] = useState([]); // language list
  const [language, setLanguage] = useState(''); // selected language
  const [noOfPeoples, setNoOfPeoples] = useState(''); // no of people accompanying
  const [memberInfo, setMemberInfo] = useState({}); // memberId to upgrade
  const [peopleUpdMdl, setPeopleUpdMdl] = useState(false); // no of people upgrade modal
  const [memId2Upd, setMemId2Upd] = useState(''); // member id to update no of people accompanying

  // upgrade Pressed
  const upgradePressed = () => {
    getNextLevel();
  };

  const updatePeople = async () => {
    console.log(memId2Upd, noOfPeoples);
    // console.log(props.ashrayaList);
    const payload = {
      accessKey,
      noOfPeoples,
      memberId: memId2Upd,
      createdBy: store?.userData?.id,
    };

    console.log('UPDATE PEOPLE :', sevaApiBase + update_people_count, payload);

    await axios
      .post(sevaApiBase + update_people_count, payload)
      .then(res => {
        res?.data?.successCode === 1
          ? (props.setAshrayalist(
              props.ashrayaList?.map(each => {
                if (each.ashrayaId === memId2Upd) {
                  each.noOfPeople = noOfPeoples;
                }
                return each;
              }),
            ),
            setMemId2Upd(''),
            setNoOfPeoples(''),
            setPeopleUpdMdl(false),
            showMessage({
              message: 'Success!',
              description: `Successfully updated people accompanying`,
              type: 'success',
              floating: true,
              icon: 'auto',
            }))
          : showMessage({
              message: 'Warning!',
              description: res?.data?.message,
              type: 'warning',
              floating: true,
              icon: 'auto',
            });
      })
      .catch(err => {
        console.log('Error updating people :', err);
        showMessage({
          message: 'Error!',
          description: 'Please check your internet connection',
          type: 'danger',
          floating: true,
          icon: 'auto',
        });
      });
  };

  // get next level
  const getNextLevel = async () => {
    const payload = {
      accessKey,
      currentLevel: props?.data?.currentLevel,
    };

    console.log('GET NEXT LEVEL :', sevaApiBase + get_next_level, payload);

    await axios
      .post(sevaApiBase + get_next_level, payload)
      .then(res => {
        res?.data?.successCode === 1
          ? (setNextLvl(res?.data?.data), getLanguageList())
          : showMessage({
              message: 'Warning!',
              description: 'Next level is not available right now',
              type: 'warning',
              floating: true,
              icon: 'auto',
            });
      })
      .catch(err => {
        console.log('Error getting next level', err);
        showMessage({
          message: 'Error!',
          description: 'Please check your internet connection',
          type: 'danger',
          floating: true,
          icon: 'auto',
        });
      });
  };

  // get language list
  const getLanguageList = async () => {
    const payload = {accessKey};

    console.log(
      'GET CURRENCY LIST :',
      sevaApiBase + get_language_list,
      payload,
    );

    await axios
      .post(sevaApiBase + get_language_list, payload)
      .then(res => {
        res?.data?.successCode === 1
          ? (setlanguagelist(res?.data?.data),
            props?.data?.language?.replace(/ /g, '')?.length > 0 &&
              setLanguage(props?.data?.language),
            setUpgradeMdl(true))
          : showMessage({
              message: 'Warning!',
              description: 'No language available right now',
              type: 'warning',
              floating: true,
              icon: 'auto',
            });
      })
      .catch(err => {
        console.log('Error getting currency list', err);
        showMessage({
          message: 'Error!',
          description: 'Please check your internet connection',
          type: 'danger',
          floating: true,
          icon: 'auto',
        });
      });
  };

  // upgrade level
  const upgradeLevel = async () => {
    const payload = {
      accessKey,
      memberId: memberInfo?.memberId,
      noOfPeoples,
      loginId: store?.userData?.userId,
      regFor: nextlvl,
      currentLevel: memberInfo?.currentLevel,
      language: language,
    };

    console.log('UPGRADE LEVEL :', sevaApiBase + update_level_details, payload);

    await axios
      .post(sevaApiBase + update_level_details, payload)
      .then(res => {
        res?.data?.successCode === 1
          ? (props.getAshrayaList(),
            setUpgradeMdl(false),
            setMemberInfo({}),
            showMessage({
              message: 'Info!',
              description: res?.data?.message,
              type: 'info',
              floating: true,
              icon: 'auto',
            }))
          : (setUpgradeMdl(false),
            setMemberInfo({}),
            showMessage({
              message: 'Warning!',
              description: `Can't upgrade level now, try again later`,
              type: 'warning',
              floating: true,
              icon: 'auto',
            }));
      })
      .catch(err => {
        console.log('Error upgrading level', err);
        setUpgradeMdl(false);
        setMemberInfo({});
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

      <LinearGradient // card header
        style={styles.header}
        colors={['#599D5570', '#599D5560', '#599D5550']}>
        <View // name & prospect id
          style={{flex: 1}}>
          <Text // name on the card
            style={styles.identifierTxt}>
            {props?.data?.name}
          </Text>
          <Text // prospect id
            style={styles.valueTxt}>
            {props?.data?.ashrayaId}
          </Text>
        </View>
      </LinearGradient>

      {/* CARD BODY CONTENT */}
      <>
        <View // current level container
          style={styles.detailsSection}>
          <Text // current level text
            style={styles.identifierTxt}>
            Current Level:
          </Text>
          <Text // current level address
            style={styles.valueTxt}>
            {props?.data?.currentLevel}
          </Text>
        </View>

        <View // separator
          style={styles.separator}
        />

        <View // language container
          style={styles.detailsSection}>
          <Text // language text
            style={styles.identifierTxt}>
            Language:
          </Text>
          <Text // language address
            style={styles.valueTxt}>
            {props?.data?.language}
          </Text>
        </View>

        <View // separator
          style={styles.separator}
        />

        <View // registered for container
          style={styles.detailsSection}>
          <Text // registered for text
            style={styles.identifierTxt}>
            Registered For:
          </Text>
          <Text // registered for address
            style={[styles.valueTxt, {flex: 0.75}]}>
            {props?.data?.regFor}
          </Text>

          <View // buttons container
            style={{
              flex: 0.75,
              justifyContent: 'flex-end',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <MaterialCommunityIcons // people icon
              name="account-group"
              size={25}
              color={COLORS.blue}
            />

            <Text //
              style={[
                styles.valueTxt,
                {flex: 0, marginHorizontal: SIZES.paddingSmall},
              ]}>
              {props?.data?.noOfPeople}
            </Text>

            <TouchableOpacity // edit no of people  button
              onPress={() => {
                setNoOfPeoples(props?.data?.noOfPeople);
                setMemId2Upd(props?.data?.ashrayaId);
                setPeopleUpdMdl(true);
              }}>
              <MaterialCommunityIcons // edit no of people icon
                name="pencil"
                size={25}
                color={COLORS.flatBlue}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View // separator
          style={styles.separator}
        />

        {/* LOWER BUTTON CONTAINER */}

        <View style={styles.valCont1}>
          <TouchableOpacity // whatsapp button
            style={styles.lowerBtn}
            onPress={() => {
              props?.data?.whatsAppNo || props?.data?.whatsAppNo === ':'
                ? props?.data?.whatsAppNo.split(':').length > 1
                  ? (setNoSelect(true), setContactType('W'))
                  : Linking.openURL(
                      `whatsapp://send?phone=${91 + props?.data?.whatsAppNo}`,
                    )
                : Alert.alert(
                    'No Mobile Number',
                    'No Mobile Number is available for this donor',
                    [{text: 'OK'}],
                    {cancelable: false},
                  );
            }}>
            <MaterialCommunityIcons // whatsapp button icon
              name="whatsapp"
              size={25}
              color={COLORS.whatsApp}
            />
          </TouchableOpacity>

          <TouchableOpacity // call button
            style={styles.lowerBtn}
            onPress={() =>
              props?.data?.mobile || props?.data?.mobile === ':'
                ? props?.data?.mobile.split(':').length > 1
                  ? (setNoSelect(true), setContactType('C'))
                  : Linking.openURL(`tel:${props?.data?.mobile}`)
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

          <TouchableOpacity // email button
            onPress={() => {
              props?.data?.email || props?.data?.email === ':'
                ? props?.data?.email.split(':').length > 1
                  ? (setNoSelect(true), setContactType('E'))
                  : (console.log(props?.data?.email.length),
                    Linking.openURL(`mailto:${props?.data?.email}`))
                : Alert.alert(
                    'No Email Address',
                    'No Email Address is available for this donor',
                    [{text: 'OK'}],
                    {cancelable: false},
                  );
            }}
            style={styles.lowerBtn}>
            <MaterialCommunityIcons // email button icon
              name="email-fast-outline"
              size={25}
              color={COLORS.flatBlue}
            />
          </TouchableOpacity>

          <TouchableOpacity // upgrade button
            onPress={() => {
              upgradePressed(props?.data?.ashrayaId);
              setMemberInfo({
                memberId: props?.data?.ashrayaId,
                currentLevel: props?.data?.currentLevel,
              });
            }}
            disabled={props?.data?.regFor?.replace(/ /g, '')?.length > 0}
            style={styles.lowerBtn}>
            <MaterialCommunityIcons // email button icon
              name="account-arrow-up-outline"
              size={25}
              color={
                props?.data?.regFor?.replace(/ /g, '')?.length > 0
                  ? COLORS.lightGray
                  : COLORS.saveEnabled
              }
            />
          </TouchableOpacity>
        </View>

        {/* MODAL TO UPDATE NO OF PEOPLE */}

        <CommonModal
          title="PEOPLE ACCOMPANYING"
          isOpen={peopleUpdMdl}
          onClose={() => {
            setPeopleUpdMdl(false);
            setMemId2Upd('');
            setNoOfPeoples('');
          }}>
          <TextInput // no. of people input
            style={styles.input}
            placeholderTextColor={COLORS.gray}
            placeholder="Enter No. of People"
            keyboardAppearance="dark"
            keyboardType="numeric"
            returnKeyType="done"
            value={noOfPeoples}
            onChangeText={text => setNoOfPeoples(text)}
          />

          <PrimaryButton // update people button
            name="SUBMIT"
            icon="check"
            style={{
              height: SIZES.height * 0.065,
              width: '100%',
              backgroundColor: COLORS.saveEnabled,
              ...SHADOW,
            }}
            onPress={updatePeople}
          />
        </CommonModal>

        {/* MODAL TO UPGRADE */}

        <CommonModal
          title="UPGRADE"
          isOpen={upgradeMdl}
          onClose={() => {
            setMemberInfo({});
            setUpgradeMdl(false);
            setNoOfPeoples('');
          }}>
          <TextInput // no. of people input
            style={styles.input}
            placeholderTextColor={COLORS.gray}
            placeholder="Enter No. of People"
            keyboardAppearance="dark"
            keyboardType="numeric"
            returnKeyType="done"
            value={noOfPeoples}
            onChangeText={text => setNoOfPeoples(text)}
          />

          <TextInput // next level input
            editable={false}
            style={[styles.input, {borderWidth: 0}]}
            placeholderTextColor={COLORS.gray}
            placeholder="Upgrade to Level"
            keyboardAppearance="dark"
            keyboardType="default"
            returnKeyType="done"
            value={nextlvl}
            onChangeText={text => setNextLvl(text)}
          />

          <Dropdown // language dropdown
            placeholder="Select Language"
            style={styles.dropStyle}
            placeholderStyle={styles.dropPlaceholder}
            selectedTextStyle={styles.dropSelectedTxt}
            containerStyle={styles.dropContainer}
            fontFamily={FONTS.josefinSansRegular}
            data={[
              {label: 'Select Language', value: ''},
              ...languageList?.map(each => ({
                label: each?.language,
                value: each?.language,
              })),
            ]}
            value={language}
            labelField="label"
            valueField="value"
            renderItem={item => (
              <Text style={styles.dropText}>{item.label}</Text>
            )}
            onChange={item => setLanguage(item.value)}
          />

          <PrimaryButton // submit button
            disabled={!nextlvl || !language}
            name="SUBMIT"
            icon="check"
            style={{
              height: SIZES.height * 0.065,
              width: '100%',
              backgroundColor:
                !nextlvl || !language ? COLORS.lightGray : COLORS.saveEnabled,
              elevation: !nextlvl || !language ? 0 : SHADOW.elevation,
              shadowOpacity: !nextlvl || !language ? 0 : SHADOW.shadowOpacity,
            }}
            onPress={upgradeLevel}
          />
        </CommonModal>

        {/* MODAL TO SELECT NUMBER */}

        <AnimatableLowerModal
          title={props?.data?.name}
          isOpen={noSelect}
          onClose={() => setNoSelect(false)}>
          {contactType === 'W'
            ? props?.data?.whatsAppNo &&
              props?.data?.whatsAppNo.split(':').length > 1 &&
              props?.data?.whatsAppNo.split(':').map((item, index) => {
                return (
                  <PrimaryButton // upload button
                    style={{marginBottom: SIZES.paddingMedium}}
                    icon={contactType === 'W' ? 'whatsapp' : 'phone'}
                    name={item}
                    key={index}
                    onPress={() => {
                      let formattedNum =
                        item?.length === 10 ? `+91${item}` : item;
                      contactType === 'W'
                        ? Linking.openURL(
                            `whatsapp://send?phone=${formattedNum}`,
                          )
                        : Linking.openURL(`tel:${formattedNum}`);
                      setNoSelect(false);
                    }}
                  />
                );
              })
            : contactType === 'C'
            ? props?.data?.mobile &&
              props?.data?.mobile.split(':').length > 1 &&
              props?.data?.mobile.split(':').map((item, index) => {
                return (
                  <PrimaryButton // upload button
                    style={{marginBottom: SIZES.paddingMedium}}
                    icon={contactType === 'W' ? 'whatsapp' : 'phone'}
                    name={item}
                    key={index}
                    onPress={() => {
                      let formattedNum =
                        item?.length === 10 ? `+91${item}` : item;
                      contactType === 'W'
                        ? Linking.openURL(
                            `whatsapp://send?phone=${formattedNum}`,
                          )
                        : Linking.openURL(`tel:${formattedNum}`);
                      setNoSelect(false);
                    }}
                  />
                );
              })
            : props?.data?.email &&
              props?.data?.email.split(':').length > 1 &&
              props?.data?.email.split(':').map((item, index) => {
                return (
                  <PrimaryButton // upload button
                    style={{marginBottom: SIZES.paddingMedium}}
                    icon={'email-fast-outline'}
                    name={item}
                    key={index}
                    onPress={() => {
                      Linking.openURL(`mailto:${item}`);
                      setNoSelect(false);
                    }}
                  />
                );
              })}
        </AnimatableLowerModal>
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
    flex: 1.5,
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
  lowerBtn: {flex: 1, alignItems: 'center'},
  dropStyle: {
    marginBottom: SIZES.paddingMedium,
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
  input: {
    height: SIZES.height * 0.065,
    fontSize: SIZES.fontSmall,
    fontFamily: FONTS.josefinSansRegular,
    borderRadius: SIZES.radiusSmall,
    backgroundColor: COLORS.antiFlashWhite,
    borderColor: COLORS.lightGray,
    marginBottom: SIZES.paddingMedium,
    borderWidth: 1,
    paddingLeft: 10,
    color: COLORS.black,
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
});
