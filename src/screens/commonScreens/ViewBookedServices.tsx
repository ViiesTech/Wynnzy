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
import TextHeader from '../../Components/TextHeader';
import {Button} from '../../Components/Button';
import {
  deleteBooking,
  ShowToast,
  updateBookingStatus,
} from '../../GlobalFunctions/Auth';
import ServiceCard from '../../Components/ServiceCard';

const ViewBookedServices = ({navigation, route}: any) => {
  // Safe destructuring
  const {type, service = [], bookingId, bookingStatus} = route?.params || {};
  const [isLoading, setIsLoading] = useState(false);

  const updateBookingHandler = async (status: string) => {
    try {
      setIsLoading(true);
      const response = await updateBookingStatus(bookingId, status);
      if (response?.success) {
        ShowToast('success', response.message);
        navigation.goBack();
      } else {
        ShowToast('error', response?.message || 'Update failed');
      }
    } catch (error) {
      ShowToast('error', 'Something went wrong');
    } finally {
      setIsLoading(false);
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

  // Logic to render buttons based on type and status
  const renderFooter = () => {
    if (isLoading) {
      return null;
    }

    if (type === 'daycare') {
      return (
        <View style={styles.bottomButtonContainer}>
          <Button
            title="Accept"
            bgColor={Colors.buttonBg}
            textColor={Colors.white}
            width={responsiveWidth(44)}
            handlePress={() => updateBookingHandler('Accept')}
          />
          <Button
            title="Reject"
            bgColor={Colors.buttonBg}
            textColor={Colors.white}
            width={responsiveWidth(44)}
            handlePress={() => updateBookingHandler('Reject')}
          />
        </View>
      );
    }

    if (bookingStatus !== 'Accept') {
      return (
        <View style={styles.bottomButtonContainer}>
          <Button
            title="Delete This Booking"
            bgColor={Colors.buttonBg}
            textColor={Colors.white}
            handlePress={deleteBookingHandler}
          />
        </View>
      );
    }

    return null;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <TextHeader title="Booked Services" />
      </View>

      <View style={styles.contentWrapper}>
        {isLoading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={Colors.buttonBg} />
          </View>
        ) : (
          <FlatList
            data={service}
            keyExtractor={(_, index) => index.toString()}
            contentContainerStyle={styles.listContent}
            renderItem={({item}) => <ServiceCard data={item} />}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      {renderFooter()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  headerContainer: {
    paddingHorizontal: responsiveHeight(2),
    paddingTop: responsiveHeight(1),
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: responsiveHeight(2),
    gap: responsiveHeight(1.5),
  },
  contentWrapper: {
    flex: 1,
  },
  bottomButtonContainer: {
    flexDirection: 'row',
    gap: responsiveWidth(4),
    paddingHorizontal: responsiveWidth(4),
    paddingVertical: responsiveHeight(2),
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
});

export default ViewBookedServices;

// /* eslint-disable react-native/no-inline-styles */
// import {
//   View,
//   FlatList,
//   ActivityIndicator,
//   ScrollView,
// } from 'react-native';
// import React, {useState} from 'react';
// import {Colors} from '../../assets/colors';
// import {
//   responsiveHeight,
//   responsiveWidth,
// } from '../../assets/responsive_dimensions';
// import TextHeader from '../../Components/TextHeader';
// import {Button} from '../../Components/Button';
// import {
//   deleteBooking,
//   ShowToast,
//   updateBookingStatus,
// } from '../../GlobalFunctions/Auth';
// import ServiceCard from '../../Components/ServiceCard';

// const ViewBookedServices = ({navigation, route}: any) => {
//   const {type, service, bookingId, bookingStatus} = route?.params;
//   const [isLoading, setIsLoading] = useState(false);

//   const updateBookingHandler = async (status: any) => {
//     setIsLoading(true);
//     const response = await updateBookingStatus(bookingId, status);
//     setIsLoading(false);
//     if (response.success) {
//       ShowToast('success', response.message);
//       navigation.goBack();
//     } else {
//       ShowToast('error', response.message);
//     }
//     console.log('response', response);
//   };

//   const deleteBookingHandler = async () => {
//     setIsLoading(true);
//     const response = await deleteBooking(bookingId);
//     setIsLoading(false);
//     if (response.success) {
//       ShowToast('success', response.message);
//       navigation.goBack();
//     } else {
//       ShowToast('error', response.message);
//     }
//   };

//   console.log('bookingId:-', bookingId);
//   return (
//     <ScrollView
//       contentContainerStyle={{
//         flexGrow: 1,
//         backgroundColor: Colors.white,
//         padding: responsiveHeight(2),
//       }}>
//       <TextHeader title="Services" />
//       <View style={{flex: 1}}>
//         {isLoading ? (
//           <View style={{flex: 1, justifyContent: 'center'}}>
//             <ActivityIndicator size={50} color={Colors.buttonBg} />
//           </View>
//         ) : (
//           <View style={{flex: 1}}>
//             {service?.length > 0 ? (
//               <FlatList
//                 contentContainerStyle={{
//                   gap: responsiveHeight(1.5),
//                   marginTop: responsiveHeight(2),
//                 }}
//                 data={service}
//                 renderItem={({item}) => {
//                   return <ServiceCard data={item} />;
//                 }}
//                 keyExtractor={(item, index) => index.toString()}
//               />
//             ) : null}
//             {type === 'daycare' ? (
//               <View
//                 style={{
//                   flexDirection: 'row',
//                   gap: responsiveHeight(2),
//                   marginTop: responsiveHeight(2),
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                   width: '100%',
//                   alignSelf: 'center',
//                 }}>
//                 <Button
//                   handlePress={() => updateBookingHandler('Accept')}
//                   bgColor={Colors.buttonBg}
//                   textColor={Colors.white}
//                   title="Accept"
//                   width={responsiveWidth(45)}
//                 />
//                 <Button
//                   handlePress={() => updateBookingHandler('Reject')}
//                   bgColor={Colors.buttonBg}
//                   textColor={Colors.white}
//                   title="Reject"
//                   width={responsiveWidth(45)}
//                 />
//               </View>
//             ) : bookingStatus !== 'Accept' ? (
//               <Button
//                 handlePress={deleteBookingHandler}
//                 bgColor={Colors.buttonBg}
//                 textColor={Colors.white}
//                 title="Delete This Booking"
//               />
//             ) : null}
//           </View>
//         )}
//       </View>
//     </ScrollView>
//   );
// };

// export default ViewBookedServices;
