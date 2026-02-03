/* eslint-disable react-native/no-inline-styles */
import { View, FlatList, TouchableOpacity } from 'react-native';
import React from 'react';
import { NormalText } from './Titles';
import { responsiveFontSize, responsiveHeight } from '../assets/responsive_dimensions';
import { Colors } from '../assets/colors';
interface RatingProps {
  setCategory: () => void;
  activeCategory: string;
  headerTitle: string;
}
const Rating: React.FC<RatingProps> = ({ activeCategory, setCategory, headerTitle }) => {
  const data = [
    {
      id: 1,
      title: 'Poor',
    },
    {
      id: 2,
      title: 'Excellent',
    },
    {
      id: 3,
      title: 'Good',
    },
    {
      id: 4,
      title: 'Bad',
    },
  ];
  return (
    <View style={{ gap: responsiveHeight(3) }}>
      <View style={{ paddingLeft: responsiveHeight(2) }}>
        <NormalText color="#192152" fontSize={responsiveFontSize(2)} title={headerTitle} />
      </View>
      <FlatList
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: responsiveHeight(2), paddingLeft: responsiveHeight(2) }}
        horizontal
        data={data}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{ borderWidth: activeCategory === item.title ? null : 2, backgroundColor: activeCategory === item.title ? Colors.buttonBg : null, alignItems: 'center', borderColor: '#EFF3FA', padding: responsiveHeight(1.8), paddingHorizontal: responsiveHeight(3), borderRadius: responsiveHeight(4) }}
            onPress={() => setCategory(item.title)}
          >
            <NormalText color={activeCategory === item.title ? Colors.white : '#848FAC'} title={item.title} />
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default Rating;
