/* eslint-disable react-native/no-inline-styles */
import {
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, { useState } from 'react';
import { Colors } from '../../assets/colors';
import {
  responsiveHeight,
} from '../../assets/responsive_dimensions';
import { BoldText, NormalText } from '../../Components/Titles';
import { Button } from '../../Components/Button';
import SvgIcons from '../../Components/SvgIcons';
import { back, otp, security } from '../../assets/icons';

import Input from '../../Components/Input';
import { resetPassword, ShowToast } from '../../GlobalFunctions/Auth';
import { useSelector } from 'react-redux';
const ResetPass = ({ navigation,route }) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const {email} = route.params;
  console.log('email<<<<<',email);
  const [form, setForm] = useState({
    password: '',
    confirmPassword: '',
  });
  const handleInputChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };
  const resetPassIntegration = async () => {
    const { password, confirmPassword } = form;
    if (!password && confirmPassword) {
      ShowToast('error', 'Please Fill The Required Fields');
      setIsLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      ShowToast('error', 'Passwords must be the same');
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      const response = await resetPassword(email, password);
      ShowToast('success', 'Password Changed Successfully');
      console.log('response', response);
      navigation.navigate('Login');
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      ShowToast('error', error);
      console.log('error', error);
    }
  };
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        flexGrow: 1,
        backgroundColor: Colors.white,
        padding: 20,
        paddingTop: 30,
      }}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <SvgIcons xml={back} height={20} width={20} />
      </TouchableOpacity>
      <View
        style={{
          gap: responsiveHeight(1),
          marginBottom: responsiveHeight(1.5),
          flex: 0.8,
          justifyContent: 'center',
        }}>
        <SvgIcons align="center" xml={otp} height={150} width={150} />
        <BoldText alignSelf="center" txtAlign="center" mrgnTop={responsiveHeight(2)} title="Reset Password" />
        <NormalText
          color="#3B4C68"
          fontWeight="400"
          txtAlign="center"
          alignSelf="center"
          title="Please enter your new password to reset password"
        />

        <View style={{ marginTop: responsiveHeight(4), gap: responsiveHeight(4) }}>
          <Input
            icon
            xml={security}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            security={true}
            placeholderTxtColor={Colors.themeText}
            handlePress={text => handleInputChange('password', text)}
            color={Colors.themeText}
            backgroundColor={Colors.white}
            fontSize={16}
            fontWeight="bold"
            placeHolder="*********"
          />
          <Input
            icon
            xml={security}
            showPassword={showConfirmPassword}
            setShowPassword={setShowConfirmPassword}
            security={true}
            placeholderTxtColor={Colors.themeText}
            handlePress={text => handleInputChange('confirmPassword', text)}
            color={Colors.themeText}
            backgroundColor={Colors.white}
            fontSize={16}
            fontWeight="bold"
            placeHolder="*********"
          />
          <Button
            handlePress={() => resetPassIntegration()}
            textColor={Colors.white}
            bgColor={Colors.buttonBg}
            title={isLoading ? <ActivityIndicator size={'large'} color={Colors.white} /> : 'Continue'}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default ResetPass;

