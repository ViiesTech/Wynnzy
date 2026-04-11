/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  ViewStyle,
  ImageStyle,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useSelector} from 'react-redux';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../../assets/responsive_dimensions';
import {Colors} from '../../../assets/colors';
import {ImageBaseUrl} from '../../../BaseUrl';
import {getAllPets, ShowToast} from '../../../GlobalFunctions/Auth';
import {
  getAllServicesByCategory,
  getServiceById,
} from '../../../GlobalFunctions';

// Components
import CalendarCard from '../../../Components/CalendarCard';
import {Button} from '../../../Components/Button';
import PickerCard from '../../../Components/PickerCard';
import {BoldText} from '../../../Components/Titles';
import Input from '../../../Components/Input';
import TextHeader from '../../../Components/TextHeader';
import {bookService} from '../../../GlobalFunctions';
import GooglePlaces from '../../../Components/GooglePlaces';

const ServiceDetail = ({navigation, route}: any) => {
  const {_id, managerId, serviceCategory, categoryId} = route?.params;
  const {userData} = useSelector((state: any) => state.user);

  const [isLoading, setIsLoading] = useState(true);
  const [loader, setLoader] = useState(false);
  const [data, setData] = useState<any>(null);
  const [value, setValue] = useState<any[]>([]); // Selected extra services
  const [otherServices, setOtherServices] = useState([]);
  const [allPets, setAllPets] = useState([]);

  const [selectedPet, setSelectedPet] = useState<string | null>(null);
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [address, setAddress] = useState('');

  // Calculate Total Price (Base Price + Extra Services) * Number of Days
  const pricePerDay =
    (data?.price || 0) +
    (value?.reduce((sum, item) => sum + (item?.price || 0), 0) || 0);

  const totalPrice =
    selectedDates.length > 0 ? pricePerDay * selectedDates.length : pricePerDay;

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [serviceRes, petsRes, othersRes] = await Promise.all([
        getServiceById(_id),
        getAllPets(userData._id),
        getAllServicesByCategory(managerId, serviceCategory),
      ]);

      setData(serviceRes.data);
      setAllPets(petsRes.data);

      // Filter out current service from "Others" dropdown
      const filtered = othersRes.data
        .filter((item: any) => item._id !== _id)
        .map((item: any) => ({
          label: `${item.serviceName} ($${item.price})`,
          value: item,
        }));
      setOtherServices(filtered);
    } catch (error) {
      console.error('Error fetching service details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={Colors.buttonBg} />
      </View>
    );
  }

  // const handleBookNow = async () => {
  //   if (!selectedPet) {
  //     return ShowToast('error', 'Please choose a pet.');
  //   }
  //   if (!address) {
  //     return ShowToast('error', 'Please enter a service address.');
  //   }
  //   if (!selectedDates || selectedDates.length === 0) {
  //     return ShowToast('error', 'Please select at least one date.');
  //   }

  //   const selectedServiceIds = [_id, ...value.map(item => item._id)];

  //   // navigation.navigate('Payment', {
  //   //   allServices: [data, ...value],
  //   //   petId: selectedPet,
  //   //   managerId,
  //   //   address,
  //   //   userId: userData._id,
  //   //   total: totalPrice,
  //   //   categoryId,
  //   //   serviceId: selectedServiceIds,
  //   //   selectDate: selectedDates,
  //   // });
  // };

  const handleBookNow = async () => {
    // 1. Validation Logic
    if (!selectedPet) {
      return ShowToast('error', 'Please choose a pet.');
    }
    if (!address) {
      return ShowToast('error', 'Please enter a service address.');
    }
    if (!selectedDates || selectedDates.length === 0) {
      return ShowToast('error', 'Please select at least one date.');
    }

    // 2. Prepare Payload
    // Combining the main service ID with any additional selected service IDs
    const selectedServiceIds = [_id, ...value.map(item => item._id)];

    // Note: Ensure these variables (managerId, categoryId, etc.)
    // are available in your component's scope.

    setLoader(true); // Start Loader
    try {
      const response = await bookService(
        userData._id, // userId
        selectedPet, // petId
        managerId, // managerId
        selectedServiceIds, // serviceId (Array or single ID depending on API)
        categoryId, // categoryId
        totalPrice, // total
        address, // address
        selectedDates, // selectDate
      );

      if (response.success) {
        ShowToast('success', response.message);
        navigation.navigate('BottomStack');
      } else {
        ShowToast('error', response.message || 'Booking failed');
      }
    } catch (error) {
      console.error('Booking Error:', error);
      ShowToast('error', 'Something went wrong with the booking');
    } finally {
      setLoader(false); // Stop Loader
    }
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={styles.container}>
      <View style={styles.subContainer}>
        <TextHeader title="Services Details" />

        {/* Main Service Info */}
        <View style={styles.contentView}>
          {data?.images?.[0] && (
            <FastImage
              source={{uri: `${ImageBaseUrl}${data.images[0]}`}}
              style={styles.imageStyle as any}
              resizeMode={FastImage.resizeMode.cover}
            />
          )}
          <View style={{flex: 1}}>
            <BoldText
              fontSize={responsiveFontSize(2.3)}
              fontWeight={'800'}
              title={data?.serviceName}
            />
            <Text style={styles.desc} numberOfLines={3}>
              {data?.description}
            </Text>
            <Text style={styles.price}>${data?.price?.toFixed(1)}</Text>
          </View>
        </View>

        <Text style={styles.heading}>Choose a Pet</Text>

        {/* Pet Selection Grid using .map for ScrollView compatibility */}
        <View style={styles.petGrid}>
          {allPets.map((item: any) => (
            <TouchableOpacity
              key={item._id}
              activeOpacity={0.7}
              style={petCardStyle(selectedPet || '', item._id)}
              onPress={() => {
                setSelectedPet(prev => (prev === item._id ? null : item._id));
              }}>
              <FastImage
                source={{uri: `${ImageBaseUrl}${item?.petImages[0]}`}}
                style={styles.petImage as any}
                resizeMode={FastImage.resizeMode.cover}
              />
              <View style={styles.petNameContainer}>
                <Text style={styles.petName}>{item?.petName}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Form Section */}
        <View style={styles.formContainer}>
          <View style={styles.googlePlacesContainer}>
            <GooglePlaces onAddressSelect={val => setAddress(val)} />
          </View>

          <CalendarCard onDatesSelect={setSelectedDates} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>SubTotal:</Text>
            <Text style={styles.totalValue}>${totalPrice.toFixed(1)}</Text>
          </View>
        </View>
      </View>

      <View style={styles.buttonWrapper}>
        <Button
          title="Book Now"
          isLoading={loader}
          borderRadius={10}
          bgColor={Colors.buttonBg}
          textColor={Colors.white}
          handlePress={handleBookNow}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {flexGrow: 1, backgroundColor: '#fff'},
  subContainer: {padding: responsiveHeight(2)},
  heading: {
    color: Colors.themeText,
    fontSize: responsiveFontSize(2.2),
    fontWeight: 'bold',
    marginTop: responsiveHeight(2),
  },
  contentView: {
    paddingTop: responsiveHeight(2),
    flexDirection: 'row',
    gap: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
    paddingBottom: responsiveHeight(2),
  },
  imageStyle: {
    height: responsiveHeight(15),
    width: responsiveHeight(15),
    borderRadius: 10,
    backgroundColor: Colors.lightGray,
  },
  desc: {color: '#888', fontSize: responsiveFontSize(1.6), marginTop: 5},
  price: {
    marginTop: 8,
    color: Colors.black,
    fontWeight: 'bold',
    fontSize: responsiveFontSize(2),
  },
  petGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: responsiveHeight(2),
  },
  petImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    resizeMode: 'cover',
    backgroundColor: Colors.lightGray,
  },
  petNameContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 5,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  petName: {color: '#fff', fontWeight: 'bold', textAlign: 'center'},
  formContainer: {marginTop: 20, width: '100%'},
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  totalLabel: {
    fontSize: responsiveFontSize(2),
    fontWeight: 'bold',
    color: Colors.themeText,
  },
  totalValue: {
    fontSize: responsiveFontSize(2.2),
    fontWeight: 'bold',
    color: Colors.buttonBg,
  },
  buttonWrapper: {padding: responsiveHeight(2), marginBottom: 20},
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  googlePlacesContainer: {
    marginTop: responsiveHeight(2),
    width: '100%',
    zIndex: 100,
  },
});

const petCardStyle = (selectedPet: string, itemId: string): ViewStyle => ({
  width: responsiveWidth(44),
  height: responsiveHeight(15),
  borderRadius: 12,
  borderWidth: 3,
  borderColor: selectedPet === itemId ? Colors.buttonBg : 'transparent',
  overflow: 'hidden',
});

export default ServiceDetail;
