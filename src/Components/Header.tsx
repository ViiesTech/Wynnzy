/* eslint-disable react-native/no-inline-styles */
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import React, { FC } from 'react';
import SvgIcons from './SvgIcons';
import { currentLoc, filter } from '../assets/icons';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from '../assets/responsive_dimensions';
import { Colors } from '../assets/colors';
import { BoldText, NormalText } from './Titles';

interface HeaderProps {
  bgColor: string;
  whiteNotification: boolean;
  iconName?: string;
  handlePress: () => void;
  handleNotificationPress: () => void;
  handleFilterPress: () => void;
  navigation: any;
  title?: string;  // ✅ Make title optional
}
export const IconContainer: FC<HeaderProps> = ({
  bgColor,
  iconName,
  title,  // ✅ Ensure title is received
  handlePress,
  handleFilterPress,
  handleNotificationPress,
}) => {
  return (
    <TouchableOpacity
      onPress={title === 'notification' ? handleNotificationPress : handlePress}
      style={[styles.iconContainer, { backgroundColor: bgColor }]}
    >
      <SvgIcons xml={iconName} height={responsiveHeight(4)} width={responsiveWidth(6)} />
    </TouchableOpacity>
  );
};
const Header: FC<HeaderProps> = ({
  whiteNotification,
  bgColor,
  iconName,
  handlePress,
  handleFilterPress,
  handleNotificationPress,
}) => {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: responsiveHeight(1.2) }}>
        <IconContainer
          iconName={currentLoc}
          handlePress={handlePress}
          bgColor={bgColor ? bgColor : Colors.buttonBg}
          whiteNotification={false}
        />
        <View>
          <BoldText
            color={whiteNotification ? Colors.white : '#363636'}
            title="Current Location"
            fontSize={responsiveFontSize(2.1)}
            alignSelf="left"
          />
          <NormalText
            color={whiteNotification ? Colors.white : '#5E5E5E'}
            title="6543 Chestnut Court, Boston,"
            fontWeight="400"
            fontSize={responsiveFontSize(1.7)}
          />
        </View>
      </View>
      <View style={{ flexDirection: 'row', gap: responsiveHeight(1) }}>
        <IconContainer
          iconName={filter}
          handlePress={handleFilterPress}
          bgColor={bgColor ? bgColor : Colors.buttonBg}
          whiteNotification={whiteNotification}
        />
        <IconContainer
          title="notification"  // ✅ Ensure title is passed
          handleNotificationPress={handleNotificationPress}
          iconName={iconName}
          bgColor={bgColor ? bgColor : Colors.buttonBg}
          whiteNotification={whiteNotification}
        />
      </View>
    </View>
  );
};


export default Header;


const styles = StyleSheet.create({
  iconContainer: {
    paddingHorizontal: responsiveHeight(1.3),
    paddingVertical: 6,
    borderRadius: responsiveHeight(1),
  },
});
