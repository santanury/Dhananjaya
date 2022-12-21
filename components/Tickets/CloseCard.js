import {
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, {useState} from 'react';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import AntDesign from 'react-native-vector-icons/AntDesign';
import moment from 'moment';
import {showMessage} from 'react-native-flash-message';
import axios from 'axios';
import {Store} from '../../store/Store';
import {COLORS, SIZES, FONTS, SHADOW} from '../../constants';
import {
  baseUrl,
  accessKey,
  ticketing_baseUrl,
  insert_ticket_feedback,
} from '../../webApi/service';

// components
import CommonModal from '../Common/CommonModal';
import PrimaryButton from '../Common/PrimaryButton';

const CloseCard = props => {
  const [feedbackMdl, setFeedbackMdl] = useState(false); // feedback modal state
  const [id4Feedback, setId4Feedback] = useState(''); // id to give feedback on
  const [feedbackPoint, setFeedbackPoint] = useState(0); // stars given
  const [feedbackRemark, setFeedbackRemark] = useState(''); // remarks given

  // feedback
  const submitFeedback = async () => {
    let tempObj = props?.closeTickets;

    const payload = {
      accessKey,
      ticketId: id4Feedback,
      feedbackPoint: feedbackPoint?.toString(),
      feedbackRemark,
    };

    console.log(
      'SUBMIT FEEDBACK :',
      ticketing_baseUrl + insert_ticket_feedback,
      payload,
    );

    await axios
      .post(ticketing_baseUrl + insert_ticket_feedback, payload)
      .then(res => {
        res?.data?.successCode === 1
          ? (props?.setCloseTickets(
              tempObj?.map(each => {
                if (each.requestId === id4Feedback) {
                  each.feedbackPoint = feedbackPoint;
                }
                return each;
              }),
            ),
            showMessage({
              message: 'Success!',
              description: `Successfully posted feedback`,
              type: 'success',
              floating: true,
              icon: 'auto',
            }),
            setFeedbackMdl(false),
            setId4Feedback(''),
            setFeedbackPoint(0),
            setFeedbackRemark(''))
          : (showMessage({
              message: 'Warning!',
              description: `Can't post feedback right now`,
              type: 'warning',
              floating: true,
              icon: 'auto',
            }),
            setFeedbackMdl(false),
            setId4Feedback(''),
            setFeedbackPoint(0),
            setFeedbackRemark(''));
      })
      .catch(err => {
        console.log('Error submitting feedback :', err);
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
        colors={[COLORS.gray + '70', COLORS.gray + '60', COLORS.gray + '50']}>
        <TouchableOpacity
          onPress={() => {
            props?.navigation.navigate('TicketDetails', props?.data);
          }}
          activeOpacity={1}
          style={{flex: 1}}>
          <View // ticket number
            style={{flex: 1}}>
            <Text style={styles.identifierTxt}>{props?.data?.requestNo}</Text>
          </View>

          <View // date
          >
            <Text style={styles.valueTxt}>
              {moment(props?.data?.createdOntime, 'YYYY-MM-DD').format(
                'DD-MMM-YYYY',
              )}
            </Text>
          </View>
        </TouchableOpacity>
      </LinearGradient>

      {/* CARD BODY CONTENT */}
      <>
        <View // subject container
          style={styles.detailsSection}>
          <Text // subject identifier
            style={styles.identifierTxt}>
            Subject:
          </Text>
          <Text // subject value
            style={[styles.valueTxt, {flex: 1.5}]}>
            {props?.data?.requestSubject}
          </Text>
        </View>

        <View // separator
          style={styles.separator}
        />

        <View // description container
          style={styles.detailsSection}>
          <Text // description identifier
            style={styles.identifierTxt}>
            Description:
          </Text>
          <Text // description value
            style={[styles.valueTxt, {flex: 1.5}]}>
            {props?.data?.requestDescription}
          </Text>
        </View>

        <View // separator
          style={styles.separator}
        />

        <View // assign to container
          style={styles.detailsSection}>
          <Text // assign to identifier
            style={styles.identifierTxt}>
            Assign To:
          </Text>
          <Text // assign to value
            style={[styles.valueTxt, {flex: 1.5}]}>
            {props?.data?.requestAssignedTo}
          </Text>

          <TouchableOpacity // feedback button
            disabled={props?.data?.feedbackPoint != '0'}
            onPress={() => {
              setFeedbackMdl(true);
              setId4Feedback(props?.data?.requestId);
            }}>
            <AntDesign
              name={'star'}
              // staro
              size={25}
              color={
                props?.data?.feedbackPoint === '0'
                  ? COLORS.primary
                  : COLORS.gray
              }
            />
          </TouchableOpacity>
        </View>

        <CommonModal
          title="GIVE FEEDBACK"
          isOpen={feedbackMdl}
          onClose={() => {
            setFeedbackMdl(false);
            setId4Feedback('');
            setFeedbackPoint(0);
            setFeedbackRemark('');
          }}>
          <View style={styles.starSec}>
            {[...Array(5).keys()]?.map((item, index) => (
              <TouchableOpacity
                activeOpacity={1}
                key={index}
                onPress={() => {
                  feedbackPoint === index + 1
                    ? setFeedbackPoint(0)
                    : setFeedbackPoint(index + 1);
                }}>
                <AntDesign
                  name={feedbackPoint >= index + 1 ? 'star' : 'staro'}
                  size={35}
                  color={
                    props?.data?.feedbackPoint === '0'
                      ? COLORS.primary
                      : COLORS.gray
                  }
                />
              </TouchableOpacity>
            ))}
          </View>

          <TextInput // remark input
            style={styles.input}
            placeholderTextColor={COLORS.gray}
            placeholder="Type your remarks"
            keyboardAppearance="dark"
            keyboardType="default"
            returnKeyType="done"
            value={feedbackRemark}
            onChangeText={text => setFeedbackRemark(text)}
          />

          <PrimaryButton // submit button
            disabled={!feedbackPoint}
            name="SUBMIT"
            icon="check"
            style={{
              height: SIZES.height * 0.065,
              width: '100%',
              backgroundColor: feedbackPoint
                ? COLORS.saveEnabled
                : COLORS.lightGray,
              elevation: feedbackPoint ? SHADOW.elevation : 0,
              shadowOpacity: feedbackPoint ? SHADOW.shadowOpacity : 0,
            }}
            onPress={() => submitFeedback()}
          />
        </CommonModal>
      </>
    </Animatable.View>
  );
};

export default CloseCard;

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
  starSec: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '70%',
    alignSelf: 'center',
    marginBottom: SIZES.paddingMedium,
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
});
