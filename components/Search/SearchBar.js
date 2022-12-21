import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import {SIZES, COLORS, FONTS} from '../../constants';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const SearchBar = props => {
  return (
    <View // search container
      style={[styles.searchContainer, props.style]}>
      {props.lens && (
        <TouchableOpacity // search button
          onPress={props.onPress}>
          <MaterialCommunityIcons // search icon
            name="magnify"
            size={30}
            color={COLORS.gray}
          />
        </TouchableOpacity>
      )}
      <TextInput // search input
        ref={props.reference}
        style={styles.searchInput}
        placeholder={props.placeholder}
        maxLength={props.maxLength}
        placeholderTextColor={COLORS.gray}
        keyboardAppearance="dark"
        keyboardType={props.keyboardType}
        returnKeyType="search"
        onSubmitEditing={props.onSubmitEditing}
        color={COLORS.black}
        onChangeText={text => props.onChangeText(text)}
        onFocus={props.onFocus}
        value={props.value}
      />
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.width * 0.05,
    borderRadius: SIZES.radiusSmall,
    backgroundColor: COLORS.antiFlashWhite,
    borderColor: COLORS.lightGray,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: SIZES.fontSmall,
    fontFamily: FONTS.josefinSansRegular,
    height: SIZES.height * 0.065,
  },
});
