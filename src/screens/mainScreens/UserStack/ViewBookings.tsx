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
      <TextHeader title={type === 'User' ? 'All Bookings' : 'All Orders'} />
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
        handlePress={() =>
          navigation.navigate('ViewBookedServices', {
            type: 'user',
            service: item.serviceId,
            bookingId: item?._id,
            bookingStatus: item?.status,
          })
        }
      />
    );
  };

  console.log('Bookings:------', bookings);

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
//   getAllBookingsByUserId,
//   getServicesByCategory,
// } from '../../../GlobalFunctions';
// import BackIcon from '../../../Components/BackIcon';
// import FilterCard from '../../../Components/FilterCard';
// import moment from 'moment';
// import TextHeader from '../../../Components/TextHeader';
// import {useIsFocused} from '@react-navigation/native';

// const data: any = [
//   {
//     id: 1,
//     title: 'Pending',
//   },
//   {
//     id: 2,
//     title: 'Accept',
//   },
//   {
//     id: 3,
//     title: 'Reject',
//   },
// ];

// const data2: any = [
//   {
//     id: 1,
//   },
//   {
//     id: 2,
//   },
//   {
//     id: 3,
//   },
// ];

// const ViewBookings = ({navigation, route}: any) => {
//   const [currentCategory, setCurrentCategory] = useState('Pending');
//   const [bookings, setBookings] = useState([]);
//   const {_id, type} = useSelector((state: any) => state.user.userData);
//   const [loading, setLoading] = useState(false);
//   const isFocused = useIsFocused();

//   useEffect(() => {
//     fetchBookingsHandler();
//   }, [currentCategory, isFocused]);

//   const renderCategories = ({item}: any) => {
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
//     const response = await getAllBookingsByUserId(_id, currentCategory);
//     setLoading(false);
//     setBookings(response.data);
//   };

//   console.log('type:-', type);

//   return (
//     <ScrollView
//       showsVerticalScrollIndicator={false}
//       contentContainerStyle={{
//         padding: 20,
//         flexGrow: 1,
//         backgroundColor: Colors.white,
//       }}>
//       <TextHeader title={type === 'User' ? 'All Bookings' : 'All Orders'} />

//       <View>
//         <FlatList
//           showsHorizontalScrollIndicator={false}
//           contentContainerStyle={{gap: 10, marginTop: responsiveHeight(2)}}
//           horizontal
//           data={data}
//           renderItem={renderCategories}
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
//           renderItem={({item}: any) => (
//             <FilterCard
//               status={item?.status}
//               price={item?.total}
//               address={item?.address}
//               time={moment(item?.selectDate).format('MMMM/DD/YY')}
//               serviceName={item?.categoryId?.categoryName}
//               imageUrl={item?.categoryId?.image}
//               handlePress={() =>
//                 navigation.navigate('ViewBookedServices', {
//                   type: 'user',
//                   service: item.serviceId,
//                   bookingId: item?._id,
//                   bookingStatus: item?.status,
//                 })
//               }
//             />
//           )}
//         />
//       ) : (
//         <View
//           style={{
//             flex: 1,
//             alignItems: 'center',
//             justifyContent: 'center',
//           }}>
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

// export default ViewBookings;
