/* eslint-disable react-native/no-inline-styles */
import {View, TouchableOpacity, TextInput} from 'react-native';
import React from 'react';
import SvgIcons from './SvgIcons';
import {responsiveHeight} from '../assets/responsive_dimensions';

interface InputProps {
  placeHolder: string;
  placeHolderColor: string;
  bgColor: string;
  xml: string;
  txtColor: string;
  borderRadius?: number;
  height?: number;
  borderWidth?: number;
  borderColor?: string;
  mrgnTop?: number;
  flex?: number;
  onChangeText?: () => void;
}
const SearchInput: React.FC<InputProps> = ({
  placeHolder,
  onChangeText,
  placeHolderColor,
  bgColor,
  xml,
  txtColor,
  flex,
  borderWidth,
  borderRadius,
  height,
  borderColor,
  mrgnTop,
}) => {
  return (
    <View
      style={
        {
          backgroundColor: bgColor,
          borderColor: borderColor,
          borderWidth: borderWidth,
          width: !flex && '100%',
          flex: flex ? flex : null,
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row',
          height: height ? height : responsiveHeight(6.5),
          paddingHorizontal: responsiveHeight(2),
          borderRadius: borderRadius ? borderRadius : 10,
          marginTop: mrgnTop ? mrgnTop : responsiveHeight(2.5),
          gap: responsiveHeight(2),
        } as any
      }>
      {xml && (
        <TouchableOpacity>
          <SvgIcons xml={xml} height={20} width={20} />
        </TouchableOpacity>
      )}
      <TextInput
        onChangeText={onChangeText}
        style={{flex: 1, color: txtColor}}
        placeholderTextColor={placeHolderColor}
        placeholder={placeHolder}
      />
    </View>
  );
};

export default SearchInput;
