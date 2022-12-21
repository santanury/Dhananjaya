import {
  View,
  Text,
  StyleSheet,
  BackHandler,
  ScrollView,
  TextInput,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import {Buffer} from 'buffer';
import React, {useState, useEffect} from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import LinearGradient from 'react-native-linear-gradient';
import {showMessage} from 'react-native-flash-message';
import {Dropdown} from 'react-native-element-dropdown';
import {Store} from '../../store/Store';
import {COLORS, SIZES, FONTS} from '../../constants';
import {
  baseUrl,
  accessKey,
  get_seva_bahumana,
  get_relationship,
  get_occasion,
  create_patron_stage,
  get_patron_stage,
} from '../../webApi/service';

// components
import Header from '../../components/Common/Header';
import Section from '../../components/Common/Section';
import PrimaryButton from '../../components/Common/PrimaryButton';

const EnrolmentBahumanaPuja = ({navigation, route}) => {
  const store = Store();

  const [availableBahumanas, setAvailableBahumanas] = useState({}); // available bahumana options

  const [com1, setCom1] = useState(''); // selected commentry 1
  const [com2, setCom2] = useState(''); // selected commentry 2
  const [newsletter, setNewsletter] = useState(''); // newsletter
  const [nameInscription, setNameInscription] = useState(''); // wall inscription
  const [lLocation, setlLocation] = useState(''); // inscription location
  const [yagna, setYagna] = useState(''); // yagna

  const [availedDates, setAvailedDates] = useState(0); // visible puja dates set
  const [months] = useState([
    {value: 'Mnt', label: 'Month'},
    {value: 'Jan', label: 'January'},
    {value: 'Feb', label: 'February'},
    {value: 'Mar', label: 'March'},
    {value: 'Apr', label: 'April'},
    {value: 'May', label: 'May'},
    {value: 'Jun', label: 'June'},
    {value: 'Jul', label: 'July'},
    {value: 'Aug', label: 'August'},
    {value: 'Sep', label: 'September'},
    {value: 'Oct', label: 'October'},
    {value: 'Nov', label: 'November'},
    {value: 'Dec', label: 'December'},
  ]); // months
  const [thirtyOneMnth] = useState(
    [...Array(31).keys()].map(day => ({
      value: day < 9 ? `0${day + 1}`.toString() : (day + 1).toString(),
      label: day < 9 ? `0${day + 1}`.toString() : (day + 1).toString(),
    })),
  ); // 31 days months
  const [thirtyMnth] = useState(
    [...Array(30).keys()].map(day => ({
      value: day < 9 ? `0${day + 1}`.toString() : (day + 1).toString(),
      label: day < 9 ? `0${day + 1}`.toString() : (day + 1).toString(),
    })),
  ); // 30 days months
  const [febMnth] = useState(
    [...Array(29).keys()].map(day => ({
      value: day < 9 ? `0${day + 1}`.toString() : (day + 1).toString(),
      label: day < 9 ? `0${day + 1}`.toString() : (day + 1).toString(),
    })),
  ); // February 29 days month
  const [availableOccasions, setAvailableOccasions] = useState([]); // available occasions
  const [availableRelations, setAvailableRelations] = useState([]); // available relations
  const [pujaDeails, setPujaDeails] = useState([]); // puja dates data

  const [routePayload, setRoutePayload] = useState({}); // route data for next screen

  useEffect(() => {
    const unSubscribe = navigation.addListener('focus', () => {
      BackHandler.addEventListener('hardwareBackPress', () => {
        console.log('BackHandler In EnrolmentBahumanaPuja is called');
        store.ptrnIncmp
          ? navigation.navigate('EnrolmentRegistration')
          : navigation.goBack();
        return true;
      });
      fetchUnfinished();
      getBahumanaflagsNewsletter();
      getRelationships();
      getOccasions();
    });
    return unSubscribe;
  }, []);

  // get bahumana flags & details
  const getBahumanaflagsNewsletter = async sevaCode => {
    const payload = {
      accessKey,
      deviceId: store.deviceId,
      loginId: store.userData?.userId,
      sessionId: store.userData?.session_id,
      sevaCode: sevaCode ? sevaCode : store?.routeInfo?.sevaCode,
    };

    console.log(
      'BAHUMANA FLAGS & NEWSLETTER:',
      baseUrl + get_seva_bahumana,
      payload,
    );

    await axios
      .post(baseUrl + get_seva_bahumana, payload)
      .then(response => {
        setAvailableBahumanas(response.data);
      })
      .catch(error => {
        showMessage({
          message: 'Error!',
          description: 'Please check your internet connection',
          type: 'danger',
          floating: true,
          icon: 'auto',
        });
      });
  };

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
            console.log('UNSAVED IN BAHUMANA', unsaved),
            getBahumanaflagsNewsletter(unsaved?.route?.sevaCode),
            setRoutePayload(unsaved),
            setCom1(unsaved?.com1),
            setCom2(unsaved?.com2),
            setNewsletter(unsaved?.newsletter),
            setNameInscription(unsaved?.nameInscription),
            setlLocation(unsaved?.lLocation),
            setYagna(unsaved?.yagna),
            unsaved?.pujaDeails?.length > 0 &&
              (setAvailedDates(unsaved?.pujaDeails?.length),
              console.log(unsaved?.pujaDeails),
              setPujaDeails(unsaved?.pujaDeails)))
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

  // add a set
  const addDate = () => {
    !(Number(availableBahumanas?.pujaCount) > availedDates)
      ? showMessage({
          message: 'Opps!',
          description: 'No more dates allowed for this seva',
          type: 'warning',
          floating: true,
          icon: 'auto',
        })
      : availedDates > pujaDeails.length ||
        (pujaDeails.length > 0 &&
          pujaDeails?.some(
            each =>
              !each.month ||
              !each.day ||
              !each.occasion ||
              !each.name ||
              !each.relation,
          ))
      ? showMessage({
          message: 'Alert!',
          description: `Please fill all the fields for date ${
            pujaDeails.some(
              each =>
                !each.month ||
                !each.day ||
                !each.occasion ||
                !each.name ||
                !each.relation,
            )
              ? pujaDeails.find(
                  each =>
                    !each.month ||
                    !each.day ||
                    !each.occasion ||
                    !each.name ||
                    !each.relation,
                )?.sequence
              : availedDates
          }`,
          type: 'warning',
          floating: true,
          icon: 'auto',
        })
      : setAvailedDates(availedDates + 1);
  };

  // delete a set
  const deleteDate = sequence => {
    pujaDeails?.length > 0 &&
      setPujaDeails(
        [...pujaDeails]
          ?.filter(each => each?.sequence != sequence)
          ?.map(each =>
            each?.sequence > sequence
              ? {...each, sequence: each?.sequence - 1}
              : {...each},
          ),
      );
    setAvailedDates(availedDates - 1);
  };

  // selecting month for puja date
  const setPujaMonth = (sequence, month) => {
    let tempArr = [...pujaDeails];
    tempArr?.find(each => each?.sequence === sequence)
      ? month === 'Mnt'
        ? !(
            tempArr.find(each => each?.sequence === sequence)?.occasion ||
            tempArr.find(each => each?.sequence === sequence)?.name ||
            tempArr.find(each => each?.sequence === sequence)?.relation
          )
          ? (tempArr = tempArr.filter(each => !(each?.sequence === sequence)))
          : (delete tempArr.find(each => each?.sequence === sequence).month,
            delete tempArr.find(each => each?.sequence === sequence).day)
        : ((tempArr.find(each => each?.sequence === sequence).month = month),
          delete tempArr.find(each => each?.sequence === sequence).day)
      : month !== 'Mnt' && tempArr.push({sequence, month}),
      setPujaDeails(tempArr);
  };

  // selecting day for puja date
  const setPujaDay = (sequence, day) => {
    let tempArr = [...pujaDeails];
    tempArr?.find(each => each?.sequence === sequence)
      ? day === 'Day'
        ? !(
            tempArr.find(each => each?.sequence === sequence)?.month ||
            tempArr.find(each => each?.sequence === sequence)?.occasion ||
            tempArr.find(each => each?.sequence === sequence)?.name ||
            tempArr.find(each => each?.sequence === sequence)?.relation
          )
          ? (tempArr = tempArr.filter(each => !(each?.sequence === sequence)))
          : delete tempArr.find(each => each?.sequence === sequence).day
        : (tempArr.find(each => each?.sequence === sequence).day = day)
      : day !== 'Day' && tempArr.push({sequence, day}),
      setPujaDeails(tempArr);
  };

  // selecting occasion for puja date
  const setOccasion = (sequence, occasion) => {
    let tempArr = [...pujaDeails];
    tempArr?.find(each => each?.sequence === sequence)
      ? occasion === 'Select Occasion'
        ? !(
            tempArr.find(each => each?.sequence === sequence)?.month ||
            tempArr.find(each => each?.sequence === sequence)?.name ||
            tempArr.find(each => each?.sequence === sequence)?.relation
          )
          ? (tempArr = tempArr.filter(each => !(each?.sequence === sequence)))
          : delete tempArr.find(each => each?.sequence === sequence).occasion
        : (tempArr.find(each => each?.sequence === sequence).occasion =
            occasion)
      : occasion !== 'Select Occasion' && tempArr.push({sequence, occasion}),
      setPujaDeails(tempArr);
  };

  // selecting name for puja date
  const setName = (sequence, name) => {
    let tempArr = [...pujaDeails];
    tempArr?.find(each => each?.sequence === sequence)
      ? name === ''
        ? !(
            tempArr.find(each => each?.sequence === sequence)?.month ||
            tempArr.find(each => each?.sequence === sequence)?.occasion ||
            tempArr.find(each => each?.sequence === sequence)?.relation
          )
          ? (tempArr = tempArr.filter(each => !(each?.sequence === sequence)))
          : delete tempArr.find(each => each?.sequence === sequence).name
        : (tempArr.find(each => each?.sequence === sequence).name = name)
      : name !== '' && tempArr.push({sequence, name}),
      setPujaDeails(tempArr);
  };

  // selecting name for puja date
  const setRelation = (sequence, relation) => {
    let tempArr = [...pujaDeails];
    tempArr?.find(each => each?.sequence === sequence)
      ? relation === 'Select Relation'
        ? !(
            tempArr.find(each => each?.sequence === sequence)?.month ||
            tempArr.find(each => each?.sequence === sequence)?.occasion ||
            tempArr.find(each => each?.sequence === sequence)?.name
          )
          ? (tempArr = tempArr.filter(each => !(each?.sequence === sequence)))
          : delete tempArr.find(each => each?.sequence === sequence).relation
        : (tempArr.find(each => each?.sequence === sequence).relation =
            relation)
      : relation !== 'Select Relation' && tempArr.push({sequence, relation}),
      setPujaDeails(tempArr);
  };

  // get relationships
  const getRelationships = async () => {
    const payload = {
      accessKey,
      deviceId: store.deviceId,
      loginId: store.userData?.userId,
      sessionId: store.userData?.session_id,
    };
    console.log('RELATIONSHIPS :', baseUrl + get_relationship, payload);

    await axios
      .post(baseUrl + get_relationship, payload)
      .then(response => {
        setAvailableRelations(response.data.data);
      })
      .catch(error => {
        showMessage({
          message: 'Error!',
          description: 'Please check your internet connection',
          type: 'danger',
          floating: true,
          icon: 'auto',
        });
      });
  };

  // get ocassion
  const getOccasions = async () => {
    const payload = {
      accessKey,
      deviceId: store.deviceId,
      loginId: store.userData?.userId,
      sessionId: store.userData?.session_id,
    };

    console.log('GET OCCASSIONS :', baseUrl + get_occasion, payload);

    await axios
      .post(baseUrl + get_occasion, payload)
      .then(response => {
        setAvailableOccasions(response.data.data);
      })
      .catch(error => {
        showMessage({
          message: 'Error!',
          description: 'Please check your internet connection',
          type: 'danger',
          floating: true,
          icon: 'auto',
        });
      });
  };

  // next functionality
  const next = async () => {
    let com1Label;
    let com2Label;
    let newsletterLabel;
    let yagnaLabel;

    com1 &&
      (com1Label = availableBahumanas?.com1Details?.find(
        each => each?.comId === com1,
      ).comName);
    com2 &&
      (com2Label = availableBahumanas?.com2Details?.find(
        each => each?.comId === com2,
      ).comName);
    newsletter &&
      (newsletterLabel = availableBahumanas?.newsletterTypes?.find(
        each => each?.nltrId === newsletter,
      ).nltrName);
    yagna &&
      (yagnaLabel = availableBahumanas?.yagnaList?.find(
        each => each?.yagnaCode === yagna,
      ).yagnaName);

    const payload = {
      accessKey,
      deviceId: store?.deviceId,
      loginId: store?.userData?.userId,
      sessionId: store?.userData?.session_id,
      preacherCode: store?.userData?.id,
      screenNo: '2',
      ptrnForm: Buffer.from(
        JSON.stringify({
          ...routePayload,
          com1,
          com2,
          newsletter,
          nameInscription,
          lLocation,
          yagna,
          com1Label,
          com2Label,
          newsletterLabel,
          yagnaLabel,
          pujaDeails,
        }),
        'utf-8',
      ).toString('base64'),
    };

    console.log('SAVE UNFINISHED :', baseUrl + create_patron_stage, payload);

    availedDates > pujaDeails?.length
      ? showMessage({
          message: 'Alert!',
          description: 'Empty puja dates cannot be submitted',
          type: 'warning',
          floating: true,
          icon: 'auto',
        })
      : Math.max(...pujaDeails?.map(each => Number(each?.sequence))) >
        pujaDeails?.length
      ? (console.log(
          'Max Sequence',
          Math.max(...pujaDeails?.map(each => Number(each?.sequence))),
          'Filled',
          pujaDeails?.length,
        ),
        showMessage({
          message: 'Alert!',
          description: 'Please fill the dates in sequence',
          type: 'warning',
          floating: true,
          icon: 'auto',
        }))
      : pujaDeails?.length > 0 &&
        pujaDeails.some(
          each =>
            !each.month ||
            !each.day ||
            !each.occasion ||
            !each.name ||
            !each.relation,
        )
      ? (console.log(pujaDeails),
        showMessage({
          message: 'Alert!',
          description: `Please fill all the fields for date ${
            pujaDeails.find(
              each =>
                !each.month ||
                !each.day ||
                !each.occasion ||
                !each.name ||
                !each.relation,
            )?.sequence
          }`,
          type: 'warning',
          floating: true,
          icon: 'auto',
        }))
      : await axios
          .post(baseUrl + create_patron_stage, payload)
          .then(res => {
            res.data.successCode === 1
              ? (console.log('STATES SAVED TO TEMPORARY API'),
                navigation.navigate('EnrolmentReview'))
              : showMessage({
                  message: 'Opps!',
                  description: 'Something went wrong',
                  type: 'danger',
                  floating: true,
                  icon: 'auto',
                });
          })
          .catch(err => {
            console.log('NEXT ERROR:', err),
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
        title="BAHUMANA"
        onPressLeft={() => {
          store.ptrnIncmp
            ? navigation.navigate('EnrolmentRegistration')
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
        {/* BAHUMANA PREFERENCE SECTION */}

        <Section
          name="BAHUMANA PREFERENCE"
          leftItem={
            <MaterialCommunityIcons // left icon
              name="gift-open-outline"
              size={25}
              color={COLORS.darkGray}
              style={{marginRight: SIZES.paddingSmall}}
            />
          }>
          {availableBahumanas?.com1 === 'Y' && ( // commentry 1 dropdown
            <Dropdown
              placeholder="Commentry 1"
              style={styles.dropStyle}
              placeholderStyle={styles.dropPlaceholder}
              selectedTextStyle={styles.dropSelectedTxt}
              containerStyle={styles.dropContainer}
              fontFamily={FONTS.josefinSansRegular}
              data={
                availableBahumanas?.com1Details &&
                availableBahumanas?.com1Details?.map(item => {
                  return {
                    label: item.comName,
                    value: item.comId,
                  };
                })
              }
              value={com1}
              labelField="label"
              valueField="value"
              renderItem={item => (
                <Text style={styles.dropText}>{item.label}</Text>
              )}
              onChange={item => setCom1(item.value)}
            />
          )}

          {availableBahumanas?.com2 === 'Y' && ( // commentry 2 dropdown
            <Dropdown
              placeholder="Commentry 2"
              style={styles.dropStyle}
              placeholderStyle={styles.dropPlaceholder}
              selectedTextStyle={styles.dropSelectedTxt}
              containerStyle={styles.dropContainer}
              fontFamily={FONTS.josefinSansRegular}
              data={
                availableBahumanas?.com2Details &&
                availableBahumanas?.com2Details?.map(item => {
                  return {
                    label: item.comName,
                    value: item.comId,
                  };
                })
              }
              value={com2}
              labelField="label"
              valueField="value"
              renderItem={item => (
                <Text style={styles.dropText}>{item.label}</Text>
              )}
              onChange={item => setCom2(item.value)}
            />
          )}

          {availableBahumanas?.nltr === 'Y' && ( // Newsletter dropdown
            <Dropdown
              placeholder="Newsletter"
              style={styles.dropStyle}
              placeholderStyle={styles.dropPlaceholder}
              selectedTextStyle={styles.dropSelectedTxt}
              containerStyle={styles.dropContainer}
              fontFamily={FONTS.josefinSansRegular}
              data={
                availableBahumanas?.newsletterTypes &&
                availableBahumanas?.newsletterTypes?.map(item => {
                  return {
                    label: item.nltrName,
                    value: item.nltrId,
                  };
                })
              }
              value={newsletter}
              labelField="label"
              valueField="value"
              renderItem={item => (
                <Text style={styles.dropText}>{item.label}</Text>
              )}
              onChange={item => setNewsletter(item.value)}
            />
          )}

          <TextInput // wall inscription input
            style={styles.input}
            placeholder="Wall Inscription ( 35 Char Max )"
            placeholderTextColor={COLORS.gray}
            keyboardAppearance="dark"
            keyboardType="default"
            returnKeyType="done"
            color={COLORS.black}
            maxLength={35}
            onChangeText={text => setNameInscription(text)}
            value={nameInscription}
          />

          <TextInput // wall inscription location input
            style={styles.input}
            placeholder="Location ( 15 Char Max )"
            placeholderTextColor={COLORS.gray}
            keyboardAppearance="dark"
            keyboardType="default"
            returnKeyType="done"
            color={COLORS.black}
            maxLength={15}
            onChangeText={text => setlLocation(text)}
            value={lLocation}
          />

          {availableBahumanas?.yagna === 'Y' && ( // yagna dropdown
            <Dropdown
              placeholder="Yagna"
              style={styles.dropStyle}
              placeholderStyle={styles.dropPlaceholder}
              selectedTextStyle={styles.dropSelectedTxt}
              containerStyle={styles.dropContainer}
              fontFamily={FONTS.josefinSansRegular}
              data={
                availableBahumanas?.yagnaList &&
                availableBahumanas?.yagnaList?.map(item => {
                  return {
                    label: item.yagnaName,
                    value: item.yagnaCode,
                  };
                })
              }
              value={yagna}
              labelField="label"
              valueField="value"
              renderItem={item => (
                <Text style={styles.dropText}>{item.label}</Text>
              )}
              onChange={item => setYagna(item.value)}
            />
          )}
        </Section>

        {/* PUJA DATES SECTION */}

        {availableBahumanas?.pujaCount && (
          <Section
            name="PUJA DATES"
            // name={`SELECT DATE ${index + 1}`}
            leftItem={
              <MaterialCommunityIcons // left icon
                name="hands-pray"
                size={25}
                color={COLORS.darkGray}
                style={{marginRight: SIZES.paddingSmall}}
              />
            }
            rightItem={
              // add puja date button
              <TouchableOpacity
                style={{marginRight: SIZES.paddingSmall}}
                onPress={() => addDate()}>
                <MaterialCommunityIcons // add puja date icon
                  name="calendar-plus"
                  size={25}
                  color={COLORS.flatBlue}
                />
              </TouchableOpacity>
            }>
            {[...Array(availedDates).keys()]?.map((item, index) => (
              <View key={index}>
                <View // puja dates section header
                  style={styles.detailsSection}>
                  <Text // puja dates section identifier
                    style={styles.identifierTxt}>
                    PUJA DATE {index + 1}
                  </Text>

                  <TouchableOpacity onPress={() => deleteDate(index + 1)}>
                    <MaterialCommunityIcons // delete icon
                      name="delete"
                      size={25}
                      color={COLORS.flatBlue}
                    />
                  </TouchableOpacity>
                </View>

                <View // date dropdown row
                  style={{flexDirection: 'row'}}>
                  <Dropdown // month dropdown
                    placeholder="Month"
                    style={[
                      styles.dropStyle,
                      {width: SIZES.width * 0.4, marginTop: 0},
                    ]}
                    placeholderStyle={styles.dropPlaceholder}
                    selectedTextStyle={styles.dropSelectedTxt}
                    containerStyle={styles.dropContainer}
                    fontFamily={FONTS.josefinSansRegular}
                    data={months}
                    value={
                      pujaDeails?.find(each => each?.sequence === index + 1)
                        ?.month
                    }
                    labelField="label"
                    valueField="value"
                    renderItem={item => (
                      <Text style={styles.dropText}>{item.label}</Text>
                    )}
                    onChange={item => setPujaMonth(index + 1, item.value)}
                  />

                  <Dropdown // day dropdown
                    placeholder="Day"
                    disable={
                      !pujaDeails?.find(each => each?.sequence === index + 1)
                        ?.month
                    }
                    style={[
                      styles.dropStyle,
                      {
                        width: SIZES.width * 0.2,
                        marginLeft: SIZES.paddingMedium,
                        marginTop: 0,
                      },
                    ]}
                    placeholderStyle={styles.dropPlaceholder}
                    selectedTextStyle={styles.dropSelectedTxt}
                    containerStyle={styles.dropContainer}
                    fontFamily={FONTS.josefinSansRegular}
                    data={
                      pujaDeails?.find(month => month?.sequence === index + 1)
                        ?.month === 'Feb'
                        ? [{label: 'Day', value: 'Day'}, ...febMnth]
                        : pujaDeails?.find(
                            month => month?.sequence === index + 1,
                          )?.month === 'Apr' ||
                          pujaDeails?.find(
                            month => month?.sequence === index + 1,
                          )?.month === 'Jun' ||
                          pujaDeails?.find(
                            month => month?.sequence === index + 1,
                          )?.month === 'Sep' ||
                          pujaDeails?.find(
                            month => month?.sequence === index + 1,
                          )?.month === 'Nov'
                        ? [{label: 'Day', value: 'Day'}, ...thirtyMnth]
                        : [{label: 'Day', value: 'Day'}, ...thirtyOneMnth]
                    }
                    value={
                      pujaDeails?.find(each => each?.sequence === index + 1)
                        ?.day
                    }
                    labelField="label"
                    valueField="value"
                    renderItem={item => (
                      <Text style={styles.dropText}>{item.label}</Text>
                    )}
                    onChange={item => {
                      setPujaDay(index + 1, item.value);
                    }}
                  />
                </View>

                <Dropdown // occasion dropdown
                  placeholder="Select Occasion"
                  style={styles.dropStyle}
                  placeholderStyle={styles.dropPlaceholder}
                  selectedTextStyle={styles.dropSelectedTxt}
                  containerStyle={styles.dropContainer}
                  fontFamily={FONTS.josefinSansRegular}
                  data={['Select Occasion', ...availableOccasions].map(
                    occasion => ({
                      value: occasion,
                      label: occasion,
                    }),
                  )}
                  value={
                    pujaDeails?.find(each => each?.sequence === index + 1)
                      ?.occasion
                  }
                  labelField="label"
                  valueField="value"
                  renderItem={item => (
                    <Text style={styles.dropText}>{item.label}</Text>
                  )}
                  onChange={item => setOccasion(index + 1, item.value)}
                />

                <TextInput // name input
                  style={styles.input}
                  placeholderTextColor={COLORS.gray}
                  placeholder="Enter name"
                  keyboardAppearance="dark"
                  keyboardType="default"
                  returnKeyType="done"
                  value={
                    pujaDeails?.find(each => each?.sequence === index + 1)?.name
                  }
                  onChangeText={text => setName(index + 1, text)}
                />

                <Dropdown // relation dropdown
                  placeholder="Select Relation"
                  style={styles.dropStyle}
                  placeholderStyle={styles.dropPlaceholder}
                  selectedTextStyle={styles.dropSelectedTxt}
                  containerStyle={styles.dropContainer}
                  fontFamily={FONTS.josefinSansRegular}
                  data={['Select Relation', ...availableRelations].map(
                    relation => ({
                      value: relation,
                      label: relation,
                    }),
                  )}
                  value={
                    pujaDeails?.find(each => each?.sequence === index + 1)
                      ?.relation
                  }
                  labelField="label"
                  valueField="value"
                  renderItem={item => (
                    <Text style={styles.dropText}>{item.label}</Text>
                  )}
                  onChange={item => setRelation(index + 1, item.value)}
                />
              </View>
            ))}
          </Section>
        )}

        <PrimaryButton // next button
          style={styles.primaryBtn}
          name="Next"
          onPress={() => next()}
        />
      </ScrollView>
    </LinearGradient>
  );
};

export default EnrolmentBahumanaPuja;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: COLORS.white,
  },
  dropStyle: {
    width: '100%',
    height: SIZES.height * 0.065,
    borderColor: COLORS.lightGray,
    borderRadius: SIZES.radiusSmall,
    borderWidth: 1,
    backgroundColor: COLORS.antiFlashWhite,
    paddingHorizontal: SIZES.paddingSmall,
    marginTop: SIZES.paddingSmall,
  },
  dropPlaceholder: {
    color: COLORS.gray,
    fontSize: SIZES.fontSmall,
  },
  dropSelectedTxt: {
    color: COLORS.black,
    fontSize: SIZES.fontSmall,
  },
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
    color: COLORS.black,
  },
  identifierTxt: {
    flex: 1,
    color: COLORS.black,
    fontSize: SIZES.fontSmall,
    fontFamily: FONTS.josefinSansBold,
  },
  detailsSection: {
    padding: SIZES.paddingSmall,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  primaryBtn: {
    alignSelf: 'center',
    width: SIZES.width * 0.9,
  },
});
