/* eslint-disable react-native/no-inline-styles */
import { View, Text, FlatList, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Colors } from '../../../assets/colors'
import TextHeader from '../../../Components/TextHeader'
import { responsiveFontSize, responsiveHeight } from '../../../assets/responsive_dimensions';
import { getAllServicesByCategory } from '../../../GlobalFunctions';
import FilterCard from '../../../Components/FilterCard';
import { NormalText } from '../../../Components/Titles';

const AllServices = ({ navigation, route }) => {
  const { serviceId, managerId } = route?.params;
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  console.log('managerId', managerId);
  const fetchAllServicesByCategory = async () => {
    setIsLoading(true);
    const response = await getAllServicesByCategory(managerId, serviceId);
    setIsLoading(false);
    setData(response.data);
  };
  useEffect(() => {
    fetchAllServicesByCategory();
  }, []);
  return (
    <View style={{ flex: 1, padding: responsiveHeight(2), backgroundColor: Colors.white }}>
      <TextHeader title="Services" />
      {isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <ActivityIndicator size={50} color={Colors.buttonBg} />
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          {data?.length ? (
            <FlatList data={data} renderItem={({ item, index }) => {
              return (
                <FilterCard
                  data={item}
                  handlePress={() => navigation.navigate('Booking', { _id: item?._id, serviceCategory: item?.serviceCategory, categoryId: serviceId, managerId: item?.managerId })}
                />
              );
            }} />
          ) : (
            <View style={{ flex: 0.8, justifyContent: 'center', alignItems: 'center' }}>
              <NormalText fontWeight="700" fontSize={responsiveFontSize(2.8)} txtAlign="center" alignSelf="center" title="This category currently has no active listed services." />
            </View>
          )}

        </View>
      )}

    </View>
  );
};

export default AllServices;
