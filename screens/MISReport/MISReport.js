import {
  StyleSheet,
  Text,
  View,
  BackHandler,
  ScrollView,
  StatusBar,
  Modal,
  Dimensions,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {showMessage} from 'react-native-flash-message';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
import axios from 'axios';
import {
  VictoryChart,
  VictoryBar,
  VictoryLine,
  VictoryTheme,
  Bar,
} from 'victory-native';
import {Dropdown} from 'react-native-element-dropdown';
import {Store} from '../../store/Store';
import {COLORS, FONTS, SIZES, SHADOW, icons} from '../../constants';
import {
  accessKey,
  baseUrl,
  get_year_collection_report,
  get_month_collection_report,
  get_annadana_year_collection,
  get_annadana_month_collection,
  get_preacher_collection_report,
  get_kind_donation_details,
  get_frdc_attendance,
  get_year_preacher_collection,
  get_preacher_month_collection,
  get_vkhill_collection,
  get_gunjur_collection,
  get_avalabetta_collection,
} from '../../webApi/service';
import {VStack, HStack, Skeleton, Spinner} from 'native-base';

// components
import Header from '../../components/Common/Header';
import PrimaryButton from '../../components/Common/PrimaryButton';
import {TouchableOpacity} from 'react-native-gesture-handler';

const MISReport = ({navigation, route}) => {
  const store = Store();

  console.log(route?.params?.flag);

  const [months] = useState([
    {label: 'Jan', value: '01'},
    {label: 'Feb', value: '02'},
    {label: 'Mar', value: '03'},
    {label: 'Apr', value: '04'},
    {label: 'May', value: '05'},
    {label: 'Jun', value: '06'},
    {label: 'Jul', value: '07'},
    {label: 'Aug', value: '08'},
    {label: 'Sep', value: '09'},
    {label: 'Oct', value: '10'},
    {label: 'Nov', value: '11'},
    {label: 'Dec', value: '12'},
  ]); // available months state
  const [fromYear, setFromYear] = useState(
    moment(new Date()).format('MM') === '12'
      ? moment(new Date()).format('YYYY')
      : moment(new Date()).subtract(1, 'year').format('YYYY'),
  ); // from year state
  const [toYear, setToYear] = useState(moment(new Date()).format('YYYY')); // to year state
  const [fromMonth, setFromMonth] = useState(
    moment(new Date()).format('MM') === '12'
      ? moment().startOf('year').format('MM')
      : moment(new Date()).add(1, 'months').format('MM'),
  ); // from month state
  const [toMonth, setToMonth] = useState(moment(new Date()).format('MM')); // to month state

  const [misYearData, setMisYearData] = useState([]); // mis year wise data state
  const [misMonthData, setMisMonthData] = useState([]); // mis month wise data state
  const [barChart, setBarChart] = useState(true); // show bar chart state
  const [spinnerLoader, setSpinnerLoader] = useState(false); // show bar chart state

  const [xaxisName, setXaxisName] = useState('month');
  const [yaxisName, setYaxisName] = useState('amount');

  useEffect(() => {
    const unSubscribe = navigation.addListener('focus', () => {
      BackHandler.addEventListener('hardwareBackPress', () => {
        console.log('BackHandler In MISReport is called');
        navigation.goBack();
        return true;
      });
    });
    return unSubscribe;
  }, []);

  // get mis data
  const getMisData = async () => {
    setSpinnerLoader(true);
    const flag = route?.params?.flag;
    const endpoint =
      flag === 'YMC'
        ? get_year_collection_report
        : flag === 'ADC'
        ? get_annadana_year_collection
        : flag === 'PC'
        ? get_preacher_collection_report
        : flag === 'KDC'
        ? get_kind_donation_details
        : flag === 'FRDCA'
        ? get_frdc_attendance
        : flag === 'PWYC'
        ? get_year_preacher_collection
        : flag === 'VKHC'
        ? get_vkhill_collection
        : flag === 'GC'
        ? get_gunjur_collection
        : get_avalabetta_collection;

    const payload = {
      accessKey,
      deviceId: store?.deviceId,
      loginId: store?.userData?.userId,
      sessionId: store?.userData?.session_id,
      fromYear,
      fromMonth,
      toYear,
      toMonth,
    };

    console.log('GET MIS DATA:', baseUrl + endpoint, payload);

    await axios
      .post(baseUrl + endpoint, payload)
      .then(res => {
        res?.data?.successCode === 1
          ? res.data.data[0]?.hasOwnProperty('month')
            ? (console.log(res?.data?.data),
              setMisYearData(
                res?.data?.data?.map(each => {
                  return {
                    month: months?.find(
                      month =>
                        month.value ===
                        (Number(each?.month) < 10
                          ? `0${Number(each?.month)}`.toString()
                          : each.month),
                    ).label,
                    amount: Number(each?.amount?.replace(/\,/g, '')),
                    year: each?.year,
                  };
                }),
              ),
              setXaxisName('month'))
            : res.data.data[0]?.hasOwnProperty('preacherCode')
            ? (console.log(
                'response has preacherCode',
                res?.data?.data?.map(each => {
                  return {
                    amount: Number(each?.amount?.replace(/\,/g, '')),
                    preacherCode: each?.preacherCode,
                  };
                }),
              ),
              setMisYearData(
                res?.data?.data?.map(each => {
                  return {
                    amount: Number(each?.amount?.replace(/\,/g, '')),
                    preacherCode: each?.preacherCode,
                  };
                }),
              ),
              setXaxisName('preacherCode'))
            : setMisMonthData([])
          : showMessage({
              message: 'Thats all!',
              description: 'No more data found',
              type: 'info',
              floating: true,
              icon: 'auto',
            });
        setSpinnerLoader(false);
      })
      .catch(err => {
        setSpinnerLoader(false);
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

  // console.log(
  //   [...Array(4).keys()].map(each => {
  //     const value =
  //       Math.round(Math.max(...misYearData.map(each => each.amount)) / 4) *
  //       (each + 1);
  //     const suffixes = ['', 'K', 'M', 'B', 'T'];
  //     const suffixNum = Math.floor(('' + value).length / 3);
  //     let shortValue = parseFloat(
  //       (suffixNum != 0
  //         ? value / Math.pow(1000, suffixNum)
  //         : value
  //       ).toPrecision(2),
  //     );
  //     if (shortValue % 1 != 0) {
  //       shortValue = shortValue.toFixed(1);
  //     }
  //     return shortValue + suffixes[suffixNum];
  //   }),
  // );

  // console.log(
  //   [...Array(4).keys()].map(each =>
  //     Intl.NumberFormat('en-US', {
  //       notation: 'compact',
  //       maximumFractionDigits: 1,
  //     }).format(
  //       Math.round(Math.max(...misYearData.map(each => each.amount)) / 4) *
  //         (each + 1),
  //     ),
  //   ),
  // );

  const getMisMonthData = async params => {
    setSpinnerLoader(true);
    const flag = route?.params?.flag;
    const endpoint =
      flag === 'YMC'
        ? get_month_collection_report
        : flag === 'ADC'
        ? get_annadana_month_collection
        : flag === 'PWYC'
        ? get_preacher_month_collection
        : null;

    let payload = {
      accessKey,
      deviceId: store?.deviceId,
      loginId: store?.userData?.userId,
      sessionId: store?.userData?.session_id,

      fromYear: params?.year,
      fromMonth: months?.find(month => month?.label === params?.month).value,
      toYear: params?.year,
      toMonth: months?.find(month => month?.label === params?.month).value,
    };

    console.log('FETCH MONTH WISE MIS DATA :', baseUrl + endpoint, payload);
    await axios
      .post(baseUrl + endpoint, payload)
      .then(res => {
        res?.data?.successCode === 1
          ? (console.log('MONTH WISE Response ', res.data),
            setMisYearData(
              res?.data?.data?.map(each => {
                return {
                  day: each?.day,
                  amount: Number(each.amount.replace(/\,/g, '')),
                  year: each?.year,
                };
              }),
            ),
            setXaxisName('day'))
          : showMessage({
              message: 'Thats all!',
              description: 'No more data found',
              type: 'info',
              floating: true,
              icon: 'auto',
            });
        setSpinnerLoader(false);
      })
      .catch(err => {
        setSpinnerLoader(false);
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
        title="MIS REPORT"
        onPressLeft={() => navigation.goBack()}
      />
      {/* TIME FRAME SELECTION SECTION */}

      <View // year selection
        style={styles.dropSecRow}>
        <Dropdown // from year dropdown
          placeholder="Year"
          style={styles.dropStyle}
          placeholderStyle={styles.dropPlaceholder}
          selectedTextStyle={styles.dropSelectedTxt}
          containerStyle={styles.dropContainer}
          fontFamily={FONTS.josefinSansRegular}
          data={[...Array(10).keys()].map(year => ({
            value: moment(new Date()).subtract(year, 'year').format('YYYY'),
            label: moment(new Date()).subtract(year, 'year').format('YYYY'),
          }))}
          value={fromYear}
          labelField="label"
          valueField="value"
          renderItem={item => <Text style={styles.dropText}>{item.label}</Text>}
          onChange={item => (
            setFromYear(item.value),
            setFromMonth(''),
            setToYear(''),
            setToMonth('')
          )}
        />
        <Dropdown // from month dropdown
          placeholder="Month"
          disable={!fromYear}
          style={[styles.dropStyle, {marginRight: 0}]}
          placeholderStyle={styles.dropPlaceholder}
          selectedTextStyle={styles.dropSelectedTxt}
          containerStyle={styles.dropContainer}
          fontFamily={FONTS.josefinSansRegular}
          data={
            fromYear === moment(new Date()).format('YYYY')
              ? months.filter(
                  month =>
                    !(
                      Number(month.value) >=
                      Number(moment(new Date()).format('MM'))
                    ),
                )
              : months
          }
          value={fromMonth}
          labelField="label"
          valueField="value"
          renderItem={item => <Text style={styles.dropText}>{item.label}</Text>}
          onChange={item => (
            setFromMonth(item.value), setToYear(''), setToMonth('')
          )}
        />

        <Text style={{color: COLORS.white, textAlign: 'center', flex: 0.3}}>
          -
        </Text>

        <Dropdown // to year dropdown
          placeholder="Year"
          disable={!fromYear}
          style={styles.dropStyle}
          placeholderStyle={styles.dropPlaceholder}
          selectedTextStyle={styles.dropSelectedTxt}
          containerStyle={styles.dropContainer}
          fontFamily={FONTS.josefinSansRegular}
          data={[...Array(2).keys()]
            .map(year => ({
              value: (Number(fromYear) + 1 - year).toString(),
              label: (Number(fromYear) + 1 - year).toString(),
            }))
            .filter(y =>
              Number(fromMonth) + 12 - 1 === 12
                ? y.value === fromYear
                : !(y.value > moment(new Date()).format('YYYY')),
            )}
          value={toYear}
          labelField="label"
          valueField="value"
          renderItem={item => <Text style={styles.dropText}>{item.label}</Text>}
          onChange={item => (setToYear(item.value), setToMonth(''))}
        />
        <Dropdown // to month dropdown
          placeholder="Month"
          disable={!toYear || !fromMonth}
          style={[styles.dropStyle, {marginRight: 0}]}
          placeholderStyle={styles.dropPlaceholder}
          selectedTextStyle={styles.dropSelectedTxt}
          containerStyle={styles.dropContainer}
          fontFamily={FONTS.josefinSansRegular}
          data={
            fromMonth && toYear
              ? toYear === fromYear
                ? fromYear === moment(new Date()).format('YYYY')
                  ? months
                      .filter(
                        month => !(Number(month.value) <= Number(fromMonth)),
                      )
                      .filter(
                        month =>
                          !(
                            Number(month.value) >
                            Number(moment(new Date()).format('MM'))
                          ),
                      )
                  : months.filter(
                      month => !(Number(month.value) <= Number(fromMonth)),
                    )
                : months.filter(
                    month => !(Number(month.value) >= Number(fromMonth)),
                  )
              : months.filter(month => !month)
          }
          value={toMonth}
          labelField="label"
          valueField="value"
          renderItem={item => <Text style={styles.dropText}>{item.label}</Text>}
          onChange={item => setToMonth(item.value)}
        />
      </View>

      {/* SEARCH BUTTON */}

      <PrimaryButton
        disabled={!(fromYear && fromMonth && toYear && toMonth)}
        style={[
          styles.search,
          {
            backgroundColor:
              !fromYear || !fromMonth || !toYear || !toMonth
                ? COLORS.lightGray
                : COLORS.primary,

            elevation:
              fromYear && fromMonth && toYear && toMonth ? SHADOW.elevation : 0,
            shadowOpacity:
              fromYear && fromMonth && toYear && toMonth ? 0.25 : 0,
          },
        ]}
        icon="magnify"
        name="Search"
        onPress={getMisData}
      />

      {/* MONTH WISE REPORT SECTION */}

      {misYearData?.length > 0 && (
        <View style={{flex: 1}}>
          {barChart ? ( // bar chart
            <View style={{flex: 1, alignItems: 'center'}}>
              <VictoryChart
                width={SIZES.width / 1.1}
                height={SIZES.height / 1.6}
                theme={VictoryTheme.material}>
                <VictoryBar
                  animate
                  style={{data: {fill: COLORS.blue}, height: '100%'}}
                  width={SIZES.width / 1.1}
                  height={SIZES.height / 1.6}
                  barWidth={SIZES.width / (misYearData.length * 3)}
                  data={misYearData}
                  events={[
                    {
                      target: 'data',
                      eventHandlers: {
                        onPressIn: () => {
                          return [
                            {
                              target: 'labels',
                              mutation: props =>
                                (route?.params?.flag === 'YMC' ||
                                  route?.params?.flag === 'ADC' ||
                                  route?.params?.flag === 'PWYC') &&
                                getMisMonthData(props.datum),
                            },
                          ];
                        },
                      },
                    },
                  ]}
                  labels={({datum}) => `₹ ${datum._y}`}
                  x={xaxisName}
                  y={yaxisName}
                  // categories={{
                  //   x:
                  //   y:
                  // }}
                />
              </VictoryChart>
            </View>
          ) : (
            // mis list
            <View style={styles.dataCont}>
              <View // identifier container
                style={styles.identCont}>
                <Text style={styles.identifierTxt}>
                  {xaxisName === 'month' ? 'Month' : 'Preacher Code'}
                </Text>
                <Text style={styles.identifierTxt}>Collection</Text>
              </View>
              <ScrollView
                style={{width: '100%'}}
                showsVerticalScrollIndicator={false}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setBarChart(true)}>
                  {misYearData?.map((item, index) => (
                    <View
                      key={index}
                      style={{width: '100%', alignItems: 'center'}}>
                      <View // value container
                        key={index}
                        style={styles.valCont}>
                        <Text style={[styles.valueTxt, {textAlign: 'center'}]}>
                          {item?.month ? item.month : item?.preacherCode}
                        </Text>

                        <Text style={[styles.valueTxt, {textAlign: 'center'}]}>
                          {item?.amount}
                        </Text>
                      </View>
                      {index + 1 !== misYearData?.length && (
                        <View style={styles.separator} />
                      )}
                    </View>
                  ))}
                </TouchableOpacity>
              </ScrollView>
            </View>
          )}
          <PrimaryButton
            icon={barChart ? 'format-list-group' : 'chart-box-outline'}
            style={styles.toggle}
            onPress={() => setBarChart(!barChart)}
          />
        </View>
      )}

      {/* // ~ SPINNER MODAL */}
      <Modal visible={spinnerLoader} animationType={'fade'} transparent>
        <View
          style={{
            justifyContent: 'center',
            height: Dimensions.get('screen').height,
            backgroundColor: 'rgba(0,0,0,0.2)',
          }}>
          <Spinner color={COLORS.primary} size="lg" />
        </View>
      </Modal>
    </LinearGradient>
  );
};

export default MISReport;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: COLORS.white,
  },
  detailsSection: {
    padding: SIZES.paddingSmall,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dataCont: {
    flex: 1,
    marginHorizontal: SIZES.paddingMedium,
    marginTop: SIZES.paddingMedium,
    borderRadius: SIZES.radiusMedium,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: COLORS.white,
    alignItems: 'center',
  },
  identifierTxt: {
    flex: 1,
    color: COLORS.black,
    fontSize: SIZES.fontMedium,
    fontFamily: FONTS.josefinSansMedium,
    textAlign: 'center',
  },
  valueTxt: {
    flex: 1,
    color: COLORS.white,
    fontSize: SIZES.fontMedium,
    fontFamily: FONTS.josefinSansRegular,
  },
  identCont: {
    flexDirection: 'row',
    padding: SIZES.paddingMedium,
    backgroundColor: COLORS.white,
  },
  valCont: {flexDirection: 'row', padding: SIZES.paddingMedium},
  dropSecRow: {
    flexDirection: 'row',
    padding: SIZES.paddingSmall,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.white,
    borderRadius: SIZES.radiusMedium,
    marginHorizontal: SIZES.paddingSmall,
  },
  dropStyle: {
    flex: 1,
    marginRight: SIZES.paddingSmall,
    height: SIZES.height * 0.065,
    borderColor: COLORS.lightGray,
    borderRadius: SIZES.radiusSmall,
    borderWidth: 1,
    backgroundColor: COLORS.antiFlashWhite,
    paddingHorizontal: SIZES.paddingSmall,
  },
  dropPlaceholder: {color: COLORS.gray, fontSize: SIZES.fontSmall - 2},
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
  separator: {
    height: 1,
    backgroundColor: COLORS.lightGray,
    marginVertical: SIZES.paddingSmall,
    width: '80%',
  },
  search: {
    alignSelf: 'center',
    width: SIZES.width * 0.9,
    marginTop: SIZES.paddingMedium,
  },
  toggle: {
    alignSelf: 'flex-end',
    width: SIZES.width * 0.2,
    margin: SIZES.paddingMedium,
  },
});
