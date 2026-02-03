/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import SvgIcons from '../../../Components/SvgIcons';
import { notification, plus, rating, search } from '../../../assets/icons';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from '../../../assets/responsive_dimensions';
import { Colors } from '../../../assets/colors';
import { BoldText, NormalText } from '../../../Components/Titles';
import { View, Image, FlatList, ScrollView, PermissionsAndroid, Platform, Alert, TouchableOpacity, Linking } from 'react-native';
import Header from '../../../Components/Header';
import { images } from '../../../assets/images';
import { Button } from '../../../Components/Button';
import ListHeading from '../../../Components/ListHeading';
import FlashSaleCards from '../../../Components/FlashSaleCards';
import SearchInput from '../../../Components/SearchInput';
import Geolocation from 'react-native-geolocation-service';
import { fetchNearbyBusinesses, searchBusiness } from '../../../GlobalFunctions';
import { ImageBaseUrl } from '../../../BaseUrl';

const Home = ({ navigation }) => {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [nearByHotels, setNearbyHotels] = useState([]);
  console.log('location', location);
  const data = [
    {
      id: 1,
      picture: images.boarding,
    },
    {
      id: 2,
      picture: images.boarding,
    },
  ];

  const nearByData = [
    {
      id: 1,
      pic: images.dog1,
    },
    {
      id: 2,
      pic: images.dog2,
    },
  ];

  const requestPermissions = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Access Required',
            message: 'This App needs to access your location',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
      return true; // iOS handled via Info.plist
    } catch (err) {
      console.warn('Permission error:', err);
      return false;
    }
  };

  const getLocation = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      Alert.alert('Permission Denied', 'Cannot access location');
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
        if (error.code === 1) { // Permission denied
          Alert.alert(
            'Permission Required',
            'Location permission is denied. Please enable it in Settings.',
            [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'Open Settings',
                onPress: () => Linking.openURL('app-settings:'),
              },
            ]
          );
        } else {
          Alert.alert('Error', `Could not fetch location: ${error.message}`);
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
        forceRequestLocation: true,
        showLocationDialog: true,
      }
    );
  };

  const getNearbyBusinesses = async () => {
    const response = await fetchNearbyBusinesses(location?.latitude, location?.longitude);
    setNearbyHotels(response.data);
  }
  const searchStoreHandler = async (searchedText) => {
    const response = await searchBusiness(searchedText);
    console.log('response.data', response.data);
    setNearbyHotels(response.data);
  };

  useEffect(() => {
    getLocation();
    getNearbyBusinesses();
  }, []);

  const renderNearbyItems = ({ item, index }) => {
    return (
      <TouchableOpacity onPress={() => navigation.navigate('StoreDetails', { _id: item._id, managerId: item.managerId })} key={index} style={{ padding: 10, width: responsiveWidth(48) }}>
        <Image source={{ uri: `${ImageBaseUrl}${item?.profileImage}` }} style={{ width: '100%', height: responsiveHeight(17), borderRadius: responsiveHeight(1) }} />
        <BoldText title={item.businessName} fontSize={responsiveFontSize(2.4)} color="#2A1E51" />
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 10 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, borderRadius: 5, backgroundColor: '#F5F5F5', padding: 7 }}>
            <SvgIcons xml={rating} height={20} width={20} />
            <NormalText title={item?.ratings || 0} alignSelf="center" color="#5F5F63" />
          </View>
          <NormalText title="Rating" alignSelf="center" color="#5F5F63" />
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, paddingVertical: responsiveHeight(4), backgroundColor: Colors.white }}>
      <View style={{ paddingHorizontal: responsiveHeight(2) }}>
        <Header
          handleFilterPress={() => navigation.navigate('Filter2')}
          iconName={notification}
          handleNotificationPress={() => navigation.navigate('Notification')}
          handlePress={() => navigation.navigate('Location')}
          bgColor={''}
          whiteNotification={false}
        />
        <SearchInput onChangeText={(e) => searchStoreHandler(e)} txtColor={Colors.black} xml={search} placeHolder="Find best Hotels and Pet Care" placeHolderColor="#CACACA" bgColor="#F6F6F6" />
        <View style={{ marginVertical: responsiveHeight(2) }}>
          <Image style={{ width: '100%' }} resizeMode="contain" source={images.slide} />
          <View style={{ position: 'absolute', height: '100%', marginTop: responsiveHeight(2.5), gap: responsiveHeight(0.8), left: responsiveHeight(3.5) }}>
            <BoldText fontSize={responsiveFontSize(2)} color={Colors.white} alignSelf="right" title="Flash Sale" />
            <NormalText color={Colors.white} title="Lorem Ipsum Dummy Text." />
            <Button alignSelf="flex-start" height={responsiveHeight(5)} width={responsiveHeight(11)} textColor="white" bgColor="#69DBD9" title="See All" borderColor={''} borderRadius={0} xml={''} textFont={0} handlePress={function (): void {
              console.log('See All');
            }} />
          </View>

        </View>

        {/* <ListHeading btnContainer title="Flash Sale" /> */}
      </View>
      {/* <FlatList contentContainerStyle={{ gap: 20, marginBottom: 10, paddingHorizontal: responsiveHeight(2) }} showsHorizontalScrollIndicator={false} horizontal data={data} renderItem={() => <FlashSaleCards />} /> */}
      <View style={{ paddingHorizontal: responsiveHeight(2) }}>
        <View style={{}}>
          <ListHeading onSeeAllPress={() => navigation.navigate('AllHotels')} title="Nearby Pet Hotel / Daycares" />
        </View>
        {nearByHotels?.length ? (
          <FlatList
            showsVerticalScrollIndicator={false}
            numColumns={2}
            contentContainerStyle={{ justifyContent: 'space-between' }}
            data={nearByHotels?.slice(0, 6)}
            renderItem={renderNearbyItems}
            keyExtractor={(item) => item._id.toString()} // Unique key for each item
          />
        ) : (
          <NormalText numberOfLines={2} width={responsiveWidth(80)} txtAlign='center' mrgnTop={responsiveHeight(10)} fontSize={responsiveFontSize(2.5)} alignSelf='center' title="No Daycares or Pet Hotels Available" />
        )}
      </View>
      <View style={{ position: 'absolute', bottom: responsiveHeight(2), right: responsiveHeight(2), zIndex: 10 }}>
        <Button handlePress={() => navigation.navigate('CreateProfile', { type: 'create' })} width={responsiveWidth(34)} height={responsiveHeight(6.5)} title="Add Pet" bgColor={Colors.buttonBg} textColor="white" icon xml={plus} borderColor={''} borderRadius={0} textFont={0} />
      </View>
    </ScrollView>
  );
};

export default Home;
