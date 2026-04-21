import React, {useEffect, useState, Fragment} from 'react';
import {
  View,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Text,
  TextInput,
  Linking,
  StyleSheet,
  Platform,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import DocumentPicker from 'react-native-document-picker';
import FileViewer from 'react-native-file-viewer';

import {
  responsiveFontSize,
  responsiveHeight,
} from '../../../assets/responsive_dimensions';
import {Colors} from '../../../assets/colors';
import {NormalText} from '../../../Components/Titles';
import {cut, tick, upload3} from '../../../assets/icons';
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
import {ImageBaseUrl} from '../../../BaseUrl';
import UserHeader from '../../../Components/UserHeader';
import FastImage from 'react-native-fast-image';
import Octicons from 'react-native-vector-icons/Octicons';

const CreateBussProfile = ({navigation, route}: any) => {
  const {type, fullName, storeName, contactNo, bio, experienceLvl, imageUri} =
    route.params || {};
  const dispatch = useDispatch();

  // Redux State
  const {userData, businessProfileData} = useSelector(
    (state: any) => state.user,
  );
  const _id = userData?._id || userData?.id;

  // Form States
  const [accept, setAccept] = useState(true);
  const [value, setValue] = useState<string[]>([]);
  const [value2, setValue2] = useState<string[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [portfolioImages, setPortfolioImages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const [editFields, setEditFields] = useState({
    fullName: '',
    storeName: '',
    contactNumber: '',
    bio: '',
    address: '',
  });

  // Pre-fill logic
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

  const uploadDocuments = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
        allowMultiSelection: true,
      });

      const newDocs = result.map(file => ({
        uri: file.uri,
        type: file.type,
        name: file.name,
      }));

      setCertificates(prev => [...prev, ...newDocs].slice(-6));
    } catch (err) {
      if (!DocumentPicker.isCancel(err)) {
        console.log(err);
      }
    }
  };

  const uploadPortfolioImages = async () => {
    const uri = await selectImageFromGallery();
    if (uri) {
      const newImg = {uri, name: uri.split('/').pop(), type: 'image/jpeg'};
      setPortfolioImages(prev => [...prev, newImg].slice(-6));
    }
  };

  const handleRemoveItem = (target: any, isPortfolio: boolean) => {
    const setter = isPortfolio ? setPortfolioImages : setCertificates;
    setter(prev => prev.filter(item => item !== target));
  };

  const handleAction = async () => {
    if (
      !value?.length ||
      !value2?.length ||
      (type === 'edit' && !editFields.address) ||
      !certificates.length
    ) {
      return ShowToast('error', 'Please fill all required fields');
    }
    if (!accept) {
      return ShowToast('error', 'Please accept terms to proceed');
    }

    setIsLoading(true);
    try {
      if (type === 'create') {
        await createBusinessProfile({
          managerId: _id,
          image: imageUri,
          fullName,
          businessName: storeName,
          contactNumber: editFields.contactNumber || contactNo,
          bio,
          experienceLvl: Math.round(parseFloat(experienceLvl)),
          bType: value,
          services: value2,
          address: editFields.address,
          certificates,
          portfolioImages,
          locationName: 'Wall Street, New York', // Example static data
          lat: 40.706005,
          lng: -74.008827,
          dispatch,
          navigation,
          userData,
        });
      } else {
        await editBusinessProfile({
          id: businessProfileData?._id,
          ...editFields,
          bType: value,
          services: value2,
          certificates,
          portfolio: portfolioImages,
          image: imageUrl || undefined,
          dispatch,
          navigation,
        });
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const renderMediaItem = ({item}: any, isPortfolio: boolean) => (
    <View style={styles.previewContainer}>
      <TouchableOpacity
        style={styles.cutIconContainer}
        onPress={() => handleRemoveItem(item, isPortfolio)}>
        <SvgIcons xml={cut} height={12} width={12} />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => Linking.openURL(item.uri || `${ImageBaseUrl}${item}`)}>
        {item.type?.startsWith('image/') ||
        (typeof item === 'string' && !item.toLowerCase().endsWith('.pdf')) ? (
          <FastImage
            source={{uri: item.uri || `${ImageBaseUrl}${item}`}}
            style={styles.previewBox}
          />
        ) : (
          <View style={[styles.previewBox, styles.docBox]}>
            <Text numberOfLines={1} style={styles.docText}>
              {item.name || 'Document'}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );

  // Helper Component for Placeholders
  const UploadPlaceholder = ({title, onPress}: any) => (
    <TouchableOpacity onPress={onPress} style={styles.dashBtn}>
      <View style={styles.uploadIconCircle}>
        <SvgIcons xml={upload3} height={24} width={24} />
      </View>
      <Text style={styles.dashText}>{title}</Text>
      <Text style={styles.dashSubText}>JPG, PNG, PDF up to 5MB</Text>
    </TouchableOpacity>
  );

  const handleInputChange = (field: string, val: string) => {
    setEditFields(prev => ({...prev, [field]: val}));
  };

  const renderInputField = (
    label: string,
    field: string,
    placeholder: string,
    multiline = false,
  ) => {
    return (
      <View style={[styles.inputContainer, styles.shadow]}>
        <Text style={styles.inputLabel}>{label}</Text>
        <TextInput
          value={editFields[field as keyof typeof editFields]}
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

  // console.log('managerId:-', _id);
  console.log('route:-', route);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled">
      <UserHeader
        backIcon={true}
        navigation={navigation}
        title={`${type === 'create' ? 'Create' : 'Edit'} Business Profile`}
        centerText={true}
      />

      <View style={styles.mainContainer}>
        {type === 'edit' && (
          <View style={styles.avatarSection}>
            <FastImage
              source={{
                uri:
                  imageUrl ||
                  `${ImageBaseUrl}${businessProfileData?.profileImage}`,
              }}
              style={styles.avatar}
              resizeMode={FastImage.resizeMode.cover}
            />
            <TouchableOpacity
              onPress={async () => {
                const res = await selectImageFromGallery();
                if (res) {
                  setImageUrl(res);
                }
              }}
              style={styles.uploadBadge}>
              {/* <SvgIcons xml={upload} height={16} width={16} /> */}
              <Octicons
                name="plus"
                size={responsiveFontSize(2.5)}
                color={Colors.buttonBg}
              />
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.formGap}>
          {type === 'edit' && (
            <Fragment>
              {renderInputField('Full Name', 'fullName', 'John Doe')}
              {renderInputField('Store Name', 'storeName', 'My Pet Store')}
              {renderInputField('Contact', 'contactNumber', '+1 234 567 890')}
              {renderInputField('Address', 'address', 'Enter your address')}
              {renderInputField(
                'Bio',
                'bio',
                'Tell us about your business...',
                true,
              )}
            </Fragment>
          )}

          <PickerCard
            value={value}
            setValue={setValue}
            items={[
              {label: 'Hotel', value: 'Hotel'},
              {label: 'Daycare', value: 'Daycare'},
            ]}
            placeHolder="Business Type"
            zIndexValue={2000}
            shadow={true}
          />

          <PickerCard
            value={value2}
            setValue={setValue2}
            items={[
              {label: 'Drop-Ins', value: 'Drop-Ins'},
              {label: 'Training', value: 'Training'},
            ]}
            placeHolder="Select Services"
            zIndexValue={1000}
            shadow={true}
          />

          <ListHeading title="Certificates" showSeeAll={false} />
          {certificates.length > 0 ? (
            <FlatList
              data={certificates}
              horizontal
              renderItem={props => renderMediaItem(props, false)}
              showsHorizontalScrollIndicator={false}
            />
          ) : (
            <UploadPlaceholder
              title="Upload Certificate"
              onPress={uploadDocuments}
            />
          )}

          <ListHeading title="Portfolio" showSeeAll={false} />

          {portfolioImages.length > 0 ? (
            <FlatList
              data={portfolioImages}
              horizontal
              renderItem={props => renderMediaItem(props, true)}
              showsHorizontalScrollIndicator={false}
            />
          ) : (
            <UploadPlaceholder
              title="Upload Portfolio"
              onPress={uploadPortfolioImages}
            />
          )}

          <TouchableOpacity
            onPress={() => setAccept(!accept)}
            style={styles.termsRow}>
            <View style={[styles.checkbox, accept && styles.checkboxActive]}>
              {accept && <SvgIcons xml={tick} height={12} width={12} />}
            </View>
            <Text style={styles.termsText}>
              By continuing you accept our Privacy Policy and Terms
            </Text>
          </TouchableOpacity>

          <Button
            isLoading={isLoading}
            title={type === 'create' ? 'Next' : 'Update Now'}
            bgColor={Colors.buttonBg}
            handlePress={handleAction}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {flexGrow: 1},
  mainContainer: {padding: 20, backgroundColor: Colors.white},
  avatarSection: {alignSelf: 'center', marginVertical: 20},
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f5f5f5',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  uploadBadge: {
    position: 'absolute',
    bottom: 10,
    right: 0,
    backgroundColor: 'white',
    height: 30,
    width: 30,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowOpacity: 0.2,
  },
  formGap: {gap: 15},
  bioContainer: {
    flexDirection: 'row',
    padding: 10,
    borderWidth: 1,
    borderColor: '#EEE',
    borderRadius: 10,
    minHeight: 100,
  },
  bioInput: {flex: 1, marginLeft: 10, textAlignVertical: 'top', color: 'black'},
  previewContainer: {marginRight: 15, position: 'relative', marginTop: 10},
  previewBox: {
    width: 100,
    height: 100,
    borderRadius: 10,
    backgroundColor: Colors.lightGray,
  },
  docBox: {
    backgroundColor: '#F0F2FF',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },
  docText: {fontSize: 10, color: '#333'},
  cutIconContainer: {
    position: 'absolute',
    top: -8,
    right: -8,
    zIndex: 10,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 4,
    elevation: 3,
  },
  dashBtn: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#DDE1FF',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#F9FAFF',
  },
  uploadIconCircle: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 40,
    elevation: 2,
  },
  dashText: {fontWeight: '700', marginTop: 10, color: '#3B4B68'},
  dashSubText: {fontSize: 12, color: '#A7ADFB'},
  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginVertical: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: Colors.buttonBg,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxActive: {backgroundColor: Colors.buttonBg},
  termsText: {flex: 1, color: '#9DA5B3', fontSize: 12},
  inputContainer: {
    padding: 12,
    backgroundColor: '#FFF',
    borderRadius: 12,
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
});

export default CreateBussProfile;

// import React, {useEffect, useState} from 'react';
// import {
//   View,
//   ScrollView,
//   Platform,
//   PermissionsAndroid,
//   Alert,
//   FlatList,
//   Image,
//   TouchableOpacity,
//   Text,
//   TextInput,
//   Linking,
//   ViewStyle,
//   DimensionValue,
// } from 'react-native';
// import {
//   responsiveFontSize,
//   responsiveHeight,
//   responsiveWidth,
// } from '../../../assets/responsive_dimensions';
// import {Colors} from '../../../assets/colors';
// import {NormalText} from '../../../Components/Titles';
// import Input from '../../../Components/Input';
// import {cut, tick, upload, upload3, user, pin} from '../../../assets/icons';
// import ListHeading from '../../../Components/ListHeading';
// import SvgIcons from '../../../Components/SvgIcons';
// import {Button} from '../../../Components/Button';
// import PickerCard from '../../../Components/PickerCard';
// import {selectImageFromGallery} from '../../../GlobalFunctions';
// import {
//   createBusinessProfile,
//   editBusinessProfile,
//   ShowToast,
// } from '../../../GlobalFunctions/Auth';
// import {useDispatch, useSelector} from 'react-redux';
// import DocumentPicker from 'react-native-document-picker';
// import RNFS from 'react-native-fs';
// import FileViewer from 'react-native-file-viewer';
// import {ImageBaseUrl} from '../../../BaseUrl';
// import TextHeader from '../../../Components/TextHeader';

// const CreateBussProfile = ({navigation, route}: any) => {
//   const {type, fullName, storeName, contactNo, bio, experienceLvl, imageUri} =
//     route.params || {};

//   const dispatch = useDispatch();

//   // Selectors
//   const {userData, businessProfileData} = useSelector(
//     (state: any) => state.user,
//   );
//   const _id = userData?._id || userData?.id;
//   const profileImage = businessProfileData?.profileImage;

//   // States
//   const [accept, setAccept] = useState<boolean>(true);
//   const [value, setValue] = useState<any>([]);
//   const [value2, setValue2] = useState<any>([]);
//   const [certificates, setCertificates] = useState<any[]>([]); // Initialized as array
//   const [portfolioImages, setPortfolioImages] = useState<any[]>([]); // Initialized as array
//   const [isLoading, setIsLoading] = useState(false);
//   const [imageUrl, setImageUrl] = useState<string | null>(null);

//   const [editFields, setEditFields] = useState({
//     fullName: '',
//     storeName: '',
//     contactNumber: '',
//     bio: '',
//     address: '',
//   });

//   // Pre-fill data if Editing
//   useEffect(() => {
//     if (type === 'edit' && businessProfileData) {
//       setEditFields({
//         fullName: businessProfileData.fullName || '',
//         storeName: businessProfileData.businessName || '',
//         contactNumber: businessProfileData.contactNumber?.toString() || '',
//         bio: businessProfileData.bio || '',
//         address: businessProfileData.address || '',
//       });
//       setValue(businessProfileData.bType || []);
//       setValue2(businessProfileData.services || []);
//       setCertificates(businessProfileData.certificate || []);
//       setPortfolioImages(businessProfileData.image || []);
//     }
//   }, [type, businessProfileData]);

//   const [businessType] = useState([
//     {label: 'Hotel', value: 'Hotel'},
//     {label: 'Daycare', value: 'Daycare'},
//   ]);
//   const [services] = useState([
//     {label: 'Drop-Ins', value: 'Drop-Ins'},
//     {label: 'Training', value: 'Training'},
//   ]);

//   const openFile = async (file: any) => {
//     try {
//       const uri =
//         typeof file === 'string' ? `${ImageBaseUrl}${file}` : file.uri;
//       if (!uri) {
//         return;
//       }
//       if (typeof file === 'string') {
//         Linking.openURL(uri);
//         return;
//       }

//       if (Platform.OS === 'android' && Platform.Version >= 33) {
//         const granted = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
//         );
//         if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
//           Alert.alert('Permission required to open the file.');
//           return;
//         }
//       }
//       await FileViewer.open(uri, {
//         showOpenWithDialog: true,
//         displayName: file.name,
//       });
//     } catch (error) {
//       Alert.alert('Error', 'Unable to open this file.');
//     }
//   };

//   const uploadDocuments = async () => {
//     try {
//       let docs = [...certificates];
//       const result = await DocumentPicker.pick({
//         type: [DocumentPicker.types.allFiles],
//         allowMultiSelection: true,
//       });

//       for (let x = 0; x < result.length; x++) {
//         const file = result[x];
//         docs.push({
//           uri: file.uri,
//           type: file.type,
//           name: file.name,
//         });
//       }

//       if (docs.length > 6) {
//         docs = docs.slice(docs.length - 6);
//       }
//       setCertificates(docs);
//     } catch (err) {
//       if (!DocumentPicker.isCancel(err)) {
//         console.log(err);
//       }
//     }
//   };

//   const uploadPortfolioImages = async () => {
//     try {
//       const uri = await selectImageFromGallery();
//       if (!uri) {
//         return;
//       }

//       let imgs = [...portfolioImages];
//       imgs.push({
//         uri: uri,
//         name: uri.split('/').pop(),
//         type: 'image/jpeg',
//       });
//       if (imgs.length > 6) {
//         imgs = imgs.slice(imgs.length - 6);
//       }
//       setPortfolioImages(imgs);
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   const handleRemoveImage = (targetItem: any, portfolio: boolean = false) => {
//     if (portfolio) {
//       setPortfolioImages(prev => prev.filter(item => item !== targetItem));
//     } else {
//       setCertificates(prev => prev.filter(item => item !== targetItem));
//     }
//   };

//   const handleCreateProfile = async () => {
//     if (!value?.length) {
//       return ShowToast('error', 'Kindly Select Your Business Type');
//     }
//     if (!value2?.length) {
//       return ShowToast('error', 'Kindly Select Your Services');
//     }
//     if (!editFields.address) {
//       return ShowToast('error', 'Kindly Add Your Address');
//     }
//     if (!certificates.length) {
//       return ShowToast('error', 'Kindly Add Your Certificates');
//     }
//     if (!accept) {
//       return ShowToast('error', 'Kindly Accept Terms & Policies To Proceed');
//     }

//     let payload = {
//       managerId: _id,
//       image: imageUri,
//       fullName: fullName,
//       businessName: storeName,
//       contactNumber: editFields.contactNumber || contactNo,
//       bio: bio,
//       experienceLvl: Number(parseFloat(experienceLvl).toFixed(0)),
//       bType: value,
//       services: value2,
//       address: editFields.address,
//       certificates: certificates,
//       portfolioImages: portfolioImages,
//       locationName: 'Wall Street, New York',
//       lat: 40.706005,
//       lng: -74.008827,
//       dispatch,
//       navigation,
//       userData,
//     };

//     console.log('payload:-', payload);

//     try {
//       setIsLoading(true);
//       await createBusinessProfile(payload);
//     } catch (err) {
//       console.log(err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleEditProfile = async () => {
//     const payload: any = {
//       id: businessProfileData?._id,
//       dispatch,
//       navigation,
//       ...editFields,
//       bType: value,
//       services: value2,
//       certificates: certificates,
//       portfolio: portfolioImages,
//     };
//     if (imageUrl) {
//       payload.image = imageUrl;
//     }

//     try {
//       setIsLoading(true);
//       await editBusinessProfile(payload);
//     } catch (err) {
//       console.log(err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const selectImageHandler = async () => {
//     const response = await selectImageFromGallery();
//     if (response) {
//       setImageUrl(response);
//     }
//   };

//   const handleInputChange = (field: string, val: string) => {
//     setEditFields(prev => ({...prev, [field]: val}));
//   };

//   console.log('businessProfileData:-', businessProfileData);
//   return (
//     <ScrollView
//       keyboardShouldPersistTaps="handled"
//       showsVerticalScrollIndicator={false}
//       contentContainerStyle={styles.container}>
//       <TextHeader
//         title={`${type === 'create' ? 'Create' : 'Edit'} Business Profile`}
//       />
//       <NormalText
//         title="Enter your details to register yourself"
//         fontSize={responsiveFontSize(2)}
//         fontWeight={'600'}
//         mrgnTop={responsiveHeight(2)}
//       />

//       {type === 'edit' && (
//         <>
//           <View style={{alignSelf: 'center', marginTop: responsiveHeight(4)}}>
//             <Image
//               source={{
//                 uri: imageUrl ? imageUrl : `${ImageBaseUrl}${profileImage}`,
//               }}
//               style={{
//                 height: responsiveHeight(20),
//                 width: responsiveWidth(40),
//                 borderRadius: responsiveHeight(2),
//                 backgroundColor: '#f0f0f0',
//                 borderWidth: 1,
//                 borderColor: '#EFEFEF',
//               }}
//             />
//             <TouchableOpacity
//               onPress={selectImageHandler}
//               style={{
//                 position: 'absolute',
//                 bottom: responsiveHeight(-1.5),
//                 right: responsiveHeight(-1.5),
//                 backgroundColor: Colors.white,
//                 borderRadius: responsiveHeight(5),
//                 padding: responsiveHeight(1.5),
//                 elevation: 5,
//                 shadowColor: '#000',
//                 shadowOffset: {width: 0, height: 2},
//                 shadowOpacity: 0.2,
//                 shadowRadius: 3,
//                 width: responsiveWidth(12),
//                 height: responsiveWidth(12),
//                 alignItems: 'center',
//                 justifyContent: 'center',
//               }}>
//               <SvgIcons xml={upload} height={20} width={20} />
//             </TouchableOpacity>
//           </View>
//           <View
//             style={{marginTop: responsiveHeight(4), gap: responsiveHeight(2)}}>
//             <Input
//               handlePress={text => handleInputChange('fullName', text)}
//               icon
//               xml={user}
//               placeHolder="Full Name"
//               value={editFields.fullName}
//               fontSize={responsiveFontSize(1.8)}
//               placeholderTxtColor="#BFBFBF"
//             />
//             <Input
//               handlePress={text => handleInputChange('storeName', text)}
//               icon
//               xml={user}
//               placeHolder="Store Name"
//               value={editFields.storeName}
//               fontSize={responsiveFontSize(1.8)}
//               placeholderTxtColor="#BFBFBF"
//             />
//             <Input
//               keyboardType="numeric"
//               handlePress={text => handleInputChange('contactNumber', text)}
//               icon
//               xml={user}
//               placeHolder="Contact Number"
//               value={editFields.contactNumber}
//               fontSize={responsiveFontSize(1.8)}
//               placeholderTxtColor="#BFBFBF"
//             />
//             <View style={styles.bioContainer}>
//               <View style={styles.bioIconRow}>
//                 <SvgIcons xml={user} height={20} width={20} />
//                 <View style={styles.verticalDivider} />
//               </View>
//               <TextInput
//                 multiline
//                 onChangeText={text => handleInputChange('bio', text)}
//                 placeholder="Bio"
//                 value={editFields.bio}
//                 textAlignVertical="top"
//                 placeholderTextColor={'#BFBFBF'}
//                 style={styles.bioInput}
//               />
//             </View>
//           </View>
//         </>
//       )}

//       <View style={{zIndex: 200}}>
//         <PickerCard
//           value={value}
//           setValue={setValue}
//           items={businessType}
//           placeHolder="Business Type"
//           mrgnTop={responsiveHeight(2)}
//         />
//       </View>

//       <View style={{marginTop: responsiveHeight(2), gap: responsiveHeight(2)}}>
//         <PickerCard
//           value={value2}
//           setValue={setValue2}
//           items={services}
//           placeHolder="Select services"
//           mrgnTop={responsiveHeight(1)}
//         />
//         <Input
//           handlePress={text => handleInputChange('address', text)}
//           placeHolder="Address"
//           value={editFields.address}
//           fontSize={responsiveFontSize(1.8)}
//           placeholderTxtColor="#BFBFBF"
//           icon
//           xml={pin}
//         />

//         <ListHeading
//           mrgnTop={responsiveHeight(1)}
//           title="Certificate"
//           showSeeAll={false}
//         />
//         {certificates?.length > 0 ? (
//           <FlatList
//             keyExtractor={(_, index) => index.toString()}
//             data={certificates}
//             horizontal
//             showsHorizontalScrollIndicator={false}
//             contentContainerStyle={{gap: responsiveHeight(2)}}
//             renderItem={({item}) => (
//               <View style={styles.previewContainer}>
//                 <TouchableOpacity
//                   onPress={() => handleRemoveImage(item)}
//                   style={styles.cutIconContainer}>
//                   <SvgIcons xml={cut} height={15} width={15} />
//                 </TouchableOpacity>
//                 <TouchableOpacity onPress={() => openFile(item)}>
//                   {item.type?.startsWith('image/') ||
//                   (typeof item === 'string' &&
//                     !item.toLowerCase().endsWith('.pdf')) ? (
//                     <Image
//                       source={{uri: item.uri || `${ImageBaseUrl}${item}`}}
//                       style={styles.previewBox}
//                     />
//                   ) : (
//                     <View style={[styles.previewBox, styles.docBox]}>
//                       <Text numberOfLines={2}>{item.name || item}</Text>
//                     </View>
//                   )}
//                 </TouchableOpacity>
//               </View>
//             )}
//           />
//         ) : (
//           <TouchableOpacity onPress={uploadDocuments} style={styles.dashBtn}>
//             <View style={styles.uploadIconContainer}>
//               <SvgIcons xml={upload3} height={30} width={30} />
//             </View>
//             <NormalText
//               title="Upload Your Certificate"
//               alignSelf="center"
//               fontWeight="700"
//               color="#3B4B68"
//               mrgnTop={responsiveHeight(1)}
//             />
//             <NormalText
//               title="JPG, PNG, PDF up to 5MB"
//               alignSelf="center"
//               fontWeight="400"
//               fontSize={responsiveFontSize(1.4)}
//               color="#A7ADFB"
//             />
//           </TouchableOpacity>
//         )}

//         <ListHeading
//           mrgnTop={responsiveHeight(1)}
//           title="Portfolio"
//           showSeeAll={false}
//         />

//         {portfolioImages?.length > 0 ? (
//           <FlatList
//             keyExtractor={(_, index) => index.toString()}
//             data={portfolioImages}
//             horizontal
//             showsHorizontalScrollIndicator={false}
//             contentContainerStyle={{gap: responsiveHeight(2)}}
//             renderItem={({item}) => (
//               <View style={styles.previewContainer}>
//                 <TouchableOpacity
//                   onPress={() => handleRemoveImage(item, true)}
//                   style={styles.cutIconContainer}>
//                   <SvgIcons xml={cut} height={15} width={15} />
//                 </TouchableOpacity>
//                 <TouchableOpacity onPress={() => openFile(item)}>
//                   {item.type?.startsWith('image/') ||
//                   (typeof item === 'string' &&
//                     !item.toLowerCase().endsWith('.pdf')) ? (
//                     <Image
//                       source={{uri: item.uri || `${ImageBaseUrl}${item}`}}
//                       style={styles.previewBox}
//                     />
//                   ) : (
//                     <View style={[styles.previewBox, styles.docBox]}>
//                       <Text numberOfLines={2}>{item.name || item}</Text>
//                     </View>
//                   )}
//                 </TouchableOpacity>
//               </View>
//             )}
//           />
//         ) : (
//           <TouchableOpacity
//             onPress={uploadPortfolioImages}
//             style={styles.dashBtn}>
//             <View style={styles.uploadIconContainer}>
//               <SvgIcons xml={upload3} height={30} width={30} />
//             </View>
//             <NormalText
//               title="Upload Your Portfolio"
//               alignSelf="center"
//               fontWeight="700"
//               color="#3B4B68"
//               mrgnTop={responsiveHeight(1)}
//             />
//             <NormalText
//               title="JPG, PNG up to 5MB"
//               alignSelf="center"
//               fontWeight="400"
//               fontSize={responsiveFontSize(1.4)}
//               color="#A7ADFB"
//             />
//           </TouchableOpacity>
//         )}

//         <TouchableOpacity
//           onPress={() => setAccept(!accept)}
//           style={styles.termsRow}>
//           <View
//             style={[
//               styles.checkbox,
//               {
//                 backgroundColor: accept ? Colors.buttonBg : Colors.white,
//                 borderWidth: accept ? 0 : 2,
//               },
//             ]}>
//             <SvgIcons xml={tick} height={15} width={15} />
//           </View>
//           <NormalText
//             width={responsiveWidth(80)}
//             fontSize={responsiveFontSize(1.8)}
//             color="#9DA5B3"
//             title="By continuing you accept our Privacy Policy and Term of Use"
//           />
//         </TouchableOpacity>

//       <View style={[styles.btnContainer, {marginTop: responsiveHeight(4)}]}>
//         <Button
//           isLoading={isLoading}
//           title={type === 'create' ? 'Next' : 'Update Now'}
//           bgColor={Colors.buttonBg}
//           textColor={Colors.white}
//           handlePress={
//             type === 'create' ? handleCreateProfile : handleEditProfile
//           }
//         />
//       </View>
//       </View>
//     </ScrollView>
//   );
// };

// const styles = {
//   container: {
//     flexGrow: 1,
//     padding: responsiveHeight(2),
//     backgroundColor: Colors.white,
//   },
//   previewBox: {
//     height: responsiveHeight(13),
//     width: responsiveWidth(32),
//     borderRadius: responsiveHeight(1.5),
//     elevation: 3,
//     shadowColor: '#000',
//     shadowOffset: {width: 0, height: 2},
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     backgroundColor: Colors.white,
//   },
//   docBox: {
//     backgroundColor: '#F8F9FF',
//     alignItems: 'center' as 'center',
//     justifyContent: 'center' as 'center',
//     padding: responsiveHeight(1),
//     borderWidth: 1,
//     borderColor: '#E7E9FF',
//   },
//   cutIconContainer: {
//     backgroundColor: Colors.white,
//     height: 24,
//     width: 24,
//     alignItems: 'center' as 'center',
//     justifyContent: 'center' as 'center',
//     borderRadius: 12,
//     position: 'absolute' as 'absolute',
//     right: -8,
//     top: -8,
//     zIndex: 100,
//     elevation: 4,
//     shadowColor: '#000',
//     shadowOffset: {width: 0, height: 1},
//     shadowOpacity: 0.2,
//     shadowRadius: 2,
//   },
//   dashBtn: {
//     alignItems: 'center' as 'center',
//     justifyContent: 'center' as 'center',
//     borderWidth: 1.5,
//     paddingVertical: responsiveHeight(3),
//     borderColor: '#E7E9FF',
//     borderStyle: 'dashed' as 'dashed',
//     borderRadius: responsiveHeight(2),
//     backgroundColor: '#F8F9FF',
//   },
//   uploadIconContainer: {
//     backgroundColor: Colors.white,
//     padding: responsiveHeight(1.5),
//     borderRadius: responsiveHeight(5),
//     elevation: 2,
//     shadowColor: '#A7ADFB',
//     shadowOffset: {width: 0, height: 2},
//     shadowOpacity: 0.2,
//     shadowRadius: 3,
//   },
//   termsRow: {
//     flexDirection: 'row' as 'row',
//     alignItems: 'center' as 'center',
//     gap: responsiveHeight(1),
//   },
//   checkbox: {
//     height: responsiveHeight(4),
//     width: responsiveWidth(8),
//     alignItems: 'center' as 'center',
//     justifyContent: 'center' as 'center',
//     borderColor: Colors.buttonBg,
//     borderRadius: responsiveHeight(1),
//   },
//   previewContainer: {
//     backgroundColor: 'transparent',
//     padding: 5,
//   },
//   bioContainer: {
//     flexDirection: 'row' as 'row',
//     backgroundColor: Colors.white,
//     borderRadius: responsiveHeight(1),
//     borderWidth: 2,
//     borderColor: '#EEEEEE',
//     minHeight: responsiveHeight(15),
//     width: '100%' as '100%',
//     padding: responsiveHeight(1),
//   },
//   bioIconRow: {
//     flexDirection: 'row' as 'row',
//     alignItems: 'flex-start' as 'flex-start',
//     marginTop: responsiveHeight(1),
//     gap: responsiveHeight(1),
//   },
//   verticalDivider: {
//     height: responsiveHeight(2.5),
//     width: 0.9,
//     backgroundColor: Colors.themeText || '#2A1E51',
//     marginRight: responsiveHeight(1),
//   },
//   bioInput: {
//     flex: 1,
//     color: '#000',
//     fontSize: responsiveFontSize(1.8),
//     textAlignVertical: 'top' as 'top',
//     paddingTop: 0,
//   },
//   btnContainer: {
//     width: '100%' as DimensionValue,
//   },
// };

// export default CreateBussProfile;
