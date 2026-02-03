/* eslint-disable react-native/no-inline-styles */
import { View, ScrollView, Image, TouchableOpacity, TextInput } from 'react-native';
import React, { useState } from 'react';
import { Colors } from '../../../assets/colors';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from '../../../assets/responsive_dimensions';
import BackIcon from '../../../Components/BackIcon';
import { NormalText } from '../../../Components/Titles';
import { images } from '../../../assets/images';
import { upload2, user } from '../../../assets/icons';
import SvgIcons from '../../../Components/SvgIcons';
import Input from '../../../Components/Input';
import { Button } from '../../../Components/Button';
import Slider from '@react-native-community/slider';
import { selectImageFromGallery } from '../../../GlobalFunctions';
import { ShowToast } from '../../../GlobalFunctions/Auth';

const CreateProfile = ({ navigation }) => {
  const [form, setForm] = useState({
    fullName: '',
    storeName: '',
    contactNo: '',
    bio: '',
  });
  const [experienceLvl, setExperienceLvl] = useState(5);
  const { fullName, storeName, contactNo, bio } = form;
  const [imageUri, setImageUri] = useState(null);
  console.log('imageuri', imageUri);
  console.log('form', form);
  console.log('experienceLvl', experienceLvl);
  const handleInputChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };
  const selectImageHandler = async () => {
    try {
      const response = await selectImageFromGallery();
      if (response) {
        setImageUri(response);
      }
    } catch (error) {
      console.log('Image selection failed:', error);

    }
  };

  const handleNext = () => {
    if (!imageUri) {
      return ShowToast('error', 'Plz Choose Your Profile Picture');
    }
    if (fullName && storeName && contactNo && bio) {
      navigation.navigate('CreateBussProfile', { type: 'create', fullName, storeName, contactNo, bio, experienceLvl, imageUri });
    } else {
      return ShowToast('error', 'Plz Fill The Required Fields');
    }
  };
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, backgroundColor: Colors.white, padding: responsiveHeight(2) }}>
      {/* <BackIcon /> */}
      <View style={{ marginTop: responsiveHeight(4) }}>
        <NormalText fontSize={responsiveFontSize(2.8)} fontWeight="800" alignSelf="center" title="Create Profile" />
        <NormalText alignSelf="center" title="Please enter your details" color="#3B4B68" />
      </View>
      <View style={{ alignSelf: 'center', marginTop: responsiveHeight(4) }}>
        <Image source={imageUri ? { uri: imageUri } : images.profilePic} style={{ height: responsiveHeight(20), width: responsiveWidth(40), borderRadius: responsiveHeight(2) }} />
        <TouchableOpacity onPress={selectImageHandler} style={{ position: 'absolute', bottom: responsiveHeight(-2), right: responsiveHeight(-1.5), backgroundColor: Colors.white, borderRadius: responsiveHeight(5), padding: responsiveHeight(2), alignItems: 'center', justifyContent: 'center', width: responsiveWidth(13.5) }}>
          <SvgIcons xml={upload2} height={20} width={20} />
        </TouchableOpacity>
      </View>
      <View style={{ marginTop: responsiveHeight(4), gap: responsiveHeight(2) }}>

        <Input showPassword handlePress={text => handleInputChange('fullName', text)} icon={true} elevation={false} xml={user} placeHolder="Full Name" placeholderTxtColor="#3b4b68" />
        <Input showPassword handlePress={text => handleInputChange('storeName', text)} icon={true} elevation={false} xml={user} placeHolder="Store Name" placeholderTxtColor="#3b4b68" />
        <Input keyboardType="numeric" showPassword handlePress={text => handleInputChange('contactNo', text)} icon={true} elevation={false} xml={user} placeHolder="Contact Number(Without Dash)" placeholderTxtColor="#3b4b68" />
        <TextInput multiline verticalAlign="top" onChangeText={text => handleInputChange('bio', text)} placeholder="Bio" textAlignVertical="top" placeholderTextColor={'#3B4B68'} style={{ height: responsiveHeight(15), borderRadius: responsiveHeight(1), fontWeight: '400', padding: responsiveHeight(2.5), width: '100%', borderColor: '#EFEFEF', borderWidth: 2 }} />
        <NormalText fontSize={responsiveFontSize(2.8)} fontWeight="800" title="Experience Level" />
        <Slider
          style={{ width: '100%', height: 20, justifyContent: 'center' }}
          minimumValue={5}
          value={experienceLvl}
          onSlidingComplete={(val) => setExperienceLvl(val)}
          maximumValue={15}
          thumbTintColor={Colors.buttonBg}
          minimumTrackTintColor={Colors.buttonBg}
          maximumTrackTintColor="grey"
        />
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: responsiveHeight(2) }}>
          <NormalText title="5" />
          <NormalText title="10" />
          <NormalText title="15" />
        </View>
        <Button handlePress={handleNext} mrgnTop={responsiveHeight(1)} title="Next" bgColor={Colors.buttonBg} textColor={Colors.white} />
      </View>
    </ScrollView>
  );
};

export default CreateProfile;
