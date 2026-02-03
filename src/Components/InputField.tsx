import { StyleSheet, TextInput } from 'react-native';
import React from 'react';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from '../assets/responsive_dimensions';

interface inputProps {
  placeholder: string;
  value: string;
  onChangeText: () => void;
}
const InputField = ({ value, onChangeText, placeholder }: inputProps) => {
  return (
    <TextInput
      style={styles.inputStyle}
      onChangeText={onChangeText}
      value={value}
      placeholder={placeholder}
    />
  );
};
export default InputField;
const styles = StyleSheet.create({
  inputStyle: {
    borderWidth: 1,
    width: responsiveWidth(90),
    borderRadius: 5,
    paddingBottom: responsiveHeight(2.4),
    alignSelf: 'center',
    fontSize: responsiveFontSize(1.8),
    paddingLeft: responsiveHeight(3),
    borderColor: '#ddd',
  },
});
