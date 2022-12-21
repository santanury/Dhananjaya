import {Dimensions} from 'react-native';
const {width, height, fontScale} = Dimensions.get('window');

export const COLORS = {
  primary: '#DC5384',
  secondary: '#E86B7B',
  tertiary: '#F68D93',
  quaternary: '#FBBDC3',
  palePink: '#FADADD',
  mistyMoss: '#A9AA78',
  spanishBistra: '#748030',
  blue: '#2752D6',
  flatBlue: '#73A8E6',
  jasperOrange: '#E0954B',
  inactiveRed: '#F88379',
  venetianRed: '#CC1512',
  alertRed: '#FF0F0F',
  black: '#1E1F20',
  darkGray: '#4A4A4A',
  gray: '#8E8E93',
  lightGray: '#E0E0E0',
  white: '#FFFFFF',
  antiFlashWhite: '#F3EFF5',
  activeGreen: '#599D55',
  saveEnabled: '#50C878',
  warning: '#FFDB58',
  whatsApp: '#075E54',
};

export const FONTS = {
  josefinSansBold: 'JosefinSans-Bold',
  josefinSansBoldItalic: 'JosefinSans-BoldItalic',
  josefinSansExtraLight: 'JosefinSans-ExtraLight',
  josefinSansExtraLightItalic: 'JosefinSans-ExtraLightItalic',
  josefinSansItalic: 'JosefinSans-Italic',
  josefinSansLight: 'JosefinSans-Light',
  josefinSansLightItalic: 'JosefinSans-LightItalic',
  josefinSansMedium: 'JosefinSans-Medium',
  josefinSansMediumItalic: 'JosefinSans-MediumItalic',
  josefinSansRegular: 'JosefinSans-Regular',
  josefinSansSemiBold: 'JosefinSans-SemiBold',
  josefinSansSemiBoldItalic: 'JosefinSans-SemiBoldItalic',
  josefinSansThin: 'JosefinSans-Thin',
  josefinSansThinItalic: 'JosefinSans-ThinItalic',
};

export const SHADOW = {
  shadowColor: COLORS.black,
  shadowOffset: {width: 0, height: 2},
  shadowOpacity: 0.5,
  shadowRadius: 2,
  elevation: 10,
};

export const SIZES = {
  radiusHuge: width * 0.2,
  radiusBig: 20,
  radiusMedium: 15,
  radiusSmall: 10,
  fontBig: 25,
  fontMedium: 18,
  fontSmall: 14,
  fontExtraSmall: 12,

  paddingSmall: width * 0.02,
  paddingMedium: height * 0.025,
  paddingBig: height * 0.05,
  paddingHuge: height * 0.1,

  width,
  height,
  fontScale,
};

const appTheme = {
  COLORS,
  FONTS,
  SIZES,
};

export default appTheme;
