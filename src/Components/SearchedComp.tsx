/* eslint-disable react-native/no-inline-styles */
import {  Text, TouchableOpacity } from 'react-native';
import React from 'react';
import SvgIcons from './SvgIcons';
import { cut } from '../assets/icons';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from '../assets/responsive_dimensions';

const SearchedComp = () => {
  return (
    <TouchableOpacity style={{flexDirection:'row',alignItems:'center',gap:responsiveHeight(1.5),padding:responsiveHeight(1.4),borderRadius:responsiveHeight(3),borderWidth:1.5,borderColor:'#eff3fa',width:responsiveWidth(32),justifyContent:'center'}}>
    <Text style={{color:'#969AA8',fontSize:responsiveFontSize(2)}}>Hotel 1</Text>
    <TouchableOpacity>
    <SvgIcons xml={cut} height={13} width={13}/>
    </TouchableOpacity>
  </TouchableOpacity>
  );
};

export default SearchedComp;
