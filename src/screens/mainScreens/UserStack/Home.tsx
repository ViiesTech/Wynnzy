import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Image,
  FlatList,
  PermissionsAndroid,
  Platform,
  Alert,
  TouchableOpacity,
  Linking,
  StyleSheet,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';

import SvgIcons from '../../../Components/SvgIcons';
import {notification, plus, rating, search} from '../../../assets/icons';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../../assets/responsive_dimensions';
import {Colors} from '../../../assets/colors';
import {BoldText, NormalText} from '../../../Components/Titles';
import Header from '../../../Components/Header';
import {images} from '../../../assets/images';
import {Button} from '../../../Components/Button';
import ListHeading from '../../../Components/ListHeading';
import SearchInput from '../../../Components/SearchInput';
import {fetchNearbyBusinesses, searchBusiness} from '../../../GlobalFunctions';
import {ImageBaseUrl} from '../../../BaseUrl';

const Home = ({navigation}: any) => {
  const [location, setLocation] = useState<any>(null);
  const [nearByHotels, setNearbyHotels] = useState<any>([]);
  const [loading, setLoading] = useState<any>(false);

  // 1. Permission Logic
  const requestPermissions = async () => {
    if (Platform.OS === 'ios') {
      const auth = await Geolocation.requestAuthorization('whenInUse');
      return auth === 'granted';
    }

    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return false;
  };

  // 2. Location Logic
  const getLocation = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      Alert.alert(
        'Permission Denied',
        'Location access is required to find nearby services.',
      );
      return;
    }

    Geolocation.getCurrentPosition(
      position => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      error => {
        console.log(error.code, error.message);
        Alert.alert('Location Error', 'Could not determine your location.');
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  // 3. API Logic - Triggered when location changes
  useEffect(() => {
    getLocation();
  }, []);

  useEffect(() => {
    if (location?.latitude && location?.longitude) {
      getNearbyBusinesses();
    }
  }, [location]);

  const getNearbyBusinesses = async () => {
    setLoading(true);
    try {
      const response = await fetchNearbyBusinesses(
        location?.latitude,
        location?.longitude,
      );
      setNearbyHotels(response.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const searchStoreHandler = async (searchedText: string) => {
    if (searchedText.trim() === '') {
      getNearbyBusinesses();
      return;
    }
    const response = await searchBusiness(searchedText);
    setNearbyHotels(response.data || []);
  };

  // 4. Render Items
  const renderNearbyItems = ({item}: any) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('StoreDetails', {
          _id: item._id,
          managerId: item.managerId,
        })
      }
      style={styles.card}>
      <Image
        source={{uri: `${ImageBaseUrl}${item?.profileImage}`}}
        style={styles.cardImage}
      />
      <BoldText
        title={item.businessName}
        fontSize={responsiveFontSize(2.2)}
        color="#2A1E51"
      />
      <View style={styles.ratingRow}>
        <View style={styles.ratingBadge}>
          <SvgIcons xml={rating} height={16} width={16} />
          <NormalText title={item?.ratings || 0} color="#5F5F63" />
        </View>
        <NormalText title="Rating" color="#5F5F63" />
      </View>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View style={{paddingHorizontal: responsiveHeight(2)}}>
      <Header
        handleFilterPress={() => navigation.navigate('Filter2')}
        iconName={notification}
        handleNotificationPress={() => navigation.navigate('Notification')}
        handlePress={() => navigation.navigate('Location')}
      />
      <SearchInput
        onChangeText={searchStoreHandler}
        txtColor={Colors.black}
        xml={search}
        placeHolder="Find best Hotels and Pet Care"
        placeHolderColor="#CACACA"
        bgColor="#F6F6F6"
      />
      <View style={styles.bannerContainer}>
        <Image
          style={styles.bannerImage}
          resizeMode="cover"
          source={images.slide}
        />
        <View style={styles.bannerOverlay}>
          <BoldText
            fontSize={responsiveFontSize(2)}
            color={Colors.white}
            title="Flash Sale"
          />
          <NormalText
            color={Colors.white}
            title="Get the best deals for your pet."
          />
          <Button
            height={responsiveHeight(4.5)}
            width={responsiveHeight(10)}
            textColor="white"
            bgColor="#69DBD9"
            title="See All"
            handlePress={() => console.log('Flash Sale Press')}
          />
        </View>
      </View>
      <ListHeading
        onSeeAllPress={() => navigation.navigate('AllHotels')}
        title="Nearby Pet Hotel / Daycares"
      />
    </View>
  );

  const listEmptyComponent = () => {
    return (
      <View style={styles.emptyContainer}>
        <NormalText
          title="No Daycares or Pet Hotels Available"
          txtAlign={'center'}
          mrgnTop={responsiveHeight(5)}
        />
      </View>
    );
  };

  // console.log('nearByHotels:-', nearByHotels);

  return (
    <View style={styles.container}>
      <FlatList
        data={nearByHotels.slice(0, 6)}
        renderItem={renderNearbyItems}
        keyExtractor={item => item._id.toString()}
        numColumns={2}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={listEmptyComponent()}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Floating Action Button */}
      <View style={styles.fab}>
        <Button
          handlePress={() =>
            navigation.navigate('CreateProfile', {type: 'create'})
          }
          width={responsiveWidth(35)}
          height={responsiveHeight(6.5)}
          title="Add Pet"
          bgColor={Colors.buttonBg}
          textColor="white"
          icon
          xml={plus}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.white},
  listContent: {paddingVertical: responsiveHeight(2)},
  columnWrapper: {
    justifyContent: 'space-between',
    paddingHorizontal: responsiveHeight(2),
  },
  card: {padding: 10, width: responsiveWidth(44)},
  cardImage: {
    width: '100%',
    height: responsiveHeight(17),
    borderRadius: responsiveHeight(1),
    backgroundColor: '#eee',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 10,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderRadius: 5,
    backgroundColor: '#F5F5F5',
    padding: 5,
  },
  bannerContainer: {
    marginVertical: responsiveHeight(2),
    borderRadius: 10,
    overflow: 'hidden',
  },
  bannerImage: {width: '100%', height: responsiveHeight(21)},
  bannerOverlay: {
    position: 'absolute',
    top: 0,
    left: 20,
    height: '100%',
    justifyContent: 'center',
    gap: 5,
  },
  fab: {
    position: 'absolute',
    bottom: responsiveHeight(4),
    right: responsiveHeight(2),
    zIndex: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'red',
    paddingHorizontal: responsiveHeight(2),
  },
});

export default Home;

// /* eslint-disable react-native/no-inline-styles */
// import React, {useEffect, useState} from 'react';
// import SvgIcons from '../../../Components/SvgIcons';
// import {notification, plus, rating, search} from '../../../assets/icons';
// import {
//   responsiveFontSize,
//   responsiveHeight,
//   responsiveWidth,
// } from '../../../assets/responsive_dimensions';
// import {Colors} from '../../../assets/colors';
// import {BoldText, NormalText} from '../../../Components/Titles';
// import {
//   View,
//   Image,
//   FlatList,
//   ScrollView,
//   PermissionsAndroid,
//   Platform,
//   Alert,
//   TouchableOpacity,
//   Linking,
// } from 'react-native';
// import Header from '../../../Components/Header';
// import {images} from '../../../assets/images';
// import {Button} from '../../../Components/Button';
// import ListHeading from '../../../Components/ListHeading';
// import FlashSaleCards from '../../../Components/FlashSaleCards';
// import SearchInput from '../../../Components/SearchInput';
// import Geolocation from 'react-native-geolocation-service';
// import {fetchNearbyBusinesses, searchBusiness} from '../../../GlobalFunctions';
// import {ImageBaseUrl} from '../../../BaseUrl';

// const Home = ({navigation}) => {
//   const [location, setLocation] = useState<{
//     latitude: number;
//     longitude: number;
//   } | null>(null);
//   const [nearByHotels, setNearbyHotels] = useState([]);

//   const data = [
//     {
//       id: 1,
//       picture: images.boarding,
//     },
//     {
//       id: 2,
//       picture: images.boarding,
//     },
//   ];

//   const nearByData = [
//     {
//       id: 1,
//       pic: images.dog1,
//     },
//     {
//       id: 2,
//       pic: images.dog2,
//     },
//   ];

//   const requestPermissions = async () => {
//     try {
//       if (Platform.OS === 'android') {
//         const granted = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//           {
//             title: 'Location Access Required',
//             message: 'This App needs to access your location',
//             buttonNeutral: 'Ask Me Later',
//             buttonNegative: 'Cancel',
//             buttonPositive: 'OK',
//           },
//         );
//         return granted === PermissionsAndroid.RESULTS.GRANTED;
//       }
//       return true; // iOS handled via Info.plist
//     } catch (err) {
//       console.warn('Permission error:', err);
//       return false;
//     }
//   };

//   const getLocation = async () => {
//     const hasPermission = await requestPermissions();
//     if (!hasPermission) {
//       Alert.alert('Permission Denied', 'Cannot access location');
//       return;
//     }

//     Geolocation.getCurrentPosition(
//       position => {
//         setLocation({
//           latitude: position.coords.latitude,
//           longitude: position.coords.longitude,
//         });
//       },
//       error => {
//         if (error.code === 1) {
//           // Permission denied
//           Alert.alert(
//             'Permission Required',
//             'Location permission is denied. Please enable it in Settings.',
//             [
//               {text: 'Cancel', style: 'cancel'},
//               {
//                 text: 'Open Settings',
//                 onPress: () => Linking.openURL('app-settings:'),
//               },
//             ],
//           );
//         } else {
//           Alert.alert('Error', `Could not fetch location: ${error.message}`);
//         }
//       },
//       {
//         enableHighAccuracy: true,
//         timeout: 15000,
//         maximumAge: 10000,
//         forceRequestLocation: true,
//         showLocationDialog: true,
//       },
//     );
//   };

//   const getNearbyBusinesses = async () => {
//     const response = await fetchNearbyBusinesses(
//       location?.latitude,
//       location?.longitude,
//     );
//     setNearbyHotels(response.data);
//   };
//   const searchStoreHandler = async searchedText => {
//     const response = await searchBusiness(searchedText);
//     console.log('response.data', response.data);
//     setNearbyHotels(response.data);
//   };

//   useEffect(() => {
//     getLocation();
//     getNearbyBusinesses();
//   }, []);

//   const renderNearbyItems = ({item, index}) => {
//     return (
//       <TouchableOpacity
//         onPress={() =>
//           navigation.navigate('StoreDetails', {
//             _id: item._id,
//             managerId: item.managerId,
//           })
//         }
//         key={index}
//         style={{padding: 10, width: responsiveWidth(48)}}>
//         <Image
//           source={{uri: `${ImageBaseUrl}${item?.profileImage}`}}
//           style={{
//             width: '100%',
//             height: responsiveHeight(17),
//             borderRadius: responsiveHeight(1),
//           }}
//         />
//         <BoldText
//           title={item.businessName}
//           fontSize={responsiveFontSize(2.4)}
//           color="#2A1E51"
//         />
//         <View
//           style={{
//             flexDirection: 'row',
//             alignItems: 'center',
//             gap: 10,
//             marginTop: 10,
//           }}>
//           <View
//             style={{
//               flexDirection: 'row',
//               alignItems: 'center',
//               gap: 10,
//               borderRadius: 5,
//               backgroundColor: '#F5F5F5',
//               padding: 7,
//             }}>
//             <SvgIcons xml={rating} height={20} width={20} />
//             <NormalText
//               title={item?.ratings || 0}
//               alignSelf="center"
//               color="#5F5F63"
//             />
//           </View>
//           <NormalText title="Rating" alignSelf="center" color="#5F5F63" />
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   console.log('location:-', location);
//   return (
//     <ScrollView
//       showsVerticalScrollIndicator={false}
//       contentContainerStyle={{
//         flexGrow: 1,
//         paddingVertical: responsiveHeight(4),
//         backgroundColor: Colors.white,
//       }}>
//       <View style={{paddingHorizontal: responsiveHeight(2)}}>
//         <Header
//           handleFilterPress={() => navigation.navigate('Filter2')}
//           iconName={notification}
//           handleNotificationPress={() => navigation.navigate('Notification')}
//           handlePress={() => navigation.navigate('Location')}
//           bgColor={''}
//           whiteNotification={false}
//         />
//         <SearchInput
//           onChangeText={e => searchStoreHandler(e)}
//           txtColor={Colors.black}
//           xml={search}
//           placeHolder="Find best Hotels and Pet Care"
//           placeHolderColor="#CACACA"
//           bgColor="#F6F6F6"
//         />
//         <View style={{marginVertical: responsiveHeight(2)}}>
//           <Image
//             style={{width: '100%'}}
//             resizeMode="contain"
//             source={images.slide}
//           />
//           <View
//             style={{
//               position: 'absolute',
//               height: '100%',
//               marginTop: responsiveHeight(2.5),
//               gap: responsiveHeight(0.8),
//               left: responsiveHeight(3.5),
//             }}>
//             <BoldText
//               fontSize={responsiveFontSize(2)}
//               color={Colors.white}
//               alignSelf="right"
//               title="Flash Sale"
//             />
//             <NormalText color={Colors.white} title="Lorem Ipsum Dummy Text." />
//             <Button
//               alignSelf="flex-start"
//               height={responsiveHeight(5)}
//               width={responsiveHeight(11)}
//               textColor="white"
//               bgColor="#69DBD9"
//               title="See All"
//               borderColor={''}
//               borderRadius={0}
//               xml={''}
//               textFont={0}
//               handlePress={function (): void {
//                 console.log('See All');
//               }}
//             />
//           </View>
//         </View>

//         {/* <ListHeading btnContainer title="Flash Sale" /> */}
//       </View>
//       {/* <FlatList contentContainerStyle={{ gap: 20, marginBottom: 10, paddingHorizontal: responsiveHeight(2) }} showsHorizontalScrollIndicator={false} horizontal data={data} renderItem={() => <FlashSaleCards />} /> */}
//       <View style={{paddingHorizontal: responsiveHeight(2)}}>
//         <View>
//           <ListHeading
//             onSeeAllPress={() => navigation.navigate('AllHotels')}
//             title="Nearby Pet Hotel / Daycares"
//           />
//         </View>
//         {nearByHotels?.length ? (
//           <FlatList
//             showsVerticalScrollIndicator={false}
//             numColumns={2}
//             contentContainerStyle={{justifyContent: 'space-between'}}
//             data={nearByHotels?.slice(0, 6)}
//             renderItem={renderNearbyItems}
//             keyExtractor={item => item._id.toString()} // Unique key for each item
//           />
//         ) : (
//           <NormalText
//             numberOfLines={2}
//             width={responsiveWidth(80)}
//             txtAlign="center"
//             mrgnTop={responsiveHeight(10)}
//             fontSize={responsiveFontSize(2.5)}
//             alignSelf="center"
//             title="No Daycares or Pet Hotels Available"
//           />
//         )}
//       </View>
//       <View
//         style={{
//           position: 'absolute',
//           bottom: responsiveHeight(2),
//           right: responsiveHeight(2),
//           zIndex: 10,
//         }}>
//         <Button
//           handlePress={() =>
//             navigation.navigate('CreateProfile', {type: 'create'})
//           }
//           width={responsiveWidth(34)}
//           height={responsiveHeight(6.5)}
//           title="Add Pet"
//           bgColor={Colors.buttonBg}
//           textColor="white"
//           icon
//           xml={plus}
//           borderColor={''}
//           borderRadius={0}
//           textFont={0}
//         />
//       </View>
//     </ScrollView>
//   );
// };

// export default Home;
