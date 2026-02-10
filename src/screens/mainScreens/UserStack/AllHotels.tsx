/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import {Colors} from '../../../assets/colors';
import BackIcon from '../../../Components/BackIcon';
import {BoldText, NormalText} from '../../../Components/Titles';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../../assets/responsive_dimensions';
import {fetchAllBusinesses} from '../../../GlobalFunctions';
import {ImageBaseUrl} from '../../../BaseUrl';
import SvgIcons from '../../../Components/SvgIcons';
import {rating} from '../../../assets/icons';

const AllHotels = ({navigation}: any) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getNearbyBusinesses();
  }, []);

  const getNearbyBusinesses = async () => {
    setIsLoading(true);
    try {
      const response = await fetchAllBusinesses();
      // Ensure data is an array
      setData(Array.isArray(response?.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching businesses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderHotels = ({item}: any) => {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() =>
          navigation.navigate('StoreDetails', {
            _id: item._id,
            managerId: item.managerId,
          })
        }
        style={styles.cardContainer}>
        <Image
          source={{uri: `${ImageBaseUrl}${item?.profileImage}`}}
          style={styles.hotelImage}
          resizeMode="cover"
        />
        <BoldText
          title={item.businessName || 'Unnamed Business'}
          mrgnTop={10}
          fontSize={responsiveFontSize(2.2)}
          color="#2A1E51"
        />
        <View style={styles.ratingSection}>
          <View style={styles.ratingBadge}>
            <SvgIcons xml={rating} height={16} width={16} />
            <NormalText
              title={item?.ratings || 0}
              alignSelf="center"
              color="#5F5F63"
              fontSize={responsiveFontSize(1.8)}
            />
          </View>
          <NormalText
            title="Rating"
            alignSelf="center"
            color="#5F5F63"
            fontSize={responsiveFontSize(1.8)}
          />
        </View>
      </TouchableOpacity>
    );
  };

  const renderHeader = () => (
    <View style={styles.headerRow}>
      <BackIcon />
      <NormalText
        color={Colors.themeText2}
        alignSelf="center"
        fontWeight="900"
        fontSize={responsiveFontSize(2.7)}
        title="Hotels/DayCares"
      />
      {/* Spacer for centering */}
      <View style={{width: 30}} />
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <NormalText
        fontSize={responsiveFontSize(2.5)}
        alignSelf="center"
        txtAlign="center"
        title="No Business Stores Found"
      />
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={Colors.buttonBg} />
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <FlatList
        data={data}
        renderItem={renderHotels}
        keyExtractor={(item, index) =>
          item?._id?.toString() || index.toString()
        }
        numColumns={2}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listPadding}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  listPadding: {
    padding: responsiveHeight(2),
    paddingBottom: responsiveHeight(4),
  },
  headerRow: {
    flexDirection: 'row',
    paddingVertical: responsiveHeight(1),
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: responsiveHeight(2),
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  cardContainer: {
    width: responsiveWidth(44), // Slightly reduced to accommodate column spacing
    marginBottom: responsiveHeight(2),
  },
  hotelImage: {
    width: '100%',
    height: responsiveHeight(17),
    borderRadius: responsiveHeight(1),
    backgroundColor: '#F0F0F0',
  },
  ratingSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 5,
    backgroundColor: '#F5F5F5',
    padding: 6,
  },
  emptyContainer: {
    marginTop: responsiveHeight(15),
    alignItems: 'center',
  },
});

export default AllHotels;
