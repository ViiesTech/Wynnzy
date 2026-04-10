import React, {useEffect, useState, useCallback, Fragment} from 'react';
import {
  View,
  Image,
  FlatList,
  PermissionsAndroid,
  Platform,
  Alert,
  TouchableOpacity,
  StyleSheet,
  Linking,
  ActivityIndicator,
} from 'react-native';
import FastImage from 'react-native-fast-image';
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
import UserHeader from '../../../Components/UserHeader';

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
      <FastImage
        source={{uri: `${ImageBaseUrl}${item?.profileImage}`}}
        style={styles.cardImage}
        resizeMode={FastImage.resizeMode.cover}
      />
      <BoldText
        title={item.fullName}
        fontSize={responsiveFontSize(2)}
        color="#2A1E51"
        numberOfLines={1}
        mrgnTop={responsiveHeight(0.5)}
      />
      <View style={styles.ratingRow}>
        <View style={styles.ratingBadge}>
          <SvgIcons xml={rating} height={16} width={16} />
          <NormalText title={item?.ratings || 0} color="#5F5F63" />
        </View>
        <NormalText
          title="Rating"
          color="#5F5F63"
          mrgnTop={responsiveHeight(0.5)}
        />
      </View>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <Fragment>
      <UserHeader home={true} bellIcon={true} navigation={navigation} />
      <View style={{paddingHorizontal: responsiveHeight(2)}}>
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
    </Fragment>
  );

  const listEmptyComponent = () => {
    return (
      <View style={styles.emptyContainer}>
        <NormalText
          title="No Daycares or Pet Hotels Available"
          alignSelf="center"
        />
      </View>
    );
  };

  // console.log('nearByHotels:-', JSON.stringify(nearByHotels, null, 2));

  return (
    <View style={styles.container}>
      <FlatList
        data={nearByHotels.slice(0, 6)}
        renderItem={renderNearbyItems}
        keyExtractor={item => item._id.toString()}
        numColumns={2}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={loading ? null : listEmptyComponent()}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Floating Action Button */}
      <View style={styles.fab}>
        <Button
          handlePress={() => navigation.navigate('AddPetProfile')}
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
  listContent: {flexGrow: 1, paddingVertical: responsiveHeight(2)},
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
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    gap: 10,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderRadius: 5,
    backgroundColor: '#F5F5F5',
    padding: 5,
    paddingHorizontal: 15,
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
    paddingHorizontal: responsiveHeight(2),
    // backgroundColor: 'red',
  },
});

export default Home;
