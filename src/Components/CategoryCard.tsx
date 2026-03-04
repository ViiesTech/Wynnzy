import React, {memo} from 'react';
import {View, TouchableOpacity, Image, StyleSheet} from 'react-native';
import {BoldText} from './Titles';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../assets/responsive_dimensions';
import {Colors} from '../assets/colors';
import {images} from '../assets/images';
import {ImageBaseUrl} from '../BaseUrl';

const CategoryCard = ({data, selected, onPress}: any) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[
        styles.container,
        {
          borderColor: selected ? Colors.buttonBg : '#EFEFEF',
          backgroundColor: selected ? `${Colors.buttonBg}05` : Colors.white, // Light tint when selected
        },
      ]}>
      <View style={styles.row}>
        <Image
          style={styles.image}
          resizeMode="cover"
          source={
            data?.image
              ? {uri: `${ImageBaseUrl}${data?.image}`}
              : images.userDummy
          }
        />
        <View style={styles.textContainer}>
          <BoldText
            color={selected ? Colors.buttonBg : Colors.themeText}
            fontSize={responsiveFontSize(2.1)}
            fontWeight="700"
            title={data?.categoryName || 'Unnamed Category'}
          />
          {/* If you have a description or item count, it would go here */}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: responsiveHeight(1.5),
    borderWidth: 2,
    padding: responsiveHeight(1.5),
    marginBottom: responsiveHeight(1.5),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsiveWidth(3),
  },
  image: {
    height: responsiveHeight(8),
    width: responsiveWidth(16),
    borderRadius: responsiveHeight(1),
    backgroundColor: '#F5F5F5',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default memo(CategoryCard);
