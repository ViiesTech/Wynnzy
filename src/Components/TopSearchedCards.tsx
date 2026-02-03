/* eslint-disable react-native/no-inline-styles */
import { View, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { responsiveHeight, responsiveWidth } from '../assets/responsive_dimensions';
import { NormalText } from './Titles';
import SvgIcons from './SvgIcons';
import { rating } from '../assets/icons';
import { images } from '../assets/images';
import { Colors } from '../assets/colors';
interface SearchedCardProps {
  handlePress: () => void;
}
const TopSearchedCards: React.FC<SearchedCardProps> = ({ handlePress }) => {
  return (
    <TouchableOpacity onPress={handlePress} style={{ flexDirection: 'row', alignItems: 'center', gap: responsiveHeight(2), elevation: 10, backgroundColor: Colors.white, padding: responsiveHeight(2), borderRadius: responsiveHeight(2) }}>
      <Image source={images.hotel} style={{ height: responsiveHeight(14), width: responsiveWidth(27) }} resizeMode="contain" />
      <View style={{ flex: 1 }}>
        <NormalText color="#969AA8" title="Hotel 1" />
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <NormalText title="Dream luxury home" />
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: responsiveHeight(1) }}>
            <SvgIcons xml={rating} height={15} width={15} />
            <NormalText fontWeight="600" title="4.9" />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default TopSearchedCards;
