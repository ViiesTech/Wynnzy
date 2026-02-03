/* eslint-disable react-native/no-inline-styles */
import { View, Text, Image, TextInput, StyleSheet, ScrollView, ActivityIndicator, Platform } from 'react-native';
import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import Octicons from 'react-native-vector-icons/Octicons';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from '../../../assets/responsive_dimensions';
import { images } from '../../../assets/images';
import BackIcon from '../../../Components/BackIcon';
import { BoldText } from '../../../Components/Titles';
import { Colors } from '../../../assets/colors';
import { Button } from '../../../Components/Button';
import { launchImageLibrary } from 'react-native-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { createPetProfile, editPetProfile, ShowToast } from '../../../GlobalFunctions/Auth';
import { useDispatch, useSelector } from 'react-redux';
const Create_Pet_Profile = ({ navigation, route }) => {
  const [imagePath, setImagePath] = useState();
  const [petImages, setPetImages] = useState([]);
  const [date, setDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [show, setShow] = useState(false);
  const { type } = route?.params;
  const { _id } = useSelector(state => state.user.userData);
  const onChange = (event, selectedDate) => {
    setShow(false);  // Hide the picker after selecting
    if (selectedDate) {
      setDate(selectedDate);
    }
  };
  const [form, setForm] = useState({
    petName: '',
    breed: '',
    size: '',
    specialCare: '',
    height: '',
    weight: '',
    color: '',
    description: '',
    behaviour: '',
  });
  console.log('route?.params?._id', route?.params?._id);
  const dispatch = useDispatch();
  const handleInputChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };
  const selectImage = async () => {
    try {
      const options = {
        mediaType: 'photo', // Allows only photos (Change to 'mixed' for both video & photo)
        quality: 1, // Best quality (1 = 100%)
      };

      const result = await launchImageLibrary(options);

      if (result.didCancel) {
        console.log('User cancelled image picker');
      } else if (result.errorMessage) {
        console.log('ImagePicker Error: ', result.errorMessage);
      } else {
        setImagePath(result.assets[0].uri);
        console.log('Image Selected: ', result.assets[0].uri); // Access the selected image URI
      }
    } catch (error) {
      console.log('Error selecting image:', error);
    }
  };
  const selectPetImages = async () => {
    try {
      const options = {
        mediaType: 'photo',
        quality: 1,
        selectionLimit: 0, // 0 = unlimited multiple selection
      };

      const result = await launchImageLibrary(options);

      if (result.didCancel) {
        console.log('User cancelled image picker');
      } else if (result.errorMessage) {
        console.log('ImagePicker Error: ', result.errorMessage);
      } else {
        const selectedUris = result.assets?.map(asset => asset.uri) || [];

        setPetImages(prevImages => [...prevImages, ...selectedUris]);

        console.log('Images Selected: ', selectedUris);
      }
    } catch (error) {
      console.log('Error selecting images:', error);
    }
  };
  const { petName, breed, size, specialCare, height, weight, color, description, behaviour } = form;

  const createPetProfileHandler = async () => {
    const formattedDate = moment(date).toISOString();
    setIsLoading(true);
    const response = await createPetProfile(_id, petName, formattedDate, breed, size, specialCare, petImages, weight, height, color, imagePath, behaviour, description);
    if (response.success) {
      navigation.goBack();
    }
    setIsLoading(false);
  };

  const editPetProfileHandler = async () => {
    const formattedDate = moment(date).toISOString();
    setIsLoading(true);
    const response = await editPetProfile(route?.params?._id, petName, formattedDate, breed, size, specialCare, petImages, weight, height, color, imagePath, behaviour, description);
    console.log('response', response)
    if (response.success) {
      navigation.goBack();
    } else {
      ShowToast('error', response.message);
    }
    setIsLoading(false);
  };
  const shadowStyle = Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
    android: {
      elevation: 10,
    },
  });
  // https://predemo.site/Pawcation/api/pet/updatePet
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: Colors.white }} showsVerticalScrollIndicator={false}>
      <View style={{ padding: responsiveHeight(2.5) }}>
        <BackIcon />
        <BoldText fontWeight="800" fontSize={responsiveFontSize(2.3)} mrgnTop={responsiveHeight(3)} title={`${type === 'edit' ? 'Edit' : 'Create'} Profile`} />
        <View
          style={{
            // height: responsiveHeight(12),
            // width: responsiveHeight(12),
            alignSelf: 'center',
            marginTop: responsiveHeight(1.5),
          }}>
          <Image

            source={imagePath ? { uri: imagePath } : images.userDummy}
            style={{
              height: responsiveHeight(15),
              width: responsiveWidth(25),
              aspectRatio: 1,
              resizeMode: 'cover',  // Keeps the aspect ratio intact
              borderRadius: responsiveHeight(7.5),  // For rounded corners (half of height)
            }}
          />
          <TouchableOpacity
            onPress={selectImage}
            style={{
              backgroundColor: Colors.buttonBg,
              height: responsiveHeight(4),
              width: responsiveHeight(4),
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 100,
              position: 'absolute',
              zIndex: 11,
              bottom: 0,
              right: 0,
            }}>
            <Octicons
              name={'plus'}
              size={responsiveFontSize(2)}
              color={'#FFFFFF'}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ marginHorizontal: responsiveHeight(2.5) }}>

        <View style={[styles.container, shadowStyle]}>
          <Text style={styles.heading}>Pet Name</Text>
          <TextInput
            onChangeText={text => handleInputChange('petName', text)}
            placeholder="Enter Name" placeholderTextColor={'#A6A6A6'} style={styles.InputStyles} />
        </View>

        <TouchableOpacity onPress={() => setShow(true)} style={[styles.container, shadowStyle]}>
          <Text style={styles.heading}>Date Of Birth</Text>
          <Text style={{ color: '#2A1F51', marginVertical: responsiveHeight(1) }}>{date ? moment(date).format('MMM Do YY') : 'DD/MM/YYYY'}</Text>
        </TouchableOpacity>
        {show && (
          <DateTimePicker
            value={date}
            mode="date" // 'date' or 'time'
            display="default" // 'default', 'spinner', 'calendar', 'clock'
            onChange={onChange}
          />
        )}

        <View style={[styles.container, shadowStyle]}>
          <Text style={styles.heading}>Breed</Text>
          <TextInput
            onChangeText={text => handleInputChange('breed', text)}
            placeholder="Enter Breed" placeholderTextColor={'#A6A6A6'} style={styles.InputStyles} />
        </View>


        <View style={[styles.container, shadowStyle]}>
          <Text style={styles.heading}>Size</Text>
          <TextInput onChangeText={text => handleInputChange('size', text)} placeholder="2 feet" placeholderTextColor={'#A6A6A6'} style={styles.InputStyles} />
        </View>

        <View style={[styles.container, shadowStyle]}>
          <Text style={styles.heading}>Special Care Need</Text>
          <TextInput onChangeText={text => handleInputChange('specialCare', text)} placeholder="Enter" placeholderTextColor={'#A6A6A6'} style={styles.InputStyles} />
        </View>
        <View style={[styles.container, shadowStyle]}>
          <Text style={styles.heading}>Weight (In Kgs)</Text>
          <TextInput onChangeText={text => handleInputChange('weight', text)} placeholder="Enter Weight" placeholderTextColor={'#A6A6A6'} style={styles.InputStyles} />
        </View>
        <View style={[styles.container, shadowStyle]}>
          <Text style={styles.heading}>Height (In cms)</Text>
          <TextInput onChangeText={text => handleInputChange('height', text)} placeholder="Enter Height" placeholderTextColor={'#A6A6A6'} style={styles.InputStyles} />
        </View>
        <View style={[styles.container, shadowStyle]}>
          <Text style={styles.heading}>Color</Text>
          <TextInput onChangeText={text => handleInputChange('color', text)} placeholder="Enter Color" placeholderTextColor={'#A6A6A6'} style={styles.InputStyles} />
        </View>
        <View style={[styles.container, shadowStyle]}>
          <Text style={styles.heading}>Behaviour</Text>
          <TextInput onChangeText={text => handleInputChange('behaviour', text)} placeholder="Friendly" placeholderTextColor={'#A6A6A6'} style={styles.InputStyles} />
        </View>
        <View style={[styles.container, shadowStyle]}>
          <Text style={styles.heading}>Description</Text>
          <TextInput textAlignVertical="top" multiline onChangeText={text => handleInputChange('description', text)} placeholder="Enter Description" placeholderTextColor={'#A6A6A6'} style={{ height: responsiveHeight(15), color: '#2A1F51' }} />
        </View>
      </View>
      <View style={{ padding: responsiveHeight(2.5) }}>
        <TouchableOpacity onPress={selectPetImages}>
          <Image source={images.upload} style={{ width: responsiveWidth(90), alignSelf: 'center', height: responsiveHeight(15), marginTop: 20, resizeMode: 'stretch' }} />
        </TouchableOpacity>
        {/* <View style={{ flexDirection: 'row', alignSelf: 'center', width: responsiveWidth(90), marginTop: 20, justifyContent: 'space-between' }}>
          <Image source={images.dog1} style={{ width: responsiveWidth(44), height: responsiveHeight(15), borderRadius: 10, overflow: 'hidden' }} />
          <Image source={images.dog2} style={{ width: responsiveWidth(44), height: responsiveHeight(15), borderRadius: 10, overflow: 'hidden' }} />
        </View>
        <Image source={images.dog3} style={{ width: responsiveWidth(90), height: responsiveHeight(15), marginBottom: responsiveHeight(2), borderRadius: 10, overflow: 'hidden', alignSelf: 'center', marginTop: 10 }} /> */}
        <View style={{ marginTop: 20 }}>
          {petImages.map((_, index) => {
            if (index % 2 === 0) {
              const secondImage = petImages[index + 1];

              if (secondImage) {
                // render two in a row
                return (
                  <View
                    key={index}
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      width: responsiveWidth(90),
                      alignSelf: 'center',
                      marginBottom: 10,
                    }}>
                    <Image
                      source={{ uri: petImages[index] }}
                      style={{
                        width: responsiveWidth(44),
                        height: responsiveHeight(15),
                        borderRadius: 10,
                      }}
                    />
                    <Image
                      source={{ uri: secondImage }}
                      style={{
                        width: responsiveWidth(44),
                        height: responsiveHeight(15),
                        borderRadius: 10,
                      }}
                    />
                  </View>
                );
              } else {
                // if last image and it's odd
                return (
                  <Image
                    key={index}
                    source={{ uri: petImages[index] }}
                    style={{
                      width: responsiveWidth(90),
                      height: responsiveHeight(15),
                      borderRadius: 10,
                      alignSelf: 'center',
                      marginBottom: 10,
                    }}
                  />
                );
              }
            }
          })}
        </View>


        <Button handlePress={type === 'edit' ? editPetProfileHandler : createPetProfileHandler} textColor="white" title={isLoading ? (<ActivityIndicator size={'large'} color={Colors.white} />) : type === 'edit' ? 'Edit Now' : 'Create Now'} bgColor={Colors.buttonBg} borderColor={''} borderRadius={0} xml={''} width={0} height={0} textFont={0} />

      </View>
    </ScrollView>
  );
};

export default Create_Pet_Profile;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingTop: responsiveHeight(1),
    backgroundColor: '#FFFF',
    borderRadius: 10,
    marginTop: 20,
    justifyContent: 'center',
  },
  InputStyles: {
    height: responsiveHeight(5), color: '#2A1F51',
  },

  heading: { fontSize: responsiveFontSize(2), color: '#2A1F51', fontWeight: '600' },
});
