/* eslint-disable react-native/no-inline-styles */
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import React from 'react';
import SvgIcons from './SvgIcons';
import { eye, eyeOff } from '../assets/icons';
import {
  responsiveFontSize,
  responsiveHeight,
} from '../assets/responsive_dimensions';
import { Colors } from '../assets/colors';
import { NormalText } from './Titles';
interface inputProps {
  placeHolder: string;
  color?: string;
  fontSize: Number;
  fontWeight?: string;
  backgroundColor?: string;
  placeholderTxtColor: string;
  xml?: string;
  icon?: boolean;
  elevation?: boolean;
  security?: boolean;
  showPassword?: boolean;
  keyboardType?: string;
  label?: string;
  handlePress?: (param: string) => void;
  setShowPassword?: (param: boolean) => void;
}
const Input = ({
  placeHolder,
  placeholderTxtColor,
  color,
  fontSize,
  fontWeight,
  handlePress,
  setShowPassword,
  showPassword = true,
  backgroundColor,
  keyboardType,
  elevation = true,
  icon = false,
  xml,
  label,
  security,
}: inputProps) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        shadowColor: icon && '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: icon ? 0.25 : null,
        shadowRadius: icon ? 3.84 : null,
        elevation: icon && elevation ? 5 : null,
        borderColor: icon && elevation ? null : '#EEEEEE',
        borderWidth: icon && elevation ? null : 2,
        backgroundColor: Colors.white,
        borderRadius: responsiveHeight(1),
        padding: responsiveHeight(1),
        gap: responsiveHeight(1),
        width: '100%',
      }}>
      {icon && (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: responsiveHeight(1),
          }}>
          <SvgIcons xml={xml} height={20} width={20} />
          <View
            style={{
              height: '60%',
              width: 0.9,
              backgroundColor: Colors.themeText,
            }}></View>
        </View>
      )}

      <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
        <View style={{ flex: security ? 0.99 : 1 }}>
          {label && (
            <View style={{ left: 4 }}>
              <NormalText txtAlign="center" title="Address" color="#808ca0" fontSize={responsiveFontSize(1.8)} />
            </View>
          )}
          <TextInput
            keyboardType={keyboardType}
            placeholderTextColor={placeholderTxtColor}
            placeholder={placeHolder}
            secureTextEntry={showPassword ? false : true}
            style={{
              color: color,
              fontSize: fontSize,
              fontWeight: fontWeight,
              height: 40,
            }}
            onChangeText={text => handlePress(text)}
          />
        </View>
        {security && (
          <TouchableOpacity
            style={{ left: 3 }}
            onPress={() => setShowPassword(!showPassword)}>
            {showPassword ? (
              <SvgIcons xml={eyeOff} height={20} width={20} />
            ) : (
              <SvgIcons xml={eye} height={15} width={15} />
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default Input;
