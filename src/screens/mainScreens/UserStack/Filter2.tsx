/* eslint-disable react-native/no-inline-styles */
import { View, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import React from 'react';
import BackIcon from '../../../Components/BackIcon';
import { BoldText, NormalText } from '../../../Components/Titles';
import { responsiveHeight, responsiveWidth } from '../../../assets/responsive_dimensions';
import SvgIcons from '../../../Components/SvgIcons';
import { arrowForward } from '../../../assets/icons';
import { Button } from '../../../Components/Button';
import { Colors } from '../../../assets/colors';
const Filter2 = ({ navigation }) => {
  const data = [
    {
      id: 1,
      title: 'Categories',
      subTitle: 'Category 1, Category 2, Category 3',
    },
    {
      id: 2,
      title: 'Location',
      subTitle: 'New York',
    },
    {
      id: 3,
      title: 'Hotel Type',
      subTitle: 'Hotel 1',
    },
    {
      id: 4,
      title: 'Language',
      subTitle: 'English',
    },
  ];

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity style={{}}>

        <View style={{ marginTop: 10 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ gap: 5 }}>

              <NormalText color="#282A37" title={item.title} />
              <NormalText color="#515978" title={item.subTitle} />
            </View>
            <SvgIcons xml={arrowForward} height={15} width={15} />
          </View>
          <View style={{ height: 2, width: responsiveWidth(100), backgroundColor: '#ECEDF1', marginTop: 13 }} />
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, flexGrow: 1 }}>
      <BackIcon />
      <View style={{ marginTop: responsiveHeight(5) }}>

        <BoldText color={Colors.themeText2} title="Filter" fontWeight="600" />
      </View>

      <FlatList data={data} contentContainerStyle={{ marginTop: responsiveHeight(2) }} renderItem={renderItem} />
      <View style={{ position: 'absolute', bottom: responsiveHeight(3), alignItems: 'center', width: '100%', alignSelf: 'center' }}>
        <Button textColor="white" title="Apply" bgColor={Colors.buttonBg} borderColor={''} borderRadius={0} xml={''} width={0} height={0} textFont={0} />
      </View>
    </ScrollView>
  );
};

export default Filter2;
