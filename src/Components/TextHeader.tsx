/* eslint-disable react-native/no-inline-styles */
import { View, Text } from 'react-native';
import React from 'react';
import BackIcon from './BackIcon';
import { NormalText } from './Titles';
import { responsiveFontSize, responsiveHeight } from '../assets/responsive_dimensions';
import { Colors } from '../assets/colors';

interface titleProps {
  title: string;
}
const TextHeader: React.FC<titleProps> = ({ title }) => {
  return (
    <View style={{ flexDirection: 'row', paddingVertical: responsiveHeight(1), alignItems: 'center', justifyContent: 'space-between' }}>
      <BackIcon />
      <NormalText color={Colors.themeText2} alignSelf="center" fontWeight="900" fontSize={responsiveFontSize(2.7)} title={title} />
      <Text style={{ color: Colors.white }}>a</Text>
    </View>
  );
};

export default TextHeader;
