import * as React from 'react';
import { View } from 'react-native';
import { SvgFromXml } from 'react-native-svg';

interface svgprops {
  width: number,
  height: number,
  xml: string,
  color?: string,
  align?: 'flex-start' | 'center' | 'flex-end';
}

export default ({ width, height, xml, color, align }: svgprops) => (
  <View style={{ alignItems: align }}>
    <SvgFromXml color={color} width={width} height={height} xml={xml} />
  </View>
);
