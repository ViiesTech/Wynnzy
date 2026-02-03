/* eslint-disable react-native/no-inline-styles */
import { View, TouchableOpacity } from 'react-native';
import React from 'react';
import { BoldText, NormalText } from './Titles';
import { currentLoc2, deleteIcon } from '../assets/icons';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from '../assets/responsive_dimensions';
import { Colors } from '../assets/colors';
import SvgIcons from './SvgIcons';

export const CurrentLocation = () => {
  return (
    <TouchableOpacity style={{ height: responsiveHeight(6), width: responsiveWidth(12.5), alignItems: 'center', justifyContent: 'center', borderRadius: responsiveHeight(4), backgroundColor: Colors.buttonBg, position: 'absolute', bottom: responsiveHeight(2), right: responsiveHeight(2) }}>
      <SvgIcons xml={currentLoc2} height={responsiveHeight(3.8)} width={responsiveWidth(5.8)} />
    </TouchableOpacity>
  );
};

const LocationCard = () => {
  return (
    <View style={{
      flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, justifyContent: 'space-between', shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      borderRadius: responsiveHeight(1),
      elevation: 5,
      padding: responsiveHeight(2),
    }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: responsiveHeight(1.5) }}>
        <View style={{ borderColor: Colors.buttonBg, borderWidth: 2, padding: 2, width: responsiveWidth(6.2), borderRadius: responsiveHeight(2), alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ backgroundColor: Colors.buttonBg, height: 18, width: 17, borderRadius: responsiveHeight(2) }} />
        </View>
        <View>
          <BoldText title="Home" fontWeight="600" />
          <NormalText color="#808CA0" fontWeight="400" fontSize={responsiveFontSize(1.5)} title="6543 Chestnut Court, Boston, MA 02101" />
        </View>
      </View>
      <TouchableOpacity>
        <SvgIcons xml={deleteIcon} height={20} width={20} />
      </TouchableOpacity>
    </View>
  );
};
export default LocationCard;
