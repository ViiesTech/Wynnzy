/* eslint-disable react-native/no-inline-styles */
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
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

const AllHotels = ({navigation}) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getNearbyBusinesses();
  }, []);

  const getNearbyBusinesses = async () => {
    setIsLoading(true);
    const response = await fetchAllBusinesses();
    setIsLoading(false);

    setData(response.data);
  };

  const renderHotels = ({item, index}) => {
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('StoreDetails', {
            _id: item._id,
            managerId: item.managerId,
          })
        }
        key={index}
        style={{padding: 10, width: responsiveWidth(48)}}>
        <Image
          source={{uri: `${ImageBaseUrl}${item?.profileImage}`}}
          style={{
            width: '100%',
            height: responsiveHeight(17),
            borderRadius: responsiveHeight(1),
          }}
        />
        <BoldText
          title={item.businessName}
          mrgnTop={10}
          fontSize={responsiveFontSize(2.4)}
          color="#2A1E51"
        />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
            marginTop: 10,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
              borderRadius: 5,
              backgroundColor: '#F5F5F5',
              padding: 7,
            }}>
            <SvgIcons xml={rating} height={20} width={20} />
            <NormalText
              title={item?.ratings || 0}
              alignSelf="center"
              color="#5F5F63"
            />
          </View>
          <NormalText title="Rating" alignSelf="center" color="#5F5F63" />
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        backgroundColor: Colors.white,
        padding: responsiveHeight(2),
      }}>
      <View
        style={{
          flexDirection: 'row',
          paddingVertical: responsiveHeight(1),
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <BackIcon />
        <NormalText
          color={Colors.themeText2}
          alignSelf="center"
          fontWeight="900"
          fontSize={responsiveFontSize(2.7)}
          title="Hotels/DayCares"
        />
        <Text style={{color: Colors.white}}>a</Text>
      </View>
      {isLoading ? (
        <View style={{flex: 1, justifyContent: 'center'}}>
          <ActivityIndicator size={50} color={Colors.buttonBg} />
        </View>
      ) : (
        <View style={{flex: 0.9}}>
          {data?.length > 0 ? (
            <FlatList
              showsVerticalScrollIndicator={false}
              numColumns={2}
              contentContainerStyle={{
                justifyContent: 'space-between',
                gap: responsiveHeight(1),
              }}
              data={data}
              renderItem={renderHotels}
              keyExtractor={item => item._id.toString()} // Unique key for each item
            />
          ) : (
            <NormalText
              fontSize={responsiveFontSize(2.5)}
              mrgnTop={responsiveHeight(10)}
              alignSelf="center"
              txtAlign="center"
              title="No Business Stores Found"
            />
          )}
        </View>
      )}
    </ScrollView>
  );
};

export default AllHotels;
