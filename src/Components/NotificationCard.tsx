/* eslint-disable react-native/no-inline-styles */
import { View, Text } from 'react-native';
import React from 'react';
import SvgIcons from './SvgIcons';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from '../assets/responsive_dimensions';
import { NormalText } from './Titles';
import { Colors } from '../assets/colors';
import { badge } from '../assets/icons';
interface NotificationProps {
  iconName: string,
  text1: string,
  text2: string,
  text3: string,
  showBadge?: boolean,
}
const NotificationCard: React.FC<NotificationProps> = ({ iconName, text1, text2, text3, showBadge }) => {
  return (
    <View>
      <View style={{ flexDirection: 'row', gap: responsiveHeight(2) }}>
        <View style={{ backgroundColor: Colors.buttonBg, width: responsiveWidth(15), height: responsiveHeight(7), justifyContent: 'center', borderRadius: responsiveHeight(1.5), alignItems: 'center' }}>
          <SvgIcons xml={iconName} height={25} width={25} />
          {showBadge ? (
            <View style={{ position: 'absolute', right: -7, top: -7 }}>
              <SvgIcons xml={badge} height={20} width={20} />
            </View>
          ) : null}
        </View>
        <View style={{ gap: responsiveHeight(1), flex: 1 }}>
          <NormalText title={text1} color="#192252" />
          <Text style={{ color: '#848FAC', fontSize: responsiveFontSize(2), lineHeight: 27 }}>{text2}{showBadge && <Text style={{ color: '#001B13' }}> click here</Text>}</Text>
          <NormalText fontSize={responsiveFontSize(2)} fontWeight="400" title={text3} color="#969AA8" />
        </View>
      </View>
      <View style={{ height: 2, width: '100%', backgroundColor: '#EFF3FA', marginTop: responsiveHeight(3) }} />
    </View>
  );
};

export default NotificationCard;
