import { View, Text } from 'react-native';
import React from 'react';
import { BoldText, NormalText } from './Titles';
import { Colors } from '../assets/colors';
import { responsiveFontSize, responsiveHeight } from '../assets/responsive_dimensions';

interface ContainerProps {
  title: string,
  subTitle: string,
}
const TitleContainer: React.FC<ContainerProps> = ({ title, subTitle }) => {
  return (
    <View style={{ gap: responsiveHeight(0.5) }}>
      <BoldText fontSize={responsiveFontSize(2)} fontWeight="700" color={Colors.black} title={title} />
      <NormalText fontSize={responsiveFontSize(1.9)} fontWeight="600" color="#9B9EA9" title={subTitle} />
    </View>
  );
};

export default TitleContainer;
