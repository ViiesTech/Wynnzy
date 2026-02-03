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
import { back, mail, otp } from '../../assets/icons';
import Input from '../../Components/Input';
import { forgetPasswordApi, ShowToast } from '../../GlobalFunctions/Auth';

const ForgotPass = ({ navigation }) => {
  const [email, setEmail] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleForgotPass = async () => {
    if (!email) {
      ShowToast('error', 'Please enter your email');
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      const response = await forgetPasswordApi(email);
      ShowToast('success', 'Otp Sent Successfully');
      console.log('response', response);
      navigation.navigate('Otp', { registeration: false, email: email });
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
        // justifyContent: 'center',
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
        <BoldText alignSelf="center" mrgnTop={responsiveHeight(2)} title="Forgot password" />
        <NormalText
          color="#3B4C68"
          fontWeight="400"
          txtAlign="center"
          alignSelf="center"
          title="Please enter your email to reset password"
        />
        <View style={{ marginTop: responsiveHeight(4), gap: responsiveHeight(4) }}>
          <Input
            icon
            xml={mail}
            placeholderTxtColor={Colors.themeText}
            handlePress={text => setEmail(text)}
            color={Colors.themeText}
            backgroundColor={Colors.white}
            fontSize={16}
            fontWeight="bold"
            placeHolder="Exampleemail@com"
          />
          <Button
            handlePress={() => handleForgotPass()}
            textColor={Colors.white}
            bgColor={Colors.buttonBg}
            title={isLoading ? <ActivityIndicator size={'large'} color={Colors.white} /> : 'Continue'}
          />
        </View>
      </View>

    </ScrollView>
  );
};

export default ForgotPass;

