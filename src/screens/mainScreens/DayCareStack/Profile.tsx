/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Linking,
  StyleSheet,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';

// Components & Assets
import {Header3} from '../../../Components/Header2';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../../assets/responsive_dimensions';
import {edit, tick, upload} from '../../../assets/icons';
import SvgIcons from '../../../Components/SvgIcons';
import {Colors} from '../../../assets/colors';
import {NormalText} from '../../../Components/Titles';
import ListHeading from '../../../Components/ListHeading';
import ReviewsCard from '../../../Components/ReviewsCard';
import {Button} from '../../../Components/Button';

// Global Logic
import {clearToken, setBusinessProfileData} from '../../../redux/Slices';
import {getAllReviews, getBusinessProfileById} from '../../../GlobalFunctions';
import {ImageBaseUrl} from '../../../BaseUrl';

const Profile = ({navigation}: any) => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  // Data from Redux
  const userDetails = useSelector((state: any) => state.user.userData);
  const _id = userDetails?._id || userDetails?.id;
  const email = userDetails?.email;

  const businessProfile = useSelector(
    (state: any) => state.user.businessProfileData,
  );
  const {
    managerId,
    profileImage,
    image, // This is your portfolio array
    fullName,
    address,
    bio,
    certificate,
  } = businessProfile || {};

  // Local States
  const [allReviews, setAllReviews] = useState([]);
  const [ratingInfo, setRatingInfo] = useState({
    avgRating: 0,
    totalReviews: 0,
  });

  const statsData = [
    {id: 1, title1: 'View', title2: 'Orders'},
    {id: 2, title1: 'Rating', title2: ratingInfo.avgRating || '0.0'},
  ];

  useEffect(() => {
    if (isFocused && _id) {
      getBusinessProfile();
    }
  }, [isFocused, _id]);

  useEffect(() => {
    if (managerId) {
      getAllReviewsHandler();
    }
  }, [managerId]);

  const getBusinessProfile = async () => {
    try {
      const response = await getBusinessProfileById(_id);
      if (response?.data?.profile) {
        dispatch(setBusinessProfileData(response.data.profile));
      }
    } catch (err) {
      console.log('Profile Fetch Error:', err);
    }
  };

  const getAllReviewsHandler = async () => {
    try {
      const response = await getAllReviews(managerId);
      if (response?.data) {
        setAllReviews(response.data.review || []);
        setRatingInfo({
          avgRating: response.data.avgRating,
          totalReviews: response.data.totalreviews,
        });
      }
    } catch (err) {
      console.log('Reviews Error:', err);
    }
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContainer}>
      <Header3
        textContainer={false}
        firstRightIcon={false}
        rightIcon={edit}
        onEditPress={() =>
          navigation.navigate('CreateBussProfile', {type: 'edit'})
        }
      />

      {/* Profile Image Section */}
      <View style={styles.imageContainer}>
        <Image
          source={{uri: `${ImageBaseUrl}${profileImage}`}}
          style={styles.profileImage}
        />
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('CreateBussProfile', {type: 'edit'})
          }
          style={styles.uploadBadge}>
          <SvgIcons xml={upload} height={20} width={20} />
        </TouchableOpacity>
      </View>

      {/* Identity Section */}
      <View style={{marginTop: responsiveHeight(4)}}>
        <View style={styles.nameRow}>
          <NormalText
            fontSize={responsiveFontSize(3)}
            fontWeight="700"
            title={fullName || 'Name not set'}
          />
          <View style={styles.verifyBadge}>
            <SvgIcons xml={tick} height={14} width={14} />
          </View>
        </View>
        <NormalText
          fontSize={responsiveFontSize(2)}
          fontWeight="500"
          alignSelf="center"
          title={email}
        />
        <NormalText
          fontSize={responsiveFontSize(2)}
          fontWeight="500"
          alignSelf="center"
          color="#9DA5B3"
          title={address}
        />
      </View>

      <NormalText
        mrgnTop={responsiveHeight(1.5)}
        fontSize={responsiveFontSize(1.8)}
        color="#9DA5B3"
        txtAlign="center"
        alignSelf="center"
        width={responsiveWidth(85)}
        title={bio || 'No bio available'}
      />

      {/* Stats Cards */}
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.statsList}
        data={statsData}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() =>
              item.title1 === 'View' && navigation.navigate('ViewOrders')
            }
            style={styles.statsCard}>
            <NormalText
              fontWeight="800"
              fontSize={responsiveFontSize(2.2)}
              color={Colors.white}
              title={item.title1}
            />
            <NormalText
              fontWeight="800"
              fontSize={responsiveFontSize(2.2)}
              color={Colors.white}
              title={item.title2}
            />
          </TouchableOpacity>
        )}
      />

      {/* Reviews Section */}
      <ListHeading
        showSeeAll={allReviews?.length > 0}
        totalReviews={ratingInfo.totalReviews}
        isRating
        avgRating={ratingInfo.avgRating}
        title="Reviews"
        mrgnTop={responsiveHeight(3)}
      />
      <FlatList
        contentContainerStyle={{
          marginTop: responsiveHeight(2),
          gap: responsiveHeight(2),
        }}
        horizontal
        showsHorizontalScrollIndicator={false}
        data={allReviews?.slice(0, 5)}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({item}) => (
          <ReviewsCard
            handlePress={() =>
              navigation.navigate('ReviewDetails', {reviewId: item?._id})
            }
            reviewData={item}
          />
        )}
      />

      {/* Certificates Section */}
      <ListHeading
        onEditIconPress={() =>
          navigation.navigate('CreateBussProfile', {type: 'edit'})
        }
        title="Certificates"
        mrgnTop={responsiveHeight(2)}
        showSeeAll={false}
        rightIcon={edit}
      />
      <FlatList
        data={certificate}
        horizontal
        keyExtractor={(_, index) => index.toString()}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          gap: responsiveHeight(2),
          marginTop: responsiveHeight(2),
        }}
        renderItem={({item}) => {
          const uri = `${ImageBaseUrl}${item}`;
          const isPdf = uri.toLowerCase().endsWith('.pdf');

          return isPdf ? (
            <TouchableOpacity
              onPress={() => Linking.openURL(uri)}
              style={styles.pdfCard}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '700',
                  color: Colors.buttonBg,
                }}>
                VIEW PDF
              </Text>
            </TouchableOpacity>
          ) : (
            <Image source={{uri}} style={styles.contentItem} />
          );
        }}
      />

      {/* Portfolio Section */}
      <ListHeading
        title="Portfolio"
        onEditIconPress={() =>
          navigation.navigate('CreateBussProfile', {type: 'edit'})
        }
        mrgnTop={responsiveHeight(2)}
        showSeeAll={false}
        rightIcon={edit}
      />
      <FlatList
        data={image}
        horizontal
        keyExtractor={(_, index) => index.toString()}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          gap: responsiveHeight(2),
          marginTop: responsiveHeight(2),
        }}
        renderItem={({item}) => (
          <Image
            source={{uri: `${ImageBaseUrl}${item}`}}
            style={styles.contentItem}
          />
        )}
      />

      <Button
        handlePress={() => dispatch(clearToken())}
        textColor={Colors.white}
        mrgnTop={responsiveHeight(5)}
        bgColor={Colors.buttonBg}
        title="Log Out"
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    padding: responsiveHeight(2),
    flexGrow: 1,
    backgroundColor: Colors.white,
  },
  imageContainer: {
    alignSelf: 'center',
    marginTop: responsiveHeight(4),
  },
  profileImage: {
    height: responsiveHeight(18),
    width: responsiveWidth(38),
    borderRadius: responsiveHeight(2),
    backgroundColor: '#f9f9f9',
  },
  uploadBadge: {
    position: 'absolute',
    bottom: -10,
    right: -10,
    backgroundColor: Colors.white,
    borderRadius: 50,
    padding: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  nameRow: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifyBadge: {
    backgroundColor: Colors.buttonBg,
    borderRadius: 50,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsList: {
    gap: responsiveHeight(2),
    width: '100%',
    justifyContent: 'space-between',
    marginTop: responsiveHeight(3),
  },
  statsCard: {
    backgroundColor: Colors.buttonBg,
    padding: responsiveHeight(2),
    borderRadius: responsiveHeight(1.5),
    width: responsiveWidth(42),
    alignItems: 'center',
  },
  contentItem: {
    height: responsiveHeight(13),
    width: responsiveWidth(32),
    borderRadius: responsiveHeight(1.5),
    backgroundColor: '#f0f0f0',
  },
  pdfCard: {
    height: responsiveHeight(13),
    width: responsiveWidth(32),
    borderRadius: responsiveHeight(1.5),
    backgroundColor: '#E8EAFE',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.buttonBg,
    borderStyle: 'dashed',
  },
});

export default Profile;

// /* eslint-disable react-native/no-inline-styles */
// import {
//   View,
//   Text,
//   Image,
//   TouchableOpacity,
//   ScrollView,
//   FlatList,
//   Linking,
// } from 'react-native';
// import React, {useEffect, useState} from 'react';
// import {Header3} from '../../../Components/Header2';
// import {
//   responsiveFontSize,
//   responsiveHeight,
//   responsiveWidth,
// } from '../../../assets/responsive_dimensions';
// import {edit, editRed, tick, upload} from '../../../assets/icons';
// import {images} from '../../../assets/images';
// import SvgIcons from '../../../Components/SvgIcons';
// import {Colors} from '../../../assets/colors';
// import {NormalText} from '../../../Components/Titles';
// import ListHeading from '../../../Components/ListHeading';
// import ReviewsCard from '../../../Components/ReviewsCard';
// import {Button} from '../../../Components/Button';
// import {useDispatch, useSelector} from 'react-redux';
// import {clearToken, setBusinessProfileData} from '../../../redux/Slices';
// import {getAllReviews, getBusinessProfileById} from '../../../GlobalFunctions';
// import {BaseUrl, ImageBaseUrl} from '../../../BaseUrl';
// import {useIsFocused} from '@react-navigation/native';

// const Profile = ({navigation}: any) => {
//   const {_id, email} = useSelector((state: any) => state.user.userData);
//   const userDetails = useSelector((state: any) => state.user.userData);
//   // console.log('userDetails===>>>>>',userDetails);
//   const {managerId, profileImage, image, fullName, address, bio, certificate} =
//     useSelector((state: any) => state.user.businessProfileData);
//   const {businessProfileData} = useSelector((state: any) => state.user);
//   const dispatch = useDispatch();

//   // const {focus} = useIsFocused();
//   const [userData, setUserData] = useState();
//   const [allReviews, setAllReviews] = useState([]);
//   const [ratingInfo, setRatingInfo] = useState({
//     avgRating: 0,
//     totalReviews: 0,
//   });
//   const [totalReviews, setTotalRevies] = useState(null);
//   const data = [
//     {
//       id: 1,
//       title1: 'View',
//       title2: 'Orders',
//     },
//     {
//       id: 2,
//       title1: 'Rating',
//       title2: ratingInfo.avgRating,
//     },
//   ];

//   useEffect(() => {
//     getBusinessProfile();
//     getAllReviewsHandler();
//   }, []);

//   const getBusinessProfile = async () => {
//     const response = await getBusinessProfileById(_id);
//     console.log('response===>>>>', response);
//     dispatch(setBusinessProfileData(response.data.profile));
//     // setTotalRevies(response?.data?.totalreviews);
//   };

//   const getAllReviewsHandler = async () => {
//     const response = await getAllReviews(managerId);
//     console.log('response.data', response.data);
//     setAllReviews(response.data?.review);
//     setRatingInfo({
//       avgRating: response.data.avgRating,
//       totalReviews: response.data.totalreviews,
//     });
//   };

//   console.log('managerId:-', managerId);
//   console.log('businessProfileData:-', businessProfileData);
//   return (
//     <ScrollView
//       showsVerticalScrollIndicator={false}
//       contentContainerStyle={{
//         padding: responsiveHeight(2),
//         flexGrow: 1,
//         backgroundColor: Colors.white,
//       }}>
//       <Header3
//         textContainer={false}
//         firstRightIcon={false}
//         rightIcon={edit}
//         onEditPress={() =>
//           navigation.navigate('CreateBussProfile', {type: 'edit'})
//         }
//       />

//       <View style={{alignSelf: 'center', marginTop: responsiveHeight(4)}}>
//         <Image
//           source={{uri: `${ImageBaseUrl}${profileImage}`}}
//           style={{
//             height: responsiveHeight(20),
//             width: responsiveWidth(40),
//             borderRadius: responsiveHeight(2),
//           }}
//         />
//         <TouchableOpacity
//           onPress={() =>
//             navigation.navigate('CreateBussProfile', {
//               type: 'edit',
//               currentImageUri: `${ImageBaseUrl}${userData?.image}`,
//             })
//           }
//           style={{
//             position: 'absolute',
//             bottom: responsiveHeight(-2),
//             right: responsiveHeight(-1.5),
//             backgroundColor: Colors.white,
//             borderRadius: responsiveHeight(5),
//             padding: responsiveHeight(2),
//             alignItems: 'center',
//             justifyContent: 'center',
//             width: responsiveWidth(13.5),
//           }}>
//           <SvgIcons xml={upload} height={20} width={20} />
//         </TouchableOpacity>
//       </View>

//       <View style={{marginTop: responsiveHeight(4)}}>
//         <View
//           style={{
//             flexDirection: 'row',
//             gap: responsiveHeight(1),
//             justifyContent: 'center',
//             alignItems: 'center',
//           }}>
//           <NormalText
//             fontSize={responsiveFontSize(3)}
//             fontWeight="700"
//             alignSelf="center"
//             title={fullName}
//           />
//           <TouchableOpacity
//             style={{
//               backgroundColor: Colors.buttonBg,
//               borderRadius: responsiveHeight(3),
//               width: responsiveWidth(6.8),
//               alignItems: 'center',
//               justifyContent: 'center',
//               height: responsiveHeight(3.5),
//             }}>
//             <SvgIcons xml={tick} height={14} width={14} />
//           </TouchableOpacity>
//         </View>
//         <NormalText
//           fontSize={responsiveFontSize(2.3)}
//           fontWeight="500"
//           alignSelf="center"
//           title={email}
//         />
//         <NormalText
//           fontSize={responsiveFontSize(2.3)}
//           fontWeight="500"
//           alignSelf="center"
//           title={address}
//         />
//       </View>
//       <NormalText
//         mrgnTop={responsiveHeight(1.5)}
//         fontSize={responsiveFontSize(2)}
//         color="#9DA5B3"
//         txtAlign="center"
//         alignSelf="center"
//         fontWeight="500"
//         width={responsiveWidth(85)}
//         title={bio}
//       />
//       <FlatList
//         horizontal
//         showsHorizontalScrollIndicator={false}
//         contentContainerStyle={{
//           gap: responsiveHeight(2),
//           width: '100%',
//           justifyContent: 'space-between',
//           marginTop: responsiveHeight(3),
//         }}
//         data={data}
//         renderItem={({item}) => (
//           <TouchableOpacity
//             onPress={() =>
//               item.title1 === 'View' ? navigation.navigate('ViewOrders') : null
//             }
//             style={{
//               backgroundColor: Colors.buttonBg,
//               padding: responsiveHeight(1.6),
//               borderRadius: responsiveHeight(1),
//               width: responsiveWidth(40),
//             }}>
//             <NormalText
//               alignSelf="center"
//               txtAlign="center"
//               fontWeight="800"
//               fontSize={responsiveFontSize(2.2)}
//               color={Colors.white}
//               title={item.title1}
//             />
//             <NormalText
//               alignSelf="center"
//               txtAlign="center"
//               fontWeight="800"
//               fontSize={responsiveFontSize(2.2)}
//               color={Colors.white}
//               title={item.title2}
//             />
//           </TouchableOpacity>
//         )}
//       />
//       <ListHeading
//         showSeeAll={allReviews?.length > 0 ? true : false}
//         totalReviews={ratingInfo.totalReviews}
//         isRating
//         avgRating={ratingInfo.avgRating}
//         title="Reviews"
//         mrgnTop={responsiveHeight(3)}
//       />
//       <FlatList
//         contentContainerStyle={{
//           marginTop: responsiveHeight(2),
//           gap: responsiveHeight(2),
//         }}
//         showsHorizontalScrollIndicator={false}
//         horizontal
//         data={allReviews?.slice(0, 2)}
//         renderItem={item => (
//           <ReviewsCard
//             handlePress={() =>
//               navigation.navigate('ReviewDetails', {reviewId: item?.item?._id})
//             }
//             reviewData={item?.item}
//           />
//         )}
//       />
//       <ListHeading
//         onEditIconPress={() =>
//           navigation.navigate('CreateBussProfile', {
//             type: 'edit',
//             currentImageUri: `${ImageBaseUrl}${userData?.image}`,
//           })
//         }
//         title="Certificates"
//         mrgnTop={responsiveHeight(2)}
//         showSeeAll={false}
//         rightIcon={edit}
//       />
//       <FlatList
//         data={certificate}
//         horizontal
//         showsHorizontalScrollIndicator={false}
//         contentContainerStyle={{
//           gap: responsiveHeight(2),
//           marginTop: responsiveHeight(2),
//         }}
//         renderItem={({item}) => {
//           const uri = `${ImageBaseUrl}${item}`;
//           const isPdf = uri.toLowerCase().endsWith('.pdf');

//           return isPdf ? (
//             // Render a PDF icon or preview
//             <TouchableOpacity
//               onPress={() => {
//                 // Open PDF in a viewer or navigation
//                 Linking.openURL(uri);
//               }}
//               style={{
//                 height: responsiveHeight(13),
//                 width: responsiveWidth(32),
//                 borderRadius: responsiveHeight(2),
//                 backgroundColor: '#f0f0f0',
//                 justifyContent: 'center',
//                 alignItems: 'center',
//               }}>
//               <Text style={{fontSize: 16, color: '#333'}}>View PDF</Text>
//               {/* You can also use an icon here if you have react-native-vector-icons */}
//             </TouchableOpacity>
//           ) : (
//             <Image
//               source={{uri}}
//               style={{
//                 height: responsiveHeight(13),
//                 width: responsiveWidth(32),
//                 borderRadius: responsiveHeight(2),
//               }}
//             />
//           );
//         }}
//       />
//       <ListHeading
//         title="Portfolio"
//         onEditIconPress={() =>
//           navigation.navigate('CreateBussProfile', {
//             type: 'edit',
//             currentImageUri: `${ImageBaseUrl}${userData?.image}`,
//           })
//         }
//         mrgnTop={responsiveHeight(2)}
//         showSeeAll={false}
//         rightIcon={edit}
//       />
//       <FlatList
//         data={image}
//         horizontal
//         showsHorizontalScrollIndicator={false}
//         contentContainerStyle={{
//           gap: responsiveHeight(2),
//           marginTop: responsiveHeight(2),
//         }}
//         renderItem={({item}) => (
//           <Image
//             source={{uri: `${ImageBaseUrl}${item}`}}
//             style={{
//               height: responsiveHeight(13),
//               width: responsiveWidth(32),
//               borderRadius: responsiveHeight(2),
//             }}
//           />
//         )}
//       />
//       <Button
//         handlePress={() => dispatch(clearToken())}
//         textColor={Colors.white}
//         mrgnTop={responsiveHeight(4)}
//         bgColor={Colors.buttonBg}
//         title="Log Out"
//       />
//     </ScrollView>
//   );
// };

// export default Profile;
