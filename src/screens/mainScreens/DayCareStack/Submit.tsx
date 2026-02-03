/* eslint-disable react-native/no-inline-styles */
import { View, Image } from 'react-native';
import React from 'react';
import { NormalText } from '../../../Components/Titles';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from '../../../assets/responsive_dimensions';
import { Colors } from '../../../assets/colors';
import { Button } from '../../../Components/Button';
import { images } from '../../../assets/images';

const Submit = ({ navigation }) => {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1, backgroundColor: Colors.white, padding: responsiveHeight(2) }}>
      <Image source={images.green} style={{ height: responsiveHeight(13), width: responsiveWidth(23) }} />
      <NormalText mrgnTop={responsiveFontSize(1.5)} alignSelf="center" fontSize={responsiveFontSize(3)} fontWeight="900" title="Submitted!" />
      <NormalText mrgnTop={responsiveHeight(1.5)} color="#2A2A2A" fontSize={responsiveFontSize(2)} alignSelf="center" width={responsiveWidth(50)} txtAlign="center" fontWeight="600" title="Welcome to Pawcation" />
      <Button handlePress={() => navigation.navigate('BottomStack')} mrgnTop={responsiveHeight(4)} title="Continue" bgColor={Colors.buttonBg} textColor={Colors.white} xml={''} />
    </View>
  );
};

export default Submit;
