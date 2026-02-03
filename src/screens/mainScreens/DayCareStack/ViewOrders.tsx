/* eslint-disable react-native/no-inline-styles */
import { FlatList, TouchableOpacity, ScrollView, View, ActivityIndicator, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from '../../../assets/responsive_dimensions';
import { Colors } from '../../../assets/colors';
import { NormalText } from '../../../Components/Titles';
import { getAllBookingsByManagerId, getAllBookingsByUserId, getServicesByCategory } from '../../../GlobalFunctions';
import BackIcon from '../../../Components/BackIcon';
import FilterCard from '../../../Components/FilterCard';
import moment from 'moment';
import { useIsFocused } from '@react-navigation/native';

const ViewOrders = ({ navigation, route }) => {
  const [currentCategory, setCurrentCategory] = useState('Pending');
  const [bookings, setBookings] = useState([]);
  const { managerId } = useSelector(state => state.user.businessProfileData);
  const [loading, setLoading] = useState(false);
  const isFocused = useIsFocused();

  console.log('bookings', bookings);
  const data = [
    {
      id: 1,
      title: 'Pending',
    },
    {
      id: 2,
      title: 'Accept',
    },
    {
      id: 3,
      title: 'Reject',
    },
  ];

  const data2 = [
    {
      id: 1,

    },
    {
      id: 2,

    },
    {
      id: 3,

    },
  ];

  const renderCategories = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => setCurrentCategory(item.title)}
        style={{
          backgroundColor: currentCategory === item.title ? Colors.buttonBg : '#f3f3f3',
          width: responsiveWidth(28),
          paddingVertical: 10,
          height: responsiveHeight(6),
          borderRadius: 5,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <NormalText alignSelf="center" color={currentCategory === item.title ? 'white' : '#C3C8D5'} title={item.title} />
      </TouchableOpacity>
    );
  };

  const fetchBookingsHandler = async () => {
    setLoading(true);
    const response = await getAllBookingsByManagerId(managerId, currentCategory);
    setLoading(false);
    setBookings(response.data);
  };
  useEffect(() => {
    fetchBookingsHandler();
  }, [currentCategory,isFocused]);
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, flexGrow: 1, backgroundColor: Colors.white }}>
      <BackIcon />
      <View>
        <FlatList showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, marginTop: responsiveHeight(2) }} horizontal data={data} renderItem={renderCategories} />
      </View>
      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <ActivityIndicator size={50} color={Colors.buttonBg} />
        </View>
      ) : bookings?.length > 0 ? (
        <FlatList
          contentContainerStyle={{ gap: responsiveHeight(1.5), marginTop: responsiveHeight(2) }}
          data={bookings}
          renderItem={({ item }) => (
            <FilterCard
              status={item?.status}
              price={item?.total}
              address={item?.address}
              time={moment(item?.selectDate).format('MMMM/DD/YY')}
              serviceName={item?.categoryId?.categoryName}
              imageUrl={item?.categoryId?.image}
              handlePress={() =>
                navigation.navigate('ViewBookedServices', { type: 'daycare', service: item.serviceId, bookingId: item?._id })}
            />
          )}
        />
      ) : (
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: responsiveFontSize(2.5), fontWeight: '400', marginTop: responsiveHeight(7), textAlign: 'center' }}>No Bookings Found Related To This Category!</Text>
        </View>
      )}

    </ScrollView>
  );
};

export default ViewOrders;
