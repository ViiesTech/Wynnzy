import React, {FC} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import {Colors} from '../assets/colors';
import {
  responsiveFontSize,
  responsiveHeight,
} from '../assets/responsive_dimensions';
import SvgIcons from './SvgIcons';

export const Button = ({
  title,
  bgColor = Colors.buttonBg,
  textColor = Colors.white,
  borderColor,
  borderWidth = 0,
  xml,
  handlePress,
  width,
  alignSelf,
  borderRadius,
  height,
  mrgnTop,
  textFont,
  icon = false,
  activeOpacity = 0.7,
  disabled = false,
  isLoading = false,
  loaderColor,
}: any) => {
  // Disable button if explicitly disabled OR if currently loading
  const isButtonDisabled = disabled || isLoading;

  return (
    <TouchableOpacity
      activeOpacity={activeOpacity}
      onPress={handlePress}
      disabled={isButtonDisabled}
      style={[
        styles.buttonContainer,
        {
          backgroundColor: isButtonDisabled ? '#cccccc' : bgColor, // Visual cue for disabled state
          borderWidth: borderWidth,
          borderColor: borderColor,
          marginTop: mrgnTop,
          width: width ? width : '100%',
          height: height ? height : responsiveHeight(7.2),
          alignSelf: alignSelf ? alignSelf : 'center',
          borderRadius: borderRadius ? borderRadius : responsiveHeight(1.4),
        } as any,
      ]}>
      {isLoading ? (
        <ActivityIndicator
          color={loaderColor || textColor || Colors.white}
          size="small"
        />
      ) : icon ? (
        <View style={styles.iconContainer}>
          {xml && <SvgIcons xml={xml} width={25} height={25} />}
          <Text
            style={[
              styles.textStyle,
              {
                color: textColor,
                fontSize: textFont ? textFont : responsiveFontSize(2.4),
              },
            ]}>
            {title}
          </Text>
        </View>
      ) : (
        <Text
          style={[
            styles.textStyle,
            {
              color: textColor,
              fontSize: textFont ? textFont : responsiveFontSize(2.4),
            },
          ]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: responsiveHeight(1.5),
  },
  textStyle: {
    textAlign: 'center',
    fontWeight: '600',
  },
});
