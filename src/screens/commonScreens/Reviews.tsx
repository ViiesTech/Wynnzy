import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  View,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import {useSelector} from 'react-redux';
import ReviewsCard from '../../Components/ReviewsCard';
import {NormalText} from '../../Components/Titles';
import {Colors} from '../../assets/colors';
import {
  responsiveFontSize,
  responsiveHeight,
} from '../../assets/responsive_dimensions';
import {getAllReviews} from '../../GlobalFunctions';
import UserHeader from '../../Components/UserHeader';

const Reviews = ({navigation, route}: any) => {
  const [allReviews, setAllReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const {businessProfileData} = useSelector((state: any) => state.user);
  const {type, managerId, ratings, totalReviews} = route?.params || {};

  useEffect(() => {
    getAllReviewsHandler();
  }, []);

  const getAllReviewsHandler = async () => {
    setIsLoading(true);
    try {
      const targetId =
        type === 'user' ? managerId : businessProfileData?.managerId;
      const response = await getAllReviews(targetId);
      setAllReviews(response?.data?.review || []);
    } catch (error) {
      console.error('Failed to fetch reviews', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderEmpty = () => {
    return (
      <View style={styles.emptyContainer}>
        <NormalText
          fontSize={responsiveFontSize(2.2)}
          txtAlign="center"
          title="No Reviews Yet For This Business Profile"
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <UserHeader
        backIcon={true}
        title={'Reviews'}
        navigation={navigation}
        centerText={true}
        mT={10}
      />
      {isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={Colors.buttonBg} />
        </View>
      ) : (
        <FlatList
          data={allReviews}
          keyExtractor={(item: any) => item?._id?.toString()}
          ListEmptyComponent={renderEmpty}
          contentContainerStyle={styles.listPadding}
          showsVerticalScrollIndicator={false}
          renderItem={({item}) => (
            <ReviewsCard
              cardWidth={92}
              numberOfLines={null}
              reviewData={item}
              handlePress={() =>
                navigation.navigate('ReviewDetails', {reviewId: item?._id})
              }
            />
          )}
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
  listPadding: {
    padding: responsiveHeight(2),
    paddingTop: responsiveHeight(2),
    flexGrow: 1,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    marginTop: responsiveHeight(10),
    alignItems: 'center',
  },
  modal: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    height: '90%',
    padding: 20,
  },
  dragIndicator: {
    alignItems: 'center',
    paddingBottom: 15,
  },
});

export default Reviews;
