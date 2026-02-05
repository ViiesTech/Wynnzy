/* eslint-disable react-native/no-inline-styles */
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Colors} from '../../../assets/colors';
import {images} from '../../../assets/images';
import {
  responsiveFontSize,
  responsiveHeight,
} from '../../../assets/responsive_dimensions';
import Octicons from 'react-native-vector-icons/Octicons';
import {launchImageLibrary} from 'react-native-image-picker';
import {Button} from '../../../Components/Button';
import {updateUser} from '../../../GlobalFunctions/Auth';
import {useDispatch, useSelector} from 'react-redux';
import BackIcon from '../../../Components/BackIcon';
import {NormalText} from '../../../Components/Titles';
import {ImageBaseUrl} from '../../../BaseUrl';

const EditUserProfile = ({navigation, route}: any) => {
  const [imagePath, setImagePath] = useState(null);
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const {userData} = useSelector(state => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    setFullName(userData?.fullName);
    // setImagePath(userData?.profileImage);
  }, [userData]);

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

  const handleEditProfile = async () => {
    setIsLoading(true);
    try {
      await updateUser(
        userData?._id ? userData?._id : userData.id,
        imagePath,
        fullName,
        navigation,
        dispatch,
      );
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
    setIsLoading(false);
  };
  console.log('imagePath in EditUserProfile:-', imagePath);
  console.log('userData in EditUserProfile:-', userData);
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.white,
        padding: responsiveHeight(3),
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <BackIcon />
        <NormalText
          alignSelf="center"
          fontWeight="900"
          fontSize={responsiveFontSize(2.7)}
          title="Edit Profile"
        />
        <Text style={{color: Colors.white}}>a</Text>
      </View>
      <View style={styles.profileContainer}>
        <Image
          source={
            imagePath
              ? {uri: imagePath}
              : userData?.profileImage
              ? {uri: `${ImageBaseUrl}${userData?.profileImage}`}
              : images.greyProfileBg
          }
          style={styles.profileImage}
        />
        <TouchableOpacity
          onPress={selectImage}
          style={styles.editProfileButton}>
          <Octicons
            name={'plus'}
            size={responsiveFontSize(2)}
            color={'#FFFFFF'}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        <Text style={styles.heading}>Full Name</Text>
        <TextInput
          value={fullName}
          onChangeText={text => setFullName(text)}
          placeholder="Enter Name"
          placeholderTextColor={'#A6A6A6'}
          style={styles.InputStyles}
        />
      </View>
      <Button
        textColor="white"
        handlePress={handleEditProfile}
        title={
          isLoading ? (
            <ActivityIndicator size={'large'} color={Colors.white} />
          ) : (
            'Edit Profile'
          )
        }
        bgColor={Colors.buttonBg}
        mrgnTop={responsiveHeight(4)}
      />
    </View>
  );
};

export default EditUserProfile;
const styles = StyleSheet.create({
  profileImage: {
    height: responsiveHeight(14.7),
    width: responsiveHeight(15),
    borderRadius: responsiveHeight(10),
    resizeMode: 'stretch',
  },
  InputStyles: {
    height: responsiveHeight(5),
    color: '#2A1F51',
  },
  profileContainer: {
    height: responsiveHeight(15),
    width: responsiveHeight(15),
    alignSelf: 'center',
    marginTop: responsiveHeight(4),
    // position: 'absolute',
    // zIndex: 10,
    // bottom: -50,
  },
  editProfileButton: {
    backgroundColor: Colors.buttonBg,
    height: responsiveHeight(5),
    width: responsiveHeight(5),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
    position: 'absolute',
    zIndex: 11,
    bottom: 0,
    right: 0,
  },
  container: {
    paddingHorizontal: 10,
    paddingTop: responsiveHeight(1),
    backgroundColor: '#FFFF',
    elevation: 10,
    borderRadius: 10,
    marginTop: 20,
    justifyContent: 'center',
  },
  heading: {
    fontSize: responsiveFontSize(2),
    color: Colors.labelText,
    fontWeight: '600',
  },
});
