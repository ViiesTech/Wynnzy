/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  FlatList,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
} from 'react-native';
import {useSelector} from 'react-redux';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../../assets/responsive_dimensions';
import {Colors} from '../../../assets/colors';
import {NormalText} from '../../../Components/Titles';
import {getAllBookingsByUserId} from '../../../GlobalFunctions';
import FilterCard from '../../../Components/FilterCard';
import moment from 'moment';
import TextHeader from '../../../Components/TextHeader';
import {useIsFocused} from '@react-navigation/native';
import BookingCard from '../../../Components/BookingCard';
import UserHeader from '../../../Components/UserHeader';

const CATEGORIES = [
  {id: '1', title: 'Pending'},
  {id: '2', title: 'Accept'}, // Matches your backend query param
  {id: '3', title: 'Reject'},
];

const ViewBookings = ({navigation}: any) => {
  const [currentCategory, setCurrentCategory] = useState('Pending');
  const [bookings, setBookings] = useState([]);
  const {_id, type} = useSelector((state: any) => state.user.userData);
  const [loading, setLoading] = useState(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    fetchBookingsHandler();
  }, [currentCategory, isFocused]);

  const fetchBookingsHandler = async () => {
    setLoading(true);
    try {
      const response = await getAllBookingsByUserId(_id, currentCategory);
      setBookings(response?.data || []);
    } catch (error) {
      console.error('Fetch Bookings Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderCategoryItem = ({item}: any) => (
    <TouchableOpacity
      onPress={() => setCurrentCategory(item.title)}
      style={[
        styles.categoryTab,
        {
          backgroundColor:
            currentCategory === item.title ? Colors.buttonBg : '#f3f3f3',
        },
      ]}>
      <NormalText
        alignSelf="center"
        color={currentCategory === item.title ? 'white' : '#C3C8D5'}
        title={
          item.title === 'Accept'
            ? 'Accepted'
            : item.title === 'Reject'
            ? 'Rejected'
            : item.title
        }
      />
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View style={{backgroundColor: Colors.white}}>
      <UserHeader
        title={type === 'User' ? 'All Bookings' : 'All Orders'}
        navigation={navigation}
        centerText={true}
      />
      <FlatList
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryList}
        horizontal
        data={CATEGORIES}
        keyExtractor={item => item.id}
        renderItem={renderCategoryItem}
      />
    </View>
  );

  const listEmptyComponent = () => {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          No Bookings Found Related To This Category!
        </Text>
      </View>
    );
  };

  const renderItem = ({item}: any) => {
    return (
      <BookingCard
        data={item}
        handlePayNow={() =>
          navigation.navigate('Payment', {
            allServices: Array.isArray(item.serviceId)
              ? item.serviceId
              : [item.serviceId],
            petId: item.petId?._id || item.petId,
            managerId: item.managerId?._id || item.managerId,
            address: item.address,
            userId: _id,
            total: item.total,
            categoryId: item.categoryId?._id || item.categoryId,
            serviceId: Array.isArray(item.serviceId)
              ? item.serviceId.map((s: any) => s._id || s)
              : [item.serviceId?._id || item.serviceId],
            selectDate: item.selectDate,
            bookingId: item?._id,
          })
        }
        handlePress={() =>
          navigation.navigate('ViewBookedServices', {
            type: type || 'user',
            service: item.serviceId,
            bookingId: item?._id,
            bookingStatus: item?.status,
            paymentStatus: item?.paymentStatus,
          })
        }
      />
    );
  };

  // console.log('Bookings:------', bookings);

  return (
    <View style={styles.container}>
      {renderHeader()}

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size={'large'} color={Colors.buttonBg} />
        </View>
      ) : (
        <FlatList
          data={bookings}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={listEmptyComponent}
          contentContainerStyle={styles.bookingList}
          keyExtractor={(item: any) => item?._id?.toString()}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: 20,
    paddingTop: responsiveHeight(1),
  },
  categoryList: {
    gap: 10,
    marginTop: responsiveHeight(2),
    paddingBottom: 10,
  },
  categoryTab: {
    width: responsiveWidth(28),
    paddingVertical: 10,
    height: responsiveHeight(6),
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookingList: {
    gap: responsiveHeight(1.5),
    paddingTop: responsiveHeight(1),
    paddingBottom: 20,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: responsiveHeight(10),
  },
  emptyText: {
    fontSize: responsiveFontSize(2.2),
    fontWeight: '400',
    color: '#666',
    textAlign: 'center',
  },
});

export default ViewBookings;
