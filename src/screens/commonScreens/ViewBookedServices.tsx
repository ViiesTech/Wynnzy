/* eslint-disable react-native/no-inline-styles */
import { View, Text, FlatList, ActivityIndicator, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { Colors } from '../../assets/colors';
import { responsiveHeight, responsiveWidth } from '../../assets/responsive_dimensions';
import moment from 'moment';
import FilterCard from '../../Components/FilterCard';
import TextHeader from '../../Components/TextHeader';
import { Button } from '../../Components/Button';
import { deleteBooking, ShowToast, updateBookingStatus } from '../../GlobalFunctions/Auth';

const ViewBookedServices = ({ navigation, route }) => {
  const { type, service, bookingId, bookingStatus } = route?.params;
  const [isLoading, setIsLoading] = useState(false);
  console.log('bookingId', bookingId);
  const updateBookingHandler = async (status) => {
    setIsLoading(true);
    const response = await updateBookingStatus(bookingId, status);
    setIsLoading(false);
    if (response.success) {
      ShowToast('success', response.message);
      navigation.goBack();
    } else {
      ShowToast('error', response.message);
    }
    console.log('response', response);
  };

  const deleteBookingHandler = async () => {
    setIsLoading(true);
    const response = await deleteBooking(bookingId);
    setIsLoading(false);
    if (response.success) {
      ShowToast('success', response.message);
      navigation.goBack();
    } else {
      ShowToast('error', response.message);
    }

  }
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: Colors.white, padding: responsiveHeight(2) }}>
      <TextHeader title="Services" />
      <View style={{ flex: 1 }}>
        {isLoading ? (
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <ActivityIndicator size={50} color={Colors.buttonBg} />
          </View>
        ) : (
          <View style={{ flex: 1 }}>
            {service?.length > 0 ? (
              <FlatList
                contentContainerStyle={{ gap: responsiveHeight(1.5), marginTop: responsiveHeight(2) }}
                data={service}
                renderItem={({ item }) => (
                  <FilterCard
                    status={item?.status}
                    price={item?.price}
                    address={item?.address}
                    description={item?.description}
                    time={moment(item?.selectDate).format('MMMM/DD/YY')}
                    serviceName={item?.serviceName}
                    imageUrl={item?.images[0]}
                  // handlePress={() =>
                  //   navigation.navigate('ViewBookedServices', {
                  //     type: 'user',
                  //     service: item.serviceId,
                  //   })
                  // }
                  />
                )}
                keyExtractor={(item, index) => index.toString()}
              />
            ) : null}
            {type === 'daycare' ? (
              <View style={{ flexDirection: 'row', gap: responsiveHeight(2), marginTop: responsiveHeight(2), alignItems: 'center', justifyContent: 'center', width: '100%', alignSelf: 'center' }}>
                <Button handlePress={() => updateBookingHandler('Accept')} bgColor={Colors.buttonBg} textColor={Colors.white} title="Accept" width={responsiveWidth(45)} />
                <Button handlePress={() => updateBookingHandler('Reject')} bgColor={Colors.buttonBg} textColor={Colors.white} title="Reject" width={responsiveWidth(45)} />
              </View>
            ) : bookingStatus !== 'Accept' ? (
              <Button handlePress={deleteBookingHandler} bgColor={Colors.buttonBg} textColor={Colors.white} title="Delete This Booking" />
            ) : null}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default ViewBookedServices;
