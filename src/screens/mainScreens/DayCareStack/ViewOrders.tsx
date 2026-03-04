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
import moment from 'moment';

import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../../assets/responsive_dimensions';
import {Colors} from '../../../assets/colors';
import {NormalText} from '../../../Components/Titles';
import {getAllBookingsByManagerId} from '../../../GlobalFunctions';
import BackIcon from '../../../Components/BackIcon';
import FilterCard from '../../../Components/FilterCard';
import BookingCard from '../../../Components/BookingCard';
import TextHeader from '../../../Components/TextHeader';

const ViewOrders = ({navigation}: any) => {
  const [currentCategory, setCurrentCategory] = useState('Pending');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  const isFocused = useIsFocused();
  const businessData = useSelector(
    (state: any) => state.user.businessProfileData,
  );
  const managerId = businessData?.managerId || businessData?._id;

  const categories = [
    {id: 1, title: 'Pending'},
    {id: 2, title: 'Accept'},
    {id: 3, title: 'Reject'},
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
      <TextHeader title="View Orders" />
      <FlatList
        data={categories}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.categoryList}
        renderItem={({item}) => {
          const isSelected = currentCategory === item.title;
          return (
            <TouchableOpacity
              onPress={() => setCurrentCategory(item.title)}
              style={[
                styles.categoryBtn,
                {backgroundColor: isSelected ? Colors.buttonBg : '#f3f3f3'},
              ]}>
              <NormalText
                color={isSelected ? 'white' : '#C3C8D5'}
                title={item.title}
                alignSelf="center"
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
    width: responsiveWidth(28),
    paddingVertical: 10,
    height: responsiveHeight(6),
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

export default ViewOrders;

// /* eslint-disable react-native/no-inline-styles */
// import {
//   FlatList,
//   TouchableOpacity,
//   ScrollView,
//   View,
//   ActivityIndicator,
//   Text,
// } from 'react-native';
// import React, {useEffect, useState} from 'react';
// import {useSelector} from 'react-redux';
// import {
//   responsiveFontSize,
//   responsiveHeight,
//   responsiveWidth,
// } from '../../../assets/responsive_dimensions';
// import {Colors} from '../../../assets/colors';
// import {NormalText} from '../../../Components/Titles';
// import {
//   getAllBookingsByManagerId,
//   getAllBookingsByUserId,
//   getServicesByCategory,
// } from '../../../GlobalFunctions';
// import BackIcon from '../../../Components/BackIcon';
// import FilterCard from '../../../Components/FilterCard';
// import moment from 'moment';
// import {useIsFocused} from '@react-navigation/native';

// const ViewOrders = ({navigation, route}: any) => {
//   const [currentCategory, setCurrentCategory] = useState('Pending');
//   const [bookings, setBookings] = useState([]);
//   const {managerId} = useSelector(state => state.user.businessProfileData);
//   const [loading, setLoading] = useState(false);
//   const isFocused = useIsFocused();

//   console.log('bookings', bookings);
//   const data = [
//     {
//       id: 1,
//       title: 'Pending',
//     },
//     {
//       id: 2,
//       title: 'Accept',
//     },
//     {
//       id: 3,
//       title: 'Reject',
//     },
//   ];

//   const data2 = [
//     {
//       id: 1,
//     },
//     {
//       id: 2,
//     },
//     {
//       id: 3,
//     },
//   ];

//   const renderCategories = ({item}) => {
//     return (
//       <TouchableOpacity
//         onPress={() => setCurrentCategory(item.title)}
//         style={{
//           backgroundColor:
//             currentCategory === item.title ? Colors.buttonBg : '#f3f3f3',
//           width: responsiveWidth(28),
//           paddingVertical: 10,
//           height: responsiveHeight(6),
//           borderRadius: 5,
//           justifyContent: 'center',
//           alignItems: 'center',
//         }}>
//         <NormalText
//           alignSelf="center"
//           color={currentCategory === item.title ? 'white' : '#C3C8D5'}
//           title={item.title}
//         />
//       </TouchableOpacity>
//     );
//   };

//   const fetchBookingsHandler = async () => {
//     setLoading(true);
//     const response = await getAllBookingsByManagerId(
//       managerId,
//       currentCategory,
//     );
//     setLoading(false);
//     setBookings(response.data);
//   };
//   useEffect(() => {
//     fetchBookingsHandler();
//   }, [currentCategory, isFocused]);
//   return (
//     <ScrollView
//       showsVerticalScrollIndicator={false}
//       contentContainerStyle={{
//         padding: 20,
//         flexGrow: 1,
//         backgroundColor: Colors.white,
//       }}>
//       <BackIcon />
//       <View>
//         <FlatList
//           data={data}
//           horizontal={true}
//           renderItem={renderCategories}
//           showsHorizontalScrollIndicator={false}
//           contentContainerStyle={{gap: 10, marginTop: responsiveHeight(2)}}
//         />
//       </View>
//       {loading ? (
//         <View style={{flex: 1, justifyContent: 'center'}}>
//           <ActivityIndicator size={50} color={Colors.buttonBg} />
//         </View>
//       ) : bookings?.length > 0 ? (
//         <FlatList
//           contentContainerStyle={{
//             gap: responsiveHeight(1.5),
//             marginTop: responsiveHeight(2),
//           }}
//           data={bookings}
//           renderItem={({item}) => (
//             <FilterCard
//               status={item?.status}
//               price={item?.total}
//               address={item?.address}
//               time={moment(item?.selectDate).format('MMMM/DD/YY')}
//               serviceName={item?.categoryId?.categoryName}
//               imageUrl={item?.categoryId?.image}
//               handlePress={() =>
//                 navigation.navigate('ViewBookedServices', {
//                   type: 'daycare',
//                   service: item.serviceId,
//                   bookingId: item?._id,
//                 })
//               }
//             />
//           )}
//         />
//       ) : (
//         <View style={{flex: 1}}>
//           <Text
//             style={{
//               fontSize: responsiveFontSize(2.5),
//               fontWeight: '400',
//               marginTop: responsiveHeight(7),
//               textAlign: 'center',
//             }}>
//             No Bookings Found Related To This Category!
//           </Text>
//         </View>
//       )}
//     </ScrollView>
//   );
// };

// export default ViewOrders;
