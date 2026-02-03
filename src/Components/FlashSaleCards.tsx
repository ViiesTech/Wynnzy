/* eslint-disable react-native/no-inline-styles */
import { Image, View } from 'react-native';
import React from 'react';
import { BoldText, NormalText } from './Titles';
import SvgIcons from './SvgIcons';
import { pin } from '../assets/icons';
import { responsiveHeight, responsiveWidth } from '../assets/responsive_dimensions';
import { Colors } from '../assets/colors';
import { images } from '../assets/images';

const FlashSaleCards = () => {
  return (
    <View style={{
      flexDirection: 'row', alignItems: 'center', gap: responsiveHeight(1.5), backgroundColor: Colors.white, borderRadius: responsiveHeight(1.6), padding: 20, shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      marginTop: responsiveHeight(2.5),
      elevation: 5,
    }}
    >
      <View>
        <Image source={images.boarding} style={{ height: responsiveHeight(17), width: responsiveWidth(27.5) }} resizeMode="stretch" />
      </View>
      <View style={{ gap: responsiveHeight(0.8) }}>
        <BoldText title="Boarding" />
        <View style={{ flexDirection: 'row', gap: responsiveHeight(1) }}>
          <NormalText color={Colors.black} title="$1.499,00  -" />
          <NormalText color="#989898" txtDecoration="line-through" title="$1.599,00" />
        </View>
        <View style={{ flexDirection: 'row', gap: 5, alignItems: 'center' }}>
          <SvgIcons xml={pin} height={20} width={20} />
          <NormalText color="#989898" title="10km" />
        </View>
      </View>
    </View>
  );
};
export default FlashSaleCards;
