/* eslint-disable react-native/no-inline-styles */
import { TouchableOpacity } from 'react-native';
import React from 'react';
import { NormalText } from './Titles';
import { Colors } from '../assets/colors';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from '../assets/responsive_dimensions';
interface ButtonProps {
  bgColor?: string,
  width?: number,
  padding?: number,
  txtColor?: string,
  fntSize?: number,
  fntWeight?: string,
  borderRadius?: number,
  title: string
}
const SmallButtons: React.FC<ButtonProps> = ({ bgColor, width, padding, txtColor, fntSize, fntWeight, borderRadius, title }) => {
  return (
    <TouchableOpacity style={{ backgroundColor: bgColor ? bgColor : Colors.white, borderRadius: borderRadius ? borderRadius : responsiveHeight(4), width: width ? width : responsiveWidth(22), padding: padding ? padding : responsiveHeight(1.5) }}>
      <NormalText alignSelf="center" title={title} color={txtColor ? txtColor : '#121212'} fontSize={fntSize ? fntSize : responsiveFontSize(2)} fontWeight={fntWeight ? fntWeight : '600'} />
    </TouchableOpacity>
  );
};

export default SmallButtons;
