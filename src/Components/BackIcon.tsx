/* eslint-disable react-native/no-inline-styles */
import {TouchableOpacity, View} from 'react-native';
import React from 'react';
import {
  responsiveHeight,
  responsiveWidth,
} from '../assets/responsive_dimensions';
import {backWhite} from '../assets/icons';
import SvgIcons from './SvgIcons';
import {Colors} from '../assets/colors';
import {useNavigation} from '@react-navigation/native';
import {BoldText, NormalText} from './Titles';

const BackIcon = ({title, cartCount = 0}: any) => {
  const navigation = useNavigation();
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
      }}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{
          backgroundColor: Colors.buttonBg,
          height: responsiveHeight(5.2),
          borderRadius: responsiveHeight(1),
          width: responsiveWidth(10.5),
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <SvgIcons
          xml={backWhite}
          height={responsiveHeight(2.5)}
          width={responsiveWidth(4)}
        />
      </TouchableOpacity>

      {title && (
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <BoldText title={title} color={Colors.black} />
          {title === 'My Cart' && (
            <NormalText
              title={`Total Items: ${cartCount}`}
              color={Colors.buttonBg}
              alignSelf="center"
            />
          )}
        </View>
      )}
    </View>
  );
};

export default BackIcon;
