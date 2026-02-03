import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Colors} from '../assets/colors';
import {
  responsiveHeight,
  responsiveWidth,
} from '../assets/responsive_dimensions';
import SvgIcons from './SvgIcons';
import {tick} from '../assets/icons';

export const CheckBox = () => {
  return (
    <View style={styles.containerStyle}> 
      <SvgIcons xml={tick} height={'30'} width={'30'} />
    </View>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    backgroundColor: Colors.buttonBg,
    bottom: responsiveHeight(-1.5),
    position:'absolute',
    alignSelf: 'center',
    height: responsiveHeight(6.6),
    width: responsiveWidth(13),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: responsiveHeight(0.8),
  },
});
