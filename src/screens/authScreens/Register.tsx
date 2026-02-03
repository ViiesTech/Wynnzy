/* eslint-disable react-native/no-inline-styles */
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from 'react-native';
import React, { useState } from 'react';
import Input from '../../Components/Input';
import { Colors } from '../../assets/colors';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../assets/responsive_dimensions';
import { BoldText, NormalText } from '../../Components/Titles';
import { Button } from '../../Components/Button';
import { mail, security, tick, user } from '../../assets/icons';
import SvgIcons from '../../Components/SvgIcons';
import { ShowToast, Signup } from '../../GlobalFunctions/Auth';
import { setUserData } from '../../redux/Slices';
import { useDispatch } from 'react-redux';

const Register = ({ navigation, route }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const { fullName, email, password, confirmPassword } = form;
  const [accept, setAccept] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const dispatch = useDispatch();
  const handleInputChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };
  // const handleRegisteration = () => {
  //   if (!fullName || !email || !password || !confirmPassword) {
  //     ShowToast('error', 'Please fill all required fields');
  //     return;
  //   }
  //   if (password !== confirmPassword) {
  //     ShowToast('error', 'Passwords must be the same');
  //     return;
  //   }
  //   accept ?
  //     navigation.navigate('SelectType', { fullName, email, password, confirmPassword }) :
  //     ShowToast('error', 'Please accept the terms and conditions to proceed.');
  // };

  const handleRegisteration = async () => {
    console.log(route?.params?.currentCategory);
    if (!fullName || !email || !password || !confirmPassword) {
      ShowToast('error', 'Please fill all required fields');
      return;
    }
    if (password !== confirmPassword) {
      ShowToast('error', 'Passwords must be the same');
      return;
    }
    try {
      setIsLoading(true);
      const response = await Signup(fullName, email, password, route?.params?.currentCategory);
      if (response.success) {
        ShowToast('success', 'Registeration Successful');
        navigation.navigate('Otp', { registeration: true, email: response.data.email, token: response.accessToken });
      } else {
        ShowToast('error', response.message);
      }
      console.log('response', response);
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
      }}>
      <View style={{ paddingVertical: responsiveHeight(6) }}>
        <View
          style={{
            gap: responsiveHeight(1),
            marginBottom: responsiveHeight(3.5),
            flex: 0.1,
          }}>
          <BoldText alignSelf="center" title="Create Account" />
          <NormalText
            alignSelf="center"
            title="Sign up and discover around the world!"
          />
        </View>
        <View style={{ gap: responsiveHeight(2) }}>
          <Input
            icon
            xml={user}
            placeholderTxtColor={Colors.themeText}
            handlePress={text => handleInputChange('fullName', text)}
            color={Colors.themeText}
            backgroundColor={Colors.white}
            fontSize={16}
            fontWeight="bold"
            placeHolder="Full Name"
          />
          <Input
            icon
            xml={mail}
            placeholderTxtColor={Colors.themeText}
            handlePress={text => handleInputChange('email', text)}
            color={Colors.themeText}
            backgroundColor={Colors.white}
            fontSize={16}
            fontWeight="bold"
            placeHolder="Exampleemail@com"
          />
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
            placeHolder="password"
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
            placeHolder="confirm Password"
          />

          <Button
            handlePress={() => handleRegisteration()}
            textColor={Colors.white}
            bgColor={Colors.buttonBg}
            title={isLoading ? <ActivityIndicator size={'large'} color={Colors.white} /> : 'Sign Up'}
          />
        </View>
      </View>
      <View style={{ flex: 1, justifyContent: 'flex-end' }}>
        <TouchableOpacity onPress={() => setAccept(!accept)} style={{ flexDirection: 'row', gap: responsiveHeight(1), marginTop: responsiveHeight(4) }}>
          <TouchableOpacity onPress={() => setAccept(!accept)} style={{ height: responsiveHeight(4), marginTop: responsiveHeight(0.5), width: responsiveWidth(8), alignItems: 'center', justifyContent: 'center', borderWidth: accept ? null : 2, borderColor: accept ? null : Colors.buttonBg, borderRadius: responsiveHeight(1), backgroundColor: accept ? Colors.buttonBg : Colors.white }}>
            <SvgIcons xml={tick} height={15} width={15} />
          </TouchableOpacity>
          <NormalText width={responsiveWidth(80)} fontSize={responsiveFontSize(1.8)} color={Colors.themeText} title="By signing up, you agree to Pawcation Terms of Use and Privacy Policy. By providing your email, you consent to receive communications from Pawcation. You can opt-out anytime." />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Login')} style={{ alignItems: 'center', marginTop: responsiveHeight(4) }}>
          <Text style={{ color: Colors.themeText, fontSize: responsiveFontSize(2) }}>Already have an account ? <Text style={{ color: Colors.buttonBg, fontWeight: '700' }}>Sign in</Text></Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Register;

