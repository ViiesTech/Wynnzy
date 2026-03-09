import React, {useState} from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import {Colors} from '../../assets/colors';
import {
  responsiveHeight,
  responsiveWidth,
} from '../../assets/responsive_dimensions';
import {Button} from '../../Components/Button';
import {
  deleteBooking,
  ShowToast,
  updateBookingStatus,
} from '../../GlobalFunctions/Auth';
import ServiceCard from '../../Components/ServiceCard';
import UserHeader from '../../Components/UserHeader';

const ViewBookedServices = ({navigation, route}: any) => {
  const {
    type,
    service = [],
    bookingId,
    bookingStatus,
    paymentStatus,
  } = route?.params || {};

  const [isLoading, setIsLoading] = useState(false); // Global list loader
  const [loader, setLoader] = useState(false); // Accept/Complete loader
  const [secondLoader, setSecondLoader] = useState(false); // Reject loader

  const isPaid = paymentStatus === 'Succeeded';

  const updateBookingHandler = async (status: string) => {
    const isReject = status === 'Reject';
    try {
      isReject ? setSecondLoader(true) : setLoader(true);

      const response = await updateBookingStatus(bookingId, status);

      if (response?.success) {
        ShowToast('success', response.message);
        navigation.goBack();
      } else {
        ShowToast('error', response?.message || 'Update failed');
      }
    } catch (error) {
      ShowToast('error', 'Network error. Please try again.');
    } finally {
      setLoader(false);
      setSecondLoader(false);
    }
  };

  const deleteBookingHandler = async () => {
    try {
      setIsLoading(true);
      const response = await deleteBooking(bookingId);
      if (response?.success) {
        ShowToast('success', response.message);
        navigation.goBack();
      } else {
        ShowToast('error', response?.message || 'Deletion failed');
      }
    } catch (error) {
      ShowToast('error', 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const completeBookingHandler = async () => {
    try {
      setLoader(true);
      // Ensure updateBookingStatus handles the payment status update if required by your backend
      const response = await updateBookingStatus(bookingId, 'Completed');

      if (response?.success) {
        ShowToast('success', 'Booking marked as Completed');
        navigation.goBack();
      } else {
        ShowToast('error', response?.message || 'Update failed');
      }
    } catch (error) {
      ShowToast('error', 'Something went wrong');
    } finally {
      setLoader(false);
    }
  };

  const renderFooter = () => {
    if (isLoading) {
      return null;
    }

    // DAYCARE MANAGER VIEW
    if (type === 'daycare') {
      // Flow 1: Booking is accepted and paid -> Show Complete button
      if (isPaid && bookingStatus === 'Accept') {
        return (
          <View style={styles.bottomButtonContainer}>
            <Button
              title="Mark as Completed"
              bgColor={Colors.buttonBg}
              textColor={Colors.white}
              isLoading={loader}
              handlePress={completeBookingHandler}
            />
          </View>
        );
      }

      // Flow 2: Booking is new -> Show Accept/Reject
      if (bookingStatus === 'Pending') {
        return (
          <View style={styles.bottomButtonContainer}>
            <Button
              title="Accept"
              bgColor={Colors.buttonBg}
              textColor={Colors.white}
              width={responsiveWidth(42)}
              isLoading={loader}
              disabled={secondLoader} // Prevent overlap
              handlePress={() => updateBookingHandler('Accept')}
            />
            <Button
              title="Reject"
              bgColor="#FF4D4D" // Distinct color for rejection
              textColor={Colors.white}
              width={responsiveWidth(42)}
              isLoading={secondLoader}
              disabled={loader} // Prevent overlap
              handlePress={() => updateBookingHandler('Reject')}
            />
          </View>
        );
      }
    }

    // USER VIEW
    if (type === 'User' && bookingStatus !== 'Completed') {
      return (
        <View style={styles.bottomButtonContainer}>
          <Button
            title="Cancel Booking"
            bgColor="#9DA5B3"
            textColor={Colors.white}
            handlePress={deleteBookingHandler}
            isLoading={isLoading}
          />
        </View>
      );
    }

    return null;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <UserHeader
          title="Booking Details"
          navigation={navigation}
          backIcon={true}
          centerText={true}
        />
      </View>

      <View style={styles.contentWrapper}>
        {isLoading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={Colors.buttonBg} />
          </View>
        ) : (
          <FlatList
            data={service}
            keyExtractor={(item, index) => item?._id || index.toString()}
            contentContainerStyle={styles.listContent}
            renderItem={({item}) => (
              <ServiceCard data={item} activeOpacity={1} />
            )}
            showsVerticalScrollIndicator={false}
            // If you want the buttons to scroll with the list,
            // you could use ListFooterComponent={renderFooter} instead.
          />
        )}
      </View>

      {/* Fixed buttons at the bottom for better accessibility */}
      {!isLoading && renderFooter()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  headerContainer: {
    paddingTop: responsiveHeight(1),
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingHorizontal: responsiveWidth(4),
    paddingTop: responsiveHeight(2),
    paddingBottom: responsiveHeight(10), // Space for fixed footer
    gap: responsiveHeight(1.5),
  },
  contentWrapper: {
    flex: 1,
  },
  bottomButtonContainer: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    gap: responsiveWidth(4),
    paddingHorizontal: responsiveWidth(4),
    paddingVertical: responsiveHeight(2),
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    // Shadow for iOS/Android
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -3},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});

export default ViewBookedServices;
