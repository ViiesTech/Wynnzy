/* eslint-disable react-native/no-inline-styles */
import { TouchableOpacity } from 'react-native';
import React from 'react';
import { responsiveHeight, responsiveWidth } from '../assets/responsive_dimensions';
import { backWhite } from '../assets/icons';
import SvgIcons from './SvgIcons';
import { Colors } from '../assets/colors';
import { useNavigation } from '@react-navigation/native';



const BackIcon = () => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity onPress={() => navigation.goBack()} style={{ backgroundColor: Colors.buttonBg, height: responsiveHeight(5.2), borderRadius: responsiveHeight(1), width: responsiveWidth(10.5), alignItems: 'center', justifyContent: 'center' }}>
      <SvgIcons xml={backWhite} height={responsiveHeight(2.5)} width={responsiveWidth(4)} />
    </TouchableOpacity>
  );
};

export default BackIcon;
