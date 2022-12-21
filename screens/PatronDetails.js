import {
  StyleSheet,
  StatusBar,
  Image,
  Text,
  View,
  Pressable,
  ScrollView,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
  Linking,
  BackHandler,
  TextInput,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
import moment from 'moment';
import Geolocation from 'react-native-geolocation-service';
import Geocoder from 'react-native-geocoding';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {Dropdown} from 'react-native-element-dropdown';
import {Checkbox} from 'react-native-paper';
import ImagePicker from 'react-native-image-crop-picker';
import {showMessage} from 'react-native-flash-message';
import {COLORS, FONTS, SIZES, SHADOW, icons} from '../constants';
import {Store} from '../store/Store';
import {
  accessKey,
  baseUrl,
  get_patron_details,
  get_seva_sub_category_list,
  get_upgrade_seva_type,
  upgrade_seva_list,
  upgrade_patron,
  get_contact_details,
  get_patron_photo_list,
  upload_patron_photo,
  share_payment_link,
  get_seva_history,
  insert_patron_followup,
  get_patron_payment_details,
  get_other_payment_details,
  get_puja_detail,
  get_bahumana_details,
  get_seva_bahumana,
  add_update_patron_newsletter,
  get_relationship,
  get_occasion,
  insert_puja,
  update_puja,
  get_accommodation_details,
  update_inscription,
  update_patron_commentary,
  update_patron_address_location,
  get_patron_address,
  update_patron_address,
  get_patron_seva_details,
  GOOGLE_API_KEY,
} from '../webApi/service';

// components
import Header from '../components/Common/Header';
import AnimatableLowerModal from '../components/Common/AnimatableLowerModal';
import PrimaryButton from '../components/Common/PrimaryButton';
import Section from '../components/Common/Section';
import CollapsableSection from '../components/Common/CollapsableSection';
import CommonModal from '../components/Common/CommonModal';

Geocoder.init(GOOGLE_API_KEY);

const PatronDetails = ({navigation, route}) => {
  const store = Store();

  // basic details section states
  const [patronDetails, setPatronDetails] = useState({}); // patron details
  const [patronApiImage, setPatronApiImage] = useState(''); // patron image uri
  const [spouceApiImage, setSpouceApiImage] = useState(''); // spouce image

  // image related states
  const [uploadType, setUploadType] = useState(''); // upload type
  const [editDpModal, setEditDpModal] = useState(false); // edit patron dp modal
  const [ulImg, setUlImg] = useState(''); // base64 image to upload

  const [pmntLnkMdl, setPmntLnkMdl] = useState(false); // payment link share modal
  const [pmntLnkConTgl, setPmntLnkConTgl] = useState(false); // multiple contacts mode toggle fro payment link
  const [contactType, setContactType] = useState(''); // modal name // payment link send through mode state

  const [upgradeMdl, setUpgradeMdl] = useState(false); // patron upgrade modal state
  const [branches, setBranches] = useState([]); // branch list
  const [branch, setBranch] = useState(''); // selected branch
  const [sevaTypes, setSevaTypes] = useState([]); // seva type list
  const [sevaType, setSevaType] = useState(''); // selected seva type
  const [sevaNames, setSevaNames] = useState([]); // seva name list
  const [sevaName, setSevaName] = useState(''); // selected seva name

  const [reload, setReload] = useState(false); // reload page state

  // petronship details states
  const [ptrnshipOpn, setPtrnshipOpn] = useState(false); // patronship details open state
  const [sevaHistory, setSevaHistory] = useState([]); // seva history
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

  // contact section states
  const [contactOpn, setContactOpn] = useState(false); // contact section open
  const [addressTypes] = useState([
    {label: 'Residential', value: 'R'},
    {label: 'Office', value: 'O'},
  ]); // available address types
  const [mailingDetails, setMailingDetails] = useState({}); // mailing details

  // address tagging states
  const [tagModal, setTagModal] = useState(false); // address to tag modal
  const [tagAddress, setTagAddress] = useState(''); // address to tag
  const [mailingPref, setMailingPref] = useState('R'); // type of address to tag
  const [latitude, setLattitude] = useState(''); // latitude to tag
  const [longitude, setLongitude] = useState(''); // longitude to tag
  // navigation address states
  const [navigationMdl, setNavigationMdl] = useState(false); // tagged address modal
  const [navigationAddress, setNavigationAddress] = useState(''); // tagged addresses
  // update address states
  const [updateAddressMdl, setUpdateAddressMdl] = useState(false); // update address modal
  const [updateTyp, setUpdateTyp] = useState(''); // update address type
  const [address1, setAddress1] = useState(''); //update address line 1
  const [address2, setAddress2] = useState(''); //update address line 2
  const [address3, setAddress3] = useState(''); //update address line 3
  const [area, setArea] = useState(''); // update area
  const [city, setCity] = useState(''); // update city
  const [state, setState] = useState(''); // update state
  const [country, setCountry] = useState(''); // update country
  const [PIN, setPIN] = useState(''); // update pin
  const [updateMailingPref, setUpdateMailingPref] = useState(false); // update mailing preference

  // payment section states
  const [paymentListOpn, setPaymentListOpn] = useState(false); // payment list open
  const [paymentList, setPaymentList] = useState([]); // payment list
  const [paymentIndexLst, setPaymentIndexLst] = useState([]); // payment index list

  // other payment section section states
  const [otherPaymentListOpn, setOtherPaymentListOpn] = useState(false); // other payment list open
  const [otherPaymentList, setOtherPaymentList] = useState([]); // other payment list
  const [otherPaymentIndexLst, setOtherPaymentIndexLst] = useState([]); // other payment index list

  // bahumana & puja section states
  const [bahumanaDetails, setBahumanaDetails] = useState({}); // bahumana details (puja details)

  // bahumana section states
  const [bahumanaOpn, setBahumanaOpn] = useState(false); // bahumana open
  const [bahumanaFlgs, setBahumanaFlgs] = useState(''); // bahumana flags
  // newsletter section states
  const [selectedNewsLtr, setSelectedNewsLtr] = useState(''); // selected news letter
  const [newsletterTyp, setNewsletterTyp] = useState(''); // newsletter type
  const [editNewsletterOpn, setEditNewsletterOpn] = useState(false); // edit newsletter open
  // publication section states
  const [publication1OpnLst, setPublication1OpnLst] = useState([]); // publication 1 open list
  const [publication2OpnLst, setPublication2OpnLst] = useState([]); // publication 2 open list
  const [addEditPublicationOpn, setAddEditPublicationOpn] = useState(false); // edit publication open
  const [pubTyp, setPubTyp] = useState(''); // publication type
  const [selectedComSeq, setSelectedComSeq] = useState(''); // selected communication sequence
  const [selectedPub, setSelectedPub] = useState(''); // selected publication
  // seva section states
  const [sevaCardOpnLst, setSevaCardOpnLst] = useState([]); // seva card open list
  // increption section states
  const [increptionModal, setIncreptionModal] = useState(false); // increption modal
  const [increption, setIncreption] = useState(''); // increption
  const [incriptionAddress, setIncriptionAddress] = useState(''); // incription address
  const [increptionTyp, setIncreptionTyp] = useState(''); // increption type

  // puja dates section states
  const [pujaDatesOpn, setPujaDatesOpn] = useState(false); // puja dates open
  const [modalType, setModalType] = useState(''); // add or edit type modal state
  const [editPujaDtModal, setEditPujaDtModal] = useState(false); // edit puja dates modal
  const [attendedModal, setAttendedModal] = useState(false); // attended modal state
  const [months] = useState([
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
  const [selectedMonth, setSelectedMonth] = useState(''); // selected month
  const [selectedDay, setSelectedDay] = useState(''); // selected day
  const [availableOccasions, setAvailableOccasions] = useState([]); // available occasions
  const [moddedOccasion, setModdedOccasion] = useState(''); // modded occasion
  const [moddedName, setModdedName] = useState(''); // modded name
  const [availableRelations, setAvailableRelations] = useState([]); // available relations
  const [moddedRelation, setModdedRelation] = useState(''); // modded relation
  const [pujaSeq, setPujaSeq] = useState(''); // puja sequence

  // accommodation section states
  const [accommodationOpn, setAccommodationOpn] = useState(false); // accommodation open
  const [accommodationList, setAccommodationList] = useState([]); // accommodation list

  useEffect(() => {
    getPatronDetails();
    const unSubscribe = navigation.addListener('focus', () => {
      getMailingDetails();
      getPatronPaymentDetails();
      getOtherPaymentDetails();
      getBahumanadetails();
      getBahumanaflagsNewsletter();
      getRelationships();
      getOccasions();
      getAccommodationDetails();
      BackHandler.addEventListener('hardwareBackPress', () => {
        console.log('BackHandler In Patron Details is called');
        navigation.goBack();
        return true;
      });
    });
    return unSubscribe;
  }, [reload]);

  // get patron details
  const getPatronDetails = async () => {
    const payload = {
      accessKey,
      deviceId: store?.deviceId,
      loginId: store?.userData?.userId,
      sessionId: store?.userData?.session_id,
      patronId: route?.params?.patronId,
    };

    console.log('PATRON DETAILS :', baseUrl + get_patron_details, payload);

    await axios
      .post(baseUrl + get_patron_details, payload)
      .then(response => {
        setPatronDetails(response.data.patronDetails[0]);
        {
          response.data.patronDetails[0]?.photo &&
            setPatronApiImage(
              response.data.patronDetails[0]?.photo +
                '?time=' +
                new Date().getTime(),
            );
        }
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

  // get mailing  details
  const getMailingDetails = async () => {
    const payload = {
      accessKey,
      deviceId: store.deviceId,
      loginId: store.userData?.userId,
      sessionId: store.userData?.session_id,
      patronId: route.params?.patronId,
    };

    console.log('MAILING DETAILS :', baseUrl + get_contact_details, payload);

    await axios
      .post(baseUrl + get_contact_details, payload)
      .then(response => {
        setMailingDetails(response.data.contactDetails[0]);
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

  // picking image from gallery
  const uploadDp = async () => {
    console.log('', '\n======== UPLOAD DP ========');

    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
      includeBase64: true,
    })
      .then(image => {
        setUlImg(image);
      })
      .catch(error => {
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
  const clickDp = async () => {
    console.log('', '\n======== CLICK DP ========');

    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
      includeBase64: true,
    })
      .then(image => {
        setUlImg(image);
      })
      .catch(error => {
        showMessage({
          message: 'Alert!',
          description: 'You cancelled the image clicking',
          type: 'info',
          floating: true,
          icon: 'auto',
        });
      });
  };

  // upload patron image
  const savePatronDp = async () => {
    const payload = {
      accessKey,
      loginId: store.userData?.userId,
      sessionId: store.userData?.session_id,
      deviceId: store.deviceId,
      patronId: patronDetails?.patronId,
      photoType: uploadType,
      photo: ulImg.data,
      cropPhoto: ulImg.data,
    };

    console.log('SAVE PATRON DP :', baseUrl + upload_patron_photo, payload);

    await axios
      .post(baseUrl + upload_patron_photo, payload)
      .then(res => {
        console.log('Response: ', res.data);
        setEditDpModal(false);
        setUlImg('');
        setReload(!reload);
      })
      .catch(err => {
        setEditDpModal(false);
        setUlImg('');
        showMessage({
          message: 'Error!',
          description: 'Please check your internet connection',
          type: 'danger',
          floating: true,
          icon: 'auto',
        });
      });
  };

  // get patronship branch list
  const getPatronshipBranch = async () => {
    const payload = {
      accessKey,
      loginId: store.userData?.userId,
      sessionId: store.userData?.session_id,
      deviceId: store.deviceId,
      categoryId: '1',
    };

    console.log(
      'GET BRANCHES :',
      baseUrl + get_seva_sub_category_list,
      payload,
    );

    await axios
      .post(baseUrl + get_seva_sub_category_list, payload)
      .then(res => {
        res?.data?.successCode === 1
          ? (setBranches(res?.data?.data), setUpgradeMdl(true))
          : showMessage({
              message: 'Opps!',
              description: 'No categories available right now',
              type: 'warning',
              floating: true,
              icon: 'auto',
            });
      })
      .catch(err => {
        console.log('Error categories:', err);
        showMessage({
          message: 'Error!',
          description: 'Please check your internet connection',
          type: 'danger',
          floating: true,
          icon: 'auto',
        });
      });
  };

  // get upgrade sevas
  const getUpgradeSevaType = async id => {
    const payload = {
      accessKey,
      loginId: store.userData?.userId,
      sessionId: store.userData?.session_id,
      deviceId: store.deviceId,
      patronId: patronDetails?.patronId,
      purposeId: id,
      sevaType: patronDetails?.sevaType,
    };

    console.log(
      'GET SEVA TYPE LIST :',
      baseUrl + get_upgrade_seva_type,
      payload,
    );

    await axios
      .post(baseUrl + get_upgrade_seva_type, payload)
      .then(res => {
        res?.data?.successCode === 1
          ? (setSevaType(''), setSevaTypes(res?.data?.data))
          : (setSevaType(''),
            setSevaTypes([]),
            showMessage({
              message: 'Opps!',
              description: 'No seva types available right now for this purpose',
              type: 'warning',
              floating: true,
              icon: 'auto',
            }));
      })
      .catch(err => {
        console.log('Error seva types', err);
        setSevaTypes([]);
        showMessage({
          message: 'Error!',
          description: 'Please check your internet connection',
          type: 'danger',
          floating: true,
          icon: 'auto',
        });
      });
  };

  // get upgrade seva names
  const getUpgradeSevaNames = async type => {
    const payload = {
      accessKey,
      loginId: store.userData?.userId,
      sessionId: store.userData?.session_id,
      deviceId: store.deviceId,
      patronId: patronDetails?.patronId,
      sevaType: type,
      sevaCode: patronDetails?.registeredFor,
    };

    console.log('GET SEVA NAME LIST :', baseUrl + upgrade_seva_list, payload);

    await axios
      .post(baseUrl + upgrade_seva_list, payload)
      .then(res => {
        console.log(res?.data);
      })
      .catch(err => {
        console.log('Error seva names', err);
      });
  };

  // share payment link
  const sharePaymentLnk = async params => {
    const payload = {
      accessKey,
      loginId: store.userData?.userId,
      sessionId: store.userData?.session_id,
      deviceId: store.deviceId,
      patronId: patronDetails?.patronId,
      sendThrough:
        params?.type === 'W'
          ? 'whatsapp'
          : params?.type === 'E'
          ? 'email'
          : 'sms',
    };

    console.log('SHARE PAYMENT LINK :', baseUrl + share_payment_link, payload);

    await axios
      .post(baseUrl + share_payment_link, payload)
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
  };

  // get seva history
  const getSevaHistory = async () => {
    const payload = {
      accessKey,
      sessionId: store?.userData?.session_id,
      deviceId: store?.deviceId,
      loginId: store?.userData?.userId,
      patronId: patronDetails?.patronId,
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

  // submit follow up
  const submitFollowUp = async () => {
    const payload = {
      accessKey,
      sessionId: store?.userData?.session_id,
      deviceId: store?.deviceId,
      loginId: store?.userData?.userId,
      patronId: patronDetails?.patronId,
      followupOn: selectedFollowUpDate,
      remarks: remark,
      followupType: folloUpTyp,
      followupBy: store?.userData?.id,
    };

    console.log('SUBMIT FOLLOWUP:', baseUrl + insert_patron_followup, payload);

    await axios
      .post(baseUrl + insert_patron_followup, payload)
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
      })
      .catch(err => {
        showMessage({
          message: 'Error!',
          description: 'Please check your internet connection',
          type: 'danger',
          floating: true,
          icon: 'auto',
        });
      });
  };

  // get location lat long
  const getLocation = async () => {
    console.log('', '\n======== GET LOCATION ========');
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'This app needs access to your location',
          buttonNext: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the location');
        await Geolocation.getCurrentPosition(
          position => {
            // console.log('Latitude:', position.coords.latitude);
            // console.log('Longitude:', position.coords.longitude);
            const pos = [position.coords.latitude, position.coords.longitude];
            getLocName(pos);
          },
          error => {
            // See error code charts below.
            console.log(error.code, error.message);
          },
          {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
        );
      } else {
        console.log('Location permission denied');
      }
    }
  };

  // get location name
  const getLocName = async params => {
    console.log('Latitude:', params[0]);
    console.log('Longitude:', params[1]);
    await Geocoder.from(...params)
      .then(json => {
        const address = json.results[0]?.formatted_address;
        console.log(address);
        setTagAddress(address);
        setLattitude(params[0]);
        setLongitude(params[1]);
        setTagModal(true);
      })
      .catch(error => {
        console.warn(error),
          showMessage({
            message: 'Error!',
            description: 'Please check your internet connection',
            type: 'danger',
            floating: true,
            icon: 'auto',
          });
      });
  };

  // tag location
  const tagLoc = async () => {
    const payload = {
      accessKey,
      loginId: store.userData?.userId,
      sessionId: store.userData?.session_id,
      deviceId: store.deviceId,
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      location: tagAddress,
      mailingPref,
      patronId: patronDetails?.patronId,
    };

    console.log(
      'TAG PAYLOAD :',
      baseUrl + update_patron_address_location,
      payload,
    );
    await axios
      .post(baseUrl + update_patron_address_location, payload)
      .then(res => {
        setTagModal(false);
        showMessage({
          message: 'Success!',
          description: 'Address Tagged successfully',
          type: 'success',
          floating: true,
          icon: 'auto',
        });
      })
      .catch(err => {
        showMessage({
          message: 'Error!',
          description: 'Please check your internet connection',
          type: 'danger',
          floating: true,
          icon: 'auto',
        });
      });
  };

  // get navigation addresses
  const getNavAddresses = async params => {
    console.log('EDIT PREF', params);

    const payload = {
      accessKey,
      loginId: store.userData?.userId,
      sessionId: store.userData?.session_id,
      deviceId: store.deviceId,
      patronId: patronDetails?.patronId,
    };

    console.log('NAVIGATION PAYLOAD :', baseUrl + get_patron_address, payload);
    await axios
      .post(baseUrl + get_patron_address, payload)
      .then(res => {
        res.data.successCode === 1
          ? params?.length > 0
            ? (params === 'R' &&
                (setUpdateTyp('R'),
                setAddress1(res.data.contactDetails?.[0]?.resAddress1),
                setAddress2(res.data.contactDetails?.[0]?.resAddress2),
                setAddress3(res.data.contactDetails?.[0]?.resAddress3),
                setArea(res.data.contactDetails?.[0]?.resAddress3),
                setCity(res.data.contactDetails?.[0]?.resCity),
                setState(res.data.contactDetails?.[0]?.resState),
                setCountry(res.data.contactDetails?.[0]?.resCountry),
                setPIN(res.data.contactDetails?.[0]?.resPinCode),
                setUpdateAddressMdl(true)),
              params === 'O' &&
                (setUpdateTyp('O'),
                setAddress1(res.data.contactDetails?.[0]?.offAddress1),
                setAddress2(res.data.contactDetails?.[0]?.offAddress2),
                setAddress3(res.data.contactDetails?.[0]?.offAddress3),
                setArea(res.data.contactDetails?.[0]?.offAddress3),
                setCity(res.data.contactDetails?.[0]?.offCity),
                setState(res.data.contactDetails?.[0]?.offState),
                setCountry(res.data.contactDetails?.[0]?.offCountry),
                setPIN(res.data.contactDetails?.[0]?.offPinCode),
                setUpdateAddressMdl(true)))
            : (setNavigationAddress(res.data.contactDetails[0]),
              setNavigationMdl(true))
          : showMessage({
              message: 'Empty!',
              description: 'No tagged address found',
              type: 'info',
              floating: true,
              icon: 'auto',
            });
      })
      .catch(err => {
        showMessage({
          message: 'Error!',
          description: 'Please check your internet connection',
          type: 'danger',
          floating: true,
          icon: 'auto',
        });
      });
  };

  // open navigation
  const openNav = async params => {
    console.log(
      '',
      '\n======== OPEN NAV ========',
      '\nlongitude:',
      params.longitude,
      '\nlatitude:',
      params.latitude,
      '\nlocation:',
      params.location,
      '\n================================',
    );

    const scheme = Platform.select({ios: 'maps:0,0?q=', android: 'geo:0,0?q='});
    const latLng = `${params.latitude},${params.longitude}`;
    const label = params.location;
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
    });

    Linking.openURL(url);
    setNavigationMdl(false);
  };

  // update address
  const updateAddress = async () => {
    const payload = {
      accessKey,
      loginId: store.userData?.userId,
      sessionId: store.userData?.session_id,
      patronId: patronDetails?.patronId,
      mailingPref: updateMailingPref ? updateTyp : '',
      regAddress1: address1,
      regAddress2: address2,
      regAddress3: address3,
      regArea: area,
      regCity: city,
      regState: state,
      regCountry: country,
      regPincode: PIN,
      offAddress1: address1,
      offAddress2: address2,
      offAddress3: address3,
      offArea: area,
      offCity: city,
      offState: state,
      offCountry: country,
      offPincode: PIN,
      addressType: updateTyp,
    };

    console.log(
      'UPDATE ADDRESS PAYLOAD :',
      baseUrl + update_patron_address,
      payload,
    );

    await axios
      .post(baseUrl + update_patron_address, payload)
      .then(res => {
        res.data.successCode === 1
          ? (showMessage({
              message: 'Success!',
              description: 'Address updated successfully',
              type: 'success',
              floating: true,
              icon: 'auto',
            }),
            clearUpdateStates(),
            getMailingDetails())
          : (showMessage({
              message: 'Opps!',
              description: 'Something went wrong',
              type: 'danger',
              floating: true,
              icon: 'auto',
            }),
            clearUpdateStates());
      })
      .catch(err => {
        showMessage({
          message: 'Error!',
          description: 'Please check your internet connection',
          type: 'danger',
          floating: true,
          icon: 'auto',
        }),
          clearUpdateStates();
      });
  };

  // clear update address states
  const clearUpdateStates = () => {
    setUpdateAddressMdl(false);
    setUpdateMailingPref(false);
    setAddress1('');
    setAddress2('');
    setAddress3('');
    setArea('');
    setCity('');
    setState('');
    setCountry('');
    setPIN('');
  };

  // get patron payment details
  const getPatronPaymentDetails = async () => {
    const payload = {
      accessKey,
      deviceId: store.deviceId,
      loginId: store.userData?.userId,
      sessionId: store.userData?.session_id,
      patronId: route.params?.patronId,
    };

    console.log(
      'PATRON PAYMENT DETAILS :',
      baseUrl + get_patron_payment_details,
      payload,
    );

    await axios
      .post(baseUrl + get_patron_payment_details, payload)
      .then(response => {
        setPaymentList(response.data.paymentDetails);
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

  // get other payment details
  const getOtherPaymentDetails = async () => {
    const payload = {
      accessKey,
      deviceId: store.deviceId,
      loginId: store.userData?.userId,
      sessionId: store.userData?.session_id,
      patronId: route.params?.patronId,
    };

    console.log(
      'OTHER PAYMENT DETAILS :',
      baseUrl + get_other_payment_details,
      payload,
    );

    await axios
      .post(baseUrl + get_other_payment_details, payload)
      .then(response => {
        setOtherPaymentList(response.data.otherPaymentDetails);
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

  // get bahumana & puja details
  const getBahumanadetails = async () => {
    const payload = {
      accessKey,
      deviceId: store.deviceId,
      loginId: store.userData?.userId,
      sessionId: store.userData?.session_id,
      patronId: route.params?.patronId,
      sevaCode: route.params?.registeredFor,
    };

    console.log('BAHUMANA DETAILS :', baseUrl + get_bahumana_details, payload);

    await axios
      .post(baseUrl + get_bahumana_details, payload)
      .then(response => {
        setBahumanaDetails(response.data);
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

  // get bahumana flags & newsletters
  const getBahumanaflagsNewsletter = async () => {
    const payload = {
      accessKey,
      deviceId: store.deviceId,
      loginId: store.userData?.userId,
      sessionId: store.userData?.session_id,
      patronId: route.params?.patronId,
      sevaCode: route.params?.registeredFor,
    };

    console.log(
      'BAHUMANA FLAGS & NEWSLETTER :',
      baseUrl + get_seva_bahumana,
      payload,
    );

    await axios
      .post(baseUrl + get_seva_bahumana, payload)
      .then(response => {
        setBahumanaFlgs(response.data);
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

  // add update newsletter
  const addUpdateNewsletter = async () => {
    const payload = {
      accessKey,
      deviceId: store.deviceId,
      loginId: store.userData?.userId,
      sessionId: store.userData?.session_id,
      patronId: patronDetails?.patronId,
      newsletterId: selectedNewsLtr,
      tranType: newsletterTyp,
      createdBy: newsletterTyp === 'I' ? store.userData?.id : '',
      modifiedBy: newsletterTyp === 'U' ? store.userData?.id : '',
    };

    console.log(
      'ADD UPDATE NEWSLETTER :',
      baseUrl + add_update_patron_newsletter,
      payload,
    );

    await axios
      .post(baseUrl + add_update_patron_newsletter, payload)
      .then(response => {
        getBahumanadetails(),
          setEditNewsletterOpn(false),
          showMessage({
            message: 'Success!',
            description: 'Newsletter added successfully',
            type: 'success',
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
      });
  };

  // update publication
  const updatePublication = async () => {
    const payload = {
      accessKey,
      deviceId: store.deviceId,
      loginId: store.userData?.userId,
      sessionId: store.userData?.session_id,
      patronId: patronDetails?.patronId,
      commentaryId: selectedPub,
      comSequence: selectedComSeq,
      tranType: pubTyp,
      createdBy: pubTyp === 'I' ? store.userData?.id : '',
      modifiedBy: pubTyp === 'U' ? store.userData?.id : '',
    };

    console.log(
      'UPDATE PUBLICATION :',
      baseUrl + update_patron_commentary,
      payload,
    );

    await axios
      .post(baseUrl + update_patron_commentary, payload)
      .then(response => {
        getBahumanadetails(),
          setAddEditPublicationOpn(false),
          showMessage({
            message: 'Success!',
            description: 'Publication added successfully',
            type: 'success',
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
      });
  };

  // update wall increption
  const updateIncreption = async () => {
    const payload = {
      accessKey,
      deviceId: store.deviceId,
      loginId: store.userData?.userId,
      sessionId: store.userData?.session_id,
      patronId: patronDetails?.patronId,
      inscriptionName: increption,
      inscriptType: increptionTyp,
      patronLocation: incriptionAddress,
      createdBy: store.userData?.id,
    };

    console.log(
      'UPDATE WALL INCREPTION :',
      baseUrl + update_inscription,
      payload,
    );

    await axios
      .post(baseUrl + update_inscription, payload)
      .then(response => {
        getBahumanadetails(),
          setIncreptionModal(false),
          showMessage({
            message: 'Success!',
            description: 'Inscription added successfully',
            type: 'success',
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
      });
  };

  // get relationships
  const getRelationships = async () => {
    const payload = {
      accessKey,
      deviceId: store.deviceId,
      loginId: store.userData?.userId,
      sessionId: store.userData?.session_id,
    };

    console.log('GET RELATIONSHIPS :', baseUrl + get_relationship, payload);

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

  // update puja date
  const updatePujaDate = async () => {
    const payload = {
      accessKey,
      deviceId: store.deviceId,
      loginId: store.userData?.userId,
      sessionId: store.userData?.session_id,
      patronId: patronDetails?.patronId,
      sequence: pujaSeq,
      pujaDate: selectedDay + '-' + selectedMonth + '-2023',
      occassion: moddedOccasion === 'Select Occasion' ? '' : moddedOccasion,
      displayName: moddedName,
      relationship: moddedRelation === 'Select Relation' ? '' : moddedRelation,
    };

    console.log(
      'UPDATE PUJA DATE :',
      baseUrl + (modalType === 'ADD' ? insert_puja : update_puja),
      payload,
    );

    await axios
      .post(
        baseUrl + (modalType === 'ADD' ? insert_puja : update_puja),
        payload,
      )
      .then(response => {
        getBahumanadetails();
        setEditPujaDtModal(false);
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

  // get accommodation details
  const getAccommodationDetails = async () => {
    const payload = {
      accessKey,
      deviceId: store.deviceId,
      loginId: store.userData?.userId,
      sessionId: store.userData?.session_id,
      patronId: route.params?.patronId,
    };

    console.log(
      'GET ACCOMMODATION DETAILS :',
      baseUrl + get_accommodation_details,
      payload,
    );

    await axios
      .post(baseUrl + get_accommodation_details, payload)
      .then(response => {
        setAccommodationList(response.data.accommodationDetails);
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

  // create receipt
  const createReceipt = async () => {
    const payload = {
      accessKey,
      deviceId: store.deviceId,
      loginId: store.userData?.userId,
      sessionId: store.userData?.session_id,
      patronId: route.params?.patronId,
      preacherCode: store.userData?.id,
    };
    console.log(
      'GET PATRON SEVA DETAILS',
      baseUrl + get_patron_seva_details,
      payload,
    );

    await axios
      .post(baseUrl + get_patron_seva_details, payload)
      .then(res => {
        if (res?.data?.successCode === 1) {
          const {sevaDates, purpose, ...compactItem} = res?.data?.data?.[0];
          store?.setRouteInfo({
            ...compactItem,
            categoryCode: 'CD',
            categoryId: '1',
            categoryName: 'Patronship Seva',
            purposeTitle: res?.data?.data?.[0].purpose,
            patronId: patronDetails?.patronId,
          });
          navigation.navigate('DonorSelection', {from: 'PTDL'});
        } else
          showMessage({
            message: 'Opps!',
            description: 'Something went wrong while fetching patronship data',
            type: 'warning',
            floating: true,
            icon: 'auto',
          });
      })
      .catch(err => {
        console.log(
          'Error getting patron seva details for create receipt',
          err,
        );
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
        title="PATRON DETAILS"
        onPressLeft={() => navigation.goBack()}
      />

      {/* SCROLLABLE CARD CONTAINER */}

      <ScrollView
        style={{flex: 1}}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{alignItems: 'center'}}>
        {/* BASIC DETAILS CARD  */}

        <Section
          name={`${patronDetails?.salutation ? patronDetails?.salutation : ''}${
            patronDetails?.salutation && patronDetails?.name ? ' ' : ''
          }${patronDetails?.name ? patronDetails?.name : ''}`}>
          {/* PATRON ID & SEVA SECTION */}

          <View
            style={[
              styles.valCont1,
              {justifyContent: 'center', paddingVertical: SIZES.paddingMedium},
            ]}>
            <Text // patron id
              style={[
                styles.primaryTxt,
                {fontFamily: FONTS.josefinSansRegular},
              ]}>
              {patronDetails?.patronId}
            </Text>
            <Text style={[styles.primaryTxt, {marginLeft: SIZES.paddingSmall}]}>
              {patronDetails.sevaType
                ? patronDetails.sevaType.replace(/\s/g, '') !== '' &&
                  `${patronDetails?.sevaType}`
                : ''}
            </Text>
          </View>

          {/* PROFILE PICTURE SECTION */}

          <View // profile picture section
            style={styles.dpSec}>
            <TouchableOpacity // edit patron profile picture button
              style={{alignItems: 'center'}}
              activeOpacity={1}
              onPress={() => {
                setEditDpModal(true);
                setUploadType('P');
              }}>
              <Image // patron profile picture
                style={styles.dp}
                resizeMode="cover"
                source={
                  !patronApiImage ||
                  patronApiImage.split('?')[0] ===
                    'http://104.41.133.33/dhananjayaphotos/patron/blank.jpg'
                    ? icons.avatar
                    : {uri: patronApiImage}
                }
              />
              <MaterialCommunityIcons // edit profile picture icon
                name="camera"
                size={25}
                color={COLORS.flatBlue + 90}
                style={{bottom: SIZES.height * 0.015}}
              />
            </TouchableOpacity>

            {spouceApiImage !== '' && (
              <TouchableOpacity
                style={{
                  alignItems: 'center',
                }}
                activeOpacity={1}
                onPress={() => {
                  setEditDpModal(true);
                  setUploadType('S');
                }}>
                <Image // spouce profile picture
                  style={styles.dp}
                  resizeMode="cover"
                  source={
                    !spouceApiImage ||
                    spouceApiImage?.split('?')[0] ===
                      'http://104.41.133.33/dhananjayaphotos/patron/blank.jpg'
                      ? icons.avatar
                      : {uri: spouceApiImage}
                  }
                />
                <MaterialCommunityIcons // edit profile picture icon
                  name="camera"
                  size={25}
                  color={COLORS.flatBlue + 90}
                  style={{bottom: SIZES.height * 0.015}}
                />
              </TouchableOpacity>
            )}
          </View>

          {spouceApiImage === '' && (
            <TouchableOpacity // add spouce profile picture button
              onPress={() => {
                setEditDpModal(true);
                setUploadType('S');
              }}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                alignSelf: 'center',
                backgroundColor: COLORS.flatBlue + 90,
                padding: SIZES.paddingSmall,
                borderRadius: SIZES.radiusSmall,
                marginVertical: SIZES.paddingSmall,
              }}>
              <MaterialCommunityIcons // add spouce profile picture icon
                name="camera"
                size={20}
                color={COLORS.white}
              />
              <Text // add spouce profile picture text
                style={{
                  fontSize: SIZES.fontExtraSmall,
                  color: COLORS.white,
                  fontWeight: '800',
                  marginLeft: SIZES.paddingSmall,
                }}>
                SPOUCE
              </Text>
            </TouchableOpacity>
          )}

          {/* CHANGE DP MODAL */}

          <AnimatableLowerModal
            title={`${uploadType === 'P' ? 'PATRON' : 'SPOUCE'} PHOTO`}
            isOpen={editDpModal}
            onClose={() => {
              setEditDpModal(false), setUlImg('');
            }}>
            {/* PATRON PICTURE SECTION */}

            {((uploadType === 'P' && ulImg.path) ||
              (uploadType === 'P' &&
                patronApiImage &&
                !(
                  patronApiImage?.split('?')[0] ===
                  'http://104.41.133.33/dhananjayaphotos/patron/blank.jpg'
                ))) && (
              <View // review dp outer frame
                style={styles.reviewDpOtF}>
                <View // review dp inner frame
                  style={styles.reviewDpInF}>
                  <Image // review dp
                    style={styles.reviewDp}
                    resizeMode="cover"
                    source={{
                      uri: ulImg.path ? ulImg.path : patronApiImage,
                    }}
                  />
                </View>
              </View>
            )}

            {/* SPOUCE PICTURE SECTION */}

            {((uploadType === 'S' && ulImg.path) ||
              (uploadType === 'S' &&
                spouceApiImage &&
                !(
                  spouceApiImage?.split('?')[0] ===
                  'http://104.41.133.33/dhananjayaphotos/patron/blank.jpg'
                ))) && (
              <View // review dp outer frame
                style={styles.reviewDpOtF}>
                <View // review dp inner frame
                  style={styles.reviewDpInF}>
                  <Image // review dp
                    style={styles.reviewDp}
                    resizeMode="cover"
                    source={{
                      uri: ulImg.path ? ulImg.path : spouceApiImage,
                    }}
                  />
                </View>
              </View>
            )}

            <PrimaryButton // upload button
              onPress={() => uploadDp()}
              name="UPLOAD"
              style={{marginBottom: SIZES.paddingSmall}}
            />
            <PrimaryButton // click button
              onPress={() => clickDp()}
              name="CLICK"
              style={{marginBottom: SIZES.paddingMedium}}
            />
            <PrimaryButton // Save button
              onPress={() => savePatronDp()}
              name="SAVE"
              disabled={!ulImg}
              style={{
                marginBottom: SIZES.paddingSmall,
                backgroundColor: ulImg ? COLORS.saveEnabled : COLORS.lightGray,
                elevation: ulImg ? SHADOW.elevation : 0,
                shadowOpacity: ulImg ? SHADOW.shadowOpacity : 0,
              }}
            />
          </AnimatableLowerModal>

          <View // separator
            style={styles.separator}
          />

          {/* BUTTON SECTION */}

          <View style={styles.lowerBtnCont}>
            <TouchableOpacity // payment link button
              onPress={() => setPmntLnkMdl(true)}
              style={styles.lowerBtn}>
              <MaterialCommunityIcons // payment button
                name="credit-card"
                size={25}
                color={COLORS.primary}
              />
            </TouchableOpacity>
            <TouchableOpacity // upgrade button
              onPress={getPatronshipBranch}
              style={styles.lowerBtn}>
              <MaterialCommunityIcons // upgrade icon
                name="stairs-up"
                size={25}
                color={COLORS.warning}
              />
            </TouchableOpacity>
            <TouchableOpacity // comment button
              onPress={() =>
                navigation.navigate('Comment', patronDetails?.patronId)
              }
              style={styles.lowerBtn}>
              <MaterialCommunityIcons // comment icon
                name="comment-text"
                size={25}
                color={COLORS.flatBlue}
              />
            </TouchableOpacity>
          </View>

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
                    mailingDetails?.mobileNos?.split(':').length > 0
                      ? mailingDetails?.mobileNos?.split(':').length > 1
                        ? (setContactType('W'), setPmntLnkConTgl(true))
                        : sharePaymentLnk({
                            type: 'W',
                            contact: mailingDetails?.mobileNos,
                          })
                      : showMessage({
                          message: 'Warning!',
                          description:
                            'No number available to send payment link',
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
                    style={[
                      styles.clkValueTxt,
                      {flex: 0, color: COLORS.white},
                    ]}>
                    WhatsApp
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity // message button
                  onPress={() =>
                    mailingDetails?.mobileNos?.split(':').length > 0
                      ? mailingDetails?.mobileNos?.split(':').length > 1
                        ? (setContactType('M'), setPmntLnkConTgl(true))
                        : sharePaymentLnk({
                            type: 'M',
                            contact: mailingDetails?.mobileNos,
                          })
                      : showMessage({
                          message: 'Warning!',
                          description:
                            'No number available to send payment link',
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
                    style={[
                      styles.clkValueTxt,
                      {flex: 0, color: COLORS.white},
                    ]}>
                    SMS
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity // email button
                  onPress={() =>
                    mailingDetails?.mobileNos?.split(':').length > 0
                      ? mailingDetails?.mobileNos?.split(':').length > 1
                        ? (setContactType('E'), setPmntLnkConTgl(true))
                        : sharePaymentLnk({
                            type: 'E',
                            contact: mailingDetails?.emailIds,
                          })
                      : showMessage({
                          message: 'Warning!',
                          description:
                            'No email available to send payment link',
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
                    style={[
                      styles.clkValueTxt,
                      {flex: 0, color: COLORS.white},
                    ]}>
                    Email
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                {(contactType === 'W' || contactType === 'M'
                  ? mailingDetails?.mobileNos
                  : mailingDetails?.emailIds
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
                      onPress={() =>
                        sharePaymentLnk({type: contactType, contact})
                      }
                    />
                  ))}
              </>
            )}
          </AnimatableLowerModal>

          {/* UPGRADE MODAL */}

          <CommonModal
            title="UPGRADE PATRON"
            isOpen={upgradeMdl}
            onClose={() => setUpgradeMdl(false)}>
            <Dropdown // branch dropdown
              placeholder="Select Occasion"
              style={styles.dropStyle}
              placeholderStyle={styles.dropPlaceholder}
              selectedTextStyle={styles.dropSelectedTxt}
              containerStyle={styles.dropContainer}
              fontFamily={FONTS.josefinSansRegular}
              data={branches?.map(branch => ({
                value: branch.purposeId,
                label: branch.purposeTitle,
              }))}
              value={branch}
              labelField="label"
              valueField="value"
              renderItem={item => (
                <Text style={styles.dropText}>{item.label}</Text>
              )}
              onChange={item => {
                getUpgradeSevaType(item.value), setBranch(item.value);
              }}
            />

            {sevaTypes?.length > 0 && (
              <Dropdown // seva type dropdown
                placeholder="Select Occasion"
                style={styles.dropStyle}
                placeholderStyle={styles.dropPlaceholder}
                selectedTextStyle={styles.dropSelectedTxt}
                containerStyle={styles.dropContainer}
                fontFamily={FONTS.josefinSansRegular}
                data={sevaTypes?.map(branch => ({
                  value: branch.typeId,
                  label: `${branch.typeDesc} ${
                    Number(branch.sevaAmount?.replace(/,/g, ''))
                      ?.toLocaleString('en-IN', {
                        maximumFractionDigits: 2,
                        style: 'currency',
                        currency: 'INR',
                      })
                      ?.split('.')[0]
                  }`,
                }))}
                value={sevaType}
                labelField="label"
                valueField="value"
                renderItem={item => (
                  <Text style={styles.dropText}>{item.label}</Text>
                )}
                onChange={item => {
                  setSevaType(item.value);
                  getUpgradeSevaNames(item.value);
                }}
              />
            )}

            {/* {sevaNames?.length > 0 && (
              <Dropdown // seva name dropdown
                placeholder="Select Occasion"
                style={styles.dropStyle}
                placeholderStyle={styles.dropPlaceholder}
                selectedTextStyle={styles.dropSelectedTxt}
                containerStyle={styles.dropContainer}
                fontFamily={FONTS.josefinSansRegular}
                data={sevaNames?.map(branch => ({
                  value: branch.typeId,
                  label: `${branch.typeDesc} ₹ ${branch.sevaAmount}`,
                }))}
                value={sevaType}
                labelField="label"
                valueField="value"
                renderItem={item => (
                  <Text style={styles.dropText}>{item.label}</Text>
                )}
                onChange={item => {
                  setSevaName(item.value);
                }}
              />
            )} */}
          </CommonModal>
        </Section>

        {/* PATRONSHIP INFORMATION CARD */}

        <CollapsableSection
          name="PATRONSHIP DETAILS"
          setOpen={setPtrnshipOpn}
          open={ptrnshipOpn}
          rightItem={
            <>
              <TouchableOpacity // add location button
                onPress={() => getSevaHistory()}>
                <MaterialCommunityIcons // add location icon
                  name="history"
                  size={25}
                  color={COLORS.flatBlue}
                />
              </TouchableOpacity>
              <TouchableOpacity // add follow up button
                onPress={() => setFollowUpMdl(true)}
                style={{marginLeft: SIZES.paddingSmall}}>
                <MaterialCommunityIcons // add follow up icon
                  name="account-clock"
                  size={25}
                  color={COLORS.flatBlue}
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
                        style={styles.valCont3}>
                        <Text // enrollment / upgrade / redefine identifier
                          style={styles.identifierTxt}>
                          {item?.enrlmntType === 'N'
                            ? 'Enrolled on:'
                            : item?.enrlmntType === 'R'
                            ? 'Redefined on:'
                            : 'Upgraded on:'}
                        </Text>
                        <Text // enrollment / upgrade / redefine value
                          style={[styles.valueTxt, {flex: 1.5}]}>
                          {item?.enrldDate?.replace(/-/g, ' ')}
                        </Text>
                      </View>
                      <View // seva container
                        style={styles.valCont3}>
                        <Text // seva identifier
                          style={styles.identifierTxt}>
                          For
                        </Text>
                        <Text // seva value
                          style={[styles.valueTxt, {flex: 1.5}]}>
                          {item?.sevaCode}
                        </Text>
                      </View>
                      <View // preacher container
                        style={[
                          styles.valCont3,
                          {marginVertical: SIZES.paddingSmall},
                        ]}>
                        <Text // preacher identifier
                          style={styles.identifierTxt}>
                          By
                        </Text>
                        <Text // preacher value
                          style={[styles.valueTxt, {flex: 1.5}]}>
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

              {/* MODAL TO ADD FOLLOW UP */}

              <CommonModal
                title="FOLLOW WITH PATRON"
                isOpen={followUpMdl}
                onClose={() => {
                  setFollowUpMdl(false),
                    setFolloUpTyp('Call'),
                    setSelectedFollowUpDate(''),
                    setFollowUpDate(new Date()),
                    setRemark('');
                }}>
                <View // followup type selector container
                  style={{
                    flexDirection: 'row',
                    marginBottom: SIZES.paddingMedium,
                  }}>
                  <Dropdown // followup type selector
                    placeholder="Donation Category"
                    style={[styles.dropStyle, {flex: 0.7, marginBottom: 0}]}
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
                    style={[
                      styles.valCont1,
                      {
                        marginTop: 0,
                        alignItems: 'center',
                        paddingHorizontal: SIZES.paddingSmall,
                      },
                    ]}
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
                          : 'DD-MMM-YYYY'}
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
                      folloUpTyp && selectedFollowUpDate
                        ? SHADOW.shadowOpacity
                        : 0,
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
            </>
          }>
          <>
            <View // patronship payment attribute tuple
              style={styles.detailsSection}>
              <Text style={[styles.identifierTxt, {textAlign: 'center'}]}>
                COMMITED
              </Text>

              <Text style={[styles.identifierTxt, styles.valueTxtEx]}>
                PAID
              </Text>

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
                  Number(patronDetails?.commitedAmount?.replace(/,/g, ''))
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
                  Number(patronDetails?.paidAmount?.replace(/,/g, ''))
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
                  Number(patronDetails?.balanceAmount?.replace(/,/g, ''))
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

          {patronDetails?.lastPaidAmount?.replace(/ /g, '')?.length > 0 && (
            <>
              <View // separator
                style={styles.separator}
              />
              <View // last paid raiser section
                style={styles.detailsSection}>
                <Text // last paid raiser identifier
                  style={styles.identifierTxt}>
                  Last Paid:
                </Text>
                <Text // last paid raiser value
                  style={[styles.valueTxt, {flex: 1.5}]}>
                  ₹ {patronDetails?.lastPaidAmount}
                </Text>
              </View>
            </>
          )}

          {patronDetails?.lastPaidDate?.replace(/ /g, '')?.length > 0 && (
            <>
              <View // separator
                style={styles.separator}
              />
              <View // last paid raiser section
                style={styles.detailsSection}>
                <Text // last paid raiser identifier
                  style={styles.identifierTxt}>
                  Last Paid on:
                </Text>
                <Text // last paid raiser value
                  style={[styles.valueTxt, {flex: 1.5}]}>
                  {moment(patronDetails?.lastPaidDate, 'DD-MMM-YYYY').format(
                    'DD/MM/YYYY',
                  )}
                </Text>
              </View>
            </>
          )}

          {patronDetails?.waivedOff?.replace(/ /g, '')?.length > 0 && (
            <>
              <View // separator
                style={styles.separator}
              />

              <View // phone number container
                style={styles.detailsSection}>
                <Text //  phone number identifier
                  style={styles.identifierTxt}>
                  Waived Off:
                </Text>

                <Text // phone number
                  style={[styles.valueTxt, {flex: 1.5}]}>
                  {
                    Number(patronDetails?.waivedOff?.replace(/,/g, ''))
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
          )}

          {patronDetails?.enrolledPreacher?.replace(/ /g, '')?.length > 0 && (
            <>
              <View // separator
                style={styles.separator}
              />

              <View // phone number container
                style={styles.detailsSection}>
                <Text //  phone number identifier
                  style={styles.identifierTxt}>
                  Enrolled By:
                </Text>

                <Text // phone number
                  style={[styles.valueTxt, {flex: 1.5}]}>
                  {patronDetails?.enrolledPreacher}
                </Text>
              </View>
            </>
          )}

          {patronDetails?.allocatedPreacher?.replace(/ /g, '')?.length > 0 && (
            <>
              <View // separator
                style={styles.separator}
              />

              <View // phone number container
                style={styles.detailsSection}>
                <Text //  phone number identifier
                  style={styles.identifierTxt}>
                  Allocated To:
                </Text>

                <Text // phone number
                  style={[styles.valueTxt, {flex: 1.5}]}>
                  {patronDetails?.allocatedPreacher}
                </Text>
              </View>
            </>
          )}

          {patronDetails?.currentPreacher?.replace(/ /g, '')?.length > 0 && (
            <>
              <View // separator
                style={styles.separator}
              />

              <View // phone number container
                style={styles.detailsSection}>
                <Text //  phone number identifier
                  style={styles.identifierTxt}>
                  Current Fund Raiser:
                </Text>

                <Text // phone number
                  style={[styles.valueTxt, {flex: 1.5}]}>
                  {patronDetails?.currentPreacher}
                </Text>
              </View>
            </>
          )}

          {patronDetails?.registeredFor?.replace(/ /g, '')?.length > 0 && (
            <>
              <View // separator
                style={styles.separator}
              />

              <View // phone number container
                style={styles.detailsSection}>
                <Text //  phone number identifier
                  style={styles.identifierTxt}>
                  Registered For:
                </Text>

                <Text // phone number
                  style={[styles.valueTxt, {flex: 1.5}]}>
                  {patronDetails?.registeredFor}
                </Text>
              </View>
            </>
          )}

          {patronDetails?.registeredBy?.replace(/ /g, '')?.length > 0 && (
            <>
              <View // separator
                style={styles.separator}
              />

              <View // phone number container
                style={styles.detailsSection}>
                <Text //  phone number identifier
                  style={styles.identifierTxt}>
                  Registered By:
                </Text>

                <Text // phone number
                  style={[styles.valueTxt, {flex: 1.5}]}>
                  {patronDetails?.registeredBy}
                </Text>
              </View>
            </>
          )}

          {patronDetails?.occupation?.replace(/ /g, '')?.length > 0 && (
            <>
              <View // separator
                style={styles.separator}
              />

              <View // phone number container
                style={styles.detailsSection}>
                <Text //  phone number identifier
                  style={styles.identifierTxt}>
                  Occupation:
                </Text>

                <Text // phone number
                  style={[styles.valueTxt, {flex: 1.5}]}>
                  {patronDetails?.occupation}
                </Text>
              </View>
            </>
          )}

          {patronDetails?.spouseName?.replace(/ /g, '')?.length > 0 && (
            <>
              <View // separator
                style={styles.separator}
              />

              <View // phone number container
                style={styles.detailsSection}>
                <Text //  phone number identifier
                  style={styles.identifierTxt}>
                  Spouce:
                </Text>

                <Text // phone number
                  style={[styles.valueTxt, {flex: 1.5}]}>
                  {patronDetails?.spouseName}
                </Text>
              </View>
            </>
          )}

          {patronDetails?.dateOfBirth?.replace(/ /g, '')?.length > 0 && (
            <>
              <View // separator
                style={styles.separator}
              />

              <View // phone number container
                style={styles.detailsSection}>
                <Text //  phone number identifier
                  style={styles.identifierTxt}>
                  Date of Birth:
                </Text>

                <Text // phone number
                  style={[styles.valueTxt, {flex: 1.5}]}>
                  {patronDetails?.dateOfBirth?.replace(/-/g, ' ')}
                </Text>
              </View>
            </>
          )}
        </CollapsableSection>

        {/* CONTACT LOCATION CARD */}

        <CollapsableSection
          setOpen={setContactOpn}
          open={contactOpn}
          name="CONTACT & LOCATION"
          rightItem={
            <>
              <TouchableOpacity // add location button
                onPress={getLocation}>
                <MaterialCommunityIcons // add location icon
                  name="map-marker-plus"
                  size={25}
                  color={COLORS.flatBlue}
                />
              </TouchableOpacity>
              <TouchableOpacity // open tagged address button
                onPress={() => getNavAddresses()}
                style={{marginLeft: SIZES.paddingSmall}}>
                <MaterialCommunityIcons // open tagged address icon
                  name="navigation-variant"
                  size={25}
                  color={COLORS.flatBlue}
                />
              </TouchableOpacity>

              {/* TAG ADDRESS MODAL */}

              <CommonModal
                title="TAG ADDRESS"
                isOpen={tagModal}
                onClose={() => setTagModal(false)}>
                <Dropdown // address type dropdown
                  placeholder="Address Type"
                  style={[styles.dropStyle, {width: SIZES.width * 0.4}]}
                  placeholderStyle={styles.dropPlaceholder}
                  selectedTextStyle={styles.dropSelectedTxt}
                  containerStyle={styles.dropContainer}
                  fontFamily={FONTS.josefinSansRegular}
                  data={addressTypes}
                  value={mailingPref}
                  labelField="label"
                  valueField="value"
                  renderItem={item => (
                    <Text style={styles.dropText}>{item.label}</Text>
                  )}
                  onChange={item => setMailingPref(item.value)}
                />

                <TextInput // address to tag input
                  editable={false}
                  style={[
                    styles.input,
                    {height: SIZES.height * 0.1, textAlignVertical: 'top'},
                  ]}
                  placeholderTextColor={COLORS.gray}
                  placeholder="Enter address"
                  keyboardAppearance="dark"
                  keyboardType="default"
                  returnKeyType="done"
                  value={tagAddress}
                  multiline={true}
                  onChangeText={text => setTagAddress(text)}
                />

                <PrimaryButton // increption save button
                  disabled={!(tagAddress.length > 0 && mailingPref)}
                  name="TAG"
                  icon="tag-outline"
                  style={{
                    width: '100%',
                    backgroundColor:
                      tagAddress.length > 0 && mailingPref
                        ? COLORS.saveEnabled
                        : COLORS.lightGray,
                    elevation:
                      tagAddress.length > 0 && mailingPref
                        ? SHADOW.elevation
                        : 0,
                    shadowOpacity:
                      tagAddress.length > 0 && mailingPref
                        ? SHADOW.shadowOpacity
                        : 0,
                  }}
                  onPress={() => tagLoc()}
                />
              </CommonModal>

              {/* TAGGED ADDRESS / NAVIGATON MODAL */}

              <CommonModal
                title="NAVIGATE TO ADDRESS"
                isOpen={navigationMdl}
                onClose={() => setNavigationMdl(false)}>
                {
                  // open navigation button for tagged office address
                  navigationAddress?.offLocation?.length > 0 &&
                    navigationAddress?.offLatitude?.length > 0 &&
                    navigationAddress?.offLongitude?.length > 0 && (
                      <TouchableOpacity // open navigation button
                        onPress={() =>
                          openNav({
                            location: navigationAddress?.offLocation,
                            latitude: navigationAddress?.offLatitude,
                            longitude: navigationAddress?.offLongitude,
                          })
                        }
                        style={styles.opnNavBtn}>
                        <Text // tagged office address
                          style={styles.navBtnTxt}>
                          Official : {navigationAddress?.offLocation}
                        </Text>
                      </TouchableOpacity>
                    )
                }

                {
                  // open navigation button for tagged residential address
                  navigationAddress?.regLocation?.length > 0 &&
                    navigationAddress?.regLatitude?.length > 0 &&
                    navigationAddress?.regLongitude?.length > 0 && (
                      <TouchableOpacity // open navigation button
                        onPress={() =>
                          openNav({
                            location: navigationAddress?.regLocation,
                            latitude: navigationAddress?.regLatitude,
                            longitude: navigationAddress?.regLongitude,
                          })
                        }
                        style={[styles.opnNavBtn, {marginBottom: 0}]}>
                        <Text // tagged residential address
                          style={styles.navBtnTxt}>
                          Residential : {navigationAddress?.regLocation}
                        </Text>
                      </TouchableOpacity>
                    )
                }
              </CommonModal>
            </>
          }>
          <View // mailing address container
            style={styles.detailsSection}>
            <View // identifier and address container
              style={{flex: 6}}>
              <Text //  mailing address identifier
                style={styles.identifierTxt}>
                {`Mailing Address ${
                  mailingDetails?.mailingPreference === 'R'
                    ? '(Residential)'
                    : mailingDetails?.mailingPreference === 'O'
                    ? '(Official)'
                    : ''
                } :`}
              </Text>
              <Text // mailing address
                style={styles.valueTxt}>
                {mailingDetails?.mailingPreference === 'R'
                  ? mailingDetails?.resedenceAddress
                    ? mailingDetails?.resedenceAddress
                    : 'N/A'
                  : mailingDetails?.mailingPreference === 'O'
                  ? mailingDetails?.officeAddress
                    ? mailingDetails?.officeAddress
                    : 'N/A'
                  : 'N/A'}
              </Text>
            </View>
            <View // buttons container
              style={{flex: 1, alignItems: 'flex-end'}}>
              <TouchableOpacity // edit mailing address button
                onPress={() =>
                  getNavAddresses(mailingDetails?.mailingPreference)
                }>
                <MaterialCommunityIcons // edit mailing address icon
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

          <View // alternate address container
            style={styles.detailsSection}>
            <View // identifier and address container
              style={{flex: 6}}>
              <Text // alternate address identifier
                style={styles.identifierTxt}>
                {`Alternate Address ${
                  mailingDetails?.mailingPreference === 'R'
                    ? '(Official)'
                    : mailingDetails?.mailingPreference === 'O'
                    ? '(Residential)'
                    : ''
                } :`}
              </Text>
              <Text // alternate address
                style={styles.valueTxt}>
                {mailingDetails?.mailingPreference === 'R'
                  ? mailingDetails?.officeAddress
                    ? mailingDetails?.officeAddress
                    : 'N/A'
                  : mailingDetails?.mailingPreference === 'O'
                  ? mailingDetails?.resedenceAddress
                    ? mailingDetails?.resedenceAddress
                    : 'N/A'
                  : 'N/A'}
              </Text>
            </View>
            <View // buttons container
              style={{flex: 1, alignItems: 'flex-end'}}>
              <TouchableOpacity // edit alternate address button
                onPress={() =>
                  getNavAddresses(
                    mailingDetails?.mailingPreference === 'R' ? 'O' : 'R',
                  )
                }>
                <MaterialCommunityIcons // edit alternate address icon
                  name="pencil"
                  size={25}
                  color={COLORS.flatBlue}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* UPDATE ADDRESS MODAL */}

          <CommonModal
            title={`UPDATE ${
              updateTyp === 'R' ? 'RESIDENTIAL' : 'OFFICE'
            } ADDRESS`}
            // {`UPDATE  ADDRESS`}
            isOpen={updateAddressMdl}
            onClose={() => clearUpdateStates()}>
            <ScrollView style={{height: SIZES.height * 0.7}}>
              <TextInput // address line 1 input
                style={styles.input}
                placeholderTextColor={COLORS.gray}
                placeholder="Address Line 1"
                keyboardAppearance="dark"
                keyboardType="default"
                returnKeyType="done"
                value={address1}
                onChangeText={text => setAddress1(text)}
              />
              <TextInput // address line 2 input
                style={styles.input}
                placeholderTextColor={COLORS.gray}
                placeholder="Address Line 2"
                keyboardAppearance="dark"
                keyboardType="default"
                returnKeyType="done"
                value={address2}
                onChangeText={text => setAddress2(text)}
              />

              <TextInput // address line 3 input
                style={styles.input}
                placeholderTextColor={COLORS.gray}
                placeholder="Address Line 3"
                keyboardAppearance="dark"
                keyboardType="default"
                returnKeyType="done"
                value={address3}
                onChangeText={text => setAddress3(text)}
              />

              <TextInput // area input
                style={styles.input}
                placeholderTextColor={COLORS.gray}
                placeholder="Area"
                keyboardAppearance="dark"
                keyboardType="default"
                returnKeyType="done"
                value={area}
                onChangeText={text => setArea(text)}
              />

              <TextInput // city input
                style={styles.input}
                placeholderTextColor={COLORS.gray}
                placeholder="City"
                keyboardAppearance="dark"
                keyboardType="default"
                returnKeyType="done"
                value={city}
                onChangeText={text => setCity(text)}
              />

              <TextInput // state input
                style={styles.input}
                placeholderTextColor={COLORS.gray}
                placeholder="State"
                keyboardAppearance="dark"
                keyboardType="default"
                returnKeyType="done"
                value={state}
                onChangeText={text => setState(text)}
              />

              <TextInput // country input
                style={styles.input}
                placeholderTextColor={COLORS.gray}
                placeholder="Country"
                keyboardAppearance="dark"
                keyboardType="default"
                returnKeyType="done"
                value={country}
                onChangeText={text => setCountry(text)}
              />

              <TextInput // pin input
                style={styles.input}
                placeholderTextColor={COLORS.gray}
                placeholder="PIN"
                keyboardAppearance="dark"
                keyboardType="number-pad"
                returnKeyType="done"
                value={PIN}
                maxLength={7}
                onChangeText={text => setPIN(text)}
              />

              <TouchableOpacity // included patronship payment button
                activeOpacity={1}
                onPress={() => setUpdateMailingPref(!updateMailingPref)}
                style={{
                  flexDirection: 'row',
                  marginBottom: SIZES.paddingMedium,
                }}>
                <Checkbox // included patronship payment checkbox
                  status={updateMailingPref ? 'checked' : 'unchecked'}
                />
                <Text // included patronship payment text
                  style={styles.dropText}>
                  Preffer as mailing address
                </Text>
              </TouchableOpacity>

              <PrimaryButton // tag location button
                disabled={
                  !(
                    address1 ||
                    address2 ||
                    address3 ||
                    area ||
                    city ||
                    state ||
                    country ||
                    PIN
                  )
                }
                name="UPDATE"
                icon="content-save-outline"
                style={{
                  width: '100%',
                  backgroundColor:
                    address1 ||
                    address2 ||
                    address3 ||
                    area ||
                    city ||
                    state ||
                    country ||
                    PIN
                      ? COLORS.saveEnabled
                      : COLORS.lightGray,
                  elevation:
                    address1 ||
                    address2 ||
                    address3 ||
                    area ||
                    city ||
                    state ||
                    country ||
                    PIN
                      ? SHADOW.elevation
                      : 0,
                  shadowOpacity:
                    address1 ||
                    address2 ||
                    address3 ||
                    area ||
                    city ||
                    state ||
                    country ||
                    PIN
                      ? SHADOW.shadowOpacity
                      : 0,
                }}
                onPress={() => updateAddress()}
              />
            </ScrollView>
          </CommonModal>

          <View // separator
            style={styles.separator}
          />

          <View // phone number container
            style={styles.detailsSection}>
            <Text //  phone number identifier
              style={styles.identifierTxt}>
              Mobile:
            </Text>

            <View // mobile number container
              style={{flex: 2.5}}>
              {mailingDetails?.mobileNos ? ( // if mobile number exists
                mailingDetails?.mobileNos?.split(':').length > 1 ? ( // in case of multiple mobile numbers
                  mailingDetails?.mobileNos
                    ?.split(':')
                    ?.map((mobileNo, index) => (
                      <TouchableOpacity // phone number action button
                        key={index}
                        onPress={() => Linking.openURL(`tel:${mobileNo}`)}>
                        <Text // phone number
                          style={styles.clkValueTxt}>
                          {mobileNo}
                        </Text>
                      </TouchableOpacity>
                    )) // in case of single mobile number
                ) : (
                  <TouchableOpacity // phone number action button
                    onPress={() =>
                      Linking.openURL(`tel:${mailingDetails?.mobileNos}`)
                    }>
                    <Text // phone number
                      style={styles.clkValueTxt}>
                      {mailingDetails?.mobileNos}
                    </Text>
                  </TouchableOpacity>
                )
              ) : (
                // if mobile number does not exist
                <Text style={styles.valueTxt}>N/A</Text>
              )}
            </View>
          </View>

          <View // separator
            style={styles.separator}
          />

          <View // email container
            style={styles.detailsSection}>
            <Text //  email identifier
              style={styles.identifierTxt}>
              Email:
            </Text>

            <View // email container
              style={{flex: 2.5}}>
              {mailingDetails?.emailIds ? ( // if email is present
                mailingDetails?.emailIds?.split(':').length > 1 ? ( // in case of multiple email ids
                  mailingDetails?.emailIds?.split(':')?.map((email, index) => (
                    <TouchableOpacity // email id action button
                      key={index}
                      onPress={() => Linking.openURL(`mailto:${email}`)}>
                      <Text // email ids
                        style={styles.clkValueTxt}>
                        {email}
                      </Text>
                    </TouchableOpacity>
                  ))
                ) : (
                  // in case of single email id
                  <TouchableOpacity // email id action button
                    onPress={() =>
                      Linking.openURL(`mailto:${mailingDetails?.emailIds}`)
                    }>
                    <Text // email id
                      style={styles.clkValueTxt}>
                      {mailingDetails?.emailIds}
                    </Text>
                  </TouchableOpacity>
                )
              ) : (
                // if email is not present
                <Text style={styles.valueTxt}>N/A</Text>
              )}
            </View>
          </View>
        </CollapsableSection>

        {/* PATRONSSHIP PAYMENT LIST CARD */}

        <CollapsableSection
          name="PATRONSHIP PAYMENT"
          setOpen={setPaymentListOpn}
          open={paymentListOpn}>
          {paymentList?.map((payment, index) => (
            <Pressable // payment container
              key={index}
              onPress={() => {
                setPaymentIndexLst(
                  paymentIndexLst?.includes(index)
                    ? paymentIndexLst?.filter(item => item !== index)
                    : paymentIndexLst.concat(index),
                );
              }}
              style={{width: '100%'}}>
              <View // payment section
                style={styles.detailsSection}>
                <Text style={[styles.clkValueTxt, {flex: 0.9}]}>
                  {payment?.drDt}
                </Text>
                <Text style={styles.clkValueTxt}>{payment?.sevaCode}</Text>
                <Text style={[styles.clkValueTxt, {flex: 0.2}]}>
                  {payment?.paymentStatus}
                </Text>
                <Text
                  style={[styles.clkValueTxt, {flex: 0.7, textAlign: 'right'}]}>
                  {payment?.amount}
                </Text>
              </View>

              {paymentIndexLst?.includes(index) && (
                <View // each payment details section
                  style={styles.expandableSubSec}>
                  <View // dr number & payment mode section
                    style={{flexDirection: 'row'}}>
                    <View // dr number section
                      style={styles.valCont1}>
                      <Text // dr number identifier
                        style={[styles.identifierTxt, styles.identifierTxtEx]}>
                        DR Number:
                      </Text>
                      <Text // dr number value
                        style={styles.valueTxt}>
                        {payment?.drNo}
                      </Text>
                    </View>
                    <View // payment mode section
                      style={styles.valCont2}>
                      <Text // payment mode identifier
                        style={[styles.identifierTxt, styles.identifierTxtEx]}>
                        Type:
                      </Text>
                      <Text // payment mode value
                        style={styles.valueTxt}>
                        {payment?.paymentMode}
                      </Text>
                    </View>
                  </View>

                  <View // instrument number and date section
                    style={{flexDirection: 'row'}}>
                    <View // instrument number section
                      style={styles.valCont1}>
                      <Text // instrument number identifier
                        style={[styles.identifierTxt, styles.identifierTxtEx]}>
                        Ins No:
                      </Text>
                      <Text // instrument number value
                        style={styles.valueTxt}>
                        {payment?.insNo}
                      </Text>
                    </View>

                    <View // instrument date section
                      style={styles.valCont2}>
                      <Text // instrument date identifier
                        style={[styles.identifierTxt, styles.identifierTxtEx]}>
                        On:
                      </Text>
                      <Text // instrument date value
                        style={styles.valueTxt}>
                        {payment?.insDate}
                      </Text>
                    </View>
                  </View>

                  <View // preacher & payment status section
                    style={{flexDirection: 'row'}}>
                    <View // preacher section
                      style={styles.valCont1}>
                      <Text // preacher identifier
                        style={[styles.identifierTxt, styles.identifierTxtEx]}>
                        Preacher:
                      </Text>
                      <Text // preacher value
                        style={styles.valueTxt}>
                        {payment?.preacher}
                      </Text>
                    </View>
                    <View // payment status section
                      style={styles.valCont2}>
                      <Text // payment status identifier
                        style={[styles.identifierTxt, styles.identifierTxtEx]}>
                        Status:
                      </Text>
                      <Text // payment status value
                        style={styles.valueTxt}>
                        {payment?.paymentStatus}
                      </Text>
                    </View>
                  </View>
                  <View // seva section
                    style={{flexDirection: 'row'}}>
                    <Text // seva identifier
                      style={[styles.identifierTxt, styles.identifierTxtEx]}>
                      Seva Name:
                    </Text>
                    <Text // seva value
                      style={styles.valueTxt}>
                      {payment?.sevaName
                        .split(' ')
                        .map(
                          word =>
                            word.charAt(0).toUpperCase() +
                            word.slice(1).toLowerCase(),
                        )
                        .join(' ')}
                    </Text>
                  </View>
                </View>
              )}

              {index !== paymentList?.length - 1 &&
                !paymentIndexLst?.includes(index) && (
                  <View // separator
                    style={styles.separator}
                  />
                )}
            </Pressable>
          ))}
        </CollapsableSection>

        {/* OTHER PAYMENT LIST CARD */}

        <CollapsableSection
          name="OTHER PAYMENT"
          setOpen={setOtherPaymentListOpn}
          open={otherPaymentListOpn}>
          {otherPaymentList?.map((payment, index) => (
            <Pressable // payment container
              key={index}
              onPress={() => {
                setOtherPaymentIndexLst(
                  otherPaymentIndexLst?.includes(index)
                    ? otherPaymentIndexLst?.filter(item => item !== index)
                    : otherPaymentIndexLst.concat(index),
                );
              }}
              style={{width: '100%'}}>
              <View // payment section
                style={styles.detailsSection}>
                <Text style={[styles.clkValueTxt, {flex: 0.9}]}>
                  {payment?.drDt}
                </Text>
                <Text style={styles.clkValueTxt}>{payment?.sevaCode}</Text>
                <Text style={[styles.clkValueTxt, {flex: 0.2}]}>
                  {payment?.paymentStatus}
                </Text>
                <Text
                  style={[styles.clkValueTxt, {flex: 0.7, textAlign: 'right'}]}>
                  {payment?.amount}
                </Text>
              </View>

              {otherPaymentIndexLst?.includes(index) && (
                <View // each payment details section
                  style={styles.expandableSubSec}>
                  <View // dr number & payment mode section
                    style={{flexDirection: 'row'}}>
                    <View // dr number section
                      style={styles.valCont1}>
                      <Text // dr number identifier
                        style={[styles.identifierTxt, styles.identifierTxtEx]}>
                        DR Number:
                      </Text>
                      <Text // dr number value
                        style={styles.valueTxt}>
                        {payment?.drNo}
                      </Text>
                    </View>
                    <View // payment mode section
                      style={styles.valCont2}>
                      <Text // payment mode identifier
                        style={[styles.identifierTxt, styles.identifierTxtEx]}>
                        Type:
                      </Text>
                      <Text // payment mode value
                        style={styles.valueTxt}>
                        {payment?.paymentMode}
                      </Text>
                    </View>
                  </View>

                  <View // instrument number and date section
                    style={{flexDirection: 'row'}}>
                    <View // instrument number section
                      style={styles.valCont1}>
                      <Text // instrument number identifier
                        style={[styles.identifierTxt, styles.identifierTxtEx]}>
                        Ins No:
                      </Text>
                      <Text // instrument number value
                        style={styles.valueTxt}>
                        {payment?.insNo}
                      </Text>
                    </View>

                    <View // instrument date section
                      style={styles.valCont2}>
                      <Text // instrument date identifier
                        style={[styles.identifierTxt, styles.identifierTxtEx]}>
                        On:
                      </Text>
                      <Text // instrument date value
                        style={styles.valueTxt}>
                        {payment?.insDate}
                      </Text>
                    </View>
                  </View>

                  <View // preacher & payment status section
                    style={{flexDirection: 'row'}}>
                    <View // preacher section
                      style={styles.valCont1}>
                      <Text // preacher identifier
                        style={[styles.identifierTxt, styles.identifierTxtEx]}>
                        Preacher:
                      </Text>
                      <Text // preacher value
                        style={styles.valueTxt}>
                        {payment?.preacher}
                      </Text>
                    </View>
                    <View // payment status section
                      style={styles.valCont2}>
                      <Text // payment status identifier
                        style={[styles.identifierTxt, styles.identifierTxtEx]}>
                        Status:
                      </Text>
                      <Text // payment status value
                        style={styles.valueTxt}>
                        {payment?.paymentStatus}
                      </Text>
                    </View>
                  </View>
                  <View // seva section
                    style={{flexDirection: 'row'}}>
                    <Text // seva identifier
                      style={[styles.identifierTxt, styles.identifierTxtEx]}>
                      Seva Name:
                    </Text>
                    <Text // seva value
                      style={styles.valueTxt}>
                      {payment?.sevaName
                        .split(' ')
                        .map(
                          word =>
                            word.charAt(0).toUpperCase() +
                            word.slice(1).toLowerCase(),
                        )
                        .join(' ')}
                    </Text>
                  </View>
                </View>
              )}

              {index !== otherPaymentList?.length - 1 &&
                !otherPaymentIndexLst?.includes(index) && (
                  <View // separator
                    style={styles.separator}
                  />
                )}
            </Pressable>
          ))}
        </CollapsableSection>

        {/* BAHUMANA CARD */}

        <CollapsableSection
          name="BAHUMANA"
          setOpen={setBahumanaOpn}
          open={bahumanaOpn}>
          <>
            {
              // newsletter section
              bahumanaDetails?.newsletterDetails?.length > 0 &&
                bahumanaDetails?.newsletterDetails?.map((newsletter, index) => (
                  <View // newsletter & separator container
                    key={index}
                    style={{width: '100%'}}>
                    <View // newsletter container
                      style={[styles.detailsSection, {alignItems: 'center'}]}>
                      <Text // newsletter identifier
                        style={styles.identifierTxt}>
                        Newsletter:
                      </Text>
                      <Text // newsletter value
                        style={[styles.valueTxt, {flex: 1.5}]}>
                        {newsletter?.nltrName}
                      </Text>
                      <View // newsletter edit buttons container
                        style={{flex: 0.5, alignItems: 'flex-end'}}>
                        {/* EDIT NEWSLETTER BUTTON */}

                        {bahumanaFlgs?.nltr === 'Y' && (
                          <TouchableOpacity // edit newsletter button
                            onPress={() => {
                              setNewsletterTyp('U'),
                                setSelectedNewsLtr(
                                  newsletter?.nltrId ? newsletter?.nltrId : '',
                                ),
                                setEditNewsletterOpn(true);
                            }}>
                            <MaterialCommunityIcons // edit newsletter icon
                              name="pencil"
                              size={25}
                              color={COLORS.flatBlue}
                            />
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                    {(bahumanaDetails?.publication1Details?.length > 0 ||
                      bahumanaDetails?.publication2Details?.length > 0 ||
                      bahumanaDetails?.sevaCardDetails?.length > 0 ||
                      bahumanaDetails?.inscriptionDetails?.length > 0) && (
                      <View // separator
                        style={styles.separator}
                      />
                    )}
                  </View>
                ))
            }

            {/* EDIT NEWSLETTER MODAL */}

            <CommonModal
              title="EDIT NEWSLETTER"
              isOpen={editNewsletterOpn}
              onClose={() => setEditNewsletterOpn(false)}>
              <Dropdown // occasion dropdown
                placeholder="Select Occasion"
                style={styles.dropStyle}
                placeholderStyle={styles.dropPlaceholder}
                selectedTextStyle={styles.dropSelectedTxt}
                containerStyle={styles.dropContainer}
                fontFamily={FONTS.josefinSansRegular}
                data={bahumanaFlgs?.newsletterTypes?.map(newsLetter => ({
                  value: newsLetter.nltrId,
                  label: newsLetter.nltrName,
                }))}
                value={selectedNewsLtr}
                labelField="label"
                valueField="value"
                renderItem={item => (
                  <Text style={styles.dropText}>{item.label}</Text>
                )}
                onChange={item => setSelectedNewsLtr(item.value)}
              />

              <PrimaryButton // submit button
                disabled={!selectedNewsLtr}
                name="SUBMIT"
                icon="check"
                style={{
                  width: '100%',
                  backgroundColor: selectedNewsLtr
                    ? COLORS.saveEnabled
                    : COLORS.lightGray,
                  elevation: selectedNewsLtr ? SHADOW.elevation : 0,
                  shadowOpacity: selectedNewsLtr ? 0.25 : 0,
                }}
                onPress={() => addUpdateNewsletter()}
              />
            </CommonModal>
            {
              // publication 1 section
              bahumanaDetails?.publication1Details?.length > 0
                ? bahumanaDetails?.publication1Details?.map(
                    (publication, index) => (
                      <Pressable // publication 1 & separator container
                        key={index}
                        onPress={() =>
                          setPublication1OpnLst(
                            publication1OpnLst?.includes(index)
                              ? publication1OpnLst?.filter(
                                  item => item !== index,
                                )
                              : publication1OpnLst?.concat(index),
                          )
                        }
                        style={{width: '100%'}}>
                        <View // publication 1 container
                          style={[
                            styles.detailsSection,
                            {alignItems: 'center'},
                          ]}>
                          <Text // publication 1 identifier
                            style={styles.identifierTxt}>
                            Publication 1:
                          </Text>
                          <Text // publication 1 value
                            style={[styles.valueTxt, {flex: 1.5}]}>
                            {publication?.bahumanaName}
                          </Text>
                          <View // publication 1 edit buttons container
                            style={{flex: 0.5, alignItems: 'flex-end'}}>
                            {publication?.issueId?.replace(/ /g, '')?.length ===
                              0 && (
                              <TouchableOpacity // edit publication 1 button
                                onPress={() => {
                                  setSelectedComSeq(publication?.comSeq),
                                    setSelectedPub(publication?.bahumanaCode),
                                    setPubTyp('U'),
                                    setAddEditPublicationOpn(true);
                                }}>
                                <MaterialCommunityIcons // edit publication 1 icon
                                  name="pencil"
                                  size={25}
                                  color={COLORS.flatBlue}
                                />
                              </TouchableOpacity>
                            )}
                          </View>
                        </View>
                        {
                          // more details section for each publication 1
                          publication1OpnLst?.includes(index) && (
                            <View // each publication 1 more details container
                              style={styles.expandableSubSec}>
                              <View style={{flexDirection: 'row'}}>
                                <Text // each publication 1 collected by identifier & value
                                  style={styles.clkValueTxt}>
                                  {publication?.dlvDetails}
                                </Text>

                                <View // each publication 1 collection date
                                  style={{flex: 1, flexDirection: 'row'}}>
                                  <Text // each publication 1 collection date identifier
                                    style={[
                                      styles.identifierTxt,
                                      styles.identifierTxtEx,
                                    ]}>
                                    On:
                                  </Text>
                                  <Text // each publication 1 collection date value
                                    style={styles.valueTxt}>
                                    {publication?.dlvDate}
                                  </Text>
                                </View>
                              </View>
                            </View>
                          )
                        }
                        {(bahumanaDetails?.publication2Details?.length > 0 ||
                          bahumanaDetails?.sevaCardDetails?.length > 0 ||
                          bahumanaDetails?.inscriptionDetails?.length > 0) &&
                          !publication1OpnLst?.includes(index) && (
                            <View // separator
                              style={styles.separator}
                            />
                          )}
                      </Pressable>
                    ),
                  )
                : bahumanaFlgs?.com1 === 'Y' && (
                    <>
                      <View // publication 1 container
                        style={[styles.detailsSection, {alignItems: 'center'}]}>
                        <Text // publication 1 identifier
                          style={styles.identifierTxt}>
                          Publication 1:
                        </Text>

                        <View // publication 1 edit buttons container
                          style={{flex: 2, alignItems: 'flex-end'}}>
                          <TouchableOpacity // edit publication 1 button
                            onPress={() => {
                              setSelectedComSeq('1'),
                                setSelectedPub(''),
                                setPubTyp('I'),
                                setAddEditPublicationOpn(true);
                            }}>
                            <MaterialCommunityIcons // add publication 1 icon
                              name="plus"
                              size={25}
                              color={COLORS.flatBlue}
                            />
                          </TouchableOpacity>
                        </View>
                      </View>
                      {(bahumanaDetails?.publication2Details?.length > 0 ||
                        bahumanaDetails?.sevaCardDetails?.length > 0 ||
                        bahumanaDetails?.inscriptionDetails?.length > 0) && (
                        <View // separator
                          style={styles.separator}
                        />
                      )}
                    </>
                  )
            }
            {
              // publication 2 section
              bahumanaDetails?.publication2Details?.length > 0
                ? bahumanaDetails?.publication2Details?.map(
                    (publication, index) => (
                      <Pressable // publication 2 & separator container
                        key={index}
                        onPress={() =>
                          setPublication2OpnLst(
                            publication2OpnLst?.includes(index)
                              ? publication2OpnLst?.filter(
                                  item => item !== index,
                                )
                              : publication2OpnLst?.concat(index),
                          )
                        }
                        style={{width: '100%'}}>
                        <View // publication 2 container
                          style={[
                            styles.detailsSection,
                            {alignItems: 'center'},
                          ]}>
                          <Text // publication 2 identifier
                            style={styles.identifierTxt}>
                            Publication 2:
                          </Text>
                          <Text // publication 2 value
                            style={[styles.valueTxt, {flex: 1.5}]}>
                            {publication?.bahumanaName}
                          </Text>
                          <View // publication 2 edit buttons container
                            style={{flex: 0.5, alignItems: 'flex-end'}}>
                            {publication?.issueId?.replace(/ /g, '')?.length ===
                              0 && (
                              <TouchableOpacity // edit publication 2 button
                                onPress={() => {
                                  setSelectedComSeq(publication?.comSeq),
                                    setSelectedPub(publication?.bahumanaCode),
                                    setPubTyp('U'),
                                    setAddEditPublicationOpn(true);
                                }}>
                                <MaterialCommunityIcons // edit publication 2 icon
                                  name="pencil"
                                  size={25}
                                  color={COLORS.flatBlue}
                                />
                              </TouchableOpacity>
                            )}
                          </View>
                        </View>
                        {
                          // more details section for each publication 2
                          publication2OpnLst?.includes(index) && (
                            <View // each publication 2 more details container
                              style={styles.expandableSubSec}>
                              <View style={{flexDirection: 'row'}}>
                                <Text // each publication 2 collected by identifier & value
                                  style={styles.clkValueTxt}>
                                  {publication?.dlvDetails}
                                </Text>

                                <View // each publication 2 collection date
                                  style={{flex: 1, flexDirection: 'row'}}>
                                  <Text // each publication 2 collection date identifier
                                    style={[
                                      styles.identifierTxt,
                                      styles.identifierTxtEx,
                                    ]}>
                                    On:
                                  </Text>
                                  <Text // each publication 2 collection date value
                                    style={styles.valueTxt}>
                                    {publication?.dlvDate}
                                  </Text>
                                </View>
                              </View>
                            </View>
                          )
                        }
                        {(bahumanaDetails?.sevaCardDetails?.length > 0 ||
                          bahumanaDetails?.inscriptionDetails?.length > 0) &&
                          !publication2OpnLst?.includes(index) && (
                            <View // separator
                              style={styles.separator}
                            />
                          )}
                      </Pressable>
                    ),
                  )
                : bahumanaFlgs?.com2 === 'Y' && (
                    <>
                      <View // publication 2 container
                        style={[styles.detailsSection, {alignItems: 'center'}]}>
                        <Text // publication 2 identifier
                          style={styles.identifierTxt}>
                          Publication 2:
                        </Text>

                        <View // publication 2 edit buttons container
                          style={{flex: 2, alignItems: 'flex-end'}}>
                          <TouchableOpacity // edit publication 2 button
                            onPress={() => {
                              setSelectedComSeq('2'),
                                setSelectedPub(''),
                                setPubTyp('I'),
                                setAddEditPublicationOpn(true);
                            }}>
                            <MaterialCommunityIcons // add publication 2 icon
                              name="plus"
                              size={25}
                              color={COLORS.flatBlue}
                            />
                          </TouchableOpacity>
                        </View>
                      </View>
                      {(bahumanaDetails?.sevaCardDetails?.length > 0 ||
                        bahumanaDetails?.inscriptionDetails?.length > 0) && (
                        <View // separator
                          style={styles.separator}
                        />
                      )}
                    </>
                  )
            }

            {/* PUBLICATION MODAL */}

            <CommonModal
              title="EDIT PUBLICATION"
              isOpen={addEditPublicationOpn}
              onClose={() => setAddEditPublicationOpn(false)}>
              <Dropdown // publication type dropdown
                placeholder="Select Occasion"
                style={styles.dropStyle}
                placeholderStyle={styles.dropPlaceholder}
                selectedTextStyle={styles.dropSelectedTxt}
                containerStyle={styles.dropContainer}
                fontFamily={FONTS.josefinSansRegular}
                data={
                  selectedComSeq === '1'
                    ? bahumanaFlgs?.com1Details?.map((bahumana, index) => ({
                        value: bahumana?.comId,
                        label: bahumana?.comName,
                      }))
                    : selectedComSeq === '2'
                    ? bahumanaFlgs?.com2Details?.map((bahumana, index) => ({
                        value: bahumana?.comId,
                        label: bahumana?.comName,
                      }))
                    : []
                }
                value={selectedPub}
                labelField="label"
                valueField="value"
                renderItem={item => (
                  <Text style={styles.dropText}>{item.label}</Text>
                )}
                onChange={item => {
                  console.log('Selected Publication Typ:', item.value),
                    setSelectedPub(item.value);
                }}
              />

              <PrimaryButton // submit button
                disabled={!selectedPub}
                name="SUBMIT"
                icon="check"
                style={{
                  width: '100%',
                  backgroundColor: selectedPub
                    ? COLORS.saveEnabled
                    : COLORS.lightGray,
                  elevation: selectedPub ? SHADOW.elevation : 0,
                  shadowOpacity: selectedPub ? SHADOW.shadowOpacity : 0,
                }}
                onPress={() => updatePublication()}
              />
            </CommonModal>

            {
              // seva card section
              bahumanaDetails?.sevaCardDetails?.length > 0 &&
                bahumanaDetails?.sevaCardDetails?.map((sevaCard, index) => (
                  <Pressable // seva card & separator container
                    key={index}
                    onPress={() =>
                      setSevaCardOpnLst(
                        sevaCardOpnLst?.includes(index)
                          ? sevaCardOpnLst?.filter(item => item !== index)
                          : sevaCardOpnLst?.concat(index),
                      )
                    }
                    style={{width: '100%'}}>
                    <View // seva card container
                      style={[styles.detailsSection, {alignItems: 'center'}]}>
                      <Text // seva card identifier
                        style={styles.identifierTxt}>
                        Seva Card:
                      </Text>
                      <Text // seva card value
                        style={[styles.valueTxt, {flex: 2}]}>
                        {sevaCard?.cardCode}
                      </Text>
                    </View>
                    {
                      // more details section for each seva card
                      sevaCardOpnLst?.includes(index) && (
                        <View // seva more details container
                          style={styles.expandableSubSec}>
                          <View style={{flexDirection: 'row'}}>
                            <Text // seva collected by identifier & value
                              style={styles.clkValueTxt}>
                              {sevaCard?.dlvDetails}
                            </Text>

                            <View // seva collection date
                              style={{flex: 1, flexDirection: 'row'}}>
                              <Text // seva collection date identifier
                                style={[
                                  styles.identifierTxt,
                                  styles.identifierTxtEx,
                                ]}>
                                On:
                              </Text>
                              <Text // seva collection date value
                                style={styles.valueTxt}>
                                {sevaCard?.dlvDate}
                              </Text>
                            </View>
                          </View>
                        </View>
                      )
                    }
                    {bahumanaDetails?.inscriptionDetails?.length > 0 &&
                      !sevaCardOpnLst?.includes(index) && (
                        <View // separator
                          style={styles.separator}
                        />
                      )}
                  </Pressable>
                ))
            }
            {
              // increption section
              bahumanaDetails?.inscriptionDetails?.length > 0 &&
                bahumanaDetails?.inscriptionDetails?.map(
                  (inscription, index) => (
                    <View // increption container
                      key={index}
                      style={[
                        styles.detailsSection,
                        {flexDirection: 'column'},
                      ]}>
                      <Text // increption identifier
                        style={styles.identifierTxt}>
                        Wall Inscription:
                      </Text>
                      <View // increption value & edit buttons container
                        style={{flexDirection: 'row'}}>
                        <Text // increption card value
                          style={[styles.valueTxt, {flex: 2.5}]}>
                          {inscription?.inscriptionName}
                        </Text>
                        <View // increption edit buttons container
                          style={{flex: 0.5, alignItems: 'flex-end'}}>
                          <TouchableOpacity // edit increption button
                            onPress={() => {
                              setIncreptionTyp('U'),
                                setIncreption(inscription?.inscriptionName),
                                setIncreptionModal(true);
                            }}>
                            <MaterialCommunityIcons // edit increption icon
                              name="pencil"
                              size={25}
                              color={COLORS.flatBlue}
                            />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  ),
                )
            }

            {/* INCREPTION MODAL */}

            <CommonModal
              title="EDIT INCREPTION"
              isOpen={increptionModal}
              onClose={() => setIncreptionModal(false)}>
              <TextInput // increption input
                style={styles.input}
                placeholderTextColor={COLORS.gray}
                maxLength={35}
                placeholder="Enter name"
                keyboardAppearance="dark"
                keyboardType="default"
                returnKeyType="done"
                color={COLORS.black}
                value={increption}
                onChangeText={text => setIncreption(text)}
              />
              <TextInput // location input
                style={styles.input}
                placeholderTextColor={COLORS.gray}
                maxLength={15}
                placeholder="Enter location"
                keyboardAppearance="dark"
                keyboardType="default"
                returnKeyType="done"
                color={COLORS.black}
                value={incriptionAddress}
                onChangeText={text => setIncriptionAddress(text)}
              />
              <PrimaryButton // increption save button
                disabled={!(increption.length > 0)}
                name="SUBMIT"
                icon="check"
                style={{
                  width: '100%',
                  backgroundColor:
                    increption.length > 0
                      ? COLORS.saveEnabled
                      : COLORS.lightGray,
                  elevation: increption.length > 0 ? SHADOW.elevation : 0,
                  shadowOpacity:
                    increption.length > 0 ? SHADOW.shadowOpacity : 0,
                }}
                onPress={() => updateIncreption()}
              />
            </CommonModal>
          </>
        </CollapsableSection>

        {/* PUJA DATES CARD */}

        <CollapsableSection
          name="PUJA DATES"
          setOpen={setPujaDatesOpn}
          open={pujaDatesOpn}
          rightItem={
            <>
              <View style={{flexDirection: 'row'}}>
                {bahumanaDetails?.pujaDates?.length <
                  Number(bahumanaDetails?.pujaCount) && (
                  <TouchableOpacity // add puja date button
                    style={{marginRight: SIZES.paddingSmall}}
                    onPress={() => {
                      setSelectedDay(''),
                        setSelectedMonth(''),
                        setModdedOccasion(''),
                        setModdedName(''),
                        setModdedRelation(''),
                        setModalType('ADD'),
                        setPujaSeq(
                          (bahumanaDetails?.pujaDates?.length + 1).toString(),
                        ),
                        setEditPujaDtModal(true);
                    }}>
                    <MaterialCommunityIcons // add puja date icon
                      name="plus"
                      size={25}
                      color={COLORS.flatBlue}
                    />
                  </TouchableOpacity>
                )}
                {bahumanaDetails?.pujaAttendance?.length > 0 && (
                  <TouchableOpacity // attended date button
                    style={{marginRight: SIZES.paddingSmall}}
                    onPress={() => setAttendedModal(true)}>
                    <MaterialCommunityIcons // calendar icon
                      name="calendar"
                      size={25}
                      color={COLORS.flatBlue}
                    />
                  </TouchableOpacity>
                )}
              </View>

              {/* ATTENDED PUJA DATE DISPLAY MODAL */}

              <CommonModal
                title="ATTENDED PUJA DATES"
                isOpen={attendedModal}
                onClose={() => setAttendedModal(false)}>
                <ScrollView style={{height: SIZES.height * 0.5}}>
                  {bahumanaDetails?.pujaAttendance?.map(
                    (pujaAttendance, index) => (
                      <View // attended puja date container
                        style={{width: '100%'}}
                        key={index}>
                        <View // each attended puja date container
                          style={[
                            styles.detailsSection,
                            {alignItems: 'center'},
                          ]}>
                          <Text // each attended puja date identifier
                            style={styles.identifierTxt}>
                            Puja Date:
                          </Text>
                          <Text // each attended puja date value
                            style={styles.valueTxt}>
                            {pujaAttendance?.attendedOn}
                          </Text>
                          <MaterialCommunityIcons // check icon
                            name="check"
                            size={25}
                            color={COLORS.emaraldGreen}
                          />
                        </View>
                        {index !==
                          bahumanaDetails?.pujaAttendance?.length - 1 && (
                          <View // separator
                            style={styles.separator}
                          />
                        )}
                      </View>
                    ),
                  )}
                </ScrollView>
              </CommonModal>

              {/* EDIT PUJA DATE MODAL */}

              <CommonModal
                title={(modalType && modalType) + ' PUJA DATE'}
                isOpen={editPujaDtModal}
                onClose={() => setEditPujaDtModal(false)}>
                <View // dropdown row
                  style={{flexDirection: 'row'}}>
                  <Dropdown // month dropdown
                    placeholder="Month"
                    style={[styles.dropStyle, {width: SIZES.width * 0.4}]}
                    placeholderStyle={styles.dropPlaceholder}
                    selectedTextStyle={styles.dropSelectedTxt}
                    containerStyle={styles.dropContainer}
                    fontFamily={FONTS.josefinSansRegular}
                    data={months.map(month => ({
                      value: month.value,
                      label: month.label,
                    }))}
                    value={selectedMonth}
                    labelField="label"
                    valueField="value"
                    renderItem={item => (
                      <Text style={styles.dropText}>{item.label}</Text>
                    )}
                    onChange={item => setSelectedMonth(item.value)}
                  />
                  <Dropdown // day dropdown
                    placeholder="Day"
                    disable={!selectedMonth}
                    style={[
                      styles.dropStyle,
                      {
                        width: SIZES.width * 0.2,
                        marginLeft: SIZES.paddingMedium,
                      },
                    ]}
                    placeholderStyle={styles.dropPlaceholder}
                    selectedTextStyle={styles.dropSelectedTxt}
                    containerStyle={styles.dropContainer}
                    fontFamily={FONTS.josefinSansRegular}
                    data={
                      selectedMonth === 'Feb'
                        ? [...Array(29).keys()].map(day => ({
                            value:
                              day < 9
                                ? `0${day + 1}`.toString()
                                : (day + 1).toString(),
                            label:
                              day < 9
                                ? `0${day + 1}`.toString()
                                : (day + 1).toString(),
                          }))
                        : selectedMonth === 'Apr' ||
                          selectedMonth === 'Jun' ||
                          selectedMonth === 'Sep' ||
                          selectedMonth === 'Nov'
                        ? [...Array(30).keys()].map(day => ({
                            value:
                              day < 9
                                ? `0${day + 1}`.toString()
                                : (day + 1).toString(),
                            label:
                              day < 9
                                ? `0${day + 1}`.toString()
                                : (day + 1).toString(),
                          }))
                        : [...Array(31).keys()].map(day => ({
                            value:
                              day < 9
                                ? `0${day + 1}`.toString()
                                : (day + 1).toString(),
                            label:
                              day < 9
                                ? `0${day + 1}`.toString()
                                : (day + 1).toString(),
                          }))
                    }
                    value={selectedDay}
                    labelField="label"
                    valueField="value"
                    renderItem={item => (
                      <Text style={styles.dropText}>{item.label}</Text>
                    )}
                    onChange={item => setSelectedDay(item.value)}
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
                  value={moddedOccasion}
                  labelField="label"
                  valueField="value"
                  renderItem={item => (
                    <Text style={styles.dropText}>{item.label}</Text>
                  )}
                  onChange={item => setModdedOccasion(item.value)}
                />

                <TextInput // name input
                  style={styles.input}
                  placeholderTextColor={COLORS.gray}
                  placeholder="Enter name"
                  keyboardAppearance="dark"
                  keyboardType="default"
                  returnKeyType="done"
                  value={moddedName}
                  onChangeText={text => setModdedName(text)}
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
                  value={moddedRelation}
                  labelField="label"
                  valueField="value"
                  renderItem={item => (
                    <Text style={styles.dropText}>{item.label}</Text>
                  )}
                  onChange={item => setModdedRelation(item.value)}
                />

                <PrimaryButton // submit button
                  disabled={!selectedDay || !selectedMonth}
                  name="SUBMIT"
                  icon="check"
                  style={{
                    height: SIZES.height * 0.065,
                    width: '100%',
                    backgroundColor:
                      selectedDay && selectedMonth
                        ? COLORS.saveEnabled
                        : COLORS.lightGray,
                    elevation:
                      selectedDay && selectedMonth ? SHADOW.elevation : 0,
                    shadowOpacity:
                      selectedDay && selectedMonth ? SHADOW.shadowOpacity : 0,
                  }}
                  onPress={() => updatePujaDate()}
                />
              </CommonModal>
            </>
          }>
          {bahumanaDetails?.pujaDates?.length !== 0 && (
            <>
              <View // header
                style={styles.detailsSection}>
                <Text style={styles.identifierTxt}>Date</Text>
                <Text style={[styles.identifierTxt, {flex: 1.5}]}>
                  Occassion
                </Text>
                <Text
                  style={[
                    styles.identifierTxt,
                    {flex: 0.5, textAlign: 'right'},
                  ]}>
                  Action
                </Text>
              </View>
              <View // separator
                style={styles.separator}
              />
            </>
          )}

          {bahumanaDetails?.pujaDates?.map((puja, index) => (
            <View // puja date container
              style={{width: '100%'}}
              key={index}>
              <View // puja date container
                style={[styles.detailsSection, {alignItems: 'center'}]}>
                <Text // puja date value
                  style={styles.valueTxt}>
                  {puja.pujaDate}
                </Text>
                <Text // puja occasion value
                  style={[styles.valueTxt, {flex: 1.5}]}>
                  {puja.occassion}
                </Text>
                <View // edit puja date button container
                  style={{flex: 0.5, alignItems: 'flex-end'}}>
                  <TouchableOpacity // edit puja date button
                    onPress={() => {
                      setModalType('EDIT'),
                        setSelectedDay(puja?.pujaDate.split('-')[0]),
                        setSelectedMonth(puja?.pujaDate.split('-')[1]),
                        setModdedOccasion(
                          puja?.occassion
                            .split(' ')
                            .map(
                              word =>
                                word.charAt(0).toUpperCase() +
                                word.slice(1).toLowerCase(),
                            )
                            .join(' '),
                        ),
                        setModdedName(puja?.displayName),
                        setModdedRelation(
                          puja?.relationship
                            .split(' ')
                            .map(
                              word =>
                                word.charAt(0).toUpperCase() +
                                word.slice(1).toLowerCase(),
                            )
                            .join(' '),
                        ),
                        setPujaSeq(puja?.sequence),
                        setEditPujaDtModal(true);
                    }}>
                    <MaterialCommunityIcons // edit puja date icon
                      name="pencil"
                      size={25}
                      color={COLORS.flatBlue}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              {
                // remove last separator
                index !== bahumanaDetails?.pujaDates?.length - 1 && (
                  <View // separator
                    style={[styles.separator]}
                  />
                )
              }
            </View>
          ))}
        </CollapsableSection>

        {/* ACCOMMODATION CARD */}

        <CollapsableSection
          name="ACCOMMODATION"
          setOpen={setAccommodationOpn}
          open={accommodationOpn}>
          <>
            {accommodationList?.length !== 0 && (
              <>
                <View // header
                  style={[styles.detailsSection, {paddingHorizontal: 0}]}>
                  <Text style={[styles.identifierSmallTxt, {flex: 0.4}]}>
                    Room
                  </Text>
                  <Text style={styles.identifierSmallTxt}>Check In</Text>
                  <Text style={styles.identifierSmallTxt}>Check Out</Text>
                  <Text style={[styles.identifierSmallTxt, {flex: 0.5}]}>
                    Adults
                  </Text>
                  <Text style={[styles.identifierSmallTxt, {flex: 0.6}]}>
                    Children
                  </Text>
                  <Text style={[styles.identifierSmallTxt, {flex: 0.4}]}>
                    Days
                  </Text>
                </View>
                <View // separator
                  style={styles.separator}
                />
              </>
            )}
            {accommodationList?.map((item, index) => (
              <View // accommodation details container
                style={{width: '100%'}}
                key={index}>
                <View //  accommodation details
                  key={index}
                  style={[styles.detailsSection, {paddingHorizontal: 0}]}>
                  <Text style={[styles.identifierSmallTxt, {flex: 0.4}]}>
                    {item?.roomNo}
                  </Text>
                  <Text style={styles.identifierSmallTxt}>
                    {item?.checkInDate}
                  </Text>
                  <Text style={styles.identifierSmallTxt}>
                    {item?.checkOutDate}
                  </Text>
                  <Text style={[styles.identifierSmallTxt, {flex: 0.5}]}>
                    {item?.noOfAdults}
                  </Text>
                  <Text style={[styles.identifierSmallTxt, {flex: 0.6}]}>
                    {item?.noOfChildren}
                  </Text>
                  <Text style={[styles.identifierSmallTxt, {flex: 0.4}]}>
                    {item?.noOfDays}
                  </Text>
                </View>
                {index !== accommodationList?.length - 1 && (
                  <View // separator
                    style={styles.separator}
                  />
                )}
              </View>
            ))}
          </>
        </CollapsableSection>
      </ScrollView>

      {/* CREATE RECEIPT BUTTON */}

      <PrimaryButton
        name="CREATE RECEIPT"
        onPress={createReceipt}
        style={{
          width: SIZES.width,
          borderRadius: 0,
          backgroundColor: COLORS.spanishBistra,
        }}
      />
    </LinearGradient>
  );
};

export default PatronDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: COLORS.antiFlashWhite,
  },
  dpSec: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dp: {
    height: SIZES.width * 0.3,
    width: SIZES.width * 0.3,
    borderRadius: SIZES.width * (0.3 / 2),
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    borderColor: COLORS.quaternary,
    borderWidth: 2,
  },
  reviewDpOtF: {
    borderColor: COLORS.black,
    borderWidth: 12,
    marginBottom: SIZES.paddingMedium,
    ...SHADOW,
  },
  reviewDpInF: {borderWidth: 3, borderColor: COLORS.lightGray},
  reviewDp: {
    height: SIZES.width * 0.8,
    width: SIZES.width * 0.7,
    borderWidth: 10,
    borderColor: COLORS.white,
  },
  lowerBtnCont: {
    flexDirection: 'row',
    flex: 1,
    marginTop: SIZES.paddingSmall,
    paddingHorizontal: SIZES.paddingSmall,
  },
  lowerBtn: {flex: 1, alignItems: 'center'},
  primaryTxt: {
    fontSize: SIZES.fontMedium,
    fontFamily: FONTS.josefinSansBold,
    color: COLORS.black,
  },
  identifierTxt: {
    flex: 1,
    color: COLORS.black,
    fontSize: SIZES.fontSmall,
    fontFamily: FONTS.josefinSansBold,
  },
  identifierTxtEx: {flex: 0, marginRight: SIZES.paddingSmall},
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
  clkValueTxt: {
    flex: 1,
    color: COLORS.blue,
    fontSize: SIZES.fontSmall,
    fontFamily: FONTS.josefinSansRegular,
  },
  navBtnTxt: {
    color: COLORS.white,
    fontSize: SIZES.fontSmall,
    fontFamily: FONTS.josefinSansRegular,
  },
  identifierSmallTxt: {
    flex: 1,
    textAlign: 'center',
    color: COLORS.black,
    fontSize: SIZES.fontSmall - 2,
    fontFamily: FONTS.josefinSansRegular,
  },
  valCont1: {flexDirection: 'row', flex: 1, marginBottom: SIZES.paddingSmall},
  valCont2: {flexDirection: 'row', flex: 0.65},
  valCont3: {
    flexDirection: 'row',
    flex: 1,
    marginTop: SIZES.paddingSmall,
    paddingHorizontal: SIZES.paddingSmall,
  },
  separator: {height: 1, width: '100%', backgroundColor: COLORS.lightGray},
  expandableSubSec: {
    padding: SIZES.paddingSmall,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: SIZES.radiusSmall,
  },
  detailsSection: {
    padding: SIZES.paddingSmall,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dropStyle: {
    height: SIZES.height * 0.065,
    borderColor: COLORS.lightGray,
    borderRadius: SIZES.radiusSmall,
    borderWidth: 1,
    marginBottom: SIZES.paddingMedium,
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
  shareBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: SIZES.width * 0.25,
    height: SIZES.width * 0.25,
    borderRadius: SIZES.radiusSmall,
    marginVertical: SIZES.paddingMedium,
    ...SHADOW,
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
  opnNavBtn: {
    padding: SIZES.paddingMedium,
    borderRadius: SIZES.radiusSmall,
    backgroundColor: COLORS.flatBlue,
    borderColor: COLORS.lightGray,
    marginBottom: SIZES.paddingMedium,
  },
});
