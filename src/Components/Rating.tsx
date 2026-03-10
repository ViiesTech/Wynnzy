import {View, FlatList, TouchableOpacity, StyleSheet} from 'react-native';
import React from 'react';
import {NormalText} from './Titles';
import {
  responsiveFontSize,
  responsiveHeight,
} from '../assets/responsive_dimensions';
import {Colors} from '../assets/colors';

interface RatingProps {
  setCategory: (v: string) => void;
  activeCategory: string;
  headerTitle: string;
}

const Rating: React.FC<RatingProps> = ({
  activeCategory,
  setCategory,
  headerTitle,
}) => {
  // Reordered for logical progression
  const data = [
    {id: 1, title: 'Bad'},
    {id: 2, title: 'Poor'},
    {id: 3, title: 'Good'},
    {id: 4, title: 'Excellent'},
  ];

  return (
    <View style={styles.mainContainer}>
      <View style={styles.headerPadding}>
        <NormalText
          color="#192152"
          fontWeight="700"
          fontSize={responsiveFontSize(1.8)}
          title={headerTitle}
        />
      </View>

      <FlatList
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        horizontal
        data={data}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => {
          const isActive = activeCategory === item.title;

          return (
            <TouchableOpacity
              activeOpacity={0.7}
              style={[
                styles.chip,
                isActive ? styles.activeChip : styles.inactiveChip,
              ]}
              onPress={() => setCategory(item.title)}>
              <NormalText
                color={isActive ? Colors.white : '#848FAC'}
                fontWeight={isActive ? '700' : '500'}
                title={item.title}
              />
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    gap: responsiveHeight(1.5), // Reduced gap for a tighter UI
    marginVertical: responsiveHeight(1),
  },
  headerPadding: {
    paddingLeft: responsiveHeight(2),
  },
  listContent: {
    gap: responsiveHeight(1.5),
    paddingLeft: responsiveHeight(2),
    paddingRight: responsiveHeight(2), // Added right padding so last item doesn't touch edge
  },
  chip: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: responsiveHeight(1.2),
    paddingHorizontal: responsiveHeight(2.5),
    borderRadius: responsiveHeight(4),
  },
  activeChip: {
    backgroundColor: Colors.buttonBg,
    // Removed border when active for a cleaner look
    borderWidth: 0,
    elevation: 2, // Subtle lift for the selected item
    shadowColor: Colors.buttonBg,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  inactiveChip: {
    backgroundColor: '#FAFBFF', // Very light tint for inactive
    borderWidth: 1.5,
    borderColor: '#EFF3FA',
  },
});

export default Rating;
