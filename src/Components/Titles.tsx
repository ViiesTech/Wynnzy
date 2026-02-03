import React from 'react';
import { Text, TextStyle } from 'react-native';
import { responsiveFontSize } from '../assets/responsive_dimensions';
import { Colors } from '../assets/colors';
interface textProps {
  color?: string;
  title: string;
  alignSelf?: string;
  txtAlign?: string;
  fontWeight?: string;
  mrgnTop?: number;
  width?: number;
  lineHeight?: number;
  fontSize?: number;
  numberOfLines?: number;
  txtDecoration?: string;
}

export const BoldText: React.FC<textProps> = ({
  title,
  txtAlign = 'left',
  width,
  mrgnTop,
  fontWeight,
  numberOfLines,
  fontSize = responsiveFontSize(2.7),
  alignSelf = 'flex-start',
  color = Colors.themeText,
}: textProps) => {
  return (
    <Text
      numberOfLines={numberOfLines}
      style={{
        fontSize,
        fontWeight: fontWeight ? fontWeight : '900',
        marginTop: mrgnTop,
        width,
        color,
        textAlign: txtAlign,
        alignSelf,
      } as TextStyle}>
      {title}
    </Text>
  );
};

export const NormalText: React.FC<textProps> = ({
  title,
  color = Colors.themeText,
  alignSelf = 'flex-start',
  txtDecoration = 'none',
  width,
  lineHeight,
  txtAlign = 'left',
  numberOfLines,
  mrgnTop,
  fontWeight = '500',
  fontSize = responsiveFontSize(1.9),
}: textProps) => {
  return (
    <Text
      numberOfLines={numberOfLines}
      style={{
        fontSize,
        fontWeight,
        color,
        width,
        lineHeight,
        marginTop: mrgnTop,
        textAlign: txtAlign,
        textDecorationLine: txtDecoration,
        alignSelf,
      } as TextStyle}>
      {title}
    </Text>
  );
};
