import {
  StyleSheet,
  StatusBar,
  Text,
  BackHandler,
  TouchableOpacity,
  TextInput,
  View,
  ScrollView,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Animated from 'react-native-reanimated';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import {showMessage} from 'react-native-flash-message';
import {Store} from '../store/Store';
import {COLORS, SIZES, FONTS, SHADOW} from '../constants';
import {
  accessKey,
  baseUrl,
  insert_posting_comment,
  get_comment_details,
} from '../webApi/service';

// components
import Header from '../components/Common/Header';
import PrimaryButton from '../components/Common/PrimaryButton';
import CommonModal from '../components/Common/CommonModal';

const Comment = ({navigation, route}) => {
  const store = Store();

  const [filterModal, setFilterModal] = useState(false); // filter modal open/close
  const [commentTypes] = useState([
    {name: 'General', icon: 'comment-outline'},
    {name: 'Seva', icon: 'hand-extended-outline'},
    {name: 'Complaint', icon: 'alert-rhombus-outline'},
    {name: 'Request', icon: 'head-question-outline'},
  ]); // comment types
  const [filterType, setFilterType] = useState('All'); // filter type
  const [selectedComType, setSelectedComType] = useState('General'); // selected comment type
  const [comment, setComment] = useState(''); // comment
  const [commentList, setCommentList] = useState([]); // comment list

  useEffect(() => {
    const unSubscribe = navigation.addListener('focus', () => {
      getComment();
      BackHandler.addEventListener('hardwareBackPress', () => {
        console.log('BackHandler In Comment is called');
        navigation.goBack();
        return true;
      });
    });
    return unSubscribe;
  }, []);

  // post comment
  const postComment = async () => {
    const payload = {
      accessKey,
      deviceId: store?.deviceId,
      loginId: store?.userData?.userId,
      sessionId: store?.userData?.session_id,
      roleId: store?.userData?.userRole,
      patronId: route?.params,
      commentedBy: store?.userData?.userId,
      commentType: selectedComType,
      comment: comment,
    };

    console.log('POST COMMENT :', baseUrl + insert_posting_comment, payload);

    selectedComType?.length === 0
      ? showMessage({
          message: 'Warning',
          description: 'Please select comment type',
          type: 'warning',
          floating: true,
          icon: 'auto',
        })
      : comment?.length > 0
      ? axios
          .post(baseUrl + insert_posting_comment, payload)
          .then(response => {
            response.data.successCode === 1
              ? (console.log('comment posted successfully'),
                setComment(''),
                getComment({post: 'Y'}))
              : showMessage({
                  message: 'Opps!',
                  description: 'Something went wrong',
                  type: 'danger',
                  floating: true,
                  icon: 'auto',
                });
          })
          .catch(error => {
            showMessage({
              message: 'Error!',
              description: 'Please check your internet connection',
              type: 'danger',
              floating: true,
              icon: 'auto',
            });
          })
      : showMessage({
          message: 'Warning',
          description: 'Please enter comment',
          type: 'warning',
          floating: true,
          icon: 'auto',
        });
  };

  // get comment
  const getComment = async params => {
    const payload = {
      accessKey,
      deviceId: store?.deviceId,
      loginId: store?.userData?.userId,
      sessionId: store?.userData?.session_id,
      patronId: route?.params,
      commentType: params?.type === 'All' || !params?.type ? '' : params?.type,
    };

    console.log('GET COMMENTS :', baseUrl + get_comment_details, payload);
    axios
      .post(baseUrl + get_comment_details, payload)
      .then(response => {
        console.log(response?.data);

        response.data.successCode === 1
          ? (setCommentList(response.data.data),
            setFilterType(params?.type ? params?.type : filterType),
            setFilterModal(false))
          : (params?.post !== 'Y' &&
              showMessage({
                message: 'Thats all!',
                description: 'No comments found',
                type: 'info',
                floating: true,
                icon: 'auto',
              }),
            setCommentList([]),
            setFilterType(params?.type ? params?.type : filterType),
            setFilterModal(false));
      })
      .catch(error => {
        showMessage(
          {
            message: 'Error!',
            description: 'Please check your internet connection',
            type: 'danger',
            floating: true,
            icon: 'auto',
          },
          setCommentList([]),
          setFilterModal(false),
        );
      });
  };

  return (
    <Animated.View // animated container
      style={[styles.container, store.animatedScreen]}>
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
          title="COMMENTS"
          onPressLeft={() => navigation.goBack()}
          headerRight={
            <TouchableOpacity // filter button
              onPress={() => setFilterModal(true)}>
              <MaterialCommunityIcons // filter icon
                name="filter"
                size={25}
                color={COLORS.black}
              />
            </TouchableOpacity>
          }
        />

        {/* FILTER MODAL */}

        <CommonModal // filter modal
          title="FILTER COMMENTS"
          isOpen={filterModal}
          onClose={() => setFilterModal(false)}>
          <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
            {[{name: 'All', icon: 'comment-outline'}, ...commentTypes]?.map(
              (item, index) => (
                <TouchableOpacity // comment type button
                  style={[
                    styles.commentTypeBtn,
                    {
                      backgroundColor:
                        filterType === item?.name
                          ? COLORS.quaternary
                          : COLORS.primary,
                      elevation:
                        filterType === item?.name ? 0 : SHADOW.elevation,
                      shadowOpacity:
                        filterType === item?.name ? 0 : SHADOW.shadowOpacity,
                      marginRight:
                        index !==
                        [
                          {name: 'All', icon: 'comment-outline'},
                          ...commentTypes,
                        ]?.length -
                          1
                          ? SIZES.paddingSmall
                          : 0,
                    },
                    ,
                  ]}
                  key={index}
                  onPress={() => getComment({type: item?.name})}>
                  <MaterialCommunityIcons // comment type icon
                    name={item?.icon}
                    size={20}
                    color={
                      filterType === item?.name ? COLORS.black : COLORS.white
                    }
                  />
                  <Text // add comment type text
                    style={[
                      styles.txt,
                      {
                        marginLeft: 2,
                        color:
                          filterType === item?.name
                            ? COLORS.black
                            : COLORS.white,
                      },
                    ]}>
                    {item?.name}
                  </Text>
                </TouchableOpacity>
              ),
            )}
          </View>
        </CommonModal>

        <View // comment types container
          style={styles.typeContainer}>
          {commentTypes?.map((item, index) => (
            <TouchableOpacity // comment type button
              style={[
                styles.commentTypeBtn,
                {
                  backgroundColor:
                    selectedComType === item?.name
                      ? COLORS.quaternary
                      : COLORS.primary,
                  elevation:
                    selectedComType === item?.name ? 0 : SHADOW.elevation,
                  shadowOpacity:
                    selectedComType === item?.name ? 0 : SHADOW.shadowOpacity,
                  marginRight:
                    index !== commentTypes.length - 1 ? SIZES.paddingSmall : 0,
                },
              ]}
              key={index}
              onPress={() => setSelectedComType(item?.name)}>
              <MaterialCommunityIcons // comment type icon
                name={item?.icon}
                size={20}
                color={
                  selectedComType === item?.name ? COLORS.black : COLORS.white
                }
              />
              <Text // add comment type text
                style={[
                  styles.txt,
                  {
                    marginLeft: 2,
                    color:
                      selectedComType === item?.name
                        ? COLORS.black
                        : COLORS.white,
                  },
                ]}>
                {item?.name}
              </Text>
            </TouchableOpacity>
          ))}
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
            onChangeText={text => setComment(text)}
            value={comment}
            maxLength={500}
          />
          <Text // no. of characters left indicator
            style={styles.characterLeft}>
            {0 + comment?.length}/500
          </Text>
        </View>
        <PrimaryButton // add comment button
          style={styles.addBtn}
          name="ADD"
          onPress={postComment}
        />
        <ScrollView // comments container
          showsVerticalScrollIndicator={false}
          style={styles.commentsContainer}>
          {commentList?.map((item, index) => (
            <Animatable.View // individual comment with date
              animation={index === 0 ? 'bounceIn' : 'fadeInDown'}
              duration={index === 0 ? 2000 : 300}
              key={item.commentId}>
              <View // comment chat bubble
                style={styles.chatBubble}>
                <View style={styles.chatHeader}>
                  <Text style={styles.txt}>
                    {item?.commentType?.charAt(0).toUpperCase() +
                      item?.commentType?.slice(1)}{' '}
                    {item?.commentedOn.substring(12)}
                  </Text>
                  <Text
                    style={[styles.txt, {fontFamily: FONTS.josefinSansMedium}]}>
                    {item?.status}
                  </Text>
                </View>
                <View // separator
                  style={styles.separator}
                />
                <Text style={styles.txt}>{item?.comment}</Text>
              </View>
              <View // comment date container
                style={styles.dateContainer}>
                <Text style={styles.commentDate}>
                  {item?.commentedOn.substring(0, 11)}
                </Text>
              </View>
            </Animatable.View>
          ))}
        </ScrollView>
      </LinearGradient>
    </Animated.View>
  );
};

export default Comment;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: COLORS.white,
    alignItems: 'center',
  },
  typeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: SIZES.width * 0.05,
    marginBottom: SIZES.height * 0.01,
  },
  commentTypeBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SIZES.width * 0.05,
    borderRadius: SIZES.radiusMedium,
    flexDirection: 'row',
    marginBottom: SIZES.height * 0.01,
    padding: 7,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 3.84,
  },
  txt: {
    fontSize: SIZES.fontSmall,
    fontFamily: FONTS.josefinSansRegular,
    color: COLORS.black,
  },
  addCommentInputCont: {
    width: SIZES.width * 0.9,
    height: SIZES.height * 0.25,
    borderRadius: SIZES.radiusSmall,
    backgroundColor: COLORS.antiFlashWhite,
    overflow: 'hidden',
    marginBottom: SIZES.paddingMedium,
  },
  addCommentInput: {
    flex: 1,
    paddingHorizontal: SIZES.paddingSmall,
    paddingVertical: SIZES.paddingSmall,
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
  addBtn: {
    width: SIZES.width * 0.4,
    height: 40,
    alignSelf: 'flex-end',
    marginRight: SIZES.width * 0.05,
    marginBottom: SIZES.height * 0.02,
  },
  commentsContainer: {
    width: SIZES.width * 0.9,
    overflow: 'hidden',
  },
  chatBubble: {
    width: SIZES.width * 0.9,
    marginBottom: SIZES.paddingMedium,
    padding: SIZES.paddingSmall,
    borderRadius: SIZES.radiusSmall,
    backgroundColor: COLORS.white,
    overflow: 'hidden',
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateContainer: {
    marginBottom: SIZES.paddingMedium,
    backgroundColor: COLORS.antiFlashWhite,
    padding: SIZES.paddingSmall,
    borderRadius: SIZES.radiusMedium,
    width: SIZES.width * 0.4,
    alignSelf: 'center',
  },
  commentDate: {
    fontFamily: FONTS.josefinSansRegular,
    fontSize: SIZES.fontSmall,
    color: COLORS.gray,
    textAlign: 'center',
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.lightGray,
    marginVertical: SIZES.height * 0.01,
  },
});
