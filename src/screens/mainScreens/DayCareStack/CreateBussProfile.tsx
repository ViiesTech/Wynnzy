import React, {useEffect, useState} from 'react';
import {
  View,
  ScrollView,
  Platform,
  PermissionsAndroid,
  Alert,
  FlatList,
  Image,
  TouchableOpacity,
  Text,
  TextInput,
  Linking,
  ViewStyle,
} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../../assets/responsive_dimensions';
import {Colors} from '../../../assets/colors';
import {NormalText} from '../../../Components/Titles';
import Input from '../../../Components/Input';
import {cut, tick, upload, upload3, user} from '../../../assets/icons';
import ListHeading from '../../../Components/ListHeading';
import SvgIcons from '../../../Components/SvgIcons';
import {Button} from '../../../Components/Button';
import PickerCard from '../../../Components/PickerCard';
import {selectImageFromGallery} from '../../../GlobalFunctions';
import {
  createBusinessProfile,
  editBusinessProfile,
  ShowToast,
} from '../../../GlobalFunctions/Auth';
import {useDispatch, useSelector} from 'react-redux';
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import FileViewer from 'react-native-file-viewer';
import {ImageBaseUrl} from '../../../BaseUrl';
import TextHeader from '../../../Components/TextHeader';

const CreateBussProfile = ({navigation, route}: any) => {
  const {type, fullName, storeName, contactNo, bio, experienceLvl, imageUri} =
    route.params || {};

  const dispatch = useDispatch();

  // Selectors
  const {userData, businessProfileData} = useSelector(
    (state: any) => state.user,
  );
  const _id = userData?._id || userData?.id;
  const profileImage = businessProfileData?.profileImage;

  // States
  const [accept, setAccept] = useState<boolean>(true);
  const [value, setValue] = useState<any>([]);
  const [value2, setValue2] = useState<any>([]);
  const [certificates, setCertificates] = useState<any[]>([]); // Initialized as array
  const [portfolioImages, setPortfolioImages] = useState<any[]>([]); // Initialized as array
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const [editFields, setEditFields] = useState({
    fullName: '',
    storeName: '',
    contactNumber: '',
    bio: '',
    address: '',
  });

  // Pre-fill data if Editing
  useEffect(() => {
    if (type === 'edit' && businessProfileData) {
      setEditFields({
        fullName: businessProfileData.fullName || '',
        storeName: businessProfileData.businessName || '',
        contactNumber: businessProfileData.contactNumber?.toString() || '',
        bio: businessProfileData.bio || '',
        address: businessProfileData.address || '',
      });
      setValue(businessProfileData.bType || []);
      setValue2(businessProfileData.services || []);
      setCertificates(businessProfileData.certificate || []);
      setPortfolioImages(businessProfileData.image || []);
    }
  }, [type, businessProfileData]);

  const [businessType] = useState([
    {label: 'Hotel', value: 'Hotel'},
    {label: 'Daycare', value: 'Daycare'},
  ]);
  const [services] = useState([
    {label: 'Drop-Ins', value: 'Drop-Ins'},
    {label: 'Training', value: 'Training'},
  ]);

  const openFile = async (file: any) => {
    try {
      const uri =
        typeof file === 'string' ? `${ImageBaseUrl}${file}` : file.uri;
      if (!uri) {
        return;
      }
      if (typeof file === 'string') {
        Linking.openURL(uri);
        return;
      }

      if (Platform.OS === 'android' && Platform.Version >= 33) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert('Permission required to open the file.');
          return;
        }
      }
      await FileViewer.open(uri, {
        showOpenWithDialog: true,
        displayName: file.name,
      });
    } catch (error) {
      Alert.alert('Error', 'Unable to open this file.');
    }
  };

  const uploadDocuments = async () => {
    try {
      let docs = [...certificates];
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
        allowMultiSelection: true,
      });

      for (let x = 0; x < result.length; x++) {
        const file = result[x];
        docs.push({
          uri: file.uri,
          type: file.type,
          name: file.name,
        });
      }

      if (docs.length > 6) {
        docs = docs.slice(docs.length - 6);
      }
      setCertificates(docs);
    } catch (err) {
      if (!DocumentPicker.isCancel(err)) {
        console.log(err);
      }
    }
  };

  const uploadPortfolioImages = async () => {
    try {
      const uri = await selectImageFromGallery();
      if (!uri) {
        return;
      }

      let imgs = [...portfolioImages];
      imgs.push({
        uri: uri,
        name: uri.split('/').pop(),
        type: 'image/jpeg',
      });
      if (imgs.length > 6) {
        imgs = imgs.slice(imgs.length - 6);
      }
      setPortfolioImages(imgs);
    } catch (err) {
      console.log(err);
    }
  };

  const handleRemoveImage = (targetItem: any, portfolio: boolean = false) => {
    if (portfolio) {
      setPortfolioImages(prev => prev.filter(item => item !== targetItem));
    } else {
      setCertificates(prev => prev.filter(item => item !== targetItem));
    }
  };

  const handleCreateProfile = async () => {
    if (!value?.length) {
      return ShowToast('error', 'Kindly Select Your Business Type');
    }
    if (!value2?.length) {
      return ShowToast('error', 'Kindly Select Your Services');
    }
    if (!editFields.address) {
      return ShowToast('error', 'Kindly Add Your Address');
    }
    if (!certificates.length) {
      return ShowToast('error', 'Kindly Add Your Certificates');
    }
    if (!accept) {
      return ShowToast('error', 'Kindly Accept Terms & Policies To Proceed');
    }

    let payload = {
      managerId: _id,
      image: imageUri,
      fullName: fullName,
      businessName: storeName,
      contactNumber: editFields.contactNumber || contactNo,
      bio: bio,
      experienceLvl: Number(parseFloat(experienceLvl).toFixed(0)),
      bType: value,
      services: value2,
      address: editFields.address,
      certificates: certificates,
      portfolioImages: portfolioImages,
      locationName: 'Wall Street, New York',
      lat: 40.706005,
      lng: -74.008827,
      dispatch,
      navigation,
      userData,
    };

    console.log('payload:-', payload);

    try {
      setIsLoading(true);
      await createBusinessProfile(payload);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditProfile = async () => {
    const payload: any = {
      id: businessProfileData?._id,
      dispatch,
      navigation,
      ...editFields,
      bType: value,
      services: value2,
      certificates: certificates,
      portfolio: portfolioImages,
    };
    if (imageUrl) {
      payload.image = imageUrl;
    }

    try {
      setIsLoading(true);
      await editBusinessProfile(payload);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const selectImageHandler = async () => {
    const response = await selectImageFromGallery();
    if (response) {
      setImageUrl(response);
    }
  };

  const handleInputChange = (field: string, val: string) => {
    setEditFields(prev => ({...prev, [field]: val}));
  };

  console.log('businessProfileData:-', businessProfileData);
  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}>
      <TextHeader
        title={`${type === 'create' ? 'Create' : 'Edit'} Business Profile`}
      />
      <NormalText
        title="Enter your details to register yourself"
        fontSize={responsiveFontSize(2)}
        fontWeight={'600'}
        mrgnTop={responsiveHeight(2)}
      />

      {type === 'edit' && (
        <>
          <View style={{alignSelf: 'center', marginTop: responsiveHeight(4)}}>
            <Image
              source={{
                uri: imageUrl ? imageUrl : `${ImageBaseUrl}${profileImage}`,
              }}
              style={{
                height: responsiveHeight(20),
                width: responsiveWidth(40),
                borderRadius: responsiveHeight(2),
                backgroundColor: '#f0f0f0',
              }}
            />
            <TouchableOpacity
              onPress={selectImageHandler}
              style={{
                position: 'absolute',
                bottom: responsiveHeight(-2),
                right: responsiveHeight(-1.5),
                backgroundColor: Colors.white,
                borderRadius: responsiveHeight(5),
                padding: responsiveHeight(2),
                elevation: 5,
                width: responsiveWidth(13.5),
              }}>
              <SvgIcons xml={upload} height={20} width={20} />
            </TouchableOpacity>
          </View>
          <View
            style={{marginTop: responsiveHeight(4), gap: responsiveHeight(2)}}>
            <Input
              handlePress={text => handleInputChange('fullName', text)}
              icon
              xml={user}
              placeHolder="Full Name"
              value={editFields.fullName}
              fontSize={responsiveFontSize(1.8)}
              placeholderTxtColor="#BFBFBF"
            />
            <Input
              handlePress={text => handleInputChange('storeName', text)}
              icon
              xml={user}
              placeHolder="Store Name"
              value={editFields.storeName}
              fontSize={responsiveFontSize(1.8)}
              placeholderTxtColor="#BFBFBF"
            />
            <Input
              keyboardType="numeric"
              handlePress={text => handleInputChange('contactNumber', text)}
              icon
              xml={user}
              placeHolder="Contact Number"
              value={editFields.contactNumber}
              fontSize={responsiveFontSize(1.8)}
              placeholderTxtColor="#BFBFBF"
            />
            <TextInput
              multiline
              onChangeText={text => handleInputChange('bio', text)}
              placeholder="Bio"
              value={editFields.bio}
              textAlignVertical="top"
              placeholderTextColor={'#3B4B68'}
              style={{
                height: responsiveHeight(15),
                borderRadius: responsiveHeight(1),
                padding: responsiveHeight(2.5),
                width: '100%',
                borderColor: '#EFEFEF',
                borderWidth: 2,
                color: '#000',
              }}
            />
          </View>
        </>
      )}

      <View style={{zIndex: 200}}>
        <PickerCard
          value={value}
          setValue={setValue}
          items={businessType}
          placeHolder="Business Type"
          mrgnTop={responsiveHeight(2)}
        />
      </View>

      <View style={{marginTop: responsiveHeight(2), gap: responsiveHeight(2)}}>
        <PickerCard
          value={value2}
          setValue={setValue2}
          items={services}
          placeHolder="Select services"
          mrgnTop={responsiveHeight(1)}
        />
        <Input
          handlePress={text => handleInputChange('address', text)}
          placeHolder="Address"
          value={editFields.address}
          fontSize={responsiveFontSize(1.8)}
          placeholderTxtColor="#BFBFBF"
        />

        <ListHeading
          mrgnTop={responsiveHeight(1)}
          title="Certificate"
          showSeeAll={false}
        />
        {certificates?.length > 0 ? (
          <FlatList
            keyExtractor={(_, index) => index.toString()}
            data={certificates}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{gap: responsiveHeight(2)}}
            renderItem={({item}) => (
              <View style={styles.previewContainer}>
                <TouchableOpacity
                  onPress={() => handleRemoveImage(item)}
                  style={styles.cutIconContainer}>
                  <SvgIcons xml={cut} height={15} width={15} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => openFile(item)}>
                  {item.type?.startsWith('image/') ||
                  (typeof item === 'string' &&
                    !item.toLowerCase().endsWith('.pdf')) ? (
                    <Image
                      source={{uri: item.uri || `${ImageBaseUrl}${item}`}}
                      style={styles.previewBox}
                    />
                  ) : (
                    <View style={[styles.previewBox, styles.docBox]}>
                      <Text numberOfLines={2}>{item.name || item}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            )}
          />
        ) : (
          <TouchableOpacity onPress={uploadDocuments} style={styles.dashBtn}>
            <SvgIcons xml={upload3} height={35} width={35} />
            <NormalText
              title="Upload Your Certificate"
              alignSelf="center"
              fontWeight="800"
              color="#626262"
            />
          </TouchableOpacity>
        )}

        <ListHeading
          mrgnTop={responsiveHeight(1)}
          title="Portfolio"
          showSeeAll={false}
        />

        {portfolioImages?.length > 0 ? (
          <FlatList
            keyExtractor={(_, index) => index.toString()}
            data={portfolioImages}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{gap: responsiveHeight(2)}}
            renderItem={({item}) => (
              <View style={styles.previewContainer}>
                <TouchableOpacity
                  onPress={() => handleRemoveImage(item, true)}
                  style={styles.cutIconContainer}>
                  <SvgIcons xml={cut} height={15} width={15} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => openFile(item)}>
                  {item.type?.startsWith('image/') ||
                  (typeof item === 'string' &&
                    !item.toLowerCase().endsWith('.pdf')) ? (
                    <Image
                      source={{uri: item.uri || `${ImageBaseUrl}${item}`}}
                      style={styles.previewBox}
                    />
                  ) : (
                    <View style={[styles.previewBox, styles.docBox]}>
                      <Text numberOfLines={2}>{item.name || item}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            )}
          />
        ) : (
          <TouchableOpacity
            onPress={uploadPortfolioImages}
            style={styles.dashBtn}>
            <SvgIcons xml={upload3} height={35} width={35} />
            <NormalText
              title="Upload Your Portfolio"
              alignSelf="center"
              fontWeight="800"
              color="#626262"
            />
          </TouchableOpacity>
        )}

        <TouchableOpacity
          onPress={() => setAccept(!accept)}
          style={styles.termsRow}>
          <View
            style={[
              styles.checkbox,
              {
                backgroundColor: accept ? Colors.buttonBg : Colors.white,
                borderWidth: accept ? 0 : 2,
              },
            ]}>
            <SvgIcons xml={tick} height={15} width={15} />
          </View>
          <NormalText
            width={responsiveWidth(80)}
            fontSize={responsiveFontSize(1.8)}
            color="#9DA5B3"
            title="By continuing you accept our Privacy Policy and Term of Use"
          />
        </TouchableOpacity>

        <Button
          isLoading={isLoading}
          mrgnTop={responsiveHeight(2)}
          title={type === 'create' ? 'Next' : 'Update Now'}
          bgColor={Colors.buttonBg}
          textColor={Colors.white}
          handlePress={
            type === 'create' ? handleCreateProfile : handleEditProfile
          }
        />
      </View>
    </ScrollView>
  );
};

const styles = {
  container: {
    flexGrow: 1,
    padding: responsiveHeight(2),
    backgroundColor: Colors.white,
  },
  previewBox: {
    height: responsiveHeight(13),
    width: responsiveWidth(32),
    borderRadius: responsiveHeight(2),
  },
  docBox: {
    backgroundColor: '#f0f0f0',
    alignItems: 'center' as 'center',
    justifyContent: 'center' as 'center',
    padding: responsiveHeight(1),
  },
  cutIconContainer: {
    backgroundColor: Colors.white,
    height: responsiveHeight(3.5),
    width: responsiveWidth(6.7),
    alignItems: 'center' as 'center',
    justifyContent: 'center' as 'center',
    borderRadius: responsiveHeight(2),
    position: 'absolute' as 'absolute',
    right: responsiveHeight(1),
    top: responsiveHeight(0.6),
    zIndex: 100,
    elevation: 2,
  },
  dashBtn: {
    alignItems: 'center' as 'center',
    justifyContent: 'center' as 'center',
    borderWidth: 2,
    paddingVertical: responsiveHeight(2.4),
    borderColor: '#626262',
    borderStyle: 'dashed' as 'dashed',
    borderRadius: responsiveHeight(1.5),
  },
  termsRow: {
    flexDirection: 'row' as 'row',
    alignItems: 'center' as 'center',
    gap: responsiveHeight(1),
  },
  checkbox: {
    height: responsiveHeight(4),
    width: responsiveWidth(8),
    alignItems: 'center' as 'center',
    justifyContent: 'center' as 'center',
    borderColor: Colors.buttonBg,
    borderRadius: responsiveHeight(1),
  },
  previewContainer: {
    backgroundColor: Colors.lightGray,
  },
};

export default CreateBussProfile;
