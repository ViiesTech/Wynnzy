/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  FlatList,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import {useSelector} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../../assets/responsive_dimensions';
import {Colors} from '../../../assets/colors';
import {NormalText} from '../../../Components/Titles';
import {getAllBookingsByManagerId} from '../../../GlobalFunctions';
import BookingCard from '../../../Components/BookingCard';
import TextHeader from '../../../Components/TextHeader';
import DaycareHeader from '../../../Components/DaycareHeader';

const Orders = ({navigation, route}: any) => {
  const [currentCategory, setCurrentCategory] = useState('Pending');
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const from = route?.params?.from;

  const isFocused = useIsFocused();
  const businessData = useSelector(
    (state: any) => state.user.businessProfileData,
  );
  const managerId = businessData?.managerId || businessData?._id;

  const categories = [
    {id: 1, title: 'Pending'},
    {id: 2, title: 'Accepted'},
    {id: 3, title: 'Rejected'},
    {id: 4, title: 'Completed'},
  ];

  const fetchBookingsHandler = async () => {
    if (!managerId) {
      return;
    }
    try {
      setLoading(true);
      const response = await getAllBookingsByManagerId(
        managerId,
        currentCategory,
      );
      setBookings(response?.data || []);
    } catch (error) {
      console.log('Fetch Bookings Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
      fetchBookingsHandler();
    }
  }, [currentCategory, isFocused]);

  const renderHeader = () => (
    <View style={{marginBottom: responsiveHeight(1)}}>
      {from ? (
        <TextHeader title="Orders" navigation={navigation} />
      ) : (
        <DaycareHeader title="Orders" navigation={navigation} centerText />
      )}
      <FlatList
        data={categories}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.categoryList}
        renderItem={({item}) => {
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
                styles.categoryBtn,
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
        }}
      />
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No {currentCategory} Bookings Found!</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <View style={styles.loaderContainer}>
          {renderHeader()}
          <View style={{flex: 1, justifyContent: 'center'}}>
            <ActivityIndicator size="large" color={Colors.buttonBg} />
          </View>
        </View>
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(_, index) => index.toString()}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={renderEmpty}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({item}) => {
            return (
              <BookingCard
                data={item}
                handlePress={() =>
                  navigation.navigate('ViewBookedServices', {
                    type: 'daycare',
                    service: item?.serviceId,
                    bookingId: item?._id,
                    bookingStatus: item?.status,
                    paymentStatus: item?.paymentStatus,
                    userId: item?.userId?._id || item?.userId,
                    managerId: managerId,
                  })
                }
              />
            );
          }}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  loaderContainer: {
    flex: 1,
    padding: 20,
  },
  listContent: {
    padding: 20,
    paddingBottom: 40,
    gap: responsiveHeight(1.5),
  },
  categoryList: {
    gap: 10,
    marginTop: responsiveHeight(2),
    paddingBottom: 10,
  },
  categoryBtn: {
    height: responsiveHeight(6),
    width: responsiveWidth(20.5),
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
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    marginTop: responsiveHeight(10),
  },
  emptyText: {
    fontSize: responsiveFontSize(2.2),
    color: '#9DA5B3',
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default Orders;
