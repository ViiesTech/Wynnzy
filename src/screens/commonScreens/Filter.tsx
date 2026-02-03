/* eslint-disable react-native/no-inline-styles */
import { FlatList, TouchableOpacity, ScrollView, View, ActivityIndicator, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import BackIcon from '../../Components/BackIcon';
import { NormalText } from '../../Components/Titles';
import { Colors } from '../../assets/colors';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from '../../assets/responsive_dimensions';
import FilterCard from '../../Components/FilterCard';
import { getAllServices, getServicesByCategory } from '../../GlobalFunctions';
import { useSelector } from 'react-redux';

const Filter = ({ navigation, route }) => {
  const { stack } = route?.params;
  const [currentCategory, setCurrentCategory] = useState('Active');
  const [serviceData, setServiceData] = useState([]);
  const { _id } = useSelector(state => state.user.userData);
  const [loading, setLoading] = useState(false);

  console.log('currentCategory', currentCategory);
  const data = [
    {
      id: 1,
      title: 'Active',
    },
    {
      id: 2,
      title: 'Complete',
    },
    {
      id: 3,
      title: 'Canceled',
    },
  ];

  const data2 = [
    {
      id: 1,

    },
    {
      id: 2,

    },
    {
      id: 3,

    },
  ];

  const renderCategories = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => setCurrentCategory(item.title)}
        style={{
          backgroundColor: currentCategory === item.title ? Colors.buttonBg : '#f3f3f3',
          width: responsiveWidth(28),
          paddingVertical: 10,
          height: responsiveHeight(6),
          borderRadius: 5,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <NormalText alignSelf="center" color={currentCategory === item.title ? 'white' : '#C3C8D5'} title={item.title} />
      </TouchableOpacity>
    );
  };

  const getServicesHandler = async () => {
    setLoading(true);
    const response = await getServicesByCategory(_id, currentCategory);
    setLoading(false);
    setServiceData(response.data);
  };
  useEffect(() => {
    getServicesHandler();
  }, [currentCategory]);
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, flexGrow: 1, backgroundColor: Colors.white }}>
      <BackIcon  />
      <View>
        <FlatList showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, marginTop: responsiveHeight(2) }} horizontal data={data} renderItem={renderCategories} />
      </View>
      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <ActivityIndicator size={50} color={Colors.buttonBg} />
        </View>
      ) : serviceData?.length > 0 ? (
        <FlatList
          contentContainerStyle={{ gap: responsiveHeight(1.5), marginTop: responsiveHeight(2) }}
          data={serviceData}
          renderItem={({ item }) => (
            <FilterCard
              data={item}
              handlePress={() =>
                navigation.navigate(
                  stack === 'user' ? 'StoreDetails' : 'FilterDetail',
                  stack !== 'user' ? { id: item._id } : undefined
                )
              }
            />
          )}
        />
      ) : (
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: responsiveFontSize(2.5), fontWeight: '400', marginTop: responsiveHeight(7), textAlign: 'center' }}>No Services Found Related To This Category!</Text>
        </View>
      )}

    </ScrollView>
  );
};

export default Filter;
