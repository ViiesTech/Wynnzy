/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {View, FlatList, ActivityIndicator, StyleSheet} from 'react-native';
import {Colors} from '../../../assets/colors';
import TextHeader from '../../../Components/TextHeader';
import {
  responsiveFontSize,
  responsiveHeight,
} from '../../../assets/responsive_dimensions';
import {getAllServicesByCategory} from '../../../GlobalFunctions';
import FilterCard from '../../../Components/FilterCard';
import {NormalText} from '../../../Components/Titles';

const AllServices = ({navigation, route}: any) => {
  const {serviceId, managerId} = route?.params;
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchAllServicesByCategory = async () => {
      setIsLoading(true);
      try {
        const response = await getAllServicesByCategory(managerId, serviceId);
        setData(response?.data || []);
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllServicesByCategory();
  }, [managerId, serviceId]);

  const listEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <NormalText
        fontWeight="700"
        fontSize={responsiveFontSize(2.5)}
        txtAlign="center"
        alignSelf="center"
        title="This category currently has no active listed services."
      />
    </View>
  );

  const renderItem = ({item}: any) => {
    // console.log('item:-', item);
    return (
      <FilterCard
        data={item}
        handlePress={() =>
          navigation.navigate('Booking', {
            _id: item?._id,
            serviceCategory: item?.serviceCategory,
            categoryId: serviceId,
            managerId: item?.managerId,
          })
        }
      />
    );
  };

  return (
    <View style={styles.container}>
      <TextHeader title="Services" />

      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size={50} color={Colors.buttonBg} />
        </View>
      ) : (
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item: any) => item?._id?.toString()}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={listEmptyComponent}
          contentContainerStyle={{paddingBottom: 20, paddingTop: 10}}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: responsiveHeight(2),
    backgroundColor: Colors.white,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 0.8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
});

export default AllServices;
