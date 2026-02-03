/* eslint-disable react-native/no-inline-styles */
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from '../../../assets/responsive_dimensions';
import { images } from '../../../assets/images';
import Octicons from 'react-native-vector-icons/Octicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import BackIcon from '../../../Components/BackIcon';
import { Colors } from '../../../assets/colors';
import { Button } from '../../../Components/Button';
import { clearToken } from '../../../redux/Slices';
import { useDispatch, useSelector } from 'react-redux';
import { getAllPets, getPetProfile } from '../../../GlobalFunctions/Auth';
import { ImageBaseUrl } from '../../../BaseUrl';
import { useIsFocused } from '@react-navigation/native';

const UserProfile: React.FC = ({ navigation }) => {
  const dispatch = useDispatch();
  const { profileImage, fullName, _id } = useSelector(state => state?.user?.userData);
  const [data, setData] = useState([]);
  const isFocused = useIsFocused();

  console.log('data', data);
  const getAllPetsHandler = async () => {
    const response = await getAllPets(_id);
    setData(response.data);
  };
  useEffect(() => {
    getAllPetsHandler();
  }, [isFocused]);
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
      {/* Header Section */}
      <View>
        <View style={styles.backIconContainer}>

          <BackIcon />
        </View>
        <Image source={images.cover} style={styles.coverImage} />
        <View style={styles.profileContainer}>
          <Image source={profileImage ? { uri: `${ImageBaseUrl}${profileImage}` } : images.userDummy} style={styles.profileImage} />
          <TouchableOpacity onPress={() => navigation.navigate('EditUserProfile')} style={styles.editProfileButton}>
            <Octicons name={'plus'} size={responsiveFontSize(2)} color={'#FFFFFF'} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.spacer} />
      <Text style={styles.userName}>{fullName}</Text>
      {/* <Text style={styles.userExperience}>3 Years</Text> */}

      <TouchableOpacity onPress={() => navigation.navigate('EditUserProfile')} style={styles.editProfileContainer}>
        <Text>Edit Profile</Text>
      </TouchableOpacity>

      {/* Pet Images */}
      <View style={styles.petContainer}>
        <FlatList numColumns={2} data={data} columnWrapperStyle={{
          justifyContent: 'space-between', // <-- THIS is key for row-level spacing
        }} contentContainerStyle={{ justifyContent: 'space-between', gap: responsiveHeight(2) }} renderItem={({ item, index }) => {
          return (
            <TouchableOpacity onPress={() => navigation.navigate('PetProfile', { _id: item?._id })} key={index}>
              <Image source={{ uri: `${ImageBaseUrl}${item?.profileImage}` }} style={styles.petImage} />
              <View style={styles.editIconContainer}>
                <TouchableOpacity onPress={() => navigation.navigate('CreateProfile', { type: 'edit', _id: item?._id })} style={styles.editIcon}>
                  <MaterialIcons name={'edit'} size={responsiveFontSize(2)} color={'#FFFFFF'} />
                </TouchableOpacity>
              </View>
              <View style={styles.petNameContainer}>
                <Text style={styles.petName}>{item?.petName}</Text>
              </View>
            </TouchableOpacity>
          )
        }} />

      </View>
      {/* <TouchableOpacity onPress={() => navigation.navigate('CreateProfile')} >
        <Image source={images.dog6} style={styles.largePetImage} />
        <View style={[styles.editIconContainer, { right: responsiveHeight(4), top: responsiveHeight(2.5) }]}>
          <TouchableOpacity onPress={() => navigation.navigate('CreateProfile')} style={styles.editIcon}>
            <MaterialIcons name={'edit'} size={responsiveFontSize(2)} color={'#FFFFFF'} />
          </TouchableOpacity>
        </View>
        <View style={[styles.petNameContainer, { left: responsiveHeight(4) }]}>
          <Text style={styles.petName}>Bella</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.petContainer}>
        {[images.dog7, images.dog7].map((dog, index) => (
          <TouchableOpacity onPress={() => navigation.navigate('CreateProfile')} key={index}>
            <Image source={dog} style={styles.petImage} />
            <View style={styles.editIconContainer}>
              <TouchableOpacity onPress={() => navigation.navigate('CreateProfile')} style={styles.editIcon}>
                <MaterialIcons name={'edit'} size={responsiveFontSize(2)} color={'#FFFFFF'} />
              </TouchableOpacity>
            </View>
            <View style={styles.petNameContainer}>
              <Text style={styles.petName}>Bella</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View> */}

      <Button handlePress={() => dispatch(clearToken())} title="Logout" bgColor={Colors.buttonBg} textColor={Colors.white} width={responsiveWidth(90)} mrgnTop={responsiveHeight(2)} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: { flexGrow: 1, paddingBottom: responsiveHeight(2) },
  backButton: {
    backgroundColor: Colors.buttonBg,
    height: responsiveHeight(5),
    width: responsiveHeight(5),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  coverImage: { height: responsiveHeight(30), width: responsiveWidth(100) },
  profileContainer: {
    height: responsiveHeight(15),
    width: responsiveHeight(15),
    alignSelf: 'center',
    position: 'absolute',
    zIndex: 10,
    bottom: -50,
  },
  profileImage: { height: responsiveHeight(15), width: responsiveHeight(15), borderRadius: responsiveHeight(15) },
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
  spacer: { height: responsiveHeight(7) },
  userName: { alignSelf: 'center', fontSize: responsiveFontSize(2), fontWeight: '900', color: Colors.labelText },
  userExperience: { alignSelf: 'center', fontSize: responsiveFontSize(1.5), fontWeight: '500', color: '#2A1E51' },
  editProfileContainer: {
    padding: 10,
    width: responsiveWidth(90),
    alignSelf: 'center',
    borderWidth: 1,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  backIconContainer: {
    position: 'absolute',
    zIndex: 10,
    top: 10,
    left: 10,
  },
  petContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    width: responsiveWidth(90),
    marginTop: 20,
    justifyContent: 'space-between',
  },
  petImage: { width: responsiveWidth(44), height: responsiveHeight(15), borderRadius: 10, overflow: 'hidden' },
  largePetImage: {
    width: responsiveWidth(90),
    height: responsiveHeight(15),
    borderRadius: 10,
    overflow: 'hidden',
    alignSelf: 'center',
    marginTop: 10,
  },
  editIconContainer: { position: 'absolute', top: 10, right: 10 },
  editIcon: {
    backgroundColor: Colors.buttonBg,
    height: responsiveHeight(4),
    width: responsiveHeight(4),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  petNameContainer: { position: 'absolute', bottom: 10, left: 10 },
  petName: { color: '#FFFFFF', fontWeight: 'bold', fontSize: responsiveFontSize(2) },
});

export default UserProfile;
