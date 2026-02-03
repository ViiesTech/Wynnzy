/* eslint-disable react-native/no-inline-styles */
import { View, ScrollView, Platform, PermissionsAndroid, Alert, FlatList, Image, TouchableOpacity, ActivityIndicator, Text, TextInput } from 'react-native';
import React, { useEffect, useState } from 'react';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from '../../../assets/responsive_dimensions';
import { Colors } from '../../../assets/colors';
import BackIcon from '../../../Components/BackIcon';
import { NormalText } from '../../../Components/Titles';
import Input from '../../../Components/Input';
import { cut, tick, upload, upload2, upload3, user } from '../../../assets/icons';
import ListHeading from '../../../Components/ListHeading';
import { images } from '../../../assets/images';
import SvgIcons from '../../../Components/SvgIcons';
import { Button } from '../../../Components/Button';
import PickerCard from '../../../Components/PickerCard';
import { selectImageFromGallery } from '../../../GlobalFunctions';
import { createBusinessProfile, editBusinessProfile, ShowToast } from '../../../GlobalFunctions/Auth';
import { useDispatch, useSelector } from 'react-redux';
import { clearToken } from '../../../redux/Slices';
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import FileViewer from 'react-native-file-viewer';
import { ImageBaseUrl } from '../../../BaseUrl';

const CreateBussProfile = ({ navigation, route }) => {
  const { type, fullName, storeName, contactNo, bio, experienceLvl, imageUri } = route.params;
  const [accept, setAccept] = useState<boolean>(true);
  const [value, setValue] = useState<Array | null>();
  const [value2, setValue2] = useState<Array | null>();
  const dispatch = useDispatch();
  const [certificates, setCertificates] = useState([]);
  const [portfolioImages, setPortfolioImages] = useState([]);
  console.log('portfolio images', portfolioImages)
  // const [address, setAddress] = useState();
  const { _id, id, profileCreated } = useSelector(state => state.user.userData);
  const { userData } = useSelector(state => state.user);
  const { businessProfileData } = useSelector(state => state.user);
  const [editFields, setEditFields] = useState({
    fullName: '',
    storeName: '',
    contactNo: '',
    bio: '',
    address: '',
  });
  console.log('businessProfileData', businessProfileData.businessName);
  const [isLoading, setIsLoading] = useState(false);
  const { profileImage } = useSelector(state => state.user.businessProfileData);
  const [imageUrl, setImageUrl] = useState();
  const token = useSelector(state => state.user.token);

  // useEffect(() => {
  //   if (profileCreated) {
  //     navigation.reset({
  //       index: 0,
  //       routes: [{ name: 'BottomStack' }],
  //     });
  //   }
  // }, [profileCreated]);
  // console.log('value', value);
  // console.log('value2', value2);
  // console.log('managerId', managerId);
  const [businessType, setBusinessType] = useState([
    { label: 'Hotel', value: 'Hotel' },
    { label: 'Daycare', value: 'Daycare' },
  ]);
  const [services, setSelectServices] = useState([
    { label: 'Drop-Ins', value: 'Drop-Ins' },
    { label: 'Training', value: 'Training' },
  ]);
  console.log('imageuri', imageUri);

  const openFile = async (file) => {
    try {
      // Android 13+ requires READ_MEDIA_* permissions
      if (Platform.OS === 'android' && Platform.Version >= 33) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert('Permission required to open the file.');
          return;
        }
      }

      await FileViewer.open(file.uri, {
        showOpenWithDialog: true,
        displayName: file.name,
      });
    } catch (error) {
      console.log('File open error:', error);
      Alert.alert('Error', 'Unable to open this file.');
    }
  };


  const uploadDocuments = async () => {
    try {
      let docs = [...certificates];

      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles], // Accept all types
        allowMultiSelection: true,
      });

      for (let x = 0; x < result.length; x++) {
        const file = result[x];

        const base64 = await RNFS.readFile(file.uri, 'base64');

        docs.push({
          uri: file.uri,
          type: file.type,
          name: file.name,
        });
      }

      // Optional: limit total items
      if (docs.length > 6) {
        docs = docs.slice(docs.length - 6); // keep last 6 only
      }

      setCertificates(docs);
    } catch (err) {
      if (!DocumentPicker.isCancel(err)) {
        console.log('Document pick error:', err);
      }
    }
  };

  const uploadPortfolioImages = async () => {
    try {
      const imageUri = await selectImageFromGallery();
      if (!imageUri) { return; }

      let images = [...portfolioImages]; // assume useState exists
      images.push({
        uri: imageUri,
        name: imageUri.split('/').pop(), // get image name from URI
        type: 'image/jpeg', // you can improve this with mime-type lookup
      });
      // Keep only last 6
      if (images.length > 6) {
        images = images.slice(images.length - 6);
      }
      setPortfolioImages(images);
    } catch (err) {
      console.log('Error uploading portfolio image:', err);
    }
  };

  const handleRemoveImage = (uri, portfolio) => {
    if (portfolio === true) {
      setPortfolioImages(prev => prev.filter(item => item !== uri));

    } else {
      setCertificates(prev => prev.filter(item => item !== uri));
    }
  };
  const handleCreateProfile = async () => {

    if (!value.length) {
      return ShowToast('error', 'Plz Select Your Business Type');
    } else if (!value2.length) {
      return ShowToast('error', 'Plz Select Your Services');
    }
    if (!editFields.address) {
      return ShowToast('error', 'Plz Add Your Address');
    } else if (!certificates.length) {
      return ShowToast('error', 'Plz Add Your Certificates');
    } else if (!accept) {
      return ShowToast('error', 'Plz Accept Terms & Policies To Proceed');
    }

    else {
      try {
        setIsLoading(true);
        const res = await createBusinessProfile(_id || id, imageUri, fullName, storeName, contactNo, bio, Number(parseFloat(experienceLvl).toFixed(0)), value, value2, editFields.address, certificates, portfolioImages, 'NY,Usa', 40.7128, 74.0060, dispatch, navigation, userData);
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
      }
    }
  };
  console.log('response', `${ImageBaseUrl}${profileImage}`);

  const handleEditProfile = async () => {

    console.log('handleEditProfile called');
    const payload: any = {
      id: businessProfileData._id,
      dispatch,
      navigation,
    };
    const { fullName, storeName, contactNo, bio, address } = editFields;
    console.log('contact no', contactNo);
    if (fullName) { payload.fullName = fullName; }
    if (storeName) { payload.storeName = storeName; }
    if (imageUrl) { payload.image = imageUrl; }
    if (contactNo) { payload.contactNo = contactNo; }
    if (bio) { payload.bio = bio; }
    if (experienceLvl) { payload.experienceLvl = Number(parseFloat(experienceLvl).toFixed(0)); }
    if (value) { payload.bType = value; }
    if (value2) { payload.services = value2; }
    if (address) { payload.address = address; }
    if (certificates?.length) { payload.certificates = certificates; }
    if (portfolioImages?.length) { payload.portfolio = portfolioImages; }
    try {
      setIsLoading(true);
      const res = await editBusinessProfile(payload);
      console.log('response', res);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
    }
  }
  const selectImageHandler = async () => {
    try {
      const response = await selectImageFromGallery();
      if (response) {
        setImageUrl(response);
      }
    } catch (error) {
      console.log('Image selection failed:', error);

    }
  };
  const handleInputChange = (field: string, value: string) => {
    setEditFields(prev => ({ ...prev, [field]: value }));
  };
  return (
    <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, padding: responsiveHeight(2), backgroundColor: Colors.white }}>
      <BackIcon />
      <NormalText mrgnTop={responsiveHeight(4)} title={`${type === 'create' ? 'Create' : 'Edit'} Business Profile`} fontSize={responsiveFontSize(3)} fontWeight={'800'} />
      <NormalText title="Enter your details to register yourself" fontSize={responsiveFontSize(2)} fontWeight={'600'} />
      {type === 'create' ?
        null :
        (
          <>
            <View style={{ alignSelf: 'center', marginTop: responsiveHeight(4) }}>
              <Image source={{ uri: imageUrl ? imageUrl : `${ImageBaseUrl}${profileImage}` }} style={{ height: responsiveHeight(20), width: responsiveWidth(40), borderRadius: responsiveHeight(2) }} />
              <TouchableOpacity onPress={selectImageHandler} style={{ position: 'absolute', bottom: responsiveHeight(-2), right: responsiveHeight(-1.5), backgroundColor: Colors.white, borderRadius: responsiveHeight(5), padding: responsiveHeight(2), alignItems: 'center', justifyContent: 'center', width: responsiveWidth(13.5) }}>
                <SvgIcons xml={upload} height={20} width={20} />
              </TouchableOpacity>
            </View>
            <View style={{ marginTop: responsiveHeight(4), gap: responsiveHeight(2) }}>
              <Input showPassword handlePress={text => handleInputChange('fullName', text)} icon={true} elevation={false} xml={user} placeHolder="Full Name" placeholderTxtColor="#3b4b68" />
              <Input showPassword handlePress={text => handleInputChange('storeName', text)} icon={true} elevation={false} xml={user} placeHolder="Store Name" placeholderTxtColor="#3b4b68" />
              <Input keyboardType="numeric" showPassword handlePress={text => handleInputChange('contactNo', text)} icon={true} elevation={false} xml={user} placeHolder="Contact Number (Without Dash)" placeholderTxtColor="#3b4b68" />
              <TextInput multiline verticalAlign="top" onChangeText={text => handleInputChange('bio', text)} placeholder="Bio" textAlignVertical="top" placeholderTextColor={'#3B4B68'} style={{ height: responsiveHeight(15), borderRadius: responsiveHeight(1), fontWeight: '400', padding: responsiveHeight(2.5), width: '100%', borderColor: '#EFEFEF', borderWidth: 2 }} />
            </View>
          </>
        )}
      <View style={{ zIndex: 200 }}>
        <PickerCard value={value} setValue={setValue} items={businessType} placeHolder="Business Type" mrgnTop={responsiveHeight(2)} />
      </View>

      <View style={{ marginTop: responsiveHeight(2), gap: responsiveHeight(2) }}>
        {/* <FlatList horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: responsiveHeight(2), width: '100%' }} data={data} renderItem={({ item }) => (
          <View style={{ backgroundColor: Colors.buttonBg, padding: responsiveHeight(1.8), justifyContent: 'space-between', flexDirection: 'row', gap: responsiveHeight(1), borderRadius: responsiveHeight(1), width: responsiveWidth(38) }}>
            <NormalText alignSelf="center" txtAlign="center" fontWeight="600" fontSize={responsiveFontSize(2.2)} color={Colors.white} title={item.title} />
            <TouchableOpacity style={{ height: responsiveHeight(3.5), width: responsiveWidth(7.5), alignItems: 'center', borderRadius: responsiveHeight(4), backgroundColor: Colors.white, justifyContent: 'center' }}>
              <SvgIcons xml={cut} height={18} width={18} />
            </TouchableOpacity>
          </View>
        )} /> */}
        <PickerCard value={value2} setValue={setValue2} items={services} placeHolder="Select services" mrgnTop={responsiveHeight(1)} />
        <Input handlePress={text => handleInputChange('address', text)} placeHolder="Texas" placeholderTxtColor="#3B4C68" label="Address" fontSize={responsiveFontSize(1.8)} />
        {/* <Input handlePress={(e) => console.log('e', e)} xml={user} icon elevation={false} placeHolder="Contact Number" placeholderTxtColor="#3B4B68" fontSize={responsiveFontSize(1.8)} /> */}
        {/* <TouchableOpacity style={{
          borderWidth: 1, borderColor: '#EEEEEE', borderRadius: responsiveHeight(1), height: responsiveHeight(8),
          padding: responsiveHeight(1),
        }}>
          <NormalText color="#808ca0" fontSize={responsiveFontSize(1.8)} title="Choose Location" />
          <NormalText color="#808ca0" fontSize={responsiveFontSize(1.8)} title="NY, USA" mrgnTop={3} />
        </TouchableOpacity> */}
        <ListHeading mrgnTop={responsiveHeight(1)} title="Certificate" showSeeAll={false} />
        <FlatList
          keyExtractor={(item, index) => index.toString()}
          data={certificates}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: responsiveHeight(2) }}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => openFile(item)}>
              <View>
                <TouchableOpacity
                  onPress={() => handleRemoveImage(item)}
                  style={{
                    backgroundColor: Colors.white,
                    height: responsiveHeight(3.5),
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: responsiveHeight(2),
                    width: responsiveWidth(6.7),
                    position: 'absolute',
                    right: responsiveHeight(1),
                    top: responsiveHeight(0.6),
                    zIndex: 100,
                  }}
                >
                  <SvgIcons xml={cut} height={15} width={15} />
                </TouchableOpacity>

                {/* Show image preview if it's an image, otherwise show an icon */}
                {item.type.startsWith('image/') ? (
                  <Image
                    source={{ uri: item.uri }}
                    style={{
                      height: responsiveHeight(13),
                      width: responsiveWidth(32),
                      borderRadius: responsiveHeight(2),
                    }}
                  />
                ) : (
                  <View
                    style={{
                      height: responsiveHeight(13),
                      width: responsiveWidth(32),
                      borderRadius: responsiveHeight(2),
                      backgroundColor: '#f0f0f0',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: responsiveHeight(1),
                    }}
                  >
                    <Text numberOfLines={2}>{item.name}</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          )}
        />


        <TouchableOpacity onPress={uploadDocuments} style={{ alignItems: 'center', justifyContent: 'center', borderWidth: 2, paddingVertical: responsiveHeight(2.4), borderColor: '#626262', borderStyle: 'dashed', borderRadius: responsiveHeight(1.5) }}>
          <SvgIcons xml={upload3} height={35} width={35} />
          <NormalText title="Upload Your Certificate" alignSelf="center" fontWeight="800" fontSize={responsiveFontSize(2.2)} color="#626262" mrgnTop={responsiveHeight(1)} />
        </TouchableOpacity>

        <ListHeading mrgnTop={responsiveHeight(1)} title="Portfolio" showSeeAll={false} />
        <FlatList
          keyExtractor={(item, index) => index.toString()}
          data={portfolioImages}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: responsiveHeight(2) }}
          renderItem={({ item }) => (
            <View>
              <TouchableOpacity
                onPress={() => handleRemoveImage(item, true)}
                style={{
                  backgroundColor: Colors.white,
                  height: responsiveHeight(3.5),
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: responsiveHeight(2),
                  width: responsiveWidth(6.7),
                  position: 'absolute',
                  right: responsiveHeight(1),
                  top: responsiveHeight(0.6),
                  zIndex: 100,
                }}
              >
                <SvgIcons xml={cut} height={15} width={15} />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => openFile(item)}>
                {item.type.startsWith('image/') ? (
                  <Image
                    source={{ uri: item.uri }}
                    style={{
                      height: responsiveHeight(13),
                      width: responsiveWidth(32),
                      borderRadius: responsiveHeight(2),
                    }}
                  />
                ) : (
                  <View
                    style={{
                      height: responsiveHeight(13),
                      width: responsiveWidth(32),
                      borderRadius: responsiveHeight(2),
                      backgroundColor: '#f0f0f0',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: responsiveHeight(1),
                    }}
                  >
                    <Text numberOfLines={2}>{item.name}</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

          )}
        />


        <TouchableOpacity onPress={uploadPortfolioImages} style={{ alignItems: 'center', justifyContent: 'center', borderWidth: 2, paddingVertical: responsiveHeight(2.4), borderColor: '#626262', borderStyle: 'dashed', borderRadius: responsiveHeight(1.5) }}>
          <SvgIcons xml={upload3} height={35} width={35} />
          <NormalText title="Upload Your Portfolio" alignSelf="center" fontWeight="800" fontSize={responsiveFontSize(2.2)} color="#626262" mrgnTop={responsiveHeight(1)} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setAccept(!accept)} style={{ flexDirection: 'row', alignItems: 'center', gap: responsiveHeight(1) }}>

          <TouchableOpacity onPress={() => setAccept(!accept)} style={{ height: responsiveHeight(4), width: responsiveWidth(8), alignItems: 'center', justifyContent: 'center', borderWidth: accept ? null : 2, borderColor: accept ? null : Colors.buttonBg, borderRadius: responsiveHeight(1), backgroundColor: accept ? Colors.buttonBg : Colors.white }}>
            <SvgIcons xml={tick} height={15} width={15} />
          </TouchableOpacity>
          <NormalText width={responsiveWidth(80)} fontSize={responsiveFontSize(1.8)} color="#9DA5B3" title="By continuing you accept our Privacy Policy and Term of Use" />
        </TouchableOpacity>
        <Button handlePress={type === 'create' ? handleCreateProfile : handleEditProfile} mrgnTop={responsiveHeight(2)} title={isLoading ? (<ActivityIndicator size={'large'} color={Colors.white} />) : "Next"} bgColor={Colors.buttonBg} textColor={Colors.white} />
      </View>
    </ScrollView>
  );
};

export default CreateBussProfile;
