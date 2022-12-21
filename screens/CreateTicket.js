import {
  StyleSheet,
  StatusBar,
  BackHandler,
  ScrollView,
  TextInput,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
import ImagePicker from 'react-native-image-crop-picker';
import {showMessage} from 'react-native-flash-message';
import {COLORS, FONTS, SIZES, SHADOW, icons} from '../constants';
import {Store} from '../store/Store';
import {
  baseUrl,
  ticketing_baseUrl,
  accessKey,
  insert_ticket_details,
} from '../webApi/service';

// components
import Header from '../components/Common/Header';
import AnimatableLowerModal from '../components/Common/AnimatableLowerModal';
import PrimaryButton from '../components/Common/PrimaryButton';
import Section from '../components/Common/Section';
import CollapsableSection from '../components/Common/CollapsableSection';
import CommonModal from '../components/Common/CommonModal';

const CreateTicket = ({navigation, route}) => {
  const store = Store();
  const [subject, setSubject] = useState(''); // subject state
  const [description, setDescription] = useState(''); // description state
  const [picModal, setPicmodal] = useState(false); // picture modal state
  const [file, setFile] = useState({}); // file as base64

  useEffect(() => {
    const unSubscribe = navigation.addListener('focus', () => {
      console.log('Create Tickets Focused');
      BackHandler.addEventListener('hardwareBackPress', () => {
        console.log('BackHandler Create Tickets is called');
        navigation.goBack();
        return true;
      });
    });
    return unSubscribe;
  }, []);

  // picking image from gallery
  const uploadPic = async () => {
    console.log('', '\n======== UPLOAD PIC ========');

    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
      includeBase64: true,
    })
      .then(image => {
        setFile(image);
        setPicmodal(false);
      })
      .catch(error => {
        setPicmodal(false);
        showMessage({
          message: 'Alert!',
          description: 'You cancelled the image selection',
          type: 'info',
          floating: true,
          icon: 'auto',
        });
      });
  };

  // picking image from camera
  const clickPic = async () => {
    console.log('', '\n======== CLICK PIC ========');

    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
      includeBase64: true,
    })
      .then(image => {
        setFile(image);
        setPicmodal(false);
      })
      .catch(error => {
        setPicmodal(false);
        showMessage({
          message: 'Alert!',
          description: 'You cancelled the image clicking',
          type: 'info',
          floating: true,
          icon: 'auto',
        });
      });
  };

  //  create ticket
  const onPressCreateTicket = async () => {
    const payload = {
      accessKey,
      loginId: store?.userData?.userId,
      userId: store?.userData?.userId,
      projectIdValue: '9',
      subject,
      description,
      file: [file?.data],
      fileName: [file?.path?.substring(file?.path?.lastIndexOf('/') + 1)],
    };

    console.log(
      'CREATE TICKET :',
      ticketing_baseUrl + insert_ticket_details,
      payload,
    );

    !subject
      ? showMessage({
          message: 'Warning!',
          description: 'Please select a subject',
          type: 'warning',
          floating: true,
          icon: 'auto',
        })
      : !description
      ? showMessage({
          message: 'Warning!',
          description: 'Please select a description',
          type: 'warning',
          floating: true,
          icon: 'auto',
        })
      : await axios
          .post(ticketing_baseUrl + insert_ticket_details, payload)
          .then(res => {
            res?.data?.successCode === 1
              ? navigation?.navigate('Tickets')
              : showMessage({
                  message: 'Warning!',
                  description: `Can't create ticket right now`,
                  type: 'warning',
                  floating: true,
                  icon: 'auto',
                });
          })
          .catch(err => {
            console.log(`Error creating tickets`, err);
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
        title="CREATE TICKET"
        onPressLeft={() => navigation.goBack()}
      />

      <ScrollView
        style={{flex: 1}}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          alignItems: 'center',
          paddingBottom: SIZES.paddingHuge,
        }}>
        <Section // create ticket section
        // leftItem={}
        // rightItem={ }
        >
          <TextInput // subject input
            style={styles.input}
            placeholder="Subject*"
            placeholderTextColor={COLORS.gray}
            keyboardAppearance="dark"
            keyboardType="default"
            returnKeyType="done"
            color={COLORS.black}
            onChangeText={text => setSubject(text)}
            value={subject}
          />

          <TextInput // description input
            style={styles.input}
            placeholder="Description*"
            placeholderTextColor={COLORS.gray}
            keyboardAppearance="dark"
            keyboardType="default"
            returnKeyType="done"
            color={COLORS.black}
            onChangeText={text => setDescription(text)}
            value={description}
          />

          <PrimaryButton
            style={[styles.input, styles.dateBtn]}
            onPress={() => setPicmodal(true)}
            iconColor={COLORS.flatBlue}
            icon="calendar-range"
            textStyle={{
              color: COLORS.darkGray,
              fontSize: SIZES.fontSmall,
              fontFamily: FONTS.josefinSansRegular,
              flex: 1,
            }}
            name={
              file?.path?.substring(file?.path?.lastIndexOf('/') + 1)?.length >
              0
                ? file?.path?.substring(file?.path?.lastIndexOf('/') + 1)
                : 'Upload / Click File Image'
            }
          />

          <AnimatableLowerModal
            title="UPLOAD IMAGE FILE"
            isOpen={picModal}
            onClose={() => setPicmodal(false)}>
            <PrimaryButton // upload button
              onPress={() => uploadPic()}
              name="UPLOAD"
              style={{marginBottom: SIZES.paddingSmall}}
            />
            <PrimaryButton // click button
              onPress={() => clickPic()}
              name="CLICK"
              style={{marginBottom: SIZES.paddingMedium}}
            />
          </AnimatableLowerModal>
        </Section>

        <PrimaryButton
          icon="text-box-plus-outline"
          style={styles.primaryBtn}
          name="Create Ticket"
          onPress={onPressCreateTicket}
        />
      </ScrollView>
    </LinearGradient>
  );
};

export default CreateTicket;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: COLORS.antiFlashWhite,
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
  dateBtn: {
    justifyContent: 'flex-start',
    elevation: 0,
    shadowOpacity: 0,
  },
});
