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
import {useIsFocused} from '@react-navigation/native';
import BookingCard from '../../../Components/BookingCard';
import UserHeader from '../../../Components/UserHeader';

const CATEGORIES = [
  {id: 1, title: 'Pending'},
  {id: 2, title: 'Accepted'},
  {id: 3, title: 'Rejected'},
  {id: 4, title: 'Completed'},
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

  const renderCategoryItem = ({item}: any) => {
    const isSelected =
      currentCategory === item.title ||
      (item.title === 'Accepted' && currentCategory === 'Accept') ||
      (item.title === 'Rejected' && currentCategory === 'Reject');
    return (
      <TouchableOpacity
        onPress={() =>
          setCurrentCategory(
            item.title === 'Accepted'
              ? 'Accept'
              : item.title === 'Rejected'
              ? 'Reject'
              : item.title,
          )
        }
        style={[
          styles.categoryTab,
          {backgroundColor: isSelected ? Colors.buttonBg : '#f3f3f3'},
        ]}>
        <NormalText
          color={isSelected ? 'white' : '#C3C8D5'}
          title={item.title}
          alignSelf="center"
          fontSize={responsiveFontSize(1.6)}
        />
      </TouchableOpacity>
    );
  };

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
    height: responsiveHeight(6),
    width: responsiveWidth(20.6),
    paddingVertical: 10,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
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
