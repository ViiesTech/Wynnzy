/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  ScrollView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import Octicons from 'react-native-vector-icons/Octicons';
import Entypo from 'react-native-vector-icons/Entypo';
import {launchImageLibrary} from 'react-native-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import {useSelector} from 'react-redux';

import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../../assets/responsive_dimensions';
import {images} from '../../../assets/images';
import {Colors} from '../../../assets/colors';
import {Button} from '../../../Components/Button';
import {
  createPetProfile,
  editPetProfile,
  getPetProfile,
  ShowToast,
} from '../../../GlobalFunctions/Auth';
import {ImageBaseUrl} from '../../../BaseUrl';
import UserHeader from '../../../Components/UserHeader';
import FastImage from 'react-native-fast-image';

const AddPetProfile = ({navigation, route}: any) => {
  const petId = route?.params?.petId;
  const {_id: userId} = useSelector((state: any) => state.user.userData);

  const [isLoading, setIsLoading] = useState(false);
  const [imagePath, setImagePath] = useState<string | null>(null);
  const [petImages, setPetImages] = useState<string[]>([]);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

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

  useEffect(() => {
    if (petId) {
      getPetData();
    }
  }, []);

  const getPetData = async () => {
    setIsLoading(true);
    const response = await getPetProfile(petId);
    if (response?.success) {
      const res = response.data;

      setForm({
        petName: res.petName || '',
        breed: res.breed || '',
        size: res.size || '',
        specialCare: res.specialCareNeed || '',
        height: String(res.height || ''),
        weight: String(res.weight || ''),
        color: res.color || '',
        description: res.description || '',
        behaviour: res.behaviour?.[0] || '',
      });
      setDate(res.dob ? new Date(res.dob) : new Date());
      setImagePath(
        res.profileImage ? `${ImageBaseUrl}${res.profileImage}` : null,
      );
      setPetImages(
        res.petImages?.map((img: string) => `${ImageBaseUrl}${img}`) || [],
      );
    }
    setIsLoading(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setForm(prev => ({...prev, [field]: value}));
  };

  const selectMainImage = async () => {
    const result = await launchImageLibrary({mediaType: 'photo', quality: 0.7});
    if (result.assets?.[0]?.uri) {
      setImagePath(result.assets[0].uri);
    }
  };

  const selectMultipleImages = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.7,
      selectionLimit: 0,
    });
    if (result.assets) {
      const selectedUris = result.assets.map(asset => asset.uri!);
      setPetImages(prev => [...prev, ...selectedUris]);
    }
  };

  const removeImage = (index: number) => {
    setPetImages(prev => prev.filter((_, i) => i !== index));
  };

  const submitHandler = async () => {
    // Basic Validation
    if (!form.petName || !imagePath) {
      return ShowToast('error', 'Pet name and profile image are required');
    }

    setIsLoading(true);
    const formattedDate = moment(date).toISOString();

    const apiCall = petId
      ? () =>
          editPetProfile(
            petId,
            form.petName,
            formattedDate,
            form.breed,
            form.size,
            form.specialCare,
            petImages,
            form.weight,
            form.height,
            form.color,
            imagePath,
            form.behaviour,
            form.description,
          )
      : () =>
          createPetProfile(
            userId,
            form.petName,
            formattedDate,
            form.breed,
            form.size,
            form.specialCare,
            petImages,
            form.weight,
            form.height,
            form.color,
            imagePath,
            form.behaviour,
            form.description,
          );

    const response = await apiCall();
    setIsLoading(false);

    if (response.success) {
      ShowToast(
        'success',
        `Profile ${petId ? 'updated' : 'created'} successfully`,
      );
      navigation.goBack();
    } else {
      ShowToast('error', response.message);
    }
  };

  const renderInputField = (
    label: string,
    field: keyof typeof form,
    placeholder: string,
    multiline = false,
  ) => {
    return (
      <View style={[styles.inputContainer, styles.shadow]}>
        <Text style={styles.inputLabel}>{label}</Text>
        <TextInput
          value={form[field]}
          onChangeText={text => handleInputChange(field, text)}
          placeholder={placeholder}
          placeholderTextColor={'#A6A6A6'}
          multiline={multiline}
          scrollEnabled={!multiline}
          autoCapitalize={multiline ? 'sentences' : 'words'}
          textAlignVertical={multiline ? 'top' : 'center'}
          style={[
            styles.inputStyle,
            multiline && {height: responsiveHeight(12)},
          ]}
        />
      </View>
    );
  };

  console.log('imagePath in AddPetProfile:-', imagePath);
  console.log('petImages in AddPetProfile:-', petImages);

  return (
    <View style={styles.container}>
      <UserHeader
        title={petId ? 'Edit Pet Profile' : 'Create Pet Profile'}
        navigation={navigation}
        backIcon={true}
        centerText={true}
      />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <View style={{padding: responsiveHeight(2.5)}}>
          {/* Profile Image Picker */}
          <View style={styles.imagePickerWrapper}>
            <FastImage
              source={imagePath ? {uri: imagePath} : (images.petPH as any)}
              style={styles.mainProfileImage}
              resizeMode={FastImage.resizeMode.cover}
            />
            <TouchableOpacity
              onPress={selectMainImage}
              style={styles.plusButton}>
              <Octicons
                name="plus"
                size={responsiveFontSize(2)}
                color={'#FFFFFF'}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={{marginHorizontal: responsiveHeight(2.5)}}>
          {renderInputField('Pet Name', 'petName', 'Buddy')}

          {/* Date Picker */}
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={[styles.inputContainer, styles.shadow]}>
            <Text style={styles.inputLabel}>Date Of Birth</Text>
            <Text style={styles.dateText}>
              {moment(date).format('MMM Do YYYY')}
            </Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) {
                  setDate(selectedDate);
                }
              }}
            />
          )}

          {renderInputField('Breed', 'breed', 'Golden Retriever')}
          {renderInputField('Size', 'size', 'Medium')}
          {renderInputField('Special Care Need', 'specialCare', 'None')}

          <View style={styles.row}>
            <View style={{flex: 1}}>
              {renderInputField('Weight (kg)', 'weight', '15')}
            </View>
            <View style={{width: 15}} />
            <View style={{flex: 1}}>
              {renderInputField('Height (cm)', 'height', '50')}
            </View>
          </View>

          {renderInputField('Color', 'color', 'Golden')}
          {renderInputField('Behaviour', 'behaviour', 'Friendly, Active')}
          {renderInputField(
            'Description',
            'description',
            'A very loyal dog...',
            true,
          )}
        </View>

        <View style={{padding: responsiveHeight(2.5)}}>
          <Text style={[styles.inputLabel, {marginBottom: 10}]}>
            Gallery Images
          </Text>
          {petImages?.length === 0 ? (
            <TouchableOpacity onPress={selectMultipleImages}>
              <FastImage
                source={images.upload as any}
                style={styles.uploadPlaceholder}
              />
            </TouchableOpacity>
          ) : (
            <View style={{marginTop: 0}}>
              {petImages.map((img, index) => {
                if (index % 2 === 0) {
                  const nextImg = petImages[index + 1];
                  return (
                    <View key={index} style={styles.imageRow}>
                      <View style={styles.imageWrapper}>
                        <FastImage
                          source={{uri: img}}
                          style={styles.galleryImageHalf}
                          resizeMode={FastImage.resizeMode.cover}
                        />
                        <TouchableOpacity
                          onPress={() => removeImage(index)}
                          style={styles.removeIconContainer}>
                          <Entypo
                            name="cross"
                            size={responsiveFontSize(2)}
                            color={Colors.white}
                          />
                        </TouchableOpacity>
                      </View>
                      {nextImg ? (
                        <View style={styles.imageWrapper}>
                          <FastImage
                            source={{uri: nextImg}}
                            style={styles.galleryImageHalf}
                            resizeMode={FastImage.resizeMode.cover}
                          />
                          <TouchableOpacity
                            onPress={() => removeImage(index + 1)}
                            style={styles.removeIconContainer}>
                            <Entypo
                              name="cross"
                              size={responsiveFontSize(2)}
                              color={Colors.white}
                            />
                          </TouchableOpacity>
                        </View>
                      ) : (
                        <View style={{width: responsiveWidth(44)}} />
                      )}
                    </View>
                  );
                }
                return null;
              })}
            </View>
          )}

          <View style={{marginTop: 20}}>
            <Button
              title={petId ? 'Update Profile' : 'Create Profile'}
              isLoading={isLoading}
              handlePress={submitHandler}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  imagePickerWrapper: {alignSelf: 'center', marginTop: responsiveHeight(1.5)},
  mainProfileImage: {
    height: responsiveHeight(14),
    width: responsiveHeight(14),
    borderRadius: responsiveHeight(7),
    backgroundColor: Colors.lightGray,
  },
  plusButton: {
    backgroundColor: Colors.buttonBg,
    height: 35,
    width: 35,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  inputContainer: {
    padding: 12,
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginTop: 15,
  },
  shadow: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {elevation: 3},
    }),
  },
  inputLabel: {
    fontSize: responsiveFontSize(1.8),
    color: '#2A1F51',
    fontWeight: '700',
  },
  inputStyle: {
    color: '#2A1F51',
    fontSize: responsiveFontSize(1.8),
    marginTop: 5,
    padding: 0,
  },
  dateText: {color: '#2A1F51', marginTop: 8, fontSize: responsiveFontSize(1.8)},
  row: {flexDirection: 'row', justifyContent: 'space-between'},
  uploadPlaceholder: {
    height: responsiveHeight(16),
    width: '100%',
    resizeMode: 'contain',
  },
  imageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  galleryImageHalf: {
    width: responsiveWidth(43),
    height: responsiveHeight(15),
    borderRadius: 10,
    backgroundColor: Colors.lightGray,
  },
  imageWrapper: {
    position: 'relative',
    width: responsiveWidth(43),
    height: responsiveHeight(15),
  },
  removeIconContainer: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: Colors.buttonBg,
    borderRadius: 15,
    width: 25,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default AddPetProfile;
