import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {SIZES, COLORS, FONTS} from '../../constants';

const LargeButton = props => {
  const [color, setColor] = useState(''); // random color state

  useEffect(() => {
    setColor('#' + Math.floor(Math.random() * 16777215).toString(16) + 40);
  }, []);

  return (
    <TouchableOpacity // donation button
      style={styles.btn}
      onPress={() => props.onPress()}>
      <ImageBackground // image background
        blurRadius={5}
        source={props.image && {uri: props.image}}
        style={styles.imgBg}>
        <View // image hue
          style={[styles.imgBg, {backgroundColor: color}]}>
          {/* TOP SECTION */}

          <View style={styles.endSec}>
            {props.info && (
              <TouchableOpacity //info button
                style={{padding: SIZES.width * 0.02}}
                onPress={() => props.onPressInfo()}>
                <AntDesign
                  name="exclamationcircleo"
                  size={25}
                  color={COLORS.white}
                />
              </TouchableOpacity>
            )}
          </View>

          {/* MIDDLE SECTION */}

          <View style={styles.middleSec}>
            <Text // button text
              style={styles.btnTxt}>
              {props.name}
            </Text>
          </View>

          {/* BOTTOM SECTION */}

          <View style={styles.endSec}>
            <Text></Text>
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

export default LargeButton;

const styles = StyleSheet.create({
  btn: {
    height: SIZES.height * 0.218,
    width: SIZES.width * 0.95,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: SIZES.radiusSmall,
    overflow: 'hidden',
    marginHorizontal: SIZES.paddingSmall,
    marginBottom: SIZES.paddingSmall,
  },
  imgBg: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  endSec: {
    flex: 1,
    width: '100%',
    alignItems: 'flex-end',
    zIndex: 10,
  },
  middleSec: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%',
  },
  btnTxt: {
    textAlign: 'center',
    textAlignVertical: 'center',
    fontFamily: FONTS.josefinSansBold,
    fontSize: SIZES.fontBig,
    color: COLORS.white,
  },
});
